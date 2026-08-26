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

console.log('\n④ THÊM CỘT PHẢI NỐI VÀO CUỐI — sheet đang chạy không tự sắp lại');
{
  /* BỆNH ĐÃ SỬA: đợt 21 chèn ba cột mới vào GIỮA, ngay sau `detail`. Sheet
     đang chạy có sẵn tám cột theo thứ tự cũ, mà dòng mới ghi theo thứ tự mới
     → `trang` rơi xuống dưới tiêu đề "solved", cả bảng lệch mà nhìn vẫn ra dữ
     liệu. Phép dưới đây soi đúng chuyện đó: TÁM CỘT ĐỜI ĐẦU phải giữ nguyên
     đúng vị trí cũ, cột mới xếp sau. */
  const CU = ['at','ev','nhan','detail','solved','so_giai','kenh','may'];
  const c = cot('Tiến độ');
  const lech = CU.map((k,i) => c[i] === k ? null : `#${i} phải là "${k}", đang là "${c[i]}"`)
                 .filter(Boolean);
  T('tám cột đời đầu giữ nguyên đúng vị trí', lech.length === 0, lech.join(' , '));
  T('ba cột mới xếp SAU tám cột đó',
    c.indexOf('trang') >= CU.length && c.indexOf('noi') >= CU.length && c.indexOf('tt') >= CU.length,
    c.join(', '));
  T('Apps Script có nhắc luật đó', /Đừng đổi THỨ TỰ cột cũ/.test(cg));
}

console.log('\n⑤ TAB VÀ TIÊU ĐỀ TỰ MỌC — không phải gõ tay gì trên Google');
{
  /* Chạy thật hàm `layTab` của Apps Script trong một cái Sheet giả, để soi
     đúng hai cảnh: tab chưa có, và tab CÓ RỒI mà thiếu cột mới. */
  function sheetGia(tieuDe){
    const oCot = tieuDe ? [...tieuDe] : [];
    return {
      _cot: oCot, _dong: [], _dam: 0,
      getLastColumn: () => oCot.length,
      appendRow(d){ if(!oCot.length) oCot.push(...d); else this._dong.push(d); },
      setFrozenRows(){}, 
      getRange(h, c, _r, n){
        const self = this;
        return { setValues(v){ for(let i=0;i<n;i++) oCot[c-1+i] = v[0][i];
                               return this; },
                 setFontWeight(){ self._dam++; return this; } };
      }
    };
  }
  const src = readFileSync(G+'docs/apps-script/Code.gs','utf8');
  const than = src.slice(src.indexOf('function layTab'));
  const layTab = new Function('COT', 'SpreadsheetApp',
    than.slice(0, than.indexOf('\nfunction traLoi')) + '\nreturn layTab;');
  const COT = { 'Tiến độ': cot('Tiến độ'), 'Thư': cot('Thư') };

  /* ① tab chưa có → dựng kèm đủ tiêu đề */
  let kho = {};
  let ham = layTab(COT, { getActiveSpreadsheet: () => ({
    getSheetByName: n => kho[n] || null,
    insertSheet: n => (kho[n] = sheetGia(null)) }) });
  let sh = ham('Thư');
  T('tab chưa có → tự dựng, tự ghi đủ tiêu đề',
    sh._cot.join(',') === COT['Thư'].join(','), sh._cot.join(','));

  /* ② tab CÓ RỒI nhưng còn tiêu đề đời cũ → phải viết nốt mấy cột thiếu */
  const CU = ['at','ev','nhan','detail','solved','so_giai','kenh','may'];
  kho = { 'Tiến độ': sheetGia(CU) };
  ham = layTab(COT, { getActiveSpreadsheet: () => ({
    getSheetByName: n => kho[n] || null,
    insertSheet: n => (kho[n] = sheetGia(null)) }) });
  sh = ham('Tiến độ');
  T('sheet cũ thiếu cột → tự viết nốt tiêu đề còn thiếu',
    sh._cot.join(',') === COT['Tiến độ'].join(','), sh._cot.join(','));
  T('  và KHÔNG đụng vào tám ô tiêu đề đã có',
    sh._cot.slice(0, 8).join(',') === CU.join(','), sh._cot.slice(0,8).join(','));

  /* ③ tab đã đủ cột → không đụng gì nữa */
  kho = { 'Tiến độ': sheetGia(COT['Tiến độ']) };
  ham = layTab(COT, { getActiveSpreadsheet: () => ({
    getSheetByName: n => kho[n] || null,
    insertSheet: n => (kho[n] = sheetGia(null)) }) });
  sh = ham('Tiến độ');
  T('tab đã đủ cột → không viết lại lần nữa', sh._dam === 0, 'ghi đè ' + sh._dam + ' lần');
}

console.log('\nTỔNG: '+ok+' đạt / '+ng+' hỏng');
process.exit(ng?1:0);
