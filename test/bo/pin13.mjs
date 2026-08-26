import { moTrinhDuyet, DIA_CHI, GOC, require } from '../chung.mjs';
const B = DIA_CHI;
const b = await moTrinhDuyet();
const ctx = await b.newContext({ viewport:{width:420,height:900} });
const p = await ctx.newPage();
const errs=[]; p.on('pageerror', e=>errs.push(e.message));
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

/* ── ① SỔ BẢN GHI (assets/lichsu.js) ─────────────────────────── */
console.log('\n① Cửa mã sổ bản ghi — ngoài bản đồ');
await p.goto(B+'/?stay=1', { waitUntil:'load' }); await p.waitForTimeout(1500);
await p.evaluate(()=>{ const k=document.querySelector('.kao'); for(let i=0;i<3;i++) k.click(); });
await p.waitForTimeout(400);
T('mở được hộp mã', await p.locator('.ls-o').count()>0);
await p.locator('#lsIn').fill('09');
await p.waitForTimeout(60);
let cells = await p.evaluate(()=>[...document.querySelectorAll('.ls-o i')].map(x=>x.textContent));
T('ký tự vừa gõ hiện rõ, ô trước đã che', cells[0]==='•' && cells[1]==='9', JSON.stringify(cells));
await p.waitForTimeout(1000);
cells = await p.evaluate(()=>[...document.querySelectorAll('.ls-o i')].map(x=>x.textContent));
T('sau 800ms thì che hết', cells[0]==='•' && cells[1]==='•', JSON.stringify(cells));
await goTay(p, '#lsIn', '0981');
await p.waitForTimeout(200);
T('gõ số cuối: hiện rõ, CHƯA chấm vội', await p.locator('.ls-o').count()>0
  && (await p.evaluate(()=>[...document.querySelectorAll('.ls-o i')].pop().textContent))==='1');
await p.waitForTimeout(1000);
T('hết nhịp hiện chữ là TỰ CHẤM, không cần Enter', await p.locator('.ls-doi').count()>0);
await p.keyboard.press('Escape'); await p.waitForTimeout(400);
await p.evaluate(()=>{ const k=document.querySelector('.kao'); for(let i=0;i<3;i++) k.click(); });
await p.waitForTimeout(400);
T('mở lại vẫn HỎI MÃ (không nhớ phiên)', await p.locator('.ls-o').count()>0,
  'thấy bảng luôn = còn nhớ cờ ls_ok');
await p.keyboard.press('Escape');

/* ── ② Ô PIN ngoài bản đồ ─────────────────────────────────────── */
console.log('\n② Ô PIN hồ sơ ngoài bản đồ');
const co = await p.evaluate(()=>{ const el=document.querySelector('[data-askpin]'); if(!el) return null;
  el.click(); return true; });
if(co){
  await p.waitForTimeout(400);
  T('mở được ô PIN', await p.locator('#pinDash span').count()>0);
  await p.locator('#pinIn').fill('12');
  await p.waitForTimeout(60);
  const d = await p.evaluate(()=>[...document.querySelectorAll('#pinDash span')].map(x=>x.textContent));
  T('PIN: ký tự vừa gõ hiện rõ', d[0]==='•'&&d[1]==='2', JSON.stringify(d));
  await p.waitForTimeout(1000);
  const d2 = await p.evaluate(()=>[...document.querySelectorAll('#pinDash span')].map(x=>x.textContent));
  T('PIN: 800ms sau che hết', d2[0]==='•'&&d2[1]==='•', JSON.stringify(d2));
} else console.log('  (không có hồ sơ khoá nào đang mở — bỏ qua)');

console.log('\nlỗi trang:', errs.length? errs : 'không');
console.log('\nTỔNG: ' + ok + ' đạt / ' + ng + ' hỏng');
await b.close();
process.exit(ng?1:0);
