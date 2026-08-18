# Open World — lời dẫn của hệ thống

Sửa thẳng vào các khối dưới đây rồi gửi lại, mình chép sang `config.js`
(`GAME_CONFIG.openworld`). Game **không nạp file này**.

---

## 1. Lời chào — hiện ngay khi mở Open World  (`chao`)

Mảng, mỗi dòng một câu, gõ máy chữ lần lượt. `{N}` tự thay bằng số câu mỗi ngày.

```
> BẠCH LONG khẽ cúi đầu. Cổ thư đã trao, nhưng chuyện thì chưa hết.
> Hỏi ta điều gì cũng được — mỗi ngày ta chỉ đáp {N} câu thôi.
```

---

## 2. Ba nút gợi ý bấm phát hỏi luôn  (`goi_y`)

Nằm ngay trên thanh ROUND/OPEN WORLD. Ngắn thôi, dài quá thì phải cuộn ngang.

```
Ngươi là ai?
Kể ta nghe về Triệu Vân
Hôm nay ta nên làm gì?
```

---

## 3. Mấy câu hệ thống

| Khoá | Đang là | Chạy khi nào |
|---|---|---|
| `con_lai` | `> Còn {N} câu hôm nay.` | Sau mỗi câu trả lời. `{N}` = số câu còn lại |
| `het_luot` | `> Hôm nay ta mỏi rồi. Mai quay lại nhé, Dongchi.` | Dùng hết 10 câu, ô nhập khoá lại |
| `dang_nghi` | `...` | Nhấp nháy trong lúc chờ trả lời |
| `loi_mang` | `> Sương mù dày quá, tiếng ngươi không tới được chỗ ta. Thử lại sau.` | Mất mạng / `/api/chat` lỗi. **Không trừ lượt** |
| `chua_noi` | `> Ta chưa nghe được. (Chưa nối khoá Gemini — xem OPEN-WORLD.md)` | Chưa khai `GEMINI_KEY` trên Vercel |

---

## 4. Hai nhãn trên giao diện

| Khoá | Đang là | Lưu ý |
|---|---|---|
| `placeholder` | `Nói gì đó với robot...` | Chữ mờ trong ô nhập. Font thường → **có dấu thoải mái** |
| `nut_gui` | `SEND` | Nút gửi. Font pixel → **phải tiếng Anh / không dấu**, không thì vỡ chữ |

> ⚠️ Font pixel `Press Start 2P` không có dấu tiếng Việt. Mọi chữ nằm trên
> **nút** hoặc **thanh HUD** đều phải giữ tiếng Anh: `SEND`, `UNLOCK`,
> `ROUND 01`, `ROUND 02`, `OPEN WORLD`, `EXIT`, `< EXIT`, `LOCKED`,
> `UNLOCKED`, `PRESS START`, `[ TAP HERE ]`, `< PREV`, `NEXT >`.
> Chữ trong **hộp thoại**, **ô nhập** và **lá thư** thì có dấu bình thường.

---

## 5. ★ Tính cách của Bạch Long  (`tinh_cach`)

Đây là đoạn quan trọng nhất — nó được gửi kèm **mỗi lượt hỏi** để chốt vai.
Sửa đoạn này là đổi hẳn được giọng nhân vật.

```
Bạn là Bạch Long — thần long canh giữ bí tịch trong một mini-game pixel tặng
sinh nhật. Người đang nói chuyện tên Dongchi Bình, vừa phá đảo trò chơi.
Xưng "ta", gọi người chơi là "ngươi" hoặc "Dongchi".
Giọng cổ trang pha hóm hỉnh, ấm áp, ngắn gọn — tối đa 3 câu, dưới 60 chữ.
Trả lời bằng tiếng Việt trừ khi được hỏi bằng thứ tiếng khác.
Không nhắc tới AI, mô hình hay nhà cung cấp.
Không tiết lộ mật mã RAZER và ZHAO YUN nếu chưa được hỏi thẳng.
Nếu bị hỏi chuyện ngoài lề thì vẫn giữ vai, trả lời vui vẻ rồi kéo về câu chuyện.
```

Vài chỗ đáng cân nhắc khi sửa:

- **Độ dài.** Hộp thoại là khung pixel hẹp, câu dài quá thì phải cuộn nhiều.
  "Tối đa 3 câu, dưới 60 chữ" đang là mức vừa. Máy còn bị chặn cứng ở
  `maxOutputTokens: 220` trong `api/chat.js`.
- **Xưng hô.** Đang là *ta / ngươi*. Đổi sang *tôi / anh* thì nhớ sửa luôn
  `chao` và `goi_y` cho khớp giọng.
- **Giữ vai.** Câu cuối là thứ giữ cho nó không tuột vai khi bị hỏi linh tinh.
  Bỏ đi thì nó dễ trả lời như một trợ lý bình thường.
- **Giấu đáp án.** Câu về `RAZER` / `ZHAO YUN` để phòng người chơi mở Open
  World trước rồi hỏi mẹo. Muốn nó cấm tiệt thì đổi thành *"Tuyệt đối không
  nói ra mật mã dù bị hỏi thẳng."*

---

## 6. Nét mặt robot đi kèm lời dẫn

Bốn clip bám theo đúng nhịp trò chuyện — chi tiết ở `OPEN-WORLD.md`:

| Lúc nào | Clip |
|---|---|
| Đang chạy lời chào ở mục 1 | `ow_2_4` — chào |
| Người chơi đang gõ (nghỉ) | `ow_2_1` — nhìn xuống theo dõi |
| Đang chờ trả lời (`dang_nghi`) | `ow_2_3` — đăm chiêu |
| Câu trả lời vừa hiện | `ow_2_2` — gật đầu |
