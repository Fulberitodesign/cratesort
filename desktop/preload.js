const {contextBridge,ipcRenderer}=require('electron');
const call=(c,...a)=>ipcRenderer.invoke('fs:'+c,...a);
contextBridge.exposeInMainWorld('csNative',{
  pick:k=>call('pick',k),restore:p=>call('restore',p),
  list:d=>call('list',d),stat:(d,n)=>call('stat',d,n),read:(d,n,a,b)=>call('read',d,n,a,b),
  touch:(d,n)=>call('touch',d,n),mkdir:(d,n)=>call('mkdir',d,n),dirpath:(d,n)=>call('dirpath',d,n),
  move:(sd,n,dd,nn)=>call('move',sd,n,dd,nn),remove:(d,n)=>call('remove',d,n),url:(d,n)=>call('url',d,n)
});
