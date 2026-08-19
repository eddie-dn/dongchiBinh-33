# Bản đồ tác chiến · Phi đoàn Dongchi Bình

Trang tĩnh, không build, không dependency. Mỗi file HTML tự chứa toàn bộ CSS/JS của nó.
Deploy thẳng lên Vercel từ GitHub.

**Phiên bản hiện tại: V17.06** — ba map nối liền: bản đồ mật thư → Easter Egg (pháo hoa +
Gate 2) → Zoey's Castle.

> **Tên gọi chốt cho về sau:** trang này chứa **hai game rời nhau**.
> `MAP-01 · Bản đồ tác chiến` là game giải mật thư bốn toạ độ.
> `MAP-02 · Easter Egg` là màn sinh nhật, chỉ mở khi MAP-01 xong **và** đếm ngược về 0.
> Tên khai ở hằng `GAMES` trong `index.html` — sửa một chỗ, đổi khắp nơi.

---

## 1. Cấu trúc thư mục

```
/
├── index.html              ← TRANG CHỦ: bản đồ Việt Nam, 4 toạ độ
├── og.png                  ← ảnh chia sẻ 1200×630
├── vercel.json             ← cleanUrls
├── README.md
├── .gitignore
│
├── api/
│   ├── ping.js             ← endpoint đo đạc, bắn về Telegram/Discord
│   ├── note.js             ← bí danh của ping.js (đường chính, né bộ chặn)
│   └── thu.js              ← endpoint nhận lời nhắn (hiện KHÔNG còn nút nào gọi tới)
│
├── phao-hoa/index.html     ← MAP 2 · màn pháo hoa, nền bản đồ tắt đèn
├── han/                    ← MAP 3 · ZOEY'S CASTLE
│   ├── CHU-MAP3.md         ← toàn bộ câu chữ của Map 3, gom một chỗ để sửa
│   ├── 961030-a/index.html ← WHO'S MY KINDRED SPIRIT · bộ câu hỏi, theme Sakura
│   ├── 961030-b/index.html ← SECRET CHAMBER · nền dải ngân hà, mở bằng mã từ 961030-a
│   └── 261030/index.html   ← MỒ CÔI: không còn đường nào trên bản đồ dẫn tới, xoá được
├── dad/
│   ├── 950901-a/           ← DAD-950901-A · hồ sơ đã xuất bản
│   │   ├── index.html
│   │   ├── vercel.json     ← chỉ dùng khi deploy tách riêng
│   │   ├── MISSIONS.md     ← luật chơi hệ 3 Mission
│   │   ├── README.md
│   │   └── api/            ← bản sao cho deploy tách riêng, monorepo không build
│   │       ├── ping.js
│   │       └── note.js
│   └── 950901-b/index.html ← DAD-950901-B · EASTER EGG · GATE 2 (đếm ngược, phát mã)
├── uih/                    ← chưa có hồ sơ
└── sgn/                    ← chưa có hồ sơ
```

Vercel tự phục vụ `dad/950901-a/index.html` tại `/dad/950901-a`. Một sub-page = một thư
mục chứa đúng một `index.html`.

---

## 2. Bốn toạ độ

| Mã | Thành phố | Vai trò |
|---|---|---|
| `HAN` | Hà Nội | **Map 3 · Zoey's Castle** — hai hồ sơ `961030-A/B`, chỉ hiện sau khi tìm ra Easter Egg |
| `DAD` | Đà Nẵng | Hai hồ sơ: `DAD-950901-A` (ba Mission) và `DAD-950901-B` (Easter Egg · Gate 2) |
| `UIH` | Quy Nhơn | Chưa có hồ sơ |
| `SGN` | TP.HCM | Chưa có hồ sơ · **là toạ độ chốt sổ**, xem mục 5 |

Phép chiếu sang toạ độ SVG (viewBox `0 0 746 966`):

```
x = (lon - 102.0) * 57.816
y = (23.7 - lat)  * 60.000
```

| Mã | Vĩ độ | Kinh độ | x | y |
|---|---|---|---|---|
| HAN | 21.028 | 105.854 | 222.8 | 160.3 |
| DAD | 16.047 | 108.206 | 358.8 | 459.2 |
| UIH | 13.782 | 109.219 | 417.4 | 595.1 |
| SGN | 10.823 | 106.630 | 267.7 | 772.6 |

Không cần tự tính vị trí nút — hàm `place()` đọc `SPOT` rồi dùng `cam.getScreenCTM()` đặt
nút đúng điểm, tính lại cả khi bản đồ đang zoom, khi xoay máy và khi đổi kích thước.

Hoàng Sa và Trường Sa nằm **đúng vị trí địa lý**, cùng phép chiếu với đất liền
(`<g class="isles">`).

---

## 3. Thêm một sub-page mới

**Bước 1** — tạo thư mục, ví dụ `uih/990101-a/index.html`.

**Bước 2** — chép khối bổ sung ở cuối `dad/950901-a/index.html` sang, chỉ đổi hằng `TAG`.

**Bước 3** — khai báo trong `NODES` của `index.html`:

```js
{ code:'UIH', name:'Quy Nhơn', lat:13.782, lon:109.219, fx:'farm',
  morse:'…', answers:['…'], plain:'…', subs:[
    { id:'UIH-990101-A', title:'Tên hồ sơ', href:'/uih/990101-a',
      meta:'Published date: … | V…', pin:'file' }
]},
```

| Trường của một hồ sơ | Bắt buộc | Tác dụng |
|---|---|---|
| `id` | có | Mã hiển thị |
| `title` | có | Tên hồ sơ |
| `href` | có | URL, phải khớp thư mục thật |
| `meta` | không | Dòng chú thích nhỏ (ngày xuất bản, phiên bản) |
| `unlockAt` | không | ISO 8601 kèm múi giờ. Trước mốc này thì khoá và hiện đếm ngược |
| `pin` | không | Tên một mục trong `CODES` — bấm vào phải nhập mã mới xem được |

Toạ độ có `subs: []` tự hiện trạng thái khoá kèm ổ khoá.

---

## 4. Kênh bắt sóng — luật quan trọng nhất

Có **hai đường** tìm ra mã morse, người xem chỉ được chọn **một**. Đường nào dùng trước sẽ
**chốt kênh vĩnh viễn** (biến `channel`), đường còn lại khoá luôn.

| Kênh | Chốt bằng | Về sau |
|---|---|---|
| `map` | Gõ đúp vào điểm sáng trên bản đồ | Mỗi lần muốn xem mã của một toạ độ đã bắt sóng đều phải **gõ đúp lại**; mã **ghim đứng yên** để bấm vào mà mở hộp. Gõ đúp ra chỗ trống thì bỏ ghim. Dòng toạ độ trong hồ sơ **niêm phong vĩnh viễn** |
| `sheet` | Mở hồ sơ rồi gõ đúp vào dòng toạ độ | Phải vào hồ sơ **từng địa điểm** rồi lặp lại đúng thao tác. Ngoài bản đồ im lặng hoàn toàn |

Dù đi kênh nào cũng **phải thao tác riêng cho từng địa điểm**.

**Cửa duy nhất vào hộp pí mật là gõ đúp lên chính chuỗi morse.** Ngoại lệ có chủ đích: huy
hiệu sau khi giải đủ 4/4 cũng bấm vào được.

### Bảng thao tác trên điểm sáng

| Thao tác | Kết quả |
|---|---|
| Rê chuột / `Tab` tới | HUD hiện **toạ độ** |
| **1 click** | Zoom vào thành phố, mở bảng hồ sơ |
| **2–3 click** (chưa bắt sóng) | Bắt sóng toạ độ đó, ghim mã morse |
| **2–3 click** (đã bắt sóng) | Ghim lại mã morse để bấm vào |
| **2–3 click ra chỗ trống** | Bỏ ghim |

Click đơn có độ trễ **340 ms** để phân biệt với cú đúp — không phải lag. Cú đúp tự đếm
nhịp bằng `multiTap()` chứ không tin `e.detail`, vì trên mobile double-tap thường trả về
hai click rời.

---

## 5. SGN là toạ độ chốt sổ

`SGN` bị chặn ở **cả hai khâu**:

1. **Bắt sóng** — `gateOpen()` chỉ cho mở khi ba toạ độ kia đã bắt sóng. Chưa tới lượt mà
   thao tác lên nó thì **không có gì xảy ra**: không báo, không gợi ý, không đổi giao diện.
2. **Giải đáp án** — dù đã có mã morse, ô nhập vẫn khoá tới khi ba toạ độ kia giải xong,
   kèm dòng *"Chưa thể hạ cánh ở toạ độ này"*. Hàm `guess()` chặn ở tầng logic chứ không
   chỉ ở giao diện.

Đổi toạ độ chốt sổ bằng hằng `LAST_CODE`.

---

## 6. Mã morse và hộp pí mật

| Mã | Chuỗi giải ra |
|---|---|
| HAN | OUR 1ST DATE |
| DAD | OUR HOMETOWN |
| UIH | CON DUONG HANH PHUC |
| SGN | OUR 1ST ENCOUNTER |

Đáp án khai ở `answers`, bản chữ hiển thị ở `plain`. So khớp sau khi bỏ dấu tiếng Việt, bỏ
khoảng trắng và hạ chữ thường — gõ "Con Đường Hạnh Phúc" hay "conduonghanhphuc" đều được.

- **Không copy được** — cả ba chỗ hiện morse đều `user-select:none`.
- **Hiệu ứng sáng** — mã morse hiện lần đầu ở bất cứ đâu thì `frame` gắn class `hot`
  **vĩnh viễn**: từ đó mọi chuỗi morse nhấp nháy phát sáng, con trỏ đổi sang `pointer`.
- **Nhập sai** → câu trêu đi lần lượt theo `WRONGS` rồi vòng lại. Trước khi sai, ô gợi ý
  hiện câu cổ vũ từ `CHEER`.
- **Giải đúng** → khối chúc mừng hiện **câu khen** (từ `PRAISE`, mỗi toạ độ một câu khác
  nhau) và lời mời liên hệ Hội đồng Meowmeow. Khối này có **viền vàng nhạt nhấp nháy nhẹ**
  quanh toàn bộ hộp (`@keyframes wonGlow`).
- Mọi câu ngẫu nhiên đều rút qua **túi xáo** `bag()`: hết bộ mới trộn lại, có chống dính
  đuôi giữa hai vòng, nên không câu nào lặp liên tiếp.

### Hai nút biểu tượng cuối hàng tab

| Nút | Biểu tượng | Hiện khi | Chú thích khi trỏ vào |
|---|---|---|---|
| `#cxRp` | cuộn phim | toạ độ đang chọn đã giải | "Xem lại hiệu ứng ăn mừng" |
| `#cxRs` | mũi tên quay vòng | đã giải đủ 4/4 | "Chơi lại từ đầu" |

Bấm nút chơi lại sẽ hỏi lại một nhịp: **"Chú Bình chắc chưaaa?"** với **1000%** và
**Xem xét**.

---

## 7. Mã PIN và PASS

Quy ước tên gọi:

- **PIN** — mã **toàn số**, hiện dạng chấm tròn khi gõ.
- **PASS** — mã **có ký tự**, hiện chữ thật khi gõ.

Khai báo tập trung trong `CODES`:

```js
const CODES = {
  map:  { kind:'PIN',  code:'1959',   hint:'DAD-950901 TARO', tries:2 },
  file: { kind:'PASS', code:'MIG-21', hint:'Điện Biên Phủ',   tries:3 }
};
```

| Cửa | Loại | Mã | Gợi ý | Khi gõ sai |
|---|---|---|---|---|
| `map` | PIN | `1959` | DAD - TARO | Sai 2 lần thì đóng, về bản đồ chính |
| `file` | PIN | `5121` | bốn gợi ý đi lần lượt, xem dưới | Hiện **Sai n/3**; sai **quá 3 lần trong MỘT NGÀY** thì **khoá 60 phút** |

**Bốn gợi ý của `file` đi LẦN LƯỢT, không ngẫu nhiên** — mỗi lần gõ sai thì nhích sang câu
kế tiếp rồi vòng lại từ đầu. Thứ tự đã chốt, `5 ngôi sao` đứng **trước** `Phạm Tuân`:

1. `Gợi ý số 2, mission 3`
2. `MIG-21`
3. `5 ngôi sao`
4. `Phi công Phạm Tuân`

Con trỏ gợi ý là `pinHintIdx`. **Sang ngày mới thì cả bộ đếm sai lẫn con trỏ gợi ý đều về
0** (`pinRoll()`), nên người xem lâu lâu mới ghé vẫn được đọc lại gợi ý **từ câu đầu**, không
bị rơi vào giữa danh sách.

**Bộ đếm sai tính theo NGÀY** (`pinFail` + `pinFailDay`, lưu ở `localStorage` cùng tiến độ,
không còn ở `sessionStorage` nữa nên đóng tab mở lại vẫn đếm tiếp). Sang ngày mới hoặc khi
khoá vừa hết hạn thì về 0. Mỗi lần sai, hộp báo đúng dạng **`Chưa đúng · Sai n/3`**; tới
`3/3` thì báo thêm *"sai thêm lần nữa là khoá 60 phút"*. Lần sai thứ **4** mới thực sự khoá
`pinLockUntil` 60 phút. Gõ đúng mã thì đếm về 0 và gỡ khoá luôn.

**Chuẩn hoá khi so mã:** cả mã gõ vào lẫn mã gốc đều bỏ hết ký tự không phải chữ/số rồi
mới so (`codeNorm`). Nhờ vậy gõ `MIG-21`, `mig21`, `mig 21` đều đúng, và **không còn cảnh
không gõ được dấu gạch** — dấu gạch trong mã gốc chỉ để nhìn cho dễ. Số ô nhập cũng đếm
theo mã đã chuẩn hoá (MIG-21 → 5 ô).

Gợi ý **chỉ hiện sau khi đã vào được hộp mã**, không làm tooltip.

Thêm cửa khoá mới: thêm một mục vào `CODES`, rồi gọi `openPin('tên')` hoặc gắn
`pin:'tên'` vào một hồ sơ.

---

## 8. Lịch theo năm — đọc trước khi sửa bất cứ gì về thời gian

Mọi mốc sinh ra từ **một bảng duy nhất**:

```js
const SEASON = { armBefore:15, birthday:[9,1], phase2At:[9,3], milestone2:[10,30] };
```

| Pha | Khoảng | Đếm ngược tới | Trạng thái |
|---|---|---|---|
| `season` | 17-08 → hết 02-09 | 01-09 | DAD có hồ sơ niêm phong |
| `phase2` | 03-09 → 30-10 | 30-10 | Đồng hồ lớn đổi mốc; hồ sơ HAN đi theo Easter Egg chứ không theo pha |
| `off` | 31-10 → 16-08 năm sau | 01-09 mùa kế | Chỉ đếm ngược |

Bước vào pha `season` của một năm chưa từng chơi thì **tiến độ tự xoá sạch** — chỉ một lần
mỗi mùa, nhờ mốc `season` lưu kèm tiến độ.

**Bốn quy tắc chống xung đột cho bản cập nhật sau:**

1. **Không hardcode năm** ở bất cứ đâu. Cần mốc mới thì thêm vào `SEASON` rồi mở rộng
   `season()`; `NODES` chỉ trỏ tới `BIRTHDAY` / `PHASE2_AT` / `MILESTONE2`.
2. **Không đổi ý nghĩa khoá lưu trữ `mtv1`.** Thêm trường mới thì thêm vào cả `save()` lẫn
   `boot()`, luôn có giá trị mặc định để dữ liệu mùa cũ không làm vỡ mùa mới.
3. **Đừng gắn `unlockAt` bằng chuỗi ngày cứng** trong `NODES`.
4. Muốn dời sinh nhật hay thêm mốc, sửa `SEASON` là đủ.

Bấm thẻ **Phi vụ tiếp theo**: pha `season` mở node **DAD**, pha `phase2` mở node **HAN**.

---

## 9. Huy hiệu bốn tên lửa

Huy hiệu chỉ có **một hình thức từ đầu tới cuối: bốn tên lửa**. Không còn huy chương, không
còn con dấu Mission Completed, không còn dòng đếm.

| Trạng thái | Class | Hình | Khi nào |
|---|---|---|---|
| Ngủ | `dormant` | Bốn nét viền mảnh, im lìm | Chưa bắt được mật thư nào — hiện **ngay từ đầu** |
| Sẵn sàng | `armed` | Quả đã giải sáng đặc, quả chưa giải nhấp nháy lệch pha | Đã bắt được mật thư đầu tiên |
| Reo | `hail` | Cả bốn sáng, co giãn theo nhịp | Suốt 15 giây mạng lưới chạy |
| Xong | — | Cả bốn sáng, đứng yên | Sau khi mạng lưới chạy xong |

Bấm huy hiệu khi đã đủ 4/4 để mở lại hộp pí mật.

Khi giải đủ 4/4 và quay ra bản đồ: **mạng lưới 50 tỉnh** bừng lên **15 giây**, đường nối
chạy nét đứt, cả đất liền nhấp nháy (`.frame.win`), bốn tên lửa cùng reo.

**Độ sáng bản đồ** tăng dần theo tiến độ: `--lum = 0.80 + 0.05 × số mật thư đã giải`.
Đường bay dùng `--lum²` nên đậm lên nhanh hơn.

## 10. Ba cửa hậu

| Cửa | Thao tác | Kết quả |
|---|---|---|
| **Tổng tư lệnh** | Bấm **5 cú liên tiếp** vào dòng bản quyền ở chân trang | Hộp **Box Tổng tư lệnh** hai bước, xem dưới |
| **Collected: Easter Egg** | Bấm **10 cú liên tiếp** vào dòng Last updated | Khung `#credw`, xem mục riêng ngay dưới |
| **Hack Map** | Trong Box Tổng tư lệnh, chọn chiến dịch rồi bấm **Hack Map** | Hộp PIN → nhập `1959`. Chữ `hackmap` gõ đúp đã bỏ, cơ chế PIN giữ nguyên |

Vùng bấm của cửa xoá sạch là **cả dòng bản quyền**, không chỉ lá cờ 15px — dễ trúng hơn
nhiều trên điện thoại. Khi đang đếm, **chỉ lá cờ sáng và phóng to nhẹ**, phần chữ giữ
nguyên.

### Khung "Collected: Easter Egg" — `#credw`

Mở bằng cửa hậu **10 nhịp vào dòng Last updated**. Nội dung sửa ở `.cred-body`.

| Phần | Chi tiết |
|---|---|
| Ảnh chân dung | `.cred-hero` — ảnh ở `/han/honghan.jpg`, hai lớp sáng kiểu splash art (quầng gradient phía sau + lớp phủ bắt sáng phía trước). **Chưa có ảnh thì tự ẩn** (`onerror`) và còn lại quầng sáng, trang không vỡ |
| Tiêu đề | **Collected: Easter Egg** — nhấp nháy cùng cơ chế với cặp *Easter Egg ⇄ Game On* ở tiêu đề trang. Cụm chữ *Tổ kỹ thuật* phía trên đã bỏ để tiêu đề này làm chính |
| Dòng dưới | Dòng chúc mừng kèm chìa khoá xoay. Trước đây còn một dòng `Collected: Easter Egg` nữa — **đã bỏ** vì trùng hệt tiêu đề |
| Dòng chúc mừng | *Chúc mừng **Dongchi Bình** 🎉* với chiếc **jet lượn một vòng chéo** phía trước |
| Hai nút | trái *Get to know me* → `/han/961030-a` · phải *Enter Easter Egg ✦* → **bay thẳng vào `/dad/950901-b`**, đồng thời bật `eggHack` + `credFound` nên quay ra bản đồ là đã GAME ON |
| Dòng tâm tư | một dòng chữ có **dấu thư** dưới hai nút — bấm mở hộp nhập (Gửi / Quay lại), gửi về hòm thư qua `/api/thu` |

**Pháo hoa có TRANG RIÊNG — `/phao-hoa`.** Lần **đầu tiên** mở được khung này là bay
thẳng sang đó (khung đóng lại trước khi đi, không ai vừa xem pháo hoa vừa nhìn khung).
Đóng ở trang pháo hoa thì quay về bản đồ kèm `?cred=1` → khung **tự mở lại**, lúc này đã
có nút cuộn phim; cờ `cred=1` được dọn khỏi thanh địa chỉ ngay sau đó.

**Từ lần thứ hai:** khung mở tại chỗ, chỉ nhấp nháy màu. Muốn xem lại pháo hoa thì bấm
**icon cuộn phim** `#credRp` — cũng sang `/phao-hoa`.

Cờ `eggParty` nằm **trong cùng bộ trạng thái với `mtv1`** (`save()` / `boot()`), nên
**reset là reset cả cụm**: chơi lại từ đầu thì màn pháo hoa cũng mở lại từ đầu.

> **BẪY ĐÃ VẤP:** `let eggParty` phải khai **trước** `boot()`. Khai sau là dính temporal
> dead zone, xem mục 20.

### Box Tổng tư lệnh — hai bước

Câu *"Ace Map & Nhận Huy Chương xịn hơn!"* và chữ `hackmap` gõ đúp đều đã bỏ.

**Bước 1 — chọn chiến dịch.** Hai ô nằm ngang, mỗi ô hiện mã, tên và tình trạng. Dòng dẫn
chỉ ghi *"Chọn chiến dịch"* — **cố ý không nói ra luật 5 nhịp**. Vào được
lệnh của một ô phải bấm **5 nhịp liên tiếp** vào đúng ô đó — giống lá cờ chân trang. Ngưng
quá 900 ms hoặc nhảy sang ô kia là đếm lại từ đầu; ô đang đếm sáng lên (`.hq-card.warm`).
Cố ý làm khó vì sau nút này là lệnh xoá sạch.

| Ô | Tình trạng có thể hiện |
|---|---|
| `MAP-01 · Bản đồ tác chiến` | `Đang chơi · n/4` → `Đã hoàn thành 4/4` |
| `MAP-02 · Easter Egg` | `Chờ MAP-01 xong` → `Mở 00:00 · 01-09` → `Đang diễn ra` |

**Bước 2 — chọn lệnh cho chiến dịch vừa bấm.** Luôn có đúng hai nút, cộng một đường lùi
*"← Chọn chiến dịch khác"*:

| Lệnh | MAP-01 | MAP-02 |
|---|---|---|
| **Reset** | Xoá sạch tiến độ, chơi lại từ đầu, **giữ `R(n)`**, nạp lại trang | **Không đụng tiến độ.** Tua về đúng lúc đếm ngược chạm 0: tiêu đề nhấp nháy đổi màu, chữ nhảy qua lại, băng rôn sinh nhật bay ra, mạng lưới 50 tỉnh bừng lên |
| **Hack Map** | PIN `1959` → mở cả bốn toạ độ, chạy màn ăn mừng | PIN `1959` → làm y như MAP-01, **cộng thêm** bật cờ `eggHack` để mở cửa sổ Easter Egg **trước 01-09** |

Nút **Reset** của MAP-02 bị vô hiệu khi chưa đủ điều kiện (`eggSan()` = đã xong MAP-01 **và**
`eggOpen()`); dòng chú thích dưới nút nói rõ lý do và chỉ sang Hack Map.

**Reset cần bấm hai nhịp.** Nhịp đầu đổi nhãn nút thành *"Chú Bình chắc chưaaa? Bấm lần
nữa"*. Cố ý làm ngay trên nút thay vì mở thêm một hộp xác nhận — hai hộp `.cxw` chồng nhau
sẽ đá `z-index` của nhau.

**`eggHack` sống bền** trong `mtv1`, nên hack một lần là cửa sổ Easter Egg mở mãi. Chỉ
**Reset MAP-01** mới xoá nó (vì đó là `hardWipe`).

### Một đường xoá duy nhất — `hardWipe()`

**Bẫy đã vấp.** Nút chơi lại trong hộp pí mật trước đây reset **từng biến bằng tay** nên
luôn sót: `credFound`, `coachDone`, `visits`, `winCheer`, các class giao diện
`won · cheer · flying · win`, và ba hẹn giờ `titleT · flyT · gridT` vẫn sống. Đường lá cờ
thì dọn `localStorage` rồi `location.reload()` nên mới sạch trọn vẹn.

Nay **cả hai nút đi chung `hardWipe(ev, detail)`**: dọn `mtv1` · `mtping` ·
`mtseen` · `mtload` · `mtvisit` · `mtpf`, ghi lại đúng một trường `resetCount`, rồi nạp lại
trang sau 240 ms. Quy tắc: **muốn reset trọn vẹn thì reload, đừng gỡ từng biến.**

---

## 11. Tem phiên bản và bộ đếm reset

Dòng **Last updated 19-Aug-2026 · V17.06** chạy dọc mép trái bản đồ (`.stamp`), tự ẩn khi
zoom. Chuỗi gốc nằm ở thuộc tính `data-base`; hàm `stampText()` ghép thêm hậu tố
**`· R(n)`** khi đã chơi lại ít nhất một lần.

`R(n)` **sống sót qua mọi lần xoá**: đường xoá sạch bằng lá cờ cố ý ghi lại `resetCount`
vào `mtv1` ngay sau khi xoá. Đây là dấu vết duy nhất được phép tồn tại qua reset.

### Quy ước đánh số phiên bản

`Vx.yy` — **`yy` chỉ chạy `00 → 09`**. Hết `09` thì `x` tăng 1 và `yy` về `00`.
**Không bao giờ có đuôi `.10` hay lớn hơn.**

**Các nấc `x` bị bỏ qua, không dùng: 13, 14, 23.**

| Đang ở | Bản kế tiếp |
|---|---|
| `V12.08` | `V12.09` |
| `V12.09` | **`V15.00`** — nhảy qua 13 và 14 |
| `V22.09` | **`V24.00`** — nhảy qua 23 |

Sửa chuỗi ở thuộc tính `data-base` của `#stamp`; `stampText()` sẽ ghép thêm `· R(n)`.

### Nhấp nháy tem — BỐN lý do, đọc cả bảng trước khi thêm nhánh

Hàm `eggFlash(why)`. Bốn `why` khác nhau, mỗi cái một điều kiện riêng:

| `why` | Gọi khi nào | Điều kiện | Đã tìm ra Easter Egg thì còn nháy? |
|---|---|---|---|
| `win` | vừa giải đủ 4, và mỗi lần mở trang sau đó | chỉ **một lần đời** (`eggDone`) | — |
| `daily` | phiên đầu trong ngày | mỗi ngày một lần (`eggDay`) | **Không** |
| `clue` | chuỗi nhắc bài tìm cửa hậu | mỗi lần mở trang | **Không** |
| `gameon` | **mọi lần mở trang trong cửa sổ Game On** | không kèm điều kiện gì | **Có** |

> **BẪY ĐÃ VẤP — tìm ra Easter Egg xong là tem tắt hẳn.** Ba nhánh đầu đều tắt
> sau khi có `credFound` (`win` thì vướng `eggDone` một-lần-đời), nên người chơi
> F5 mỏi tay trong lúc Game On mà không thấy gì nhấp nháy, tưởng hỏng. Nhánh
> `gameon` sinh ra đúng để chữa chỗ đó: **trong cửa sổ ăn mừng thì tem nháy mỗi
> lần mở trang, tìm ra Easter Egg rồi hay chưa cũng vậy** — nó là lời chúc mừng,
> không phải lời chỉ đường. Ngoài cửa sổ thì `gameon` im, khỏi loạn.

**Mỗi lần mở trang CHỈ MỘT ĐỢT nháy.** Bản trước còn cho tem nháy thêm một lượt nữa sau
khi dòng dẫn nháy xong — thành ra *nháy → nghỉ → nháy*, nhìn như trang bị giật. Đã bỏ
lượt đuôi đó; lượt nháy của dòng dẫn cũng rút còn 6,8 giây cho khớp với Q♥.

Thứ tự gọi lúc khởi động (trong `boot`, sau 900 ms):
`eggFlash('win')` → `eggFlash('gameon')` nếu đang Game On → rồi **hoặc** chuỗi
nhắc bài (`clueChay`) **hoặc** `eggFlash('daily')` khi KHÔNG ở Game On. Ba
nhánh sau loại trừ nhau để không có hai lượt nháy chồng lên nhau.

---

## 12. Bốn hiệu ứng ăn mừng

Vẽ trên canvas `#fx` phủ toàn khung, chạy 5,2 giây. Khi chạy, hộp pí mật **mờ hẳn** và mọi
đường thoát bị khoá (nút ✕, bấm nền, `Esc`) — bấm nhầm lúc này rất dễ vỡ trạng thái.

| Mã | `fx` | Cảnh |
|---|---|---|
| HAN | `park` | Công viên đêm: trăng khuyết nghiêng, máy bay kéo vệt khói xuất phát từ giữa màn hình, sáu cụm mây bông ba mức đậm nhạt, hàng cây, hai cột đèn vàng, con đường |
| DAD | `sea` | Biển chiều muộn: đảo tròn có chim bay, thuyền dài chở hai người trôi từ trái sang phải, mặt trời lặn chậm từ đông sang tây rồi dừng khi hở 2/3 đĩa |
| UIH | `farm` | Đường đất chạy dọc sáng bừng, trăng góc phải, dải núi mờ, sao trời, dây đèn cyan pastel giữa các cột, 16 lùm cây, 40 khóm cỏ, 26 bông hoa dại |
| SGN | `fire` | Bờ kè ven sông có lan can, hai bóng người, pháo hoa **5 hình** (vòng tròn, tên lửa, tai mèo, công tắc, hoa mai) và bầu trời loé theo màu từng đợt |

Mỗi khối `if(fxMode===…)` là một **scope riêng** — biến dùng chung như `t` phải khai báo
lại trong từng khối. Đây từng là nguyên nhân làm chết cả vòng vẽ.

Xem lại hiệu ứng bằng nút cuộn phim trong hộp pí mật.

---

## 13. Đo đạc

### Sự kiện

| Sự kiện | Khi nào | Gửi mấy lần |
|---|---|---|
| `ghe_tham` / `tai_lai` | Mở trang / F5, kèm số lượt tải trong phiên | Mỗi lần |
| `mo_ho_so` | Mở bảng hồ sơ của một toạ độ | 1 lần / toạ độ |
| `chon_kenh` | Chốt kênh bắt sóng | 1 lần duy nhất |
| `mo_khoa_morse` | Bắt được mã của một toạ độ | 1 lần / toạ độ |
| `mo_hop` | Lần đầu mở Hộp pí mật | 1 lần duy nhất |
| `doi_tab` | Chuyển tab trong hộp | 1 lần / mã |
| `giai_dung` / `giai_sai` | Giải đúng / sai, kèm số lần sai | Mỗi lần |
| `hoan_thanh` | Đủ 4/4 | 1 lần duy nhất |
| `reset` / `xoa_sach` | Chơi lại / xoá sạch bằng lá cờ | Mỗi lần |
| `hackmap` | Mở toàn bộ bản đồ bằng PIN | Mỗi lần |
| `mo_ho_so_bang_pin` / `sai_pin_ho_so` | Mở / gõ sai PASS của hồ sơ | Mỗi lần |
| `cua_sau` | Mở khung giới thiệu | 1 lần duy nhất |
| `nhac_goi_y` | Hiện câu nhắc sau khi ngồi im | 1 lần / lượt ghé |
| `ho_so_mo` · `trang_ho_so` · `gui_form` · `ho_so_dong` | Bắn từ chính file hồ sơ | xem mục 14 |
| `tai_trang` | Beacon ảnh, không cần JS | Mỗi lần tải trang |

### Ba tầng dự phòng

`sendBeacon` → `fetch(keepalive)` → **request ảnh** `/api/ping?ev=…` (endpoint trả GIF
trong suốt 1×1). Ngoài ra HTML có sẵn thẻ `<img>` beacon nên **đo được cả khi tắt
JavaScript**.

### Chống spam ở server

1. Sự kiện không có trong bảng `NHAN` → chỉ ghi log, không gửi Telegram.
2. Cùng `ev|detail` trong **8 giây** chỉ gửi một lần.
3. Trần **25 tin/phút** mỗi instance.

Đã mô phỏng: 200 lần gọi cùng một sự kiện → gửi 1; 200 sự kiện khác nhau → gửi 24.

### Bật thông báo

Vercel → Settings → Environment Variables:

- `NOTIFY_KIND` = `telegram` · `TG_TOKEN` · `TG_CHAT`
- hoặc `NOTIFY_KIND` = `discord` · `NOTIFY_URL`

Rồi **redeploy** — biến môi trường chỉ ăn từ lần deploy sau.

### Trình chặn quảng cáo chặn được tới đâu

Hai script `/_vercel/insights/` và `/_vercel/speed-insights/` gần như chắc chắn bị chặn.
`/api/ping` là **first-party**, đường dẫn không chứa từ khoá tracker, cộng ba tầng dự
phòng nên rất khó chặn. Bản thân việc tải trang luôn để lại dấu ở mục **Observability**
của Vercel.

---

## 14. File hồ sơ `DAD-950901-A`

File này **giữ nguyên bản gốc từng byte**. Mọi thứ thêm vào nằm trong **một khối duy nhất**
ngay trước thẻ Vercel Analytics, mở đầu bằng:

```html
<!-- ↓ Bổ sung: đo đạc + luật điều hướng. KHÔNG đổi giao diện gốc. -->
```

Xoá khối đó là file trở về đúng bản gốc. Khối này làm ba việc:

1. **Đo đạc** — `TRACK` với hai chế độ `endpoint`/`telegram`, ba tầng dự phòng. Sự kiện:
   `ho_so_mo` · `trang_ho_so` (số trang + tiêu đề) · `gui_form` · `ho_so_dong` (số trang đã
   xem + số giây ở lại).
2. **Luật nút "Lùi" ở trang đầu** — trang bìa đổi nhãn thành **Bản đồ** kèm biểu tượng bản
   đồ có ổ khoá. Bấm vào thì **không ra bản đồ** mà bị đẩy tới trang **Phần I · Khai báo
   liên lạc** (hằng `PHAN1`). Chặn bằng listener pha capture trên `document` nên chạy trước
   `onclick` gốc; hàm `go()` gốc không bị sửa, chỉ được bọc thêm.
3. **Chrome trên đỉnh** — `.content` chừa 58px cho tem phân loại; nút Bản đồ chỉ hiện ở
   trang đầu (`body[data-pg="0"]`).

### Deploy tách riêng

Đầu khối tracking có:

```js
var TRACK = { mode:'endpoint', endpoint:'/api/ping', tgToken:'', tgChat:'' };
```

Cùng dự án thì để `'/api/ping'`. Tách domain thì điền URL tuyệt đối của endpoint bên kia.
Chế độ `telegram` không cần server nhưng **token lộ trong mã nguồn** — chỉ dùng bot rác.

---

## 15. Design system

### Một dòng hồ sơ có ĐÚNG HAI trạng thái

Luật chung cho mọi node, kể cả node mở sau này — đừng bịa kiểu dòng meta thứ ba,
cả bản đồ phải đọc giống nhau:

| Trạng thái | Dòng trên | Dòng dưới (`.file-meta`) |
|---|---|---|
| **Chưa mở** | 🔒 + tên hồ sơ | **điều kiện mở** — đếm ngược · *"Cần mã từ HAN-961030-A"* · *"Đã mở khoá · chưa có điểm kích hoạt"* |
| **Đã mở** | bỏ ổ khoá + tên lúc mở (`openTitle` nếu có) | **lý lịch file** — `Published date: DD-Mon YYYY | Vn` |

Khai trong `NODES` là xong, hàm `metaMo(s)` lo phần còn lại:

```js
{ id:'DAD-950901-B', title:'Hồ sơ niêm phong', openTitle:'Easter Egg · Gate 2',
  pub:'01-Sep 2026', ver:'V1', unlockAt: BIRTHDAY, eggGate:true }
```

Ngoại lệ **duy nhất**: mở được **trước** ngày phát hành thì nối thêm `· Mở sớm`
vào cuối — giữ nguyên khuôn, chỉ thêm một mẩu. Không có `pub` thì `metaMo` trả về
`s.meta` như cũ, nên hồ sơ cũ không phải sửa gì.

```css
--void:#040b18;  --navy:#0B1B3A;  --airforce:#1E4E79;  --steel:#4A73A0;
--neon:#38BDF8;  --amber:#F2B441;  --paper:#EAF0F7;  --line:rgba(234,240,247,.28);
--brass:#C9A24B;
```

| Vai trò | Màu |
|---|---|
| Nền sâu / biển | `--void` `--navy` |
| Đất liền phát sáng | `--neon` viền + gradient `#2E86C8 → #123F6B` |
| Đường bay | `--steel`, nét đứt `5 7` |
| Toạ độ đã bắt sóng | `--amber` |
| Toạ độ chưa bắt sóng | `--steel` + ổ khoá |
| Chữ | `--paper` |

**Chữ:** `Oswald` (400–700) cho tiêu đề, mã hiệu, nhãn HUD — luôn viết hoa, giãn rộng.
`Be Vietnam Pro` (400–600) cho văn bản. Kaomoji và emoji phải dùng `Be Vietnam Pro` hoặc
`Noto Sans` — Oswald thiếu glyph sẽ vỡ.

**Khung:** `max-width:460px`, `max-height:940px`, `height:92vh`, bo góc 26px từ breakpoint
480px — giống hệt file hồ sơ, kể cả nền ngoài `#app`.

**Quy ước khung phụ:** mọi hộp lấy thẻ "Phi vụ tiếp theo" làm chuẩn — viền mảnh
`var(--line)`, gờ amber 2px bên trái, bo góc 5px, nền tối mờ. **Nhãn nhỏ trên đầu mọi hộp
thoại dùng tông amber**; tiêu đề và nội dung giữ tông sáng hoặc xanh. Amber chỉ dùng thêm
cho những gì mang nghĩa phần thưởng: ô chữ đã giải, tên lửa, huy chương. Riêng khối chúc
mừng dùng **viền vàng nhạt bao quanh toàn bộ hộp, nhấp nháy nhẹ**.

**Trạng thái điểm sáng:** ổ khoá và màu sắc **chỉ nói về mã morse**, không nói về hồ sơ.
`DAD` giữ icon máy bay và quầng sáng thở nhẹ khi chưa bắt sóng — đó là mũi tên chỉ đường
duy nhất trên bản đồ, tắt ngay khi hết cần.

---

## 16. Đưa lên GitHub và Vercel

```bash
cd đường/dẫn/tới/thư-mục-này
git init
git add .
git commit -m "Bản đồ tác chiến"
git branch -M main
git remote add origin https://github.com/<tài-khoản>/<tên-repo>.git
git push -u origin main
```

Vercel → **Add New… → Project** → Import repo → Framework **Other**, Build Command và
Output Directory **để trống** → Deploy. Từ đó mỗi lần `git push` lên `main` là tự deploy.

### Kiểm tra sau deploy

- [ ] `/` hiện bản đồ, bốn điểm sáng lên theo thứ tự Bắc → Nam
- [ ] Đồng hồ đếm ngược chạy đúng số ngày còn lại
- [ ] Gõ đúp một điểm sáng → ghim mã morse → bấm vào mã → mở hộp pí mật
- [ ] Giải đúng → hiệu ứng ăn mừng + khối chúc mừng viền vàng nhấp nháy
- [ ] `SGN` không phản ứng gì khi ba toạ độ kia chưa xong
- [ ] Bấm `DAD-950901-A` → hỏi PASS → gõ `mig21` → mở hồ sơ
- [ ] Trong hồ sơ, nút `← Bản đồ` chỉ có ở trang đầu và nhảy tới Phần I
- [ ] Bấm 5 cú vào dòng bản quyền → **Box Tổng tư lệnh**, bước 1 có hai ô MAP-01 / MAP-02
- [ ] Chọn MAP-02 khi chưa thắng → nút Reset mờ, chú thích chỉ sang Hack Map
- [ ] Hack Map · MAP-02 → PIN `1959` → mở luôn màn Easter Egg, đóng tab mở lại vẫn còn
- [ ] Vào ô chiến dịch phải **5 nhịp liên tiếp**; 3 nhịp ô này + 2 nhịp ô kia thì không mở
- [ ] Reset cần bấm **hai nhịp**; `R(n)` vẫn còn sau khi xoá MAP-01
- [ ] Game On: thẻ Phi vụ biến mất, bản đồ nở ra, nút toạ độ vẫn đúng chỗ
- [ ] Game On: bấm tiêu đề không lật về chữ gốc; gõ đúp dòng dẫn không đổi băng rôn
- [ ] Game On: `950901-B` bỏ ổ khoá, bấm vào báo cần điểm kích hoạt; sau 10 nhịp Last updated thì vào thẳng
- [ ] Nút chơi lại trong hộp pí mật xoá sạch **y hệt** đường lá cờ (cùng `hardWipe`)
- [ ] Thắng đủ 4 → đóng/mở lại hộp pí mật vài lần trong 15 giây → hết giờ tiêu đề **đứng im**
- [ ] Mở `/?egg=1` sau khi đã thắng → tiêu đề `Easter Egg` nhấp nháy + băng rôn sinh nhật
- [ ] Gõ sai PIN hồ sơ: báo `Sai 1/3` → `2/3` → `3/3` → lần 4 khoá 60 phút; gợi ý đi lần lượt
- [ ] Thử trên điện thoại thật, cả màn hình nhỏ 360px

---

## 17. Lưu trữ tiến độ

Toàn bộ trạng thái nằm trong `localStorage` khoá `mtv1` — **không có hạn tự hết**, tắt máy
mở lại vẫn còn. Ba trường hợp mất: chế độ ẩn danh, người dùng tự xoá dữ liệu trang, và
**Safari/iOS** dọn storage của website không được ghé lại trong ~7 ngày. Tiến độ gắn với
**từng máy + từng trình duyệt**.

**Khoá thứ hai: `nav1`** — pha điều hướng (`mapUnlocked`) và **pí danh** (tối đa 2 hồ sơ,
mỗi hồ sơ một bản lưu). Sống sót qua cả `hardWipe` lẫn reset Mission. Luật đầy đủ ở
`USER-FLOW.md`.

Các trường đang lưu: `solved` · `unlocked` · `channel` · `pzOn` · `morseSeen` · `wrongCount`
· `resetCount` · `missionShown` · `visits` · `season` · `eggDone` · `winParty` · `eggDay` ·
`credFound` · `coachDone` · `pinFiles` · `pinLockUntil` · `pinFail` · `pinFailDay` ·
`pinHintIdx` · `eggTitleDay` · `eggHack` · `firstAt` · `clueAt` · `winAt`.

---

## 18. Ghi chú kỹ thuật

- **Đường bờ biển** lấy từ Natural Earth 1:50m, đơn giản hoá bằng Ramer–Douglas–Peucker,
  nhúng thẳng vào SVG (~5 KB). Không gọi API bản đồ nào, chạy được cả khi offline.
- **Không có build step.** Sửa file, push, xong.
- **Xoá CSS phải cắt theo đúng tên selector**, không cắt theo khoảng giữa hai mốc — các
  quy tắc khác rất hay nằm chen vào giữa. Đây từng làm mất `.flagzone` và `.vf`.
- **Không dùng `globalCompositeOperation = 'destination-out'`** trên canvas hiệu ứng: nó
  xoá mọi pixel phía dưới chứ không riêng hình đang vẽ. Trăng khuyết vẽ bằng hai cung nối
  nhau.
- **Icon SVG phải nhúng thẳng markup**, không dùng `<use href="#symbol">` nếu cần tô màu
  bằng CSS class — nội dung trong `<use>` nằm trong shadow DOM nên class bên ngoài không
  với tới.
- Mỗi lần build chạy bảng **kiểm kê tính năng** (lá cờ, Reset Mission, cửa hậu, huy chương,
  tên lửa, mạng lưới, hộp pí mật, bốn hiệu ứng, lịch năm, túi xáo, đo đạc, đếm ngược, tem)
  để không cắt nhầm thứ không được yêu cầu đổi.


---

## 19. Trạng thái chiến thắng

### Lần đầu quay ra bản đồ — ăn mừng đủ bộ

Mạng lưới 50 tỉnh bừng lên 15 giây · đất liền nhấp nháy · bốn tên lửa reo · tiêu đề tự đổi
qua lại · băng rôn máy bay bay ra 22 giây · tem phiên bản đổi màu trứng phục sinh.

### Từ lần thứ hai trở đi — chỉ mạng lưới

Cờ `winParty` lưu cùng tiến độ. Đã ăn mừng một lần rồi thì mọi lần quay ra sau (từ hộp pí
mật hay từ bảng hồ sơ) **chỉ còn mạng lưới nhấp nháy**, không đổi tiêu đề, không bay băng
rôn, không reo tên lửa, không đổi màu tem. Bấm chơi lại thì `winParty` về `false` và vòng
ăn mừng được mở lại.

### Tiêu đề

Đổi qua lại giữa **Bản đồ tác chiến** và **Mission Completed**. Trong 15 giây ăn mừng thì
tự đổi mỗi 2,4 giây; **hết 15 giây là dừng hẳn ở "Mission Completed" và đứng im**. Muốn đổi
nữa thì **bấm tay vào tiêu đề**.

**"Mission Completed" là GIAO DIỆN CHỐT của MAP-01.** Đã giải đủ 4/4 thì **mọi lần mở trang
về sau đều mặc định hiện "Mission Completed"**, không quay lại chữ gốc nữa — đó là màn hình
cuối của MAP-01 và là thứ người xem thấy cho tới khi MAP-02 mở ra (lúc đó chỗ này đọc là
"Easter Egg"). Quy tắc nằm ở đúng một dòng trong khối khởi động:
`if(nSolved() === NODES.length) titleMC = true;`. Bấm vào tiêu đề vẫn lật về chữ gốc được,
nhưng **mặc định không còn là chữ gốc**. Lúc hiện "Mission Completed" chữ chuyển sang **đỏ chiến
thắng `#FF6B4A`** kèm quầng sáng.

**Bẫy đã vấp: chữ nhấp nháy không ngừng.** `gridFlash()` cũ nhét phần dọn dẹp màn ăn mừng
chung một hẹn giờ với mạng lưới (`gridT`). Đóng rồi mở lại hộp pí mật trong 15 giây đó sẽ
gọi `gridFlash()` lần nữa với `full = false`; `clearTimeout(gridT)` **giết luôn hẹn giờ dọn
dẹp**, nên `titleT` và class `.cheer` không ai gỡ → tiêu đề đổi qua lại vĩnh viễn. Nay phần
ăn mừng có hẹn giờ **riêng** là `partyT`, gọi `endParty()`; `endParty()` gỡ `win`/`cheer`,
đặt `titleMC = true` rồi `titleSwap(false)`. Ngoài ra `titleSwap(false)` **bỏ qua** khi
`.cheer` còn trên khung, để không cắt ngang nhịp tự đổi.

### Dòng dẫn và băng rôn

Khi đã thắng, dòng dẫn là chữ tĩnh **Map: Bản đồ Tác chiến**. **Gõ đúp** vào nó thì máy bay
kéo băng rôn bay ra thế chỗ **26 giây** rồi trả lại chữ tĩnh.

Băng rôn chạy **phải → trái** trong **19 giây mỗi vòng**: máy bay lật mũi sang trái
(`scaleX(-1)`) nên **mũi đi trước**, dây và tấm vải kéo lê phía sau đuôi. Hai mép mờ dần
bằng `mask-image`. Nội dung:

```
Winner: Dongchi Bình ·
Mức độ hoàn thành: ⭐⭐⭐⭐⭐ ·
Thời gian hoàn thành: X Ngày Y Giờ Z Phút ·
Tìm thấy clue đầu tiên sau: X Ngày Y Giờ Z Phút ·
Easter Egg: Y/N
```

| Đoán sai | Sao |
|---|---|
| dưới 5 | ⭐⭐⭐⭐⭐ |
| 5–9 | ⭐⭐⭐⭐☆ |
| từ 10 | ⭐⭐⭐☆☆ |

**Năm ô sao luôn đủ chỗ.** Phần chưa đạt vẽ bằng `☆` bọc trong `<span class="star-off">`
(`opacity:.34`) — nhìn thấy viền nhưng mờ hẳn, thay vì biến mất như bản cũ. Hàm dựng là
`saoHtml()`; vì có thẻ nên `#bannerText` dùng `innerHTML`, không dùng `textContent`.

Ba mốc thời gian lưu cùng tiến độ: `firstAt` (lần đầu mở trang) · `clueAt` (lần đầu bắt
được mã morse) · `winAt` (lúc giải xong mật thư thứ tư). `Easter Egg` là `Y` nếu đã mở được
khung giới thiệu người dựng trang.

Trạng thái này bám theo `nSolved()` nên bấm chơi lại là tự trả về tiêu đề và dòng dẫn gốc.
`armIdle()` tự dừng khi đã thắng để không ghi đè dòng chữ.

---

## 19b. Cửa sổ EASTER EGG — từ 00:00 ngày 01-09, KHÔNG có hạn trên

Khi đồng hồ đếm ngược về 0, trang bước vào **cửa sổ Easter Egg** và **ở lại tới hết mùa**.

> **BẪY ĐÃ VẤP — món quà tự khoá lại trước mặt người nhận.** Bản trước đóng cửa sổ sau
> `EGG_DAYS = 7` ngày. Ai ghé muộn — mà quà sinh nhật thì người ta hay ghé muộn — chơi
> xong MAP-01 là hết: không băng rôn, không Easter Egg, không Map 3. Nay **01-09 chỉ là
> mốc MỞ, không phải mốc đóng**.

### Ghé TRƯỚC hay SAU 01-09 — hai cò khác nhau

| Ghé lúc nào | Đường đi |
|---|---|
| **Trước 01-09** | Đồng hồ đếm ngược chạy như thường → phá đảo MAP-01 vẫn được màn ăn mừng + băng rôn đầy đủ → tới 00:00 ngày 01-09 thì Game On tự bật. **Ngày là cò.** |
| **Sau 01-09** | Không còn gì để đếm ngược. Phá đảo MAP-01 → màn ăn mừng Mission Completed → hết 15 giây thì báo **`Unlock Easter Egg · Gate 1`** kèm **đếm ngược 10 giây** → vào thẳng màn chúc mừng sinh nhật. **Việc phá đảo là cò.** |

Hàm `moGate1()` lo nhánh thứ hai, chạy đúng một lần (cờ `eggG1`), và tự thoát nếu mốc
sinh nhật chưa qua — để không giẫm lên nhánh thứ nhất.

Tương tự ở **Gate 2** (`/dad/950901-b`): ghé sau mốc thì thay đồng hồ dài bằng **10 giây**
"cửa đang mở cho anh…" ở **lần đầu**, xong mới hiện màn cuối; những lần sau vào thẳng
(cờ `mtv1.g2Vao`). Cổng vào là `eggOpen()`, mốc sinh ra từ `SEASON.birthday` + `SEA.year` — **không
hardcode năm**, đúng luật mục 8.

Có **hai đường mở sớm**, dùng để thử hoặc để trình diễn:

| Đường | Cách | Sống được bao lâu |
|---|---|---|
| `?egg=1` | thêm vào URL | chỉ trong lần tải trang đó (hằng `EGG_FORCE`) |
| **Hack Map · MAP-02** | Box Tổng tư lệnh → ô `MAP-02` → Hack Map → PIN `1959` | **vĩnh viễn**, cờ `eggHack` lưu trong `mtv1`, chỉ mất khi Reset MAP-01 |
| **⏩ Vào thẳng màn cuối Gate 2** | Box Tổng tư lệnh → ô `MAP-02` → nút này, **không cần PIN** | Bật một lượt `eggHack` + `credFound` + `eggWin` + **`g2Hack`** rồi đi thẳng `/dad/950901-b`. `g2Hack` là cờ **bỏ qua mốc 01-09 của Gate 2**: trang đó thấy cờ là hiện luôn màn cuối (Phá Đảo · mã `HO CHI MINH` · đường vào game bên trong), khỏi đợi tới ngày. Reset MAP-02 xoá cờ, Gate 2 quay lại đếm ngược |

Cửa sổ chỉ có hiệu lực khi **đã giải đủ 4/4** — nó thay chỗ của trạng thái chiến thắng.

| Thứ | Ngoài cửa sổ | Trong cửa sổ |
|---|---|---|
| Tiêu đề (nửa kia) | `Mission Completed`, đỏ `#FF6B4A` | `Easter Egg` ⇄ `Game On`, amber `#F2B441` — **cả hai nửa** cùng tông, cùng nhịp nhấp nháy (hằng `TITLE_GAMEON`) |
| Dòng dẫn tĩnh | `Map: Bản đồ Tác chiến` | `Game On · Độ khó: Q♥` (Q♥ đỏ) |
| Băng rôn máy bay | `Winner: … · Mức độ hoàn thành: ⭐… · Easter Egg: Y/N` | Lời chúc sinh nhật |

Nội dung băng rôn sinh nhật nằm ở hằng `BANNER_EGG`:

> Chúc mừng sinh nhật Dongchi Bình tuổi 32 🎉 · Chúc anh mọi điều như ý, vạn sự bình an,
> cần - kiệm - liêm - chính như Bác Hồ dạy 😘🎊🎆

Câu dài và có emoji nên tấm vải đổi sang class `.eggtext`: font `Be Vietnam Pro`, bỏ viết
hoa — Oswald thiếu glyph emoji sẽ vỡ chữ.

### Màn chào mỗi đầu ngày

`eggIntro()` chạy **một lần mỗi ngày**, suốt 7 ngày. Mốc ngày ghi ở `eggTitleDay`. Nó:

1. đặt tiêu đề về `Easter Egg`;
2. gắn class `.eggblink` — **đổi màu tuần tự 7,3 giây, dùng chung `@keyframes egg` với tem
   Last updated**, đúng thời lượng của màn ăn mừng;
3. cho băng rôn sinh nhật bay ra 22 giây.

### Ngày tính theo GIỜ MÁY, không phải UTC

`toISOString().slice(0,10)` cắt theo UTC nên ở Việt Nam "ngày mới" rơi vào **07:00 sáng**.
Mọi mốc *"mỗi ngày một lần"* — `eggDay` (tem), `eggTitleDay` (Easter Egg), `pinFailDay`
(bộ đếm PIN) — nay đi qua hàm `ngay()` dựng chuỗi `YYYY-MM-DD` từ giờ máy.

---

### Bộ đếm "mở được Easter Egg mấy lần" và nút Reset MAP-02

Box Tổng tư lệnh → **MAP-02** có thêm một dòng: **`Mở được Easter Egg: n lần`**
(`mtv1.eggMo`, `n = 0` là chưa lần nào). Bộ đếm cộng thêm 1 mỗi lần `credFound`
bật từ chưa sang rồi — đi đường cửa hậu 10 nhịp hay đường nút *Enter Easter Egg*
đều tính.

**Reset MAP-02 nay trả Easter Egg về đúng lúc chưa ai tìm ra**: xoá
`credFound` · `eggWin` · `eggDone` · `eggDay` · `eggTitleDay` · `coachDone`.
Có vậy tem mới nháy lại được, chuỗi nhắc bài mới chạy lại, và cửa hậu 10 nhịp
mới còn gì để mở. Bản trước chỉ tua băng rôn nên bấm Reset xong **vẫn không
xem lại được hiệu ứng nào** — đó là lý do có mục này.

| Reset MAP-02 làm gì | Kết quả |
|---|---|
| Giữ | tiến độ MAP-01 (4/4), bộ đếm `eggMo`, bộ đếm `R(n)`, toàn bộ `hanv1` của Map 3 |
| Xoá | `credFound`, `eggWin`, `eggDone`, `eggDay`, `eggTitleDay`, `coachDone` |
| Hệ quả | hồ sơ `DAD-950901-B` **và Map 3 khoá lại** cho tới khi tìm ra Easter Egg lần nữa — câu này ghi thẳng ở `hqNote` để không ai bấm nhầm |

Xoá xong là vẽ lại bản đồ ngay (`refreshBeacons` + `paint`), vì máy bay chỉ
đường phải quay về `DAD` và node HAN phải đóng lại — đợi tới lần tải sau thì
người chơi thấy một bản đồ nói dối.

### MAP-02 có HAI CHẶNG — đừng gọi lẫn

**Tìm ra Easter Egg mới chỉ là xong Stage 1**, chưa phải xong Map 2. Ghi rõ ở đây một lần
cho khỏi nhầm về sau:

| Chặng | Việc người chơi làm | Cờ ghi lại | Xong thì được gì |
|---|---|---|---|
| **Stage 1** | Tìm ra cửa hậu — gõ 10 nhịp lên tem *Last updated*, mở được khung **Collected: Easter Egg** | `credFound` | Hồ sơ `DAD-950901-B` **bỏ ổ khoá**, hiện *"điểm kích hoạt"*. Đây chính là **điều kiện vào Stage 2** |
| **Stage 2** | Đi qua cửa đó — được **điều hướng về `/dad/950901-b`** (thẳng từ khung Collected, từ hồ sơ trên bản đồ, hay từ nút *Vào Easter Egg* của trang pháo hoa) | `eggWin` | **Phá đảo Map 2**. Mở luôn **Map 3** — node HAN hiện hai hồ sơ `961030` |

Nói gọn: `credFound` = **thấy cửa**, `eggWin` = **qua cửa**. Ba đường vào Stage 2 đều
**bắt buộc** ghi `eggWin` (mục 21b có bẫy đã vấp đúng chỗ này) — thêm đường vào mới thì
nhớ ghi cờ ở cả ba.

---

## 19c. GAME ON — trạng thái khi MAP-02 đang chạy

`gameOn()` = **đã hoàn thành MAP-01** và **`eggOpen()`**. Gọi qua hàm này, đừng viết lại hai
vế ở chỗ khác. Khung nhận class `gameon`, và bốn thứ đổi cùng lúc:

| Thứ | Ngoài Game On | Trong Game On |
|---|---|---|
| Tiêu đề | `Mission Completed` ⇄ bấm để lật về chữ gốc | `Easter Egg` ⇄ `Game On` — **khoá cứng**, bấm vào không lật về chữ gốc nữa |
| Dòng dẫn | `Map: Bản đồ Tác chiến` | `Game On · Độ khó: Q♥` — quân **Q♥ màu đỏ** `#FF5252` |
| Băng rôn | Winner + sao + thời gian | Lời chúc sinh nhật — **chỉ một kiểu**, không đảo qua lại |
| Thẻ *Phi vụ tiếp theo* | Hiện | **Đóng hẳn** (`.frame.gameon .cd{display:none}`) |

**Dòng dẫn có thẻ HTML** nên `LEAD_EGG` phải gán bằng `innerHTML`, không `textContent` —
nếu không sẽ hiện ra chữ `<b class="qco">`.

**Gõ đúp dòng dẫn** trong Game On chỉ cho máy bay bay lại, **không** đổi nội dung băng rôn.
Cờ `eggBanner` của bản trước đã bỏ hẳn.

### Bản đồ nở ra khi đóng thẻ Phi vụ

Header thấp xuống thì `.mapwrap` (`flex:1`) tự chiếm chỗ trống. Nhưng **nút toạ độ đặt bằng
`cam.getScreenCTM()`**, không theo dòng chảy layout — nên `winBanner()` gọi lại `place()`
sau **hai khung hình** mỗi khi class `gameon` thực sự đổi. Chỉ chạy khi trạng thái đổi, không
gọi mỗi lần vẽ lại.

### Lần ĐẦU tìm ra: khung KHOÁ 3 giây rồi TỰ sang pháo hoa

Mở được khung Collected lần đầu thì khung **bị khoá** (`credKhoa` + class `.locked`)
trong 3 giây: **nền mờ, dấu ×, phím Esc đều không ăn**. Hết 3 giây là tự bay sang
`/phao-hoa` — người chơi **không phải bấm gì**. Từ lần thứ hai trở đi khung mở/đóng
bình thường.

> **BẪY ĐÃ VẤP HAI LẦN, cùng một hậu quả — mất khoảnh khắc "mở ra được rồi!":**
> 1. Bản đầu bay sang pháo hoa sau **140 ms**: khung vừa nhảy lên đã tắt, người chơi
>    chỉ thấy màn hình đổi trang.
> 2. Bản sau cho khung đứng 3 giây **nhưng vẫn đóng được**. Mà gõ 10 nhịp nghĩa là tay
>    đang đập liên tục — nhịp thứ 11 rơi trúng nền mờ hoặc dấu × là khung tắt, hẹn giờ
>    huỷ theo, thế là **không bao giờ tới được pháo hoa**. Đúng thiết kế mà sai thực tế.
>
> Bài học: một hẹn giờ tự động thì **đường huỷ nó phải khoá lại**, không thì cú bấm
> thừa của chính người chơi sẽ huỷ mất phần thưởng của họ.

> **BẪY ĐÃ VẤP LẦN BA — "mở được rồi mà chẳng thấy pháo hoa đâu".** Màn ăn mừng trước đây
> chỉ chạy khi `eggParty` còn tắt, tức **đúng một lần trong đời bản lưu**. Ai lỡ mở khung
> một lần ở phiên trước — kể cả khi chưa kịp xem gì — là cờ đã bật, từ đó về sau gõ đủ 10
> nhịp cũng chỉ thấy cái khung đứng im.
> Nay đếm riêng bằng **`eggAn`** (`EGG_AN_TU = 2`):
>
> | Lần mở khung | Chuyện gì xảy ra |
> |---|---|
> | 1 | khoá khung 3 giây → **tự** sang pháo hoa |
> | 2 | y như lần 1 — **lượt dự phòng** cho ai lỡ tay bấm ra, mạng chậm, hoặc tắt máy giữa chừng |
> | 3 trở đi | khung mở bình thường, muốn xem lại thì **bấm nút cuộn phim** trong khung |
>
> `eggParty` từ đây chỉ còn một việc — quyết định có hiện nút *xem lại* hay không.
> Reset MAP-02 xoá `eggAn`, trả lại đủ hai lượt tự ăn mừng.
> Đường quay về từ pháo hoa (`?cred=1`) không đi qua `openCredFx()` nên không có vòng lặp.
>
> **Trong 3 giây khoá, tem NGƯNG nhận nhịp** (`if(credKhoa) return`). Nền mờ che hết màn
> hình rồi, nhưng cú chạm trên điện thoại vẫn có thể lọt xuống dưới — mà mỗi lần lọt là
> ăn mất một lượt tự ăn mừng, mà chỉ có hai.

### Cửa hai tầng của hồ sơ `DAD-950901-B`

Hồ sơ này gắn cờ `eggGate:true` trong `NODES` — nó thuộc về MAP-02, không phải MAP-01.

| Tình huống | Hiện ra sao | Bấm vào |
|---|---|---|
| Chưa Game On | Ổ khoá + đếm ngược tới 01-09 | Không phản hồi |
| Game On, **chưa** có điểm kích hoạt | **Bỏ ổ khoá**, meta ghi *"Đã mở khoá · chưa có điểm kích hoạt"* | Báo *"cần tìm điểm kích hoạt để hạ cánh"* |
| Game On, **đã** có điểm kích hoạt | Link thật | Bay thẳng vào `/dad/950901-b` |

**Qua cửa rồi thì hồ sơ ĐỔI TÊN** thành **`Easter Egg · Gate 2`** (`openTitle`
trong `NODES`, chỉ dùng khi `eggWin`) — cả trang `/dad/950901-b` cũng đổi tiêu
đề theo. Tên "Hồ sơ niêm phong" chỉ còn đúng lúc nó **đang** niêm phong.

**Mở SỚM trước 01-09.** Cửa hậu 10 nhịp không hề khoá theo ngày, nên người chơi
có thể tìm ra Easter Egg trước sinh nhật, rồi bấm *Enter Easter Egg* (bật
`eggHack`) để vào Gate 2 sớm. Cửa mở thật, nhưng **bên trong chưa có gì** — phải
nói thẳng ở cả hai chỗ:
- dòng meta của hồ sơ trên bản đồ: `Published date: 01-Sep 2026 | V1 · Mở sớm`
  (đúng khuôn lý lịch file của mục 15, chỉ nối thêm một mẩu);
- trong trang `/dad/950901-b`: một dòng hẹn + đồng hồ đếm ngược, **không phát mã**
  (xem mục 21h). Đoạn giải thích dài dòng dưới đây đã bỏ: *"Anh mở được cửa này sớm hơn lịch — Gate 2
  đã thông, nhưng bên trong thì chưa có gì để xem đâu. Nội dung lên sóng 00:00
  ngày 01-09."*

Ngày trong câu đó cắt thẳng từ chuỗi ISO `+07:00`, không qua `getDate()` — đúng
cái bẫy múi giờ của mục 21c.

**Điểm kích hoạt chính là cửa hậu `credFound`** — bấm 10 nhịp vào dòng Last updated. Ai lỡ
tìm ra từ trước thì vào thẳng, không phải làm lại. Mở được cửa hậu lúc bảng hồ sơ đang mở
thì `render(current)` chạy lại ngay, hồ sơ chuyển sang bấm được mà không cần đóng mở.

**Thứ tự nhánh trong `render()` rất quan trọng:** nhánh `eggGate` đặt **trước** `isOpen()`.
Đặt sau thì từ 01-09 trở đi `unlockAt` tự hết hạn, hồ sơ thành link và cửa kích hoạt bị bỏ
qua hoàn toàn.

---

## 20. Bẫy đã vấp: temporal dead zone

Lỗi `Cannot access 'pinLockUntil' before initialization` làm **trắng cả trang** vì khối
`boot()` gán giá trị cho một biến `let` được khai báo **phía dưới** nó. Với `let`/`const`,
biến tồn tại nhưng chưa dùng được cho tới đúng dòng khai báo.

**Quy tắc:** mọi biến trạng thái mà `boot()` đụng tới phải khai báo trong khối `let` ở đầu
script, trước `boot()`. Build hiện chạy một bước quét tự động tìm biến bị gán trong thân
`boot()` mà khai báo nằm sau — kết quả hiện tại: không có.


---

## 21. Bẫy đã vấp: vòng tiêu điểm còn dính

Vòng viền amber của `:focus-visible` **dính lại trên nút toạ độ** sau khi quay ra từ bảng
hồ sơ — nhìn như một khung lỗi lơ lửng giữa bản đồ.

Nguyên nhân **không nằm ở hộp PIN** như chẩn đoán ban đầu. Thủ phạm là `close()`: nó luôn
trả tiêu điểm về nút toạ độ để phục vụ điều hướng bàn phím. Nếu trước đó người xem có gõ
phím lần nào (kể cả `Enter` trong ô mã), trình duyệt vẫn coi phiên đó là "điều hướng bàn
phím" và vẽ vòng viền — dù thao tác đóng bảng là bấm chuột.

**Cách sửa:** theo dõi cờ `kbdNav` — bật khi có `Tab` / `Enter` / `Space` / phím mũi tên,
tắt khi có `pointerdown`. `close()` chỉ trả tiêu điểm **khi `kbdNav` đang bật**; ngoài ra
thì bỏ qua. `closePin()` còn chủ động `blur()` và đặt lại `kbdNav = false`, vì gõ `Enter`
trong ô mã không có nghĩa là người xem đang điều hướng bằng bàn phím.

Ba luồng đã kiểm:

| Luồng | Kết quả |
|---|---|
| Chuột: bấm toạ độ → đóng bảng hồ sơ | Không viền |
| Chuột: mở hồ sơ → `Enter` sai mã → đóng | Không viền |
| Bàn phím: `Tab` tới toạ độ → `Enter` → `Esc` | Có viền — đúng, cần cho khả năng tiếp cận |

Quy tắc chung: **chỉ trả tiêu điểm khi người xem thật sự đang dùng bàn phím.** Trả vô điều
kiện là nguồn gốc của mọi vòng viền lơ lửng.

---

## 21b. `/phao-hoa` — màn pháo hoa có trang riêng

Trước đây pháo hoa là một overlay đè lên khung Collected, chặn thao tác 15 giây. Nay nó
là **một trang riêng** để vừa xem thoải mái vừa có chỗ đặt nút.

| | |
|---|---|
| Nền | **Đúng bản đồ tác chiến nhưng tắt hết đèn** — chỉ còn bóng đất liền mờ, không toạ độ, không đường bay, không chữ. Có vậy ánh pháo hoa mới nổi |
| Chữ | Nằm **trên cao, ngay vùng pháo nổ**: `Collected: Easter Egg` (nhấp nháy) rồi `Player · Dongchi Bình ◆ Unlock Gate 1` **chung một dòng** |
| Nút | Chân trang, tách khỏi khối chữ |
| Ra về | Nút ✕, gõ đúp vào khoảng trống, hoặc Esc → về `/?stay=1&cred=1` |

**Nhịp xem:** không đụng gì thì bắn **30 giây** (`AUTO_MS`) rồi tự nghỉ — đủ xem, không
lê thê. Xong thì đóng, hoặc bấm **Bắn lại** cho lượt nữa. Bắn theo **đợt** 1–3 quả rồi
nghỉ lấy nhịp; đều đặn từng quả một nhìn như máy.

**Hai nút:** *Bắn lại* · *Vào Easter Egg* → đi thẳng `/dad/950901-b`.

Chạm màn hình vẫn bắn thêm một quả cho vui tay. Gõ đúp để thoát và chạm để bắn đi chung
một trình nghe: cú thứ hai trong 320 ms là thoát, ngoài ra là bắn. Bấm lên nút thì bỏ qua.

**Màn trứng nứt** nằm ngay **đầu trang này**, không phải ở khung Collected — nứt trứng
rồi nổ pháo là một mạch liền, tách ra hai trang thì đứt đoạn. Máy nào bật "giảm chuyển
động" thì bỏ qua, vào thẳng.

### Quả trứng — vẽ tay trên canvas, không dùng ảnh

Bản đầu ghép bằng thẻ HTML + CSS (vỏ vàng kim, mạch điện neon) đã **bỏ hẳn**: nó ra hình
quả bóng chứ không ra quả trứng, và vỡ ra thì rời rạc với màn pháo hoa ngay sau đó. Nay
trứng vẽ **chung một canvas với pháo hoa**, dựng theo ba gif mẫu (trứng raid có dải xoáy ·
lúc rạn vỏ · lúc nổ bung).

**Dáng trứng — bỏ bezier, dùng phương trình.** Ảnh trứng Phục sinh mẫu đo được
**rộng/cao = 0,79**. Bản dựng bằng hai cung bezier chỉ ra **0,66** — nhìn là thấy "hơi
dài", mà nhích tay điểm điều khiển thì không bao giờ khoá được tỉ lệ. Nay vẽ thẳng theo
phương trình, bằng chuỗi đoạn thẳng ngắn (96 điểm mỗi bên):

```js
nửa bề rộng(u) = a · (1 − u²)^p · (1 − c·u)     // u: −1 ở đáy → +1 ở đỉnh
var TRUNG_C = 0.22;    // bóp đỉnh, phình đáy → chỗ rộng nhất rơi xuống dưới tâm
var TRUNG_P = 0.44;    // số mũ: nhỏ hơn 0,5 thì HAI ĐẦU BÈ RA cho tròn
var RONG_CAO = 0.79;   // rộng/cao — đo từ ảnh mẫu
```

`a` **không đặt tay** mà tính ngược từ `RONG_CAO` (chia cho đỉnh của hàm, tính một lần lúc
tải trang) — nên đổi tỉ lệ là dáng đi theo, khỏi dò lại. Để `p = 0,5` (nửa e-líp) thì đáy
thon lại, ra quả lê chứ không ra trứng.

**Bảng màu: cùng họ XANH NEON với nền, nhưng sáng hơn nền.** Nền trang là xanh đêm
`#040b18`/`#0B1B3A`, nên vỏ đi cyan sáng `#BDEEFF → #63CDF3 → #2A93C8 → #12587F` — nổi hẳn
lên mà vẫn cùng một nhà với `--neon #38BDF8`.

Vỏ: cắt theo đường viền (`clip`) rồi tô gradient trên, đè **5 dải xoáy chéo** trắng-cyan,
một vệt sáng ở vai trái trên, và một **đường nứt zigzag** mỗi lúc một rộng.

**Lúc nứt và lúc nổ đi hai màu:** trong khe là **bạc xanh** (`#CEE8FF`) chuyển sang **ánh
vàng** (`#FFE7A6`), kèm **kim tuyến vàng lấp lánh** rắc dọc khe (14 chấm mỗi khung, vẽ chồng
sáng). Cú nổ giữ starburst 34 tia nhưng đổi sang lõi trắng · quầng bạc xanh · **xen tia
vàng**, cộng 26 chấm kim tuyến nhấp nháy trong vầng sáng. Hạt bay ra cũng đổi tông:
~38% màu vàng (`h≈44`), còn lại bạc xanh (`h≈196`).

**Ba nhịp**, tổng 3,3 giây: `lac` (lắc + bụi bay, 1500 ms) → `nut` (vỏ rạn + rung, 900 ms)
→ `no` (bung, 900 ms). Cú nổ là **starburst 34 tia dài ngắn xen kẽ**, trắng ngả tím —
đúng hình gif mẫu. Nổ xong `batDau()` mới thả pháo hoa.

> **Đo, đừng nhìn.** Hai lần trước đều "nhìn thấy ổn" trên mô tả mà thực tế ra quả bóng.
> Cách kiểm duy nhất đáng tin: chụp `canvas.toDataURL()` rồi **nhìn tấm ảnh**, và đếm số
> điểm sáng trong ô giữa khung bằng `getImageData`.

> **BẪY ĐÃ VẤP:** nút *Vào Easter Egg* ở trang này là **đường vào thứ ba** của Easter Egg
> (hai đường kia: nút trong khung Collected, và link hồ sơ trong khung toạ độ). Lúc đầu
> quên ghi `eggWin` ở đây — ai đi lối pháo hoa sẽ **không bao giờ mở được Map 3**. Thêm
> đường vào mới thì nhớ ghi cờ ở cả ba chỗ.

### Bộ pháo hoa dựng riêng — không xài lại hình của cảnh SGN

Ba lớp, đúng cách một quả pháo thật đi:

1. **Quả bay** — vọt lên từ mép dưới, chậm dần, rắc tàn lửa dọc đường. Tốc độ ban đầu
   tính ngược từ độ cao muốn tới nên quả nổ đúng tầm.
2. **Nở** — 96–128 tia toả đều, mỗi hạt **nhớ 6 vị trí gần nhất** rồi vẽ thành vệt nhạt
   dần; chính cái đuôi đó tạo ra dáng "chùm tua" như ảnh mẫu. Bốn kiểu: `chum` · `tua`
   (rủ xuống, nặng hơn) · `vong` (tròn đều) · `nhon`.
3. **Tàn** — hạt rơi theo trọng lực, một phần ba nhấp nháy rồi tắt.

Năm kiểu chùm, trong đó `sao` (quả sao lớn, tia dài mảnh, lõi trắng nóng) được rút hai
lần trong bảng nên hay gặp hơn — một loạt bắn xen kẽ mới đỡ đơn điệu.

Vẽ chồng sáng (`globalCompositeOperation = 'lighter'`) cho chỗ giao nhau bùng trắng.
Canvas vẫn **trong suốt** — không dùng mẹo phủ nền mờ để tạo vệt, vì làm thế là che mất
bóng bản đồ phía dưới.

Hai số quyết định dáng chùm: **lực cản** `can` (0.968–0.974 cho chùm vừa lòng khung
390 px — cản yếu hơn thì chùm bung rộng hơn cả màn, cụt hai bên) và **độ sáng** `sang`
(48 + 26·tuổi — đẩy cao hơn thì quả nào cũng hoá trắng, mất sạch bảng màu).

---

## 21c. Clockwise — vặn kim đồng hồ của bản đồ

Box Tổng tư lệnh → **MAP-01** → **Clockwise**: chọn một ngày rồi *Vặn kim*, trang tải lại
với đồng hồ đặt đúng **00:00 giờ VN ngày đó**. Dùng để xem lại (hoặc xem trước) màn chúc
mừng sinh nhật khi đã lỡ mốc 01-09. *Về hiện tại* trả kim.

Cách làm: cộng một khoảng lệch `mtv1.lech` vào **`Date.now()`** ngay dòng đầu khối script,
**trước** khi `season()` chạy — mọi cửa theo ngày trong trang (đếm ngược, cửa sổ Easter
Egg, mốc mở hồ sơ) tự đi theo, khỏi phải sửa từng chỗ. Không có lệch thì không đụng gì tới
`Date.now`.

> **BẪY:** `BIRTHDAY` là chuỗi ISO có múi `+07:00`. Lấy ngày gợi ý qua `getDate()` thì máy
> ở múi khác trả về **ngày hôm trước** — cắt thẳng `slice(0,10)` của chuỗi mới đúng.

Nút tự ghi ngày đang đứng (`Clockwise · đang ở 1-9`) để không ai kẹt trong quá khứ mà
không biết.

---

## 21d0. HAN có ĐÚNG HAI hồ sơ

| Hồ sơ | Là gì |
|---|---|
| `HAN-961030-A` | *Who's my kindred spirit?* — bộ câu hỏi |
| `HAN-961030-B` | *HongHan's Secret Chamber* |

> **BẪY ĐÃ VẤP:** từng có thêm `HAN-261030` cũng mang tên *"Hồ sơ niêm phong"*, mà
> `HAN-961030-B` lúc khoá **cũng** tên y hệt. Ba dòng, hai dòng trùng tên, người xem
> không biết cái nào ra cái nào. Hai luật rút ra:
> 1. **Một toạ độ chỉ chứa những hồ sơ THẬT SỰ dẫn đi đâu đó** — đừng để hồ sơ trang trí.
> 2. **Tên hồ sơ giữ nguyên ở cả hai trạng thái.** Khoá hay mở thì `HAN-961030-B` vẫn là
>    *HongHan's Secret Chamber*; chỉ **dòng meta bên dưới** đổi (điều kiện mở ⇄ lý lịch
>    file). Tên chung chung kiểu "Hồ sơ niêm phong" là trạng thái, không phải tên.
>
> Trang `/han/261030/` vẫn còn trên đĩa nhưng **không còn đường nào dẫn tới** — xoá được.

---

## 21d. Tab HAN trên bản đồ — ba trạng thái

| Tình huống | Tab HAN thấy gì |
|---|---|
| Chưa tìm ra Easter Egg | Y như cũ — hai hồ sơ 961030 **chưa tồn tại** (`credGate`) |
| Đã tìm ra, chưa xong bộ câu hỏi | `HAN-961030-A` mở vào được · `HAN-961030-B` còn niêm phong, ghi *Cần mã từ HAN-961030-A* |
| Đã xong bộ câu hỏi (`hanv1.done`) | B bấm vào được, dòng meta đổi sang lý lịch file (mục 15) |

Bản đồ **chỉ đọc** `hanv1`, không bao giờ ghi đè — hai hệ tiến độ ở hai khoá riêng.

> **BẪY ĐÃ VẤP:** hằng `HANBOX` (mốc 01-10) phải khai **trước** mảng `NODES` — `NODES` là
> `const` khởi tạo ngay, tham chiếu ngược là dính temporal dead zone y như mục 20.

---

## 21f. Cổng HAN — máy bay chỉ đường

Cả phần HAN-961030 nằm sau MỘT cái chốt: `mtv1.eggWin` — **đã vào được hồ sơ niêm
phong `DAD-950901-B`**, tức phá xong Easter Egg thật sự, chứ không phải chỉ tìm ra cửa
(`credFound`).

| Mốc | Bản đồ | `/han/961030-a` |
|---|---|---|
| Chưa `credFound` | Node HAN im như SGN/UIH | (chưa có đường vào) |
| `credFound`, chưa `eggWin` | Node HAN vẫn im | Vào từ khung Collected được, nhưng gặp **màn nhắn nhủ** "giải mã xong Easter Egg hẵng quay lại" |
| `eggWin` | Node HAN mở hai hồ sơ 961030 | Vào thẳng bộ câu hỏi |

**Máy bay là mũi tên chỉ đường.** Nó chỉ đậu ở MỘT toạ độ — nơi đang có việc để đi:
`DAD` trước khi phá Easter Egg, `HAN` sau đó. Người chơi nhìn là biết chặng tiếp theo
nằm đâu, không cần ai nhắc (`mayBayO()`).

**Đường lùi nhớ chỗ vừa rời.** `/han/961030-a` đọc `?from=`:
`egg` → về `/?stay=1&cred=1` (mở lại khung Collected) · `map` → về `/?stay=1&node=HAN`
(mở lại khung hồ sơ HAN) · không có gì → về bản đồ. Cờ `?node=` được dọn khỏi thanh địa
chỉ ngay sau khi mở.

---

## 21f-2. Cửa sổ Easter Egg — múi giờ và nhịp ăn mừng

Mốc **00:00 ngày 01-09 giờ Việt Nam** dựng bằng chuỗi ISO có múi `+07:00` (hàm `atVN`),
nên **máy đặt ở múi giờ nào cũng chốt đúng nửa đêm Việt Nam** — so sánh bằng mốc thời
gian tuyệt đối, không phụ thuộc đồng hồ máy.

Trong suốt cửa sổ 7 ngày kể từ mốc đó, **mỗi lần mở trang** là chạy lại màn ăn mừng:
tiêu đề nhấp nháy vào cụm *Easter Egg ⇄ Game On*, băng rôn sinh nhật bay ra. Trước đây
chỉ chạy **một lần mỗi ngày** (`eggTitleDay`) — nay bỏ hẳn giới hạn đó: người ta vào lúc
nào cũng phải gặp đúng khoảnh khắc ăn mừng, đó mới là quà.

> **BẪY khi tự kiểm thử:** `boot()` có nhánh "sang mùa mới thì xoá sạch tiến độ"
> (`SEA.id === 'season' && s.season !== SEA.year`). Nếu nhét thẳng `mtv1` vào
> localStorage mà quên khoá `season`, vặn đồng hồ tới gần 01-09 là mất sạch tiến độ vừa
> nhét — không phải lỗi trang, chỉ là thiếu một khoá.

---

## 21g. Nhắc bài tìm Easter Egg

Phá đảo bản đồ rồi mà chưa tìm ra khung Collected thì **mỗi lần mở trang**:

1. tem *Last updated* nhấp nháy **ngay lập tức** — tem nằm ở góc phải dưới, không bị thứ
   gì che, nên đây là thứ luôn thấy được;
2. **chờ băng rôn sinh nhật hạ cánh** (22 giây) rồi mới tới lượt dòng *Game On · Độ khó:
   Q♥* nhấp nháy **10,5 giây** — riêng **quân Q♥** nháy lâu hơn, thêm nhịp phồng và quầng
   sáng để nổi hơn phần chữ quanh nó;
3. hết lượt đó thì tem nháy **lần nữa** để chốt hướng.

Mắt người chơi tự đi từ chỗ này sang chỗ kia — không có mũi tên, không có câu "bấm vào
đây". Trong lúc chuỗi này chạy thì **lượt nháy tem hằng ngày bị tắt**: nháy cùng lúc là
mất sạch ý "nhìn chỗ này rồi mới nhìn chỗ kia".

> **BẪY ĐÃ VẤP HAI LẦN — băng rôn che mất dòng dẫn.** Trong cửa sổ Easter Egg, mở trang
> là băng rôn bay ra ngay, mà `.frame.won.flying .lead{display:none}` **ẩn luôn dòng dẫn
> 20 giây**. Bản đầu cho **cả chuỗi** đợi băng rôn → F5 chỉ thấy băng rôn, hơn nửa phút
> mới thấy gì nháy, tưởng hỏng. Bản sau chỉ hỏi *"băng rôn có đang bay không"* **một
> nhát lúc bắt đầu** → vẫn hụt, vì băng rôn nổ ra sau đó vài trăm mili-giây, lượt nháy
> chạy trong lúc dòng dẫn đang bị ẩn.
> Cách đúng: **tách đôi** (tem nháy ngay, dòng dẫn đợi) và hỏi *"dòng dẫn có ĐANG NHÌN
> THẤY ĐƯỢC không"* bằng `ld.offsetParent`, hỏi lại mỗi 600 ms, tối đa một phút rồi thôi.
> Kiểm thử chỗ này phải **rình** `#lead.eggblink` trong 30 giây, chấm một nhát ở giây thứ
> 15 là báo hỏng oan.

### Dòng dẫn có hai nửa, hai vai khác hẳn nhau

| Bấm vào | Việc xảy ra |
|---|---|
| Chữ *Game On · Độ khó:* — **gõ đúp** | Băng rôn sinh nhật bay lại. Lúc nào cũng chạy, tìm ra Easter Egg rồi hay chưa cũng vậy |
| Quân **Q♥** — **chạm một cái** | Thắp tem *Last updated* (`.stampzone.glow`) rồi cho tem nháy theo tông Easter Egg |

Tách vai như vậy vì hai việc này chỏi nhau: **băng rôn bay là ẩn luôn dòng dẫn 20 giây**
(`.frame.won.flying .lead{display:none}`), nên nếu cùng một cú bấm vừa thổi băng rôn vừa
chỉ đường thì người chơi mất luôn chỗ vừa bấm. Quân Q♥ nhỏ xíu, phải cố ý mới trúng —
đúng vai một cái nút bí mật.

**Chạm Q♥ — đủ BỐN NHỊP mới ra một câu.** Chạm một hai cái thì tem sáng lên thôi,
chưa nói gì; cố chạm thêm bốn nhịp nữa mới sang câu tiếp (gõ đúp hai lần cũng là bốn).
Bộ `QCHAM`, hằng `QCHAM_NHIP = 4`:

| Nhịp chạm dồn | Câu |
|---|---|
| 4 | *Nhầm chỗ gòi anh ưi* |
| 8 | *Lấp lánh long lanh kìa~* |
| 12 | *Nhìn qua góc trái anh ưi~* |
| 16 | *Khúm ai bấm 2 lần ở cùng 1 chỗ ==~* |
| 20 | *Trừi ưi, zẫn còn pấm ở đây!* |
| 24 | *Bên trái đồng chí ưiii!!!* |
| 28 trở đi | **xoay vòng** về lại câu đầu |

Cố ý **xoay vòng chứ không khoá cứng ở câu chót**: ai lì mà nghe lặp đúng một câu thì
tưởng màn hình hỏng.

Đếm **dồn qua cả phiên**, không reset theo nhịp tay — gõ đúp hai lần cách nhau vài giây
vẫn tính đủ. Chuỗi này **không bao giờ chỉ ra cách làm**: chỉ nói *sai chỗ* rồi chỉ
*hướng*, việc gõ mấy nhịp vào đâu là phần người chơi tự tìm.

> **BẪY ĐÃ VẤP — hiệu ứng có chạy mà người chơi không thấy.** Bản đầu chạm Q♥ chỉ thắp
> tem rồi cho tem đổi màu, **không hiện chữ nào**. Tem là dải chữ 8 px, mờ 30%, dựng dọc
> sát mép trái — đo thì `animation: egg` chạy đủ chu kỳ, nhìn thì mắt trượt qua hoàn toàn.
>
> **Và cách chữa đầu tiên còn sai hơn:** thêm `scale()` vào tem cho dễ thấy. Tem có
> `writing-mode:vertical-rl` + `rotate(180deg)`, chồng thêm scale là nó **trượt hẳn ra
> ngoài màn hình**. Tem phải **nằm im đúng chỗ, chỉ đổi màu** — muốn người chơi để ý thì
> nói bằng LỜI, đừng động vào transform của nó.
>
> Bài học kép: *đo được không có nghĩa là thấy được*, nhưng *chữa bằng chuyển động trên
> một phần tử đã xoay thì hỏng nặng hơn cả bệnh*.

**Bấm vào tem** thì được nhắc rõ dần, theo số nhịp liên tiếp:

| Nhịp | Câu nhắc |
|---|---|
| 4 | Đúng chỗ rồi đó ✦ |
| 7 | Cứ đà này đi anh ưi ✦ |
| 9 | Sắp rồi sắp rồi ✦ |

> **LUẬT: chuỗi cổ vũ không được đếm hộ, không được chỉ cách làm.** Câu cũ *"Một nhịp
> nữa thôi"* nói toạc là còn đúng một cú — biết vậy thì hết cả cái thú mò ra. Đây chỉ là
> tiếng vỗ tay cho người đang gõ đúng chỗ, không phải bảng hướng dẫn.

Ngưng tay quá 900 ms là bộ đếm về 0 và lời nhắc tự rút — **bỏ cuộc thì im lại như cũ**,
không có gì lải nhải. Tìm ra rồi (`credFound`) thì cả hệ này tắt hẳn.

---

## 21j. HỘP CHÀO — sáu trạng thái, một khuôn

Bộ ảnh động ở `assets/HH_*.webp` (800×446, tỉ lệ 16:9). Một khuôn hộp duy nhất, mỗi
trạng thái chỉ đổi **ảnh · một dòng chữ · tông viền** — không đổi bố cục, để mắt không
phải học lại. `.hh.zoey` chuyển sang bảng pastel của Map 3.

| Ưu tiên | Trạng thái | Ảnh | Khi nào | Cờ |
|---|---|---|---|---|
| 1 | `gate2` | `HH_3_excited` | Lần đầu quay ra bản đồ sau khi xong Gate 2 | `hhG2` |
| 2 | `hanwin` | `HH_2_happy` | Lần đầu quay ra sau khi giải hết Zoey's Castle | `hhHan` |
| 3 | `daily` | `HH_1_welcome` (lần đầu đời) / `HH_2_welcome_back` | Phiên đầu trong ngày, kèm một câu hỏi han | `hhNgay` |
| 4 | `idle` | `HH_5_idle_afk` | Rời máy ≥ `IDLE_PHUT` (12 phút) rồi quay lại | `sessionStorage.hhAfk` |

**Mỗi lần mở trang chỉ hiện MỘT hộp** — dồn ba bốn lời chào vào một lượt là phiền, không
phải chăm sóc. Hộp tự rút sau 12 giây.

`HH_4_hello_easter.webp` dùng riêng cho **khung ảnh trong Collected: Easter Egg**
— khung đó đổi từ **tròn 112 px sang chữ nhật 16:9** kèm zoom rất chậm: ảnh vẽ cả người
lẫn khung cảnh, cắt tròn 112 px thì còn mỗi cái mặt bé xíu, không đọc ra gì.

### Nhắc "xem lại" — mỗi ngày một lần, cho tới khi vào Open World

Xong Gate 2 mà chưa vào được **Open World** bên trong thì lời chào đầu ngày nối thêm một
câu nhắc về **chế độ xem lại** (nút cuộn phim trong khung Collected). Cờ dừng là
`mtv1.g2Open`.

> **CÒN THIẾU — hợp đồng cho trang Open World đang dựng:** trang đó phải ghi
> `mtv1.g2Open = true` ngay khi vào. Chưa có dòng đó thì lời nhắc lặp lại mỗi ngày mãi.
> Tương tự, trang Gate 2 ghi `mtv1.g2Done = true` đúng lúc **màn cuối hiện ra** (không
> phải lúc mở trang) — bản đồ đọc cờ này để biết có nên chào không.

### ẢNH RẤT NẶNG — đọc trước khi thêm chỗ dùng

| | |
|---|---|
| Mỗi file | **~15 MB**, webp **động 121 khung** |
| Cả bộ 6 file | **~90 MB** |
| Mạng 4G ~5 Mbps | **~24 giây** cho một file |

Vì vậy: **không preload, không gắn sẵn `src` trong HTML**. Chỉ nạp đúng file của trạng
thái đang hiện, ngay lúc hiện; đóng hộp thì `removeAttribute('src')` để thả bộ nhớ.
Ảnh hỏng/thiếu thì **giấu khung ảnh, vẫn giữ lời chào**.

> **Nên nén lại.** Ở 800×446 mà 15 MB là quá nặng cho một trang tĩnh. Hạ chất lượng
> (`-q 55`), giảm số khung, hoặc cắt còn ~3 giây là xuống được cỡ 1–2 MB mỗi file — nhanh
> hơn **mười lần** mà mắt gần như không thấy khác.

> **Đã đổi tên rồi.** File này trước đây tên là `HH_4_hello trong easter egg.webp` — có dấu
> cách — nhưng bản tải lên sau đó đặt là `HH_4_hello_easter.webp`, trong khi hằng `HH` ở
> `index.html` vẫn giữ tên cũ. Kết quả: khung ảnh trong hộp *Collected: Easter Egg* rỗng.
> Nay hằng `HH` trỏ đúng `HH_4_hello_easter.webp`. Đổi tên file lần nữa thì phải sửa hằng
> `HH` trong `index.html` cho khớp, nếu không lại rỗng y như vậy.

### `/api/quote` — câu chào đầu ngày

Endpoint gọi **Gemini phía máy chủ**, khoá lấy từ biến môi trường `GEMINI_KEY`
(hoặc `GOOGLE_API_KEY`), model đổi được bằng `GEMINI_MODEL`. **Không bao giờ để khoá
xuống trình duyệt** — trang là HTML tĩnh, nhét khoá vào đó là công khai cho cả thế giới.

Chưa khai khoá, gọi lỗi, hay chậm quá 2,5 giây thì rơi về **bộ câu có sẵn** xoay theo
ngày (*"Đồng chí ăn gì chưa?"*, *"Hôm nay có gì vui kể em nghe với?"*…) — người chơi
không bao giờ thấy lỗi cấu hình.

---

## 21i. Bốn nút reset — đứng riêng, không đè nhau

Bốn khoá lưu, bốn đường xoá, mỗi đường chỉ chạm khoá của mình:

| Nút | Ở đâu | Xoá | Giữ |
|---|---|---|---|
| **Reset MAP-01** | Box Tổng tư lệnh → `MAP-01` | `mtv1` (tiến độ bản đồ + mọi cờ Easter Egg) | `R(n)` · `msn1` · `hanv1` · `nav1` |
| **Reset MAP-02** | Box Tổng tư lệnh → `MAP-02` | trong `mtv1` **chỉ** nhóm cờ Easter Egg: `credFound` `eggWin` `eggDone` `eggDay` `eggTitleDay` `coachDone` `eggAn` `g2Hack` | tiến độ 4 toạ độ · `eggMo` · `R(n)` · `msn1` · `hanv1` · `nav1` |
| **Reset Map 3** | Khối vận hành trong `961030-a` | `hanv1` (kể cả cờ cửa mã `aOpen`) | `R(n)` riêng của Map 3 · `mtv1` · `msn1` · `nav1` |
| **↻ Chơi lại** | Màn cuối Gate 2 | `mtv1` **và** `hanv1` | `R(n)` · `msn1` · `nav1` |

Hai điểm cố ý khác nhau, không phải lỗi:

- **Reset MAP-01 không đụng `hanv1`.** Xoá bản đồ thì Map 3 khoá lại (vì mất `eggWin`),
  nhưng các câu đã trả lời vẫn còn — Map 3 có nút reset riêng của nó.
- **"Chơi lại" ở Gate 2 thì xoá cả `hanv1`**, vì nút đó mang nghĩa *chơi lại từ đầu cả
  chuỗi*, mà Map 3 nằm sau Easter Egg — giữ lại tiến độ Map 3 trong khi Easter Egg đã về
  vạch xuất phát là vô lý.

Ba khoá `msn1` (ba Mission) và `nav1` (pí danh + bản lưu) **không đường nào trong bản đồ
chạm tới** — chúng có đường xoá riêng bên hồ sơ DAD-950901-A.

---

## 21e. Soát UI trên nhiều cỡ màn

Có bộ soát tự động chạy **8 trang × 6 cỡ màn** (320×568 → 1280×800), bắt bốn thứ:

1. cả trang có phải kéo ngang không (`scrollWidth > clientWidth`);
2. **chữ bị cắt** — phần tử có chữ mà nội dung rộng hơn hộp của chính nó trong khi hộp
   lại `overflow:hidden`;
3. **nút thấp dưới 32 px** — cỡ chạm tay;
4. lỗi JS lúc tải trang.

Bốn chỗ đã sửa từ đợt soát này:

| Chỗ | Trước | Sau |
|---|---|---|
| Nút *1000% / Xem xét* của hộp xác nhận | cao **13 px** (chỉ có padding ngang) | `min-height:40px` |
| Tay nắm bảng hồ sơ `.grip` | vùng bấm **4 px** | nút 32 px, vạch vẽ bằng `::before` |
| Dòng bản quyền kiêm cửa hậu | 24 px | 34 px, nhìn không đổi |
| Nút lùi ba trang HAN | 30 px | 38 px |

> **BẪY ĐÃ VẤP — hai lỗi CSS kinh điển, cùng lộ ra ở màn 320 px:**
>
> - **Media query đặt sai chỗ.** Khối `@media(max-width:379px)` để giữa bảng kiểu thì
>   thua các quy tắc khai sau nó (cùng độ đặc hiệu, thắng theo thứ tự nguồn) — sửa cỡ chữ
>   mà màn hình không đổi gì. Phải để **cuối** bảng kiểu.
> - **`position:absolute` + `left:50%` bóp bề rộng.** Bề rộng khả dụng của hộp chỉ còn
>   **nửa khung**, nên tem phân loại tự xuống dòng sớm và rớt lại chữ "PHÚC" một mình.
>   `width:max-content` mới cho nó rộng theo đúng nội dung.

---

## 21h. Cửa mã của bộ câu hỏi — `PIN_A = HO CHI MINH`

Bộ câu hỏi `HAN-961030-A` có **cửa mã riêng** ngay đầu trang, dựng y khuôn cửa mã của
Secret Chamber: một dòng nhắc, một hàng ô, không kể lể. Mã là **`HO CHI MINH`** — chữ, không
phải số; so khớp bỏ dấu và không phân biệt hoa thường, nên gõ *tyrion* cũng vào được.

**Mã chỉ phát khi đã THẮNG Gate 2**, không phải khi mò được cửa. Trang
`/dad/950901-b` có **một mốc, hai trạng thái**:

| | Chưa tới `00:00 · 01-09` (giờ VN) | Từ mốc đó trở đi |
|---|---|---|
| Vai | `Player: Dongchi Bình` | `Winner: Dongchi Bình` |
| Tiêu đề | `Easter Egg: Gate 2` + nhãn `Locked`, **không nháy** | `Phá Đảo` / `Easter Egg: Gate 2`, **nháy tông Easter Egg** |
| Thân | *"Hẹn anh 00:00 ngày 01-09"* + đồng hồ đếm ngược | *"Phi ngựa tới Zoey's Castle 🦄"* |
| Mã | không có | ô mã `HO CHI MINH` + hai nút (*Chơi lại* · *Zoey's Castle 🏰👸🏻*) |

Dòng `Easter Egg: Gate 2` phải **gọn một hàng ở mọi cỡ màn** — hàm `khitTit()` hạ cỡ chữ
từ 30 px xuống 15 px cho tới khi vừa, và đo lại một nhịp sau `document.fonts.ready`.

> **BẪY ĐÃ VẤP — đo bên trong một khối đã tràn.** `.mid` là flex-item của `.frame`, mà
> flex-item **được phép rộng hơn ô chứa**: `max-width:320px` trên máy 320 px thành ra rộng
> đúng bằng cả màn, tràn qua cả `padding:30px` của khung. Chữ chạy sát mép rồi bị cắt, mà
> mọi phép đo *bên trong* `.mid` vẫn báo "vừa" vì chỗ tràn nằm ở tầng trên. Chốt bằng
> `max-width:min(320px,100%)` rồi mới đo được thật.
>
> Kèm theo: phần tử `display:block` luôn rộng đúng bằng khung, nên `getBoundingClientRect()`
> của nó **không bao giờ** báo tràn — phải so `scrollWidth` với `clientWidth`.

Ai lách vào cửa này sớm thì chỉ thấy đồng hồ — vào được cửa cũng chưa có gì mang đi.
Thứ tự chặng nhờ vậy mà giữ được: Map 2 xong mới tới Map 3.

> Bản trước viết cả một đoạn *"Anh mở được cửa này sớm hơn lịch — Gate 2 đã thông, nhưng
> bên trong thì chưa có gì để xem đâu…"* rồi vẫn phát mã ngay. Vừa dài dòng, vừa mâu
> thuẫn: đã bảo chưa có gì mà lại đưa phần thưởng. Nay một dòng hẹn + một cái đồng hồ.

**Phát mã là chặng CUỐI của Gate 2**, và phát xong thì **đưa người chơi đi luôn**: ngay
dưới ô mã là nút *Vào Zoey's Castle →* trỏ thẳng `/han/961030-a?from=map`. Không bắt ai
tự mò đường về bản đồ rồi tìm lại toạ độ Hà Nội.

> **BẪY ĐÃ VẤP:** cờ `eggWin` trước đây chỉ được ghi ở **ba chỗ bên ngoài** (link hồ sơ
> trên bản đồ · nút trong khung Collected · nút ở trang pháo hoa). Ai tới thẳng
> `/dad/950901-b` — kể cả bằng chính nút *Vào Zoey's Castle* rồi quay lại — thì cờ không
> có, và Map 3 báo *"chưa có chìa khoá vào lâu đài"* dù vừa thắng xong. Nay **chính trang
> Gate 2 ghi cờ**: đứng ở đó nghĩa là đã qua cửa, khỏi phụ thuộc đi bằng đường nào.

Đổi mã thì sửa **hai chỗ, phải khớp nhau**: hằng `PIN_A` bên `han/961030-a`, và biến `MA`
trong khối phát mã bên `dad/950901-b`.

Trạng thái nhớ ở `hanv1.aOpen` nên **F5 không phải gõ lại**; số lần sai ở `hanv1.aSai`
(sai 3 lần trở lên thì lời nhắn chỉ thẳng chỗ lấy mã). Reset toàn bộ thì cửa đóng lại.

---

## 22. MAP 3 · ZOEY'S CASTLE (HAN-961030)

> **Tên gọi chung.** Ba màn của trò chơi, gọi thống nhất từ đây về sau:
>
> | Tên | Ở đâu | Là gì |
> |---|---|---|
> | **Map 1** · Bản đồ tác chiến | `/` | Bốn toạ độ, giải mật thư |
> | **Map 2** · Easter Egg | `/dad/950901-b` + `/phao-hoa` | Cửa hậu 10 nhịp, pháo hoa, hồ sơ niêm phong |
> | **Map 3** · Zoey's Castle | `/han/` | Bộ câu hỏi + Secret Chamber |
>
> Chữ của Map 3 gom hết ở **`han/CHU-MAP3.md`** — sửa lời thoại thì mở file đó.

Hai trang, vào từ khung **Collected: Easter Egg** của bản đồ (nút *Get to know me*).

| Trang | Là gì | Nền động |
|---|---|---|
| `/han/961030-a` | *Who's my kindred spirit?* — bộ câu hỏi về Honghandangiu; đúng hết thì được cấp **mã 5 số** | **Hoa anh đào rơi** — canvas, mỗi cánh vẽ bằng hai cung bezier, xoay quanh trục dọc nên lúc mỏng lúc dày |
| `/han/961030-b` | **HongHan's Secret Chamber** — hiện còn *đang trong quá trình forming*, mở sau | **Dải ngân hà** — canvas, sao xếp theo hai nhánh xoắn, quay quanh lõi với tốc độ giảm dần theo bán kính |

### Đường đi — không có trang trung gian

**Khu hồ sơ của Map 3 chính là khung HAN trên bản đồ**, không phải một trang riêng. Từng
có trang `/han/index.html` làm "màn chọn hồ sơ" — **đã xoá**: bấm lùi mà khung đổi sang
một trang lạ thì người xem mất phương hướng.

Lùi từ `961030-a` hay `961030-b` đều về `/?stay=1&node=HAN` — bản đồ mở lại **đúng khung
hồ sơ vừa rời**. Riêng khi vào từ khung Collected (`?from=egg`) thì lùi về `?cred=1` để
khung đó mở lại.

### Theme mới — không dùng chung bảng màu với bản đồ

Giữ nguyên **cấu trúc** của design system (khung `.frame`, góc kẻ tay, tem phân loại,
ô nhập từng ký tự, hộp bo góc) nhưng đổi hẳn bảng màu và chữ:

```
--lav #F4E7FB · --blush #F3DCDC · --coral #F5BCBA
--orchid #E3AADD · --violet #C8A8E9 · --peri #C3C7F3
--ink #3E2F56 (chữ chính — tím mực, KHÔNG dùng đen)
```

**Chữ:** `Cormorant Garamond` in nghiêng cho tiêu đề (mềm, nữ tính) · `Oswald` viết hoa
giãn rộng cho nhãn kỹ thuật (giữ chất cyber của bản đồ) · `Be Vietnam Pro` cho văn bản.
Đây là chỗ hai tính cách gặp nhau: **serif nghiêng + nhãn kỹ thuật viết hoa**.

`961030-a` nền sáng pastel; `961030-b` nền tím đêm để dải ngân hà nổi lên — cùng một họ
màu, khác độ sáng.

### BẪY ĐÃ VẤP — canvas không chịu giãn ra

`<canvas>` là **replaced element**, có kích thước nội tại **300×150**. Đặt
`position:absolute; inset:0` thôi thì nó **không** giãn theo khung: nó vẫn là một ô
300×150 nằm ở góc trái trên. Hiệu ứng vẫn chạy đủ quân, chỉ là chạy trong cái ô bé xíu
đó — nhìn ra màn hình thì tưởng "hoa chỉ rơi ở đỉnh trang" hoặc "ngân hà co về một góc".

Bắt buộc viết đủ:

```css
#sakura, #galaxy{ position:absolute; inset:0; width:100%; height:100% }
```

Đã mất một vòng chỉnh vô ích (tăng mật độ, đổi điểm sinh, đổi tốc độ rơi) trước khi tìm
ra đúng nguyên nhân. **Đo trước khi chỉnh:** `getBoundingClientRect()` của canvas trả về
`300×150` là dấu hiệu duy nhất cần nhìn.

### Hai mẹo giữ hiệu ứng trải đều

- **Cánh hoa:** ra khỏi mép trái thì **vòng** sang mép phải (`h.x = W + 40`) chứ không
  thay cánh mới. Cánh chỉ rời cuộc khi chạm đáy → mật độ đều từ đỉnh xuống chân trang.
  Nếu cho despawn theo mép trái, gió thổi trái làm phần lớn cánh biến mất giữa chừng và
  nửa dưới trang trống dần.
- **Lõi ngân hà** đặt lệch xuống `cx = W*0.54, cy = H*0.62`. Để giữa khung thì quầng sáng
  nằm đúng sau hộp nhập mã, chữ bị loá.

### Luật chơi 961030-a

| | Nội dung | Đáp án |
|---|---|---|
| Manga | Tên một Manga Nhật Bản mà em yêu thích? | `ALICE IN BORDERLAND` |
| Đi dạy | Em bắt đầu đi dạy năm bao nhiêu? | `2016` |
| Mèo | Chú mèo đầu tiên Honghandangiu nuôi tên là gì? | `DUOI GAY` |
| LoL | Champion em chơi nhiều nhất trong LoL? | `AKALI` |
| Tâm lý | Nhà tâm lý học vĩ đại nhất trong lòng em? | `CARL JUNG` |
| Tên Hoa | Phiên âm tên tiếng Trung của em là… | `YAN XIN` |

> **Bảng này chỉ để tra cứu — nguồn thật là mảng `HOI`.** Thêm/bớt câu thì sửa `HOI`, mọi
> con số trong trang tự đi theo `TONG = HOI.length`; đừng viết số câu ra chỗ nào khác.

- **Thứ tự câu hỏi ngẫu nhiên** mỗi lượt chơi (`tron()` trộn mảng, lưu ở `hanv1.order`).
**Luật lượt sai** (ba hằng số đầu khối script):

| Hằng | Mặc định | Nghĩa |
|---|---|---|
| `SAI_PHIEN` | 2 | Sai bấy nhiêu lần thì câu đó **cháy lượt** |
| `NGHI` | 30 phút | Cháy lượt xong câu đó **nghỉ** bấy lâu |
| `CHAY_NGAY` | 2 | Mỗi câu mỗi ngày chỉ được cháy bấy nhiêu vòng; vòng cuối thì nghỉ **tới mai** |

- Cháy lượt là **gác câu đó lại và nhảy ngay sang câu kế** — người chơi luôn còn việc để
  làm, và có lời nhắn nói rõ vì sao màn hình vừa đổi câu.
- Câu đã trả lời đúng thì **giữ nguyên** (`hanv1.dung`), con trỏ chỉ chạy vòng qua những
  câu còn nợ.

**Trả lời đúng thì DỪNG LẠI, không nhảy câu ngay.** Chữ khen nhấp nháy tông Easter Egg
xong (1900 ms) thì màn **đứng nguyên tại câu vừa làm**, ô nhập **điền sẵn đáp án**. Muốn đi
tiếp hay ngó lại thì bấm **hai mũi tên `‹ ›` ở hai bên đáy thẻ**.

### Một màn cho ba trạng thái — không dựng giao diện mới

`drawQ(pos)` vẽ **cùng một thẻ** cho cả ba trạng thái của một câu; `pos` bỏ trống là chơi
câu tới lượt, có `pos` là mở đúng câu ở vị trí đó:

| Trạng thái | Khác gì |
|---|---|
| Đang chơi | như cũ: hàng ô trống, có SOS, có đồng hồ gợi ý |
| **Đã đúng** | hàng ô **điền sẵn đáp án**, nhãn đổi thành *Đã trả lời đúng ✦*, giấu SOS, ô nhập `disabled` |
| Đang nghỉ | hàng ô trống, không gõ được, kèm đồng hồ *mở lại sau hh:mm:ss*; hết giờ tự vào chơi |

> **BẢN TRƯỚC LÀM QUÁ TAY:** dựng hẳn hai màn riêng (`drawDung` khoe đáp án trong thẻ
> `.dap-xong`, `drawXem` liệt kê tất cả) — người chơi phải học thêm hai bố cục nữa chỉ để
> đọc lại một câu đã biết. Nay xem lại **y khuôn màn nhập**, chỉ khác là ô đã có chữ. Ít
> thứ để học, mà cảm giác "tôi làm được rồi" lại rõ hơn vì thấy đúng chỗ mình vừa gõ.

Hai mũi tên (`#navL` / `#navR`, class `.qnav`) cố ý **nhạt và không viền** — đây là thứ để
lướt qua lại, không phải nút chính. Đi vòng tròn: hết câu cuối thì quay về câu đầu.
- **Cả bộ cùng nghỉ** mới hiện màn *Xíu nữa gặp lại nha* (chữ và bộ icon 🏰 👸🏻 🔮 🌷
  **chung một hàng**, cỡ chữ tự co): số câu đang chờ + đồng hồ đếm tới
  lúc câu sớm nhất mở lại, và một nút **mời** xáo bài chơi lại (không ép). Hết giờ là màn
  đó **tự vào chơi tiếp**, khỏi bấm gì.
- Sang ngày mới trả lại sạch: lượt sai, lượt cháy, mọi khoá đang treo (`hanv1.day`).

> **BẪY ĐÃ VẤP — luật cũ có ngõ cụt.** Bản trước khoá câu tới nửa đêm và **ép** reset
> toàn bộ, mà reset lại **không hoàn lượt**: xáo bài xong đi tới đúng câu đã cháy là tắc,
> hôm đó không cách nào chơi hết. Đây là quà sinh nhật, không phải bài thi.
- **GỢI Ý KHOÁ TỚI 01-10-2026 — hiện giờ chơi chay.** Hằng `MO_GOIY` (mốc
  `2026-10-01T00:00:00+07:00`) chốt cả hệ gợi ý: trước mốc đó thì **sai bao nhiêu lần
  cũng không lộ gợi ý**, bấm SOS bao nhiêu nhịp cũng không, đồng hồ 45 giây cũng không
  chạy. Bốn chỗ phải cùng chặn (`goiYMo()`): hàm `moGoiY` mở gợi ý, trình nghe bấm SOS,
  nhịp đồng hồ mỗi giây, và `waitPaint()`.
- **Khoá thì im, đừng treo bảng.** Nút SOS vẫn bấm được và **vẫn trêu như thường** —
  chỉ là gõ đủ 10 nhịp cũng chẳng ra chữ nào. Ô đồng hồ để **trống**. Bản trước treo một
  dòng *"Gợi ý mở từ 01-10-2026"* suốt cả ván: vừa chình ình, vừa tự tố cáo là còn thứ
  đang giấu — mất sạch cái thú chơi chay.
- **Sau mốc thì trả lại cơ chế Mission 3:** sai lần đầu lộ gợi ý 1; gợi ý kế **tự mở sau
  45 giây** mà không cần sai thêm; muốn mở sớm thì bấm **SOS góc dưới trái 10 nhịp liên
  tiếp** (mỗi nhịp cách nhau dưới 900 ms). Bấm lai rai một hai cái chỉ bị ghẹo, tối đa
  6 câu mỗi phiên. Câu Alice tách `2020` → `Netflix Live Action` → `Arisu` thành ba
  gợi ý riêng.
- **Gợi ý và đồng hồ nằm TRÊN ô nhập** — đọc rồi mới gõ, mắt không phải nhảy xuống dưới
  rồi ngược lên.
- So khớp bỏ dấu, bỏ khoảng trắng, không phân biệt hoa thường: gõ *"alice in borderland"*
  hay *"Đuôi Gãy"* đều nhận.
- Xong hết → màn **Phá Đảo Lòng EM** (ba trái tim nhấp nháy so le) · *HongHan's Secret* ·
  *Thương gửi anh PIN* · **mã `69991`** (hằng `PIN_B`) — **ngày sinh âm lịch của HongHan**
  — và nút *Vào Secret Chamber ✦*. Đi bằng nút này thì trang B khỏi hỏi mã lại (`hanv1.bOpen`).

Tiến độ lưu ở `localStorage.hanv1` — **khoá riêng**, không đụng `mtv1` / `msn1` / `nav1`.

### Ô đáp án — một hàng là mặc định

Đáp án dài ngắn khác nhau (từ `2016` bốn ô tới `ALICEINBORDERLAND` mười bảy ô) nhưng
luôn cố xếp **gọn một hàng**: hàm `xepO()` dò cỡ ô từ 24 px xuống 12 px, khe giữa ô co
theo cỡ, lấy cỡ lớn nhất còn vừa bề ngang thẻ.

Chỉ khi cỡ nhỏ nhất vẫn tràn mới xuống **hai hàng**, và điểm cắt ưu tiên **ranh giới
từ** gần giữa: `ALICE IN | BORDERLAND`, chứ không phải `ALICEINBO | RDERLAND` — chia cho
thật đều thì cân mắt nhưng chẳng ai nhận ra mình đang gõ chữ gì. Hai hàng dùng chung một
cỡ ô để nhìn không so le, mỗi hàng tự căn giữa.

Xoay ngang máy là bề ngang đổi hẳn → `xepLai()` xếp lại (có hoãn 160 ms), nếu không thì
hàng đang vừa khít bỗng tràn ra ngoài thẻ.

### Cửa mã bên B — SOS chỉ mở khi đã bí thật

Cửa `961030-b` chỉ còn đúng một dòng **"Vui lòng nhập mã PIN ✦"** và hàng ô — bỏ hết câu
dẫn, bỏ luôn nhãn đếm số chữ số. Cửa nhận **5 số**. Nút **SOS góc trái chỉ hiện sau 3 lần
nhập sai** — chưa sai
thì không thấy, khỏi mời gọi. Hiện rồi thì bấm **10 nhịp liên tiếp** mới lộ gợi ý
*"Ngày sinh ÂM LỊCH của HongHan"*, y hệt cơ chế SOS bên A và Mission 3.

Số lần sai ghi vào `hanv1.bSai`, nên **tải lại trang không mất nút SOS đã mở được** —
bắt sai lại ba lần nữa mới cho thấy thì vô lý.

### Đồng hồ trong Secret Chamber

Mở khoá xong, `961030-b` **không** đổ nội dung ra ngay: một **hộp quà thắt nơ neon**, một
dòng trạng thái ngắn xoay vòng — *Đang thu thập dữ liệu · Đang gói ghém · Đang sắp xếp*,
mỗi câu một icon — và **đồng hồ đếm ngược tới 01-10** (`MO_NGAY` / `MO_THANG`). Tới mốc thì
tự lật sang màn nội dung.

Khối vận hành có nút **⏩ Tua tới 01.10** để xem thử màn đó ngay, bấm lần nữa là trả kim
(`hanv1.tua` — một khoảng lệch mili-giây, không đụng đồng hồ máy).

### Dòng dẫn — chữ và chìa khoá đi CHUNG MỘT HÀNG

Dòng dưới tiêu đề là **`Thu thập chìa khoá để mở Secret Chamber`** (xong hết thì đổi thành
*"Đủ chìa khoá rồi — mã mở Secret Chamber ở ngay dưới"*), đứng cạnh một **chìa khoá hồng
công chúa dựng DỌC** — tay cầm ở trên, răng khoá ở dưới — có hai ngôi sao nhấp nháy so le
(`icoKhoa()`: SVG vẽ tay, gradient `#F2A7D0 → #D97BB6`).

Vẽ tay chứ **không dùng emoji 🔑**: mỗi máy một cỡ, một màu, không xoay dọc được, và hay
tự rớt xuống dòng.

> **KHÔNG viết số câu vào dòng này.** Bộ câu hỏi sẽ còn dài ra; ghi "6/6" hôm nay thì mai
> thêm câu là dòng đầu tiên người ta đọc hoá ra nói dối. Số câu chỉ hiện ở **hai chỗ, cả
> hai đều đọc từ `TONG = HOI.length`**: nhãn *"Câu n / TONG"* trên đầu thẻ, và thanh bước
> ngay dưới. Nhãn màn nghỉ cũng vậy — *"Cả `TONG` câu đang nghỉ"*, không viết "cả năm câu".

### Co chữ cho vừa khung — `khit()`

Một hàm dùng chung ba chỗ, hạ cỡ chữ dần cho tới khi vừa:

| Gọi | Chỗ nào | Khoảng cỡ |
|---|---|---|
| `khitLead()` | dòng dẫn + chìa khoá (một hàng, `nowrap`) | 12 → 9 px |
| `khitChao()` | *"Xíu nữa gặp lại nha 🏰 👸🏻 🔮 🌷"* — chữ và icon **chung một hàng** | 25 → 15 px |
| `khitHoi()` | câu hỏi, ép gọn **tối đa hai hàng** | 19 → 14 px |

Đặt `nowrap` rồi thôi thì máy 320 px **tràn ra ngoài mép thẻ** — đo mới biết, nhìn thì
không. Còn câu hỏi thì bản trước để `text-wrap:balance` ở cỡ cố định, nên câu dài bị bẻ
vào **giữa cụm từ**: *"Tên một Manga Nhật / Bản mà em yêu thích?"*. Nay `text-wrap:pretty`
+ tự co cỡ, cụm từ không bị cắt đôi nữa. Xoay ngang máy gọi lại cả ba.

### Cửa hậu hoa — Khối vận hành

Giống lá cờ ngoài bản đồ: **bấm 5 nhịp** (mỗi nhịp cách nhau dưới 900 ms) → **Khối vận
hành**, nhập **PIN 1959** → *Reset* (bấm hai lần để chắc) hoặc *Hoàn thành ngay*.

Vùng bấm là **cả cụm icon + dòng tem** (`#stampzone`), đúng như cửa hậu ngoài bản đồ nhận
cả dòng bản quyền chứ không riêng lá cờ 15 px — trên điện thoại dễ trúng hơn hẳn. Nhấp
nháy thì vẫn chỉ mình cái icon.

Icon là **nơ bướm**, và cụm này **không đổi con trỏ thành bàn tay** — để nguyên mũi tên
thì không ai đoán ra chỗ đó bấm được; ai biết thì tự bấm đủ nhịp. Tem cũng **bỏ tên hồ sơ
`HAN-961030-x`**, chỉ còn version + last updated.

Hộp nhập mã dựng **y khuôn hộp mã của Box Tổng tư lệnh**: một nhãn nhỏ *Mã truy cập*,
hàng ô gạch chân, một dòng nhắc *Gõ 4 số*. Không tiêu đề, và **không kể mã ở đâu ra** —
câu "mã này dùng chung với khu điều phối của bản đồ" đã bỏ.

> **BẪY ĐÃ VẤP:** ban đầu cho `.flow.warm{transform:scale(1.18)}` phóng to **cả nút**.
> Vùng bấm nhảy ra khỏi ngón tay giữa chuỗi nhịp → gần như không ai bấm đủ 5 nhịp trong
> cửa sổ thời gian. Chỉ phóng to **`svg` bên trong**, giữ nguyên hộp bấm.

### Tem phiên bản

Góc phải dưới mỗi trang HAN có tem giống bản đồ: chuỗi gốc ở `data-base` của `#stamp`,
hàm `stampText()` ghép thêm `· R(n)` khi đã reset ít nhất một lần — nên số lần reset
vẫn thấy được sau khi làm lại.

### Sửa nội dung

- Câu hỏi và gợi ý: hằng `HOI` đầu khối script `961030-a`.
- **Ngày mở gợi ý:** hằng `MO_GOIY` (`961030-a`) — đổi mốc là cả hệ gợi ý mở/đóng theo,
  không phải sửa chỗ nào khác.
- Nội dung hộp: hàm `drawBox()` trong `961030-b`.
- **Mã VÀO bộ câu hỏi:** `PIN_A` (`HO CHI MINH`) bên A **và** biến `MA` bên `dad/950901-b` —
  hai chỗ phải khớp, xem mục 21h.
- Mã mở khoá Secret Chamber: sửa `PIN_B` bên A **và** `PIN` bên B cho khớp; gợi ý SOS của
  cửa B nằm ở hằng `GOIY`. PIN bảng điều phối: `PIN_CTRL` (`1959`), giống khu điều phối
  ngoài bản đồ.
- Nhãn hai hồ sơ trong khung HAN: mảng `NODES` + hàm `render()` bên `index.html`.

---

## 22b. PHÍA MÁY CHỦ — bốn endpoint và mọi biến môi trường

Cập nhật 19-Aug-2026. Đây là bảng DUY NHẤT về phía máy chủ; chỗ nào khác nói
khác thì tin bảng này.

### File nào làm gì

| File | Việc | Sửa nội dung ở đâu |
|---|---|---|
| `api/ping.js` | nhận tín hiệu tiến độ, bắn về Telegram/Discord | bảng `NHAN` ngay trong file |
| `api/chat.js` | khu Open World nói chuyện với Gemini | `api/_lib/tinhcach.md` |
| `api/quote.js` | lời chào + Daily Quote cho hộp Greetings | `api/_lib/loichao.md` |
| `api/thu.js`, `api/note.js` | nhận biểu mẫu / ghi chú | trong file |

Hai file `_lib/*.md` là **nơi sửa chữ nghĩa**; hai file `_lib/*.js` chỉ đọc
chúng lên. Thư mục có gạch dưới ở đầu nên Vercel không biến nó thành đường dẫn
công khai — trình duyệt không bao giờ tải được.

### Biến môi trường (Vercel → Settings → Environment Variables)

| Biến | Bắt buộc | Mặc định | Việc |
|---|---|---|---|
| `GEMINI_KEY` | có, nếu muốn Gemini chạy | — | khoá lấy ở aistudio.google.com |
| `GEMINI_MODEL` | không | `gemini-3.7-flash` | model cho khu Open World |
| `GEMINI_THINK` | không | `512` | trần token cho bước "suy nghĩ". `0` = tắt hẳn |
| `GEMINI_MODEL_QUOTE` | không | `gemini-flash-lite-latest` | model cho lời chào / quote |
| `CHAT_LOG_URL` | không | — | có thì đẩy nhật ký chat tới đó (POST JSON) |
| `CHAT_LOG_NOI_DUNG` | không | tắt | `1` = ghi cả nội dung câu hỏi/trả lời |
| `NOTIFY_KIND` | không | — | `telegram` \| `discord` \| `off` |
| `TG_TOKEN`, `TG_CHAT` | nếu telegram | — | bot và đoạn chat nhận tin |
| `NOTIFY_URL` | nếu discord | — | webhook của kênh |

**Không khai gì thì mọi thứ vẫn chạy** — chỉ là lời chào lấy câu sẵn, Open
World trả câu dự phòng, và tín hiệu tiến độ chỉ nằm ở tab Logs của Vercel.

### Nhật ký cuộc trò chuyện — đang ở đâu, đi tiếp thế nào

Mỗi lượt hỏi ghi đúng một dòng JSON có prefix `[CHAT_LOG]`. Dòng đó hiện ở
**tab Logs của Vercel** — gói Hobby giữ khoảng một tiếng rồi mất.

**KHÔNG có gì trong dự án này đẩy log về GCP.** Gọi Gemini chỉ là một request
HTTP; nó không sinh ra log nào bên Google Cloud. Muốn có thì phải tự nối, và
đường ngắn nhất là khai `CHAT_LOG_URL` trỏ tới một chỗ nhận:

1. **Google Apps Script → Google Sheets** — dễ nhất, không cần GCP.
   Tạo một Apps Script `doPost(e)` ghi `e.postData.contents` xuống Sheet, deploy
   dạng Web App (quyền: Anyone), rồi dán URL vào `CHAT_LOG_URL`.
2. **Cloud Run / Cloud Functions → Cloud Logging hoặc BigQuery** — đúng bài GCP.
   Viết một hàm nhận POST rồi `console.log` (tự vào Cloud Logging) hoặc
   `insertAll` vào BigQuery. Dán URL hàm đó vào `CHAT_LOG_URL`.
3. **Vercel Log Drain** — không cần sửa mã, nhưng cần gói Pro.

Mặc định nhật ký **chỉ ghi số liệu** (độ dài câu, thời gian, model, thành/bại,
số token) — KHÔNG ghi nội dung. Đoạn chat có chuyện riêng của hai người. Muốn
ghi cả nội dung thì bật `CHAT_LOG_NOI_DUNG=1`, cố ý bắt khai riêng một biến nữa
để không ai bật nhầm.

---

## 23. Bản đồ tài liệu — file nào nói chuyện gì

| File | Nói về |
|---|---|
| `README.md` (file này) | Luật chơi và kỹ thuật của **cả ba map**, design system, mọi bẫy đã vấp |
| `USER-FLOW.md` | Chỉ **điều hướng và pí danh**: khoá `nav1`, hai pha, redirect guard, bảng sự kiện đo đạc |
| `han/CHU-MAP3.md` | Chỉ **câu chữ của Map 3** — sửa lời thoại thì mở đúng file này, khỏi lục HTML |
| `dad/950901-a/MISSIONS.md` | Luật đầy đủ của hệ **3 Mission** trong hồ sơ DAD-950901-A |
| `dad/950901-a/README.md` | Cách deploy hồ sơ đó **tách riêng** một domain, và hệ đo đạc bốn tầng |

Quy ước để khỏi tam sao thất bản: **một chuyện chỉ nói ở một file**, chỗ khác thì trỏ
sang. Ví dụ luật khoá gợi ý Map 3 nằm ở mục 22 của file này, `CHU-MAP3.md` chỉ nhắc lại
đúng một hằng số cần sửa.

### Trạng thái kiểm thử (16-Aug-2026)

Bộ kiểm thử đầu-cuối chạy bằng Chromium headless, **không nằm trong repo** (nó là công cụ
dựng trang, không phải nội dung trang). Lượt chạy gần nhất: **31 bộ · 0 FAIL · 0 crash**,
cộng một lượt soát giao diện 8 trang × 6 cỡ màn (320 → 1280 px) báo *SẠCH*.

Phủ các luồng: chơi từ đầu tới phá đảo · ba Mission M1→M2→M3 · cửa hậu 10 nhịp và màn
Collected · pháo hoa + quả trứng · Gate 2 hai trạng thái · cửa mã `HO CHI MINH` · bộ câu hỏi
Map 3 và Secret Chamber · Clockwise · mọi đường reset.
