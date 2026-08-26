import { moTrinhDuyet, DIA_CHI, GOC, require } from '../chung.mjs';
const B = DIA_CHI;
const br = await moTrinhDuyet();
let pass=0, fail=0;
const ok=(t,c,them='')=>{ c?pass++:fail++; console.log((c?'  ✓ ':'  ✗ ')+t+(them?'  → '+them:'')); };

console.log('\n⑦b Bấm lệch vào mép ngoài nút đóng (mỗi hộp mở RIÊNG)');
/* ── hộp chào ── */
{
  const ctx = await br.newContext({ viewport:{width:390,height:844} });
  const p = await ctx.newPage();
  await p.addInitScript(()=>{
    localStorage.setItem('nav1', JSON.stringify({v:2,profiles:[],active:-1,mapUnlocked:true}));
    localStorage.setItem('mtv1', JSON.stringify({g2Done:true,g2Game:true,eggWin:true}));
  });
  await p.goto(B+'/',{waitUntil:'load'}); await p.waitForTimeout(1800);
  await p.evaluate(()=>{ const w=document.getElementById('hhw'); w.classList.add('on','show');
    document.getElementById('hhTxt').textContent='thử vùng chạm'; });
  await p.waitForTimeout(400);
  const r = await p.evaluate(()=>{ const n=document.getElementById('hhX'); const b=n.getBoundingClientRect();
    return {l:b.left,t:b.top,w:b.width,h:b.height}; });
  /* điểm nằm NGOÀI vòng tròn 28px nhưng trong vùng ::before */
  const x = r.l - 6, y = r.t + r.h/2;
  const trung = await p.evaluate(([x,y])=>{ const e=document.elementFromPoint(x,y);
    return e ? (e.id||e.className||e.tagName) : null; }, [x,y]);
  ok('điểm lệch 6px trái nút ✕ trỏ đúng vào nút', trung==='hhX', String(trung));
  await p.mouse.click(x,y); await p.waitForTimeout(500);
  ok('bấm ở đó đóng được hộp chào',
     await p.evaluate(()=>!document.getElementById('hhw').classList.contains('show')));
  await ctx.close();
}
/* ── sổ bản ghi ── */
{
  const ctx = await br.newContext({ viewport:{width:390,height:844} });
  const p = await ctx.newPage();
  await p.goto(B+'/',{waitUntil:'load'}); await p.waitForTimeout(1600);
  await p.evaluate(()=>LichSu.mo('MAP'));
  await p.waitForTimeout(350);
  await p.fill('#lsIn','0981'); await p.press('#lsIn','Enter');
  await p.waitForTimeout(500);
  const r = await p.evaluate(()=>{ const n=document.querySelector('.ls-x'); const b=n.getBoundingClientRect();
    return {l:b.left,t:b.top,w:b.width,h:b.height}; });
  const x = r.l - 6, y = r.t + r.h/2;
  const trung = await p.evaluate(([x,y])=>{ const e=document.elementFromPoint(x,y);
    return e ? (e.className||e.tagName) : null; }, [x,y]);
  ok('điểm lệch 6px trái nút ✕ sổ trỏ đúng vào nút', String(trung).indexOf('ls-x')>=0, String(trung));
  await p.mouse.click(x,y); await p.waitForTimeout(400);
  ok('bấm ở đó đóng được sổ', await p.evaluate(()=>!document.querySelector('.ls-nen.on')));
  await ctx.close();
}
/* ── Box Tổng tư lệnh (.cx-close 21×23 — nhỏ nhất bộ) ── */
{
  const ctx = await br.newContext({ viewport:{width:390,height:844} });
  const p = await ctx.newPage();
  await p.addInitScript(()=>{
    localStorage.setItem('nav1', JSON.stringify({v:2,profiles:[],active:-1,mapUnlocked:true}));
    localStorage.setItem('mtv1', JSON.stringify({g2Done:true,g2Game:true,eggWin:true,credFound:true}));
  });
  await p.goto(B+'/',{waitUntil:'load'}); await p.waitForTimeout(1800);
  await p.evaluate(()=>{ const n=document.getElementById('wipew'); n.classList.add('on','show'); });
  await p.waitForTimeout(400);
  const r = await p.evaluate(()=>{ const n=document.querySelector('#wipew .cx-close'); const b=n.getBoundingClientRect();
    return {l:b.left,t:b.top,w:b.width,h:b.height}; });
  const x = r.l - 7, y = r.t + r.h/2;
  const trung = await p.evaluate(([x,y])=>{ const e=document.elementFromPoint(x,y);
    return e ? (e.className||e.id||e.tagName) : null; }, [x,y]);
  ok('điểm lệch 7px trái ✕ Box trỏ đúng vào nút', String(trung).indexOf('cx-close')>=0, String(trung));
  await ctx.close();
}
console.log('\n──────── '+pass+' đạt / '+fail+' hỏng');
await br.close();
process.exit(fail?1:0);
