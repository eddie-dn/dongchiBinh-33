# Phi đoàn Dongchi Bình — Bản đồ tác chiến

Trang tĩnh, không build, không dependency. Mỗi file HTML tự chứa toàn bộ CSS/JS của nó.
Deploy thẳng lên Vercel từ GitHub.

---

## 1. Cấu trúc thư mục

```
/
├── index.html          ← TRANG CHỦ: bản đồ Việt Nam, 4 điểm sáng
├── README.md
├── vercel.json         ← cleanUrls
├── .gitignore
├── api/
│   └── ping.js         ← nhận tín hiệu tiến độ, bắn về Telegram/Discord
│
├── hn/                 ← Hà Nội       (HN)   · chưa có hồ sơ
│   └── .gitkeep
├── xg/                 ← Đà Nẵng      (XG)
│   ├── 950109-a/
│   │   └── index.html  ← XG-950109-A · Phi đoàn sinh nhật
│   └── 950901-b/
│       └── index.html  ← XG-950901-B · niêm phong tới 01.09.2026 (đang là trang tạm)
├── gr/                 ← Quy Nhơn     (GR)   · chưa có hồ sơ
│   └── .gitkeep
└── hzm/                ← Hồ Chí Minh  (HZM)  · chưa có hồ sơ
    └── .gitkeep
```

**Quy tắc:** một sub-page = một thư mục chứa đúng một `index.html`.
Vercel tự động phục vụ `xg/950109-a/index.html` tại URL `/xg/950109-a`.

Đặt file thẳng vào thư mục của nó cũng đồng nghĩa mọi ảnh/asset riêng của sub-page đó
để cùng chỗ, không đụng file khác.

---

## 2. Quy ước đặt tên

| Thành phần | Ý nghĩa | Ví dụ |
|---|---|---|
| Mã toạ độ | Viết hoa, dùng trong `NODES` và làm tên thư mục (viết thường) | `XG` → `/xg/` |
| Số hồ sơ | 6 chữ số, thường là ngày | `950109` |
| Phiên bản | Một chữ cái, tăng dần khi cùng một toạ độ có nhiều hồ sơ | `A`, `B`, `C` |

→ ID hiển thị: `XG-950109-A` · Thư mục: `/xg/950109-a/` · URL: `/xg/950109-a`

**Bốn mã đang dùng:** `HN` Hà Nội · `XG` Đà Nẵng · `GR` Quy Nhơn · `HZM` Hồ Chí Minh

---

## 3. Thêm một sub-page mới

Ví dụ thêm hồ sơ thứ hai cho Đà Nẵng:

**Bước 1 — Tạo thư mục và bỏ file vào**

```
xg/950109-b/index.html
```

**Bước 2 — Dán đoạn liên kết quay lại bản đồ** vào cuối file mới, ngay trước `</body>`:

```html
<style>
.corner.tl{display:none}
#backHome{position:absolute;top:12px;left:12px;z-index:9;display:inline-flex;
  align-items:center;gap:6px;padding:6px 11px;border-radius:999px;
  border:1px solid var(--line);background:rgba(6,16,31,.55);backdrop-filter:blur(4px);
  font-family:"Oswald";font-size:9px;letter-spacing:.18em;text-transform:uppercase;
  color:rgba(234,240,247,.8);text-decoration:none}
#backHome b{color:var(--amber);font-weight:600;font-size:11px;line-height:1}
</style>
<a id="backHome" href="/"><b>&larr;</b> Bản đồ</a>
<script>
(function(){var f=document.querySelector('.frame'),b=document.getElementById('backHome');
if(f&&b)f.appendChild(b);})();
</script>
```

> Đoạn này giả định sub-page có `.frame` và các biến `--line`, `--amber` như design system
> bên dưới. Nếu file mới không dùng `.frame`, đổi `.frame` thành `body` là chạy.

**Bước 3 — Khai báo trong `index.html`**

Mở `index.html`, tìm mảng `NODES` gần cuối file, thêm một dòng vào `subs`:

```js
{ code:'XG', name:'Đà Nẵng', lat:16.047, lon:108.206, subs:[
    { id:'XG-950109-A', title:'Phi đoàn sinh nhật', href:'/xg/950109-a',
      meta:'Published date: 27-Jul 2026 | V17.02' },
    { id:'XG-950901-B', title:'Hồ sơ niêm phong', href:'/xg/950901-b',
      unlockAt:'2026-09-01T00:00:00+07:00' },
    { id:'XG-950109-C', title:'Nhật ký hành trình', href:'/xg/950109-c' }   // ← mới
]},
```

| Trường | Bắt buộc | Tác dụng |
|---|---|---|
| `id` | có | Mã hồ sơ hiển thị |
| `title` | có | Tên hồ sơ |
| `href` | có | URL, phải khớp thư mục thật |
| `meta` | không | Dòng chú thích nhỏ, ví dụ ngày xuất bản và phiên bản |
| `unlockAt` | không | ISO 8601 kèm múi giờ. Trước mốc này hồ sơ tự khoá và hiện đếm ngược tới từng giây; tới giờ tự mở, không cần deploy lại |

Xong. Bộ đếm "đã giải mật" ở góc dưới màn hình tự cập nhật, không phải sửa gì thêm.

Toạ độ nào có `subs: []` sẽ tự hiển thị trạng thái **Khoá** kèm biểu tượng ổ khoá —
không vỡ layout, không cần code riêng.

> **Nhớ:** `/xg/950901-b/index.html` hiện chỉ là trang tạm. Thay bằng nội dung thật
> trước 00:00 ngày 01.09.2026, nếu không người xem sẽ mở ra trang "đang chuẩn bị".

---

## 4. Thêm một điểm sáng mới

1. Thêm object vào `NODES` với `code`, `name`, `lat`, `lon` thật.
2. Thêm toạ độ SVG vào object `SPOT` (dùng để di chuyển vùng sáng focus).
3. Vẽ thêm một nhóm `<g class="bcn">` trong `<g class="beacons">` và một `<button class="beacon">`.

Công thức đổi kinh/vĩ độ sang toạ độ SVG (viewBox `0 0 746 966`):

```
x = (lon - 102.0) * 57.816
y = (23.7 - lat)  * 60.000
```

Khung nhìn trải từ kinh độ 102.0 đến 114.9, vĩ độ 7.6 đến 23.7 — cắt sát mép tây của đất
liền và bỏ hẳn Thái Lan, Myanmar, Malaysia khỏi lớp nền, chỉ giữ Lào, Campuchia và Trung
Quốc. Nhờ vậy **Hoàng Sa và Trường Sa nằm đúng vị trí, đúng tỉ lệ với đất liền** mà khung
dọc 460px vẫn giữ nguyên.

Không cần tự tính vị trí cho `<button class="beacon">` — hàm `place()` đọc `SPOT` rồi
dùng ma trận `cam.getScreenCTM()` để đặt nút đúng điểm, tính lại liên tục cả khi bản đồ
đang zoom, khi xoay máy và khi đổi kích thước cửa sổ. Chỉ cần khai báo `data-bcn="MÃ"`.

Bốn điểm hiện có:

| Mã | Vĩ độ | Kinh độ | x | y |
|---|---|---|---|---|
| HN | 21.028 | 105.854 | 222.8 | 160.3 |
| XG | 16.047 | 108.206 | 358.8 | 459.2 |
| GR | 13.782 | 109.219 | 417.4 | 595.1 |
| HZM | 10.823 | 106.630 | 267.7 | 772.6 |

Nhãn là **một dòng**: `MÃ — TÊN THÀNH PHỐ`, mặc định nằm bên phải điểm sáng.
Hàm `place()` tự đo bề rộng nhãn và **lật sang trái khi sắp tràn mép khung** — không phải
canh tay. Chỉ khi muốn ép cứng một điểm luôn nằm bên trái thì thêm `data-side="left"` và
class `tl` vào nút đó; hiện `HZM` dùng cách này vì nó nằm sát khung phụ Biển Đông.

Icon nhỏ đứng trước mã trong nhãn cho biết trạng thái: **ổ khoá** (`#lockIco`) nghĩa là
chưa có hồ sơ, **máy bay** (`#jet`, class `.pl`) nghĩa là toạ độ này đã có nội dung để
vào đọc. Đổi icon = đổi một dòng trong `<span class="code">`.

Nhớ nối thêm đường bay trong `<g class="links">` nếu muốn điểm mới nằm trong mạng lưới,
và thêm toạ độ tương ứng vào object `SPOT`.

---

## 5. Design system (dùng chung main ↔ sub)

Giữ nguyên bộ token này ở mọi file để hai tầng liền mạch.

```css
--void:#040b18;  --abyss:#071429;  --navy:#0B1B3A;  --command:#0d244d;
--airforce:#1E4E79;  --steel:#4A73A0;
--neon:#38BDF8;  --neon-deep:#0E7FB8;
--amber:#F2B441;  --amber-deep:#d99320;
--paper:#EAF0F7;  --line:rgba(234,240,247,.28);
```

| Vai trò | Màu |
|---|---|
| Nền sâu / biển | `--void` `--abyss` |
| Đất liền, phát sáng | `--neon` (viền) + gradient `#2E86C8 → #123F6B` |
| Đường bay / mạng lưới | `--steel`, nét đứt `5 7` |
| Điểm sáng đã mở | `--amber` |
| Điểm sáng còn khoá | `--steel` |
| Chữ | `--paper` |

**Chữ:** `Oswald` (400–700) cho tiêu đề, mã hiệu, nhãn HUD — luôn viết hoa, giãn chữ rộng.
`Be Vietnam Pro` (400–600) cho văn bản thường.

**Khung:** `max-width: 460px`, `max-height: 940px`, `height: 92vh`, bo góc 26px từ
breakpoint 480px trở lên — **giống hệt** file hồ sơ, kể cả nền ngoài `#app`
(`radial-gradient(120% 90% at 50% 0%, #123 0%, #05101f 70%)`). Nhờ vậy chuyển từ bản đồ
sang hồ sơ khung không nhảy một pixel nào.

**Cờ Việt Nam** đứng thay chữ ở vị trí eyebrow, ngay trên tiêu đề: `#DA251D` nền,
`#FFCD00` sao, 26×17.3px.

---

## 6. Cơ chế tương tác của trang chủ

- **Idle** — bốn điểm nhấp nháy lệch pha, mạng lưới đường bay nối các toạ độ.
  Điểm chưa có hồ sơ mang màu thép và có ổ khoá trước mã; điểm đã có nội dung mang icon
  máy bay. Nhãn xếp hai dòng: mã ở trên, tên thành phố ở dưới.

### Bảng thao tác trên điểm sáng

| Thao tác | Kết quả |
|---|---|
| Rê chuột / `Tab` tới | Dòng HUD hiện **toạ độ** của điểm đó, rời ra thì trả về |
| **1 click** | Zoom vào thành phố, mở bảng hồ sơ như bình thường |
| **2–3 click** (toạ độ chưa bắt sóng) | **Không zoom.** Bắt sóng toạ độ đó — từ nay rê tới là morse tự hiện |
| **2–3 click** (toạ độ đã bắt sóng) | Ghim mã morse lên HUD để bấm vào |
| **2–3 click ra chỗ trống** | Bỏ ghim, HUD về "Chờ chọn toạ độ" |
| **2–3 click vào chính chuỗi morse** | Mở hộp mật thư |

Vì phải phân biệt một cú với hai cú, click đơn có độ trễ **250 ms** trước khi mở hồ sơ —
đây là độ trễ tối thiểu để bắt được cú thứ hai, không phải lag.

### Kênh bắt sóng — luật quan trọng nhất

Có **hai đường** tìm ra mã morse, nhưng người xem chỉ được chọn **một**. Đường nào dùng
trước sẽ **chốt kênh vĩnh viễn** (biến `channel`), đường còn lại khoá lại luôn.

| Kênh | Chốt bằng | Về sau |
|---|---|---|
| `map` | 2–3 click vào điểm sáng trên bản đồ | Mỗi lần muốn xem mã của một toạ độ đã bắt sóng đều phải **gõ đúp lại** — gõ xong mã **ghim đứng yên** (`pinned`) để còn bấm vào mà mở hộp. Rê chuột thường luôn chỉ ra kinh–vĩ độ. Gõ đúp ra chỗ trống thì bỏ ghim. Dòng toạ độ trong hồ sơ **niêm phong vĩnh viễn**. |
| `sheet` | Mở hồ sơ rồi 2–3 click vào dòng toạ độ | Phải **vào hồ sơ từng địa điểm** rồi lặp lại đúng thao tác đó. Ngoài bản đồ im lặng hoàn toàn, 2–3 click chỉ báo "kênh đã niêm phong". |

Dù đi kênh nào, người xem vẫn **phải thao tác riêng cho từng địa điểm** — mở được `XG`
không có nghĩa là thấy luôn mã của `HN`.

Hộp pí mật chỉ hiện mã của những toạ độ **đã bắt sóng** (`unlocked`). Toạ độ chưa bắt thì
ô nhập bị khoá, hộp chỉ ghi "Chưa bắt được sóng ở toạ độ này ((⇀‸↼))" — **không chỉ
đường**, người xem tự luận ra cách bắt — nên vòng lặp là *bắt sóng → giải → bắt sóng
tiếp*, không thể nhảy cóc.

Toạ độ **đã giải xong** thì ô nhập và nút Giải biến mất, thay bằng khối chúc mừng:
"Đã chinh phục toạ độ (๑ > ᴗ < ๑) — Vui lòng liên hệ Hội đồng Meowmeow để nhận thưởng!"
(sửa chữ ở khối `#cxWon` trong HTML).

**Cửa duy nhất vào hộp pí mật là bấm double/triple lên chính chuỗi morse** — ở mọi trang,
không có lối tắt nào khác. (Ngoại lệ có chủ đích: huy hiệu MISSION COMPLETED sau khi giải
đủ 4/4 cũng bấm vào được, để mở hộp mà bấm nút chơi lại.)

- **Không copy được** — cả hai ô morse và dòng morse trong hộp giải mã đều đặt
  `user-select:none`, người xem buộc phải tự đọc và gõ lại.
- **Hiệu ứng sáng** — ngay khi mã morse hiện ra lần đầu ở bất cứ đâu, `frame` được gắn
  class `hot` **vĩnh viễn**: từ đó mọi chuỗi morse đều nhấp nháy phát sáng và đổi con trỏ
  sang `pointer`, ngầm mời bấm vào. Cờ này lưu cùng tiến độ.
- **Huy hiệu 4 tên lửa** nằm trong HUD, ngay trên dòng toạ độ. Hiện ra ngay khi bắt được
  mã morse đầu tiên. Tên lửa **chưa giải** là khối thép mờ (gradient `#metal`, opacity
  85%). Tên lửa **đã giải** đổi hẳn cấu tạo: **mũi đỏ** (`#noseRed`), **thân thép sáng**
  (`#metalLit`), **cánh gradient amber** (`#finAmber`), cửa sổ xanh neon và **lửa cam**
  (`#flameHot`), phóng to 1,16 lần kèm quầng sáng amber hai lớp — nổi hẳn so với hàng chưa
  hoàn thành. Tên lửa chưa sáng **nhấp nháy lệch pha** cho tới khi đủ bốn; đủ rồi thì
  ngừng nhấp nháy và hiện dòng **Mission completed**.
- **Hộp pí mật** — khung hộp dùng đúng kiểu viền của thẻ "Phi vụ tiếp theo": viền mảnh,
  gờ amber 2px bên trái, bo góc 5px. Đã bỏ dòng gợi ý về mã morse, người xem tự mò.
- **Giải đúng** → một **lời khen bốc ngẫu nhiên** từ mảng `PRAISE` bật lên (Dữ zạ · Quá
  đỉnk · Đỉnh nóc · Kịch trần), dãy ô chữ dừng quay và **trải đủ đáp án**. Lời khen được
  lưu lại nên mở xem lại vẫn đúng câu đó. Thêm câu mới = thêm chuỗi vào `PRAISE`.
- **Ô chữ luôn vừa đúng một dòng**: hàm `rings()` đo `clientWidth` thật của khung rồi chia
  ngược ra cỡ ô (`--t`), kẹp trong 10–40px. Đáp án dài nhất ("CON DUONG HANH PHUC", 16
  chữ) ra ô ~18px trên khung 460 và ~15px trên máy 360 — vẫn một dòng, không xuống hàng.
- **Hiệu ứng ăn mừng** riêng từng nơi: `HN` tuyết rơi · `XG` sóng biển dâng nhẹ ·
  `GR` gió thổi · `HZM` pháo hoa. Đổi hiệu ứng = đổi trường `fx` trong `NODES`
  (`snow` / `sea` / `wind` / `fire`; `rain` vẫn còn trong engine nếu cần dùng lại).
- **Lời khen không trùng nhau**: `pickPraise()` chỉ bốc trong số câu **chưa dùng**, nên
  bốn đáp án ra bốn câu khác nhau, thứ tự vẫn ngẫu nhiên.
- **Nhập sai** → câu trêu đi lần lượt theo mảng `WRONGS` rồi vòng lại: "Trừi ưi, chú Bình
  thử lại iiii" → "Tứk giựn" → "Ẳng rìiiii" → "Tét munggg". Bộ đếm `wrongCount` lưu cùng
  tiến độ nên tắt web mở lại vẫn đi tiếp đúng thứ tự. Câu trêu hiển thị bằng font
  Be Vietnam Pro cỡ 12.5px — Oswald thiếu glyph nên kaomoji sẽ vỡ nếu dùng.
- **Giải hết 4/4** → huy hiệu chuyển thành **MISSION COMPLETED** và **bấm vào được**: mở
  hộp pí mật, trong đó có nút **Chơi lại từ đầu**. Bấm reset là **xoá sạch**: tiến độ,
  kênh bắt sóng, danh sách đã bắt, huy hiệu tên lửa, bộ đếm câu sai, cả lịch sử ping —
  chọn lại kênh từ đầu. Riêng **bộ đếm số lần reset** thì giữ lại và cộng dồn, hiện thành
  con số nhỏ `↻ n` cạnh dòng bản quyền (chỉ hiện khi đã reset ít nhất một lần).

### Tiến trình có mất không?

Toàn bộ trạng thái nằm trong `localStorage` của trình duyệt — **không có hạn tự hết**,
tắt máy mở lại vẫn còn, kể cả sau nhiều tuần. Ba trường hợp duy nhất bị mất:
chế độ ẩn danh (đóng cửa sổ là bay), người dùng tự xoá dữ liệu trang, và **Safari/iOS**
có cơ chế dọn storage của website **không được ghé lại trong ~7 ngày** liên tục dùng
Safari. Tiến trình cũng gắn với **từng máy + từng trình duyệt** — đổi máy là bắt đầu lại.
Với kèo sinh nhật một người chơi trong vài tuần thì mức này ổn; muốn chắc tuyệt đối thì
phải lưu server (Vercel KV), hiện chưa cần.
- Đáp án khai báo ở `answers`, bản chữ hiển thị ở `plain`. So khớp sau khi bỏ dấu tiếng
  Việt, bỏ khoảng trắng và hạ chữ thường, nên gõ "Con Đường Hạnh Phúc" hay
  "conduonghanhphuc" đều được. Tiến độ lưu bằng `localStorage` (bọc `try/catch`, không có
  thì chỉ giữ trong phiên).
- **Focus** — bấm vào một điểm thì xảy ra bốn chuyện cùng lúc trong 0,78 giây:
  phần tiêu đề và đồng hồ **thu về 0** để nhường toàn bộ chiều cao cho bản đồ; nhóm
  `#cam` phóng to 2,5 lần và dời tâm về đúng thành phố đó; một `<mask>` SVG với
  `radialGradient` trượt theo, giữ sáng vùng quanh điểm và dìm phần còn lại xuống lớp
  `.land-base` tối; bảng chọn hồ sơ trượt lên từ dưới, chỉ chiếm 52% chiều cao. Nút toạ
  độ HTML bám theo phép phóng bằng vòng lặp `requestAnimationFrame` đọc
  `cam.getScreenCTM()`.
- Hằng số `FOCUS_Y` quyết định thành phố được zoom nằm ở đâu theo chiều dọc (0.24 = 24%
  từ trên xuống). Nếu đổi chiều cao bảng chọn thì chỉnh luôn số này cho khớp.
- **Thoát** — bấm nền tối, bấm thanh nắm, hoặc `Esc`. Bản đồ thu về đúng khung ban đầu
  và tiêu đề hiện lại.
- **Cất cánh** — bấm vào một hồ sơ đã mở: màn hình chờ hiện máy bay bay qua bầu trời,
  đổi ba câu thoại hàng không lấy ngẫu nhiên từ mảng `CALLS`, rồi mới chuyển trang
  sau 1,78 giây. Thêm câu mới chỉ cần thêm chuỗi vào `CALLS`.
- **Đếm ngược** — mốc sinh nhật nằm ở hằng số `BIRTHDAY` đầu script. Đổi mốc là đổi cả
  đồng hồ trên đầu trang lẫn mọi `unlockAt` đang trỏ vào hằng số đó.

Có sẵn: điều hướng bằng bàn phím (mỗi điểm sáng là một `<button>` thật), `aria-label`
tiếng Việt, và `prefers-reduced-motion` tắt toàn bộ animation.

**Hoàng Sa & Trường Sa** không còn là khung phụ — chúng nằm đúng vị trí địa lý, cùng một
phép chiếu với đất liền, vẽ trần bằng các chấm đảo, không viền khoanh vùng, không nhãn
(`<g class="isles">`).
Cái giá là đất liền chiếm 58% chiều ngang thay vì 76%, tức nhỏ hơn khoảng 16% so với bản
khung hẹp. Muốn đảo chiều lại thì đổi `LON_MAX` về 110.6 và dựng lại khung phụ.

**Đồng hồ đếm ngược** cố tình để nằm ngang, không dựng dọc: số giây nhảy mỗi giây, mắt
đọc ngang nhanh hơn hẳn; chữ dọc lại buộc phải đè lên vùng biển phía đông — đúng chỗ đã
dành cho khung phụ Hoàng Sa – Trường Sa. Bù lại nó được nén còn một thanh cao ~44px và
biến mất hoàn toàn khi zoom, nên không cạnh tranh với bản đồ.

---

## 7. Đưa lên GitHub

```bash
cd đường/dẫn/tới/thư-mục-này

git init
git add .
git commit -m "Bản đồ tác chiến + hồ sơ Đà Nẵng"
git branch -M main
git remote add origin https://github.com/<tài-khoản>/<tên-repo>.git
git push -u origin main
```

Nếu repo đã tồn tại, chỉ cần copy đè các file rồi:

```bash
git add . && git commit -m "Thêm trang chủ bản đồ" && git push
```

---

## 8. Deploy lên Vercel

**Lần đầu**

1. vercel.com → **Add New… → Project**
2. **Import Git Repository** → chọn repo vừa push
3. Framework Preset: **Other** — Build Command: **để trống** — Output Directory: **để trống**
4. **Deploy**

**Từ lần sau:** mỗi lần `git push` lên nhánh `main`, Vercel tự deploy lại. Không cần thao tác gì.

**Domain:** Project → Settings → Domains. Bản hiện tại đang chạy ở
`https://dongchi-binh-33.vercel.app/`.

**Kiểm tra sau khi deploy**

- [ ] `/` hiện bản đồ, bốn điểm sáng lên theo thứ tự Bắc → Nam
- [ ] Đồng hồ đếm ngược chạy, đúng số ngày còn lại tới 01.09.2026
- [ ] Bấm `XG` → bản đồ zoom vào Đà Nẵng → bảng chọn trượt lên
- [ ] Bấm `XG-950109-A` → hiện màn hình cất cánh → mở đúng hồ sơ Đà Nẵng
- [ ] `XG-950901-B` hiện ổ khoá kèm đếm ngược tới từng giây
- [ ] Đóng bảng chọn → bản đồ zoom về đúng khung ban đầu
- [ ] Bấm `HN` / `GR` / `HZM` → hiện trạng thái **Khoá**, không lỗi
- [ ] Trong hồ sơ, nút `← Bản đồ` ở góc trên trái đưa về trang chủ
- [ ] Hoàng Sa · Trường Sa hiện đủ, không bị cắt ở màn hình nhỏ (360px)

---

## 9. Phiên bản

Dòng **Last updated 04-Aug-2026 · V10.08** chạy dọc mép trái bản đồ (class `.stamp`), tự ẩn khi zoom.
Đánh số: **số lớn** tăng khi thay đổi cấu trúc/luật chơi, **hai số nhỏ** tăng theo bản vá.
Lịch sử: V1 bản đồ đầu tiên → V2 đếm ngược + zoom → V3 khung hẹp + khung phụ → V4 quần
đảo đúng vị trí + hộp mật thư → V5 ô chữ + lời khen + sóng biển → V6 kênh bắt sóng + tên
lửa → V7 khối chinh phục → V8 vá tên lửa đen + double-tap mobile → **V9** bỏ ghim morse +
câu trêu xoay vòng → V9.20 ghim lại mã morse + toạ độ mở khoá sáng lên → **V10** huy hiệu
tên lửa có vòng đời đầy đủ + lockup cờ. Định dạng tem: `DD-Mon-YYYY · Vx.yy`. Khi sửa tiếp, nhớ cập nhật chuỗi trong `.stamp`.

## 9b. Ghi chú kỹ thuật

- **Đường bờ biển** lấy từ Natural Earth 1:50m, đã đơn giản hoá bằng thuật toán
  Ramer–Douglas–Peucker, nhúng thẳng vào SVG (~5 KB). Không gọi API bản đồ nào,
  trang chạy được cả khi offline.
- **Các nước láng giềng** (Lào, Campuchia, Thái Lan, Trung Quốc, Myanmar, Malaysia)
  chỉ vẽ viền mảnh, độ mờ 16% — đủ để định vị mà không tranh chấp thị giác với Việt Nam.
- **Không có build step.** Sửa file, push, xong. Không npm, không framework.
- Vercel Web Analytics và Speed Insights đã gắn sẵn ở cả hai tầng.


---

## 10. Theo dõi xem người nhận đã chơi tới đâu

Tiến độ giải mật thư nằm trong `localStorage` **trên máy người xem** — Vercel không đọc
được. Muốn biết thì trang phải chủ động gửi tín hiệu về, và đó là việc của `api/ping.js`.

### Vì sao không dùng Vercel Analytics

Custom event của Vercel Web Analytics chỉ có trên gói **Pro** trở lên, gói Hobby không
gửi được. Runtime Logs gói Hobby cũng chỉ giữ **1 tiếng**, nên cách "ghi console rồi vào
xem log" chỉ hợp để thử nhanh, không hợp để rình cả tuần. Vì vậy hướng gọn nhất cho một
dự án cá nhân là **bắn thẳng về điện thoại**.

### Các mốc được gửi

| Sự kiện | Khi nào | Gửi mấy lần |
|---|---|---|
| `ghe_tham` | Mở bản đồ lần đầu trong phiên | Mỗi lần |
| `tai_lai` | Nhấn F5 hoặc back/forward, kèm số lượt tải trong phiên | Mỗi lần |
| `mo_ho_so` | Bấm vào một toạ độ, mở bảng hồ sơ | Một lần / toạ độ |
| `chon_kenh` | **Chốt kênh bắt sóng** — từ bản đồ hay từ hồ sơ | Một lần duy nhất |
| `mo_khoa_morse` | Bắt được mã của một toạ độ | Một lần / toạ độ |
| `mo_hop` | Lần đầu mở được Hộp pí mật | Một lần duy nhất |
| `doi_tab` | Bấm chuyển tab HN/XG/GR/HZM trong hộp | Mỗi lần |
| `giai_dung` | Giải đúng, kèm mã và đáp án | Mỗi lần |
| `giai_sai` | Đoán sai | Một lần / toạ độ |
| `hoan_thanh` | Đủ 4/4 | Một lần duy nhất |
| `reset` | Bấm chơi lại từ đầu | Mỗi lần |
| `vao_ho_so` | Bấm nút mở hồ sơ Đà Nẵng | Mỗi lần |
| `ho_so_mo` | Trang hồ sơ Đà Nẵng đã tải xong | Mỗi lần |
| `trang_ho_so` | Lật tới một trang trong hồ sơ, kèm số trang và tiêu đề | Một lần / trang |
| `ho_so_dong` | Rời hồ sơ, kèm số trang đã xem và số giây ở lại | Mỗi lần |

> **Ghi chú kỹ thuật (sửa lỗi):** tên lửa phải **nhúng thẳng markup SVG** vào từng
> `<span class="rk">`, không dùng `<use href="#rocket">` — nội dung trong `<use>` nằm
> trong shadow DOM nên CSS class bên ngoài không tô màu vào được (đó là lý do có lúc
> thấy tên lửa đen trơn). Icon `#jet` không dính lỗi này vì chỉ có một path kế thừa
> fill của cha. Ngoài ra, double-tap được tự đếm nhịp bằng `multiTap()` (hai cú cách
> nhau dưới 340ms) thay vì tin `e.detail`, vì trên mobile double-tap thường trả về hai
> click rời — đây từng là nguyên nhân cú đúp vẫn bị zoom.

Năm sự kiện cuối bắn từ **chính file hồ sơ** `xg/950109-a/index.html` — đoạn tracking
được chèn ngay trước phần Vercel Analytics, bọc `_go()` của bộ đếm trang nên bắt được cả
vuốt, bấm nút lẫn phím mũi tên. Sao chép nguyên đoạn đó sang sub-page mới là có tracking,
chỉ cần đổi hằng `TAG`.

Mỗi tin nhắn kèm luôn danh sách toạ độ đã giải và giờ Việt Nam, nên chỉ cần đọc tin cuối
là biết đang ở đâu. Tín hiệu gửi bằng `navigator.sendBeacon`, chạy nền, không chặn trang
và hỏng cũng không ảnh hưởng gì tới trải nghiệm.

### Cách bật (Telegram — khuyến nghị)

1. Nhắn `/newbot` cho **@BotFather** trên Telegram, đặt tên, nhận **token**.
2. Nhắn cho bot vừa tạo một câu bất kỳ.
3. Mở `https://api.telegram.org/bot<TOKEN>/getUpdates`, lấy số `chat.id`.
4. Vercel → project → **Settings → Environment Variables**, thêm ba biến:
   - `NOTIFY_KIND` = `telegram`
   - `TG_TOKEN` = token ở bước 1
   - `TG_CHAT` = id ở bước 3
5. **Redeploy** (biến môi trường chỉ ăn từ lần deploy sau).

### Cách bật (Discord)

Tạo webhook ở kênh riêng, rồi khai `NOTIFY_KIND` = `discord` và `NOTIFY_URL` = webhook URL.

### Không muốn nhận thông báo

Để trống hoặc đặt `NOTIFY_KIND` = `off`. Endpoint vẫn chạy nhưng chỉ ghi `console.log`,
xem tạm ở tab **Logs** của Vercel.

### Muốn có bảng theo dõi thật

Cần chỗ lưu trạng thái: gắn thêm **Vercel KV / Upstash Redis**, cho `api/ping.js` ghi vào
đó và dựng một trang `/status` đọc ra. Với một người xem duy nhất thì thông báo đẩy đã đủ,
nên bản này cố tình không làm để khỏi thêm phụ thuộc.

### Lưu ý

Endpoint không xác thực, ai biết đường dẫn cũng gọi được — với trang sinh nhật thì không
sao, nhưng đừng gửi gì nhạy cảm qua đó. Trang không hiện bất kỳ dấu hiệu nào cho thấy
đang gửi tín hiệu.


---

## 11. Ghi chú UX của bản V9.20

- **Ổ khoá trên bản đồ giờ nói đúng sự thật.** Trước đây ổ khoá chỉ có nghĩa "chưa có hồ
  sơ", nên bắt được mã morse rồi mà điểm vẫn xám khoá — người chơi không thấy mình tiến
  bộ. Nay `refreshBeacons()` gỡ khoá và chuyển điểm sang amber ngay khi bắt được sóng,
  nên bản đồ chính là thanh tiến độ.
- **Mã morse có viền pill mảnh khi đang ghim.** Chữ phát sáng thôi thì chưa đủ báo "bấm
  được vào đây"; viền bao quanh làm nó thành một mục tiêu bấm rõ ràng.
- **Ghim là bắt buộc, không phải tuỳ chọn.** Nếu mã chỉ hiện lúc rê chuột thì không thể
  di chuột xuống bấm vào nó — vừa rời điểm sáng là mã biến mất. Đây chính là lỗi khiến
  bản V9.10 không vào được hộp pí mật.


---

## 12. Vòng đời huy hiệu tên lửa (V10)

Bốn trạng thái, chuyển theo tiến độ chứ không bật/tắt như trước:

| Trạng thái | Class | Hình | Khi nào |
|---|---|---|---|
| Ngủ | `dormant` | Bốn nét viền mảnh, không nhấp nháy | Chưa bắt được mật thư nào — hiện **ngay từ đầu** để người xem biết có thứ gì đó cần mở |
| Sẵn sàng | `armed` | Quả đã giải sáng đặc, quả chưa giải nhấp nháy lệch pha | Đã bắt được mật thư đầu tiên |
| Reo | `hail` | Cả bốn sáng, phóng to co giãn theo nhịp, viền amber | Vừa đủ 4/4 nhưng **chưa bấm vào** |
| Xong | `done` | Bốn quả đứng yên + chữ **Mission completed!** | Đã bấm vào một lần |

Bấm lần đầu ở trạng thái *Reo* chỉ để lộ dòng chữ; **những lần bấm sau mới mở hộp pí mật**
để chơi lại. Cờ `missionShown` lưu cùng tiến độ, reset thì về `false` nên vòng reo lặp lại
đúng một lần cho mỗi lượt chơi.

## 13. Cờ Việt Nam ở chân trang

Đầu trang không còn biểu tượng nào — chỉ **TÀI LIỆU PHI ĐOÀN** + gạch dẫn gradient amber
kéo hết bề ngang khối chữ, làm luôn đường kẻ đầu trang cho tiêu đề. Con dấu "Tối mật" đã
bỏ ở V10.07.

Lá cờ (`.vf`) vẽ **hơi cong như đang bay** — hai đường Bézier lượn ở mép trên và mép dưới,
không phải chữ nhật phẳng; ở cỡ 15px thì nếp cong là thứ duy nhất giúp nhận ra ngay đó là
lá cờ. Nó xuất hiện hai chỗ, mỗi chỗ một kiểu:

| Vị trí | Kiểu |
|---|---|
| Cuối dòng bản quyền | Đủ màu (đỏ + sao vàng), `opacity .42`, dính sát chữ "Honghandangiu" nhờ bọc chung `.crt` để khoảng `gap` của flex không đẩy ra |
| Trước tem Last updated | **Đơn sắc, ăn theo màu chữ** (`fill:currentColor`) và **sao rỗng** — một path duy nhất gộp thân cờ + ngôi sao với `fill-rule="evenodd"` nên ngôi sao bị khoét thủng. Xoay `90deg` để nằm dọc cùng hàng với dòng chữ |

## 18. Đọc được tem phân loại ở mọi trang hồ sơ

`#topScrim` là dải gradient tối, đặt `z-index:4`. Tem phân loại và nút `← Bản đồ` được đẩy
lên `z-index:7` và `9`, đồng thời tăng độ đục nền lên `.9` và tăng tương phản chữ/viền.
Cần vậy vì các trang trong hồ sơ có ảnh nền sáng tối khác nhau — nếu để nền tem mờ như cũ
thì trang nền sáng sẽ nuốt mất chữ.


## 19. Tracking riêng cho file hồ sơ (V10.07)

`xg/950109-a/index.html` deploy độc lập được, nên nó có đường báo riêng. Đầu đoạn tracking
có khối cấu hình:

```js
var TRACK = {
  mode:     'endpoint',    // 'endpoint' | 'telegram'
  endpoint: 'https://dongchi-binh-33.vercel.app/api/ping',
  tgToken:  '',
  tgChat:   ''
};
```

- **`endpoint`** (mặc định, khuyên dùng) — gửi qua `/api/ping` của trang bản đồ. Đang để
  URL tuyệt đối nên chạy được kể cả khi file này nằm ở domain khác.
- **`telegram`** — bắn thẳng lên Telegram, không cần server nào. Đổi `mode` và điền
  `tgToken` + `tgChat` là xong.

> **Cảnh báo bảo mật:** ở chế độ `telegram`, token nằm lộ trong mã nguồn trang — ai bấm
> "xem nguồn" cũng đọc được và có thể nhắn tin giả danh bot hoặc đọc lịch sử chat của nó.
> Nếu dùng, hãy tạo **một bot rác riêng** chỉ để làm việc này, đừng dùng chung với bot nào
> khác. Chế độ `endpoint` giấu token trong biến môi trường của Vercel nên an toàn hơn hẳn.

Sự kiện file này bắn: `ho_so_mo` (mở hồ sơ) · `trang_ho_so` (lật tới trang nào, kèm tiêu
đề, một lần mỗi trang) · `gui_form` (bấm nút **Gửi về căn cứ**) · `ho_so_dong` (rời trang,
kèm số trang đã xem và số giây ở lại).


## 20. Trình chặn quảng cáo chặn được tới đâu? (V10.08)

Câu trả lời ngắn: **chặn được một phần, và mình đã dựng ba tầng dự phòng.**

### Cái gần như chắc chắn bị chặn

`/_vercel/insights/script.js` và `/_vercel/speed-insights/script.js` — hai script này nằm
trong danh sách lọc của uBlock Origin, EasyPrivacy, AdGuard, và bị Brave chặn mặc định.
Mất chúng thì mất số liệu trong dashboard Vercel, **không ảnh hưởng** tới `/api/ping`.

### `/api/ping` — khó bị chặn hơn nhiều

Đây là **request first-party** (cùng domain với trang), đường dẫn không chứa từ khoá
"analytics", "track", "collect", "telemetry" nên không khớp mẫu lọc thông dụng. Trình
chặn hiếm khi đụng vào. Ba tầng dự phòng, tầng trước hỏng thì rơi xuống tầng sau:

1. `navigator.sendBeacon` — chạy nền, sống sót cả khi đang rời trang
2. `fetch` với `keepalive:true`
3. **Request ảnh** — `new Image().src = '/api/ping?ev=...'`. Endpoint nhận cả `GET` và trả
   về GIF trong suốt 1×1, nên trình duyệt coi đây là tải ảnh bình thường. Đây là đường
   sống sót cao nhất, vì môi trường nào chặn được cả ảnh first-party thì cũng đã hỏng nhiều
   thứ khác của trang rồi.

### Chế độ `telegram` — rủi ro cao hơn

`api.telegram.org` là **domain bên thứ ba**. Không nằm trong danh sách lọc quảng cáo,
nhưng bị chặn ở tầng khác: mạng công ty, DNS lọc, và **một số nhà mạng ở vài quốc gia chặn
thẳng Telegram**. Nếu chú Bình dùng Wi-Fi công ty hoặc VPN có lọc thì tin không tới.

> **Lỗi đã sửa ở V10.08:** bản trước gửi Telegram bằng `Content-Type: application/json`,
> kiểu này kích hoạt **preflight `OPTIONS`** chéo domain và rất hay hỏng — nghĩa là chế độ
> `telegram` gần như không chạy. Nay đổi sang `URLSearchParams` +
> `application/x-www-form-urlencoded`, tức "simple request", không preflight, đi thẳng.

### Cái không bao giờ chặn được

Bản thân việc **tải trang** thì luôn để lại dấu ở tầng hạ tầng: mục **Observability** của
Vercel đếm request tới `/` và `/xg/950109-a` bất kể trình duyệt chặn gì. Không chi tiết
bằng ping, nhưng đủ để biết "có người vào" và vào lúc nào.

### Kết luận thực dụng

Với một người xem là bạn trai/bạn gái dùng điện thoại cá nhân, khả năng mất tín hiệu là
**rất thấp**. Nếu muốn chắc hơn nữa thì dùng `mode: 'endpoint'` (mặc định) thay vì
`telegram`, vì nó là first-party và có đủ ba tầng dự phòng.


---

## 21. Bốn lớp thưởng của V10.10

### Bản đồ sáng dần theo tiến độ

Biến CSS `--lum` đặt trên `.frame`, giá trị `0.80 + 0.05 × số mật thư đã giải`. Đất liền,
viền neon và lớp nền láng giềng đều chạy `filter:brightness(var(--lum))`; đường bay dùng
`opacity: calc(.42 × --lum × --lum)` nên đậm lên nhanh hơn một chút, đủ để nhận ra.

| Đã giải | Độ sáng | Đường bay |
|---|---|---|
| 0/4 | 0.80 | 0.27 |
| 1/4 | 0.85 | 0.30 |
| 2/4 | 0.90 | 0.34 |
| 3/4 | 0.95 | 0.38 |
| 4/4 | **1.00** | **0.42** |

Hàm `lum()` gọi lại ở mọi mốc: bắt sóng, giải đúng, nạp trang, và reset.

### Mạng lưới các tỉnh

`<g class="grid">` chứa 22 chấm tỉnh và 24 đường nối, **chấm nhỏ bằng nửa** chấm toạ độ
chính (`r` 2.2 so với 4–4.4). Bình thường `opacity:0`. Khi đã giải đủ 4 và người xem đóng
hộp pí mật quay ra bản đồ, `gridFlash()` bật class `on`: các chấm nhấp nháy lệch pha trong
**5,8 giây** rồi mờ đi. Tự bỏ qua nếu máy bật `prefers-reduced-motion`.

Toạ độ tỉnh tính bằng đúng phép chiếu của bản đồ, muốn thêm tỉnh chỉ cần
`x = (lon-102)×57.816`, `y = (23.7-lat)×60`.

### Tem phiên bản đổi màu trứng phục sinh

`eggFlash()` gắn class `egg` cho `#stamp`, chạy vòng màu amber → xanh lá → xanh biển →
tím → hồng trong **4 giây**. Bật ở hai thời điểm: ngay sau khi giải xong quay ra bản đồ,
và **mỗi lần mở trang** khi đã hoàn thành (delay 0,9 giây cho trang dựng xong). Reset xong
rồi giải lại thì vòng lặp chạy lại từ đầu.

### Cửa sau: 10 cú bấm

`#stampZone` là vùng bấm trong suốt rộng 38px dọc mép trái, ôm lấy dòng Last updated.
Bấm **10 cái liên tiếp**, mỗi cú cách nhau dưới 0,9 giây, sẽ mở khung `#credw` giới thiệu
người dựng trang — hiện để chỗ trống, sửa nội dung ở thẻ `.cred-body`. Ngưng tay quá 0,9
giây là bộ đếm về 0. Sự kiện `cua_sau` cũng bắn về Telegram để bạn biết có người mò ra.

Vùng bấm này nằm ở mép trái, cách điểm sáng gần nhất (`HN`, khoảng 30% chiều ngang) rất
xa, nên không nuốt thao tác nào của trò chơi chính.


---

## 22. Nguyên tắc với file hồ sơ XG-950109-A

File này **giữ nguyên bản gốc từng byte**. Mọi thứ thêm vào nằm trong **một khối duy
nhất** ngay trước thẻ Vercel Analytics, mở đầu bằng:

```html
<!-- ↓ Bổ sung: đo đạc + luật điều hướng. KHÔNG đổi giao diện gốc. -->
```

Xoá khối đó là file trở về đúng bản gốc. Đã kiểm chứng bằng script: phần ngoài khối so
sánh **khớp tuyệt đối** với file gốc do bạn cung cấp.

Khối này chứa ba việc, không đụng gì tới bố cục, màu sắc hay luồng có sẵn:

**1. Đo đạc** — cùng hệ với trang bản đồ (`TRACK` với hai chế độ `endpoint`/`telegram`,
ba tầng dự phòng). Sự kiện: `ho_so_mo` · `trang_ho_so` · `nhay_phan1` · `gui_form` ·
`ho_so_dong`.

**2. Luật nút "Lùi" ở trang đầu** — trang bìa vốn có nút `‹ Lùi` bị khoá cứng (không lùi
được nữa). Nay nó đổi nhãn thành **Bản đồ** kèm biểu tượng bản đồ gấp có **ổ khoá**, và
được bật lên. Nhưng bấm vào thì **không ra bản đồ** — người xem bị đẩy thẳng tới trang
**Phần I · Khai báo liên lạc**. Đây là luật chơi: muốn về bản đồ thì khai báo đã.

Chặn bằng listener ở pha capture trên `document`, nên nó chạy **trước** `onclick` gốc
của nút; hàm `go()` gốc không bị sửa, chỉ được bọc thêm để cập nhật nhãn và đếm trang.
Đổi đích đến thì sửa hằng `PHAN1` (đang là `3`).

**3. Dọn thư mục** — bỏ `assets/` và `html2canvas.min.js` thừa: file hồ sơ đã nhúng sẵn
toàn bộ ảnh dạng base64 và thư viện, không tham chiếu file ngoài nào.

## 23. Cửa sau thứ hai: xoá sạch bằng lá cờ

Bấm **5 cái liên tiếp** vào lá cờ ở dòng bản quyền (mỗi cú cách nhau dưới 0,9 giây) sẽ mở
khung xác nhận **Về lại vạch xuất phát?**. Đồng ý thì xoá `localStorage` (`mtv1`,
`mtping`) và `sessionStorage` (`mtseen`, `mtload`, `mtvisit`) rồi tải lại trang — sạch
hoàn toàn, kể cả bộ đếm số lần chơi lại, đúng như lần đầu ai đó mở web.

Có bước xác nhận vì đây là thao tác **không thể hoàn tác**; 5 cú bấm nhanh vẫn có thể xảy
ra ngoài ý muốn. Lá cờ sáng nhẹ lên trong lúc đang đếm để người bấm biết mình đang kích
hoạt cái gì đó.

Phân biệt với hai cửa sau kia: **10 cú bấm** ở dòng Last updated → khung giới thiệu người
dựng trang; **nút Chơi lại** trong hộp pí mật → chỉ xoá tiến độ chơi, vẫn giữ bộ đếm số
lần reset.


---

## 24. Quy tắc đánh số phiên bản (từ V11)

`Vx.yy` — **yy chạy 00 → 09**, hết 09 thì `x` tăng 1 và `yy` về 00.
Ví dụ: `V11.09` → bản kế tiếp là `V12.00`. Sửa chuỗi ở thẻ `#stamp`.

## 25. ⚠️ LỊCH THEO NĂM — đọc trước khi sửa bất cứ gì liên quan tới thời gian

Toàn bộ mốc thời gian sinh ra từ **một bảng duy nhất** ở đầu script:

```js
const SEASON = { armBefore:15, birthday:[9,1], phase2At:[9,3], milestone2:[10,30] };
```

Hàm `season()` tự tính theo năm hiện tại và trả về ba pha:

| Pha | Khoảng | Đếm ngược tới | Trạng thái |
|---|---|---|---|
| `season` | 17-08 → hết 02-09 | 01-09 | XG có hồ sơ niêm phong `XG-950901-B` |
| `phase2` | 03-09 → 30-10 | 30-10 | HN hiện hồ sơ `HN-261030` |
| `off` | 31-10 → 16-08 năm sau | 01-09 mùa kế | Chỉ đếm ngược, chưa mở gì |

**Sang mùa mới** (bước vào pha `season` của một năm chưa từng chơi) thì tiến độ **bị xoá
sạch tự động** — trang về đúng trạng thái V11 mới tinh. Cơ chế: mốc `season` lưu kèm tiến
độ, chỉ reset đúng một lần cho mỗi mùa.

**Quy tắc chống xung đột cho bản cập nhật sau:**

1. **Không hardcode năm** ở bất cứ đâu. Cần mốc mới thì thêm vào `SEASON` rồi mở rộng
   `season()`; `NODES` chỉ trỏ tới các hằng do `season()` sinh ra (`BIRTHDAY`,
   `PHASE2_AT`, `MILESTONE2`).
2. **Không đổi ý nghĩa khoá lưu trữ** `mtv1`. Thêm trường mới thì thêm vào cả `save()` lẫn
   `boot()`, và luôn có giá trị mặc định để dữ liệu mùa cũ không làm vỡ mùa mới.
3. **Đừng gắn `unlockAt` bằng chuỗi ngày cứng** trong `NODES` — dùng `MILESTONE2` /
   `BIRTHDAY`, nếu không sang năm hồ sơ sẽ mở sai lúc.
4. Muốn dời sinh nhật hay thêm mốc thứ ba, sửa `SEASON` là đủ; đã kiểm chứng bằng mô
   phỏng 10 mốc thời gian từ 08-2026 tới 08-2027.

## 26. Huy chương kết thúc

Sau khi giải đủ 4 và quay ra bản đồ: bốn tên lửa cùng sáng + **mạng lưới 50 tỉnh** bừng
lên 15 giây. Hết 15 giây, `medalMode()` thay bốn tên lửa bằng **một huy chương** và con dấu
đỏ **MISSION COMPLETED** (căn giữa, không nghiêng — khác con dấu "Tối mật" nghiêng 3°).

| Hạng | Điều kiện |
|---|---|
| Vàng | đoán sai **dưới 5** lần |
| Bạc | đoán sai **5–9** lần |
| Đồng | đoán sai **từ 10** lần trở lên |

Bấm vào huy chương để mở lại hộp pí mật. Trạng thái này lưu (`medalOn`) nên lần sau vào
trang là thấy huy chương ngay, không phải chờ mạng lưới chạy lại.


---

## 27. Thay đổi của V11.04

### Nút xem lại hiệu ứng thành tab thứ 5

Trước đây có **hai** nút "Xem lại hiệu ứng" chồng nhau (một ở giữa hộp, một trong khối
chúc mừng) — đã bỏ cả hai. Nay là một **chip biểu tượng ↻** đứng cuối hàng tab
`HN · XG · GR · HZM`, chỉ hiện khi toạ độ **đang chọn** đã giải xong, và chạy lại đúng
hiệu ứng của toạ độ đó. Chuyển tab là nút đổi theo.

### Bốn hiệu ứng đã chỉnh

| Toạ độ | Nội dung |
|---|---|
| `HN` | Bỏ băng ghế. Nay là **hàng cây xanh mờ** (13 tán, vẽ **trước** hai cột đèn nên nằm hẳn phía sau), hai cột đèn vàng, và **con đường** kẻ vạch đứt chạy ngang chân khung |
| `XG` | Giữ sóng + mặt trời mọc, thêm **hai lớp núi mờ** ngoài xa nằm sau mặt trời |
| `GR` | Giữ bè nuôi trồng, thêm **con đường ven bờ** và **dây đèn võng** 16 bóng 5 màu nhấp nháy lệch pha phía trên |
| `HZM` | Bỏ hẳn bảng hiệu Pasteur Beer, chỉ còn pháo hoa |

### Mission Completed — sửa lỗi không chạy

Lỗi: hàm `medalMode()` **không được gọi** vì timeout của mạng lưới chỉ tắt lớp `on` chứ
không gọi tiếp. Nay `gridFlash()` gọi `medalMode()` khi hết **20 giây** (trước là 15).
Kết quả đúng như mô tả: bốn tên lửa **biến mất**, thay bằng **một huy chương** + con dấu
đỏ **MISSION COMPLETED** căn giữa, không nghiêng. Bấm vào mở lại hộp pí mật.

### Quy tắc nhấp nháy tem Last updated

| Tình huống | Có nháy không |
|---|---|
| Phiên đầu tiên trong ngày, **chưa** từng mở được khung giới thiệu | Có — mỗi ngày một lần |
| Đã từng mở được khung giới thiệu | Không nháy hằng ngày nữa |
| Vừa giải xong đủ 4 mật thư | Có, đúng một lần (`eggDone`) |

Mốc ngày lưu ở `eggDay` (dạng `YYYY-MM-DD`), cờ tìm ra cửa sau lưu ở `credFound`.

### Vài chỉnh nhỏ

- Bỏ **bộ đếm số lần reset** (`↻ n`) ở chân trang.
- Bấm thẻ **Phi vụ tiếp theo** giờ **mở toạ độ XG trên bản đồ** (gọi `open()`), không bay
  thẳng vào hồ sơ nữa — người xem vẫn thấy ngữ cảnh rồi tự chọn.
- Hộp xoá dữ liệu: tiêu đề **Reset Mission**, nội dung **"Ace Map & Nhận Huy Chương xịn hơn!"**
- Mạng lưới tỉnh nhấp nháy **20 giây**.


---

## 28. V11.05

### Lỗi đã sửa

- **Khối "Đã chinh phục toạ độ" hiện cả ở toạ độ chưa giải.** Lúc gỡ hai nút "Xem lại
  hiệu ứng" ở V11.04, đoạn CSS `.cx-won{display:none}` nằm lọt giữa hai nút nên bị xoá
  theo — khối mất luôn trạng thái ẩn. Đã khôi phục.
- **Núi ở XG không nhìn thấy.** Màu núi (`#16304a`) gần trùng nền, lại nhân thêm
  `globalAlpha .3` nên chìm hẳn. Nay núi cao gần gấp đôi, màu sáng hơn, và có **viền sáng
  trên sống núi** để tách khỏi nền.

### Tem phiên bản kèm số lần chơi lại

`Last updated 05-Aug-2026 · V12.02 · R2` — hậu tố `R{n}` chỉ hiện khi đã bấm chơi lại ít
nhất một lần. Chuỗi gốc nằm ở thuộc tính `data-base` của `#stamp`, hàm `stampText()` ghép
thêm phần `R{n}`.

### Hiệu ứng GR làm lại

Bỏ hết bè nuôi trồng. Nay là **con đường chạy dọc** thu hẹp dần về phía xa (phối cảnh một
điểm tụ), **mặt trăng khuyết ở góc trên phải** kèm quầng sáng, và **bốn cặp cột** căng dây
đèn võng ngang qua đường — 7→13 bóng mỗi dây, 5 màu, nhấp nháy lệch pha, cột càng gần thì
bóng càng to và sáng.

### Hộp pí mật khi chạy hiệu ứng

Hộp **trượt lên 22% và thu nhỏ còn 94%** (`.cxw.peek`) để lộ cảnh phía dưới, nền mờ nhạt
đi. Trong 5,4 giây đó, mọi đường thoát bị khoá: nút ✕ mờ và vô hiệu, bấm nền không đóng,
`Esc` cũng không ăn. Hết hiệu ứng, hộp tự trượt về giữa.

### Huy chương và Mission Completed

Huy chương thu về **17×21px** (bằng tên lửa) và **nằm lọt trong khung chữ** — khung viền
ngoài của huy hiệu chuyển trong suốt, chỉ còn đúng một khung đỏ ôm cả huy chương lẫn dòng
chữ. Quầng sáng của huy chương và tên lửa đều giảm ~12%.

### Bản đồ báo hoàn thành rõ hơn

Trong 20 giây mạng lưới chạy: chấm tỉnh sáng hơn và nảy to hơn, đường nối **chạy nét đứt**
(`gline`), và **cả đất liền nhấp nháy** theo nhịp 2,6 giây (`.frame.win`, brightness
1 → 1,35). Xong thì tắt sạch rồi hiện huy chương.

### Vài chỉnh nhỏ

- Thẻ đếm ngược: đợt 01-09 mở node **XG**, đợt 30-10 mở node **HN** (trước là dò node đầu
  tiên có `unlockAt` nên dễ trỏ nhầm).
- Khối eyebrow bỏ hết chữ, chỉ còn **hai vạch amber và ba hình thoi** ở giữa.
- Mã morse to thêm 15% ở cả ba chỗ hiển thị.
- Nút xác nhận xoá: **"Tôi chắc chắn, khum hối hựn!!!"**; nội dung thêm ദ്ദി(˵ •̀ ᴗ - ˵ ) ✧
  và đổi sang font Be Vietnam Pro + Noto Sans để không vỡ emoji.


---

## 29. V11.06 — sửa lỗi tự gây ra

### Lá cờ mất kiểu hiển thị

Ở V11.05 mình gỡ bộ đếm reset bằng cách cắt từ `.rc{` tới `.rc.on{...}`, nhưng ba quy tắc
`.vf`, `.crt`, `.flagzone` **nằm xen giữa** nên bị cắt theo. Thẻ `<button id="flagZone">`
và trình xử lý 5 cú bấm vẫn còn nguyên, chỉ mất phần tạo hình. Đã khôi phục đúng nguyên
văn bản V11.04.

> **Bài học ghi lại để không lặp:** khi xoá một khối CSS, phải cắt theo **đúng tên quy
> tắc** chứ không cắt theo khoảng giữa hai mốc — các quy tắc khác rất hay nằm chen vào
> giữa. Từ V11.06 mọi thao tác xoá CSS đều phải kiểm kê lại danh sách selector sau khi sửa.

### Tem phiên bản không hiện `R{n}`

`stampText()` được định nghĩa và gọi lúc reset, nhưng **chưa được gọi lúc khởi động** —
điều kiện tự kiểm tra của mình đếm nhầm nên bỏ qua bước chèn. Nay gọi trong khối boot,
`R{n}` hiện ngay khi mở trang.

### Các mục theo yêu cầu

- **Bảng hồ sơ** cao tối đa **58%** (trước 52%) để chữ không bị cắt ở đáy.
- **Mã morse trong bảng hồ sơ** tăng lên `13.1px` (+20%).
- **Hộp pí mật khi chạy hiệu ứng**: bỏ hẳn kiểu trượt lên, nay **mờ hẳn** (`opacity:0`)
  để nhìn trọn cảnh; vẫn khoá mọi đường thoát trong 5,4 giây.
- **Núi ở XG**: cao gần gấp đôi (biên độ 82 so với 46), đổi sang **nâu xám**
  (`rgba(122,104,92)` / `rgba(78,68,64)`) với viền sáng màu kem — tương phản hẳn với mặt
  biển xanh.
- **GR**: bỏ sạch màu xanh lá, bảng màu đèn nay là **pastel xanh–tím**; hai hàng cột giãn
  từ 24–76% ra **10–90%** bề ngang; thêm **hai lề đường sáng** và hai vệt mờ bên ngoài để
  đọc ra hình khối con đường.
- **Con dấu Mission Completed**: viền **2px kiểu con dấu** có thêm nét trong bằng
  `box-shadow inset`, giãn chữ `.3em`, khoảng cách huy chương ↔ chữ **13px**, khung ngoài
  của huy hiệu tắt hẳn nên chỉ còn đúng một con dấu căn giữa.

### Kiểm kê chống mất tính năng

Từ nay mỗi lần build chạy một bảng kiểm kê 13 nhóm (lá cờ, hộp Reset Mission, cửa sau tem,
huy chương, tên lửa, mạng lưới, hộp pí mật, bốn hiệu ứng, lịch năm, túi xáo, đo đạc, đếm
ngược, tem phiên bản). V11.06 qua đủ 13/13.


---

## 30. V11.07

### Hai nút biểu tượng trong hàng tab, có chú thích

Bỏ hẳn nút chữ **"Đã mở hết · chơi lại từ đầu"** chiếm cả bề ngang. Nay cuối hàng tab có
tối đa hai nút biểu tượng, mỗi nút hiện chú thích khi trỏ chuột (class `.tip` +
`data-tip`):

| Nút | Biểu tượng | Hiện khi | Chú thích |
|---|---|---|---|
| `#cxRp` | **cuộn phim** | toạ độ đang chọn đã giải | "Xem lại hiệu ứng ăn mừng" |
| `#cxRs` | **mũi tên quay vòng** | đã giải đủ 4/4 | "Chơi lại từ đầu" |

Hai biểu tượng khác hẳn nhau nên không nhầm được cái nào là xem lại, cái nào là xoá sạch.

### Bốn hiệu ứng

- **XG** — núi và biển phủ trọn khung: đường chân trời kéo lên `56%` chiều cao, biên độ
  núi tính theo `h` (30% và 21% chiều cao khung) thay vì số cứng, sóng thêm một lớp thứ
  năm, mặt trời to theo bề ngang màn hình.
- **GR** — thành **đường đất**: mặt đường nâu (`rgba(96,80,60)` → `rgba(74,58,42)`),
  hai bên là **thảm cỏ** xanh sẫm, lề đường màu đất, thay vạch sơn bằng **hai vệt bánh xe**
  và rải **26 nhúm cỏ lún phún** dọc hai mép.
- **HZM** — nửa dưới là **bờ kè ven sông**: mặt nước gradient, vệt sáng loang theo nhịp,
  bờ kè và **lan can hai thanh ngang + trụ đứng cách nhau 26px**. Pháo hoa **bay cao hơn**
  (trọng lực 0.055 → 0.034) và có **5 hình**: vòng tròn, tên lửa, tai mèo, công tắc, hoa
  mai — mỗi hình là một hàm bán kính theo góc trong `shapeR()`, hạt bắn ra theo đúng biên
  hình đó.

### Vài chỉnh khác

- Bảng hồ sơ có `min-height:46%` để toạ độ chưa có hồ sơ không để trống nửa màn hình,
  `max-height` nới lên 64% cho toạ độ nhiều hồ sơ.
- Con dấu **Mission Completed** hẹp lại: chữ 8,5px giãn `.13em`, khoảng cách huy chương ↔
  chữ 9px, huy chương 15×18,5px — bề ngang con dấu nay xấp xỉ hàng bốn tên lửa.
- Hộp **Reset Mission** bỏ tiêu đề trùng lặp, kaomoji tách xuống dòng riêng cỡ 17px.
- Bản đồ bừng sáng khi hoàn thành rút còn **15 giây**.

### Về hiệu ứng nhấp nháy tem Last updated

Không hỏng — đúng luật đã chốt ở V11.04: tem nháy **phiên đầu mỗi ngày** chỉ **cho tới khi
người xem mở được khung giới thiệu lần đầu** (`credFound`). Mở rồi là thôi hẳn, chỉ còn
nháy đúng một lần lúc giải xong 4/4. Nếu đang test và muốn thấy lại, bấm lá cờ 5 cái rồi
xác nhận Reset Mission — thao tác đó xoá cả `credFound`.


---

## 31. ⚠️ V11.08 — ĐỔI MÃ TOẠ ĐỘ (thay đổi phá vỡ tương thích)

| Cũ | Mới | Thư mục cũ | Thư mục mới |
|---|---|---|---|
| `HN` | **`HAN`** | `hn/261030` | `han/261030` |
| `XG` | **`DAD`** | `xg/950109-a` · `xg/950901-b` | `dad/950109-a` · `dad/950901-b` |
| `GR` | **`UIH`** | `gr/` | `uih/` |
| `HZM` | **`SGN`** | `hzm/` | `sgn/` |

Đổi đồng bộ ở **mọi nơi**: `NODES`, `SPOT`, thuộc tính `data-bcn`, nhãn hiển thị,
`aria-label`, mã hồ sơ (`DAD-950109-A`, `DAD-950901-B`, `HAN-261030`), đường dẫn, tên
thư mục, và khoá lưu trong `localStorage`.

> **Khi deploy:** phải **đổi tên thư mục trên repo** theo bảng trên, nếu không link
> `/dad/950109-a` sẽ 404. Tiến độ cũ trong máy người xem gắn theo mã cũ nên coi như bắt
> đầu lại — đúng ý đồ, vì luật chơi cũng đổi.

## 32. SGN là chốt cuối

`SGN` chỉ mở được khi **cả ba toạ độ kia đã bắt sóng** (hàm `gateOpen()`, hằng
`LAST_CODE`). Chưa đủ điều kiện mà thao tác lên nó thì **không có gì xảy ra**: không báo
lỗi, không gợi ý, không đổi giao diện, không ghi nhận. Người xem tự nhận ra là chưa tới
lượt — đúng yêu cầu "chỉ thể hiện không thay đổi gì thôi".

## 33. Hộp chỉ dẫn một lần

Lần **đầu tiên** bắt được mã morse từ bản đồ, một hộp nhỏ trồi lên ngay phía trên dòng
morse: *"Gõ đúp ra chỗ trống để về lại bản đồ"* kèm nút **Đã hiểu**. Tự tắt sau 7 giây,
hoặc tắt ngay khi người xem gõ đúp ra ngoài. Chỉ hiện **đúng một lần trong đời**
(cờ `coachDone`).

## 34. Bốn hiệu ứng sau V11.08

- **HAN** — công viên đêm: hàng cây mờ, hai cột đèn vàng, con đường.
- **DAD** — đảo tròn kiểu tranh khắc: sống đảo thoải, **hàng thông lô nhô** trên đỉnh,
  **ba con chim** nhỏ, **chiếc thuyền có người chèo** trôi ngang mặt nước, mặt trời giữ
  nguyên.
- **UIH** — đường đất, trăng góc phải, bỏ hết đốm đèn màu, thay bằng **9 lùm cây to nhỏ
  xen kẽ** hai bên đường, càng gần càng lớn.
- **SGN** — bờ kè ven sông, lan can, **hai bóng người tựa lan can ngắm pháo hoa**. Pháo
  hoa **chậm hơn hẳn**: tốc độ bắn giảm ~30%, trọng lực 0.034 → 0.022, hạt sống lâu gần
  gấp đôi, giãn cách giữa hai lượt nổ 700–1150ms (trước 430–790ms).

## 35. Chống spam cho `/api/ping` và đo lượt truy cập khi bị chặn

### Ba lớp chặn ở server

1. **Lọc sự kiện lạ** — `ev` không có trong bảng `NHAN` thì chỉ ghi log, không gửi
   Telegram. Người ngoài bịa tên sự kiện sẽ không làm phiền được.
2. **Chống lặp** — cùng `ev|detail` trong vòng **8 giây** chỉ gửi một lần.
3. **Trần 25 tin/phút** cho mỗi instance; vượt trần vẫn trả `204`/ảnh bình thường nhưng
   ngừng bắn Telegram.

Đã mô phỏng: 200 lần gọi cùng một sự kiện → gửi **1**; 200 sự kiện khác nhau → gửi **24**
rồi chặn phần còn lại. Bộ nhớ nằm trong RAM instance, không cần database.

Phía client cũng siết: `doi_tab` chuyển sang **chỉ gửi một lần cho mỗi mã**, trước đây
bấm qua lại là bắn liên tục.

### Đo được người dùng có trình chặn không?

Có, bằng **beacon ảnh không cần JS**. Cả trang bản đồ lẫn trang hồ sơ nay có sẵn trong
HTML:

```html
<img src="/api/ping?ev=tai_trang&detail=ban-do" alt="" width="1" height="1">
```

Endpoint nhận `GET` và trả về **GIF trong suốt 1×1**, nên trình duyệt coi đây là tải ảnh
bình thường. Ưu điểm so với mọi cách khác:

- **Không cần JavaScript** — chạy cả khi người xem tắt JS hoàn toàn.
- **First-party** — cùng domain, đường dẫn không chứa từ khoá tracker, nên không khớp
  danh sách lọc của uBlock/AdGuard/Brave.
- **Nằm sẵn trong HTML** — không phụ thuộc `fetch`, `sendBeacon` hay bất kỳ API nào có
  thể bị vá.

Muốn đo thêm trang nào (kể cả sub-page mới), chỉ cần dán thẻ `<img>` đó vào và đổi
`detail`. Cách duy nhất chặn được là chặn ảnh first-party — lúc đó trang cũng đã hỏng
phần lớn giao diện rồi.


---

## 36. V11.09

### Luật chơi

- **SGN phải nhập đáp án sau cùng.** Trước đây SGN chỉ bị chặn ở khâu *bắt sóng*; nay
  chặn thêm ở khâu *giải*: dù đã có mã morse, ô nhập vẫn khoá cho tới khi ba toạ độ kia
  giải xong, kèm dòng "Toạ độ này chốt sổ — giải xong ba toạ độ kia đã." Hàm `guess()`
  cũng chặn ở tầng logic, không chỉ ở giao diện.
- **Nút chơi lại hỏi lại một nhịp.** Bấm biểu tượng quay vòng → hộp **"Chú Bình chắc
  chưaaa?"** với hai lựa chọn **1000%** và **Xem xét**. Không còn xoá thẳng.
- **Lời khen dồn vào ô "đã chinh phục".** Bỏ hẳn dòng `#cxBingo` riêng; câu khen ngẫu
  nhiên nay là dòng đầu của khối chúc mừng, dòng thứ hai vẫn là lời mời liên hệ Hội đồng
  Meowmeow. Bớt được một dòng, gom về một khu vực.

### Bốn hiệu ứng

| | |
|---|---|
| **HAN** | Cảnh dâng lên giữa khung (mặt đất 80% → 74%). Thêm **trăng khuyết** vẽ bằng phép khoét `destination-out`, và **máy bay bay ngang** kéo **vệt khói mờ** dài 190px phía sau |
| **DAD** | Bỏ hàng thông. **Thuyền dài gấp đôi** (13% bề ngang khung), chở **hai người**: một ngồi ở mũi, một chèo ở lái nghiêng theo nhịp mái chèo |
| **UIH** | Bỏ nhúm cỏ. Thêm **44 ngôi sao** lấp lánh lệch pha, và **bóng đèn cyan pastel** treo trên sợi dây giữa hai thanh gỗ, 6–12 bóng mỗi dây tuỳ khoảng cách |
| **SGN** | **Bầu trời loé sáng theo màu từng đợt pháo hoa** rồi tắt dần (`skyFlash` giảm 6% mỗi khung hình). Hai bóng người vẽ lại rõ ràng: **một nam** đứng thẳng vai vuông, **một nữ** tóc dài xoã vai và váy loe, màu đen đặc `rgba(4,7,12,1)` để nổi hẳn khỏi trời |

### Bốn tên lửa reo cùng bản đồ

Lỗi: khi mạng lưới chạy, `showPz()` không được gọi lại nên huy hiệu giữ nguyên trạng thái
cũ. Nay có cờ `winCheer`: suốt **15 giây** mạng lưới, bốn tên lửa ở trạng thái `hail`
(cùng sáng, cùng co giãn theo nhịp); hết 15 giây mới đổi sang huy chương.

Chữ **Mission completed** được bọc trong `<span class="txt">` riêng với `line-height:1` và
bù `.5px`, nên nay nằm **đúng giữa theo chiều dọc** so với huy chương.

### Chữ trong hộp Reset

"Ace Map & Nhận Huy Chương xịn hơn!" giảm còn 13,5px và kaomoji còn 14px, cả hai đặt
`white-space:nowrap` — mỗi phần gọn đúng một dòng.


---

## 37. V11.10

### Lỗi đã sửa

- **Trăng khuyết ở HAN đục thủng cả nền.** Bản trước khoét trăng bằng
  `globalCompositeOperation = 'destination-out'` — phép này xoá **mọi pixel** phía dưới
  chứ không riêng mặt trăng, nên nó khoét luôn nền và các lớp đã vẽ trước. Nay trăng vẽ
  bằng **hai cung nối nhau** (`arc` xuôi rồi `arc` ngược), không đụng tới composite.
- **Hộp xác nhận chơi lại phải bấm ra nền mới hiện.** Cả ba hộp đều `z-index:24` nên hộp
  pí mật che mất. Nay `#wipew` là 26 và `#askw` là 27.
- **SGN rơi mất đầu.** Đầu và thân là hai path rời, thân chỉ cao 62% nên hở cổ. Nay vẽ
  **liền một khối đầu–cổ–vai–thân** trong hàm `nguoi()`, thêm tham số `nu` cho tóc dài và
  hông loe. Cả hai bóng nhỏ đi **20%**.
- **Khung Mission Completed hiện quá sớm.** `revealed` thêm điều kiện `!winCheer`, nên
  trong 15 giây reo mừng **chỉ có bốn tên lửa**, không chữ; hết 15 giây mới đổi sang
  huy chương + con dấu.

### Cửa hậu `hackmap`

Dòng "Bấm ra ngoài khung để huỷ" trong hộp Reset đổi thành chữ **hackmap** mờ. **Gõ đúp**
vào nó sẽ lộ ô nhập PIN:

- PIN đúng: **1959** → mở toàn bộ bản đồ (bắt sóng + giải cả bốn toạ độ), chạy luôn màn
  reo mừng, và từ đó dùng nút chơi lại bình thường.
- Gợi ý hiện khi trỏ chuột: **DAD-950901 TARO**.
- **Sai hai lần** → tự đóng mọi hộp, trả người dùng về bản đồ.

### Bốn hiệu ứng

| | |
|---|---|
| **HAN** | Trăng khuyết vẽ lại đúng cách, máy bay kéo vệt khói giữ nguyên |
| **DAD** | Thêm **nền trời chiều muộn** (cam nhạt sát chân trời → tím → xanh đêm), **mặt trời cao hơn** (nhô 78px thay vì 30px), thuyền **trôi từ trái sang phải** |
| **UIH** | Bỏ 44 đốm sao; giữ nguyên trăng, đường đất, lùm cây và đèn cyan pastel trên dây |
| **SGN** | Hai bóng người liền khối, nhỏ hơn 20%, đen đặc `rgba(3,6,11,1)`; trời vẫn loé theo màu pháo hoa |

### Đổi tông hộp pí mật sang xanh

Câu khen, viền khối chúc mừng, gờ trái của hộp, chữ "Hộp pí mật", tab đang chọn, hai nút
biểu tượng và nút **Giải** đều chuyển từ amber sang **cyan `#38BDF8` / `#8BE0FF`**. Amber
chỉ còn giữ ở những chỗ mang nghĩa phần thưởng: ô chữ đã giải, tên lửa, huy chương.

### SGN chốt sổ

Dòng thông báo khi chưa tới lượt đổi thành **"Chưa thể hạ cánh ở toạ độ này 𖾕𖾝꙼ᩚ𛲕𖾟"**.


---

## 38. V11.11

### Lỗi HAN — nguyên nhân gốc

Khối hiệu ứng HAN dùng biến `t` (vị trí máy bay, dao động độ cao) nhưng **không khai báo
`t` trong khối đó**. Mỗi khung hình `fxLoop` ném `ReferenceError: t is not defined`, làm
chết **cả vòng vẽ** — nên hiệu ứng không hiện gì. Đã thêm `t = now/1000` vào dòng khai báo
của khối, và **kiểm tra lại cả bốn khối**: HAN · DAD · UIH · SGN đều dùng `t` và đều đã
khai báo đủ.

> Ghi lại để tránh lặp: mỗi khối `if(fxMode===…)` là một scope riêng, biến dùng chung phải
> khai báo lại trong từng khối. Từ nay build có bước quét tự động "dùng `t` mà chưa khai
> báo `t`" cho cả bốn khối.

### Sửa theo phản hồi

- **DAD** — mặt trời nay **lặn** đúng chiều: xuất phát cao bên phải (đông) rồi chìm dần
  sang trái (tây) theo tiến độ hiệu ứng, thay vì mọc lên như trước.
- **UIH** — hiểu nhầm lần trước: mình xoá nhầm **trời sao**, trong khi thứ cần bỏ là
  **thảm cỏ xanh phủ nửa dưới khung**. Nay **trả lại 44 ngôi sao** và **bỏ hẳn nền cỏ**;
  đường đất, trăng, lùm cây, đèn cyan giữ nguyên.
- **Mission Completed** nhích lên `-1.5px` cho cân giữa với huy chương.
- **hackmap** sát viền hơn (`margin:14px 0 -4px`), chữ "Ace Map…" và kaomoji cùng giảm còn
  12,5px cho cân với tổng thể hộp.

### Quy ước khung viền

Mọi khung phụ nay dùng **đúng một kiểu**, lấy thẻ "Phi vụ tiếp theo" làm chuẩn: viền mảnh
`var(--line)`, **gờ amber 2px bên trái**, bo góc 5px, nền tối mờ. Áp cho hộp pí mật, khối
chúc mừng, hộp chỉ dẫn. **Chữ bên trong giữ tông xanh** — amber chỉ dùng cho viền và cho
những gì mang nghĩa phần thưởng (ô chữ đã giải, tên lửa, huy chương).

### Hộp PIN riêng

Ô nhập PIN tách khỏi hộp Reset thành **hộp riêng** `#pinw`: bốn ô gạch chân amber, gõ số
là hiện dấu chấm, **Enter** là xong — không có nút bấm. Sai hai lần vẫn tự đóng hết và trả
về bản đồ.


---

## 39. V12.00

### Sửa số phiên bản

Bản trước ghi nhầm **V11.11** — sai quy ước, vì `yy` chỉ chạy `00 → 09`, hết 09 là `x`
tăng 1. Đúng ra V11.09 → **V12.00**. Đã sửa và ghi lại quy ước ở mục 24 để không lặp.

### Hệ thống hộp PIN dùng chung

Một hộp, nhiều cửa khoá. Khai báo tập trung:

```js
const PINS = {
  hack: { code:'1959',   hint:'DAD-950901 TARO', label:'Mã truy cập bản đồ' },
  file: { code:'459157', hint:'Điện Biên Phủ',   label:'Mã mở hồ sơ niêm phong' }
};
```

Hộp tự dựng đúng số ô gạch theo độ dài mã (4 hay 6), tự đổi nhãn, và **gợi ý chỉ hiện sau
khi đã vào được hộp** — không còn tooltip trên chữ `hackmap` nữa. Sai hai lần thì đóng hết.

Cửa thứ hai: bấm vào **hồ sơ niêm phong `DAD-950901-B`** trong bảng hồ sơ sẽ mở hộp PIN
với gợi ý **Điện Biên Phủ**; nhập đúng **459157** là mở sớm hồ sơ đó, không cần chờ tới
01-09. Trạng thái lưu ở `pinFiles`, hàm `isOpen()` đã tính tới.

Thêm cửa khoá mới về sau chỉ cần thêm một mục vào `PINS` và một chỗ gọi `openPin('tên')`.

### Ba hiệu ứng

- **HAN** — máy bay **xuất phát từ giữa màn hình**, trăng **nghiêng 18°**, thêm **ba đám
  mây** trôi rất chậm (tốc độ 3,4–5 px/giây) ở ba độ cao khác nhau.
- **DAD** — mặt trời lặn **chậm hơn gần gấp đôi** (9 giây thay vì 5), và khi chạm mặt nước
  thì **dừng hẳn**, giữ nguyên **2/3 đĩa** phía trên đường chân sóng.
- **UIH** — giữ nguyên phối cảnh cũ. Thứ thực sự bị bỏ là **hai vệt xanh lá ở lề ngoài**
  (`rgba(120,150,110)` → đổi sang tông đất mờ), và **sao chỉ còn ở phía trên chân trời**
  nên không rơi xuống đè lên dây đèn cyan nữa.

Ngoài ra nền lúc chạy hiệu ứng đổi từ mờ 35% sang **đục 97%**, để bản đồ và mạng lưới phía
sau không lọt qua gây rối hình.

### Quy ước màu hộp thoại

Nhãn nhỏ trên đầu **mọi** hộp thoại (Lệnh xoá dấu vết, Hộp pí mật, Mã truy cập, Tổ kỹ
thuật) dùng **tông amber**; tiêu đề và chữ nội dung giữ tông sáng hoặc xanh. Viền vẫn theo
chuẩn thẻ "Phi vụ tiếp theo": viền mảnh + gờ amber 2px bên trái.

"Ace Map & Nhận Huy Chương xịn hơn!" và kaomoji nay nằm **chung một dòng**.


---

## 40. V12.01

- **Hồ sơ niêm phong đổi mã**: `DAD-950901-B` → **`DAD-950901-B`**, thư mục
  `dad/950901-b` → **`dad/950901-b`**. Nhớ đổi tên thư mục trên repo khi deploy, nếu
  không link sẽ 404.
- **Số lượt nhập sai** khai báo ngay trong bảng `PINS`:

| Cửa | Mã | Gợi ý | Sai bao nhiêu lần thì thoát | Thoát về đâu |
|---|---|---|---|---|
| `hack` | `1959` | DAD-950901 TARO | **2** | Bản đồ chính |
| `file` | `459157` | Điện Biên Phủ | **3** | Bảng hồ sơ của toạ độ |

  Mỗi lần sai còn báo rõ số lượt còn lại ("Sai rồi, còn 2 lượt"). Cửa `file` chỉ đóng hộp
  PIN, bảng hồ sơ vẫn mở nguyên nên người xem quay lại đúng chỗ vừa đứng. Sự kiện
  `sai_pin_ho_so` cũng bắn về Telegram.


---

## 41. V12.02 — sửa chỗ hiểu nhầm về PIN

Mình gắn nhầm PIN vào hồ sơ niêm phong. Đúng ra:

| Hồ sơ | Thư mục | Cơ chế mở |
|---|---|---|
| `DAD-950109-A` — **đã xuất bản** | `dad/950109-a` | Bấm vào là **hỏi PIN `459157`** (gợi ý *Điện Biên Phủ*) mới cho xem. Nhập đúng rồi thì nhớ luôn, lần sau vào thẳng |
| `DAD-950901-B` — **niêm phong** | `dad/950901-b` | Thuần theo ngày: tự mở đúng **00:00 ngày 01-09**, không có PIN |

Cụ thể trong mã: PIN là **trường `pin` của từng hồ sơ** trong `NODES`, xử lý ở `render()`;
`isOpen()` quay lại chỉ xét mốc thời gian, không dính tới PIN. Muốn khoá PIN cho hồ sơ nào
thì thêm `pin:'file'` vào hồ sơ đó — không cần sửa gì thêm.

Nhập đúng PIN thì **mở luôn hồ sơ** (chạy màn cất cánh rồi chuyển trang), không bắt bấm
lại. Sai **3 lần** thì đóng hộp PIN và trả về bảng hồ sơ của toạ độ, bảng vẫn mở nguyên.

> Mình chọn **nhớ PIN sau lần nhập đúng đầu tiên** để chú Bình không phải gõ lại mỗi lần
> xem. Nếu bạn muốn hỏi PIN **mỗi lần** thì bỏ dòng ghi `pinFiles[pinArg] = true` là xong.
