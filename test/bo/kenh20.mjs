/* ĐỢT 20 · MỌI SỰ KIỆN PHẢI RA ĐÚNG TRANG, TRÊN MỌI KÊNH
   Bệnh: "tracking lẫn lộn giữa hồ sơ phi đoàn và bản đồ tác chiến. Mission 3
   nằm ở hồ sơ phi đoàn nhé."
   Gốc: máy chủ đoán trang theo TIỀN TỐ tên sự kiện, mà 15/25 tên của Hồ sơ Phi
   đoàn không có tiền tố nào — rơi hết vào nhánh chót 'ban-do'. */
import { readFileSync } from 'node:fs';
import { GOC, require } from '../chung.mjs';
const G = GOC + '/';
let ok=0,ng=0;
const T=(n,c,note='')=>{ if(c){ok++;console.log('  ✓ '+n);} else {ng++;console.log('  ✗ '+n+(note?'  → '+note:''));} };

/* ⚠ MÁY CHỦ CÓ VAN CHỐNG SPAM: 25 tin mỗi phút. Bộ này bắn hàng trăm phát nên
   đụng trần ngay, và mọi phép sau đó đều "im" — nhìn như hỏng hết. Đẩy đồng hồ
   đi 61 giây trước mỗi phát để van tự mở lại; đó cũng đúng là cách van được
   thiết kế để hoạt động. */
let gioGia = Date.now();
const nowThat = Date.now;
Date.now = () => gioGia;
const nhichGio = () => { gioGia += 61000; };

process.env.NOTIFY_KIND='telegram'; process.env.TG_TOKEN='thu'; process.env.TG_CHAT='0';
delete process.env.SHEET_URL;
const handler = require(G + 'api/ping.js');
let bat=null;
global.fetch = async (u,o)=>{ try{ bat=JSON.parse(o.body).text; }catch(e){ bat=null; } return {ok:true}; };
let n=0;
async function ban(body){
  bat=null; nhichGio();
  const res={status(){return this;},json(){return this;},setHeader(){return this;},end(){return this;},send(){return this;}};
  await handler({ method:'POST', body:Object.assign({detail:'thu-'+(++n)}, body), headers:{}, query:{} }, res);
  return bat;
}
async function banAnh(q){
  bat=null; nhichGio();
  const res={status(){return this;},json(){return this;},setHeader(){return this;},end(){return this;},send(){return this;}};
  await handler({ method:'GET', query:Object.assign({detail:'anh-'+(++n)}, q), headers:{} }, res);
  return bat;
}

/* Gom tên sự kiện THẲNG TỪ MÃ NGUỒN từng trang — khỏi chép tay rồi lệch */
const TRANG = [
  ['ban-do',   'index.html',              'BẢN ĐỒ TÁC CHIẾN'],
  ['dad-a',    'dad/950901-a/index.html', 'HỒ SƠ PHI ĐOÀN'],
  ['dad-b',    'dad/950901-b/index.html', 'EASTER EGG · GATE 2'],
  ['han-a',    'han/961030-a/index.html', "ZOEY'S CASTLE"],
  ['han-b',    'han/961030-b/index.html', "HONGHAN'S SECRET CHAMBER"],
  ['phao-hoa', 'phao-hoa/index.html',     'MÀN PHÁO HOA']
];
/* ⚠ DÒ CẢ HAI DẠNG GỌI. Ngoài `ping('ten', …)` còn có dạng biểu thức điều
   kiện `ping(co ? 'a' : 'b', …)` — chính dạng đó giấu mất `giai_m3` / `skip_m3`
   (phá đảo Mission 3) khỏi lần soát trước, nên chúng báo nhầm trang mà không
   bộ kiểm nào thấy. */
const dsSuKien = f => {
  const src = readFileSync(G+f,'utf8');
  const ds = (src.match(/ping\(\s*(?:[^)'"]*\?[^)]*?)?'([a-z0-9_]+)'/g) || [])
    .map(x => (x.match(/'([a-z0-9_]+)'$/) || [])[1]).filter(Boolean);
  for(const m of src.matchAll(/ping\([^)]*\?\s*'([a-z0-9_]+)'\s*:\s*'([a-z0-9_]+)'/g)){
    ds.push(m[1], m[2]);
  }
  /* Dạng thứ ba: dựng thẳng thân tín hiệu, không đi qua `ping()`. Chỉ có một
     chỗ — cú chuyển hướng lúc bản đồ vừa mở (`redirect_ho_so`), chạy trước cả
     lúc hàm `ping()` kịp khai. */
  for(const m of src.matchAll(/\bev\s*:\s*'([a-z0-9_]+)'/g)) ds.push(m[1]);
  return [...new Set(ds)];
};
/* Tên bắn từ nhiều hơn một trang thì đoán kiểu gì cũng có chỗ trật — bỏ ra,
   mấy trang đó đều tự khai `trang` ở kênh chính rồi. */
const dem = {};
for(const [,f] of TRANG) for(const e of dsSuKien(f)) dem[e] = (dem[e]|0) + 1;
const dungChung = Object.keys(dem).filter(e => dem[e] > 1);

console.log('\n① ĐOÁN TRANG khi kênh dự phòng không khai được `trang`');
console.log('   (tên dùng chung nhiều trang, cố ý không soi: ' + dungChung.join(', ') + ')');
const src = readFileSync(G+'api/ping.js','utf8');
const coNhan = e => new RegExp('^\\s*' + e + ':', 'm').test(src);
for(const [ma, f, ten] of TRANG){
  const ds = dsSuKien(f).filter(e => !dungChung.includes(e));
  const bo = [];
  for(const ev of ds){
    if(!coNhan(ev)) continue;                    /* chưa khai nhãn thì máy chủ im, không gửi */
    const t = await ban({ ev });                 /* CỐ Ý không khai `trang` */
    if(!t || t.split('\n')[0] !== ten) bo.push(ev + '→' + (t ? t.split('\n')[0] : 'im'));
  }
  T(ten.padEnd(24) + ' ' + ds.filter(coNhan).length + ' sự kiện đều đoán ra đúng trang',
    bo.length === 0, bo.join(' , '));
}

console.log('\n② MISSION 3 nằm ở HỒ SƠ PHI ĐOÀN — đúng chỗ người chơi chỉ ra');
for(const [ev, ghi] of [['mo_pha_map','phá đảo Mission 3'], ['test_unlock','tua giờ Mission 3'],
                        ['sos_hint','gợi ý Mission 3'], ['reset_msn','chơi lại Mission'],
                        ['sai_pin','sai mã Mission'], ['khoa_pin','khoá cửa Mission']]){
  const t = await ban({ ev });
  T('"'+ev+'" ('+ghi+') → HỒ SƠ PHI ĐOÀN',
    !!t && t.split('\n')[0] === 'HỒ SƠ PHI ĐOÀN', t && t.split('\n')[0]);
}

console.log('\n③ KÊNH ẢNH (lúc fetch bị chặn) cũng mang được `trang` / `noi` / `tt`');
{
  const t = await banAnh({ ev:'mo_pha_map', trang:'dad-a', noi:'Mission 3', tt:'M1 ✓ · M2 ✓ · M3 ✓' });
  const d = (t||'').split('\n');
  /* Từ đợt 23 kênh ảnh tự khai `kenh='anh'`, nên dòng đầu có thêm dấu "[anh]"
     ở cuối — CỐ Ý vậy: đọc chuông là biết ngay tín hiệu này đi đường vòng vì
     máy người chơi chặn fetch. Soi phần đầu, đừng soi bằng dấu bằng. */
  T('dòng đầu đúng trang + chỗ đứng', d[0].startsWith('HỒ SƠ PHI ĐOÀN · Mission 3'), d[0]);
  T('dòng đầu tự khai là đi đường vòng', / \[anh\]$/.test(d[0]), d[0]);
  T('dòng trạng thái đi theo', d[2] === 'M1 ✓ · M2 ✓ · M3 ✓', d[2]);
  const t2 = await banAnh({ ev:'mo_pha_map' });        /* không khai gì → phải đoán đúng */
  T('không khai gì thì vẫn đoán ra HỒ SƠ PHI ĐOÀN',
    !!t2 && t2.split('\n')[0].startsWith('HỒ SƠ PHI ĐOÀN'), t2 && t2.split('\n')[0]);
}

console.log('\n④ CẢ BA KÊNH của Hồ sơ Phi đoàn đều khai `trang`');
{
  const hs = readFileSync(G+'dad/950901-a/index.html','utf8');
  T('kênh chính (JSON) khai trang', /trang:'dad-a'/.test(hs));
  T('kênh biểu mẫu khai trang',     /them\('trang', 'dad-a'\)/.test(hs));
  T('kênh ảnh khai trang',          /&trang=dad-a/.test(hs));
  const bd = readFileSync(G+'index.html','utf8');
  T('bản đồ · kênh chính khai trang', /trang: 'ban-do'/.test(bd));
  T('bản đồ · kênh ảnh khai trang',   /&trang=ban-do/.test(bd));
}

console.log('\n⑤ THÊM SỰ KIỆN MỚI MÀ QUÊN KHAI → phải lộ ra ngay');
{
  const t = await ban({ ev:'mot_su_kien_hoan_toan_moi' });
  T('sự kiện lạ thì máy chủ IM, không bịa một trang', t === null, String(t));
}

console.log('\n⑥ MỌI SỰ KIỆN CÓ BẮN ĐỀU PHẢI CÓ NHÃN');
/* Thiếu nhãn thì api/ping.js chỉ ghi log rồi thôi — tín hiệu bắn ra mà KHÔNG
   BAO GIỜ tới chuông, và không có gì báo cho biết. Sáu cái từng lọt lưới đúng
   kiểu đó, trong đó có hai mốc phá đảo Mission 3 và hai cửa hậu. */
{
  const blk = src.slice(src.indexOf('const NHAN = {'));
  const nhan = new Set([...blk.slice(0, blk.indexOf('\n};')).matchAll(/^\s*([a-z0-9_]+)\s*:/gm)].map(m=>m[1]));
  const thieu = [];
  for(const [ma, f] of TRANG) for(const e of dsSuKien(f)) if(!nhan.has(e)) thieu.push(ma+'/'+e);
  T('không sự kiện nào bắn ra mà thiếu nhãn', thieu.length === 0, thieu.join(' , '));
  /* Và ngược lại: mọi tên đã khai trong CHU_TRANG phải là tên có thật */
  const co = new Set(); for(const [,f] of TRANG) for(const e of dsSuKien(f)) co.add(e);
  const bang = [...src.matchAll(/gan\('[a-z-]+',\s*`?'?([\s\S]*?)`?'?\);/g)]
    .flatMap(m => m[1].split(/\s+/)).filter(x => /^[a-z0-9_]+$/.test(x));
  const thua = bang.filter(e => !co.has(e));
  T('bảng CHU_TRANG không khai tên ma (trang nào cũng không bắn)', thua.length === 0, thua.join(' , '));
}

console.log('\nTỔNG: '+ok+' đạt / '+ng+' hỏng');
process.exit(ng?1:0);
