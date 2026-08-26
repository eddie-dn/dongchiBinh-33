/**
 * /api/thu — nhận "lời nhắn gửi tổ kỹ thuật" từ khung Tổ kỹ thuật rồi chuyển về hòm thư.
 *
 * Hai đường gửi, chạy SONG SONG, đường nào bật thì đi đường đó:
 *
 *   1. EMAIL — cần biến môi trường:
 *        RESEND_KEY  = API key của resend.com (gói miễn phí đủ dùng)
 *        MAIL_TO     = hòm thư nhận (mặc định honghandn@gmail.com)
 *        MAIL_FROM   = địa chỉ gửi đã xác thực ở Resend
 *                      (chưa có tên miền riêng thì để onboarding@resend.dev)
 *
 *   2. TELEGRAM — dùng lại đúng biến của /api/ping (NOTIFY_KIND=telegram,
 *      TG_TOKEN, TG_CHAT). Luôn gửi nếu có, để lời nhắn không bao giờ mất
 *      kể cả khi chưa kịp khai key email.
 *
 * Không khai gì thì vẫn trả 200 và ghi console.log — người gửi không thấy lỗi,
 * nội dung nằm ở tab Logs của Vercel.
 */

const MAIL_TO_MAC_DINH = 'honghandn@gmail.com';

/* ═══ CHÉP VỀ SỔ LƯU ═══════════════════════════════════════════════════════
   Đời trước lời nhắn CHỈ đi email + Telegram. Nghĩa là muốn đọc lại một lời
   nhắn cũ thì phải đi lục hòm thư, mà chuông Telegram thì trôi mất theo dòng.
   Nay chép thêm một dòng vào sổ, đúng khuôn `chepVeSheet` của /api/ping:
   bắn đi rồi thôi, KHÔNG await, hỏng cũng không được làm phiền người gửi. */
function chepVeSheet(o) {
  const url = process.env.SHEET_URL;
  if (!url) return;
  try {
    fetch(url, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(Object.assign({ loai: 'thu' }, o))
    }).then(async r => {
      let noi = '';
      try { noi = (await r.text()).slice(0, 200); } catch (e) {}
      console.log('[SHEET/thu]', r.status, noi);
    }).catch(e => console.log('[SHEET/thu] hỏng:', e && e.message));
  } catch (e) { console.log('[SHEET/thu] hỏng ngay:', e && e.message); }
}

/* Chống spam: cùng một instance, tối đa 6 lời nhắn mỗi 10 phút. Lời nhắn là
   hành động cố ý của người dùng nên trần rộng hơn /api/ping. */
const CUA_SO = 10 * 60 * 1000;
const TRAN = 6;
let moc = Date.now(), daGui = 0;

function quaTay() {
  const now = Date.now();
  if (now - moc > CUA_SO) { moc = now; daGui = 0; }
  if (daGui >= TRAN) return true;
  daGui++;
  return false;
}

function gioVN(iso) {
  try {
    return new Date(iso).toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' });
  } catch (e) {
    return iso;
  }
}

async function guiEmail(text, loi) {
  const key = process.env.RESEND_KEY;
  if (!key) return false;
  const r = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { 'Authorization': 'Bearer ' + key, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: process.env.MAIL_FROM || 'onboarding@resend.dev',
      to: [process.env.MAIL_TO || MAIL_TO_MAC_DINH],
      subject: 'Tâm tư từ Bản đồ tác chiến — ' + loi.slice(0, 40),
      text: text
    })
  });
  if (!r.ok) console.log('[THU] email hỏng:', r.status, (await r.text()).slice(0, 200));
  return r.ok;
}

async function guiTelegram(text) {
  const token = process.env.TG_TOKEN, chat = process.env.TG_CHAT;
  if (process.env.NOTIFY_KIND !== 'telegram' || !token || !chat) return false;
  const r = await fetch('https://api.telegram.org/bot' + token + '/sendMessage', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chat, text: text })
  });
  return r.ok;
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).json({ ok: false });
    return;
  }

  let d = req.body;
  if (typeof d === 'string') { try { d = JSON.parse(d); } catch (e) { d = {}; } }
  d = d || {};

  const loi = String(d.loi || '').slice(0, 600).trim();
  const tu = String(d.tu || 'không rõ').slice(0, 40);
  const may = String(d.ua || '').slice(0, 120);
  const at = String(d.at || new Date().toISOString());

  if (!loi) {
    res.status(400).json({ ok: false, vi: 'trống' });
    return;
  }

  const text = [
    'TÂM TƯ GỬI TỔ KỸ THUẬT',
    'Từ: ' + tu,
    'Lúc: ' + gioVN(at),
    '',
    loi,
    '',
    may
  ].join('\n');

  console.log('[THU]', JSON.stringify({ tu, loi: loi.slice(0, 120), at }));

  if (quaTay()) {                     /* quá trần thì im lặng nuốt, không báo lỗi cho người gửi */
    /* Vẫn chép vào sổ: sổ là chỗ LƯU, phải đủ. Cái cần lọc cho đỡ ồn là
       chuông báo, không phải sổ — đúng luật đã chốt ở /api/ping. */
    chepVeSheet({ at, tu, loi, da_gui: 'qua-tran', may });
    res.status(200).json({ ok: true, ghi_chu: 'qua tran' });
    return;
  }

  let xong = false;
  try {
    const kq = await Promise.allSettled([guiEmail(text, loi), guiTelegram(text)]);
    xong = kq.some(k => k.status === 'fulfilled' && k.value);
  } catch (e) {
    console.log('[THU] gửi thất bại:', e && e.message);
  }

  chepVeSheet({ at, tu, loi, da_gui: xong ? 'roi' : 'chua', may });

  /* Chưa khai biến môi trường thì vẫn báo thành công: nội dung đã nằm trong Logs,
     và người gửi không có gì để làm với một lỗi cấu hình phía máy chủ. */
  res.status(200).json({ ok: true, da_gui: xong });
};
