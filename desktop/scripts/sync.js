// Copie l'outil (../CrateSort.html, la source unique) dans l'application de bureau avant lancement ou build.
const fs=require('fs'),path=require('path');
const src=path.join(__dirname,'..','..','CrateSort.html'),dst=path.join(__dirname,'..','CrateSort.html');
fs.copyFileSync(src,dst);
console.log('CrateSort.html copié dans desktop/');
