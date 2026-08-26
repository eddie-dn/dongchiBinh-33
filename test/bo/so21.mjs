/* ĐỢT 21 · SỔ LƯU GOOGLE SHEETS NHẬN ĐỦ CHƯA
   Ba câu hỏi được đặt ra, ba câu trả lời khác nhau — bộ này chốt cả ba:
     · ba cột trang/noi/tt: máy chủ GỬI từ đợt 18, nhưng bảng cột của Apps
       Script thiếu tên nên chúng rơi vào hư không, KHÔNG có gì báo.
     · nội dung hỏi/đáp Open World: có đường, nhưng tắt sẵn, phải tự bật.
     · lời nhắn "tâm tư": trước đây KHÔNG hề chép về sổ, chỉ email + Telegram. */
import { GOC, require } from '../chung.mjs';
import { readFileSync } from 'node:fs';
let ok=0,ng=0;
const T=(n,c,note='')=>{ if(c){ok++;console.log('  ✓ '+n);} else {ng++;console.log('  ✗ '+n+(note?'  → '+note:''));} };
const G = GOC + '/';
const cg = readFileSync(G+'docs/apps-script/Code.gs','utf8');
/* Đọc bảng cột của Apps Script — chính chỗ quyết định trường nào được ghi */
function cot(tab){
  const kh = cg.slice(cg.indexOf('var COT = {'));
  const d  = kh.slice(0, kh.indexOf('\n};'));
  const m  = d.match(new RegExp("'" + tab + "'\\s*:\\s*\\[([\\s\\S]*?)\\]"));
  return m ? [...m[1].matchAll(/'([a-z_]+)'/g)].map(x=>x[1]) : [];
}

console.log('\n① BA CỘT trang / noi / tt — máy chủ gửi thì sổ phải nhận');
{
  const ping = readFileSync(G+'api/ping.js','utf8');
  const guiDi = ['trang','noi','tt'].filter(k => new RegExp('\\b'+k+',?\\s*$|'+k+'[,:]').test(ping));
  T('máy chủ có gửi ba trường', /trang: trang \|\| doanTrang\(ev\)/.test(ping) || /trang,\s*noi,\s*tt/.test(ping),
    'không thấy trong chepVeSheet');
  const c = cot('Tiến độ');
  for(const k of ['trang','noi','tt'])
    T('cột "'+k+'" có trong bảng của Apps Script', c.includes(k), 'cột hiện có: '+c.join(', '));
}

console.log('\n② NỘI DUNG HỎI / ĐÁP của Open World');
{
  const chat = readFileSync(G+'api/chat.js','utf8');
  const c = cot('Chat');
  T('cột "hoi" và "dap" có sẵn trong sổ', c.includes('hoi') && c.includes('dap'), c.join(', '));
  T('mặc định TẮT — phải tự bật CHAT_LOG_NOI_DUNG=1',
    /CHAT_LOG_NOI_DUNG === '1'/.test(chat));
  T('bật lên thì mới kèm nội dung', /LOG_NOI_DUNG \? \{ hoi: hoi, dap: raChu \} : \{\}/.test(chat));
}

console.log('\n③ LỜI NHẮN "tâm tư" — trước đây không hề vào sổ');
{
  const thu = readFileSync(G+'api/thu.js','utf8');
  T('có hàm chép về sổ', /function chepVeSheet/.test(thu));
  T("khai đúng loại 'thu'", /loai: 'thu'/.test(thu));
  T('chép cả khi quá trần chống spam (sổ phải đủ, chuông mới cần lọc)',
    /chepVeSheet\(\{ at, tu, loi, da_gui: 'qua-tran'/.test(thu));
  T('chép sau khi gửi xong', /chepVeSheet\(\{ at, tu, loi, da_gui: xong/.test(thu));
  T('KHÔNG await — hỏng sổ không được làm phiền người gửi',
    !/await chepVeSheet/.test(thu));
  const c = cot('Thư');
  T('Apps Script có tab "Thư" đủ cột', c.includes('loi') && c.includes('tu') && c.includes('at'),
    c.join(', '));
  T('doPost xếp đúng gói loai=thu vào tab đó', /goi\.loai === 'thu'\)\s*\? 'Thư'/.test(cg));
}

console.log('\n④ Thêm cột thì phải nối vào CUỐI, không đổi thứ tự cột cũ');
{
  const c = cot('Tiến độ');
  T('bốn cột đời đầu vẫn đứng đầu, đúng thứ tự',
    c[0]==='at' && c[1]==='ev' && c[2]==='nhan' && c[3]==='detail', c.join(', '));
  T('Apps Script có nhắc luật đó', /Đừng đổi THỨ TỰ cột cũ/.test(cg));
}

console.log('\nTỔNG: '+ok+' đạt / '+ng+' hỏng');
process.exit(ng?1:0);
