/* ĐỢT 19 · NHẮC OPEN WORLD — mỗi ngày một lần, và phải biết dừng */
import { moTrinhDuyet, DIA_CHI, GOC, require } from '../chung.mjs';
const B = DIA_CHI;
const br = await moTrinhDuyet();
let ok=0,ng=0;
const T=(n,c,note='')=>{ if(c){ok++;console.log('  ✓ '+n);} else {ng++;console.log('  ✗ '+n+(note?'  → '+note:''));} };

/* Dựng một người chơi ở đúng trạng thái muốn thử, rồi xem hộp nào bật ra.
   `gio` ép giờ máy để rơi vào / ra khỏi khung chào. */
async function moTrang({ kho = {}, gio = '2026-08-26T15:00:00' } = {}){
  const ctx = await br.newContext({ viewport:{width:420,height:900} });
  const p = await ctx.newPage();
  await p.clock.install({ time: new Date(gio) });
  await p.addInitScript(m=>{ localStorage.setItem('mtv1', JSON.stringify(m)); }, Object.assign({
    solved:{HAN:'x',DAD:'x',UIH:'x',SGN:'x'}, unlocked:{HAN:1,DAD:1,UIH:1,SGN:1},
    channel:'map', morseSeen:true, pzOn:true,
    eggWin:true, eggDone:true, g2Game:true, g2Done:true, hhG2:'1'   /* đã chào mừng phá đảo rồi */
  }, kho));
  await p.goto(B+'/?stay=1',{waitUntil:'load'});
  await p.clock.runFor(6000);
  await p.waitForTimeout(900);
  return { p, ctx };
}
const doc = async p => {
  const on = await p.evaluate(()=>document.getElementById('hhw').classList.contains('on'));
  if(!on) return null;
  return await p.evaluate(()=>({
    nhan: document.getElementById('hhLab').textContent.trim(),
    chu:  document.getElementById('hhTxt').textContent.trim(),
    anh:  (document.getElementById('hhPic').getAttribute('src')||'').split('/').pop()
  }));
};
const kho = p => p.evaluate(()=>{ try{ return JSON.parse(localStorage.getItem('mtv1')||'{}'); }catch(e){ return {}; } });

console.log('\n① Xong Gate 2 mà CHƯA vào Open World → nhắc');
{
  const { p, ctx } = await moTrang();
  const h = await doc(p);
  T('có hiện hộp nhắc', !!h && h.nhan === 'Open World', JSON.stringify(h));
  T('dùng đúng ảnh HH_4_hello_easter', !!h && /HH_4_hello_easter/.test(h.anh), h && h.anh);
  T('lần đầu chỉ HỎI, chưa chỉ đường', !!h && /chưa\?/.test(h.chu) && !/cuộn phim/.test(h.chu), h && h.chu);
  const m = await kho(p);
  T('ghi dấu ngày đã nhắc', !!m.owNhacNgay, JSON.stringify(m.owNhacNgay));
  T('đếm số lần nhắc = 1', m.owNhacDem === 1, String(m.owNhacDem));
  await ctx.close();
}

console.log('\n② ĐÃ vào Open World → im hẳn');
for(const [ten, k] of [['g2Open', {g2Open:true}], ['tên cũ g2Ow', {g2Ow:{ngay:'2026-08-25',dem:2}}]]){
  const { p, ctx } = await moTrang({ kho: k });
  const h = await doc(p);
  T('vào rồi ('+ten+') thì không nhắc nữa', !h || h.nhan !== 'Open World', JSON.stringify(h));
  await ctx.close();
}

console.log('\n③ CÙNG MỘT NGÀY vào lại → KHÔNG nhắc lần hai');
{
  const { p, ctx } = await moTrang({ kho:{ owNhacNgay:'2026-08-26', owNhacDem:1 } });
  const h = await doc(p);
  T('cùng ngày không nhắc lại', !h || h.nhan !== 'Open World', JSON.stringify(h));
  await ctx.close();
}
console.log('\n④ SANG NGÀY MỚI → nhắc lại, và lần này chỉ thẳng đường');
{
  const { p, ctx } = await moTrang({ kho:{ owNhacNgay:'2026-08-25', owNhacDem:2 } });
  const h = await doc(p);
  T('sang ngày mới thì nhắc lại', !!h && h.nhan === 'Open World', JSON.stringify(h));
  T('từ lần thứ ba thì CHỈ ĐƯỜNG, không hỏi suông', !!h && /cuộn phim/.test(h.chu), h && h.chu);
  await ctx.close();
}

console.log('\n⑤ CÓ TRẦN — nhắc mãi không đi thì thôi, đừng quấy');
{
  const { p, ctx } = await moTrang({ kho:{ owNhacNgay:'2026-08-20', owNhacDem:6 } });
  const h = await doc(p);
  T('đủ 6 lần rồi thì im hẳn', !h || h.nhan !== 'Open World', JSON.stringify(h));
  await ctx.close();
}

console.log('\n⑥ CHƯA xong Gate 2 → tuyệt đối không nhắc (chưa quen nhau)');
{
  const ctx = await br.newContext({ viewport:{width:420,height:900} });
  const p = await ctx.newPage();
  await p.clock.install({ time: new Date('2026-08-26T15:00:00') });
  await p.addInitScript(()=>{ localStorage.setItem('mtv1', JSON.stringify({
    solved:{HAN:'x'}, channel:'map' })); });
  await p.goto(B+'/?stay=1',{waitUntil:'load'});
  await p.clock.runFor(6000); await p.waitForTimeout(900);
  T('chưa xong Gate 2 thì không hộp nào bật', !(await doc(p)), JSON.stringify(await doc(p)));
  await ctx.close();
}

console.log('\n⑦ NHẮC THAY LỜI CHÀO, KHÔNG CỘNG THÊM HỘP');
{
  /* 06:30 = đang trong khung chào buổi sáng. Hôm đó phải ra ĐÚNG MỘT hộp, và
     hộp đó là hộp nhắc — không được ra cả hai, cũng không được ra hai lượt. */
  const { p, ctx } = await moTrang({ gio:'2026-08-26T06:30:00' });
  const h = await doc(p);
  T('trong khung chào vẫn ưu tiên hộp nhắc', !!h && h.nhan === 'Open World', JSON.stringify(h));
  T('lời chào KHÔNG còn dính đuôi nhắc', !!h && !/Xem lại được đó/.test(h.chu));
  await p.evaluate(()=>document.getElementById('hhX').click());
  await p.clock.runFor(8000); await p.waitForTimeout(600);
  const h2 = await doc(p);
  T('đóng xong không có hộp thứ hai nhảy ra ngay', !h2, JSON.stringify(h2));
  await ctx.close();
}

console.log('\n⑧ CHƠI LẠI TỪ ĐẦU thì bộ đếm nhắc cũng về 0');
{
  const src = await (await fetch(B+'/index.html')).text();
  T('nhánh chơi lại có dọn owNhacNgay / owNhacDem',
    /owNhacNgay = '';\s*owNhacDem = 0;/.test(src));
  T('cả hai đều được ghi xuống ổ nhớ', /owNhacNgay, owNhacDem \}\)/.test(src));
}

console.log('\nTỔNG: '+ok+' đạt / '+ng+' hỏng');
await br.close(); process.exit(ng?1:0);
