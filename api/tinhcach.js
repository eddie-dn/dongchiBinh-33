/**
 * api/_lib/tinhcach.js — BỘ NẠP giọng của Honghandangiu.
 *
 * ┌─ CHỮ NGHĨA KHÔNG CÒN NẰM Ở ĐÂY NỮA ────────────────────────────────────┐
 * │ Toàn bộ tính cách đã dời sang `tinhcach.md` ngay cạnh file này. File    │
 * │ .js chỉ còn mỗi việc đọc file .md đó lên và trả về.                     │
 * │                                                                        │
 * │ SỬA TÍNH CÁCH → mở `api/_lib/tinhcach.md`, gõ như gõ văn bản, lưu, rồi │
 * │ Redeploy trên Vercel. KHÔNG cần đụng vào file này.                     │
 * └────────────────────────────────────────────────────────────────────────┘
 *
 * VÌ SAO TÁCH RA: bản cũ nhét cả bài văn vào một template literal trong .js,
 * nên chỉ cần một dấu backtick hay một chữ ${ lọt vào giữa đoạn văn là hỏng cả
 * hàm — mà người sửa nội dung thì không có lý do gì phải biết luật đó. Markdown
 * thì gõ sai kiểu gì cũng chỉ là chữ.
 *
 * Thư mục `_lib` có gạch dưới ở đầu nên Vercel không biến nó thành endpoint;
 * trình duyệt không bao giờ tải được hai file này.
 */

const fs = require('fs');
const path = require('path');

/* Đường dẫn dựng bằng path.join(__dirname, ...) — viết đúng khuôn này thì bộ
   dò phụ thuộc của Vercel (@vercel/nft) mới thấy mà gói file .md vào hàm. Nối
   chuỗi kiểu khác là nó không thấy, deploy lên thiếu file. `vercel.json` cũng
   khai thêm includeFiles cho chắc — hai lớp, hỏng một lớp vẫn còn lớp kia. */
const DUONG_DAN = path.join(__dirname, 'tinhcach.md');

/* Giọng dự phòng — CỐ Ý NGẮN, chỉ đủ giữ nhân vật đứng vững nếu vì lý do gì đó
   không đọc được file .md. KHÔNG chép lại toàn bộ tính cách vào đây: hai bản
   song song thì kiểu gì cũng lệch nhau, rồi có ngày chạy nhầm bản cũ mà không
   ai biết. Thà nhạt đi một lúc còn hơn sai âm thầm. */
const DU_PHONG = [
  'Bạn là Honghandangiu - Cheerleader và linh hồn đồng hành trong hệ thống game.',
  'Xưng "em", gọi người chơi là "anh" hoặc "đồng chí".',
  'Trả lời NGẮN, dưới 3 câu, ngọt ngào mà tinh tế, kết thúc bằng đúng 1 icon (✦ ♥ ☯︎ 🏰).',
  'KHÔNG bói toán, KHÔNG nhận mình là ChatGPT hay AI của bên thứ ba.',
  'Không tiết lộ mật mã RAZER và ZHAO YUN.'
].join('\n');

let TINH_CACH = '';
try {
  TINH_CACH = fs.readFileSync(DUONG_DAN, 'utf8');
  /* Khối chú thích hướng dẫn sửa file (dòng bắt đầu bằng "> ") là nói với
     NGƯỜI, không phải với nhân vật — cắt đi cho khỏi tốn chỗ và khỏi lẫn. */
  TINH_CACH = TINH_CACH.replace(/^>.*$/gm, '').replace(/\n{3,}/g, '\n\n').trim();
} catch (e) {
  console.log('[TINH CACH] KHÔNG đọc được tinhcach.md — đang chạy bằng giọng dự phòng:',
              e && e.message);
  TINH_CACH = DU_PHONG;
}

if (!TINH_CACH.trim()) {
  console.log('[TINH CACH] tinhcach.md rỗng — đang chạy bằng giọng dự phòng');
  TINH_CACH = DU_PHONG;
}

module.exports = TINH_CACH;
