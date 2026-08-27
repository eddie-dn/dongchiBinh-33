import { moTrinhDuyet, DIA_CHI, GOC, require } from '../chung.mjs';
const OUT='/tmp/claude-0/-home-user-dongchiBinh-33/effa3c89-6850-5252-94d9-d0a4fe0c3750/scratchpad/fr/';
const br = await moTrinhDuyet();
const ctx = await br.newContext({ viewport:{width:390,height:844}, deviceScaleFactor:2 });
const p = await ctx.newPage();
let pass=0, fail=0;
const ok=(t,c,x='')=>{ c?pass++:fail++; console.log((c?'  ✓ ':'  ✗ ')+t+(x?'  → '+x:'')); };
const errs=[]; p.on('pageerror',e=>errs.push(e.message));
  /* ⚠ ĐỢT 26: cổng Gate 2 nay ĐÒI bản đồ tác chiến đã phá đảo mới cho chơi —
     chưa xong thì `#gPlay` không bao giờ hiện và bộ này treo tới hết giờ.
     Gieo sẵn cờ `mapXong` do bản đồ khai (xem `xongBanDo()` trong Gate 2).
     `season` phải có kèm, nếu không `boot()` bên bản đồ dọn sạch (README 19b). */
  await p.addInitScript(y=>{ if(!localStorage.getItem('mtv1'))
    localStorage.setItem('mtv1', JSON.stringify(
      { season:y, mapXong:true, mapTong:4, morseSeen:true, pzOn:true,
        solved:{DAD:'x',HAN:'x',UIH:'x',SGN:'x'},
        unlocked:{DAD:1,HAN:1,UIH:1,SGN:1} })); }, new Date().getFullYear());
await p.clock.install({ time:new Date('2026-09-05T10:00:00+07:00') });
await p.goto(DIA_CHI+'/dad/950901-b/',{waitUntil:'load'}); await p.waitForTimeout(1500);
await p.clock.runFor(20000);
await p.waitForSelector('#gPlay:not([hidden])',{timeout:30000});
await p.click('#gPlay'); await p.waitForTimeout(1200);
await p.waitForSelector('#startBtn:not([hidden])',{timeout:90000});
await p.click('#startBtn');
await p.waitForFunction(()=>{const i=document.getElementById('answer');return i&&!i.disabled},{timeout:120000});
await p.waitForTimeout(1000);

console.log('\n③ Bệ đá vòng 1');
const s1 = await p.evaluate(()=>{
  const sl=document.getElementById('slab1'), v=sl.querySelector('.veil');
  return { sach:sl.classList.contains('sach'), veil:v?getComputedStyle(v).display:'—',
           bg:(getComputedStyle(document.getElementById('bgLayer')).backgroundImage.match(/[^/"]+\.png/)||['?'])[0] };
});
ok('vòng 1 dùng ảnh đá sạch', s1.bg==='bg_r1_clean.png', s1.bg);
ok('lớp che thủ công TẮT hẳn', s1.veil==='none' && s1.sach===true, 'display='+s1.veil+' sach='+s1.sach);
const b1 = await p.evaluate(()=>{const r=document.getElementById('slab1').getBoundingClientRect();
  return {x:r.x,y:r.y,w:r.width,h:r.height};});
await p.screenshot({path:OUT+'be-da-vong1.png',
  clip:{x:Math.max(0,b1.x-b1.w*0.8), y:Math.max(0,b1.y-b1.h*2), width:Math.min(390,b1.w*2.6), height:b1.h*5}});

console.log('\n④ RAZER trong chuyển cảnh');
await p.click('#answer');
for(const ch of 'RAZER'){ await p.keyboard.type(ch); await p.waitForTimeout(330); }
/* CHỜ clip xuất hiện đã, rồi mới đo — không đặt trần số vòng lặp, kẻo hết
   vòng trước khi clip kịp chạy (đã vấp: rút chu kỳ xuống thì cửa sổ quan sát
   ngắn lại một nửa, đo ra "chưa bao giờ thấy" rồi tưởng là đạt). */
await p.waitForFunction(()=>!!document.querySelector('#animLayer img'), {timeout:60000});
let t0=Date.now(), cuoi=-1, mocClip=0, thayRazer=false;
while(true){
  const s = await p.evaluate(()=>({
    clip: !!document.querySelector('#animLayer img'),
    vis:  document.getElementById('slab1').classList.contains('vis'),
    op:   +getComputedStyle(document.getElementById('slab1')).opacity,
    khoi: document.querySelector('.world').classList.contains('khoi-on') }));
  if(s.vis && s.op>0.02){ cuoi = Date.now()-t0; thayRazer=true; }
  if(s.khoi) mocClip=-1;
  if(!s.clip) break;
  if(Date.now()-t0 > 12000) break;
  await p.waitForTimeout(70);
}
ok('CÓ thấy RAZER trong đoạn đầu clip (không tắt phụt ngay)', thayRazer,
   thayRazer? ('còn tới '+(100*cuoi/8000).toFixed(1)+'%') : 'không thấy lần nào');
const pc = 100*cuoi/8000;
/* CHỐT CHẶN MỚI LÀ 12%, KHÔNG PHẢI 42%. 42% là mốc cảnh mở ra khung mới; còn
   CHỚP NỔ — thứ thật sự làm lộ chuyện lớp chữ đứng im trong khi cả khung rung —
   bắt đầu ngay từ 12%. Xem `slab1_out_at` trong config.js. */
ok('RAZER tắt hẳn TRƯỚC mốc 12% (lúc chớp nổ loé lên)', pc < 12, 'thấy tới '+pc.toFixed(1)+'% clip');
ok('  còn dư khoảng trống trước 12%', 12-pc > 1.5, 'dư '+(12-pc).toFixed(1)+'%');
ok('không bật khói', mocClip!==-1);
await p.waitForTimeout(2500);

console.log('\n⑤ Bệ đá vòng 2');
const s2 = await p.evaluate(()=>{
  const sl=document.getElementById('slab2'), v=sl.querySelector('.veil');
  return { sach:sl.classList.contains('sach'), veil:v?getComputedStyle(v).display:'—',
           bg:(getComputedStyle(document.getElementById('bgLayer')).backgroundImage.match(/[^/"]+\.png/)||['?'])[0],
           w:sl.getBoundingClientRect().width };
});
ok('vòng 2 dùng ảnh đá sạch', s2.bg==='bg_r2_clean.png', s2.bg);
ok('lớp che thủ công TẮT hẳn', s2.veil==='none' && s2.sach===true, 'display='+s2.veil+' sach='+s2.sach);
if(s2.w>0){
  const b2 = await p.evaluate(()=>{const r=document.getElementById('slab2').getBoundingClientRect();
    return {x:r.x,y:r.y,w:r.width,h:r.height};});
  await p.screenshot({path:OUT+'be-da-vong2.png',
    clip:{x:Math.max(0,b2.x-b2.w*0.8), y:Math.max(0,b2.y-b2.h*2), width:Math.min(390,b2.w*2.6), height:b2.h*5}});
}
ok('không lỗi JS suốt màn chơi', errs.length===0, errs.join(' '));
console.log('\n──────── '+pass+' đạt / '+fail+' hỏng');
await br.close(); process.exit(fail?1:0);
