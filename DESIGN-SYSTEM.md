# DESIGN SYSTEM — bộ nút, biểu tượng và mấy quy ước dùng chung

> **File này để làm gì.** Trang này gồm bốn khu viết ở bốn thời điểm khác nhau
> (bản đồ mật thư · Easter Egg Gate 1 · Gate 2 · Zoey's Castle + Secret
> Chamber), mỗi khu một bảng màu riêng. Bảng màu khác nhau thì không sao — đó
> là chủ ý. Nhưng **cùng một việc thì phải cùng một cái nút**: bấm "xem lại"
> ở khu này ra hình con mắt, khu kia ra dấu ↺ gõ tay, khu nữa lại là một chữ
> "Xem lại" — người chơi phải học lại từ đầu ở mỗi màn.
>
> Đây là chỗ chốt: **việc nào thì hình nào**. Thêm nút mới thì tra bảng §1
> trước khi vẽ.

---

## 1. BỘ NÚT BIỂU TƯỢNG — RESET & XEM LẠI

**Bản gốc là bộ nút của HỘP PÍ MẬT** ngoài bản đồ (`index.html`, hàm `chips()`
— hai nút cuối hàng tab). Mọi chỗ khác chép theo bộ đó.

### 1.1 · Ba việc, ba hình — KHÔNG được dùng lẫn

| Việc | Hình | Tông | Nhãn chú thích mẫu |
|---|---|---|---|
| **Xem lại HIỆU ỨNG** (chạy lại màn ăn mừng, pháo hoa, cảnh nổ) | **cuộn phim** | xanh `#8BE0FF` | `Xem lại hiệu ứng ăn mừng` |
| **Xem lại NỘI DUNG** (câu trả lời, bối cảnh, khu Open World) | **con mắt** | tông chữ phụ của khu | `Xem lại câu trả lời` |
| **Chơi lại / Reset** (xoá tiến độ, làm lại từ đầu) | **mũi tên quay vòng** | cam-đỏ khi đã "lên cò" | `Chơi lại từ đầu` |

Vì sao tách *hiệu ứng* khỏi *nội dung*: hai việc này nghe giống nhau nhưng
hậu quả khác hẳn. Bấm nhầm nút hiệu ứng thì phải ngồi xem lại 15 giây pháo
hoa mới thoát ra được. Cho hai hình khác nhau thì không bấm nhầm.

### 1.2 · Mã SVG chuẩn (chép nguyên, đừng vẽ lại)

**Cuộn phim** — nét đặc, `fill:currentColor`:

```html
<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3.4 4.6h17.2a1.4 1.4 0 0 1 1.4 1.4v12a1.4 1.4 0 0 1-1.4 1.4H3.4A1.4 1.4 0 0 1 2 18V6a1.4 1.4 0 0 1 1.4-1.4Zm0 2.6v1.9h2.4V7.2H3.4Zm0 3.9v1.9h2.4v-1.9H3.4Zm0 3.9v1.9h2.4v-1.9H3.4Zm14.8-7.8v1.9h2.4V7.2h-2.4Zm0 3.9v1.9h2.4v-1.9h-2.4Zm0 3.9v1.9h2.4v-1.9h-2.4ZM7.6 7.2v9.6h8.8V7.2H7.6Z"/><path d="M10.4 9.4v5.2l4.2-2.6-4.2-2.6Z" fill="#0B1B3A"/></svg>
```

**Con mắt** — nét viền, `fill:none; stroke:currentColor; stroke-width:1.7`:

```html
<svg viewBox="0 0 20 20" aria-hidden="true">
  <path d="M1.8 10S4.9 4.6 10 4.6 18.2 10 18.2 10 15.1 15.4 10 15.4 1.8 10 1.8 10Z"/>
  <circle cx="10" cy="10" r="2.5"/>
</svg>
```

**Mũi tên quay vòng** — nét đặc, `fill:currentColor`:

```html
<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4.2V1.4L7.6 5.8 12 10.2V7.4a4.8 4.8 0 1 1-4.8 4.8H4.6A7.4 7.4 0 1 0 12 4.2Z"/></svg>
```

> **Bẫy đã vấp:** hai hình đặc và một hình viền nằm chung một nút. Nếu đặt
> `fill:currentColor` cho cả ba thì con mắt biến thành một quả trứng đen; nếu
> đặt `fill:none` cho cả ba thì cuộn phim và mũi tên biến mất sạch. Cách xử:
> CSS mặc định để **nét viền**, rồi cho riêng hai hình đặc một class `.fill`
> đảo lại. Xem `.done-ico button svg` bên `han/961030-a`.

### 1.3 · KHÔNG dùng ký tự gõ tay

Đừng viết `↺` `↻` `⟳` thẳng vào HTML nữa. Mỗi máy lấy một phông khác nhau
nên nét lúc dày lúc mảnh, cỡ lúc to lúc nhỏ, và trên vài máy Android thì
thành ô vuông rỗng. Đã sửa ở màn hoàn thành `han/961030-a`.

Ngoại lệ được phép: **nút có CHỮ đi kèm** (`↻ Reset`, `↻ Xáo bài chơi lại từ
đầu`). Đó là một loại nút khác — chữ đã nói rõ việc rồi, ký tự chỉ là trang
trí, hỏng phông cũng không ai hiểu nhầm. Chỉ nút CHỈ CÓ HÌNH mới bắt buộc SVG.

### 1.4 · Vỏ nút

Vỏ đi theo khu, hình thì đi theo bảng §1.1 — đó là chỗ được phép khác nhau.

| Khu | Vỏ | Ở đâu |
|---|---|---|
| Bản đồ · hộp pí mật | viên thuốc, nằm cuối hàng tab | `.cx-chip.rp` / `.cx-chip.rs` |
| Bản đồ · khung Collected | tròn 34px, không viền | `.cred-rp` |
| Easter Egg Gate 2 · màn phát mã | tròn 38px, viền mảnh | `.gate-look .ma-pair .ico-btn` |
| Zoey's Castle · màn hoàn thành | tròn 42px, viền mảnh | `.done-ico button` |

Vỏ nào cũng phải có: con trỏ `pointer`, `aria-label`, và **chú thích nổi khi
trỏ vào**. Nút chỉ có hình mà không có chú thích thì người chơi phải bấm thử
mới biết nó làm gì — mà một trong ba nút là nút XOÁ SẠCH.

### 1.5 · Chú thích nổi (tooltip)

Một khuôn dùng chung: `class="tip" data-tip="..."`, chữ hiện bằng `::after`,
mờ dần 0.18s. **Đặt phía DƯỚI nút** ở mọi khu — phía trên luôn là chỗ của
tiêu đề hoặc thẻ mã PIN, đè lên là che mất.

Nút reset khi đã "lên cò" (bấm lần một) thì **đổi luôn `data-tip`** thành
`Chắc chưa? Bấm lần nữa để xoá` và đổi cả `aria-label` cho khớp.

---

## 2. NÚT CÓ CHỮ

| Loại | Dùng khi | Kiểu |
|---|---|---|
| **Nút chính** | đường đi tiếp của màn (`Vào Secret Chamber ✦`, `▶ Bắt đầu giải mã`) | nền đặc / viền sáng, mỗi màn đúng MỘT nút chính |
| **Nút phụ (`ghost`)** | việc phụ, quay lại, reset có kèm chữ | viền mảnh, nền trong |
| **Cửa hậu** | chỉ hiện sau khi gõ đủ nhịp bí mật | tông xám / xanh nhạt, **không** được tranh chỗ với nút chính |

### 2.1 · NÚT CỦA BẢNG ĐIỀU KHIỂN — `.ops-btn`, khai MỘT chỗ

Bốn bảng điều khiển của bộ này — **Khối vận hành** (Gate 2, Zoey's Castle,
Secret Chamber), **Box Tổng tư lệnh** ngoài bản đồ, và khung **Collected:
Easter Egg** — dùng **chung một khuôn nút**, khai đúng một lần trong
`/assets/lichsu.js` (file duy nhất cả sáu trang đều nạp).

```html
<div class="ops-cot">                          <!-- xếp dọc, gap 8px -->
  <button class="ops-btn"     id="…">Lệnh chính</button>
  <button class="ops-btn phu" id="…">Lệnh phụ</button>
</div>

<div class="ops-hang">                          <!-- CHỈ khi hai lệnh ngang vai -->
  <button class="ops-btn"     id="…">Vặn kim</button>
  <button class="ops-btn phu" id="…">Về hiện tại</button>
</div>
```

| Lớp | Việc |
|---|---|
| `.ops-btn` | pill bo `999px`, **viền nét đứt**, nền rỗng, chữ Oswald `9.5px` giãn `.18em`, chữ hoa, rộng hết khối |
| `.ops-btn.phu` | cùng hình hài, nhạt hơn một bậc — quay lại / bỏ qua / về hiện tại |
| `.ops-cot` | khối dọc, khoảng cách nằm ở `gap` |
| `.ops-hang` | hàng ngang, **tối đa hai nút**; ba nút trở lên thì về hàng dọc |

**Màu tự đi theo trang.** Nút ăn `--ls-acc` khai ở `:root` của từng trang, nên
bản đồ ra amber, Zoey's Castle ra tím, Gate 2 ra xanh lá — cùng hình hài, đúng
tông từng khu. **Không** khai màu ở trang.

**⚠ BẪY ĐÃ VẤP — bộ chọn nặng ký hơn đè ngược khuôn chung.** `index.html` từng
có `.cred-acts button{…}`. Bộ chọn đó là *class + thẻ* (0,1,1), nặng hơn
`.ops-btn` (0,1,0), nên nó lặng lẽ thắng và khung Collected lại lạc ra một kiểu
riêng — đúng thứ vừa dọn đi. **Thêm bảng mới thì ĐỪNG viết lại kiểu dáng nút ở
trang của mình**; chỉ được đặt khoảng cách của khối bao ngoài.

**⚠ Icon trong nút phải là `inline-block`.** `.ops-btn` là khối, chữ căn giữa —
icon để `display:block` sẽ rơi xuống một dòng riêng, nhìn như hai thứ rời nhau.
Đã vấp ở `.egg-ico`.

---

## 3. TÊN GỌI — VIẾT ĐÚNG MỘT KIỂU

| Đúng | Sai — đừng viết lại |
|---|---|
| **Secret Chamber** | ~~Secret's Chamber~~ |
| **HongHan's Secret Chamber** (khi có tên) | ~~HongHan Secret Chamber~~ |
| **Zoey's Castle** | ~~Zoey Castle~~ |
| **Easter Egg: Gate 1** · **Easter Egg: Gate 2** | ~~Easter Egg 1~~ |
| **Honghandangiu** (ký tên) · **HongHan** (trong tên khu) | |

Quy tắc: có tên người đứng trước thì mới có `'s`. Đứng một mình thì là
**Secret Chamber**, không sở hữu cách.

---

## 4. TEM PHIÊN BẢN Ở CHÂN MÀN HÌNH

Mọi trang đều có một tem hai dòng ở chân màn hình, dòng ký tên **trên**, dòng
phiên bản **dưới**:

```
@Designed by Honghandangiu
Last updated DD-Mon-YYYY · Vxx.yy
```

**Số phiên bản LUÔN là `Vxx.xx` — đệm số 0, cả hai vế đúng hai chữ số.**

| Đúng | Sai |
|---|---|
| `V13.05` · `V23.09` · `V13.02` | ~~`V13.5`~~ · ~~`V23.9`~~ · ~~`V13.2`~~ |

> *Ví dụ ở bảng trên cố ý dùng `V13` và `V23` — hai dòng lớn bị **bỏ qua
> vĩnh viễn** theo luật đánh số. Nhờ vậy chúng KHÔNG BAO GIỜ trùng với số
> hiệu của một khu đang chạy, nên `nguon27` không đỏ. Ba lần trước dùng số
> thật thì cả ba lần đều đỏ khi khu đó lên tới đúng số ấy.*

Đời trước để lẫn cả hai kiểu — chỗ ghi `V02.02`, chỗ ghi `V3.02`, cùng một bảng
mà đọc xuống tưởng hai hệ đánh số khác nhau; sắp theo chuỗi thì `V10` đứng
trước `V2`. Nay chốt một khuôn, áp cho **cả tem ngoài trang lẫn cột Build trong
sổ**. Dòng gộp đệm cả hai đầu: `V01 → V21`, `V11 · V12`.

> **⚠ THỰC TẾ ĐANG CÓ HAI KHUÔN, đã soát từng trang.** Không phải lỗi mới phát
> sinh — mỗi trang dựng một thời điểm khác nhau. Ghi ra đây để sửa tem thì biết
> đường mà tìm, **đừng nắn cho giống nhau**: mỗi trang có hàm dựng tem riêng,
> đổi khuôn là phải sửa cả hàm đó, được cái đẹp mà mất cả buổi dò lỗi.
>
> | Trang | Thẻ | Khuôn thật đang dùng |
> |---|---|---|
> | Bản đồ mật thư | `#stamp` + `data-base` **và** chữ giữa thẻ | `Last updated … · Vxx.yy` |
> | Hồ sơ Phi đoàn | `#vstamp`, **không có** `data-base` | `Vxx.yy<br>Last updated …` |
> | Easter Egg · Gate 2 | `config.js` → khoá `version` | `Last updated … · Vxx.yy` |
> | Zoey's Castle | `#stamp` + `data-base` | `Vx.yy<br>Last updated …` |
> | Secret Chamber | `#stamp` + `data-base` | `Vx.yy<br>Last updated …` |
> | Màn pháo hoa | `#vstamp`, chữ tĩnh | chỉ có `Vx.yy` |
- Phông `Oswald`, cỡ 8px, giãn chữ `.15em`–`.22em`, VIẾT HOA, màu mờ ~32%.
- Tem **không phải** cửa vào sổ phiên bản. Sổ nằm trong **bảng điều khiển** của
  từng trang — xem §5.

### 4.1 · SỔ LÀ NGUỒN SỰ THẬT — ĐỪNG KHAI SỐ Ở HAI CHỖ

**Số hiệu và ngày của một trang chỉ được khai ĐÚNG MỘT NƠI: cuốn sổ của chính
trang đó trong `assets/lichsu.js`.**

- **Số hiệu** = nấc đuôi mới nhất của dòng mới nhất (`doi[cuối].chi[cuối].ver`,
  không có `chi` thì lấy `doi[cuối].ver`).
- **Ngày** = cột **`sua`** (ngày sửa cuối) của chính dòng đó, đổi sang
  `DD-Mon-YYYY`. Không có `sua` thì lấy `ngay`.

> **⚠ HAI CỘT NGÀY, ĐỪNG LẪN.**
> `ngay` = **mốc ghi nhận** — ngày của bản `.00` đầu tiên, tức lúc build bắt
> đầu. Đây là thứ **bảng bản ghi in ra**.
> `sua` = **ngày sửa cuối** — thứ **tem "Last updated" in ra**.
> Luật này áp cho **cả bảy sổ trên mọi trang** mà không cần chép lại ở đâu:
> bảng chỉ có **một hàm dựng** (`veSo()` trong `assets/lichsu.js`), bảy sổ dùng
> chung. `tem16.mjs` mục ⑥ soi từng dòng của cả bảy — 40 dòng — để chắc bảng
> không bao giờ lỡ in nhầm cột `sua`.
> Một build lớn kéo dài nhiều ngày nên hai cột này khác nhau là bình thường:
> sổ Hồ sơ Phi đoàn hiện ghi mốc `24-Aug` trong khi tem là `25-Aug`.

`LichSu.tem('<mã sổ>')` trả về `{ ver, ngay, iso }`. Tem ngoài trang và thẻ toạ
độ ngoài bản đồ **đều gọi hàm này**.

> **⚠ BỆNH ĐÃ SỬA — ĐỌC TRƯỚC KHI RA PHIÊN BẢN MỚI.**
> Ba đợt liền số hiệu được bump mà **ngày đứng im ở 24-Aug**, vì hai thứ đó
> nằm hai chỗ: số sửa ở sổ, ngày nằm trong một chuỗi cứng trong HTML. Sửa một
> quên một là chuyện sớm muộn — và nó đã xảy ra ba lần liên tiếp mà không ai
> thấy.
> Thẻ toạ độ còn tệ hơn: Zoey's Castle hiện `V2` trong khi trang đã đi thêm
> năm nấc lớn — số trên thẻ đứng nguyên từ đời V02.
>
> *(Kể chuyện cũ thì ĐỪNG chép số hiệu thật vào — hôm nay là chuyện cũ, mai
> lại trùng đúng số một khu đang chạy. Bộ kiểm `nguon27` cấm tài liệu chứa số
> hiệu hiện hành, và nó đã đỏ đúng ở câu này.)*

**Chuỗi cứng trong HTML vẫn giữ**, nhưng chỉ là **bản lùi** cho trường hợp
`lichsu.js` không tải nổi. Nó **phải khớp sổ**, và có bộ kiểm soát đúng chuyện
đó — lệch là báo đỏ ngay (`tem16.mjs`, mục ② và ④).

| Chỗ | Lấy số từ đâu | Bản lùi |
|---|---|---|
| Tem bản đồ | `LichSu.tem('MAP')` trong `stampText()` | `#stamp[data-base]` |
| Tem Hồ sơ Phi đoàn | `LichSu.tem('DAD-A')`, script cuối trang | chữ tĩnh trong `#vstamp` |
| Tem Gate 2 | `LichSu.tem('DAD-B')` trong `temChu()` | `config.js` → `text.version` |
| Tem Zoey's Castle | `LichSu.tem('HAN-A')` trong `stampText()` | `#stamp[data-base]` |
| Tem Secret Chamber | `LichSu.tem('HAN-B')` trong `stampText()` | `#stamp[data-base]` |
| Thẻ toạ độ ngoài bản đồ | `verCua()` → `LichSu.tem(...)` | `ver:` / `meta:` trong `NODES` |
| **Màn pháo hoa** | **không nạp `lichsu.js`** → chữ tĩnh | vẫn phải khớp sổ `FX` |

**Thẻ toạ độ**: `pub` là **ngày phát hành**, một sự thật khác — giữ nguyên,
đừng đổi theo. Chỉ phần `| Vxx.yy` mới lấy từ sổ.

> **⚠ `meta:` KHÔNG ĐƯỢC ÔM SỐ HIỆU.** Thẻ còn khoá khai `meta:'Published
> date: …'` — **chỉ phần ngày**, số hiệu nằm ở `ver:` và do `metaKhoa()` nối
> vào. Trước đây `meta` ôm luôn cả `| Vxx.xx` rồi mới bị thay bằng số của sổ:
> thẻ hiện ra thì đúng, nhưng chuỗi trong `NODES` lặng lẽ mốc lại từng đợt, và
> chính nó là bản lùi khi `lichsu.js` không tải nổi. Một số hiệu, một chỗ khai.

### 4.2 · Ra một phiên bản mới thì làm gì

1. Thêm nấc đuôi vào `chi` của dòng mới nhất trong sổ của trang đó.
   Hết nấc `.09` thì mở dòng lớn kế tiếp (bỏ qua 13, 14, 23).
2. **Sửa `sua` của dòng đó sang hôm nay.** Đây chính là bước hay quên.
   `ngay` thì **giữ nguyên** — đó là mốc build mở màn, không đổi theo.
   Mở dòng lớn MỚI thì `ngay` = hôm nay (vì `.00` chính là hôm nay).
3. Nắn lại chuỗi cứng bản lùi cho khớp (tem + thẻ toạ độ). Đủ **bảy** chỗ:
   `index.html` (`#stamp[data-base]` và `ver:` của bốn thẻ trong `NODES`),
   `dad/950901-a` (`#vstamp`), `dad/950901-b/config.js` (`text.version`),
   `han/961030-a` và `han/961030-b` (`#stamp[data-base]`), `phao-hoa`
   (`.vstamp` — trang này **không** nạp `lichsu.js`).
4. Chạy `tem16.mjs` — 16 phép, lệch một chỗ là đỏ.

---

## 5. CỬA HẬU

Trang có mấy cửa hậu, tất cả theo cùng một luật: **gõ N nhịp liên tiếp, mỗi
nhịp cách nhau dưới 0,9 giây**; quá giờ thì đếm lại từ đầu.

| Chỗ | Nhịp | Mở ra |
|---|---|---|
| Dòng bản quyền ngoài bản đồ | 5 | Box Tổng tư lệnh |
| Bông hoa + tem `han/961030-a` · `-b` | 5 | Khối vận hành |
| Tem màn cổng Gate 2 | 10 | nút bỏ qua vào thẳng màn cuối |
| Một nấc trên dòng Mission `dad/950901-a` | 10 | cửa test mở khoá nấc đó |
| Dòng câu hỏi `han/961030-a` | 5 | bỏ qua màn chờ |

### 5.1 · SỔ PHIÊN BẢN — cửa hậu TẦNG HAI

Sổ phiên bản **không có đường vào riêng**. Nó nấp sau bảng điều khiển đã có sẵn
của từng trang, thêm một tầng nữa:

```
mở bảng điều khiển của trang (cửa hậu cũ, không đổi gì)
  → bấm 3 nhịp vào CỬA ẨN trong bảng
  → gõ mã 0981
  → hiện sổ CỦA RIÊNG TRANG ĐÓ
```

**"Của riêng trang đó" là luật cứng.** Đứng ở Zoey's Castle thì chỉ thấy lịch
sử của Zoey's Castle. Sáu cuốn sổ nằm chung một file cho dễ sửa, nhưng không
bao giờ hiện chung một bảng.

| Sổ | Cửa ẩn nằm ở | Mã |
|---|---|---|
| Bản đồ mật thư | **mặt cười** cạnh "Chọn chiến dịch" trong Box Tổng tư lệnh | `MAP` |
| Easter Egg · Gate 1 | **dòng tiêu đề** *Collected: Easter Egg* trên bản đồ | `EGG` |
| Hồ sơ Phi đoàn | **dòng tiêu đề** *Mission 3 · Phá đảo* của chính hộp đó | `DAD-A` |
| Easter Egg · Gate 2 · cả hai màn | chữ **"Khối vận hành"** trong bảng Khối vận hành | `DAD-B` |
| Zoey's Castle · Secret Chamber | chữ **"Khối vận hành"** trong Khối vận hành | `HAN-A` · `HAN-B` |
| Màn pháo hoa | *chưa có bảng nào* → chưa gắn | `FX` |

> **⚠ `EGG` và `DAD-A` là HAI SỔ KHÁC NHAU, đừng gộp.**
> `EGG` là khu Easter Egg / Gate 1 **nhìn từ bản đồ** — lúc nào khu mở ra, băng
> rôn dẫn sang, khung Collected, màn pháo hoa, đường nối sang lâu đài.
> `DAD-A` là **bản thân trang** `/dad/950901-a`, tự xưng **"Hồ sơ Phi đoàn"**
> ngay ở thẻ `<title>` — hồ sơ 3 Mission, cửa mã, đồng hồ.
>
> **Lấy tên sổ theo `<title>` của trang, đừng lấy theo tên khu chơi bao ngoài.**
> Đã ghi nhầm `DAD-A` thành "Easter Egg · Gate 1" một đời rồi.

Gate 2 gộp hai màn làm một dòng vì cả màn cổng lẫn màn phát mã nay cùng đi qua
một bảng Khối vận hành duy nhất (10 nhịp vào tem ở chân màn hình mới ra bảng).

**CỬA LÀ CHỮ, KHÔNG BAO GIỜ LÀ ICON.** Nút tròn `.ls-key` của đời trước đã bỏ
hẳn. Nó sai ở hai chỗ: bảng nào cũng đã có sẵn một dòng chữ nói đúng tên chỗ
đó, đẻ thêm một nút cạnh nó là hai thứ cùng trỏ một việc — mà cái nút thì không
nói được nó làm gì, phải bấm thử mới biết; và một nút tròn viền sáng đứng chình
ình thì hết còn là cửa hậu.

**Chọn chữ nào làm cửa — theo đúng thứ tự này:**

| Chỗ đặt | Lấy chữ nào | Ví dụ |
|---|---|---|
| Bảng có **Khối vận hành** | chính chữ **"Khối vận hành"** | `han/961030-a` · `-b` · Gate 2 |
| Bảng không có Khối vận hành | **tiêu đề của chính hộp đó** | `dad/950901-a` — dòng *Mission 3 · Phá đảo* |
| Không có bảng nào để đặt | một thứ **đã có sẵn** ở đó (mặt cười, dòng tem) | bản đồ — mặt cười cạnh *Chọn chiến dịch* |

Tuyệt đối **không vẽ thêm một cái icon mới** cho việc này. Mỗi trang một kiểu
thì mò ra được ở chỗ này cũng chẳng giúp gì cho việc mò ra chỗ kia.

**Cách gắn:** `LichSu.chu('MAP')` trả về mẩu thuộc tính `class="ls-chu"
data-ls="MAP"` — nhét vào thẻ chữ đang có, không đẻ thêm thẻ nào:

```html
<p class="ov-lab"><span class="ls-chu" data-ls="HAN-A">Khối vận hành</span></p>
```

Chỗ nào dòng chữ đã có thẻ riêng (như `#msnLab`) thì gắn thẳng bằng JS:
`el.classList.add('ls-chu'); el.setAttribute('data-ls','DAD-A')`.

**Dấu hiệu duy nhất là lúc TRỎ VÀO:** chữ ăn `--ls-acc` của trang, lên một
quầng sáng mỏng rồi **nháy chậm** (1,15s, `opacity` 1 ↔ .42). Đứng yên thì
không có gì cả — không viền, không nền, **không con trỏ bàn tay**. Bấm trúng
một nhịp thì chữ sáng đứng 200ms cho biết cú bấm ăn, nhưng **không đếm hộ còn
mấy nhịp**. `prefers-reduced-motion` thì tắt nháy, chỉ còn đổi màu.

**Cửa mã gần như không nói gì.** Không nhãn "4 chữ số", không báo sai, không
đếm hộ còn mấy lần. Phản hồi khi gõ sai chỉ là một cú rung: đủ để biết máy có
nhận cú gõ, không đủ để suy ra gì.

**Gợi ý: sai đủ 5 lần thì hiện, và chỉ đúng một câu — "Năm sinh Bác Hồ".**
Đời trước viết dài hơn: *"Năm sinh Bác Hồ — soi gương mà đọc."* Vế sau mới là
chỗ hỏng — nó nói toẹt ra rằng phải **đọc ngược**, tức cho không nốt bước suy
luận cuối cùng. Cắt đi thì ba chữ còn lại chỉ đưa tới con số 1890; từ 1890 ra
mã vẫn phải tự nghĩ. Đó là mức đúng của một gợi ý: gỡ bí, không giải hộ.

**Bộ đếm sai cộng dồn TRONG PHIÊN, đóng trình duyệt là xoá** (`sessionStorage`).
Để biến thường thì đóng hộp mở lại là về 0, mãi không tới nấc; để
`localStorage` thì nhớ qua nhiều tháng, con số ngưỡng mất hết nghĩa. Riêng cờ
**đã mở gợi ý** thì ở `localStorage` — trả giá một lần là đủ, những lần mở sau
hiện sẵn từ đầu, và mãi mãi chỉ một câu đó.

Cũng đừng viết dòng "bấm 3 nhịp vào… để xem bản ghi" ở bảng chứa cửa. Mò ra
được bảng rồi mà tầng thứ hai lại chỉ sẵn đường thì mất luôn tầng đó. Bảng cần
một dòng cho đỡ trống thì viết **trạng thái của màn chơi** (*"Tiến độ: 3/6"* ·
*"Trạng thái: đã phá đảo"*) — nói về game, không nói về cửa.

### 5.2 · Hộp sổ mượn màu của trang đang đứng

Hộp **không có bảng màu riêng**. Mọi màu đọc từ sáu biến, trang nào khai đè thì
hộp mang màu trang đó:

```css
:root{
  --ls-bg:  /* nền hộp */      --ls-fg:   /* chữ chính */
  --ls-mo:  /* chữ phụ */      --ls-line: /* đường kẻ */
  --ls-acc: /* màu nhấn */     --ls-w:    /* bề ngang, mặc định min(340px,92vw) */
}
```

> **BẪY ĐÃ VẤP.** Bản đầu khai bộ màu mặc định bằng một khối `:root{...}` ngay
> trong CSS của `lichsu.js`. Hỏng: file đó gắn `<style>` vào cuối `<head>`, tức
> nạp SAU toàn bộ CSS của trang; hai khối `:root` cùng độ ưu tiên thì khối sau
> thắng — nên trang khai màu pastel xong vẫn ra hộp tối thui. Nay giá trị dự
> phòng nằm trong chính `var(--x, dự-phòng)`, trang khai thì trang thắng.

**Bề ngang bám theo thẻ hẹp nhất trong bộ (340px)**, không phải rộng hơn khung
trang. Hộp bung ra to hơn cả khung màn hình là lỗi đã báo.

**Ảnh cô AI vắt lên trên mép hộp thì hộp KHÔNG được `overflow`** — cuộn giao
cho một lớp con. Để `overflow` ở hộp là đầu cô bị xén ngang.

### 5.3 · THANH KÉO — mọi vùng cuộn trong bộ này dùng chung một kiểu

**Đừng để thanh cuộn mặc định của trình duyệt.** Trên Windows nó là một máng
xám dày 17px có hai nút mũi tên hai đầu, dán thẳng vào mép phải một cái hộp bo
góc — và nó mang màu của hệ điều hành chứ không mang màu của trang, nên cùng
một hộp mà ở khu pastel thì nó xám, ở khu tối thì nó sáng. Nhìn ra ngay là một
mẩu trình duyệt lọt vào giữa một khung vẽ tay.

**Bản gốc là mấy khung đọc THƯ** (`.letterbox` bên Gate 2, `.wrap` bên Zoey's
Castle): không máng, không nút, chỉ có chữ trôi và mép nhoà dần. Mọi vùng cuộn
khác chép theo, thêm một nấc — xem `.ls-than` trong `/assets/lichsu.js`:

```css
.vung-cuon{
  overflow-y:auto; overflow-x:hidden;          /* KHÔNG bao giờ cuộn ngang */
  scrollbar-width:thin;                         /* Firefox */
  scrollbar-color:var(--acc) transparent;
  padding-right:6px; margin-right:-6px;         /* chừa chỗ cho thanh, không đội chữ */
  -webkit-mask-image:linear-gradient(to bottom,
    transparent 0, #000 var(--tren,0px),
    #000 calc(100% - var(--duoi,0px)), transparent 100%);
}
.vung-cuon::-webkit-scrollbar{width:4px}
.vung-cuon::-webkit-scrollbar-track{background:transparent}
.vung-cuon::-webkit-scrollbar-thumb{
  border-radius:999px;
  background:color-mix(in srgb, var(--acc) 34%, transparent)}
.vung-cuon:hover::-webkit-scrollbar-thumb{
  background:color-mix(in srgb, var(--acc) 62%, transparent)}
```

Bốn điều bắt buộc:

1. **Thanh mảnh 4px, KHÔNG máng.** Máng để trong suốt hẳn — nền hộp chạy liền
   một mạch tới mép.
2. **Tay kéo mượn màu nhấn của khu**, đục 34%, bo tròn hết cỡ nên đọc ra là một
   nét bút chứ không phải một cái nút. Trỏ vào thì đậm lên 62%.
3. **Hai mép nhoà CÓ ĐIỀU KIỆN.** Mép trên chỉ nhoà khi đã cuộn xuống, mép dưới
   chỉ nhoà khi còn chữ phía dưới. Nhoà sẵn cả hai là dòng tiêu đề mờ tịt ngay
   từ lúc mở — trông như bị cắt cụt chứ không phải như "còn nữa ở dưới". Hai
   biến `--tren` / `--duoi` do JS bật tắt theo `scrollTop`.
4. **Không bao giờ cuộn NGANG.** Bảng nhiều cột thì bó cột cho vừa bề ngang
   hộp, đừng đẩy sang thanh cuộn ngang.

### 5.4 · Cột "#" đếm gì

Mỗi dòng trong sổ là **MỘT BUILD LỚN** (V9, V10, V15…), không phải một bản vá.
Cột `#` là **số bản vá ghi lại được trong build đó** — `V10.08` nghĩa là 09 bản.
Không biết thì ghi **`thiếu info`** và **giữ nguyên số build**.

Cột "Sửa chính" chỉ ghi **loại việc người chơi nhìn thấy được** (*chỉnh hiệu
ứng · chỉnh hiệu ứng pháo hoa nổ · chỉnh khung màn · chỉnh luật chơi · chỉnh
luật gợi ý · đồng bộ hệ nút · cập nhật giao diện · làm lại chuyển cảnh*).
Sổ này người chơi mở ra đọc được, nên tuyệt đối không ghi mã, đáp án, tên biến
môi trường hay tên endpoint.

> **⚠ VÀ KHÔNG MỘT CHỮ NÀO về đo đạc · theo dõi · ghi nhận · bắn số liệu về ·
> lưu trữ.** Không *"thêm đo đạc"*, không *"cập nhật API"*, không *"nạp trước
> tài nguyên"*. Người chơi đang đọc một cuốn sổ trong game, không phải tài liệu
> kỹ thuật — và cũng không cần biết trang có ghi lại gì hay không.
> Đời trước lỡ ghi *"thêm đo đạc"* ở ba chỗ, đã gỡ hết.

---

## 6. Ô NHẬP PIN / PASS — BA LUẬT CHUNG

Cả bộ có **bảy cửa mã**: bảy cuốn sổ bản ghi (dùng chung `assets/lichsu.js`),
ô PIN hồ sơ ngoài bản đồ, cửa Mission 2 và Mission 3 bên Hồ sơ Phi đoàn, cửa
vào Zoey's Castle, cửa vào Secret Chamber, và hai bảng điều phối. Trước đây mỗi
chỗ một nết. Nay cả bảy đi theo đúng ba luật dưới đây — thêm cửa mới thì chép
đủ ba, đừng bịa luật thứ tư.

### 6.1 · Gõ đủ ký tự là TỰ CHẤM

Không bắt bấm `Enter`. Gõ xong ký tự cuối là hệ thống tự chấm **một lần**.

> **⚠ ĐÃ THỬ BẮT BẤM ENTER, ĐÃ GỠ.** Một đời trước bắt phải Enter mới tính là
> gửi, kèm một dòng nhắc *"Nhấn Enter để vào"* dưới hàng ô. Cái được thì nhỏ —
> đỡ một cú bấm nhầm phím cuối — mà cái mất thì thấy ngay: thêm một dòng chữ
> chen vào giữa mấy dòng đã có (chữ dẫn, gợi ý, dòng báo sai), hộp nào cũng dài
> ra một nấc. Gõ sai vài lần thì người ta tự cẩn thận, khỏi cần luật.
> Đừng dựng lại dòng nhắc đó, cũng đừng dựng lại dấu `↵` cạnh hàng ô (đời trước
> nữa đã thử: ký hiệu trần phải đoán mới hiểu, mà thêm một ô vào hàng thì hàng
> ô lệch tâm).

**Nhưng đừng chấm ngay lúc phím cuối vừa xuống.** Chấm đúng vào nhịp ký tự cuối
vừa thành chấm — tức là dùng chung một cái hẹn giờ với luật §6.2:

```js
/* Trình duyệt TỰ KHAI cú nhập này từ đâu ra — không phải đoán nữa */
function laGoTay(e){
  if(!e || !e.isTrusted) return false;                   /* tự điền: isTrusted = FALSE */
  const t = e.inputType;
  if(t === 'insertText') return (e.data || '').length === 1;
  return t === 'insertCompositionText';                  /* bàn phím Android gõ qua đây */
}
function laXoa(e){ return !!(e && e.isTrusted && /^delete/.test(e.inputType || '')); }

const CHOT_MS = 420;              /* nhịp của ký tự CUỐI — ngắn hơn HIEN_MS */
let nguyenGo = true, daiTruoc = 0;

function veRoiChe(e){
  const truoc = daiTruoc; daiTruoc = go.length;
  if(!go.length) nguyenGo = true;                        /* ô rỗng thì kể như sạch */
  else if(!laXoa(e) && !laGoTay(e)) nguyenGo = false;    /* dán / tự điền vào đây */
  const i = go.length - 1;
  if(henChe){ clearTimeout(henChe); henChe = null; }
  ve(i);                                                 /* hiện rõ ký tự vừa gõ */
  if(i < 0) return;
  const chot = go.length === len && go.length === truoc + 1
               && nguyenGo && laGoTay(e);
  henChe = setTimeout(()=>{
    henChe = null; ve(-1);                               /* thành chấm */
    if(chot && go.length === len && inp.isConnected) cham();
  }, chot ? CHOT_MS : HIEN_MS);
}

/* Ô nhập LUÔN BẰNG ĐÚNG hàng ô — nếu không, xoá một cái có thể chẳng rụng ô nào */
inp.addEventListener('input', e => {
  go = norm(inp.value).slice(0, len);
  if(inp.value !== go) inp.value = go;
  veRoiChe(e);
});
```

Nhờ vậy bao giờ cũng đủ một nhịp để nhìn thấy mình vừa gõ gì rồi cửa mới phản
ứng: **thấy chữ → chữ thành chấm → cửa trả lời**. Chấm ngay lúc phím xuống thì
mất hẳn nhịp giữa, người gõ không kịp biết mình bấm trúng phím nào.

**Vẫn nhận phím `Enter`** cho ai quen bấm — bấm là huỷ hẹn giờ, che ngay rồi
chấm luôn, khỏi phải chờ hết nhịp. `Enter` **không hỏi han gì**: dán hay tự
điền vào rồi bấm `Enter` thì vẫn gửi. Đó là đường thoát duy nhất, phải giữ.

Chỗ **không che chữ** (ô trả lời câu hỏi bên Zoey's Castle) thì không có nhịp
hiện-rồi-che để bám vào, nên dùng một hẹn giờ riêng (`CHO_CHAM`, 620ms) — vẫn
là chờ một nhịp cho mắt đọc lại cả hàng ô trước khi chấm. **Ba luật dưới đây
vẫn phải có ở đó**: ô đó dùng chung `#inp` với cửa mã của chính trang, nên
trình duyệt rất sẵn lòng nhét mã cửa vào ô trả lời.

#### ① HỎI TRÌNH DUYỆT, ĐỪNG ĐOÁN

> **⚠ HAI ĐỜI BỆNH, MỘT GỐC. ĐỌC TRƯỚC KHI ĐỘNG VÀO `veRoiChe`.**
> · *"nhập sai, bấm lại một cái là pin tự điền luôn, mất một lèo ba lượt"*
> · *"nhấn sai → nhấp 1 ký tự 2 lần → hiện lại đáp án sai → mất 2 lượt; gõ lại
>   thì chậm, lag, có lần lag ở ký tự cuối lag cả dãy"*
>
> Đời trước **đoán bằng độ dài**: "ô dài thêm đúng một ký tự thì là người gõ".
> Đoán được cú tự điền thật, nhưng đoán sai ở đủ chỗ khác — sửa một ký tự giữa
> một ô đã đầy cũng là "+1", thế là gửi đi cái đáp án mình không định gửi. Lại
> còn phải khoá đường tự chấm 900ms sau mỗi lần sai để chặn dây chuyền, và
> chính 900ms đó là cái lag người chơi kêu.

Sự kiện `input` **tự khai** mình từ đâu ra — đo thật trên Chromium:

| Kiểu nhập | `inputType` | `isTrusted` | `data` |
|---|---|---|---|
| **gõ tay** | `insertText` | **true** | đúng 1 ký tự |
| gõ tay (bàn phím Android) | `insertCompositionText` | **true** | — |
| xoá | `deleteContentBackward` | true | `null` |
| dán | `insertFromPaste` | true | cả cụm |
| tự điền — trình quản lý mật khẩu | **không có** | **false** | — |
| tự điền — Chrome | `insertReplacementText` | **false** | cả cụm |

`isTrusted` là cờ của chính trình duyệt, **mã trang không giả được**. Nên cú tự
điền bị loại từ gốc — khỏi cần khoá thời gian, khỏi cần lag.

#### ② CẢ CỤM PHẢI DO CHÍNH TAY NGƯỜI CHƠI GÕ RA

Chốt ① một mình chưa đủ: dán/tự điền vào rồi **sửa một ký tự** thì ký tự cuối
đó *vẫn là* một cú gõ tay thật. `nguyenGo` nhớ nguồn gốc của cả cụm đang nằm
trong ô — dính một cú dán hay một cú tự điền là mất cờ, và chỉ dọn sạch ô mới
lấy lại được. Muốn gửi thì bấm `Enter`.

#### ③ Ô NHẬP LUÔN BẰNG ĐÚNG HÀNG Ô

> **⚠ BỆNH ĐÃ SỬA:** *"xoá đáp án cũng khó khăn/lag/chậm"*.
> Mấy ô pass đời trước chỉ **đọc** `inp.value` ra `buf` mà không ghi ngược lại,
> nên ô nhập ngầm chứa cả thứ `norm()` vừa vứt đi — dấu cách, chữ có dấu, và cả
> phần gõ lố quá số ô. Bấm xoá một cái là mất một ký tự **vô hình**, hàng ô
> đứng im: người chơi tưởng máy đơ, bấm thêm mấy cái nữa.
> Mấy ô PIN không dính vì chúng vốn đã ghi ngược — đúng như người chơi kể,
> *"pin khá ok mà pass/đáp án khá khó chịu"*.

Ô nhập vô hình (`opacity:.01`) nên **không ai thấy con trỏ** — ghi đè `.value`
hoàn toàn an toàn về mặt nhìn.

#### Nhịp: ký tự cuối ngắn hơn ký tự giữa

`HIEN_MS` 800ms cho ký tự giữa, `CHOT_MS` **420ms** cho ký tự cuối. Lúc gõ nốt
ký tự cuối thì mắt đang dán vào ô chờ cửa trả lời — bắt chờ đủ 800ms nữa là
thành đơ. Đo thật: **ký tự cuối → cửa trả lời, 763ms xuống còn 384ms.**

#### Ô nhập phải chối bộ nhớ mật khẩu của trình duyệt

Mọi ô mã khai đủ bốn thứ này — thiếu cái nào `tudien18.mjs` báo đỏ:

```html
<input autocomplete="off" data-lpignore="true"
       data-form-type="other" data-1p-ignore ...>
```

> **⚠ ĐỪNG DÙNG `autocomplete="one-time-code"`.** Nghe đúng nghĩa mà lại là
> thứ khiến iOS tự điền hăng nhất — nó bật hẳn gợi ý mã trên bàn phím. Cửa
> Mission từng khai vậy và chính là chỗ bệnh nặng nhất.

### 6.2 · Thấy mình gõ gì rồi mới thành chấm

Ký tự **vừa gõ** hiện nguyên hình `800ms` rồi mới thành `•`. Mấy ô trước đó
che luôn.

Che ngay từ phím đầu thì gõ nhầm một ký tự là phải xoá cả dòng mò lại, vì
chẳng biết nhầm ở ô nào. Mà nhìn xuống hàng ô cũng chỉ đọc được đúng một ký tự
cuối, người đứng sau lưng không kịp đọc cả mã.

```js
var HIEN_MS = 800, henChe = null;
function ve(iRo){                        /* iRo = ô được hiện rõ, -1 là che hết */
  for(var i = 0; i < o.length; i++)
    o[i].textContent = go[i] ? (i === iRo ? go[i] : '•') : '';
}
function veRoiChe(){
  var i = go.length - 1;
  if(henChe) clearTimeout(henChe);
  ve(i);
  if(i >= 0) henChe = setTimeout(function(){ ve(-1); }, HIEN_MS);
}
```

Gõ sai xoá sạch thì gọi `ve(-1)`, đừng gọi `ve()` trống — hàm nay có tham số.

**Ngoại lệ · phần câu hỏi bên Zoey's Castle**: đó là *đáp án đang soạn*, không
phải mật mã, và màn xem lại còn phải in ra đọc được. Chỗ đó không che gì cả.
Luật 6.1 thì vẫn áp.

### 6.3 · Cửa đã khoá thì lần nào vào cũng hỏi

Không có cửa nào tự mở sẵn vì *"vừa nãy mới vào"*. Đã dựng ra để hỏi mã thì lần
sau quay lại vẫn phải gõ.

Ba cái cờ nhớ đã gỡ, ghi lại đây cho khỏi ai dựng lại:

| Cờ cũ | Ở đâu | Từng cho đi thẳng |
|---|---|---|
| `ls_ok_<mã>` (sessionStorage) | `assets/lichsu.js` | mở sổ một lần → cả phiên khỏi hỏi |
| `pinFiles[id]` (localStorage) | `index.html` | mở hồ sơ một lần → mãi mãi khỏi hỏi |
| `st.aOpen` / `st.bOpen` | `han/961030-a`, `han/961030-b` | gõ đúng một lần → mãi mãi khỏi hỏi |

Ba cờ đó **vẫn ghi** (bảng điều phối và thống kê còn đọc), chỉ là không còn
quyền mở cửa hộ. Tệ nhất trong ba: trang Zoey's Castle từng bật sẵn `bOpen`
ngay lúc bấm nút "Vào Secret Chamber" — đi đường đó thì **chưa bao giờ** phải
gõ mã, ô mã thành ra chỉ để trang trí.

Cái KHÔNG phải cửa, đừng đem luật này vào: **mốc đã phá đảo** (`st.m2`,
`st.m3`, `eggWin`…) là thành tích, xong rồi thì thôi, không bắt làm lại.

---

## 7. TRANG CREDIT — GHI LẠI ĐỒ ĐI MƯỢN

**Cửa vào:** chữ `@Credit` nằm cuối dòng *"ĐANG CHẠY Vxx"* trong chính bảng bản
ghi, căn phải. Cùng lối với mọi cửa vào bản ghi: **chữ thường, trỏ vào thì đổi
màu** — không icon, không viền, không nút.

Mỗi trang một trang credit riêng, dựng từ hai mảng trong `assets/lichsu.js`:

- `CRE_CHUNG` — thứ cả bộ đều xài (viết mã, phông chữ, chỗ chạy, ảnh động).
  In ở **mọi** trang.
- `CRE[<mã sổ>].rieng` — thứ riêng của trang đó, in **trước** phần chung vì đó
  mới là cái người ta mở ra để xem.

Chỉ `MAP` bật cờ `tien: true` → thêm bảng chi phí ở cuối. Đó là trang gốc, coi
như bảng tổng của cả bộ; sáu trang kia không lặp lại con số.

### Luật viết — GIỐNG HỆT luật của sổ bản ghi

- **Ghi đúng thứ đã dùng thật.** Không đoán tên công cụ, không kê thêm cho dài.
  Không nhớ chắc là dùng bản nào thì viết chung chung (*"mấy game nhập vai pixel
  đời cũ"*), đừng bịa một cái tên cụ thể.
- **KHÔNG một chữ nào** về đo đạc · theo dõi · ghi nhận · lưu trữ. Người chơi mở
  ra đọc là để biết ơn, không phải đọc tài liệu hạ tầng.
- **Không ghi** khoá, mã, tên biến môi trường, tên endpoint.

Thêm trang mới thì thêm một khoá vào `CRE`; không có khoá thì dòng `@Credit`
tự không hiện, bảng bản ghi vẫn chạy như thường.

### 7.1 · Mục "Làm trong bao lâu"

Mỗi trang Credit có một dòng thời gian của chính nó; trang gốc có thêm dòng
TỔNG của cả bộ. Số nằm ở `THOI_GIAN` trong `assets/lichsu.js`, **đếm từ chính
lịch sử commit** — đo lại bằng `node docs/thoi-gian.mjs` rồi chép khối nó in ra.

**Cách đo: KHOẢNG ĐẦU–CUỐI.** Commit sớm nhất tới commit muộn nhất, tính cả
những ngày ở giữa. Cả bộ ra vừa đúng một tháng (26-07 → 26-08-2026).

Đây là **chiều dài dự án** — quãng từ lúc bắt tay tới lúc xong, không phải số
giờ ngồi trước máy. Hai thứ khác nhau, và đây cố ý lấy thứ nhất: nó là con số
trả lời được câu *"làm trong bao lâu"*, đúng thứ trang Credit muốn kể.

> **⚠ CỘNG SÁU TRANG LẠI KHÔNG RA TỔNG, và đúng là như vậy.** Mấy phần được làm
> **xen kẽ** nhau chứ không nối đuôi, nên khoảng thời gian của chúng chồng lên
> nhau. Lời giải thích đó nằm **ở đây**, không nằm trên trang Credit: người
> chơi mở Credit ra là để xem, không phải đọc chú thích phương pháp. Trên trang
> chỉ còn đúng hai cái mốc `26-07-2026 → 26-08-2026`.

> **⚠ ĐỪNG DÙNG BỘ ĐẾM `.ls-tien` ĐỂ TÌM BẢNG CHI PHÍ.** Từ đợt 21 có **hai**
> khối cùng tên lớp đó: bảng chi phí, và mục thời gian (mang thêm `.ls-gio`).
> Lấy `.ls-tien` đầu tiên rồi đoán là vớ phải khối thời gian — `cre14.mjs` đã
> vấp đúng vậy. Hỏi thẳng thứ mình cần (`.ls-tien .r.tong b`).

Sửa mã mà quên đo lại thì `test/bo/cre21.mjs` báo đỏ: nó chạy `docs/thoi-gian.mjs`
tại chỗ rồi đối chiếu với bảng đang khai.

---

## 8. KHÔNG CHO BÔI ĐEN CHỮ

Màn nào **toàn chữ trang trí và nút bấm** thì đặt `user-select:none` cho cả
màn: màn cổng và màn phát mã của Gate 2 (`.gate-look`), các bảng cửa hậu,
mấy dòng tem. Chạm giữ trên điện thoại hay bấm nhanh hai cái trên máy tính là
dính ngay một mảng xanh bôi đen — nhìn như trang tài liệu, hỏng hẳn cảm giác
màn hình máy.

**Đừng** đặt cho: nội dung người chơi có thể muốn chép (thư, mã PIN dạng chữ,
câu trả lời trong Open World).

---

## 9. TÍN HIỆU BẮN VỀ PHẢI TỰ KHAI MÌNH LÀ AI

Sáu trang đều gọi `/api/ping`. Trang nào cũng phải kèm **ba trường tự khai**:

| Trường | Là gì | Ví dụ |
|---|---|---|
| `trang` | mã trang, cố định trong mã nguồn | `ban-do` · `dad-a` · `dad-b` · `han-a` · `han-b` · `phao-hoa` |
| `noi` | đang mở **hộp nào** trong trang đó | `Ô mã · DAD-950901-A` · `Bản ghi` · `Khu Open World` |
| `tt` | **một dòng** trạng thái thật của người chơi | `Mission: M1 ✓ · M2 — · M3 —` |

Máy chủ tra `trang` ra tiêu đề trong bảng `TEN_TRANG` (`api/ping.js`), nối `noi`
vào sau dấu `·`, rồi in `tt` nguyên văn.

> **⚠ BỆNH ĐÃ SỬA.** Trước đây máy chủ đặt **cứng** tiêu đề `BẢN ĐỒ TÁC CHIẾN`
> cho **mọi** tín hiệu của cả sáu trang, kèm luôn dòng `Đã giải: … (n/4)` —
> tiến độ bốn toạ độ vốn chỉ đúng với bản đồ. Đọc chuông báo không biết chuyện
> xảy ra ở đâu, mà con số thì vô nghĩa với năm trang còn lại.

**Luật khi thêm trang mới**

1. Thêm một khoá vào `TEN_TRANG`, và thêm tiền tố tên sự kiện vào `doanTrang()`.
2. Trang tự khai `trang` / `noi` / `tt` trong `ping()`.
3. **Không khai `tt` thì để trống.** Chỉ bản đồ mới có dòng mặc định bốn toạ
   độ — trang khác thà bỏ trống còn hơn in một con số không phải của mình
   (`dong.filter(Boolean)` tự bỏ dòng rỗng, không để lại chỗ hở).
4. `doanTrang()` là **đường lùi** cho trang cũ chưa khai `trang`, không phải
   đường chính. Thêm trang mới thì khai thẳng, đừng dựa vào việc đoán.

> **⚠ `noi` VÀ `tt` PHẢI ĐỌC QUA DOM HOẶC Ổ NHỚ, ĐỪNG ĐỌC BIẾN CỦA KHỐI KHÁC.**
> Hai cái bẫy đã vấp, cả hai đều **im lặng** vì hàm nằm trong `try/catch`:
> - **Hồ sơ Phi đoàn**: `noiHS()`/`ttHS()` nằm trong khối đo đạc, còn `st`,
>   `ov`, kể cả hàm rút gọn `byId` đều thuộc khối Mission — một IIFE khác.
>   Gọi thẳng tên là `ReferenceError`.
> - **Gate 2**: `S`, `owOn`, `Store` khai bằng `const`/`let` **ở dưới** hàm
>   `ping()`. Cú ping đầu tiên chạy trước lúc chúng khởi tạo → rơi vào vùng
>   chết. `typeof` cũng **không** cứu được: với `let`/`const` chưa khởi tạo thì
>   `typeof` cũng ném.
>
> Cả hai lần chuông vẫn kêu, chỉ là trống trơn đúng phần vừa thêm. Bộ kiểm
> `bao18.mjs` mục ⑥ bắt đúng chuyện này: mỗi trang phải ra `noi` và `tt` **khác
> rỗng**, và mục ⑦ soi thêm rằng hai người chơi khác nhau phải ra hai dòng khác
> nhau — chuỗi đặt cứng thì không qua được.

Sổ Google Sheets nhận thêm ba cột cùng tên; trang cũ chưa khai `trang` thì cột
đó điền bằng chỗ `doanTrang()` đoán ra — xem `docs/GOOGLE-SHEETS.md`.

---

## 10. HỘP CHÀO VÀ HỘP NHẮC — MỘT LƯỢT MỘT HỘP

Toàn bộ luật nằm ở `hhChon()` trong `index.html`, xếp từ trên xuống, gặp nhánh
nào hợp là ra nhánh đó **rồi dừng**:

| # | Nhánh | Ảnh | Khi nào |
|---|---|---|---|
| 1 | vừa phá đảo Gate 2 | `HH_3_excited` | một lần duy nhất cả đời |
| 2 | vừa xong Zoey's Castle | `HH_2_happy` | một lần duy nhất cả đời |
| 3 | **nhắc Open World** | `HH_4_hello_easter` | xong Gate 2 mà chưa ghé — mỗi ngày 1 lần, tối đa `OW_NHAC_TOI_DA` |
| 4 | lời chào | `HH_1` / `HH_2_back` | trong một KHUNG CHÀO, mỗi khung 1 lần/ngày |
| 5 | đi vắng rồi về | `HH_5_idle_afk` | rời máy ≥ `IDLE_PHUT` |
| 6 | Daily Quote | `HH_2_back` | ngoài khung chào, đủ giãn cách |

**Cửa chính**: chưa phá đảo Gate 2 thì **không nhánh nào chạy**. Người mới phải
được yên — chưa quen nhau thì chưa có ai nhảy ra chào.

### 10.1 · Thêm một hộp mới thì đặt ở đâu

Đặt **trong cùng cái thang này**, đừng dựng một hệ hộp thứ hai. Cả thang đi
chung `hhHien()`, và `hhHien()` mới là chỗ giữ mọi luật chống phiền:

- **nhường đường** — thấy `HOP_UU_TIEN` nào đang mở thì lui, 1,5 giây ngó lại
- **không hai hộp liền nhau** — cách hộp trước ít nhất `HH_CACH_MS` (1 phút)
- **có hạn chờ** — quá `HH_CHO_TOI_DA` (90 giây) thì **bỏ hẳn lượt**, thà im
  còn hơn chào trễ
- **đóng dấu lúc LÊN HÌNH**, không phải lúc gọi hàm (tham số `khiHien`)

> **⚠ ĐÓNG DẤU SỚM LÀ MẤT TRẮNG.** Lượt hộp có thể bị bỏ giữa chừng — đang có
> hộp khác đè, hoặc chờ quá hạn. Ghi dấu ở chỗ *quyết định hiện* thay vì chỗ
> *thật sự hiện* thì người chơi mất hẳn khung chào (hoặc lượt nhắc) của ngày
> hôm đó mà không được xem gì cả.

### 10.2 · Nhắc thì phải biết dừng

Hộp nhắc Open World là hộp **duy nhất lặp lại theo ngày**, nên nó mang thêm
bốn cái hãm — thêm hộp lặp nào về sau thì chép đủ bốn:

1. **Mỗi ngày đúng một lần** (`owNhacNgay`).
2. **Đạt mục đích rồi thì im hẳn** — vào được Open World là thôi, vĩnh viễn.
3. **Có trần** (`OW_NHAC_TOI_DA` = 6). Nhắc tới chừng đó lần mà người ta vẫn
   không đi thì nghĩa là người ta không muốn đi; nhắc nữa là phiền, không phải
   nhiệt tình.
4. **Nhẹ trước, rõ sau.** Hai lần đầu chỉ hỏi một câu, để người ta còn cái thú
   tự tìm; từ lần thứ ba mới chỉ thẳng đường. Hỏi hoài một câu mà không giúp
   được gì mới đúng là quấy.

Và nó **đứng TRÊN nhánh lời chào**, nên hôm nào có nhắc thì nhắc **thay** lời
chào — không phải nhắc thêm một hộp nữa.

> **⚠ ĐỜI TRƯỚC LÀ MỘT CÁI ĐUÔI DÍNH VÀO LỜI CHÀO** (`hhNhac()`), và hỏng hai
> đường: ghi chú bảo *"mỗi ngày MỘT lần"* mà chẳng có dấu ngày nào cả — nó bám
> vào **mọi** lời chào, tức ba lần một ngày; và nó nói chuyện "xem lại", không
> hề gọi tên Open World — thứ thật sự đáng chỉ đường thì lại không được nhắc.
> Đừng dựng lại kiểu đuôi đó.

Bộ kiểm: `ow19.mjs` — 17 phép, soi đủ cả sáu cái hãm lẫn chuyện "nhắc thay lời
chào chứ không cộng thêm hộp".
