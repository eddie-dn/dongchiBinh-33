/* ĐỢT 32 · CHAT PHẢI VỀ TỚI SỔ
   "ping của tiến độ, pí danh record được rồi, riêng chat là không thấy về
   trên sheet." Bộ này chạy THẬT `doPost` của Apps Script trong một cái Sheet
   giả, ném vào đúng gói mà `api/chat.js` gửi, rồi soi từng ô của dòng vừa
   ghi. Soi bằng mắt trên mã nguồn thì không bắt được mấy lỗi lệch tên trường
   — mà đúng cái lệch tên mới là thứ đã làm rơi mất chat. */
import { GOC } from '../chung.mjs';
import { readFileSync } from 'node:fs';
let ok = 0, ng = 0;
const T = (n, c, note='') => { if(c){ ok++; console.log('  ✓ ' + n); }
  else { ng++; console.log('  ✗ ' + n + (note ? '  → ' + note : '')); } };
const G = GOC + '/';
const chat = readFileSync(G + 'api/chat.js', 'utf8');
const cg   = readFileSync(G + 'docs/apps-script/Code.gs', 'utf8');

console.log('\n① Máy chủ có bắn chat sang sổ không');
{
  T('dùng CHUNG biến SHEET_URL với ping / thư / pí danh',
    /const SHEET_URL\s*=\s*process\.env\.SHEET_URL/.test(chat));
  T('gói chat có khai loai:"chat" để sổ lái đúng tab',
    /loai:\s*'chat'/.test(chat));
  T('thật sự POST tới SHEET_URL', /for \(const dich of \[SHEET_URL, LOG_URL\]/.test(chat));
  T('KHÔNG await — người chơi không phải chờ cái sổ',
    !/await fetch\(dich/.test(chat));
  T('không trải token hai lần (Code.gs đã tự trải)',
    !/token_vao\s*:/.test(chat), 'api/chat.js lại trải token nữa là ghi đè thành rỗng');
}

console.log('\n② Chạy THẬT doPost của Apps Script với gói chat');
{
  /* Sheet giả: đủ mấy hàm mà `layTab` + `doPost` gọi tới, và nhớ lại mọi
     dòng đã ghi. `setValues` phải TRẢ VỀ CHÍNH NÓ — Code.gs nối tiếp
     `.setFontWeight(...)` ngay sau, đứt chuỗi là rơi vào catch và dòng tiêu
     đề không bao giờ mọc. */
  const hang = [];
  const o_chain = { setValues(v){ hang[0] = v[0]; return o_chain; },
                    setFontWeight(){ return o_chain; },
                    getValues(){ return [hang[0] || []]; } };
  const sheetGia = {
    getLastRow: () => hang.length,
    getLastColumn: () => (hang[0] || []).length,
    appendRow: r => hang.push(r),
    getRange: () => o_chain,
    setFrozenRows(){}
  };
  const ss = { getSheetByName: () => sheetGia, insertSheet: () => sheetGia };
  const moiTruong = {
    SpreadsheetApp: { getActiveSpreadsheet: () => ss, openById: () => ss },
    ContentService: {
      createTextOutput: t => ({ setMimeType: () => ({ noi: t }) }),
      MimeType: { JSON: 'json' }
    },
    Utilities: { formatDate: () => '' },
    console
  };
  const fn = new Function(...Object.keys(moiTruong),
    cg + '\n;return { doPost: doPost, COT: COT };');
  const api = fn(...Object.values(moiTruong));
  const COT = api.COT['Chat'];
  /* `doPost` chặn ngay ở cửa nếu thiếu mã bảo vệ — đọc mã từ chính Code.gs
     chứ đừng chép tay, đổi mã trong file là bộ kiểm đỏ oan. (Mã trong kho là
     chuỗi mẫu, mã thật chỉ nằm bên Apps Script và bên Vercel.) */
  const ma = (cg.match(/var MA_BAO_VE = '([^']*)'/) || [,''])[1];
  const P = { k: ma };

  /* Đúng gói mà `ghiNhatKy` gửi đi ở lượt trả lời THÀNH CÔNG */
  const goi = {
    luc: '2026-08-28T10:00:00.000Z', nguon: 'open-world', loai: 'chat',
    ok: true, model: 'gemini-3.7-flash', ms: 2400, go_lai: false,
    hoi_dai: 33, dap_dai: 210, luot_su: 2,
    token: { promptTokenCount: 9000, candidatesTokenCount: 180, thoughtsTokenCount: 40 },
    hoi: 'câu hỏi thử', dap: 'câu trả lời thử'
  };
  api.doPost({ postData: { contents: JSON.stringify(goi) }, parameter: P });
  let daGhi = hang[hang.length - 1];
  T('có ghi được một dòng vào tab Chat', hang.length > 0 && !!daGhi, 'doPost không ghi gì');
  if(daGhi){
    const o = {}; COT.forEach((k, i) => o[k] = daGhi[i]);
    T('dòng dài đúng bằng số cột', daGhi.length === COT.length, daGhi.length + ' / ' + COT.length);
    T('ba cột token được trải phẳng',
      String(o.token_vao) === '9000' && String(o.token_ra) === '180'
      && String(o.token_nghi) === '40',
      'vao=' + o.token_vao + ' ra=' + o.token_ra + ' nghi=' + o.token_nghi);
    T('nội dung hỏi / đáp vào đúng ô', o.hoi === 'câu hỏi thử' && o.dap === 'câu trả lời thử');
    T('model và nhịp giờ có mặt', o.model === 'gemini-3.7-flash' && String(o.ms) === '2400');
    T('cột go_lai có chỗ đứng', COT.includes('go_lai'), 'thiếu cột là rơi mất');
  }

  /* Lượt HỎNG: phải nói được vì sao rỗng */
  const truoc = hang.length;
  api.doPost({ postData: { contents: JSON.stringify({
    luc: 'x', nguon: 'open-world', loai: 'chat', ok: false, ly_do: 'rong_dap',
    model: 'm', ms: 900, hoi_dai: 12, finish: 'MAX_TOKENS', block: '', token: {}
  }) }, parameter: P });
  if(hang.length > truoc){
    const o = {}; COT.forEach((k, i) => o[k] = hang[hang.length - 1][i]);
    T('lượt hỏng ghi được lý do', o.ly_do === 'rong_dap');
    T('cột finish nói được vì sao rỗng', o.finish === 'MAX_TOKENS',
      'thiếu cột finish thì mãi không biết vì sao không ra chữ');
  }
}

console.log('\n③ Ping và pí danh KHÔNG bị lái nhầm sang tab Chat');
{
  T('ping vẫn về tab Tiến độ', /goi\.loai === 'ping'\) \? 'Tiến độ'/.test(cg));
  T('pí danh vẫn đi đường riêng', /goi\.loai === 'pidanh'\) return traLoi\(luuPiDanh/.test(cg));
}

console.log('\nTỔNG: ' + ok + ' đạt / ' + ng + ' hỏng');
process.exit(ng ? 1 : 0);
