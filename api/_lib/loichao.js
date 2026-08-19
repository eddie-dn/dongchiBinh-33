/**
 * api/_lib/loichao.js — BỘ NẠP mấy câu chào của hộp Greetings ngoài bản đồ.
 *
 * ┌─ CHỮ NGHĨA KHÔNG NẰM Ở ĐÂY ────────────────────────────────────────────┐
 * │ Toàn bộ lời dặn và câu sẵn nằm ở `loichao.md` ngay cạnh file này.       │
 * │ File .js chỉ đọc file .md đó lên rồi bóc ra thành ba buổi.              │
 * │                                                                        │
 * │ SỬA CÂU CHÀO → mở `api/_lib/loichao.md`, gõ như gõ văn bản, lưu, rồi   │
 * │ Redeploy trên Vercel. KHÔNG cần đụng vào file này.                     │
 * └────────────────────────────────────────────────────────────────────────┘
 *
 * VÌ SAO TÁCH KHỎI `tinhcach.md`: file kia là giọng của Honghandangiu lúc trò
 * chuyện trong khu Open World và có fact riêng tư về người chơi. Hộp chào
 * ngoài bản đồ chỉ cần mấy câu ngắn, chẳng liên quan gì. Nhập chung thì mỗi
 * lần sửa một câu chào lại phải mở cả bài tính cách ra, và ngược lại — hai
 * việc khác nhau thì để hai file khác nhau.
 *
 * Thư mục `_lib` có gạch dưới ở đầu nên Vercel không biến nó thành endpoint;
 * trình duyệt không bao giờ tải được hai file này.
 */

const fs = require('fs');
const path = require('path');

/* Viết đúng khuôn path.join(__dirname, ...) thì bộ dò phụ thuộc của Vercel
   (@vercel/nft) mới thấy mà gói file .md vào hàm — y như bên tinhcach.js. */
const DUONG_DAN = path.join(__dirname, 'loichao.md');

/* Bản dự phòng — CỐ Ý NGẮN, chỉ đủ để hộp chào không bao giờ trống nếu vì lý
   do gì đó không đọc được file .md. KHÔNG chép lại toàn bộ bộ câu vào đây:
   hai bản song song thì kiểu gì cũng lệch, rồi có ngày chạy nhầm bản cũ mà
   không ai biết. */
const DU_PHONG = {
  sang: { nhac: '', san: ['Chào đồng chí ✦ Mỗi ngày là một ngày mới'] },
  trua: { nhac: '', san: ['Đồng chí ăn trưa chưa đó?'] },
  toi:  { nhac: '', san: ['Hôm nay của đồng chí thế nào?'] }
};

/* Bóc file .md thành { <mã buổi>: { nhac, san[] } }.
   Luật đọc cố ý DỄ TÍNH: chỉ bám vào ba thứ — dòng `## <mã buổi>`, dòng
   `### Lời dặn`, dòng `### Câu sẵn`. Chữ nghĩa xung quanh gõ kiểu gì cũng
   được. Dòng bắt đầu bằng "> " là nói với NGƯỜI đọc file, không phải với
   Gemini — bỏ hết. */
function boc(src) {
  const ra = {};
  const khoi = src.split(/^##[ \t]+/m).slice(1);
  for (const k of khoi) {
    const ten = (k.split('\n')[0] || '').trim().toLowerCase();
    if (!ten) continue;
    const than = k.slice(k.indexOf('\n') + 1)
                  .replace(/^>.*$/gm, '');          /* bỏ ghi chú cho người */
    const muc = than.split(/^###[ \t]+/m).slice(1);
    let nhac = '', san = [];
    for (const m of muc) {
      const dau = (m.split('\n')[0] || '').trim().toLowerCase();
      const noi = m.slice(m.indexOf('\n') + 1);
      if (dau.indexOf('lời dặn') === 0 || dau.indexOf('loi dan') === 0) {
        nhac = noi.replace(/\s+/g, ' ').trim();
      } else if (dau.indexOf('câu sẵn') === 0 || dau.indexOf('cau san') === 0) {
        san = noi.split('\n')
                 .map(d => d.replace(/^[ \t]*[-*][ \t]*/, '').trim())
                 .filter(d => d && !/^#/.test(d));
      }
    }
    if (nhac || san.length) ra[ten] = { nhac, san };
  }
  return ra;
}

let LOI_CHAO;
try {
  LOI_CHAO = boc(fs.readFileSync(DUONG_DAN, 'utf8'));
  if (!LOI_CHAO.sang && !LOI_CHAO.trua && !LOI_CHAO.toi) {
    console.log('[LOI CHAO] loichao.md không có khối buổi nào đọc được — dùng bản dự phòng');
    LOI_CHAO = DU_PHONG;
  }
} catch (e) {
  console.log('[LOI CHAO] KHÔNG đọc được loichao.md — dùng bản dự phòng:', e && e.message);
  LOI_CHAO = DU_PHONG;
}

/* Thiếu buổi nào thì mượn tạm buổi khác, đừng để trả về undefined */
for (const b of ['sang', 'trua', 'toi']) {
  if (!LOI_CHAO[b] || (!LOI_CHAO[b].nhac && !(LOI_CHAO[b].san || []).length)) {
    LOI_CHAO[b] = LOI_CHAO.sang || LOI_CHAO.trua || LOI_CHAO.toi || DU_PHONG[b];
  }
}

/* Giờ nào là buổi nào. Nhận GIỜ MÁY NGƯỜI CHƠI (trang gửi lên), không phải giờ
   máy chủ: hàm serverless chạy ở đâu thì giờ ở đó, chào "buổi sáng" lúc người
   ta đang đi ngủ là hỏng cả ý. */
function buoiTheoGio(gio) {
  const g = Number(gio);
  if (!isFinite(g) || g < 0 || g > 23) return 'sang';
  if (g >= 4  && g < 11) return 'sang';
  if (g >= 11 && g < 18) return 'trua';
  return 'toi';
}

module.exports = { LOI_CHAO, buoiTheoGio };
