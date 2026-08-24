/* ═════════════════════════════════════════════════════════════════════════
   BẢN GHI — một file dùng chung, mỗi trang một cuốn sổ RIÊNG
   -------------------------------------------------------------------------
   ĐƯỜNG VÀO (cửa hậu cũ của từng trang GIỮ NGUYÊN, không đụng gì):

       mở bảng điều khiển của trang như xưa nay vẫn mở
         → bấm 3 nhịp vào DÒNG CHỮ tên của bảng đó
            ("Khối vận hành", "Mission 3 · Phá đảo"…)
         → gõ mã
         → hiện sổ CỦA RIÊNG TRANG ĐÓ

   KHÔNG CÒN NÚT ICON. Đời trước đẻ ra một nút tròn nhỏ đứng cạnh dòng nhãn:
   vừa thừa (dòng nhãn đã nói đúng tên chỗ đó rồi), vừa hết là cửa hậu (ai mở
   bảng cũng thấy ngay có thứ bấm được). Nay cửa chính là dòng chữ, trỏ vào
   mới đổi màu và nháy; đứng yên thì không có dấu vết gì.

   "Của riêng trang đó" là điểm quan trọng nhất: đứng ở Zoey's Castle thì chỉ
   thấy lịch sử của Zoey's Castle, không thấy trang nào khác. Sáu cuốn sổ nằm
   chung một file cho dễ sửa, nhưng KHÔNG BAO GIỜ hiện chung một bảng.

   ── VÌ SAO MỘT FILE DÙNG CHUNG, KHÔNG CHÉP VÀO TỪNG TRANG ────────────────
   Sáu trang, sáu bảng màu, sáu cách dựng khác nhau. Chép cùng một khối mã sáu
   lần thì lần sửa sau kiểu gì cũng sót một trang, mà sót thì không ai biết —
   cửa hậu có ai mở hằng ngày đâu.

   ── CÁCH GẮN VÀO MỘT BẢNG ĐIỀU KHIỂN ────────────────────────────────────
   Nạp file này, rồi rắc một mẩu thuộc tính vào ĐÚNG DÒNG CHỮ muốn làm cửa:

       '<span ' + LichSu.chu('MAP') + '>Khối vận hành</span>'

   Chỗ nào dòng chữ đã có sẵn thẻ riêng thì gắn thẳng vào thẻ đó:

       el.setAttribute('data-ls', 'DAD-A'); el.classList.add('ls-chu');

   Không phải gắn sự kiện gì cả: file tự nghe ở cấp tài liệu, thẻ dựng ra lúc
   nào cũng chạy — kể cả bảng điều khiển được dựng lại bằng innerHTML sau đó.
   ═════════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  /* ── MÃ VÀO ───────────────────────────────────────────────────────────
     0981 = 1890 đọc ngược — năm sinh Bác Hồ.

     ── GỢI Ý: CÓ, NHƯNG CHỈ NÓI MỘT NỬA ────────────────────────────────
     Sai đủ `SAI_TOI_DA` lần thì hiện đúng ba chữ: "Năm sinh Bác Hồ".

     Đời trước viết dài hơn — "Năm sinh Bác Hồ — soi gương mà đọc." — và
     ĐÓ MỚI LÀ CHỖ HỎNG: vế sau nói toẹt ra rằng phải ĐỌC NGƯỢC, tức là cho
     không nốt bước suy luận duy nhất còn lại. Đọc xong là gõ được ngay.

     Nay cắt vế sau đi. Ba chữ còn lại chỉ đưa tới con số 1890; từ 1890 ra
     0981 vẫn phải tự nghĩ. Đó là mức gợi ý đúng: gỡ bí cho người đang bí,
     chứ không giải hộ.

     ── THẤY RỒI THÌ THẤY MÃI ────────────────────────────────────────────
     Nhớ trong localStorage. Đã thấy gợi ý một lần thì những lần mở sau hiện
     luôn từ đầu, khỏi bắt gõ sai lại ba lần nữa — người ta đã trả giá rồi,
     bắt trả lần hai là phạt chứ không phải đố. Và mãi mãi chỉ ĐÚNG MỘT câu
     này, không có gợi ý thứ hai: nói thêm nữa là cho không cái mã. */
  var MA = '0981';
  var GOI_Y = 'Năm sinh Bác Hồ';
  /* Nới từ 3 lên 5: cho người ta mò lâu hơn trước khi được mách. */
  var SAI_TOI_DA = 5;
  var KHOA_GOI_Y = 'ls_goi_y';   /* đã từng thấy gợi ý chưa — nhớ qua cả phiên */
  /* ── ĐẾM SAI: CỘNG DỒN TRONG PHIÊN, ĐÓNG TRÌNH DUYỆT LÀ XOÁ ────────────
     Để trong sessionStorage chứ không phải biến thường và cũng không phải
     localStorage — mỗi chỗ hỏng một kiểu:

       biến thường   → đóng hộp mở lại là về 0. Gõ sai 4 lần, đóng, mở, gõ
                       sai 4 lần nữa… mãi không tới nấc gợi ý. Vô lý.
       localStorage  → nhớ mãi. Hôm nay sai 2, tháng sau vào sai thêm 3 là
                       được mách. Cũng vô lý theo chiều ngược lại.

     sessionStorage đúng: phải sai đủ 5 lần TRONG CÙNG MỘT PHIÊN mới được
     mách. Chưa đủ mà đóng trình duyệt thì lần sau đếm lại từ đầu.
     (Cờ ĐÃ THẤY gợi ý thì vẫn nằm ở localStorage — trả giá một lần là đủ.) */
  var KHOA_SAI = 'ls_sai';
  var NHIP = 3;         /* bấm bao nhiêu nhịp vào nút thì mở */
  var NGUNG = 900;      /* ngưng bấy nhiêu ms là đếm lại từ đầu */
  var ANH = '/assets/poster/HH_5_idle_afk.webp';

  /* ═══ KHUÔN SỐ PHIÊN BẢN — LUÔN LÀ Vxx.xx, ĐỆM SỐ 0 ══════════════════
     Cả hai vế đều ĐÚNG HAI CHỮ SỐ, không bao giờ bỏ số 0 đứng đầu:

         ĐÚNG    V01 · V02 · V04.05 · V17.09 · V02.02
         SAI     V1  · V2  · V4.5   · V17.9  · V2.02

     Vì sao bắt chặt: đời trước để lẫn cả hai kiểu — chỗ ghi `V02.02`, chỗ ghi
     `V3.02`, cùng một bảng mà đọc xuống cứ tưởng hai hệ đánh số khác nhau.
     Sắp xếp theo chuỗi cũng loạn (`V10` đứng trước `V2`). Nay chốt một khuôn.

     Áp cho CẢ tem ngoài trang lẫn cột Build trong sổ — sáu trang đã nắn đồng
     loạt. Thêm dòng mới thì gõ đúng khuôn ngay từ đầu.
     Dòng gộp thì đệm cả hai đầu: `V01 → V21`, `V11 · V12`. */
  /* ═══ BẢNG DỮ LIỆU ═══════════════════════════════════════════════════
     MỖI DÒNG LÀ MỘT BUILD LỚN, không phải một bản vá. Cũ nhất nằm trên.
       ngay  — YYYY-MM-DD của build đó, hoặc 'no info' (bảng tự đổi thành N/A)
       ver   — số build, LUÔN GIỮ kể cả khi không biết nó sửa gì
       so    — SỐ BẢN NHỎ ghi lại được trong build đó (V10.08 → '09').
               Không biết thì để `null`, bảng tự ghi N/A.
       chinh — sửa gì, GHI CHUNG CHUNG THÔI (xem luật ngay dưới)
       chi   — (tuỳ chọn) mảng từng bản nhỏ: { ver:'V17.05', chinh:'…' }.
               Dòng nào có `chi` thì bấm được, mở ra bảng chi tiết của riêng
               build đó. Từ V17 trở đi build nào cũng nên ghi.

     ── LUẬT ĐÁNH SỐ · CÔNG THỨC ĐẾM ────────────────────────────────────
     Một build LỚN đẻ tối đa MƯỜI bản nhỏ, đuôi chạy .00 → .09. Hết .09 là
     phải sang build lớn kế tiếp (V2.09 → V03, không có V2.10). Vì vậy:

         trần bản nhỏ của một trang = số build lớn × 10

     Chân bảng tự tính và in ra con số này, khỏi phải nhẩm tay.

     LƯU Ý — MẤY NẤC BỊ BỎ QUA: số build lớn KHÔNG dùng 13, 14 và 23.
     V12.09 → V15.00 (nhảy qua 13, 14) · V22.09 → V24.00 (nhảy qua 23).
     Đó là lý do bảng MAP nhảy thẳng từ V12 sang V15 chứ không phải mất dữ
     liệu. Luật này chép từ khối chú thích `stampText()` của bản đồ.

     ── LUẬT VIẾT CỘT "SỬA CHÍNH" — ĐỌC TRƯỚC KHI THÊM DÒNG ─────────────
     Sổ này người chơi mở ra đọc được. Nên tuyệt đối KHÔNG ghi:
       · mã, mật khẩu, đáp án, tên nhân vật phải đoán
       · tên biến môi trường, tên khoá lưu, tên endpoint, tên nhà cung cấp
       · bất cứ thứ gì nói ra là bớt được một bước phải mò

       · ⚠ VÀ KHÔNG MỘT CHỮ NÀO về chuyện ĐO ĐẠC · THEO DÕI · GHI NHẬN ·
         BẮN SỐ LIỆU VỀ · LƯU TRỮ. Không "thêm đo đạc", không "cập nhật API",
         không "nạp trước tài nguyên", không "thống kê", không "bản ghi tiến
         độ". Người chơi đang đọc một cuốn sổ trong game, không phải đọc tài
         liệu kỹ thuật — và cũng không cần biết trang có ghi lại gì hay không.
         Đời trước lỡ ghi "thêm đo đạc" ở ba chỗ, đã gỡ hết.

     CHỈ GHI LOẠI VIỆC NGƯỜI CHƠI NHÌN THẤY ĐƯỢC:
       "chỉnh hiệu ứng", "chỉnh hiệu ứng pháo hoa nổ", "chỉnh khung màn",
       "chỉnh luật chơi", "chỉnh luật gợi ý", "đồng bộ hệ nút",
       "cập nhật giao diện", "làm lại chuyển cảnh", "mở rộng kho lời chào".

     ── NGUỒN SỐ LIỆU ──────────────────────────────────────────────────
     Ba nguồn, xếp theo độ tin:
       1. số tem đọc thẳng trong mã của từng lượt push (chắc nhất)
       2. mấy file tài liệu cùng thời — chúng cũng chép lại số tem, nhờ vậy
          moi thêm được mấy build mà file thì không còn
       3. đoạn lịch sử chép tay trong dòng bản quyền của bản đồ đời V9-V10
     Chỗ nào cả ba đều im thì để 'no info' / `null` (bảng in ra N/A) và GIỮ NGUYÊN số
     build — nói rõ mình không biết, chứ không bịa một dòng nghe cho đẹp. */
  var SO = {
    MAP: {
      ten: 'Bản đồ mật thư', duong: '/',
      doi: [
        { ngay:'no info', ver:'V01',  so:null, chinh:'Bản đồ đầu tiên' },
        { ngay:'no info', ver:'V02',  so:null, chinh:'Thêm đếm ngược và phóng to thu nhỏ' },
        { ngay:'no info', ver:'V03',  so:null, chinh:'Đổi sang khung hẹp, thêm khung phụ' },
        { ngay:'no info', ver:'V04',  so:null, chinh:'Nắn quần đảo về đúng vị trí, thêm hộp mật thư' },
        { ngay:'no info', ver:'V05',  so:null, chinh:'Thêm ô chữ, lời khen, sóng biển' },
        { ngay:'no info', ver:'V06',  so:null, chinh:'Thêm kênh bắt sóng và tên lửa' },
        { ngay:'no info', ver:'V07',  so:null, chinh:'Thêm khối chinh phục' },
        { ngay:'no info', ver:'V08',  so:null, chinh:'Vá tên lửa đen, thêm gõ đúp cho điện thoại' },
        { ngay:'2026-08-04', ver:'V09',  so:null, chinh:'Bỏ rồi ghim lại mã morse, câu trêu xoay vòng, toạ độ mở khoá sáng lên' },
        { ngay:'2026-08-04', ver:'V10', so:'09', chinh:'Huy hiệu tên lửa có vòng đời đầy đủ, lockup cờ' },
        { ngay:'no info', ver:'V11 · V12', so:null,
          chinh:'Nối luồng người chơi từ trang hồ sơ về bản đồ',
          chi:[
            { ver:'V12', chinh:'Nối luồng và đưa người chơi từ trang hồ sơ về bản đồ chính' }
          ] },
        { ngay:'2026-08-12', ver:'V15', so:'06',
          chinh:'Tách hẳn hai khu chơi, trạng thái GAME ON, cửa hai tầng của hồ sơ niêm phong',
          chi:[
            { ver:'V15.00', chinh:'Tách trang thành hai khu chơi rời nhau: bản đồ tác chiến và khu Easter Egg' },
            { ver:'V15.05', chinh:'Khu Easter Egg chỉ mở khi khu bản đồ xong và đồng hồ về 0; thêm băng chúc mừng nhấp nháy dẫn sang' }
          ] },
        { ngay:'2026-08-14', ver:'V16', so:null,
          chinh:'Trạng thái GAME ON, chỉnh hiệu ứng pháo hoa và hiệu ứng Gate 1' },
        /* V17 ĐÃ DÙNG HẾT NẤC ĐUÔI (.09) nên lần sửa sau đã mở dòng V18 ngay
           bên dưới, không ghi V17.10 — xem luật ở đầu file. */
        /* ── V17.04 → V17.09 DÒ ĐƯỢC ĐỦ SÁU NẤC ─────────────────────────────
           Nhánh này còn giữ nguyên từng lượt push của quãng đó, nên tem đọc
           thẳng được và diff giữa hai bản liền nhau cho biết đúng cái gì vừa
           thêm. V17.00 → V17.03 nằm trước quãng nhánh giữ lại, chỉ còn tên
           việc chép tay từ tài liệu cùng thời. */
        { ngay:'2026-08-20', ver:'V17', so:'10',
          chinh:'Thêm hộp chào đầu ngày, mở rộng kho lời chào, đồng bộ hệ nút, thêm bản ghi và làm lại khuôn bản ghi',
          chi:[
            { ver:'V17.03', chinh:'Chỉnh hiệu ứng pháo hoa và hiệu ứng khu Gate 1' },
            { ver:'V17.04', chinh:'Nối liền ba khu chơi thành một mạch: bản đồ → Easter Egg → lâu đài' },
            { ver:'V17.05', chinh:'Thêm hộp chào đầu ngày chia theo buổi; mọi khung ảnh nặng có ảnh mồi tĩnh nằm dưới nên không còn khoảng trống lúc chờ' },
            { ver:'V17.06', chinh:'Thêm Daily Quote cho hộp chào, và luật không tách dòng giữa tên màn' },
            { ver:'V17.07', chinh:'Thử đặt cửa vào bản ghi ngay trên dòng tem ở chân bản đồ' },
            { ver:'V17.08', chinh:'Dời cửa vào bản ghi từ dòng tem sang MẶT CƯỜI trong Box Tổng tư lệnh; bảng bản ghi mượn luôn bảng màu của bản đồ. Cửa 5 nhịp vào Box qua lá cờ giữ nguyên' },
            { ver:'V17.09', chinh:'Khuôn bản ghi mới dùng chung: đổi cách bày cột, thêm bảng chi tiết từng bản nhỏ, bổ sung mốc cũ lụm lại được' }
          ] },
        { ngay:'2026-08-24', ver:'V18', so:'07',
          chinh:'Làm lại luật hiện hộp chào, chỉnh luật xuống dòng, mở rộng kho nội dung, đồng bộ hệ nút bản ghi, nới vùng chạm',
          chi:[
            { ver:'V18.00', chinh:'Hộp chào chia ba khung giờ trong ngày và có luật giãn cách riêng; chữ đổ đầy dòng thay vì chia đều; kho lời chào và câu trích viết dài hơn, thêm nhiều đầu mục mới; cửa vào bản ghi đổi từ nút hình sang chữ' },
            { ver:'V18.01', chinh:'Cửa vào bản ghi im lặng hoàn toàn, bỏ mọi lời chỉ đường; nới vùng chạm của nút đóng' },
            { ver:'V18.02', chinh:'Cửa mã bản ghi trả lại gợi ý sau ba lần sai, rút gọn còn một nửa và nhớ luôn cho những lần sau' },
            { ver:'V18.03', chinh:'Cửa mã bản ghi nới lượt thử sai lên năm và đếm cộng dồn theo phiên; khu Easter Egg có bản ghi riêng' },
            { ver:'V18.04', chinh:'Soát lại toàn bộ tên sổ và mốc thời gian theo nhánh dựng riêng trên kho mã; đồng bộ lại tài liệu' },
            { ver:'V18.05', chinh:'Viết lại nội dung sổ khu Easter Egg và màn pháo hoa theo lịch sử dò được; đánh lại số build của Hồ sơ Phi đoàn' },
            { ver:'V18.06', chinh:'Chốt khuôn số phiên bản Vxx.xx cho cả sáu trang; ghi đủ các nấc V17 và lịch sử riêng của khung Collected' }
          ] }
      ]
    },
    /* ── KHU EASTER EGG · cửa vào là TIÊU ĐỀ khung "Collected: Easter Egg" ──
       Cuốn RIÊNG, tách hẳn khỏi 'DAD-A'. Hai cuốn nói về hai thứ khác nhau:

         EGG    khu Easter Egg NHÌN TỪ BẢN ĐỒ — lúc nào khu mở ra, băng rôn
                dẫn sang, khung Collected, màn pháo hoa, đường nối sang lâu đài
         DAD-A  bản thân TRANG /dad/950901-a — hồ sơ 3 Mission, cửa mã, đồng hồ

       VÌ SAO SỐ BUILD TRÙNG VỚI SỔ BẢN ĐỒ: khu này không có trang riêng, nó
       nằm trong chính `index.html`. Nên mốc của nó chính là mốc của bản đồ —
       chép lại đúng những build có đụng tới khu Easter Egg, không đẻ ra một
       dãy số mới cho ra vẻ. Cột `#` để N/A vì không tách được trong một build
       lớn thì bao nhiêu bản vá là của riêng khu này. */
    /* ── KHU EASTER EGG · cửa vào là TIÊU ĐỀ khung "Collected: Easter Egg" ──
       Cuốn RIÊNG, tách hẳn khỏi 'DAD-A'. Hai cuốn nói hai thứ khác nhau:

         EGG    khu Easter Egg NHÌN TỪ BẢN ĐỒ — lúc nào khu mở ra, băng rôn
                dẫn sang, khung Collected, và MÀN PHÁO HOA ở cuối
         DAD-A  bản thân trang /dad/950901-a (Hồ sơ Phi đoàn)

       ── NGUỒN SỐ LIỆU ────────────────────────────────────────────────────
       Mốc V15-V18 chép từ những build của BẢN ĐỒ có đụng tới khu này (khu
       không có trang riêng, nó nằm trong chính index.html).
       Còn phần MÀN PHÁO HOA thì dò thẳng lịch sử `phao-hoa/index.html` qua
       từng commit — tem tự khai nằm ở thẻ `.vstamp`, và diff giữa hai bản
       liền nhau cho biết đúng cái gì đã thêm. Nhờ vậy mấy dòng dưới đây là
       việc THẬT, không phải đoán. Cột `#` vẫn để N/A vì trong một build lớn
       của bản đồ thì không tách được bao nhiêu bản vá là của riêng khu này. */
    EGG: {
      ten: 'Easter Egg · Gate 1', duong: '/',
      doi: [
        { ngay:'2026-08-12', ver:'V15', so:null,
          chinh:'Tách hẳn thành một khu chơi rời khỏi bản đồ tác chiến',
          chi:[
            { ver:'V15.00', chinh:'Trang chia làm hai khu rời nhau: bản đồ tác chiến và khu Easter Egg' },
            { ver:'V15.05', chinh:'Khu chỉ mở khi bản đồ xong và đồng hồ về 0; thêm băng chúc mừng nhấp nháy dẫn sang' }
          ] },
        /* Sáu dòng chi tiết dưới đây dò thẳng từ lịch sử `phao-hoa/index.html`:
           tem tự khai ở thẻ `.vstamp`, còn diff giữa hai bản liền nhau cho biết
           đúng cái gì vừa thêm. Đánh dấu bằng NGÀY chứ không bằng số đuôi, vì
           bốn bản đầu chạy trước khi màn pháo hoa có tem. */
        { ngay:'2026-08-18', ver:'V16', so:null,
          chinh:'Dựng màn pháo hoa ở cuối khu, chỉnh hiệu ứng nổ và khung màn',
          chi:[
            { ver:'14-08', chinh:'Màn pháo hoa đầu tiên: bắn tự động, lời chúc hiện dần, tôn trọng chế độ giảm chuyển động' },
            { ver:'14-08', chinh:'Thêm chế độ chạm-để-bắn: giữ tay thì tụ lửa, thả ra thì nổ' },
            { ver:'15-08', chinh:'Quả trứng hiện giữa màn, thêm nút Bắn lại và nút Vào Easter Egg' },
            { ver:'15-08', chinh:'Vẽ tay quả trứng và vụ nổ thẳng trên canvas, trứng nứt dần rồi vỡ' },
            { ver:'16-08', chinh:'Màn pháo hoa có tem phiên bản riêng' },
            { ver:'18-08', chinh:'Dời tem lên cao và vào trong, khỏi đè lên mép màn hình' }
          ] },
        /* Mấy dòng chi tiết dưới đây dò thẳng từ diff của `index.html` giữa hai
           bản liền nhau, lọc riêng phần đụng tới khung Collected (`cred*`). */
        { ngay:'2026-08-20', ver:'V17', so:null,
          chinh:'Nối liền ba khu chơi thành một mạch, khung Collected có ảnh mồi và nút xem lại pháo hoa',
          chi:[
            { ver:'V17.03', chinh:'Chỉnh hiệu ứng pháo hoa và hiệu ứng khu Gate 1' },
            { ver:'V17.04', chinh:'Nối liền ba khu thành một mạch: bản đồ → Easter Egg → lâu đài' },
            { ver:'V17.05', chinh:'Khung Collected có ảnh mồi tĩnh nằm dưới clip nặng nên không còn khoảng trống lúc chờ; khung cũng được xếp vào nhóm hộp ưu tiên để hộp chào biết nhường' }
          ] },
        { ngay:'2026-08-24', ver:'V18', so:null,
          chinh:'Khung Collected thành cửa vào bản ghi riêng của khu',
          chi:[
            { ver:'V18.01', chinh:'Nới vùng bấm của nút đóng khung Collected cho vừa đầu ngón tay' },
            { ver:'V18.03', chinh:'Chính dòng tiêu đề khung thành cửa vào bản ghi, trỏ vào thì chữ đổi màu' },
            { ver:'V18.05', chinh:'Viết lại nội dung sổ theo lịch sử dò được của khung và của màn pháo hoa' }
          ] }
      ]
    },
    /* ── ⚠ TÊN: "HỒ SƠ PHI ĐOÀN", KHÔNG PHẢI "EASTER EGG · GATE 1" ─────────
       Đã ghi sai một đời, ghi lại đây cho khỏi sai tiếp. Hai thứ khác nhau:

         EGG    khu Easter Egg / Gate 1 nhìn từ BẢN ĐỒ — cửa vào là tiêu đề
                khung "Collected: Easter Egg"
         DAD-A  TRANG /dad/950901-a, tự xưng "Hồ sơ Phi đoàn" ngay ở thẻ
                <title> — hồ sơ 3 Mission, cửa mã, đồng hồ. Cửa vào là tiêu
                đề hộp "Mission 3 · Phá đảo" bên trong chính trang đó.

       Lấy tên theo <title> của trang, đừng lấy theo tên khu chơi bao ngoài. */
    'DAD-A': {
      ten: 'Hồ sơ Phi đoàn', duong: '/dad/950901-a',
      /* ── ⚠ SỐ BUILD ĐÃ ĐÁNH LẠI: V22 CŨ LÀ SỐ ƯỚC, KHÔNG CÓ CĂN CỨ ───────
         Trang này chưa bao giờ có tem trong suốt thời kỳ đầu, nên không moi
         ra được mốc nào từ tem. Nay đếm bằng thứ đếm được: SỐ BẢN KHÁC NHAU
         của chính file trang, gộp mọi nhánh trên kho mã (`main`,
         `dad-950901-mission`, và nhánh gộp site).

             18 bản   26-07 → 07-08-2026   thời kỳ dựng trang, chưa có tem
              9 bản   18-08 → 24-08-2026   thời kỳ gộp vào site, có tem

         Chia theo đúng luật của bộ (1 build lớn = tối đa 10 bản nhỏ, đuôi
         .00 → .09) thì ra V1 (10 bản) · V2 (8 bản) · V3 (9 bản, đang chạy).
         Tem ngoài trang cũng đổi theo, thành V3.08.                        */
      doi: [
        { ngay:'2026-08-04', ver:'V01', so:'10',
          chinh:'Dựng trang Hồ sơ Phi đoàn. Chưa đánh số phiên bản nên không còn mốc build nào' },
        { ngay:'2026-08-07', ver:'V02', so:'08',
          chinh:'Hoàn thiện hồ sơ trước khi gộp vào site chung. Vẫn chưa có tem' },
        { ngay:'2026-08-24', ver:'V03', so:'09',
          chinh:'Hồ sơ 3 Mission, dòng nhiệm vụ và thanh tiến độ ngoài trang bìa, gom cửa mã về một khuôn, thêm bản ghi, chỉnh luật gợi ý',
          chi:[
            { ver:'V03.00 → V03.01', chinh:'Hồ sơ 3 Mission, đồng hồ Mission 2, thêm bản ghi' },
            { ver:'V03.02', chinh:'Dòng nhiệm vụ ở trang bìa, ba nấc nhiệm vụ, khuôn cửa mã dùng chung' },
            { ver:'V03.03', chinh:'Thanh tiến độ kèm mức khó, đồng hồ ghi rõ ngày–giờ–phút–giây, nút cầu cứu và luật tạm khoá' },
            { ver:'V03.04', chinh:'Cửa vào bản ghi đổi từ nút hình sang chính dòng tiêu đề của hộp, trỏ vào thì chữ đổi màu' },
            { ver:'V03.05', chinh:'Cửa vào bản ghi im lặng hoàn toàn, bỏ mọi lời chỉ đường; nới vùng chạm của nút đóng' },
            { ver:'V03.06', chinh:'Cửa mã Mission 2 cho một gợi ý sau ba lần sai và nhớ luôn cho những lần sau' },
            { ver:'V03.07', chinh:'Dời mốc gợi ý Mission 2 sang lần bị khoá thứ hai, bộ đếm sai tính theo phiên' },
            { ver:'V03.08', chinh:'Đặt lại đúng tên trang trong bản ghi, đánh lại số build theo bản đếm được; gom hai tấm nền dùng chung về một chỗ' }
          ] }
      ]
    },
    'DAD-B': {
      ten: 'Easter Egg · Gate 2', duong: '/dad/950901-b',
      doi: [
        { ngay:'no info', ver:'V01', so:null, chinh:'Bản chơi thử đầu tiên' },
        /* ── NGÀY VÀ SỐ ĐUÔI ĐỌC THẲNG TỪ TEM ────────────────────────────
           Nguồn: nhánh dựng riêng `easter-egg-gate2` trên GitHub, tem nằm ở
           `config.js` theo khuôn 'V04.00<br>Last updated 18-Aug-2026'. Đây là
           nguồn số 1 trong bảng xếp hạng ở đầu file (đọc thẳng tem trong mã
           của từng lượt push). Dò được:

               V2.00 · V2.10 · V2.11    đều tự khai  17-Aug-2026
               V03.03 · V03.04          tự khai      17-Aug-2026
               V03.06                   tự khai      18-Aug-2026
               V04.00                   tự khai      18-Aug-2026

           Suy ra: V2 chạy tới đuôi .11 = 12 bản nhỏ, quá luật .09 đúng hai
           nấc — khớp khít với chuyện phải nắn sang V03 NGAY TRONG CÙNG NGÀY.
           Bản trước ghi V2 ngày 15-08 và 10 bản nhỏ, cả hai đều không có
           nguồn nào đỡ. */
        { ngay:'2026-08-17', ver:'V02',  so:'12',
          chinh:'Dựng concept và hai vòng giải mã. Số đuôi chạy tới .11, quá luật nên đã nắn sang V03',
          chi:[
            { ver:'V02.00 → V02.03', chinh:'Dựng concept và kịch bản màn chơi, giao diện tĩnh và cảnh chuyển động' },
            { ver:'V02.04 → V02.09', chinh:'Chỉnh luật chơi, thiết kế cách người chơi tương tác, thêm đồng hồ, gợi ý và mạch màn chơi' }
          ] },
        /* V03.06 tự khai 18-Aug-2026 — đó là nhịp cuối của build này dò được,
           nên lấy 18-08 chứ không phải 17-08 như bản trước (cột `ngay` của cả
           bảng đang đi theo NGÀY HOẠT ĐỘNG CUỐI của build, xem dòng V04). */
        { ngay:'2026-08-18', ver:'V03', so:'07', chinh:'Nắn lại số cho đúng luật, thêm khu Open World, dựng ảnh nền sạch' },
        { ngay:'2026-08-24', ver:'V04', so:'10',
          chinh:'Làm lại chuyển cảnh, chỉnh luật chơi và luật gợi ý, chỉnh hiệu ứng đáp án, gom cửa hậu vào Khối vận hành, đồng bộ màu bảng ghi',
          chi:[
            { ver:'V04.05', chinh:'Làm lại chuyển cảnh, chỉnh luật chơi và luật gợi ý, chỉnh hiệu ứng đáp án' },
            { ver:'V04.06', chinh:'Gom cửa hậu vào Khối vận hành, mở lại cửa hậu ở màn cuối, đổi bản ghi sang khuôn mới' },
            { ver:'V04.07', chinh:'Chuyển cảnh dùng bản clip đã dọn sạch bảng tên nên bỏ hẳn lớp che và lớp khói; bảng bản ghi lấy đúng màu Khối vận hành; cửa vào bản ghi đổi từ nút hình sang chữ' },
            { ver:'V04.08', chinh:'Khối vận hành bỏ dòng chỉ đường, thay bằng dòng trạng thái màn chơi; cửa vào bản ghi im lặng hoàn toàn; nới vùng chạm của nút đóng' },
            { ver:'V04.09', chinh:'Sửa lỗi đáp án vòng 1 trôi khỏi bệ đá trong chuyển cảnh; nắn lại tấm biển vòng 1 cho khớp vòng 2' }
          ] }
      ]
    },
    'HAN-A': {
      ten: 'Zoey’s Castle', duong: '/han/961030-a',
      doi: [
        { ngay:'no info', ver:'V01', so:null, chinh:'no info' },
        { ngay:'2026-08-17', ver:'V02', so:'10', chinh:'Bộ câu hỏi và cửa mã, dọn màn hoàn thành, đồng bộ tên gọi và hệ nút' },
        { ngay:'2026-08-24', ver:'V03', so:'05',
          chinh:'Thêm bản ghi (V02 đã hết nấc đuôi nên sang dòng V03), đồng bộ hệ nút bản ghi',
          chi:[
            { ver:'V03.00', chinh:'Thêm bản ghi cho trang này' },
            { ver:'V03.01', chinh:'Cửa vào bản ghi đổi từ nút hình sang chính dòng chữ Khối vận hành, trỏ vào thì chữ đổi màu' },
            { ver:'V03.02', chinh:'Cửa vào bản ghi im lặng hoàn toàn, bỏ mọi lời chỉ đường; nới vùng chạm của nút đóng' },
            { ver:'V03.03', chinh:'Cửa mã bản ghi trả lại gợi ý sau ba lần sai, rút gọn còn một nửa và nhớ luôn' },
            { ver:'V03.04', chinh:'Cửa mã bản ghi nới lượt thử sai lên năm, đếm cộng dồn theo phiên' }
          ] }
      ]
    },
    'HAN-B': {
      ten: 'HongHan’s Secret Chamber', duong: '/han/961030-b',
      doi: [
        { ngay:'2026-08-17', ver:'V01', so:null, chinh:'Dải ngân hà, đồng hồ đếm ngược. Số đuôi chạy quá luật (tới .11) nên đã nắn sang V02' },
        { ngay:'2026-08-24', ver:'V02', so:'06',
          chinh:'Chỉnh luật cửa mã, nắn lại số cho đúng luật, thêm bản ghi, đồng bộ hệ nút bản ghi',
          chi:[
            { ver:'V02.00 → V02.01', chinh:'Chỉnh luật cửa mã, nắn lại số cho đúng luật, thêm bản ghi' },
            { ver:'V02.02', chinh:'Cửa vào bản ghi đổi từ nút hình sang chính dòng chữ Khối vận hành, trỏ vào thì chữ đổi màu' },
            { ver:'V02.03', chinh:'Cửa vào bản ghi im lặng hoàn toàn, bỏ mọi lời chỉ đường; nới vùng chạm của nút đóng' },
            { ver:'V02.04', chinh:'Cửa mã bản ghi trả lại gợi ý sau ba lần sai, rút gọn còn một nửa và nhớ luôn' },
            { ver:'V02.05', chinh:'Cửa mã bản ghi nới lượt thử sai lên năm, đếm cộng dồn theo phiên' }
          ] }
      ]
    },
    /* ── FX CHƯA CÓ CỬA VÀO ────────────────────────────────────────────
       Màn pháo hoa là trang DUY NHẤT trong bộ không có bảng điều khiển nào —
       không có cửa hậu, không có hộp lệnh, chỉ có một nút đóng. Không có chỗ
       nào để giấu cửa mà không phải đẻ ra một cửa hậu mới, nên trang đó KHÔNG
       nạp file này. Dữ liệu vẫn giữ sẵn: hôm nào trang đó có bảng điều khiển
       thì chỉ việc nạp file và đánh dấu `data-ls="FX"`, khỏi dựng lại số liệu. */
    /* Ba mốc dưới đây dò thẳng lịch sử `phao-hoa/index.html` qua từng commit
       (tem tự khai ở thẻ `.vstamp`, diff giữa hai bản cho biết cái gì vừa
       thêm). Bản trước ghi V1·V2 "no info" và V3 ngày 17-08 — cả hai đều
       không có nguồn; nay thay bằng số đo được.
       Sổ này CHƯA CÓ CỬA VÀO, xem ghi chú ngay dưới. */
    FX: {
      ten: 'Màn pháo hoa', duong: '/phao-hoa',
      doi: [
        { ngay:'2026-08-14', ver:'V01', so:null,
          chinh:'Màn pháo hoa đầu tiên: bắn tự động, lời chúc hiện dần, thêm chế độ chạm-để-bắn' },
        { ngay:'2026-08-15', ver:'V02', so:null,
          chinh:'Quả trứng và vụ nổ vẽ tay trên canvas, thêm nút bắn lại và lối vào khu Easter Egg' },
        { ngay:'2026-08-19', ver:'V03', so:'04',
          chinh:'Chỉnh khung màn và chỗ đứng của tem phiên bản' }
      ]
    }
  };

  /* ═══ CSS ═════════════════════════════════════════════════════════════
     Nút KHÔNG khai màu của riêng nó — dùng `currentColor` để mượn màu chữ
     của bảng đang chứa nó. Nhờ vậy một mẩu HTML nằm vừa cả Box Tổng tư lệnh
     (nền tối, chữ sáng) lẫn Khối vận hành bên Zoey's Castle (nền pastel, chữ
     tím mực) mà không phải viết hai bộ CSS. */
  /* ═══ CSS ═════════════════════════════════════════════════════════════
     Hộp KHÔNG có bảng màu riêng. Mọi màu đọc từ sáu biến `--ls-*`; trang nào
     khai đè thì hộp mang màu trang đó, không khai thì rơi về bộ tối mặc định.
     Vì sao: đã báo "tự dưng UI bản ghi to hơn hẳn khung màn hình, không muốn
     đổi UI mới". Một hộp tối kiểu terminal bật ra giữa Zoey's Castle pastel
     đúng là lạc hẳn — nay nó đi theo màu của chính trang đang đứng.
     Bề ngang cũng đọc từ `--ls-w`, mặc định bám theo thẻ hẹp nhất trong bộ
     (340px) chứ không phải 520px như bản trước.

     ═══ BẪY ĐÃ VẤP · MÀU MẶC ĐỊNH ĐÈ MẤT MÀU TRANG ═════════════════════
     Bản đầu khai bộ màu mặc định bằng một khối `:root{...}` ngay trong CSS
     này. Hỏng: file này gắn thẻ <style> vào cuối <head>, tức là nạp SAU toàn
     bộ CSS của trang. Hai khối `:root` cùng độ ưu tiên thì khối SAU thắng —
     nên trang khai màu pastel xong vẫn ra hộp tối thui.
     Nay không có khối `:root` nào ở đây nữa: mỗi chỗ dùng tự mang giá trị
     dự phòng trong chính `var(--x, dự-phòng)`. Trang khai thì trang thắng,
     trang không khai thì rơi về bộ tối — đúng thứ tự mong muốn. */
  var CSS = [
    /* Cửa ẩn: KHÔNG hình hài gì. Chỉ chặn bôi đen chữ để gõ ba nhịp không
       dính một mảng xanh, và chặn menu chạm-giữ trên điện thoại. */
    '[data-ls]{-webkit-user-select:none;user-select:none;-webkit-touch-callout:none;',
      '-webkit-tap-highlight-color:transparent}',
    /* ═══ CỬA VÀO LÀ CHỮ, KHÔNG PHẢI ICON ══════════════════════════════
       BỎ HẲN NÚT TRÒN `.ls-key`. Nó sai ở hai chỗ:
         · Bảng nào cũng đã có sẵn một dòng nhãn nói đúng tên chỗ đó ("Khối
           vận hành", "Mission 3 · Phá đảo"). Đẻ thêm một nút tròn cạnh dòng
           nhãn là hai thứ cùng trỏ vào một việc, mà cái nút thì chẳng nói
           được nó làm gì — phải bấm thử mới biết.
         · Cửa hậu mà có một nút tròn viền sáng đứng chình ình thì hết là cửa
           hậu. Ai mở bảng ra cũng thấy ngay "có cái gì đó bấm được ở đây".

       NAY: gắn thẳng `data-ls` lên CHÍNH DÒNG CHỮ đã có, thêm class `.ls-chu`.
       Cách vào KHÔNG đổi một nét nào — vẫn 3 nhịp rồi gõ mã.

       Dấu hiệu duy nhất là lúc TRỎ VÀO: chữ ăn màu nhấn của trang, sáng lên
       một quầng mỏng rồi nháy chậm. Đứng yên thì không có gì cả — không viền,
       không nền, không con trỏ bàn tay (giữ đúng luật cửa hậu ở §5.1 của
       DESIGN-SYSTEM: nút chỉ có hình thì mới bắt buộc chú thích, còn cửa hậu
       thì càng không có hình hài càng tốt).

       `.go` là nhịp sáng lúc bấm trúng, do bộ đếm nhịp bật lên 200ms — cho
       biết cú bấm ăn, nhưng KHÔNG đếm hộ còn mấy nhịp. */
    '.ls-chu{-webkit-tap-highlight-color:transparent;',
      'transition:color .18s ease,text-shadow .18s ease,opacity .18s ease}',
    '.ls-chu:hover,.ls-chu:focus-visible{outline:none;opacity:1;',
      'color:var(--ls-acc,#8CE1B4);text-shadow:0 0 10px currentColor;',
      'animation:lsNhay 1.15s ease-in-out infinite}',
    '@keyframes lsNhay{0%,100%{opacity:1}50%{opacity:.42}}',
    '.ls-chu.go{animation:none;opacity:1;',
      'color:var(--ls-acc,#8CE1B4);text-shadow:0 0 12px currentColor}',
    '@media (prefers-reduced-motion:reduce){',
      '.ls-chu:hover,.ls-chu:focus-visible{animation:none}}',

    '.ls-nen{position:fixed;inset:0;z-index:99999;display:none;',
      'align-items:center;justify-content:center;padding:16px;',
      'background:rgba(2,6,14,.6);-webkit-backdrop-filter:blur(5px);backdrop-filter:blur(5px);',
      'font-family:"Be Vietnam Pro",system-ui,"Noto Sans",sans-serif;',
      '-webkit-user-select:none;user-select:none}',
    '.ls-nen.on{display:flex}',
    /* KHÔNG để overflow ở đây — ảnh cô AI vắt lên trên mép hộp, hộp mà cắt là
       đầu cô bị xén ngang (đã vấp đúng lỗi này). Cuộn giao cho `.ls-than`. */
    '.ls-hop{position:relative;width:var(--ls-w,min(340px,92vw));max-width:100%;',
      'background:var(--ls-bg,linear-gradient(180deg,#0d1a2e 0%,#070e1c 100%));color:var(--ls-fg,#EAF0F7);',
      'border:1px solid var(--ls-line,rgba(234,240,247,.12));border-radius:14px;padding:46px 15px 16px;',
      'box-shadow:0 20px 50px rgba(0,0,0,.45);',
      'animation:lsLen .3s cubic-bezier(.16,1,.3,1) both}',
    '@keyframes lsLen{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none}}',
    /* ═══ VÙNG CUỘN · THANH KÉO KIỂU LÁ THƯ ════════════════════════════
       BẢN TRƯỚC ĐỂ THANH CUỘN MẶC ĐỊNH — và đó là thứ xấu nhất trong hộp:
       trên Windows nó là một máng xám dày 17px có hai nút mũi tên ở hai đầu,
       dán thẳng vào mép phải một cái hộp bo góc 14px. Máng đó mang màu của hệ
       điều hành chứ không mang màu của trang, nên đứng ở Zoey's Castle pastel
       thì nó xám, đứng ở bản đồ tối thì nó lại sáng. Nhìn ra ngay là một mẩu
       trình duyệt lọt vào giữa một khung được vẽ tay.

       Bộ này đã có sẵn MỘT lối cuộn đẹp — mấy khung đọc THƯ: không máng, không
       nút, chỉ có nội dung trôi và hai mép trên dưới nhoà dần cho biết còn chữ
       ở ngoài tầm mắt (`.wrap::-webkit-scrollbar{width:0}` bên Zoey's Castle,
       `.letterbox` bên Gate 2). Nay chép đúng lối đó sang đây, thêm một nấc:

         · THANH MẢNH 4px, KHÔNG MÁNG. `scrollbar-width:thin` cho Firefox,
           `::-webkit-scrollbar` cho phần còn lại. Máng để trong suốt hẳn —
           nền hộp chạy liền một mạch tới mép.
         · TAY KÉO mượn `--ls-acc` của trang, đục 34%, bo tròn hết cỡ nên nhìn
           như một nét bút chứ không phải một cái nút. Trỏ vào thì đậm lên 62%.
         · HAI MÉP NHOÀ bằng `mask-image`: mép trên chỉ nhoà khi đã cuộn xuống,
           mép dưới chỉ nhoà khi còn chữ phía dưới — hai biến `--ls-tren` /
           `--ls-duoi` do JS bật tắt (xem `ganNhoaMep`). Đứng ở đầu bảng mà mép
           trên đã mờ sẵn thì thành ra dòng tiêu đề bị cắt cụt.
         · `overflow-x:hidden` — bảng bốn cột đã bó đúng bề ngang hộp, không
           bao giờ được đẻ thêm một thanh cuộn NGANG. */
    '.ls-than{max-height:min(62vh,420px);overflow-y:auto;overflow-x:hidden;',
      '-webkit-overflow-scrolling:touch;overscroll-behavior:contain;',
      'scrollbar-width:thin;scrollbar-color:var(--ls-acc,#8CE1B4) transparent;',
      'padding-right:6px;margin-right:-6px;',
      '-webkit-mask-image:linear-gradient(to bottom,',
        'transparent 0,#000 var(--ls-tren,0px),',
        '#000 calc(100% - var(--ls-duoi,0px)),transparent 100%);',
      'mask-image:linear-gradient(to bottom,',
        'transparent 0,#000 var(--ls-tren,0px),',
        '#000 calc(100% - var(--ls-duoi,0px)),transparent 100%);',
      'transition:-webkit-mask-image .2s,mask-image .2s}',
    '.ls-than::-webkit-scrollbar{width:4px;height:4px}',
    '.ls-than::-webkit-scrollbar-track{background:transparent}',
    '.ls-than::-webkit-scrollbar-thumb{border-radius:999px;',
      'background:var(--ls-acc,#8CE1B4);opacity:.34}',
    /* Safari/Chrome không nhận `opacity` trên thumb — pha loãng bằng
       color-mix, máy nào chưa hiểu color-mix thì rơi về đúng màu nhấn đặc. */
    '@supports (background:color-mix(in srgb,red 30%,transparent)){',
      '.ls-than::-webkit-scrollbar-thumb{',
        'background:color-mix(in srgb,var(--ls-acc,#8CE1B4) 34%,transparent)}',
      '.ls-than:hover::-webkit-scrollbar-thumb,.ls-than:focus-within::-webkit-scrollbar-thumb{',
        'background:color-mix(in srgb,var(--ls-acc,#8CE1B4) 62%,transparent)}}',

    /* Cô AI vắt ở mép trên, nhìn xuống chỗ vừa mò ra. Ảnh gốc là cảnh ngang
       800x446, cắt tròn lấy phần đầu — `object-position` 50%/30% đo bằng mắt
       cho khuôn mặt nằm trọn trong vòng tròn, không cụt trán cũng không thừa. */
    '.ls-ai{position:absolute;top:-30px;left:50%;transform:translateX(-50%) rotate(-4deg);',
      'width:64px;height:64px;border-radius:50%;overflow:hidden;',
      'border:2px solid var(--ls-acc,#8CE1B4);background:var(--ls-bg,linear-gradient(180deg,#0d1a2e 0%,#070e1c 100%));',
      'box-shadow:0 8px 20px rgba(0,0,0,.4)}',
    '.ls-ai img{width:100%;height:100%;object-fit:cover;object-position:50% 30%;display:block}',

    /* Vòng ✕ nhìn thì 28px, nhưng VÙNG BẤM nới ra ~44px bằng `::before` — cùng
       cách đã dùng cho `.grip` và `.cx-close` ngoài bản đồ. Không tăng padding
       vì nút neo tuyệt đối vào góc phải trên: tăng padding là dấu ✕ tự dịch
       vào trong, lệch khỏi chỗ mắt đã quen. */
    '.ls-x{position:absolute;top:8px;right:10px;width:28px;height:28px;border:0;',
      'background:none;color:var(--ls-mo,rgba(234,240,247,.5));font-size:15px;line-height:1;cursor:pointer;padding:0}',
    '.ls-x::before{content:"";position:absolute;inset:-8px}',
    '.ls-x:hover{color:var(--ls-fg,#EAF0F7)}',

    '.ls-tit{margin:0;text-align:center;font-family:"Oswald","Be Vietnam Pro",system-ui,sans-serif;',
      'font-size:11.5px;font-weight:600;letter-spacing:.22em;text-transform:uppercase;',
      'color:var(--ls-acc,#8CE1B4)}',
    '.ls-sub{margin:5px 0 0;text-align:center;font-size:10.5px;line-height:1.55;color:var(--ls-mo,rgba(234,240,247,.5))}',

    /* ── cửa mã ── */
    '.ls-o{display:flex;gap:7px;justify-content:center;margin:14px 0 0}',
    '.ls-o i{width:34px;height:40px;border:1px solid var(--ls-line,rgba(234,240,247,.12));border-radius:6px;',
      'display:flex;align-items:center;justify-content:center;font-style:normal;',
      'font-family:"Oswald","Be Vietnam Pro",system-ui,sans-serif;font-size:19px;',
      'color:var(--ls-acc,#8CE1B4)}',
    '.ls-o i.co{border-color:var(--ls-acc,#8CE1B4)}',
    '.ls-hop.rung{animation:lsRung .38s}',
    '@keyframes lsRung{0%,100%{transform:translateX(0)}20%{transform:translateX(-6px)}',
      '40%{transform:translateX(6px)}60%{transform:translateX(-3px)}80%{transform:translateX(3px)}}',
    /* Dòng gợi ý dưới hàng ô. Chừa sẵn chiều cao `min-height` kể cả lúc chưa
       có chữ: gợi ý hiện ra giữa chừng mà hộp cao thêm một nấc thì nhìn như
       hộp giật. Chưa tới lượt gợi ý thì đây là một khoảng trống, không phải
       chỗ báo lỗi — gõ sai KHÔNG bao giờ hiện chữ gì ở đây. */
    '.ls-msg{margin:9px 0 0;text-align:center;font-size:11px;line-height:1.5;',
      'min-height:1.5em;color:var(--ls-mo,rgba(234,240,247,.5))}',
    /* Tông vàng đất — khác hẳn màu nhấn của bảng, để mắt biết ngay đây là lời
       mách chứ không phải một dòng nội dung bình thường. */
    '.ls-msg.goi{color:#d79a2b;letter-spacing:.02em}',
    /* Ô nhập thật nằm dưới, trong suốt — bàn phím ảo trên điện thoại phải có
       một <input> thật mới bật lên được, mấy ô vuông trên kia chỉ để nhìn. */
    '.ls-in{position:absolute;opacity:0;width:1px;height:1px;border:0;padding:0}',

    /* ── bảng ── */
    /* ═══ CĂN LỀ · TẤT CẢ VỀ GÓC TRÁI ══════════════════════════════════
       Bản trước cột "#" và ô tiêu đề cuối căn PHẢI, còn dòng "đang chạy" thì
       căn GIỮA — ba kiểu căn trong cùng một bảng, mắt đọc xuống cứ phải nhảy
       qua nhảy lại. Nay mọi thứ trong khối bảng đều bám mép trái, chỉ tiêu đề
       hộp và ảnh là còn ở giữa. */
    '.ls-nhom{text-align:left}',
    '.ls-nhom p.d{margin:0 0 8px;font-family:"Oswald","Be Vietnam Pro",system-ui,sans-serif;',
      'font-size:9px;letter-spacing:.12em;color:var(--ls-mo,rgba(234,240,247,.5));text-align:left}',
    /* Build đứng TRƯỚC, ngày theo sau: số build là thứ người ta dò, ngày chỉ
       để đối chiếu. Cột nào cũng căn trái. */
    '.ls-doi{display:grid;grid-template-columns:46px 58px 30px 1fr;gap:5px 6px;',
      'padding:6px 0;border-top:1px dashed var(--ls-line,rgba(234,240,247,.12));font-size:10.5px;line-height:1.45;',
      'text-align:left}',
    '.ls-doi:first-of-type{border-top:0}',
    '.ls-doi b{font-family:"Oswald","Be Vietnam Pro",system-ui,sans-serif;font-weight:500;',
      'font-size:9px;letter-spacing:.02em;white-space:nowrap;color:var(--ls-mo,rgba(234,240,247,.5))}',
    '.ls-doi b.v{color:var(--ls-acc,#8CE1B4)}',
    '.ls-doi b.n{font-size:8.5px;white-space:nowrap}',
    '.ls-doi span{color:var(--ls-fg,#EAF0F7);opacity:.85}',
    '.ls-doi span em,.ls-doi b em{font-style:normal;opacity:.5}',
    /* Dòng có bản ghi chi tiết thì bấm được — thêm mũi nhắc ở cuối câu. */
    '.ls-doi.co-chi{cursor:pointer}',
    '.ls-doi.co-chi:hover span,.ls-doi.co-chi:focus-visible span{opacity:1}',
    '.ls-doi.co-chi span::after{content:" ›";color:var(--ls-acc,#8CE1B4);font-weight:700}',
    '.ls-dau{display:grid;grid-template-columns:46px 58px 30px 1fr;gap:6px;padding-bottom:5px;',
      'font-family:"Oswald","Be Vietnam Pro",system-ui,sans-serif;font-size:8px;',
      'letter-spacing:.05em;text-transform:uppercase;white-space:nowrap;text-align:left;',
      'color:var(--ls-acc,#8CE1B4);opacity:.75}',
    '@media(max-width:360px){.ls-doi,.ls-dau{grid-template-columns:44px 56px 28px 1fr;gap:4px 4px}',
      '.ls-doi b{font-size:8.5px}}',
    '.ls-chan{margin:12px 0 0;padding-top:10px;border-top:1px solid var(--ls-line,rgba(234,240,247,.12));',
      'font-size:9.5px;line-height:1.6;color:var(--ls-mo,rgba(234,240,247,.5));text-align:left}',

    /* ── bảng chi tiết một build ── */
    '.ls-lui{display:inline-flex;align-items:center;gap:5px;margin:0 0 10px;padding:5px 9px;',
      'border:1px solid var(--ls-line,rgba(234,240,247,.12));border-radius:999px;background:none;cursor:pointer;',
      'font-family:"Oswald","Be Vietnam Pro",system-ui,sans-serif;font-size:8.5px;letter-spacing:.16em;',
      'text-transform:uppercase;color:var(--ls-mo,rgba(234,240,247,.5))}',
    '.ls-lui:hover{color:var(--ls-fg,#EAF0F7)}',
    '.ls-nho{display:grid;grid-template-columns:52px 1fr;gap:5px 8px;padding:6px 0;text-align:left;',
      'border-top:1px dashed var(--ls-line,rgba(234,240,247,.12));font-size:10.5px;line-height:1.45}',
    '.ls-nho:first-of-type{border-top:0}',
    '.ls-nho b{font-family:"Oswald","Be Vietnam Pro",system-ui,sans-serif;font-weight:500;font-size:9px;',
      'white-space:nowrap;color:var(--ls-acc,#8CE1B4)}',
    '.ls-nho span{color:var(--ls-fg,#EAF0F7);opacity:.85}'
  ].join('');

  var style = document.createElement('style');
  style.textContent = CSS;
  (document.head || document.documentElement).appendChild(style);

  /* ═══ CỬA VÀO ═════════════════════════════════════════════════════════
     Trả về CHUỖI THUỘC TÍNH chứ không phải một phần tử: mấy bảng điều khiển
     trong bộ này đều dựng bằng innerHTML nối chuỗi, mà cửa vào nay là chính
     dòng chữ đã có sẵn ở đó — không đẻ thêm thẻ nào cả. Dùng:

         '<p class="ov-lab"><span ' + LichSu.chu('HAN-A') + '>Khối vận hành</span></p>'

     Gắn được lên bất cứ thẻ nào: <span>, <p>, cả dòng tiêu đề của một hộp
     (xem `openDone` bên /dad/950901-a). Không phải gắn sự kiện gì — file tự
     nghe ở cấp tài liệu.
     `nut()` (nút tròn có icon) đã BỎ, xem ghi chú trong khối CSS ở trên. */
  function chu(ma) {
    return 'class="ls-chu" data-ls="' + ma + '"';
  }

  /* ═══ HỘP ═════════════════════════════════════════════════════════════ */
  var nen = null, hop = null;
  function dungHop() {
    if (nen) return;
    nen = document.createElement('div');
    nen.className = 'ls-nen';
    nen.setAttribute('aria-hidden', 'true');
    hop = document.createElement('div');
    hop.className = 'ls-hop';
    nen.appendChild(hop);
    document.body.appendChild(nen);
    nen.addEventListener('click', function (e) { if (e.target === nen) dong(); });
    addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nen.classList.contains('on')) dong();
    });
  }
  function dong() {
    if (!nen) return;
    nen.classList.remove('on');
    nen.setAttribute('aria-hidden', 'true');
  }
  /* Ảnh cô AI và nút đóng nằm NGOÀI phần cuộn: `.ls-hop` không có overflow nên
     ảnh vắt lên trên mép hộp vẫn nguyên vẹn, còn nội dung dài thì cuộn trong
     `.ls-than`. Để overflow ở hộp là đầu cô bị xén ngang — đã vấp. */
  function khung(than) {
    hop.innerHTML =
        '<div class="ls-ai"><img src="' + ANH + '" alt="" decoding="async"></div>'
      + '<button class="ls-x" type="button" aria-label="Đóng">&#10005;</button>'
      + '<div class="ls-than">' + than + '</div>';
    hop.querySelector('.ls-x').addEventListener('click', dong);
    ganNhoaMep(hop.querySelector('.ls-than'));
  }

  /* ═══ HAI MÉP NHOÀ · CHỈ NHOÀ KHI CÒN CHỮ Ở NGOÀI TẦM MẮT ═══════════════
     Mượn đúng lối của mấy khung đọc THƯ trong bộ này: thay vì một cái máng
     cuộn, để hai mép tự nhoà đi — mắt đọc ra ngay là "còn nữa ở dưới".
     Nhưng phải nhoà CÓ ĐIỀU KIỆN: nhoà sẵn cả hai mép thì lúc đứng ở đầu bảng,
     dòng tiêu đề "BUILD · NGÀY · # · SỬA CHÍNH" đã mờ tịt — trông như bị cắt
     cụt chứ không phải như còn chữ.
       · mép TRÊN chỉ nhoà khi đã cuộn xuống (scrollTop > 0)
       · mép DƯỚI chỉ nhoà khi chưa chạm đáy
     Nội dung ngắn hơn khung thì không mép nào nhoà cả.
     Đo lại ở ba chỗ: lúc dựng, lúc cuộn, lúc đổi cỡ cửa sổ. Không nghe được
     ResizeObserver (trình duyệt cũ) thì bỏ, hai mốc kia vẫn đủ. */
  var NHOA = 16;                       /* độ dày dải nhoà, px */
  function ganNhoaMep(n) {
    if (!n) return;
    function do_() {
      var con = n.scrollHeight - n.clientHeight;
      var tren = con > 1 && n.scrollTop > 1;
      var duoi = con > 1 && n.scrollTop < con - 1;
      n.style.setProperty('--ls-tren', (tren ? NHOA : 0) + 'px');
      n.style.setProperty('--ls-duoi', (duoi ? NHOA : 0) + 'px');
    }
    n.addEventListener('scroll', do_, { passive: true });
    try { new ResizeObserver(do_).observe(n); } catch (e) {}
    do_();
    /* Ảnh cô AI và phông chữ về sau có thể đẩy chiều cao đổi một nhịp nữa */
    setTimeout(do_, 120);
  }

  /* Mở mã rồi thì trong PHIÊN này khỏi hỏi lại — nhưng nhớ RIÊNG TỪNG TRANG,
     mở sổ bên này không mở hộ sổ bên kia. Đóng trình duyệt là quên sạch. */
  function daMo(ma) {
    try { return sessionStorage.getItem('ls_ok_' + ma) === '1'; } catch (e) { return false; }
  }
  function ghiMo(ma) {
    try { sessionStorage.setItem('ls_ok_' + ma, '1'); } catch (e) {}
  }

  /* Gợi ý nhớ trong localStorage (KHÔNG phải sessionStorage như cờ mở mã):
     đóng trình duyệt rồi mở lại vẫn còn. Và nhớ CHUNG cho cả bộ, không tách
     theo từng trang — mã vào chỉ có một, mò ra ở đâu thì coi như biết rồi. */
  /* Cộng một lần sai vào bộ đếm của PHIÊN, trả về tổng mới. */
  function demSai() {
    try {
      var n = (+sessionStorage.getItem(KHOA_SAI) || 0) + 1;
      sessionStorage.setItem(KHOA_SAI, n);
      return n;
    } catch (e) { return 0; }      /* chặn sessionStorage → thôi, không mách */
  }
  function daThayGoiY() {
    try { return localStorage.getItem(KHOA_GOI_Y) === '1'; } catch (e) { return false; }
  }
  function ghiThayGoiY() {
    try { localStorage.setItem(KHOA_GOI_Y, '1'); } catch (e) {}
  }

  function veCuaMa(ma) {
    var go = '';
    var t = SO[ma];
    /* Bốn ô vuông rỗng. Bỏ câu "4 chữ số" — bốn cái ô đã nói đúng bấy nhiêu
       rồi, viết thêm là thừa. `#lsMsg` để trống, chỉ dùng cho GỢI Ý. */
    khung(
        '<h2 class="ls-tit">Bản ghi</h2>'
      + '<p class="ls-sub">' + t.ten + '</p>'
      + '<div class="ls-o"><i></i><i></i><i></i><i></i></div>'
      + '<p class="ls-msg" id="lsMsg"></p>'
      + '<input class="ls-in" id="lsIn" type="text" inputmode="numeric" '
      +   'autocomplete="off" maxlength="4" aria-label="Mã vào bản ghi">'
    );
    var o   = hop.querySelectorAll('.ls-o i');
    var msg = hop.querySelector('#lsMsg');
    var inp = hop.querySelector('#lsIn');

    function hienGoiY() {
      msg.textContent = GOI_Y;
      msg.className = 'ls-msg goi';
    }
    /* Đã từng thấy gợi ý ở lần mở nào trước đó → hiện luôn từ đầu. Không bắt
       gõ sai lại ba lần nữa: người ta trả giá một lần là đủ. */
    if (daThayGoiY()) hienGoiY();

    function ve() {
      for (var i = 0; i < o.length; i++) {
        o[i].textContent = go[i] ? '•' : '';
        o[i].className = go[i] ? 'co' : '';
      }
    }
    /* GÕ SAI THÌ IM — không báo lỗi, không đếm hộ còn mấy lần. Phản hồi duy
       nhất là một cú rung: đủ để biết máy có nhận cú gõ, không đủ để suy ra gì.
       Đủ SAI_TOI_DA lần mới mở gợi ý, và từ đó nhớ luôn. */
    function cham() {
      if (go === MA) { ghiMo(ma); veSo(ma); return; }
      go = ''; inp.value = ''; ve();
      hop.classList.remove('rung'); void hop.offsetWidth; hop.classList.add('rung');
      if (demSai() >= SAI_TOI_DA) { ghiThayGoiY(); hienGoiY(); }
    }
    inp.addEventListener('input', function () {
      go = inp.value.replace(/\D/g, '').slice(0, 4);
      inp.value = go;
      ve();
      if (go.length === 4) setTimeout(cham, 140);
    });
    inp.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' && go.length === 4) { e.preventDefault(); cham(); }
    });
    hop.addEventListener('click', function () { inp.focus(); });
    setTimeout(function () { try { inp.focus(); } catch (e) {} }, 120);
    ve();
  }

  /* Chỗ nào không có số liệu thì ghi N/A — một chữ, dùng chung cho cả cột số
     lẫn cột chữ. Trước đây hai chỗ hai kiểu ("thiếu info" / "no info"), đọc
     xuống tưởng là hai nghĩa khác nhau trong khi cùng nghĩa "không biết". */
  var NA = '<em>N/A</em>';

  /* Đếm số build lớn thật sự của một dòng: dòng gộp ("V1 → V21", "V11 · V12")
     tính đủ số build nó gộp, chứ không tính là một. */
  function demBuild(ver) {
    var s = String(ver);
    var m = s.match(/V(\d+)\s*(?:→|->)\s*V?(\d+)/i);
    if (m) return Math.max(1, (+m[2] - +m[1]) + 1);
    return (s.match(/V\d+/gi) || ['V']).length;
  }

  function veSo(ma) {
    var t = SO[ma], d = t.doi, cuoi = d[d.length - 1];
    var tongLon = 0, tongNho = 0;
    for (var i = 0; i < d.length; i++) {
      tongLon += demBuild(d[i].ver);
      if (d[i].so != null) tongNho += +d[i].so;
    }
    var h = '<h2 class="ls-tit">' + t.ten + '</h2>'
          + '<p class="ls-sub">Đơn vị điều phối: Zoeyzuize</p>'
          + '<div class="ls-nhom"><p class="d">ĐANG CHẠY ' + cuoi.ver + '</p>'
          + '<div class="ls-dau"><i>Build</i><i>Ngày</i><i>#</i><i>Sửa chính</i></div>';
    for (var k = 0; k < d.length; k++) {
      var r = d[k];
      var so   = (r.so == null) ? NA : r.so;
      var ngay = (!r.ngay || r.ngay === 'no info') ? NA : r.ngay;
      var ch   = r.chinh.replace(/no info/g, 'N/A');
      var coChi = r.chi && r.chi.length;
      h += '<div class="ls-doi' + (coChi ? ' co-chi' : '') + '"'
         + (coChi ? ' data-chi="' + k + '" role="button" tabindex="0"' : '') + '>'
         + '<b class="v">' + r.ver + '</b><b>' + ngay + '</b>'
         + '<b class="n">' + so + '</b><span>' + ch + '</span></div>';
    }
    /* ═══ CÔNG THỨC ĐẾM ══════════════════════════════════════════════════
       Luật đánh số của cả bộ: một build LỚN đẻ tối đa MƯỜI bản nhỏ, đuôi
       chạy .00 → .09; hết .09 là phải sang build lớn kế tiếp. Vậy trần bản
       nhỏ của một trang luôn bằng (số build lớn × 10) — ghi thẳng công thức
       ra đây để lần sau khỏi phải đoán vì sao con số này lại thế. */
    h += '</div><p class="ls-chan">'
       + '<b>Công thức:</b> 1 build lớn = tối đa 10 bản nhỏ (đuôi .00 → .09).<br>'
       + 'Trần bản nhỏ = số build lớn × 10.<br>'
       + 'Trang này: <b>' + tongLon + '</b> build lớn · <b>' + tongNho + '</b>/'
       +   (tongLon * 10) + ' bản nhỏ ghi nhận được.<br>'
       + '<em>Thông tin ghi nhận không đầy đủ — mấy build đời đầu chỉ lụm lại '
       +   'được từ mốc còn sót, chỗ nào không có thì để N/A.</em></p>';
    khung(h);
    /* Bấm một dòng có bản ghi chi tiết → mở bảng nhỏ của riêng build đó. */
    var ds = hop.querySelectorAll('.ls-doi.co-chi');
    for (var j = 0; j < ds.length; j++) {
      (function (n) {
        function moChi() { veChiTiet(ma, +n.getAttribute('data-chi')); }
        n.addEventListener('click', moChi);
        n.addEventListener('keydown', function (e) {
          if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); moChi(); }
        });
      })(ds[j]);
    }
  }

  /* ═══ BẢNG CHI TIẾT MỘT BUILD ═══════════════════════════════════════════
     Từ V17 trở đi mỗi build lớn ghi rõ từng bản nhỏ: đuôi mấy, làm gì. Bảng
     ngoài giữ một dòng gọn cho dễ dò, chi tiết nằm sau một cú bấm — không thì
     sổ dài ra gấp mười mà chín phần là chuyện vụn. */
  function veChiTiet(ma, k) {
    var t = SO[ma], r = t.doi[k], c = r.chi || [];
    var h = '<h2 class="ls-tit">' + r.ver + '</h2>'
          + '<p class="ls-sub">' + t.ten + ' · '
          +   ((!r.ngay || r.ngay === 'no info') ? 'N/A' : r.ngay) + '</p>'
          + '<div class="ls-nhom"><button class="ls-lui" id="lsLui" type="button">‹ Bản ghi</button>';
    for (var i = 0; i < c.length; i++)
      h += '<div class="ls-nho"><b>' + c[i].ver + '</b><span>' + c[i].chinh + '</span></div>';
    h += '</div><p class="ls-chan">' + c.length + '/10 bản nhỏ của build này có ghi chép.<br>'
       + '<em>Đuôi chạy .00 → .09, hết nấc là sang build lớn kế tiếp.</em></p>';
    khung(h);
    hop.querySelector('#lsLui').addEventListener('click', function () { veSo(ma); });
  }

  function mo(ma) {
    if (!SO[ma]) return;
    dungHop();
    nen.classList.add('on');
    nen.setAttribute('aria-hidden', 'false');
    if (daMo(ma)) veSo(ma); else veCuaMa(ma);
  }

  /* ═══ ĐẾM NHỊP ════════════════════════════════════════════════════════
     Nghe ở CẤP TÀI LIỆU chứ không gắn thẳng vào nút. Lý do: mấy bảng điều
     khiển trong bộ này dựng lại bằng innerHTML mỗi lần mở, nút cũ bị vứt đi
     và một nút mới thế chỗ — gắn sự kiện thẳng vào nút thì lần mở thứ hai
     là nút chết. Nghe ở tài liệu thì nút dựng ra lúc nào cũng chạy. */
  var dem = 0, hen = null, dangDem = null;
  document.addEventListener('click', function (e) {
    var b = e.target && e.target.closest ? e.target.closest('[data-ls]') : null;
    if (!b) return;
    e.preventDefault();
    e.stopPropagation();          /* bảng nào đóng khi bấm ra ngoài thì đừng đóng */
    var ma = b.getAttribute('data-ls');
    if (ma !== dangDem) { dangDem = ma; dem = 0; }
    clearTimeout(hen);
    dem++;
    hen = setTimeout(function () { dem = 0; dangDem = null; }, NGUNG);
    /* Sáng lên một nhịp cho biết cú bấm ăn — nhưng KHÔNG đếm hộ còn mấy nhịp,
       biết "một cái nữa thôi" thì hết cả cái thú mò ra. */
    b.classList.add('go');
    setTimeout(function () { b.classList.remove('go'); }, 200);
    if (dem >= NHIP) { dem = 0; dangDem = null; mo(ma); }
  }, true);

  window.LichSu = { chu: chu, mo: mo, so: SO };
})();
