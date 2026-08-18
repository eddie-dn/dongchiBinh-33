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
├── THU-VA-ANH.md     ← nội dung thư + quy ước đặt tên ảnh kỷ niệm
├── OPEN-WORLD.md     ← nối Gemini + 4 nét mặt robot cho khu trò chuyện
├── OW-LOI-DAN.md     ← lời dẫn hệ thống + tính cách Bạch Long (sửa ở đây)
└── assets/           ← ★ TOÀN BỘ ảnh và clip nằm trong này
    ├── bg_r1.png         3136×1376 · phòng lab ngầm
    ├── bg_r2.png         3136×1376 · rừng tàn tích, Bạch Long ngậm cuộn thư
    ├── anim_wrong.webp   1280×561  · ổ khoá rung đỏ (~2s)
    ├── anim_unlock.webp  800×350   · nổ sập lab + thức tỉnh Bạch Long (~8s)
    ├── ow_2_1..4.webp    4 nét mặt robot Open World
    └── photo_1..5.jpg    ⚠️ CHƯA CÓ — game tự vẽ ảnh pixel thay thế

api/chat.js           ← ngoài thư mục này: hàm serverless gọi Gemini
```

Đường dẫn thư mục tài nguyên nằm ở **`assets_base`** và **`photos_base`** trong
`config.js` — đổi chỗ để tài nguyên thì sửa hai dòng đó, không phải sửa từng
tên file.

Thêm ảnh kỷ niệm thật: chép `photo_1.jpg` … `photo_5.jpg` vào **`assets/`**.
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
      ↺  nút [ 👁 Xem lại bối cảnh ] → quay lại ② ở CHẾ ĐỘ XEM LẠI
```

**Chế độ xem lại (gallery).** Phá đảo rồi vẫn ngắm lại được hai bối cảnh mà
không phải giải lại. Màn ② dựng lại đúng cảnh của vòng được chọn ở trạng thái
**đã giải**: chữ sáng hết, rồng đã được tiếp sức, cuộn thư chạm được để đọc lại
thư. Ô nhập tắt hẳn; dưới hộp thoại là thanh
`VÒNG 01 · VÒNG 02 · OPEN WORLD · THOÁT`, và
hộp thoại kể lại đúng đoạn dẫn truyện của vòng đang xem. Khung thư lúc này có
thêm **nút `X` ở góc** để đóng nhanh — lượt chơi thật thì không có, phải bấm
`[ HOÀN THÀNH HÀNH TRÌNH ]` cho chạy nốt màn kết. Đọc lại thư xong thì về thẳng
cảnh, **không** bắn pháo hoa lại.

**OPEN WORLD** là khu trò chuyện: người chơi hỏi, **Bạch Long** đáp, mỗi ngày
**10 câu**. Giao diện và phần đếm lượt đã chạy sẵn; muốn nó trả lời thật thì
khai một biến môi trường trên Vercel — **xem `OPEN-WORLD.md`**. Chưa khai thì
khu này vẫn mở, chỉ trả câu dự phòng.

- Trang **không giữ khoá API**. Nó POST về `/api/chat` (hàm serverless của
  chính website), khoá Gemini nằm ở biến môi trường `GEMINI_KEY`.
- Hạn mức nhớ ở `mtv1.g2Ow = { ngay, dem }`, **ngày tính theo giờ Việt Nam**.
- **Gọi hỏng thì không trừ lượt.**
- Nội dung sửa ở `GAME_CONFIG.openworld` — đáng sửa nhất là `tinh_cach`, đoạn
  mô tả giọng của Bạch Long.
- **Robot có 4 nét mặt** (`ow_2_*.webp`), bám theo nhịp trò chuyện: chào khi mở
  → nhìn xuống theo dõi gõ (nét nghỉ) → đăm chiêu lúc chờ trả lời → gật đầu khi
  câu trả lời tới. Thiếu file thì bỏ qua, không vỡ gì. Chi tiết ở `OPEN-WORLD.md`.

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

Lớp che chính là **mẩu ảnh bệ đá đó**, chỉ bị hạ sáng và khử màu, nên nét khắc
thành **rãnh đá chưa thắp**. Mẩu ảnh lấy rộng hơn ô chữ và **nhoè mép cả hai
chiều**, nên không thấy khung chữ nhật nào — nhìn tiệp hẳn vào tấm biển. Độ
mạnh đặt riêng cho từng vòng ở `veil_filter`.

Bên trên lớp che là từng ký tự **cắt từ chính ảnh gốc**. Cái sáng lên là **nét
chữ khắc thật trong tranh**, không phải chữ do font vẽ.

**Chỉ NÉT CHỮ sáng, không sáng cả mảng đá.** Mẩu ảnh của mỗi ký tự lấy **chính
nó** làm mặt nạ theo **độ sáng** (`mask-mode: luminance`): nét khắc sáng → đục,
mặt đá tối xung quanh → trong suốt. Chồng **hai lớp mặt nạ giống hệt nhau** rồi
giao nhau (`mask-composite: intersect`) = nhân hai lần alpha, mặt đá chìm hẳn,
chỉ còn nét chữ nổi lên kèm quầng sáng. Không còn mảng chữ nhật sáng như bản
trước. **Tuyệt đối không chồng thêm lớp nhoè mép trái/phải** — ô chữ chỉ rộng
khoảng 8px, nhoè 11% là ăn đứt nét dọc của `R` và `O` nằm sát mép ô. Trình duyệt quá cũ không hiểu `mask-mode` thì mất mặt nạ, ô sáng cả mảng
— vẫn chơi được, chỉ kém khéo hơn.

> **Clip "nhập sai" cũng chiếu nguyên chữ khắc đang sáng.** Nên `.anim-layer`
> được đặt **bên trong `.world` và nằm dưới lớp che** (z-index 5 < 6); nếu để
> clip đè lên thì mỗi lần sai là lộ hết đáp án.

### ★ XẾP LẠI CHỮ khi giải xong

Giải đúng xong, từng ô **trượt về đúng chỗ của nó khi đọc xuôi**, đè hẳn lên
bảng cũ: `REZAR → RAZER`, `NUY OAHZ → ZHAO YUN`. Chữ khắc vốn là chuỗi đảo nên
đáp án chính là **ảnh gương** của nó — ô thứ `i` chỉ việc trượt sang chỗ ô
`n-1-i`. Trượt bằng `transform` nên cái nằm đó vẫn là **nét khắc thật trong
tranh**, không phải chữ vẽ lại.

Lúc xếp, **lớp che kéo về đục hẳn** (`opacity 1`). Vừa giải xong nó đang mờ
`.45` để khoe nét khắc, nhưng ký tự vừa dời chỗ thì **chữ gốc nằm dưới lòi ra
ngay bên cạnh** — đọc thành hai lớp chồng nhau.

Đáp án **ở lại vĩnh viễn**: giữ nguyên suốt màn thông báo, lúc chuyển cảnh, và
cả khi quay lại **Chế độ xem lại** (`flipSolved(..., true)` dựng lại tức thì,
không chạy hoạt hình). Xoay máy thì `fitSlabs()` tính lại quãng trượt theo bề
rộng ô mới.

### ★ Hiệu ứng RỚT ĐẤT

Ký tự không bật sáng khan. Mỗi ô có sẵn một **mảng đất** phủ lên; lúc lộ ra thì
mảng đất **trượt xuống, vỡ dần rồi tan**, đồng thời nét chữ **sáng lên theo**
(`dirt_fall` = 640ms). Vài hạt bụi văng ra rơi theo. Đất và bụi bị cắt gọn trong
lòng ô (`overflow:hidden`) nên không tràn ra ngoài tấm biển; quầng sáng của ký
tự thì vẫn toả ra bình thường.

### ★ Hai kiểu lộ chữ (`reveal_mode`)

**Vòng 1 — `flash`.** Lớp che cũng **có blur như vòng 2**, ban đầu không đọc
được nét khắc. Gõ trúng ký tự nào thì ô đó rớt đất, sáng một nhịp rồi **chìm
lại** — vẫn dạy được chiều đọc ngược mà không cho đọc trước đáp án. Muốn quay
lại kiểu cũ (nét chữ chìm mờ nhưng đọc được) thì bỏ `blur` khỏi
`round1.veil_filter`.

**Vòng 2 — `progressive`.** Lớp che có thêm `blur` nên **ban đầu không thấy nét
chữ nào**. Chữ lộ dần và **lộ tới đâu giữ sáng tới đó**:

### ★★ LUẬT ĐOÁN TỪNG KÝ TỰ (vòng 2)

Mỗi lượt chỉ đoán **một ký tự**, nhưng phải **gõ liền mạch cả cụm**. Phần đã lộ
bị **khoá cứng ở đầu ô nhập**, người chơi chỉ được thêm đúng một ký tự nữa — và
**gõ xong ký tự đó là nộp luôn**, không sửa lại được.

```
chưa lộ gì   → ô nhập cho gõ 1 ký tự    →  Z          (trúng → lộ chữ Z)
đã lộ  Z     → cho gõ tối đa 2 ký tự    →  ZH         (trúng → lộ chữ H)
đã lộ  ZH    → cho gõ tối đa 3 ký tự    →  ZHA
đã lộ  ZHA   → cho gõ tối đa 4 ký tự    →  ZHAO   … cho tới hết
```

| Việc người chơi làm | Kết quả |
|---|---|
| Đoán **trúng** ký tự kế tiếp | Rớt đất, ký tự sáng vĩnh viễn, ô nhập nới thêm một chỗ |
| Đoán **trật** | Ô nhập nháy đỏ, tính **một lần sai**, chữ trả về đúng phần đã lộ |
| Sửa/xoá phần đã lộ | Không được — trang tự trả lại |
| Gõ quá số ô cho phép | Không được — trang tự cắt |
| Lộ đủ ký tự cuối cùng | **Thắng luôn**, khỏi bấm nộp |

Vòng 2 **giấu hẳn nút `UNLOCK`** (`.ctrl.nobtn`) — gõ ký tự nào là chấm ký tự
đó, chẳng còn gì để "nộp".

**Chữ chỉ lộ thêm qua đường GỢI Ý.** Đoán trật thì mất lượt chứ không được lộ
không — nếu cho lộ thì gõ bừa cũng ra đáp án. Mỗi lần `grantHint()` chạy là bới
thêm một ký tự, nên vẫn luôn có đường về đích: sai lần đầu → gợi ý 1 + lộ chữ
`Z`; từ đó cứ 3 lần sai nữa mở gợi ý tiếp, cách nhau 15 phút.

Không có luật này thì người chơi cứ gõ lần lượt A→Z cho từng ô là ra nguyên đáp
án — chẳng phải đoán, cũng chẳng cần bấm `UNLOCK` lần nào. Luật nói thẳng cho
người chơi biết trong `round2_hint`, không giấu.

Cứ thế người chơi tự nhận ra **thứ tự đi từ phải sang trái**. Ô ứng với **dấu
cách** không bao giờ thắp, nếu không sẽ thành vệt sáng vô nghĩa giữa hai chữ.
Vòng 2 cũng **tắt hẳn nhịp "thở"** của cả cụm — chôn kín mà cho thở là lộ hết
bài.

> Đất rơi **không kèm thoại**. Nhìn thấy là biết; viết ra thành chữ chỉ tổ ồn
> hộp thoại.

### ★ Clip nổ sập lab TỰ NÓ lộ đáp án

`anim_unlock.webp` (241 khung) **vẽ sẵn bảng đá vòng 2 với "NUY OAHZ" sáng rõ từ
khoảng khung 105 (~44%) về sau** — nằm trong ảnh gốc, không phải lỗi thứ tự dựng
cảnh. Đã đo: **khung hình cuối của clip trùng khít `bg_r2`, lệch 0px cả hai
chiều**. Nhờ vậy cách chữa gọn:

1. `win1()` gọi `prepRound2()` **trước khi phát clip** — dựng sẵn nền, rồng,
   bảng đá, cuộn thư ở phía sau clip.
2. Tới mốc `timing.veil_in_at` (0.40 của clip) thì **thả lớp che xuống**, hiện
   dần trong `veil_in_ms`. Lớp che nằm `z-index 6`, clip nằm `5` → che vừa vặn.
3. Clip tắt là **cắt thẳng** sang cảnh tĩnh đã dựng sẵn, không chớp nhịp nào.

| Trạng thái | Hiện tượng |
|---|---|
| Vòng 1 · không gõ / gõ trượt | Nét khắc chìm hẳn vào đá, không đọc được |
| Vòng 1 · gõ trúng một ký tự | Ô đó rớt đất, sáng ~0.9s rồi tối lại |
| Vòng 2 · đoán trật ký tự | Ô nhập nháy đỏ, tính một lần sai |
| Vòng 2 · chưa lộ | Không thấy gì cả |
| Vòng 2 · đã lộ | Giữ sáng vĩnh viễn cho tới hết vòng |
| Xoá phím | Không sáng gì |
| Vòng 1 · sai 3 lần / 20s không gõ | Cả cụm hiện mờ một nhịp làm gợi ý |
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

> Khung vòng 1 từng bắt đầu ở `47.194%` = pixel 1480, trong khi nét khắc thật
> chạy từ pixel **1478** — xén mất đúng nét dọc của chữ `R` ngoài cùng bên
> trái. Đã nới về `x[1477, 1681]`.

| Lớp | left | top | w | h |
|---|---|---|---|---|
| Bệ đá Vòng 1 (`REZAR`) | 47.098% | 91.788% | 6.505% | 3.198% |
| Bệ đá Vòng 2 (`NUY OAHZ`) | 46.971% | 84.811% | 6.154% | 2.180% |
| Cuộn thư (`hotspot`) | 41.14% | 34.52% | 10.52% | 9.08% |
| Mắt rồng (`eyes[0]`) | 46.70% | 28.69% | 2.4% | 4.4% |

> Rồng nhìn **nghiêng 3/4 nên chỉ thấy MỘT mắt**. Bản trước dò pixel bắt nhầm
> cả vệt lửa cyan nên ra hai khung, cao gấp ba và một khung rơi vào chỗ trống.

`hotspot.min_px: 52` — vùng chạm được nới ra cho vừa ngón tay (thực tế
**65 × 52 px**), còn mẩu ảnh cuộn thư giữ đúng cỡ thật (65 × 25 px).

### Cuộn thư & mắt rồng

- **Không có khung viền, và KHÔNG phóng to nữa.** Phóng bản sao ảnh lên là nó
  lệch với ảnh gốc nằm dưới, nhìn như cuộn thư bị nhân đôi — thô hẳn. Bây giờ
  mẩu ảnh chồng **đúng khít** lên chính nó, chỉ **nhoà sáng dần** theo nhịp thở
  (`mix-blend-mode: screen`, opacity .16 ↔ .6) kèm một quầng vàng mềm phía sau.
  Không lệch một pixel nào, chỉ thấy cuộn thư tự bừng lên rồi dịu xuống.
- Chữ `[ TAP HERE ]` nhấp nháy **ngay sát dưới** cuộn thư (cách 4 px), viền đen
  bốn phía cho đọc được trên nền sáng.
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
| `dirt_fall` | 640 | mảng đất rơi khỏi ký tự vừa lộ |
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
| `round2_hint` | `> VÒNG 02 // Tìm mật khẩu để mở cổ thư trên miệng Bạch Long.`<br>`> Bệ đá bị đất phủ kín. Mỗi lần chỉ đoán được MỘT ký tự, gõ xong là nộp luôn.`<br>`> Đoán trúng thì ký tự đó lộ ra và được gõ thêm một ô nữa.` | xanh lá |
| `round2_wrong` | `> MẬT MÃ KHÔNG HỢP LỆ! VUI LÒNG THỬ LẠI.` | đỏ |
| `round2_le_wrong` | `> KÝ TỰ KHÔNG KHỚP. BẠCH LONG GẦM LÊN MỘT TIẾNG.` | đỏ |
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
`back_label` `< EXIT` · `lock_note` (xem mục 5) ·
`round1.placeholder` `NHẬP MÃ KHÓA...` · `round2.placeholder` `NHẬP MẬT MÃ...` ·
`round2.tap_label` `[ TAP HERE ]`

**Chế độ xem lại:** `gallery_r1` `ROUND 01` · `gallery_r2` `ROUND 02` ·
`gallery_ow` `OPEN WORLD` ·
`gallery_exit` `EXIT` · `gallery_note`
`> CHẾ ĐỘ XEM LẠI — vuốt để ngắm, chạm lá thư để đọc lại.` ·
`GATE_CONFIG.text.nut_xem_lai` `Xem lại bối cảnh` ·
`GATE_CONFIG.text.nut_choi_lai_game` `Chơi lại`

Hai việc phụ này là **hai nút icon tròn 38px** đặt giữa, dưới nút chính *Zoey's
Castle* (`.ma-pair .ico-btn`). Chữ **không nằm trong nút** — nó vào `data-tip`,
`title` và `aria-label`, nổi lên thành **tooltip phía dưới** khi rê chuột / giữ
ngón. Nhờ vậy cuối màn chỉ còn một nút to duy nhất.

> ⚠️ **Font `Press Start 2P` không có dấu tiếng Việt** — gõ chữ có dấu vào là
> vỡ, nửa font này nửa font kia. Mọi chữ nằm trên **nút** hoặc **thanh HUD**
> phải giữ tiếng Anh: `UNLOCK`, `SEND`, `ROUND 01`, `ROUND 02`, `OPEN WORLD`,
> `EXIT`, `< EXIT`, `LOCKED`, `UNLOCKED`, `PRESS START`, `[ TAP HERE ]`,
> `< PREV`, `NEXT >`. Chữ trong **hộp thoại**, **ô nhập** và **lá thư** dùng
> `Roboto Mono` nên có dấu thoải mái — kể cả ô nhập lúc trò chuyện Open World
> (`.ctrl.ow #answer` đổi hẳn sang font đó).
>
> `boot_ready` cố tình để **ngắn một dòng** — câu dài sẽ rớt một chữ xuống dòng
> riêng, nhìn rất vô duyên.

---

## 7. Nội dung bức thư (`letter_content`)

Sửa ở file riêng **`THU-VA-ANH.md`** (cùng thư mục) rồi chép sang `config.js`.

Đoạn bắt đầu bằng `p.s` được **tự tách ra và in nghiêng** — không phải đánh dấu
gì thêm, cứ để nó nằm ở dòng riêng cuối thư là được.

```
Gửi Dongchi Bình,

Tuổi mới mong anh nhiều niềm vui, sức khoẻ, bớt lo nghĩ xa xôi, luôn dũng cảm và chân thành trong mọi sự (thành công ròi sẽ tới, với anh em tin là vậy).

Mong anh giữ được ước mơ mà anh hằng ấp ủ và thực sự biến nó thành sự thật. Mong những nuối tiếc về quá khứ của anh sớm được bù đắp (anh sẽ làm tốt và vẫn còn rất nhiều năm phía trước...?). Mong anh tìm thấy sự bình yên, tròn đầy mà anh hằng khao khát.

Riêng chuyện anh và em, dù lúc anh đọc thư chúng mình có như thế nào, thì em có buồn nhưng cũng không ghét hay giận anh. Em biết ơn nhân duyên đã đưa anh và em gặp gỡ nhau. Em biết ơn những khoảng thời gian hai ta đã cạnh nhau thủ thỉ mọi điều trong cuộc sống. Cảm ơn anh đã luôn cố gắng và chăm sóc em.

Em tin anh đã luôn làm tốt nhất trong khả năng của bản thân rồi, hãy động viên chính mình nhiều hơn anh nhé (don't talk bad about yourself, event it's joke, your brain will think it's true).

Game over, farewell.

— Em. Hồng Hân kí tên.

p.s: Building this series of mini-games for you as b-day gift brought me so much genuine joy. I'm not sure if or when I'll eventually push this live for the world, but if that day comes, it's simply because you deserve it. I poured a lot of heart into this 'brainchild' - I just hope playing it brings you as much joy as making it brought me. Enjoy!```
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

**Vòng 2 vẫn đọc mờ được chữ / ngược lại quá kín** — `round2.veil_filter`, chỉnh
`brightness` và `blur`. Bỏ `blur` là quay về kiểu vòng 1.

**Muốn vòng 1 cũng chôn kín như vòng 2** (hoặc ngược lại) — đổi `reveal_mode`
giữa `'flash'` và `'progressive'`, không phải sửa gì trong `index.html`.

**Đất rơi nhanh/chậm** — `timing.dirt_fall` (mặc định 640ms).

**Đổi chữ nút xem lại** — `GATE_CONFIG.text.nut_xem_lai` (chỉ hiện trong tooltip);
chữ trong thanh gallery ở `GAME_CONFIG.ui.gallery_*`.

**Vòng 2 dễ/khó hơn** — luật đoán từng ký tự nằm ở nhánh `S.mode === 'progressive'`
trong bộ nghe `input` và hàm `doanKyTu()`. Muốn dễ hơn thì cho `fail()` gọi thêm
`uncoverNext()`; muốn khó hơn thì bỏ `uncoverNext()` khỏi `grantHint()`.

**Vòng 1 cho đọc trước nét khắc như bản cũ** — bỏ `blur` khỏi `round1.veil_filter`.

**Nối Gemini cho khu Open World** — xem `OPEN-WORLD.md`.
**Sửa lời dẫn / tính cách Bạch Long** — xem `OW-LOI-DAN.md`.
**Đổi chỗ để ảnh và clip** — `assets_base` + `photos_base` trong `config.js`.

**Thư và tên ảnh kỷ niệm** — xem file riêng `THU-VA-ANH.md` cùng thư mục.

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
- **Sáng đúng nét chữ, không sáng cả ô**: mặt nạ lấy chính mẩu ảnh theo độ sáng,
  chồng hai lớp cho mặt đá chìm hẳn — hết cảnh một mảng chữ nhật sáng lên.
- **Cuộn thư không bị nhân đôi**: bỏ hẳn kiểu phóng to bản sao ảnh, chỉ chồng
  đúng khít rồi nhoà sáng.
- **Rồng chỉ có MỘT mắt** trong khung hình (nhìn nghiêng 3/4).
- **Rồng thở nhẹ**: biên độ hạ hẳn (scale 1.0035, dịch 0.26%) và kéo dài 7.5s
  với easing đối xứng nên không còn cảm giác giật.
- **Tem phiên bản**: game `V03.06`, bản đồ gốc `V17.05`, cùng ngày 17-Aug-2026.
  Quy ước ở README: `Vx.yy`, `yy` chỉ chạy `00→09`, hết `09` thì `x` tăng 1 và
  `yy` về `00` — **không bao giờ có đuôi `.10`**. (Hai bản `V2.10`/`V2.11` trước
  đó là sai quy ước, đã nắn về `V03.02`.)
- **Hộp thoại có "đời" riêng** (`narrEra`): dọn hộp thoại là tăng số này, mọi câu
  đã hẹn từ đời trước tự huỷ. Không có nó thì `sayAll` — vốn nối bằng `.then()` —
  vẫn thả nốt những câu còn lại vào hộp thoại đã dọn, kiểu mở Open World mà vẫn
  thấy lời dẫn vòng 1 chen vào.
- **Tem không bị góc xén**: `.corner.br` cao 22px tính từ đáy 14px nên chiếm dải
  14..36px; tem phải để `bottom:46px` mới thoát hẳn.
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
