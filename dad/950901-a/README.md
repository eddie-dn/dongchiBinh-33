# DAD-950901-A · Hồ sơ Phi đoàn (bản deploy độc lập)

> Mã hồ sơ là **DAD-950901-A**. Tên cũ `XG-950901-A` chỉ còn trong tài liệu đời đầu.

Gói này chạy được một mình, không cần trang bản đồ.

```
/
├── index.html      ← hồ sơ (deck 5 trang, mọi ảnh và thư viện đã nhúng sẵn)
├── vercel.json     ← { "cleanUrls": true }
├── MISSIONS.md     ← luật chơi đầy đủ của hệ 3 Mission
└── api/            ← CHÉP TỪ `/api` Ở GỐC KHO MÃ lúc deploy (xem ghi chú dưới)
    ├── ping.js     ← endpoint nhận tín hiệu, bắn về Telegram/Discord
    ├── note.js     ← bí danh của ping.js (bắt buộc có — xem "Chống mất tín hiệu")
    ├── pidanh.js   ← cuốn danh bạ pí danh (thiếu file này thì pí danh không qua máy khác được)
    └── thu.js      ← endpoint nhận lời nhắn (bên bản đồ hiện KHÔNG còn nút gọi tới)
```

> **⚠ THƯ MỤC `api/` KHÔNG CÒN NẰM SẴN TRONG FOLDER NÀY — CỐ Ý.**
> Đời trước có một bản chép của `ping.js` · `note.js` · `thu.js` để ngay đây cho
> tiện. Bản chép đó **không ai sửa theo** trong khi bản gốc ở `/api` đi tiếp:
> tới lúc kiểm lại thì `ping.js` bên này chỉ còn bằng **một phần ba** bản gốc,
> và `pidanh.js` — thứ trang này gọi tới mỗi lần lưu pí danh — thì chưa từng
> có. Ai làm theo hướng dẫn cũ sẽ deploy ra một bản **im lặng mất pí danh**,
> mà không có gì báo lỗi.
>
> Nên nay chỉ có **một bản duy nhất** ở `/api` gốc; tách domain thì chép nguyên
> thư mục đó sang lúc deploy. Chép chứ đừng lưu bản thứ hai trong kho mã.

> **Deploy chung với bản đồ** (cách đang dùng) thì gói này còn hai việc nữa: giữ cờ điều
> hướng hai pha và **pí danh** ở khoá `localStorage.nav1`, dùng chung với trang bản đồ.
> Luật đầy đủ ở [`../../USER-FLOW.md`](../../USER-FLOW.md). Deploy tách domain thì hai
> thứ đó tự tắt — xem mục "Hai pha & pí danh" bên dưới.

## Deploy

1. Đẩy nguyên thư mục này lên một repo GitHub — `index.html` phải nằm ở **gốc repo**.
   Chép `/api` ở gốc kho mã sang cạnh nó: phải có **đủ** `ping.js`, `note.js` (xem
   "Chống mất tín hiệu") và `pidanh.js` (pí danh). Thêm `vercel.json` một dòng
   `{ "cleanUrls": true }` — Vercel chỉ đọc `vercel.json` ở GỐC dự án, nên file
   nằm trong thư mục con là file chết.
2. Vercel → Add New Project → Import repo → Framework **Other**, Build Command và Output
   Directory **để trống** → Deploy.
3. Settings → Environment Variables: `NOTIFY_KIND=telegram`, `TG_TOKEN`, `TG_CHAT`.
   Muốn `/api/thu` gửi được email thì thêm `RESEND_KEY`, `MAIL_FROM`, `MAIL_TO`.
4. **Redeploy** — biến môi trường chỉ ăn từ lần deploy sau.

## Cấu hình đo đạc

Đầu khối script chèn thêm (cuối file `index.html`):

```js
var TRACK = {
  mode:     'endpoint',
  endpoint: '/api/note',   // đường chính — tên trung tính, ít khớp bộ lọc chặn
  endpoint2:'/api/ping',   // đường cũ: dự phòng + đích của kênh gửi biểu mẫu
  duplex:   true,          // mốc quan trọng bắn thêm một phát qua kênh biểu mẫu
  tgToken:  '', tgChat: ''
};
```

- `endpoint` (mặc định): first-party, token giấu trong biến môi trường. **Khuyên dùng.**
- `telegram`: không cần server, nhưng **token lộ trong mã nguồn** — chỉ dùng bot rác.

Deploy chung dự án với bản đồ thì để đường dẫn tương đối như trên. Tách domain thì điền
URL tuyệt đối của endpoint bên kia cho cả `endpoint` và `endpoint2`.

## Chống mất tín hiệu (blocker & tường lửa)

Máy người chơi có thể cài chặn quảng cáo hoặc ngồi sau tường lửa công ty, khi đó
`fetch`/`sendBeacon` tới đường dẫn kiểu `/api/ping` hay bị nuốt im lặng. Gói này đi
**bốn tầng**, tầng sau đỡ tầng trước:

| Tầng | Cách gửi | Ghi chú |
|---|---|---|
| 1 | `navigator.sendBeacon` → `/api/note` | Nhanh nhất, sống sót cả khi đang rời trang |
| 2 | `fetch` POST JSON → `/api/note` | Dùng khi beacon không có |
| 3 | Ảnh 1×1 GET → `/api/ping` | Đổi cả **phương thức** lẫn **đường dẫn** để né bộ lọc |
| 4 | **Gửi biểu mẫu** — `<form method="POST">` bắn vào iframe ẩn → `/api/ping` | Trình duyệt coi là điều hướng, không phải request đo đạc, nên gần như không bị chặn |

Tầng 4 chính là đường "gửi qua form rồi từ đó ping về Telegram": form POST vẫn vào đúng
`/api/ping`, và endpoint đó đã sẵn logic bắn sang Telegram — không cần dịch vụ trung gian
nào khác.

**Mốc quan trọng đi song song hai kênh.** Các sự kiện đáng tiền — `gui_form`,
`mo_khoa_m2_cua`, `mo_khoa_m2`, `giai_m3`, `skip_m3`, `gia_han_m2`, `test_unlock`,
`reset_msn`, `vao_ban_do` — được bắn **cả kênh thường lẫn kênh biểu mẫu**. Thà nhận trùng
một tin còn hơn mất dấu một mốc. Tin về Telegram có gắn nhãn nguồn `[bieu-mau]` để phân
biệt; tắt bằng `TRACK.duplex = false`.

`/api/note.js` chỉ là `module.exports = require('./ping.js')` — cùng một xử lý, khác mỗi
đường dẫn. **Thiếu file này thì tầng 1 và 2 sẽ 404**, tín hiệu vẫn về nhờ tầng 3–4 nhưng
chậm hơn.

## Sự kiện gửi về

**Điều hướng & biểu mẫu:** `ho_so_mo` · `trang_ho_so` (số trang + tiêu đề, một lần mỗi
trang) · `nhay_phan1` (bấm nút Bản đồ khoá) · `gui_form` · `ho_so_dong` (số trang đã xem
+ số giây ở lại) · `ve_trang_bia`.

**Hệ Mission:** `bam_dong_countdown` · `nhay_ban_do_xong` · `mo_khoa_m2_cua` · `sai_pin`
· `khoa_pin` · `mo_khoa_m2` · `gia_han_m2` · `giai_m3` · `skip_m3` · `sos_hint` ·
`test_unlock` · `vao_ban_do` · `bam_ban_do_khoa` · `reset_msn`.

**Hai pha & pí danh:** `mo_pha_map` · `luu_profile` · `doi_profile` · `xoa_profile` ·
`an_danh` · `khoi_phuc_profile` · `luu_tien_trinh`.

## Hệ 3 Mission trên trang bìa

Trang bìa có dòng trạng thái dưới chip (đếm ngược `04D 23H 59M 59S`, cập nhật từng giây),
**timeline tiến độ** có **icon máy bay chạy theo mức chinh phục** kèm độ khó từng nấc
(Noob · Easy Cheesy · Hit the rock), và hộp mã truy cập dùng chung.

Đồng hồ là **cửa sổ làm bài** chứ không phải thời gian chờ: xong Mission 1 là Mission 2
mở ngay và có 5 ngày để giải; giải xong Mission 2 thì Mission 3 mở với 5 ngày tiếp theo.
Hết giờ vẫn chơi tiếp được — hộp chỉ mời *"liên hệ Hội đồng MeowMeow để nhận chi viện"*,
còn cách chi viện thật là nút chìm ở góc dưới phải (10 nhịp): M2 nạp lại 5 ngày, M3 mở
khoá luôn.

Vài luật đáng nhớ:

- Mọi mật khẩu gọi thống nhất là **mã truy cập**; tên Mission luôn đứng trước trong nhãn hộp.
- **Lượt nhập dùng chung** cả hai cửa: 3 lượt/phiên, 12 lượt/ngày. Hết lượt thì hộp vẫn
  mở để đọc gợi ý, kèm đồng hồ đếm ngược sống.
- **Gợi ý Mission 3** tự mở sau mỗi 30 phút, không cần nhập sai thêm; SOS 10 nhịp thì mở
  luôn. Mỗi gợi ý kèm một câu bình luận riêng của Hội đồng.
- **Nấc đã xong bấm một cái là xem lại bảng ghi công** — bấm nút tròn trên timeline hoặc
  bấm thẳng vào chữ `✓ M1` / `✓ M2` / `✓ M3` trên dòng Mission.
- **Xong Mission 2 thì Form chốt sổ** — chỉ lật trang xem lại, không sửa được nữa (chỉ áp
  dụng với người đã thực sự gửi form).
- **Cửa test**: tap 10 nhịp vào nút tròn của mission chưa xong để không bao giờ bị kẹt.
- **Phá đảo Mission 3 là cửa mở pí danh** — xem mục dưới.

**Toàn bộ luật chi tiết nằm ở [`MISSIONS.md`](MISSIONS.md)** — mã, gợi ý, mốc thời gian,
lượt nhập, sự kiện đo đạc, khoá lưu trữ và hằng cấu hình.

## Hai pha & pí danh (chỉ khi deploy chung với bản đồ)

Hồ sơ này là **nhà** của người chơi cho tới khi phá đảo Mission 3:

| | Trước khi xong M3 | Sau khi xong M3 |
|---|---|---|
| Gõ thẳng `/` (bản đồ) | Bị đẩy về `/dad/950901-a` | Vào bản đồ bình thường |
| Nút **Bản đồ** góc dưới trái | Khoá (luật ở MISSIONS.md §5) | Sáng amber, bấm là sang bản đồ |
| Pí danh | Chưa mở | Ô thứ hai của dòng Mission |

**Phá đảo Mission 3 mở hai thứ cùng lúc:** cờ `nav1.mapUnlocked` (bản đồ thành trang
chính từ đó) và **pí danh**. Lưu pí danh xong, người chơi chọn *Mở khoá Bản đồ ✈* để đi
luôn, hoặc tắt box rồi về trang bìa xem lại — kiểu nào cũng đã lưu xong.

**Đích của nút Bản đồ phải cùng origin.** Deploy chung repo thì `MAPURL` tự là `'/'`;
chỉ khi deploy tách domain mới dùng địa chỉ tuyệt đối. Nhảy sang domain khác là mất
`localStorage`, kéo theo mất cả pí danh lẫn cờ hai pha.

### Pí danh

- Hộp `MISSION 3 · KHAI DANH` hiện ngay sau khi phá đảo — **trước** bảng "Mở khoá Bản
  đồ ✈ / Chơi lại", để không ai phá đảo xong mà chẳng lưu được gì. Chỉ bỏ qua khi người
  chơi **đang đứng sẵn ở một pí danh** (lúc đó đã checkpoint tự động) hoặc đã đủ 2 cái. Luật: **tối đa 6 ký tự**, chữ
  thường / số / ký tự đặc biệt, **không viết hoa** (gõ hoa bị hạ thường ngay khi gõ).
- Xong M3 thì dòng Mission đổi hình: **`✓ M3` đẩy lên chỗ `✓ M2`, ô thứ hai thành bảng
  xổ pí danh**. Ba trạng thái: `＋ Lưu pí danh` (chưa có) · `pdb ▾` (đang dùng) ·
  `Ẩn danh ▾` (đã thoát hồ sơ).
- **Tối đa 2 pí danh**, mỗi cái giữ đúng một bản lưu. Bảng xổ cho đổi hồ sơ (tap), quay
  về bản lưu (tap chính hồ sơ đang dùng), xoá (✕ hai nhịp), tạo mới, và chơi ẩn danh.
- **Bản đồ không tự ghi hồ sơ.** Đang chơi bản đồ mà muốn lưu thì **quay về trang bìa
  này** — về tới là chốt, nhưng chỉ ghi khi tiến độ **tiến lên**. Muốn ghi đè thật (vd
  vừa reset bản đồ) thì bấm lệnh **⟱ Lưu tiến trình** trong bảng xổ.
- Mốc bản lưu kể cả hai game: `M1` · `M2` · `M3 ✓` · `TAC 1/4…4/4` · `EGG ✦`.
- Pí danh **sống sót qua mọi lần reset** của cả hai game. Chỉ mất khi người chơi tự xoá
  dữ liệu trang.

## Tối ưu xuất thiệp

`html2canvas` bản gốc luôn vẽ `scale: 2`; thiệp `#printcard` rộng 600px nhưng rất cao nên
canvas phình lên hàng triệu điểm ảnh, và `toDataURL('image/png')` mới là khúc nghẽn thật
sự. Khối bổ sung bọc `window.html2canvas` lại và chặn theo **tổng điểm ảnh** (trần ~4,2
triệu) — mắt thường không thấy khác, nhưng nhanh hơn nhiều lần trên máy yếu.

## Nguyên tắc sửa file

Toàn bộ phần bổ sung nằm trong **một vùng duy nhất** ngay trước thẻ Vercel Analytics, mở
đầu bằng `<!-- ↓ Bổ sung: đo đạc + luật điều hướng -->`. Phần còn lại của `index.html`
giống **từng byte** với bản gốc. Muốn quay về bản gốc chỉ cần xoá vùng đó.

**Đụng tới pí danh thì nhớ:** mọi lần đọc/ghi đi qua đúng một cặp `navRead()`/`navWrite()`
(có sẵn bước di trú v1 → v2), và `mocNow()` là chỗ duy nhất dựng nhãn mốc. Thêm trường
mới phải thêm ở cả bản chép bên `index.html` của bản đồ — hai bên dùng chung khoá `nav1`
nên lệch schema là vỡ bản lưu.
