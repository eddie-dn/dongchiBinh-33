import { moTrinhDuyet, DIA_CHI, GOC, require } from '../chung.mjs';
const OUT='/tmp/claude-0/-home-user-dongchiBinh-33/effa3c89-6850-5252-94d9-d0a4fe0c3750/scratchpad/ux/';
const B = DIA_CHI;
/* ⚠ Người chơi dựng ra ở bộ này luôn có `g2Open:true` — tức ĐÃ vào Open World.
   Từ đợt 19, ai chưa vào thì hộp NHẮC OPEN WORLD chiếm lượt hộp đầu tiên trong
   ngày (đứng trên nhánh lời chào, cố ý vậy: "nhắc THAY lời chào"). Không khai
   cờ này thì bộ soi lời chào lại vớ phải hộp nhắc. Luật nhắc có bộ riêng:
   ow19.mjs. */
const br = await moTrinhDuyet();
let pass=0, fail=0;
const ok=(t,c,them='')=>{ c?pass++:fail++; console.log((c?'  ✓ ':'  ✗ ')+t+(them?'  → '+them:'')); };
const XONG = ()=>{
  localStorage.setItem('nav1', JSON.stringify({v:2,profiles:[],active:-1,mapUnlocked:true}));
  localStorage.setItem('mtv1', JSON.stringify({g2Done:true,g2Game:true,g2Open:true,eggWin:true,hhG2:'1',hhHan:'1',hhNgay:'2020-01-01'}));
};
async function mo(u, init, gio, vp){
  const ctx = await br.newContext({ viewport: vp||{width:390,height:844} });
  const p = await ctx.newPage();
  const errs=[]; p.on('pageerror', e=>errs.push(e.message));
  if(gio) await p.clock.install({ time:new Date(gio) });
  if(init) await p.addInitScript(init);
  await p.goto(B+u, { waitUntil:'load' });
  await p.waitForTimeout(300);
  if(gio) await p.clock.runFor(4000);
  await p.waitForTimeout(1500);
  return { ctx, p, errs };
}
const go = async (p,sel,n)=>{ for(let i=0;i<n;i++){ await p.click(sel,{force:true}); await p.waitForTimeout(85);} };

/* ══════ 3. BA KHUNG CHÀO ══════ */
console.log('\n③ HỘP CHÀO — ba khung giờ');
for(const [gio, mong, ten] of [
  ['2026-08-25T06:30:00', true,  '06:30 trong khung sáng'],
  ['2026-08-25T09:00:00', false, '09:00 ngoài khung'],
  ['2026-08-25T11:45:00', true,  '11:45 trong khung trưa'],
  ['2026-08-25T15:00:00', false, '15:00 ngoài khung'],
  ['2026-08-25T18:10:00', true,  '18:10 trong khung tối'],
  ['2026-08-25T21:00:00', false, '21:00 ngoài khung'],
]){
  const { ctx, p, errs } = await mo('/', XONG, gio);
  await p.clock.runFor(6000); await p.waitForTimeout(900);
  const r = await p.evaluate(()=>({
    hien:document.getElementById('hhw').classList.contains('on'),
    lab:(document.getElementById('hhLab')||{}).textContent }));
  const laChao = r.hien && /Greetings|Welcome back/.test(r.lab||'');
  ok(ten+' → '+(mong?'CÓ chào':'KHÔNG chào'), laChao===mong, 'nhãn="'+(r.lab||'—')+'"');
  if(errs.length) ok('  (lỗi JS)', false, errs.join(' '));
  await ctx.close();
}

/* ══════ 4. MỖI KHUNG CHỈ MỘT LẦN / NGÀY ══════ */
console.log('\n④ Mỗi khung tối đa MỘT lần trong ngày');
{
  const { ctx, p, errs } = await mo('/', XONG, '2026-08-25T06:30:00');
  await p.clock.runFor(6000); await p.waitForTimeout(900);
  ok('lần 1 trong khung sáng: có chào', await p.evaluate(()=>document.getElementById('hhw').classList.contains('on')));
  const da = await p.evaluate(()=>JSON.parse(localStorage.getItem('mtv1')).hhKhungDa);
  ok('đã ghi dấu khung "sang"', !!da && da.ds.indexOf('sang')>=0, JSON.stringify(da));
  await ctx.close();
  /* mở lại cùng khung, cùng ngày → không chào nữa */
  const ctx2 = await br.newContext({ viewport:{width:390,height:844} });
  const p2 = await ctx2.newPage();
  await p2.clock.install({ time:new Date('2026-08-25T07:10:00') });
  await p2.addInitScript(([da])=>{
    localStorage.setItem('nav1', JSON.stringify({v:2,profiles:[],active:-1,mapUnlocked:true}));
    localStorage.setItem('mtv1', JSON.stringify({g2Done:true,g2Game:true,g2Open:true,eggWin:true,hhG2:'1',hhHan:'1',
      hhNgay:'2026-08-25', hhKhungDa:da, hhChaoAt:new Date('2026-08-25T06:30:00').getTime()}));
  }, [da]);
  await p2.goto(B+'/', {waitUntil:'load'}); await p2.clock.runFor(9000); await p2.waitForTimeout(900);
  const r2 = await p2.evaluate(()=>({ hien:document.getElementById('hhw').classList.contains('on'),
                                      lab:(document.getElementById('hhLab')||{}).textContent }));
  ok('lần 2 cùng khung cùng ngày: KHÔNG chào lại', !r2.hien, 'nhãn="'+(r2.lab||'—')+'"');
  await ctx2.close();
}

/* ══════ 5. GIÃN CÁCH DAILY QUOTE ══════ */
console.log('\n⑤ Daily Quote — hai mốc giãn cách');
const T = s => new Date('2026-08-25T'+s).getTime();
for(const [ten, chaoAt, quoteAt, gio, mong] of [
  ['vừa chào xong 20 phút → CHƯA tới lượt quote', T('09:40:00'), 0,            '2026-08-25T10:00:00', false],
  ['chào xong đã 90 phút → được quote',            T('08:30:00'), 0,            '2026-08-25T10:00:00', true ],
  ['quote trước cách 1 tiếng → CHƯA đủ 2 tiếng',   T('06:30:00'), T('09:00:00'),'2026-08-25T10:00:00', false],
  ['quote trước cách 3 tiếng → được quote',        T('06:30:00'), T('07:00:00'),'2026-08-25T10:00:00', true ],
]){
  const ctx = await br.newContext({ viewport:{width:390,height:844} });
  const p = await ctx.newPage();
  await p.clock.install({ time:new Date(gio) });
  await p.addInitScript(([c,q])=>{
    localStorage.setItem('nav1', JSON.stringify({v:2,profiles:[],active:-1,mapUnlocked:true}));
    localStorage.setItem('mtv1', JSON.stringify({g2Done:true,g2Game:true,g2Open:true,eggWin:true,hhG2:'1',hhHan:'1',
      hhNgay:'2026-08-25', hhKhungDa:{ngay:'2026-08-25',ds:['sang','trua','toi']},
      hhChaoAt:c, hhQuoteAt:q }));
  }, [chaoAt, quoteAt]);
  await p.goto(B+'/', {waitUntil:'load'}); await p.clock.runFor(9000); await p.waitForTimeout(1000);
  const r = await p.evaluate(()=>({ hien:document.getElementById('hhw').classList.contains('on'),
                                    lab:(document.getElementById('hhLab')||{}).textContent }));
  const laQuote = r.hien && /Daily Quote/.test(r.lab||'');
  ok(ten, laQuote===mong, 'nhãn="'+(r.lab||'—')+'"');
  await ctx.close();
}
console.log('\n──────── phần 2: '+pass+' đạt / '+fail+' hỏng');
await br.close();
process.exit(fail?1:0);
