# MISSIONS.md — Luật chơi 3 Mission trên trang bìa hồ sơ

Tài liệu chuẩn cho hệ Mission của `index.html` (hồ sơ **DAD-950901-A**).
Mọi thứ nằm trong vùng khối bổ sung cuối file, trước thẻ Vercel Analytics — xoá vùng đó
là file về bản gốc.

> **Luật hiện hành: v3.** Đồng hồ là **cửa sổ làm bài**, không phải thời gian chờ.
> Xong một mốc là mở ngay mốc kế và bắt đầu đếm ngược 5 ngày để giải.

---

## 1. Giao diện trang bìa

```
┌──────────────────────────────────────────┐
│      ┌──────────────────────────┐        │
│      │ HỒ SƠ PHI ĐOÀN · NO.9509 │        │  ← chip gốc, không đụng
│      └──────────────────────────┘        │
│                                          │
│   ✓ M1 · ◐ M2 NHẬP MÃ 04D 23H 59M 59S    │  ← dòng Mission (bấm được, cao 44px)
│      ●━━━✈━━━○━━━━━━━○                   │  ← timeline + máy bay chạy theo tiến độ
│     NOOB   EASY CHEESY  HIT THE ROCK     │  ← độ khó từng mission
│                                          │
│              [ nội dung trang ]          │
│  ┌────────┐                  ┌────────┐  │
│  │ ‹ BẢN ĐỒ │    ▬▪▪▪▪        │ TIẾP › │  │
│  └────────┘                  └────────┘  │
└──────────────────────────────────────────┘
```

- **Dòng Mission** (`top: 62px`): trần không nền không viền, Oswald 11px chữ hoa giãn
  rộng, amber opacity .75, `tabular-nums`. Chấm `◐` thở 2,4s. Vùng bấm tối thiểu 44px.
- **Đếm ngược** ghi rõ đơn vị `04D 23H 59M 59S`, cập nhật mỗi giây, chỉ thay chữ số nên
  chấm ◐ không giật nhịp.
- **Timeline** (`top: 100px`): 3 nút tròn nối bằng thanh ngang, thanh amber chạy theo
  tiến độ (5% → 28% → 55% → 100%). Có **icon máy bay nhỏ trượt theo đúng tiến độ**,
  bob nhẹ 2,8s. Dưới mỗi nút là **độ khó**:

| Mission | Độ khó |
|---|---|
| Mission 1 | **Noob** |
| Mission 2 | **Easy Cheesy** |
| Mission 3 | **Hit the rock** |

- **Reo sáng khi mở mốc mới**: xong M1 / xong M2 / xong M3 / vừa gia hạn → dòng Mission
  và timeline nháy sáng 3 nhịp (`.boom`). Nếu lúc đó đang ở trang khác (vd màn Hoàn tất
  của form) thì để dành, quay về bìa mới reo.
- Cả dòng Mission lẫn timeline **chỉ hiện ở trang bìa**, lật trang là tự ẩn.
- Khối chữ của trang bìa được đẩy xuống thêm 46px (`#deck > .page:first-child > .content`)
  để không dính vào timeline.
- `prefers-reduced-motion`: tắt mọi nhấp nháy, thay bằng sáng tĩnh.

---

## 2. Quy ước chữ nghĩa

- Mọi mật khẩu trong game gọi thống nhất là **mã truy cập** — không dùng "PIN", không
  dùng "PASS" ở bất kỳ đâu người chơi nhìn thấy. Sửa một chỗ là hằng `MA`.
- **Tên Mission luôn đứng trước** trong nhãn hộp: `MISSION 2 · MÃ TRUY CẬP`,
  `MISSION 3 · MÃ TRUY CẬP`, `MISSION 3 · PHÁ ĐẢO (˶˃ ᵕ ˂˶)`.

---

## 3. Ba nấc nhiệm vụ

### Mission 1 · Điền Form — *Noob*
- Bấm dòng Mission **lần đầu** → nút **Bản đồ** (góc dưới trái, đang khoá và dẫn tới
  Phần I) **nhấp nháy 4 nhịp trong 3,5 giây**. Bấm **từ lần thứ hai** → mở thẳng hộp
  Mission 2 (có ô nhập mã, xem dưới) để đồng chí nào đã xin được mã không bị kẹt.
- **Gửi form thành công là tick M1** — chỉ cần màn "Hoàn tất" hiện ra, **không xét nội
  dung khai đúng hay chưa**.
- Ngay khoảnh khắc đó: `m1at = now`, `m2at = now + 5D` → **Mission 2 mở luôn**, dòng
  Mission đổi sang `✓ M1 · ◐ M2 NHẬP PASS 04D 23H 59M 59S` và reo sáng.
- **Sau khi xong M1**: nút Bản đồ **khoá tạm** — mỗi lần bấm chỉ **sáng lên một nhịp**
  (600ms). Nút chỉ thực sự mở khi giải xong Mission 3.

### Mission 2 · Nhập mã — *Easy Cheesy*
- Mở **ngay khi xong M1**, có **5 ngày (5D)** để giải. **Mã: `JUNGLE`** (gõ thường
  vẫn nhận).
- Chưa xong M1 mà vẫn mở được hộp (bấm dòng Mission lần 2, cửa test…) → hộp hiện câu
  dùng chung: *"Đồng chí vui lòng hoàn thành **Form** và liên hệ **Hội đồng MeowMeow**
  để được cấp **mã truy cập** ✦"* + nút **Điền Form ngay** + **vẫn có ô nhập mã**. Nhập đúng
  là qua thẳng cửa 2 (tick luôn M1) và mở Mission 3.
- **Hết 5 ngày mà chưa giải**: dòng đổi thành `◐ M2 HẾT GIỜ · XIN GIA HẠN`, trong hộp
  hiện dòng *"Hết cửa sổ 5 ngày rồi ⏳ Liên hệ **Hội đồng MeowMeow** để nhận chi viện ✦"*
  — **không lộ mẹo**. Cách chi viện thật: góc dưới **phải** có nút **gia hạn**, bấm
  **10 nhịp liên tục** (mỗi nhịp < 0,9s) → nạp lại trọn **5 ngày mới**, vẫn phải nhập đúng
  `JUNGLE`. Không bao giờ kẹt vĩnh viễn. Bắn sự kiện `gia_han_m2`.
- Nhập đúng → `✓ M2`, Mission 1 ẩn khỏi dòng, Mission 3 mở cửa sổ 5 ngày. Hộp đổi **ngay**
  (320ms) thành **bảng ghi công `MISSION 2 · HOÀN THÀNH`** (*"Thông Quan ✦"* — "Tiếp tục tiến
  trình ở Mission 3. Thời hạn Phá đảo: 5 ngày") và **đứng yên ở đó** — không còn
  dòng báo xanh loé một cái rồi biến mất nữa. Trong bảng có đồng hồ đếm ngược cửa sổ
  Mission 3 (`⏳ Còn lại: 04D 23H 59M 47S`) và nút **Tới Mission 3 ✦**. Nội dung bảng:
  tiêu đề **"Thông Quan ✦"**, thân *"Tiếp tục tiến trình ở **Mission 3**. / Thời hạn Phá
  đảo: **5 ngày**"*.

**Khoá hồ sơ**: xong Mission 2 thì **Form chốt sổ** — mọi ô nhập bị vô hiệu, các chip
không bấm được, nút Gửi đổi thành *"Hồ sơ đã chốt 🔒"* kèm dòng nhắc. Đồng chí vẫn lật
trang đi dạo xem lại bình thường. Chỉ khoá khi đã **thực sự gửi form** (`st.form`) —
ai qua cửa 2 bằng mã mà chưa điền thì form vẫn mở để điền nốt.

### Mission 3 · Giải mã — *Hit the rock*
- Mở **ngay khi xong M2**, có **5 ngày (5D)** để giải:
  `✓ M2 · ◐ M3 GIẢI MÃ 04D 23H 59M 59S`.
- **Mã: `PHAM TUAN`** — gõ "Phạm Tuân" có dấu, có khoảng trắng, chữ thường đều nhận
  (bỏ dấu + bỏ cách + viết hoa trước khi so).
- Lời dẫn ghi *"Phá đảo **Mission 3** để mở khoá **Map: Bản đồ tác chiến** ✦"*. Khi chưa
  có gợi ý, dòng chờ ghi *"Xin mừi Dongchi Bình thử sức ٩(ˊᗜˋ\*)و~~~"*.
- **Đồng hồ cát** chỉ làm một việc: đếm ngược, không dạy người chơi phải làm gì.
  - dưới danh sách gợi ý → *"⏳ Gợi ý tiếp theo sẵn sàng sau **00:47:13**"*
  - chưa có gợi ý nào, hoặc đã hết gợi ý → **không hiện gì**
  - khi bị khoá lượt → *"⏳ Quay lại sau **00:29:41**"* (xem §4)
- **Gợi ý** lộ dần theo thứ tự:
  1. `12`
  2. `5121`
  3. `MIG-21`
  4. `Tên người gồm 2 chữ`
- **Cơ chế mở gợi ý** — ba đường, gợi ý nào cũng kèm một câu bình luận của Hội đồng:
  - **Gợi ý 1**: mở khi nhập sai lần đầu. Trước đó hộp không nhắc gì, cứ để đồng chí thử.
  - **Gợi ý 2, 3, 4**: **tự mở** khi đủ **30 phút** (`HINTW`) kể từ gợi ý trước — không
    cần nhập sai thêm. Đang mở hộp thì nhảy ra tại chỗ; hết phiên rồi quay lại cũng thấy
    ngay khi mở hộp.
  - **SOS 10 nhịp**: bỏ qua đồng hồ, mở luôn gợi ý kế tiếp.
- **Nút SOS** góc dưới **trái** của hộp (amber mờ):
  - Bấm **10 nhịp liên tục** → Hội đồng MeowMeow **chi viện luôn một gợi ý** (không cần
    sai, không cần chờ 1 giờ). Bắn sự kiện `sos_hint`. Lời Hội đồng đổi theo đúng gợi ý
    vừa mở (hằng `SOSMSG`) — **dùng chung cho cả ba đường mở gợi ý**:

    | Gợi ý | Câu báo |
    |---|---|
    | 1 | Hội đồng MeowMeow chi viện một gợi ý ✦ |
    | 2 | Ủa, MeowMeow, tiếp tục chi viện gợi ý ✦ |
    | 3 | Sắp hết gợi ý gòyyy đồng chí ơiii ✦ |
    | 4 | Cuối cùng cho 1 gợi ý, MeowMeow ✦ |
  - Bấm **đơn hoặc đôi** → hiện một câu trêu random, **tối đa 6 lần mỗi phiên**.
- **Hết 5 ngày mà chưa giải được**: dòng đổi thành `◐ M3 HẾT GIỜ · GIẢI TIẾP`, trong hộp
  cũng chỉ ghi *"Liên hệ **Hội đồng MeowMeow** để nhận chi viện ✦"*. Cách chi viện thật:
  góc dưới **phải** có nút **skip chìm** (opacity ~13%), bấm **10 nhịp liên tục** → mở
  khoá luôn.
- **Phá đảo M3 là cửa mở PÍ DANH.** Lần đầu phá đảo mà chưa có pí danh nào thì chen
  **một bước KHAI DANH** (`MISSION 3 · KHAI DANH` — *"Nhập pí danh ✦"*, tối đa 6 ký tự,
  không viết hoa) rồi mới tới bảng ghi công. Từ đây dòng Mission đổi hình: **`✓ M3` đẩy
  lên chỗ của `✓ M2`, ô thứ hai thành bảng xổ pí danh**. Luật đầy đủ ở `USER-FLOW.md` §6.
- Giải xong (hoặc skip): hộp mang nhãn **`MISSION 3 · PHÁ ĐẢO (˶˃ ᵕ ˂˶)`**, chữ căn giữa
  (class `.msn-card.done` — bù 1px padding trái vì viền trái dày 2px, `text-wrap:balance`
  cho các dòng gãy đều nhau) với nội dung:

  > **Chúc mừng Dongchi Bình ⚞^. .^⚟!**
  > Chúc đồng chí giữ vững phong độ tiếp tục phá đảo **Map: Bản đồ tác chiến**.
  > *--Kí tên: Hội Đồng MeowMeow ฅ^>⩊<^ ฅ* — căn phải, chữ nghiêng

  + CTA **"Mở khoá Bản đồ tác chiến ✈"** + nút **Chơi lại từ đầu** (bấm nhịp thứ hai để
  xác nhận, chữ đổi thành *"Bấm lần nữa để xoá sạch tiến độ"*). Nút **Bản đồ** góc màn
  hình sáng amber, ổ khoá biến mất.
- **Nút "Tới bản đồ" trong hộp và nút "Bản đồ" góc màn hình đi chung một cửa** — cùng
  hàm `goMap()`, cùng đích `MAPURL`, chỉ khác nhãn nguồn trong sự kiện `vao_ban_do`.

---

## 4. Luật lượt nhập (dùng chung cả hai cửa)

- **Pool lượt nhập dùng chung cho Mission 2 và Mission 3**: **3 lượt mỗi phiên**,
  **12 lượt mỗi ngày**.
- Đầu hộp có dòng nhắc ngắn `LƯỢT NHẬP · 3/3 PHIÊN · 12/12 HÔM NAY`, trừ dần theo từng
  lần sai.
- Hết **3 lượt phiên** → **khoá 30 phút**. Hết **12 lượt ngày** → **khoá tới nửa đêm**.
  Thông báo là một đồng hồ đếm ngược sống: *"Hết **3 lượt** của phiên này ⏳ / Quay lại
  sau **00:29:41**"*. Hết giờ thì ô nhập tự mở lại và lượt phiên được cấp lại ngay trong
  hộp, không phải tải lại trang.
- Hộp **vẫn mở nguyên** (chỉ khoá ô nhập) để còn đọc gợi ý mà biết sai ở đâu. Mốc khoá
  lưu `localStorage` nên tải lại trang không né được.
- Nhập sai **không ghi "Sai rồi"** — nếu lần sai đó làm lộ gợi ý mới thì hiện **lời Hội
  đồng** tương ứng (`SOSMSG`), còn lại là một **câu trêu random** từ pool `TAUNTS`
  (không lặp câu liền trước).
- Hết khoá → cấp lại 3 lượt phiên.

---

## 5. Trạng thái nút Bản đồ (góc dưới trái)

| Trang | Tiến độ | Nhãn & hành vi |
|---|---|---|
| Bìa | Chưa xong M1 | Biểu tượng **Bản đồ có ổ khoá** · bấm là nhảy tới Phần I (Form) |
| Bìa | Xong M1, chưa xong M3 | Vẫn khoá · bấm chỉ **sáng một nhịp** 600ms, bắn `bam_ban_do_khoa` |
| Bìa | Xong M3 | Sáng amber, **ổ khoá biến mất** · bấm là `goMap()` sang `MAPURL` |
| Trang khác | bất kỳ | Trở lại thành nút **"‹ Lùi"** bình thường — class `mapopen` tự gỡ |

## 6. Màn "Hoàn tất" của form (trang 5/5)

- Thoát được bằng **3 cách**: nút **✕** góc trên phải, **bấm ra nền**, hoặc CTA
  **"← Về trang bìa · xem tiến độ Mission"** (bắn sự kiện `ve_trang_bia`).
- CTA đưa thẳng về trang bìa — lúc này Mission 1 đã tick, Mission 2 đã bắt đầu đếm
  ngược, và dòng Mission + timeline **reo sáng 3 nhịp** báo vừa mở mốc mới.

---

## 7. Cửa test (không phải chờ đúng ngày)

**Tap 10 nhịp liên tục** (mỗi nhịp < 0,9s) vào **nút tròn trên timeline** của mission đó.
Mọi cửa test đều mở ra **hộp có ô nhập mã**, không bao giờ để người chơi kẹt cứng.

**Nấc đã chinh phục thì chỉ cần bấm một cái** — vào nút tròn trên timeline, **hoặc bấm
thẳng vào chữ `✓ M1` / `✓ M2` / `✓ M3` trên dòng Mission** — là mở lại bảng ghi công,
không phải gõ 10 nhịp:

| Nút | Khi đã xong | Mở ra |
|---|---|---|
| Nút 1 | M1 xong | `MISSION 1 · HOÀN THÀNH` — *"Form khai báo đã về căn cứ ✦"* + **đúng hai dòng** thân bài |
| Nút 2 | M2 xong | `MISSION 2 · HOÀN THÀNH` — *"Thông Quan ✦"* + đếm ngược cửa sổ M3 + nút Tới Mission 3 |
| Nút 3 | M3 xong | `MISSION 3 · PHÁ ĐẢO` |


| Nút | Điều kiện | Kết quả |
|---|---|---|
| Nút 1 (Noob) | M1 chưa xong | Coi như đã gửi form → mở cửa sổ 5 ngày của M2 |
| Nút 2 (Easy Cheesy) | M2 chưa xong | Tick M1 nếu cần + nạp lại trọn **5 ngày** cho M2, mở hộp nhập mã ngay |
| Nút 3 (Hit the rock) | Đã xong M2, M3 chưa xong | Tua hết giờ M3 → lộ nút **skip** trong hộp, mở hộp ngay |

Mỗi lần dùng đều bắn sự kiện `test_unlock` về Telegram.

---

## 8. Đo đạc

| Sự kiện | Khi nào |
|---|---|
| `bam_dong_countdown` | Bấm dòng Mission — kèm nấc hiện tại + số ngày còn lại |
| `nhay_ban_do_xong` | Sau khi nút Bản đồ nháy — "bấm tiếp sau N giây" vs "bỏ đi (12s)" |
| `mo_khoa_m2_cua` | Xong Mission 1 → mở cửa sổ Mission 2 |
| `ve_trang_bia` | Bấm CTA quay về bìa từ màn Hoàn tất |
| `sai_pin` | Nhập sai mã (kèm mission + lượt phiên + lượt ngày) |
| `khoa_pin` | Vừa bị khoá (30 phút hoặc hết 12 lượt ngày) |
| `mo_khoa_m2` | Nhập đúng `JUNGLE` |
| `gia_han_m2` | Bấm gia hạn 10 nhịp — nạp lại 5 ngày cho M2 |
| `giai_m3` | Giải đúng `PHAM TUAN` |
| `skip_m3` | Mở M3 bằng nút skip |
| `vao_ban_do` | Bấm nút Bản đồ đã mở / nút "Tới bản đồ" trong hộp |
| `reset_msn` | Bấm chơi lại từ đầu |
| `test_unlock` | Dùng cửa test 10 nhịp (kèm mission nào) |
| `sos_hint` | Mở thêm gợi ý — SOS 10 nhịp hoặc tới giờ tự mở (kèm gợi ý thứ mấy) |
| `bam_ban_do_khoa` | Bấm nút Bản đồ khoá tạm sau M1 (một lần mỗi phiên) |

Tất cả đi qua hệ `ping` sẵn có (endpoint `/api/ping`, 3 tầng dự phòng).

---

## 9. Lưu trữ & reset

- `localStorage.msn1`:
  `{ v, m1, m2, m3, m1at, m2at, m2doneAt, hints, hintAt, lockUntil, dayKey, dayN, form }`
  - `form` = đã bấm gửi form thật (khác với qua cửa 2 bằng mã) — dùng để quyết định khoá hồ sơ.
  - `v` = phiên bản luật (**hiện là 3** — đồng hồ chuyển từ "thời gian chờ" sang
    "cửa sổ làm bài"). Nâng luật thời gian lần nữa thì tăng `v` và viết nhánh di trú
    tương ứng.
  - `m1at` = lúc xong M1 · `m2at` = **hạn chót** giải M2 · `m2doneAt` = lúc xong M2
    (mốc tính 5 ngày của M3).
  - `dayKey` / `dayN` = ngày hiện tại và số lượt sai đã dùng trong ngày (trần 12).
- `sessionStorage.msnw`: số lần nhập sai trong phiên — **dùng chung** cả hai cửa.
- `sessionStorage.msnsos`: số câu trêu SOS đã dùng trong phiên (trần 6).
- **Di trú v2 → v3** tự động: ai đang dở M2 được cấp lại 5 ngày từ lúc mở trang, ai
  đang dở M3 cũng vậy — không ai bị kẹt vì đổi luật.
- **Reset**: nút Chơi lại trong hộp M3, hoặc tự xoá `msn1` — về vạch xuất phát, đồng hồ
  chỉ chạy lại khi xong M1. Reset **hạ cờ `nav1.mapUnlocked`** (về pha 1) nhưng **giữ
  nguyên pí danh** — bấm chip góc phải là quay lại bản lưu cũ.
- `localStorage.nav1`: pí danh + pha điều hướng, dùng chung với trang bản đồ. Xem
  `USER-FLOW.md`.

---

## 10. Hằng cấu hình (đầu khối script Mission trong `index.html`)

```js
var MAPURL = 'https://dongchi-binh-33.vercel.app/';  // đích chung của mọi nút Bản đồ
var PIN2 = 'JUNGLE', PIN3 = 'PHAMTUAN';
var HINTS  = ['12', '5121', 'MIG-21', 'Tên người gồm 2 chữ'];
var TAUNTS = ['Nope 🙅', '10 chiếc hun 💋 cũng khúm đượt 😆',
              'Nah nah nah — cố lên anh oyyyy 💪', 'Very earth very skyyy o_O 😩💦'];
var W2 = 5*DAY;              // cửa sổ giải Mission 2 (từ lúc xong M1)
var W3 = 5*DAY;              // cửa sổ giải Mission 3 (từ lúc xong M2)
var DIFF = ['Noob', 'Easy Cheesy', 'Hit the rock'];
var TRY_S = 3, TRY_D = 12;   // lượt nhập sai: mỗi phiên / mỗi ngày (dùng chung M2+M3)
var HINTW = 30*60*1000;      // chờ giữa hai gợi ý Mission 3
var MA = 'mã truy cập';      // tên gọi thống nhất cho mọi mật khẩu
var SOSMSG = [ /* 4 câu Hội đồng, khớp theo thứ tự gợi ý được mở */ ];
```

Đổi mã, gợi ý, câu trêu, độ khó, cửa sổ thời gian hay số lượt: sửa đúng các hằng này,
không cần đụng chỗ khác.

---

## 11. Tối ưu xuất thiệp

`html2canvas` bản gốc luôn vẽ `scale: 2`. Thiệp `#printcard` rộng 600px nhưng **rất cao**,
nên canvas phình lên hàng triệu điểm ảnh — khúc nghẽn thật sự là `toDataURL('image/png')`
chứ không phải lúc vẽ.

Khối bổ sung bọc `window.html2canvas` lại và chặn theo **tổng điểm ảnh** (trần ~4,2 triệu):

```js
var tran = Math.sqrt(4.2e6 / (w * h));
opt.scale = Math.max(1, Math.min(opt.scale || 2, tran));
```

Thiệp cao ~3000px sẽ tự hạ xuống scale ~1,5 — mắt thường không thấy khác, nhưng nhanh hơn
nhiều lần trên máy yếu. Muốn nét hơn thì nâng hằng `4.2e6`; muốn nhanh hơn nữa thì hạ xuống.

---

## 12. Chống mất tín hiệu (blocker & tường lửa)

Máy người chơi có thể cài chặn quảng cáo hoặc ngồi sau tường lửa, khi đó request đo đạc
tới đường dẫn kiểu `/api/ping` hay bị nuốt im lặng. Gói này đi **bốn tầng**:

| Tầng | Cách gửi | Đích |
|---|---|---|
| 1 | `navigator.sendBeacon` | `/api/note` |
| 2 | `fetch` POST JSON | `/api/note` |
| 3 | Ảnh 1×1 GET (`onerror` → tầng 4) | `/api/ping` |
| 4 | **Gửi biểu mẫu** — `<form method="POST">` vào iframe ẩn | `/api/ping` |

Tầng 4 là đường "gửi qua form rồi từ đó ping Telegram": trình duyệt coi form POST là điều
hướng chứ không phải request đo đạc nên gần như không bị chặn, và `/api/ping` vốn đã sẵn
logic bắn sang Telegram — không cần dịch vụ trung gian nào.

**Mốc quan trọng đi song song hai kênh** (hằng `QUAN_TRONG`): `gui_form`, `mo_khoa_m2_cua`,
`mo_khoa_m2`, `giai_m3`, `skip_m3`, `gia_han_m2`, `test_unlock`, `reset_msn`, `vao_ban_do`.
Thà nhận trùng một tin còn hơn mất dấu một mốc. Tin qua kênh biểu mẫu gắn nhãn `[bieu-mau]`
trong tin nhắn Telegram. Tắt bằng `TRACK.duplex = false`.

`api/note.js` chỉ là `module.exports = require('./ping.js')` — cùng xử lý, khác mỗi đường
dẫn. **Phải deploy cả hai file.**
