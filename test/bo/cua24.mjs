/* ĐỢT 24 · TEM KHÔNG NHÁY SỚM · OPEN WORLD KHÔNG BỊ RESET · MAP-02 HỎI MÃ */
import { moTrinhDuyet, DIA_CHI, GOC } from '../chung.mjs';
import { readFileSync } from 'node:fs';
const B = DIA_CHI;
const br = await moTrinhDuyet();
let ok=0,ng=0;
const T=(n,c,note='')=>{ if(c){ok++;console.log('  ✓ '+n);} else {ng++;console.log('  ✗ '+n+(note?'  → '+note:''));} };
const cho=(p,ms)=>p.waitForTimeout(ms);

/* ⚠ PHẢI KÈM MỐC `season`. `boot()` có nhánh "sang mùa mới thì xoá sạch tiến
   độ"; thiếu mốc đó là mọi thứ mình vừa dựng bị dọn ngay lúc trang mở, và
   `nSolved()` trả về 0 dù đã khai đủ bốn toạ độ. README mục 19b có ghi cái bẫy
   này — dính rồi mới nhớ. */
async function banDo(m){
  const ctx = await br.newContext({ viewport:{width:420,height:900} });
  const p = await ctx.newPage();
  const nam = new Date().getFullYear();
  await p.addInitScript(([v, y])=>localStorage.setItem('mtv1',
    JSON.stringify(Object.assign({ season: y }, v))), [m, nam]);
  await p.goto(B+'/?stay=1', {waitUntil:'load'});
  await cho(p, 2200);
  return { p, ctx };
}
const temNhay = p => p.evaluate(()=>document.getElementById('stamp').classList.contains('egg'));

console.log('\n① TEM "Last updated" KHÔNG được nháy khi chưa giải xong mật thư');
{
  /* Vừa xong Mission 3, bước sang bản đồ — chưa giải mã morse nào */
  const { p, ctx } = await banDo({ channel:'map' });
  T('lượt đầu, chưa giải gì: tem IM', !(await temNhay(p)));
  await ctx.close();
}
{
  const { p, ctx } = await banDo({ channel:'map', morseSeen:true,
    solved:{DAD:'x',HAN:'x'}, unlocked:{DAD:1,HAN:1} });
  T('giải được 2/4: tem vẫn IM', !(await temNhay(p)));
  await ctx.close();
}
{
  const { p, ctx } = await banDo({ channel:'map', morseSeen:true, pzOn:true,
    solved:{DAD:'x',HAN:'x',UIH:'x',SGN:'x'}, unlocked:{DAD:1,HAN:1,UIH:1,SGN:1} });
  T('giải đủ 4/4: giờ tem MỚI nháy', await temNhay(p));
  await ctx.close();
}

console.log('\n② NHẮC DOUBLE-TAP — có thật, và đúng luật đang khai');
{
  const src = readFileSync(GOC + '/index.html', 'utf8');
  T('có dòng nhắc', /Double-tap \/ Double-click to start mission/.test(src));
  T('chỉ nhắc khi CHƯA biết cơ chế', /if\(morseSeen\) return;/.test(src));
  T('lượt ghé ĐẦU TIÊN không nhắc gì', /if\(visits < 2\) return;/.test(src));
  T('ghi chú đã được sửa cho khớp mã',
    /LƯỢT GHÉ ĐẦU TIÊN KHÔNG NHẮC GÌ CẢ/.test(src)
    && /Ghi chú đời trước ghi "lần ghé đầu chờ 25 giây", sai/.test(src));
  /* và soi thật: lượt ghé thứ hai, ngồi im thì phải hiện ra */
  const ctx = await br.newContext({ viewport:{width:420,height:900} });
  const p = await ctx.newPage();
  await p.addInitScript(y=>localStorage.setItem('mtv1', JSON.stringify({
    season:y, channel:'map', visits:5, morseSeen:false })), new Date().getFullYear());
  await p.goto(B+'/?stay=1', {waitUntil:'load'});
  await cho(p, 8200);
  T('ngồi im 6 giây ở lượt ghé sau: có nhắc', await p.evaluate(()=>
    /Double-tap/.test(document.querySelector('.lead').textContent)),
    await p.evaluate(()=>document.querySelector('.lead').textContent));
  await ctx.close();
}

/* ⚠ LUẬT ĐÃ ĐỔI Ở ĐỢT 30 — đừng dựng lại lối đi này.
   Đợt 24 thêm "vào thẳng màn cuối Gate 2" vào Box Tổng tư lệnh, có cửa mã
   riêng. Đợt 30 GỠ HẲN: lối đó TRÙNG với cửa hậu sẵn có bên trong chính Gate 2
   (gõ 10 nhịp vào tem → Khối vận hành → Bỏ qua). Hai đường cùng làm một việc,
   giữ đường nằm đúng chỗ của nó, Box Tổng tư lệnh gọn được một nút. */
console.log('\n③ LỐI ĐI THẲNG MÀN CUỐI GATE 2 — đã gỡ khỏi Box Tổng tư lệnh');
{
  const src = readFileSync(GOC + '/index.html', 'utf8');
  T('không còn nút trong Box Tổng tư lệnh', !/id="hqG2"/.test(src));
  T('không còn cửa mã riêng', !/g2:\s*\{ kind:'PIN'/.test(src));
  T('không còn hàm đi thẳng', !/function vaoThangG2/.test(src));
  const pg = readFileSync(GOC + '/api/ping.js', 'utf8');
  T('nhãn tín hiệu của nó cũng dọn theo', !/hack_gate2/.test(pg));
  const g2 = readFileSync(GOC + '/dad/950901-b/index.html', 'utf8');
  T('cửa hậu bên trong Gate 2 VẪN CÒN', /id="kvhSkip"/.test(g2));
}

console.log('\n④ OPEN WORLD không bị nhét lại đáp án vòng 2 vào ô hỏi');
{
  const src = readFileSync(GOC + '/dad/950901-b/index.html', 'utf8');
  T('resetOnhap xét cờ Open World trước',
    /el\.input\.value = \(!owOn && S\.mode === 'progressive'\) \? chuoiDaLo\(\) : '';/.test(src));
  T('ghi rõ vì sao, cho khỏi ai gỡ ra', /reset về chữ ZHAOYUN/.test(src));
}

console.log('\nTỔNG: '+ok+' đạt / '+ng+' hỏng');
await br.close(); process.exit(ng?1:0);
