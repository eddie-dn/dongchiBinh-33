/* ĐỢT 28 · NÚT NGANG HÀNG, KHÔNG ICON · R(n) CHỈ Ở TEM · NHẬP SAI GHI CẢ CHUỖI */
import { moTrinhDuyet, DIA_CHI, GOC } from '../chung.mjs';
import { readFileSync } from 'node:fs';
const B = DIA_CHI;
const br = await moTrinhDuyet();
let ok=0,ng=0;
const T=(n,c,note='')=>{ if(c){ok++;console.log('  ✓ '+n);} else {ng++;console.log('  ✗ '+n+(note?'  → '+note:''));} };
const cho=(p,ms)=>p.waitForTimeout(ms);
const nam = new Date().getFullYear();
const doc = f => readFileSync(GOC + '/' + f, 'utf8');
const DU4 = { morseSeen:true, pzOn:true, mapXong:true, mapTong:4,
              solved:{DAD:'x',HAN:'x',UIH:'x',SGN:'x'},
              unlocked:{DAD:1,HAN:1,UIH:1,SGN:1} };
const nhip = async (p,sel,n)=>{ for(let i=0;i<n;i++){ await p.click(sel,{force:true}); await cho(p,110);} await cho(p,650); };
const doNut = (p, ids) => p.evaluate(l=>l.map(id=>{
  const e = document.getElementById(id); if(!e) return null;
  const b = e.getBoundingClientRect();
  return { top:Math.round(b.top), w:Math.round(b.width),
           chu:e.textContent.trim(), svg:!!e.querySelector('svg') };
}), ids);
/* Hai nút coi là NGANG HÀNG khi mép trên lệch nhau ≤2px và bề ngang chênh ≤2px */
const nganhHang = (a,b) => a && b && Math.abs(a.top-b.top) <= 2 && Math.abs(a.w-b.w) <= 2;

console.log('\n① KHUNG COLLECTED — hai nút ngang hàng, chia đều, không icon');
{
  const ctx = await br.newContext({ viewport:{width:420,height:900} });
  const p = await ctx.newPage();
  await p.addInitScript(([v,y])=>{ if(!localStorage.getItem('mtv1'))
    localStorage.setItem('mtv1', JSON.stringify(Object.assign({ season:y, channel:'map',
      credFound:true, eggWin:true, winParty:true, phaoXem:true, resetCount:3 }, v))); }, [DU4, nam]);
  await p.goto(B+'/?stay=1',{waitUntil:'load'}); await cho(p,2600);
  await nhip(p,'#stampZone',10);
  const [a,b] = await doNut(p,['credKnow','credEgg']);
  T('hai nút nằm cùng một hàng, chia đôi đều', nganhHang(a,b), JSON.stringify([a,b]));
  T('nút không còn icon nào bên trong', a && b && !a.svg && !b.svg);
  T('chữ giữ nguyên', a.chu === 'Get to know me' && b.chu === 'Enter Easter Egg', a.chu+' | '+b.chu);

  console.log('\n② R(n) NẰM Ở CUỐI DÒNG TEM, SAU SỐ HIỆU');
  const tem = await p.evaluate(()=>document.getElementById('stamp').textContent);
  T('tem bản đồ kết thúc bằng · R(n)', /· V\d+\.\d+ · R3$/.test(tem), tem);
  await ctx.close();
}
{
  const ctx = await br.newContext({ viewport:{width:420,height:900} });
  const p = await ctx.newPage();
  await p.addInitScript(()=>localStorage.setItem('hanv1', JSON.stringify({ reset:2 })));
  await p.goto(B+"/han/961030-a/",{waitUntil:'load'}); await cho(p,2200);
  await nhip(p,'#stamp',5);
  const [a,b] = await doNut(p,['cReset','cDone']);
  T("Zoey's Castle: hai nút ngang hàng chia đều", nganhHang(a,b), JSON.stringify([a,b]));
  T('bỏ hết icon trong chữ nút', !/[↻↺⏩⏭]/.test(a.chu + b.chu), a.chu+' | '+b.chu);
  const tem = await p.evaluate(()=>document.getElementById('stamp').textContent);
  T('tem kết thúc bằng · R(n)', /· R2$/.test(tem), tem);
  T('hộp KHÔNG nhắc lại R(n)',
    !(await p.evaluate(()=>/· R\d/.test((document.querySelector('.ov-txt')||{}).textContent||''))));
  await ctx.close();
}

console.log('\n③ SECRET CHAMBER — hai nút khoá/mở ngang hàng, nút vặn kim riêng');
{
  const s = doc('han/961030-b/index.html');
  T('cLock và cOpen chung một hàng',
    /class="ops-hang">'[\s\S]{0,240}id="cLock"[\s\S]{0,200}id="cOpen"/.test(s));
  T('nút vặn kim xuống hàng riêng', /id="cOpen"[\s\S]{0,120}<\/div>'[\s\S]{0,220}id="cTua"/.test(s));
  T('bỏ icon ở cả ba nút', !/>[↻↺⏩]\s*(Khoá lại|Trả đồng hồ|Tua tới)/.test(s));
}

console.log('\n④ R(n) CHỈ GHI MỘT CHỖ — mọi trang có tem đều mang, hộp thì không');
{
  for(const [ten, f] of [['Bản đồ','index.html'], ['Hồ sơ Phi đoàn','dad/950901-a/index.html'],
                         ['Gate 2','dad/950901-b/index.html'], ["Zoey's Castle",'han/961030-a/index.html'],
                         ['Secret Chamber','han/961030-b/index.html']])
    T(ten + ': tem có nối R(n)', /' · R' \+/.test(doc(f)));
  T('Hồ sơ Phi đoàn: đã gỡ dòng đếm khỏi thẻ Phá đảo',
    !/msn-quota">Đã chơi lại/.test(doc('dad/950901-a/index.html')));
  T('Gate 2: Khối vận hành thôi nhắc số lần chơi lại',
    !/đã chơi lại <b>/.test(doc('dad/950901-b/index.html')));
  T('Box Tổng tư lệnh: MAP-01 thôi khoe số chơi lại',
    !/Đã chơi lại bản đồ: /.test(doc('index.html')));
}

console.log('\n⑤ NHẬP SAI — tín hiệu mang theo CHUỖI ĐÃ GÕ');
{
  for(const [ten, f, n] of [['Bản đồ','index.html',6], ['Hồ sơ Phi đoàn','dad/950901-a/index.html',2],
                            ['Gate 2','dad/950901-b/index.html',2], ["Zoey's Castle",'han/961030-a/index.html',4],
                            ['Secret Chamber','han/961030-b/index.html',2]]){
    const s = doc(f);
    T(ten + ': có hàm gói chuỗi đã gõ', /function goSai\(/.test(s));
    T(ten + ': đủ ' + n + ' chỗ dùng', (s.match(/goSai/g)||[]).length >= n);
    T(ten + ': cắt chuỗi cho khỏi tràn', /slice\(0,24\)/.test(s));
  }
  const i = doc('index.html');
  T('hai cửa mã trong Box Tổng tư lệnh nay có bắn tín hiệu',
    /ping\('sai_pin_g2'/.test(i) && /ping\('sai_pin_hack'/.test(i));
  T('Gate 2 chộp chuỗi ngay đầu hàm, trước khi ô bị dọn',
    /const daGo = el\.input\.value;/.test(doc('dad/950901-b/index.html')));
  /* ⚠ BẪY ĐÃ VẤP NGAY TRONG ĐỢT NÀY: `goSai` khai lồng trong một khối IIFE thì
     mấy khối KHÁC gọi tới sẽ nổ "goSai is not defined" — mà lỗi chỉ nổ đúng
     lúc người chơi gõ sai, tức lúc không ai đang nhìn. Ba trang chia nhiều
     khối nên phải với tới được từ tầng chung. */
  for(const [ten, duong] of [['Hồ sơ Phi đoàn','/dad/950901-a/'],
                             ["Zoey's Castle",'/han/961030-a/'],
                             ['Secret Chamber','/han/961030-b/']]){
    const ctx = await br.newContext({ viewport:{width:420,height:900} });
    const p = await ctx.newPage();
    const loi = []; p.on('pageerror', e=>loi.push(e.message));
    await p.goto(B + duong, {waitUntil:'load'}); await cho(p, 2000);
    const co = await p.evaluate(()=>typeof goSai);
    T(ten + ': goSai với tới được từ mọi khối', co === 'function', co);
    T(ten + ': trang không lỗi JS', loi.length === 0, loi[0] || '');
    await ctx.close();
  }
  const pg = doc('api/ping.js');
  T('máy chủ nới ô chi tiết đủ chỗ', /slice\(0, 140\)/.test(pg));
  T('hai sự kiện mới có nhãn', /sai_pin_g2:/.test(pg) && /sai_pin_hack:/.test(pg));
  /* ⚠ Chúng cùng tiền tố `sai_pin` với mã Mission bên dad-a → phải khai đích
     danh vào bảng ban-do, không thì luật đoán theo tiền tố đẩy nhầm trang. */
  T('và được khai đích danh cho đúng trang', /sai_pin_g2 sai_pin_hack/.test(pg));
}

await br.close();
console.log('\n' + (ng ? '✗ ' + ng + ' hỏng / ' : '✓ ') + ok + ' đạt');
process.exit(ng ? 1 : 0);
