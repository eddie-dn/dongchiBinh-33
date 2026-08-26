import { moTrinhDuyet, DIA_CHI, GOC, require } from '../chung.mjs';
const B = DIA_CHI;
const b = await moTrinhDuyet();
let ok=0,ng=0; const T=(n,c,note='')=>{ if(c){ok++;console.log('  ✓ '+n);} else {ng++;console.log('  ✗ '+n+(note?'  → '+note:''));} };

console.log("\n② Cửa mã Zoey's Castle (han/961030-a)");
const ctx=await b.newContext({viewport:{width:420,height:900}}); const p=await ctx.newPage();
const errs=[]; p.on('pageerror',e=>errs.push(e.message));
await p.goto(B+'/han/961030-a/',{waitUntil:'load'});
await p.evaluate(()=>{ localStorage.setItem('mtv1', JSON.stringify({eggWin:true})); });
await p.reload({waitUntil:'load'}); await p.waitForTimeout(900);
console.log('  màn:', (await p.evaluate(()=>document.querySelector('.q-lab')?.textContent||'—')).trim());
T('luôn dựng cửa mã (không nhớ aOpen)', await p.locator('#cells .cell').count()>0);
await p.locator('#inp').fill('HO'); await p.waitForTimeout(80);
let c=await p.evaluate(()=>[...document.querySelectorAll('#cells .cell')].map(x=>x.textContent));
T('ký tự vừa gõ hiện rõ, ô trước che', c[0]==='•'&&c[1]==='O', JSON.stringify(c.slice(0,4)));
await p.waitForTimeout(1000);
c=await p.evaluate(()=>[...document.querySelectorAll('#cells .cell')].map(x=>x.textContent));
T('800ms sau che hết', c[0]==='•'&&c[1]==='•', JSON.stringify(c.slice(0,4)));
const n=await p.locator('#cells .cell').count();
await p.locator('#inp').fill('HOCHIMINH'.slice(0,n)); await p.waitForTimeout(500);
T('gõ chữ cuối: CHƯA chấm vội', await p.locator('#cells .cell').count()>0);
await p.waitForTimeout(2200);
T('hết nhịp hiện chữ là TỰ CHẤM, vào bộ câu hỏi', await p.locator('#steps').count()>0 || (await p.locator('#msg').textContent()||'').includes('Đúng'));
// quay lại → vẫn hỏi mã
await p.reload({waitUntil:'load'}); await p.waitForTimeout(900);
T('quay lại VẪN phải nhập mã', await p.locator('#cells .cell').count()>0 && (await p.evaluate(()=>document.querySelector('.q-lab')?.textContent||'')).includes('Cửa vào'),
  'q-lab='+(await p.evaluate(()=>document.querySelector('.q-lab')?.textContent||'')));
console.log('  lỗi trang:', errs.length?errs:'không');
console.log('\nTỔNG: '+ok+' đạt / '+ng+' hỏng');
await b.close(); process.exit(ng?1:0);
