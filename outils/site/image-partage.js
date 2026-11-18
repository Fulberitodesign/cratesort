const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1200,height:630}});
const img='data:image/webp;base64,'+fs.readFileSync('site/assets/img/ranger-800.webp').toString('base64');
const ico='data:image/png;base64,'+fs.readFileSync('site/assets/img/icon-256.png').toString('base64');
await p.setContent(`<html><body style="margin:0;width:1200px;height:630px;background:radial-gradient(700px 400px at 85% 10%,rgba(198,240,75,.22),transparent),#0b0c0f;font-family:Inter,Arial,sans-serif;color:#f1f2f4;overflow:hidden;position:relative">
<div style="position:absolute;left:70px;top:70px;display:flex;align-items:center;gap:16px"><img src="${ico}" style="width:64px;height:64px;border-radius:16px"><b style="font-size:36px">CrateSort</b></div>
<div style="position:absolute;left:70px;top:190px;width:560px;font-size:62px;font-weight:800;line-height:1.08;letter-spacing:-1.5px">Rangez vos nouveaux sons <span style="color:#c6f04b">en un clic.</span></div>
<div style="position:absolute;left:70px;top:470px;font-size:24px;color:#c4c8d0">Le rangement de morceaux pour DJ · Mac et Windows</div>
<img src="${img}" style="position:absolute;left:660px;top:120px;width:640px;border-radius:16px;border:1px solid #30343d;transform:perspective(1200px) rotateY(-14deg) rotateX(4deg);box-shadow:0 30px 80px rgba(0,0,0,.6)">
</body></html>`);await p.waitForTimeout(400);await p.screenshot({path:'site/assets/og.png'});await b.close()})();
