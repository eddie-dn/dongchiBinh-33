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

## Nguyên tắc sửa file

Toàn bộ phần bổ sung nằm trong **một khối duy nhất** ngay trước thẻ Vercel Analytics,
mở đầu bằng `<!-- ↓ Bổ sung: đo đạc + luật điều hướng -->`. Phần còn lại của file giống
**từng byte** với bản gốc. Muốn quay về bản gốc chỉ cần xoá khối đó.
