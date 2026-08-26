# Bộ kiểm hồi quy

Chạy hết một lượt:

```bash
node test/chay.mjs
```

Bộ chạy tự bật một máy chủ tĩnh ở `127.0.0.1:8099`, chạy từng bộ trong
`test/bo/` bằng một tiến trình riêng, in bảng tổng kết, rồi tự tắt máy chủ.
Có phép nào hỏng thì mã thoát khác 0 — cắm thẳng vào CI được.

```bash
node test/chay.mjs nhap19 ow19        # chỉ chạy mấy bộ gọi tên
node test/chay.mjs --cong 8123        # cổng 8099 đang bận
DIA_CHI=https://… node test/chay.mjs  # chạy với máy chủ có sẵn, khỏi tự bật
```

## Cần gì để chạy

Chỉ Node 18 trở lên và Playwright. Không có `package.json` nào cả — bộ này cố ý
không kéo theo thư viện nào cho một trang tĩnh.

```bash
npm i -D playwright && npx playwright install chromium
```

Máy nào đã có sẵn Playwright ở chỗ khác thì trỏ vào:

```bash
PLAYWRIGHT_MODULE=/duong/dan/playwright/index.mjs
PLAYWRIGHT_BROWSERS_PATH=/duong/dan/browsers
```

`test/chung.mjs` tự dò cả hai. **Không bộ nào được ghi cứng đường dẫn** — xem
ghi chú đầu file đó để biết vì sao.

## Đọc kết quả

```
✓ nhap19     50 đạt           94s
✗ tem16      15 đạt   1 HỎNG  38s
     ✗ /?stay=1 tem hiện ra có đúng số + ngày của sổ  → …V19.02
```

Dòng `✗` in luôn phép hỏng kèm cái đo được. Bộ nào **vỡ** (ngã trước khi kịp
đếm) thì in sáu dòng cuối của nó — thường là lỗi cú pháp hoặc thiếu Playwright,
không phải trang web hỏng.

## Có gì trong này

| Bộ | Soi cái gì |
|---|---|
| `kt` … `kt11` | luồng chính: hai pha, chuyển hướng, pí danh, hộp chào, khung Collected |
| `kt15` | luồng phá đảo Gate 2 → phát mã → Zoey's Castle |
| `pin13` `pin13b` `pin13c` | ba luật chung của ô mã: hiện rồi che, tự chấm, cửa nào cũng hỏi lại |
| `msn13` | cửa Mission 2 + luật gợi ý |
| `zq13` | bộ câu hỏi Zoey's Castle |
| `ow13` | khu Open World |
| `cre14` | trang Credit của cả bảy sổ |
| `resp14` `resp14b` | co giãn từ 320px tới 1440px |
| `tem16` | **sổ là nguồn sự thật** — tem, thẻ toạ độ, hai cột ngày của cả bảy sổ |
| `nghi16` | hạn nghỉ khi cháy lượt (M2 15 phút · M3 5 phút) |
| `tudien18` `nhap19` | ô nhập: chặn tự điền, tốc độ, xoá, và không nuốt lượt oan |
| `bao18` `kenh20` | tín hiệu bắn về: đúng trang, đúng chỗ đứng, đủ nhãn, đủ mọi kênh |
| `ow19` | hộp nhắc Open World — mỗi ngày một lần và biết dừng |
| `pfsave20` | pí danh tự lưu: đủ năm chỗ, ôm đủ ba chặng, không ghi đè bản tốt bằng bản lùi |
| `so21` | sổ Google Sheets: đủ cột, cột mới nối vào cuối, tab và tiêu đề tự mọc (chạy thật `layTab` trên một Sheet giả) |
| `cre21` | mục "Làm trong bao lâu" — có ở cả bảy trang, và **khớp lịch sử commit** |

## Thêm một bộ mới

1. Chép một file vào `test/bo/`, lấy `moTrinhDuyet` / `DIA_CHI` / `GOC` từ
   `../chung.mjs` — **đừng ghi cứng đường dẫn nào**.
2. In đúng một dòng `TỔNG: n đạt / m hỏng` ở cuối. Bộ chạy đọc dòng đó.
3. Thoát bằng `process.exit(ng ? 1 : 0)`.
4. Khai tên vào `THUTU` trong `test/chay.mjs` cho đúng thứ tự đọc. Quên khai
   thì vẫn chạy, chỉ là bị xếp xuống cuối.

## Mấy chỗ hay vấp

- **Ô mã không tự chấm khi `fill()`.** Từ đợt 19, ô mã chỉ tự chấm khi trình
  duyệt khai đây là cú gõ tay thật. `fill()` nhét cả cụm một phát nên bị xếp
  vào loại dán — đúng như thiết kế. Muốn gõ như người thì
  `pressSequentially`; muốn gửi thẳng thì `press('Enter')`.
- **Máy chủ chặn 25 tin mỗi phút.** Bộ nào bắn nhiều hơn thế (`kenh20`) phải
  tự đẩy `Date.now` đi cho van mở lại — xem ghi chú trong bộ đó.
- **Đừng chạy chung một tiến trình.** Mấy bộ có ghi đè `Date.now` và `fetch`;
  để chung là giẫm lên nhau. Bộ chạy đã tách sẵn.
- **`cre21` chạy `docs/thoi-gian.mjs` tại chỗ.** Nó đối chiếu bảng `THOI_GIAN`
  với lịch sử commit thật, nên **kho phải fetch đủ nhánh** — thiếu nhánh là
  con số hụt và bộ này báo đỏ. Kiểm: `git fetch --all && git rev-list --all --count`.
  Sửa mã xong quên đo lại cũng đỏ, đó là chủ đích.
- **Cửa mã bản ghi luôn hỏi lại.** Không có đường nhớ phiên, nên bộ nào cần
  vào bảng bản ghi thì phải gõ mã `0981` mỗi lần mở.
