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
      │  chưa tới mốc → chỉ có đồng hồ, không vào được game
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
| `cua_dang_mo` | `Cửa đang mở cho anh…` |
| `moi_vao_game` | `Cổng đã thông. Vào giải mã thôi.` |
| `da_pha_dao` | `Phi ngựa tới Zoey’s Castle 🦄` |
| `nut_vao_game` | `▶ Bắt đầu giải mã` |
| `nut_choi_lai_game` | `↻ Chơi lại mini-game` |
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
| `idle_wrongs` | 3 | sai mấy lần thì chữ "thở" + hiện gợi ý |
| `slide_auto` | 3000 | tự chuyển ảnh slideshow |

### Toạ độ lớp phủ

Tính theo **% của ảnh nền** (không phải màn hình), đo trực tiếp từ `bg_r1.png` /
`bg_r2.png` nên lia camera hay đổi cỡ máy vẫn dính đúng chỗ.

| Lớp | Vị trí | Kích thước |
|---|---|---|
| Bệ đá Vòng 1 (`REZAR`) | `50.4%, 88%` | `width_frac 0.46` |
| Bệ đá Vòng 2 (`NUY OAHZ`) | `50.1%, 86%` | `width_frac 0.60` |
| Hotspot lá thư | `46.4%, 39%` | `16% × 22%`, không nhỏ hơn `min_px 56` |

`width_frac` = bề ngang cụm chữ so với khung máy. Cỡ chữ tự tính từ số ký tự
nên đổi chữ dài ngắn thế nào cũng không tràn khung. Vùng chạm lá thư thực tế
**99 × 60 px** trên máy 390 px — thoải mái cho ngón tay.

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
| `round1_wrong_hint` | `> GỢI Ý: 5 KÝ TỰ. THỨ VŨ KHÍ ANH VẪN CẦM MỖI ĐÊM.` | cam — từ lần sai thứ 3 |
| `round1_correct` | `> MÃ KHÓA HỢP LỆ! ĐANG TÁI CẤU TRÚC DỮ LIỆU...` | xanh lá |
| `round1_boom` | `> CẢNH BÁO! KẾT CẤU PHÒNG LAB ĐANG SỤP ĐỔ. RÚT LUI NGAY!` | cam |

### Vòng 2

| Khoá | Nội dung | Màu |
|---|---|---|
| `round2_intro` | `> PHÒNG LAB ĐÃ SẬP! BẠCH LONG ĐÃ THỨC TỈNH... HÃY GIẢI MÃ ĐỂ ĐỌC BÍ TỊCH.` | cyan |
| `round2_hint` | `> VÒNG 02 // Bệ đá trong rừng tàn tích khắc: "NUY OAHZ".`<br>`> Gọi đúng tên vị thần tướng cưỡi Bạch Long, cổ thư sẽ mở.` | xanh lá |
| `round2_wrong` | `> SAI RỒI! BẠCH LONG GẦM LÊN, HÀO QUANG CHUYỂN ĐỎ...` | đỏ |
| `round2_wrong_hint` | `> GỢI Ý: 8 KÝ TỰ, HAI TỪ. THƯỜNG SƠN TRIỆU TỬ LONG.` | cam — từ lần sai thứ 3 |
| `round2_correct` | `> MẬT MÃ CHÍNH XÁC! CHẠM VÀO LÁ THƯ ĐỂ ĐỌC NỘI DUNG...` | cyan |

### Dùng chung & kết

| Khoá | Nội dung |
|---|---|
| `unlocked_input` | `> ĐÃ MỞ LẠI Ô NHẬP. THỬ LẠI ĐI ANH.` |
| `finale` | `> BÍ TỊCH ĐÃ ĐƯỢC GIẢI PHONG ẤN. HÀNH TRÌNH HOÀN TẤT!`<br>`> CHÚC MỪNG SINH NHẬT ĐÔNG CHÍ BÌNH — 01.09 🎉`<br>`> ĐANG MỞ KHOÁ MÃ VÀO ZOEY’S CASTLE...` |

### Chữ giao diện (`ui`)

`boot_title` `EASTER EGG / GATE 02` · `start_btn` `▶ PRESS START` ·
`swipe_hint` `◄ VUỐT ĐỂ NGẮM BỐI CẢNH ►` · `unlock_btn` `UNLOCK` ·
`modal_title` `BÍ TỊCH BẠCH LONG` · `prev_btn` `< PREV` · `next_btn` `NEXT >` ·
`finish_btn` `[ HOÀN THÀNH HÀNH TRÌNH ]` · `hud_locked/unlocked` `LOCKED/UNLOCKED` ·
`back_label` `< THOÁT` · `round1.placeholder` `NHẬP MÃ KHÓA...` ·
`round2.placeholder` `NHẬP TÊN THẦN TƯỚNG...` · `round2.tap_label` `[ TAP HERE ]`

> ⚠️ **Font `Press Start 2P` không có dấu tiếng Việt.** Chỗ dùng font pixel
> (nút `UNLOCK`, HUD, `[ TAP HERE ]`, `PRESS START`, chữ trên bệ đá) phải giữ
> **không dấu**. Chỗ có dấu đã chuyển sang `Roboto Mono`: hộp thoại, dòng gợi ý
> vuốt, tiêu đề modal, nút hoàn thành, placeholder ô nhập.

---

## 5. Nội dung bức thư (`letter_content`)

```
Gửi Đông Chí Bình,

Nếu anh đọc được những dòng này, nghĩa là anh đã đi hết căn phòng lab ngầm, đã
gọi đúng tên vị thần tướng, và đã tới được nơi cuối cùng của hành trình.

Em giấu lá thư này trong miệng Bạch Long, vì em biết kiểu gì anh cũng tìm ra.
Anh luôn tìm ra.

Cảm ơn anh của một năm vừa rồi — những đêm anh thức khuya, những lần anh mệt mà
vẫn cười, và cả những lúc anh chẳng nói gì nhưng em vẫn hiểu.

Chúc mừng sinh nhật anh. Mong năm nay anh khỏe, ít lo, và luôn có người đứng
cạnh mỗi khi anh quay lại.

Hết màn rồi đó. Về nhà thôi.

— Hồng Hân
```

> Bản nháp để game chạy được ngay — **nên viết lại bằng lời của mình**.
> Xuống dòng được giữ nguyên. Chạm vào khung thư là hiện hết chữ, khỏi đợi.

---

## 6. Vài chỗ hay phải chỉnh

**Muốn phát mã TYRION ngay khi tới mốc, không bắt chơi game** — trong
`index.html`, hàm `Gate.moCong()`, đổi dòng
`if(Store.get().g2Game){ Code.open(); return; }` thành `Code.open(); return;`.
Nút *Chơi lại mini-game* trên màn mã vẫn vào game được.

**Muốn khung game dẹt như cũ** — `GAME_CONFIG.frame.ratio: 16/9`.

**Muốn khung game to/nhỏ hơn** — `GAME_CONFIG.frame.max_h` (0.44 = 44% chiều
cao màn). Tăng thì khung to ra, hộp thoại terminal ngắn lại.

---

## 7. Chống va chạm CSS (đọc trước khi thêm style)

Hai màn vốn là hai trang riêng, gộp vào là đụng nhau đúng ba chỗ: id `#app`,
ba biến `--neon` / `--amber` / `--paper` (khác giá trị nhau), và selector trần
`h1{}` `p{}` bên màn đếm ngược sẽ ăn luôn vào markup game.

Luật đã chốt trong `index.html`:

- **Không** khai biến màu nào ở `:root`. Màn đếm ngược + màn mã khai trong
  `.gate-look`, màn game khai trong `#scene-game`.
- **Mọi** selector đều phải có tiền tố `.gate-look ` hoặc `#scene-game `.

Thêm CSS mới cứ theo đúng hai luật đó là không bao giờ đụng.

---

## 8. Vài điều đã xử lý sẵn

- **Bàn phím ảo** không đẩy vỡ khung: chiều cao thật lấy từ `visualViewport`,
  khung tự co mà **không méo tỷ lệ** (trình duyệt không truyền `max-height`
  ngược qua `aspect-ratio`, nên bề ngang khung do JS chốt bằng px).
- **Không còn khoảng trống chết** giữa khung game và hộp thoại: `#stage` để
  `height:auto`, chiều cao do đúng nội dung quyết định.
- **Chạm lá thư không bị nuốt** khi vuốt camera: vùng hotspot không khởi động
  thao tác kéo (`setPointerCapture` sẽ kéo `click` lên khung máy), và đã vuốt
  thì cú thả tay không tính là chạm.
- **Tấm biển neon che hẳn chữ khắc sẵn** trên đá, nên lúc `REZAR → RAZER`
  không lộ chữ cũ bên dưới.
- **Clip `.webp` lặp vô hạn** → mỗi lần phát tạo thẻ ảnh mới (cùng URL nên lấy
  từ cache, không tải lại), hết thời lượng thì gỡ ra.
- **Ảnh nặng** (bg 8 MB, clip 24 MB): màn `LOADING` chỉ chờ nền Vòng 1, phần
  còn lại nạp ngầm; clip nổ được bảo đảm tải xong trước khi phát.
