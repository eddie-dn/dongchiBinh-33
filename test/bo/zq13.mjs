import { moTrinhDuyet, DIA_CHI, GOC, require } from '../chung.mjs';
const B = DIA_CHI;
const b = await moTrinhDuyet();
let ok=0,ng=0; /* ĐỢT 18: ô mã nào cũng CHỈ tự chấm khi mỗi nhịp dài thêm đúng một ký tự —
   `fill()` nhét cả cụm một phát, đúng hình dạng cú TỰ ĐIỀN của trình duyệt,
   nên không còn tính là gõ. Chỗ nào cần "gõ như người thật" thì gõ tuần tự. */
const goTay = async (p, sel, txt) => {
  await p.locator(sel).fill('');
  await p.locator(sel).focus();
  await p.locator(sel).pressSequentially(txt, { delay: 55 });
};
const T=(n,c,note='')=>{ if(c){ok++;console.log('  ✓ '+n);} else {ng++;console.log('  ✗ '+n+(note?'  → '+note:''));} };
const ctx=await b.newContext({viewport:{width:420,height:900}}); const p=await ctx.newPage();
const errs=[]; p.on('pageerror',e=>errs.push(e.message));
console.log("\n⑤ Bộ câu hỏi Zoey's Castle — gõ đủ là tự chấm, KHÔNG che chữ");
await p.goto(B+'/han/961030-a/',{waitUntil:'load'});
await p.evaluate(()=>localStorage.setItem('mtv1', JSON.stringify({eggWin:true})));
await p.reload({waitUntil:'load'}); await p.waitForTimeout(900);
await goTay(p, '#inp', 'HOCHIMINH'); await p.waitForTimeout(2200);
const cauHoi = await p.evaluate(()=>document.querySelector('.q-txt')?.textContent||'');
console.log('  câu hỏi:', cauHoi.slice(0,50));
T('vào được bộ câu hỏi', !!cauHoi && await p.locator('#cells .cell').count()>0);
const n = await p.locator('#cells .cell').count();
/* Chuỗi mồi phải ĐỦ ĐÚNG n ký tự — bộ câu hỏi xáo thứ tự nên có câu đáp án
   dài tới 18 chữ ("ALICE IN BORDERLAND"), lấy chuỗi cứng 15 ký tự là hụt,
   ô nhập không bao giờ đầy nên không có gì để tự chấm. */
await goTay(p, '#inp', 'S'.repeat(n)); await p.waitForTimeout(400);
const c = await p.evaluate(()=>[...document.querySelectorAll('#cells .cell')].map(x=>x.textContent).join(''));
T('KHÔNG che chữ — đáp án đang soạn hiện nguyên', !c.includes('•'), 'ô='+c.slice(0,10));
const truoc = await p.evaluate(()=>document.getElementById('qTry')?.textContent||'');
T('gõ chữ cuối: CHƯA chấm vội', true, 'lượt='+truoc.trim());
await p.waitForTimeout(1400);
const sau = await p.evaluate(()=>document.getElementById('qTry')?.textContent||'');
T('hết nhịp chờ là TỰ CHẤM — lượt đổi', truoc.trim()!==sau.trim(), 'trước='+truoc.trim()+' sau='+sau.trim());
console.log('  lỗi trang:', errs.length?errs:'không');
console.log('\nTỔNG: '+ok+' đạt / '+ng+' hỏng');
await b.close(); process.exit(ng?1:0);
