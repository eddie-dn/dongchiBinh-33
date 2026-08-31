/**
 * SỔ LƯU GOOGLE SHEETS cho bản đồ mật thư
 * ---------------------------------------------------------------------------
 * Dán TOÀN BỘ file này vào Apps Script của một Google Sheet, bấm Deploy →
 * New deployment → Web app, rồi lấy địa chỉ /exec dán vào hai biến môi trường
 * SHEET_URL và CHAT_LOG_URL trên Vercel. Từng bước một có ở docs/GOOGLE-SHEETS.md.
 *
 * NÓ LÀM GÌ: nhận một gói JSON qua POST rồi chép thành MỘT DÒNG trong Sheet.
 * Có hai loại gói, tự động vào hai tab khác nhau:
 *
 *     loai = 'ping'  → tab "Tiến độ"   (do /api/ping gửi)
 *     mọi gói khác   → tab "Chat"      (do /api/chat gửi)
 *
 * Phân biệt bằng trường `loai` chứ không đoán theo hình dạng gói: đoán thì
 * hôm nào thêm một trường mới là vào nhầm tab, mà đã nhầm thì không ai để ý.
 *
 * TAB KHÔNG CÓ THÌ TỰ TẠO, kèm hàng tiêu đề. Không phải chuẩn bị gì trước.
 *
 * KHÔNG PHẢI BẢO TRÌ GÌ: Apps Script chạy trong tài khoản Google của mình,
 * không có máy chủ, không có hoá đơn, không có gói dịch vụ nào hết hạn. Hạn
 * mức miễn phí là 20.000 lượt gọi/ngày — trang này cả đời không tới nổi.
 */

/* Chỉ nhận gói có đúng mã này. Đổi thành chuỗi của riêng mình (gõ bừa cũng
   được, miễn dài và khó đoán), rồi ghép vào cuối địa chỉ khi khai biến:
       https://script.google.com/macros/s/..../exec?k=CHUOI_CUA_MINH
   Vì sao cần: địa chỉ Web App mở cho "Anyone" — bắt buộc, nếu không Vercel
   gọi vào sẽ bị Google chặn. Không có mã thì ai biết địa chỉ cũng bơm rác
   vào Sheet được. Để rỗng ('') là tắt hẳn phần kiểm tra này. */
var MA_BAO_VE = 'doi-chuoi-nay-di';

/* Cột của từng tab. Thêm cột thì thêm tên vào đây — gói JSON thiếu trường nào
   thì ô đó để trống, không hỏng gì. Đừng đổi THỨ TỰ cột cũ: dòng đã ghi rồi
   không tự sắp xếp lại theo. */
var COT = {
  /* ⚠ BA CỘT `trang` / `noi` / `tt` PHẢI CÓ MẶT Ở ĐÂY.
     Máy chủ đã gửi chúng từ đợt 18, nhưng bảng này thiếu tên nên chúng rơi
     thẳng vào hư không — gửi mà không ai nhận, và KHÔNG CÓ GÌ BÁO. Đó chính
     là kiểu hỏng tệ nhất của chỗ này: `doPost` chỉ đọc đúng mấy tên khai
     trong `COT`, trường lạ bị bỏ im lặng.

     ⚠⚠ CỘT MỚI PHẢI NỐI VÀO CUỐI. Đợt 21 từng chèn ba cột này vào GIỮA, ngay
     sau `detail` — đúng cái luật ngay dưới đây cấm. Hậu quả: sheet đang chạy
     có sẵn tám cột theo thứ tự cũ, mà dòng mới ghi xuống theo thứ tự mới, nên
     `trang` rơi xuống dưới tiêu đề "solved", `noi` dưới "so_giai"… — cả bảng
     lệch mà nhìn vẫn ra dữ liệu, không có gì báo. Đã trả về cuối. */
  'Tiến độ': ['at', 'ev', 'nhan', 'detail', 'solved', 'so_giai', 'kenh', 'may',
              'trang', 'noi', 'tt'],
  /* `finish` và `go_lai` thêm từ đợt 32. Cột nào KHÔNG có tên ở đây thì bị bỏ
     lặng lẽ — bảng này là danh sách trắng, không phải gợi ý. Hai cột này mới
     là thứ trả lời được câu "vì sao lượt đó không ra chữ": `finish` là lý do
     Google dừng, `go_lai` cho biết lượt đó có phải hỏi lại lần hai không. */
  'Chat'   : ['luc', 'nguon', 'ok', 'ly_do', 'model', 'ms', 'hoi_dai', 'dap_dai',
              'luot_su', 'token_vao', 'token_ra', 'token_nghi', 'finish', 'block',
              'go_lai', 'loi', 'hoi', 'dap'],
  /* Lời nhắn gửi tổ kỹ thuật. Trước đây `/api/thu` chỉ đi email + Telegram,
     nghĩa là muốn đọc lại lời nhắn cũ thì phải lục hòm thư — mà chuông báo
     Telegram gói Hobby chỉ giữ được một quãng. Nay chép về sổ luôn. */
  'Thư'    : ['at', 'tu', 'loi', 'da_gui', 'may'],
  /* ── PÍ DANH ────────────────────────────────────────────────────────────
     Tab này KHÁC HẲN ba tab trên: ba tab kia chỉ GHI THÊM, mỗi lượt một dòng.
     Tab này là một cuốn danh bạ — mỗi pí danh ĐÚNG MỘT DÒNG, lưu lại thì ghi
     đè chính dòng đó (xem `luuPiDanh`). Nhờ vậy mở máy khác gõ lại tên là tra
     ra được bản lưu mới nhất.
     `goi` là cả bản chụp tiến độ, đóng thành chuỗi JSON. Ô Sheet chứa được
     50.000 ký tự, bản chụp thật chỉ vài KB nên rộng chán. */
  'Pí danh': ['ten', 'moc', 'goi', 'at', 'may']
};

/* Tên dùng làm KHOÁ TRA nên phải chuẩn hoá y hệt ở mọi nơi: bỏ khoảng trắng
   thừa, đưa về chữ thường. Không thì "Zoey" và "zoey " thành hai người. */
function chuanTen(t) {
  return String(t == null ? '' : t).trim().toLowerCase();
}

/* Ghi đè đúng dòng của pí danh đó; chưa có thì thêm dòng mới. */
function luuPiDanh(goi) {
  var sh = layTab('Pí danh');
  var ten = chuanTen(goi.ten);
  if (!ten) return { ok: false, ly_do: 'thieu ten' };

  var cot = COT['Pí danh'];
  var dong = cot.map(function (k) {
    var v = goi[k];
    if (v === undefined || v === null) return '';
    return (typeof v === 'object') ? JSON.stringify(v) : String(v).slice(0, 45000);
  });
  dong[0] = ten;                                   /* cột `ten` luôn là bản chuẩn hoá */

  var n = sh.getLastRow();
  if (n > 1) {
    var cu = sh.getRange(2, 1, n - 1, 1).getValues();
    for (var i = 0; i < cu.length; i++) {
      if (chuanTen(cu[i][0]) === ten) {
        sh.getRange(i + 2, 1, 1, dong.length).setValues([dong]);
        return { ok: true, viec: 'ghi de' };
      }
    }
  }
  sh.appendRow(dong);
  return { ok: true, viec: 'them moi' };
}

/* Tra một pí danh. Không thấy thì trả `co: false` chứ KHÔNG coi là lỗi —
   gõ một cái tên mới toanh là chuyện bình thường. */
function traPiDanh(ten) {
  ten = chuanTen(ten);
  if (!ten) return { ok: false, ly_do: 'thieu ten' };
  var sh = layTab('Pí danh');
  var n = sh.getLastRow();
  if (n < 2) return { ok: true, co: false };
  var cot = COT['Pí danh'];
  var bang = sh.getRange(2, 1, n - 1, cot.length).getValues();
  for (var i = 0; i < bang.length; i++) {
    if (chuanTen(bang[i][0]) !== ten) continue;
    var ra = { ok: true, co: true };
    for (var j = 0; j < cot.length; j++) ra[cot[j]] = bang[i][j];
    return ra;
  }
  return { ok: true, co: false };
}

function doPost(e) {
  try {
    if (MA_BAO_VE && (!e || !e.parameter || e.parameter.k !== MA_BAO_VE)) {
      return traLoi({ ok: false, ly_do: 'sai ma' });
    }
    var goi = {};
    try { goi = JSON.parse(e.postData.contents) || {}; } catch (loi) { goi = {}; }

    /* Pí danh đi đường RIÊNG: nó ghi đè một dòng chứ không nối thêm dòng. */
    if (goi.loai === 'pidanh') return traLoi(luuPiDanh(goi));

    var tenTab = (goi.loai === 'ping') ? 'Tiến độ'
               : (goi.loai === 'thu')  ? 'Thư'
               : 'Chat';
    var sheet  = layTab(tenTab);

    /* Gói của /api/chat để số token trong một object con `token`. Trải phẳng
       ra ba cột riêng — để nguyên object thì ô Sheet chỉ hiện [object Object]. */
    var tk = goi.token || {};
    goi.token_vao  = tk.promptTokenCount;
    goi.token_ra   = tk.candidatesTokenCount;
    goi.token_nghi = tk.thoughtsTokenCount;

    var dong = COT[tenTab].map(function (ten) {
      var v = goi[ten];
      if (v === undefined || v === null) return '';
      /* Ô Sheet chứa tối đa 50.000 ký tự. Câu chat không bao giờ dài tới vậy,
         nhưng cắt sẵn cho chắc — vượt hạn là Google từ chối cả DÒNG. */
      return (typeof v === 'object') ? JSON.stringify(v) : String(v).slice(0, 45000);
    });
    sheet.appendRow(dong);
    return traLoi({ ok: true });
  } catch (loi) {
    /* Có hỏng cũng trả 200: bên Vercel bắn đi rồi thôi, không đọc kết quả.
       Trả lỗi ra chỉ tổ đọng lại trong log của Google, không ai xem. */
    return traLoi({ ok: false, ly_do: String(loi) });
  }
}

/* Mở bằng trình duyệt để thử xem đã deploy đúng chưa — thấy chữ là chạy được. */
/* GET dùng cho ĐÚNG MỘT việc: tra pí danh. Mọi việc ghi vẫn đi bằng POST.
   ⚠ CÓ KIỂM MÃ BẢO VỆ — khác `doGet` đời trước vốn trả lời ai cũng được. Nếu
   không kiểm thì ai biết địa chỉ Web App là đọc được bản lưu của người khác,
   mà bản lưu chính là toàn bộ tiến độ. */
function doGet(e) {
  var ten = e && e.parameter ? e.parameter.ten : '';
  if (!ten) return traLoi({ ok: true, noi: 'So luu dang chay. Gui bang POST nhe.' });
  if (MA_BAO_VE && (!e.parameter || e.parameter.k !== MA_BAO_VE)) {
    return traLoi({ ok: false, ly_do: 'sai ma' });
  }
  try { return traLoi(traPiDanh(ten)); }
  catch (loi) { return traLoi({ ok: false, ly_do: String(loi) }); }
}

/* ═══ TAB VÀ DÒNG TIÊU ĐỀ TỰ MỌC ═══════════════════════════════════════════
   Không phải tạo tab nào bằng tay, cũng không phải gõ tiêu đề cột nào. Chưa có
   tab thì dựng tab kèm dòng tiêu đề; tab có rồi mà THIẾU CỘT MỚI thì viết nốt
   mấy ô tiêu đề còn thiếu vào cuối dòng 1.

   ⚠ VẾ THỨ HAI MỚI LÀ VẾ QUAN TRỌNG, và đời trước không có. Hàm này chỉ viết
   tiêu đề lúc TẠO MỚI tab, nên sheet đang chạy từ trước cứ giữ nguyên dòng
   tiêu đề cũ: thêm cột vào `COT` thì dữ liệu mới rơi xuống mấy ô KHÔNG CÓ TÊN
   ở bên phải. Đọc sheet thấy ba cột trắng trơn, không biết là cột gì.

   Chỉ NỐI THÊM, tuyệt đối không viết đè ô tiêu đề đã có — dòng đã ghi rồi
   không tự sắp xếp lại theo. */
function layTab(ten) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sh = ss.getSheetByName(ten);
  var cot = COT[ten];
  if (!sh) {
    sh = ss.insertSheet(ten);
    sh.appendRow(cot);
    sh.setFrozenRows(1);
    sh.getRange(1, 1, 1, cot.length).setFontWeight('bold');
    return sh;
  }
  try {
    var rong = sh.getLastColumn();
    if (rong < cot.length) {
      var them = cot.slice(rong);                 /* chỉ mấy cột còn thiếu */
      sh.getRange(1, rong + 1, 1, them.length)
        .setValues([them]).setFontWeight('bold');
    }
  } catch (loi) {}                                /* hỏng cũng đừng chặn dòng ghi */
  return sh;
}

function traLoi(o) {
  return ContentService
    .createTextOutput(JSON.stringify(o))
    .setMimeType(ContentService.MimeType.JSON);
}
