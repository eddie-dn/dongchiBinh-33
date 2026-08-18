# Open World — nối Gemini vào khu trò chuyện

Trong **Chế độ xem lại** (nút 👁 ở màn phát mã) có bốn mục:
`VÒNG 01 · VÒNG 02 · OPEN WORLD · THOÁT`. Mục **Open World** là khu trò chuyện:
người chơi hỏi, **Honghandangiu** đáp, **mỗi ngày 11 câu**.

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

## Nét mặt robot — 4 clip `ow_2_*.webp`

Thả 4 file vào **`/dad/950901-b/assets/`** — chung chỗ với ảnh nền và clip cũ.
Mỗi clip gánh một nhịp của cuộc trò chuyện, không phát bừa:

| File | Nét mặt | Chạy khi nào |
|---|---|---|
| `ow_2_4.webp` | **chào** | Vừa mở Open World — phát một lần rồi tự về nét nghỉ |
| `ow_2_1.webp` | **nhìn xuống đọc chữ / theo dõi gõ phím** | **Nét NGHỈ**, mặc định. Robot cúi xuống chờ người chơi gõ |
| `ow_2_3.webp` | **đăm chiêu** | Vừa gửi câu hỏi, đang chờ trả lời |
| `ow_2_2.webp` | **gật đầu** | Câu trả lời vừa tới — gật một cái rồi về nét nghỉ |

Vì sao chia thế này: nét **nghỉ** phải là nét robot *đang chờ người chơi*, nên
`ow_2_1` (nhìn xuống theo dõi gõ phím) hợp nhất — người chơi ngồi gõ thì robot
đang nhìn mình. Hai nét **chào** và **gật** là phản ứng tức thời nên chỉ phát
một lần rồi trả về nghỉ. Nét **đăm chiêu** lấp đúng khoảng trống khó chịu nhất:
lúc chờ mạng.

Đổi nét bằng cách **chồng clip mới lên rồi nhoà dần**, clip cũ tan sau 0.42s —
đổi thẳng `src` là hình giật cụp một cái rất xấu.

### Yêu cầu của file

- **Lặp vô hạn** (`loop = 0` lúc xuất webp). Không lặp thì nét nghỉ đứng hình.
- **Kiểu `kin`** (mặc định): clip là **cả khung cảnh**, phủ kín màn hình máy;
  lúc đó game tự tắt camera + giấu dòng *"vuốt để ngắm bối cảnh"*.
  **Khung hiển thị đã chốt đúng bằng khung máy 4:3** — bằng đúng khuôn hình
  người chơi nhìn thấy ở các round — nên clip tỷ lệ nào cũng lọt gọn, không bị
  cắt hai bên như hồi trải ra cả lớp thế giới 2.28:1.
- **Kiểu `noi`**: clip là **hình robot cắt rời trên nền trong suốt**. Robot đứng
  ở góc phải dưới, cảnh phía sau vẫn ngắm và vuốt được. Bật bằng
  `openworld.mat_kieu: 'noi'`, chỉnh cỡ bằng `mat_cao` (mặc định `72%`).

Chọn nhầm kiểu thì đổi đúng một dòng config, không phải sửa code.

### Thiếu file thì sao

Không sao cả. Clip nào thiếu thì bỏ qua nét đó; thiếu cả 4 thì lớp robot không
bao giờ hiện, cảnh cũ giữ nguyên, phần trò chuyện vẫn chạy đủ.

### Mấy nút chỉnh nhịp

| Khoá | Mặc định | Ý nghĩa |
|---|---|---|
| `mat_chao_ms` | `3000` | chào xong bao lâu thì về nét nghỉ |
| `mat_gat_ms` | `1800` | gật xong bao lâu thì về nét nghỉ |
| `mat_nghi_min_ms` | `800` | giữ nét đăm chiêu **ít nhất** bấy nhiêu — máy trả lời nhanh quá thì nét này loé một cái rồi mất, nhìn như robot không kịp nghĩ |

---

## Đường đi của một câu hỏi

```
Trang  →  POST /api/chat  {hoi, su}
              │  (hàm serverless — giữ GEMINI_KEY *và* giọng nhân vật)
              │  + api/_lib/tinh-cach.js
              ↓
        Google Gemini  →  { dap }  →  hộp thoại pixel
```

Trang **không bao giờ** cầm khoá, và từ bản này cũng không cầm luôn cả giọng
nhân vật. `api/chat.js` mới là chỗ cầm cả hai.

---

## Chỗ chỉnh nội dung — `GAME_CONFIG.openworld` trong `config.js`

| Khoá | Đang là | Ý nghĩa |
|---|---|---|
| `endpoint` | `/api/chat` | đổi nếu đặt hàm ở đường khác |
| `moi_ngay` | `11` | số câu mỗi ngày |
| `max_ky_tu` | `300` | độ dài tối đa một câu hỏi |
| `placeholder` | `DROP YOUR QUESTION...` | chữ mờ trong ô nhập (font pixel → **không dấu**) |
| `nut_gui` | `SEND` | nhãn nút gửi (font pixel → **không dấu**) |
| `chao` | 2 dòng | lời chào khi mở khu này, `{N}` = số câu mỗi ngày |
| `goi_y` | 2 câu | ba nút gợi ý bấm phát hỏi luôn |
| `het_luot` / `con_lai` | | báo hết lượt / còn mấy câu (`{N}`) |
| `loi_mang` / `chua_noi` | | mất mạng / chưa khai khoá |
| ~~`tinh_cach`~~ | | **Đã dời sang `api/_lib/tinh-cach.js`** phía máy chủ — xem mục dưới |

### Giọng nhân vật nằm ở đâu

Đoạn mô tả vai (`tinh_cach`) **không còn trong `config.js`**. Nó có fact riêng
tư về hai đứa, mà mọi thứ trong `dad/` thì tải thẳng về máy người xem — ai mở
mã nguồn trang cũng đọc được. Nên nó đã dời hẳn sang phía máy chủ:

```
api/_lib/tinh-cach.js
```

Thư mục `_lib` có gạch dưới ở đầu nên Vercel không biến nó thành endpoint;
trình duyệt không có đường nào chạm tới. Sửa xong **phải deploy lại** mới ăn
(khác `config.js` — cái đó chỉ cần tải lại trang).

Đang chốt: xưng *em*, gọi người chơi là *anh / Đồng chí*, giọng hóm hỉnh pha
dịu dàng, **dưới 3 câu**, đúng 1 icon cuối câu, không nhắc tới AI, không khai
mật mã. Chi tiết từng phần xem `OW-LOI-DAN.md` mục 5.

---

## Cách đếm lượt

- Nhớ trong `localStorage`, khoá `mtv1.g2Ow = { ngay, dem }`.
- **Ngày tính theo giờ Việt Nam (+07:00)**, không theo giờ máy.
- **Gọi hỏng thì không trừ lượt** — mất mạng giữa chừng không mất câu.
- Hết lượt: ô nhập khoá lại, các nút gợi ý mờ đi.
- Muốn thử lại ngay: `localStorage` → sửa `mtv1.g2Ow.ngay` thành ngày cũ, hoặc
  xoá hẳn `mtv1`.

> Đây là hạn mức **phía trình duyệt** — cốt để giữ nhịp chơi, không phải hàng
> rào bảo mật. Phía `api/chat.js` còn một trần chung 50 câu / 10 phút cho cả
> instance, đủ để một người nghịch ngợm không đốt sạch quota.

---

## Khi có trục trặc

| Hiện tượng | Nguyên nhân thường gặp |
|---|---|
| *"Ta chưa nghe được. (Chưa nối khoá Gemini…)"* | chưa khai `GEMINI_KEY`, hoặc khai xong chưa redeploy |
| *"Sương mù dày quá…"* | mất mạng, hoặc `/api/chat` trả lỗi — xem tab **Logs** của Vercel, tìm dòng `[CHAT]` |
| Chạy máy mình bằng `file://` | luôn ra *"Sương mù dày quá"* — `fetch` không đi được qua `file://`. Phải chạy qua `vercel dev` hoặc một web server |
| Đáp cụt lủn | `maxOutputTokens: 400` trong `api/chat.js`, nới ra nếu muốn |
