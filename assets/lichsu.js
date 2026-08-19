/* ═════════════════════════════════════════════════════════════════════════
   SỔ PHIÊN BẢN — một file dùng chung, mỗi trang một cuốn sổ RIÊNG
   -------------------------------------------------------------------------
   ĐƯỜNG VÀO (cửa hậu cũ của từng trang GIỮ NGUYÊN, không đụng gì):

       mở bảng điều khiển của trang như xưa nay vẫn mở
         → trong bảng có MỘT NÚT ICON nhỏ
         → bấm 3 nhịp vào nút đó
         → gõ mã
         → hiện sổ CỦA RIÊNG TRANG ĐÓ

   "Của riêng trang đó" là điểm quan trọng nhất: đứng ở Zoey's Castle thì chỉ
   thấy lịch sử của Zoey's Castle, không thấy trang nào khác. Sáu cuốn sổ nằm
   chung một file cho dễ sửa, nhưng KHÔNG BAO GIỜ hiện chung một bảng.

   ── VÌ SAO MỘT FILE DÙNG CHUNG, KHÔNG CHÉP VÀO TỪNG TRANG ────────────────
   Sáu trang, sáu bảng màu, sáu cách dựng khác nhau. Chép cùng một khối mã sáu
   lần thì lần sửa sau kiểu gì cũng sót một trang, mà sót thì không ai biết —
   cửa hậu có ai mở hằng ngày đâu.

   ── CÁCH GẮN VÀO MỘT BẢNG ĐIỀU KHIỂN ────────────────────────────────────
   Nạp file này, rồi nhét đúng một chuỗi HTML vào chỗ muốn đặt nút:

       LichSu.nut('MAP')        → trả về chuỗi HTML của nút

   Không phải gắn sự kiện gì cả: file tự nghe ở cấp tài liệu, nút dựng ra lúc
   nào cũng chạy — kể cả bảng điều khiển được dựng lại bằng innerHTML sau đó.
   ═════════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  /* ── MÃ VÀO ───────────────────────────────────────────────────────────
     0981 = 1890 đọc ngược — năm sinh Bác Hồ. Sai 3 lần thì được ĐÚNG MỘT
     câu gợi ý, và chỉ một: nói tới lần thứ hai thì hết còn là cửa hậu. */
  var MA = '0981';
  var GOI_Y = 'Năm sinh Bác Hồ — soi gương mà đọc.';
  var SAI_TOI_DA = 3;
  var NHIP = 3;         /* bấm bao nhiêu nhịp vào nút thì mở */
  var NGUNG = 900;      /* ngưng bấy nhiêu ms là đếm lại từ đầu */
  var ANH = '/assets/poster/HH_5_idle_afk.webp';

  /* ═══ BẢNG DỮ LIỆU ═══════════════════════════════════════════════════
     MỖI DÒNG LÀ MỘT BUILD LỚN, không phải một bản vá. Cũ nhất nằm trên.
       ngay  — YYYY-MM-DD của build đó, hoặc 'no info'
       ver   — số build, LUÔN GIỮ kể cả khi không biết nó sửa gì
       so    — SỐ BẢN VÁ ghi lại được trong build đó (V10.08 → '09').
               Không biết thì để `null`, bảng tự ghi "thiếu info".
       chinh — sửa gì, GHI CHUNG CHUNG THÔI (xem luật ngay dưới)

     ── LUẬT VIẾT CỘT "SỬA CHÍNH" — ĐỌC TRƯỚC KHI THÊM DÒNG ─────────────
     Sổ này người chơi mở ra đọc được. Nên tuyệt đối KHÔNG ghi:
       · mã, mật khẩu, đáp án, tên nhân vật phải đoán
       · tên biến môi trường, tên khoá lưu, tên endpoint, tên nhà cung cấp
       · bất cứ thứ gì nói ra là bớt được một bước phải mò
     Chỉ ghi LOẠI VIỆC: "cập nhật API", "chỉnh hiệu ứng", "chỉnh luật chơi",
     "đồng bộ hệ nút", "cập nhật giao diện", "thêm đo đạc".

     ── NGUỒN SỐ LIỆU ──────────────────────────────────────────────────
     Ba nguồn, xếp theo độ tin:
       1. số tem đọc thẳng trong mã của từng lượt push (chắc nhất)
       2. mấy file tài liệu cùng thời — chúng cũng chép lại số tem, nhờ vậy
          moi thêm được mấy build mà file thì không còn
       3. đoạn lịch sử chép tay trong dòng bản quyền của bản đồ đời V9-V10
     Chỗ nào cả ba đều im thì ghi 'no info' / 'thiếu info' và GIỮ NGUYÊN số
     build — nói rõ mình không biết, chứ không bịa một dòng nghe cho đẹp. */
  var SO = {
    MAP: {
      ten: 'Bản đồ mật thư', duong: '/',
      doi: [
        { ngay:'no info', ver:'V1',  so:null, chinh:'Bản đồ đầu tiên' },
        { ngay:'no info', ver:'V2',  so:null, chinh:'Thêm đếm ngược và phóng to thu nhỏ' },
        { ngay:'no info', ver:'V3',  so:null, chinh:'Đổi sang khung hẹp, thêm khung phụ' },
        { ngay:'no info', ver:'V4',  so:null, chinh:'Nắn quần đảo về đúng vị trí, thêm hộp mật thư' },
        { ngay:'no info', ver:'V5',  so:null, chinh:'Thêm ô chữ, lời khen, sóng biển' },
        { ngay:'no info', ver:'V6',  so:null, chinh:'Thêm kênh bắt sóng và tên lửa' },
        { ngay:'no info', ver:'V7',  so:null, chinh:'Thêm khối chinh phục' },
        { ngay:'no info', ver:'V8',  so:null, chinh:'Vá tên lửa đen, thêm gõ đúp cho điện thoại' },
        { ngay:'2026-08-04', ver:'V9',  so:null, chinh:'Bỏ rồi ghim lại mã morse, câu trêu xoay vòng, toạ độ mở khoá sáng lên' },
        { ngay:'2026-08-04', ver:'V10', so:'09', chinh:'Huy hiệu tên lửa có vòng đời đầy đủ, lockup cờ' },
        { ngay:'no info', ver:'V11 · V12', so:null, chinh:'no info' },
        { ngay:'2026-08-13', ver:'V15', so:'06', chinh:'Trạng thái GAME ON, cửa hai tầng của hồ sơ niêm phong' },
        { ngay:'no info', ver:'V16', so:null, chinh:'no info' },
        { ngay:'2026-08-17', ver:'V17', so:'09', chinh:'Thêm hộp chào đầu ngày, cập nhật API nội dung, đồng bộ hệ nút, thêm sổ phiên bản' }
      ]
    },
    'DAD-A': {
      ten: 'Easter Egg · Gate 1', duong: '/dad/950901-a',
      doi: [
        { ngay:'no info', ver:'V1 → V21', so:null, chinh:'no info — 21 build đầu không còn bản ghi' },
        { ngay:'2026-08-17', ver:'V22', so:'04', chinh:'Hồ sơ 3 Mission, đồng hồ Mission 2, thêm sổ phiên bản' }
      ]
    },
    'DAD-B': {
      ten: 'Easter Egg · Gate 2', duong: '/dad/950901-b',
      doi: [
        { ngay:'no info', ver:'V1', so:null, chinh:'no info' },
        { ngay:'2026-08-17', ver:'V2',  so:null, chinh:'Hai vòng giải mã. Số đuôi chạy quá luật nên đã nắn sang V03' },
        { ngay:'2026-08-17', ver:'V03', so:'07', chinh:'Nắn lại số cho đúng luật, thêm khu Open World, dựng ảnh nền sạch' },
        { ngay:'2026-08-18', ver:'V04', so:'06', chinh:'Làm lại chuyển cảnh, chỉnh luật chơi và luật gợi ý, chỉnh hiệu ứng đáp án, cập nhật API, nạp trước tài nguyên, thêm đo đạc' }
      ]
    },
    'HAN-A': {
      ten: 'Zoey’s Castle', duong: '/han/961030-a',
      doi: [
        { ngay:'no info', ver:'V1', so:null, chinh:'no info' },
        { ngay:'2026-08-17', ver:'V2', so:'10', chinh:'Bộ câu hỏi và cửa mã, dọn màn hoàn thành, đồng bộ tên gọi và hệ nút' },
        { ngay:'2026-08-19', ver:'V3', so:'01', chinh:'Thêm sổ phiên bản (V2 đã hết nấc đuôi nên sang dòng V3)' }
      ]
    },
    'HAN-B': {
      ten: 'HongHan’s Secret Chamber', duong: '/han/961030-b',
      doi: [
        { ngay:'2026-08-17', ver:'V1', so:null, chinh:'Dải ngân hà, đồng hồ đếm ngược. Số đuôi chạy quá luật (tới .11) nên đã nắn sang V2' },
        { ngay:'2026-08-19', ver:'V2', so:'02', chinh:'Chỉnh luật cửa mã, nắn lại số cho đúng luật, thêm sổ phiên bản' }
      ]
    },
    /* ── FX CHƯA CÓ CỬA VÀO ────────────────────────────────────────────
       Màn pháo hoa là trang DUY NHẤT trong bộ không có bảng điều khiển nào —
       không có cửa hậu, không có hộp lệnh, chỉ có một nút đóng. Không có chỗ
       nào để giấu cửa mà không phải đẻ ra một cửa hậu mới, nên trang đó KHÔNG
       nạp file này. Dữ liệu vẫn giữ sẵn: hôm nào trang đó có bảng điều khiển
       thì chỉ việc nạp file và đánh dấu `data-ls="FX"`, khỏi dựng lại số liệu. */
    FX: {
      ten: 'Màn pháo hoa', duong: '/phao-hoa',
      doi: [
        { ngay:'no info', ver:'V1 · V2', so:null, chinh:'no info' },
        { ngay:'2026-08-17', ver:'V3', so:'04', chinh:'Màn pháo hoa và quả trứng vẽ tay trên canvas' }
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
    /* Riêng chỗ nào muốn có nút thật thì thêm class .ls-key — nút mượn màu
       chữ của bảng chứa nó (currentColor) nên không phải khai màu riêng. */
    '.ls-key{width:28px;height:28px;flex:none;padding:0;border-radius:50%;',
      'display:inline-flex;align-items:center;justify-content:center;vertical-align:middle;',
      'border:1px solid currentColor;background:none;color:inherit;cursor:pointer;',
      'opacity:.42;box-shadow:none;transition:opacity .2s,transform .12s}',
    '.ls-key:hover,.ls-key:focus-visible{opacity:.9;outline:none}',
    '.ls-key:active{transform:scale(.92)}',
    '.ls-key svg{width:14px;height:14px;fill:none;stroke:currentColor;stroke-width:1.7;',
      'stroke-linecap:round;stroke-linejoin:round;display:block}',

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
    '.ls-than{max-height:min(62vh,420px);overflow:auto;-webkit-overflow-scrolling:touch}',

    /* Cô AI vắt ở mép trên, nhìn xuống chỗ vừa mò ra. Ảnh gốc là cảnh ngang
       800x446, cắt tròn lấy phần đầu — `object-position` 50%/30% đo bằng mắt
       cho khuôn mặt nằm trọn trong vòng tròn, không cụt trán cũng không thừa. */
    '.ls-ai{position:absolute;top:-30px;left:50%;transform:translateX(-50%) rotate(-4deg);',
      'width:64px;height:64px;border-radius:50%;overflow:hidden;',
      'border:2px solid var(--ls-acc,#8CE1B4);background:var(--ls-bg,linear-gradient(180deg,#0d1a2e 0%,#070e1c 100%));',
      'box-shadow:0 8px 20px rgba(0,0,0,.4)}',
    '.ls-ai img{width:100%;height:100%;object-fit:cover;object-position:50% 30%;display:block}',

    '.ls-x{position:absolute;top:8px;right:10px;width:28px;height:28px;border:0;',
      'background:none;color:var(--ls-mo,rgba(234,240,247,.5));font-size:15px;line-height:1;cursor:pointer;padding:0}',
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
    '.ls-msg{margin:10px 0 0;text-align:center;font-size:11.5px;min-height:1.5em;color:var(--ls-mo,rgba(234,240,247,.5))}',
    '.ls-msg.xau{color:#e0736b}',
    '.ls-msg.goi{color:#d79a2b}',
    /* Ô nhập thật nằm dưới, trong suốt — bàn phím ảo trên điện thoại phải có
       một <input> thật mới bật lên được, mấy ô vuông trên kia chỉ để nhìn. */
    '.ls-in{position:absolute;opacity:0;width:1px;height:1px;border:0;padding:0}',

    /* ── bảng ── */
    '.ls-nhom p.d{margin:0 0 8px;font-family:"Oswald","Be Vietnam Pro",system-ui,sans-serif;',
      'font-size:9px;letter-spacing:.12em;color:var(--ls-mo,rgba(234,240,247,.5));text-align:center}',
    '.ls-doi{display:grid;grid-template-columns:62px 40px 42px 1fr;gap:5px 6px;',
      'padding:6px 0;border-top:1px dashed var(--ls-line,rgba(234,240,247,.12));font-size:10.5px;line-height:1.45}',
    '.ls-doi:first-of-type{border-top:0}',
    '.ls-doi b{font-family:"Oswald","Be Vietnam Pro",system-ui,sans-serif;font-weight:500;',
      'font-size:9px;letter-spacing:.02em;white-space:nowrap;color:var(--ls-mo,rgba(234,240,247,.5))}',
    '.ls-doi b.v{color:var(--ls-acc,#8CE1B4)}',
    '.ls-doi b.n{text-align:right;font-size:8.5px;white-space:nowrap}',
    '.ls-doi span{color:var(--ls-fg,#EAF0F7);opacity:.85}',
    '.ls-doi span em,.ls-doi b em{font-style:normal;opacity:.5}',
    '.ls-dau{display:grid;grid-template-columns:62px 40px 42px 1fr;gap:6px;padding-bottom:5px;',
      'font-family:"Oswald","Be Vietnam Pro",system-ui,sans-serif;font-size:8px;',
      'letter-spacing:.05em;text-transform:uppercase;white-space:nowrap;color:var(--ls-acc,#8CE1B4);opacity:.75}',
    '.ls-dau i:last-child{text-align:right}',
    '@media(max-width:360px){.ls-doi,.ls-dau{grid-template-columns:60px 36px 40px 1fr;gap:4px 4px}',
      '.ls-doi b{font-size:8.5px}}',
    '.ls-chan{margin:12px 0 0;padding-top:10px;border-top:1px solid var(--ls-line,rgba(234,240,247,.12));',
      'font-size:9.5px;line-height:1.6;color:var(--ls-mo,rgba(234,240,247,.5));text-align:center}'
  ].join('');

  var style = document.createElement('style');
  style.textContent = CSS;
  (document.head || document.documentElement).appendChild(style);

  /* ═══ NÚT ═════════════════════════════════════════════════════════════
     Trả về CHUỖI HTML chứ không phải phần tử: mấy bảng điều khiển trong bộ
     này đều dựng bằng innerHTML nối chuỗi, trả về chuỗi thì nhét vào đâu
     cũng được mà không phải đổi cách dựng của trang. */
  var ICON = '<svg viewBox="0 0 20 20" aria-hidden="true">'
    + '<path d="M10 3.2a6.8 6.8 0 1 1-6.6 8.4"/><path d="M3.2 8.1v3.6h3.6"/>'
    + '<path d="M10 6.6V10l2.4 1.6"/></svg>';

  function nut(ma) {
    return '<button class="ls-key" type="button" data-ls="' + ma + '" '
         + 'title="Sổ phiên bản" aria-label="Sổ phiên bản">' + ICON + '</button>';
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
  }

  /* Mở mã rồi thì trong PHIÊN này khỏi hỏi lại — nhưng nhớ RIÊNG TỪNG TRANG,
     mở sổ bên này không mở hộ sổ bên kia. Đóng trình duyệt là quên sạch. */
  function daMo(ma) {
    try { return sessionStorage.getItem('ls_ok_' + ma) === '1'; } catch (e) { return false; }
  }
  function ghiMo(ma) {
    try { sessionStorage.setItem('ls_ok_' + ma, '1'); } catch (e) {}
  }

  function veCuaMa(ma) {
    var sai = 0, go = '';
    var t = SO[ma];
    khung(
        '<h2 class="ls-tit">Sổ phiên bản</h2>'
      + '<p class="ls-sub">' + t.ten + '<br>Khu này chỉ ghi chép, không có gì để chơi.</p>'
      + '<div class="ls-o"><i></i><i></i><i></i><i></i></div>'
      + '<p class="ls-msg" id="lsMsg">4 chữ số</p>'
      + '<input class="ls-in" id="lsIn" type="text" inputmode="numeric" '
      +   'autocomplete="off" maxlength="4" aria-label="Mã vào sổ phiên bản">'
    );
    var o   = hop.querySelectorAll('.ls-o i');
    var msg = hop.querySelector('#lsMsg');
    var inp = hop.querySelector('#lsIn');

    function ve() {
      for (var i = 0; i < o.length; i++) {
        o[i].textContent = go[i] ? '•' : '';
        o[i].className = go[i] ? 'co' : '';
      }
    }
    function cham() {
      if (go === MA) { ghiMo(ma); veSo(ma); return; }
      sai++;
      go = ''; inp.value = ''; ve();
      hop.classList.remove('rung'); void hop.offsetWidth; hop.classList.add('rung');
      if (sai >= SAI_TOI_DA) {
        /* Gợi ý ĐÚNG MỘT LẦN. Từ lần sai thứ tư trở đi vẫn hiện đúng câu đó —
           không có gợi ý thứ hai. Nói thêm nữa là cho không cái mã. */
        msg.textContent = GOI_Y;
        msg.className = 'ls-msg goi';
      } else {
        msg.textContent = 'Chưa đúng ✦ còn ' + (SAI_TOI_DA - sai) + ' lần trước khi có gợi ý';
        msg.className = 'ls-msg xau';
      }
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

  function veSo(ma) {
    var t = SO[ma], d = t.doi, cuoi = d[d.length - 1];
    var h = '<h2 class="ls-tit">' + t.ten + '</h2>'
          + '<p class="ls-sub">Sổ phiên bản của riêng trang này<br>'
          +   'Cột <b>#</b> = số bản ghi lại được của build đó</p>'
          + '<div class="ls-nhom"><p class="d">' + t.duong + ' · ĐANG CHẠY ' + cuoi.ver + '</p>'
          + '<div class="ls-dau"><i>Ngày</i><i>Build</i><i>#</i><i>Sửa chính</i></div>';
    for (var k = 0; k < d.length; k++) {
      var r = d[k];
      var so = (r.so == null) ? '<em>thiếu info</em>' : r.so;
      var ch = r.chinh.replace(/no info/g, '<em>no info</em>');
      h += '<div class="ls-doi"><b>' + r.ngay + '</b><b class="v">' + r.ver + '</b>'
         + '<b class="n">' + so + '</b><span>' + ch + '</span></div>';
    }
    h += '</div><p class="ls-chan">Mỗi dòng là MỘT BUILD LỚN.<br>'
       + 'Cột <b>#</b> đếm số bản vá ghi lại được trong build đó — '
       + 'không biết thì để <em>thiếu info</em>, số build vẫn giữ nguyên.</p>';
    khung(h);
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

  window.LichSu = { nut: nut, mo: mo, so: SO };
})();
