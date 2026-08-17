/* ════════════════════════════════════════════════════════════════════════════
   DAD-950901-B · FILE CẤU HÌNH DUY NHẤT
   ----------------------------------------------------------------------------
   Sửa nội dung game ở ĐÂY, không cần mở index.html.
   Nạp trước index.html bằng <script src="config.js"></script>.

   Có 2 object, cố ý tách đôi để không giẫm chân nhau:
     • GATE_CONFIG — màn đếm ngược + màn phát mã TYRION
     • GAME_CONFIG — mini-game pixel 2 vòng
   ════════════════════════════════════════════════════════════════════════════ */

/* ─────────────────────────────────────────────────────────────────────────────
   1. MÀN ĐẾM NGƯỢC & MÀN PHÁT MÃ
   ───────────────────────────────────────────────────────────────────────────*/
const GATE_CONFIG = {

  /* Mốc mở cửa. Ghi theo múi +07:00 nên máy ở múi giờ nào cũng chốt đúng nửa
     đêm Việt Nam. {YEAR} sẽ được thay bằng năm hiện tại. */
  moc_iso   : '{YEAR}-09-01T00:00:00+07:00',

  /* Vào lần đầu sau mốc thì đếm thêm bấy nhiêu giây cho ra tấm ra món.
     Những lần sau vào thẳng. Đặt 0 để bỏ hẳn. */
  cho_lan_dau_ms : 10000,

  /* Mã phần thưởng — phải KHỚP với hằng PIN_A bên han/961030-a */
  ma        : 'TYRION',
  ma_link   : '/han/961030-a?from=map',

  text: {
    vai_truoc     : 'Player: Dongchi Bình',
    vai_sau       : 'Winner: Dongchi Bình',
    tieu_de       : 'Easter Egg: Gate 2',
    nhan_khoa     : 'Locked',
    tieu_de_thang : 'Phá Đảo',
    hen           : 'Hẹn anh <b>00:00 ngày {DATE}</b>',
    cua_dang_mo   : 'Cửa đang mở cho anh…',
    moi_vao_game  : 'Cổng đã thông. Vào giải mã thôi.',
    da_pha_dao    : 'Phi ngựa tới Zoey’s Castle 🦄',
    nut_vao_game  : '▶ Bắt đầu giải mã',
    nut_choi_lai_game : '↻ Chơi lại mini-game',
    ma_nhan       : 'Zoey’s Castle Key',
    nut_castle    : 'Zoey’s Castle',
    nut_reset     : '↻ Chơi lại',
    nut_reset_hoi : 'Chắc chưa?',
    nut_reset_chay: 'Đang dọn bàn cờ…',
    ve_ban_do     : 'Bản đồ',
    version       : 'V2.00<br>Last updated 17-Aug-2026'
  }
};

/* ─────────────────────────────────────────────────────────────────────────────
   2. MINI-GAME PIXEL 2 VÒNG
   ───────────────────────────────────────────────────────────────────────────*/
const GAME_CONFIG = {

  /* Ảnh nền + clip nằm cùng thư mục với index.html → để rỗng. */
  assets_base : '',
  photos_base : '',

  assets: {
    bg_r1       : 'bg_r1.png',        /* Vòng 1 — phòng lab ngầm, bệ đá "REZAR"      */
    bg_r2       : 'bg_r2.png',        /* Vòng 2 — rừng tàn tích, Bạch Long ngậm thư  */
    anim_wrong  : 'anim_wrong.webp',  /* ổ khóa rung đỏ (~2s)                        */
    anim_unlock : 'anim_unlock.webp'  /* nổ sập lab + thức tỉnh Bạch Long (~8s)      */
  },

  /* ── Khung máy ─────────────────────────────────────────────────────────────
     frame_ratio 4/3 → khung cao hơn 16:9 khá nhiều, cảnh vật to hẳn lên.
     Đổi lại '16/9' là quay về khung dẹt như bản cũ.
     frame_max_h   : trần chiều cao khung so với cả màn (0.44 = 44%).
     frame_max_h_kb: khi bàn phím ảo bật.                                      */
  frame: {
    ratio        : 4/3,
    max_h        : 0.44,
    max_h_kb     : 0.30,
    world_ratio  : 3136/1376   /* tỷ lệ thật của bg_r1/bg_r2 — đừng sửa nếu không đổi ảnh */
  },

  /* ── Mốc thời gian (ms) ────────────────────────────────────────────────── */
  timing: {
    intro_pan     : 2500,   /* camera lia vào round rồi neo giữa   */
    recenter      : 900,    /* thả tay → trôi mượt về giữa         */
    anim_wrong    : 2000,   /* độ dài clip nhập sai                */
    lock_after_bad: 2000,   /* khóa ô nhập sau khi sai             */
    glow_hold     : 3000,   /* giữ chữ RAZER sáng rực trước khi nổ */
    anim_unlock   : 8000,   /* độ dài clip nổ sập lab              */
    type_speed    : 24,     /* ms / ký tự — hộp thoại              */
    letter_speed  : 26,     /* ms / ký tự — thư trong modal        */
    idle_hint     : 20000,  /* không gõ bao lâu thì chữ "thở"      */
    idle_wrongs   : 3,      /* sai bao nhiêu lần thì chữ "thở"     */
    slide_auto    : 3000    /* tự chuyển ảnh slideshow             */
  },

  /* ── VÒNG 1 · MÃ KHÓA RAZER ────────────────────────────────────────────── */
  round1: {
    password : 'RAZER',
    accept   : ['RAZER'],
    scrambled: 'REZAR',
    solved   : 'RAZER',
    color    : '#ffaa00',
    placeholder: 'NHẬP MÃ KHÓA...',
    /* x,y tính theo % của ẢNH NỀN; width_frac = bề ngang cụm chữ so với khung máy */
    slab     : { x:'50.4%', y:'88%', width_frac:0.46 }
  },

  /* ── VÒNG 2 · THẦN LONG TRIỆU VÂN ──────────────────────────────────────── */
  round2: {
    password : 'ZHAO YUN',
    accept   : ['ZHAO YUN','ZHAOYUN'],
    scrambled: 'NUY OAHZ',
    solved   : 'ZHAO YUN',
    color    : '#00f2ff',
    placeholder: 'NHẬP TÊN THẦN TƯỚNG...',
    slab     : { x:'50.1%', y:'86%', width_frac:0.60 },
    /* vùng chạm lá thư trên miệng rồng — min_px bảo đảm ngón tay chạm được */
    hotspot  : { x:'46.4%', y:'39%', w:'16%', h:'22%', min_px:56 },
    tap_label: '[ TAP HERE ]'
  },

  /* ── TOÀN BỘ THOẠI DẪN TRUYỆN ──────────────────────────────────────────── */
  dialogues: {
    boot: [
      '> KHỞI ĐỘNG HỆ THỐNG DAD-950901-B... [OK]',
      '> KẾT NỐI PHÒNG LAB NGẦM... [OK]',
      '> CẢNH BÁO: MỘT CỔ VẬT ĐANG NIÊM PHONG CỔNG RA.'
    ],
    round1_intro: [
      '> VÒNG 01 // Trước mặt anh là bệ đá khắc năm chữ cái đã bị đảo lộn: "REZAR".',
      '> Sắp lại đúng thứ tự rồi gõ vào ô mã bên dưới để phá niêm phong.'
    ],
    round1_wrong      : '> TRUY CẬP BỊ TỪ CHỐI! MÃ KHÓA KHÔNG HỢP LỆ.',
    round1_wrong_hint : '> GỢI Ý: 5 KÝ TỰ. THỨ VŨ KHÍ ANH VẪN CẦM MỖI ĐÊM.',
    round1_correct    : '> MÃ KHÓA HỢP LỆ! ĐANG TÁI CẤU TRÚC DỮ LIỆU...',
    round1_boom       : '> CẢNH BÁO! KẾT CẤU PHÒNG LAB ĐANG SỤP ĐỔ. RÚT LUI NGAY!',

    round2_intro: '> PHÒNG LAB ĐÃ SẬP! BẠCH LONG ĐÃ THỨC TỈNH... HÃY GIẢI MÃ ĐỂ ĐỌC BÍ TỊCH.',
    round2_hint : [
      '> VÒNG 02 // Bệ đá trong rừng tàn tích khắc: "NUY OAHZ".',
      '> Gọi đúng tên vị thần tướng cưỡi Bạch Long, cổ thư sẽ mở.'
    ],
    round2_wrong      : '> SAI RỒI! BẠCH LONG GẦM LÊN, HÀO QUANG CHUYỂN ĐỎ...',
    round2_wrong_hint : '> GỢI Ý: 8 KÝ TỰ, HAI TỪ. THƯỜNG SƠN TRIỆU TỬ LONG.',
    round2_correct    : '> MẬT MÃ CHÍNH XÁC! CHẠM VÀO LÁ THƯ ĐỂ ĐỌC NỘI DUNG...',

    locked          : '> HỆ THỐNG TẠM KHÓA... VUI LÒNG CHỜ.',
    unlocked_input  : '> ĐÃ MỞ LẠI Ô NHẬP. THỬ LẠI ĐI ANH.',

    finale: [
      '> BÍ TỊCH ĐÃ ĐƯỢC GIẢI PHONG ẤN. HÀNH TRÌNH HOÀN TẤT!',
      '> CHÚC MỪNG SINH NHẬT ĐÔNG CHÍ BÌNH — 01.09 🎉',
      '> ĐANG MỞ KHOÁ MÃ VÀO ZOEY’S CASTLE...'
    ]
  },

  /* ── Chữ trên giao diện ────────────────────────────────────────────────── */
  ui: {
    boot_title   : 'EASTER EGG<br>GATE 02',
    boot_sub     : 'Đang nạp dữ liệu phòng lab ngầm…',
    boot_ready   : 'Dữ liệu đã sẵn sàng. Nhấn START để bắt đầu.',
    start_btn    : '▶ PRESS START',
    swipe_hint   : '◄ VUỐT ĐỂ NGẮM BỐI CẢNH ►',
    unlock_btn   : 'UNLOCK',
    modal_title  : 'BÍ TỊCH BẠCH LONG',
    prev_btn     : '< PREV',
    next_btn     : 'NEXT >',
    finish_btn   : '[ HOÀN THÀNH HÀNH TRÌNH ]',
    hud_locked   : 'LOCKED',
    hud_unlocked : 'UNLOCKED',
    back_label   : '< THOÁT'
  },

  /* ── Ảnh kỷ niệm (thiếu file thì tự sinh ảnh pixel thay thế) ───────────── */
  photos: ['photo_1.jpg','photo_2.jpg','photo_3.jpg','photo_4.jpg','photo_5.jpg'],
  photo_captions: ['MEMORY 01','MEMORY 02','MEMORY 03','MEMORY 04','MEMORY 05'],

  /* ── NỘI DUNG BỨC THƯ ──────────────────────────────────────────────────── */
  letter_content:
`Gửi Đông Chí Bình,

Nếu anh đọc được những dòng này, nghĩa là anh đã đi hết căn phòng lab ngầm, đã gọi đúng tên vị thần tướng, và đã tới được nơi cuối cùng của hành trình.

Em giấu lá thư này trong miệng Bạch Long, vì em biết kiểu gì anh cũng tìm ra. Anh luôn tìm ra.

Cảm ơn anh của một năm vừa rồi — những đêm anh thức khuya, những lần anh mệt mà vẫn cười, và cả những lúc anh chẳng nói gì nhưng em vẫn hiểu.

Chúc mừng sinh nhật anh. Mong năm nay anh khỏe, ít lo, và luôn có người đứng cạnh mỗi khi anh quay lại.

Hết màn rồi đó. Về nhà thôi.

— Hồng Hân`
};
