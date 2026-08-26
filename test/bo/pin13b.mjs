import { moTrinhDuyet, DIA_CHI, GOC, require } from '../chung.mjs';
const B = DIA_CHI;
const b = await moTrinhDuyet();
let ok=0, ng=0;
/* ĐỢT 18: ô mã nào cũng CHỈ tự chấm khi mỗi nhịp dài thêm đúng một ký tự —
   `fill()` nhét cả cụm một phát, đúng hình dạng cú TỰ ĐIỀN của trình duyệt,
   nên không còn tính là gõ. Chỗ nào cần "gõ như người thật" thì gõ tuần tự. */
const goTay = async (p, sel, txt) => {
  await p.locator(sel).fill('');
  await p.locator(sel).focus();
  await p.locator(sel).pressSequentially(txt, { delay: 55 });
};
const T=(n,c,note='')=>{ if(c){ok++;console.log('  ✓ '+n);} else {ng++;console.log('  ✗ '+n+(note?'  → '+note:''));} };

/* ── ① Ô PIN ngoài bản đồ (chế độ hack) ─────────────────────── */
{
console.log('\n① Ô PIN bản đồ');
const ctx=await b.newContext({viewport:{width:420,height:900}}); const p=await ctx.newPage();
const errs=[]; p.on('pageerror',e=>errs.push(e.message));
await p.goto(B+'/?stay=1',{waitUntil:'load'}); await p.waitForTimeout(1500);
await p.evaluate(()=>openPin('map'));
await p.waitForTimeout(300);
T('mở được ô PIN', await p.locator('#pinDash span').count()===4);
await p.locator('#pinIn').fill('19'); await p.waitForTimeout(60);
let d=await p.evaluate(()=>[...document.querySelectorAll('#pinDash span')].map(x=>x.textContent));
T('ký tự vừa gõ hiện rõ', d[0]==='•'&&d[1]==='9', JSON.stringify(d));
await p.waitForTimeout(1000);
d=await p.evaluate(()=>[...document.querySelectorAll('#pinDash span')].map(x=>x.textContent));
T('800ms sau che hết', d[0]==='•'&&d[1]==='•', JSON.stringify(d));
await goTay(p, '#pinIn', '1959'); await p.waitForTimeout(200);
T('gõ số cuối: hiện rõ, CHƯA chấm vội', await p.evaluate(()=>document.getElementById('pinw').classList.contains('on')));
await p.waitForTimeout(1600);
T('hết nhịp hiện chữ là TỰ CHẤM', !(await p.evaluate(()=>document.getElementById('pinw').classList.contains('on'))));
console.log('  lỗi trang:', errs.length?errs:'không');
await ctx.close();
}

/* ── ② Zoey's Castle (han/961030-a) ─────────────────────────── */
{
console.log("\n② Cửa mã Zoey's Castle");
const ctx=await b.newContext({viewport:{width:420,height:900}}); const p=await ctx.newPage();
const errs=[]; p.on('pageerror',e=>errs.push(e.message));
await p.goto(B+'/han/961030-a/',{waitUntil:'load'});
await p.evaluate(()=>{ const s=JSON.parse(localStorage.getItem('mapv1')||'{}');
  s.eggWin=true; s.eggDone=true; s.winParty=true; localStorage.setItem('mapv1',JSON.stringify(s)); });
await p.reload({waitUntil:'load'}); await p.waitForTimeout(900);
const coCua = await p.locator('#cells').count()>0;
console.log('  (màn hiện tại:', await p.evaluate(()=>document.querySelector('.q-lab')?.textContent||'—'),')');
if(coCua){
  await p.locator('#inp').fill('RA'); await p.waitForTimeout(60);
  let c=await p.evaluate(()=>[...document.querySelectorAll('#cells .cell')].map(x=>x.textContent));
  T('ký tự vừa gõ hiện rõ, ô trước che', c[0]==='•'&&c[1]==='A', JSON.stringify(c.slice(0,4)));
  await p.waitForTimeout(1000);
  c=await p.evaluate(()=>[...document.querySelectorAll('#cells .cell')].map(x=>x.textContent));
  T('800ms sau che hết', c[0]==='•'&&c[1]==='•', JSON.stringify(c.slice(0,4)));
} else console.log('  (chưa vào được cửa mã — bỏ qua)');
console.log('  lỗi trang:', errs.length?errs:'không');
await ctx.close();
}

/* ── ③ Secret Chamber (han/961030-b) ────────────────────────── */
{
console.log('\n③ Cửa mã Secret Chamber');
const ctx=await b.newContext({viewport:{width:420,height:900}}); const p=await ctx.newPage();
const errs=[]; p.on('pageerror',e=>errs.push(e.message));
await p.goto(B+'/han/961030-b/',{waitUntil:'load'}); await p.waitForTimeout(900);
T('luôn dựng cửa mã', await p.locator('#cells .cell').count()>0);
await p.locator('#inp').fill('12'); await p.waitForTimeout(60);
let c=await p.evaluate(()=>[...document.querySelectorAll('#cells .cell')].map(x=>x.textContent));
T('ký tự vừa gõ hiện rõ', c[0]==='•'&&c[1]==='2', JSON.stringify(c));
await p.waitForTimeout(1000);
c=await p.evaluate(()=>[...document.querySelectorAll('#cells .cell')].map(x=>x.textContent));
T('800ms sau che hết', c.slice(0,2).every(x=>x==='•'), JSON.stringify(c));
const n=await p.locator('#cells .cell').count();
await goTay(p, '#inp', '9'.repeat(n)); await p.waitForTimeout(200);
T('gõ số cuối: CHƯA chấm vội', (await p.locator('#msg').textContent()||'')==='' , 'msg='+await p.locator('#msg').textContent());
await p.waitForTimeout(1400);
T('hết nhịp hiện chữ là TỰ CHẤM (báo sai)', (await p.locator('#msg').textContent()||'').length>0);
console.log('  lỗi trang:', errs.length?errs:'không');
await ctx.close();
}

console.log('\nTỔNG: '+ok+' đạt / '+ng+' hỏng');
await b.close(); process.exit(ng?1:0);
