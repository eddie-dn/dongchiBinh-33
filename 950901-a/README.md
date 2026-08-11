# XG-950901-A · Hồ sơ Phi đoàn (bản deploy độc lập)

Gói này chạy được một mình, không cần trang bản đồ.

```
/
├── index.html      ← hồ sơ (deck 5 trang, mọi ảnh và thư viện đã nhúng sẵn)
├── vercel.json
├── MISSIONS.md     ← luật chơi đầy đủ của hệ 3 Mission
└── api/
    ├── ping.js     ← endpoint nhận tín hiệu, bắn về Telegram/Discord
    └── note.js     ← bí danh của ping.js (bắt buộc có — xem "Chống mất tín hiệu")
```

## Deploy

1. Đẩy nguyên thư mục này lên một repo GitHub — `index.html` phải nằm ở **gốc repo**,
   và thư mục `api/` phải có **đủ hai file** `ping.js` và `note.js`.
2. Vercel → Add New Project → Import repo → Framework **Other**, Build Command và Output
   Directory **để trống** → Deploy.
3. Settings → Environment Variables: `NOTIFY_KIND=telegram`, `TG_TOKEN`, `TG_CHAT`.
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

**Toàn bộ luật chi tiết nằm ở [`MISSIONS.md`](MISSIONS.md)** — mã, gợi ý, mốc thời gian,
lượt nhập, sự kiện đo đạc, khoá lưu trữ và hằng cấu hình.

## Tối ưu xuất thiệp

`html2canvas` bản gốc luôn vẽ `scale: 2`; thiệp `#printcard` rộng 600px nhưng rất cao nên
canvas phình lên hàng triệu điểm ảnh, và `toDataURL('image/png')` mới là khúc nghẽn thật
sự. Khối bổ sung bọc `window.html2canvas` lại và chặn theo **tổng điểm ảnh** (trần ~4,2
triệu) — mắt thường không thấy khác, nhưng nhanh hơn nhiều lần trên máy yếu.

## Nguyên tắc sửa file

Toàn bộ phần bổ sung nằm trong **một vùng duy nhất** ngay trước thẻ Vercel Analytics, mở
đầu bằng `<!-- ↓ Bổ sung: đo đạc + luật điều hướng -->`. Phần còn lại của `index.html`
giống **từng byte** với bản gốc. Muốn quay về bản gốc chỉ cần xoá vùng đó.
