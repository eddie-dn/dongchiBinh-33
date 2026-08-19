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

/* ═══ VÌ SAO CÂU TRẢ LỜI HAY BỊ CỤT — VÀ HAY BÁO LỖI ═════════════════════════
   Bản trước đặt `maxOutputTokens: 400`. Hai chuyện xảy ra cùng lúc:

   1. 400 token tiếng Việt chỉ được chừng 250-350 ký tự. Câu nào dài hơn là bị
      cắt ngang giữa chừng — đúng cái "trả lời không hết ý".
   2. NẶNG HƠN: các model Flash đời mới (2.5 trở đi) có bước "suy nghĩ" nội bộ,
      và bước đó ĂN CHUNG hạn mức `maxOutputTokens`. Câu hỏi càng sâu thì nghĩ
      càng lâu, có khi tiêu sạch 400 token trước khi kịp viết chữ nào. Lúc đó
      Google trả về `finishReason: MAX_TOKENS` với phần chữ RỖNG, mã cũ thấy
      rỗng thì báo lỗi. Đó chính là kiểu "hỏi 11 câu lỗi 6 câu": câu dễ thì
      xong, câu khó thì trượt — càng hỏi sâu càng hay hỏng.

   Nay: TẮT HẲN bước suy nghĩ (`thinkingBudget: 0`) và nới hạn mức lên 1600.
   Tắt suy nghĩ vừa trả lại toàn bộ token cho phần chữ, vừa rút ngắn thời gian
   chờ — hàm serverless có trần thời gian, nghĩ lâu quá là đứt kết nối, lại
   thành một kiểu lỗi nữa.

   TRẦN THỜI GIAN: 9 giây, đặt bằng AbortController. Chọn 9 vì gói Hobby của
   Vercel cắt hàm ở 10 giây — phải tự dừng TRƯỚC mốc đó thì mới kịp trả về một
   lỗi gọn gàng; để nền tảng cắt thì trang chỉ nhận được một cú fetch chết,
   không hiện được câu gì tử tế. Tắt suy nghĩ rồi thì Flash trả lời trong
   1-3 giây, 9 giây là rộng rãi. Nâng gói thì nới số này lên cũng được. */
const MAX_TOKEN   = 1600;
const HET_GIO_MS  = 9000;
/* Trần ký tự trả về trang. Hộp thoại pixel gõ từng chữ nên dài quá thì người
   chơi ngồi đợi; 900 là mức vừa đủ một đoạn trọn ý. Cắt Ở CUỐI CÂU chứ không
   cắt giữa từ như bản trước. */
const TRAN_KY_TU  = 900;

function goiGemini(model, key, contents, tinhCach, tatSuyNghi) {
  const generationConfig = { temperature: 0.9, maxOutputTokens: MAX_TOKEN };
  if (tatSuyNghi) generationConfig.thinkingConfig = { thinkingBudget: 0 };

  const stop = new AbortController();
  const hen = setTimeout(() => stop.abort(), HET_GIO_MS);
  return fetch(
    'https://generativelanguage.googleapis.com/v1beta/models/' + model + ':generateContent',
    {
      method: 'POST',
      signal: stop.signal,
      headers: { 'Content-Type': 'application/json', 'x-goog-api-key': key },
      body: JSON.stringify({
        contents,
        systemInstruction: tinhCach ? { parts: [{ text: tinhCach }] } : undefined,
        generationConfig,
        safetySettings: [
          'HARM_CATEGORY_HARASSMENT', 'HARM_CATEGORY_HATE_SPEECH',
          'HARM_CATEGORY_SEXUALLY_EXPLICIT', 'HARM_CATEGORY_DANGEROUS_CONTENT'
        ].map(category => ({ category, threshold: 'BLOCK_ONLY_HIGH' }))
      })
    }
  ).finally(() => clearTimeout(hen));
}

/* Dọn chữ trước khi trả về trang.
   KHÔNG dùng `replace(/\s+/g,' ')` như bản cũ: nó gộp luôn cả dấu xuống dòng,
   đoạn nào ra đoạn nấy thành một khối chữ liền. Ở đây chỉ gộp khoảng trắng
   TRONG một dòng, còn chỗ ngắt đoạn thì giữ.
   Quá dài thì lùi về DẤU CHẤM CÂU gần nhất — cắt giữa từ đọc như bị rớt mạng. */
function gonLai(t) {
  let s = t.replace(/[ \t]+/g, ' ').replace(/\n{3,}/g, '\n\n').trim();
  if (s.length <= TRAN_KY_TU) return s;
  const cat = s.slice(0, TRAN_KY_TU);
  const het = Math.max(cat.lastIndexOf('. '), cat.lastIndexOf('! '),
                       cat.lastIndexOf('? '), cat.lastIndexOf('\n'));
  return (het > TRAN_KY_TU * 0.5 ? cat.slice(0, het + 1) : cat).trim();
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
    let r = await goiGemini(model, key, contents, tinhCach, true);
    /* Model đời cũ không biết `thinkingConfig` thì Google trả 400 chứ không bỏ
       qua. Gặp đúng 400 thì gọi lại một lần, lần này bỏ khoá đó ra — nhờ vậy
       đổi GEMINI_MODEL sang bản nào cũng chạy, không phải sửa mã. */
    if (r && r.status === 400) {
      console.log('[CHAT] model không nhận thinkingConfig — gọi lại kiểu cũ');
      r = await goiGemini(model, key, contents, tinhCach, false);
    }

    if (!r.ok) {
      console.log('[CHAT] gemini hỏng:', r.status, (await r.text()).slice(0, 300));
      return res.status(200).json({ loi: 'gemini_hong' });
    }

    const j = await r.json();
    const cand = (j.candidates || [])[0] || {};
    const dap = (((cand.content || {}).parts || []).map(p => p.text || '').join('')).trim();

    if (!dap) {
      /* Ghi rõ VÌ SAO rỗng thì lần sau mở log là biết ngay: hết token, bị chặn
         nội dung, hay model trả về đúng chuỗi rỗng. */
      console.log('[CHAT] không có chữ nào · finishReason =', cand.finishReason,
                  '· blockReason =', ((j.promptFeedback || {}).blockReason) || '-',
                  '· usage =', JSON.stringify(j.usageMetadata || {}));
      return res.status(200).json({ loi: 'rong_dap' });
    }

    return res.status(200).json({ dap: gonLai(dap) });
  } catch (e) {
    console.log('[CHAT] lỗi:', e && e.message);
    return res.status(200).json({ loi: 'mang_hong' });
  }
};
