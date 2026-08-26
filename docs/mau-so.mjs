#!/usr/bin/env node
/* ═══════════════════════════════════════════════════════════════════════════
   GIẢ LẬP MỘT LƯỢT CHƠI RỒI IN RA SỔ LƯU — `node docs/mau-so.mjs`

   Đây KHÔNG phải dữ liệu bịa. Nó chạy đúng mã thật, đủ cả hai chặng:

     ① thao tác của người chơi  →  api/ping.js · api/thu.js · api/chat.js
     ②  gói mấy hàm đó gửi đi   →  doPost() + layTab() của docs/apps-script/Code.gs
                                    ghi vào một Sheet GIẢ dựng bằng JavaScript

   Nên bảng in ra dưới đây đúng bằng thứ sẽ hiện trên Google Sheets thật: cùng
   tab, cùng thứ tự cột, cùng cách cắt chuỗi. Sửa `COT` hay sửa `chepVeSheet`
   mà chạy lại cái này là thấy ngay khác chỗ nào.

   `--rong` in cả cột trống. Mặc định giấu bớt cho dễ đọc.                    */

import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const GOC = join(dirname(fileURLToPath(import.meta.url)), '..');
const require = createRequire(join(GOC, 'package.json'));
const HIEN_RONG = process.argv.includes('--rong');

/* ── Khai biến môi trường y như trên bản chạy thật ────────────────────────── */
process.env.SHEET_URL        = 'https://gia-lap/sheet';
process.env.CHAT_LOG_URL     = 'https://gia-lap/sheet';
process.env.CHAT_LOG_NOI_DUNG = '1';      /* bật để thấy nội dung hỏi/đáp */
process.env.NOTIFY_KIND      = 'telegram';
process.env.TG_TOKEN         = 'gia-lap';
process.env.TG_CHAT          = '0';
process.env.GEMINI_KEY       = 'gia-lap';

/* ── Đồng hồ giả ───────────────────────────────────────────────────────────
   api/ping.js chặn 25 tin mỗi phút và bỏ tin trùng trong 8 giây. Người chơi
   thật rải đều cả buổi; giả lập thì bắn liên tiếp nên đụng trần ngay. Đẩy
   đồng hồ đi giữa mỗi thao tác — đúng cách van đó được thiết kế để hoạt động. */
let gio = new Date('2026-09-01T09:12:00+07:00').getTime();
const thatNow = Date.now;
Date.now = () => gio;
const troi = s => { gio += s * 1000; };

/* ── Bắt mọi gói gửi ra ngoài ─────────────────────────────────────────────── */
const goi = [];
const thatFetch = global.fetch;
global.fetch = async (url, opt) => {
  const u = String(url);
  if (u.includes('gia-lap/sheet')) { goi.push(JSON.parse(opt.body)); return { ok: true }; }
  if (u.includes('generativelanguage')) {      /* Gemini — trả lời dựng sẵn */
    return { ok: true, json: async () => ({ candidates: [{ finishReason: 'STOP',
      content: { parts: [{ text: 'Mình là Honghandangiu. Câu này thì mình nhớ chứ — '
        + 'hôm đó trời mưa, hai đứa ngồi ăn bánh tráng ở vỉa hè Đà Nẵng.' }] } }],
      usageMetadata: { promptTokenCount: 812, candidatesTokenCount: 46, thoughtsTokenCount: 128 } }) };
  }
  return { ok: true, text: async () => '', json: async () => ({}) };
};

const res = () => ({ status(){ return this; }, json(){ return this; },
                     setHeader(){ return this; }, end(){ return this; }, send(){ return this; } });
const ping = require(join(GOC, 'api/ping.js'));
const thu  = require(join(GOC, 'api/thu.js'));
const chat = require(join(GOC, 'api/chat.js'));

const MAY = 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15';
const at  = () => new Date(gio).toISOString();

async function P(o){ troi(90); await ping({ method:'POST', headers:{}, query:{},
  body: Object.assign({ at: at(), ua: MAY }, o) }, res()); }
/* Kênh ảnh: trình duyệt gọi bằng thẻ <img>, nên `ua` không đi trong địa chỉ mà
   nằm ở tiêu đề request — giả lập đúng vậy. */
async function ANH(q){ troi(90); await ping({ method:'GET', headers:{ 'user-agent': MAY },
  query: Object.assign({ t: String(gio) }, q) }, res()); }

/* ═══ MỘT LƯỢT CHƠI, THEO ĐÚNG THỨ TỰ NGƯỜI CHƠI ĐI ═════════════════════════ */
console.log('Đang giả lập một lượt chơi…\n');

/* — mở /, bị đẩy về hồ sơ — */
await P({ ev:'redirect_ho_so', detail:'PHA 1 · tu / ve ho so', trang:'ban-do', noi:'Cửa vào' });
await P({ ev:'ho_so_mo', detail:'XG-950901-A', trang:'dad-a', noi:'Trang bìa',
          tt:'Mission: M1 — · M2 — · M3 —' });
await P({ ev:'trang_ho_so', detail:'XG-950901-A · trang Phi đoàn', trang:'dad-a',
          noi:'Trang bìa', tt:'Mission: M1 — · M2 — · M3 —' });

/* — gửi form, xong Mission 1 — */
await P({ ev:'gui_form', detail:'XG-950901-A · vừa bấm nút gửi', trang:'dad-a',
          noi:'Trang bìa', tt:'Mission: M1 — · M2 — · M3 —' });
await P({ ev:'mo_khoa_m2_cua', detail:'gửi form', trang:'dad-a', noi:'Mission 1',
          tt:'Mission: M1 ✓ · M2 — · M3 — · đã gửi form' });

/* — Mission 2: gõ sai hai lần rồi đúng — */
for (const n of [1, 2])
  await P({ ev:'sai_pin', detail:'Mission 2 · lần '+n+'/3 phiên · '+n+'/12 ngày',
            trang:'dad-a', noi:'Mission 2', tt:'Mission: M1 ✓ · M2 — · M3 — · đã gửi form' });
await P({ ev:'mo_khoa_m2', detail:'Mã đúng · Mission 3 mở cửa sổ 5 ngày', trang:'dad-a',
          noi:'Mission 2', tt:'Mission: M1 ✓ · M2 ✓ · M3 — · đã gửi form' });

/* — Mission 3: cháy lượt, bị khoá, rồi phá đảo — */
await P({ ev:'khoa_pin', detail:'Mission 3 · nghỉ 5 phút', trang:'dad-a', noi:'Mission 3',
          tt:'Mission: M1 ✓ · M2 ✓ · M3 — · đã gửi form' });
await P({ ev:'sos_hint', detail:'SOS 10 nhịp → lộ gợi ý 2', trang:'dad-a', noi:'Mission 3',
          tt:'Mission: M1 ✓ · M2 ✓ · M3 — · đã gửi form' });
await P({ ev:'giai_m3', detail:'giải đúng PHAM TUAN', trang:'dad-a', noi:'Mission 3',
          tt:'Mission: M1 ✓ · M2 ✓ · M3 ✓ · đã gửi form' });
await P({ ev:'mo_pha_map', detail:'giải đúng PHAM TUAN', trang:'dad-a', noi:'Mission 3',
          tt:'Mission: M1 ✓ · M2 ✓ · M3 ✓ · đã gửi form' });
await P({ ev:'luu_profile', detail:'chubin', trang:'dad-a', noi:'Trang bìa',
          tt:'Mission: M1 ✓ · M2 ✓ · M3 ✓ · đã gửi form' });

/* — sang bản đồ, giải mật thư — */
await P({ ev:'vao_ban_do', detail:'nút Bản đồ', trang:'dad-a', noi:'Trang bìa',
          tt:'Mission: M1 ✓ · M2 ✓ · M3 ✓ · đã gửi form' });
const daGiai = [];
for (const [ma, ten] of [['DAD','Đà Nẵng'], ['HAN','Hà Nội'], ['UIH','Quy Nhơn'], ['SGN','Hồ Chí Minh']]) {
  await P({ ev:'mo_ho_so', detail:ma+' · '+ten, trang:'ban-do', noi:'Toạ độ '+ma,
            solved:[...daGiai], tt:'Toạ độ: '+(daGiai.join(', ')||'chưa giải cái nào')+' ('+daGiai.length+'/4)' });
  daGiai.push(ma);
  await P({ ev:'giai_dung', detail:ma, trang:'ban-do', noi:'Toạ độ '+ma, solved:[...daGiai],
            tt:'Toạ độ: '+daGiai.join(', ')+' ('+daGiai.length+'/4)' });
}

/* — kênh ẢNH: máy người chơi có bộ chặn quảng cáo, fetch bị chặn — */
await ANH({ ev:'vao_easter_egg', detail:'từ khung Collected', trang:'ban-do',
            noi:'Box Tổng tư lệnh', tt:'Toạ độ: DAD, HAN, UIH, SGN (4/4) · đã mở Easter Egg' });

/* — Easter Egg · Gate 2 — */
await P({ ev:'g2_vao_cong', detail:'bình thường', trang:'dad-b', noi:'Màn cổng', tt:'Chưa vào game' });
await P({ ev:'g2_press_start', detail:'', trang:'dad-b', noi:'Màn cổng', tt:'Chưa vào game' });
await P({ ev:'g2_vong_1', detail:'', trang:'dad-b', noi:'Màn chơi · vòng 1', tt:'Đang ở vòng 1' });
await P({ ev:'g2_sai', detail:'vòng 1 · lần 2', trang:'dad-b', noi:'Màn chơi · vòng 1', tt:'Đang ở vòng 1' });
await P({ ev:'g2_giai_xong_1', detail:'sai 2 lần', trang:'dad-b', noi:'Màn chơi · vòng 1', tt:'Đang ở vòng 1' });
await P({ ev:'g2_giai_xong_2', detail:'sai 1 lần', trang:'dad-b', noi:'Màn chơi · vòng 2', tt:'Đang ở vòng 2' });
await P({ ev:'g2_pha_dao', detail:'', trang:'dad-b', noi:'Màn phát mã', tt:'Đã phá đảo Gate 2' });

/* — Open World: hỏi một câu (đi qua api/chat.js thật) — */
troi(120);
await chat({ method:'POST', headers:{}, body:{ hoi:'Anh còn nhớ lần đầu hai đứa đi Đà Nẵng không?',
  su:[{ vai:'user', text:'chào bạn' }, { vai:'npc', text:'Ơi, mình đây.' }] } }, res());
await P({ ev:'g2_open_world', detail:'', trang:'dad-b', noi:'Khu Open World', tt:'Đã phá đảo Gate 2' });
await P({ ev:'g2_ow_hoi', detail:'còn 4 lượt', trang:'dad-b', noi:'Khu Open World', tt:'Đã phá đảo Gate 2' });

/* — Zoey's Castle — */
await P({ ev:'han_mo_cua_a', detail:'nhập đúng mã', trang:'han-a', noi:'Cửa mã', tt:'Đúng 0/3 câu' });
await P({ ev:'han_dung', detail:'q1', trang:'han-a', noi:'Bộ câu hỏi', tt:'Đúng 1/3 câu' });
await P({ ev:'han_sai', detail:'q2 · sai 1/2', trang:'han-a', noi:'Bộ câu hỏi', tt:'Đúng 1/3 câu' });

/* — lời nhắn gửi tổ kỹ thuật — */
troi(150);
await thu({ method:'POST', headers:{}, body:{ tu:'chubin', at:at(), ua:MAY,
  loi:'Trò này dễ thương ghê. Chỗ Gate 2 mình kẹt hơi lâu ở vòng 1 mà giải ra thì đã lắm. Cảm ơn nha!' } }, res());

/* — màn pháo hoa — */
await P({ ev:'phao_hoa_mo', detail:'', trang:'phao-hoa', noi:'Chờ bấm bắn',
          tt:'Đã phá đảo Easter Egg' });

/* ═══ CHẶNG ②: CHO MẤY GÓI ĐÓ ĐI QUA CHÍNH MÃ APPS SCRIPT ═══════════════════ */
const cg = readFileSync(join(GOC, 'docs/apps-script/Code.gs'), 'utf8');
const kho = {};
function sheetGia(){
  const cot = [], dong = [];
  return { _cot: cot, _dong: dong,
    getLastColumn: () => cot.length,
    appendRow(d){ cot.length ? dong.push(d) : cot.push(...d); },
    setFrozenRows(){},
    getRange(_h, c, _r, n){ return {
      setValues(v){ for (let i = 0; i < n; i++) cot[c - 1 + i] = v[0][i]; return this; },
      setFontWeight(){ return this; } }; } };
}
const AppsScript = new Function('SpreadsheetApp', 'ContentService',
  cg + '\nreturn { doPost: doPost, COT: COT };')(
  { getActiveSpreadsheet: () => ({
      getSheetByName: n => kho[n] || null,
      insertSheet: n => (kho[n] = sheetGia()) }) },
  { createTextOutput: t => ({ setMimeType: () => t }), MimeType: { JSON: 'json' } });

const MA = (cg.match(/var MA_BAO_VE = '([^']*)'/) || [, ''])[1];
for (const g of goi)
  AppsScript.doPost({ parameter: { k: MA }, postData: { contents: JSON.stringify(g) } });

/* ═══ IN RA ════════════════════════════════════════════════════════════════ */
Date.now = thatNow; global.fetch = thatFetch;

const CAT = 46;
const gon = v => { const s = String(v ?? ''); return s.length > CAT ? s.slice(0, CAT - 1) + '…' : s; };

for (const [ten, sh] of Object.entries(kho)) {
  let cot = sh._cot, dong = sh._dong;
  if (!HIEN_RONG) {                       /* giấu cột trống trơn cho dễ đọc */
    const giu = cot.map((_, i) => dong.some(d => String(d[i] ?? '') !== ''));
    cot = cot.filter((_, i) => giu[i]);
    dong = dong.map(d => d.filter((_, i) => giu[i]));
  }
  const rong = cot.map((c, i) => Math.max(gon(c).length, ...dong.map(d => gon(d[i]).length)));
  const ke = (o, m) => o.map((v, i) => gon(v).padEnd(rong[i])).join(' │ ') + (m || '');
  console.log('\n\x1b[1m▌ TAB "' + ten + '" — ' + dong.length + ' dòng\x1b[0m');
  console.log('  ' + ke(cot));
  console.log('  ' + rong.map(r => '─'.repeat(r)).join('─┼─'));
  for (const d of dong) console.log('  ' + ke(d));
}

console.log('\n' + '─'.repeat(70));
console.log('%d thao tác → %d dòng vào sổ.', goi.length, Object.values(kho).reduce((n, s) => n + s._dong.length, 0));
console.log('Cột trống bị giấu bớt cho dễ đọc — `node docs/mau-so.mjs --rong` để xem đủ.');
