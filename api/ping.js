/**
 * /api/ping — nhận tín hiệu tiến độ từ trang chủ rồi bắn về Telegram hoặc Discord.
 *
 * Biến môi trường cần khai ở Vercel → Settings → Environment Variables:
 *
 *   NOTIFY_KIND = telegram | discord | off
 *
 *   Nếu telegram:  TG_TOKEN = token bot lấy từ @BotFather
 *                  TG_CHAT  = id đoạn chat (nhắn cho bot một câu rồi mở
 *                             https://api.telegram.org/bot<TOKEN>/getUpdates để lấy)
 *
 *   Nếu discord:   NOTIFY_URL = webhook URL của kênh
 *
 * Không khai gì thì endpoint vẫn chạy, chỉ ghi console.log (xem ở tab Logs của Vercel).
 */

const NHAN = {
  ghe_tham:      'Vừa mở bản đồ',
  tai_lai:       'Tải lại trang',
  mo_ho_so:      'Mở hồ sơ toạ độ',
  chon_kenh:     'CHỐT KÊNH BẮT SÓNG',
  mo_khoa_morse: 'Bắt được mã morse',
  mo_hop:        'Đã tìm ra Hộp pí mật',
  doi_tab:       'Đổi tab trong hộp',
  giai_dung:     'GIẢI ĐÚNG mật thư',
  giai_sai:      'Đoán sai mật thư',
  hoan_thanh:    'ĐÃ GIẢI HẾT 4/4 MẬT THƯ',
  reset:         'Bấm chơi lại từ đầu',
  vao_ho_so:     'Bấm vào đọc hồ sơ',
  ho_so_mo:      'Vào trong hồ sơ',
  trang_ho_so:   'Xem trang hồ sơ',
  ho_so_dong:    'Rời hồ sơ',
  tai_trang:     'Tải trang (beacon ảnh)',
  gui_form:      'ĐÃ GỬI BIỂU MẪU VỀ CĂN CỨ'
};

function gioVN(iso) {
  try {
    return new Date(iso).toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' });
  } catch (e) {
    return iso;
  }
}

/* ---- Chống spam ----
   Endpoint không có xác thực nên ai cũng gọi được. Ba lớp chặn:
   1. Bỏ qua sự kiện lạ (không có trong bảng NHAN).
   2. Cùng một sự kiện + chi tiết trong vòng GAP_MS thì chỉ gửi một lần.
   3. Trần MAX_PER_MIN tin mỗi phút cho mỗi instance; vượt thì vẫn trả 204/ảnh
      nhưng không bắn Telegram nữa.
   Bộ nhớ nằm trong RAM của instance, mất khi instance ngủ — đủ cho quy mô này,
   không cần thêm database. */
const GAP_MS = 8000;
const MAX_PER_MIN = 25;
const recent = new Map();
let windowStart = Date.now(), sentInWindow = 0;

function throttled(key){
  const now = Date.now();
  if(now - windowStart > 60000){ windowStart = now; sentInWindow = 0; }
  if(sentInWindow >= MAX_PER_MIN) return true;
  const last = recent.get(key);
  if(last && now - last < GAP_MS) return true;
  recent.set(key, now);
  if(recent.size > 500) recent.clear();
  sentInWindow++;
  return false;
}

module.exports = async (req, res) => {
  let d = {};

  if (req.method === 'GET') {
    /* Đường cứu cánh: trang gọi bằng request ảnh khi fetch/beacon bị chặn.
       Phải trả về ảnh thật, nếu không trình duyệt báo lỗi tải ảnh. */
    d = { ev: req.query.ev, detail: req.query.detail, at: new Date().toISOString() };
  } else if (req.method === 'POST') {
    d = req.body;
    if (typeof d === 'string') {
      try { d = JSON.parse(d); } catch (e) { d = {}; }
    }
    d = d || {};
  } else {
    res.status(405).json({ ok: false });
    return;
  }

  const ev = String(d.ev || '').slice(0, 40);
  const detail = String(d.detail || '').slice(0, 80);
  const solved = Array.isArray(d.solved) ? d.solved.slice(0, 8) : [];
  const may = String(d.ua || '').slice(0, 120);

  const dong = [
    'BẢN ĐỒ TÁC CHIẾN',
    (NHAN[ev] || ev) + (detail ? ' — ' + detail : ''),
    'Đã giải: ' + (solved.length ? solved.join(', ') : 'chưa cái nào') +
      ' (' + solved.length + '/4)',
    gioVN(d.at || new Date().toISOString()),
    may
  ];
  const text = dong.join('\n');

  console.log('[PING]', JSON.stringify({ ev, detail, solved, at: d.at }));

  if (!NHAN[ev]) {                      /* sự kiện lạ → chỉ ghi log, không gửi đi */
    return finish(req, res);
  }
  if (throttled(ev + '|' + detail)) {
    return finish(req, res);
  }

  const kind = process.env.NOTIFY_KIND;
  try {
    if (kind === 'telegram' && process.env.TG_TOKEN && process.env.TG_CHAT) {
      await fetch('https://api.telegram.org/bot' + process.env.TG_TOKEN + '/sendMessage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: process.env.TG_CHAT, text, disable_notification: false })
      });
    } else if (kind === 'discord' && process.env.NOTIFY_URL) {
      await fetch(process.env.NOTIFY_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: '```\n' + text + '\n```' })
      });
    }
  } catch (e) {
    console.log('[PING] gửi thất bại:', e && e.message);
  }

  return finish(req, res);
};

function finish(req, res){
  if (req.method === 'GET') {
    /* GIF trong suốt 1x1 — dùng cho thẻ <img> beacon, chạy cả khi JS bị chặn */
    const gif = Buffer.from(
      'R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7', 'base64');
    res.setHeader('Content-Type', 'image/gif');
    res.setHeader('Cache-Control', 'no-store, max-age=0');
    res.status(200).send(gif);
    return;
  }
  res.status(204).end();
}
