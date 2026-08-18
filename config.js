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
    nut_choi_lai_game : 'Chơi lại',
    nut_ve_ban_do : '← Về bản đồ',
    nut_xem_lai   : 'Xem lại bối cảnh',
    ma_nhan       : 'Zoey’s Castle Key',
    nut_castle    : 'Zoey’s Castle',
    ve_ban_do     : 'Bản đồ',
    version       : 'V03.03<br>Last updated 17-Aug-2026'
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
    intro_pan     : 2600,   /* lia một vòng từ TRÁI sang PHẢI       */
    intro_back    : 1300,   /* rồi thu về neo giữa                  */
    reveal_step   : 130,    /* giải đúng: nháy từng ký tự phải→trái */
    eye_flash     : 1600,   /* mắt rồng nháy đỏ khi nhập sai        */
    dirt_fall     : 640,    /* mảng đất rơi khỏi ký tự vừa lộ       */
    recenter      : 900,    /* thả tay → trôi mượt về giữa         */
    anim_wrong    : 2000,   /* độ dài clip nhập sai                */
    lock_after_bad: 2000,   /* khóa ô nhập sau khi sai             */
    glow_hold     : 3000,   /* giữ chữ RAZER sáng rực trước khi nổ */
    anim_unlock   : 8000,   /* độ dài clip nổ sập lab              */
    type_speed    : 24,     /* ms / ký tự — hộp thoại              */
    letter_speed  : 26,     /* ms / ký tự — thư trong modal        */
    idle_hint     : 20000,  /* không gõ bao lâu thì chữ "thở"      */
    idle_wrongs   : 3,      /* sai bao nhiêu lần thì chữ "thở"     */
    /* Sai lần ĐẦU là có ngay gợi ý 1. Từ gợi ý 2 trở đi: cứ thêm 3 lần sai mới
       mở tiếp, và hai gợi ý phải cách nhau 15 PHÚT — chưa đủ giờ thì Ô NHẬP BỊ
       KHOÁ, chạy đồng hồ đếm ngược. Nhớ trong localStorage nên tải lại trang
       cũng không lách được. */
    hint_first_wrong  : 1,
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
    /* 'flash'       — nét khắc chìm mờ sẵn, gõ trúng thì chớp sáng rồi tối lại.
       'progressive' — chôn kín hoàn toàn, mỗi lần sai / gõ trúng mới bới ra
                       thêm một ký tự và GIỮ LUÔN. */
    reveal_mode: 'flash',
    veil_filter: 'brightness(.44) saturate(.18) contrast(.82)',
    placeholder: 'NHẬP MÃ KHÓA...',
    hints: [
      '5 KÝ TỰ. TÊN 1 THƯƠNG HIỆU.',
      'TENET CONCEPT',
      'BÊN PHẢI PHÒNG LAB',
      'HÃNG GAMING NỔI TIẾNG'
    ],
    /* KHUNG CHỮ KHẮC trong bg_r1.png, đo bằng cách dò pixel — tính theo % ẢNH
       NỀN. Game KHÔNG vẽ chữ đè lên: nó phủ một lớp tối lên đúng ô này, rồi
       cắt chính ảnh gốc thành từng ký tự; gõ trúng thì ký tự đó sáng lên. */
    slab     : { left:'47.194%', top:'91.788%', w:'6.378%', h:'3.198%' }
  },

  /* ── VÒNG 2 · THẦN LONG TRIỆU VÂN ──────────────────────────────────────── */
  round2: {
    password : 'ZHAO YUN',
    accept   : ['ZHAO YUN','ZHAOYUN'],
    scrambled: 'NUY OAHZ',
    solved   : 'ZHAO YUN',
    color    : '#ffaa00',   /* cùng tông cam với vòng 1 cho nhất quán */
    /* Vòng 2 chôn kín: ban đầu không thấy nét chữ nào. Sai lần đầu mới bới ra
       chữ ngoài cùng bên phải (Z), rồi lộ dần sang trái. */
    reveal_mode: 'progressive',
    /* Vòng 2 thêm blur: chỉ hạ sáng thôi thì nét khắc vẫn đọc được mờ mờ, phải
       làm nhoè hẳn mới đúng ý "ban đầu không thấy chữ nào". */
    veil_filter: 'brightness(.34) saturate(.1) contrast(.55) blur(1.1px)',
    placeholder: 'NHẬP MẬT MÃ...',
    hints: [
      'Một nhân vật có thật nổi tiếng',
      'Cưỡi ngựa trắng',
      'Vị tướng này dùng Long Đảm Thương',
      'Một nhân vật Tam Quốc'
    ],
    slab     : { left:'46.971%', top:'84.811%', w:'6.154%', h:'2.180%' },
    /* Cuộn thư trên miệng rồng. Không vẽ khung, cũng không phóng to bản sao ảnh
       (phóng lên là lệch với ảnh gốc, nhìn như bị nhân đôi) — chỉ chồng đúng
       khít mẩu ảnh này lên chính nó rồi cho nhoà sáng theo nhịp thở.
       min_px nới vùng chạm cho vừa ngón tay. */
    hotspot  : { left:'41.14%', top:'34.52%', w:'10.52%', h:'9.08%', min_px:52 },
    tap_label: '[ TAP HERE ]',

    /* Rồng nhìn nghiêng 3/4 nên chỉ thấy MỘT mắt. Khung dưới đây bao quanh
       con ngươi cyan, đo bằng dò pixel: mắt thật x[1484,1520] y[410,440].
       Nhập sai thì vùng này nháy đỏ rồi trả về bình thường. */
    eyes: [
      { left:'46.70%', top:'28.69%', w:'2.4%', h:'4.4%' }
    ]
  },

  /* ── TOÀN BỘ THOẠI DẪN TRUYỆN ──────────────────────────────────────────── */
  dialogues: {
    boot: [
      '> Khởi động hệ thống Easter Egg: Gate 2',
      '> Kết nối phòng lab ngầm... [OK]',
      '> Phát hiện Easter Egg bị niêm phong'
    ],
    round1_intro: [
      '> VÒNG 01 // Cửa đã bị niêm phong. Tìm mật khẩu để thoát khỏi phòng lab.',
      '> Vuốt quanh phòng để quan sát. Gõ mật khẩu vào ô bên dưới.'
    ],
    round1_wrong      : '> TRUY CẬP BỊ TỪ CHỐI! MÃ KHÓA KHÔNG HỢP LỆ.',
    round1_correct    : '> MÃ KHÓA HỢP LỆ! ĐANG TÁI CẤU TRÚC DỮ LIỆU...',
    round1_boom       : '> CẢNH BÁO! KẾT CẤU PHÒNG LAB ĐANG SỤP ĐỔ. RÚT LUI NGAY!',

    round2_intro: '> PHÒNG LAB ĐÃ SẬP! BẠCH LONG ĐÃ THỨC TỈNH... NHẬP MÃ ĐỂ NHẬN BÍ TỊCH.',
    round2_hint : [
      '> VÒNG 02 // Tìm mật khẩu để mở cổ thư trên miệng Bạch Long.',
      '> Bệ đá bị đất phủ kín. Mỗi ô chỉ cho thử MỘT ký tự — gõ trật là mất lượt.'
    ],
    round2_wrong      : '> MẬT MÃ KHÔNG HỢP LỆ! VUI LÒNG THỬ LẠI.',
    round2_correct    : '> MẬT MÃ CHÍNH XÁC! CHẠM VÀO LÁ THƯ ĐỂ ĐỌC NỘI DUNG...',

    locked          : '> HỆ THỐNG TẠM KHÓA... VUI LÒNG CHỜ.',
    unlocked_input  : '> ĐÃ MỞ LẠI Ô NHẬP. DONGCHI VUI LÒNG THỬ LẠI.',

    /* Gợi ý — {N} số thứ tự, {TEXT} nội dung, {M} số phút còn phải chờ */
    hint_show       : '> GỢI Ý {N}: {TEXT}',
    hint_lock       : '> HỆ THỐNG QUÁ TẢI! Ô NHẬP BỊ KHOÁ {M} PHÚT.',
    hint_unlock     : '> ĐÃ MỞ KHOÁ. THỬ LẠI ĐI DONGCHI.',
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
    back_label   : '< THOÁT',
    lock_note    : 'Vuốt quanh phòng tìm manh mối trong lúc chờ…',
    gallery_r1   : 'VÒNG 01',
    gallery_r2   : 'VÒNG 02',
    gallery_exit : 'THOÁT',
    gallery_note : '> CHẾ ĐỘ XEM LẠI — vuốt để ngắm, chạm lá thư để đọc lại.'
  },

  /* ── Ảnh kỷ niệm (thiếu file thì tự sinh ảnh pixel thay thế) ───────────── */
  photos: ['photo_1.jpg','photo_2.jpg','photo_3.jpg','photo_4.jpg','photo_5.jpg'],
  photo_captions: ['MEMORY 01','MEMORY 02','MEMORY 03','MEMORY 04','MEMORY 05'],

  /* ── NỘI DUNG BỨC THƯ ──────────────────────────────────────────────────── */
  letter_content:
`Gửi Dongchi Bình,

Tuổi mới mong anh nhiều niềm vui, sức khoẻ, bớt lo nghĩ xa xôi, luôn dũng cảm và chân thành trong mọi sự (thành công ròi sẽ tới, với anh em tin là vậy).

Mong anh giữ được ước mơ mà anh hằng ấp ủ và thực sự biến nó thành sự thật. Mong những nuối tiếc về quá khứ của anh sớm được bù đắp (anh sẽ làm tốt và vẫn còn rất nhiều năm phía trước; đừng quá lo lắng anh nhé, just do it). 

Mong anh có được sự bình yên, tròn đầy mà anh hằng khao khát. Và, true happiness comes from within nên em nghĩ biết đâu dành 1 chút thời gian thăm nom lại anh-Bình-thuở-nhỏ và tìm hiểu bản thân lại là một ý hay cho anh tuổi mới này ^^. 

Riêng chuyện anh và em, dù lúc anh đọc thư chúng mình có như thế nào, thì em có buồn nhưng cũng không ghét hay giận anh. Em biết ơn nhân duyên đã đưa anh và em gặp gỡ nhau. Em biết ơn những khoảng thời gian hai ta đã cạnh nhau thủ thỉ mọi điều trong cuộc sống. Cảm ơn anh đã luôn cố gắng và chăm sóc em.

Em tin anh đã luôn làm tốt nhất trong khả năng của bản thân rồi, hãy động viên chính mình nhiều hơn anh nhé (don't talk bad about yourself, event it's joke, your brain will think it's true).

Game over, farewell.

— Em. Hồng Hân kí tên.

p.s: Building this series of mini-games for you as b-day gift brought me so much genuine joy. I'm not sure if or when I'll eventually push this live for the world, but if that day comes, it's simply because you deserve it. I poured a lot of heart into this 'brainchild' - I just hope playing it brings you as much joy as making it brought me. Enjoy!`
};
