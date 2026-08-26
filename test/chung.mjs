/* ═══════════════════════════════════════════════════════════════════════════
   LỚP CHUNG CỦA BỘ KIỂM — chỗ duy nhất biết máy đang chạy trông ra sao

   Mọi bộ kiểm đều đi qua đây, và đây là lý do:

   ĐỜI TRƯỚC MỖI BỘ TỰ GHI CỨNG BA THỨ trong mã của nó —
       import { chromium } from '/opt/node22/lib/node_modules/playwright/…'
       executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome'
       const B = 'http://127.0.0.1:8099'
   Cả ba đều là chuyện của MÁY, không phải chuyện của bộ kiểm. Đổi máy, nâng
   Playwright lên bản khác, hay chỉ cần số hiệu Chromium nhích một nấc là cả
   28 bộ chết cùng lúc, mà lỗi báo ra thì trông như trang web hỏng chứ không
   như bộ kiểm hỏng. Nay ba thứ đó nằm ở một chỗ, dò được thì dò, không thì
   báo đúng câu cần báo.                                                      */

import { readdirSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { createRequire } from 'node:module';

/* Gốc kho mã — suy từ vị trí chính file này, không ghi cứng đường nào */
export const GOC = join(dirname(fileURLToPath(import.meta.url)), '..');
export const require = createRequire(join(GOC, 'package.json'));

/* Địa chỉ máy chủ thử. Đổi được bằng biến môi trường DIA_CHI. */
export const DIA_CHI = process.env.DIA_CHI || 'http://127.0.0.1:8099';

/* ── TÌM PLAYWRIGHT ────────────────────────────────────────────────────────
   Thử theo thứ tự: cách chuẩn (node_modules cạnh kho mã) → biến môi trường →
   mấy chỗ hay gặp. Không thấy thì nói thẳng phải làm gì. */
const CHO_PW = [
  process.env.PLAYWRIGHT_MODULE,
  '/opt/node22/lib/node_modules/playwright/index.mjs',
  '/usr/lib/node_modules/playwright/index.mjs'
].filter(Boolean);

async function napPlaywright(){
  try { return await import('playwright'); } catch (e) {}
  for (const d of CHO_PW) {
    if (!existsSync(d)) continue;
    try { return await import(d); } catch (e) {}
  }
  throw new Error(
    'Không tìm thấy Playwright.\n' +
    '  · cài cạnh kho mã:  npm i -D playwright\n' +
    '  · hoặc trỏ thẳng:   PLAYWRIGHT_MODULE=/duong/dan/playwright/index.mjs');
}
export const { chromium } = await napPlaywright();

/* ── TÌM TRÌNH DUYỆT ───────────────────────────────────────────────────────
   Playwright tự biết trình duyệt của nó nằm đâu — cứ để nó tự lo TRƯỚC. Chỉ
   khi nó chịu thua mới đi dò tay trong /opt/pw-browsers, và dò theo MẪU chứ
   không theo số hiệu: `chromium-1194` hôm nay, mai nâng lên là số khác. */
function doTay(){
  for (const goc of [process.env.PLAYWRIGHT_BROWSERS_PATH, '/opt/pw-browsers'].filter(Boolean)) {
    if (!existsSync(goc)) continue;
    const thu = readdirSync(goc).filter(x => x.startsWith('chromium')).sort().reverse();
    for (const t of thu) {
      /* `chrome-linux/chrome` đứng TRƯỚC `headless_shell` — xem ghi chú ở
         `moTrinhDuyet`: bản rút gọn xử lý webp động khác, hỏng bộ kiểm. */
      for (const duoi of ['chrome-linux/chrome',
                          'chrome-mac/Chromium.app/Contents/MacOS/Chromium',
                          'chrome-linux/headless_shell']) {
        const d = join(goc, t, duoi);
        if (existsSync(d)) return d;
      }
    }
  }
  return null;
}

/* `--no-proxy-server`: máy chạy phiên này có proxy cho mọi kết nối ra ngoài,
   mà bộ kiểm chỉ gọi 127.0.0.1 — qua proxy là hỏng hết.

   ⚠ PHẢI LÀ CHROMIUM ĐẦY ĐỦ, KHÔNG PHẢI `headless_shell`.
   BẪY ĐÃ VẤP: `chromium.launch()` trần nay lấy bản rút gọn `headless_shell`.
   Nó chạy được gần hết, nhưng khác ở đúng chỗ bộ này soi — trang có mấy khung
   webp động 4–5 MB, bản rút gọn xử lý khác nên hộp chào mở ra rồi tắt trước
   lúc đọc. Sáu phép của `kt2` hỏng, mà lỗi báo ra trông y như trang web hỏng,
   không hề giống bộ kiểm hỏng. Mất một quãng mới lần ra.
   `channel:'chromium'` là cách xin đúng bản đầy đủ. */
export async function moTrinhDuyet(themArgs = []){
  const args = ['--no-proxy-server', ...themArgs];
  const cach = [
    () => chromium.launch({ channel: 'chromium', args }),   /* bản đầy đủ */
    () => { const d = doTay(); if (!d) throw new Error('không dò thấy'); 
            return chromium.launch({ executablePath: d, args }); },
    () => chromium.launch({ args })                          /* thua thì lấy gì cũng được */
  ];
  let cuoi = null;
  for (const thu of cach) {
    try { return await thu(); } catch (e) { cuoi = e; }
  }
  throw new Error(
    'Không mở được trình duyệt Chromium.\n' +
    '  · cài:      npx playwright install chromium\n' +
    '  · hoặc trỏ: PLAYWRIGHT_BROWSERS_PATH=/duong/dan\n' +
    '  (lỗi gốc: ' + (cuoi && cuoi.message) + ')');
}

/* Bộ đếm dùng chung — mọi bộ đều in ra đúng một khuôn để bộ chạy đọc được */
export function soDem(){
  let ok = 0, ng = 0;
  const T = (ten, dieu, ghi = '') => {
    if (dieu) { ok++; console.log('  ✓ ' + ten); }
    else { ng++; console.log('  ✗ ' + ten + (ghi ? '  → ' + ghi : '')); }
  };
  T.xong = () => {
    console.log('\nTỔNG: ' + ok + ' đạt / ' + ng + ' hỏng');
    return ng;
  };
  return T;
}
