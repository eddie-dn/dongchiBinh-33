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
    cua_dang_mo   : 'Cửa sẽ mở trong vài giây nữa…',
    moi_vao_game  : 'Cổng đã thông. Dongchi Bình đang tiến vào phòng lab.',
    da_pha_dao    : 'Phi ngựa tới Zoey’s Castle 🦄',
    nut_vao_game  : '▶ Bắt đầu giải mã',
    nut_choi_lai_game : '↻ Chơi lại Easter Egg: Gate 2',
    nut_ve_ban_do : '← Về bản đồ',
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
    /* Cứ SAI 3 LẦN mở thêm một gợi ý, nhưng mỗi gợi ý cách nhau 15 PHÚT.
       Chưa đủ giờ thì game báo còn phải chờ bao lâu. Nhớ trong localStorage
       nên tải lại trang không lách được. */
    hint_every_wrongs : 3,
    hint_cooldown_ms  : 900000,
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
    hints: [
      '5 KÝ TỰ. TÊN 1 THƯƠNG HIỆU.',
      'TENET CONCEPT',
      'BÊN PHẢI PHÒNG LAB',
      'HÃNG GAMING NỔI TIẾNG'
    ],
    /* Đo bằng cách dò pixel chữ khắc trong bg_r1.png → overlay trùng khít
       chữ trên đá, không phải một tấm biển to đè lên.
       x,y = tâm; width_pct = bề ngang cụm chữ tính theo % ẢNH NỀN. */
    slab     : { x:'50.37%', y:'93.35%', width_pct:6.38 }
  },

  /* ── VÒNG 2 · THẦN LONG TRIỆU VÂN ──────────────────────────────────────── */
  round2: {
    password : 'ZHAO YUN',
    accept   : ['ZHAO YUN','ZHAOYUN'],
    scrambled: 'NUY OAHZ',
    solved   : 'ZHAO YUN',
    color    : '#00f2ff',
    placeholder: 'NHẬP MẬT MÃ...',
    hints: [
      'Một nhân vật có thật nổi tiếng',
      'Cưỡi ngựa trắng',
      'Vị tướng này dùng Long Đảm Thương',
      'Một nhân vật Tam Quốc'
    ],
    slab     : { x:'50.03%', y:'85.86%', width_pct:6.15 },
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
    round1_correct    : '> MÃ KHÓA HỢP LỆ! ĐANG TÁI CẤU TRÚC DỮ LIỆU...',
    round1_boom       : '> CẢNH BÁO! KẾT CẤU PHÒNG LAB ĐANG SỤP ĐỔ. RÚT LUI NGAY!',

    round2_intro: '> PHÒNG LAB ĐÃ SẬP! BẠCH LONG ĐÃ THỨC TỈNH... NHẬP MÃ ĐỂ NHẬN BÍ TỊCH.',
    round2_hint : '> VÒNG 02 // Bệ đá trong rừng tàn tích khắc: "NUY OAHZ".',
    round2_wrong      : '> MẬT MÃ KHÔNG HỢP LỆ! VUI LÒNG THỬ LẠI.',
    round2_correct    : '> MẬT MÃ CHÍNH XÁC! CHẠM VÀO LÁ THƯ ĐỂ ĐỌC NỘI DUNG...',

    locked          : '> HỆ THỐNG TẠM KHÓA... VUI LÒNG CHỜ.',
    unlocked_input  : '> ĐÃ MỞ LẠI Ô NHẬP. DONGCHI VUI LÒNG THỬ LẠI.',

    /* Gợi ý — {N} số thứ tự, {TEXT} nội dung, {M} số phút còn phải chờ */
    hint_show       : '> GỢI Ý {N}: {TEXT}',
    hint_wait       : '> GỢI Ý {N} ĐÃ SẴN SÀNG NHƯNG CÒN KHOÁ {M} PHÚT NỮA.',
    hint_done       : '> ĐÃ HẾT GỢI Ý. TỰ LỰC THÔI DONGCHI.',

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
    boot_ready   : 'Dữ liệu đã sẵn sàng.',
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
`Gửi Dongchi Bình,

Em không biết anh có tới được đây không hoặc lúc này tụi mình đã nói chuyện lại với nhau chưa. Hôm anh bảo thích trang website, em đã nghĩ tới concept làm series mini-games cho anh chơi thay vì đi mua quà như dự tính. Em hy vọng anh thích.

Mong anh giữ được ước mơ mà anh hằng ấp ủ và thực sự biến nó thành sự thật. Mong những nuối tiếc về quá khứ của anh sớm được bù đắp vào rất nhiều năm tới đây. Mong anh tìm thấy sự bình yên, tròn đầy mà anh hằng khao khát.

p.s: Cũng có lúc em nản lòng, nhưng em nghĩ thôi vậy, design game cũng là một trong những niềm vui của em. Quá trình làm tặng anh em cũng đã thấy vui. Dù người nhận thì đáng ghét (nvm) và em cũng không chắc mình sẽ tặng anh không. You get what you deserve.

Chúc mừng sinh nhật anh. Mong năm nay anh khỏe, bớt lo nghĩ xa xôi, luôn dũng cảm và chân thành.

Hết màn rồi đó. Về nhà thôi.

— Em. Hồng Hân kí tên.`
};
