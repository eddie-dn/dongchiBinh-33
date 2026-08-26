import { moTrinhDuyet, DIA_CHI, GOC, require } from '../chung.mjs';
const OUT='/tmp/claude-0/-home-user-dongchiBinh-33/effa3c89-6850-5252-94d9-d0a4fe0c3750/scratchpad/ux/';
const B = DIA_CHI;
const br = await moTrinhDuyet();
let pass=0, fail=0;
const ok=(t,c,them='')=>{ c?pass++:fail++; console.log((c?'  ✓ ':'  ✗ ')+t+(them?'  → '+them:'')); };
const go = async (p,sel,n)=>{ for(let i=0;i<n;i++){ await p.click(sel,{force:true}); await p.waitForTimeout(85);} };

/* ══════ 6. BỐN CỬA VÀO BẢN GHI ══════ */
console.log('\n⑥ Bốn cửa vào bản ghi — 3 nhịp vào CHỮ');
const CUA = [
  ['/han/961030-a/','#stampzone',5,'.ls-chu','Zoey’s Castle'],
  ['/han/961030-b/','#stampzone',5,'.ls-chu','HongHan’s Secret Chamber'],
  ['/dad/950901-b/','#gStamp',10,'.ls-chu','Easter Egg · Gate 2'],
];
for(const [u,tem,nhip,cua,mongTit] of CUA){
  const ctx = await br.newContext({ viewport:{width:390,height:844} });
  const p = await ctx.newPage(); const errs=[]; p.on('pageerror',e=>errs.push(e.message));
  await p.goto(B+u,{waitUntil:'load'}); await p.waitForTimeout(1800);
  await go(p,tem,nhip); await p.waitForTimeout(300);
  await go(p,cua,3); await p.waitForTimeout(300);
  await p.fill('#lsIn','0981'); await p.press('#lsIn','Enter'); await p.waitForTimeout(500);
  const tit = await p.evaluate(()=>(document.querySelector('.ls-tit')||{}).textContent);
  ok(u+' → '+mongTit, tit===mongTit, tit);
  ok(u+' không lỗi JS', errs.length===0, errs.join(' '));
  await ctx.close();
}
/* Gate 1 — cửa là dòng tiêu đề hộp Phá đảo */
{
  const ctx = await br.newContext({ viewport:{width:390,height:844} });
  const p = await ctx.newPage(); const errs=[]; p.on('pageerror',e=>errs.push(e.message));
  await p.addInitScript(()=>{
    localStorage.setItem('msn1', JSON.stringify({m1:true,m2:true,m3:true,m2doneAt:Date.now(),hints:0}));
    localStorage.setItem('nav1', JSON.stringify({v:2,profiles:[{pid:'test'}],active:0,mapUnlocked:true}));
  });
  await p.goto(B+'/dad/950901-a/',{waitUntil:'load'}); await p.waitForTimeout(1800);
  await p.evaluate(()=>document.querySelector('.msn-seg[data-m="3"]').click()); await p.waitForTimeout(400);
  await go(p,'#msnLab',3); await p.waitForTimeout(300);
  await p.fill('#lsIn','0981'); await p.press('#lsIn','Enter'); await p.waitForTimeout(500);
  const tit = await p.evaluate(()=>(document.querySelector('.ls-tit')||{}).textContent);
  ok('/dad/950901-a/ (tiêu đề hộp) → Hồ sơ Phi đoàn', tit==='Hồ sơ Phi đoàn', tit);
  ok('/dad/950901-a/ không lỗi JS', errs.length===0, errs.join(' '));
  await ctx.close();
}

/* ══════ 7. VÙNG CHẠM NÚT ĐÓNG ══════ */
console.log('\n⑦ Vùng chạm nút đóng (ngưỡng 40px)');
{
  const ctx = await br.newContext({ viewport:{width:390,height:844} });
  const p = await ctx.newPage();
  await p.addInitScript(()=>{
    localStorage.setItem('nav1', JSON.stringify({v:2,profiles:[],active:-1,mapUnlocked:true}));
    localStorage.setItem('mtv1', JSON.stringify({g2Done:true,g2Game:true,eggWin:true}));
  });
  await p.goto(B+'/',{waitUntil:'load'}); await p.waitForTimeout(1800);
  await p.evaluate(()=>{
    for(const id of ['hhw','credw','wipew']){ const n=document.getElementById(id); if(n) n.classList.add('on','show'); }
    if(window.LichSu) LichSu.mo('MAP');
  });
  await p.waitForTimeout(500);
  const d = await p.evaluate(()=>{
    const ra={};
    for(const sel of ['#hhX','.ls-x','.cx-close']){
      const n=document.querySelector(sel); if(!n) continue;
      const r=n.getBoundingClientRect();
      const cs=getComputedStyle(n,'::before');
      const ins=parseFloat(cs.top)||0;   /* inset âm */
      ra[sel]={ nhin:Math.round(r.width)+'×'+Math.round(r.height),
                cham:Math.round(r.width-2*ins)+'×'+Math.round(r.height-2*ins) };
    }
    return ra;
  });
  for(const [sel,v] of Object.entries(d)){
    const [w,h]=v.cham.split('×').map(Number);
    ok(sel+' vùng chạm ≥40px', w>=40&&h>=40, 'nhìn '+v.nhin+' · chạm '+v.cham);
  }
  /* Phần bấm THẬT tách sang kt4.mjs: ở đây mọi hộp đang mở chồng lên nhau,
     sổ bản ghi (z-index 99999) phủ kín màn nên cú bấm nào cũng rơi vào nó —
     đo được vùng chạm thì được, nhưng bấm thử thì phải mở riêng từng hộp. */
  await ctx.close();
}

/* ══════ 8. THANH CUỘN BẢN GHI ══════ */
console.log('\n⑧ Thanh cuộn bản ghi');
{
  const ctx = await br.newContext({ viewport:{width:390,height:844} });
  const p = await ctx.newPage();
  await p.goto(B+'/',{waitUntil:'load'}); await p.waitForTimeout(1600);
  await p.evaluate(()=>LichSu.mo('MAP'));
  await p.waitForTimeout(350);
  await p.fill('#lsIn','0981'); await p.press('#lsIn','Enter');
  await p.waitForTimeout(500);
  const doc = async ()=> p.evaluate(()=>{ const n=document.querySelector('.ls-than'); const cs=getComputedStyle(n);
    return { top:n.scrollTop, tren:cs.getPropertyValue('--ls-tren').trim(), duoi:cs.getPropertyValue('--ls-duoi').trim(),
             ngang:n.scrollWidth>n.clientWidth }; });
  let r = await doc();
  ok('đầu bảng: mép trên KHÔNG nhoà, mép dưới nhoà', r.tren==='0px'&&r.duoi!=='0px', JSON.stringify(r));
  await p.evaluate(()=>{ const n=document.querySelector('.ls-than'); n.scrollTop=150; n.dispatchEvent(new Event('scroll')); });
  await p.waitForTimeout(250); r = await doc();
  ok('giữa bảng: nhoà cả hai mép', r.tren!=='0px'&&r.duoi!=='0px', JSON.stringify(r));
  await p.evaluate(()=>{ const n=document.querySelector('.ls-than'); n.scrollTop=n.scrollHeight; n.dispatchEvent(new Event('scroll')); });
  await p.waitForTimeout(250); r = await doc();
  ok('đáy bảng: mép dưới KHÔNG nhoà', r.duoi==='0px', JSON.stringify(r));
  ok('không sinh thanh cuộn ngang', !r.ngang);
  await ctx.close();
}
console.log('\n──────── phần 3: '+pass+' đạt / '+fail+' hỏng');
await br.close();
process.exit(fail?1:0);
