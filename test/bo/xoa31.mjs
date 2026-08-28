/* ═══════════════════════════════════════════════════════════════════════════
   ĐỢT 31 — mấy chỗ vừa vá, mỗi chỗ một phép giữ

   ① ô nhập mã: bấm XOÁ là che ngay, không khoe lại ký tự cũ
   ② hộp pí mật: ký hiệu chơi lại (giữ nguyên hình) phải hỏi lại rồi xoá thật
   ③ màn trứng: ba dòng chữ có nhịp đủ chậm để đọc
   ④ tiêu đề đảo qua lại suốt lúc băng rôn còn bay
   ⑥ tìm ra Easter Egg rồi thì chạm quân bài chỉ ra một câu ngắn
   ⑧ nút Khối vận hành ở trang nền SÁNG phải mang tông sáng
   ═══════════════════════════════════════════════════════════════════════ */
import { moTrinhDuyet, DIA_CHI } from '../chung.mjs';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { GOC } from '../chung.mjs';
const B = DIA_CHI;
const br = await moTrinhDuyet();
let pass = 0, fail = 0;
const ok = (t, c, them='') => { c ? pass++ : fail++;
  console.log((c ? '  ✓ ' : '  ✗ ') + t + (them ? '  → ' + them : '')); };

/* Trang nào cũng phải qua cửa pí danh trước mới vào được bản đồ */
const GIEO = () => {
  if(localStorage.getItem('nav1')) return;
  localStorage.setItem('nav1', JSON.stringify(
    { v:2, profiles:[{ pid:'kt31', ten:'Kiểm 31' }], active:0, mapUnlocked:true }));
};

/* ══════ ① XOÁ LÀ CHE NGAY ══════ */
console.log('\n① Ô nhập mã — bấm xoá là che ngay');
{
  const ctx = await br.newContext({ viewport:{width:390,height:844} });
  const p = await ctx.newPage(); const errs = [];
  p.on('pageerror', e => errs.push(e.message));
  await p.addInitScript(GIEO);
  await p.goto(B + '/', { waitUntil:'load' }); await p.waitForTimeout(2400);
  /* mở cửa mã Hack Map bằng chính hàm của trang */
  await p.evaluate(() => openPin('map'));
  await p.waitForTimeout(400);
  /* focus() chứ không click: hộp mã nằm dưới một lớp che, click bị lớp đó
     nuốt — mà chuyện cần kiểm ở đây là nhịp GÕ, không phải cú chạm. */
  await p.evaluate(() => document.querySelector('#pinIn').focus());
  await p.locator('#pinIn').pressSequentially('195', { delay: 90 });
  await p.waitForTimeout(60);
  const hienKhiGo = await p.evaluate(() => document.querySelectorAll('#pinDash .ro').length);
  ok('gõ xong còn thấy ký tự vừa gõ', hienKhiGo === 1, 'ô sáng: ' + hienKhiGo);
  await p.press('#pinIn', 'Backspace');
  await p.waitForTimeout(60);          /* rất ngắn — nhịp cũ phải chờ 800ms */
  const hienKhiXoa = await p.evaluate(() => document.querySelectorAll('#pinDash .ro').length);
  ok('vừa xoá là che sạch, không đợi nhịp nào', hienKhiXoa === 0, 'ô sáng: ' + hienKhiXoa);
  ok('không lỗi JS', errs.length === 0, errs.join(' | '));
  await ctx.close();
}

/* ══════ ② ĐƯỜNG CHƠI LẠI TRONG HỘP PÍ MẬT ══════
   Hai ký hiệu cũ GIỮ NGUYÊN theo ý chủ nhà — phép kiểm ở đây không đụng tới
   hình hài, chỉ giữ cho ĐƯỜNG XOÁ luôn còn nguyên: bấm ký hiệu quay vòng thì
   phải ra hộp hỏi lại, đồng ý thì phải xoá thật, và phải xoá bằng đúng một
   đường với nút Reset bên Box Tổng tư lệnh (ô đếm chơi lại vẫn cộng tiếp). */
console.log('\n② Hộp pí mật — ký hiệu chơi lại phải xoá thật');
{
  const ctx = await br.newContext({ viewport:{width:390,height:844} });
  const p = await ctx.newPage(); const errs = [];
  p.on('pageerror', e => errs.push(e.message));
  await p.addInitScript(GIEO);
  await p.goto(B + '/', { waitUntil:'load' }); await p.waitForTimeout(2400);
  /* gieo bằng chính hàm của trang để đúng dấu mùa và đúng khuôn lưu */
  await p.evaluate(() => { NODES.forEach(n => {
    unlocked[n.code] = true; morseSeen[n.code] = true; solved[n.code] = 'xong'; });
    resetCount = 2; save(); });
  await p.reload({ waitUntil:'load' }); await p.waitForTimeout(2400);
  /* So bằng SỐ TOẠ ĐỘ ĐÃ GIẢI, không so cả chuỗi lưu: trang còn mấy nhịp ghi
     lặt vặt của riêng nó (lượt ghé, ngày…), chuỗi đổi là chuyện thường. */
  const demGiai = () => p.evaluate(() => {
    try{ return Object.keys(JSON.parse(localStorage.getItem('mtv1')||'{}').solved||{}).length; }
    catch(e){ return -1; } });
  const truoc = await demGiai();
  await p.evaluate(() => openCx(null)); await p.waitForTimeout(600);
  const co = await p.evaluate(() => ({
    rs: !!document.querySelector('#cxRs'), rp: !!document.querySelector('#cxRp'),
    veRs: !!document.querySelector('#cxRs svg'),
    veRp: !!document.querySelector('#cxRp svg') }));
  ok('ký hiệu chơi lại có mặt khi đủ bốn toạ độ', co.rs === true);
  ok('ký hiệu xem lại hiệu ứng cũng còn nguyên', co.rp === true);
  ok('cả hai vẫn là ký hiệu vẽ, không đổi thành chữ',
     co.veRs && co.veRp);
  await p.click('#cxRs'); await p.waitForTimeout(500);
  const hoi = await p.evaluate(() => {
    const a = document.querySelector('#askw');
    if(!a) return { mo:false };
    const cs = getComputedStyle(a);
    const y = document.querySelector('#askYes');
    return { mo: a.classList.contains('on'), ro: cs.opacity, bam: cs.pointerEvents,
             tren: +cs.zIndex > 24, coNut: !!y }; });
  ok('bấm vào là hiện hộp hỏi lại', hoi.mo === true);
  /* Hộp hỏi lại phải NÓI RÕ nó sắp làm gì, và nút bỏ qua phải ra nghĩa bỏ qua */
  /* Dồn khoảng trắng trước khi soi: câu trong HTML bị ngắt dòng giữa chừng
     cho vừa bề ngang mã nguồn, soi trên bản thô là trượt oan. */
  const loi = await p.evaluate(() => ({
    than: ((document.querySelector('#askw .cxp') || {}).textContent || '')
            .replace(/\s+/g, ' ').trim(),
    khong: (document.querySelector('#askNo') || {}).textContent || '' }));
  ok('hộp nói thẳng hậu quả', /xoá sạch tiến độ/i.test(loi.than), loi.than.slice(0,80));
  ok('nút bỏ qua ra nghĩa bỏ qua', !/Xem xét/.test(loi.khong), loi.khong);
  ok('hộp hỏi lại nhìn thấy và bấm được',
     hoi.ro === '1' && hoi.bam === 'auto' && hoi.tren === true, JSON.stringify(hoi));
  ok('chưa đồng ý thì chưa xoá gì', (await demGiai()) === truoc && truoc === 4);
  await p.click('#askYes');
  /* Đồng ý xong là trang TỰ NẠP LẠI — phải đợi nạp xong mới đọc được kho lưu,
     đọc giữa chừng thì trình duyệt chặn thẳng. */
  await p.waitForLoadState('load'); await p.waitForTimeout(2200);
  const sau = JSON.parse(await p.evaluate(() => localStorage.getItem('mtv1')) || '{}');
  ok('đồng ý thì xoá thật', Object.keys(sau.solved || {}).length === 0,
     JSON.stringify(sau.solved));
  ok('ô đếm chơi lại vẫn cộng tiếp — cùng một đường xoá với Box Tổng tư lệnh',
     sau.resetCount === 3, 'R' + sau.resetCount);
  ok('không lỗi JS', errs.length === 0, errs.join(' | '));
  await ctx.close();
}

/* ══════ ④ + ⑥ TIÊU ĐỀ ĐẢO THEO BĂNG RÔN · CHẠM QUÂN BÀI ══════ */
console.log('\n④⑥ Tiêu đề đảo suốt lúc băng rôn bay · chạm quân bài');
{
  const ctx = await br.newContext({ viewport:{width:390,height:844} });
  const p = await ctx.newPage(); const errs = [];
  p.on('pageerror', e => errs.push(e.message));
  await p.addInitScript(GIEO);
  await p.goto(B + '/', { waitUntil:'load' }); await p.waitForTimeout(2400);
  await p.evaluate(() => { NODES.forEach(n => {
    unlocked[n.code] = true; morseSeen[n.code] = true; solved[n.code] = 'xong'; });
    winParty = true; credFound = true; save(); });
  await p.reload({ waitUntil:'load' }); await p.waitForTimeout(2400);
  /* vặn kim tới đúng ngày sinh nhật rồi chạy màn Easter Egg */
  await p.evaluate(() => { vanKim(mocSinhNhat() - Date.now() + 3600e3); });
  await p.waitForTimeout(600);
  await p.evaluate(() => { eggTitleDay = null; eggIntro(true); });
  await p.waitForTimeout(300);
  const bay = await p.evaluate(() => document.querySelector('#frame').classList.contains('flying'));
  ok('băng rôn đang bay', bay === true);
  const doc = () => p.evaluate(() => document.querySelector('#title').textContent.trim());
  const thay = new Set();
  for(let i = 0; i < 12; i++){ thay.add(await doc()); await p.waitForTimeout(700); }
  ok('tiêu đề đảo qua lại lúc băng rôn còn bay', thay.size >= 2,
     [...thay].join(' / '));
  ok('hai nửa đúng là Easter Egg ⇄ Game On',
     thay.has('Easter Egg') && thay.has('Game On'), [...thay].join(' / '));
  /* ⑥ — chạm quân bài khi ĐÃ tìm ra Easter Egg */
  await p.evaluate(() => { const q = document.querySelector('#lead .qco');
    if(q) q.click(); });
  await p.waitForTimeout(500);
  /* `flash()` in thẳng vào dòng đọc toạ độ (#readout) rồi 2,6 giây sau trả về
     như cũ — nên phải đọc ngay, đừng chờ. */
  const cau = await p.evaluate(() => {
    const f = document.querySelector('#readout');
    return f ? f.textContent.trim() : ''; });
  ok('câu xác nhận ngắn gọn', /^Đã tìm được Easter Egg/.test(cau) && cau.length < 40, cau);
  ok('không lỗi JS', errs.length === 0, errs.join(' | '));
  await ctx.close();
}

/* ══════ ③ NHỊP CHỮ MÀN TRỨNG ══════ */
console.log('\n③ Màn trứng — ba dòng chữ đủ chậm để đọc');
{
  const src = readFileSync(join(GOC, 'phao-hoa/index.html'), 'utf8');
  const m = src.match(/var LAC_MS = (\d+), NUT_MS = (\d+);/);
  ok('tìm thấy hai con số nhịp', !!m);
  if(m){
    ok('pha lắc ≥ 1,8 giây', +m[1] >= 1800, m[1] + 'ms');
    ok('pha nứt ≥ 1,2 giây', +m[2] >= 1200, m[2] + 'ms');
    /* nới thì nới, đừng để cả màn trứng dài quá — người xem tới đây là để
       xem pháo hoa, không phải ngồi đợi quả trứng */
    ok('cả màn trứng vẫn dưới 5 giây', +m[1] + +m[2] < 5000, (+m[1] + +m[2]) + 'ms');
  }
}

/* ══════ ⑧ TÔNG NÚT Ở TRANG NỀN SÁNG ══════ */
console.log('\n⑧ Nút Khối vận hành — trang nền sáng phải có tông sáng');
{
  const ctx = await br.newContext({ viewport:{width:390,height:844} });
  const p = await ctx.newPage(); const errs = [];
  p.on('pageerror', e => errs.push(e.message));
  await p.goto(B + '/han/961030-a/', { waitUntil:'load' }); await p.waitForTimeout(1600);
  const mau = await p.evaluate(() => {
    const b = document.createElement('button');
    b.className = 'ops-btn'; b.textContent = 'Thử';
    document.body.appendChild(b);
    const cs = getComputedStyle(b);
    const r = { nen: cs.backgroundColor, chu: cs.color };
    b.remove(); return r; });
  /* nền tối mặc định là rgba(6,16,31,.5) — trang này KHÔNG được dùng nó */
  ok('nền nút không còn là nền tối dùng chung',
     !/^rgba?\(6, ?16, ?31/.test(mau.nen), mau.nen);
  /* đủ sáng: lấy độ sáng tương đối thô của phần màu */
  const so = (mau.nen.match(/[\d.]+/g) || []).map(Number);
  ok('nền nút ngả về phía sáng', so[0] > 120 && so[1] > 90, mau.nen);
  ok('chữ nút đủ đậm để đọc trên nền sáng',
     /^rgb\(122, ?74, ?150\)/.test(mau.chu), mau.chu);
  ok('không lỗi JS', errs.length === 0, errs.join(' | '));
  await ctx.close();
}

/* ══════ KHUNG XẾP NÚT PHẢI NGHE `hidden` ══════ */
console.log('\n＋ Ba khuôn xếp nút phải ẩn được bằng thuộc tính hidden');
{
  const ctx = await br.newContext({ viewport:{width:390,height:844} });
  const p = await ctx.newPage();
  await p.goto(B + '/han/961030-b/', { waitUntil:'load' }); await p.waitForTimeout(1400);
  const an = await p.evaluate(() => {
    const r = {};
    ['ops-cot','ops-hang','ops-luoi'].forEach(k => {
      const d = document.createElement('div');
      d.className = k; d.hidden = true; document.body.appendChild(d);
      r[k] = getComputedStyle(d).display; d.remove(); });
    return r; });
  for(const k of Object.keys(an)) ok('.' + k + '[hidden] ẩn hẳn', an[k] === 'none', an[k]);
  await ctx.close();
}

console.log('\n' + (fail ? '✗ ' + fail + ' hỏng' : '✓ tất cả đạt') + ' · ' + pass + ' phép đạt');
await br.close();
process.exit(fail ? 1 : 0);
