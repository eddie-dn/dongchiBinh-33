/* ĐỢT 27 · KIỂM KÊ TÀI NGUYÊN · TÀI LIỆU KHÔNG CHÉP SỐ HIỆU · CHỮ Ở CỔNG */
import { GOC } from '../chung.mjs';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
let ok=0,ng=0;
const T=(n,c,note='')=>{ if(c){ok++;console.log('  ✓ '+n);} else {ng++;console.log('  ✗ '+n+(note?'  → '+note:''));} };

const doc = f => readFileSync(join(GOC, f), 'utf8');
const TRANG = ['index.html','dad/950901-a/index.html','dad/950901-b/index.html',
               'han/961030-a/index.html','han/961030-b/index.html','phao-hoa/index.html'];
const ls  = doc('assets/lichsu.js');
/* Khối Credit — cắt từ `CRE_CHUNG` tới bảng chi phí. */
const CRE = ls.slice(ls.indexOf('var CRE_CHUNG = ['), ls.indexOf('var CRE_TIEN'));

console.log('\n① PHÔNG CHỮ — trang nào nạp thì Credit phải có tên');
{
  const hoc = new Set();
  for(const f of TRANG)
    for(const m of doc(f).matchAll(/family=([A-Za-z+0-9]+)/g))
      hoc.add(m[1].replace(/\+/g,' '));
  T('quét ra được danh sách phông', hoc.size >= 4, [...hoc].join(', '));
  for(const p of [...hoc].sort())
    T('Credit có nhắc "' + p + '"', CRE.includes(p));
}

console.log('\n② DỊCH VỤ NGOÀI — thứ người chơi dùng thì phải ghi công');
{
  /* CỐ Ý KHÔNG kiểm mấy đường đo đạc / ghi nhận (chuông báo, sổ lưu):
     luật viết Credit cấm nhắc tới chúng — xem DESIGN-SYSTEM mục 7. */
  const canGhi = { 'api.resend.com':'Resend', 'formsubmit.co':'FormSubmit',
                   'generativelanguage.googleapis.com':'Gemini' };
  const api = readdirSync(join(GOC,'api')).filter(f=>f.endsWith('.js'))
                .map(f=>doc('api/'+f)).join('\n');
  for(const [mien, ten] of Object.entries(canGhi)){
    if(!api.includes(mien)) continue;             /* không dùng thì thôi */
    T('dùng ' + mien + ' → Credit có "' + ten + '"', CRE.includes(ten));
  }
  T('html2canvas vẫn được ghi công', CRE.includes('html2canvas'));
  T('Natural Earth ghi kèm đúng mức tỉ lệ 1:110m', /Natural Earth[^']*1:110m/.test(CRE));
  T('quả trứng ghi rõ mượn ý của Pokémon GO', /Pokémon GO/.test(CRE));
}

console.log('\n③ TÀI LIỆU KHÔNG ĐƯỢC CHÉP SỐ HIỆU ĐANG CHẠY');
{
  /* Số hiệu chỉ có một nguồn là cuốn sổ. Chép sang tài liệu là chắc chắn lỗi
     thời, mà không có gì báo — đã tái phát hai lần, lần sau lệch tới hai dòng
     lớn (README đứng V17.08 trong khi bản đồ chạy V19.08). */
  const cuon = [...ls.matchAll(/ten: '([^']+)', duong:/g)].map(m=>m.index);
  cuon.push(ls.length);
  const moiNhat = [];
  for(let i=0;i<cuon.length-1;i++){
    const v = [...ls.slice(cuon[i],cuon[i+1]).matchAll(/ver:'(V\d+\.\d+)'/g)].map(m=>m[1]);
    if(v.length) moiNhat.push(v[v.length-1]);
  }
  T('đọc được số hiệu mới nhất của các cuốn', moiNhat.length >= 6, moiNhat.join(' '));
  const rm = doc('README.md');
  const lot = moiNhat.filter(v => rm.includes(v));
  T('README không chép số hiệu đang chạy', lot.length === 0,
    lot.length ? 'lọt: ' + lot.join(', ') : '');
  T('README bỏ hẳn dòng "Phiên bản hiện tại: Vxx"', !/Phiên bản hiện tại: V\d/.test(rm));
  T('README bỏ hẳn bảng liệt kê số hiệu sáu trang',
    !/\| Bản đồ mật thư \| `\/` \| \*\*V\d/.test(rm));
  const ds = doc('DESIGN-SYSTEM.md');
  const lot2 = moiNhat.filter(v => ds.includes(v));
  T('DESIGN-SYSTEM cũng không chép', lot2.length === 0,
    lot2.length ? 'lọt: ' + lot2.join(', ') : '');
}

console.log('\n④ TÀI LIỆU TẢ ĐÚNG THỨ ĐANG CHẠY');
{
  const rm = doc('README.md');
  const idx = doc('index.html');
  T('ảnh khung Collected: tả đúng nguồn đang dùng',
    /hhSrc\('hello'\)/.test(rm) && /hhSrc\('hello'\)/.test(idx));
  T('không còn nói ảnh đó nằm ở /han/honghan.jpg',
    !/`\.cred-hero` — ảnh ở `\/han\/honghan\.jpg`/.test(rm));
}

console.log('\n⑤ CHỮ Ở CỔNG GATE 2 — gọn đúng một câu');
{
  const c = doc('dad/950901-b/config.js');
  T('câu chính ngắn gọn', /chua_xong_map\s*:\s*'Giải xong Bản đồ tác chiến để vào chơi'/.test(c));
  T('bỏ dòng đếm dài dòng', /chua_xong_map_phu\s*:\s*''/.test(c));
  T('nút chỉ còn "← Bản đồ"', /chua_xong_map_nut\s*:\s*'← Bản đồ'/.test(c));
  const g = doc('dad/950901-b/index.html');
  T('dòng phụ rỗng thì không dựng thẻ', /phu \? '<p class="cho-map">'/.test(g));
}

console.log('\n' + (ng ? '✗ ' + ng + ' hỏng / ' : '✓ ') + ok + ' đạt');
process.exit(ng ? 1 : 0);
