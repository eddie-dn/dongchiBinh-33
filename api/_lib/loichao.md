# Lời chào & Daily Quote trong hộp Greetings

> **CHỈ SỬA FILE NÀY. Hai file kia đừng đụng tới.**
>
> Cả bộ lời chào gồm ba file, nhưng chúng chia việc rõ ràng:
>
> | File | Việc của nó | Anh có sửa không |
> |---|---|---|
> | `api/_lib/loichao.md` | **chữ nghĩa** — lời dặn + câu sẵn | **CÓ — chính là file này** |
> | `api/_lib/loichao.js` | đọc file .md trên rồi bóc ra ba buổi | không |
> | `api/quote.js` | nhận yêu cầu từ trang, gọi Gemini | không |
>
> Tách ba như vậy để sửa một câu chào không phải mở mã ra đọc, và ngược lại
> sửa mã không sợ làm rơi mất câu nào. Máy chủ đọc thẳng file .md này mỗi lần
> trang xin một câu, nên sửa ở đây là ăn ngay.
>
> **File này TÁCH HẲN khỏi `tinhcach.md`.** Kia là giọng của Honghandangiu lúc
> trò chuyện trong khu Open World, có fact riêng tư về người chơi. File này chỉ
> lo mấy câu chào ngắn ngoài bản đồ. Sửa bên này không ảnh hưởng bên kia.
>
> **Sửa thế nào:** mở bằng bất cứ trình soạn thảo nào, gõ như gõ văn bản bình
> thường, lưu rồi **Redeploy** trên Vercel. Đây là markdown thuần, gõ sai cũng
> không làm sập trang.
>
> **Cấu trúc bắt buộc — đừng đổi tên mấy dòng tiêu đề:**
> mỗi buổi là một khối `## <mã buổi>`, bên trong có đúng hai mục
> `### Lời dặn` (đoạn dặn gửi cho Gemini) và `### Câu sẵn` (danh sách gạch
> đầu dòng). Thêm bớt câu trong `### Câu sẵn` thì thoải mái.
>
> **`### Câu sẵn` để làm gì:** chưa khai khoá Gemini, mạng chậm, hay Gemini trả
> câu không dùng được thì máy chủ bốc một câu trong đây. Nhờ vậy hộp chào KHÔNG
> BAO GIỜ trống và cũng không bao giờ hiện lỗi. Cứ coi đây là bộ câu chính thức,
> còn Gemini là phần thêm nếm cho mỗi ngày một khác.
>
> **BỐN khối, không phải ba.** Ba khối `sang` / `trua` / `toi` là LỜI CHÀO —
> chào xong mốc của ngày rồi thì thôi. Khối `quote` là DAILY QUOTE: từ đó trở
> đi, mỗi lần người chơi F5 hay quay lại thì hộp hiện một câu quote thay vì
> chào lại. Khối `quote` dùng chung đúng khuôn `### Lời dặn` / `### Câu sẵn`.
>
> **Trong `## quote`, mỗi câu sẵn viết theo khuôn `- Nội dung — Tác giả`**
> (dấu gạch ngang dài `—`). Máy chủ tách ra để trang hiện tên tác giả xuống
> một dòng riêng cho gọn.

## sang

Từ 04:00 đến 10:59 giờ máy người chơi.

### Lời dặn

Viết đúng MỘT câu tiếng Việt, tối đa 14 từ, giọng thân mật ấm áp, xưng "em" và
gọi người đọc là "đồng chí". Là một câu hỏi han hoặc chúc nhẹ ĐẦU NGÀY, giống
một dòng nhật ký buổi sáng: nhẹ, cụ thể, không sáo. Không emoji, không dấu
ngoặc kép, không lời dẫn, không giải thích.

### Câu sẵn

- Chào đồng chí ✦ Mỗi ngày là một ngày mới
- Đồng chí ăn sáng chưa đó?
- Sáng nay đồng chí thấy trong người thế nào?
- Hôm nay đồng chí định làm xong việc gì trước tiên?
- Dậy sớm được là đã thắng một nửa rồi đó đồng chí
- Có điều gì đang chờ đồng chí sáng nay không?
- Chúc đồng chí một buổi sáng nhẹ đầu
- Hôm nay mình đi chậm một chút cũng được, đồng chí nhỉ

## trua

Từ 11:00 đến 17:59 giờ máy người chơi.

### Lời dặn

Viết đúng MỘT câu tiếng Việt, tối đa 14 từ, giọng thân mật ấm áp, xưng "em" và
gọi người đọc là "đồng chí". Là một câu hỏi han GIỮA NGÀY: hỏi công việc đang
tới đâu, nhắc nghỉ tay, nhắc ăn uống — chọn một ý thôi. Không emoji, không dấu
ngoặc kép, không lời dẫn, không giải thích.

### Câu sẵn

- Đồng chí ăn trưa chưa đó?
- Nửa ngày trôi qua rồi, mọi thứ ổn chứ đồng chí?
- Nghỉ tay một chút đi đồng chí
- Công việc hôm nay có gì khó không?
- Uống miếng nước đi đồng chí, ngồi lâu rồi đó
- Đứng dậy đi vài bước cho giãn người nha đồng chí
- Buổi chiều còn dài, đồng chí đừng vội

## toi

Từ 18:00 đến 03:59 giờ máy người chơi.

### Lời dặn

Viết đúng MỘT câu tiếng Việt, tối đa 14 từ, giọng thân mật ấm áp, xưng "em" và
gọi người đọc là "đồng chí". Là một câu CUỐI NGÀY: hỏi hôm nay thế nào, hoặc
chúc ngủ ngon, hoặc nhắc gác việc lại. Nhẹ và yên, không hô hào. Không emoji,
không dấu ngoặc kép, không lời dẫn, không giải thích.

### Câu sẵn

- Hôm nay của đồng chí thế nào?
- Có gì vui hôm nay kể em nghe với
- Việc hôm nay để hôm nay thôi, đồng chí nhé
- Khuya rồi đó đồng chí, nghỉ sớm nha
- Hôm nay đồng chí đã cố gắng rồi
- Chúc đồng chí một giấc ngủ ngon
- Ngày dài quá thì mình cất bớt đi, mai tính tiếp
- Đồng chí ơi, hôm nay có gì làm đồng chí bận lòng không?

## quote

DAILY QUOTE — dùng khi các mốc chào của ngày đã xong. Không phụ thuộc buổi.

### Lời dặn

Chọn MỘT câu nói có thật của một nhà hiền triết, chiến lược gia hoặc nhà tư
tưởng nổi tiếng (Seneca, Marcus Aurelius, Hồ Chí Minh, Đức Phật, Lão Tử,
Khổng Tử, Tôn Tử, Carl Jung, Nietzsche, Thích Nhất Hạnh, Jordan Peterson,
Gabor Maté...). Dịch sang tiếng Việt gọn gàng, TRỌN VẸN một ý, tối đa 120 ký
tự. Trả về đúng một dòng theo khuôn: Nội dung câu nói — Tên tác giả
Chỉ dùng câu có thật, KHÔNG bịa. Không emoji, không dấu ngoặc kép, không lời
dẫn, không giải thích.

### Câu sẵn

- Không có việc gì khó, chỉ sợ lòng không bền — Hồ Chí Minh
- Hành trình vạn dặm bắt đầu từ một bước chân — Lão Tử
- Biết người biết ta, trăm trận không nguy — Tôn Tử
- Bạn có quyền năng với tâm trí mình, không phải với những sự kiện bên ngoài — Marcus Aurelius
- Chừng nào vô thức chưa thành ý thức, nó sẽ dẫn đường đời ta và ta gọi đó là số phận — Carl Jung
- Ai có một lý do để sống thì chịu đựng được gần như mọi cách sống — Nietzsche
- Ta là những gì ta nghĩ; mọi thứ ta là đều khởi lên từ ý nghĩ — Đức Phật
- Người quân tử cầu ở mình, kẻ tiểu nhân cầu ở người — Khổng Tử
- Hãy so mình với chính mình của hôm qua, đừng so với người khác của hôm nay — Jordan Peterson
- Hiện tại là khoảnh khắc duy nhất ta thật sự đang có — Thích Nhất Hạnh
- Đừng hỏi vì sao nghiện, hãy hỏi vì sao đau — Gabor Maté
- Ta chịu khổ vì tưởng tượng nhiều hơn vì hiện thực — Seneca
