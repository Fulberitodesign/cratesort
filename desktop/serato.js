/* ---------- Mise à jour de la bibliothèque Serato ----------
   Format Serato (database V2 et Subcrates/*.crate) : suite d'enregistrements
   [nom 4 caractères][longueur 4 octets gros-boutiste][données]. Les champs « o… » contiennent
   d'autres enregistrements ; les textes (t…, p…) sont en UTF-16 gros-boutiste.
   Serato garde un dossier _Serato_ par disque : celui du disque interne dans ~/Musique,
   celui d'un disque externe à sa racine. Les chemins y sont relatifs à la racine du disque.
   Tout ce qui n'est pas compris est recopié tel quel, octet pour octet. */
const fs = require('fs'), fsp = fs.promises, path = require('path'), os = require('os');
const { execFile } = require('child_process');

const DB_VERSION = '2.0/Serato Scratch LIVE Database';
const CRATE_VERSION = '1.0/Serato ScratchLive Crate';
const BACKUP_DIR = '_Serato_Backup_CrateSort';

/* ----- Lecture / écriture du format binaire ----- */
function records(buf) {
  const out = []; let i = 0;
  while (i + 8 <= buf.length) {
    const tag = buf.toString('latin1', i, i + 4), n = buf.readUInt32BE(i + 4);
    out.push({ tag, data: buf.subarray(i + 8, i + 8 + n) }); i += 8 + n;
  }
  return out;
}
function rec(tag, data) { const h = Buffer.alloc(8); h.write(tag, 0, 'latin1'); h.writeUInt32BE(data.length, 4); return Buffer.concat([h, data]); }
const join = list => Buffer.concat(list.map(r => rec(r.tag, r.data)));
function u16(s) { const b = Buffer.from(String(s), 'utf16le'); for (let i = 0; i + 1 < b.length; i += 2) { const x = b[i]; b[i] = b[i + 1]; b[i + 1] = x; } return b; }
function str(b) { const c = Buffer.from(b); for (let i = 0; i + 1 < c.length; i += 2) { const x = c[i]; c[i] = c[i + 1]; c[i + 1] = x; } return c.toString('utf16le'); }
const u32 = v => { const b = Buffer.alloc(4); b.writeUInt32BE(v >>> 0); return b; };
const byte = v => Buffer.from([v ? 1 : 0]);

/* Un morceau (otrk) : liste de champs ; on lit/remplace le chemin sans toucher au reste */
function trackPath(otrk, field) { const f = records(otrk.data).find(r => r.tag === field); return f ? str(f.data) : null; }
function setTrackPath(otrk, field, p) {
  const fields = records(otrk.data).map(r => r.tag === field ? { tag: field, data: u16(p) } : r);
  return { tag: 'otrk', data: join(fields) };
}

/* ----- Emplacements : quel _Serato_, quel chemin relatif ----- */
function volumeOf(abs) {
  abs = path.resolve(abs);
  const home = process.env.CRATESORT_SERATO_HOME; // pour les tests
  if (process.platform === 'win32') {
    const drive = abs.slice(0, 3); // « E:\ »
    const sys = (process.env.SystemDrive || 'C:').toUpperCase() + '\\';
    const internal = drive.toUpperCase() === sys;
    return { root: drive, internal, serato: internal ? (home || path.join(os.homedir(), 'Music', '_Serato_')) : path.join(drive, '_Serato_') };
  }
  const m = /^\/Volumes\/[^/]+/.exec(abs);
  if (m) return { root: m[0], internal: false, serato: path.join(m[0], '_Serato_') };
  return { root: '/', internal: true, serato: home || path.join(os.homedir(), 'Music', '_Serato_') };
}
function relOf(abs, vol, sep) {
  let r = path.resolve(abs).slice(vol.root.length).replace(/^[\\/]+/, '');
  return sep === '\\' ? r.replace(/\//g, '\\') : r.replace(/\\/g, '/');
}
/* Séparateur utilisé par ce Serato (on suit les morceaux déjà présents) */
function sepOf(db) {
  for (const r of db.recs) if (r.tag === 'otrk') { const p = trackPath(r, 'pfil'); if (p) return p.includes('\\') && !p.includes('/') ? '\\' : '/'; }
  return process.platform === 'win32' ? '\\' : '/';
}

/* ----- Serato est-il ouvert ? ----- */
function seratoRunning() {
  return new Promise(res => {
    if (process.platform === 'win32') {
      execFile('tasklist', ['/fo', 'csv', '/nh'], { timeout: 8000, windowsHide: true }, (e, out) => res(!e && /"Serato DJ[^"]*\.exe"/i.test(out || '')));
    } else if (process.platform === 'darwin') {
      execFile('ps', ['-axco', 'command'], { timeout: 8000 }, (e, out) => res(!e && /^Serato DJ/m.test(out || '')));
    } else res(false);
  });
}

/* ----- Lecture d'un dossier _Serato_ ----- */
async function loadDb(dir) {
  const f = path.join(dir, 'database V2');
  try { const recs = records(await fsp.readFile(f)); return { file: f, recs, exists: true }; }
  catch (e) { if (e.code !== 'ENOENT') throw e; return { file: f, recs: [{ tag: 'vrsn', data: u16(DB_VERSION) }], exists: false }; }
}
async function loadCrates(dir) {
  const sub = path.join(dir, 'Subcrates'), out = new Map();
  let names = []; try { names = await fsp.readdir(sub); } catch (e) { if (e.code !== 'ENOENT') throw e; }
  for (const n of names) if (n.endsWith('.crate') && !n.startsWith('._')) {
    try { out.set(n.slice(0, -6), { file: path.join(sub, n), recs: records(await fsp.readFile(path.join(sub, n))), dirty: false, created: false }); } catch (e) {}
  }
  return out;
}
const segKey = name => name.split('%%').map(s => s.trim().toLowerCase()).join('%%');
function crateHeader(crates) {
  for (const c of crates.values()) { const h = c.recs.filter(r => r.tag !== 'otrk'); if (h.some(r => r.tag === 'vrsn')) return h; }
  const col = (n, w) => ({ tag: 'ovct', data: join([{ tag: 'tvcn', data: u16(n) }, { tag: 'tvcw', data: u16(w) }]) });
  return [{ tag: 'vrsn', data: u16(CRATE_VERSION) }, { tag: 'osrt', data: join([{ tag: 'tvcn', data: u16('#') }, { tag: 'brev', data: byte(0) }]) },
    col('song', '0'), col('artist', '0'), col('bpm', '0'), col('key', '0'), col('album', '0'), col('length', '0'), col('comment', '0')];
}
/* Écriture sûre : fichier temporaire puis renommage */
async function safeWrite(file, buf) {
  await fsp.mkdir(path.dirname(file), { recursive: true });
  const tmp = file + '.cratesort-tmp'; await fsp.writeFile(tmp, buf); await fsp.rename(tmp, file);
}
const stamp = () => { const d = new Date(), p = n => String(n).padStart(2, '0'); return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}_${p(d.getHours())}-${p(d.getMinutes())}-${p(d.getSeconds())}`; };

async function backup(dir, crates) {
  const base = path.join(path.dirname(dir), BACKUP_DIR);
  let dest = path.join(base, stamp());
  for (let k = 2; fs.existsSync(dest); k++) dest = path.join(base, stamp() + '_' + k); // jamais deux mises à jour dans la même sauvegarde
  await fsp.mkdir(path.join(dest, 'Subcrates'), { recursive: true });
  try { await fsp.copyFile(path.join(dir, 'database V2'), path.join(dest, 'database V2')); } catch (e) { if (e.code !== 'ENOENT') throw e; }
  for (const [n, c] of crates) await fsp.copyFile(c.file, path.join(dest, 'Subcrates', n + '.crate'));
  // on garde les 10 dernières sauvegardes
  try { const all = (await fsp.readdir(base)).filter(x => /^\d{4}-/.test(x)).sort(); for (const old of all.slice(0, -10)) await fsp.rm(path.join(base, old), { recursive: true, force: true }); } catch (e) {}
  return dest;
}

const TYPES = { mp3: 'mp3', wav: 'wave', aif: 'aiff', aiff: 'aiff', flac: 'flac', m4a: 'm4a', aac: 'aac', ogg: 'ogg', alac: 'm4a' };
function newTrack(rel, it) {
  const m = it.meta || {}, ext = path.extname(it.dst).slice(1).toLowerCase(), now = Math.floor((it.t || Date.now()) / 1000);
  const f = [{ tag: 'ttyp', data: u16(TYPES[ext] || ext) }, { tag: 'pfil', data: u16(rel) },
    { tag: 'tsng', data: u16(m.title || path.basename(it.dst).replace(/\.[^.]+$/, '')) }];
  if (m.artist) f.push({ tag: 'tart', data: u16(m.artist) });
  if (m.genre) f.push({ tag: 'tgen', data: u16(m.genre) });
  if (m.bpm) f.push({ tag: 'tbpm', data: u16(String(m.bpm)) });
  if (m.key) f.push({ tag: 'tkey', data: u16(m.key) });
  f.push({ tag: 'tadd', data: u16(String(now)) }, { tag: 'uadd', data: u32(now) }, { tag: 'bmis', data: byte(0) });
  return { tag: 'otrk', data: join(f) };
}

/* ----- État avant mise à jour ----- */
async function status(libRoot) {
  const vol = volumeOf(libRoot);
  let exists = false; try { exists = (await fsp.stat(path.join(vol.serato, 'database V2'))).isFile(); } catch (e) {}
  return { running: await seratoRunning(), serato: vol.serato, exists, internal: vol.internal };
}

/* ----- Mise à jour -----
   items : [{ dst: chemin absolu du morceau rangé, src: ancien chemin (facultatif), folder: dossier relatif
              à la bibliothèque (segments séparés par /), meta: {title, artist, genre, bpm, key}, t }]
   mode : 'folders' (crates qui suivent les dossiers) ou 'single' (une seule crate) */
async function sync({ items, mode, single }) {
  if (await seratoRunning()) { const e = new Error('Serato est ouvert : fermez-le, puis relancez la mise à jour.'); e.code = 'SERATO_OPEN'; throw e; }
  const byVol = new Map();
  for (const it of items) {
    try { await fsp.access(it.dst); } catch (e) { continue; } // morceau déplacé ou supprimé depuis
    const v = volumeOf(it.dst); if (!byVol.has(v.serato)) byVol.set(v.serato, { vol: v, items: [] }); byVol.get(v.serato).items.push(it);
  }
  const report = { added: 0, repaired: 0, already: 0, crates: new Set(), cratesCreated: 0, backups: [], missing: items.length - [...byVol.values()].reduce((n, g) => n + g.items.length, 0), serato: [] };
  for (const { vol, items: its } of byVol.values()) {
    const db = await loadDb(vol.serato), crates = await loadCrates(vol.serato), sep = sepOf(db);
    report.backups.push(await backup(vol.serato, crates)); report.serato.push(vol.serato);
    const index = new Map(); db.recs.forEach((r, i) => { if (r.tag === 'otrk') { const p = trackPath(r, 'pfil'); if (p) index.set(p.toLowerCase(), i); } });
    const byKey = new Map([...crates].map(([n, c]) => [segKey(n), n]));
    const header = crateHeader(crates);
    const crateFor = segs => {
      const key = segKey(segs.join('%%'));
      if (byKey.has(key)) return crates.get(byKey.get(key));
      // les crates parentes doivent exister aussi
      for (let k = 1; k < segs.length; k++) crateFor(segs.slice(0, k));
      const name = segs.join('%%');
      const c = { file: path.join(vol.serato, 'Subcrates', name.replace(/[\\/]/g, '-') + '.crate'), recs: header.slice(), dirty: true, created: true };
      crates.set(name, c); byKey.set(key, name); report.cratesCreated++; return c;
    };
    let dbDirty = false;
    for (const it of its) {
      const rel = relOf(it.dst, vol, sep);
      const oldRel = it.src && volumeOf(it.src).serato === vol.serato ? relOf(it.src, vol, sep) : null;
      // 1. la base : réparer le chemin d'un morceau déjà connu, sinon l'ajouter
      if (index.has(rel.toLowerCase())) report.already++;
      else if (oldRel && index.has(oldRel.toLowerCase())) {
        const i = index.get(oldRel.toLowerCase()); db.recs[i] = setTrackPath(db.recs[i], 'pfil', rel);
        index.delete(oldRel.toLowerCase()); index.set(rel.toLowerCase(), i); report.repaired++; dbDirty = true;
        for (const c of crates.values()) c.recs = c.recs.map(r => { if (r.tag !== 'otrk') return r; const p = trackPath(r, 'ptrk'); if (p && p.toLowerCase() === oldRel.toLowerCase()) { c.dirty = true; return setTrackPath(r, 'ptrk', rel); } return r; });
      } else { db.recs.push(newTrack(rel, it)); index.set(rel.toLowerCase(), db.recs.length - 1); report.added++; dbDirty = true; }
      // 2. la crate
      const segs = mode === 'single' ? [single || 'CrateSort'] : String(it.folder || '').split('/').filter(Boolean);
      if (!segs.length) continue; // morceau rangé à la racine de la bibliothèque
      const c = crateFor(segs);
      const has = c.recs.some(r => r.tag === 'otrk' && (trackPath(r, 'ptrk') || '').toLowerCase() === rel.toLowerCase());
      if (!has) { c.recs.push({ tag: 'otrk', data: join([{ tag: 'ptrk', data: u16(rel) }]) }); c.dirty = true; }
      report.crates.add(segs.join(' › '));
    }
    if (dbDirty) await safeWrite(db.file, join(db.recs));
    const created = [];
    for (const c of crates.values()) if (c.dirty) { await safeWrite(c.file, join(c.recs)); if (c.created) created.push(path.basename(c.file)); }
    await fsp.writeFile(path.join(report.backups[report.backups.length - 1], 'cratesort.json'), JSON.stringify({ serato: vol.serato, created, date: new Date().toISOString() }, null, 1));
  }
  return { ...report, crates: [...report.crates] };
}

/* ----- Annuler : on remet la sauvegarde et on retire les crates créées ----- */
async function undo(backups) {
  if (await seratoRunning()) { const e = new Error('Serato est ouvert : fermez-le, puis annulez.'); e.code = 'SERATO_OPEN'; throw e; }
  for (const b of backups || []) {
    const man = JSON.parse(await fsp.readFile(path.join(b, 'cratesort.json'), 'utf8')), dir = man.serato;
    try { await fsp.copyFile(path.join(b, 'database V2'), path.join(dir, 'database V2')); } catch (e) { if (e.code === 'ENOENT') await fsp.rm(path.join(dir, 'database V2'), { force: true }); else throw e; }
    for (const n of await fsp.readdir(path.join(b, 'Subcrates'))) await fsp.copyFile(path.join(b, 'Subcrates', n), path.join(dir, 'Subcrates', n));
    for (const n of man.created || []) await fsp.rm(path.join(dir, 'Subcrates', n), { force: true });
  }
  return { ok: true };
}

/* ---------- Réparer les morceaux introuvables (comme Relink) ----------
   1. on repère, dans chaque _Serato_ concerné, les morceaux dont le fichier n'existe plus ;
   2. on les cherche par nom (puis par taille exacte, champ ufsb) dans les dossiers indiqués ;
   3. on corrige : même disque → nouveau chemin dans la base et les crates ;
      autre disque → le morceau (avec toutes ses infos) passe dans le _Serato_ de ce disque,
      ainsi que ses crates. */
function rootOf(seratoDir) {
  const v = volumeOf(path.join(path.dirname(seratoDir), 'x'));
  return path.resolve(v.serato) === path.resolve(seratoDir) ? v.root : (process.platform === 'win32' ? path.parse(seratoDir).root : '/');
}
const AUDIO = /\.(mp3|wav|aiff?|flac|m4a|aac|ogg|alac|mp4)$/i;
const SKIPDIR = /^(\.|_Serato_|\$RECYCLE\.BIN$|System Volume Information$|node_modules$)/i;
async function indexFolders(dirs, limit = 300000) {
  const byName = new Map(); let n = 0;
  async function walk(d, depth) {
    if (n > limit || depth > 14) return;
    let ents; try { ents = await fsp.readdir(d, { withFileTypes: true }); } catch (e) { return; }
    for (const e of ents) {
      if (SKIPDIR.test(e.name)) continue;
      const p = path.join(d, e.name);
      if (e.isDirectory()) await walk(p, depth + 1);
      else if (e.isFile() && AUDIO.test(e.name)) { n++; const k = e.name.toLowerCase(); if (!byName.has(k)) byName.set(k, []); byName.get(k).push(p); }
    }
  }
  for (const d of [...new Set(dirs.map(x => path.resolve(x)))]) await walk(d, 0);
  return { byName, files: n };
}
function fieldOf(otrk, tag) { const f = records(otrk.data).find(r => r.tag === tag); return f || null; }
async function exists(p) { try { await fsp.access(p); return true; } catch (e) { return false; } }

async function scanMissing({ folders }) {
  const dirs = new Set([volumeOf(path.join(os.homedir(), 'x')).serato]);
  for (const f of folders) dirs.add(volumeOf(f).serato);
  const idx = await indexFolders(folders), plan = [], notFound = [], ambiguous = [];
  let total = 0, checked = 0;
  for (const dir of dirs) {
    if (!(await exists(path.join(dir, 'database V2')))) continue;
    const db = await loadDb(dir), root = rootOf(dir);
    for (let i = 0; i < db.recs.length; i++) {
      const r = db.recs[i]; if (r.tag !== 'otrk') continue;
      const rel = trackPath(r, 'pfil'); if (!rel) continue; checked++;
      if (await exists(path.join(root, rel))) continue;
      total++;
      const name = rel.split(/[\\/]/).pop(), cands = idx.byName.get(name.toLowerCase()) || [];
      let pick = null;
      if (cands.length === 1) pick = cands[0];
      else if (cands.length > 1) {
        const f = fieldOf(r, 'ufsb'), size = f && f.data.length === 4 ? f.data.readUInt32BE(0) : 0, same = [];
        if (size) for (const c of cands) { try { if ((await fsp.stat(c)).size === size) same.push(c); } catch (e) {} }
        if (same.length === 1) pick = same[0]; else { ambiguous.push({ rel, n: cands.length }); continue; }
      }
      if (pick) plan.push({ dir, rel, abs: pick }); else notFound.push(rel);
    }
  }
  return { checked, total, plan, ambiguous, notFound, files: idx.files, seratoDirs: [...dirs] };
}

async function repair(plan) {
  if (await seratoRunning()) { const e = new Error('Serato est ouvert : fermez-le, puis relancez la réparation.'); e.code = 'SERATO_OPEN'; throw e; }
  const cache = new Map();
  const open = async dir => { if (!cache.has(dir)) { const db = await loadDb(dir), crates = await loadCrates(dir); cache.set(dir, { dir, db, crates, sep: sepOf(db), dbDirty: false, created: [], backup: null }); } return cache.get(dir); };
  // tous les _Serato_ touchés sont sauvegardés avant la moindre écriture
  for (const it of plan) { await open(it.dir); await open(volumeOf(it.abs).serato); }
  for (const c of cache.values()) c.backup = await backup(c.dir, c.crates);
  const header = crates => crateHeader(crates);
  let same = 0, moved = 0, already = 0;
  for (const it of plan) {
    const src = cache.get(it.dir), dstVol = volumeOf(it.abs), dst = cache.get(dstVol.serato);
    const i = src.db.recs.findIndex(r => r.tag === 'otrk' && trackPath(r, 'pfil') === it.rel); if (i < 0) continue;
    const newRel = relOf(it.abs, dstVol, dst.sep);
    const fix = r => { let fs2 = records(r.data).map(f => f.tag === 'pfil' ? { tag: 'pfil', data: u16(newRel) } : f.tag === 'bmis' ? { tag: 'bmis', data: byte(0) } : f); return { tag: 'otrk', data: join(fs2) }; };
    const retarget = (crates, oldRel, nr) => { for (const c of crates.values()) c.recs = c.recs.map(r => { if (r.tag !== 'otrk') return r; const p = trackPath(r, 'ptrk'); if (p === oldRel) { c.dirty = true; return setTrackPath(r, 'ptrk', nr); } return r; }); };
    if (dst === src) { src.db.recs[i] = fix(src.db.recs[i]); src.dbDirty = true; retarget(src.crates, it.rel, newRel); same++; continue; }
    // autre disque : le morceau passe dans le _Serato_ de ce disque, avec ses infos
    const known = dst.db.recs.some(r => r.tag === 'otrk' && (trackPath(r, 'pfil') || '').toLowerCase() === newRel.toLowerCase());
    if (!known) { dst.db.recs.push(fix(src.db.recs[i])); dst.dbDirty = true; } else already++;
    src.db.recs.splice(i, 1); src.dbDirty = true;
    for (const [name, c] of src.crates) {
      if (!c.recs.some(r => r.tag === 'otrk' && trackPath(r, 'ptrk') === it.rel)) continue;
      c.recs = c.recs.filter(r => !(r.tag === 'otrk' && trackPath(r, 'ptrk') === it.rel)); c.dirty = true;
      let dc = dst.crates.get(name);
      if (!dc) {
        const segs = name.split('%%');
        for (let k = 1; k <= segs.length; k++) { const n2 = segs.slice(0, k).join('%%'); if (!dst.crates.has(n2)) { dst.crates.set(n2, { file: path.join(dst.dir, 'Subcrates', n2 + '.crate'), recs: header(dst.crates).slice(), dirty: true, created: true }); dst.created.push(n2 + '.crate'); } }
        dc = dst.crates.get(name);
      }
      if (!dc.recs.some(r => r.tag === 'otrk' && trackPath(r, 'ptrk') === newRel)) { dc.recs.push({ tag: 'otrk', data: join([{ tag: 'ptrk', data: u16(newRel) }]) }); dc.dirty = true; }
    }
    moved++;
  }
  for (const c of cache.values()) {
    if (c.dbDirty) await safeWrite(c.db.file, join(c.db.recs));
    for (const k of c.crates.values()) if (k.dirty) await safeWrite(k.file, join(k.recs));
    await fsp.writeFile(path.join(c.backup, 'cratesort.json'), JSON.stringify({ serato: c.dir, created: c.created, date: new Date().toISOString(), action: 'réparation' }, null, 1));
  }
  return { repaired: same + moved, sameDisk: same, otherDisk: moved, already, backups: [...cache.values()].map(c => c.backup) };
}

module.exports = { status, sync, undo, scanMissing, repair, volumeOf, _test: { records, join, u16, str, trackPath, indexFolders } };
