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

   ── TẮT HẲN SUY NGHĨ HAY CHỈ GIỚI HẠN? ────────────────────────────────────
   Bản trước tắt hẳn (`thinkingBudget: 0`). Chạy thì hết lỗi thật, nhưng tắt
   hẳn là quá tay: nhân vật này sinh ra để trả lời mấy câu nặng — tự vấn, chữa
   lành, trích Jung với Seneca. Mấy câu đó model có nghĩ một nhịp thì chọn được
   góc nhìn sắc hơn; tắt hẳn thì câu trả lời trôi chảy nhưng nhạt, kiểu bốc đại
   một câu mẫu gần giống rồi chép lại.
   Mà THỦ PHẠM THẬT chưa bao giờ là chuyện có nghĩ hay không — là chuyện nghĩ
   và viết ĂN CHUNG một hạn mức 400 quá chật. Nới lên 1600 rồi thì chỉ cần
   ĐÓNG KHUNG phần nghĩ lại: cho nghĩ trong `THINK_TOKEN`, phần còn lại
   (1600 - 512 = hơn 1000 token) luôn dành sẵn cho chữ. Vừa giữ được chiều
   sâu, vừa không bao giờ hết token trước khi kịp viết.
   Muốn tắt hẳn cho nhanh thì đặt biến môi trường GEMINI_THINK=0; muốn nghĩ
   sâu hơn thì nâng số đó lên. Không cần sửa mã.

   TRẦN THỜI GIAN: đặt bằng AbortController, và phải NHỎ HƠN trần của nền
   tảng — để nền tảng cắt thì trang chỉ nhận được một cú fetch chết, không
   hiện được câu gì tử tế. Đời trước để 9 giây vì mặc định Vercel cắt hàm ở
   10; số đó chật đến mức hỏi câu nào cũng bị cắt. Nay `vercel.json` khai
   `maxDuration: 30` cho cả thư mục api, nên trần ở đây mới nới ra được —
   xem khối ⚠ ngay trên chỗ khai `HET_GIO_MS`. */
/* ═══ NHẬT KÝ CUỘC TRÒ CHUYỆN ═════════════════════════════════════════════
   TÌNH TRẠNG TRƯỚC BẢN NÀY: KHÔNG có gì cả. Hàm chỉ `console.log` mấy dòng
   chữ khi hỏng, mà log của Vercel thì gói Hobby giữ khoảng một tiếng rồi mất.
   Không có chỗ nào biết được hôm qua người chơi hỏi gì, câu nào bị chặn, câu
   nào hết token. Và KHÔNG có gì trong dự án này đụng tới GCP — Gemini chỉ là
   một endpoint HTTP, gọi nó không tạo ra log nào bên Google Cloud cả.

   BẢN NÀY LÀM HAI VIỆC:
   1. Mỗi lượt hỏi ghi ĐÚNG MỘT DÒNG JSON có cấu trúc (prefix `[CHAT_LOG]`).
      Dòng có cấu trúc thì mọi bộ thu log đều đọc được — Vercel Log Drain,
      Google Cloud Logging, BigQuery, hay chỉ là mắt người đọc tab Logs.
   2. Nếu khai biến CHAT_LOG_URL thì bắn luôn dòng đó tới đấy bằng POST.
      Bắn xong không chờ, hỏng cũng bỏ qua — nhật ký KHÔNG BAO GIỜ được phép
      làm chậm hay làm hỏng câu trả lời cho người chơi.

   RIÊNG TƯ: mặc định CHỈ ghi số liệu (độ dài câu, thời gian, model, thành hay
   bại), KHÔNG ghi nội dung. Đoạn chat này có chuyện riêng của hai người. Muốn
   ghi cả nội dung thì phải tự bật CHAT_LOG_NOI_DUNG=1 — cố ý bắt khai riêng
   một biến nữa để không ai bật nhầm.

   BƯỚC TIẾP THEO nếu muốn đẩy về GCP thật: xem mục "MỤC 8" trong file hướng
   dẫn kèm theo bản sửa này. */
const LOG_URL     = process.env.CHAT_LOG_URL || '';
const LOG_NOI_DUNG = process.env.CHAT_LOG_NOI_DUNG === '1';

function ghiNhatKy(o) {
  const dong = Object.assign({ luc: new Date().toISOString(), nguon: 'open-world' }, o);
  /* Một dòng JSON — đừng xuống dòng, bộ thu log nào cũng gom theo dòng */
  console.log('[CHAT_LOG]', JSON.stringify(dong));
  if (!LOG_URL) return;
  try {
    /* KHÔNG await: người chơi không phải chờ cái nhật ký này */
    fetch(LOG_URL, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(dong)
    }).catch(() => {});
  } catch (e) {}
}

/* ⚠ VÌ SAO KHU OPEN WORLD IM BẶT — VÀ VÌ SAO BẢN TRƯỚC THÌ KHÔNG.
   BỆNH ĐÃ SỬA: hỏi câu nào cũng ra "lỗi đường truyền". Log máy chủ chỉ có một
   dòng, lặp lại y hệt sau MỌI câu hỏi:

       [CHAT] lỗi: This operation was aborted        ms: 9002

   `ms` gần đúng 9000 tuyệt đối, không xê dịch — nghĩa là KHÔNG PHẢI Google
   trả lời hỏng, mà là chính mình cắt máy đang nói dở. Ba con số dưới đây cộng
   lại thành cái bẫy:

     · trần thời gian 9 giây — đặt sát ngay dưới mốc 10 giây mà Vercel cắt hàm,
       nên không còn một nhịp dư nào;
     · trần chữ 1600 token — model viết đủ 1600 rồi mới trả về, mà trang thì
       chỉ hiện 900 KÝ TỰ (~300 token): ngồi chờ gấp năm lần lượng chữ dùng tới;
     · thêm 512 token cho bước suy nghĩ, nghĩ xong mới bắt đầu viết.

   Đem cộng với đoạn tính cách hơn hai vạn ký tự gửi kèm mỗi lượt thì 9 giây
   là không bao giờ đủ. Bản chạy được trước đây không dính vì nó chưa có bước
   suy nghĩ và chỉ xin 400 token — viết ngắn nên kịp về.

   NAY SỬA CẢ BA, cộng một đường lùi:
     1. Nới trần hàm lên 30 giây (`maxDuration` trong vercel.json) rồi mới đặt
        trần thời gian ở đây — chứ không phải bóp mình cho vừa mốc 10 giây.
     2. Xin đúng lượng chữ dùng tới, thay vì xin thừa rồi cắt bỏ.
     3. Cắt giữa chừng thì HỎI LẠI MỘT LẦN, lần này bỏ bước suy nghĩ và xin
        ngắn hơn — thà một câu trả lời mộc còn hơn một câu báo lỗi. */
/* Trần chữ: trang chỉ hiện `TRAN_KY_TU` ký tự, mà tiếng Việt rơi vào quãng
   3 ký tự một token — 900 ký tự ≈ 300 token. Để 1200 là đã rộng gấp ba, thừa
   chỗ cho câu dài mà không phải ngồi đợi model viết thứ sẽ bị cắt đi. */
const MAX_TOKEN   = 1200;
/* Trần cho bước suy nghĩ. Đọc từ GEMINI_THINK nếu có; 0 = tắt hẳn.
   Phải NHỎ HƠN HẲN MAX_TOKEN, vì hai thứ ăn chung một hạn mức. */
const THINK_TOKEN = (() => {
  const v = parseInt(process.env.GEMINI_THINK, 10);
  return Number.isFinite(v) && v >= 0 ? Math.min(v, Math.floor(MAX_TOKEN * 0.5)) : 256;
})();
/* Hai trần thời gian, KHÔNG phải một. Lượt đầu được thong thả; nếu bị cắt thì
   lượt gỡ phải gọn để cả hai cộng lại còn nằm trong `maxDuration` 30 giây
   (16 + 10 = 26, dư 4 giây cho lúc dựng hàm và dọn chữ).
   Đổi được bằng biến môi trường GEMINI_HET_GIO, khỏi phải sửa mã. */
const HET_GIO_MS  = (() => {
  const v = parseInt(process.env.GEMINI_HET_GIO, 10);
  return Number.isFinite(v) && v >= 3000 ? Math.min(v, 25000) : 16000;
})();
/* Trần của cả HÀM, khai ở `vercel.json` — chép lại đây để tính lượt gỡ.
   Sửa một bên thì sửa cả bên kia, nếu không nền tảng cắt trước và người chơi
   mất luôn câu báo lỗi tử tế. */
const TRAN_HAM    = 30000;
/* Lượt gỡ ăn phần thời gian CÒN LẠI, chừa 4 giây cho lúc dựng hàm và dọn chữ.
   Tính chứ không ghi cứng: ai đó nâng GEMINI_HET_GIO lên kịch trần 25 giây mà
   lượt gỡ vẫn cố xin thêm 10 giây nữa thì tổng vượt 30, hỏng đúng cái vừa sửa. */
const HET_GIO_GO  = Math.max(4000, TRAN_HAM - HET_GIO_MS - 4000);
/* Trần ký tự trả về trang. Hộp thoại pixel gõ từng chữ nên dài quá thì người
   chơi ngồi đợi; 900 là mức vừa đủ một đoạn trọn ý. Cắt Ở CUỐI CÂU chứ không
   cắt giữa từ như bản trước. */
const TRAN_KY_TU  = 900;

function goiGemini(model, key, contents, tinhCach, dongKhungSuyNghi, hetGio, tranChu) {
  const generationConfig = { temperature: 0.9, maxOutputTokens: tranChu || MAX_TOKEN };
  if (dongKhungSuyNghi && THINK_TOKEN > 0) {
    generationConfig.thinkingConfig = { thinkingBudget: THINK_TOKEN };
  }

  const stop = new AbortController();
  const hen = setTimeout(() => stop.abort(), hetGio || HET_GIO_MS);
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

  const batDau = Date.now();
  /* Có phải cú ngã do HẾT GIỜ không — phân biệt với mạng đứt hay Google chết.
     `AbortController` ném ra `AbortError`; tên lỗi mới là thứ chắc chắn, còn
     câu chữ trong `message` thì mỗi đời Node viết một kiểu. */
  const laHetGio = e => !!e && (e.name === 'AbortError' || /abort/i.test(e.message || ''));
  let goLai = false;
  try {
    let r;
    try {
      r = await goiGemini(model, key, contents, tinhCach, true, HET_GIO_MS);
    } catch (e) {
      if (!laHetGio(e)) throw e;
      /* ĐƯỜNG LÙI: lượt đầu bị cắt giữa chừng. Hỏi lại NGAY, lần này bỏ hẳn
         bước suy nghĩ và xin ngắn hơn — nhanh hơn hẳn vì model viết thẳng
         không nghĩ. Thà một câu mộc còn hơn một câu báo lỗi đường truyền. */
      console.log('[CHAT] lượt đầu hết giờ — hỏi lại kiểu mộc, không nghĩ');
      goLai = true;
      r = await goiGemini(model, key, contents, tinhCach, false,
                          HET_GIO_GO, Math.floor(MAX_TOKEN * 0.6));
    }
    /* Model đời cũ không biết `thinkingConfig` thì Google trả 400 chứ không bỏ
       qua. Gặp đúng 400 thì gọi lại một lần, lần này bỏ khoá đó ra — nhờ vậy
       đổi GEMINI_MODEL sang bản nào cũng chạy, không phải sửa mã.
       (Model cũ vốn không có bước suy nghĩ nên bỏ khoá đi cũng không mất gì.) */
    if (r && r.status === 400 && !goLai) {
      console.log('[CHAT] model không nhận thinkingConfig — gọi lại kiểu cũ');
      goLai = true;
      r = await goiGemini(model, key, contents, tinhCach, false, HET_GIO_GO);
    }

    if (!r.ok) {
      const chiTiet = (await r.text()).slice(0, 300);
      console.log('[CHAT] gemini hỏng:', r.status, chiTiet);
      ghiNhatKy({ ok: false, ly_do: 'gemini_hong', http: r.status, model,
                  ms: Date.now() - batDau, hoi_dai: hoi.length, go_lai: goLai });
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
      ghiNhatKy({ ok: false, ly_do: 'rong_dap', model, ms: Date.now() - batDau,
                  hoi_dai: hoi.length, finish: cand.finishReason || '',
                  block: ((j.promptFeedback || {}).blockReason) || '',
                  token: j.usageMetadata || {} });
      return res.status(200).json({ loi: 'rong_dap' });
    }

    const raChu = gonLai(dap);
    ghiNhatKy(Object.assign({
      ok: true, model, ms: Date.now() - batDau, go_lai: goLai,
      hoi_dai: hoi.length, dap_dai: raChu.length,
      luot_su: su.length, token: j.usageMetadata || {}
    }, LOG_NOI_DUNG ? { hoi: hoi, dap: raChu } : {}));
    return res.status(200).json({ dap: raChu });
  } catch (e) {
    console.log('[CHAT] lỗi:', e && e.message);
    ghiNhatKy({ ok: false, ly_do: laHetGio(e) ? 'het_gio' : 'mang_hong',
                loi: String((e && e.message) || ''), go_lai: goLai,
                ms: Date.now() - batDau, hoi_dai: hoi.length });
    return res.status(200).json({ loi: 'mang_hong' });
  }
};
