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

Dòng **Last updated 04-Aug-2026 · V10.04** chạy dọc mép trái bản đồ (class `.stamp`), tự ẩn khi zoom.
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

## 13. Lockup cờ Việt Nam

Trước đây lá cờ đứng trơ một mình trên đầu tiêu đề, không neo vào đâu. Nay nó là một
**lockup ba phần**: miếng vá (`.patch` — nền tối, viền mảnh, đổ bóng như phù hiệu khâu
trên áo) → nhãn **PHI ĐOÀN 950109** → **gạch dẫn gradient amber** kéo hết bề ngang khối
chữ. Gạch dẫn vừa cho lá cờ một đường chân đế, vừa thành đường kẻ đầu trang cho tiêu đề
bên dưới — hết cảm giác lửng lơ mà không phải thêm chi tiết trang trí nào.


---

## 14. Trạng thái điểm sáng (V10.02)

Ổ khoá / màu sắc **chỉ nói về mã morse**, không nói về hồ sơ:

| Điểm | Lúc mới vào | Sau khi bắt được sóng |
|---|---|---|
| `XG` (có hồ sơ) | Xám thép, giữ **icon máy bay**, quầng sáng **thở nhẹ** mời gọi | Amber, hết thở |
| `HN` `GR` `HZM` | Xám thép, **ổ khoá**, đứng yên | Amber, mất ổ khoá |

Nhịp thở (`.bcn.hint`, `@keyframes haloPulse` + `tagPulse`) chỉ gắn cho điểm **có hồ sơ mà
chưa bắt sóng** — nó là mũi tên chỉ đường duy nhất trên bản đồ, nên tắt ngay khi hết cần.

## 15. Deploy tách riêng file hồ sơ

`xg/950109-a/index.html` chạy độc lập được. Đầu đoạn tracking có hằng:

```js
var PING = '/api/ping';
```

Cùng domain với bản đồ thì để nguyên. Nếu upload sang **domain khác**, đổi thành URL
tuyệt đối, ví dụ `'https://dongchi-binh-33.vercel.app/api/ping'` — endpoint đã trả
`204` và không kiểm tra origin nên gọi chéo domain vẫn nhận được tín hiệu.


---

## 16. Ba tối ưu của V10.03

- **Preload font** — bộ Google Fonts nạp qua `rel="preload" as="style"` cộng thủ thuật
  `media="print" onload` nên không còn chặn dựng trang, kèm `<noscript>` dự phòng. Vẫn
  còn một nhịp đổi font rất ngắn (FOUT) vì URL file `.woff2` của Google thay đổi theo
  phiên bản, không hardcode preload được; muốn triệt tiêu hẳn thì phải tải font về
  self-host.
- **Ảnh chia sẻ** — `og.png` 1200×630 ở gốc repo, khai qua thẻ `og:` và `twitter:`.
  Ảnh dựng lại đúng từ dữ liệu bản đồ thật (cùng path SVG, cùng bảng màu), nên gửi link
  qua Messenger/Zalo là ra tấm ra món. Đổi ảnh thì thay file, giữ nguyên tên.
- **Nhắc nhẹ khi ngồi im** — **lượt ghé đầu tiên không nhắc gì cả**, để người xem tự mò
  ra cơ chế; đó mới là phần thưởng. Từ **lượt ghé thứ hai** trở đi, ngồi im 6 giây thì
  dòng lead đổi thành `Double-tap / Double-click to start mission` màu neon nhấp nháy
  (`visits` đếm theo phiên, lưu cùng tiến độ). Chạm hoặc gõ phím bất kỳ là trả về câu
  gốc. Không nhắc nữa khi đã bắt được mã morse. Sự kiện `nhac_goi_y` bắn về Telegram để
  bạn biết ai đang bí.


## 17. Dải chrome trên của trang hồ sơ

Nút `← Bản đồ` và tem phân loại nằm `position:absolute` ở đỉnh khung, còn `.content` thì
cuộn được — nên chữ chui xuống dưới hai thứ đó. Bản vá gồm hai phần, đều nằm trong đoạn
inject cuối `xg/950109-a/index.html`:

- `.content{padding-top:62px !important}` chừa sẵn chỗ cho dải chrome. Trang nào có
  `justify-content:center` thì thêm `padding-bottom:62px` cho cân đối trục dọc.
- `#topScrim` — dải gradient tối 70px phủ ngang đỉnh (`z-index:4`, nằm trên nội dung
  nhưng dưới tem và nút), để chữ cuộn qua thì mờ dần đi thay vì cắt ngang thô.

Chép sang sub-page mới thì mang theo cả hai, nếu sub-page đó cũng dùng khung `.frame` và
`.content` cuộn được.
