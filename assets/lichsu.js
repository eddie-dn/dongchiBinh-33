/* ═════════════════════════════════════════════════════════════════════════
   SỔ PHIÊN BẢN — cửa hậu dùng chung cho CẢ SÁU TRANG
   -------------------------------------------------------------------------
   Gõ 10 nhịp liên tiếp vào dòng "Last updated…" ở chân trang → hiện một NÚT
   ICON nhỏ ngay cạnh tem. Bấm nút đó → hỏi mã → mở sổ ghi từng đời của từng
   trang: ngày · số phiên bản · phiên bản thứ mấy · sửa gì.

   ── VÌ SAO MỘT FILE DÙNG CHUNG, KHÔNG CHÉP VÀO SÁU TRANG ────────────────
   Sáu trang, sáu bảng màu, sáu cách dựng khác nhau. Chép cùng một khối mã
   sáu lần thì lần sửa sau kiểu gì cũng sót một trang, mà sót thì không ai
   biết — cửa hậu có ai mở hằng ngày đâu. Để một file: sửa một chỗ, cả sáu
   trang đổi theo. Bảng dữ liệu cũng nằm luôn ở đây (hằng `SO`), thêm một đời
   mới chỉ phải gõ đúng một dòng.

   ── VÌ SAO GIAO DIỆN TỐI, KHÔNG THEO MÀU TỪNG TRANG ─────────────────────
   Đây là KHU KỸ THUẬT, không phải một màn chơi. Cho nó một bộ mặt riêng —
   tối, chữ máy — thì người chơi hiểu ngay mình vừa bước ra khỏi câu chuyện.
   Đi theo màu từng trang thì phải viết sáu bộ CSS, và sổ phiên bản trên nền
   pastel Zoey's Castle nhìn cũng chẳng ra sổ phiên bản.

   ── CÁCH GẮN VÀO MỘT TRANG ──────────────────────────────────────────────
   1. Đánh dấu tem:   <span class="stamp" data-ls-stamp>…</span>
      (không đánh dấu thì file tự dò #stampZone / #stamp / #vstamp / .vstamp)
   2. Nạp cuối <body>: <script src="/assets/lichsu.js" defer></script>
   Hết. Không phải viết thêm CSS nào.
   ═════════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  /* ── MÃ VÀO ───────────────────────────────────────────────────────────
     0981 = 1890 đọc ngược — năm sinh Bác Hồ. Sai 3 lần thì được ĐÚNG MỘT
     câu gợi ý, và chỉ một: nói tới lần thứ hai thì hết còn là cửa hậu. */
  var MA = '0981';
  var GOI_Y = 'Năm sinh Bác Hồ — soi gương mà đọc.';
  var SAI_TOI_DA = 3;
  var NHIP = 10;        /* bấm bao nhiêu nhịp thì hiện nút */
  var NGUNG = 900;      /* ngưng bấy nhiêu ms là đếm lại từ đầu */
  var ANH = '/assets/poster/HH_5_idle_afk.webp';

  /* ═══ BẢNG DỮ LIỆU ═══════════════════════════════════════════════════
     Mỗi trang một mảng, đời CŨ NHẤT nằm trên.
       ngay  — YYYY-MM-DD, hoặc 'no info' nếu không còn dấu vết
       ver   — số tem của đời đó, LUÔN GIỮ kể cả khi không biết sửa gì
       chinh — sửa gì. KHÔNG BIẾT THÌ GHI 'no info', đừng đoán.

     ── VÌ SAO NHIỀU DÒNG 'no info' ────────────────────────────────────
     Kho mã này bắt đầu được ghi từ 17-08-2026. Mấy đời trước đó có thật —
     tem đã ghi V17, V22, V2.05… nghĩa là trang đã đi qua chừng ấy đời rồi —
     nhưng không còn bản ghi nào để biết mỗi đời sửa gì. Ghi 'no info' và
     GIỮ NGUYÊN số phiên bản là cách trung thực nhất: nói rõ mình không
     biết, chứ không bịa ra một dòng mô tả nghe cho đẹp.
     Mấy đời 18-08 mang tên "Add files via upload" cũng vậy — tải file lên
     thẳng qua web GitHub thì không có lời ghi chú nào để mà đọc lại. */
  var SO = [
    {
      ten: 'Bản đồ mật thư', duong: '/', ma: 'MAP',
      doi: [
        { ngay:'no info',    ver:'≤ V17.03', chinh:'no info — kho mã chưa ghi lại đời nào trước 17-08-2026' },
        { ngay:'2026-08-17', ver:'V17.05',   chinh:'Bản sớm nhất còn dấu vết: bản đồ 4 toạ độ, hộp pí mật, khung Collected' },
        { ngay:'2026-08-18', ver:'V17.04',   chinh:'no info — số tem LÙI một nấc so với đời trước, ghi tay nhầm' },
        { ngay:'2026-08-19', ver:'V17.05',   chinh:'Đợt 2: hộp chào Greetings, luật giãn cách 1 phút giữa hai hộp' },
        { ngay:'2026-08-19', ver:'V17.06',   chinh:'Đợt 3-4: Daily Quote qua API riêng, tem hai dòng, rà lại 92/92 tín hiệu' },
        { ngay:'2026-08-19', ver:'V17.07',   chinh:'Đợt 5: sổ phiên bản này, đồng bộ hệ nút, sổ lưu Google Sheets' }
      ]
    },
    {
      ten: 'Easter Egg · Gate 1', duong: '/dad/950901-a', ma: 'DAD-A',
      doi: [
        { ngay:'no info',    ver:'≤ V21',   chinh:'no info — 21 đời đầu không còn bản ghi' },
        { ngay:'2026-08-17', ver:'V22.00',  chinh:'Bản sớm nhất còn dấu vết: hồ sơ 3 Mission, đồng hồ Mission 2' },
        { ngay:'2026-08-18', ver:'V22.01',  chinh:'no info' },
        { ngay:'2026-08-19', ver:'V22.02',  chinh:'Đợt 5: gắn sổ phiên bản' }
      ]
    },
    {
      ten: 'Easter Egg · Gate 2', duong: '/dad/950901-b', ma: 'DAD-B',
      doi: [
        { ngay:'no info',    ver:'≤ V2.10', chinh:'no info' },
        { ngay:'2026-08-17', ver:'V2.11',   chinh:'Bản sớm nhất còn dấu vết: hai vòng RAZER / ZHAO YUN' },
        { ngay:'2026-08-18', ver:'V03.04',  chinh:'no info' },
        { ngay:'2026-08-18', ver:'V03.06',  chinh:'no info' },
        { ngay:'2026-08-18', ver:'V04.00',  chinh:'no info' },
        { ngay:'2026-08-19', ver:'V04.00',  chinh:'Đợt 1: tia đỏ mắt rồng, vùng sáng cuộn thư, dựng lại 5 ảnh Open World (KHÔNG bump tem — thiếu sót)' },
        { ngay:'2026-08-19', ver:'V04.01',  chinh:'Đợt 2: chuyển cảnh giữa hai vòng, sửa cụt câu trả lời Gemini, ảnh đá sạch' },
        { ngay:'2026-08-19', ver:'V04.02',  chinh:'Đợt 3: RAZER mò từng ký tự, nới tay 3 lần thử mới tính một lần sai' },
        { ngay:'2026-08-19', ver:'V04.03',  chinh:'Đợt 4: bỏ cách dán miếng đá, nạp trước tài nguyên, 16 tín hiệu Gate 2' },
        { ngay:'2026-08-19', ver:'V04.04',  chinh:'Đợt 5: mất nét tiền cảnh thay vệt che, gợi ý tới sớm hơn, khoá bôi đen chữ' }
      ]
    },
    {
      ten: 'Zoey’s Castle', duong: '/han/961030-a', ma: 'HAN-A',
      doi: [
        { ngay:'no info',    ver:'≤ V2.04', chinh:'no info' },
        { ngay:'2026-08-17', ver:'V2.05',   chinh:'Bản sớm nhất còn dấu vết: bộ câu hỏi + cửa mã vào lâu đài' },
        { ngay:'2026-08-18', ver:'V2.06',   chinh:'no info' },
        { ngay:'2026-08-19', ver:'V2.07',   chinh:'Đợt 1-2: dọn layout màn hoàn thành, icon chìa khoá' },
        { ngay:'2026-08-19', ver:'V2.08',   chinh:'Đợt 4: mã vào đổi thành HO CHI MINH, thôi mở sẵn cửa Secret Chamber' },
        { ngay:'2026-08-19', ver:'V2.09',   chinh:'Đợt 5: đồng bộ tên Secret Chamber, hệ nút mắt / quay vòng' }
      ]
    },
    {
      ten: 'HongHan’s Secret Chamber', duong: '/han/961030-b', ma: 'HAN-B',
      doi: [
        { ngay:'no info',    ver:'≤ V1.08', chinh:'no info' },
        { ngay:'2026-08-17', ver:'V1.09',   chinh:'Bản sớm nhất còn dấu vết: dải ngân hà, đồng hồ đếm ngược' },
        { ngay:'2026-08-18', ver:'V1.10',   chinh:'no info — SAI LUẬT: đuôi chỉ được chạy 00→09, tới V1.09 là phải sang V2.00' },
        { ngay:'2026-08-19', ver:'V1.11',   chinh:'Đợt 4: hỏi mã mỗi lần vào, không nhớ cửa đã mở nữa (vẫn còn sai luật)' },
        { ngay:'2026-08-19', ver:'V2.00',   chinh:'Đợt 5: gắn sổ phiên bản, và NẮN LẠI số cho đúng luật (V1.11 → V2.00)' }
      ]
    },
    {
      ten: 'Màn pháo hoa', duong: '/phao-hoa', ma: 'FX',
      doi: [
        { ngay:'no info',    ver:'≤ V3.00', chinh:'no info' },
        { ngay:'2026-08-17', ver:'V3.01',   chinh:'Bản sớm nhất còn dấu vết' },
        { ngay:'2026-08-18', ver:'V3.02',   chinh:'no info' },
        { ngay:'2026-08-19', ver:'V3.03',   chinh:'Đợt 5: gắn sổ phiên bản' }
      ]
    }
  ];

  /* ═══ CSS ═════════════════════════════════════════════════════════════ */
  var CSS = [
    '.ls-key{position:fixed;z-index:99998;width:30px;height:30px;padding:0;border-radius:50%;',
      'display:none;align-items:center;justify-content:center;cursor:pointer;',
      'border:1px solid rgba(140,225,180,.5);background:rgba(6,16,31,.86);color:#8CE1B4;',
      '-webkit-tap-highlight-color:transparent;opacity:.62;',
      'transition:opacity .25s}',
    '.ls-key.on{display:flex}',
    '.ls-key:hover,.ls-key:focus-visible{opacity:1}',
    /* Nhịp thở CHỈ ở lần vừa mò ra, và chỉ vài giây — để người chơi kịp thấy
       là có cái gì mới hiện lên. Sang trang khác thì nút vẫn còn (nhớ trong
       sessionStorage) nhưng nằm im, mờ đi, không đòi ai để ý nữa. Nút cửa hậu
       mà cứ nhấp nháy suốt trên cả sáu trang thì thành cái biển quảng cáo. */
    '.ls-key.moi{opacity:1;animation:lsPop .5s ease both, lsTho 2.4s ease-in-out .5s 3}',
    '@keyframes lsPop{from{opacity:0;transform:scale(.4)}to{opacity:1;transform:scale(1)}}',
    '.ls-key svg{width:15px;height:15px;fill:none;stroke:currentColor;stroke-width:1.7;',
      'stroke-linecap:round;stroke-linejoin:round}',
    '@keyframes lsTho{0%,100%{box-shadow:0 0 0 0 rgba(140,225,180,.34)}',
      '50%{box-shadow:0 0 0 7px rgba(140,225,180,0)}}',

    '.ls-nen{position:fixed;inset:0;z-index:99999;display:none;',
      'align-items:center;justify-content:center;padding:18px;',
      'background:rgba(2,6,14,.82);-webkit-backdrop-filter:blur(6px);backdrop-filter:blur(6px);',
      'font-family:"Be Vietnam Pro",system-ui,"Noto Sans",sans-serif;',
      '-webkit-user-select:none;user-select:none}',
    '.ls-nen.on{display:flex}',
    '.ls-hop{position:relative;width:100%;max-width:560px;max-height:86vh;overflow:auto;',
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
      'font-family:"Oswald","Be Vietnam Pro",system-ui,sans-serif;font-size:21px;color:#8CE1B4;background:rgba(140,225,180,.05)}',
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
    '.ls-nhom{margin:20px 0 0;border-top:1px solid rgba(234,240,247,.1);padding-top:14px}',
    '.ls-nhom h3{margin:0 0 2px;font-family:"Oswald","Be Vietnam Pro",sans-serif;font-size:12px;',
      'font-weight:600;letter-spacing:.16em;text-transform:uppercase;color:#EAF0F7}',
    '.ls-nhom p.d{margin:0 0 10px;font-family:"Oswald","Be Vietnam Pro",system-ui,sans-serif;font-size:9.5px;',
      'letter-spacing:.14em;color:rgba(234,240,247,.38)}',
    '.ls-doi{display:grid;grid-template-columns:76px 66px 26px 1fr;gap:6px 9px;',
      'padding:7px 0;border-top:1px dashed rgba(234,240,247,.09);font-size:11.5px;line-height:1.5}',
    '.ls-doi:first-of-type{border-top:0}',
    '.ls-doi b{font-family:"Oswald","Be Vietnam Pro",system-ui,sans-serif;font-weight:500;font-size:10.5px;letter-spacing:.06em;',
      'color:rgba(234,240,247,.5)}',
    '.ls-doi b.v{color:#8CE1B4}',
    '.ls-doi b.n{color:rgba(234,240,247,.32);text-align:right}',
    '.ls-doi span{color:rgba(234,240,247,.82)}',
    '.ls-doi span em{font-style:normal;color:rgba(234,240,247,.35)}',
    /* letter-spacing hẹp + nowrap: "PHIÊN BẢN" mà giãn chữ rộng thì tràn cột,
       xuống dòng thành hai hàng, hàng tiêu đề nhìn lệch hẳn so với mấy dòng
       dữ liệu bên dưới. */
    '.ls-dau{display:grid;grid-template-columns:76px 66px 26px 1fr;gap:9px;padding-bottom:6px;',
      'font-family:"Oswald","Be Vietnam Pro",system-ui,sans-serif;font-size:8.5px;letter-spacing:.05em;text-transform:uppercase;',
      'white-space:nowrap;color:rgba(140,225,180,.55)}',
    '.ls-dau i:last-child,.ls-doi b.n{text-align:right}',
    '@media(max-width:430px){',
      '.ls-doi,.ls-dau{grid-template-columns:70px 60px 22px 1fr;gap:5px 7px}',
      '.ls-doi{font-size:11px}.ls-hop{padding:52px 13px 18px}}',
    '.ls-chan{margin:18px 0 0;padding-top:12px;border-top:1px solid rgba(234,240,247,.1);',
      'font-size:10.5px;line-height:1.65;color:rgba(234,240,247,.4);text-align:center}'
  ].join('');

  /* ═══ DỰNG ════════════════════════════════════════════════════════════ */
  function $(t, cls, html) {
    var e = document.createElement(t);
    if (cls) e.className = cls;
    if (html != null) e.innerHTML = html;
    return e;
  }

  /* Trả về MỘT DANH SÁCH tem, không phải một cái: Gate 2 có hai màn (màn cổng
     và màn phát mã), mỗi màn một tem, và chỉ một cái hiện tại một lúc. */
  function timTem() {
    var ds = document.querySelectorAll('[data-ls-stamp]');
    if (ds.length) return [].slice.call(ds);
    var m = document.getElementById('stampZone')
         || document.getElementById('stamp')
         || document.getElementById('vstamp')
         || document.querySelector('.vstamp')
         || document.querySelector('.stamp');
    return m ? [m] : [];
  }

  var TEM = timTem();
  if (!TEM.length) return;               /* trang không có tem thì thôi, im lặng */

  /* Tem đang NHÌN THẤY — nút phải bám theo cái đó. Màn nào đang ẩn thì khung
     bao của nó bằng 0, lấy nhầm là nút bay ra góc trên trái. */
  function temHien() {
    for (var i = 0; i < TEM.length; i++) {
      var r = TEM[i].getBoundingClientRect();
      if (r.width || r.height) return TEM[i];
    }
    return null;
  }

  var style = $('style'); style.textContent = CSS;
  document.head.appendChild(style);

  /* ── nút icon: cuộn giấy + kim đồng hồ, đọc ra là "sổ theo thời gian" ── */
  var nut = $('button', 'ls-key');
  nut.type = 'button';
  nut.setAttribute('aria-label', 'Sổ phiên bản');
  nut.title = 'Sổ phiên bản';
  nut.innerHTML = '<svg viewBox="0 0 20 20" aria-hidden="true">'
    + '<path d="M10 3.2a6.8 6.8 0 1 1-6.6 8.4"/><path d="M3.2 8.1v3.6h3.6"/>'
    + '<path d="M10 6.6V10l2.4 1.6"/></svg>';
  document.body.appendChild(nut);

  /* Nút bám theo tem: tính bằng toạ độ THẬT của tem lúc hiện ra, không đặt
     cứng một góc màn hình. Sáu trang để tem sáu chỗ khác nhau — trang thì
     góc trái dựng đứng, trang thì giữa đáy, trang thì góc phải — đặt cứng
     kiểu gì cũng có trang bị đè lên chữ. */
  function datNut() {
    if (!nut.classList.contains('on')) return;
    var t = temHien();
    if (!t) { nut.style.display = 'none'; return; }
    var r = t.getBoundingClientRect();
    nut.style.display = '';
    var x = Math.min(Math.max(r.left + r.width / 2 - 15, 8), innerWidth  - 38);
    var y = Math.min(Math.max(r.top - 38,                8), innerHeight - 38);
    nut.style.left = x + 'px';
    nut.style.top  = y + 'px';
  }
  addEventListener('resize', datNut);
  addEventListener('scroll', datNut, true);

  /* ── NHỚ ĐÃ MÒ RA, TRONG PHIÊN NÀY ────────────────────────────────────
     Mò ra rồi thì đi sang trang khác nút vẫn còn. BẮT BUỘC phải nhớ, không
     phải cho tiện: ngoài BẢN ĐỒ, cú bấm thứ 10 vào tem CÒN mở khung Collected
     và lần đầu nó bay thẳng sang màn pháo hoa — nút vừa hiện ra là trang đã
     đi mất, mò tới mười nhịp mà chẳng thấy gì.
     Dùng sessionStorage chứ không phải localStorage: đóng trình duyệt là quên,
     lần sau vào vẫn phải tự mò lại. Nhớ vĩnh viễn thì hết còn là cửa hậu, mà
     lại thêm một cái nút lạ nằm mãi trên cả sáu trang. */
  function hienNut(vuaMo) {
    if (nut.classList.contains('on')) return;
    nut.classList.add('on');
    if (vuaMo) {
      nut.classList.add('moi');
      setTimeout(function () { nut.classList.remove('moi'); }, 8000);
      try { sessionStorage.setItem('ls_key', '1'); } catch (e) {}
    }
    datNut();
  }
  try { if (sessionStorage.getItem('ls_key') === '1') hienNut(false); } catch (e) {}

  /* ── đếm nhịp ──
     Nghe ở giai đoạn BẮT (capture) trên chính tem: mấy trang đã có cửa hậu
     riêng gắn vào đúng dòng này (bản đồ mở khung Collected, Gate 2 hiện nút
     bỏ qua) và mấy cửa đó có chỗ gọi stopPropagation. Nghe ở capture thì
     mình đếm trước, không giẫm chân ai, và cửa hậu cũ vẫn chạy y như cũ. */
  var n = 0, hen = null;
  TEM.forEach(function (t) {
    t.addEventListener('click', function (e) {
      /* `data-ls-rieng` = NUỐT cú bấm, đừng cho nổi lên trên nữa. Đặt ở mấy
         trang mà tổ tiên của tem đã có cửa hậu riêng đếm nhịp (Zoey's Castle
         và Secret Chamber: bấm 5 nhịp vào cả cụm hoa + tem thì mở bảng điều
         phối). Không nuốt thì bấm tới nhịp thứ 5 là bảng kia bật ra, chẳng
         bao giờ đếm nổi tới 10. Nuốt rồi thì cửa hậu cũ vẫn còn — chỉ là
         phải bấm vào ĐÚNG BÔNG HOA, không tính dòng tem nữa. */
      if (t.hasAttribute('data-ls-rieng')) e.stopPropagation();
      clearTimeout(hen);
      n++;
      hen = setTimeout(function () { n = 0; }, NGUNG);
      if (n >= NHIP) {
        n = 0;
        hienNut(true);
      }
    }, true);
  });

  /* ═══ HỘP ═════════════════════════════════════════════════════════════ */
  var nen = $('div', 'ls-nen');
  nen.setAttribute('aria-hidden', 'true');
  var hop = $('div', 'ls-hop');
  nen.appendChild(hop);
  document.body.appendChild(nen);

  var moKhoa = false;                    /* mở rồi thì trong phiên này khỏi hỏi lại */
  try { moKhoa = sessionStorage.getItem('ls_ok') === '1'; } catch (e) {}

  function dong() {
    nen.classList.remove('on');
    nen.setAttribute('aria-hidden', 'true');
  }
  nen.addEventListener('click', function (e) { if (e.target === nen) dong(); });
  addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && nen.classList.contains('on')) dong();
  });

  function khung(than) {
    hop.innerHTML =
        '<div class="ls-ai"><img src="' + ANH + '" alt="" decoding="async"></div>'
      + '<button class="ls-x" type="button" aria-label="Đóng">&#10005;</button>'
      + than;
    hop.querySelector('.ls-x').addEventListener('click', dong);
  }

  /* ── cửa mã ── */
  function veCuaMa() {
    var sai = 0, go = '';
    khung(
        '<h2 class="ls-tit">Sổ phiên bản</h2>'
      + '<p class="ls-sub">Khu này chỉ ghi chép, không có gì để chơi.<br>Gõ mã để xem.</p>'
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
      if (go === MA) {
        moKhoa = true;
        try { sessionStorage.setItem('ls_ok', '1'); } catch (e) {}
        veSo();
        return;
      }
      sai++;
      go = ''; inp.value = ''; ve();
      hop.classList.remove('rung'); void hop.offsetWidth; hop.classList.add('rung');
      if (sai >= SAI_TOI_DA) {
        /* Gợi ý ĐÚNG MỘT LẦN, từ lần sai thứ ba trở đi cứ hiện lại đúng câu
           đó — không có gợi ý thứ hai. Nói thêm nữa là cho không cái mã. */
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

  /* ── bảng sổ ── */
  function veSo() {
    var h = '<h2 class="ls-tit">Sổ phiên bản</h2>'
          + '<p class="ls-sub">Mỗi đời một dòng · cũ trên, mới dưới<br>'
          +   'Cột <b>#</b> là đời thứ mấy tính từ lúc kho mã bắt đầu ghi</p>';
    for (var i = 0; i < SO.length; i++) {
      var t = SO[i], d = t.doi, cuoi = d[d.length - 1];
      h += '<div class="ls-nhom"><h3>' + t.ten + '</h3>'
         + '<p class="d">' + t.ma + ' · ' + t.duong + ' · ĐANG CHẠY ' + cuoi.ver + '</p>'
         /* Tiêu đề cột cố ý CỰC NGẮN: cột giữa chỉ rộng 66px, viết "Phiên bản"
         là chữ tràn đè sang cột bên cạnh. Nhìn xuống dưới thấy V17.05 là hiểu. */
      + '<div class="ls-dau"><i>Ngày</i><i>Bản</i><i>#</i><i>Sửa chính</i></div>';
      for (var k = 0; k < d.length; k++) {
        var r = d[k];
        /* Cột '#' là ĐỜI THỨ MẤY trong sổ. Dòng 'no info' không đếm được nên
           để dấu gạch — đếm bừa thì con số cuối cùng thành sai. */
        var so = (r.ngay === 'no info') ? '—' : String(k);
        var ch = r.chinh.replace(/no info/g, '<em>no info</em>');
        h += '<div class="ls-doi"><b>' + r.ngay + '</b><b class="v">' + r.ver + '</b>'
           + '<b class="n">' + so + '</b><span>' + ch + '</span></div>';
      }
      h += '</div>';
    }
    h += '<p class="ls-chan">Kho mã bắt đầu được ghi từ 17-08-2026.<br>'
       + 'Đời nào không còn bản ghi thì để <em>no info</em> — số phiên bản vẫn giữ nguyên.</p>';
    khung(h);
  }

  nut.addEventListener('click', function () {
    nen.classList.add('on');
    nen.setAttribute('aria-hidden', 'false');
    if (moKhoa) veSo(); else veCuaMa();
  });
})();
