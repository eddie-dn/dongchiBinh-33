import { moTrinhDuyet, DIA_CHI, GOC, require } from '../chung.mjs';
const OUT='/tmp/claude-0/-home-user-dongchiBinh-33/effa3c89-6850-5252-94d9-d0a4fe0c3750/scratchpad/ux/';
const B = DIA_CHI;
const br = await moTrinhDuyet();
let pass=0, fail=0;
const ok=(t,c,them='')=>{ c?pass++:fail++; console.log((c?'  ✓ ':'  ✗ ')+t+(them?'  → '+them:'')); };

/* ══════ 9. GATE 2 — CHƠI THẬT QUA VÒNG 1, XEM CHUYỂN CẢNH ══════ */
console.log('\n⑨ Gate 2 — chơi thật qua vòng 1');
{
  const ctx = await br.newContext({ viewport:{width:390,height:844} });
  const p = await ctx.newPage();
  const errs=[]; p.on('pageerror',e=>errs.push(e.message));
  const req=[]; p.on('request', r=>{ const u=r.url(); if(/\.webp$/.test(u)) req.push(u.split('/').pop()); });
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
  await p.goto(B+'/dad/950901-b/',{waitUntil:'load'}); await p.waitForTimeout(1500);
  await p.clock.runFor(20000);
  await p.waitForSelector('#gPlay:not([hidden])',{timeout:30000});
  await p.click('#gPlay'); await p.waitForTimeout(1500);
  await p.waitForSelector('#startBtn:not([hidden])',{timeout:90000});
  await p.click('#startBtn');
  await p.waitForFunction(()=>{ const i=document.getElementById('answer'); return i && !i.disabled; },{timeout:120000});
  await p.waitForTimeout(400);
  ok('vào được màn chơi, ô nhập mở', true);
  await p.click('#answer');
  for(const ch of 'RAZER'){ await p.keyboard.type(ch); await p.waitForTimeout(330); }
  ok('gõ RAZER → giải xong vòng 1', await p.evaluate(()=>document.querySelector('.hud').classList.contains('ok')));
  /* bắt trạng thái lúc clip đang chạy */
  let trong=null;
  for(let i=0;i<20;i++){
    const s = await p.evaluate(()=>({
      clip:(document.querySelector('#animLayer img')||{}).src?.split('/').pop()||null,
      khoi:document.querySelector('.world').classList.contains('khoi-on'),
      v1:(()=>{const v=document.querySelector('#slab1 .veil');return v?getComputedStyle(v).display:null;})(),
      v2:(()=>{const v=document.querySelector('#slab2 .veil');return v?getComputedStyle(v).display:null;})() }));
    if(s.clip){ trong=s; await p.screenshot({path:OUT+'kt-g2-clip.png'}); break; }
    await p.waitForTimeout(500);
  }
  ok('clip chuyển cảnh là BẢN SẠCH', trong && trong.clip==='anim_unlock_clean.webp', trong?trong.clip:'không bắt được');
  ok('KHÔNG bật lớp khói', trong && trong.khoi===false, JSON.stringify(trong));
  ok('lớp che vòng 1 tắt hẳn', trong && trong.v1==='none', trong?trong.v1:'');
  ok('lớp che vòng 2 tắt hẳn', trong && trong.v2==='none', trong?trong.v2:'');
  /* chờ clip xong */
  for(let i=0;i<25;i++){
    const c = await p.evaluate(()=>!!document.querySelector('#animLayer img'));
    if(!c) break; await p.waitForTimeout(700);
  }
  await p.waitForTimeout(1500);
  ok('vào vòng 2', await p.evaluate(()=>document.querySelector('.hudRnd,#hudRound,.rnd')?.textContent?.includes('02')
     || document.getElementById('scene-game').classList.contains('on')));
  ok('KHÔNG nạp clip cũ 24MB', !req.includes('anim_unlock.webp'), req.join(','));
  ok('không lỗi JS suốt màn chơi', errs.length===0, errs.join(' '));
  await p.screenshot({path:OUT+'kt-g2-vong2.png'});
  await ctx.close();
}

/* ══════ 10. HỘP CHÀO — CHỮ ĐỔ ĐẦY DÒNG ══════ */
console.log('\n⑩ Hộp chào — chữ đổ đầy dòng');
for(const [W,ten] of [[320,'SE 320px'],[390,'iPhone 390px']]){
  const ctx = await br.newContext({ viewport:{width:W,height:844}, deviceScaleFactor:2 });
  const p = await ctx.newPage();
  await p.addInitScript(()=>{
    localStorage.setItem('nav1', JSON.stringify({v:2,profiles:[],active:-1,mapUnlocked:true}));
    localStorage.setItem('mtv1', JSON.stringify({g2Done:true,g2Game:true,eggWin:true}));
  });
  await p.goto(B+'/',{waitUntil:'load'}); await p.waitForTimeout(1800);
  const d = await p.evaluate(()=>{
    document.getElementById('hhLab').textContent='Welcome back';
    document.getElementById('hhTxt').innerHTML='Đồng chí làm việc đến đâu rồi, nhớ đứng dậy ăn chút gì cho lại sức nha';
    document.getElementById('hhCut').style.display='none';
    const w=document.getElementById('hhw'); w.classList.add('on','show');
    const t=document.getElementById('hhTxt');
    const cs=getComputedStyle(t);
    /* đo bằng cách đếm số dòng thật qua chiều cao */
    const dong = Math.round(t.getBoundingClientRect().height / parseFloat(cs.lineHeight));
    return { wrap:cs.textWrap||cs.textWrapStyle, rong:Math.round(t.getBoundingClientRect().width), dong };
  });
  await p.waitForTimeout(300);
  ok(ten+': dùng text-wrap:pretty', d.wrap==='pretty', d.wrap);
  ok(ten+': câu 68 ký tự gói trong ≤3 dòng', d.dong<=3, d.dong+' dòng, khung '+d.rong+'px');
  await p.screenshot({path:OUT+'kt-chao-'+W+'.png'});
  await ctx.close();
}
console.log('\n──────── phần 4: '+pass+' đạt / '+fail+' hỏng');
await br.close();
process.exit(fail?1:0);
