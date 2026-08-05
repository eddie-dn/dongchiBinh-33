# XG-950109-A · Hồ sơ Phi đoàn (bản deploy độc lập)

Gói này chạy được một mình, không cần trang bản đồ.

```
/
├── index.html      ← hồ sơ (deck 5 trang, mọi ảnh và thư viện đã nhúng sẵn)
├── vercel.json
└── api/
    └── ping.js     ← endpoint nhận tín hiệu, bắn về Telegram/Discord
```

## Deploy

1. Đẩy nguyên thư mục này lên một repo GitHub — `index.html` phải nằm ở **gốc repo**.
2. Vercel → Add New Project → Import repo → Framework **Other**, Build Command và Output
   Directory **để trống** → Deploy.
3. Settings → Environment Variables: `NOTIFY_KIND=telegram`, `TG_TOKEN`, `TG_CHAT`.
4. **Redeploy** — biến môi trường chỉ ăn từ lần deploy sau.

## Cấu hình đo đạc

Đầu khối script chèn thêm (cuối file):

```js
var TRACK = { mode:'endpoint', endpoint:'/api/ping', tgToken:'', tgChat:'' };
```

- `endpoint` (mặc định): first-party, ba tầng dự phòng `sendBeacon` → `fetch` → ảnh 1×1,
  token giấu trong biến môi trường. **Khuyên dùng.**
- `telegram`: không cần server, nhưng **token lộ trong mã nguồn** — chỉ dùng bot rác.

Deploy chung dự án với bản đồ thì để `'/api/ping'`. Tách domain thì điền URL tuyệt đối
của endpoint bên kia.

## Sự kiện gửi về

`ho_so_mo` · `trang_ho_so` (số trang + tiêu đề, một lần mỗi trang) · `nhay_phan1`
(bấm nút Bản đồ khoá) · `gui_form` (bấm Gửi về căn cứ) · `ho_so_dong` (số trang đã xem
+ số giây ở lại).

Thêm từ bản Mission: `bam_dong_countdown` (bấm dòng Mission, kèm nấc hiện tại + số ngày
còn lại) · `nhay_ban_do_xong` (phân biệt "bấm tiếp vào bản đồ" với "bỏ đi" sau khi nút
nháy) · `sai_pin` · `khoa_pin` (khoá 30 phút) · `mo_khoa_m2` · `giai_m3` · `skip_m3` ·
`vao_ban_do` · `reset_msn`.

## Dòng Mission trên trang bìa

Trang bìa có hệ 3 Mission: dòng trạng thái dưới chip (đếm ngược ghi rõ
`04D 23H 59M 59S`, cập nhật từng giây), **timeline tiến độ** chạy theo mức chinh phục
kèm độ khó từng nấc (Noob · Easy Cheesy · Hit the rock) và **icon máy bay bay theo tiến
độ**, hộp PIN dùng chung với **pool lượt nhập chung 3 lượt/phiên · 12 lượt/ngày** (khoá
30 phút khi hết lượt phiên, khoá tới nửa đêm khi hết lượt ngày), và cửa test
**tap 10 nhịp** vào nút tròn trên timeline để mở khoá mission không phải chờ đúng ngày.

**Toàn bộ luật chi tiết nằm ở [`MISSIONS.md`](MISSIONS.md)** — PIN, gợi ý, mốc thời
gian (M2 mở sau 5 ngày, M3 đếm 3 ngày), luật lượt nhập, sự kiện đo đạc, khoá lưu trữ và hằng cấu hình.

## Nguyên tắc sửa file

Toàn bộ phần bổ sung nằm trong **một khối duy nhất** ngay trước thẻ Vercel Analytics,
mở đầu bằng `<!-- ↓ Bổ sung: đo đạc + luật điều hướng -->`. Phần còn lại của file giống
**từng byte** với bản gốc. Muốn quay về bản gốc chỉ cần xoá khối đó.
