# MAP 3 · ZOEY'S CASTLE — bảng chữ để chỉnh

Mọi câu chữ đổi được của Map 3 gom hết vào đây. Sửa xong thì chép **nguyên khối**
tương ứng đè vào file HTML ở đúng dòng ghi kèm — không cần đụng gì khác.

Hai trang của Map 3 (khu hồ sơ là **khung HAN ngay trên bản đồ**, không phải trang riêng):

| File | Là gì |
|---|---|
| `han/961030-a/index.html` | Bộ câu hỏi *Who's my kindred spirit?* |
| `han/961030-b/index.html` | *HongHan's Secret Chamber* |

---

## 1. Câu hỏi và gợi ý — `han/961030-a/index.html`

Mảng `HOI`. Mỗi câu gồm: `q` câu hỏi · `a` các đáp án chấp nhận (bỏ dấu, bỏ khoảng
trắng, không phân biệt hoa thường) · `gap` vị trí có khoảng cách giữa hai từ ·
`hints` gợi ý theo thứ tự lộ dần — **mỗi gợi ý cách nhau 30 phút** (hằng `HINTW`),
hoặc bấm SOS 10 nhịp để mở sớm.

> **ĐANG KHOÁ GỢI Ý.** Tới **01-10-2026** cả hệ gợi ý mới bật; từ giờ tới đó người chơi
> **chơi chay**: sai bao nhiêu lần, bấm SOS bao nhiêu nhịp cũng không lộ chữ nào.
> Muốn dời mốc thì sửa **một chỗ duy nhất** —
> hằng `MO_GOIY` đầu khối script `961030-a`:
>
> ```js
> var MO_GOIY = new Date('2026-10-01T00:00:00+07:00').getTime();
> ```
>
> Muốn mở gợi ý ngay thì đổi thành một ngày đã qua. Chữ trong `hints` vẫn giữ nguyên,
> không mất đi đâu.
>
> Trong lúc khoá, nút **SOS vẫn trêu như thường** (bộ `TREU` ở mục 2) — không có dòng nào
> báo "gợi ý mở từ ngày X" cả, để người chơi khỏi biết là còn thứ đang giấu.

> **Lưu ý khi sửa chữ:** câu nào có dấu nháy đơn `'` (ví dụ *"Gất pất ổn's"*) thì phải
> bọc bằng nháy kép `"..."`, không thì đứt chuỗi và cả trang trắng. Bộ chữ hiện tại đã
> đổi sang nháy kép sẵn.

```js
var HOI = [
  { id:'manga', q:'Tên một Manga Nhật Bản mà em yêu thích?',
    a:['ALICE IN BORDERLAND'], gap:[5,7],
    hints:['2020', 'Netflix Live Action', 'Arisu'] },
  { id:'day', q:'Em bắt đầu đi dạy năm bao nhiêu?',
    a:['2016'], gap:[],
    hints:['Singapore', 'Bính Thân'] },
  { id:'meo', q:'Chú mèo đầu tiên Honghandangiu nuôi tên là gì?',
    a:['DUOI GAY'], gap:[4],
    hints:['Nhìn từ sau lưng là biết', 'Hai chữ, chữ sau là một bộ phận cơ thể'] },
  { id:'lol', q:'Champion em chơi nhiều nhất trong LoL?',
    a:['AKALI'], gap:[],
    hints:['Assassin', 'K/DA Skin', 'Blood Moon Skin', 'Nữ', 'Bắt đầu bằng chữ A'] },
  { id:'jung', q:'Nhà tâm lý học vĩ đại nhất trong lòng em?',
    a:['CARL JUNG'], gap:[4],
    hints:['Vô thức tập thể (Collective Unconscious)', 'Anima và Animus',
           'Sách đỏ (The Red Book)', 'Người Thuỵ Sĩ'] },
  { id:'tenhoa', q:'Phiên âm tên tiếng Trung của em là…',
    a:['YAN XIN', 'YANXIN'], gap:[3],
    hints:['Xinh đẹp và vui vẻ', '妍欣'] }
];```

---

## 2. Câu trêu khi trả lời sai — `han/961030-a`

Random, không lặp câu liền trước.

```js
var TREU = ['Chưa đúng rồi ✦', 'Gần gần rồi đó, thử lại nha ✦',
            'Hổng phải, nghĩ kỹ chút xíu ✦', 'Sai rồi anh ơiii ✦'];```

## 3. Lời chi viện khi SOS mở thêm gợi ý — `han/961030-a`

Đi **lần lượt** theo thứ tự gợi ý được mở, không random.

```js
var SOSMSG = ['Chi viện cho anh một gợi ý ✦', 'Thêm một gợi ý nữa nha ✦',
              'Sắp hết gợi ý gòyyy ✦', 'Gợi ý cuối cùng đó nha ✦'];```

## 4. Câu khen khi trả lời đúng — `han/961030-a`

```js
var KHEN = ['Chuẩn luôn ✦', 'Đúng rồi đó ✦', 'Giỏi quá đi ✦', 'Anh hiểu em ghê ✦'];```

## 5. Câu ghẹo khi bấm SOS lai rai

Tối đa 6 lần mỗi phiên. Bên `961030-a` **dùng chung luôn bộ `TREU`** ở mục 2 —
sửa mục 2 là xong, khỏi nuôi hai danh sách rồi lệch giọng nhau:

```js
var SOSGHEO = TREU;
```

Bên `961030-b` chép nguyên bộ đó (file riêng, không thấy `TREU`):

```js
var SOSGHEO  = ["Gất pất ổn's 𐔌՞. .՞𐦯", "Gần tứi gòy anh oyyy ִֶָ𓂃 ࣪˖ ִֶָ🐇་༘࿐",
                "Hổng phải, thử lại i anh oyyy 🏰", "Lần nữa nà 🏰₊˚⊹♡"];
```

## 6. Trạng thái xoay vòng trong Secret Chamber — `han/961030-b`

`i` là tên icon (`radar` · `no` · `xep`), `t` là dòng chữ.

```js
var TRANGTHAI = [
  { i:'radar', t:'Đang thu thập dữ liệu' },
  { i:'no',    t:'Đang gói ghém' },
  { i:'xep',   t:'Đang sắp xếp' }
];```

---

## 7. Mấy câu lẻ khác

| Câu | Nằm ở |
|---|---|
| `Chưa có chìa khoá vào lâu đài ✦` · `Cần chìa khoá` · `Pi sà vui lòng phá đảo Easter Egg` · `Enter Easter Egg` | hàm `drawChua()` — `961030-a` |
| `Xíu nữa gặp lại nha` + hàng icon 🏰 👸🏻 🔮 🌷 · `Còn N câu chờ mở lại` · `Mở lại sau …` | hàm `drawLock()` — `961030-a` |
| `Đã trả lời đúng ✦` · `Câu này xong rồi ✦ Dùng mũi tên để đi tiếp` | hàm `drawQ()` — `961030-a`, nhánh xem lại |
| `Câu này đang nghỉ · mở lại sau hh:mm:ss` | hàm `napXem()` — `961030-a` |
| `HongHan's Secret Chamber đang chờ anh khám phá` (kèm chìa khoá hồng) | hàm `drawLead()` — `961030-a` |
| `↺ Xem lại các câu` | hàm `xong()` — `961030-a` |
| `Phá Đảo Lòng EM` · `HongHan's Secret` · `Thương gửi anh PIN` | hàm `xong()` — `961030-a` |
| `Vui lòng nhập mã PIN ✦` | hàm `drawGate()` — `961030-b` |
| `Cập nhật sau` · `Mở được rồi ✦` | hàm `drawBox()` / `moNoiDung()` — `961030-b` |
| Nhãn hai hồ sơ trong khung HAN | mảng `NODES` + hàm `render()` — `index.html` (bản đồ) |
