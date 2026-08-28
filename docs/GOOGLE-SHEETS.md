# Sổ lưu Google Sheets — 10 phút, làm một lần rồi quên

> **Giải quyết việc gì.** Vercel gói Hobby chỉ giữ log khoảng **một tiếng**.
> Nghĩa là sáng mai mở lên thì không còn cách nào biết tối qua ai chơi tới đâu,
> hay Open World bị hỏng câu nào. Sổ này chép mọi thứ sang một Google Sheet của
> riêng mình — sống mãi, xem trên điện thoại được, lọc và vẽ biểu đồ được.
>
> **Không cần Google Cloud, không cần thẻ, không tốn tiền, không phải bảo trì.**
> Apps Script chạy trong tài khoản Google bình thường. Hạn mức miễn phí 20.000
> lượt gọi/ngày — trang này cả đời không chạm tới.

---

## Làm theo đúng 6 bước

### 1 · Tạo Sheet
Vào [sheets.new](https://sheets.new). Đặt tên gì cũng được, ví dụ
`Bản đồ mật thư — sổ lưu`. **Không phải tạo cột hay tab nào cả**, mã tự tạo.

### 2 · Mở Apps Script
Trong Sheet: **Tiện ích mở rộng → Apps Script** (Extensions → Apps Script).
Một tab mới mở ra với file `Code.gs` có sẵn vài dòng mẫu.

### 3 · Dán mã
Xoá sạch nội dung `Code.gs` mẫu, dán **toàn bộ** file
`docs/apps-script/Code.gs` (trong chính bộ mã này) vào.

Sửa đúng **một dòng** — dòng mã bảo vệ ở gần đầu file:

```js
var MA_BAO_VE = 'doi-chuoi-nay-di';
```

Đổi thành một chuỗi của riêng mình, gõ bừa cũng được miễn dài và khó đoán,
ví dụ `so-luu-honghan-2026-xyz`. **Ghi lại chuỗi này**, bước 5 phải dùng.

Bấm biểu tượng đĩa mềm để lưu.

### 4 · Deploy
**Deploy → New deployment**. Bấm bánh răng cạnh chữ "Select type" → chọn
**Web app**. Rồi khai:

| Ô | Chọn |
|---|---|
| Description | gì cũng được, ví dụ `so luu v1` |
| **Execute as** | **Me** (chính mình) |
| **Who has access** | **Anyone** |

> **"Anyone" nghe đáng sợ nhưng bắt buộc**, vì Vercel gọi vào bằng máy chủ chứ
> không đăng nhập Google được. Chỗ chặn người lạ là **mã bảo vệ** ở bước 3:
> không có mã đúng thì gói bị vứt ngay, không ghi dòng nào.

Bấm **Deploy**. Google hỏi cấp quyền → **Authorize access** → chọn tài khoản →
gặp màn "Google hasn't verified this app" thì bấm **Advanced** → **Go to …
(unsafe)** → **Allow**. (Đây là mã do chính mình vừa dán vào, nên "unverified"
là chuyện đương nhiên.)

Xong sẽ hiện một địa chỉ dạng:

```
https://script.google.com/macros/s/AKfycb............/exec
```

**Chép địa chỉ đó.**

### 5 · Ghép mã bảo vệ vào địa chỉ

Nối `?k=` cộng chuỗi ở bước 3 vào cuối:

```
https://script.google.com/macros/s/AKfycb............/exec?k=so-luu-honghan-2026-xyz
```

### 6 · Khai hai biến trên Vercel

Vercel → dự án → **Settings → Environment Variables** → thêm **hai** biến,
**cùng dán một địa chỉ đầy đủ ở bước 5**:

| Tên biến | Ghi gì | Ghi lại việc gì |
|---|---|---|
| `SHEET_URL` | địa chỉ bước 5 | mọi tín hiệu tiến độ → tab **Tiến độ** |
| `CHAT_LOG_URL` | địa chỉ bước 5 | mọi lượt hỏi Open World → tab **Chat** |

Rồi **Deployments → … → Redeploy**. Biến môi trường chỉ có hiệu lực từ lần
deploy sau, sửa xong mà không redeploy thì vẫn chạy bản cũ.

**Xong.** Vào chơi thử một vòng rồi mở Sheet ra xem — hai tab tự hiện.

---

## ⚠ ĐÃ CÓ MÃ CŨ RỒI THÌ PHẢI DÁN LẠI (đợt 29)

Đợt 29 thêm **tab `Pí danh`** và cho `doGet` biết tra cứu. Ai đã dựng sổ từ
trước thì **mã trong Apps Script vẫn là bản cũ** — dán lại thì mới có:

1. Mở Apps Script của sổ → chọn hết mã cũ → dán đè bản mới trong
   `docs/apps-script/Code.gs`
2. Ctrl+S
3. **Deploy → Manage deployments → bút chì → Version: New version → Deploy**

Bước 3 là bước hay quên nhất: địa chỉ `/exec` phục vụ **bản đã deploy**, không
phải mã đang mở trong trình soạn. Chỉ Ctrl+S mà không tạo version mới thì mọi
thứ vẫn chạy bản cũ — im lặng, không báo gì.

Không dán lại cũng **không hỏng gì**: trang vẫn chơi được y như cũ, chỉ là pí
danh không đi theo người sang máy khác.

**Không phải khai thêm biến nào.** Đường pí danh dùng chung `SHEET_URL` sẵn có.

---

## Ba tab ghi gì

### Tab `Tiến độ` — do `/api/ping` gửi

| Cột | Nghĩa |
|---|---|
| `at` | thời điểm (ISO) |
| `ev` | mã sự kiện, ví dụ `g2_giai_dung` |
| `nhan` | tên tiếng Việt của sự kiện. **Trống = chưa khai nhãn** trong bảng `NHAN` của `api/ping.js` — sự kiện đó sẽ không bao giờ báo về Telegram, sổ này là chỗ duy nhất phát hiện ra |
| `detail` | chi tiết kèm theo |
| `solved` / `so_giai` | đã giải được mấy toạ độ — **chỉ đúng với bản đồ**, năm trang kia để trống |
| `trang` | trang nào gửi: `ban-do` · `dad-a` · `dad-b` · `han-a` · `han-b` · `phao-hoa`. Trang cũ chưa tự khai thì điền bằng chỗ `doanTrang()` đoán ra từ tiền tố tên sự kiện |
| `noi` | đang mở hộp nào trong trang đó, ví dụ `Ô mã · DAD-950901-A`, `Khu Open World` |
| `tt` | một dòng trạng thái thật của người chơi trên trang đó, ví dụ `Mission: M1 ✓ · M2 — · M3 —` |
| `kenh` | `js` (đường chính) · `anh` · `bieu-mau` — hai cái sau là đường vòng, dùng khi máy người chơi chặn `fetch`. Chuông báo cũng in dấu này ở cuối dòng đầu |
| `may` | chuỗi trình duyệt |

> **⚠ MÁY CHỦ GỬI THÔI CHƯA ĐỦ — `COT` TRONG `Code.gs` PHẢI CÓ TÊN CỘT.**
> `doPost` chỉ đọc đúng mấy tên khai trong `COT`; trường lạ bị **bỏ im lặng**,
> không lỗi, không cảnh báo. Ba cột này đã được gửi từ đợt 18 nhưng bảng cột
> thiếu tên, nên suốt quãng đó chúng rơi thẳng vào hư không. Sheet đang chạy
> rồi thì **dán lại `Code.gs` mới và Deploy lại**.

Ba cột `trang` / `noi` / `tt` thêm từ đợt 18, vào bảng cột từ đợt 21. Trước đó mọi dòng của cả sáu trang
đều mang chung một tiêu đề và chung một con số tiến độ của bản đồ — xem luật ở
`DESIGN-SYSTEM.md` mục 9. Sheet cũ vẫn chạy được: cột mới nối vào cuối, dòng cũ
để trống ở đó.

Sổ này ghi **đủ mọi tín hiệu**, kể cả sự kiện chưa có nhãn và mấy nhịp bị chặn
vì trùng. Cố ý vậy: **Sheets là sổ lưu, Telegram là chuông báo.** Sổ thì phải
đủ, chuông thì phải lọc cho đỡ ồn.

### Xem thử một lượt chơi ghi ra sổ trông như thế nào

```bash
node docs/mau-so.mjs          # giấu bớt cột trống cho dễ đọc
node docs/mau-so.mjs --rong   # in đủ mọi cột
```

Nó giả lập một lượt chơi trọn vẹn — vào hồ sơ, ba Mission, bốn toạ độ, Gate 2,
Open World, gửi lời nhắn, màn pháo hoa — rồi in ra **cả ba tab** đúng như sẽ
hiện trên Google Sheets.

> **Không phải dữ liệu bịa.** Nó chạy đúng mã thật của cả hai chặng: thao tác
> đi qua `api/ping.js` · `api/thu.js` · `api/chat.js`, rồi gói mấy hàm đó gửi
> đi lại đi tiếp qua chính `doPost()` + `layTab()` của `Code.gs`, ghi vào một
> Sheet giả dựng bằng JavaScript. Nên sửa `COT` hay sửa `chepVeSheet` mà chạy
> lại cái này là **thấy ngay khác chỗ nào** — nhanh hơn deploy rồi ngồi chờ
> người chơi thật.

`test/bo/so21.mjs` chạy chính nó rồi soi kết quả, nên mẫu này hỏng là báo đỏ.

### Trên Google có phải làm gì không

**Không.** Tạo đúng **một** file Sheet trống ở bước 1, hết. Từ đó trở đi:

| Việc | Ai làm |
|---|---|
| Tạo tab `Tiến độ` · `Chat` · `Thư` | **mã tự tạo** lúc có dòng đầu tiên |
| Gõ dòng tiêu đề cột | **mã tự ghi**, in đậm, khoá dòng 1 |
| Thêm cột mới vào tab **đã có sẵn** | **mã tự viết nốt** mấy ô tiêu đề còn thiếu |

Việc duy nhất phải làm tay là **dán lại `Code.gs` rồi Deploy lại** mỗi khi file
đó đổi. Sheet thì không phải đụng vào.

> **⚠ VẾ THỨ BA MỚI LÀ VẾ HAY QUÊN.** `layTab` đời trước chỉ ghi tiêu đề lúc
> **tạo mới** tab. Sheet đang chạy từ trước cứ giữ nguyên dòng tiêu đề cũ, nên
> thêm cột vào `COT` là dữ liệu mới rơi xuống mấy ô **không có tên** ở bên
> phải — đọc sheet thấy ba cột trắng trơn, không biết là cột gì. Nay tab có
> sẵn mà thiếu cột thì mã viết nốt, và **chỉ nối thêm**, không đụng ô đã có.

> **⚠ CỘT MỚI LUÔN NỐI VÀO CUỐI `COT`, ĐỪNG CHÈN VÀO GIỮA.** Sheet đang chạy
> giữ nguyên thứ tự cột cũ; chèn vào giữa là dòng mới ghi theo thứ tự mới còn
> tiêu đề thì theo thứ tự cũ — cả bảng lệch mà nhìn vẫn ra dữ liệu, không có gì
> báo. Đã vấp đúng lỗi này một lần; `test/bo/so21.mjs` nay canh chỗ đó.

### Tab `Thư` — do `/api/thu` gửi

| Cột | Nghĩa |
|---|---|
| `at` | thời điểm gửi (ISO) |
| `tu` | người gửi tự khai |
| `loi` | **nguyên văn lời nhắn** |
| `da_gui` | `roi` · `chua` (chưa khai biến môi trường email/Telegram) · `qua-tran` |
| `may` | chuỗi trình duyệt |

Trước đợt 21 lời nhắn **chỉ** đi email + Telegram, không vào sổ — muốn đọc lại
một lời nhắn cũ thì phải đi lục hòm thư, mà chuông Telegram thì trôi mất theo
dòng. Nay chép cả khi **quá trần chống spam**: sổ là chỗ LƯU nên phải đủ, cái
cần lọc cho đỡ ồn là chuông báo.

### Tab `Pí danh` — do `/api/pidanh` gửi

Tab này **khác hẳn ba tab kia**. Ba tab kia chỉ ghi thêm, mỗi lượt một dòng.
Tab này là một **cuốn danh bạ**: mỗi pí danh đúng **một dòng**, lưu lại thì ghi
đè chính dòng đó.

| Cột | Là gì |
|---|---|
| `ten` | pí danh, đã hạ chữ thường và cắt khoảng trắng — đây là **khoá tra** |
| `moc` | người chơi đang tới đâu (`M3 ✦`, `HAN ✦✦`…) |
| `goi` | cả bản chụp tiến độ, đóng thành một chuỗi JSON |
| `at` | lúc cất |
| `may` | máy nào cất |

**Vì sao cần:** trước đợt 29, pí danh chỉ nằm trong `localStorage` của đúng một
trình duyệt. Đổi từ điện thoại sang laptop là gõ lại tên cũ cũng chỉ ra một hồ
sơ trống trơn. Nay lúc khai một pí danh, trang hỏi cuốn danh bạ này trước; có
sẵn thì kéo bản lưu về.

**⚠ CÁI TÊN CHÍNH LÀ CHÌA KHOÁ.** Không có mật khẩu nào thêm — ai gõ trúng tên
là mở được tiến độ của người mang tên đó. Đây là lựa chọn **có cân nhắc** cho
một trò chơi riêng giữa hai người: bắt nhớ mật khẩu thì hỏng cả cái thú, mà
thứ bị lộ cũng chỉ là tiến độ chơi. Đừng bê cách này sang chỗ có dữ liệu thật.

**⚠ Cửa tra CÓ kiểm mã bảo vệ.** `doGet` đời trước trả lời cho bất cứ ai; nay
nó đọc được bản lưu nên bắt buộc phải kèm `?k=`, y như `doPost`.

Hỏng hay chậm quá 6 giây thì trang tự bỏ qua và chơi kiểu cũ — đường này là
tiện thêm, không phải xương sống.

### Tab `Chat` — do `/api/chat` gửi

| Cột | Nghĩa |
|---|---|
| `luc` | thời điểm |
| `ok` | `true` = trả lời được, `false` = hỏng |
| `ly_do` | hỏng vì gì: `gemini_hong` · `rong_dap` · `mang_hong` |
| `model` | model đã gọi |
| `ms` | mất bao nhiêu mili giây |
| `hoi_dai` / `dap_dai` | độ dài câu hỏi / câu trả lời (ký tự) |
| `luot_su` | trong lượt đó đã có mấy lượt hỏi trước |
| `token_vao` / `token_ra` / `token_nghi` | số token vào · ra · dành cho bước suy nghĩ |
| `block` | Gemini chặn thì ghi lý do vào đây |
| `hoi` / `dap` | **mặc định TRỐNG** — xem mục dưới |

### Nội dung chat: mặc định KHÔNG ghi

Hai cột `hoi` / `dap` để trống trừ khi khai thêm biến `CHAT_LOG_NOI_DUNG=1`
trên Vercel. Cố ý bắt khai riêng một biến nữa để không ai bật nhầm — đoạn chat
Open World là chuyện riêng của hai người.

Không bật thì vẫn đủ để dò lỗi: `ok`, `ly_do`, `ms`, `token_*` cho biết Gemini
hỏng ở đâu mà không cần đọc ai nói gì.

---

## Telegram kêu mà Sheet trống trơn — soi theo thứ tự này

Mở địa chỉ này trên trình duyệt:

```
https://<tên-miền>/api/ping?soi_so=1
```

Nó gọi thật sang Apps Script rồi trả về đúng thứ Google đáp lại, kèm một câu
chỉ chỗ tắc. **Không lộ địa chỉ sổ ra ngoài** — chỉ nói có khai chưa, có kèm mã
bảo vệ chưa, Google trả mã gì.

| Trả về | Nghĩa là | Sửa ở đâu |
|---|---|---|
| `buoc: "SHEET_URL"` | Vercel chưa thấy biến | Khai `SHEET_URL`, rồi **Redeploy** — khai xong không deploy lại thì bản đang chạy vẫn không có biến |
| `co_ma_bao_ve: false` | Địa chỉ thiếu `?k=…` | Bước 5 ở trên |
| `google_tra_ve` chứa `sai ma` | Mã trong địa chỉ khác `MA_BAO_VE` trong `Code.gs` | Sửa cho khớp, rồi **Deploy lại Apps Script** |
| `trang_thai: 401` / `403`, `google_tra_ve` bắt đầu bằng `<!DOCTYPE html` | Apps Script đòi đăng nhập — `Code.gs` chưa hề chạy | **Who has access = Anyone**, và dùng địa chỉ đuôi `/exec` chứ không phải `/dev` — xem mục ngay dưới bảng |
| `ok: true` | Chạy được | Mở Sheet, tab `Tiến độ` có dòng `tu_soi` |

Ngoài ra **tab Logs của Vercel** nay có một dòng `[SHEET]` cho mỗi lần chép —
kèm mã trạng thái và câu Google đáp. Trước đây chỗ này nuốt sạch mọi lỗi, nên
mọi nguyên nhân đều ra cùng một hiện tượng "Telegram kêu mà sổ trống" mà không
có nửa dòng manh mối.

### Dòng `[SHEET] 401 <!DOCTYPE html…>` — bệnh hay gặp nhất

Nếu trong Logs thấy dòng này lặp lại sau mỗi lượt chơi:

```
[SHEET] 401 <!DOCTYPE html><html lang="en">…window['ppConfig'] = …
```

thì đó **không phải** Code.gs chạy sai. Đó là **trang đăng nhập của Google**:
Apps Script chặn ngay ở cửa và đòi tài khoản, nên **không hàm nào trong
`Code.gs` được gọi tới cả**. Sửa `Code.gs` rồi deploy lại bao nhiêu lần cũng
không đổi gì — mã chưa bao giờ chạy.

Chỉ có **hai** nguyên nhân ra đúng cảnh này, và cả hai đều nằm ở chỗ deploy:

1. Bản deploy để **Who has access = Only myself** → sửa thành **Anyone**
   (Deploy → Manage deployments → bút chì → Who has access).
2. `SHEET_URL` đang dùng địa chỉ đuôi **`/dev`** → đuôi đó vĩnh viễn đòi đăng
   nhập, chỉ đuôi **`/exec`** mới gọi được từ ngoài. Sửa biến bên Vercel rồi
   **Redeploy**.

Kiểm nhanh: dán chính chuỗi trong `SHEET_URL` vào trình duyệt ở **cửa sổ ẩn
danh**. Ra JSON `"So luu dang chay"` là đúng; hiện màn hình đăng nhập Google
là trúng một trong hai nguyên nhân trên.

> **⚠ HAI CÁI HAY QUÊN NHẤT, cả hai đều im re:**
> · khai biến bên Vercel xong **không Redeploy** — bản đang chạy vẫn chưa có biến;
> · sửa `Code.gs` xong **không Deploy lại** Apps Script — Google vẫn chạy bản cũ.

## Mấy chỗ hay vấp

| Hiện tượng | Vì sao | Sửa |
|---|---|---|
| Sheet không có dòng nào | quên **Redeploy** sau khi thêm biến | Vercel → Deployments → … → Redeploy |
| Vẫn không có dòng nào | mã bảo vệ trong `Code.gs` khác chuỗi `?k=` trên Vercel | so lại từng ký tự, chú ý dấu cách thừa lúc chép |
| Vẫn không có | deploy để **"Only myself"** | Deploy → Manage deployments → sửa thành **Anyone** |
| Sửa `Code.gs` xong không thấy đổi gì | Apps Script giữ **bản đã deploy**, không chạy bản đang sửa | Deploy → Manage deployments → bút chì → Version: **New version** → Deploy |
| Mở địa chỉ `/exec` bằng trình duyệt thấy JSON `"So luu dang chay"` | đúng rồi, deploy chuẩn | — |
| Đổi mã bảo vệ | phải sửa **cả hai chỗ**: `Code.gs` và hai biến trên Vercel | sửa xong redeploy cả hai bên |

## Thêm cột về sau

Mở `Code.gs`, thêm tên trường vào mảng `COT` của tab tương ứng, deploy lại
**New version**. Gói JSON thiếu trường đó thì ô để trống, không hỏng gì.

**Đừng đổi thứ tự cột cũ** — mấy dòng đã ghi rồi không tự sắp xếp lại theo.

## Muốn tắt

Xoá biến `SHEET_URL` / `CHAT_LOG_URL` trên Vercel rồi redeploy. Mã trong
`api/*.js` thấy biến trống là bỏ qua, không gọi đi đâu cả. Sheet cũ vẫn còn
nguyên dữ liệu.
