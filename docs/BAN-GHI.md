# BẢN GHI — luật đánh số phiên bản & quy trình cập nhật

Tài liệu chốt cho hệ **Bản ghi** (trước gọi là "Sổ phiên bản"). Mã nguồn dùng chung nằm
ở [`assets/lichsu.js`](../assets/lichsu.js) — sáu cuốn sổ nằm chung một file, nhưng mỗi
trang chỉ thấy sổ của riêng nó.

---

## 1. Luật đánh số — công thức đếm

```
Một build LỚN   =  tối đa MƯỜI bản nhỏ, đuôi chạy .00 → .09
Hết .09         →  phải sang build lớn kế tiếp (V2.09 → V03, KHÔNG có V2.10)

trần bản nhỏ của một trang  =  số build lớn × 10
```

**Mấy nấc bị bỏ qua:** số build lớn **không dùng 13, 14 và 23**.
`V12.09 → V15.00` (nhảy qua 13, 14) · `V22.09 → V24.00` (nhảy qua 23).
Đó là lý do bảng của bản đồ nhảy thẳng từ V12 sang V15 — không phải mất dữ liệu.

Chân bảng Bản ghi tự in ra công thức này cùng hai con số thật của trang:
*"Trang này: **4** build lớn · **24**/40 bản nhỏ ghi nhận được."* — khỏi phải nhẩm tay,
và ai mở ra đọc cũng hiểu ngay vì sao con số lại thế.

> Đã vấp hai lần: Gate 2 chạy tới `V2.09` rồi định lên `V2.10`, HongHan's Secret Chamber
> chạy tới `V1.11`. Cả hai đều phải nắn lại (`V2 → V03`, `V1 → V2`). Nhớ luật này thì
> khỏi phải nắn lần ba.

---

## 2. Quy trình khi ra một phiên bản mới

Ba bước, **làm đủ cả ba** thì bản ghi mới khớp với thứ đang chạy thật:

> **⚠ TEM NAY LẤY TỪ SỔ, KHÔNG GÕ TAY NỮA.**
> Số hiệu và ngày của một trang chỉ khai **một nơi**: chính cuốn sổ này.
> `LichSu.tem('<mã sổ>')` trả `{ver, ngay}` — số là nấc đuôi mới nhất của dòng
> mới nhất, ngày là cột `ngay` của dòng đó. Tem ngoài trang và thẻ toạ độ ngoài
> bản đồ đều gọi hàm đó.
> Chuỗi cứng trong HTML vẫn còn nhưng chỉ là **bản lùi**, và phải khớp sổ —
> có bộ kiểm (`tem16.mjs`) bắt lệch. Luật đầy đủ ở `DESIGN-SYSTEM.md` §4.1.
>
> **Bước hay quên nhất: sửa cột `ngay`.** Ba đợt liền số được bump mà ngày đứng
> im vì ngày nằm ở chỗ khác. Nay cùng một dòng — nhưng vẫn phải tự tay sửa.

### Bước 1 — Bump tem "Last updated" ngoài trang

Sửa đúng chỗ khai chuỗi tem của trang đó:

**Số phiên bản LUÔN là `Vxx.xx`** — đệm số 0, cả hai vế đúng hai chữ số:
`V01` · `V02` · `V04.05` · `V17.09` · `V02.02`. Không bao giờ `V1`, `V2.02`, `V4.5`.
Áp cho cả tem ngoài trang lẫn cột Build trong sổ. Dòng gộp đệm cả hai đầu
(`V01 → V21`, `V11 · V12`).

Đã soát lại từng trang — **thẻ và khuôn chuỗi mỗi trang một khác**, chép nhầm
khuôn của trang này sang trang kia là tem hiện sai hoặc mất hẳn:

| Trang | Chỗ sửa | Khuôn chuỗi |
|---|---|---|
| Bản đồ mật thư | `index.html` — `#stamp`: sửa **cả hai chỗ**, thuộc tính `data-base` **và** chữ nằm giữa thẻ (chữ tĩnh là thứ hiện ra trước khi JS chạy; quên nó thì tem loé số cũ một nhịp) | `Last updated DD-Mon-YYYY · Vxx.yy` |
| Hồ sơ Phi đoàn | `dad/950901-a/index.html` — chữ giữa thẻ `#vstamp`. **Thẻ này KHÔNG có `data-base`** — đừng đi tìm | `Vxx.yy<br>Last updated DD-Mon-YYYY` |
| Easter Egg · Gate 2 | `dad/950901-b/config.js` — khoá `version` | `Last updated DD-Mon-YYYY · Vxx.yy` |
| Zoey's Castle | `han/961030-a/index.html` — `data-base` của `#stamp` | `Vx.yy<br>Last updated DD-Mon-YYYY` |
| HongHan's Secret Chamber | `han/961030-b/index.html` — `data-base` của `#stamp` | `Vx.yy<br>Last updated DD-Mon-YYYY` |
| Màn pháo hoa | `phao-hoa/index.html` — chữ giữa thẻ `#vstamp` | chỉ có `Vx.yy` |

> Vì sao không nắn cho giống nhau hết: mỗi trang có hàm dựng tem riêng, đổi
> khuôn là phải sửa cả hàm đó — được cái đẹp mà đổi lấy nguy cơ hỏng tem ở năm
> chỗ. Xem §4 của `DESIGN-SYSTEM.md`.

> **Mẹo kiểm tra bản đồ:** mở `/` là bị đẩy thẳng sang `/dad/950901-a` (luật dẫn người
> chơi vào hồ sơ trước). Muốn xem bản đồ để đối chiếu tem thì mở `/?stay=1`.

### Bước 2 — Ghi vào `assets/lichsu.js`

Mở bảng `SO`, tìm đúng khoá của trang (`MAP` · `DAD-A` · `DAD-B` · `HAN-A` · `HAN-B` ·
`FX`), rồi:

- **Bản nhỏ trong cùng build lớn** (V04.05 → V04.06): giữ nguyên dòng, **tăng `so`** lên
  một, và thêm một mục vào mảng `chi`.
- **Sang build lớn mới** (V04.09 → V05): thêm một dòng mới ở CUỐI mảng `doi`.

```js
{ ngay:'2026-08-20', ver:'V04', so:'07',
  chinh:'Câu tóm tắt chung chung của cả build lớn',
  chi:[
    { ver:'V04.05', chinh:'Bản nhỏ này làm gì' },
    { ver:'V04.06', chinh:'Bản nhỏ kế tiếp làm gì' }
  ] }
```

Các trường:

| Trường | Nghĩa |
|---|---|
| `ngay` | `YYYY-MM-DD`. Không biết thì `'no info'` — bảng tự in **N/A** |
| `ver` | Số build lớn. **Luôn giữ** kể cả khi không biết nó sửa gì |
| `so` | Số bản nhỏ ghi lại được (V04.06 → `'07'` vì đếm cả .00). `null` → **N/A** |
| `chinh` | Tóm tắt cả build lớn, một câu |
| `chi` | *(tuỳ chọn)* mảng từng bản nhỏ. Dòng nào có `chi` thì **bấm được**, mở ra bảng chi tiết riêng. **Từ V17 trở đi build nào cũng nên ghi** |

### Bước 3 — Nếu có sửa file tài liệu

Sửa gì trong `index.html`/`config.js` của trang nào thì log lại ở đúng cuốn sổ của trang
đó. Sửa thứ dùng chung (`assets/lichsu.js`, `DESIGN-SYSTEM.md`) thì ghi vào cuốn sổ của
trang mà lần này thật sự đụng tới — đừng nhân bản một dòng ra sáu cuốn.

---

## 3. Luật viết cột "Sửa chính" — đọc trước khi thêm dòng

Bản ghi **người chơi mở ra đọc được**. Tuyệt đối KHÔNG ghi:

- mã, mật khẩu, đáp án, tên nhân vật phải đoán
- tên biến môi trường, tên khoá lưu, tên endpoint, tên nhà cung cấp
- bất cứ thứ gì nói ra là bớt được một bước phải mò

Chỉ ghi **loại việc người chơi nhìn thấy được**: *"chỉnh hiệu ứng"*, *"chỉnh hiệu ứng
pháo hoa nổ"*, *"chỉnh khung màn"*, *"chỉnh luật chơi"*, *"chỉnh luật gợi ý"*,
*"đồng bộ hệ nút"*, *"cập nhật giao diện"*, *"làm lại chuyển cảnh"*.

> **⚠ VÀ KHÔNG MỘT CHỮ NÀO về đo đạc · theo dõi · ghi nhận · bắn số liệu về · lưu
> trữ.** Không *"thêm đo đạc"*, không *"cập nhật API"*, không *"nạp trước tài nguyên"*.
> Người chơi đang đọc một cuốn sổ trong game, không phải tài liệu kỹ thuật — và cũng
> không cần biết trang có ghi lại gì hay không. Đời trước lỡ ghi ở ba chỗ, đã gỡ hết.

> Ví dụ đúng: "Thêm nút cầu cứu trong cửa mã, chỉnh luật gợi ý và luật tạm khoá."
> Ví dụ sai: "Thêm nút SOS mở gợi ý MiG-21 khi bấm 10 nhịp." — lộ cả đáp án lẫn cách mò.

---

## 4. Giao diện Bản ghi — những gì đã chốt

- Tiêu đề cửa mã: **Bản ghi**. Phụ đề: **chỉ tên sổ**, không còn câu *"Ghi chép update
  hệ thống."* — bốn ô vuông đã nói rõ phải gõ gì, viết thêm là thừa.
- **Nhập sai mã: không hiện dòng nào.** Hộp chỉ rung một cái. Sai đủ **5 lần** mới hiện
  gợi ý, và chỉ **đúng một** câu: *"Năm sinh Bác Hồ"*.
- **Bộ đếm sai cộng dồn trong phiên**, đóng trình duyệt là xoá (`sessionStorage`, khoá
  `ls_sai`) — phải sai đủ 5 lần trong CÙNG một phiên. Cờ *đã mở gợi ý* thì ở
  `localStorage`: thấy một lần là những lần sau hiện sẵn từ đầu.
- Bảng: phụ đề **"Đơn vị điều phối: Zoeyzuize"**, không còn đường dẫn trang, không còn
  câu giải thích cột `#`.
- Thứ tự cột: **Build → Ngày → # → Sửa chính**. Mọi ô **căn trái**.
- Không biết thì ghi **N/A** (một chữ, dùng chung cho cả cột số lẫn cột chữ).
- Chân bảng: công thức đếm + tổng của trang + ghi chú *"Thông tin ghi nhận không đầy đủ"*.
- Dòng có `chi` → bấm được (có mũi `›` ở cuối câu) → bảng chi tiết từng bản nhỏ, có nút
  **‹ Bản ghi** để quay lại.

---

## 5. Cửa vào Bản ghi ở từng trang

Luật chung của cả bộ: **mở bảng vận hành của trang → bấm 3 nhịp vào nút tròn → gõ mã**.

| Trang | Cách mở bảng vận hành |
|---|---|
| Bản đồ mật thư | Box Tổng tư lệnh (cửa hậu sẵn có) |
| Zoey's Castle | 5 nhịp vào cụm hoa + tem → Khối vận hành |
| Easter Egg · Gate 2 | **10 nhịp vào tem ở chân màn hình** → Khối vận hành. Chạy ở **cả màn cổng lẫn màn cuối** |
| Màn pháo hoa | Chưa có bảng nào để giấu cửa — dữ liệu đã sẵn ở khoá `FX`, hôm nào trang đó có bảng thì gắn `LichSu.nut('FX')` là xong |

Mã vào: `0981`. Sai **5 lần** được **đúng một** câu gợi ý (bộ đếm tính theo phiên; thấy
gợi ý rồi thì lần sau hiện sẵn).

Cửa mã đi theo **ba luật chung của mọi ô pin/pass** — luật đầy đủ ở `DESIGN-SYSTEM.md`
§6, tóm lại:

1. **Gõ đủ 4 số là tự chấm.** Không bắt bấm Enter — nhưng chấm đúng vào nhịp số cuối vừa
   thành chấm, để bao giờ cũng kịp nhìn thấy mình vừa gõ gì. Enter vẫn ăn.
2. **Ký tự vừa gõ hiện rõ 800ms rồi mới thành `•`.** Mấy ô trước che luôn.
3. **Lần nào vào cũng hỏi mã.** Cờ `ls_ok_<mã>` cho đi thẳng trong phiên đã gỡ hẳn —
   mở sổ bên này hay bên kia, lần trước hay lần này, đều phải gõ.

---

## 6. Trang Credit

Dòng *"ĐANG CHẠY Vxx"* trong bảng bản ghi nay có chữ **`@Credit`** căn phải. Bấm vào là
sang trang credit của đúng trang đó: phần riêng trước, phần chung sau, và riêng Bản đồ mật
thư có thêm bảng chi phí ở cuối.

Nội dung nằm ở `assets/lichsu.js` — `CRE_CHUNG` (dùng chung), `CRE[<mã sổ>]` (riêng từng
trang), `CRE_TIEN` (bảng chi phí). Luật viết đầy đủ ở `DESIGN-SYSTEM.md` §7; tóm tắt: ghi
đúng thứ đã dùng thật, không bịa tên công cụ, và **không một chữ nào** về đo đạc / theo
dõi / lưu trữ — y như luật của chính cuốn sổ.

Sổ nào không có khoá trong `CRE` thì dòng `@Credit` tự không hiện.

---

## 7. Riêng Gate 2 — Khối vận hành

Gõ 10 nhịp vào tem `@Designed by … · Last updated` ở chân màn hình thì ra một bảng nhỏ
gom mọi lối vận hành:

- **Nút tròn xem bản ghi** (bấm tiếp 3 nhịp → cửa mã).
- **⏭ Bỏ qua · vào thẳng màn cuối** — chỉ hiện ở màn cổng khi **chưa** phá đảo. Bấm là
  ghi đủ bộ cờ như đi hết game thật rồi nhảy sang màn phát mã.

Cố ý **không nhớ**: mỗi lần vào trang phải gõ lại đủ 10 nhịp. Cố ý **không đếm hộ** còn
mấy nhịp — chỉ nháy màu tem từ nhịp thứ 4 cho biết đang gõ đúng chỗ.

> **Hai lỗi đã sửa ở V04.06, ghi lại để khỏi lặp:**
> 1. `.gate-look .vstamp` để `pointer-events:none`, và chỉ `#scene-gate` mới mở lại. Màn
>    cuối (`#scene-code`) dùng chung lớp đó nên tem trơ hoàn toàn — khung `.frame` nằm đè
>    nuốt sạch cú bấm. Nay cả hai màn cùng mở.
> 2. Esc đóng cả hai lớp một lúc: đang đọc bản ghi gõ Esc thì rơi thẳng về màn chơi. Nay
>    Khối vận hành né Esc khi sổ bản ghi đang mở, mỗi cú Esc chỉ đóng lớp trên cùng.
