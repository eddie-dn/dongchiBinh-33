/* ĐỢT 32 · RESET PHẢI TRẢ MÀN VỀ ĐÚNG LÚC CHƯA GIẢI — VÀ CHỈ THẾ THÔI
   Hai mặt của cùng một nút, hai kiểu sai ngược nhau:
     ① xoá THIẾU — pí danh còn giữ một bản chụp riêng của tiến độ, reset không
        đụng tới nên nạp lại bản lưu là công reset thành công cốc;
     ④ xoá THỪA — nhịp hộp chào ở nhờ trong cùng cái kho, bị cuốn đi theo, nên
        cứ reset một cái là bị chào lại từ đầu ("trong 10 phút thấy hiện liên
        tục daily box, greeting"). */
import { moTrinhDuyet, DIA_CHI } from '../chung.mjs';
const B = DIA_CHI;
const br = await moTrinhDuyet();
let pass = 0, fail = 0;
const ok = (t, c, them='') => { c ? pass++ : fail++;
  console.log((c ? '  ✓ ' : '  ✗ ') + t + (them ? '  → ' + them : '')); };

const ctx = await br.newContext({ viewport:{width:390,height:844} });
const p = await ctx.newPage(); const errs = [];
p.on('pageerror', e => errs.push(e.message));
await p.addInitScript(() => {
  if(localStorage.getItem('nav1')) return;
  localStorage.setItem('msn1', JSON.stringify({m1:true,m2:true,m3:true,m2doneAt:Date.now(),hints:0}));
  localStorage.setItem('nav1', JSON.stringify(
    {v:2, profiles:[{pid:'t', name:'KIEM32', moc:'M3 ✓', snap:{}}], active:0, mapUnlocked:true}));
});
const doc = k => p.evaluate(k2 => { try{ return JSON.parse(localStorage.getItem(k2)||'{}'); }
  catch(e){ return {}; } }, k);

await p.goto(B + '/', { waitUntil:'load' }); await p.waitForTimeout(2400);
/* Giải hết bản đồ, tìm ra Easter Egg, và ĐÃ được chào một khung trong ngày */
await p.evaluate(() => {
  NODES.forEach(n => { unlocked[n.code]=true; morseSeen[n.code]=true; solved[n.code]='xong'; });
  credFound = true; eggWin = true; resetCount = 2;
  hhKhungDa = { ngay: ngay(), ds:['sang','trua'] };
  hhChaoAt = 1756000000000; hhQuoteAt = 1756000111000; hhNgay = ngay();
  save();
});
await p.reload({ waitUntil:'load' }); await p.waitForTimeout(2200);

console.log('\n① Reset rồi thì hồ sơ pí danh cũng phải hạ theo');
/* Cho hồ sơ chụp lại đúng như người chơi bấm "Lưu tiến trình" */
await p.goto(B + '/dad/950901-a/', { waitUntil:'load' }); await p.waitForTimeout(2600);
await p.evaluate(() => { try{ profSave(null, true); }catch(e){} });
await p.waitForTimeout(400);
const truoc = (await doc('nav1')).profiles[0].snap || {};
ok('hồ sơ có chụp tiến độ bản đồ', Object.keys((truoc.mtv1||{}).solved||{}).length === 4,
   JSON.stringify(Object.keys((truoc.mtv1||{}).solved||{})));

await p.goto(B + '/', { waitUntil:'load' }); await p.waitForTimeout(2400);
await p.evaluate(() => hardWipe('reset', 'bộ kiểm đợt 32'));
await p.waitForLoadState('load'); await p.waitForTimeout(2400);

const mt = await doc('mtv1');
const snap = ((await doc('nav1')).profiles[0].snap) || {};
ok('kho của bản đồ đã sạch', Object.keys(mt.solved||{}).length === 0);
ok('BẢN CHỤP trong hồ sơ cũng sạch theo',
   Object.keys((snap.mtv1||{}).solved||{}).length === 0,
   'còn ' + Object.keys((snap.mtv1||{}).solved||{}).length + '/4 — nạp lại là hoàn tác reset');
ok('cờ Easter Egg trong hồ sơ cũng hạ', !(snap.mtv1||{}).credFound);
ok('chặng Mission KHÔNG bị đụng tới', !!(snap.msn1 && snap.msn1.m3),
   'reset bản đồ không được xoá tiến độ hồ sơ');
/* ĐỢT 33 SỬA LẠI PHÉP NÀY. Bản đợt 32 đòi `moc` phải RỖNG, với lý do "lần
   sau ghé trang hồ sơ thì profSave tự tính lại". Sai: chỗ hiện mốc có luật lùi
   `moc || '—'`, mà dấu gạch nghĩa là CHƯA LÀM GÌ CẢ — trong khi ba Mission vẫn
   còn nguyên. Nay chụp lại là tính lại luôn, và mốc đúng phải là "M3 ✓". */
ok('mốc tính lại đúng chặng còn lại, không để rỗng',
   ((await doc('nav1')).profiles[0].moc || '') === 'M3 ✓',
   JSON.stringify((await doc('nav1')).profiles[0].moc));

console.log('\n④ Nhưng nhịp hộp chào thì phải SỐNG SÓT');
ok('vẫn nhớ hôm nay đã chào khung nào',
   ((mt.hhKhungDa||{}).ds||[]).join(',') === 'sang,trua',
   JSON.stringify(mt.hhKhungDa));
ok('vẫn nhớ mốc xem lời chào gần nhất', mt.hhChaoAt === 1756000000000, String(mt.hhChaoAt));
ok('vẫn nhớ mốc câu quote gần nhất',  mt.hhQuoteAt === 1756000111000, String(mt.hhQuoteAt));

console.log('\n＋ Mấy ô đếm vẫn đi tiếp như luật cũ');
ok('số lần chơi lại cộng thêm một', mt.resetCount === 3, 'R' + mt.resetCount);
ok('không lỗi JS', errs.length === 0, errs.join(' | '));
await ctx.close();

console.log('\n' + (fail ? '✗ ' + fail + ' hỏng' : '✓ tất cả đạt') + ' · ' + pass + ' phép đạt');
await br.close();
process.exit(fail ? 1 : 0);
