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
  ho_so_dong:    'Rời hồ sơ'
};

function gioVN(iso) {
  try {
    return new Date(iso).toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' });
  } catch (e) {
    return iso;
  }
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).json({ ok: false });
    return;
  }

  let d = req.body;
  if (typeof d === 'string') {
    try { d = JSON.parse(d); } catch (e) { d = {}; }
  }
  d = d || {};

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

  res.status(204).end();
};
