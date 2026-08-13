# USER-FLOW.md — Thiết kế hướng chuyển mạch & hồ sơ người chơi (profile)

> **Trạng thái: ĐÃ TRIỂN KHAI** vào `index.html`, `dad/950901-a/index.html` và hai bản
> `api/ping.js` (nhãn sự kiện mới). Đã chạy kiểm thử đầu-cuối bằng Chromium headless:
> redirect hai pha, luật pí danh, hai hồ sơ, đổi/xoá/ẩn danh, checkpoint, khôi phục,
> reset, tiêu đề Game On, Box Tổng tư lệnh, khung Tổ kỹ thuật, và một lượt rà riêng
> các mốc Map → Easter Egg, và luồng phá đảo M3 → lưu pí danh → vào bản đồ —
> 46 + 24 + 21 kiểm tra, tất cả đạt. Mọi tên khoá, tên hàm, tên sự
> kiện dưới đây là tên chốt — code đang dùng đúng tên này.

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
- Guard chỉ nằm ở `index.html` gốc. `han/261030`, `dad/950901-b` không đụng — chúng đã
  có cửa riêng (unlockAt, eggGate).

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

### 6.7. Khôi phục, reset, và vòng đời

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
| `gui_tam_tu` | Map | Gửi lời nhắn trong khung Tổ kỹ thuật | mỗi lần |
| `gui_tam_tu_loi` | Map | Gửi hỏng (mất mạng / bị chặn) | mỗi lần |
| `vao_easter_egg` | Map | Bấm "Enter Easter Egg" trong khung Tổ kỹ thuật | mỗi lần |

`mo_pha_map`, `luu_profile`, `khoi_phuc_profile` nằm trong danh sách `QUAN_TRONG` của hồ
sơ (đi song song hai kênh, MISSIONS.md §12) — mất dấu mốc chuyển pha là mù cả phân tích.

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

## 9. Checklist QA — đã chạy tự động, 43/43 đạt

Kịch bản Chromium headless dựng lại đúng các bước dưới; mục nào không tự động hoá được
thì soi ảnh chụp ở khổ 390px.

**Hai pha**
- [x] Máy mới tinh, gõ `/` → về `/dad/950901-a`, không loé bản đồ, Back không kẹt vòng
- [x] `/?stay=1` đứng lại được Map dù chưa mở khoá
- [x] Phá đảo M3 (cả đường skip) → gõ `/` vào thẳng Map
- [x] Reset hồ sơ → `/` lại bị đẩy về hồ sơ; reset MAP-01 thì vẫn ở Map

**Pí danh**
- [x] Nhập đúng `217N33` → hộp ghi **"Nhập pí danh ✦"**, ô trống, có dòng luật
- [x] Gõ `CHUBINHXYZ` → tự thành `chubin` (hạ hoa + cắt 6 ký tự)
- [x] Bỏ trống mà Lưu → báo *"Nhập pí danh đã nha ✦"*; trùng tên → *"Pí danh này có rồi ✦"*
- [x] Lưu xong: nền tối lại + chip nhấp nháy đúng **một lần** (`chipTaught`)
- [x] Bảng xổ: nhãn `1/2` → `2/2`, đủ hai thì mất dòng "＋ Pí danh mới"
- [x] Tap hồ sơ khác → switch, tiến độ đang chơi được cất vào hồ sơ cũ trước
- [x] Tap hồ sơ đang dùng → hỏi lại *"chắc chưaaa?"* rồi mới khôi phục
- [x] ✕ cần **hai nhịp**; xoá hồ sơ đang dùng → rơi về ẩn danh, hồ sơ kia còn nguyên
- [x] Chơi ẩn danh → chip xám ghi `ẩn danh`, không xoá hồ sơ nào, bảng xổ vẫn mở
- [x] Chip chỉ ở trang bìa của hồ sơ; lật trang là ẩn
- [x] Chip **không đè góc kẻ tay phải**; bảng xổ nằm gọn trong khung; `Esc` đóng được
- [x] Chip không có nền hộp, có mũi `▾`

**Giao diện khác**
- [x] Bảng ghi công Mission 1 gói đúng **2 dòng**
- [x] Box Tổng tư lệnh: bỏ gợi ý "bấm 5 nhịp", kaomoji không tràn viền
- [x] Trong cửa sổ Easter Egg, tiêu đề đổi **"Easter Egg" ⇄ "Game On"**, cả hai nửa
      cùng tông amber và cùng nhịp nhấp nháy (`class="title mc egg eggblink"`)

**Mở tại chỗ (file://)**
- [x] Mở thẳng `index.html` bằng trình duyệt → hiện bản đồ, không bị đẩy đi đâu
- [x] Mở thẳng `dad/950901-a/index.html` → hiện hồ sơ bình thường

**Còn phải thử tay**
- [ ] Điện thoại thật, cả màn 360px
- [ ] Sau khi deploy: Telegram nhận đủ 7 sự kiện ở mục 7

---

## 10. Khung Tổ kỹ thuật — hai nút

Khung `#credw` (mở bằng 10 nhịp vào dòng Last updated) nay có một hàng hai nút ở cuối:

| Nút | Vị trí | Việc |
|---|---|---|
| **✉ Gửi tâm tư** | trái | Mở một ô nhập **ngay phía trên hàng nút**; gõ xong bấm **Gửi ✦** → `POST /api/thu` → về hòm thư `honghandn@gmail.com` |
| **Enter Easter Egg ✦** | phải | **Bay thẳng vào hồ sơ niêm phong `/dad/950901-b`**. Trước khi đi có bật `eggHack` + `credFound` nên lúc quay ra bản đồ đã sẵn trạng thái GAME ON |

Đích của nút phải lấy từ hằng `EGG_HREF`, **đọc thẳng từ `NODES`** (mục `DAD-950901-B`)
chứ không viết cứng đường dẫn — đổi `href` trong `NODES` là nút đi theo, không lệch.

Không chặn thêm cửa nào ở nút này: vào được khung Tổ kỹ thuật nghĩa là đã gõ đủ 10 nhịp
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
