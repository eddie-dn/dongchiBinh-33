import { moTrinhDuyet, DIA_CHI, GOC, require } from '../chung.mjs';
const OUT='/tmp/claude-0/-home-user-dongchiBinh-33/effa3c89-6850-5252-94d9-d0a4fe0c3750/scratchpad/ux/';
const B = DIA_CHI;
const br = await moTrinhDuyet();
let pass=0, fail=0;
const ok=(t,c,them='')=>{ c?pass++:fail++; console.log((c?'  ✓ ':'  ✗ ')+t+(them?'  → '+them:'')); };

async function mo(u, init, vp){
  const ctx = await br.newContext({ viewport: vp||{width:390,height:844} });
  const p = await ctx.newPage();
  const errs=[]; p.on('pageerror', e=>errs.push(e.message));
  if(init) await p.addInitScript(init);
  await p.goto(B+u, { waitUntil:'load' });
  await p.waitForTimeout(1800);
  return { ctx, p, errs };
}
const go = async (p,sel,n)=>{ for(let i=0;i<n;i++){ await p.click(sel,{force:true}); await p.waitForTimeout(85);} };

/* ══════ 1. (ĐÃ CHUYỂN SANG kt6.mjs) ══════
   Phần kiểm cửa mã bản ghi từng nằm ở đây, viết theo luật CŨ "im lặng hoàn
   toàn, không gợi ý". Luật đã đổi: sai 3 lần thì cho ĐÚNG MỘT gợi ý
   "Năm sinh Bác Hồ", và thấy rồi thì lần sau hiện sẵn. Bộ kiểm theo luật mới
   nằm trọn ở kt6.mjs mục ①, đầy đủ hơn hẳn — giữ hai bản song song thì kiểu
   gì cũng có ngày chạy nhầm bản cũ rồi tưởng là hỏng. */

/* ══════ 2. GATE 2 — Khối vận hành: không chỉ đường, có trạng thái ══════ */
console.log('\n② GATE 2 — Khối vận hành');
{
  const { ctx, p, errs } = await mo('/dad/950901-b/');
  await go(p,'#gStamp',10);
  await p.waitForTimeout(300);
  const kvh = await p.evaluate(()=>({
    mo:document.getElementById('kvh').classList.contains('on'),
    txt:(document.querySelector('.kvh-txt')||{}).textContent,
    lab:(document.querySelector('.ls-chu')||{}).textContent,
    skip:!!document.getElementById('kvhSkip') }));
  ok('KVH mở bằng 10 nhịp vào tem', kvh.mo);
  ok('KHÔNG còn dòng chỉ đường "Bấm 3 nhịp…"', (kvh.txt||'').indexOf('nhịp')<0, kvh.txt);
  ok('có dòng trạng thái thay thế', /Trạng thái/.test(kvh.txt||''), kvh.txt);
  ok('cửa vào vẫn là chữ "Khối vận hành"', kvh.lab==='Khối vận hành');
  ok('màn cổng có nút Bỏ qua', kvh.skip);
  await go(p,'.ls-chu',3); await p.waitForTimeout(300);
  await p.fill('#lsIn','0981'); await p.press('#lsIn','Enter'); await p.waitForTimeout(500);
  const so = await p.evaluate(()=>({
    tit:(document.querySelector('.ls-tit')||{}).textContent,
    mau:getComputedStyle(document.querySelector('.ls-tit')).color }));
  ok('vào đúng sổ Gate 2', (so.tit||'').indexOf('Gate 2')>=0, so.tit);
  ok('sổ dùng màu xanh lá', so.mau==='rgb(140, 225, 180)', so.mau);
  ok('không lỗi JS', errs.length===0, errs.join(' '));
  await p.screenshot({ path: OUT+'kt-gate2-kvh.png' });
  await ctx.close();
}
console.log('\n──────── tạm kết: '+pass+' đạt / '+fail+' hỏng');
await br.close();
process.exit(fail?1:0);
