/**
 * /api/chat — khu OPEN WORLD của Easter Egg · Gate 2 nói chuyện với Gemini.
 *
 * Trang web KHÔNG bao giờ giữ khoá API. Nó POST câu hỏi về đây, hàm này mới
 * cầm khoá gọi sang Google rồi trả chữ về. Khoá nằm ở biến môi trường:
 *
 *     GEMINI_KEY   = khoá lấy ở https://aistudio.google.com/apikey
 *     GEMINI_MODEL = (không bắt buộc) mặc định gemini-3.7-flash
 *
 * Chưa khai khoá thì trả { loi: 'chua_co_khoa' } — trang hiện câu dự phòng,
 * không vỡ gì cả.
 *
 * Nhận:  { hoi, su:[{vai:'user'|'npc', text}] }
 * Trả:   { dap } hoặc { loi }
 *
 * Đoạn TÍNH CÁCH nằm ở `api/_lib/tinhcach.md` (nạp qua `_lib/tinhcach.js`),
 * KHÔNG nằm trong config.js —
 * nó có fact riêng tư về người chơi, mà mọi thứ trong `dad/` thì trình duyệt
 * nào cũng đọc được. Trang chỉ gửi câu hỏi lên, giọng nhân vật ghép ở đây.
 */

let TINH_CACH = '';
try {
  TINH_CACH = String(require('./_lib/tinhcach.js') || '');
} catch (e) {
  /* Thiếu file thì vẫn chạy, chỉ là nhân vật nhạt đi — không sập cả hàm */
  console.log('[CHAT] chưa nạp được tính cách:', e && e.message);
}

/* Tên model đọc từ biến môi trường GEMINI_MODEL, có sẵn mặc định ở đây để
   chưa khai biến thì vẫn chạy. Google ra đời Flash mới thì KHÔNG cần sửa code:
   lên Vercel → Project Settings → Environment Variables, đổi giá trị của
   GEMINI_MODEL rồi Redeploy là xong. Đặt alias `gemini-flash-latest` thì luôn
   trỏ bản mới nhất, khỏi phải nhớ đổi. */
const MODEL_MAC_DINH = 'gemini-3.7-flash';

/* Trần dùng chung cho cả instance: 50 câu / 10 phút. Hạn mức mỗi ngày của
   từng người chơi nằm ở phía trang (localStorage) — chỗ này chỉ để một người
   nghịch ngợm không đốt sạch quota. */
const CUA_SO = 10 * 60 * 1000;
const TRAN = 50;
let moc = Date.now(), daGoi = 0;

function quaTay() {
  const now = Date.now();
  if (now - moc > CUA_SO) { moc = now; daGoi = 0; }
  if (daGoi >= TRAN) return true;
  daGoi++;
  return false;
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ loi: 'sai_phuong_thuc' });

  const key = process.env.GEMINI_KEY;
  if (!key) return res.status(200).json({ loi: 'chua_co_khoa' });
  if (quaTay()) return res.status(200).json({ loi: 'qua_tay' });

  let body = req.body;
  if (typeof body === 'string') { try { body = JSON.parse(body); } catch (e) { body = {}; } }
  body = body || {};

  const hoi = String(body.hoi || '').slice(0, 400).trim();
  if (!hoi) return res.status(200).json({ loi: 'rong' });

  /* Lịch sử gần nhất, tối đa 6 lượt, mỗi lượt cắt còn 400 ký tự */
  const su = Array.isArray(body.su) ? body.su.slice(-6) : [];
  const contents = [];
  for (const m of su) {
    const t = String((m && m.text) || '').slice(0, 400);
    if (!t) continue;
    contents.push({ role: m.vai === 'npc' ? 'model' : 'user', parts: [{ text: t }] });
  }
  contents.push({ role: 'user', parts: [{ text: hoi }] });

  /* Giọng nhân vật lấy từ file bên máy chủ. Trang có gửi `tinh_cach` lên thì
     cũng bỏ qua — không để người ngoài tự đặt lời cho nhân vật. */
  const tinhCach = TINH_CACH;
  const model = process.env.GEMINI_MODEL || MODEL_MAC_DINH;

  try {
    const r = await fetch(
      'https://generativelanguage.googleapis.com/v1beta/models/' + model + ':generateContent',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-goog-api-key': key },
        body: JSON.stringify({
          contents,
          systemInstruction: tinhCach ? { parts: [{ text: tinhCach }] } : undefined,
          generationConfig: { temperature: 0.9, maxOutputTokens: 400 },
          safetySettings: [
            'HARM_CATEGORY_HARASSMENT', 'HARM_CATEGORY_HATE_SPEECH',
            'HARM_CATEGORY_SEXUALLY_EXPLICIT', 'HARM_CATEGORY_DANGEROUS_CONTENT'
          ].map(category => ({ category, threshold: 'BLOCK_ONLY_HIGH' }))
        })
      }
    );

    if (!r.ok) {
      console.log('[CHAT] gemini hỏng:', r.status, (await r.text()).slice(0, 300));
      return res.status(200).json({ loi: 'gemini_hong' });
    }

    const j = await r.json();
    const parts = ((j.candidates || [])[0] || {}).content || {};
    const dap = ((parts.parts || []).map(p => p.text || '').join('')).trim();
    if (!dap) return res.status(200).json({ loi: 'rong_dap' });

    /* Một câu trả lời quá dài sẽ tràn hộp thoại pixel — chốt lại cho gọn */
    return res.status(200).json({ dap: dap.replace(/\s+/g, ' ').slice(0, 600) });
  } catch (e) {
    console.log('[CHAT] lỗi:', e && e.message);
    return res.status(200).json({ loi: 'mang_hong' });
  }
};
