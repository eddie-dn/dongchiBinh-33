/* ĐỢT 33 · TÀI LIỆU PHẢI KHỚP LUỒNG, VÀ MỘT LUẬT CHỈ ĐƯỢC VIẾT MỘT CHỖ
   Đợt finalize. Bộ này KHÔNG soi một tính năng nào cả — nó soi mấy chỗ mà tài
   liệu và mã nguồn hay trôi khỏi nhau, vì loại lệch đó không bao giờ làm trang
   trắng nên chẳng có gì báo: nó chỉ ngồi đó dẫn người đọc đi sai đường.

   Bốn thứ được giữ ở đây:
     ① mốc pí danh chỉ có MỘT bản luật, và reset xong nó không được nói sai;
     ② mã khai rồi không ai gọi, và file chết, thì phải bị dọn;
     ③ tài liệu mới thêm phải được .vercelignore chặn, và phải có tên trong
        bảng "Bản đồ tài liệu" của README — thiếu một chỗ là lộ đáp án;
     ④ tài liệu nhắc tới hằng số / tên file nào thì thứ đó phải có thật.  */
import { moTrinhDuyet, DIA_CHI, GOC } from '../chung.mjs';
import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
const B = DIA_CHI;
let pass = 0, fail = 0;
/* Ghi chú chỉ in khi HỎNG — in cả lúc đạt thì đọc xuống tưởng đang báo lỗi. */
const ok = (t, c, them='') => { c ? pass++ : fail++;
  console.log((c ? '  ✓ ' : '  ✗ ') + t + (!c && them ? '  → ' + them : '')); };
const doc = f => readFileSync(join(GOC, f), 'utf8');

/* Quét cây thư mục, bỏ mấy chỗ không phải nội dung kho mã */
function quet(thu = '', ra = []){
  for(const t of readdirSync(join(GOC, thu))){
    if(t === '.git' || t === 'node_modules') continue;
    const p = thu ? thu + '/' + t : t;
    if(statSync(join(GOC, p)).isDirectory()) quet(p, ra); else ra.push(p);
  }
  return ra;
}
const TEP = quet();

console.log('\n① Mốc pí danh — một luật, một chỗ');
{
  const ls = doc('assets/lichsu.js');
  const ho = doc('dad/950901-a/index.html');
  ok('luật mốc nằm ở lichsu.js', /function mocTuSnap\s*\(/.test(ls));
  ok('bày ra cho trang khác dùng', /window\.mocTuSnap/.test(ls) && /moc:\s*mocTuSnap/.test(ls));
  ok('trang hồ sơ gọi nhờ, không chép lại luật',
     /mocTuSnap\(profSnap\(\)\)/.test(ho) && !/function mapTien\s*\(/.test(ho)
       && !/function hanTien\s*\(/.test(ho),
     'còn bản chép thứ hai của luật mốc trong dad/950901-a');
  /* Thẻ <script> của lichsu.js nằm SAU khối script của trang hồ sơ, nên cú tự
     lưu đầu tiên phải đợi — gọi sớm là ghi mốc '—' đè lên mốc thật. */
  ok('cú tự lưu đầu tiên đợi lichsu.js nạp xong',
     /if\(window\.mocTuSnap\) luuLanDau\(\);\s*\n\s*else addEventListener\('load', luuLanDau\);/.test(ho),
     'gọi profSave(mocNow()) ngay lúc parse là mốc ra "—"');
  ok('chụp lại hồ sơ thì TÍNH LẠI mốc, không để rỗng',
     /p\.moc = mocTuSnap\(p\.snap\)/.test(ls) && !/p\.moc = '';/.test(ls),
     "moc rỗng thì chip đọc ra '—' = chưa làm gì, sai hẳn một chặng");
}

console.log('\n② Mã chết và file chết đã dọn');
{
  const ho = doc('dad/950901-a/index.html');
  const ha = doc('han/961030-a/index.html');
  ok('bỏ openMsg (khai rồi không ai gọi)', !/function openMsg\s*\(/.test(ho));
  ok('bỏ Q() (khai rồi không ai gọi)', !/function Q\s*\(\)/.test(ha));
  ok('bỏ ngayMoGoiY + MO_GOIY_ISO (không chỗ nào in ngày đó ra)',
     !/ngayMoGoiY/.test(ha) && !/MO_GOIY_ISO/.test(ha));
  ok('mốc mở gợi ý vẫn còn nguyên', /var MO_GOIY = new Date\('2026-10-01/.test(ha));
  for(const t of ['dad/950901-a/api/ping.js', 'dad/950901-a/api/note.js',
                  'dad/950901-a/api/thu.js', 'dad/950901-a/vercel.json',
                  'dad/950901-b/pixelminigame.patch'])
    ok('đã bỏ ' + t, !existsSync(join(GOC, t)));
  ok('chỉ còn MỘT bản api/ping.js', TEP.filter(t => /(^|\/)api\/ping\.js$/.test(t)).length === 1);
}

console.log('\n③ Tài liệu: chặn đủ, và có tên trong bảng của README');
{
  const vi = doc('.vercelignore');
  const luat = vi.split('\n').map(d => d.trim())
                 .filter(d => d && !d.startsWith('#'));
  const bi = t => luat.some(l => t === l || t.startsWith(l));
  const rm = doc('README.md');

  const TAI_LIEU = TEP.filter(t => /\.(md|txt)$/.test(t) && !t.startsWith('api/_lib/'));
  const hoLot = TAI_LIEU.filter(t => !bi(t));
  ok('mọi tài liệu đều bị .vercelignore chặn', hoLot.length === 0, hoLot.join(', '));

  /* Hai file này là RUỘT của hàm máy chủ — chặn nhầm thì hộp chào tụt xuống bộ
     câu dự phòng mà không báo lỗi gì. Chính vì thế .vercelignore mới liệt kê
     đích danh thay vì viết gọn `*.md`. */
  ok('KHÔNG chặn nhầm api/_lib/loichao.md', !bi('api/_lib/loichao.md'));
  ok('KHÔNG chặn nhầm api/_lib/tinhcach.md', !bi('api/_lib/tinhcach.md'));
  ok('bộ kiểm bị chặn', bi('test/bo/pin13.mjs') && bi('test/chay.mjs'));
  ok('mã Apps Script bị chặn', bi('docs/apps-script/Code.gs'));

  const thieu = TAI_LIEU.filter(t => !rm.includes('`' + t + '`'));
  ok('bảng "Bản đồ tài liệu" của README nhắc đủ mọi tài liệu',
     thieu.length === 0, thieu.join(', '));

  /* Chỉ soi mấy dòng trỏ vào FILE có thật trong kho. Bỏ qua `node_modules/`,
     `.git/`, `*.log` — đó là dòng chặn theo lệ, không phải đường dẫn nội dung. */
  const LE = new Set(['node_modules/', '.git/', '.github/']);
  const chet = luat.filter(l => !LE.has(l) && !l.startsWith('*')
                             && !existsSync(join(GOC, l)));
  ok('.vercelignore không còn dòng trỏ vào file đã xoá', chet.length === 0, chet.join(', '));

  /* Luật của chính kho này: đừng chép số vào tài liệu, số chép tay là số mốc. */
  const chepSo = /chạy\s+\*?\*?\d+\s+bộ/.test(rm) || /\d+\s+bộ,\s*0\s*hỏng/.test(rm);
  ok('README không chép số lượng bộ kiểm', !chepSo);
}

console.log('\n④ Tài liệu nhắc tên gì thì tên đó phải có thật');
{
  const cm = doc('han/CHU-MAP3.md');
  const cfg = doc('dad/950901-b/config.js');
  const ha = doc('han/961030-a/index.html');
  const hb = doc('han/961030-b/index.html');
  ok('CHU-MAP3 trỏ đúng `ma` trong config.js của Gate 2',
     /`ma`.*`dad\/950901-b\/config\.js`/s.test(cm.split('\n').slice(0,200).join('\n'))
       || /trường `ma` trong\n`dad\/950901-b\/config\.js`/.test(cm));
  ok('CHU-MAP3 không còn trỏ vào biến `MA` bên index.html',
     !/biến `MA` trong khối\nphát mã bên `dad\/950901-b\/index\.html`/.test(cm));
  ok('đoạn mã MO_GOIY trong CHU-MAP3 chép đúng dòng thật',
     cm.includes("var MO_GOIY = new Date('2026-10-01T00:00:00+07:00').getTime();")
       && ha.includes("var MO_GOIY = new Date('2026-10-01T00:00:00+07:00').getTime();"));

  const lay = (s, re) => (s.match(re) || [,''])[1];
  ok('mã vào Zoey’s Castle khớp hai đầu',
     lay(ha, /var PIN_A = '([^']*)'/) === lay(cfg, /ma\s*:\s*'([^']*)'/),
     lay(ha, /var PIN_A = '([^']*)'/) + ' / ' + lay(cfg, /ma\s*:\s*'([^']*)'/));
  ok('mã Secret Chamber khớp hai đầu',
     lay(ha, /var PIN_B\s*=\s*'([^']*)'/) === lay(hb, /var PIN\s*=\s*'([^']*)'/));
  ok('mã bảng điều phối khớp hai đầu',
     lay(ha, /var PIN_CTRL = '([^']*)'/) === lay(hb, /var PIN_CTRL = '([^']*)'/));

  /* Mọi đường dẫn tệp mà tài liệu nhắc tới đều phải có thật. Trừ đúng hai
     nhóm CỐ Ý chưa có: bộ ảnh kỷ niệm (game tự vẽ ảnh tạm khi thiếu — xem
     THU-VA-ANH.md) và package.json (bộ kiểm cố ý không dùng). */
  const MIEN = /^(photo_\d\.jpg|package\.json)$/;
  const xau = [];
  /* `DOC-CAI-NAY-TRUOC.txt` KHÔNG soi: nó là nhật ký, mỗi mục là ảnh chụp của
     một thời điểm. Mục nào ghi "đã xoá file X" thì đương nhiên phải gọi tên X
     ra — bắt file đó còn tồn tại là bắt nhật ký không được kể chuyện xoá. */
  for(const f of TEP.filter(t => /\.(md|txt)$/.test(t) && !t.startsWith('api/_lib/')
                              && t !== 'DOC-CAI-NAY-TRUOC.txt')){
    const s = doc(f);
    for(const m of s.matchAll(/`([A-Za-z0-9_./-]+\.(?:html|js|mjs|md|txt|json|gs|png|webp|jpg|patch))`/g)){
      const t = m[1];
      if(MIEN.test(t)) continue;
      if(existsSync(join(GOC, t))) continue;
      /* Liên kết tương đối trong markdown (`../../USER-FLOW.md`) — dò từ chính
         thư mục của file tài liệu đó ra, không phải từ gốc kho. */
      if(existsSync(join(GOC, f, '..', t))) continue;
      if(TEP.some(x => x.endsWith('/' + t.split('/').pop()))) continue;
      xau.push(f + ' → ' + t);
    }
  }
  ok('không tài liệu nào trỏ vào file không tồn tại', xau.length === 0,
     [...new Set(xau)].slice(0, 6).join(' · '));
}

console.log('\n⑤ Năm nút chơi lại đều báo lại cho hồ sơ');
{
  const canh = [['index.html', 2], ['dad/950901-b/index.html', 1],
                ['han/961030-a/index.html', 1], ['han/961030-b/index.html', 1]];
  for(const [f, n] of canh){
    const c = (doc(f).match(/chupLaiHoSo\('[a-z0-9]+'\)/g) || []).length;
    ok(f + ' gọi chupLaiHoSo ' + n + ' lần', c === n, 'đếm được ' + c);
  }
}

console.log('\n⑥ Trên trình duyệt: reset xong chip pí danh vẫn nói đúng chặng');
const br = await moTrinhDuyet();
{
  const ctx = await br.newContext({ viewport:{width:390,height:844} });
  const p = await ctx.newPage(); const errs = [];
  p.on('pageerror', e => errs.push(e.message));
  await p.addInitScript(() => {
    if(localStorage.getItem('nav1')) return;
    localStorage.setItem('msn1', JSON.stringify({m1:true,m2:true,m3:true,m2doneAt:Date.now(),hints:0}));
    localStorage.setItem('nav1', JSON.stringify(
      {v:2, profiles:[{pid:'t', name:'KIEM33', moc:'M2', snap:{}}], active:0, mapUnlocked:true}));
  });
  await p.goto(B + '/', { waitUntil:'load' }); await p.waitForTimeout(2400);

  const mocLa = await p.evaluate(() => ({
    trong:  window.LichSu && window.LichSu.moc ? window.LichSu.moc({}) : 'THIEU',
    m1:     window.LichSu.moc({ msn1:{m1:true} }),
    m3:     window.LichSu.moc({ msn1:{m1:true,m2:true,m3:true} }),
    tac2:   window.LichSu.moc({ msn1:{m3:true}, mtv1:{solved:{a:1,b:1}} }),
    egg:    window.LichSu.moc({ msn1:{m3:true}, mtv1:{solved:{a:1,b:1,c:1,d:1}, credFound:true} }),
    han:    window.LichSu.moc({ msn1:{m3:true}, hanv1:{done:true, bOpen:true} })
  }));
  ok('bản chụp rỗng → "—"',        mocLa.trong === '—',      mocLa.trong);
  ok('mới xong Mission 1 → "M1"',  mocLa.m1 === 'M1',        mocLa.m1);
  ok('xong ba Mission → "M3 ✓"',   mocLa.m3 === 'M3 ✓',      mocLa.m3);
  ok('giải 2 toạ độ → "TAC 2/4"',  mocLa.tac2 === 'TAC 2/4', mocLa.tac2);
  ok('phá đảo Easter Egg → "EGG ✦"', mocLa.egg === 'EGG ✦',  mocLa.egg);
  ok('mở được wishlist → "HAN ✦✦"', mocLa.han === 'HAN ✦✦',  mocLa.han);

  /* Đi đúng đường người chơi đi: giải hết bản đồ → ghé hồ sơ cho nó CHỤP
     (chụp xong `moc` là "EGG ✦") → quay ra bấm Reset. Chip phải tụt về đúng
     "M3 ✓" — ba Mission vẫn còn nguyên — chứ KHÔNG phải "—", vì dấu gạch
     nghĩa là chưa làm gì cả. */
  await p.evaluate(() => {
    NODES.forEach(n => { unlocked[n.code]=true; solved[n.code]='xong'; });
    credFound = true; eggWin = true; save();
  });
  await p.goto(B + '/dad/950901-a/', { waitUntil:'load' }); await p.waitForTimeout(2600);
  await p.evaluate(() => { try{ profSave(null, true); }catch(e){} });
  await p.waitForTimeout(400);
  const truoc = await p.evaluate(() => {
    try{ return JSON.parse(localStorage.getItem('nav1')).profiles[0]; }catch(e){ return null; }
  });
  ok('hồ sơ chụp được cả ba chặng', truoc && !!truoc.snap.msn1 && !!truoc.snap.mtv1,
     JSON.stringify(truoc && Object.keys(truoc.snap)));
  ok('chụp xong chip đọc "EGG ✦"', truoc && truoc.moc === 'EGG ✦',
     truoc ? JSON.stringify(truoc.moc) : 'không đọc được');

  await p.goto(B + '/', { waitUntil:'load' }); await p.waitForTimeout(2400);
  await p.evaluate(() => { hardWipe('kiem33', 'bộ kiểm đợt 33'); });
  await p.waitForTimeout(900);
  await p.waitForLoadState('load');
  const sau = await p.evaluate(() => {
    try{ return JSON.parse(localStorage.getItem('nav1')).profiles[0]; }catch(e){ return null; }
  });
  ok('bản chụp bản đồ đã hạ', sau && Object.keys((sau.snap.mtv1||{}).solved||{}).length === 0);
  ok('bản chụp Mission KHÔNG bị đụng', sau && !!(sau.snap.msn1||{}).m3);
  ok('chip pí danh đọc "M3 ✓", không phải "—"', sau && sau.moc === 'M3 ✓',
     sau ? JSON.stringify(sau.moc) : 'không đọc được');
  ok('không có lỗi JS nào', errs.length === 0, errs.join(' | '));
  await ctx.close();
}
await br.close();
console.log('\n' + (fail ? '✗ ' + fail + ' hỏng · ' : '') + pass + ' đạt');
process.exit(fail ? 1 : 0);
