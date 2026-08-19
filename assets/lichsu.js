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
     Mỗi trang một cuốn, đời CŨ NHẤT nằm trên.
       ngay  — YYYY-MM-DD, hoặc 'no info' nếu không còn dấu vết
       ver   — số tem của đời đó, LUÔN GIỮ kể cả khi không biết sửa gì
       chinh — sửa gì, GHI CHUNG CHUNG THÔI (xem luật ngay dưới)

     ── LUẬT VIẾT CỘT "SỬA CHÍNH" — ĐỌC TRƯỚC KHI THÊM DÒNG ─────────────
     Sổ này người chơi mở ra đọc được. Nên tuyệt đối KHÔNG ghi:
       · mã, mật khẩu, đáp án, tên nhân vật phải đoán
       · tên biến môi trường, tên khoá lưu, tên endpoint, tên nhà cung cấp
       · bất cứ thứ gì nói ra là bớt được một bước phải mò
     Chỉ ghi LOẠI VIỆC: "cập nhật API", "chỉnh hiệu ứng", "chỉnh luật chơi",
     "đồng bộ hệ nút", "cập nhật giao diện", "thêm đo đạc", "cập nhật tài
     liệu". Đủ để biết đời đó làm gì, không đủ để lấy làm gợi ý.

     ── VÌ SAO NHIỀU DÒNG 'no info' ────────────────────────────────────
     Kho mã này bắt đầu được ghi từ 17-08-2026. Mấy đời trước đó có thật —
     tem đã ghi V17, V22, V2.05… nghĩa là trang đã đi qua chừng ấy đời rồi —
     nhưng không còn bản ghi nào để biết mỗi đời sửa gì. Ghi 'no info' và GIỮ
     NGUYÊN số phiên bản là cách trung thực nhất: nói rõ mình không biết, chứ
     không bịa ra một dòng mô tả nghe cho đẹp.
     Mấy đời tải file thẳng qua web cũng vậy — không có lời ghi chú nào để mà
     đọc lại. Vài dòng dưới đây moi được từ TÀI LIỆU cùng thời (mấy file .md
     có ghi số tem), nên biết được số mà vẫn không biết nội dung. */
  var SO = {
    MAP: {
      ten: 'Bản đồ mật thư', duong: '/',
      doi: [
        { ngay:'no info',    ver:'≤ V17.02', chinh:'no info — kho mã chưa ghi lại đời nào trước 17-08-2026' },
        { ngay:'2026-08-17', ver:'V17.05',   chinh:'Bản sớm nhất còn dấu vết. Tài liệu cùng ngày ghi V17.03 — lệch 2 nấc' },
        { ngay:'2026-08-18', ver:'V17.04',   chinh:'no info — số tem LÙI một nấc so với đời trước, ghi tay nhầm' },
        { ngay:'2026-08-19', ver:'V17.05',   chinh:'Thêm hộp chào đầu ngày, chỉnh luật hiển thị' },
        { ngay:'2026-08-19', ver:'V17.06',   chinh:'Cập nhật API nội dung, chỉnh tem phiên bản, rà lại đo đạc' },
        { ngay:'2026-08-19', ver:'V17.07',   chinh:'Đồng bộ hệ nút, thêm sổ phiên bản' }
      ]
    },
    'DAD-A': {
      ten: 'Easter Egg · Gate 1', duong: '/dad/950901-a',
      doi: [
        { ngay:'no info',    ver:'≤ V21',   chinh:'no info — 21 đời đầu không còn bản ghi' },
        { ngay:'2026-08-17', ver:'V22.00',  chinh:'Bản sớm nhất còn dấu vết' },
        { ngay:'2026-08-18', ver:'V22.01',  chinh:'no info' },
        { ngay:'2026-08-19', ver:'V22.02',  chinh:'Thêm sổ phiên bản' }
      ]
    },
    'DAD-B': {
      ten: 'Easter Egg · Gate 2', duong: '/dad/950901-b',
      doi: [
        { ngay:'no info',    ver:'≤ V2.09', chinh:'no info' },
        { ngay:'no info',    ver:'V2.10',   chinh:'no info — chỉ còn thấy tên trong tài liệu cùng thời' },
        { ngay:'2026-08-17', ver:'V2.11',   chinh:'Bản sớm nhất còn dấu vết' },
        { ngay:'no info',    ver:'V03.02',  chinh:'Nắn số cho đúng luật — hai đời V2.10/V2.11 sai quy ước' },
        { ngay:'2026-08-17', ver:'V03.04',  chinh:'no info' },
        { ngay:'2026-08-18', ver:'V03.06',  chinh:'no info' },
        { ngay:'2026-08-18', ver:'V04.00',  chinh:'no info' },
        { ngay:'2026-08-19', ver:'V04.00',  chinh:'Chỉnh hiệu ứng, dựng lại ảnh khu phụ — KHÔNG bump tem (thiếu sót)' },
        { ngay:'2026-08-19', ver:'V04.01',  chinh:'Chỉnh chuyển cảnh, cập nhật API trả lời' },
        { ngay:'2026-08-19', ver:'V04.02',  chinh:'Chỉnh luật chơi' },
        { ngay:'2026-08-19', ver:'V04.03',  chinh:'Chỉnh chuyển cảnh, nạp trước tài nguyên, thêm đo đạc' },
        { ngay:'2026-08-19', ver:'V04.04',  chinh:'Làm lại chuyển cảnh, chỉnh luật gợi ý, chỉnh giao diện' }
      ]
    },
    'HAN-A': {
      ten: 'Zoey’s Castle', duong: '/han/961030-a',
      doi: [
        { ngay:'no info',    ver:'≤ V2.04', chinh:'no info' },
        { ngay:'2026-08-17', ver:'V2.05',   chinh:'Bản sớm nhất còn dấu vết' },
        { ngay:'2026-08-18', ver:'V2.06',   chinh:'no info' },
        { ngay:'2026-08-19', ver:'V2.07',   chinh:'Chỉnh layout màn hoàn thành' },
        { ngay:'2026-08-19', ver:'V2.08',   chinh:'Chỉnh luật cửa mã, cập nhật đo đạc' },
        { ngay:'2026-08-19', ver:'V2.09',   chinh:'Đồng bộ tên gọi và hệ nút, thêm sổ phiên bản' }
      ]
    },
    'HAN-B': {
      ten: 'HongHan’s Secret Chamber', duong: '/han/961030-b',
      doi: [
        { ngay:'no info',    ver:'≤ V1.08', chinh:'no info' },
        { ngay:'2026-08-17', ver:'V1.09',   chinh:'Bản sớm nhất còn dấu vết' },
        { ngay:'2026-08-18', ver:'V1.10',   chinh:'no info — SAI LUẬT: đuôi chỉ chạy 00→09, tới V1.09 là phải sang V2.00' },
        { ngay:'2026-08-19', ver:'V1.11',   chinh:'Chỉnh luật cửa mã (vẫn còn sai luật đánh số)' },
        { ngay:'2026-08-19', ver:'V2.00',   chinh:'Thêm sổ phiên bản, nắn lại số cho đúng luật (V1.11 → V2.00)' }
      ]
    },
    /* ── FX CHƯA CÓ CỬA VÀO ────────────────────────────────────────────
       Màn pháo hoa là trang DUY NHẤT trong bộ không có bảng điều khiển nào —
       không có cửa hậu, không có hộp lệnh, chỉ có một nút đóng. Không có chỗ
       nào để đặt nút sổ mà không phải đẻ ra một cửa hậu mới, nên trang đó
       KHÔNG nạp file này. Dữ liệu vẫn giữ sẵn ở đây: hôm nào trang đó có bảng
       điều khiển thì chỉ việc nạp file và nhét LichSu.nut('FX') vào, khỏi
       phải dựng lại số liệu. */
    FX: {
      ten: 'Màn pháo hoa', duong: '/phao-hoa',
      doi: [
        { ngay:'no info',    ver:'≤ V3.00', chinh:'no info' },
        { ngay:'2026-08-17', ver:'V3.01',   chinh:'Bản sớm nhất còn dấu vết' },
        { ngay:'2026-08-18', ver:'V3.02',   chinh:'no info' },
        { ngay:'2026-08-19', ver:'V3.03',   chinh:'Cập nhật kèm đợt đồng bộ chung' }
      ]
    }
  };

  /* ═══ CSS ═════════════════════════════════════════════════════════════
     Nút KHÔNG khai màu của riêng nó — dùng `currentColor` để mượn màu chữ
     của bảng đang chứa nó. Nhờ vậy một mẩu HTML nằm vừa cả Box Tổng tư lệnh
     (nền tối, chữ sáng) lẫn Khối vận hành bên Zoey's Castle (nền pastel, chữ
     tím mực) mà không phải viết hai bộ CSS. */
  var CSS = [
    '.ls-key{width:28px;height:28px;flex:none;padding:0;border-radius:50%;',
      'display:inline-flex;align-items:center;justify-content:center;vertical-align:middle;',
      'border:1px solid currentColor;background:none;color:inherit;cursor:pointer;',
      'opacity:.42;box-shadow:none;-webkit-tap-highlight-color:transparent;',
      'transition:opacity .2s,transform .12s}',
    '.ls-key:hover,.ls-key:focus-visible{opacity:.9;outline:none}',
    '.ls-key:active{transform:scale(.92)}',
    '.ls-key.go{opacity:1}',
    '.ls-key svg{width:14px;height:14px;fill:none;stroke:currentColor;stroke-width:1.7;',
      'stroke-linecap:round;stroke-linejoin:round;display:block}',

    '.ls-nen{position:fixed;inset:0;z-index:99999;display:none;',
      'align-items:center;justify-content:center;padding:18px;',
      'background:rgba(2,6,14,.82);-webkit-backdrop-filter:blur(6px);backdrop-filter:blur(6px);',
      'font-family:"Be Vietnam Pro",system-ui,"Noto Sans",sans-serif;',
      '-webkit-user-select:none;user-select:none}',
    '.ls-nen.on{display:flex}',
    '.ls-hop{position:relative;width:100%;max-width:520px;max-height:86vh;overflow:auto;',
      '-webkit-overflow-scrolling:touch;',
      'background:linear-gradient(180deg,#0d1a2e 0%,#070e1c 100%);color:#EAF0F7;',
      'border:1px solid rgba(140,225,180,.24);border-radius:12px;',
      'padding:56px 18px 20px;box-shadow:0 24px 60px rgba(0,0,0,.6);',
      'animation:lsLen .32s cubic-bezier(.16,1,.3,1) both}',
    '@keyframes lsLen{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:none}}',

    /* Cô AI ngồi vắt ở MÉP TRÊN hộp, nửa người khuất sau mép — nhìn xuống chỗ
       người chơi vừa mò ra. Ảnh cắt lấy phần đầu (object-position lệch lên). */
    '.ls-ai{position:absolute;top:-34px;left:50%;transform:translateX(-50%) rotate(-4deg);',
      'width:76px;height:76px;border-radius:50%;overflow:hidden;',
      'border:2px solid rgba(140,225,180,.45);background:#0d1a2e;',
      'box-shadow:0 10px 26px rgba(0,0,0,.5)}',
    '.ls-ai img{width:100%;height:100%;object-fit:cover;object-position:50% 26%;display:block}',

    '.ls-x{position:absolute;top:10px;right:12px;width:30px;height:30px;border:0;',
      'background:none;color:rgba(234,240,247,.5);font-size:17px;line-height:1;cursor:pointer}',
    '.ls-x:hover{color:#EAF0F7}',

    '.ls-tit{margin:0;text-align:center;font-family:"Oswald","Be Vietnam Pro",sans-serif;',
      'font-size:13px;font-weight:600;letter-spacing:.26em;text-transform:uppercase;color:#8CE1B4}',
    '.ls-sub{margin:6px 0 0;text-align:center;font-size:11.5px;line-height:1.6;',
      'color:rgba(234,240,247,.5)}',

    /* ── cửa mã ── */
    '.ls-o{display:flex;gap:8px;justify-content:center;margin:18px 0 0}',
    '.ls-o i{width:38px;height:46px;border:1px solid rgba(140,225,180,.3);border-radius:6px;',
      'display:flex;align-items:center;justify-content:center;font-style:normal;',
      'font-family:"Oswald","Be Vietnam Pro",system-ui,sans-serif;font-size:21px;',
      'color:#8CE1B4;background:rgba(140,225,180,.05)}',
    '.ls-o i.co{border-color:rgba(140,225,180,.75)}',
    '.ls-hop.rung{animation:lsRung .38s}',
    '@keyframes lsRung{0%,100%{transform:translateX(0)}20%{transform:translateX(-7px)}',
      '40%{transform:translateX(7px)}60%{transform:translateX(-4px)}80%{transform:translateX(4px)}}',
    '.ls-msg{margin:12px 0 0;text-align:center;font-size:12px;min-height:1.5em;',
      'color:rgba(234,240,247,.55)}',
    '.ls-msg.xau{color:#ff9d86}',
    '.ls-msg.goi{color:#F2B441}',
    /* Ô nhập thật nằm dưới, trong suốt — bàn phím ảo trên điện thoại phải có
       một <input> thật mới bật lên được, mấy ô vuông trên kia chỉ để nhìn. */
    '.ls-in{position:absolute;opacity:0;width:1px;height:1px;border:0;padding:0}',

    /* ── bảng ── */
    '.ls-nhom{margin:18px 0 0;border-top:1px solid rgba(234,240,247,.1);padding-top:14px}',
    '.ls-nhom p.d{margin:0 0 10px;font-family:"Oswald","Be Vietnam Pro",system-ui,sans-serif;',
      'font-size:9.5px;letter-spacing:.14em;color:rgba(234,240,247,.38);text-align:center}',
    '.ls-doi{display:grid;grid-template-columns:76px 66px 26px 1fr;gap:6px 9px;',
      'padding:7px 0;border-top:1px dashed rgba(234,240,247,.09);font-size:11.5px;line-height:1.5}',
    '.ls-doi:first-of-type{border-top:0}',
    '.ls-doi b{font-family:"Oswald","Be Vietnam Pro",system-ui,sans-serif;font-weight:500;',
      'font-size:10.5px;letter-spacing:.06em;color:rgba(234,240,247,.5)}',
    '.ls-doi b.v{color:#8CE1B4}',
    '.ls-doi b.n{color:rgba(234,240,247,.32);text-align:right}',
    '.ls-doi span{color:rgba(234,240,247,.82)}',
    '.ls-doi span em{font-style:normal;color:rgba(234,240,247,.35)}',
    /* letter-spacing hẹp + nowrap: tiêu đề cột mà giãn chữ rộng thì tràn sang
       cột bên cạnh, hàng tiêu đề lệch hẳn so với mấy dòng dữ liệu bên dưới. */
    '.ls-dau{display:grid;grid-template-columns:76px 66px 26px 1fr;gap:9px;padding-bottom:6px;',
      'font-family:"Oswald","Be Vietnam Pro",system-ui,sans-serif;font-size:8.5px;',
      'letter-spacing:.05em;text-transform:uppercase;white-space:nowrap;',
      'color:rgba(140,225,180,.55)}',
    '.ls-dau i:last-child{text-align:right}',
    '@media(max-width:430px){',
      '.ls-doi,.ls-dau{grid-template-columns:70px 60px 22px 1fr;gap:5px 7px}',
      '.ls-doi{font-size:11px}.ls-hop{padding:52px 13px 18px}}',
    '.ls-chan{margin:18px 0 0;padding-top:12px;border-top:1px solid rgba(234,240,247,.1);',
      'font-size:10.5px;line-height:1.65;color:rgba(234,240,247,.4);text-align:center}'
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
  function khung(than) {
    hop.innerHTML =
        '<div class="ls-ai"><img src="' + ANH + '" alt="" decoding="async"></div>'
      + '<button class="ls-x" type="button" aria-label="Đóng">&#10005;</button>'
      + than;
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
          +   'Cột <b>#</b> là đời thứ mấy tính từ lúc kho mã bắt đầu ghi</p>'
          + '<div class="ls-nhom"><p class="d">' + t.duong + ' · ĐANG CHẠY ' + cuoi.ver + '</p>'
          + '<div class="ls-dau"><i>Ngày</i><i>Bản</i><i>#</i><i>Sửa chính</i></div>';
    var n = 0;
    for (var k = 0; k < d.length; k++) {
      var r = d[k];
      /* Cột '#' đếm ĐỜI CÓ NGÀY. Dòng 'no info' không biết rơi vào lúc nào nên
         không đếm được — để dấu gạch, chứ đếm bừa thì con số cuối thành sai. */
      var so = '—';
      if (r.ngay !== 'no info') { n++; so = String(n); }
      var ch = r.chinh.replace(/no info/g, '<em>no info</em>');
      h += '<div class="ls-doi"><b>' + r.ngay + '</b><b class="v">' + r.ver + '</b>'
         + '<b class="n">' + so + '</b><span>' + ch + '</span></div>';
    }
    h += '</div><p class="ls-chan">Kho mã bắt đầu được ghi từ 17-08-2026.<br>'
       + 'Đời nào không còn bản ghi thì để <em>no info</em> — số phiên bản vẫn giữ nguyên.</p>';
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
    var b = e.target && e.target.closest ? e.target.closest('.ls-key[data-ls]') : null;
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
