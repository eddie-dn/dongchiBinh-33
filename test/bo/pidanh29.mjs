/* ĐỢT 29 · PÍ DANH ĐI THEO NGƯỜI — cho mã THẬT chạy qua một cuốn sổ giả */
import { GOC, require } from '../chung.mjs';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
let ok=0,ng=0;
const T=(n,c,note='')=>{ if(c){ok++;console.log('  ✓ '+n);} else {ng++;console.log('  ✗ '+n+(note?'  → '+note:''));} };

/* ── Sheet giả, lần này ĐỌC ĐƯỢC (bản trong docs/mau-so.mjs chỉ ghi được) ── */
function sheetGia(){
  const cot = [], dong = [];
  const o = {
    _cot: cot, _dong: dong,
    getLastColumn: () => cot.length,
    getLastRow: () => (cot.length ? dong.length + 1 : 0),
    appendRow(d){ cot.length ? dong.push(d.slice()) : cot.push(...d); },
    setFrozenRows(){ return o; },
    getRange(h, c, r, n){
      return {
        setValues(v){
          if(h === 1){ for(let i=0;i<n;i++) cot[c-1+i] = v[0][i]; return this; }
          const d = dong[h-2] || (dong[h-2] = []);
          for(let i=0;i<n;i++) d[c-1+i] = v[0][i];
          return this;
        },
        getValues(){
          const ra = [];
          for(let i=0;i<r;i++){
            const d = dong[h-2+i] || [];
            ra.push(d.slice(c-1, c-1+n));
          }
          return ra;
        },
        setFontWeight(){ return this; }
      };
    }
  };
  return o;
}
const kho = {};
const cg = readFileSync(join(GOC,'docs/apps-script/Code.gs'),'utf8');
const AS = new Function('SpreadsheetApp','ContentService',
  cg + '\nreturn { doPost:doPost, doGet:doGet, COT:COT, chuanTen:chuanTen };')(
  { getActiveSpreadsheet: () => ({ getSheetByName: n => kho[n] || null,
                                   insertSheet: n => (kho[n] = sheetGia()) }) },
  { createTextOutput: t => ({ setMimeType: () => t }), MimeType:{ JSON:'json' } });
const MA = (cg.match(/var MA_BAO_VE = '([^']*)'/) || [,''])[1];

/* ── Thay `fetch` để mọi cú gọi sang "Apps Script" rơi vào bản giả ở trên ── */
const DIA = 'https://script.google.com/macros/s/GIA/exec?k=' + MA;
const thatFetch = global.fetch;
global.fetch = async (url, opt) => {
  const u = new URL(String(url));
  const par = Object.fromEntries(u.searchParams.entries());
  const chu = (opt && opt.method === 'POST')
    ? AS.doPost({ parameter: par, postData:{ contents: opt.body } })
    : AS.doGet({ parameter: par });
  return { status:200, text: async () => String(chu) };
};
process.env.SHEET_URL = DIA;
const pidanh = require(join(GOC,'api/pidanh.js'));
const res = () => { const r = { _m:0, _d:null,
  status(c){ r._m = c; return r; }, json(d){ r._d = d; return r; } }; return r; };
const goi = async (req) => { const r = res(); await pidanh(req, r); return r._d; };

const SNAP = { msn1:{ v:3, m1:true, m2:true, m3:true, reset:2 },
               mtv1:{ solved:{DAD:'x',HAN:'x'}, resetCount:1 },
               hanv1:{ pos:2, dung:{q1:true} } };

console.log('\n① CẤT rồi TRA lại — vòng đi vòng về');
{
  const a = await goi({ method:'POST', headers:{}, body:{ ten:'zoey', moc:'M3 ✦', goi:SNAP } });
  T('cất được', a && a.ok === true, JSON.stringify(a));
  const b = await goi({ method:'GET', query:{ ten:'zoey' } });
  T('tra ra đúng pí danh', b && b.co === true, JSON.stringify(b).slice(0,120));
  T('bản chụp về nguyên vẹn cả ba chặng',
    b.goi && b.goi.msn1 && b.goi.mtv1 && b.goi.hanv1, JSON.stringify(b.goi||{}).slice(0,90));
  T('giữ đúng từng trường bên trong',
    b.goi.msn1.m3 === true && b.goi.msn1.reset === 2 && b.goi.mtv1.resetCount === 1);
  T('mốc đi kèm', String(b.moc).indexOf('M3') >= 0, String(b.moc));
}

console.log('\n② TÊN CHUẨN HOÁ — hoa/thường/khoảng trắng đều ra một người');
{
  for(const t of ['ZOEY','  zoey ','Zoey']){
    const r = await goi({ method:'GET', query:{ ten:t } });
    T('tra "' + t + '" vẫn ra đúng người', r && r.co === true);
  }
  T('hai bên chuẩn hoá GIỐNG NHAU', AS.chuanTen('  ZoEy ') === 'zoey');
}

console.log('\n③ GHI ĐÈ, KHÔNG ĐẺ THÊM DÒNG');
{
  const truoc = kho['Pí danh']._dong.length;
  await goi({ method:'POST', headers:{}, body:{ ten:'zoey', moc:'M3 ✦✦',
    goi: Object.assign({}, SNAP, { mtv1:{ solved:{DAD:'x',HAN:'x',UIH:'x',SGN:'x'}, resetCount:3 } }) } });
  T('vẫn đúng một dòng cho một pí danh', kho['Pí danh']._dong.length === truoc,
    truoc + ' → ' + kho['Pí danh']._dong.length);
  const r = await goi({ method:'GET', query:{ ten:'zoey' } });
  T('tra ra bản MỚI chứ không phải bản cũ', r.goi.mtv1.resetCount === 3, JSON.stringify(r.goi.mtv1));
  T('mốc cũng cập nhật theo', String(r.moc).indexOf('✦✦') >= 0, String(r.moc));
}

console.log('\n④ TÊN LẠ — trả lời gọn, KHÔNG coi là lỗi');
{
  const r = await goi({ method:'GET', query:{ ten:'chua-ai-dung-ten-nay' } });
  T('ok vẫn true', r && r.ok === true, JSON.stringify(r));
  T('nhưng co = false', r && r.co === false);
  const r2 = await goi({ method:'GET', query:{} });
  T('thiếu tên thì báo thiếu tên', r2 && r2.ok === false && /thieu ten/.test(r2.ly_do||''));
}

console.log('\n⑤ CHƯA BẬT ĐỒNG BỘ — trang vẫn phải sống');
{
  const giu = process.env.SHEET_URL;
  delete process.env.SHEET_URL;
  const r = await goi({ method:'GET', query:{ ten:'zoey' } });
  T('trả 200 kèm cờ chưa bật, không phải lỗi 500',
    r && r.ok === false && r.chua_bat === true, JSON.stringify(r));
  process.env.SHEET_URL = giu;
}

console.log('\n⑥ CỬA TRA CÓ KIỂM MÃ BẢO VỆ');
{
  /* ⚠ `doGet` đời trước trả lời cho BẤT CỨ AI. Nay nó đọc được bản lưu — tức
     là toàn bộ tiến độ — nên phải kiểm mã y như `doPost`. */
  const chu = String(AS.doGet({ parameter:{ ten:'zoey' } }));
  T('gõ đúng tên mà thiếu mã thì bị chặn', /sai ma/.test(chu), chu.slice(0,80));
  const chu2 = String(AS.doGet({ parameter:{} }));
  T('không hỏi gì thì vẫn chào bình thường', /dang chay/.test(chu2), chu2.slice(0,80));
}

console.log('\n⑦ PHÍA TRANG — có hạn giờ và hỏng thì im');
{
  const s = readFileSync(join(GOC,'dad/950901-a/index.html'),'utf8');
  T('có đường đẩy lên kho', /function dayLenKho/.test(s));
  T('gộp nhiều cú lưu liền nhau', /function henDayLenKho/.test(s));
  T('có hạn giờ 6 giây khi tra', /setTimeout\(function\(\)\{ ket\(null\); \}, 6000\)/.test(s));
  T('khai danh hỏi kho trước khi dựng hồ sơ trống', /traTuKho\(name, function\(kho\)/.test(s));
  T('tìm thấy thì nạp bản cũ', /profLoad\(navRead\(\), nav\.active\)/.test(s));
  T('mỗi lần lưu đều đẩy lên', /henDayLenKho\(p\.name, p\.moc, p\.snap\)/.test(s));
}

global.fetch = thatFetch;
console.log('\n' + (ng ? '✗ ' + ng + ' hỏng / ' : '✓ ') + ok + ' đạt');
process.exit(ng ? 1 : 0);
