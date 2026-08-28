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
 *   SHEET_URL  = (tuỳ chọn) địa chỉ Web App của Google Apps Script. Khai vào
 *                thì MỖI tín hiệu được chép thêm một dòng vào Google Sheets,
 *                sống mãi — khác hẳn log Vercel gói Hobby chỉ giữ ~1 tiếng.
 *                Cách dựng: xem `docs/GOOGLE-SHEETS.md`.
 *
 * Không khai gì thì endpoint vẫn chạy, chỉ ghi console.log (xem ở tab Logs của Vercel).
 */

/* ── CHÉP VỀ GOOGLE SHEETS ────────────────────────────────────────────────
   Bắn đi rồi thôi, KHÔNG await và KHÔNG bao giờ để nó làm hỏng câu trả lời:
   trang gọi /api/ping là để ghi nhận, chứ không chờ kết quả gì. Sheets hỏng,
   mạng nghẽn, dán nhầm địa chỉ — người chơi không được biết và không được
   chậm đi một nhịp nào. */
/* ⚠ HỎNG THÌ PHẢI NÓI RA — ĐỜI TRƯỚC NUỐT SẠCH.
   `.catch(() => {})` trơn khiến chỗ này KHÔNG THỂ CHẨN ĐƯỢC: sai địa chỉ, thiếu
   mã bảo vệ, Apps Script deploy sai quyền, hay quên Redeploy Vercel sau khi
   khai biến — tất cả đều ra cùng một hiện tượng "Telegram kêu mà sổ trống", và
   không có nửa dòng manh mối nào. Nay ghi kết quả vào log Vercel: một dòng khi
   xong, một dòng khi hỏng. Vẫn KHÔNG await và vẫn không bao giờ làm hỏng câu
   trả lời — người chơi không phải chờ cái nhật ký này. */
/* ⚠ ĐỌC HỘ CÁI GOOGLE TRẢ VỀ, ĐỪNG ĐỔ NGUYÊN HTML VÀO LOG.
   BỆNH ĐÃ SỬA: "đã đổi Code.gs, redeploy mà không thấy record gì về Google
   Sheets". Đường ghi sổ KHÔNG hề im — nó kêu suốt, mỗi lượt một dòng:

       [SHEET] 401 <!DOCTYPE html><html lang="en">…window['ppConfig'] = …

   Nhưng dòng đó đọc như rác nên không ai nhận ra nó đang nói gì. Nó là TRANG
   ĐĂNG NHẬP của Google: Apps Script không chạy hàm nào cả, nó chặn ngay ở
   cửa và đòi tài khoản. Sửa Code.gs bao nhiêu lần cũng vô nghĩa — mã có bao
   giờ được gọi tới đâu.
   Chỉ có HAI nguyên nhân ra đúng cảnh này, và cả hai đều nằm ở chỗ DEPLOY,
   không nằm trong mã:
     · bản deploy đặt "Who has access" là "Only myself" thay vì "Anyone";
     · địa chỉ đang dùng là đuôi `/dev` — đuôi đó VĨNH VIỄN đòi đăng nhập,
       chỉ đuôi `/exec` mới cho gọi từ ngoài.
   Nay log tự dịch ra tiếng người, khỏi phải đoán lần sau. Xem thêm mục chẩn
   bệnh trong docs/GOOGLE-SHEETS.md. */
function docKetQua(ma, noi) {
  var s = String(noi || '');
  if (ma === 401 || ma === 403 || /^<!DOCTYPE html/i.test(s)) {
    return 'Apps Script ĐANG ĐÒI ĐĂNG NHẬP — mã Code.gs chưa hề được gọi. '
         + 'Deploy lại với "Who has access = Anyone", và dùng địa chỉ đuôi '
         + '/exec chứ không phải /dev.';
  }
  if (/"ok"\s*:\s*true/.test(s)) return 'ghi được';
  if (/sai ma/i.test(s)) return 'Mã bảo vệ trong địa chỉ khác với mã trong Code.gs.';
  return s.slice(0, 160);
}

function chepVeSheet(o) {
  const url = process.env.SHEET_URL;
  if (!url) { console.log('[SHEET] chưa khai SHEET_URL — bỏ qua'); return; }
  try {
    fetch(url, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(Object.assign({ loai: 'ping' }, o))
    }).then(async r => {
      let noi = '';
      try { noi = (await r.text()).slice(0, 200); } catch (e) {}
      console.log('[SHEET]', r.status, docKetQua(r.status, noi));
    }).catch(e => console.log('[SHEET] hỏng:', e && e.message));
  } catch (e) { console.log('[SHEET] hỏng ngay:', e && e.message); }
}

/* ═══ TỰ SOI SỔ LƯU — /api/ping?soi_so=1 ═══════════════════════════════════
   Trả về ĐÚNG thứ máy chủ nhận được khi gọi sang Apps Script. Sinh ra vì cái
   hiện tượng "Telegram bắn rầm rầm mà Google Sheets không chạy gì": đường sang
   sổ vốn im lặng hoàn toàn, không có cách nào biết nó tắc ở khúc nào.
   KHÔNG lộ địa chỉ sổ ra ngoài — chỉ nói có khai chưa, có kèm mã bảo vệ chưa,
   máy chủ Google trả về mã gì. */
async function soiSo(res) {
  const url = process.env.SHEET_URL || '';
  if (!url) {
    return res.status(200).json({ ok: false, buoc: 'SHEET_URL',
      vi: 'Chưa khai biến SHEET_URL bên Vercel, hoặc khai rồi mà chưa Redeploy.' });
  }
  const coMa = /[?&]k=/.test(url);
  /* Đuôi `/dev` là bản ĐANG SỬA của Apps Script — nó vĩnh viễn đòi đăng nhập,
     gọi từ ngoài vào bao giờ cũng 401. Bắt ngay ở đây, khỏi phải gọi sang
     Google mới biết: chỉ nhìn cái đuôi là đủ kết luận. */
  if (/\/dev(\?|$)/.test(url)) {
    return res.status(200).json({ ok: false, buoc: 'duoi_dia_chi', co_ma_bao_ve: coMa,
      vi: 'SHEET_URL đang dùng đuôi /dev — đuôi đó luôn đòi đăng nhập nên gọi '
        + 'từ ngoài vào bao giờ cũng bị chặn. Đổi sang đuôi /exec của bản đã '
        + 'deploy, rồi Redeploy bên Vercel.' });
  }
  try {
    const r = await fetch(url, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ loai: 'ping', ev: 'tu_soi', nhan: 'Tự soi sổ lưu',
                             detail: 'gọi từ /api/ping?soi_so=1',
                             at: new Date().toISOString() })
    });
    let noi = '';
    try { noi = (await r.text()).slice(0, 300); } catch (e) {}
    const ok = r.status === 200 && /"ok"\s*:\s*true/.test(noi);
    return res.status(200).json({
      ok, trang_thai: r.status, co_ma_bao_ve: coMa, google_tra_ve: noi,
      vi: ok ? 'Chạy được — mở Sheet xem dòng "tu_soi" ở tab Tiến độ.'
        : !coMa ? 'Địa chỉ THIẾU phần ?k=<mã bảo vệ> — xem bước 5 của docs/GOOGLE-SHEETS.md.'
        : /sai ma/.test(noi) ? 'Mã bảo vệ trong địa chỉ KHÁC với MA_BAO_VE trong Code.gs.'
        : r.status === 401 || r.status === 403 || /^<!DOCTYPE html/i.test(noi)
          ? docKetQua(r.status, noi)
        : 'Google trả về thứ lạ — xem `google_tra_ve` ở trên.' });
  } catch (e) {
    return res.status(200).json({ ok: false, buoc: 'mang', co_ma_bao_ve: coMa,
      vi: 'Không gọi tới được Apps Script: ' + (e && e.message) });
  }
}

/* ═══ TIÊU ĐỀ ĐI THEO ĐÚNG TRANG ĐÃ BẮN ═════════════════════════════════
   BỆNH ĐÃ SỬA: mọi tín hiệu — dù đến từ Gate 2, Zoey's Castle, Secret
   Chamber hay màn pháo hoa — đều mang tiêu đề "BẢN ĐỒ TÁC CHIẾN", và đều kèm
   dòng "Đã giải: … (n/4)" là tiến độ RIÊNG của bản đồ. Đọc chuông báo không
   biết chuyện xảy ra ở đâu, mà con số thì vô nghĩa với năm trang còn lại.

   NAY trang tự khai `trang` (mã trang), `noi` (hộp / vị trí trong trang) và
   `tt` (một dòng trạng thái ĐÚNG của trang đó). Trang cũ chưa khai `trang`
   thì đoán theo tiền tố tên sự kiện — vẫn ra đúng, khỏi phải sửa đồng loạt
   mới chạy được. */
const TEN_TRANG = {
  'ban-do'   : 'BẢN ĐỒ TÁC CHIẾN',
  'dad-a'    : 'HỒ SƠ PHI ĐOÀN',
  'dad-b'    : 'EASTER EGG · GATE 2',
  'han-a'    : "ZOEY'S CASTLE",
  'han-b'    : "HONGHAN'S SECRET CHAMBER",
  'phao-hoa' : 'MÀN PHÁO HOA'
};
/* ═══ ĐƯỜNG LÙI KHI TRANG CHƯA KHAI `trang` ════════════════════════════════
   BỆNH ĐÃ SỬA: "khi bắn tracking hiện tại lẫn lộn giữa hồ sơ phi đoàn và bản
   đồ tác chiến. Mission 3 nằm ở hồ sơ phi đoàn nhé."

   Đời trước đoán bằng TIỀN TỐ tên sự kiện, và trật nặng: Hồ sơ Phi đoàn có 25
   tên sự kiện thì 15 cái không mang tiền tố nào cả — `mo_pha_map` (giải đúng
   PHAM TUAN, tức PHÁ ĐẢO MISSION 3), `reset_msn`, `test_unlock`, `ho_so_mo`,
   `gui_form`, `vao_ban_do`… — nên rơi hết vào nhánh chót là 'ban-do'. Chuông
   báo Mission 3 xong mà đề "BẢN ĐỒ TÁC CHIẾN".

   Chưa hết: mấy tên như `vao_ban_do` / `bam_ban_do_khoa` / `nhay_ban_do_xong`
   NGHE như chuyện của bản đồ, nhưng đó là mấy cái nút TRÊN TRANG HỒ SƠ. Tên
   sự kiện nói về NƠI NÓ DẪN TỚI, không nói về NƠI NÓ XẢY RA — nên đoán theo
   tên là sai từ gốc.

   NAY: khai THẲNG từng tên vào `CHU_TRANG`, hết đoán. Tiền tố chỉ còn là lưới
   hứng cho tên mới chưa kịp khai.

   ⚠ THÊM SỰ KIỆN MỚI THÌ KHAI VÀO ĐÂY. `bao18.mjs` mục ③ soi đúng chuyện đó:
   mọi tên sự kiện có trong `NHAN` đều phải ra đúng trang của nó. */
const CHU_TRANG = {};
const gan = (trang, ds) => ds.split(/\s+/).filter(Boolean).forEach(e => { CHU_TRANG[e] = trang; });

gan('dad-a', `
  an_danh bam_ban_do_khoa bam_dong_countdown doi_profile gia_han_m2 gui_form
  ho_so_dong ho_so_mo khoa_pin khoi_phuc_profile luu_profile luu_tien_trinh
  mo_khoa_m2 mo_khoa_m2_cua mo_pha_map nhay_ban_do_xong nhay_phan1 reset_msn
  sai_pin sos_hint test_unlock trang_ho_so vao_ban_do ve_trang_bia xoa_profile
  giai_m3 skip_m3`);
/* ⚠ `giai_m3` / `skip_m3` gọi bằng biểu thức điều kiện — `ping(bySkip ? … : …)`
   — nên lối dò tên bằng `ping('…')` KHÔNG thấy chúng. Đó đúng là hai cái mốc
   PHÁ ĐẢO MISSION 3, tức chỗ người chơi chỉ ra là đang báo nhầm trang. Thêm
   tên gọi kiểu này thì nhớ khai tay; `kenh20.mjs` có dò cả dạng đó. */

gan('ban-do', `
  bay_lai_bang_ron cham_ho_so_niem_phong chon_kenh clockwise clue_game_on
  cua_sau doi_tab easter_egg_found get_to_know_me giai_dung giai_sai
  gui_tam_tu gui_tam_tu_loi hackmap hoan_thanh hop_chao
  khoa_pin_ho_so mo_ho_so mo_ho_so_bang_pin mo_hop mo_khoa_morse
  mo_toa_do_niem_phong nhac_goi_y redirect_ho_so reset_easter_egg
  sai_pin_ho_so sai_pin_hack unlock_gate1 vao_ho_so xem_lai_phao_hoa
  ghe_tham tai_lai`);      /* hai tên này cũng gọi bằng biểu thức điều kiện */

gan('phao-hoa', 'phao_hoa_che phao_hoa_dong phao_hoa_mo');

/* Secret Chamber cũng mang tiền tố `han_` như Zoey's Castle, nên mấy tên riêng
   của nó phải khai thẳng — không thì luật tiền tố đẩy hết sang Zoey's Castle. */
gan('han-b', 'han_b_mo han_hop_mo han_pin_sai');

/* `vao_easter_egg` bắn từ CẢ bản đồ lẫn màn pháo hoa, `han_*` thì có mấy tên
   dùng chung giữa Zoey's Castle và Secret Chamber. Không khai cứng mấy tên đó
   — để tiền tố đoán, và trang nào cũng đã tự khai `trang` ở kênh chính rồi. */
function doanTrang(ev) {
  if (CHU_TRANG[ev]) return CHU_TRANG[ev];
  if (/^g2_/.test(ev)) return 'dad-b';
  if (/^han_b_|wishlist/.test(ev)) return 'han-b';
  if (/^han_/.test(ev)) return 'han-a';
  if (/^phao_hoa_/.test(ev)) return 'phao-hoa';
  if (/^(sai_pin|khoa_pin|mo_khoa_m|gia_han_m|sos_|msn_|mission)/.test(ev)) return 'dad-a';
  return 'ban-do';
}
function tieuDe(trang, ev) {
  return TEN_TRANG[trang] || TEN_TRANG[doanTrang(ev)] || 'DONGCHI BÌNH 33';
}
/* Dòng trạng thái: ưu tiên chuỗi trang tự khai. Không khai thì CHỈ bản đồ mới
   có mặc định (bốn toạ độ) — mấy trang kia thà bỏ trống còn hơn in một con số
   không phải của mình. */
function trangThai(trang, ev, tt, solved) {
  if (tt) return tt;
  const t = trang || doanTrang(ev);
  if (t !== 'ban-do') return '';
  return 'Đã giải: ' + (solved.length ? solved.join(', ') : 'chưa cái nào') +
         ' (' + solved.length + '/4)';
}

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
  /* ⚠ SÁU CÁI DƯỚI ĐÂY TỪNG KHÔNG CÓ NHÃN, tức là bắn ra rồi RƠI THẲNG XUỐNG
     LOG, không bao giờ tới chuông. Trong đó `giai_m3` / `skip_m3` chính là hai
     mốc PHÁ ĐẢO MISSION 3, và `hackmap` / `hack_easter_egg` là hai cửa hậu —
     toàn thứ đáng biết nhất thì lại im nhất. Chúng lọt lưới vì gọi bằng biểu
     thức điều kiện `ping(co ? 'a' : 'b')`, lối dò `ping('…')` không thấy.
     `kenh20.mjs` mục ⑥ nay soi mọi tên sự kiện có bắn mà thiếu nhãn. */
  giai_m3:            'GIẢI ĐÚNG MISSION 3 — PHAM TUAN',
  skip_m3:            'Phá đảo Mission 3 bằng cửa hậu 10 nhịp',
  hackmap:            'Mở toàn bộ bản đồ bằng PIN cửa hậu',
  hack_easter_egg:    'Mở khu Easter Egg bằng PIN cửa hậu',
  ghe_tham:           'Ghé thăm lần đầu trong phiên',
  /* Bắn từ cú chuyển hướng lúc `/` vừa mở, TRƯỚC cả lúc hàm `ping()` kịp khai
     — nên nó dựng thẳng thân tín hiệu, và cũng vì thế mà lọt lưới lần soát
     trước. Đây là tín hiệu đầu tiên của mọi người chơi mới. */
  redirect_ho_so:     'Vào thẳng hồ sơ — PHA 1 dẫn đường',
  tai_lai:            'Tải lại trang bản đồ',
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
  reset_easter_egg:     'Reset MAP-02',
  hop_chao:             'Hộp chào Honghandangiu hiện ra',
  nhac_goi_y:           'Nhắc gợi ý mật thư',
  bay_lai_bang_ron:     'Bấm băng rôn máy bay',
  nhay_phan1:           'Nháy nút Phần 1',
  mo_ho_so_bang_pin:    'Mở hồ sơ niêm phong bằng PIN',
  sai_pin_ho_so:        'Nhập sai PIN hồ sơ',
  /* ⚠ TÊN NÀY BẮT ĐẦU BẰNG `sai_pin` — cùng tiền tố với mã Mission bên Hồ sơ
     Phi đoàn. Luật đoán trang theo tiền tố sẽ đẩy nhầm nó về `dad-a`, nên nó
     ĐÃ ĐƯỢC KHAI ĐÍCH DANH trong bảng `ban-do` ở trên. Đổi tên hay thêm anh em
     cùng họ thì nhớ khai kèm.
     (`sai_pin_g2` đã bỏ ở đợt 30 cùng lúc gỡ lối đi thẳng màn cuối Gate 2 —
      lối đó trùng với cửa hậu sẵn có bên trong chính Gate 2.) */
  sai_pin_hack:         'Nhập sai mã Hack Map',
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
  /* Cổng mở đúng lịch nhưng bản đồ tác chiến còn dở → chưa cho vào phòng lab.
     `detail` mang số mật thư còn thiếu. */
  g2_chan_chua_xong_map: 'Cổng Gate 2 chặn — bản đồ còn dở',
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

  /* Cửa tự soi — đứng TRƯỚC mọi thứ, kể cả chống spam. Xem `soiSo()` ở trên. */
  if (req.method === 'GET' && req.query && req.query.soi_so) return soiSo(res);

  if (req.method === 'GET') {
    /* Đường cứu cánh: trang gọi bằng request ảnh khi fetch/beacon bị chặn.
       Phải trả về ảnh thật, nếu không trình duyệt báo lỗi tải ảnh. */
    /* ⚠ ĐỌC ĐỦ `trang` / `noi` / `tt` Ở ĐÂY NỮA. Đường ảnh là kênh dự phòng
       lúc fetch bị chặn — bỏ sót ba trường này thì đúng mấy người chơi có bộ
       chặn quảng cáo lại là mấy người bị máy chủ đoán nhầm trang.

       `ua` KHÔNG đi kèm được trong địa chỉ ảnh (dài quá, mà cũng thừa) — lấy
       thẳng từ tiêu đề request. Thiếu nó thì cột "máy" trống trơn đúng ở mấy
       dòng của người bị chặn fetch, tức là mất dấu đúng nhóm đáng quan tâm
       nhất. `kenh` ghi 'anh' để đọc sổ biết dòng này đi đường vòng. */
    d = { ev: req.query.ev, detail: req.query.detail, trang: req.query.trang,
          noi: req.query.noi, tt: req.query.tt,
          ua: req.query.ua || (req.headers && req.headers['user-agent']) || '',
          kenh: req.query.kenh || 'anh',
          at: new Date().toISOString() };
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
  /* 80 ký tự đủ cho đời trước, nhưng từ đợt 28 mấy tín hiệu "nhập sai" mang
     theo cả CHUỖI NGƯỜI CHƠI ĐÃ GÕ — để đọc sổ biết họ đang mò theo hướng nào,
     chứ chỉ biết "sai lần 3" thì chẳng suy ra được gì. Nới lên 140; chuỗi gõ
     đã tự cắt còn 24 ký tự ở phía trang nên không có gì tràn. */
  const detail = String(d.detail || '').slice(0, 140);
  const solved = Array.isArray(d.solved) ? d.solved.slice(0, 8) : [];
  const may = String(d.ua || '').slice(0, 120);
  /* 'bieu-mau' = tín hiệu đi bằng kênh gửi biểu mẫu (form POST vào iframe ẩn),
     dùng khi máy người chơi có bộ chặn quảng cáo hoặc tường lửa. */
  const kenh = String(d.kenh || 'js').slice(0, 16);
  const trang = String(d.trang || '').slice(0, 24);
  const noi = String(d.noi || '').slice(0, 40);
  const tt = String(d.tt || '').slice(0, 90);

  const dong = [
    tieuDe(trang, ev) + (noi ? ' · ' + noi : '') + (kenh === 'js' ? '' : ' [' + kenh + ']'),
    (NHAN[ev] || ev) + (detail ? ' — ' + detail : ''),
    trangThai(trang, ev, tt, solved),
    gioVN(d.at || new Date().toISOString()),
    may
  ].filter(Boolean);
  const text = dong.join('\n');

  console.log('[PING]', JSON.stringify({ ev, detail, solved, kenh, at: d.at }));

  /* Chép về Sheets TRƯỚC hai cái chốt dưới đây, CỐ Ý vậy: Sheets là cuốn SỔ
     LƯU, còn Telegram là cái CHUÔNG BÁO. Sổ lưu thì phải ghi đủ — kể cả sự
     kiện chưa đặt nhãn (chính mấy dòng đó cho biết mình quên khai nhãn nào)
     và cả mấy nhịp bị chặn vì trùng. Chuông thì mới cần lọc cho đỡ ồn. */
  chepVeSheet({ ev, nhan: NHAN[ev] || '', detail, solved: solved.join(', '),
                so_giai: solved.length, kenh, may,
                trang: trang || doanTrang(ev), noi, tt,
                at: d.at || new Date().toISOString() });

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
