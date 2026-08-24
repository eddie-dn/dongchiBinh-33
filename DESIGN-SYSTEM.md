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
| `V01` · `V02` · `V04.05` · `V17.09` · `V02.02` | ~~`V1`~~ · ~~`V2`~~ · ~~`V4.5`~~ · ~~`V17.9`~~ · ~~`V2.02`~~ |

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

### 6.1 · Phải Enter mới tính là GỬI

Gõ đủ ký tự **không** phải là gửi. Người chơi còn phải bấm `Enter`.

Bản cũ tự chấm sau 120-140ms kể từ ký tự cuối. Hỏng ở chỗ: bấm nhầm đúng phím
cuối là **cháy luôn một lượt sai** mà chưa kịp nhìn lại hàng ô — mà mấy cửa
này lượt sai đều có giá (khoá 30 phút, hết lượt ngày, mở gợi ý). Gõ xong còn
đọc lại được, ưng thì mới Enter.

Cách làm: bỏ hẳn nhánh `if(buf.length === len) setTimeout(check, …)` trong
`input`, dồn hết vào `keydown`:

```js
inp.addEventListener('input', function(){ buf = …; veRoiChe(); });
inp.addEventListener('keydown', function(e){
  if(e.key !== 'Enter') return;
  e.preventDefault();                    /* đừng để form nào cuốn mất phím */
  if(buf.length === len) check();
});
```

**Phải có dấu `↵` ở cuối hàng ô** — không thì người chơi gõ đủ số rồi ngồi
chờ, tưởng trang treo. Mờ sẵn (`opacity:.3`) để biết cửa mở bằng Enter; đủ ký
tự thì sáng lên thành lời mời bấm (`.san`). Ô PIN ngoài bản đồ không có hàng ô
riêng thì nói thẳng trong dòng nhắc: *"Gõ 4 số rồi Enter"*.

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

## 7. KHÔNG CHO BÔI ĐEN CHỮ

Màn nào **toàn chữ trang trí và nút bấm** thì đặt `user-select:none` cho cả
màn: màn cổng và màn phát mã của Gate 2 (`.gate-look`), các bảng cửa hậu,
mấy dòng tem. Chạm giữ trên điện thoại hay bấm nhanh hai cái trên máy tính là
dính ngay một mảng xanh bôi đen — nhìn như trang tài liệu, hỏng hẳn cảm giác
màn hình máy.

**Đừng** đặt cho: nội dung người chơi có thể muốn chép (thư, mã PIN dạng chữ,
câu trả lời trong Open World).
