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

Viết đúng MỘT câu tiếng Việt dài **16 đến 26 từ** (khoảng 70-150 ký tự), giọng
thân mật ấm áp, xưng "em" và gọi người đọc là "đồng chí". Là một câu hỏi han
hoặc chúc nhẹ ĐẦU NGÀY, giống một dòng nhật ký buổi sáng: nhẹ, cụ thể, không
sáo. Được phép có MỘT dấu phẩy để câu có hai vế — vế đầu là quan sát, vế sau
là lời hỏi han. Không emoji, không dấu ngoặc kép, không lời dẫn, không giải
thích, không xuống dòng.

> **Vì sao phải đủ dài:** hộp chào đổ chữ đầy dòng rồi mới xuống dòng, dùng
> trọn bề ngang khung. Câu 8-10 từ thì mới được một dòng rưỡi đã hết, chừa hẳn
> một khoảng trống bên phải — nhìn như bị cắt cụt. Câu 16-26 từ lấp vừa đẹp.

### Câu sẵn

- Chào đồng chí ✦ Một ngày mới nữa lại mở ra, hôm nay mình bắt đầu từ việc nhẹ nhất nha
- Đồng chí ăn sáng chưa đó, hay lại vừa mở máy ra là ngồi luôn vào việc rồi?
- Sáng nay đồng chí thấy trong người thế nào, ngủ có đủ giấc không đó?
- Hôm nay đồng chí định làm xong việc gì trước tiên, kể em nghe với
- Dậy sớm được là đã thắng một nửa rồi đó đồng chí, nửa còn lại để dành cho buổi chiều
- Có điều gì đang chờ đồng chí sáng nay không, hay hôm nay là một ngày yên yên?
- Chúc đồng chí một buổi sáng nhẹ đầu, việc gì khó thì để qua trưa tính tiếp
- Hôm nay mình đi chậm một chút cũng được đồng chí nhỉ, đường còn dài mà
- Cà phê hay trà, đồng chí chọn gì để mở màn ngày hôm nay đây?
- Sáng ra trời thế nào bên chỗ đồng chí, có nắng để mở cửa sổ không?

## trua

Từ 11:00 đến 17:59 giờ máy người chơi.

### Lời dặn

Viết đúng MỘT câu tiếng Việt dài **16 đến 26 từ** (khoảng 70-150 ký tự), giọng
thân mật ấm áp, xưng "em" và gọi người đọc là "đồng chí". Là một câu hỏi han
GIỮA NGÀY: hỏi công việc đang tới đâu, nhắc nghỉ tay, nhắc ăn uống — chọn một ý
thôi, đừng gộp ba ý vào một câu. Được phép có MỘT dấu phẩy để câu có hai vế.
Không emoji, không dấu ngoặc kép, không lời dẫn, không giải thích, không xuống
dòng.

> **Vì sao phải đủ dài:** xem ghi chú ở khối `sang`. Hộp chào dùng trọn bề
> ngang khung, câu ngắn quá là chừa trống một mảng bên phải.

### Câu sẵn

- Đồng chí ăn trưa chưa đó, hay lại định làm nốt cái này rồi mới ăn?
- Nửa ngày trôi qua rồi đó đồng chí, mọi thứ tới giờ vẫn trong tầm tay chứ?
- Nghỉ tay một chút đi đồng chí, việc có chạy đi đâu mất đâu mà vội
- Công việc hôm nay có gì khó không, hay chỉ là nhiều thứ lặt vặt chồng lên nhau?
- Uống miếng nước đi đồng chí, ngồi một mạch từ sáng tới giờ rồi đó
- Đứng dậy đi vài bước cho giãn người nha đồng chí, hai phút thôi cũng được
- Buổi chiều còn dài, đồng chí đừng vội, làm xong một việc rồi tính việc sau
- Đồng chí làm việc đến đâu rồi, nhớ đứng dậy ăn chút gì cho lại sức nha
- Giữa ngày rồi, có việc nào đồng chí thấy nặng thì để em nghe với

## toi

Từ 18:00 đến 03:59 giờ máy người chơi.

### Lời dặn

Viết đúng MỘT câu tiếng Việt dài **16 đến 26 từ** (khoảng 70-150 ký tự), giọng
thân mật ấm áp, xưng "em" và gọi người đọc là "đồng chí". Là một câu CUỐI NGÀY:
hỏi hôm nay thế nào, hoặc chúc ngủ ngon, hoặc nhắc gác việc lại. Nhẹ và yên,
không hô hào. Được phép có MỘT dấu phẩy để câu có hai vế. Không emoji, không
dấu ngoặc kép, không lời dẫn, không giải thích, không xuống dòng.

> **Vì sao phải đủ dài:** xem ghi chú ở khối `sang`.

### Câu sẵn

- Hôm nay của đồng chí thế nào, có việc nào làm xong mà thấy nhẹ người không?
- Có gì vui hôm nay kể em nghe với, chuyện nhỏ xíu cũng được mà
- Việc hôm nay để hôm nay thôi đồng chí nhé, mai mở máy ra là chuyện của mai
- Khuya rồi đó đồng chí, màn hình tắt được thì tắt, mai còn cả một ngày
- Hôm nay đồng chí đã cố gắng rồi, kết quả thế nào thì cũng ghi nhận cái đã
- Chúc đồng chí một giấc ngủ ngon, sâu và không mơ thấy việc chưa làm xong
- Ngày dài quá thì mình cất bớt đi, phần còn lại để mai tính tiếp nha đồng chí
- Đồng chí ơi, hôm nay có gì làm đồng chí bận lòng không, nói ra nhẹ hơn đó
- Đêm xuống rồi, đồng chí cho phép mình dừng lại một chút cũng không sao đâu

## quote

DAILY QUOTE — dùng khi các mốc chào của ngày đã xong. Không phụ thuộc buổi.

### Lời dặn

Chọn MỘT câu nói CÓ THẬT của một nhà hiền triết, chiến lược gia, nhà tâm lý
hoặc nhà tư tưởng nổi tiếng.

Câu phải rơi vào MỘT trong bốn đầu mục dưới đây. Đây là cái ruột của khối này,
không phải danh ngôn động viên chung chung:

1. TỰ BIẾT MÌNH (self-awareness) — nhìn ra cái đang chạy trong đầu mình rồi
   gọi đúng tên nó.
2. TỰ TRỌNG (self-esteem) — giá trị của mình không nằm ở lời khen chê của
   người khác.
3. TỰ SOI LẠI (self-reflection) — ngồi lại xét việc mình đã làm, sửa mình
   trước khi trách người.
4. KHIÊM NHƯỜNG (humility) — biết chỗ mình chưa biết, biết mình nhỏ trong một
   thứ lớn hơn.

Lấy trong nhóm tác giả này — cùng một mạch với Seneca và Marcus Aurelius: cổ
nhân khắc kỷ, thiền sư, nhà tâm lý chiều sâu, người thực hành tự vấn.

Seneca · Marcus Aurelius · Epictetus · Socrates · Plutarch · Cicero ·
Montaigne · Blaise Pascal · Spinoza · Kierkegaard · Nietzsche · Simone Weil ·
Viktor Frankl · Carl Jung · Carl Rogers · Erich Fromm · Gabor Maté ·
Jordan Peterson · Brené Brown · Krishnamurti · Ramana Maharshi · Rumi ·
Lão Tử · Trang Tử · Khổng Tử · Mạnh Tử · Tuân Tử · Tôn Tử · Đức Phật ·
Thích Nhất Hạnh · Đạt Lai Lạt Ma · Ajahn Chah · Bồ Đề Đạt Ma ·
Hồ Chí Minh · Nguyễn Trãi · Nguyễn Bỉnh Khiêm · Trần Nhân Tông ·
Benjamin Franklin · Abraham Lincoln · Leo Tolstoy · Fyodor Dostoevsky ·
Albert Einstein · Richard Feynman · Charlie Munger · Maya Angelou ·
James Baldwin · Toni Morrison

Dịch sang tiếng Việt gọn gàng, TRỌN VẸN một ý, dài 80 đến 150 ký tự — kể cả
phần tên tác giả thì đừng vượt 168. Câu ngắn quá thì hộp chào chừa trống một
mảng bên phải, nên ưu tiên câu có hai vế.

Trả về đúng một dòng theo khuôn: Nội dung câu nói — Tên tác giả

Chỉ dùng câu CÓ THẬT, KHÔNG bịa, không gán nhầm tác giả — không chắc ai nói thì
chọn câu khác. Không emoji, không dấu ngoặc kép, không lời dẫn, không giải
thích, không xuống dòng.

### Câu sẵn

> Bốn đầu mục xếp lần lượt bên dưới. Mấy dòng `####` chỉ để NGƯỜI đọc dễ dò;
> bộ nạp bỏ qua mọi dòng bắt đầu bằng dấu thăng nên chúng không lọt vào kho
> câu. ĐỪNG đổi chúng thành chữ in đậm `**...**` — dấu sao đầu dòng bị bộ nạp
> hiểu là gạch đầu dòng, thế là bốn cái tiêu đề thành bốn "câu chào" (đã vấp).
> Thêm câu mới thì giữ đúng khuôn `- Nội dung — Tác giả` (gạch ngang DÀI `—`),
> và cố cho câu đủ dài.

#### Tự biết mình

- Chừng nào vô thức chưa thành ý thức, nó sẽ dẫn đường đời ta và ta gọi đó là số phận — Carl Jung
- Ai nhìn ra ngoài thì mơ, ai nhìn vào trong mới thật sự tỉnh ra — Carl Jung
- Ta chịu khổ vì tưởng tượng nhiều hơn là vì hiện thực — Seneca
- Biết người là khôn, biết được chính mình mới gọi là sáng — Lão Tử
- Ta là những gì ta nghĩ; mọi thứ ta đang là đều khởi lên từ ý nghĩ của ta — Đức Phật
- Người ta không bị làm khổ bởi sự việc, mà bởi cách mình nghĩ về sự việc đó — Epictetus
- Đừng hỏi vì sao nghiện, hãy hỏi vì sao đau — Gabor Maté
- Giữa kích thích và phản ứng có một khoảng trống, tự do của ta nằm trong khoảng đó — Viktor Frankl
- Nghịch lý là chừng nào tôi nhận mình đúng như đang là, chừng đó tôi mới đổi được — Carl Rogers
- Quan sát mà không kèm phán xét là hình thức cao nhất của trí tuệ con người — Krishnamurti

#### Tự trọng

- Giá trị của một người đúng bằng giá trị của những gì người ấy để tâm tới — Marcus Aurelius
- Không ai làm nhục được bạn nếu không có sự cho phép của chính bạn — Eleanor Roosevelt
- Người quân tử cầu ở mình, còn kẻ tiểu nhân thì cầu ở người khác — Khổng Tử
- Hãy so mình với chính mình của hôm qua, đừng so với người khác của hôm nay — Jordan Peterson
- Ai có một lý do để sống thì chịu đựng được gần như mọi cách sống — Nietzsche
- Yêu lấy chính mình là khởi đầu của một mối tình kéo dài trọn đời — Oscar Wilde
- Nếu ta không tự bênh vực chính mình thì cũng đừng mong ai đứng ra bênh vực hộ — Maya Angelou
- Không có việc gì khó, chỉ sợ lòng mình không bền — Hồ Chí Minh

#### Tự soi lại

- Một đời sống không được đem ra xét lại thì không đáng sống — Socrates
- Mỗi tối hãy tự hỏi: hôm nay ta chữa được tật nào, cưỡng lại được lỗi nào — Seneca
- Hãy nhìn vào bên trong; nguồn của điều lành nằm ở đó, đào mãi thì nó phun mãi — Marcus Aurelius
- Ai cũng nghĩ tới chuyện đổi thế giới, chẳng ai nghĩ tới chuyện đổi chính mình — Leo Tolstoy
- Mọi bất hạnh của con người đến từ chỗ không ngồi yên một mình trong phòng được — Blaise Pascal
- Ngày ba lần ta tự xét mình: làm cho người có hết lòng chưa, với bạn có giữ chữ tín không — Tăng Tử
- Hiện tại là khoảnh khắc duy nhất mà ta thật sự đang có trong tay — Thích Nhất Hạnh
- Vết thương chính là chỗ ánh sáng đi được vào trong con người bạn — Rumi

#### Khiêm nhường

- Tôi chỉ biết đúng một điều, ấy là tôi không biết gì cả — Socrates
- Biết thì nhận là biết, không biết thì nhận là không biết, thế mới là biết — Khổng Tử
- Biển sở dĩ làm vua trăm khe suối là vì nó biết nằm ở chỗ thấp hơn — Lão Tử
- Biết người biết ta thì trăm trận cũng không lấy gì làm nguy — Tôn Tử
- Hành trình vạn dặm nào rồi cũng phải bắt đầu từ đúng một bước chân — Lão Tử
- Việc đầu tiên là đừng tự lừa mình, mà mình lại là kẻ dễ lừa nhất trên đời — Richard Feynman
- Rắc rối không nằm ở chỗ ta dốt, mà ở chỗ ta đinh ninh những điều vốn không phải vậy — Mark Twain
- Đời người thì có hạn mà cái biết thì vô hạn, lấy cái có hạn đuổi cái vô hạn là mệt — Trang Tử
