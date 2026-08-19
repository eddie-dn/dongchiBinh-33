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

Mọi trang đều có một tem hai dòng ở chân màn hình:

```
@Designed by Honghandangiu
Last updated DD-Mon-YYYY · Vxx.yy
```

- Dòng ký tên nằm **trên**, dòng phiên bản nằm **dưới**.
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

Sổ phiên bản **không có đường vào riêng**. Nó nằm sau cửa hậu đã có sẵn của
từng trang, thêm một tầng nữa:

```
mở bảng điều khiển của trang (cửa hậu cũ, không đổi gì)
  → trong bảng có MỘT NÚT ICON nhỏ
  → bấm 3 nhịp vào nút đó
  → gõ mã 0981
  → hiện sổ CỦA RIÊNG TRANG ĐÓ
```

**"Của riêng trang đó" là luật cứng.** Đứng ở Zoey's Castle thì chỉ thấy lịch
sử của Zoey's Castle. Sáu cuốn sổ nằm chung một file cho dễ sửa, nhưng không
bao giờ hiện chung một bảng — mỗi trang một câu chuyện riêng.

| Trang | Bảng điều khiển | Mã trang |
|---|---|---|
| Bản đồ mật thư | Box Tổng tư lệnh | `MAP` |
| Easter Egg · Gate 1 | thẻ *Mission 3 · Phá đảo* | `DAD-A` |
| Easter Egg · Gate 2 | hàng nút mà cửa hậu 10 nhịp mở ra | `DAD-B` |
| Zoey's Castle | Khối vận hành | `HAN-A` |
| HongHan's Secret Chamber | Khối vận hành | `HAN-B` |
| Màn pháo hoa | *chưa có bảng nào* → chưa gắn | `FX` |

Sai mã 3 lần thì được **một** gợi ý, và chỉ một.

**Nút đặt bên TRÁI hàng nhãn**, không phải bên phải: góc phải trên của mọi
bảng trong bộ này đều là chỗ của nút đóng `✕`, để bên phải là hai nút đè lên
nhau. Đã vấp đúng lỗi này.

**Luật viết cột "Sửa chính":** sổ này người chơi mở ra đọc được, nên chỉ ghi
LOẠI VIỆC (*cập nhật API · chỉnh hiệu ứng · chỉnh luật chơi · đồng bộ hệ nút*),
tuyệt đối không ghi mã, đáp án, tên biến môi trường hay tên endpoint. Không
biết đời đó sửa gì thì ghi `no info` và **giữ nguyên số phiên bản**.

---

## 6. KHÔNG CHO BÔI ĐEN CHỮ

Màn nào **toàn chữ trang trí và nút bấm** thì đặt `user-select:none` cho cả
màn: màn cổng và màn phát mã của Gate 2 (`.gate-look`), các bảng cửa hậu,
mấy dòng tem. Chạm giữ trên điện thoại hay bấm nhanh hai cái trên máy tính là
dính ngay một mảng xanh bôi đen — nhìn như trang tài liệu, hỏng hẳn cảm giác
màn hình máy.

**Đừng** đặt cho: nội dung người chơi có thể muốn chép (thư, mã PIN dạng chữ,
câu trả lời trong Open World).
