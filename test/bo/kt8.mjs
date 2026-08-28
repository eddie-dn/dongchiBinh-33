import { moTrinhDuyet, DIA_CHI, GOC, require } from '../chung.mjs';
const B = DIA_CHI;
const br = await moTrinhDuyet();
let pass=0, fail=0;
const ok=(t,c,x='')=>{ c?pass++:fail++; console.log((c?'  ✓ ':'  ✗ ')+t+(x?'  → '+x:'')); };
const go=async(p,s,n)=>{for(let i=0;i<n;i++){await p.click(s,{force:true});await p.waitForTimeout(85);}};

/* ══ ① BẢN GHI: 5 lần sai, cộng dồn trong phiên ══ */
console.log('\n① Cửa mã bản ghi — nâng 3 → 5, đếm theo phiên');
{
  const ctx=await br.newContext({viewport:{width:390,height:844}});
  const p=await ctx.newPage(); const errs=[]; p.on('pageerror',e=>errs.push(e.message));
  await p.goto(B+'/han/961030-a/',{waitUntil:'load'}); await p.waitForTimeout(1600);
  await go(p,'#stampzone',5); await go(p,'.ls-chu',3); await p.waitForTimeout(300);
  const doc=async()=>p.evaluate(()=>(document.querySelector('.ls-msg')||{}).textContent.trim());
  for(let i=1;i<=4;i++){ await p.fill('#lsIn',''); await p.fill('#lsIn','111'+i); await p.press('#lsIn','Enter'); await p.waitForTimeout(330); }
  ok('sai 4 lần: CHƯA có gợi ý (mốc mới là 5)', (await doc())==='', '"'+await doc()+'"');
  await p.fill('#lsIn',''); await p.fill('#lsIn','1119'); await p.press('#lsIn','Enter'); await p.waitForTimeout(400);
  ok('sai lần 5: hiện gợi ý', (await doc())==='Năm sinh Bác Hồ', '"'+await doc()+'"');
  ok('bộ đếm nằm ở sessionStorage', await p.evaluate(()=>sessionStorage.getItem('ls_sai')==='5'),
     await p.evaluate(()=>'ls_sai='+sessionStorage.getItem('ls_sai')));
  ok('KHÔNG ghi bộ đếm vào localStorage', await p.evaluate(()=>!localStorage.getItem('ls_sai')));
  ok('không lỗi JS', errs.length===0, errs.join(' '));
  await ctx.close();
}
/* cộng dồn qua nhiều lần MỞ HỘP trong cùng phiên */
{
  const ctx=await br.newContext({viewport:{width:390,height:844}});
  const p=await ctx.newPage();
  await p.goto(B+'/han/961030-a/',{waitUntil:'load'}); await p.waitForTimeout(1600);
  await go(p,'#stampzone',5); await go(p,'.ls-chu',3); await p.waitForTimeout(300);
  for(let i=1;i<=3;i++){ await p.fill('#lsIn',''); await p.fill('#lsIn','222'+i); await p.press('#lsIn','Enter'); await p.waitForTimeout(330); }
  await p.keyboard.press('Escape'); await p.waitForTimeout(300);      /* đóng hộp */
  await go(p,'#stampzone',5); await go(p,'.ls-chu',3); await p.waitForTimeout(300);
  const sau=await p.evaluate(()=>(document.querySelector('.ls-msg')||{}).textContent.trim());
  ok('đóng/mở lại hộp: bộ đếm KHÔNG về 0', await p.evaluate(()=>+sessionStorage.getItem('ls_sai')===3),
     'ls_sai='+await p.evaluate(()=>sessionStorage.getItem('ls_sai')));
  ok('  và vẫn chưa tới mốc gợi ý', sau==='', '"'+sau+'"');
  for(let i=1;i<=2;i++){ await p.fill('#lsIn',''); await p.fill('#lsIn','333'+i); await p.press('#lsIn','Enter'); await p.waitForTimeout(330); }
  ok('sai thêm 2 lần nữa (tổng 5) → hiện gợi ý',
     (await p.evaluate(()=>(document.querySelector('.ls-msg')||{}).textContent.trim()))==='Năm sinh Bác Hồ');
  await ctx.close();
}
/* PHIÊN MỚI → đếm lại từ đầu */
{
  const ctx=await br.newContext({viewport:{width:390,height:844}});
  const p=await ctx.newPage();
  await p.goto(B+'/han/961030-a/',{waitUntil:'load'}); await p.waitForTimeout(1600);
  ok('phiên mới: bộ đếm rỗng', await p.evaluate(()=>!sessionStorage.getItem('ls_sai')));
  await ctx.close();
}

/* ══ ② SỔ MỚI Ở BOX COLLECTED ══ */
console.log('\n② Sổ "Khu Easter Egg" ở box Collected');
{
  const ctx=await br.newContext({viewport:{width:390,height:844}});
  const p=await ctx.newPage(); const errs=[]; p.on('pageerror',e=>errs.push(e.message));
  await p.addInitScript(()=>{
    localStorage.setItem('nav1', JSON.stringify({v:2,profiles:[],active:-1,mapUnlocked:true}));
    localStorage.setItem('mtv1', JSON.stringify({g2Done:true,g2Game:true,eggWin:true,credFound:true,eggDone:true}));
  });
  await p.goto(B+'/',{waitUntil:'load'}); await p.waitForTimeout(2000);
  await p.evaluate(()=>{const n=document.getElementById('credw'); n.classList.add('on'); n.setAttribute('aria-hidden','false');});
  await p.waitForTimeout(400);
  ok('tiêu đề Collected mang cửa vào', await p.evaluate(()=>{
    const t=document.getElementById('credTitle');
    return t.getAttribute('data-ls')==='EGG' && t.classList.contains('ls-chu'); }));
  ok('  không có con trỏ bàn tay (giữ chất cửa hậu)',
     await p.evaluate(()=>getComputedStyle(document.getElementById('credTitle')).cursor==='default'));
  await go(p,'#credTitle',3); await p.waitForTimeout(350);
  ok('bấm 3 nhịp → ra cửa mã', await p.evaluate(()=>!!document.querySelector('.ls-nen.on')));
  await p.fill('#lsIn','0981'); await p.press('#lsIn','Enter'); await p.waitForTimeout(500);
  /* ⚠ SOI THEO CHÍNH CUỐN SỔ, ĐỪNG GHIM SỐ HIỆU VÀO BỘ KIỂM.
     BỆNH ĐÃ SỬA: hai phép dưới từng ghim cứng "đủ 5 mốc" và "đang chạy V19".
     Sổ thì mỗi đợt lại dài thêm một dòng — thêm dòng là bộ kiểm đỏ, mà lỗi
     báo ra trông như trang hỏng chứ không như bộ kiểm hết hạn. Nay hỏi thẳng
     `LichSu.so` xem cuốn EGG có bao nhiêu mốc và mốc cuối là số mấy, rồi soi
     màn hình có khớp không: đợt sau bump số hiệu cũng không phải sửa gì. */
  const so=await p.evaluate(()=>{
    const cuon = (window.LichSu && LichSu.so && LichSu.so.EGG) || { doi: [] };
    const cuoi = cuon.doi[cuon.doi.length - 1] || {};
    return {
      tit:(document.querySelector('.ls-tit')||{}).textContent,
      dong:document.querySelectorAll('.ls-doi').length,
      chay:(document.querySelector('.ls-nhom p.d')||{}).textContent,
      soMoc: cuon.doi.length, verCuoi: cuoi.ver || '' };
  });
  ok('vào đúng sổ "Easter Egg · Gate 1"', so.tit==='Easter Egg · Gate 1', so.tit);
  ok('  in ra đủ mọi mốc build của sổ', so.dong === so.soMoc && so.soMoc >= 5,
     so.dong + ' dòng / sổ có ' + so.soMoc);
  ok('  dòng "đang chạy" khớp mốc cuối của sổ',
     !!so.verCuoi && (so.chay||'').includes(so.verCuoi), so.chay + ' · sổ: ' + so.verCuoi);
  await ctx.close();

  /* sổ bản đồ (mặt cười) KHÔNG bị ảnh hưởng */
  const c2=await br.newContext({viewport:{width:390,height:844}});
  const p2=await c2.newPage();
  await p2.goto(B+'/',{waitUntil:'load'}); await p2.waitForTimeout(1800);
  /* LUẬT MỚI: không còn cờ ls_ok_* cho đi thẳng — mở sổ nào cũng phải gõ mã */
  await p2.evaluate(()=>LichSu.mo('MAP'));
  await p2.waitForTimeout(400);
  await p2.fill('#lsIn','0981'); await p2.press('#lsIn','Enter'); await p2.waitForTimeout(500);
  ok('mặt cười vẫn mở đúng sổ Bản đồ mật thư', await p2.evaluate(()=>
    (document.querySelector('.ls-tit')||{}).textContent==='Bản đồ mật thư'));
  ok('không lỗi JS', errs.length===0, errs.join(' '));
  await c2.close();
}
console.log('\n──────── '+pass+' đạt / '+fail+' hỏng');
await br.close(); process.exit(fail?1:0);
