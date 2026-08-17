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
├── bg_r1.png         3136×1376 · phòng lab ngầm
├── bg_r2.png         3136×1376 · rừng tàn tích, Bạch Long ngậm cuộn thư
├── anim_wrong.webp   1280×561  · ổ khoá rung đỏ (~2s)
├── anim_unlock.webp  800×350   · nổ sập lab + thức tỉnh Bạch Long (~8s)
└── photo_1..5.jpg    ⚠️ CHƯA CÓ — game tự vẽ ảnh pixel thay thế
```

Thêm ảnh kỷ niệm thật: chép `photo_1.jpg` … `photo_5.jpg` vào đúng thư mục này.
Thiếu tệp nào thì ô đó hiện ảnh pixel thay thế, game vẫn chạy. Muốn ít/nhiều
hơn 5 ảnh thì sửa mảng `photos` và `photo_captions`.

---

## 1. MỘT MẠCH, BA MÀN

```
① #scene-gate  ĐẾM NGƯỢC tới 00:00 · 01-09 (giờ VN)
      │  chưa tới mốc → đồng hồ + nút [ ← Về bản đồ ]
      │  tới mốc, ghé lần đầu → đếm thêm 10 giây
      ↓  hiện nút [ ▶ Bắt đầu giải mã ]
② #scene-game  MINI-GAME 2 VÒNG
      │  Vòng 1 RAZER → nổ sập lab → Vòng 2 ZHAO YUN → đọc thư
      ↓  bấm [ HOÀN THÀNH HÀNH TRÌNH ] → pháo hoa
③ #scene-code  PHÁ ĐẢO · phát mã TYRION · đi Zoey's Castle
```

Mã `TYRION` là phần thưởng của việc **chơi xong mini-game**, không phải chỉ
của việc tới đúng ngày.

> ⚠️ Không phá đảo được thì không lấy được mã vào Map 3. Hai đường lùi: chơi
> xong một lần là nhớ vĩnh viễn (`mtv1.g2Game`), vào lại đi thẳng màn mã; và
> nút `< THOÁT` trong game luôn quay về được. Muốn nới ra, xem mục 8.

### Cờ nhớ trong `localStorage` (khoá `mtv1`)

| Cờ | Khi nào bật | Tác dụng |
|---|---|---|
| `eggWin` | vừa mở trang | Map 3 biết đã qua Gate 2 |
| `g2Vao` | lần đầu ghé sau mốc | lần sau khỏi đếm lại 10 giây |
| `g2Game` | bấm *Hoàn thành hành trình* | vào lại là tới thẳng màn mã |
| `g2Hack` | cửa hậu từ Box Tổng tư lệnh | bỏ qua mốc 01-09 |
| `g2Hint` | mỗi lần nhập sai | số gợi ý đã mở · mốc giờ · **hạn khoá** |

---

## 2. `GATE_CONFIG` — màn đếm ngược & màn mã

| Khoá | Mặc định | Ghi chú |
|---|---|---|
| `moc_iso` | `{YEAR}-09-01T00:00:00+07:00` | `{YEAR}` tự thay bằng năm hiện tại. Múi `+07:00` nên máy ở đâu cũng chốt đúng nửa đêm VN |
| `cho_lan_dau_ms` | `10000` | ghé lần đầu sau mốc thì đếm thêm 10 giây. Đặt `0` để bỏ |
| `ma` | `TYRION` | **phải khớp** hằng `PIN_A` bên `han/961030-a` |
| `ma_link` | `/han/961030-a?from=map` | nút đi Map 3 |

| Khoá `text` | Nội dung |
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
| `ma_nhan` / `nut_castle` | `Zoey’s Castle Key` / `Zoey’s Castle` |

> Màn mã trước có **hai** nút chơi lại chồng ý nghĩa nhau. Nay chỉ còn **một**
> nút dài `↻ Chơi lại Easter Egg: Gate 2`; nút reset toàn bộ đã bỏ (chức năng
> đó vẫn còn trên bản đồ).

---

## 3. `GAME_CONFIG` — mini-game

### Khung máy (`frame`)

| Khoá | Mặc định | Ghi chú |
|---|---|---|
| `ratio` | `4/3` | tỷ lệ khung. Đổi `16/9` là về khung dẹt |
| `max_h` | `0.44` | trần chiều cao khung so với cả màn |
| `max_h_kb` | `0.30` | khi bàn phím ảo bật |
| `world_ratio` | `3136/1376` | tỷ lệ thật của ảnh nền |

Ảnh nền rộng **2.28:1**, khung chỉ **4:3** → dư ngang **±127 px** (máy 390 px)
chính là biên độ vuốt ngắm cảnh.

### Mật khẩu

| Vòng | Khắc trên bệ đá | Mật khẩu | Chấp nhận thêm |
|---|---|---|---|
| 01 | `REZAR` | `RAZER` | — |
| 02 | `NUY OAHZ` | `ZHAO YUN` | `ZHAOYUN` |

So khớp **bỏ hết dấu cách, không phân biệt hoa thường**. Ô nhập tự in hoa.
Cả hai vòng dùng chung tông sáng **cam `#ffaa00`** cho nhất quán.

### ★ Chữ trên bệ đá — cơ chế

Game **không vẽ chữ đè lên tranh**, và lớp che **không phải một dải đen**.

Lớp che chính là **mẩu ảnh bệ đá đó**, chỉ bị hạ sáng và khử màu
(`brightness .44 · saturate .18 · contrast .82`) nên nét khắc thành **rãnh đá
chưa thắp**. Mẩu ảnh lấy rộng hơn ô chữ và **nhoè mép cả hai chiều**, nên không
thấy khung chữ nhật nào — nhìn tiệp hẳn vào tấm biển.

Bên trên lớp che là từng ký tự **cắt từ chính ảnh gốc**. Gõ trúng ký tự nào thì
ô đó bừng sáng — cái sáng lên là **nét chữ khắc thật trong tranh**, sáng vừa
phải như được thắp lên chứ không cháy trắng.

> **Clip "nhập sai" cũng chiếu nguyên chữ khắc đang sáng.** Nên `.anim-layer`
> được đặt **bên trong `.world` và nằm dưới lớp che** (z-index 5 < 6); nếu để
> clip đè lên thì mỗi lần sai là lộ hết đáp án.

| Trạng thái | Hiện tượng |
|---|---|
| Không gõ / gõ trượt | Nét khắc chìm hẳn vào đá, không đọc được |
| Gõ trúng một ký tự | Đúng ô đó bừng sáng 0.3s rồi tối lại |
| Xoá phím | Không sáng gì |
| Sai 3 lần / 20s không gõ | Cả cụm hiện mờ một nhịp làm gợi ý |
| Chạy clip nhập sai | Lớp che vẫn phủ — không lộ chữ |
| Giải đúng | Nháy sáng lần lượt **từ PHẢI sang TRÁI**, rồi giữ sáng |

**Chiều gõ là chiều ngược.** Câu đố là đọc ngược (`REZAR` → `RAZER`), nên ký tự
**đầu tiên** người chơi gõ ứng với ô **ngoài cùng bên phải**:

```
ô:     0    1    2    3    4
khắc:  R    E    Z    A    R
gõ:    R←5  E←4  Z←3  A←2  R←1        (số = thứ tự phím bấm)
```

Bảng ánh xạ bỏ qua ô trống, nên gõ `ZHAOYUN` liền hay `ZHAO YUN` có dấu cách
đều khớp đúng ô.

### Toạ độ (tất cả tính theo % của **ảnh nền**, đo bằng dò pixel)

| Lớp | left | top | w | h |
|---|---|---|---|---|
| Bệ đá Vòng 1 (`REZAR`) | 47.194% | 91.788% | 6.378% | 3.198% |
| Bệ đá Vòng 2 (`NUY OAHZ`) | 46.971% | 84.811% | 6.154% | 2.180% |
| Cuộn thư (`hotspot`) | 41.14% | 34.52% | 10.52% | 9.08% |
| Mắt rồng trái (`eyes[0]`) | 44.20% | 29.9% | 1.9% | 7.4% |
| Mắt rồng phải (`eyes[1]`) | 46.70% | 29.8% | 2.2% | 8.4% |

`hotspot.min_px: 52` — vùng chạm được nới ra cho vừa ngón tay (thực tế
**65 × 52 px**), còn mẩu ảnh cuộn thư giữ đúng cỡ thật (65 × 25 px).

### Cuộn thư & mắt rồng

- **Không có khung viền.** Chính mẩu ảnh cuộn thư được **phóng to thu nhỏ nhè
  nhẹ** (scale 1 ↔ 1.17) kèm ánh vàng. Chữ `[ TAP HERE ]` nhấp nháy **ngay sát
  dưới** cuộn thư (cách 4 px).
- **Nhập sai ở vòng 2:** không còn hào quang đỏ. Thay vào đó **mắt rồng chuyển
  đỏ nhấp nháy 4 nhịp** (1.6s) rồi trả về bình thường.

### Camera

Vào mỗi round, camera **đứng ở mép trái, lia hết sang phải, rồi mới thu về
giữa** — như người chơi tự đảo mắt nhìn quanh một vòng. Sau đó vuốt tự do, thả
tay thì trôi mượt về giữa.

### Mốc thời gian (`timing`, ms)

| Khoá | Mặc định | Ý nghĩa |
|---|---|---|
| `intro_pan` | 2600 | lia một vòng từ TRÁI sang PHẢI |
| `intro_back` | 1300 | rồi thu về neo giữa |
| `reveal_step` | 130 | giải đúng: nháy từng ký tự phải→trái |
| `eye_flash` | 1600 | mắt rồng nháy đỏ khi nhập sai |
| `recenter` | 900 | thả tay → trôi về giữa |
| `anim_wrong` | 2000 | clip ổ khoá rung đỏ |
| `lock_after_bad` | 2000 | khoá ô nhập sau mỗi lần sai |
| `glow_hold` | 3000 | giữ chữ sáng rực trước khi nổ |
| `anim_unlock` | 8000 | clip nổ sập lab |
| `type_speed` / `letter_speed` | 24 / 26 | mỗi ký tự hộp thoại / bức thư |
| `idle_hint` / `idle_wrongs` | 20000 / 3 | khi nào chữ "thở" một nhịp |
| **`hint_first_wrong`** | **1** | **sai lần đầu là có ngay gợi ý 1** |
| **`hint_every_wrongs`** | **3** | **từ gợi ý 2: cứ thêm 3 lần sai** |
| **`hint_cooldown_ms`** | **900000** | **hai gợi ý cách nhau 15 phút** |
| `slide_auto` | 3000 | tự chuyển ảnh slideshow |

---

## 4. Toàn bộ thoại (`GAME_CONFIG.dialogues`)

> **Nguyên tắc: thoại KHÔNG được lộ gì về cách giải.** Không nhắc "chữ đảo
> lộn", không nhắc "bệ đá khắc chữ gì". Chỉ nói nhiệm vụ: tìm mật khẩu.

### Khởi động (`boot`) — xám hệ thống

```
> Khởi động hệ thống Easter Egg: Gate 2
> Kết nối phòng lab ngầm... [OK]
> Phát hiện Easter Egg bị niêm phong
```

### Vòng 1

| Khoá | Nội dung | Màu |
|---|---|---|
| `round1_intro` | `> VÒNG 01 // Cửa đã bị niêm phong. Tìm mật khẩu để thoát khỏi phòng lab.`<br>`> Vuốt quanh phòng để quan sát. Gõ mật khẩu vào ô bên dưới.` | xanh lá |
| `round1_wrong` | `> TRUY CẬP BỊ TỪ CHỐI! MÃ KHÓA KHÔNG HỢP LỆ.` | đỏ |
| `round1_correct` | `> MÃ KHÓA HỢP LỆ! ĐANG TÁI CẤU TRÚC DỮ LIỆU...` | xanh lá |
| `round1_boom` | `> CẢNH BÁO! KẾT CẤU PHÒNG LAB ĐANG SỤP ĐỔ. RÚT LUI NGAY!` | cam |

### Vòng 2

| Khoá | Nội dung | Màu |
|---|---|---|
| `round2_intro` | `> PHÒNG LAB ĐÃ SẬP! BẠCH LONG ĐÃ THỨC TỈNH... NHẬP MÃ ĐỂ NHẬN BÍ TỊCH.` | cyan |
| `round2_hint` | `> VÒNG 02 // Tìm mật khẩu để mở cổ thư trên miệng Bạch Long.` | xanh lá |
| `round2_wrong` | `> MẬT MÃ KHÔNG HỢP LỆ! VUI LÒNG THỬ LẠI.` | đỏ |
| `round2_correct` | `> MẬT MÃ CHÍNH XÁC! CHẠM VÀO LÁ THƯ ĐỂ ĐỌC NỘI DUNG...` | cyan |

### Dùng chung & kết

| Khoá | Nội dung |
|---|---|
| `unlocked_input` | `> ĐÃ MỞ LẠI Ô NHẬP. DONGCHI VUI LÒNG THỬ LẠI.` |
| `finale` | `> BÍ TỊCH ĐÃ ĐƯỢC GIẢI PHONG ẤN. HÀNH TRÌNH HOÀN TẤT!`<br>`> CHÚC MỪNG SINH NHẬT ĐÔNG CHÍ BÌNH — 01.09 🎉`<br>`> ĐANG MỞ KHOÁ MÃ VÀO ZOEY’S CASTLE...` |

---

## 5. Gợi ý theo bậc + KHOÁ ĐẾM NGƯỢC

**Luật:** **sai lần đầu là có ngay gợi ý 1**. Từ gợi ý 2 trở đi, cứ **thêm 3
lần sai** mới mở tiếp, và hai gợi ý phải **cách nhau 15 phút** — chưa đủ giờ thì
**ô nhập bị khoá hẳn** và chạy **đồng hồ đếm ngược**, không gõ được nữa. Trong lúc đó người chơi đi vuốt quanh phòng tìm
manh mối. Hết giờ thì tự mở khoá và phát luôn gợi ý kế tiếp.

Số lần sai, mốc giờ **và hạn khoá** đều nhớ trong `localStorage`
(`mtv1.g2Hint`) → **F5 giữa lúc khoá thì vào lại vẫn khoá tiếp**.

### Vòng 1 (`round1.hints`)

| # | Mở sau | Nội dung |
|---|---|---|
| 1 | **1 lần sai** (ngay) | `5 KÝ TỰ. TÊN 1 THƯƠNG HIỆU.` |
| 2 | 4 lần sai + 15 phút | `TENET CONCEPT` |
| 3 | 7 lần sai + 30 phút | `BÊN PHẢI PHÒNG LAB` |
| 4 | 10 lần sai + 45 phút | `HÃNG GAMING NỔI TIẾNG` |

### Vòng 2 (`round2.hints`)

| # | Mở sau | Nội dung |
|---|---|---|
| 1 | **1 lần sai** (ngay) | `Một nhân vật có thật nổi tiếng` |
| 2 | 4 lần sai + 15 phút | `Cưỡi ngựa trắng` |
| 3 | 7 lần sai + 30 phút | `Vị tướng này dùng Long Đảm Thương` |
| 4 | 10 lần sai + 45 phút | `Một nhân vật Tam Quốc` |

### Khuôn câu

| Khoá | Nội dung | Khi nào |
|---|---|---|
| `hint_show` | `> GỢI Ý {N}: {TEXT}` | mở được gợi ý mới (cam) |
| `hint_lock` | `> HỆ THỐNG QUÁ TẢI! Ô NHẬP BỊ KHOÁ {M} PHÚT.` | đủ số lần sai nhưng chưa đủ giờ (đỏ) |
| `hint_unlock` | `> ĐÃ MỞ KHOÁ. THỬ LẠI ĐI DONGCHI.` | hết giờ khoá |
| `hint_done` | `> ĐÃ HẾT GỢI Ý. TỰ LỰC THÔI DONGCHI.` | đã mở hết 4 gợi ý |
| `ui.lock_note` | `Vuốt quanh phòng tìm manh mối trong lúc chờ…` | dòng nhắc dưới đồng hồ |

`{N}` số thứ tự · `{TEXT}` nội dung · `{M}` số phút bị khoá.

> Muốn dễ hơn: hạ `hint_cooldown_ms` (ví dụ `60000` = 1 phút) hoặc
> `hint_every_wrongs`. Đặt `hint_cooldown_ms: 0` là bỏ hẳn khoá giờ.

---

## 6. Chữ giao diện (`ui`)

`boot_title` `EASTER EGG / GATE 02` · `boot_sub` `Đang nạp dữ liệu phòng lab ngầm…` ·
`boot_ready` `Dữ liệu đã sẵn sàng.` · `start_btn` `▶ PRESS START` ·
`swipe_hint` `◄ VUỐT ĐỂ NGẮM BỐI CẢNH ►` · `unlock_btn` `UNLOCK` ·
`modal_title` `BÍ TỊCH BẠCH LONG` · `prev_btn` `< PREV` · `next_btn` `NEXT >` ·
`finish_btn` `[ HOÀN THÀNH HÀNH TRÌNH ]` · `hud_locked/unlocked` `LOCKED/UNLOCKED` ·
`back_label` `< THOÁT` · `lock_note` (xem mục 5) ·
`round1.placeholder` `NHẬP MÃ KHÓA...` · `round2.placeholder` `NHẬP MẬT MÃ...` ·
`round2.tap_label` `[ TAP HERE ]`

> ⚠️ **Font `Press Start 2P` không có dấu tiếng Việt.** Chỗ dùng font pixel
> (nút `UNLOCK`, HUD, `[ TAP HERE ]`, `PRESS START`, đồng hồ khoá) phải giữ
> **không dấu**. Chỗ có dấu đã chuyển sang `Roboto Mono`.
>
> `boot_ready` cố tình để **ngắn một dòng** — câu dài sẽ rớt một chữ xuống dòng
> riêng, nhìn rất vô duyên.

---

## 7. Nội dung bức thư (`letter_content`)

Thứ tự: lời mở → hai đoạn chính → lời chúc → câu kết → **chữ ký** → **p.s. cuối
cùng**.

```
Gửi Dongchi Bình,

Em không biết anh có tới được đây không hoặc lúc này tụi mình đã nói chuyện lại
với nhau chưa. Hôm anh bảo thích trang website, em đã nghĩ tới concept làm series
mini-games cho anh chơi thay vì đi mua quà như dự tính. Em hy vọng anh thích.

Mong anh giữ được ước mơ mà anh hằng ấp ủ và thực sự biến nó thành sự thật. Mong
những nuối tiếc về quá khứ của anh sớm được bù đắp vào rất nhiều năm tới đây.
Mong anh tìm thấy sự bình yên, tròn đầy mà anh hằng khao khát.

Chúc mừng sinh nhật anh. Mong năm nay anh khỏe, bớt lo nghĩ xa xôi, luôn dũng cảm
và chân thành.

Hết màn rồi đó. Về nhà thôi.

— Em. Hồng Hân kí tên.

p.s: Cũng có lúc em nản lòng, nhưng em nghĩ thôi vậy, design game cũng là một
trong những niềm vui của em. Quá trình làm tặng anh em cũng đã thấy vui. Dù người
nhận thì đáng ghét (nvm) và em cũng không chắc mình sẽ tặng anh không. You get
what you deserve.
```

Xuống dòng giữ nguyên khi hiển thị. Chạm vào khung thư là hiện hết chữ ngay.

---

## 8. Vài chỗ hay phải chỉnh

**Phát mã TYRION ngay khi tới mốc, không bắt chơi game** — trong `index.html`,
hàm `Gate.moCong()`, đổi `if(Store.get().g2Game){ Code.open(); return; }` thành
`Code.open(); return;`.

**Khung game dẹt như cũ** — `GAME_CONFIG.frame.ratio: 16/9`.

**Khung game to/nhỏ hơn** — `GAME_CONFIG.frame.max_h` (0.44 = 44% chiều cao màn).

**Vùng chữ sáng lệch chỗ** — sửa `round1.slab` / `round2.slab` (left/top/w/h).
Đang khớp đúng chữ khắc trong ảnh; đổi ảnh nền thì phải đo lại.

**Xoá tiến độ gợi ý / hạn khoá để test** — `localStorage.removeItem('mtv1')`,
hoặc sửa riêng `mtv1.g2Hint`.

---

## 9. Chống va chạm CSS (đọc trước khi thêm style)

Hai màn vốn là hai trang riêng, gộp vào là đụng nhau đúng ba chỗ: id `#app`,
ba biến `--neon` / `--amber` / `--paper` (khác giá trị nhau), và selector trần
`h1{}` `p{}` bên màn đếm ngược sẽ ăn luôn vào markup game.

Luật đã chốt:

- **Không** khai biến màu nào ở `:root`. Màn đếm ngược + màn mã khai trong
  `.gate-look`, màn game khai trong `#scene-game`.
- **Mọi** selector đều phải có tiền tố `.gate-look ` hoặc `#scene-game `.

---

## 10. Vài điều đã xử lý sẵn

- **Không lộ đáp án**: thoại không nhắc gì tới cách giải; nét khắc chìm vào đá,
  chỉ ký tự gõ trúng mới sáng; và clip nhập sai bị xếp dưới lớp che nên cũng
  không lộ.
- **Rồng thở nhẹ**: biên độ hạ hẳn (scale 1.0035, dịch 0.26%) và kéo dài 7.5s
  với easing đối xứng nên không còn cảm giác giật.
- **Tem phiên bản**: game `V2.10`, bản đồ gốc `V17.04`, cùng ngày 17-Aug-2026.
- **Chiều gõ ngược** dạy người chơi cơ chế: phím đầu tiên làm sáng ô bên phải.
- **Biến CSS không nội suy**: đo hiệu ứng camera phải đọc `transform` thật, đọc
  `--pan` chỉ ra giá trị đích nên tưởng nhầm là hiệu ứng không chạy.
- **Nút trên màn đếm ngược không lệch góc**: `<button>` co theo nội dung dù đã
  `display:block`, phải có `width:100%`.
- **Bàn phím ảo** không đẩy vỡ khung: chiều cao thật lấy từ `visualViewport`,
  bề ngang khung do JS chốt bằng px (trình duyệt không truyền `max-height`
  ngược qua `aspect-ratio`).
- **Không còn khoảng trống chết** giữa khung game và hộp thoại (`#stage` để
  `height:auto`).
- **Chạm lá thư không bị nuốt** khi vuốt camera: vùng hotspot không khởi động
  thao tác kéo (`setPointerCapture` sẽ kéo `click` lên khung máy).
- **Thứ tự khởi tạo**: khối `Gate` chạy trước `Game`/`Code` nên nhịp đếm đầu
  phải hoãn sang vòng sau để không vấp TDZ. Chỗ canh dùng cờ thường, **không
  dùng `typeof`** — `typeof` trên `const` đang trong vùng chết vẫn ném lỗi.
- **Clip `.webp` lặp vô hạn** → mỗi lần phát tạo thẻ ảnh mới (cùng URL nên lấy
  từ cache), hết thời lượng thì gỡ ra.
- **Ảnh nặng**: màn `LOADING` chỉ chờ nền Vòng 1, phần còn lại nạp ngầm.
