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
  /* Mã phần thưởng — phải KHỚP hằng `PIN_A` bên han/961030-a.
     Có DẤU CÁCH giữa các từ: chỗ hiện mã tách khoảng cho dễ đọc, còn lúc chấm
     thì cả hai bên đều bỏ hết dấu cách rồi mới so, nên gõ liền hay gõ rời đều
     được. */
  ma        : 'HO CHI MINH',
  ma_link   : '/han/961030-a?from=map',

  text: {
    vai_truoc     : 'Player: Dongchi Bình',
    vai_sau       : 'Winner: Dongchi Bình',
    tieu_de       : 'Easter Egg: Gate 2',
    nhan_khoa     : 'Locked',
    tieu_de_thang : 'Phá Đảo',
    hen           : 'Hẹn anh <b>00:00 ngày {DATE}</b>',
    /* Dòng chờ lúc đếm ngược mấy giây cuối. Khai bằng MẢNG thì mỗi giây đổi
       một câu — trước đây chỉ có đúng một câu "Cửa sẽ mở trong vài giây nữa",
       đứng im suốt 10 giây nên nhìn như trang bị treo chứ không như đang nạp.
       Bốn câu này nói đúng việc máy đang làm thật (nạp ảnh nền, dựng cảnh). */
    cua_dang_mo   : [
      'Đang tải assets…',
      'Đang thiết lập bối cảnh…',
      'Đang khởi động hệ thống…',
      'Đang kiểm tra…'
    ],
    moi_vao_game  : 'Người chơi đang tiến vào phòng lab',
    /* Cổng mở đúng lịch rồi NHƯNG bản đồ tác chiến còn dở — vào được tới đây,
       nhìn thấy cửa, mà chưa chơi được. Nói thẳng thiếu gì, đừng để người chơi
       đứng nhìn một màn hình im lìm mà đoán. */
    chua_xong_map : 'Giải xong Bản đồ tác chiến để vào chơi',
    chua_xong_map_phu : '',
    chua_xong_map_nut : '← Bản đồ',
    da_pha_dao    : 'Phi ngựa tới Zoey’s Castle 🦄',
    nut_vao_game  : '▶ Bắt đầu giải mã',
    nut_choi_lai_game : 'Chơi lại',
    /* (không dùng nữa) Nút "Về bản đồ" giữa màn hình đã bỏ: góc trái đã có sẵn
       một nút Bản đồ, hai nút cùng một việc trên một màn là thừa và lệch hẳn
       với mọi màn khác trong bộ. Giữ dòng này cho ai đọc lịch sử khỏi tưởng mất. */
    nut_ve_ban_do : '← Về bản đồ',
    /* Nhãn nút cửa hậu — chỉ hiện sau khi gõ 10 nhịp vào tem Last updated */
    nut_bo_qua    : '⏭ Bỏ qua · vào thẳng màn cuối',
    /* Dòng ký tên dưới tem phiên bản ở chân màn hình */
    designed_by   : '@Designed by Honghandangiu',
    nut_xem_lai   : 'Xem lại bối cảnh',
    ma_nhan       : 'Zoey’s Castle Key',
    nut_castle    : 'Zoey’s Castle',
    ve_ban_do     : 'Bản đồ',
    /* MỘT HÀNG: "Last updated … · V04.02". Dòng ký tên `designed_by` nằm TRÊN
       nó — xem temChu() trong index.html. */
    version       : 'Last updated 28-Aug-2026 · V06.04'
  }
};

/* ─────────────────────────────────────────────────────────────────────────────
   2. MINI-GAME PIXEL 2 VÒNG
   ───────────────────────────────────────────────────────────────────────────*/
const GAME_CONFIG = {

  /* Toàn bộ ảnh và clip nằm trong thư mục con `assets/` cho gọn thư mục chính.
     Đổi chỗ để tài nguyên thì sửa hai dòng này, không phải sửa từng tên file.

     ── VÌ SAO PHẢI VIẾT ĐƯỜNG DẪN ĐẦY ĐỦ TỪ GỐC (bắt đầu bằng dấu /) ────────
     Viết 'assets/' là đường dẫn TƯƠNG ĐỐI — trình duyệt ghép nó vào URL đang
     mở. Mở đúng .../dad/950901-b/ thì ra .../dad/950901-b/assets/..., ĐÚNG.
     Nhưng mở .../dad/950901-b (THIẾU DẤU / CUỐI) thì trình duyệt coi
     "950901-b" là tên file chứ không phải thư mục, nên ghép thành
     .../dad/assets/... → sai chỗ, 404, ảnh không hiện.
     Đó chính là lỗi khu Open World không thấy ảnh nhân vật (OW_2_*.webp):
     ảnh trong slideshow bức thư còn có ảnh pixel vẽ tạm che đi nên tưởng là
     chạy được, còn ảnh nhân vật thì không có đồ thay nên mất hẳn.
     Viết đủ từ gốc thì mở kiểu URL nào cũng trỏ đúng một chỗ.
     ĐỔI CHỖ THƯ MỤC thì phải sửa cả tiền tố /dad/950901-b/ ở hai dòng này. */
  assets_base : '/dad/950901-b/assets/',
  photos_base : '/dad/950901-b/assets/',

  assets: {
    bg_r1       : 'bg_r1.png',        /* Vòng 1 — phòng lab ngầm, bệ đá "REZAR"      */
    bg_r2       : 'bg_r2.png',        /* Vòng 2 — rừng tàn tích, Bạch Long ngậm thư  */
    anim_wrong  : 'anim_wrong.webp',  /* ổ khóa rung đỏ (~2s)                        */
    anim_unlock : 'anim_unlock.webp', /* nổ sập lab + thức tỉnh Bạch Long (~8s)      */

    /* ── ★ CLIP NỔ BẢN SẠCH — BẢN ĐANG DÙNG ────────────────────────────────
       Cùng đúng cảnh nổ sập lab đó, nhưng đã XOÁ SẠCH hai bảng tên khắc trên
       bệ đá (REZAR ở đầu clip, NUY OAHZ từ mốc 40% trở đi). Nhờ vậy clip
       KHÔNG còn lộ đáp án vòng 2 nữa.

       ĐÂY LÀ CHỖ GỠ ĐƯỢC CẢ MỘT ĐỐNG VÁ. Suốt năm đời trước, mọi thứ đắp lên
       khung chuyển cảnh — miếng đá dán, vệt mờ bầu dục, dải đáy mất nét, rồi
       tới ba bờ khói — đều chỉ để giấu đúng mấy chữ VẼ SẴN TRONG CLIP. Chữ
       không còn thì cũng chẳng còn gì phải giấu: nay chuyển cảnh chạy TRẦN,
       không lớp che, không khói, không hạ sáng. Xem `win1()` trong index.html.

       THIẾU FILE CŨNG KHÔNG VỠ: không tải được thì game tự lùi về
       `anim_unlock` cũ và bật lại lớp khói y như trước. Thả file vào assets/
       là tự động sạch.                                                       */
    anim_unlock_clean : 'anim_unlock_clean.webp',

    /* ── ★ HAI TẤM "ĐÁ SẠCH" — CÁCH CHE ĐẸP NHẤT, KHÔNG CẦN BLUR ────────────
       Đây là bản y hệt bg_r1 / bg_r2 nhưng CHỖ KHẮC CHỮ ĐƯỢC VẼ ĐÈ THÀNH MẶT
       ĐÁ TRƠN (xoá hẳn REZAR và NUY OAHZ đi).

       VÌ SAO CẦN: cách cũ là lấy chính mẩu ảnh CÓ CHỮ rồi làm nhoè + hạ sáng
       để giấu. Nhoè thì xoá luôn cả vân đá và hạt nhiễu, trong khi vùng xung
       quanh vẫn còn — nên mảng che lúc nào cũng "mịn" hơn mặt đá thật, nhìn ra
       ngay là một miếng dán. Lúc clip nổ chạy thì miếng dán đứng yên trên nền
       đang động, càng lộ. Không có cách chỉnh thông số nào cứu được, vì gốc rễ
       là đang cố giấu chữ bằng cách bôi mờ chính nó.
       Có tấm đá sạch thì lớp che = đúng mẩu đá thật, dán khít lên chỗ cũ:
       không nhoè, không lệch tông, soi kính lúp cũng không thấy ranh giới.

       CÁCH LÀM: mở bg_r1.png trong bất cứ app sửa ảnh nào (kể cả Photoshop,
       Photopea miễn phí, hay bảo AI xoá chữ), tẩy phần chữ khắc trên bệ đá rồi
       lấp bằng mặt đá xung quanh. GIỮ NGUYÊN KÍCH THƯỚC 3136x1376 và mọi thứ
       khác — chỉ chỗ chữ là khác. Lưu thành bg_r1_clean.png, làm tương tự cho
       bg_r2_clean.png (xoá NUY OAHZ).

       CHƯA CÓ FILE CŨNG KHÔNG SAO: thiếu thì game tự quay về cách nhoè cũ,
       không vỡ gì. Thả file vào assets/ là tự động đẹp lên.                  */
    bg_r1_clean : 'bg_r1_clean.png',
    bg_r2_clean : 'bg_r2_clean.png'
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
    /* (không dùng nữa) Trước đây là độ trễ giữa các ký tự khi nháy sáng lúc
       giải đúng. Nay giải đúng thì cả cụm sáng đều một lần rồi đứng yên, không
       nháy lệch nhịp nữa — giữ lại dòng này cho ai đọc lịch sử khỏi tưởng mất. */
    eye_flash     : 1600,   /* mắt rồng nháy đỏ khi nhập sai        */
    dirt_fall     : 640,    /* mảng đất rơi khỏi ký tự vừa lộ       */
    /* Xếp lại chữ. Đã thử rút xuống 420ms và cho cả cụm đi CÙNG LÚC: gọn thì
       gọn nhưng đơn điệu, nhìn như ảnh nhảy một cái. Trả lại nhịp lệch từng ô
       như bản đầu — mắt bắt được từng ký tự trượt về chỗ, ra đúng cảm giác
       đang giải mã. `flip_step` = mỗi ô chờ thêm bấy nhiêu ms rồi mới đi. */
    flip_ms       : 700,    /* xếp lại chữ về đúng chiều đọc        */
    flip_step     : 45,     /* độ lệch nhịp giữa hai ô liền nhau    */
    solved_hold   : 420,    /* giữ đáp án sáng đều trước khi xếp lại */
    /* ═══ NHỊP THẢ KHÓI — CHỈ CÒN DÙNG CHO ĐƯỜNG LÙI ════════════════════
       ĐỌC TRƯỚC: từ đời này trở đi chuyển cảnh dùng `anim_unlock_clean` —
       clip đã xoá sẵn hai bảng tên, nên KHÔNG thả khói, KHÔNG dán lớp che,
       không hạ sáng gì hết. Hai mốc dưới đây chỉ chạy khi clip sạch không tải
       được và game phải lùi về `anim_unlock` cũ.

       Ghi lại đường đã đi cho khỏi lặp lại — năm đời đều cùng một bệnh: đều
       là HIỆU ỨNG QUANG HỌC đặt vào một chỗ chẳng có gì sinh ra nó, nên mắt
       không giải thích được và đọc ngay ra "lỗi":
         đời 1  dán mẩu đá tĩnh        → lệch theo cảnh đang hạ cánh, thò chữ
         đời 2  miếng dán trôi theo    → hình chữ nhật tự bò trong khung
         đời 3  vệt mờ hình bầu dục    → quầng xám nằm lì giữa khung ~5 giây
         đời 4  cả dải đáy mất nét     → "cục mờ bay lơ lửng ở không trung"
         đời 5  ba bờ khói trôi ngang  → tự nhiên nhất, nhưng vẫn là lớp đắp
       Đời này bỏ hẳn lớp đắp: sửa thẳng vào clip. Không còn chữ thì không còn
       việc gì phải giấu.

       Mốc đo trên 241 khung của clip CŨ, giữ lại cho đường lùi:
         26% → 37%  ô bảng đá chìm hẳn trong khói trắng thật
         ~40.8%     chữ NUY OAHZ đã đọc được lờ mờ qua khói
         43% → 47%  khói tan, chữ hiện rõ
         85% →      cảnh đứng hẳn, khung cuối khớp bg_r2                      */
    che_vao_at    : 0.26,   /* bắt đầu thả khói (khung còn trắng xoá khói thật) */
    chu_lo_at     : 0.40,   /* đo được: chữ bắt đầu đọc được ở đây  */
    veil_in_ms    : 380,    /* lớp che đá hiện dần trong bấy nhiêu  */
    recenter      : 900,    /* thả tay → trôi mượt về giữa         */
    /* CỐ Ý NGẮN HƠN FILE: `anim_wrong` dài 5.082ms nhưng là một VÒNG LẶP rung
       lắc — dò từng khung thì khung nào cũng đang động, không có nhịp lắng
       xuống để mà chờ. Bắt xem trọn 5 giây cho mỗi lần gõ trật là quá nặng,
       nên chỉ lấy 2 giây đầu. KHÔNG phải quên sửa. */
    anim_wrong    : 2000,   /* lấy 2 giây đầu của clip nhập sai     */
    lock_after_bad: 2000,   /* khóa ô nhập sau khi sai             */
    glow_hold     : 3000,   /* giữ chữ RAZER sáng rực trước khi nổ */
    /* ═══ RAZER TẮT LÚC NÀO — ĐO THẲNG TRÊN 201 KHUNG CLIP SẠCH ═════════
       BỆNH ĐANG SỬA: "chữ RAZER lúc xong xuôi chuyển cảnh bị bay lên trời".

       CÓ HAI NGUYÊN NHÂN CHỒNG NHAU, PHẢI SỬA CẢ HAI:

       ① KHUNG CLIP ĐẶT SAI (đã sửa ở .anim-layer bên index.html — đây mới là
          thủ phạm chính). Clip sạch chỉ quay 78% GIỮA thế giới, mà lớp clip
          lại kéo căng ra cả khung bằng `object-fit`. Cảnh trong clip vì thế to
          hơn và lệch so với cảnh tĩnh nằm dưới, nên lớp chữ RAZER — vốn dán
          theo cảnh tĩnh — trông như rời khỏi bệ đá ngay từ khung đầu tiên,
          chưa cần cảnh chạy. Nay thẻ clip đặt đúng 78% giữa, khung đầu clip
          khớp bg_r1 từng pixel.

       ② NHỊP TẮT ĐẶT MUỘN. Đo lại từng khung (dò độ trượt dọc + độ sáng trung
          bình của cả khung) trên chính file đang dùng:

            0%  → 10,5%   cảnh ĐỨNG YÊN, độ sáng phẳng lì (~70/255)
           12%           CHỚP NỔ bắt đầu — độ sáng vọt 70 → 95 → 106
           15% → 36%     cả khung trắng xoá, cảnh vừa rung vừa trượt
           42%           mở ra cảnh mới, tối hẳn (~41/255)

          Bản trước tắt xong ở 26,8% — tức là suốt quãng 12% → 26,8% lớp chữ
          vẫn nằm đó trong khi phía dưới đang nổ và xê dịch. Đúng cái "có một
          đoạn chữ RAZER bay lên".

       NAY TẮT XONG TRƯỚC KHI CHỚP NỔ KỊP LOÉ:
           0.04 × 10050ms =  402ms  bắt đầu mờ
           + 380ms fade   =  782ms  tắt hẳn  = 7,8% clip
       Chốt chặn là mốc 12% (= 1.206ms), còn dư 424ms. Nghe thì sát, nhưng nhịp
       này chạy bằng CSS animation trên compositor (xem `.slab.tat`) nên không
       ăn theo main thread: máy có nghẹn vì giải mã clip 14MB thì nó vẫn đúng
       giờ. Hai đời timer trước bắn trễ 450-570ms chính là vì chạy trên main
       thread — nay không còn cửa đó nữa.

       KHÔNG MẤT GÌ: trước đó người chơi đã ngắm RAZER sáng rực suốt màn bới
       chữ, màn xếp lại chữ, rồi `glow_hold` 3 giây trên cảnh tĩnh, cộng thêm
       nửa giây đầu clip nữa — lúc này khung đầu clip đã khớp bg_r1 từng pixel
       nên chữ nằm đúng trên bệ đá, không còn lệch một ly.
       ĐỔI CLIP KHÁC thì phải ĐO LẠI mốc chớp nổ rồi trừ lùi. */
    /* ⚠ ĐÂY LÀ PHẦN TRĂM CỦA `anim_unlock` — sửa độ dài clip thì mốc này DỜI
       THEO. Đợt sửa clip 8000 → 10050 đã phải hạ 0.05 → 0.04 để giữ nguyên
       mốc tính bằng mili-giây. */
    slab1_out_at  : 0.04,
    slab1_fade_ms : 380,
    /* ═══ ĐỘ DÀI CLIP — ĐỌC THẲNG TỪ FILE, ĐỪNG ƯỚC LƯỢNG ══════════════════
       BỆNH ĐÃ SỬA: "màn chuyển cảnh nổ trứng bị ngắn so với video, cảm giác
       bị cắt ngang". Đúng vậy — số ở đây là 8000 trong khi file thật dài
       10.050ms, tức CẮT MẤT 2 GIÂY CUỐI (20% clip). `playClip` chỉ giữ lớp
       clip đúng `ms` rồi gỡ ra, nên clip bị chặt ngang giữa nhịp.

       Số đọc từ chính file .webp: mỗi khung có một ô `duration` trong chunk
       ANMF, cộng lại là ra. Đo được:
           anim_unlock_clean   201 khung × 50ms  = 10.050 ms
           anim_unlock (cũ)    241 khung × 42ms  = 10.122 ms
           anim_wrong          121 khung × 42ms  =  5.082 ms
       Lấy 10050 cho khớp bản sạch đang dùng; bản cũ lệch 72ms, không đáng kể.

       ⚠ MỌI MỐC % ĐỀU ĂN THEO SỐ NÀY (`slab1_out_at`, `che_vao_at`,
       `chu_lo_at`). Mấy mốc đó vốn đo theo SỐ KHUNG nên tự đúng; sửa số này
       cho khớp file thật thì chúng mới rơi đúng chỗ đã đo. */
    anim_unlock   : 10050,  /* độ dài THẬT của clip nổ sập lab      */
    type_speed    : 24,     /* ms / ký tự — hộp thoại              */
    letter_speed  : 26,     /* ms / ký tự — thư trong modal        */
    idle_hint     : 20000,  /* không gõ bao lâu thì chữ "thở"      */
    idle_wrongs   : 3,      /* sai bao nhiêu lần thì chữ "thở"     */
    /* ── MÀN PHÁO HOA LÚC PHÁ ĐẢO ─────────────────────────────────────────
       ⚠ CÁI CẮT NGẮN MÀN NÀY KHÔNG PHẢI HẠT PHÁO — LÀ MÀN HÌNH ĐỔI CẢNH.
       Khung `#fx` nằm TRONG `#scene-game`; `Code.open()` chuyển sang màn phát
       mã là khung biến mất giữa chừng, hạt còn bay cũng không ai thấy. Nên
       muốn màn dài thêm thì phải nới CẢ HAI: số đợt bắn, VÀ quãng nán lại
       trước lúc đổi cảnh (`phao_nan`).

       Trước: 6 đợt × 620ms bắn trong 3,7s — mà chỉ được nhìn ~5,1s (lời dẫn
       finale ~3,7s + nán 1,4s) là cảnh đã đổi. Nay bắn 6,2s, nhìn ~8s. */
    phao_dot      : 11,     /* số đợt bắn                          */
    phao_nhip     : 560,    /* ms giữa hai đợt                     */
    phao_nan      : 4300,   /* nán lại bao lâu rồi mới đổi cảnh    */
    phao_tran     : 20000,  /* trần an toàn, hạt chết hết thì dừng sớm */
    /* ── GỢI Ý TỚI LÚC NÀO ────────────────────────────────────────────────
       CỨ MỖI LẦN SAI CHÍNH THỨC LÀ MỞ THÊM MỘT GỢI Ý. Không phải chờ gom đủ
       mấy lần nữa.

       BẢN CŨ CỘNG DỒN BA TẦNG NÊN GỢI Ý TỚI QUÁ MUỘN, đúng như đã báo:
         · vòng 1 phải trật 3 ký tự mới thành MỘT lần sai chính thức
         · rồi phải gom thêm 3 lần sai chính thức nữa mới mở gợi ý kế
         · mà mỗi lần mở còn vướng hạn 15 PHÚT, chưa đủ giờ thì KHOÁ Ô NHẬP
       Nhân ra: gợi ý 2 của vòng 1 nằm sau 12 ký tự trật CỘNG 15 phút ngồi
       nhìn đồng hồ. Chơi cho vui mà thành ra hình phạt.

       NAY: `hint_every_wrongs` = 1 → sai phát nào mở tiếp phát đó, ở CẢ HAI
       VÒNG (RAZER lẫn ZHAO YUN). Hạn giữa hai gợi ý rút còn 2 PHÚT — vẫn đủ
       chặn kiểu cố tình gõ bừa để moi sạch gợi ý trong nửa phút, nhưng là một
       nhịp nghỉ chứ không còn là bức tường.
       Nhớ trong localStorage nên tải lại trang cũng không lách được. */
    hint_first_wrong  : 1,
    hint_every_wrongs : 1,
    hint_cooldown_ms  : 120000,
    slide_auto    : 3000    /* tự chuyển ảnh slideshow             */
  },

  /* ── VÒNG 1 · MÃ KHÓA RAZER ────────────────────────────────────────────── */
  round1: {
    /* ⚠ KHÔNG AI ĐỌC KHOÁ NÀY. Đáp án thật nằm ở `accept` (bản chấp
       nhận) và `solved` (bản hiện ra). Giữ lại cho khỏi tưởng mất, nhưng
       SỬA Ở ĐÂY LÀ KHÔNG ĐỔI ĐƯỢC GÌ — phải sửa `accept` và `solved`. */
    password : 'RAZER',
    accept   : ['RAZER'],
    scrambled: 'REZAR',
    solved   : 'RAZER',
    color    : '#ffaa00',
    /* 'flash'       — nét khắc chìm mờ sẵn, gõ trúng thì chớp sáng rồi tối lại.
       'progressive' — chôn kín hoàn toàn, mỗi lần gõ trúng mới bới ra thêm
                       một ký tự và GIỮ LUÔN.

       ── VÌ SAO VÒNG 1 ĐỔI SANG 'progressive' ──────────────────────────────
       Kiểu 'flash' cũ có một lỗ hổng: ô nhập cho gõ thoải mái, chỉ khi bấm
       UNLOCK mới chấm. Nghĩa là ai cũng gõ thử A, B, C… xem ô nào chớp sáng
       rồi xoá đi, KHÔNG BẤM GỬI — dò ra cả đáp án mà không bị tính sai lần
       nào. Bộ đếm sai, gợi ý, hạn khoá đều thành vô nghĩa.
       'progressive' chấm NGAY từng phím: gõ xong một ký tự là nộp luôn,
       không rút lại được. Hết đường dò chùa.
       Đổi lại phải nới tay hơn — xem `sai_moi_lan` ngay dưới. */
    reveal_mode: 'progressive',
    /* ── NỚI TAY: BAO NHIÊU LẦN TRẬT MỚI TÍNH LÀ MỘT LẦN SAI CHÍNH THỨC ────
       Chấm từng phím thì nghiêm hơn hẳn kiểu cũ, mà bảng chữ có 26 chữ cái —
       tính sai ngay từ phím trật đầu tiên thì mới mò một tí đã hết lượt.
       Đặt 3 nghĩa là: trật hai lần chỉ bị nhắc nhẹ, tới lần thứ ba mới cộng
       một vào bộ đếm sai (thứ điều khiển gợi ý và hạn khoá).
       Vòng 2 để 1 = trật phát nào tính phát đó, y như cũ. */
    sai_moi_lan: 3,
    /* Vòng 1 giữ đúng bộ số cũ — RAZER vốn đã đẹp, không đụng vào. */
    solved_glow: { b: 2.6, s: 1.5, c: 1 },
    /* ── CÔNG THỨC CHE DÙNG CHUNG CHO CẢ HAI VÒNG ──────────────────────────
       THỨ TỰ BỘ LỌC LÀ THỨ QUAN TRỌNG NHẤT Ở ĐÂY, và đó chính là chỗ bản
       trước sai. Bộ lọc chạy TỪ TRÁI SANG PHẢI. `contrast()` nhỏ hơn 1 kéo mọi
       sắc độ về phía xám giữa (~127), tức là nó LÀM SÁNG chỗ tối lên. Bản
       trước viết brightness trước rồi contrast sau, nên mảng che bị kéo ngược
       lên xám: đo được độ sáng trung bình 84 trong khi mặt đá quanh nó chỉ 53
       — sáng hơn hẳn 31 nấc, thành ra một khung chữ nhật nhìn phát hiện ra
       ngay, đúng như đã báo.
       Nay ĐẢO LẠI: contrast trước (dập nét khắc xuống xám), brightness sau
       (hạ cả mảng về đúng độ sáng mặt đá). Đo lại: mảng che 53.3 / mặt đá 53.4
       — coi như trùng khít, không còn thấy khung nữa.
         contrast   .55  — dập nét khắc, chạy TRƯỚC
         brightness .46  — hạ về đúng độ sáng mặt đá, chạy SAU
         saturate   .05  — rút sạch ám vàng hổ phách của nét khắc
         blur       theo CHIỀU CAO bảng đá (--veil-blur, đặt trong fitSlabs),
                    KHÔNG phải số px cố định — cố định thì màn hình càng to chữ
                    càng đọc được.
       ĐỪNG tăng blur để giấu kỹ hơn: đã thử, phản tác dụng. Nhoè mạnh làm
       chính lớp che loãng alpha ra, nét khắc THẬT nằm dưới lại lộ qua rõ hơn.
       Muốn cho đọc trước nét khắc như bản đầu thì bỏ blur đi. */
    veil_filter: 'contrast(.55) brightness(.46) saturate(.05) blur(var(--veil-blur,3.4px))',
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
    /* Đo lại bằng dò pixel: nét khắc chạy x[1478,1679] trong ảnh 3136px, khung
       cũ bắt đầu ở 1480 nên xén mất 2px — đúng cái nét dọc của chữ R ngoài
       cùng bên trái. Khung mới nới ra x[1477,1681]. */
    slab     : { left:'47.098%', top:'91.788%', w:'6.505%', h:'3.198%' }
  },

  /* ── VÒNG 2 · THẦN LONG TRIỆU VÂN ──────────────────────────────────────── */
  round2: {
    /* ⚠ KHÔNG AI ĐỌC KHOÁ NÀY. Đáp án thật nằm ở `accept` (bản chấp
       nhận) và `solved` (bản hiện ra). Giữ lại cho khỏi tưởng mất, nhưng
       SỬA Ở ĐÂY LÀ KHÔNG ĐỔI ĐƯỢC GÌ — phải sửa `accept` và `solved`. */
    password : 'ZHAO YUN',
    accept   : ['ZHAO YUN','ZHAOYUN'],
    scrambled: 'NUY OAHZ',
    solved   : 'ZHAO YUN',
    color    : '#ffaa00',   /* cùng tông cam với vòng 1 cho nhất quán */
    /* Vòng 2 chôn kín: ban đầu không thấy nét chữ nào. Sai lần đầu mới bới ra
       chữ ngoài cùng bên phải (Z), rồi lộ dần sang trái. */
    reveal_mode: 'progressive',
    /* Vòng 2 giữ nguyên luật cũ: trật phát nào tính phát đó */
    sai_moi_lan: 1,
    /* ĐÁP ÁN ZHAO YUN sáng và nét ngang ngửa RAZER. Phải đẩy cao hơn vòng 1 vì
       tranh gốc vòng 2 tối và nhạt hơn hẳn — xem ghi chú dài ở
       `.slab.solved .cell` trong index.html. b = độ sáng · s = độ tươi ·
       c = độ tương phản (chính c mới làm nét chữ sắc lại, không phải b). */
    /* ═══ ĐO LẠI BẰNG PIXEL — BỎ `sepia`, NÓ CHÍNH LÀ THỦ PHẠM LỆCH TÔNG ═══
       Đời trước tin rằng ZHAO YUN "bạc màu" nên nhuộm hổ phách bằng sepia(1).
       Nay đo lại đàng hoàng: quét cả dải ngang ngang tầm bệ đá, gom riêng
       những điểm VỪA SÁNG VỪA TƯƠI (chính là nét chữ đang phát sáng), rồi so
       ba cụm với nhau trên ảnh gốc bg_r2:

           biển TRÁI  (EIMIMRE)    màu 28,5°   tươi 51%   sáng 154
           ô chữ ZHAO YUN          màu 30,3°   tươi 49%   sáng 157
           biển PHẢI  (MIDNIGHT)   màu 28,6°   tươi 51%   sáng 155

       BA CÁI ĐÃ CÙNG MỘT TÔNG SẴN, lệch nhau chưa tới 2°. Không hề "bạc màu".
       Thứ làm nó lệch chính là bộ lọc: chạy thử `sepia(1) saturate(2.6)
       brightness(1.55) contrast(1.7)` lên đúng mấy pixel đó thì ra

           màu 49,7°   tươi 72%   sáng 255 (chạm trần, cháy trắng)

       tức đẩy màu đi 21° sang vàng và bơm sáng tới mức clip. Đó là cái "khác
       tone so với độ sáng của các chữ xung quanh".

       NAY CHỈ NÂNG NHẸ, KHÔNG NHUỘM. Đo lại bộ mới: màu 34,2° · tươi 65% ·
       sáng 200 — vẫn sáng bật hẳn lên để biết là đã giải, mà tông chỉ lệch
       ~6° so với hai biển bên cạnh thay vì 21°.
       ĐỔI SỐ thì đo lại bằng cách trên, đừng ước lượng bằng mắt. */
    solved_glow: { f: 'saturate(1.4) brightness(1.22) contrast(1.12)',
                   b: 1.22, s: 1.4, c: 1.12 },
    /* Y HỆT vòng 1 — xem ghi chú đầy đủ ở round1.veil_filter. Hai bên phải
       cùng một công thức, nếu không người chơi nhìn ra ngay bên nào dễ hơn. */
    veil_filter: 'contrast(.55) brightness(.46) saturate(.05) blur(var(--veil-blur,3.2px))',
    placeholder: 'NHẬP MẬT MÃ...',
    hints: [
      'Một nhân vật có thật nổi tiếng',
      'Cưỡi ngựa trắng',
      'Vị tướng này dùng Long Đảm Thương',
      'Một nhân vật Tam Quốc'
    ],
    /* Khung chữ nới ra x[1470,1668] để ôm trọn chữ O bên trái cụm "OAHZ". */
    slab     : { left:'46.875%', top:'84.811%', w:'6.314%', h:'2.180%' },
    /* ★ RANH GIỚI TỪNG Ô, tính theo phần trăm bề ngang bệ đá.
       Chia đều 8 ô là SAI: khoảng trắng giữa "NUY" và "OAHZ" hẹp hơn một ô,
       nên mốc chia lệch và ô thứ 4 (dấu cách) nuốt mất nét trái của chữ O.
       Dãy dưới đây đo bằng dò pixel, cắt vào đúng giữa khe hở hai chữ:
         N[1473,1492] U[1500,1519] Y[1526,1546] _ O[1565,1585]
         A[1593,1612] H[1620,1639] Z[1646,1665]                              */
    cell_edges: [0, 0.1313, 0.2677, 0.4040, 0.4545, 0.6010, 0.7374, 0.8737, 1],
    /* Cuộn thư trên miệng rồng. Không vẽ khung, cũng không phóng to bản sao ảnh
       (phóng lên là lệch với ảnh gốc, nhìn như bị nhân đôi) — chỉ chồng đúng
       khít mẩu ảnh này lên chính nó rồi cho nhoà sáng theo nhịp thở.
       min_px nới vùng chạm cho vừa ngón tay.

       ── ĐO LẠI: VÌ SAO MÕM RỒNG BỊ CHÁY TRẮNG ───────────────────────────
       Khung CŨ để h = 8.00%, tức x[1286,1615] y[474,584] trên ảnh 3136x1376.
       Cuộn thư THẬT — dò pixel hai mặt bích đồng — nằm x[1287,1614]
       y[473,608]: cao hơn khung cũ 25px và tâm thấp hơn 11px.
       Dải sáng luôn chạy qua TÂM khung, nên tâm bị kéo lên 11px là cả dải
       trượt lên theo, phủ đúng sống mũi con rồng (nó nằm ngay phía trên thân
       cuộn) rồi thổi trắng chỗ đó, trong khi mặt bích phải phía dưới lại tối.
       Đó chính là cảnh "lệch lên trên, miệng đến mũi sáng trưng".
       Khung dưới đây là bao đúng cuộn thư, kể cả hai núm gỗ hai đầu.        */
    hotspot  : { left:'41.040%', top:'34.375%', w:'10.428%', h:'9.811%', min_px:52 },
    tap_label: '[ TAP HERE ]',

    /* Rồng nhìn nghiêng 3/4 nên chỉ thấy MỘT mắt. Khung dưới đây bao ĐÚNG
       con ngươi cyan. Dò lại bằng cách quét pixel trên chính bg_r2.png (lọc
       các điểm cyan mạnh): mắt thật nằm x[1480,1516] y[409,442] trong ảnh
       3136x1376 — tức 1.180% x 2.471%.
       Khung CŨ để 1.8% x 3.2% và lệch lên trái 6px, tức RỘNG HƠN con ngươi
       gần rưỡi: nháy lên là một đĩa đỏ tràn ra cả mặt rồng, nhìn rất thô.
       Nhập sai thì vùng này chuyển đỏ, ĐỒNG THỜI một chùm tia đỏ loé ra từ
       đúng tâm khung này — tia vẽ bằng CSS, không cần khai gì thêm ở đây, chỉ
       cần khung bám khít con ngươi thì tia mới bắn ra đúng chỗ.
       Xem `#scene-game .eye` trong index.html nếu muốn chỉnh độ dài tia. */
    eyes: [
      { left:'47.194%', top:'29.724%', w:'1.180%', h:'2.471%' }
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
      '> Vuốt quanh phòng để quan sát. Bệ đá bị đất phủ kín.',
      '> Mỗi lần chỉ đoán được MỘT ký tự, gõ xong là nộp luôn — nhưng được thử 3 lần rồi mới tính một lần sai.'
    ],
    round1_wrong      : '> TRUY CẬP BỊ TỪ CHỐI! MÃ KHÓA KHÔNG HỢP LỆ.',
    /* Trật một ký tự ở vòng 1 mà CHƯA tới lần tính sai chính thức — nhẹ hơn
       hẳn câu trên. {N} = còn mấy lần trật nữa mới bị tính một lần sai. */
    round1_le_wrong   : '> KÝ TỰ KHÔNG KHỚP. CÒN {N} LẦN THỬ SAI.',
    /* Dùng chung cho cả hai vòng khi vừa hết quota nới tay */
    le_het_luot       : '> HẾT LƯỢT THỬ. LẦN NÀY TÍNH LÀ MỘT LẦN SAI.',
    round1_correct    : '> MÃ KHÓA HỢP LỆ! ĐANG TÁI CẤU TRÚC DỮ LIỆU...',
    round1_boom       : '> CẢNH BÁO! KẾT CẤU PHÒNG LAB ĐANG SỤP ĐỔ. RÚT LUI NGAY!',

    round2_intro: '> PHÒNG LAB ĐÃ SẬP! BẠCH LONG ĐÃ THỨC TỈNH... NHẬP MÃ ĐỂ NHẬN BÍ TỊCH.',
    round2_hint : [
      '> VÒNG 02 // Tìm mật khẩu để mở cổ thư trên miệng Bạch Long.',
      '> Bệ đá bị đất phủ kín. Mỗi lần chỉ đoán được MỘT ký tự, gõ xong là nộp luôn.',
      '> Đoán trúng thì ký tự đó lộ ra và được gõ thêm một ô nữa.'
    ],
    /* Đoán trật một ký tự — nhẹ hơn câu round2_wrong vì đây mới là một nước đi */
    round2_le_wrong   : '> KÝ TỰ KHÔNG KHỚP. NHẬP LẠI ĐI DONGCHI.',
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
    /* Nhãn thay thế khi lần trước đã qua được vòng 1 rồi mới tắt máy — vào lại
       là chơi tiếp vòng 2 chứ không làm lại từ đầu. */
    start_btn_tiep : '▶ CHƠI TIẾP · ROUND 02',
    swipe_hint   : '◄ VUỐT ĐỂ NGẮM BỐI CẢNH ►',
    unlock_btn   : 'UNLOCK',
    modal_title  : 'BÍ TỊCH BẠCH LONG',
    prev_btn     : '< PREV',
    next_btn     : 'NEXT >',
    finish_btn   : '[ HOÀN THÀNH HÀNH TRÌNH ]',
    hud_locked   : 'LOCKED',
    hud_unlocked : 'UNLOCKED',
    back_label   : '< EXIT',
    lock_note    : 'Vuốt quanh phòng tìm manh mối trong lúc chờ…',
    /* ⚠️ Bốn nhãn này nằm trên nút dùng FONT PIXEL — font đó không có dấu tiếng
       Việt nên "VÒNG"/"THOÁT" bị vỡ chữ. Giữ tiếng Anh. */
    gallery_r1   : 'ROUND 01',
    gallery_r2   : 'ROUND 02',
    gallery_ow   : 'OPEN WORLD',
    gallery_exit : 'EXIT',
    gallery_note : '> CHẾ ĐỘ XEM LẠI — vuốt để ngắm, chạm lá thư để đọc lại.'
  },

  /* ── OPEN WORLD · khu trò chuyện tự động ───────────────────────────────────
     Trang KHÔNG giữ khoá API. Nó gọi về hàm serverless `/api/chat` của chính
     website; khoá Gemini nằm trong biến môi trường GEMINI_KEY trên Vercel.
     Chưa khai khoá thì khu này vẫn mở, chỉ trả lời bằng câu dự phòng bên dưới.
     Xem hướng dẫn nối khoá ở file OPEN-WORLD.md.                              */
  openworld: {
    endpoint   : '/api/chat',
    moi_ngay   : 11,          /* mỗi ngày hỏi được bấy nhiêu câu */
    max_ky_tu  : 300,         /* độ dài tối đa một câu hỏi       */
    ten_npc    : 'HONGHANDANGIU',
    placeholder: 'DROP YOUR QUESTION...',  /* ô nhập đã đổi sang font hộp thoại → có dấu vẫn được */
    nut_gui    : 'SEND',                /* nút dùng font pixel → tiếng Anh */
    chao: [
      '> Welcome to Open World, this is Honghandangiu digitalized version',
      '> Ask me any question - max {N} questions each day.'
    ],

    /* ── KHO CÂU GỢI Ý ──────────────────────────────────────────────────────
       Mỗi lúc chỉ hiện ĐÚNG MỘT gợi ý cho đỡ rối mắt.
       `ref`      — câu mẫu ưu tiên, hiện trước và ĐÚNG THỨ TỰ này.
       `ref_kho`  — hết câu ưu tiên thì bốc ngẫu nhiên trong kho, không lặp lại
                    cho tới khi hết kho.
       `ref_doi_sau` — hỏi bấy nhiêu câu thì tự đổi sang gợi ý mới. Bấm dùng
                    gợi ý nào thì gợi ý đó đổi ngay.                          */
    ref: [
      'Cần 1 lời khuyên...',
      'Kể anh nghe về...'
    ],
    ref_doi_sau : 2,
    ref_kho: [
      'Hạnh phúc là gì?',
      'Ý nghĩa cuộc sống là gì?',
      'Hôm nay anh mệt quá...',
      'Deadline dí sát nút rồi, stress quá chừng!',
      'Dạo này anh mất hết động lực...',
      'Anh sợ bắt đầu lại rồi thất bại tiếp.',
      'Làm sao để bớt lo lắng về tương lai?',
      'Làm sao để biết mình đã chọn đúng đường?',
      'Sáng dậy uể oải không muốn ra khỏi giường...',
      'Anh vừa làm xong một việc khó nè!',
      'Nhiều lúc ở giữa đám đông mà vẫn thấy trống rỗng.',
      'Làm sao để tìm thấy bình yên thực sự?',
      'Em có thương anh không?',
      'Ai viết ra cái game này vậy em?',
      'Bây giờ anh nên làm gì tiếp theo?',
      'Làm sao để nuôi một mối quan hệ bền lâu?'
    ],

    /* Mảng thì mỗi lần bốc ngẫu nhiên một câu */
    het_luot: [
      '> Em đói pụng gòi~ Mai típ nha~',
      '> Em pùn nủ gòi~ Hẹn anh mai~',
      '> Em đi chơi đây~ Bái bai anh~'
    ],
    con_lai    : '> {N}/{T} lefts',   /* {N} còn lại · {T} tổng mỗi ngày */
    dang_nghi  : '...',

    /* ── NÉT MẶT ROBOT ──────────────────────────────────────────────────────
       Thả 4 file .webp vào thư mục `assets/`. Clip phải là loại LẶP VÔ HẠN.
       Thiếu file nào thì bỏ qua nét mặt đó, thiếu cả 4 thì giữ nguyên cảnh cũ
       — không vỡ gì.                                                          */
    mat: {
      chao : 'ow_2_4.webp',   /* chào người chơi — phát MỘT LẦN lúc mở khu này */
      nhin : 'ow_2_1.webp',   /* nhìn xuống đọc chữ / theo dõi gõ phím — NGHỈ  */
      nghi : 'ow_2_3.webp',   /* đăm chiêu — trong lúc chờ câu trả lời         */
      gat  : 'ow_2_2.webp'    /* gật đầu — ngay khi câu trả lời hiện ra        */
    },
    /* ── ẢNH MỒI: HIỆN NGAY, CLIP VỀ SAU MỚI ĐẮP LÊN ────────────────────────
       Bốn clip nét mặt trên đây mỗi cái ~5 MB. Mạng khoẻ thì hiện tức thì,
       mạng yếu thì mất cả chục giây — mà khu Open World mở ra ngay khi bấm
       nút, nên trong lúc chờ người chơi nhìn thấy đúng một khung ĐEN và tưởng
       hỏng. Đó chính là chỗ đã báo "lỡ mạng lag thì không thấy hình".

       Ảnh mồi là khung đầu tiên của chính mấy clip đó, bản TĨNH ~35 KB, đã cắt
       sẵn ở /assets/poster/. Đo được: bốn clip nét mặt dùng CHUNG một khung
       mở đầu (lệch nhau chưa tới 1 nấc sáng trên 255), nên một ảnh mồi duy
       nhất đắp cho cả bốn, khỏi sinh thêm file nào.

       Cách chạy: ảnh mồi dán làm NỀN của khung và hiện ngay lập tức; clip nặng
       tải xong mới nhoà chồng lên. Không có nhịp nào khung bị trống.
       Để rỗng '' là tắt hẳn phần này, quay về cách cũ. */
    mat_moi : '/assets/poster/HH_5_idle_afk.webp',
    /* 'kin' — clip là cả khung cảnh, phủ kín màn hình máy (giống anim_unlock).
       'noi' — clip là hình robot cắt rời trên nền TRONG SUỐT: robot đứng ở góc
               phải dưới, cảnh phía sau vẫn ngắm và vuốt được.               */
    mat_kieu    : 'kin',
    mat_cao     : '72%',      /* chỉ dùng cho kiểu 'noi' — robot cao bao nhiêu */
    mat_chao_ms : 3000,       /* chào xong bao lâu thì về nét nghỉ */
    mat_gat_ms  : 1800,       /* gật xong bao lâu thì về nét nghỉ  */
    mat_nghi_min_ms : 800,    /* giữ nét đăm chiêu ít nhất bấy nhiêu, kẻo máy
                                 trả lời nhanh quá thì nét này loé một cái rồi mất */

    loi_mang   : '> Sương mù dày quá, em hong thấy được câu hỏi. Try again later.',
    chua_noi: [
      '> Hảaaaa?! (Chưa nối khoá Gemini — xem OPEN-WORLD.md)',
      '> Dạaaaaa?! (Chưa nối khoá Gemini — xem OPEN-WORLD.md)',
      '> What\'s happened??? (Chưa nối khoá Gemini — xem OPEN-WORLD.md)'
    ],

    /* ── ★ TÍNH CÁCH — KHÔNG NẰM Ở ĐÂY NỮA ─────────────────────────────────
       Giọng của Honghandangiu đã dời sang `api/_lib/tinhcach.md`, phía máy
       chủ. Lý do: đoạn đó có fact riêng tư về người chơi, mà MỌI THỨ trong
       thư mục `dad/` đều tải thẳng về máy người xem — ai mở mã nguồn trang
       cũng đọc được.

       Sửa giọng nhân vật thì mở `api/_lib/tinhcach.md` (hoặc sửa
       `OW-LOI-DAN.md` rồi chép sang), xong phải deploy lại mới ăn.

       Có dán `tinh_cach` vào đây thì máy chủ cũng bỏ qua.                    */
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

Riêng chuyện anh và em, dù lúc anh đọc thư chúng mình có đang như thế nào, thì em cũng không ghét hay giận anh, mà là thất vọng. Em đã nghĩ nếu có cơ hội trao đổi và thấu hiểu nhau, chúng ta sẽ còn rất nhiều điều có thể làm cùng nhau. Em biết ơn nhân duyên đã đưa anh và em gặp gỡ nhau. Em biết ơn những khoảng thời gian hai ta đã cạnh nhau thủ thỉ mọi điều trong cuộc sống. Cảm ơn anh đã luôn cố gắng, chu đáo và chăm sóc em.

Em tin anh đã luôn làm tốt nhất trong khả năng của bản thân rồi, hãy động viên chính mình nhiều hơn anh nhé (don't talk bad about yourself, event it's joke, your brain will think it's true).

Game over, farewell.

— Em. Hồng Hân kí tên.

p.s: Building this series of mini-games for you as b-day gift brought me so much genuine joy. I'm not sure if or when I'll eventually push this live for the world, but if that day comes, it's simply because you deserve it. I poured a lot of heart into this 'brainchild' - I just hope playing it brings you as much joy as making it brought me. Enjoy!`
};
