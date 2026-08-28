/* ĐỢT 25 · BĂNG RÔN KHÔNG BUNG SỚM · CỬA TEM PHẢI PHÁ ĐẢO MỚI MỞ ·
             Ô ĐẾM CHƠI LẠI · NÚT BỐN BẢNG CÙNG MỘT KHUÔN · KHUNG SLIDESHOW */
import { moTrinhDuyet, DIA_CHI, GOC } from '../chung.mjs';
import { readFileSync } from 'node:fs';
const B = DIA_CHI;
const br = await moTrinhDuyet();
let ok=0,ng=0;
const T=(n,c,note='')=>{ if(c){ok++;console.log('  ✓ '+n);} else {ng++;console.log('  ✗ '+n+(note?'  → '+note:''));} };
const cho=(p,ms)=>p.waitForTimeout(ms);
const nam = new Date().getFullYear();

/* ⚠ PHẢI KÈM MỐC `season` — `boot()` có nhánh "sang mùa mới thì xoá sạch tiến
   độ", thiếu mốc là mọi thứ vừa dựng bị dọn ngay lúc trang mở (README 19b). */
async function banDo(m){
  const ctx = await br.newContext({ viewport:{width:420,height:900} });
  const p = await ctx.newPage();
  await p.addInitScript(([v,y])=>localStorage.setItem('mtv1',
    JSON.stringify(Object.assign({ season:y }, v))), [m, nam]);
  await p.goto(B+'/?stay=1', {waitUntil:'load'});
  await cho(p, 2600);
  return { p, ctx };
}
const DU4 = { morseSeen:true, pzOn:true, solved:{DAD:'x',HAN:'x',UIH:'x',SGN:'x'},
              unlocked:{DAD:1,HAN:1,UIH:1,SGN:1} };
/* lệch đồng hồ tới 05-09 — tức ĐÃ QUA sinh nhật, đúng tình huống cần kiểm */
const SAU_SN = new Date(nam, 8, 5, 12, 0, 0).getTime() - Date.now();
const nhip = async (p,sel,n)=>{ for(let i=0;i<n;i++){ await p.click(sel,{force:true}); await cho(p,110);} await cho(p,600); };
const bangRon = p => p.evaluate(()=>{
  const f = document.getElementById('frame'), b = document.getElementById('banner');
  return { won:f.classList.contains('won'), flying:f.classList.contains('flying'),
           hien: getComputedStyle(b).display !== 'none' };
});

console.log('\n① BĂNG RÔN SINH NHẬT — vào SAU 01-09 mà bản đồ chưa xong thì PHẢI IM');
for(const [ten, them, mongDoi] of [
  ['0/4 toạ độ', {}, false],
  ['2/4 toạ độ', { morseSeen:true, solved:{DAD:'x',HAN:'x'}, unlocked:{DAD:1,HAN:1} }, false],
  ['3/4 toạ độ', { morseSeen:true, solved:{DAD:'x',HAN:'x',UIH:'x'},
                   unlocked:{DAD:1,HAN:1,UIH:1} }, false],
  ['4/4 toạ độ', DU4, true],
]){
  const { p, ctx } = await banDo(Object.assign({ channel:'map', lech:SAU_SN }, them));
  const r = await bangRon(p);
  T(ten + ': băng rôn ' + (mongDoi ? 'BAY RA' : 'im'), r.hien === mongDoi, JSON.stringify(r));
  if(!mongDoi) T(ten + ': khung chưa mang cờ won/flying', !r.won && !r.flying);
  await ctx.close();
}

/* ⚠ LUẬT NÀY ĐÃ ĐỔI Ở ĐỢT 26 — đừng khoá lại lần nữa.
   Đợt 25 khoá cửa tem theo tiến độ. Đợt 26 GỠ: cửa hậu mở được ở mọi tiến độ
   (mò ra sớm là phần thưởng), còn chốt thứ tự chơi chuyển sang CỔNG GATE 2 —
   xem bộ `cong26`. */
console.log('\n② CỬA 10 NHỊP TRÊN TEM — mở được ở MỌI tiến độ');
{
  const { p, ctx } = await banDo({ channel:'map' });
  await nhip(p, '#stampZone', 10);
  T('0/4 toạ độ: gõ đủ 10 nhịp VẪN vào được khung Collected',
    await p.evaluate(()=>document.getElementById('credw').classList.contains('on')));
  await ctx.close();
}
{
  const { p, ctx } = await banDo(Object.assign({ channel:'map' }, DU4));
  await nhip(p, '#stampZone', 10);
  T('4/4 toạ độ: gõ 10 nhịp thì cửa MỞ như cũ',
    await p.evaluate(()=>document.getElementById('credw').classList.contains('on')));
  await ctx.close();
}

console.log('\n③ Ô ĐẾM CHƠI LẠI — hiện ngay trong hộp lúc mở ra');
{
  const { p, ctx } = await banDo(Object.assign({ channel:'map', resetCount:3,
    eggMo:2, eggReset:1, credFound:true, eggWin:true, winParty:true }, DU4));
  await nhip(p, '#flagZone', 5);
  T('mở được Box Tổng tư lệnh',
    await p.evaluate(()=>document.getElementById('wipew').classList.contains('on')));
  await nhip(p, '#hqCardMap', 5);
  const m1 = await p.evaluate(()=>({ t:document.getElementById('hqCount').textContent,
                                     an:document.getElementById('hqCount').hidden,
                                     mt:getComputedStyle(document.getElementById('hqCount')).marginTop }));
  /* ⚠ LUẬT ĐÃ ĐỔI Ở ĐỢT 28: số lần chơi lại chỉ ghi ở CUỐI DÒNG TEM, hộp thôi
     nhắc lại — thêm dòng vào hộp là vỡ bố cục. Bộ `nut28` giữ luật mới. */
  T('MAP-01 KHÔNG còn khoe số lần chơi lại trong hộp', m1.an, JSON.stringify(m1));
  /* ĐÃ VẤP: dòng này từng mang margin âm, dán sát vào tên box */
  T('dòng đếm KHÔNG còn dán sát tên box', parseFloat(m1.mt) >= 6, m1.mt);
  await p.click('#hqBack',{force:true}); await cho(p,400);
  await nhip(p, '#hqCardEgg', 5);
  const m2 = await p.evaluate(()=>document.getElementById('hqCount').textContent);
  T('MAP-02 khoe cả số lần mở lẫn số lần trả về',
    /2 lần/.test(m2) && /1 lần/.test(m2), m2);
  await ctx.close();
}

console.log('\n④ NÚT BỐN BẢNG ĐIỀU KHIỂN — CÙNG MỘT KHUÔN');
{
  const { p, ctx } = await banDo(Object.assign({ channel:'map', credFound:true,
    eggWin:true, winParty:true }, DU4));
  await nhip(p, '#flagZone', 5);
  await nhip(p, '#hqCardMap', 5);
  const ds = ['hqReset','hqHack','hqClock','hqBack','hqClockGo','hqClockOff'];
  T('cả 6 nút Box Tổng tư lệnh mang khuôn chung',
    await p.evaluate(l=>l.every(id=>document.getElementById(id).classList.contains('ops-btn')), ds));
  const kieu = await p.evaluate(()=>{ const c=getComputedStyle(document.getElementById('hqReset'));
    return { bo:c.borderRadius, net:c.borderStyle }; });
  /* ĐỢT 30: góc bo vừa + viền LIỀN, thay cho pill viền nét đứt. */
  T('đúng dáng góc bo vừa, viền liền', kieu.bo === '6px' && kieu.net === 'solid', JSON.stringify(kieu));
  T('không còn nút nào dán style thẳng vào thẻ',
    await p.evaluate(l=>l.every(id=>!document.getElementById(id).getAttribute('style')), ds));
  await ctx.close();
}
{
  /* khung Collected — hai nút cũng phải cùng khuôn */
  const { p, ctx } = await banDo(Object.assign({ channel:'map', credFound:true,
    eggWin:true, winParty:true, phaoXem:true }, DU4));
  await nhip(p, '#stampZone', 10);
  T('hai nút khung Collected cùng khuôn',
    await p.evaluate(()=>['credKnow','credEgg'].every(id=>
      document.getElementById(id).classList.contains('ops-btn'))));
  await ctx.close();
}
{
  const src = {
    'Gate 2'          : readFileSync(GOC + '/dad/950901-b/index.html','utf8'),
    "Zoey's Castle"   : readFileSync(GOC + '/han/961030-a/index.html','utf8'),
    'Secret Chamber'  : readFileSync(GOC + '/han/961030-b/index.html','utf8')
  };
  for(const [ten, s] of Object.entries(src))
    if(ten !== 'Gate 2')
      T(ten + ': Khối vận hành đã bỏ hàng ngang hai nút', !/class="ov-row"/.test(s));
  T("Zoey's Castle: nút mang khuôn chung", /ops-btn/.test(src["Zoey's Castle"]));
  T('Secret Chamber: cả ba nút vào chung một khối dọc',
    (src['Secret Chamber'].match(/ops-btn/g)||[]).length >= 3);
  T('Secret Chamber: nút tua thôi treo margin dán thẳng vào thẻ',
    !/id="cTua"[^>]*style="margin-top/.test(src['Secret Chamber']));
  const ls = readFileSync(GOC + '/assets/lichsu.js','utf8');
  T('khuôn nút khai MỘT chỗ duy nhất trong lichsu.js', /\.ops-btn\{/.test(ls));
  T('màu nút ăn theo màu nhấn của từng trang', /\.ops-btn\{[^}]*var\(--ls-acc/.test(ls));
}

console.log('\n⑤ KHUNG SLIDESHOW — nhịp phóng khớp nhịp đổi ảnh, răng cưa đúng chỗ');
{
  const s = readFileSync(GOC + '/dad/950901-b/index.html','utf8');
  T('nhịp phóng lấy từ biến, không viết cứng 3.4s',
    /transform:var\(--slide-zoom|transform var\(--slide-zoom/.test(s) && !/transform 3\.4s/.test(s));
  T('nhịp phóng buộc vào slide_auto', /--slide-zoom[\s\S]{0,120}T\.slide_auto/.test(s));
  T('răng cưa CHỈ dành cho ảnh vẽ tạm', /\.slidebox img\.ph\{image-rendering:pixelated\}/.test(s));
  T('ảnh vẽ tạm tự nhận lớp .ph', /classList\.add\('ph'\)/.test(s));
}

console.log('\n⑥ RESET BẢN ĐỒ — xoá tiến độ nhưng KHÔNG xoá sổ đã chơi bao nhiêu lần');
{
  const s = readFileSync(GOC + '/index.html','utf8');
  T('hardWipe giữ lại ô đếm của Gate 2', /g2Reset: g2R/.test(s));
  T('hardWipe giữ lại hai ô đếm Easter Egg', /giuDem = \{ eggMo, eggReset \}/.test(s));
  const a = readFileSync(GOC + '/dad/950901-a/index.html','utf8');
  T('Hồ sơ Phi đoàn: nút chơi lại thôi xoá trắng khoá',
    !/localStorage\.removeItem\(KEY\)/.test(a) && /JSON\.stringify\(\{ reset:/.test(a));
  T('Hồ sơ Phi đoàn: tem mang số hiệu R(n)', /' · R' \+ r/.test(a));
  T('Hồ sơ Phi đoàn: hộp Phá đảo THÔI chen dòng đếm (đợt 28)',
    !/Đã chơi lại: <b>/.test(a));
  const b = readFileSync(GOC + '/dad/950901-b/index.html','utf8');
  T('Gate 2: đếm ở nút chơi lại chứ không ở reset()', /g2Reset: \(Store\.get\(\)\.g2Reset \| 0\) \+ 1/.test(b));
  T('Gate 2: Khối vận hành THÔI nhắc số lần chơi lại (đợt 28)',
    !/đã chơi lại <b>/.test(b));
}

await br.close();
console.log('\n' + (ng ? '✗ ' + ng + ' hỏng / ' : '✓ ') + ok + ' đạt');
process.exit(ng ? 1 : 0);
