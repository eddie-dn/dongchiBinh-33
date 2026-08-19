/**
 * /api/quote — MỘT câu chào cho hộp Greetings ngoài bản đồ.
 *
 * Chữ nghĩa KHÔNG nằm ở file này. Lời dặn gửi cho Gemini và bộ câu sẵn đều ở
 * `api/_lib/loichao.md` — sửa câu chào thì mở file đó, không phải file này.
 * File đó TÁCH HẲN khỏi `tinhcach.md` (giọng nhân vật trong khu Open World).
 *
 * Gọi thế nào:
 *     GET /api/quote?gio=<0..23>             lời chào theo buổi
 *     GET /api/quote?buoi=sang|trua|toi      ép cứng buổi, để thử cho nhanh
 *     GET /api/quote?buoi=quote              DAILY QUOTE (câu nói người nổi tiếng)
 *
 * Trang xin `buoi=quote` khi các mốc chào của ngày đã xong: từ đó F5 hay quay
 * lại thì hộp hiện một câu quote thay vì chào lại lần nữa.
 *
 * `gio` là GIỜ MÁY NGƯỜI CHƠI, do trang gửi lên. Bắt buộc phải vậy: hàm
 * serverless chạy ở máy chủ nào thì mang giờ máy đó, chào "buổi sáng" lúc
 * người ta sắp đi ngủ là hỏng cả ý. Không gửi gì thì coi như buổi sáng.
 *
 * Trả: { q, tacGia, buoi, src }  ·  src = 'gemini' | 'san'
 *      `tacGia` chỉ có ở khối `quote` — trang hiện nó xuống một dòng riêng.
 *
 * Khoá Gemini nằm ở BIẾN MÔI TRƯỜNG trên Vercel, không bao giờ xuống trình
 * duyệt. Chưa khai khoá — hoặc Gemini chậm, hỏng, trả câu không dùng được —
 * thì endpoint vẫn trả 200 kèm một câu trong bộ câu sẵn. Hộp chào không bao
 * giờ trống và người chơi không bao giờ thấy lỗi cấu hình.
 */

let LOI_CHAO = null, buoiTheoGio = null, tachTacGia = null;
try {
  const m = require('./_lib/loichao.js');
  LOI_CHAO = m.LOI_CHAO; buoiTheoGio = m.buoiTheoGio; tachTacGia = m.tachTacGia;
} catch (e) {
  console.log('[QUOTE] chưa nạp được loichao:', e && e.message);
}

/* Dự phòng cuối cùng nếu ngay cả bộ nạp cũng hỏng — không bao giờ để trống */
const CUOI_CUNG = ['Chào đồng chí ✦ Mỗi ngày là một ngày mới'];

/* Chậm quá thì thôi: hộp chào chỉ là lời chào, bắt người ta chờ là dở. Trang
   cũng tự bỏ cuộc sau 2,5 giây nên số này phải nhỏ hơn khoảng đó. */
const HET_GIO_MS = 2200;

/* ═══ MODEL ═══════════════════════════════════════════════════════════════
   Việc ở đây nhẹ hều: viết đúng MỘT câu ngắn. Dùng bản `flash-lite` cho rẻ và
   nhanh — chờ lâu thì trang đã bỏ cuộc lấy câu sẵn mất rồi, model to cũng vô
   ích. Đổi bằng biến môi trường GEMINI_MODEL_QUOTE trên Vercel, không phải sửa
   mã. Tên mặc định là ALIAS `-latest` nên Google ra bản mới cũng tự theo.
   Lỡ tên model sai / chưa được cấp thì tự lùi về GEMINI_MODEL (model của khu
   Open World), lùi tiếp nữa là bộ câu sẵn — không bao giờ để hộp trống. */
const MODEL_QUOTE = process.env.GEMINI_MODEL_QUOTE || 'gemini-flash-lite-latest';

/* Trần ký tự. Hộp chào chỉ vừa 2-3 dòng: câu nói tối đa ~120 ký tự (2 dòng)
   cộng một dòng tên tác giả là đủ đẹp. Lời chào thì ngắn hơn nhiều. */
const TRAN_QUOTE = 130;
const TRAN_CHAO  = 120;

module.exports = async (req, res) => {
  res.setHeader('content-type', 'application/json; charset=utf-8');
  res.setHeader('cache-control', 'no-store');

  /* Vercel có sẵn req.query; chạy chỗ khác thì tự bóc từ URL cho chắc */
  let q = req.query;
  if (!q) {
    try { q = Object.fromEntries(new URL(req.url, 'http://x').searchParams); }
    catch (e) { q = {}; }
  }

  const buoi = (q.buoi && LOI_CHAO && LOI_CHAO[String(q.buoi).toLowerCase()])
    ? String(q.buoi).toLowerCase()
    : (buoiTheoGio ? buoiTheoGio(q.gio) : 'sang');

  const khoi = (LOI_CHAO && LOI_CHAO[buoi]) || { nhac: '', san: CUOI_CUNG };
  const kho  = (khoi.san && khoi.san.length) ? khoi.san : CUOI_CUNG;
  const roi  = () => kho[Math.floor(Math.random() * kho.length)];

  /* Khối `quote` trả kèm tên tác giả để trang xuống dòng cho gọn */
  const laQuote = buoi === 'quote';
  const dong = t => {
    const x = (laQuote && tachTacGia) ? tachTacGia(t) : { cau: t, tacGia: '' };
    return { q: x.cau, tacGia: x.tacGia, buoi, src: 'san' };
  };

  const key = process.env.GEMINI_KEY || process.env.GOOGLE_API_KEY;
  if (!key || !khoi.nhac) {
    return res.status(200).end(JSON.stringify(dong(roi())));
  }

  const goi = async (model) => {
    const ac = new AbortController();
    const hen = setTimeout(() => ac.abort(), HET_GIO_MS);
    return fetch(
      'https://generativelanguage.googleapis.com/v1beta/models/' + model + ':generateContent',
      {
        method: 'POST', signal: ac.signal,
        headers: { 'content-type': 'application/json', 'x-goog-api-key': key },
        body: JSON.stringify({
          contents: [{ parts: [{ text: khoi.nhac }] }],
          /* temperature 1 cho mỗi lần một câu khác hẳn — đây là chỗ DUY NHẤT
             cần ngẫu nhiên thật, chào giống hệt hôm qua thì thà lấy câu sẵn.
             Quote cần chỗ hơn lời chào một chút vì còn tên tác giả. */
          generationConfig: { temperature: 1, maxOutputTokens: laQuote ? 200 : 80 }
        })
      }
    ).finally(() => clearTimeout(hen));
  };

  try {
    let r = await goi(MODEL_QUOTE);
    /* Tên model sai hoặc chưa được cấp → 404/403. Lùi về model chính một lần,
       khỏi phải sửa mã khi Google đổi tên bản lite. */
    if (r.status === 404 || r.status === 403) {
      console.log('[QUOTE] model', MODEL_QUOTE, 'trả', r.status, '— lùi về GEMINI_MODEL');
      r = await goi(process.env.GEMINI_MODEL || 'gemini-2.0-flash');
    }
    if (!r.ok) throw new Error('gemini ' + r.status);

    const j = await r.json();
    const parts = (((j.candidates || [])[0] || {}).content || {}).parts || [];
    const cau = parts.map(p => p.text || '').join('')
                     .trim()
                     .replace(/^["'“”]+|["'“”]+$/g, '')
                     .replace(/\s+/g, ' ');
    /* Câu rỗng hay dài lê thê thì bỏ — hộp chào chỉ vừa 2-3 dòng, thà lấy câu
       sẵn còn hơn để nó tràn ra ngoài khung. */
    if (!cau || cau.length > (laQuote ? TRAN_QUOTE : TRAN_CHAO)) {
      throw new Error('câu không dùng được');
    }
    const x = dong(cau); x.src = 'gemini';
    return res.status(200).end(JSON.stringify(x));
  } catch (e) {
    return res.status(200).end(JSON.stringify(dong(roi())));
  }
};
