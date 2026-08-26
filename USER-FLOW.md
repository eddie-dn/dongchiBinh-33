# USER-FLOW.md — Thiết kế hướng chuyển mạch & hồ sơ người chơi (profile)

> **Trạng thái: ĐÃ TRIỂN KHAI** vào `index.html`, `dad/950901-a/index.html` và hai bản
> `api/ping.js` (nhãn sự kiện mới). Mọi tên khoá, tên hàm, tên sự kiện dưới đây là tên
> chốt — code đang dùng đúng tên này.
>
> **File này chỉ nói về ĐIỀU HƯỚNG và PÍ DANH** (`nav1`, hai pha, redirect guard). Luật
> chơi của từng map nằm ở `README.md`; câu chữ của Map 3 nằm ở `han/CHU-MAP3.md`.
> Bộ kiểm thử đầu-cuối (Chromium headless) không nằm trong repo — kết quả mới nhất ghi ở
> cuối README.

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
| Pí danh | Chưa mở — phải phá đảo M3 đã | **Chỉ có trong hồ sơ**, nằm ngay trên dòng Mission (mục 6) |

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
  v: 2,                      // phiên bản luật, để di trú về sau
  mapUnlocked: false,        // cờ chuyển pha — true = PHA 2
  unlockedAt: null,          // timestamp phá đảo M3, để hiển thị
  profiles: [],              // TỐI ĐA 2 pí danh, mỗi phần tử xem mục 6.1
  active: -1,                // con trỏ pí danh đang dùng · -1 = chơi ẩn danh
  chipTaught: false          // đã chỉ chỗ chip lần đầu chưa (mục 6.6)
}
```

**Di trú v1 → v2 tự động** ngay trong `navRead()`: bản cũ có `profile` lẻ thì gói thành
`profiles: [profile]`, `active: 0`, xoá trường cũ. Không ai mất bản lưu vì đổi luật.

Quy tắc:

1. **Chỉ hai điểm ghi `mapUnlocked`**: điểm bật ở mục 4, điểm tắt ở mục 6.7. Không ai
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
  /* Chỉ chạy khi trang được PHỤC VỤ qua http/https — xem bẫy dưới */
  if(location.protocol !== 'http:' && location.protocol !== 'https:') return;
  try{
    var nav = JSON.parse(localStorage.getItem('nav1')||'{}');
    var stay = /[?&](stay|egg)=1/.test(location.search);
    if(nav.mapUnlocked || stay) return;
  }catch(e){}
  location.replace('/dad/950901-a');
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
- Guard chỉ nằm ở `index.html` gốc. Các trang con (`dad/950901-b`, `han/961030-a`,
  `han/961030-b`, `phao-hoa`) không đụng — chúng đã có cửa riêng (`unlockAt`, `eggGate`,
  `credGate`, `hanGate`, cửa mã `PIN_A`).

**BẪY ĐÃ VẤP — mở bằng `file://` thì trắng trang.** Bản đầu không xét giao thức, nên tải
file về mở thử (kiểm tra trước khi upload) là guard bắn sang `file:///dad/950901-a` —
đường dẫn không tồn tại → Chrome báo *"Your file couldn't be accessed · ERR_FILE_NOT_FOUND"*.
Nhìn y như file hỏng, dù file nguyên vẹn từng byte. Nay guard **thoát ngay** khi
`location.protocol` không phải `http:`/`https:`, nên mở tại chỗ vẫn xem được bản đồ đầy
đủ. Bên hồ sơ không dính vì không có guard.

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

- **Hồ sơ → Map**: nút Bản đồ góc màn hình + CTA trong hộp M3, đi chung `goMap()`.

  **BẪY ĐÃ VẤP — đích phải CÙNG ORIGIN.** `MAPURL` vốn là địa chỉ tuyệt đối
  (`https://dongchi-binh-33.vercel.app/`). Trên bản xem thử (preview của nhánh) hay máy
  local, bấm nút là nhảy sang domain production — **khác origin nên `localStorage` không
  theo sang**: pí danh mất, `nav1.mapUnlocked` mất, guard bên kia đá ngược về hồ sơ.
  Nhìn y như "xong M3 rồi mà bản đồ vẫn không thành trang chính". Nay:

  ```js
  var MAPURL_ABS = 'https://dongchi-binh-33.vercel.app/';
  /* Deploy chung repo (hồ sơ ở /dad/950901-a) → bản đồ là '/' cùng origin */
  var MAPURL = /\/dad\/950901-a(\/|$)/.test(location.pathname) ? '/' : MAPURL_ABS;
  ```

  Deploy tách domain thì đường dẫn không còn chứa `/dad/950901-a`, tự rơi về địa chỉ
  tuyệt đối — lúc đó chấp nhận mất chung `localStorage`, đúng ràng buộc ở mục 8.
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

## 6. Pí danh (profile) — tối đa 2 hồ sơ

### 6.1. Vật lưu là gì

```js
nav1.profiles[i] = {
  name:    'pdb',            // PÍ DANH, luật ở 6.2
  savedAt: 1725148800000,    // lần checkpoint gần nhất
  moc:     'M2',             // nhãn mốc cuối: 'M1' | 'M2' | 'M3' | 'MAP n/4'
  snap: {
    msn1: { ... },           // chụp nguyên văn localStorage.msn1
    mtv1: { ... }            // chụp nguyên văn localStorage.mtv1 (pha 2 mới có)
  }
}
```

**Mỗi pí danh giữ đúng MỘT bản lưu** — checkpoint sau ghi đè checkpoint trước. "Trạng
thái cuối cùng của bản thân" nghĩa là bản lưu luôn là mốc mới nhất.

**Trần 2 pí danh** (`PROF_MAX`). Đủ hai thì dòng "＋ Pí danh mới" biến mất; muốn thêm
phải xoá bớt một cái.

Snapshot chụp **nguyên văn** hai khoá tiến độ, không chọn lọc trường — để khỏi phải
đồng bộ danh sách trường mỗi khi `save()` của một trong hai game thêm biến (bẫy
"reset từng biến bằng tay luôn sót" của README §10 áp dụng y hệt cho lưu).

### 6.2. Luật đặt pí danh

| Luật | Chi tiết |
|---|---|
| Không chữ in hoa | Gõ hoa cũng bị **hạ thường ngay khi gõ** — không tạo được tên sai luật |
| Tối đa **6 ký tự** | `PID_LEN`; cắt thẳng lúc gõ, `maxlength` chỉ là lớp phụ |
| Cho phép | chữ thường, số, ký tự đặc biệt |
| Bỏ | mọi khoảng trắng |
| Không trùng | Trùng tên đã có → báo *"Pí danh này có rồi ✦"* |

Chuẩn hoá đi qua đúng một hàm `pidNorm()` ở cả hai trang.

### 6.3. Khai danh — NGAY SAU KHI phá đảo Mission 3

Pí danh **không mở ở Mission 2 nữa**. Cửa mở là **phá đảo Mission 3** (giải đúng
`PHAM TUAN` hoặc skip 10 nhịp) — trước đó người chơi chưa có gì đáng lưu, và bản ghi
phải kể được cả chặng bản đồ phía sau.

```
phá đảo Mission 3
      │
      ▼
┌───────────────────────────────┐
│ MISSION 3 · KHAI DANH         │
│         Nhập pí danh ✦        │
│ ┌───────────────────────────┐ │  ← ô rộng bằng hộp
│ │        pí danh…           │ │
│ └───────────────────────────┘ │
│ · Tối đa 6 ký tự: thường,     │  ← hai dòng luật rời, LỆCH TRÁI
│   số, đặc biệt                │
│ · Không viết hoa              │
│      [ Lưu hồ sơ ✦ ]          │
└───────────────────────────────┘
      │ lưu xong
      ▼
bảng "Phá đảo (˶˃ ᵕ ˂˶)" → rồi spotlight chỉ chỗ ô pí danh (6.6)
```

Hộp **không còn câu giải thích dài** ("Pí danh gắn với bản lưu tiến trình — lần sau
bấm vào pí danh ở góc phải trên cùng…"). Chỉ còn tiêu đề, ô nhập, hai dòng luật.

**Thứ tự chốt: LƯU TRƯỚC, box "vào bản đồ / chơi lại" SAU.** Hộp khai danh chen vào
giữa `solveM3()` và bảng Phá đảo, nên không ai phá đảo xong mà chẳng có gì được lưu.

Điều kiện mời khai danh là **"đang không đứng ở pí danh nào" + còn chỗ trống**
(`!profCur() && profiles.length < PROF_MAX`), chứ **không** phải "chưa có pí danh nào":

| Tình huống lúc phá đảo M3 | Hộp khai danh | Việc lưu |
|---|---|---|
| Chưa có pí danh nào | **Có** | Tạo mới rồi mới sang bảng Phá đảo |
| Đang **ẩn danh**, còn chỗ (1/2) | **Có** | Tạo cái thứ hai — *bẫy đã vá, xem dưới* |
| Đang đứng ở một pí danh | Không | `solveM3()` đã checkpoint đè, đi thẳng vào bảng |
| Đủ 2 pí danh, đang ẩn danh | Không | Hết chỗ; muốn lưu thì xoá bớt rồi dùng lệnh "Lưu tiến trình" |

**BẪY ĐÃ VẤP:** bản đầu xét `!profiles.length`, nên ai đã từng tạo pí danh rồi chuyển
sang chơi ẩn danh thì lúc phá đảo M3 **bị bỏ thẳng sang box "vào bản đồ / chơi lại"** —
không có hộp pí danh, và tiến độ không được ghi vào đâu cả.

Sau bảng Phá đảo, người chơi **chọn một trong hai**: bấm *Mở khoá Bản đồ tác chiến ✈*
đi thẳng sang bản đồ, hoặc **tắt box** — về trang bìa là thấy pí danh nằm trên dòng
Mission (kèm spotlight chỉ chỗ lần đầu).

### 6.4. Bản ghi có mốc của CẢ HAI game

Nhãn mốc (`moc`) do `mocNow()` dựng, đọc cả `msn1` lẫn `mtv1`:

| Trạng thái | Nhãn |
|---|---|
| Chưa xong M3 | `M1` · `M2` |
| Xong M3, chưa đụng bản đồ | `M3 ✓` |
| Đang giải bản đồ | `TAC 1/4` … `TAC 3/4` |
| Đủ 4/4, chưa có điểm kích hoạt | `TAC 4/4` |
| Đủ 4/4 + đã mở Easter Egg (`credFound`/`eggHack`) | `EGG ✦` |

**Bản đồ KHÔNG tự ghi hồ sơ nữa.** Đang chơi ở `/` mà muốn lưu thì phải **quay về
`/dad/950901-a`** — về tới trang bìa là bản ghi được chốt. Hai đường ghi:

1. **Tự động khi về trang bìa** — chỉ ghi khi tiến độ **tiến lên**. Hàm `hang()` xếp
   hạng `mission×100 + tactical×10 + egg`; hạng hiện tại thấp hơn bản lưu thì **không
   đụng vào**. Nhờ vậy vừa Reset bản đồ xong ghé lại hồ sơ không xoá mất bản lưu tốt.
2. **Lệnh `⟱ Lưu tiến trình · <mốc>`** trong bảng xổ — ghi đè thật, bất kể tiến hay lùi.
   Dành cho người cố ý muốn chốt trạng thái vừa reset.

### 6.5. Ô pí danh nằm TRÊN DÒNG MISSION

Xong Mission 3 thì dòng Mission đổi hình: **`✓ M3` đẩy lên chỗ của `✓ M2`**, và ô thứ
hai chính là bảng xổ pí danh — không còn chip ở góc, và **trang bản đồ không có gì cả**.

```
   ✓ M3  ·  PDB ▾           ← trang bìa hồ sơ, dòng Mission
  ●━━━✈━━━●━━━━━━━●
 NOOB  EASY CHEESY  HIT THE ROCK
```

Ba trường hợp hiển thị của ô này (đã rà đủ):

| Trạng thái | Ô hiện | Bấm vào |
|---|---|---|
| Chưa có pí danh nào | `＋ Lưu pí danh ▾` (amber) | Mở thẳng hộp Khai danh |
| Đang dùng một pí danh | `pdb ▾` | Xổ bảng |
| Có pí danh nhưng đang ẩn danh | `Ẩn danh ▾` (xám) | Xổ bảng |

Bảng xổ neo ngay dưới dòng Mission, canh giữa khung:

```
┌──────────────────────────────┐
│ PÍ DANH · 1/2                │
│ ● pdb                TAC 2/4 ✕│
│ ──────────────────────────── │
│ ⟱ Lưu tiến trình · TAC 2/4   │  ← chỉ hiện khi đang dùng một pí danh
│ ＋ Pí danh mới               │  ← chỉ hiện khi < 2
│ ⏻ Chơi ẩn danh               │
└──────────────────────────────┘
```

| Thao tác | Kết quả |
|---|---|
| Tap dòng **không** phải hồ sơ đang dùng | Đổi hồ sơ: cất tiến độ đang chơi vào hồ sơ cũ trước, nạp snapshot mới, reload |
| Tap dòng **đang** dùng | Quay về bản lưu — hỏi lại một nhịp (*"chắc chưaaa?"*) |
| **✕** | Xoá — hai nhịp. Xoá hồ sơ đang dùng thì rơi về ẩn danh, tiến độ đang chơi không bị đụng |
| **⟱ Lưu tiến trình** | Ghi đè bản lưu bằng trạng thái hiện tại, nhãn đổi thành *"Đã lưu ✦"* |
| **＋ Pí danh mới** | Mở hộp Khai danh, lưu xong đứng luôn ở pí danh mới |
| **⏻ Chơi ẩn danh** | Cất lần cuối rồi `active = -1`. Bảng xổ vẫn mở để thấy trạng thái |

Đóng bảng: bấm ra ngoài, `Esc`, hoặc bấm lại ô pí danh. Lật khỏi trang bìa thì cả dòng
Mission lẫn bảng xổ đều ẩn.

### 6.6. Chỉ chỗ lần đầu

Ngay sau khi có pí danh đầu tiên: nền tối lại (`#msnDim`) và **cả dòng Mission nhấp
nháy** 4,2 giây. Bấm nền hoặc mở bảng xổ là tắt. Chạy đúng một lần — cờ `chipTaught`.

### 6.7. Tự lưu — người chơi không phải nhớ bấm Lưu

Tiến độ được cất vào pí danh đang dùng ở **năm chỗ**, không cần thao tác nào:

| Lúc nào | Gọi gì | Ép ghi đè? |
|---|---|---|
| Xong Mission 1 | `profSave('M1')` | không |
| Xong Mission 2 | `profSave('M2')` | không |
| Xong Mission 3 | `profSave('M3 ✓')` | không |
| Mở lại trang bìa hồ sơ | `profSave(mocNow())` | không |
| **Rời trang hoặc giấu tab** | `luuRoiTrang()` | không |
| Đổi pí danh · chơi ẩn danh | `profSave(mocNow(), true)` | **có** |
| Lệnh "Lưu tiến trình" trong bảng xổ | `profSave(mocNow(), true)` | **có** |

Năm chỗ đầu **không ép**, nên `profSave` chỉ ghi khi tiến độ **đi lên**
(`hang(snap) > hangNay()` thì từ chối). Nhờ vậy vừa Reset bản đồ xong mà ghé
qua hồ sơ thì bản lưu tốt vẫn còn nguyên. Muốn ghi đè thật thì mới cần lệnh
trong bảng xổ — đó là lý do lệnh đó vẫn phải giữ, chứ **không** phải vì máy
không biết tự lưu.

> **⚠ DÙNG CẢ `pagehide` LẪN `visibilitychange`.** Điện thoại nhiều máy không
> bao giờ bắn `pagehide` — người dùng gạt sang app khác là hệ điều hành giết
> thẳng tab đang ẩn. Thiếu `visibilitychange` thì đúng cái tình huống hay gặp
> nhất trên điện thoại lại là cái không được lưu.

> **⚠ TIẾN ĐỘ BẢN ĐỒ VẪN CHỈ THEO VỀ KHI GHÉ LẠI TRANG HỒ SƠ.** Bản đồ **cố ý
> không** tự ghi vào pí danh (xem ghi chú ở `mapTien`) — chơi bản đồ xong phải
> quay về hồ sơ một nhịp thì pí danh mới biết. Đừng "sửa" bằng cách cho bản đồ
> ghi thẳng: đã bỏ lối đó một lần rồi.

Bộ kiểm: `test/bo/pfsave20.mjs`.

### 6.8. Khôi phục, reset, và vòng đời

Khôi phục / đổi hồ sơ đều đi qua `profLoad(nav, i)`:

1. Ghi `snap.msn1` → `localStorage.msn1`, `snap.mtv1` → `localStorage.mtv1` (trường nào
   `snap` không có thì **không đụng** khoá đó).
2. Tính lại `mapUnlocked` từ chính snapshot (`snap.msn1.m3`).
3. `location.reload()` — đúng quy tắc "muốn về một trạng thái trọn vẹn thì reload, đừng
   gỡ từng biến".

Ma trận sống/chết của từng khoá qua các đường xoá:

| Đường xoá | `mtv1` | `msn1` | `nav1.mapUnlocked` | `nav1.profiles` |
|---|---|---|---|---|
| `hardWipe` — reset MAP-01 (lá cờ, hộp pí mật, Tổng tư lệnh) | xoá (giữ `resetCount`) | giữ | **giữ `true`** — M3 hồ sơ vẫn xong | **giữ** |
| `reset_msn` — Chơi lại từ đầu trong hộp M3 của hồ sơ | giữ | xoá | **hạ về `false`** — về pha 1 | **giữ** |
| Người chơi tự xoá dữ liệu trang / ẩn danh | mất | mất | mất | mất — chấp nhận, README §17 |

Pí danh sống qua **cả hai** đường reset — đó là toàn bộ giá trị của tính năng. `hardWipe`
**không được đụng `nav1`** (đã ghi rõ trong code, cạnh dòng giữ `resetCount`).

Trường hợp biên đã soi:

- **Khôi phục ở pha 2 về bản lưu `moc:'M2'`** (chưa xong M3): `mapUnlocked` tính lại từ
  snapshot → về `false` → lần tải sau guard đẩy về hồ sơ. Nhất quán.
- **Hai tab mở song song**: `nav1` ghi kiểu đọc-sửa-ghi nguyên khoá, mốc checkpoint thưa
  nên va chạm gần như không xảy ra; tab nào ghi sau thắng — chấp nhận cho một trang tĩnh.
- **Safari dọn storage sau ~7 ngày không ghé**: mất cả ba khoá. Ngoài phạm vi, xem mục 8.

---

## 7. Đo đạc — sự kiện mới

Đi qua hệ `ping` sẵn có của từng trang (endpoint `/api/ping` + `/api/note`, các tầng dự
phòng giữ nguyên). Nhãn tiếng Việt khai trong `NHAN` của **cả hai** bản `api/ping.js`.

| Sự kiện | Trang | Khi nào | Gửi mấy lần |
|---|---|---|---|
| `mo_pha_map` | Hồ sơ | Cờ `mapUnlocked` bật lần đầu | 1 lần duy nhất |
| `redirect_ho_so` | Map | Guard đẩy `/` về hồ sơ | Mỗi lần bị đẩy |
| `luu_profile` | Hồ sơ | Khai danh xong (kèm pí danh) | Mỗi pí danh một lần |
| `doi_profile` | Hồ sơ | Đổi sang pí danh khác (kèm tên đích) | mỗi lần |
| `xoa_profile` | Hồ sơ | Xoá một pí danh (kèm tên vừa xoá) | mỗi lần |
| `an_danh` | Hồ sơ | Bấm "Chơi ẩn danh" | mỗi lần |
| `khoi_phuc_profile` | Hồ sơ | Quay về bản lưu, đã qua nhịp xác nhận (kèm `moc`) | mỗi lần |
| `luu_tien_trinh` | Hồ sơ | Bấm "⟱ Lưu tiến trình" (kèm mốc) | mỗi lần |
| `gui_tam_tu` | Map | *(đã bỏ nút — nhãn giữ lại cho dữ liệu cũ)* | — |
| `gui_tam_tu_loi` | Map | Gửi hỏng (mất mạng / bị chặn) | mỗi lần |
| `vao_easter_egg` | Map | Bấm "Enter Easter Egg" trong khung Collected | mỗi lần |

`mo_pha_map`, `luu_profile`, `khoi_phuc_profile` nằm trong danh sách `QUAN_TRONG` của hồ
sơ (đi song song hai kênh, MISSIONS.md §12) — mất dấu mốc chuyển pha là mù cả phân tích.

### 7.1. Mỗi tín hiệu phải tự khai mình từ TRANG NÀO

Cột "Trang" ở bảng trên không phải chuyện ghi chép cho vui — nó phải đi kèm
chính tín hiệu. Mỗi cú `ping` mang thêm ba trường: `trang` (mã trang), `noi`
(hộp đang mở) và `tt` (một dòng trạng thái thật). Luật đầy đủ ở
`DESIGN-SYSTEM.md` §9.

> **⚠ BA CÁI BẪY ĐÃ VẤP, đều cùng một kiểu: chỗ nào KHÔNG khai thì máy chủ đi
> ĐOÁN, và đoán thì trật.**
>
> 1. **Đoán theo tiền tố tên sự kiện.** Hồ sơ Phi đoàn có 25 tên thì 15 cái
>    không mang tiền tố nào — `mo_pha_map`, `giai_m3`, `reset_msn`, `ho_so_mo`…
>    — nên rơi hết vào nhánh chót là bản đồ. Chuông báo *phá đảo Mission 3* mà
>    đề "BẢN ĐỒ TÁC CHIẾN". Nay khai thẳng từng tên vào `CHU_TRANG`.
> 2. **Tên sự kiện nói về NƠI NÓ DẪN TỚI, không nói NƠI NÓ XẢY RA.**
>    `vao_ban_do` / `bam_ban_do_khoa` / `nhay_ban_do_xong` nghe như chuyện của
>    bản đồ, nhưng đó là mấy cái nút **trên trang hồ sơ**. Đoán theo tên là sai
>    từ gốc.
> 3. **Kênh dự phòng quên khai.** Đường ảnh và đường biểu mẫu (dùng khi máy
>    người chơi chặn `fetch`) trước đây chỉ gửi `ev` + `detail`. Nghĩa là đúng
>    mấy người chơi có bộ chặn quảng cáo lại là mấy người bị đoán nhầm trang.
>    Nay cả ba kênh đều khai.

Và một bẫy nữa, khác kiểu: **sự kiện không có nhãn thì không bao giờ tới
chuông.** `api/ping.js` chỉ ghi log rồi thôi, không báo gì cả. Bảy cái từng lọt
lưới đúng vậy — trong đó có `giai_m3` / `skip_m3` (hai mốc phá đảo Mission 3),
`hackmap` / `hack_easter_egg` (hai cửa hậu), và `redirect_ho_so` (tín hiệu đầu
tiên của mọi người chơi mới). Chúng lọt vì gọi bằng biểu thức điều kiện
`ping(co ? 'a' : 'b')` hoặc dựng thẳng thân tín hiệu, nên lối dò `ping('…')`
không thấy.

Bộ kiểm `test/bo/kenh20.mjs` nay soi cả ba dạng gọi, và bắt buộc: mọi tên sự
kiện có bắn đều phải có nhãn, và đều phải ra đúng trang của nó.

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

## 9. Bộ kiểm hồi quy

**Chạy: `node test/chay.mjs`** — bộ chạy tự bật máy chủ tĩnh, chạy 28 bộ, in
bảng tổng kết, tự tắt. Có phép hỏng thì mã thoát khác 0. Chi tiết ở
`test/README.md`.

> **⚠ ĐỜI TRƯỚC LÀ MỘT DANH SÁCH GẠCH ĐẦU DÒNG CHÉP TAY** ("43/43 đạt"), và nó
> mốc đúng như mọi danh sách chép tay: con số đứng im qua mười mấy đợt trong
> khi bộ kiểm thật đã lên 500 phép. Nay không chép số vào tài liệu nữa — muốn
> biết bao nhiêu thì chạy.

Mấy bộ soi thẳng những thứ mục này từng liệt kê:

| Việc | Bộ |
|---|---|
| Hai pha · chuyển hướng · Back không kẹt vòng | `kt` `kt3` |
| Pí danh: đặt tên, đổi, xoá, ẩn danh, khôi phục | `kt8` `kt10` |
| **Pí danh tự lưu** — năm chỗ, không ghi đè bản lùi | `pfsave20` |
| Reset: `hardWipe` vs `reset_msn`, pí danh sống qua cả hai | `kt3` `kt9` |
| Ô mã: hiện rồi che · tự chấm · cửa nào cũng hỏi lại | `pin13` `pin13b` `pin13c` |
| Ô mã: chặn tự điền, tốc độ, xoá | `tudien18` `nhap19` |
| Sổ bản ghi: tem, thẻ toạ độ, hai cột ngày | `tem16` |
| Trang Credit của cả bảy sổ | `cre14` |
| Hộp chào · hộp nhắc Open World | `kt2` `ow19` |
| Hiệu ứng chuyển cảnh Gate 2 → phát mã → Zoey's Castle | `kt15` |
| Co giãn 320px → 1440px | `resp14` `resp14b` |
| Tín hiệu bắn về: đúng trang, đủ nhãn, đủ kênh | `bao18` `kenh20` |

**Còn phải thử tay** (máy không thay được):

- [ ] Điện thoại thật, cả màn 360px — nhất là bàn phím ảo che ô nhập
- [ ] Sau khi deploy: mở `https://<tên-miền>/README.md` và `/test/chay.mjs`,
      **cả hai phải ra 404** (xem `.vercelignore`)
- [ ] Sau khi deploy: Telegram nhận đủ nhãn ở mục 7

---

## 10. Khung "Collected: Easter Egg" — hai nút

Khung `#credw` (mở bằng 10 nhịp vào dòng Last updated) — trước đây gọi là *khung Tổ kỹ
thuật*, nay là **bảng chiến lợi phẩm**: tiêu đề `Collected: Easter Egg`, ảnh tròn, dòng
*Say hi to me~ HongHandangiu*, một nút cuộn phim ở góc để xem lại pháo hoa, và hàng hai
nút ở cuối:

| Nút | Vị trí | Việc |
|---|---|---|
| **Get to know me** | trái | Sang **Map 3 · Zoey's Castle** (`/han/961030-a?from=egg`) |
| **Enter Easter Egg ✦** | phải | **Bay thẳng vào `/dad/950901-b`** (Easter Egg · Gate 2). Trước khi đi bật `eggHack` + `credFound` + `eggWin` nên quay ra bản đồ là đã GAME ON |

> Nút *✉ Gửi tâm tư* đã **bỏ** khỏi khung này; endpoint `/api/thu` vẫn còn (mô tả bên dưới)
> nhưng hiện không có nút nào gọi tới.

**Mở khung lần đầu và lần hai thì khung tự bay sang `/phao-hoa`** sau 3 giây khoá — xem
README §19b. Từ lần thứ ba mới phải bấm nút cuộn phim.

Đích của nút phải lấy từ hằng `EGG_HREF`, **đọc thẳng từ `NODES`** (mục `DAD-950901-B`)
chứ không viết cứng đường dẫn — đổi `href` trong `NODES` là nút đi theo, không lệch.

Không chặn thêm cửa nào ở nút này: vào được khung Collected nghĩa là đã gõ đủ 10 nhịp
vào dòng Last updated, mà đó **chính là điểm kích hoạt** (`credFound`) của hồ sơ niêm
phong theo README §19c.

### `/api/thu` — đường thư

Hai kênh chạy song song, kênh nào khai biến môi trường thì kênh đó đi:

| Kênh | Biến môi trường ở Vercel |
|---|---|
| Email (Resend) | `RESEND_KEY` · `MAIL_TO` (mặc định `honghandn@gmail.com`) · `MAIL_FROM` (chưa có tên miền riêng thì để `onboarding@resend.dev`) |
| Telegram | dùng lại `NOTIFY_KIND=telegram` · `TG_TOKEN` · `TG_CHAT` của `/api/ping` |

Chưa khai gì thì endpoint **vẫn trả 200** và ghi `console.log` — người gửi không nhìn
thấy lỗi cấu hình, nội dung nằm ở tab Logs của Vercel. Trần chống spam: 6 lời nhắn mỗi
10 phút cho mỗi instance. Nhớ deploy **cả hai bản** `api/thu.js` và
`dad/950901-a/api/thu.js`, đúng luật nhân bản của README §14.
