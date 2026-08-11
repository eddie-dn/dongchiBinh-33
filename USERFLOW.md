# USER-FLOW.md — Thiết kế hướng chuyển mạch & hồ sơ người chơi (profile)

> **Trạng thái: ĐÃ TRIỂN KHAI** vào `index.html`, `dad/950901-a/index.html` và hai bản
> `api/ping.js` (nhãn sự kiện mới). Đã chạy kiểm thử đầu-cuối bằng Chromium headless:
> redirect hai pha, khai danh, checkpoint, khôi phục, reset — 30/30 đạt. Mọi tên khoá,
> tên hàm, tên sự kiện dưới đây là tên chốt — code đang dùng đúng tên này.

Liên quan trực tiếp tới hai file:

- `index.html` (gốc) — **Map · Bản đồ tác chiến** (MAP-01), tiến độ ở `localStorage.mtv1`
- `dad/950901-a/index.html` — **Hồ sơ DAD-950901-A**, hệ 3 Mission, tiến độ ở `localStorage.msn1`

Hai trang cùng một origin (monorepo deploy chung domain) nên **chia sẻ được
`localStorage`** — toàn bộ thiết kế đứng trên nền tảng đó, xem ràng buộc ở mục 8.

---

## 1. Bức tranh lớn — máy trạng thái hai pha

Điều hướng của người chơi chỉ có **hai pha**, chuyển pha đúng **một chiều** bằng một mốc
duy nhất: **phá đảo Mission 3** trong hồ sơ DAD-950901-A.

```
            ┌─────────────────────────────┐
            │  PHA 1 · HỒ SƠ LÀ NHÀ       │
            │                             │
   vào  ──► │  mọi lối vào đều đổ về      │
  trang     │  /dad/950901-a              │
            │  (kể cả gõ thẳng / )        │
            └──────────────┬──────────────┘
                           │  giải xong Mission 3
                           │  (PHAM TUAN hoặc skip 10 nhịp)
                           ▼
            ┌─────────────────────────────┐
            │  PHA 2 · MAP LÀ NHÀ         │
            │                             │
   vào  ──► │  /  là trang chính          │
  trang     │  đường xuống hồ sơ duy nhất:│
            │  home → DAD → dad-950901-a  │
            │  (đi được cả hai chiều)     │
            └─────────────────────────────┘
```

| | Pha 1 — hồ sơ là nhà | Pha 2 — Map là nhà |
|---|---|---|
| Mở `/` | Bị đẩy về `/dad/950901-a` (redirect guard, mục 3) | Hiện bản đồ bình thường |
| Mở `/dad/950901-a` | Hiện hồ sơ, chơi 3 Mission | Hiện hồ sơ, nút Bản đồ sáng, về `/` được |
| Nút Bản đồ trong hồ sơ | Khoá (luật MISSIONS.md §5 giữ nguyên) | Mở — `goMap()` như hiện hành |
| Đường Map → hồ sơ | Không tồn tại (Map không vào được) | **Duy nhất**: bấm toạ độ `DAD` → bảng hồ sơ → `DAD-950901-A` |
| Chip profile góc phải trên | Hiện sau khi khai danh (mục 6) | Hiện ở cả hai trang |

Chuyển pha là **chốt một chiều có điều kiện**: phá đảo M3 thì bật, và chỉ **Chơi lại từ
đầu của hồ sơ** (`reset_msn`) mới hạ xuống — vì lúc đó M3 không còn "đã xong" nữa, quay
về pha 1 là nhất quán. Reset MAP-01 (`hardWipe`) **không** hạ cờ: Mission 3 của hồ sơ
vẫn xong, người chơi chơi lại bản đồ chứ không chơi lại hồ sơ.

---

## 2. Khoá lưu chung `nav1` — cầu nối giữa hai trang

Không nhét cờ điều hướng vào `mtv1` hay `msn1` — hai khoá đó thuộc về từng game và đều
có đường xoá riêng (`hardWipe`, `reset_msn`). Điều hướng và profile sống ở một khoá
**thứ ba**, cả hai trang cùng đọc/ghi:

```js
localStorage.nav1 = {
  v: 1,                      // phiên bản luật, để di trú về sau
  mapUnlocked: false,        // cờ chuyển pha — true = PHA 2
  unlockedAt: null,          // timestamp phá đảo M3, để hiển thị
  profile: null              // hoặc object ở mục 6
}
```

Quy tắc:

1. **Chỉ hai điểm ghi `mapUnlocked`**: điểm bật ở mục 4, điểm tắt ở mục 6.5. Không ai
   khác được đụng.
2. Cả hai trang đọc `nav1` qua đúng một cặp hàm `navRead()` / `navWrite()` (mỗi trang
   một bản chép, giống cách `TRACK` đang được nhân bản) — luôn `try/catch` và luôn có
   giá trị mặc định, đúng luật "dữ liệu mùa cũ không làm vỡ mùa mới" của README §8.
3. Thêm trường mới thì thêm vào cả hai bản `navRead()`/`navWrite()` và tăng `v` nếu đổi
   nghĩa trường cũ.

---

## 3. Pha 1 — mọi lối vào đều đổ về `/dad/950901-a`

### Redirect guard

Một script **nhỏ, đứng đầu `<head>`** của `index.html` gốc, chạy trước khi vẽ bất cứ gì:

```html
<script>
/* Redirect guard — PHA 1 đẩy về hồ sơ. Đứng trước mọi CSS/JS khác. */
(function(){
  try{
    var nav = JSON.parse(localStorage.getItem('nav1')||'{}');
    var stay = /[?&](stay|egg)=1/.test(location.search);
    if(!nav.mapUnlocked && !stay) location.replace('/dad/950901-a');
  }catch(e){ location.replace('/dad/950901-a'); }
})();
</script>
```

Luật đã cân nhắc:

- **`location.replace`, không phải `location.href`** — không để lại vết trong lịch sử,
  bấm Back không bị bật qua lại giữa hai trang (bẫy redirect loop kinh điển).
- **Lỗi đọc storage thì coi như chưa mở khoá** — chế độ ẩn danh / Safari dọn storage
  (README §17) rơi về hồ sơ, là điểm xuất phát an toàn: người chơi mất tiến độ thì bắt
  đầu lại từ đầu game, không rơi vào bản đồ trống.
- **Cửa test `?stay=1`** — đứng lại Map dù chưa mở khoá, cùng tinh thần với `?egg=1`
  (README §19b): chỉ sống trong lần tải đó, không lưu. `?egg=1` cũng được miễn trừ vì
  ai gõ được nó là người dựng trang.
- Guard chỉ nằm ở `index.html` gốc. `han/261030`, `dad/950901-b` không đụng — chúng đã
  có cửa riêng (unlockAt, eggGate).

### Trong hồ sơ không đổi gì ở pha 1

Luật MISSIONS.md §5 giữ nguyên từng chữ: nút Bản đồ khoá, dẫn tới Phần I trước M1,
sáng một nhịp sau M1. Thiết kế này **không thêm lối ra nào mới** ở pha 1 — bản đồ phải
là phần thưởng của Mission 3.

---

## 4. Mốc chuyển pha — phá đảo Mission 3, mở cả hai chiều

Điểm ghi cờ nằm trong hồ sơ, tại **đúng chỗ `st.m3` chuyển thành `true`** (cả đường giải
đúng `PHAM TUAN` lẫn đường skip 10 nhịp — hai đường này đã hội tụ về một chỗ trong code
Mission):

```js
/* ngay sau khi st.m3 = true và save() */
var nav = navRead();
if(!nav.mapUnlocked){
  nav.mapUnlocked = true;
  nav.unlockedAt  = Date.now();
  navWrite(nav);
  ping('mo_pha_map');           // sự kiện mới, mục 7
}
```

Ghi tại mốc **giải xong**, không phải tại lúc bấm nút Bản đồ — yêu cầu là "giải xong
Mission 3 thì unlock", và người chơi có thể giải xong rồi đóng tab, hôm sau gõ thẳng `/`:
phải vào được Map luôn.

**"Vào được ở cả hai hướng"** từ khoảnh khắc này:

- **Hồ sơ → Map**: nút Bản đồ góc màn hình + CTA trong hộp M3, đi chung `goMap()` —
  cơ chế đã có sẵn, không đổi.
- **Map → hồ sơ**: redirect guard thấy `mapUnlocked` nên để yên; người chơi bấm toạ độ
  `DAD` → bảng hồ sơ → `DAD-950901-A` (vẫn qua cửa PASS `MIG-21` như luật hiện hành —
  thiết kế này không bỏ cửa khoá nào của Map).

---

## 5. Pha 2 — Map là trang chính, một đường xuống hồ sơ

Từ pha 2, `/` là nhà. Người chơi mở trang từ những lần sau sẽ đứng ở bản đồ.

**Đường đi duy nhất tới hồ sơ: `home → DAD → dad-950901-a`.** Cụ thể:

| Bước | Thao tác | Ghi chú |
|---|---|---|
| home | Mở `/` | Guard cho qua vì `mapUnlocked` |
| → dad | 1 click vào điểm sáng `DAD` | Zoom + mở bảng hồ sơ — luật click hiện hành |
| → dad-950901-a | Bấm `DAD-950901-A`, qua cửa PASS | Vào `/dad/950901-a` |

Không thêm lối tắt nào khác (không deep-link từ header, không nút "vào hồ sơ" nổi trên
bản đồ). Ai gõ thẳng URL `/dad/950901-a` thì vẫn vào được — hồ sơ chưa bao giờ chặn
truy cập trực tiếp và không cần chặn: yêu cầu "chỉ có thể đi từ home → dad" là nói về
**đường dẫn trong giao diện**, không phải rào URL.

Trong hồ sơ ở pha 2, nút Bản đồ giữ đúng trạng thái "Xong M3" của MISSIONS.md §5:
sáng amber, ổ khoá biến mất, bấm là về `/`. Vòng đi về hai chiều khép kín.

---

## 6. Profile — một bản lưu duy nhất

### 6.1. Vật lưu là gì

```js
nav1.profile = {
  name:    'Dongchi Bình',   // tên khai, 1–12 ký tự, cắt khoảng trắng thừa
  savedAt: 1725148800000,    // lần checkpoint gần nhất
  moc:     'M2',             // nhãn mốc cuối: 'M2' | 'M3' | 'MAP n/4' | 'MAP 4/4'
  snap: {
    msn1: { ... },           // chụp nguyên văn localStorage.msn1
    mtv1: { ... }            // chụp nguyên văn localStorage.mtv1 (pha 2 mới có)
  }
}
```

**Đúng một bản lưu** (`profile` là object, không phải mảng) — checkpoint sau **ghi đè**
checkpoint trước. "Trạng thái cuối cùng của bản thân" nghĩa là bản lưu luôn là mốc mới
nhất, không có chọn giữa nhiều bản.

Snapshot chụp **nguyên văn** hai khoá tiến độ, không chọn lọc trường — để khỏi phải
đồng bộ danh sách trường mỗi khi `save()` của một trong hai game thêm biến (bẫy
"reset từng biến bằng tay luôn sót" của README §10 áp dụng y hệt cho lưu).

### 6.2. Khai danh — lúc nhập đúng mã ở Mission 2

Mốc tạo profile: **nhập đúng `217N33`** (kể cả đường "qua cửa 2 bằng mã, tick luôn M1"
— vì điều kiện thật là *đã hoàn thành M1 tại khoảnh khắc mã đúng*, mà nhập đúng mã thì
M1 chắc chắn vừa tick).

Luồng trong hộp Mission 2, chen **một bước** trước bảng "Thông Quan ✦":

```
nhập đúng 217N33
      │
      ▼
┌───────────────────────────────┐
│ MISSION 2 · KHAI DANH         │   ← nhãn amber, đúng quy ước khung phụ README §15
│                               │
│ Đồng chí tên chi? ✦           │
│ ┌───────────────────────┐     │
│ │ [ô nhập · tối đa 12]  │     │
│ └───────────────────────┘     │
│        [ Lưu hồ sơ ✦ ]        │
└───────────────────────────────┘
      │ lưu xong (320ms, nhịp chuyển sẵn có)
      ▼
bảng "Thông Quan ✦" như hiện hành
```

- Ô nhập **điền sẵn `Dongchi Bình`** — bấm Lưu luôn cũng được, không ai kẹt ở bước này.
- Nhập rỗng / toàn khoảng trắng → dùng tên điền sẵn. Không có nút bỏ qua: một bản lưu
  là xương sống của tính năng quay lại, cho né thì mất nghĩa.
- Lưu xong: tạo `nav1.profile` với `snap.msn1` hiện tại, `moc:'M2'`, bắn `luu_profile`,
  và **chip góc phải trên cùng xuất hiện từ đây** (6.4).
- Ai đã có profile (chơi lại sau reset) mà tới lại mốc này: **không hỏi lại tên**, chỉ
  checkpoint đè theo 6.3 — khai danh là nghi thức một lần.

### 6.3. Checkpoint tự động — bản lưu tự bò theo người chơi

Sau khai danh, **mỗi mốc quan trọng ghi đè snapshot** qua một hàm chung `profSave(moc)`:

| Trang | Mốc | `moc` ghi vào |
|---|---|---|
| Hồ sơ | Xong M2 (chính là lúc khai danh) | `M2` |
| Hồ sơ | Xong M3 (giải hoặc skip) | `M3` |
| Map | Giải đúng một toạ độ MAP-01 | `MAP 1/4` … `MAP 3/4` |
| Map | Hoàn thành 4/4 | `MAP 4/4` |

Danh sách này cố ý **ngắn và toàn mốc tiến lên** — không checkpoint theo nhịp thời gian,
không checkpoint khi mở gợi ý — để bản lưu luôn là "thành quả", và restore không bao giờ
kéo người chơi **lùi** quá một mốc.

`profSave` không làm gì khi chưa có `nav1.profile` (chưa khai danh thì chưa có gì để bò).

### 6.4. Chip profile góc phải trên cùng — cửa quay về bản lưu

Hiện ở **cả hai trang**, cùng một kiểu:

```
                          ┌──────────────┐
                          │ ✈ DONGCHI BÌNH │   ← Oswald 10px hoa giãn rộng, amber .75,
                          └──────────────┘      viền mảnh var(--line), nền tối mờ
```

- **Map**: góc phải của `header.head`, cùng hàng tiêu đề. Tự ẩn khi zoom
  (`data-state="focus"`), giống `.stamp`.
- **Hồ sơ**: `position:absolute` góc phải trên của `#app`, chỉ hiện ở **trang bìa**
  (`body[data-pg="0"]`) — đúng luật "dòng Mission chỉ hiện ở trang bìa", không đè lên
  chip `HỒ SƠ PHI ĐOÀN · NO.9509` vốn nằm giữa.
- Chưa có profile → **không hiện gì**. Không hiện chip "Khai danh" mồi trước — tên chỉ
  sinh ra từ nghi thức 6.2.

Bấm chip mở hộp (khung `.cxw` sẵn có của từng trang):

```
┌─────────────────────────────────────┐
│ HỒ SƠ NGƯỜI CHƠI              ✕     │
│                                     │
│  ✈ Dongchi Bình                     │
│  Bản lưu: MAP 2/4 · 30-08 21:15     │
│                                     │
│  [ Tiếp tục ở bản lưu ✦ ]           │   ← nút chính, amber
│  [ Đổi tên ]                        │   ← nút phụ, chỉ đổi profile.name
└─────────────────────────────────────┘
```

Đây chính là chỗ "**chọn/nhập** user profile": chỉ có một bản lưu nên "chọn" là xác nhận
tiếp tục ở bản đó; "nhập" là Đổi tên. Không có nút xoá profile trong hộp này — đường
xoá duy nhất là reset của hồ sơ (6.5), tránh mất bản lưu vì bấm nhầm.

### 6.5. Khôi phục, reset, và vòng đời

**Tiếp tục ở bản lưu** (`khoi_phuc_profile`):

1. Hỏi lại một nhịp kiểu quen thuộc: nút đổi nhãn *"Chú Bình chắc chưaaa? Bấm lần nữa"*
   — vì restore **ghi đè tiến độ hiện tại**, cùng độ nguy hiểm với Reset.
2. Ghi `snap.msn1` → `localStorage.msn1`, `snap.mtv1` → `localStorage.mtv1` (trường nào
   `snap` không có thì **không đụng** khoá đó).
3. Tính lại `mapUnlocked` từ chính snapshot (`snap.msn1.m3`) rồi `location.reload()` —
   đúng quy tắc "muốn về một trạng thái trọn vẹn thì reload, đừng gỡ từng biến".

Ma trận sống/chết của từng khoá qua các đường xoá:

| Đường xoá | `mtv1` | `msn1` | `nav1.mapUnlocked` | `nav1.profile` |
|---|---|---|---|---|
| `hardWipe` — reset MAP-01 (lá cờ, hộp pí mật, Tổng tư lệnh) | xoá (giữ `resetCount`) | giữ | **giữ `true`** — M3 hồ sơ vẫn xong | **giữ** |
| `reset_msn` — Chơi lại từ đầu trong hộp M3 của hồ sơ | giữ | xoá | **hạ về `false`** — về pha 1 | **giữ** |
| Người chơi tự xoá dữ liệu trang / ẩn danh | mất | mất | mất | mất — chấp nhận, README §17 |

`profile` sống qua **cả hai** đường reset — đó là toàn bộ giá trị của tính năng: chơi
lại thoải mái, chip vẫn đứng góc phải, bấm một cái là quay về trạng thái cuối. `hardWipe`
cần sửa một dòng: dọn thêm khoá nào thì dọn, nhưng **không được đụng `nav1`** (thêm
`nav1` vào danh sách "dấu vết được phép tồn tại qua reset", cạnh `resetCount`).

Trường hợp biên đã soi:

- **Restore ở pha 2 về bản lưu `moc:'M2'`** (chưa xong M3): `mapUnlocked` tính lại từ
  snapshot → về `false` → lần tải sau guard đẩy về hồ sơ. Nhất quán: trạng thái cuối
  của bản thân lúc đó đúng là đang ở pha 1.
- **Hai tab mở song song** (Map một tab, hồ sơ một tab): `nav1` ghi kiểu
  đọc-sửa-ghi nguyên khoá, mốc checkpoint thưa nên va chạm gần như không xảy ra; tab
  nào ghi sau thắng — chấp nhận, không làm khoá phân tán cho một trang tĩnh.
- **Safari dọn storage sau ~7 ngày không ghé**: mất cả ba khoá, người chơi về pha 1
  từ đầu. Không có gì cứu ngoài server — ngoài phạm vi, xem mục 8.

---

## 7. Đo đạc — sự kiện mới

Đi qua hệ `ping` sẵn có của từng trang (endpoint `/api/ping` + `/api/note`, các tầng dự
phòng giữ nguyên):

| Sự kiện | Trang | Khi nào | Gửi mấy lần |
|---|---|---|---|
| `mo_pha_map` | Hồ sơ | Cờ `mapUnlocked` bật lần đầu | 1 lần duy nhất |
| `redirect_ho_so` | Map | Guard đẩy `/` về hồ sơ | 1 lần / lượt ghé (kèm đếm trong phiên) |
| `luu_profile` | Hồ sơ | Khai danh xong (kèm tên) | 1 lần duy nhất |
| `doi_ten_profile` | cả hai | Đổi tên trong hộp chip (kèm tên mới) | mỗi lần |
| `khoi_phuc_profile` | cả hai | Bấm Tiếp tục ở bản lưu, đã qua nhịp xác nhận (kèm `moc`) | mỗi lần |

`mo_pha_map`, `luu_profile`, `khoi_phuc_profile` vào danh sách `QUAN_TRONG` của hồ sơ
(đi song song hai kênh, MISSIONS.md §12) — mất dấu mốc chuyển pha là mù cả phân tích.

---

## 8. Ràng buộc kỹ thuật & bẫy cần né

1. **Same-origin là điều kiện sống còn.** `nav1` chỉ chia sẻ được khi Map và hồ sơ cùng
   domain. `MAPURL` trong hồ sơ hiện trỏ `https://dongchi-binh-33.vercel.app/` — phải
   là chính domain đang phục vụ `/dad/950901-a`. Nếu một ngày hồ sơ deploy tách domain
   (README §14 cho phép): toàn bộ luật pha và profile **vỡ im lặng** — guard bên Map
   không bao giờ thấy cờ. Khi đó phải truyền mốc qua URL (`/?mo=<token>`) và chấp nhận
   profile chỉ sống một bên. Ghi chú này phải chép vào README trước khi ai đó tách
   deploy.
2. **Guard phải đứng trước mọi thứ trong `<head>`** — đứng sau CSS/font là người chơi
   thấy bản đồ loé lên một khung hình rồi mới bị đẩy đi (flash of wrong page).
3. **Không đụng `mtv1` / `msn1` schema.** Thiết kế này không thêm trường nào vào hai
   khoá cũ — mọi thứ mới nằm ở `nav1`. Đổi lại, restore phải ghi nguyên văn snapshot,
   không "vá" từng trường.
4. **Biến trạng thái mới bên Map** (`navCache`…) phải khai báo trong khối `let` đầu
   script, trước `boot()` — bẫy temporal dead zone README §20 vẫn rình.
5. **Chip trên Map tự ẩn khi zoom** như `.stamp`, không thì đè lên HUD toạ độ.
6. **Tên hiển thị phải escape** khi đổ vào `innerHTML` (chip, hộp profile, và nếu sau
   này ghép tên vào băng rôn `Winner: …`) — tên là chuỗi người dùng gõ.
7. Kaomoji/emoji trong hộp profile dùng `Be Vietnam Pro` — Oswald thiếu glyph (README §15).

---

## 9. Checklist QA khi triển khai

- [ ] Máy mới tinh, gõ `/` → về `/dad/950901-a`, không loé bản đồ, Back không kẹt vòng
- [ ] `/?stay=1` đứng lại được Map dù chưa mở khoá; tải lại không có `stay` thì lại bị đẩy
- [ ] Xong M1 → nhập đúng `217N33` → hiện KHAI DANH, điền sẵn `Dongchi Bình` → Lưu → Thông Quan
- [ ] Nhập rỗng ở KHAI DANH → vẫn lưu với tên điền sẵn; chip hiện góc phải trang bìa
- [ ] Chip không hiện ở các trang trong của hồ sơ (lật khỏi bìa là ẩn)
- [ ] Giải `PHAM TUAN` (và riêng một lượt test bằng skip 10 nhịp) → gõ `/` vào thẳng Map
- [ ] Từ Map: 1 click `DAD` → `DAD-950901-A` → PASS `mig21` → vào hồ sơ; nút Bản đồ trong hồ sơ về lại `/` — đủ hai chiều
- [ ] Giải một toạ độ MAP-01 → mở hộp chip → dòng bản lưu đổi thành `MAP 1/4`
- [ ] Reset MAP-01 bằng lá cờ → tải `/` vẫn ở Map (không văng về hồ sơ), chip còn, restore về đúng `MAP n/4`
- [ ] Chơi lại từ đầu trong hộp M3 → tải `/` bị đẩy về hồ sơ (pha 1), chip còn, restore về được bản lưu cũ và quay lại pha đúng của bản lưu
- [ ] Restore hỏi lại một nhịp; bấm một lần rồi bỏ đi không mất gì
- [ ] Đổi tên → chip đổi ngay ở trang đang mở; sang trang kia cũng thấy tên mới
- [ ] Tên chứa `<b>` hay emoji → hiển thị nguyên văn vô hại ở chip và hộp
- [ ] Telegram nhận đủ: `mo_pha_map` đúng 1 lần, `redirect_ho_so`, `luu_profile`, `khoi_phuc_profile` kèm `moc`
- [ ] Thử trên điện thoại thật, màn 360px: chip không đè tiêu đề, hộp profile không tràn
