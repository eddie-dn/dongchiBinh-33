import { moTrinhDuyet, DIA_CHI, GOC, require } from '../chung.mjs';
const B = DIA_CHI;
const OUT='/tmp/claude-0/-home-user-dongchiBinh-33/effa3c89-6850-5252-94d9-d0a4fe0c3750/scratchpad/shot14/';
const b = await moTrinhDuyet();
const ctx=await b.newContext({viewport:{width:400,height:860},deviceScaleFactor:2}); const p=await ctx.newPage();
const errs=[]; p.on('pageerror',e=>errs.push(e.message));
let ok=0,ng=0; const T=(n,c,note='')=>{ if(c){ok++;console.log('  ✓ '+n);} else {ng++;console.log('  ✗ '+n+(note?'  → '+note:''));} };
await p.goto(B+'/?stay=1',{waitUntil:'load'}); await p.waitForTimeout(1600);
for(const [ma,ten] of [['MAP','Bản đồ mật thư'],['EGG','Easter Egg · Gate 1'],['DAD-A','Hồ sơ Phi đoàn'],
                       ['DAD-B','Easter Egg · Gate 2'],['HAN-A','Zoey’s Castle'],
                       ['HAN-B','HongHan’s Secret Chamber'],['FX','Màn pháo hoa']]){
  await p.evaluate(m=>LichSu.mo(m), ma); await p.waitForTimeout(300);
  await p.fill('#lsIn','0981'); await p.press('#lsIn','Enter'); await p.waitForTimeout(420);
  const co = await p.locator('#lsCre').count();
  if(!co){ T(ma+' có cửa @Credit', false, 'không thấy'); await p.keyboard.press('Escape'); continue; }
  await p.click('#lsCre'); await p.waitForTimeout(350);
  const d = await p.evaluate(()=>({
    tit:document.querySelector('.ls-tit')?.textContent,
    sub:document.querySelector('.ls-sub')?.textContent,
    nhom:document.querySelectorAll('.ls-cnhom').length,
    dong:document.querySelectorAll('.ls-cnhom p').length,
    tien:document.querySelector('.ls-tien')?document.querySelector('.ls-tien .r.tong b').textContent:null,
    lui:!!document.querySelector('#lsLui')
  }));
  T(ma+' → trang Credit · '+d.nhom+' nhóm · '+d.dong+' dòng'+(d.tien?' · tổng '+d.tien:''),
    d.tit==='Credit' && d.sub===ten && d.nhom>=2 && d.lui, JSON.stringify(d));
  if(ma!=='MAP') T('  '+ma+' trỏ về bản ghi Bản đồ mật thư',
    await p.evaluate(()=>document.querySelector('.ls-than').innerHTML.includes('Bản đồ mật thư')));
  else T('  MAP in phần chung ĐẦY ĐỦ (4 nhóm chung)', d.nhom>=6, d.nhom+' nhóm');
  if(ma==='MAP') await p.locator('.ls-hop').screenshot({path:OUT+'credit_map.png'});
  if(ma==='DAD-B') await p.locator('.ls-hop').screenshot({path:OUT+'credit_g2.png'});
  await p.click('#lsLui'); await p.waitForTimeout(250);
  T('  quay lại đúng bản ghi', (await p.evaluate(()=>document.querySelector('.ls-tit')?.textContent))===ten);
  await p.keyboard.press('Escape'); await p.waitForTimeout(200);
}
// soi CHÍNH nội dung 7 trang credit, không soi cả trang bản đồ
const cam = await p.evaluate(async ()=>{
  const xau=['đo đạc','theo dõi','ghi nhận','lưu trữ','tracking','endpoint','Apps Script','beacon'];
  const bs=[]; const ma=['MAP','EGG','DAD-A','DAD-B','HAN-A','HAN-B','FX'];
  const hop=()=>document.querySelector('.ls-hop');
  for(const m of ma){
    LichSu.mo(m);
    await new Promise(r=>setTimeout(r,120));
    const inp=document.getElementById('lsIn'); inp.value='0981';
    inp.dispatchEvent(new Event('input',{bubbles:true}));
    inp.dispatchEvent(new KeyboardEvent('keydown',{key:'Enter',bubbles:true}));
    await new Promise(r=>setTimeout(r,150));
    document.getElementById('lsCre')?.click();
    await new Promise(r=>setTimeout(r,150));
    const html=hop()?hop().innerHTML:'';
    xau.forEach(x=>{ if(html.includes(x)) bs.push(m+':'+x); });
    document.querySelector('.ls-x')?.click();
    await new Promise(r=>setTimeout(r,100));
  }
  return bs;
});
T('7 trang Credit không đả động đo đạc / lưu trữ', cam.length===0, cam.join(', '));
console.log('  lỗi trang:', errs.length?errs:'không');
console.log('\nTỔNG: '+ok+' đạt / '+ng+' hỏng');
await b.close(); process.exit(ng?1:0);
