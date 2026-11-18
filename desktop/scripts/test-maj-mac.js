// Test d'une vraie mise à jour sur Mac (lancé par GitHub Actions après la construction du .dmg) :
// une « ancienne » CrateSort est installée dans un dossier temporaire, puis remplacée par le .dmg
// fraîchement construit avec exactement le même code que dans l'app ; on vérifie ensuite que la
// nouvelle version est en place, que sa signature est valide et qu'elle démarre.
const M = require('../macupdate.js'), fs = require('fs'), path = require('path'), os = require('os'), { spawn, execFileSync } = require('child_process');
const dmg = path.resolve(process.argv[2]), version = require('../package.json').version;
const wait = ms => new Promise(r => setTimeout(r, ms));
(async () => {
  const apps = fs.mkdtempSync(path.join(os.tmpdir(), 'Applications-')), bundle = path.join(apps, 'CrateSort.app');
  // 1. « ancienne » version : copie de l'app avec un numéro de version plus petit
  const mnt = fs.mkdtempSync(path.join(os.tmpdir(), 'mnt-'));
  execFileSync('hdiutil', ['attach', '-nobrowse', '-readonly', '-mountpoint', mnt, dmg]);
  execFileSync('ditto', [path.join(mnt, 'CrateSort.app'), bundle]);
  execFileSync('hdiutil', ['detach', mnt]);
  execFileSync('plutil', ['-replace', 'CFBundleShortVersionString', '-string', '0.0.1', path.join(bundle, 'Contents', 'Info.plist')]);
  console.log('ancienne version installée dans', bundle);
  // 2. préparation exactement comme dans l'app
  const newApp = await M.prepare({ dmg, bundle, version });
  console.log('nouvelle version prête :', newApp);
  // 3. échange après la « fermeture » d'un faux processus CrateSort
  const fake = spawn('sleep', ['2']);
  await M.launchSwap({ pid: fake.pid, bundle, newApp, reopen: false });
  const plist = path.join(bundle, 'Contents', 'Info.plist');
  let v = '';
  for (let i = 0; i < 60; i++) { await wait(500); try { v = execFileSync('plutil', ['-extract', 'CFBundleShortVersionString', 'raw', '-o', '-', plist]).toString().trim(); } catch (e) {} if (v === version && !fs.existsSync(newApp)) break; }
  if (v !== version) throw new Error(`version installée ${v}, attendue ${version}`);
  console.log('version installée :', v);
  execFileSync('codesign', ['--verify', '--deep', '--strict', bundle]);
  console.log('signature valide');
  // 4. la nouvelle version démarre
  const out = execFileSync(path.join(bundle, 'Contents', 'MacOS', 'CrateSort'), ['--cratesort-autotest'], { timeout: 60000 }).toString();
  if (!out.includes('CRATESORT_OK ' + version)) throw new Error('autotest : ' + out);
  console.log('la nouvelle version démarre :', out.trim());
  console.log('MISE À JOUR MAC : OK');
})().catch(e => { console.error('ÉCHEC :', e.message); process.exit(1); });
