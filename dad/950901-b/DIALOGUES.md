# DAD-950901-B · Bảng chữ & cấu hình

Toàn bộ **câu chữ + thông số** của Gate 2 nằm ở **`config.js`**.
File `index.html` chỉ là bộ máy — sửa nội dung không cần mở nó.

> File `.md` này chỉ để đọc cho dễ, **game không nạp nó**. Sửa xong nhớ chép
> sang `config.js`.

---

## 0. Cấu trúc thư mục

```
dad/950901-b/
├── index.html        ← 3 màn trong 1 file (đếm ngược · game · mã TYRION)
├── config.js         ← ★ SỬA Ở ĐÂY: GATE_CONFIG + GAME_CONFIG
├── DIALOGUES.md      ← file này
├── bg_r1.png         3136×1376 · phòng lab ngầm, bệ đá "REZAR"
├── bg_r2.png         3136×1376 · rừng tàn tích, Bạch Long ngậm thư
├── anim_wrong.webp   1280×561  · ổ khoá rung đỏ (~2s)
├── anim_unlock.webp  800×350   · nổ sập lab + thức tỉnh Bạch Long (~8s)
└── photo_1..5.jpg    ⚠️ CHƯA CÓ — game tự vẽ ảnh pixel thay thế
```

Thêm ảnh kỷ niệm thật: chép `photo_1.jpg` … `photo_5.jpg` vào đúng thư mục này.
Thiếu tệp nào thì ô đó hiện ảnh pixel thay thế (trái tim + `MEMORY 0x · N/A`),
game vẫn chạy. Muốn ít/nhiều hơn 5 ảnh thì sửa mảng `photos` và `photo_captions`.

---

## 1. MỘT MẠCH, BA MÀN

```
① #scene-gate  ĐẾM NGƯỢC tới 00:00 · 01-09 (giờ VN)
      │  chưa tới mốc → đồng hồ + nút [ ← Về bản đồ ], không vào được game
      │  tới mốc, ghé lần đầu → đếm thêm 10 giây
      ↓  hiện nút [ ▶ Bắt đầu giải mã ]
② #scene-game  MINI-GAME 2 VÒNG
      │  Vòng 1 RAZER → nổ sập lab → Vòng 2 ZHAO YUN → đọc thư
      ↓  bấm [ HOÀN THÀNH HÀNH TRÌNH ] → pháo hoa
③ #scene-code  PHÁ ĐẢO · phát mã TYRION · đi Zoey's Castle
```

**Đổi so với bản cũ:** mã `TYRION` giờ là phần thưởng của việc **chơi xong
mini-game**, không phải chỉ của việc tới đúng ngày.

> ⚠️ Nghĩa là **không phá đảo được mini-game thì không lấy được mã vào Map 3**.
> Đã chốt sẵn hai đường lùi: chơi xong một lần là nhớ vĩnh viễn (cờ `mtv1.g2Game`),
> vào lại đi thẳng màn mã; và nút `< THOÁT` trong game luôn quay về được. Nếu
> muốn nới ra, xem mục 6.

### Cờ nhớ trong `localStorage` (khoá `mtv1`)

| Cờ | Khi nào bật | Tác dụng |
|---|---|---|
| `eggWin` | vừa mở trang | Map 3 biết đã qua Gate 2 |
| `g2Vao` | lần đầu ghé sau mốc | lần sau khỏi đếm lại 10 giây |
| `g2Game` | bấm *Hoàn thành hành trình* | vào lại là tới thẳng màn mã |
| `g2Hack` | cửa hậu từ Box Tổng tư lệnh | bỏ qua mốc 01-09 |
| `g2Hint` | mỗi lần nhập sai | số gợi ý đã mở + mốc giờ mở gợi ý gần nhất |

---

## 2. `GATE_CONFIG` — màn đếm ngược & màn mã

| Khoá | Mặc định | Ghi chú |
|---|---|---|
| `moc_iso` | `{YEAR}-09-01T00:00:00+07:00` | `{YEAR}` tự thay bằng năm hiện tại. Ghi múi `+07:00` nên máy ở đâu cũng chốt đúng nửa đêm VN |
| `cho_lan_dau_ms` | `10000` | ghé lần đầu sau mốc thì đếm thêm 10 giây. Đặt `0` để bỏ |
| `ma` | `TYRION` | **phải khớp** hằng `PIN_A` bên `han/961030-a` |
| `ma_link` | `/han/961030-a?from=map` | nút đi Map 3 |

Chữ trong `GATE_CONFIG.text`:

| Khoá | Nội dung |
|---|---|
| `vai_truoc` / `vai_sau` | `Player: Dongchi Bình` / `Winner: Dongchi Bình` |
| `tieu_de` / `nhan_khoa` | `Easter Egg: Gate 2` / `Locked` |
| `tieu_de_thang` | `Phá Đảo` |
| `hen` | `Hẹn anh <b>00:00 ngày {DATE}</b>` |
| `cua_dang_mo` | `Cửa sẽ mở trong vài giây nữa…` |
| `moi_vao_game` | `Cổng đã thông. Dongchi Bình đang tiến vào phòng lab.` |
| `da_pha_dao` | `Phi ngựa tới Zoey’s Castle 🦄` |
| `nut_vao_game` | `▶ Bắt đầu giải mã` |
| `nut_ve_ban_do` | `← Về bản đồ` — chỉ hiện khi **chưa tới ngày** |
| `nut_choi_lai_game` | `↻ Chơi lại Easter Egg: Gate 2` |
| `ma_nhan` | `Zoey’s Castle Key` |
| `nut_castle` / `nut_reset` | `Zoey’s Castle` / `↻ Chơi lại` |
| `nut_reset_hoi` | `Chắc chưa?` — nút reset bấm **hai nhịp** mới ăn |

---

## 3. `GAME_CONFIG` — mini-game

### Khung máy (`frame`)

| Khoá | Mặc định | Ghi chú |
|---|---|---|
| `ratio` | `4/3` | tỷ lệ khung. Đổi `16/9` là về khung dẹt bản cũ |
| `max_h` | `0.44` | trần chiều cao khung so với cả màn |
| `max_h_kb` | `0.30` | khi bàn phím ảo bật |
| `world_ratio` | `3136/1376` | tỷ lệ thật của ảnh nền — chỉ đổi khi thay ảnh |

> Ảnh nền rộng **2.28:1**, khung chỉ **4:3** → phần dư ngang ~127 px mỗi bên
> (máy 390 px) chính là biên độ vuốt ngắm cảnh.

### Mật khẩu

| Vòng | Chữ khắc trên bệ đá | Mật khẩu | Chấp nhận thêm | Màu neon |
|---|---|---|---|---|
| 01 | `REZAR` | `RAZER` | — | Cam `#ffaa00` |
| 02 | `NUY OAHZ` | `ZHAO YUN` | `ZHAOYUN` | Cyan `#00f2ff` |

So khớp **bỏ hết dấu cách, không phân biệt hoa thường** — gõ `zhao yun`,
`ZhaoYun`, `ZHAOYUN` đều vào được. Ô nhập tự in hoa.

### Chữ trên bệ đá — cơ chế

Overlay **trùng khít chữ khắc có sẵn trong ảnh**, không phải một tấm biển đè lên.
Toạ độ đo bằng cách dò pixel chữ khắc, nên nhìn như chính chữ trên đá sáng lên:

| Trạng thái | Hiện tượng |
|---|---|
| Không gõ / gõ sai ký tự | **Tắt hẳn** (`opacity: 0`) — chỉ thấy chữ khắc trong ảnh gốc |
| Gõ trúng một ký tự có trong từ | Đúng chữ cái đó **chớp sáng 0.3s** |
| Xoá phím | Không sáng gì |
| Sai 3 lần / 20s không gõ | Cả cụm chữ **thở nhẹ một nhịp** làm gợi ý |
| Giải đúng | Chữ đảo về đúng thứ tự + **sáng rực 100%**, tấm nền mờ vào che chữ khắc cũ |

### Mốc thời gian (`timing`, ms)

| Khoá | Mặc định | Ý nghĩa |
|---|---|---|
| `intro_pan` | 2500 | camera lia vào round rồi neo giữa |
| `recenter` | 900 | thả tay → trôi mượt về giữa |
| `anim_wrong` | 2000 | clip ổ khoá rung đỏ |
| `lock_after_bad` | 2000 | khoá ô nhập sau mỗi lần sai |
| `glow_hold` | 3000 | giữ chữ `RAZER` sáng rực trước khi nổ |
| `anim_unlock` | 8000 | clip nổ sập lab |
| `type_speed` | 24 | mỗi ký tự hộp thoại |
| `letter_speed` | 26 | mỗi ký tự bức thư |
| `idle_hint` | 20000 | không gõ bao lâu thì chữ "thở" |
| `idle_wrongs` | 3 | sai mấy lần thì chữ "thở" |
| **`hint_every_wrongs`** | **3** | **sai mấy lần thì mở thêm một gợi ý** |
| **`hint_cooldown_ms`** | **900000** | **hai gợi ý phải cách nhau 15 phút** |
| `slide_auto` | 3000 | tự chuyển ảnh slideshow |

### Toạ độ lớp phủ

Tính theo **% của ảnh nền** (không phải màn hình) nên lia camera hay đổi cỡ máy
vẫn dính đúng chỗ. `width_pct` = bề ngang cụm chữ so với ảnh nền; cỡ chữ được
**đo hai nhịp lúc chạy** để khớp đúng bề ngang chữ khắc, đổi chữ dài ngắn thế
nào cũng tự vừa.

| Lớp | Vị trí (tâm) | Kích thước |
|---|---|---|
| Bệ đá Vòng 1 (`REZAR`) | `50.37%, 93.35%` | `width_pct 6.38` |
| Bệ đá Vòng 2 (`NUY OAHZ`) | `50.03%, 85.86%` | `width_pct 6.15` |
| Hotspot lá thư | `46.4%, 39%` | `16% × 22%`, không nhỏ hơn `min_px 56` |

Vùng chạm lá thư thực tế **99 × 60 px** trên máy 390 px — thoải mái cho ngón tay,
còn vòng sáng thu nhỏ ôm đúng cuộn thư.

---

## 4. Toàn bộ thoại (`GAME_CONFIG.dialogues`)

### Khởi động (`boot`) — xám hệ thống

```
> KHỞI ĐỘNG HỆ THỐNG DAD-950901-B... [OK]
> KẾT NỐI PHÒNG LAB NGẦM... [OK]
> CẢNH BÁO: MỘT CỔ VẬT ĐANG NIÊM PHONG CỔNG RA.
```

### Vòng 1

| Khoá | Nội dung | Màu |
|---|---|---|
| `round1_intro` | `> VÒNG 01 // Trước mặt anh là bệ đá khắc năm chữ cái đã bị đảo lộn: "REZAR".`<br>`> Sắp lại đúng thứ tự rồi gõ vào ô mã bên dưới để phá niêm phong.` | xanh lá |
| `round1_wrong` | `> TRUY CẬP BỊ TỪ CHỐI! MÃ KHÓA KHÔNG HỢP LỆ.` | đỏ |
| `round1_correct` | `> MÃ KHÓA HỢP LỆ! ĐANG TÁI CẤU TRÚC DỮ LIỆU...` | xanh lá |
| `round1_boom` | `> CẢNH BÁO! KẾT CẤU PHÒNG LAB ĐANG SỤP ĐỔ. RÚT LUI NGAY!` | cam |

### Vòng 2

| Khoá | Nội dung | Màu |
|---|---|---|
| `round2_intro` | `> PHÒNG LAB ĐÃ SẬP! BẠCH LONG ĐÃ THỨC TỈNH... NHẬP MÃ ĐỂ NHẬN BÍ TỊCH.` | cyan |
| `round2_hint` | `> VÒNG 02 // Bệ đá trong rừng tàn tích khắc: "NUY OAHZ".` | xanh lá |
| `round2_wrong` | `> MẬT MÃ KHÔNG HỢP LỆ! VUI LÒNG THỬ LẠI.` | đỏ |
| `round2_correct` | `> MẬT MÃ CHÍNH XÁC! CHẠM VÀO LÁ THƯ ĐỂ ĐỌC NỘI DUNG...` | cyan |

### Dùng chung & kết

| Khoá | Nội dung |
|---|---|
| `unlocked_input` | `> ĐÃ MỞ LẠI Ô NHẬP. DONGCHI VUI LÒNG THỬ LẠI.` |
| `finale` | `> BÍ TỊCH ĐÃ ĐƯỢC GIẢI PHONG ẤN. HÀNH TRÌNH HOÀN TẤT!`<br>`> CHÚC MỪNG SINH NHẬT ĐÔNG CHÍ BÌNH — 01.09 🎉`<br>`> ĐANG MỞ KHOÁ MÃ VÀO ZOEY’S CASTLE...` |

---

## 5. Hệ thống gợi ý (mới)

**Luật:** cứ **sai 3 lần** mở thêm một gợi ý, nhưng **mỗi gợi ý cách nhau 15 phút**.
Chưa đủ giờ thì game báo còn phải chờ bao lâu chứ không phát.

Số lần sai và mốc giờ đều nhớ trong `localStorage` (`mtv1.g2Hint`), nên **tải lại
trang hay bấm chơi lại đều không lách được**.

### Vòng 1 (`round1.hints`)

| # | Mở sau | Nội dung |
|---|---|---|
| 1 | 3 lần sai | `5 KÝ TỰ. TÊN 1 THƯƠNG HIỆU.` |
| 2 | 6 lần sai + 15 phút | `TENET CONCEPT` |
| 3 | 9 lần sai + 30 phút | `BÊN PHẢI PHÒNG LAB` |
| 4 | 12 lần sai + 45 phút | `HÃNG GAMING NỔI TIẾNG` |

### Vòng 2 (`round2.hints`)

| # | Mở sau | Nội dung |
|---|---|---|
| 1 | 3 lần sai | `Một nhân vật có thật nổi tiếng` |
| 2 | 6 lần sai + 15 phút | `Cưỡi ngựa trắng` |
| 3 | 9 lần sai + 30 phút | `Vị tướng này dùng Long Đảm Thương` |
| 4 | 12 lần sai + 45 phút | `Một nhân vật Tam Quốc` |

### Khuôn câu thông báo

| Khoá | Nội dung | Khi nào |
|---|---|---|
| `hint_show` | `> GỢI Ý {N}: {TEXT}` | mở được gợi ý mới (màu cam) |
| `hint_wait` | `> GỢI Ý {N} ĐÃ SẴN SÀNG NHƯNG CÒN KHOÁ {M} PHÚT NỮA.` | đủ số lần sai nhưng chưa đủ giờ (màu xám) |
| `hint_done` | `> ĐÃ HẾT GỢI Ý. TỰ LỰC THÔI DONGCHI.` | đã mở hết 4 gợi ý |

`{N}` số thứ tự · `{TEXT}` nội dung gợi ý · `{M}` số phút còn phải chờ.

> Muốn dễ hơn: hạ `hint_cooldown_ms` (ví dụ `60000` = 1 phút) hoặc
> `hint_every_wrongs`. Muốn bỏ hẳn khoá giờ: đặt `hint_cooldown_ms: 0`.

---

## 6. Chữ giao diện (`ui`)

`boot_title` `EASTER EGG / GATE 02` · `boot_sub` `Đang nạp dữ liệu phòng lab ngầm…` ·
`boot_ready` `Dữ liệu đã sẵn sàng.` · `start_btn` `▶ PRESS START` ·
`swipe_hint` `◄ VUỐT ĐỂ NGẮM BỐI CẢNH ►` · `unlock_btn` `UNLOCK` ·
`modal_title` `BÍ TỊCH BẠCH LONG` · `prev_btn` `< PREV` · `next_btn` `NEXT >` ·
`finish_btn` `[ HOÀN THÀNH HÀNH TRÌNH ]` · `hud_locked/unlocked` `LOCKED/UNLOCKED` ·
`back_label` `< THOÁT` · `round1.placeholder` `NHẬP MÃ KHÓA...` ·
`round2.placeholder` `NHẬP MẬT MÃ...` · `round2.tap_label` `[ TAP HERE ]`

> ⚠️ **Font `Press Start 2P` không có dấu tiếng Việt.** Chỗ dùng font pixel
> (nút `UNLOCK`, HUD, `[ TAP HERE ]`, `PRESS START`, chữ trên bệ đá) phải giữ
> **không dấu**. Chỗ có dấu đã chuyển sang `Roboto Mono`: hộp thoại, dòng gợi ý
> vuốt, tiêu đề modal, nút hoàn thành, placeholder ô nhập.
>
> `boot_ready` cố tình để **ngắn một dòng** — câu dài sẽ rớt một chữ xuống dòng
> riêng, nhìn rất vô duyên.

---

## 7. Nội dung bức thư (`letter_content`)

```
Gửi Dongchi Bình,

Em không biết anh có tới được đây không hoặc lúc này tụi mình đã nói chuyện lại
với nhau chưa. Hôm anh bảo thích trang website, em đã nghĩ tới concept làm series
mini-games cho anh chơi thay vì đi mua quà như dự tính. Em hy vọng anh thích.

Mong anh giữ được ước mơ mà anh hằng ấp ủ và thực sự biến nó thành sự thật. Mong
những nuối tiếc về quá khứ của anh sớm được bù đắp vào rất nhiều năm tới đây.
Mong anh tìm thấy sự bình yên, tròn đầy mà anh hằng khao khát.

p.s: Cũng có lúc em nản lòng, nhưng em nghĩ thôi vậy, design game cũng là một
trong những niềm vui của em. Quá trình làm tặng anh em cũng đã thấy vui. Dù người
nhận thì đáng ghét (nvm) và em cũng không chắc mình sẽ tặng anh không. You get
what you deserve.

Chúc mừng sinh nhật anh. Mong năm nay anh khỏe, bớt lo nghĩ xa xôi, luôn dũng cảm
và chân thành.

Hết màn rồi đó. Về nhà thôi.

— Em. Hồng Hân kí tên.
```

Xuống dòng được giữ nguyên khi hiển thị. Chạm vào khung thư là hiện hết chữ ngay,
khỏi đợi gõ xong.

---

## 8. Vài chỗ hay phải chỉnh

**Muốn phát mã TYRION ngay khi tới mốc, không bắt chơi game** — trong
`index.html`, hàm `Gate.moCong()`, đổi dòng
`if(Store.get().g2Game){ Code.open(); return; }` thành `Code.open(); return;`.
Nút *Chơi lại Easter Egg: Gate 2* trên màn mã vẫn vào game được.

**Muốn khung game dẹt như cũ** — `GAME_CONFIG.frame.ratio: 16/9`.

**Muốn khung game to/nhỏ hơn** — `GAME_CONFIG.frame.max_h` (0.44 = 44% chiều
cao màn). Tăng thì khung to ra, hộp thoại terminal ngắn lại.

**Muốn chữ trên bệ đá to/nhỏ hơn** — `slab.width_pct`. Nhưng đang khớp đúng chữ
khắc trong ảnh, tăng lên là lệch ra ngoài bệ đá.

**Xoá tiến độ gợi ý để test** — `localStorage.removeItem('mtv1')` hoặc sửa riêng
`mtv1.g2Hint`.

---

## 9. Chống va chạm CSS (đọc trước khi thêm style)

Hai màn vốn là hai trang riêng, gộp vào là đụng nhau đúng ba chỗ: id `#app`,
ba biến `--neon` / `--amber` / `--paper` (khác giá trị nhau), và selector trần
`h1{}` `p{}` bên màn đếm ngược sẽ ăn luôn vào markup game.

Luật đã chốt trong `index.html`:

- **Không** khai biến màu nào ở `:root`. Màn đếm ngược + màn mã khai trong
  `.gate-look`, màn game khai trong `#scene-game`.
- **Mọi** selector đều phải có tiền tố `.gate-look ` hoặc `#scene-game `.

Thêm CSS mới cứ theo đúng hai luật đó là không bao giờ đụng.

---

## 10. Vài điều đã xử lý sẵn

- **Chữ trên bệ đá không lộ đáp án**: overlay trùng khít chữ khắc, mặc định tắt
  hẳn, chỉ chớp sáng đúng ký tự vừa gõ trúng.
- **Nút trên màn đếm ngược không lệch góc**: `<button>` mặc định co theo nội dung
  dù đã `display:block`, phải có `width:100%` mới căn giữa như thẻ `<a>`.
- **Bàn phím ảo** không đẩy vỡ khung: chiều cao thật lấy từ `visualViewport`,
  khung tự co mà **không méo tỷ lệ** (trình duyệt không truyền `max-height`
  ngược qua `aspect-ratio`, nên bề ngang khung do JS chốt bằng px).
- **Không còn khoảng trống chết** giữa khung game và hộp thoại: `#stage` để
  `height:auto`, chiều cao do đúng nội dung quyết định.
- **Chạm lá thư không bị nuốt** khi vuốt camera: vùng hotspot không khởi động
  thao tác kéo (`setPointerCapture` sẽ kéo `click` lên khung máy), và đã vuốt
  thì cú thả tay không tính là chạm.
- **Thứ tự khởi tạo**: khối `Gate` chạy trước `Game`/`Code` nhưng nhịp đếm đầu
  có thể gọi thẳng `Code.open()`, nên phải hoãn sang vòng sau để không vấp TDZ.
  Chỗ canh dùng cờ thường, **không dùng `typeof`** — `typeof` trên một `const`
  đang trong vùng chết vẫn ném lỗi.
- **Clip `.webp` lặp vô hạn** → mỗi lần phát tạo thẻ ảnh mới (cùng URL nên lấy
  từ cache, không tải lại), hết thời lượng thì gỡ ra.
- **Ảnh nặng** (bg 8 MB, clip 24 MB): màn `LOADING` chỉ chờ nền Vòng 1, phần
  còn lại nạp ngầm; clip nổ được bảo đảm tải xong trước khi phát.
