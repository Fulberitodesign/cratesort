/* ---------- Mise à jour en un clic sur Mac ----------
   L'app n'est pas signée par Apple : Squirrel.Mac (electron-updater) refuse de l'installer.
   On fait donc le travail nous-mêmes :
   1. télécharger le .dmg (par l'app : pas d'attribut de quarantaine, pas de « Ouvrir quand même ») ;
   2. le monter, copier CrateSort.app à côté de l'app installée (.CrateSort.maj.app), le démonter ;
   3. vérifier la nouvelle app (signature ad hoc + numéro de version) avant de toucher à l'ancienne ;
   4. un petit script détaché attend la fermeture de CrateSort, échange les deux apps
      (retour à l'ancienne en cas d'échec) puis rouvre CrateSort.
   Ce module n'utilise pas Electron : il est testé tel quel sur un Mac par GitHub Actions. */
const { execFile, spawn } = require('child_process');
const fs = require('fs'), fsp = fs.promises, path = require('path'), os = require('os');

function run(cmd, args, timeout = 180000) {
  return new Promise((res, rej) => execFile(cmd, args, { timeout, maxBuffer: 8 << 20 }, (e, out, err) =>
    e ? rej(Object.assign(new Error(`${path.basename(cmd)} : ${String(err || e.message).trim().slice(0, 300)}`), { code: 'CMD' })) : res(String(out))));
}

/* /Applications/CrateSort.app/Contents/MacOS/CrateSort → /Applications/CrateSort.app */
function bundleOf(exe) {
  const b = path.resolve(exe, '..', '..', '..');
  return b.endsWith('.app') ? b : null;
}

/* Peut-on remplacer l'app là où elle est ? */
async function checkLocation(bundle) {
  if (!bundle) return { ok: false, reason: 'dev' };
  if (bundle.startsWith('/Volumes/')) return { ok: false, reason: 'dmg' };     // lancée depuis le .dmg
  if (/\/AppTranslocation\//.test(bundle)) return { ok: false, reason: 'translocation' }; // pas encore déplacée dans Applications
  try { await fsp.access(path.dirname(bundle), fs.constants.W_OK); } catch (e) { return { ok: false, reason: 'readonly' }; }
  return { ok: true };
}

/* Téléchargement avec progression ; fetchImpl = net.fetch d'Electron ou fetch de Node */
async function download(url, dest, size, onProgress, fetchImpl = fetch) {
  await fsp.mkdir(path.dirname(dest), { recursive: true });
  const r = await fetchImpl(url, { headers: { 'User-Agent': 'CrateSort' } });
  if (!r.ok || !r.body) throw new Error('Téléchargement impossible (HTTP ' + r.status + ')');
  const total = size || Number(r.headers.get('content-length')) || 0, tmp = dest + '.part';
  const out = fs.createWriteStream(tmp); let got = 0, last = -1;
  const reader = r.body.getReader();
  try {
    for (;;) {
      const { done, value } = await reader.read(); if (done) break;
      got += value.length;
      if (!out.write(Buffer.from(value))) await new Promise(ok => out.once('drain', ok));
      const pc = total ? Math.floor(got * 100 / total) : 0; if (pc !== last) { last = pc; onProgress && onProgress(pc); }
    }
  } finally { await new Promise(ok => out.end(ok)); }
  if (size && got !== size) { await fsp.rm(tmp, { force: true }); throw new Error(`Téléchargement incomplet (${got} octets sur ${size})`); }
  await fsp.rename(tmp, dest);
  return dest;
}

/* Monte le .dmg, copie la nouvelle app à côté de l'ancienne, vérifie-la */
async function prepare({ dmg, bundle, version }) {
  const parent = path.dirname(bundle), newApp = path.join(parent, '.CrateSort.maj.app');
  const mount = await fsp.mkdtemp(path.join(os.tmpdir(), 'cratesort-dmg-'));
  await run('/usr/bin/hdiutil', ['attach', '-nobrowse', '-readonly', '-noautoopen', '-noverify', '-mountpoint', mount, dmg]);
  try {
    const app = (await fsp.readdir(mount)).find(n => n.endsWith('.app') && !n.startsWith('.'));
    if (!app) throw new Error('CrateSort.app introuvable dans le .dmg');
    await fsp.rm(newApp, { recursive: true, force: true });
    await run('/usr/bin/ditto', [path.join(mount, app), newApp]);
  } finally {
    try { await run('/usr/bin/hdiutil', ['detach', mount, '-quiet']); }
    catch (e) { await run('/usr/bin/hdiutil', ['detach', mount, '-force', '-quiet']).catch(() => {}); }
    await fsp.rmdir(mount).catch(() => {});
  }
  try {
    await run('/usr/bin/codesign', ['--verify', '--deep', '--strict', newApp]);
    const v = (await run('/usr/bin/plutil', ['-extract', 'CFBundleShortVersionString', 'raw', '-o', '-', path.join(newApp, 'Contents', 'Info.plist')])).trim();
    if (version && v !== version) throw new Error(`version ${v} au lieu de ${version}`);
  } catch (e) {
    await fsp.rm(newApp, { recursive: true, force: true });
    throw new Error('La nouvelle version ne passe pas la vérification : ' + e.message);
  }
  await run('/usr/bin/xattr', ['-dr', 'com.apple.quarantine', newApp]).catch(() => {});
  return newApp;
}

/* Script d'échange, lancé détaché : il survit à la fermeture de CrateSort */
const SWAP = `#!/bin/bash
PID="$1"; OLD="$2"; NEW="$3"; BAK="$4"; OPEN="$5"; LOG="$6"
exec >>"$LOG" 2>&1
echo "$(date) mise à jour : attente de la fermeture de CrateSort ($PID)"
for i in $(seq 1 240); do kill -0 "$PID" 2>/dev/null || break; sleep 0.25; done
rm -rf "$BAK"
if mv "$OLD" "$BAK"; then
  if mv "$NEW" "$OLD"; then rm -rf "$BAK"; echo "nouvelle version en place"
  else mv "$BAK" "$OLD"; echo "échec : ancienne version remise"; fi
else echo "échec : impossible de déplacer l'ancienne version"; rm -rf "$NEW"; fi
xattr -dr com.apple.quarantine "$OLD" 2>/dev/null
[ "$OPEN" = "open" ] && open "$OLD"
exit 0
`;
async function launchSwap({ pid, bundle, newApp, reopen = true }) {
  const dir = await fsp.mkdtemp(path.join(os.tmpdir(), 'cratesort-maj-')), script = path.join(dir, 'echange.sh');
  await fsp.writeFile(script, SWAP, { mode: 0o755 });
  const bak = path.join(path.dirname(bundle), '.CrateSort.ancienne.app');
  const log = path.join(os.homedir(), 'Library', 'Logs', 'CrateSort-mise-a-jour.log');
  await fsp.mkdir(path.dirname(log), { recursive: true }).catch(() => {});
  const ch = spawn('/bin/bash', [script, String(pid), bundle, newApp, bak, reopen ? 'open' : 'no', log], { detached: true, stdio: 'ignore' });
  ch.unref();
  return { script, log };
}

module.exports = { bundleOf, checkLocation, download, prepare, launchSwap, run };
