import { moTrinhDuyet, DIA_CHI, GOC, require } from '../chung.mjs';
const B = DIA_CHI;
const br = await moTrinhDuyet();
let ok=0,ng=0; /* ĐỢT 18: ô mã nào cũng CHỈ tự chấm khi mỗi nhịp dài thêm đúng một ký tự —
   `fill()` nhét cả cụm một phát, đúng hình dạng cú TỰ ĐIỀN của trình duyệt,
   nên không còn tính là gõ. Chỗ nào cần "gõ như người thật" thì gõ tuần tự. */
const goTay = async (p, sel, txt) => {
  await p.locator(sel).fill('');
  await p.locator(sel).focus();
  await p.locator(sel).pressSequentially(txt, { delay: 55 });
};
const T=(n,c,note='')=>{ if(c){ok++;console.log('  ✓ '+n);} else {ng++;console.log('  ✗ '+n+(note?'  → '+note:''));} };
const doc=()=>({ get:()=>JSON.parse(localStorage.getItem('msn1')||'{}') });

async function chayHetLuot(p, which){
  /* Mở đúng cửa Mission rồi gõ sai cho cháy 3 lượt phiên */
  for(let k=0;k<5;k++){ await p.click('#msnLine'); await p.waitForTimeout(430);
    if(await p.locator('#msnCells').count()) break; }
  if(!(await p.locator('#msnCells').count())) return null;
  const len = await p.locator('.msn-cell').count();
  for(let i=0;i<3;i++){
    if(await p.evaluate(()=>document.getElementById('msnIn')?.disabled)) break;
    await goTay(p, '#msnIn', 'X'.repeat(len));
    await p.waitForTimeout(1500);
  }
  return p.evaluate(()=>{
    try{ const v=JSON.parse(localStorage.getItem('msn1')||'{}');
      return v.lockUntil ? Math.round((v.lockUntil - Date.now())/6e4) : null; }catch(e){ return null; }
  });
}

console.log('\n① MISSION 2 — cháy lượt thì nghỉ 15 phút');
{
  const ctx=await br.newContext({viewport:{width:420,height:900}}); const p=await ctx.newPage();
  const errs=[]; p.on('pageerror',e=>errs.push(e.message));
  await p.goto(B+'/dad/950901-a/',{waitUntil:'load'}); await p.waitForTimeout(2500);
  const phut = await chayHetLuot(p, 2);
  T('Mission 2 khoá ~15 phút', phut!==null && phut>=14 && phut<=15, 'đo được '+phut+' phút');
  T('không lỗi JS', errs.length===0, errs.join(' '));
  await ctx.close();
}

console.log('\n② MISSION 3 — cháy lượt thì nghỉ 5 phút');
{
  const ctx=await br.newContext({viewport:{width:420,height:900}}); const p=await ctx.newPage();
  const errs=[]; p.on('pageerror',e=>errs.push(e.message));
  await p.addInitScript(()=>{ localStorage.setItem('msn1', JSON.stringify({
    m1:true, m2:true, m1at:Date.now()-864e5, m2doneAt:Date.now()-864e5, hints:0, form:true })); });
  await p.goto(B+'/dad/950901-a/',{waitUntil:'load'}); await p.waitForTimeout(2500);
  const phut = await chayHetLuot(p, 3);
  T('Mission 3 khoá ~5 phút', phut!==null && phut>=4 && phut<=5, 'đo được '+phut+' phút');
  T('không lỗi JS', errs.length===0, errs.join(' '));
  await ctx.close();
}

console.log('\n③ HAI MỨC PHẢI KHÁC NHAU — không dùng chung một hằng số nữa');
{
  const ctx=await br.newContext({viewport:{width:420,height:900}}); const p=await ctx.newPage();
  await p.goto(B+'/dad/950901-a/',{waitUntil:'load'}); await p.waitForTimeout(1500);
  const src = await (await fetch(B+'/dad/950901-a/index.html')).text();
  T('mã nguồn không còn 30*6e4 cho hạn nghỉ', !/lockUntil[^;]*30\*6e4/.test(src));
  T('có khai NGHI = { 2: 15 phút, 3: 5 phút }', /NGHI\s*=\s*\{\s*2:\s*15\*6e4,\s*3:\s*5\*6e4\s*\}/.test(src));
  await ctx.close();
}
console.log('\nTỔNG: '+ok+' đạt / '+ng+' hỏng');
await br.close(); process.exit(ng?1:0);
