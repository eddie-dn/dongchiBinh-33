# MISSIONS.md — Luật chơi 3 Mission trên trang bìa hồ sơ

Tài liệu chuẩn cho hệ Mission của `index.html` (hồ sơ XG-950109-A bản deploy độc lập).
Mọi thứ nằm trong vùng khối bổ sung cuối file, trước thẻ Vercel Analytics — xoá vùng đó
là file về bản gốc.

---

## 1. Giao diện trang bìa

```
┌──────────────────────────────────────────┐
│      ┌──────────────────────────┐        │
│      │ HỒ SƠ PHI ĐOÀN · NO.9509 │        │  ← chip gốc, không đụng
│      └──────────────────────────┘        │
│                                          │  ← cách 14px
│    ◐ M1 ĐIỀN FORM · M2 MỞ SAU 04D 23H 59M 59S   ← dòng Mission (bấm được, cao 44px)
│                                          │
│      ●━━━━━━━━━○━━━━━━━━━○               │  ← timeline tiến độ (bấm được)
│     NOOB   EASY CHEESY  HIT THE ROCK     │  ← độ khó từng mission
│                                          │
│              [ nội dung trang ]          │
│  ┌────────┐                  ┌────────┐  │
│  │ ‹ BẢN ĐỒ │    ▬▪▪▪▪        │ TIẾP › │  │
│  └────────┘                  └────────┘  │
└──────────────────────────────────────────┘
```

- **Dòng Mission**: trần không nền không viền, Oswald 11px chữ hoa giãn rộng, amber
  opacity .75, `tabular-nums`. Chấm `◐` thở 2,4s (opacity .4↔1). Vùng bấm tối thiểu 44px.
- **Đếm ngược** luôn ghi rõ đơn vị: `04D 23H 59M 59S` (Day / Hour / Minute / Second),
  cập nhật mỗi giây, chỉ thay chữ số nên chấm ◐ không bị giật nhịp.
- **Timeline**: 3 nút tròn nối bằng thanh ngang; thanh amber "chạy" theo tiến độ
  (5% → 28% khi xong M1 → 55% khi xong M2 → 100% khi xong M3). Nút đã xong sáng đặc,
  nút đang tới lượt nhấp vòng sáng. Dưới mỗi nút là **độ khó**:

| Mission | Độ khó |
|---|---|
| Mission 1 | **Noob** |
| Mission 2 | **Easy Cheesy** |
| Mission 3 | **Hit the rock** |

- Trên thanh timeline có **icon máy bay nhỏ bay theo tiến độ** (trượt cùng thanh amber).
- Cả dòng Mission lẫn timeline **chỉ hiện ở trang bìa**, lật trang là tự ẩn.
- `prefers-reduced-motion`: tắt mọi nhấp nháy, thay bằng sáng tĩnh.

---

## 2. Ba nấc nhiệm vụ

### Mission 1 · Điền Form — *Noob*
- Bấm dòng Mission → nút **Bản đồ** (góc dưới trái, đang khoá và dẫn tới Phần I)
  **nhấp nháy 4 nhịp trong 3,5 giây** (glow `box-shadow`, không đổi nền/không đẩy layout,
  tự gỡ class ở `animationend`, đang chạy bấm thêm thì bỏ qua; reduced-motion → sáng
  một lần 600ms).
- Gửi form thành công (màn "Hoàn tất" hiện ra) → node M1 sáng, timeline chạy tới 28%.
- **Sau khi xong M1**: nút Bản đồ **khoá tạm** — không dẫn tới Phần I nữa, mỗi lần bấm
  chỉ **sáng lên một nhịp** (600ms) báo "chưa tới lúc". Nút chỉ thực sự mở khi giải
  xong Mission 3.

### Mission 2 · Nhập PIN — *Easy Cheesy*
- **Mở sau 5 ngày (5D)** kể từ lần ghé trang đầu tiên. Trước đó dòng hiện
  `M2 MỞ SAU 04D 23H 59M 59S` màu mờ.
- Tới giờ → đổi thành `◐ M2 NHẬP PIN` reo sáng. Bấm vào:
  - **Chưa gửi form** → không có ô nhập, chỉ báo *"Hoàn thành Form thì Hội đồng MeowMeow
    mới cấp PIN"* + nút Điền Form ngay.
  - **Đã gửi form** → hộp PIN 6 ô. **PIN: `217N33`** (gõ thường vẫn nhận).
- Nhập đúng → `✓ M2`, **Mission 1 ẩn khỏi dòng**, Mission 3 xuất hiện.

### Mission 3 · Giải mã — *Hit the rock*
- Hiện đếm ngược **3 ngày (3D)** từ lúc mở khoá M2: `◐ M3 02D 23H 59M 59S`.
  Hết 3 ngày đổi thành `M3 GIẢI MÃ`.
- Bấm vào mở hộp giải mã 8 ô, lời dẫn chỉ ghi *"Giải mã PIN để mở Mission 3 · Bản đồ ✦"*
  (**không** nhắc chuyện cứ sai là có gợi ý). Khi chưa có gợi ý, dòng chờ ghi
  *"Xin mừi Dongchi Bình thử sức ٩(ˊᗜˋ*)و~~~"*.
- **PIN: `PHAM TUAN`** — gõ "Phạm Tuân" có dấu, có khoảng trắng, chữ thường đều nhận
  (bỏ dấu + bỏ cách + viết hoa trước khi so).
- **Gợi ý** lộ dần, mỗi gợi ý xuất hiện **sau một lần nhập sai**, gợi ý kế tiếp cách
  tối thiểu **1 giờ**:
  1. `12`
  2. `5121`
  3. `MIG-21`
- **Nút SOS** góc dưới **trái** của hộp (amber mờ):
  - Bấm **10 nhịp liên tục** (mỗi nhịp < 0,9s) → Hội đồng MeowMeow **chi viện luôn một
    gợi ý** (không cần sai, không cần chờ 1 giờ). Bắn sự kiện `sos_hint`.
    Câu báo: *"Hội đồng MeowMeow chi viện một gợi ý ✦"*; riêng **gợi ý thứ 3** đổi thành
    *"Hội đồng MeowMeow chi viện thêm 1 gợi ý nữa >=<"*.
  - Bấm **đơn hoặc đôi** → hiện một câu trêu random (không lặp câu liền trước),
    **tối đa 6 lần mỗi phiên**: `Nope 🙅` · `10 chiếc hun 💋 cũng khúm đượt 😆` ·
    `Nah nah nah — cố lên anh oyyyy 💪`.
- **Hết 3 ngày mà chưa giải được**: góc dưới **phải** của hộp có nút **skip chìm**
  (opacity ~13%). Bấm **10 nhịp liên tục** (mỗi nhịp < 0,9s) → mở khoá luôn.
- Giải xong (hoặc skip): hộp mang nhãn **`Mission 3 · Phá đảo (˶˃ ᵕ ˂˶)`**, lời chúc
  *"Hội Đồng MeowMeow chúc đồng chí giữ vững phong độ phá đảo Map tiếp theo ⚞^. .^⚟!"*,
  phụ đề *"Nút Bản đồ đã mở khoá — bấm để mở Bản đồ tác chiến của Phi đoàn sinh nhật 🗺️"*
  + nút **Chơi lại từ đầu**
  (bấm 2 nhịp xác nhận, xoá sạch tiến độ Mission). Nút **Bản đồ** sáng amber, ổ khoá
  trên icon biến mất, bấm là bay thẳng tới `https://dongchi-binh-33.vercel.app/`
  (không còn bị đẩy về Phần I).

---

## 3. Luật PIN chung (cả hai cửa)

- **Pool lượt nhập dùng chung cho cả Mission 2 và Mission 3**: **3 lượt mỗi phiên**
  và **12 lượt mỗi ngày**. Đầu hộp có dòng nhắc ngắn
  `LƯỢT NHẬP · 3/3 PHIÊN · 12/12 HÔM NAY`, trừ dần theo từng lần sai.
- Hết **3 lượt phiên** → **khoá 30 phút**. Hết **12 lượt ngày** → khoá tới nửa đêm.
  Hộp **vẫn mở nguyên** (chỉ khoá ô nhập) để còn đọc gợi ý mà biết sai ở đâu.
  Mốc khoá lưu `localStorage` nên tải lại trang không né được.
- Nhập sai **không ghi "Sai rồi"** nữa — bắn ra một câu trêu random lấy từ pool
  `TAUNTS` (cùng pool với SOS), kèm `· có gợi ý mới ✦` nếu vừa lộ thêm gợi ý.
- Đang khoá mà mở lại hộp → gợi ý vẫn hiện đầy đủ, ô nhập khoá kèm dòng nhắc
  *"thử lại sau X phút"*.
- Hết khoá → cấp lại 3 lượt.

---

## 4. Cửa test (không phải chờ đúng ngày)

**Tap 10 nhịp liên tục** (mỗi nhịp < 0,9s) vào **nút tròn trên timeline** của mission đó:

| Nút | Điều kiện | Kết quả |
|---|---|---|
| Nút 1 (Noob) | M1 chưa xong | Coi như đã gửi form — mở đường nhận PIN M2 |
| Nút 2 (Easy Cheesy) | M2 đang đếm ngược | Tua mốc 5 ngày về **ngay bây giờ** → `M2 NHẬP PIN` (vẫn phải nhập đúng `217N33`) |
| Nút 3 (Hit the rock) | Đã mở M2, M3 đang đếm 3 ngày | Tua hết 3 ngày → `M3 GIẢI MÃ` + lộ nút skip trong hộp |

Mỗi lần dùng đều bắn sự kiện `test_unlock` về Telegram nên biết ngay có ai xài cửa này.

---

## 5. Đo đạc

| Sự kiện | Khi nào |
|---|---|
| `bam_dong_countdown` | Bấm dòng Mission — kèm nấc hiện tại + số ngày còn lại |
| `nhay_ban_do_xong` | Sau khi nút Bản đồ nháy — phân biệt "bấm tiếp vào bản đồ sau N giây" với "bỏ đi (12s)" |
| `sai_pin` | Nhập sai PIN (kèm mission + lần thứ mấy trong phiên) |
| `khoa_pin` | Vừa bị khoá 30 phút |
| `mo_khoa_m2` | Nhập đúng `217N33` |
| `giai_m3` | Giải đúng `PHAM TUAN` |
| `skip_m3` | Mở M3 bằng nút skip |
| `vao_ban_do` | Bấm nút Bản đồ đã mở / nút "Tới bản đồ" trong hộp |
| `reset_msn` | Bấm chơi lại từ đầu |
| `test_unlock` | Dùng cửa test 10 nhịp (kèm mission nào) |
| `sos_hint` | SOS 10 nhịp xin thêm gợi ý (kèm gợi ý thứ mấy) |
| `bam_ban_do_khoa` | Bấm nút Bản đồ khoá tạm sau M1 (một lần mỗi phiên) |

Tất cả đi qua hệ `ping` sẵn có (endpoint `/api/ping`, 3 tầng dự phòng).

---

## 6. Lưu trữ & reset

- `localStorage.msn1`: `{ v, m1, m2, m3, m2at, m2doneAt, hints, hintAt, lockUntil, dayKey, dayN }`
  - `dayKey` / `dayN` = ngày hiện tại và số lượt sai đã dùng trong ngày (trần 12).
  - `v` = phiên bản luật (hiện là 2 — mốc M2 đổi từ "Chủ nhật" sang "5 ngày";
    nâng luật thời gian lần nữa thì tăng `v` và đặt lại `m2at`).
  - `m2at` = mốc mở M2 · `m2doneAt` = lúc mở khoá M2 (mốc tính 3 ngày của M3).
- `sessionStorage.msnw`: số lần nhập sai trong phiên — **dùng chung** cả hai cửa.
- **Reset**: nút Chơi lại trong hộp M3, hoặc tự xoá `msn1` — về vạch xuất phát,
  đồng hồ 5 ngày chạy lại từ đầu.

## 7. Hằng cấu hình (đầu khối script Mission trong `index.html`)

```js
var MAPURL = 'https://dongchi-binh-33.vercel.app/';  // đích của nút Bản đồ khi đã mở
var PIN2 = '217N33', PIN3 = 'PHAMTUAN';
var HINTS = ['12', '5121', 'MIG-21'];
var TAUNTS = ['Nope 🙅', '10 chiếc hun 💋 cũng khúm đượt 😆', 'Nah nah nah — cố lên anh oyyyy 💪'];
var TRY_S = 3, TRY_D = 12;   // lượt nhập sai: mỗi phiên / mỗi ngày (dùng chung M2+M3)
var W2 = 5*DAY;   // chờ mở Mission 2
var W3 = 3*DAY;   // đếm ngược Mission 3
var DIFF = ['Noob', 'Easy Cheesy', 'Hit the rock'];
```

Đổi PIN, gợi ý, câu trêu, độ khó hay thời gian chờ: sửa đúng các hằng này, không cần
đụng chỗ khác.
