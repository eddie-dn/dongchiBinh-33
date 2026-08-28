/* ĐỢT 26 · CỔNG GATE 2 ĐÒI PHÁ ĐẢO BẢN ĐỒ · MỐC VÒNG 1/2 · NGUỒN BỜ BIỂN */
import { moTrinhDuyet, DIA_CHI, GOC } from '../chung.mjs';
import { readFileSync } from 'node:fs';
const B = DIA_CHI;
const br = await moTrinhDuyet();
let ok=0,ng=0;
const T=(n,c,note='')=>{ if(c){ok++;console.log('  ✓ '+n);} else {ng++;console.log('  ✗ '+n+(note?'  → '+note:''));} };
const cho=(p,ms)=>p.waitForTimeout(ms);
const nam = new Date().getFullYear();
const DU4 = { morseSeen:true, pzOn:true, solved:{DAD:'x',HAN:'x',UIH:'x',SGN:'x'},
              unlocked:{DAD:1,HAN:1,UIH:1,SGN:1}, mapXong:true, mapTong:4 };

/* `g2Hack` = cửa hậu 1959 → bỏ qua đồng hồ. Dùng để tới thẳng cổng mà không
   phải chờ tới 01-09. KHÔNG dùng ở mấy phép kiểm chốt chặn, vì chính nó cũng
   là đường bỏ qua chốt. */
/* ⚠ CỔNG CHỈ MỞ KHI ĐÃ QUA MỐC 01-09 — gieo `g2Vao` KHÔNG đủ, nó chỉ bỏ qua
   quãng chờ vài giây chứ không vặn được đồng hồ. Phải `clock.install` sang sau
   sinh nhật, rồi `clock.runFor` cho đồng hồ đếm ngược của trang chạy tới nơi.
   Dính đúng bẫy này lúc viết bộ kiểm: cổng cứ hiện "Hẹn anh 00:00 ngày 01-09". */
async function gate2(m, opt={}){
  const ctx = await br.newContext({ viewport:{width:420,height:900} });
  const p = await ctx.newPage();
  await p.clock.install({ time:new Date(nam + '-09-05T10:00:00+07:00') });
  await p.addInitScript(([v,y])=>{ if(!localStorage.getItem('mtv1'))
    localStorage.setItem('mtv1', JSON.stringify(Object.assign({ season:y }, v))); }, [m, nam]);
  await p.goto(B+'/dad/950901-b/', {waitUntil:'load'});
  await cho(p, 1200);
  await p.clock.runFor(9000);          /* cho quãng chờ mở cổng chạy hết */
  await cho(p, opt.cho || 2500);
  return { p, ctx };
}
const congTT = p => p.evaluate(()=>({
  loi : (document.getElementById('gLoi')||{}).textContent || '',
  dem : (document.getElementById('gDem')||{}).textContent || '',
  play: !(document.getElementById('gPlay')||{}).hidden,
  man : (()=>{ const x=[...document.querySelectorAll('.scene')].find(e=>e.classList.contains('on'));
               return x ? x.id : '(?)'; })()
}));

console.log('\n① CHƯA PHÁ ĐẢO BẢN ĐỒ — vào được màn hình, nhưng KHÔNG chơi được');
{
  /* tới mốc rồi (g2Hack mở đồng hồ) nhưng bản đồ mới 2/4 */
  const { p, ctx } = await gate2({ g2Hack:true, eggWin:true, credFound:true,
    morseSeen:true, solved:{DAD:'x',HAN:'x'}, unlocked:{DAD:1,HAN:1},
    mapXong:false, mapTong:4 });
  const t = await congTT(p);
  /* g2Hack là cửa hậu của chính tác giả nên nó ĐƯỢC phép đi thẳng —
     phép kiểm này chỉ chứng minh trang vào tới nơi, không kẹt trắng. */
  T('vào được tới màn cổng Gate 2', t.man === 'scene-gate', JSON.stringify(t));
  await ctx.close();
}
{
  /* KHÔNG có g2Hack: phải chờ tới mốc. Vặn đồng hồ trang bằng `lech` của bản
     đồ thì Gate 2 không đọc — nên gieo `g2Vao` để cổng coi như đã tới giờ. */
  const { p, ctx } = await gate2({ g2Vao:true, credFound:true, eggWin:true,
    morseSeen:true, solved:{DAD:'x'}, unlocked:{DAD:1}, mapXong:false, mapTong:4 });
  const t = await congTT(p);
  T('nút "Bắt đầu giải mã" KHÔNG hiện', !t.play, JSON.stringify(t));
  T('cổng nói rõ vì sao chưa vào được',
    /Giải xong Bản đồ tác chiến/i.test(t.loi), t.loi + ' | ' + t.dem);
  /* ĐỢT 27: bỏ dòng đếm "còn n mật thư" — chủ trang muốn gọn, một câu là đủ.
     Kiểm luôn là KHÔNG còn thẻ rỗng nào chiếm chỗ. */
  T('không đẻ thẻ rỗng khi bỏ dòng phụ',
    await p.evaluate(()=>!document.querySelector('.cho-map')));
  T('có lối quay về bản đồ',
    await p.evaluate(()=>!!document.querySelector('.cho-map-nut')));
  await ctx.close();
}
{
  const { p, ctx } = await gate2(Object.assign({ g2Vao:true, credFound:true, eggWin:true }, DU4));
  const t = await congTT(p);
  T('phá đảo đủ 4/4 → nút chơi HIỆN ra', t.play, JSON.stringify(t));
  T('hết dòng chặn', !/Giải xong Bản đồ/i.test(t.loi), t.loi);
  await ctx.close();
}

console.log('\n② CỬA HẬU 1959 VẪN ĐI THẲNG (không bị chốt mới chặn)');
{
  const s = readFileSync(GOC + '/dad/950901-b/index.html','utf8');
  T('chốt có chừa đường cho BYPASS', /if\(!BYPASS && !xongBanDo\(\)\)/.test(s));
  T('đọc cờ do bản đồ khai, không tự đếm', /m\.mapXong === true/.test(s));
  T('có đường lùi cho kho lưu đời cũ', /m\.mapTong.*length >= m\.mapTong/s.test(s));
  const i = readFileSync(GOC + '/index.html','utf8');
  T('bản đồ có khai cờ cho trang khác đọc', /mapXong: nSolved\(\) === NODES\.length/.test(i));
  T('khai lại ngay lúc mở trang, cho người đã phá đảo từ trước',
    /cổng chặn oan[\s\S]{0,80}save\(\);/.test(i));
}

console.log('\n③ MỐC VÒNG — tắt máy giữa chừng còn quay lại đúng vòng');
{
  const s = readFileSync(GOC + '/dad/950901-b/index.html','utf8');
  T('vòng 1 ghi mốc', /async function startRound1\(\)\{\s*\n\s*ghiVong\(1\);/.test(s));
  T('vòng 2 ghi mốc', /async function startRound2\(\)\{\s*\n\s*ghiVong\(2\);/.test(s));
  T('nút PRESS START nhảy đúng vòng đang dở', /if\(tiep === 2\) startRound2\(\); else startRound1\(\);/.test(s));
  T('giải xong hai vòng thì thôi tính là dở', /if\(m\.g2Game \|\| m\.g2Xong\) return 0;/.test(s));
  T('chơi lại từ đầu thì xoá mốc', /g2Reset:.*\+ 1, g2Round:0/.test(s));
  T('nhãn nút đổi khi chơi tiếp', /start_btn_tiep/.test(s));
  T('Khối vận hành khoe đang dở vòng nào', /' · vòng ' \+ \(r\.g2Round \| 0\)/.test(s));
  const c = readFileSync(GOC + '/dad/950901-b/config.js','utf8');
  T('nhãn chơi tiếp khai trong config', /start_btn_tiep\s*:/.test(c));
  T('ba dòng chữ của cổng bị khoá khai trong config',
    /chua_xong_map\s*:/.test(c) && /chua_xong_map_phu\s*:/.test(c) && /chua_xong_map_nut\s*:/.test(c));
}
{
  /* chạy thật: đang dở vòng 2 thì nút đổi nhãn và vào thẳng vòng 2 */
  const { p, ctx } = await gate2(Object.assign({ g2Vao:true, g2Round:2,
    credFound:true, eggWin:true }, DU4));
  await p.click('#gPlay',{force:true});
  await cho(p, 1000); await p.clock.runFor(8000); await cho(p, 3500);
  const nhan = await p.evaluate(()=>(document.getElementById('startBtn')||{}).textContent || '');
  T('nút PRESS START đổi thành "chơi tiếp"', /CHƠI TIẾP|ROUND 02/i.test(nhan), nhan);
  await p.click('#startBtn',{force:true});
  await cho(p, 1000); await p.clock.runFor(12000); await cho(p, 4000);
  const vong = await p.evaluate(()=>(document.getElementById('hudRound')||{}).textContent || '');
  T('bấm vào là nhảy thẳng ROUND 02', /02\/02/.test(vong), vong);
  await ctx.close();
}

console.log('\n④ CREDIT — nguồn dữ liệu đường bờ biển');
{
  const ls = readFileSync(GOC + '/assets/lichsu.js','utf8');
  T('có ghi Natural Earth', /Natural Earth/.test(ls));
  T('thôi khẳng định "vẽ tay, không mượn gì"',
    !/Đường bờ biển và bốn toạ độ vẽ tay bằng SVG, không mượn thư viện bản đồ nào/.test(ls));
  T('vẫn nói rõ phần nào là vẽ tay', /vẽ tay bốn toạ độ và mạng lưới nối/.test(ls));
}

await br.close();
console.log('\n' + (ng ? '✗ ' + ng + ' hỏng / ' : '✓ ') + ok + ' đạt');
process.exit(ng ? 1 : 0);
