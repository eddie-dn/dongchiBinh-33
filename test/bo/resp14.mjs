import { moTrinhDuyet, DIA_CHI, GOC, require } from '../chung.mjs';
const B = DIA_CHI;
const br = await moTrinhDuyet();
let ok=0,ng=0; const T=(n,c,note='')=>{ if(c){ok++;} else {ng++;console.log('  ✗ '+n+(note?'  → '+note:''));} };
const VP=[['SE',320,568],['mini',360,780],['14',390,844],['plus',430,932],['tab',768,1024],['PC',1280,800]];
const TRANG=[['/?stay=1','Bản đồ'],['/dad/950901-a/','Hồ sơ Phi đoàn'],['/dad/950901-b/','Gate 2'],
             ['/han/961030-a/','Zoey'],['/han/961030-b/','Chamber'],['/phao-hoa/','Pháo hoa']];

console.log('\n① TRÀN NGANG — thân trang không được đẻ thanh cuộn ngang');
for(const [u,ten] of TRANG){
  for(const [vn,w,h] of VP){
    const ctx=await br.newContext({viewport:{width:w,height:h}}); const p=await ctx.newPage();
    const errs=[]; p.on('pageerror',e=>errs.push(e.message));
    await p.goto(B+u,{waitUntil:'load'}); await p.waitForTimeout(1500);
    const d=await p.evaluate(()=>({
      tran: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      body: document.body.scrollWidth - document.body.clientWidth }));
    T(ten+'/'+vn+' không tràn ngang', d.tran<=1 && d.body<=1, 'html dư '+d.tran+'px, body dư '+d.body+'px');
    T(ten+'/'+vn+' không lỗi JS', errs.length===0, errs.join(' '));
    await ctx.close();
  }
}

console.log('\n② CỬA MÃ + TRANG CREDIT ở mọi cỡ');
for(const [vn,w,h] of VP){
  const ctx=await br.newContext({viewport:{width:w,height:h}}); const p=await ctx.newPage();
  await p.goto(B+'/?stay=1',{waitUntil:'load'}); await p.waitForTimeout(1500);
  await p.evaluate(()=>LichSu.mo('MAP')); await p.waitForTimeout(300);
  const cua=await p.evaluate(()=>{
    const hop=document.querySelector('.ls-hop'), o=document.querySelector('.ls-o');
    const rh=hop.getBoundingClientRect(), ro=o.getBoundingClientRect();
    const ds=[...o.querySelectorAll('i')].map(x=>x.getBoundingClientRect());
    return { hopTrongMan: rh.left>=-1 && rh.right<=innerWidth+1,
             oTrongHop: ro.left>=rh.left-1 && ro.right<=rh.right+1,
             oMotHang: ds.every(r=>Math.abs(r.top-ds[0].top)<1),
             oCanGiua: Math.abs((ro.left+ro.right)/2 - (rh.left+rh.right)/2) < 2 };
  });
  T('cửa mã/'+vn, cua.hopTrongMan&&cua.oTrongHop&&cua.oMotHang&&cua.oCanGiua, JSON.stringify(cua));
  await p.fill('#lsIn','0981'); await p.press('#lsIn','Enter'); await p.waitForTimeout(400);
  const bang=await p.evaluate(()=>{
    const t=document.querySelector('.ls-than'), d=document.querySelector('.ls-nhom p.d');
    const rd=d.getBoundingClientRect(), rc=document.getElementById('lsCre').getBoundingClientRect();
    return { ngang: t.scrollWidth-t.clientWidth, dCungHang: Math.abs(rc.top-rd.top)<rd.height,
             creTrong: rc.right<=t.getBoundingClientRect().right+1 };
  });
  T('bảng bản ghi/'+vn, bang.ngang<=1 && bang.dCungHang && bang.creTrong, JSON.stringify(bang));
  await p.click('#lsCre'); await p.waitForTimeout(320);
  const cre=await p.evaluate(()=>{
    const t=document.querySelector('.ls-than');
    const rs=[...t.querySelectorAll('.ls-cnhom p, .ls-tien .r')].map(n=>n.getBoundingClientRect());
    const rt=t.getBoundingClientRect();
    return { ngang: t.scrollWidth-t.clientWidth,
             loTrai: rs.filter(r=>r.left<rt.left-1).length,
             loPhai: rs.filter(r=>r.right>rt.right+1).length, n:rs.length };
  });
  T('trang credit/'+vn, cre.ngang<=1 && cre.loTrai===0 && cre.loPhai===0, JSON.stringify(cre));
  await ctx.close();
}

console.log('\n③ VÙNG CHẠM ≥40px ở cỡ nhỏ nhất');
{
  const ctx=await br.newContext({viewport:{width:320,height:568}}); const p=await ctx.newPage();
  await p.goto(B+'/?stay=1',{waitUntil:'load'}); await p.waitForTimeout(1500);
  await p.evaluate(()=>LichSu.mo('MAP')); await p.waitForTimeout(300);
  const d=await p.evaluate(()=>{
    const n=document.querySelector('.ls-x'); const r=n.getBoundingClientRect();
    const ins=parseFloat(getComputedStyle(n,'::before').top)||0;
    return { w:Math.round(r.width-2*ins), h:Math.round(r.height-2*ins) };
  });
  T('nút đóng sổ ≥40px', d.w>=40&&d.h>=40, JSON.stringify(d));
  await ctx.close();
}
console.log('\nTỔNG: '+ok+' đạt / '+ng+' hỏng');
await br.close(); process.exit(ng?1:0);
