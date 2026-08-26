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

console.log('\n③ MAP-02 "vào thẳng màn cuối Gate 2" phải HỎI MÃ, và không gợi ý');
{
  const src = readFileSync(GOC + '/index.html', 'utf8');
  T('có khai cửa mã riêng cho đường này', /g2:\s*\{ kind:'PIN', code:'1959'/.test(src));
  T('KHÔNG kèm gợi ý nào', /hints:\[\], tries:2/.test(src));
  T('nút bấm mở cửa mã chứ không đi thẳng', /\$\('hqG2'\)\.addEventListener\('click', \(\)=> openPin\('g2'\)\)/.test(src));

  const { p, ctx } = await banDo({ channel:'map', credFound:true, eggWin:true,
    solved:{DAD:'x',HAN:'x',UIH:'x',SGN:'x'}, unlocked:{DAD:1,HAN:1,UIH:1,SGN:1} });
  await p.evaluate(()=>openPin('g2'));
  await cho(p, 300);
  T('mở ra đúng bốn ô mã', await p.locator('#pinDash span').count() === 4);
  T('dòng gợi ý TRỐNG TRƠN', (await p.locator('#pinHint').innerHTML()) === '',
    await p.locator('#pinHint').innerHTML());
  /* gõ sai → phải báo sai, không cho qua */
  await p.locator('#pinIn').fill('1111');
  await p.locator('#pinIn').press('Enter');
  await cho(p, 300);
  T('gõ sai thì không cho vào', p.url().includes('/?stay=1'), p.url());
  T('và báo còn mấy lượt', /còn 1 lượt/.test(await p.locator('#pinMsg').textContent()),
    await p.locator('#pinMsg').textContent());
  await ctx.close();
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
