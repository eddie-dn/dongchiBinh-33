/* Một câu chào cho phiên đầu tiên trong ngày.
   Khoá Gemini nằm ở BIẾN MÔI TRƯỜNG trên Vercel, không bao giờ xuống trình
   duyệt — trang là HTML tĩnh, nhét khoá vào đó là công khai cho cả thế giới.
   Chưa khai khoá thì endpoint vẫn trả 200 kèm một câu có sẵn, người chơi không
   thấy lỗi cấu hình. */
const SAN = [
  'Chào đồng chí ✦ Mỗi ngày là một ngày mới',
  'Đồng chí ăn gì chưa?',
  'Hôm nay có gì vui kể em nghe với?',
  'Hôm nay đồng chí thấy trong người thế nào?',
  'Có điều gì đang làm đồng chí bận lòng không?'
];
const NHAC = 'Viết đúng MỘT câu tiếng Việt, tối đa 14 từ, giọng thân mật ấm áp, '
  + 'xưng "em" gọi người đọc là "đồng chí". Là một câu hỏi han hoặc chúc nhẹ đầu ngày, '
  + 'giống nhật ký buổi sáng. Không emoji, không dấu ngoặc kép, không lời dẫn.';

module.exports = async (req, res) => {
  const roi = () => SAN[Math.floor(Math.random() * SAN.length)];
  res.setHeader('content-type', 'application/json; charset=utf-8');
  res.setHeader('cache-control', 'no-store');
  const key = process.env.GEMINI_KEY || process.env.GOOGLE_API_KEY;
  if(!key) return res.status(200).end(JSON.stringify({ q: roi(), src: 'san' }));
  try{
    const model = process.env.GEMINI_MODEL || 'gemini-2.0-flash';
    const ac = new AbortController();
    const hen = setTimeout(() => ac.abort(), 4000);   /* chậm quá thì thôi */
    const r = await fetch(
      'https://generativelanguage.googleapis.com/v1beta/models/' + model +
      ':generateContent?key=' + encodeURIComponent(key),
      { method:'POST', signal: ac.signal,
        headers:{ 'content-type':'application/json' },
        body: JSON.stringify({
          contents:[{ parts:[{ text: NHAC }] }],
          generationConfig:{ temperature: 1, maxOutputTokens: 60 }
        }) });
    clearTimeout(hen);
    if(!r.ok) throw new Error('gemini ' + r.status);
    const j = await r.json();
    const t = (((j.candidates || [])[0] || {}).content || {}).parts || [];
    const cau = (t[0] && t[0].text || '').trim().replace(/^["'“”]|["'“”]$/g, '');
    if(!cau || cau.length > 120) throw new Error('câu không dùng được');
    return res.status(200).end(JSON.stringify({ q: cau, src: 'gemini' }));
  }catch(e){
    return res.status(200).end(JSON.stringify({ q: roi(), src: 'san' }));
  }
};
