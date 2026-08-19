# Thư & ảnh kỷ niệm — sửa ở đây rồi gửi lại

> ⚠️ **BẢN NHÁP ĐỂ SOẠN THẢO — MÃ NGUỒN KHÔNG ĐỌC FILE NÀY.**
> Nguồn thật là `dad/950901-b/config.js`. File này chỉ để gõ nội dung cho dễ
> rồi chép sang. Nghĩa là nó SẼ LỆCH dần với thứ đang chạy — sửa ở đây mà quên
> chép sang thì game vẫn y như cũ. Đã chép xong thì xoá file này đi cũng được,
> không ảnh hưởng gì tới trang.

File này để **bạn sửa nội dung**. Sửa xong gửi lại, mình chép sang `config.js`.
Game **không nạp file này**, nó chỉ đọc `config.js`.

---

## 1. Ảnh kỷ niệm — đặt tên file thế nào

Ảnh nằm trong **`/dad/950901-b/assets/`** — chung chỗ với ảnh nền và clip.
Đúng 5 tấm, đúng tên, đúng đuôi `.jpg`:

| Thứ tự | Tên file **bắt buộc** | Chú thích (`photo_captions`) |
|---|---|---|
| 1 | `photo_1.jpg` | `MEMORY 01` |
| 2 | `photo_2.jpg` | `MEMORY 02` |
| 3 | `photo_3.jpg` | `MEMORY 03` |
| 4 | `photo_4.jpg` | `MEMORY 04` |
| 5 | `photo_5.jpg` | `MEMORY 05` |

**Chú thích hiện ở đâu:** không hiện đè lên ảnh. Nó chỉ dùng làm `alt` (chữ thay
thế cho trình đọc màn hình) và **in lên tấm ảnh pixel tự vẽ khi thiếu file**.
Nên thiếu ảnh nào là trang vẫn chạy, chỗ đó hiện một tấm pixel có chữ
`MEMORY 0x · N/A`.

**Muốn đổi số lượng ảnh** (nhiều/ít hơn 5): thêm bớt dòng trong `photos` và
`photo_captions` của `config.js` — hai mảng phải **cùng độ dài**.

**Cỡ ảnh nên dùng:** khung slideshow tỷ lệ **4:3**, ảnh bị `object-fit:cover`
(cắt cho đầy khung). Ảnh ngang hợp hơn ảnh dọc. Khoảng **1200 × 900 px** là
thoải mái; nặng quá thì máy yếu tải chậm.

Slideshow **tự chạy 3 giây một tấm**, có nút `< PREV` / `NEXT >` và hàng chấm.

> Muốn để ảnh chỗ khác thì sửa `GAME_CONFIG.photos_base` (đang là `'assets/'`),
> tên file trong `photos` giữ nguyên.

---

## 2. Nội dung thư (`GAME_CONFIG.letter_content`)

Sửa thẳng vào khối dưới đây. Vài điều cần nhớ:

- Xuống dòng và dòng trống **giữ nguyên** như bạn gõ (game in `white-space: pre-wrap`).
- Thư **gõ máy chữ từng ký tự**, 26ms/ký tự. Thư càng dài càng lâu — chạm vào
  khung thư là **hiện hết ngay**, khỏi chờ.
- Khung thư luôn cuộn tới đáy nhưng chừa sẵn **khoảng trống ~2 dòng** bên dưới,
  nên dòng đang gõ nằm cao hơn mép, đọc theo nhịp bình thường.
- Đừng dùng dấu backtick `` ` `` trong thư (nó là ký tự kết thúc chuỗi trong
  `config.js`). Nháy đơn `'` và nháy kép `"` thì thoải mái.
- Đọc xong mới bật được nút `[ HOÀN THÀNH HÀNH TRÌNH ]`.

```
`Gửi Dongchi Bình,

Tuổi mới mong anh nhiều niềm vui, sức khoẻ, bớt lo nghĩ xa xôi, luôn dũng cảm và chân thành trong mọi sự (thành công ròi sẽ tới, với anh em tin là vậy).

Mong anh giữ được ước mơ mà anh hằng ấp ủ và thực sự biến nó thành sự thật. Mong những nuối tiếc về quá khứ của anh sớm được bù đắp (anh sẽ làm tốt và vẫn còn rất nhiều năm phía trước; đừng quá lo lắng anh nhé, just do it). 

Mong anh có được sự bình yên, tròn đầy mà anh hằng khao khát. Và, true happiness comes from within nên em nghĩ biết đâu dành 1 chút thời gian thăm nom lại anh-Bình-thuở-nhỏ và tìm hiểu bản thân lại là một ý hay cho anh tuổi mới này ^^. 

Riêng chuyện anh và em, dù lúc anh đọc thư chúng mình có đang như thế nào, thì em cũng không ghét hay giận anh. Em đã nghĩ chúng ta còn rất nhiều điều có thể làm cùng nhau. Em biết ơn nhân duyên đã đưa anh và em gặp gỡ nhau. Em biết ơn những khoảng thời gian hai ta đã cạnh nhau thủ thỉ mọi điều trong cuộc sống. Cảm ơn anh đã luôn cố gắng, chu đáo và chăm sóc em.

Em tin anh đã luôn làm tốt nhất trong khả năng của bản thân rồi, hãy động viên chính mình nhiều hơn anh nhé (don't talk bad about yourself, event it's joke, your brain will think it's true).

Game over, farewell.

— Em. Hồng Hân kí tên.

p.s: Building this series of mini-games for you as b-day gift brought me so much genuine joy. I'm not sure if or when I'll eventually push this live for the world, but if that day comes, it's simply because you deserve it. I poured a lot of heart into this 'brainchild' - I just hope playing it brings you as much joy as making it brought me. Enjoy!`
```

---

## 3. Mấy dòng chữ quanh lá thư (`GAME_CONFIG.ui`)

| Khoá | Đang là | Hiện ở đâu |
|---|---|---|
| `modal_title` | `BÍ TỊCH BẠCH LONG` | tiêu đề trên đầu khung thư |
| `prev_btn` / `next_btn` | `< PREV` / `NEXT >` | hai nút lật ảnh |
| `finish_btn` | `[ HOÀN THÀNH HÀNH TRÌNH ]` | nút xanh cuối khung thư |
| `round2.tap_label` | `[ TAP HERE ]` | chữ nháy dưới cuộn thư trên miệng rồng |

> ⚠️ Bốn dòng này dùng **font pixel không có dấu tiếng Việt** — phải giữ
> **không dấu**, không thì chữ vỡ. Riêng nội dung thư thì dùng font khác, có
> dấu bình thường.
