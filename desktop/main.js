const {app,BrowserWindow,Menu,session,shell,dialog,ipcMain,net}=require('electron');
const path=require('path'),fs=require('fs'),fsp=fs.promises,{pathToFileURL}=require('url');

/* ---------- Accès disque natif ----------
   Le moteur web masque certains noms (? " * | < > : …). L'application lit donc le disque directement,
   uniquement à l'intérieur des dossiers que l'utilisateur a choisis. */
let roots=[];
const rootsFile=()=>path.join(app.getPath('userData'),'dossiers.json');
function loadRoots(){try{roots=JSON.parse(fs.readFileSync(rootsFile(),'utf8')).filter(x=>typeof x==='string')}catch{roots=[]}}
function saveRoots(){try{fs.writeFileSync(rootsFile(),JSON.stringify(roots))}catch{}}
const err=(code,msg)=>Object.assign(new Error(msg||code),{code});
function inside(p){
  const r=path.resolve(p);
  return roots.some(x=>r===x||r.startsWith(x.endsWith(path.sep)?x:x+path.sep));
}
function dirOk(d){if(typeof d!=='string'||!inside(d))throw err('EACCES','Dossier non autorisé');return path.resolve(d)}
function child(d,n){
  if(typeof n!=='string'||!n||n==='.'||n==='..'||n.includes('/')||n.includes('\0')||(path.sep==='\\'&&n.includes('\\')))throw err('EINVAL','Nom invalide');
  return path.join(dirOk(d),n);
}
const sameFile=(a,b)=>a.dev===b.dev&&a.ino===b.ino;
const H={
  async pick(k){
    const r=await dialog.showOpenDialog(win,{
      title:k==='inbox'?'Dossier des nouveaux téléchargements':'Racine de votre bibliothèque musicale',
      buttonLabel:'Choisir',properties:['openDirectory','createDirectory'],
      defaultPath:app.getPath(k==='inbox'?'downloads':'music')});
    if(r.canceled||!r.filePaths[0])return null;
    const p=path.resolve(r.filePaths[0]);
    if(!roots.includes(p)){roots.push(p);saveRoots()}
    return{p,name:path.basename(p)||p};
  },
  async restore(p){
    const r=path.resolve(String(p));
    if(!roots.includes(r))throw err('EACCES');
    if(!(await fsp.stat(r)).isDirectory())throw err('ENOTDIR');
    return{ok:true};
  },
  async list(d){
    d=dirOk(d);
    const out=[];
    for(const e of await fsp.readdir(d,{withFileTypes:true})){
      let isDir=e.isDirectory(),isFile=e.isFile();
      if(e.isSymbolicLink()){try{const st=await fsp.stat(path.join(d,e.name));isDir=st.isDirectory();isFile=st.isFile()}catch{continue}}
      if(isDir||isFile)out.push({n:e.name,d:isDir,p:isDir?path.join(d,e.name):undefined});
    }
    return out;
  },
  async stat(d,n){const st=await fsp.stat(child(d,n));return{size:st.size,mtime:Math.floor(st.mtimeMs),dir:st.isDirectory()}},
  async read(d,n,a,b){
    const fh=await fsp.open(child(d,n),'r');
    try{
      const len=Math.max(0,Math.min(Number(b)-Number(a),(await fh.stat()).size-Number(a)));
      const buf=Buffer.alloc(len);let off=0;
      while(off<len){const {bytesRead}=await fh.read(buf,off,len-off,Number(a)+off);if(!bytesRead)break;off+=bytesRead}
      return buf.subarray(0,off);
    }finally{await fh.close()}
  },
  async touch(d,n){const fh=await fsp.open(child(d,n),'wx');await fh.close();return{ok:true}},
  async mkdir(d,n){const p=child(d,n);await fsp.mkdir(p,{recursive:true});return{p}},
  async dirpath(d,n){const p=child(d,n);if(!(await fsp.stat(p)).isDirectory())throw err('ENOTDIR');return{p}},
  async move(sd,n,dd,nn){
    const src=child(sd,n),dst=child(dd,nn);
    const s=await fsp.stat(src);
    try{const t=await fsp.stat(dst);if(!sameFile(s,t))throw err('EEXIST','Le fichier existe déjà')}catch(e){if(e.code!=='ENOENT')throw e}
    try{await fsp.rename(src,dst)}
    catch(e){
      if(e.code!=='EXDEV')throw e;
      await fsp.copyFile(src,dst,fs.constants.COPYFILE_EXCL);
      const c=await fsp.stat(dst);
      if(c.size!==s.size){await fsp.unlink(dst).catch(()=>{});throw err('EIO','Copie incomplète')}
      await fsp.utimes(dst,s.atime,s.mtime).catch(()=>{});
      await fsp.unlink(src);
    }
    return{ok:true};
  },
  async remove(d,n){const p=child(d,n);const st=await fsp.lstat(p);if(st.isDirectory())await fsp.rmdir(p);else await fsp.unlink(p);return{ok:true}},
  async url(d,n){return pathToFileURL(child(d,n)).href}
};
/* ---------- Mises à jour ----------
   Windows : téléchargement en arrière-plan puis installation au redémarrage (electron-updater).
   Mac : l'app n'étant pas signée par Apple, elle ne peut pas se remplacer seule ;
   on signale la nouvelle version et on propose de télécharger le .dmg. */
const REPO='Fulberitodesign/cratesort';
const UPD={state:'idle',version:null,percent:0,manual:false};
const sendUpd=()=>{if(win&&!win.isDestroyed())win.webContents.send('upd:status',{...UPD})};
const setUpd=o=>{Object.assign(UPD,o);sendUpd()};
const newer=(a,b)=>{const x=String(a).replace(/^v/,'').split('.').map(Number),y=String(b).replace(/^v/,'').split('.').map(Number);
  for(let i=0;i<3;i++){if((x[i]||0)!==(y[i]||0))return (x[i]||0)>(y[i]||0)}return false};
let updater=null;
function winUpdater(){
  if(updater)return updater;
  const {autoUpdater}=require('electron-updater');
  autoUpdater.autoDownload=true;autoUpdater.autoInstallOnAppQuit=true;
  autoUpdater.on('update-available',i=>setUpd({state:'downloading',version:i.version,percent:0}));
  autoUpdater.on('download-progress',p=>setUpd({state:'downloading',percent:Math.round(p.percent||0)}));
  autoUpdater.on('update-downloaded',i=>setUpd({state:'ready',version:i.version,percent:100}));
  autoUpdater.on('update-not-available',()=>setUpd({state:'none'}));
  autoUpdater.on('error',e=>setUpd({state:'error',error:String(e&&e.message||e).slice(0,200)}));
  return updater=autoUpdater;
}
async function checkUpdates(manual){
  if(!app.isPackaged){setUpd({state:'dev',manual:!!manual});return{...UPD}}
  if(['checking','downloading','ready'].includes(UPD.state))return{...UPD};
  setUpd({state:'checking',manual:!!manual,error:null});
  try{
    if(process.platform==='win32'){await winUpdater().checkForUpdates();return{...UPD}}
    const r=await net.fetch(`https://api.github.com/repos/${REPO}/releases/latest`,{headers:{Accept:'application/vnd.github+json','User-Agent':'CrateSort'}});
    if(!r.ok)throw new Error('HTTP '+r.status);
    const rel=await r.json();
    if(rel.tag_name&&newer(rel.tag_name,app.getVersion()))setUpd({state:'available',version:String(rel.tag_name).replace(/^v/,'')});
    else setUpd({state:'none'});
  }catch(e){setUpd({state:'error',error:String(e&&e.message||e).slice(0,200)})}
  return{...UPD};
}
Object.assign(H,{
  async appInfo(){return{version:app.getVersion(),platform:process.platform,packaged:app.isPackaged}},
  async updCheck(manual){return checkUpdates(manual)},
  async updState(){return{...UPD}},
  async updInstall(){
    if(UPD.state==='ready'&&updater){setImmediate(()=>updater.quitAndInstall(true,true));return{ok:true}}
    if(UPD.state==='available'){await shell.openExternal(`https://github.com/${REPO}/releases/latest/download/CrateSort-Mac.dmg`);return{ok:true}}
    return{ok:false};
  }
});
for(const [k,fn] of Object.entries(H))ipcMain.handle('fs:'+k,async(e,...a)=>{
  if(!e.senderFrame||!e.senderFrame.url.startsWith('file:'))return{err:{code:'EACCES',msg:'origine refusée'}};
  try{return await fn(...a)}catch(x){return{err:{code:x.code||'EUNKNOWN',msg:String(x.message||x)}}}
});

let win;
function createWindow(){
  win=new BrowserWindow({
    width:1440,height:900,minWidth:980,minHeight:640,show:false,
    title:'CrateSort',backgroundColor:'#0b0c0f',
    webPreferences:{contextIsolation:true,nodeIntegration:false,sandbox:true,preload:path.join(__dirname,'preload.js')}
  });
  win.once('ready-to-show',()=>win.show()); // la fenêtre apparaît une fois le thème choisi appliqué (pas de flash)
  win.loadFile(path.join(__dirname,'CrateSort.html'));
  win.webContents.setWindowOpenHandler(({url})=>{shell.openExternal(url);return{action:'deny'}});
  win.webContents.on('will-navigate',(e,url)=>{if(!url.startsWith('file:')){e.preventDefault();shell.openExternal(url)}});
}

/* Menu sans les raccourcis ⌘Z / ⌘A, que CrateSort utilise pour annuler et tout sélectionner */
const menu=Menu.buildFromTemplate([
  {label:'CrateSort',submenu:[
    {role:'about',label:'À propos de CrateSort'},{type:'separator'},
    {role:'hide',label:'Masquer CrateSort'},{role:'hideOthers',label:'Masquer les autres'},{role:'unhide',label:'Tout afficher'},
    {type:'separator'},{role:'quit',label:'Quitter CrateSort'}]},
  {label:'Édition',submenu:[{role:'cut',label:'Couper'},{role:'copy',label:'Copier'},{role:'paste',label:'Coller'}]},
  {label:'Présentation',submenu:[
    {role:'reload',label:'Recharger'},{role:'togglefullscreen',label:'Plein écran'},
    {type:'separator'},{role:'zoomIn',label:'Zoom avant'},{role:'zoomOut',label:'Zoom arrière'},{role:'resetZoom',label:'Taille réelle'}]},
  {role:'windowMenu',label:'Fenêtre'}
]);

app.whenReady().then(()=>{
  loadRoots();
  Menu.setApplicationMenu(process.platform==='darwin'?menu:null); // Windows : copier/coller fonctionnent sans menu
  app.setAboutPanelOptions({applicationName:'CrateSort',applicationVersion:app.getVersion(),credits:'Rangement de morceaux pour DJ'});
  // Garde l'accès aux dossiers déjà choisis d'un lancement à l'autre (application locale uniquement)
  const local=o=>!o||o.startsWith('file:');
  session.defaultSession.setPermissionCheckHandler((wc,perm,origin)=>perm!=='fileSystem'||local(origin));
  session.defaultSession.setPermissionRequestHandler((wc,perm,cb)=>cb(perm!=='fileSystem'||local(wc.getURL())));
  // Dossiers sensibles (dossier personnel entier, Bibliothèque…) : on demande confirmation
  session.defaultSession.on('file-system-access-restricted',async(e,details,callback)=>{
    const {response}=await dialog.showMessageBox(win,{
      type:'warning',buttons:['Choisir un autre dossier','Autoriser quand même'],defaultId:0,cancelId:0,
      message:'Ce dossier est protégé par le système',
      detail:`${details.path}\n\nChoisissez plutôt le dossier précis qui contient vos morceaux (par exemple Téléchargements ou votre disque DJ).`
    });
    callback(response===1?'allow':'tryAgain');
  });
  createWindow();
});
app.on('activate',()=>{if(!BrowserWindow.getAllWindows().length)createWindow()});
app.on('window-all-closed',()=>app.quit());
