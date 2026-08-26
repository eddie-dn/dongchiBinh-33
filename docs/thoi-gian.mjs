#!/usr/bin/env node
/* ═══════════════════════════════════════════════════════════════════════════
   ĐO THỜI GIAN LÀM TỪ LỊCH SỬ COMMIT — `node docs/thoi-gian.mjs`

   In ra bảng để chép vào `THOI_GIAN` trong `assets/lichsu.js`.

   CÁCH ĐO: KHOẢNG ĐẦU–CUỐI. Commit sớm nhất tới commit muộn nhất, tính cả
   những ngày ở giữa. Cả bộ ra khoảng một tháng.

   Đây là CHIỀU DÀI DỰ ÁN — quãng từ lúc bắt tay tới lúc xong, chứ không phải
   số giờ ngồi trước máy. Hai thứ khác nhau và đây cố ý lấy thứ nhất: nó là
   con số nói được "làm trong bao lâu", đúng thứ trang Credit muốn kể.

   Từng trang cũng đo y vậy — commit đầu tiên và cuối cùng có đụng tới trang
   đó. Nên các trang CHỒNG LÊN NHAU về thời gian và cộng lại không ra tổng;
   chuyện đó bình thường, vì mấy phần được làm xen kẽ nhau chứ không nối đuôi.

   ⚠ CHẠY TRÊN KHO ĐÃ FETCH ĐỦ NHÁNH. Thiếu nhánh nào là hụt phần đó. Kiểm:
       git fetch --all && git rev-list --all --count                          */

import { execFileSync } from 'node:child_process';

/* Đường dẫn → khu. Xét theo thứ tự, khớp cái đầu tiên. */
const KHU = [
  ['dad/950901-a/', 'DAD-A'],
  ['dad/950901-b/', 'DAD-B'],
  ['han/961030-a/', 'HAN-A'],
  ['han/961030-b/', 'HAN-B'],
  ['phao-hoa/',     'FX'],
  ['index.html',    'MAP'],
  ['assets/',       'MAP'],
];
const khuCua = f => (KHU.find(([t]) => f.startsWith(t)) || [, 'CHUNG'])[1];

const ra = execFileSync('git', ['log', '--all', '--no-merges', '--date-order',
  '--pretty=format:@@%H|%at', '--name-only'], { encoding: 'utf8', maxBuffer: 64e6 });

const theoHash = new Map();
let cur = null;
for (const d of ra.split('\n')) {
  if (d.startsWith('@@')) {
    const [h, at] = d.slice(2).split('|');
    cur = { at: +at, khu: new Set() };
    theoHash.set(h, cur);
  } else if (d.trim() && cur) cur.khu.add(khuCua(d.trim()));
}
const cm = [...theoHash.values()].sort((a, b) => a.at - b.at);
if (!cm.length) { console.error('Không đọc được commit nào.'); process.exit(1); }

/* Khoảng đầu–cuối, tính cả những ngày ở giữa */
const trai = ds => ds.length ? Math.max(...ds) - Math.min(...ds) : 0;

/* Khuôn tiếng Việt, bỏ hẳn phần bằng 0 — "0 ngày 13 giờ" đọc rất kỳ */
function chu(g){
  const d = Math.floor(g / 86400), h = Math.floor(g % 86400 / 3600), m = Math.floor(g % 3600 / 60);
  return [d && d + ' ngày', h && h + ' giờ', m && m + ' phút'].filter(Boolean).join(' ') || '0 phút';
}
const ngay = t => new Date(t * 1000).toISOString().slice(0, 10);

const gom = {};
for (const c of cm) for (const k of c.khu) (gom[k] ||= []).push(c.at);

console.log('%s %s  %s → %s  %s', 'KHU'.padEnd(8), 'commit'.padStart(6),
  'từ'.padEnd(10), 'tới'.padEnd(10), 'kéo dài');
for (const k of ['MAP', 'DAD-A', 'DAD-B', 'HAN-A', 'HAN-B', 'FX', 'CHUNG']) {
  const ds = gom[k] || [];
  if (!ds.length) { console.log('%s %s  (không có commit nào)', k.padEnd(8), '0'.padStart(6)); continue; }
  console.log('%s %s  %s → %s  %s', k.padEnd(8), String(ds.length).padStart(6),
    ngay(Math.min(...ds)), ngay(Math.max(...ds)), chu(trai(ds)));
}
const ds = cm.map(c => c.at), T = trai(ds);
console.log('%s %s  %s → %s  %s', 'TỔNG'.padEnd(8), String(cm.length).padStart(6),
  ngay(Math.min(...ds)), ngay(Math.max(...ds)), chu(T));

console.log('\n── chép khối này vào `THOI_GIAN` trong assets/lichsu.js ──');
const q = k => `'${chu(trai(gom[k] || []))}'`;
console.log(`  var THOI_GIAN = {
    MAP:    ${q('MAP')},
    EGG:    ${q('MAP')},   /* khu Easter Egg nằm trong chính bản đồ */
    'DAD-A': ${q('DAD-A')},
    'DAD-B': ${q('DAD-B')},
    'HAN-A': ${q('HAN-A')},
    'HAN-B': ${q('HAN-B')},
    FX:     ${q('FX')},
    _TONG:  '${chu(T)}',
    _TU:    '${ngay(Math.min(...ds))}',
    _TOI:   '${ngay(Math.max(...ds))}',
    _COMMIT: ${cm.length}
  };`);
