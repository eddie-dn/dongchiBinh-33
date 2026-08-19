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
  mo_ho_so:      'Mở hồ sơ toạ độ',
  chon_kenh:     'CHỐT KÊNH BẮT SÓNG',
  mo_khoa_morse: 'Bắt được mã morse',
  mo_hop:        'Đã tìm ra Hộp pí mật',
  doi_tab:       'Đổi tab trong hộp',
  giai_dung:     'GIẢI ĐÚNG mật thư',
  giai_sai:      'Đoán sai mật thư',
  hoan_thanh:    'ĐÃ GIẢI HẾT 4/4 MẬT THƯ',
  vao_ho_so:     'Bấm vào đọc hồ sơ',
  ho_so_mo:      'Vào trong hồ sơ',
  trang_ho_so:   'Xem trang hồ sơ',
  ho_so_dong:    'Rời hồ sơ',
  gui_form:      'ĐÃ GỬI BIỂU MẪU VỀ CĂN CỨ',

  /* Hệ 3 Mission trên trang bìa hồ sơ DAD-950901-A */
  bam_dong_countdown: 'Bấm dòng Mission trên trang bìa',
  nhay_ban_do_xong:   'Kết quả sau khi nút Bản đồ nháy',
  mo_khoa_m2_cua:     'XONG MISSION 1 — mở cửa sổ Mission 2',
  ve_trang_bia:       'Từ màn Hoàn tất quay về trang bìa',
  sai_pin:            'Nhập sai mã truy cập',
  khoa_pin:           'Khoá ô nhập mã',
  mo_khoa_m2:         'MỞ KHOÁ MISSION 2',
  gia_han_m2:         'Xin gia hạn đồng hồ Mission 2',
  vao_ban_do:         'Bấm sang Bản đồ tác chiến',
  reset_msn:          'Chơi lại Mission từ đầu',
  test_unlock:        'CỬA TEST: tap 10 nhịp mở khoá mission',
  sos_hint:           'Mở thêm gợi ý (SOS hoặc tới giờ)',
  bam_ban_do_khoa:    'Bấm nút Bản đồ khoá tạm (sau M1)',

  /* HAN-961030 — Get to know me + Wishlist */
  get_to_know_me:     'Bấm GET TO KNOW ME → sang HAN',
  han_mo:             'Mở trang ba câu hỏi',
  han_dung:           'TRẢ LỜI ĐÚNG một câu',
  han_sai:            'Trả lời sai',
  han_goi_y:          'Mở thêm gợi ý',
  han_xong:           'XONG CẢ BA CÂU — được cấp mã Wishlist',
  han_choi_lai:       'Trả lời lại từ đầu',
  han_ve_ban_do:      'Từ HAN quay về bản đồ',
  han_dong:           'Rời trang câu hỏi',
  han_b_mo:           'Mở trang Wishlist',
  han_pin_sai:        'Nhập sai mã Wishlist',
  han_mo_wishlist:    'MỞ KHOÁ WISHLIST',
  han_het_luot:       'HẾT LƯỢT SAI trong ngày — phải làm lại',
  han_hop_mo:         'HỘP BÍ MẬT tới ngày mở nội dung',
  han_cua_hau:        'Mở khối vận hành bằng 5 nhịp',
  han_dieu_phoi:      'Lệnh trong bảng điều phối HAN',

  /* Hai pha điều hướng + hồ sơ người chơi (profile) — USER-FLOW.md */
  mo_pha_map:         'MỞ PHA MAP — bản đồ thành trang chính',
  luu_profile:        'KHAI DANH — tạo bản lưu profile',
  khoi_phuc_profile:  'KHÔI PHỤC bản lưu profile',
  doi_profile:        'Đổi sang pí danh khác',
  xoa_profile:        'Xoá một pí danh',
  an_danh:            'Chuyển sang chơi ẩn danh',
  luu_tien_trinh:     'Lưu tiến trình vào pí danh',

  /* Khung Tổ kỹ thuật */
  gui_tam_tu:         'GỬI TÂM TƯ cho tổ kỹ thuật',
  gui_tam_tu_loi:     'Gửi tâm tư thất bại',
  vao_easter_egg:     'Vào Easter Egg từ khung Tổ kỹ thuật',
  easter_egg_found:   'EASTER EGG FOUND — màn pháo hoa lần đầu',
  han_chua_toi_luot:  'Vào HAN sớm — chưa phá xong Easter Egg',
  clue_game_on:       'Gõ đúp Game On → tem sáng lên',
  phao_hoa_mo:        'Mở trang pháo hoa',
  phao_hoa_che:       'Đổi chế độ bắn pháo hoa',
  phao_hoa_dong:      'Rời trang pháo hoa',
  clockwise:          'CLOCKWISE — vặn kim đồng hồ bản đồ',
  xem_lai_phao_hoa:   'Xem lại màn pháo hoa',

  /* ── BẢN ĐỒ · mấy mốc trước đây BẮN NHƯNG KHÔNG CÓ NHÃN nên bị bỏ qua ──── */
  unlock_gate1:         'MỞ ĐƯỢC Easter Egg · Gate 1',
  cua_sau:              'Gõ 10 nhịp mở khung Collected',
  hack_gate2:           'Mở MAP-02 bằng PIN (chưa tới ngày)',
  reset_easter_egg:     'Reset MAP-02',
  hop_chao:             'Hộp chào Honghandangiu hiện ra',
  nhac_goi_y:           'Nhắc gợi ý mật thư',
  bay_lai_bang_ron:     'Bấm băng rôn máy bay',
  nhay_phan1:           'Nháy nút Phần 1',
  mo_ho_so_bang_pin:    'Mở hồ sơ niêm phong bằng PIN',
  sai_pin_ho_so:        'Nhập sai PIN hồ sơ',
  khoa_pin_ho_so:       'PIN hồ sơ bị khoá tạm',
  cham_ho_so_niem_phong:'Chạm hồ sơ còn niêm phong',
  mo_toa_do_niem_phong: 'Mở toạ độ trong hồ sơ niêm phong',

  /* ── ZOEY'S CASTLE · cũng đang thiếu nhãn ──────────────────────────────── */
  han_mo_cua_a:         'Mở cửa mã Zoey\'s Castle',
  han_ma_sai:           'Nhập sai mã Zoey\'s Castle',
  han_cua_test:         'Dùng cửa test bỏ qua màn chờ',

  /* ── EASTER EGG · GATE 2 ────────────────────────────────────────────────
     Cả trang dad/950901-b trước đây KHÔNG báo gì cả — nay có đủ phễu, từ lúc
     tới cổng cho tới lúc phá đảo và vào khu Open World. */
  g2_vao_cong:          'Tới cổng Easter Egg · Gate 2',
  g2_cong_mo:           'Cổng Gate 2 đã mở',
  g2_bam_choi:          'Bấm Bắt đầu giải mã',
  g2_press_start:       'Bấm PRESS START (vào game)',
  g2_vong_1:            'VÀO VÒNG 1 (RAZER)',
  g2_giai_xong_1:       'GIẢI XONG VÒNG 1',
  g2_vong_2:            'VÀO VÒNG 2 (ZHAO YUN)',
  g2_giai_xong_2:       'GIẢI XONG VÒNG 2',
  g2_sai:               'Đoán sai trong game',
  g2_goi_y:             'Nhận gợi ý',
  g2_mo_thu:            'Mở bức thư',
  g2_pha_dao:           'PHÁ ĐẢO GATE 2',
  g2_bo_qua:            'Dùng cửa hậu bỏ qua game',
  g2_open_world:        'Vào khu Open World',
  g2_ow_hoi:            'Hỏi Honghandangiu một câu',
  g2_ow_loi:            'Open World không trả lời được'
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
  /* 'bieu-mau' = tín hiệu đi bằng kênh gửi biểu mẫu (form POST vào iframe ẩn),
     dùng khi máy người chơi có bộ chặn quảng cáo hoặc tường lửa. */
  const kenh = String(d.kenh || 'js').slice(0, 16);

  const dong = [
    'BẢN ĐỒ TÁC CHIẾN' + (kenh === 'js' ? '' : ' [' + kenh + ']'),
    (NHAN[ev] || ev) + (detail ? ' — ' + detail : ''),
    'Đã giải: ' + (solved.length ? solved.join(', ') : 'chưa cái nào') +
      ' (' + solved.length + '/4)',
    gioVN(d.at || new Date().toISOString()),
    may
  ];
  const text = dong.join('\n');

  console.log('[PING]', JSON.stringify({ ev, detail, solved, kenh, at: d.at }));

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
