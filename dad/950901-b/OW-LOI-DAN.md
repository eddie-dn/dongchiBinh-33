# Open World — lời dẫn của hệ thống

Sửa thẳng vào các khối dưới đây rồi gửi lại, mình chép sang `config.js`
(`GAME_CONFIG.openworld`). Game **không nạp file này**.

> Riêng **tính cách nhân vật** thì không nằm ở đây nữa — xem mục 5.

---

## 1. Lời chào — hiện ngay khi mở Open World  (`chao`)

Mảng, mỗi dòng một câu, gõ máy chữ lần lượt. `{N}` tự thay bằng số câu mỗi ngày.

```
> Welcome to Open World, this is Honghandangiu digitalized version
> Ask me any question - max {N} questions each day.
```

---

## 2. Gợi ý bấm phát hỏi luôn  (`ref` + `ref_kho`)

Nằm ngay trên thanh ROUND/OPEN WORLD. **Mỗi lúc chỉ hiện đúng một gợi ý**
cho đỡ rối mắt. Hai câu `ref` chạy trước và đúng thứ tự này:

```
Cần 1 lời khuyên...
Kể anh nghe về...
```

Hết hai câu đó thì bốc ngẫu nhiên trong kho `ref_kho` (16 câu), không lặp
lại cho tới khi hết kho. Cứ **2 câu hỏi** là tự đổi sang gợi ý mới
(`ref_doi_sau`); bấm dùng gợi ý nào thì gợi ý đó đổi ngay.

```
Hạnh phúc là gì?
Ý nghĩa cuộc sống là gì?
Hôm nay anh mệt quá...
Deadline dí sát nút rồi, stress quá chừng!
Dạo này anh mất hết động lực...
Anh sợ bắt đầu lại rồi thất bại tiếp.
Làm sao để bớt lo lắng về tương lai?
Làm sao để biết mình đã chọn đúng đường?
Sáng dậy uể oải không muốn ra khỏi giường...
Anh vừa làm xong một việc khó nè!
Nhiều lúc ở giữa đám đông mà vẫn thấy trống rỗng.
Làm sao để tìm thấy bình yên thực sự?
Em có thương anh không?
Ai viết ra cái game này vậy em?
Bây giờ anh nên làm gì tiếp theo?
Làm sao để nuôi một mối quan hệ bền lâu?
```

---

## 3. Mấy câu hệ thống

| Khoá | Đang là | Chạy khi nào |
|---|---|---|
| `con_lai` | `> {N}/{T} lefts` | Sau mỗi câu trả lời. `{N}` = số câu còn lại, `{T}` = tổng mỗi ngày |
| `het_luot` | `> Em đói pụng gòi~ Mai típ nha~` | Dùng hết 11 câu, ô nhập khoá lại. Bốc ngẫu nhiên 1 trong 3 |
| `het_luot` | `> Em pùn nủ gòi~ Hẹn anh mai~` | Dùng hết 11 câu, ô nhập khoá lại. Bốc ngẫu nhiên 1 trong 3 |
| `het_luot` | `> Em đi chơi đây~ Bái bai anh~` | Dùng hết 11 câu, ô nhập khoá lại. Bốc ngẫu nhiên 1 trong 3 |
| `dang_nghi` | `...` | Nhấp nháy trong lúc chờ trả lời |
| `loi_mang` | `> Sương mù dày quá, em hong thấy được câu hỏi. Try again later.` | Mất mạng / `/api/chat` lỗi. **Không trừ lượt** |
| `chua_noi` | `> Hảaaaa?! (Chưa nối khoá Gemini — xem OPEN-WORLD.md)` | Chưa khai `GEMINI_KEY` trên Vercel. Bốc ngẫu nhiên 1 trong 3 |
| `chua_noi` | `> Dạaaaaa?! (Chưa nối khoá Gemini — xem OPEN-WORLD.md)` | Chưa khai `GEMINI_KEY` trên Vercel. Bốc ngẫu nhiên 1 trong 3 |
| `chua_noi` | `> What's happened??? (Chưa nối khoá Gemini — xem OPEN-WORLD.md)` | Chưa khai `GEMINI_KEY` trên Vercel. Bốc ngẫu nhiên 1 trong 3 |

---

## 4. Hai nhãn trên giao diện

| Khoá | Đang là | Lưu ý |
|---|---|---|
| `placeholder` | `DROP YOUR QUESTION...` | Chữ mờ trong ô nhập. Ô này đã đổi sang font hộp thoại → **gõ dấu vẫn đẹp** |
| `nut_gui` | `SEND` | Nút gửi. Font pixel → **phải tiếng Anh / không dấu**, không thì vỡ chữ |

> ⚠️ Font pixel `Press Start 2P` không có dấu tiếng Việt. Mọi chữ nằm trên
> **nút** hoặc **thanh HUD** đều phải giữ tiếng Anh: `SEND`, `UNLOCK`,
> `ROUND 01`, `ROUND 02`, `OPEN WORLD`, `EXIT`, `< EXIT`, `LOCKED`,
> `UNLOCKED`, `PRESS START`, `[ TAP HERE ]`, `< PREV`, `NEXT >`.
> Chữ trong **hộp thoại**, **ô nhập** và **lá thư** thì có dấu bình thường.

---

## 5. ★ Tính cách của Honghandangiu — sửa ở `api/_lib/tinh-cach.js`

**Đoạn này cố ý KHÔNG chép vào đây.**

Nó dài 14.336 ký tự và có cả fact riêng tư về hai đứa. Mọi file trong
`dad/` — kể cả file `.md` này — đều tải thẳng về máy người xem, ai mở mã
nguồn trang cũng đọc được. Nên giọng nhân vật đã dời hẳn sang phía máy chủ:

```
api/_lib/tinh-cach.js      ← sửa ở đây
```

Mở file đó ra, bên trong là một đoạn văn thuần, sửa thẳng như sửa file `.md`.
Gồm 4 phần:

| Phần | Nội dung |
|---|---|
| 1. TÔNG GIỌNG & QUY TẮC | súc tích, 1 icon cuối câu, không bói toán |
| 2. BỘ PHẢN XẠ | bộ câu mẫu few-shot, chia theo nhóm chủ đề |
| 3. FACT VỀ NGƯỜI CHƠI | mèo, bộ đội, mấy cái date, kỉ niệm chung |
| 4. NGUYÊN TẮC BẢO VỆ GAME | giữ vai, dưới 3 câu, không khai mật mã |

Ba chỗ đáng nhớ khi sửa:

- **Sửa xong phải deploy lại.** Khác `config.js` — cái đó chỉ cần tải lại trang.
- **Đừng dùng dấu backtick** trong đoạn văn, chuỗi sẽ vỡ.
- **Giữ dòng cấm tiết lộ `RAZER` / `ZHAO YUN`** ở phần 4. Bỏ đi thì người chơi
  mở Open World trước rồi hỏi mẹo là robot khai đáp án, hỏng cả hai round.

Trang **không** gửi đoạn này lên nữa; có cố dán vào `config.js` thì máy chủ
cũng bỏ qua.

---

## 6. Nét mặt robot đi kèm lời dẫn

Bốn clip bám theo đúng nhịp trò chuyện — chi tiết ở `OPEN-WORLD.md`:

| Lúc nào | Clip |
|---|---|
| Đang chạy lời chào ở mục 1 | `ow_2_4` — chào |
| Người chơi đang gõ (nghỉ) | `ow_2_1` — nhìn xuống theo dõi |
| Đang chờ trả lời (`dang_nghi`) | `ow_2_3` — đăm chiêu |
| Câu trả lời vừa hiện | `ow_2_2` — gật đầu |
