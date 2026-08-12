# Bản đồ tác chiến · Phi đoàn Dongchi Bình

Trang tĩnh, không build, không dependency. Mỗi file HTML tự chứa toàn bộ CSS/JS của nó.
Deploy thẳng lên Vercel từ GitHub.

**Phiên bản hiện tại: V15.03** — trạng thái GAME ON, cửa hai tầng của hồ sơ niêm phong.

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
│   └── note.js             ← bí danh của ping.js (đường chính, né bộ chặn)
│
├── han/
│   └── 261030/index.html   ← HAN-261030 · hồ sơ mốc 30-10 (trang tạm)
├── dad/
│   ├── 950901-a/           ← DAD-950901-A · hồ sơ đã xuất bản
│   │   ├── index.html
│   │   ├── vercel.json     ← chỉ dùng khi deploy tách riêng
│   │   ├── MISSIONS.md     ← luật chơi hệ 3 Mission
│   │   ├── README.md
│   │   └── api/            ← bản sao cho deploy tách riêng, monorepo không build
│   │       ├── ping.js
│   │       └── note.js
│   └── 950901-b/index.html ← DAD-950901-B · hồ sơ niêm phong (trang tạm)
├── uih/                    ← chưa có hồ sơ
└── sgn/                    ← chưa có hồ sơ
```

Vercel tự phục vụ `dad/950901-a/index.html` tại `/dad/950901-a`. Một sub-page = một thư
mục chứa đúng một `index.html`.

---

## 2. Bốn toạ độ

| Mã | Thành phố | Vai trò |
|---|---|---|
| `HAN` | Hà Nội | Mở hồ sơ `HAN-261030` khi vào pha tháng 10 |
| `DAD` | Đà Nẵng | Hai hồ sơ: `DAD-950901-A` (đã xuất bản) và `DAD-950901-B` (niêm phong) |
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
| `phase2` | 03-09 → 30-10 | 30-10 | HAN hiện hồ sơ `HAN-261030` |
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
| **Giới thiệu** | Bấm **10 cú liên tiếp** vào dòng Last updated | Khung giới thiệu người dựng trang (`#credw`, sửa nội dung ở `.cred-body`) |
| **Hack Map** | Trong Box Tổng tư lệnh, chọn chiến dịch rồi bấm **Hack Map** | Hộp PIN → nhập `1959`. Chữ `hackmap` gõ đúp đã bỏ, cơ chế PIN giữ nguyên |

Vùng bấm của cửa xoá sạch là **cả dòng bản quyền**, không chỉ lá cờ 15px — dễ trúng hơn
nhiều trên điện thoại. Khi đang đếm, **chỉ lá cờ sáng và phóng to nhẹ**, phần chữ giữ
nguyên.

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

Dòng **Last updated 08-Aug-2026 · V15.03** chạy dọc mép trái bản đồ (`.stamp`), tự ẩn khi
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

**Nhấp nháy tem:**

| Tình huống | Có nháy |
|---|---|
| Phiên đầu trong ngày, **chưa** từng mở khung giới thiệu | Có, mỗi ngày một lần |
| Đã mở được khung giới thiệu | Không nháy hằng ngày nữa |
| Vừa giải xong đủ 4 | Có, đúng một lần |

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

## 19b. Cửa sổ EASTER EGG — từ 00:00 ngày 01-09

Khi đồng hồ đếm ngược về 0, trang bước vào **cửa sổ Easter Egg** kéo dài `EGG_DAYS = 7`
ngày. Cổng vào là `eggOpen()`, mốc sinh ra từ `SEASON.birthday` + `SEA.year` — **không
hardcode năm**, đúng luật mục 8.

Có **hai đường mở sớm**, dùng để thử hoặc để trình diễn:

| Đường | Cách | Sống được bao lâu |
|---|---|---|
| `?egg=1` | thêm vào URL | chỉ trong lần tải trang đó (hằng `EGG_FORCE`) |
| **Hack Map · MAP-02** | Box Tổng tư lệnh → ô `MAP-02` → Hack Map → PIN `1959` | **vĩnh viễn**, cờ `eggHack` lưu trong `mtv1`, chỉ mất khi Reset MAP-01 |

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

### Cửa hai tầng của hồ sơ `DAD-950901-B`

Hồ sơ này gắn cờ `eggGate:true` trong `NODES` — nó thuộc về MAP-02, không phải MAP-01.

| Tình huống | Hiện ra sao | Bấm vào |
|---|---|---|
| Chưa Game On | Ổ khoá + đếm ngược tới 01-09 | Không phản hồi |
| Game On, **chưa** có điểm kích hoạt | **Bỏ ổ khoá**, meta ghi *"Đã mở khoá · chưa có điểm kích hoạt"* | Báo *"cần tìm điểm kích hoạt để hạ cánh"* |
| Game On, **đã** có điểm kích hoạt | Link thật | Bay thẳng vào `/dad/950901-b` |

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
