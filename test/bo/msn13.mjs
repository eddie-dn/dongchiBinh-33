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
console.log('\n④ Mission 2 · Hồ sơ Phi đoàn');
await p.goto(B+'/dad/950901-a/',{waitUntil:'load'}); await p.waitForTimeout(2500);
const moM2 = async()=>{ for(let k=0;k<4;k++){ await p.click('#msnLine'); await p.waitForTimeout(450);
    if(await p.locator('#msnCells').count()) return true; } return false; };
await moM2();
T('mở được hộp mã Mission 2', await p.locator('#msnCells').count()>0);
await p.locator('#msnIn').fill('JU'); await p.waitForTimeout(80);
let c=await p.evaluate(()=>[...document.querySelectorAll('.msn-cell')].map(x=>x.textContent));
T('ký tự vừa gõ hiện rõ, ô trước che', c[0]==='•'&&c[1]==='U', JSON.stringify(c));
await p.waitForTimeout(1000);
c=await p.evaluate(()=>[...document.querySelectorAll('.msn-cell')].map(x=>x.textContent));
T('800ms sau che hết', c[0]==='•'&&c[1]==='•', JSON.stringify(c));
// gõ đủ 6 ký tự sai → tự chấm sau nhịp hiện chữ
await goTay(p, '#msnIn', 'XXXXXX'); await p.waitForTimeout(200);
const q0 = await p.locator('#msnQ').textContent();
T('gõ ký tự cuối: CHƯA chấm vội', q0.includes('3/3'), 'quota='+q0.trim());
await p.waitForTimeout(1200);
T('hết nhịp hiện chữ là TỰ CHẤM (trừ một lượt)',
  !(await p.locator('#msnQ').textContent()).includes('3/3'),
  'quota='+(await p.locator('#msnQ').textContent()).trim());
// sai 6 lần → mốc gợi ý là TRY_S*2 = 6
for(let i=0;i<7;i++){
  const dis = await p.evaluate(()=>document.getElementById('msnIn')?.disabled);
  if(dis){ await p.evaluate(()=>{ try{ var s=JSON.parse(localStorage.getItem('msn1')||'{}'); s.lockUntil=0; localStorage.setItem('msn1',JSON.stringify(s)); }catch(e){} }); await p.reload({waitUntil:'load'}); await p.waitForTimeout(1800); await moM2(); }
  await goTay(p, '#msnIn', 'XXXXXX');
  await p.waitForTimeout(1400);
}
const hint = await p.locator('.msn-hints').first().textContent().catch(()=>null);
T('hiện gợi ý JUNGLE', !!hint && hint.includes('DOTA2'), 'hint='+hint);
const truoc = ()=> p.evaluate(()=>{
  const h=document.querySelector('.msn-hints'), c=document.getElementById('msnCells');
  if(!h||!c) return {h:!!h,c:!!c,truoc:null};
  const hy=h.getBoundingClientRect().top, cy=c.getBoundingClientRect().top;
  return { truoc: (h.compareDocumentPosition(c)&Node.DOCUMENT_POSITION_FOLLOWING)>0, hy, cy };
});
const order = await truoc();
T('gợi ý nằm TRÊN ô nhập', !!(order && order.truoc && order.hy < order.cy), JSON.stringify(order));
// đóng, mở lại → gợi ý vẫn hiện, và nằm trên
await p.click('.msn-x'); await p.waitForTimeout(400);
await p.evaluate(()=>{ try{ var v=JSON.parse(localStorage.getItem('msn1')||'{}'); v.lockUntil=0; localStorage.setItem('msn1',JSON.stringify(v)); }catch(e){} });
await p.reload({waitUntil:'load'}); await p.waitForTimeout(1800); await moM2(); await p.waitForTimeout(300);
const o2 = await truoc();
o2.txt = await p.evaluate(()=>document.querySelector('.msn-hints')?.textContent||'');
T('mở lại: gợi ý in sẵn, vẫn nằm trên ô nhập', !!(o2 && o2.truoc && o2.hy<o2.cy && o2.txt.includes('DOTA2')), JSON.stringify(o2));
// gõ mã đúng → tự chấm
await goTay(p, '#msnIn', 'JUNGLE'); await p.waitForTimeout(200);
T('gõ ký tự cuối: CHƯA chấm vội', await p.locator('#msnCells').count()>0);
await p.waitForTimeout(2200);
T('hết nhịp hiện chữ là TỰ CHẤM — Mission 2 mở', await p.evaluate(()=>{ try{ return JSON.parse(localStorage.getItem('msn1')||'{}').m2===true; }catch(e){ return null; } }) || !(await p.locator('#msnCells').count()));
console.log('  lỗi trang:', errs.length?errs:'không');
console.log('\nTỔNG: '+ok+' đạt / '+ng+' hỏng');
await b.close(); process.exit(ng?1:0);
