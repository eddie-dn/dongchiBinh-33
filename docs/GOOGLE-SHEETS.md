# Sổ lưu Google Sheets — 10 phút, làm một lần rồi quên

> **Giải quyết việc gì.** Vercel gói Hobby chỉ giữ log khoảng **một tiếng**.
> Nghĩa là sáng mai mở lên thì không còn cách nào biết tối qua ai chơi tới đâu,
> hay Open World bị hỏng câu nào. Sổ này chép mọi thứ sang một Google Sheet của
> riêng mình — sống mãi, xem trên điện thoại được, lọc và vẽ biểu đồ được.
>
> **Không cần Google Cloud, không cần thẻ, không tốn tiền, không phải bảo trì.**
> Apps Script chạy trong tài khoản Google bình thường. Hạn mức miễn phí 20.000
> lượt gọi/ngày — trang này cả đời không chạm tới.

---

## Làm theo đúng 6 bước

### 1 · Tạo Sheet
Vào [sheets.new](https://sheets.new). Đặt tên gì cũng được, ví dụ
`Bản đồ mật thư — sổ lưu`. **Không phải tạo cột hay tab nào cả**, mã tự tạo.

### 2 · Mở Apps Script
Trong Sheet: **Tiện ích mở rộng → Apps Script** (Extensions → Apps Script).
Một tab mới mở ra với file `Code.gs` có sẵn vài dòng mẫu.

### 3 · Dán mã
Xoá sạch nội dung `Code.gs` mẫu, dán **toàn bộ** file
`docs/apps-script/Code.gs` (trong chính bộ mã này) vào.

Sửa đúng **một dòng** — dòng mã bảo vệ ở gần đầu file:

```js
var MA_BAO_VE = 'doi-chuoi-nay-di';
```

Đổi thành một chuỗi của riêng mình, gõ bừa cũng được miễn dài và khó đoán,
ví dụ `so-luu-honghan-2026-xyz`. **Ghi lại chuỗi này**, bước 5 phải dùng.

Bấm biểu tượng đĩa mềm để lưu.

### 4 · Deploy
**Deploy → New deployment**. Bấm bánh răng cạnh chữ "Select type" → chọn
**Web app**. Rồi khai:

| Ô | Chọn |
|---|---|
| Description | gì cũng được, ví dụ `so luu v1` |
| **Execute as** | **Me** (chính mình) |
| **Who has access** | **Anyone** |

> **"Anyone" nghe đáng sợ nhưng bắt buộc**, vì Vercel gọi vào bằng máy chủ chứ
> không đăng nhập Google được. Chỗ chặn người lạ là **mã bảo vệ** ở bước 3:
> không có mã đúng thì gói bị vứt ngay, không ghi dòng nào.

Bấm **Deploy**. Google hỏi cấp quyền → **Authorize access** → chọn tài khoản →
gặp màn "Google hasn't verified this app" thì bấm **Advanced** → **Go to …
(unsafe)** → **Allow**. (Đây là mã do chính mình vừa dán vào, nên "unverified"
là chuyện đương nhiên.)

Xong sẽ hiện một địa chỉ dạng:

```
https://script.google.com/macros/s/AKfycb............/exec
```

**Chép địa chỉ đó.**

### 5 · Ghép mã bảo vệ vào địa chỉ

Nối `?k=` cộng chuỗi ở bước 3 vào cuối:

```
https://script.google.com/macros/s/AKfycb............/exec?k=so-luu-honghan-2026-xyz
```

### 6 · Khai hai biến trên Vercel

Vercel → dự án → **Settings → Environment Variables** → thêm **hai** biến,
**cùng dán một địa chỉ đầy đủ ở bước 5**:

| Tên biến | Ghi gì | Ghi lại việc gì |
|---|---|---|
| `SHEET_URL` | địa chỉ bước 5 | mọi tín hiệu tiến độ → tab **Tiến độ** |
| `CHAT_LOG_URL` | địa chỉ bước 5 | mọi lượt hỏi Open World → tab **Chat** |

Rồi **Deployments → … → Redeploy**. Biến môi trường chỉ có hiệu lực từ lần
deploy sau, sửa xong mà không redeploy thì vẫn chạy bản cũ.

**Xong.** Vào chơi thử một vòng rồi mở Sheet ra xem — hai tab tự hiện.

---

## Hai tab ghi gì

### Tab `Tiến độ` — do `/api/ping` gửi

| Cột | Nghĩa |
|---|---|
| `at` | thời điểm (ISO) |
| `ev` | mã sự kiện, ví dụ `g2_giai_dung` |
| `nhan` | tên tiếng Việt của sự kiện. **Trống = chưa khai nhãn** trong bảng `NHAN` của `api/ping.js` — sự kiện đó sẽ không bao giờ báo về Telegram, sổ này là chỗ duy nhất phát hiện ra |
| `detail` | chi tiết kèm theo |
| `solved` / `so_giai` | đã giải được mấy toạ độ — **chỉ đúng với bản đồ**, năm trang kia để trống |
| `trang` | trang nào gửi: `ban-do` · `dad-a` · `dad-b` · `han-a` · `han-b` · `phao-hoa`. Trang cũ chưa tự khai thì điền bằng chỗ `doanTrang()` đoán ra từ tiền tố tên sự kiện |
| `noi` | đang mở hộp nào trong trang đó, ví dụ `Ô mã · DAD-950901-A`, `Khu Open World` |
| `tt` | một dòng trạng thái thật của người chơi trên trang đó, ví dụ `Mission: M1 ✓ · M2 — · M3 —` |
| `kenh` | `js` hay `bieu-mau` (đường vòng khi máy người chơi chặn fetch) |
| `may` | chuỗi trình duyệt |

Ba cột `trang` / `noi` / `tt` thêm từ đợt 18. Trước đó mọi dòng của cả sáu trang
đều mang chung một tiêu đề và chung một con số tiến độ của bản đồ — xem luật ở
`DESIGN-SYSTEM.md` mục 9. Sheet cũ vẫn chạy được: cột mới nối vào cuối, dòng cũ
để trống ở đó.

Sổ này ghi **đủ mọi tín hiệu**, kể cả sự kiện chưa có nhãn và mấy nhịp bị chặn
vì trùng. Cố ý vậy: **Sheets là sổ lưu, Telegram là chuông báo.** Sổ thì phải
đủ, chuông thì phải lọc cho đỡ ồn.

### Tab `Chat` — do `/api/chat` gửi

| Cột | Nghĩa |
|---|---|
| `luc` | thời điểm |
| `ok` | `true` = trả lời được, `false` = hỏng |
| `ly_do` | hỏng vì gì: `gemini_hong` · `rong_dap` · `mang_hong` |
| `model` | model đã gọi |
| `ms` | mất bao nhiêu mili giây |
| `hoi_dai` / `dap_dai` | độ dài câu hỏi / câu trả lời (ký tự) |
| `luot_su` | trong lượt đó đã có mấy lượt hỏi trước |
| `token_vao` / `token_ra` / `token_nghi` | số token vào · ra · dành cho bước suy nghĩ |
| `block` | Gemini chặn thì ghi lý do vào đây |
| `hoi` / `dap` | **mặc định TRỐNG** — xem mục dưới |

### Nội dung chat: mặc định KHÔNG ghi

Hai cột `hoi` / `dap` để trống trừ khi khai thêm biến `CHAT_LOG_NOI_DUNG=1`
trên Vercel. Cố ý bắt khai riêng một biến nữa để không ai bật nhầm — đoạn chat
Open World là chuyện riêng của hai người.

Không bật thì vẫn đủ để dò lỗi: `ok`, `ly_do`, `ms`, `token_*` cho biết Gemini
hỏng ở đâu mà không cần đọc ai nói gì.

---

## Mấy chỗ hay vấp

| Hiện tượng | Vì sao | Sửa |
|---|---|---|
| Sheet không có dòng nào | quên **Redeploy** sau khi thêm biến | Vercel → Deployments → … → Redeploy |
| Vẫn không có dòng nào | mã bảo vệ trong `Code.gs` khác chuỗi `?k=` trên Vercel | so lại từng ký tự, chú ý dấu cách thừa lúc chép |
| Vẫn không có | deploy để **"Only myself"** | Deploy → Manage deployments → sửa thành **Anyone** |
| Sửa `Code.gs` xong không thấy đổi gì | Apps Script giữ **bản đã deploy**, không chạy bản đang sửa | Deploy → Manage deployments → bút chì → Version: **New version** → Deploy |
| Mở địa chỉ `/exec` bằng trình duyệt thấy JSON `"So luu dang chay"` | đúng rồi, deploy chuẩn | — |
| Đổi mã bảo vệ | phải sửa **cả hai chỗ**: `Code.gs` và hai biến trên Vercel | sửa xong redeploy cả hai bên |

## Thêm cột về sau

Mở `Code.gs`, thêm tên trường vào mảng `COT` của tab tương ứng, deploy lại
**New version**. Gói JSON thiếu trường đó thì ô để trống, không hỏng gì.

**Đừng đổi thứ tự cột cũ** — mấy dòng đã ghi rồi không tự sắp xếp lại theo.

## Muốn tắt

Xoá biến `SHEET_URL` / `CHAT_LOG_URL` trên Vercel rồi redeploy. Mã trong
`api/*.js` thấy biến trống là bỏ qua, không gọi đi đâu cả. Sheet cũ vẫn còn
nguyên dữ liệu.
