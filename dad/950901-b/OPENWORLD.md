# Open World — nối Gemini vào khu trò chuyện

Trong **Chế độ xem lại** (nút 👁 ở màn phát mã) có bốn mục:
`VÒNG 01 · VÒNG 02 · OPEN WORLD · THOÁT`. Mục **Open World** là khu trò chuyện:
người chơi hỏi, **Bạch Long** đáp, **mỗi ngày 10 câu**.

Phần giao diện + đếm lượt đã chạy sẵn. Chưa khai khoá thì khu này **vẫn mở**,
chỉ trả câu dự phòng — trang không vỡ, không báo lỗi đỏ.

---

## Bạn cần làm đúng 2 việc

### 1. Lấy khoá Gemini (miễn phí)

1. Vào **https://aistudio.google.com/apikey** (đăng nhập tài khoản Google).
2. Bấm **Create API key** → chọn project (hoặc để nó tự tạo).
3. Copy chuỗi khoá — dạng `AIza...`.

Gói miễn phí của Gemini đủ xài thoải mái cho mức 10 câu/ngày một người.

### 2. Khai khoá trên Vercel

Vào **Vercel → project của website → Settings → Environment Variables**, thêm:

| Tên biến | Giá trị | Bắt buộc |
|---|---|---|
| `GEMINI_KEY` | chuỗi khoá vừa lấy | **có** |
| `GEMINI_MODEL` | `gemini-2.0-flash` | không — để trống là dùng mặc định này |

Chọn đủ cả ba môi trường *Production · Preview · Development*, rồi **Redeploy**
một lần cho biến ăn vào.

> ⚠️ **Đừng bao giờ dán khoá vào `config.js` hay bất kỳ file nào trong `dad/`.**
> Mọi thứ trong đó tải thẳng về máy người dùng, dán khoá vào là ai cũng đọc được.
> Khoá chỉ được nằm ở biến môi trường của Vercel.

Xong. Vào lại `/dad/950901-b` → phá đảo (hoặc bấm *Hack Gate 2* trong Box Tổng
tư lệnh) → nút 👁 → **OPEN WORLD** → hỏi thử một câu.

---

## Đường đi của một câu hỏi

```
Trang  →  POST /api/chat  {hoi, su, tinh_cach}
              │  (hàm serverless, giữ GEMINI_KEY)
              ↓
        Google Gemini  →  { dap }  →  hộp thoại pixel
```

Trang **không bao giờ** cầm khoá. File `api/chat.js` mới là chỗ cầm.

---

## Chỗ chỉnh nội dung — `GAME_CONFIG.openworld` trong `config.js`

| Khoá | Đang là | Ý nghĩa |
|---|---|---|
| `endpoint` | `/api/chat` | đổi nếu đặt hàm ở đường khác |
| `moi_ngay` | `10` | số câu mỗi ngày |
| `max_ky_tu` | `300` | độ dài tối đa một câu hỏi |
| `placeholder` | `NOI GI DO...` | chữ mờ trong ô nhập (font pixel → **không dấu**) |
| `nut_gui` | `GUI` | nhãn nút gửi (font pixel → **không dấu**) |
| `chao` | 2 dòng | lời chào khi mở khu này, `{N}` = số câu mỗi ngày |
| `goi_y` | 3 câu | ba nút gợi ý bấm phát hỏi luôn |
| `het_luot` / `con_lai` | | báo hết lượt / còn mấy câu (`{N}`) |
| `loi_mang` / `chua_noi` | | mất mạng / chưa khai khoá |
| **`tinh_cach`** | | **giọng của Bạch Long — chỗ đáng sửa nhất** |

`tinh_cach` là đoạn mô tả vai gửi kèm mỗi lượt hỏi. Đang chốt: xưng *ta*, gọi
người chơi là *ngươi / Dongchi*, giọng cổ trang pha hóm hỉnh, **tối đa 3 câu
dưới 60 chữ**, không nhắc tới AI, không tự khai mật mã. Sửa đoạn này là đổi
được hẳn tính cách.

---

## Cách đếm lượt

- Nhớ trong `localStorage`, khoá `mtv1.g2Ow = { ngay, dem }`.
- **Ngày tính theo giờ Việt Nam (+07:00)**, không theo giờ máy.
- **Gọi hỏng thì không trừ lượt** — mất mạng giữa chừng không mất câu.
- Hết lượt: ô nhập khoá lại, các nút gợi ý mờ đi.
- Muốn thử lại ngay: `localStorage` → sửa `mtv1.g2Ow.ngay` thành ngày cũ, hoặc
  xoá hẳn `mtv1`.

> Đây là hạn mức **phía trình duyệt** — cốt để giữ nhịp chơi, không phải hàng
> rào bảo mật. Phía `api/chat.js` còn một trần chung 40 câu / 10 phút cho cả
> instance, đủ để một người nghịch ngợm không đốt sạch quota.

---

## Khi có trục trặc

| Hiện tượng | Nguyên nhân thường gặp |
|---|---|
| *"Ta chưa nghe được. (Chưa nối khoá Gemini…)"* | chưa khai `GEMINI_KEY`, hoặc khai xong chưa redeploy |
| *"Sương mù dày quá…"* | mất mạng, hoặc `/api/chat` trả lỗi — xem tab **Logs** của Vercel, tìm dòng `[CHAT]` |
| Chạy máy mình bằng `file://` | luôn ra *"Sương mù dày quá"* — `fetch` không đi được qua `file://`. Phải chạy qua `vercel dev` hoặc một web server |
| Đáp cụt lủn | `maxOutputTokens: 220` trong `api/chat.js`, nới ra nếu muốn |
