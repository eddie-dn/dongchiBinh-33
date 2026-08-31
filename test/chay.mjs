#!/usr/bin/env node
/* ═══════════════════════════════════════════════════════════════════════════
   BỘ CHẠY — `node test/chay.mjs`

   Tự bật máy chủ tĩnh, chạy hết mọi bộ trong test/bo, in bảng tổng kết, rồi
   tắt máy chủ. Trả mã thoát khác 0 nếu có phép hỏng, để cắm vào CI được ngay.

       node test/chay.mjs                 chạy hết
       node test/chay.mjs nhap19 ow19     chạy đúng mấy bộ gọi tên
       node test/chay.mjs --cong 8123     đổi cổng
       DIA_CHI=http://… node test/chay.mjs   chạy với máy chủ có sẵn, khỏi tự bật

   ⚠ MỖI BỘ MỘT TIẾN TRÌNH RIÊNG. Chạy chung một tiến trình thì một bộ ngã là
   kéo hết phần còn lại, mà mấy bộ này còn ghi đè cả `Date.now` lẫn `fetch` —
   để chung sẽ giẫm lên nhau. Tách ra thì đắt hơn vài giây, đổi lại đọc kết
   quả là tin được.                                                           */

import { spawn } from 'node:child_process';
import { readdirSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname } from 'node:path';

const THUMUC = dirname(fileURLToPath(import.meta.url));
const GOC = join(THUMUC, '..');

const dsArg = process.argv.slice(2);
const iCong = dsArg.indexOf('--cong');
const CONG = iCong >= 0 ? +dsArg[iCong + 1] : 8099;
/* ⚠ Chỉ bỏ ô sau `--cong` KHI CÓ `--cong`. Thiếu vế đó thì `iCong` = -1, và
   `i !== iCong + 1` thành `i !== 0` — nuốt mất tham số đầu tiên, gọi tên một
   bộ mà nó chạy cả 28 bộ. */
const chon = dsArg.filter((x, i) => !x.startsWith('--') && !(iCong >= 0 && i === iCong + 1))
                  .map(x => x.replace(/\.mjs$/, ''));

/* ── THỨ TỰ CHẠY ───────────────────────────────────────────────────────────
   Xếp tay theo ĐỢT chứ không xếp theo bảng chữ cái: đọc kết quả từ trên xuống
   là thấy được lịch sử từng phần một. Bộ nào không có tên ở đây thì chạy nốt
   ở cuối — thêm bộ mới quên khai cũng không bị bỏ sót. */
const THUTU = [
  'kt','kt2','kt3','kt4','kt5','kt7','kt8','kt9','kt10','kt11',
  'pin13','pin13b','pin13c','msn13','zq13','ow13',
  'cre14','resp14','resp14b','kt15','tem16','nghi16',
  'tudien18','bao18','nhap19','ow19','kenh20','pfsave20','so21','cre21',
  'soi22','phao24','cua24',
  'nac25','cong26','nguon27','nut28','pidanh29','xoa31',
  'reset32','so32','dong33'
];
const coSan = readdirSync(join(THUMUC, 'bo')).filter(f => f.endsWith('.mjs')).map(f => f.slice(0, -4));
let ds = [...THUTU.filter(x => coSan.includes(x)), ...coSan.filter(x => !THUTU.includes(x))];
if (chon.length) ds = ds.filter(x => chon.includes(x));
if (!ds.length) { console.error('Không có bộ nào khớp:', chon.join(', ')); process.exit(2); }

/* ── MÁY CHỦ TĨNH ──────────────────────────────────────────────────────────
   Đủ dùng cho bộ kiểm, khỏi kéo thêm thư viện nào. Bỏ qua nếu người chạy đã
   khai DIA_CHI — lúc đó họ đang trỏ vào máy chủ thật của họ. */
const KIEU = { '.html':'text/html; charset=utf-8', '.js':'text/javascript; charset=utf-8',
  '.mjs':'text/javascript; charset=utf-8', '.css':'text/css; charset=utf-8',
  '.json':'application/json; charset=utf-8', '.md':'text/markdown; charset=utf-8',
  '.txt':'text/plain; charset=utf-8', '.png':'image/png', '.jpg':'image/jpeg',
  '.webp':'image/webp', '.svg':'image/svg+xml', '.ico':'image/x-icon' };

async function batMayChu(){
  if (process.env.DIA_CHI) return null;
  const may = createServer(async (req, res) => {
    try {
      let d = decodeURIComponent(req.url.split('?')[0]);
      if (d.includes('..')) { res.writeHead(403).end(); return; }
      let f = join(GOC, d);
      try { if ((await stat(f)).isDirectory()) f = join(f, 'index.html'); }
      catch (e) { res.writeHead(404).end('không có'); return; }
      const noi = await readFile(f);
      res.writeHead(200, { 'content-type': KIEU[extname(f)] || 'application/octet-stream' });
      res.end(noi);
    } catch (e) { res.writeHead(404).end('không có'); }
  });
  try {
    await new Promise((r, x) => { may.once('error', x); may.listen(CONG, '127.0.0.1', r); });
  } catch (e) {
    if (e.code !== 'EADDRINUSE') throw e;
    console.error('Cổng ' + CONG + ' đang bận rồi.\n' +
      '  · đổi cổng:            node test/chay.mjs --cong 8123\n' +
      '  · hoặc dùng máy chủ đang chạy sẵn ở đó:\n' +
      '      DIA_CHI=http://127.0.0.1:' + CONG + ' node test/chay.mjs');
    process.exit(2);
  }
  process.env.DIA_CHI = 'http://127.0.0.1:' + CONG;
  return may;
}

function chayMot(ten){
  return new Promise(xong => {
    const t0 = Date.now();
    const con = spawn(process.execPath, [join(THUMUC, 'bo', ten + '.mjs')],
      { env: process.env, stdio: ['ignore', 'pipe', 'pipe'] });
    let ra = '';
    con.stdout.on('data', c => ra += c);
    con.stderr.on('data', c => ra += c);
    const hen = setTimeout(() => { con.kill('SIGKILL'); }, 10 * 60000);
    con.on('close', ma => {
      clearTimeout(hen);
      const dong = (ra.match(/(\d+) đạt \/ (\d+) hỏng/g) || []).pop();
      const m = dong && dong.match(/(\d+) đạt \/ (\d+) hỏng/);
      const dat = m ? +m[1] : (ra.match(/✓/g) || []).length;
      const hong = m ? +m[2] : (ra.match(/✗/g) || []).length;
      xong({ ten, dat, hong: hong || (ma && !m ? 1 : 0), giay: ((Date.now() - t0) / 1000).toFixed(0),
             ma, chiTiet: (ra.match(/^.*✗.*$/gm) || []),
             vo: !m && ma !== 0 ? ra.trim().split('\n').slice(-6).join('\n') : '' });
    });
  });
}

const may = await batMayChu();
console.log('Máy chủ: ' + process.env.DIA_CHI + (may ? '' : '  (có sẵn, không tự bật)'));
console.log('Chạy ' + ds.length + ' bộ\n');

let tong = 0, xau = 0;
const vo = [];
for (const ten of ds) {
  const k = await chayMot(ten);
  tong += k.dat; xau += k.hong;
  process.stdout.write(
    (k.hong ? '✗ ' : '✓ ') + k.ten.padEnd(10) + String(k.dat).padStart(3) + ' đạt' +
    (k.hong ? '  ' + k.hong + ' HỎNG' : '        ') + '  ' + String(k.giay).padStart(3) + 's\n');
  for (const d of k.chiTiet) console.log('     ' + d.trim());
  if (k.vo) { vo.push(k.ten); console.log('     ── bộ này VỠ, sáu dòng cuối:\n' +
    k.vo.split('\n').map(x => '     │ ' + x).join('\n')); }
}
if (may) may.close();

console.log('\n────────────────────────────────');
console.log('TỔNG: ' + tong + ' phép đạt · ' + xau + ' hỏng' + (vo.length ? ' · ' + vo.length + ' bộ vỡ' : ''));
process.exit(xau || vo.length ? 1 : 0);
