/**
 * /api/note — bí danh của /api/ping.
 *
 * Lý do tồn tại: nhiều bộ chặn quảng cáo và tường lửa doanh nghiệp chặn theo đường dẫn,
 * và "/api/ping" khớp kha khá bộ lọc có sẵn. "/api/note" trung tính hơn nên đi lọt.
 * Trang gọi /api/note trước; hỏng thì tự hạ cánh xuống /api/ping (ảnh 1×1 và kênh
 * gửi biểu mẫu). Toàn bộ xử lý và biến môi trường dùng chung với ping.js.
 *
 * PHẢI deploy CẢ HAI file api/ping.js và api/note.js.
 */
module.exports = require('./ping.js');
