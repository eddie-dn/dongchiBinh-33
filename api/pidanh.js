/* ═══════════════════════════════════════════════════════════════════════════
   PÍ DANH ĐI THEO NGƯỜI — không còn dính chặt vào một cái máy
   ───────────────────────────────────────────────────────────────────────────
   BỆNH ĐÃ SỬA: pí danh và tiến độ vốn chỉ nằm trong `localStorage` của đúng
   trình duyệt đó. Đổi từ điện thoại sang laptop, hay Chrome sang Safari, là
   gõ lại đúng tên cũ cũng chỉ tạo một pí danh MỚI TRỐNG TRƠN — không có kho
   nào ngoài máy giữ bản lưu, cũng không có đường đọc ngược.

   NAY có: cuốn danh bạ nằm ở tab "Pí danh" trong sổ Google Sheets, mỗi tên
   đúng một dòng, lưu lại thì ghi đè chính dòng đó.

       POST /api/pidanh   { ten, moc, goi }   → cất bản lưu
       GET  /api/pidanh?ten=…                 → tra bản lưu

   ⚠ CÁI TÊN LÀ CHÌA KHOÁ. Ai gõ trúng tên là mở được bản lưu của người mang
   tên đó — không có mật khẩu nào thêm. Đây là lựa chọn CÓ CÂN NHẮC cho một
   trò chơi riêng giữa hai người: bắt nhớ mật khẩu thì hỏng cả cái thú, mà thứ
   bị lộ cũng chỉ là tiến độ chơi. ĐỪNG bê cách này sang chỗ có dữ liệu thật.

   ⚠ Dùng CHUNG biến `SHEET_URL` với đường ghi sổ — không khai thêm biến nào.
   Chưa khai biến thì mọi thứ vẫn chạy như cũ, chỉ là không đồng bộ được; trang
   phải chịu được câu trả lời "chưa bật" mà không vỡ.
   ═══════════════════════════════════════════════════════════════════════════ */

/* Chuẩn hoá y hệt bên Apps Script (`chuanTen`) — lệch một chỗ là "Zoey" và
   "zoey " thành hai người khác nhau. */
function chuanTen(t) {
  return String(t == null ? '' : t).trim().toLowerCase();
}

/* Cắt phần `?k=…` ra khỏi địa chỉ sổ để ghép thêm tham số của riêng mình. */
function taiCho(url, them) {
  const noi = url.indexOf('?') >= 0 ? '&' : '?';
  return url + noi + them;
}

module.exports = async (req, res) => {
  const url = process.env.SHEET_URL;
  if (!url) {
    /* KHÔNG trả lỗi 500: chưa bật đồng bộ là một trạng thái BÌNH THƯỜNG, trang
       chỉ việc lặng lẽ chơi kiểu cũ. Trả 200 kèm cờ để trang biết đường. */
    res.status(200).json({ ok: false, chua_bat: true });
    return;
  }

  try {
    if (req.method === 'GET') {
      const ten = chuanTen(req.query && req.query.ten);
      if (!ten) { res.status(200).json({ ok: false, ly_do: 'thieu ten' }); return; }
      const r = await fetch(taiCho(url, 'ten=' + encodeURIComponent(ten)), {
        method: 'GET', redirect: 'follow'
      });
      const chu = await r.text();
      let d = {};
      try { d = JSON.parse(chu); } catch (e) { d = { ok: false, ly_do: 'tra loi la' }; }
      /* `goi` cất trong Sheet là CHUỖI JSON — mở ra sẵn cho trang khỏi phải
         đoán. Mở không được thì trả về nguyên chuỗi, trang tự lo. */
      if (d && d.co && typeof d.goi === 'string') {
        try { d.goi = JSON.parse(d.goi); } catch (e) {}
      }
      console.log('[PIDANH] tra', ten, '→', d && d.co ? 'co' : 'khong');
      res.status(200).json(d);
      return;
    }

    if (req.method === 'POST') {
      let d = req.body;
      if (typeof d === 'string') { try { d = JSON.parse(d); } catch (e) { d = {}; } }
      d = d || {};
      const ten = chuanTen(d.ten);
      if (!ten) { res.status(200).json({ ok: false, ly_do: 'thieu ten' }); return; }

      const r = await fetch(url, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          loai: 'pidanh',
          ten: ten,
          moc: String(d.moc == null ? '' : d.moc).slice(0, 120),
          goi: JSON.stringify(d.goi == null ? {} : d.goi).slice(0, 45000),
          at: new Date().toISOString(),
          may: String((req.headers && req.headers['user-agent']) || '').slice(0, 120)
        })
      });
      const chu = await r.text();
      console.log('[PIDANH] cat', ten, r.status, chu.slice(0, 120));
      let d2 = {};
      try { d2 = JSON.parse(chu); } catch (e) { d2 = { ok: false, ly_do: 'tra loi la' }; }
      res.status(200).json(d2);
      return;
    }

    res.status(405).json({ ok: false });
  } catch (e) {
    /* Hỏng thì cũng trả 200 kèm lý do: trang gọi đường này chỉ để TIỆN THÊM,
       hỏng thì chơi kiểu cũ chứ không được vỡ. */
    console.log('[PIDANH] hỏng:', e && e.message);
    res.status(200).json({ ok: false, ly_do: String(e && e.message) });
  }
};
