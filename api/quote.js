/**
 * /api/quote — MỘT câu chào cho hộp Greetings ngoài bản đồ.
 *
 * Chữ nghĩa KHÔNG nằm ở file này. Lời dặn gửi cho Gemini và bộ câu sẵn đều ở
 * `api/_lib/loichao.md` — sửa câu chào thì mở file đó, không phải file này.
 * File đó TÁCH HẲN khỏi `tinhcach.md` (giọng nhân vật trong khu Open World).
 *
 * Gọi thế nào:
 *     GET /api/quote?gio=<0..23>
 *     GET /api/quote?buoi=sang|trua|toi     (ép cứng, để thử cho nhanh)
 *
 * `gio` là GIỜ MÁY NGƯỜI CHƠI, do trang gửi lên. Bắt buộc phải vậy: hàm
 * serverless chạy ở máy chủ nào thì mang giờ máy đó, chào "buổi sáng" lúc
 * người ta sắp đi ngủ là hỏng cả ý. Không gửi gì thì coi như buổi sáng.
 *
 * Trả: { q, buoi, src }  ·  src = 'gemini' | 'san'
 *
 * Khoá Gemini nằm ở BIẾN MÔI TRƯỜNG trên Vercel, không bao giờ xuống trình
 * duyệt. Chưa khai khoá — hoặc Gemini chậm, hỏng, trả câu không dùng được —
 * thì endpoint vẫn trả 200 kèm một câu trong bộ câu sẵn. Hộp chào không bao
 * giờ trống và người chơi không bao giờ thấy lỗi cấu hình.
 */

let LOI_CHAO = null, buoiTheoGio = null;
try {
  const m = require('./_lib/loichao.js');
  LOI_CHAO = m.LOI_CHAO; buoiTheoGio = m.buoiTheoGio;
} catch (e) {
  console.log('[QUOTE] chưa nạp được loichao:', e && e.message);
}

/* Dự phòng cuối cùng nếu ngay cả bộ nạp cũng hỏng — không bao giờ để trống */
const CUOI_CUNG = ['Chào đồng chí ✦ Mỗi ngày là một ngày mới'];

/* Chậm quá thì thôi: hộp chào chỉ là lời chào, bắt người ta chờ là dở. Trang
   cũng tự bỏ cuộc sau 2,5 giây nên số này phải nhỏ hơn khoảng đó. */
const HET_GIO_MS = 2200;

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

  const key = process.env.GEMINI_KEY || process.env.GOOGLE_API_KEY;
  if (!key || !khoi.nhac) {
    return res.status(200).end(JSON.stringify({ q: roi(), buoi, src: 'san' }));
  }

  try {
    const model = process.env.GEMINI_MODEL || 'gemini-2.0-flash';
    const ac = new AbortController();
    const hen = setTimeout(() => ac.abort(), HET_GIO_MS);
    const r = await fetch(
      'https://generativelanguage.googleapis.com/v1beta/models/' + model + ':generateContent',
      {
        method: 'POST', signal: ac.signal,
        headers: { 'content-type': 'application/json', 'x-goog-api-key': key },
        body: JSON.stringify({
          contents: [{ parts: [{ text: khoi.nhac }] }],
          /* temperature 1 cho mỗi lần một câu khác hẳn — đây là chỗ DUY NHẤT
             cần ngẫu nhiên thật, chào giống hệt hôm qua thì thà lấy câu sẵn. */
          generationConfig: { temperature: 1, maxOutputTokens: 80 }
        })
      }
    ).finally(() => clearTimeout(hen));

    if (!r.ok) throw new Error('gemini ' + r.status);
    const j = await r.json();
    const parts = (((j.candidates || [])[0] || {}).content || {}).parts || [];
    const cau = parts.map(p => p.text || '').join('')
                     .trim()
                     .replace(/^["'“”]+|["'“”]+$/g, '')
                     .replace(/\s+/g, ' ');
    /* Câu rỗng, câu dài lê thê, hay câu xuống dòng be bét đều bỏ — hộp chào chỉ
       vừa MỘT dòng, thà lấy câu sẵn còn hơn để nó tràn ra ngoài khung. */
    if (!cau || cau.length > 120) throw new Error('câu không dùng được');
    return res.status(200).end(JSON.stringify({ q: cau, buoi, src: 'gemini' }));
  } catch (e) {
    return res.status(200).end(JSON.stringify({ q: roi(), buoi, src: 'san' }));
  }
};
