/* ĐỢT 24 · CỬA TỰ SOI SỔ LƯU + ĐƯỜNG CHÉP KHÔNG CÒN CÂM
   Bệnh: "thấy telegram bắn rầm rầm mà google-sheets không chạy gì" — mà đường
   sang sổ nuốt sạch mọi lỗi nên không có cách nào biết tắc ở khúc nào. */
import { GOC, require } from '../chung.mjs';
import { readFileSync } from 'node:fs';
let ok=0,ng=0;
const T=(n,c,note='')=>{ if(c){ok++;console.log('  ✓ '+n);} else {ng++;console.log('  ✗ '+n+(note?'  → '+note:''));} };
const G = GOC + '/';

const ping = require(G + 'api/ping.js');
const res = () => { const o = { ma:0, than:null,
  status(c){ o.ma = c; return o; }, json(v){ o.than = v; return o; },
  setHeader(){ return o; }, end(){ return o; }, send(){ return o; } }; return o; };
const soi = async () => { const r = res();
  await ping({ method:'GET', query:{ soi_so:'1' }, headers:{} }, r); return r.than; };

console.log('\n① CHƯA KHAI SHEET_URL → nói thẳng, không im');
{
  delete process.env.SHEET_URL;
  const t = await soi();
  T('báo đúng bước đang tắc', t && t.ok === false && t.buoc === 'SHEET_URL', JSON.stringify(t));
  T('nhắc luôn chuyện quên Redeploy', /Redeploy/.test((t && t.vi) || ''), t && t.vi);
}

console.log('\n② ĐỊA CHỈ THIẾU ?k= → chỉ đúng chỗ sửa');
{
  process.env.SHEET_URL = 'https://gia-lap/exec';
  global.fetch = async () => ({ status:200, text: async () => '{"ok":false,"ly_do":"sai ma"}' });
  const t = await soi();
  T('thấy là thiếu mã bảo vệ', t && t.co_ma_bao_ve === false, JSON.stringify(t && t.co_ma_bao_ve));
  T('chỉ đúng bước 5 của tài liệu', /\?k=/.test((t && t.vi) || ''), t && t.vi);
}

console.log('\n③ MÃ BẢO VỆ SAI → phân biệt được với thiếu mã');
{
  process.env.SHEET_URL = 'https://gia-lap/exec?k=sai-roi';
  global.fetch = async () => ({ status:200, text: async () => '{"ok":false,"ly_do":"sai ma"}' });
  const t = await soi();
  T('biết là có mã nhưng mã khác', t && t.co_ma_bao_ve === true && t.ok === false);
  T('chỉ sang MA_BAO_VE trong Code.gs', /MA_BAO_VE/.test((t && t.vi) || ''), t && t.vi);
}

console.log('\n④ APPS SCRIPT CHẶN NGƯỜI LẠ → chỉ đúng ô cần đổi');
{
  process.env.SHEET_URL = 'https://gia-lap/exec?k=dung';
  global.fetch = async () => ({ status:403, text: async () => 'Unauthorized' });
  const t = await soi();
  T('nhận ra là chuyện quyền truy cập', /Anyone/.test((t && t.vi) || ''), t && t.vi);
}

console.log('\n⑤ CHẠY ĐƯỢC → nói rõ đi xem dòng nào');
{
  process.env.SHEET_URL = 'https://gia-lap/exec?k=dung';
  global.fetch = async () => ({ status:200, text: async () => '{"ok":true}' });
  const t = await soi();
  T('báo ok', t && t.ok === true, JSON.stringify(t));
  T('chỉ chỗ kiểm chứng trong Sheet', /tu_soi/.test((t && t.vi) || ''), t && t.vi);
}

console.log('\n⑥ MẤT MẠNG GIỮA CHỪNG → vẫn trả lời, không ngã');
{
  process.env.SHEET_URL = 'https://gia-lap/exec?k=dung';
  global.fetch = async () => { throw new Error('getaddrinfo ENOTFOUND'); };
  const t = await soi();
  T('bắt được lỗi mạng và nói ra', t && t.ok === false && t.buoc === 'mang', JSON.stringify(t));
}

console.log('\n⑦ ĐƯỜNG CHÉP THƯỜNG KHÔNG CÒN CÂM');
{
  const p = readFileSync(G + 'api/ping.js', 'utf8');
  const t = readFileSync(G + 'api/thu.js', 'utf8');
  T('ping.js ghi kết quả chép vào log', /console\.log\('\[SHEET\]', r\.status/.test(p));
  T('ping.js ghi cả khi hỏng',        /\[SHEET\] hỏng:/.test(p));
  T('ping.js nói khi chưa khai biến', /chưa khai SHEET_URL/.test(p));
  T('thu.js cũng vậy',                /\[SHEET\/thu\]/.test(t));
  T('KHÔNG còn nhánh nuốt lỗi trơn',  !/\}\)\.catch\(\(\) => \{\}\);/.test(p + t));
}

console.log('\nTỔNG: '+ok+' đạt / '+ng+' hỏng');
process.exit(ng?1:0);
