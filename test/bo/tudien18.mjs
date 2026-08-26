/* ĐỢT 18 · CHẶN TỰ ĐIỀN CHẤM OAN
   Bệnh: gõ sai xong chạm lại vào ô, trình duyệt nhét nguyên cụm mã cũ vào →
   luật "gõ đủ là tự chấm" nổ liền → sai → dọn ô → nhét lại → nổ tiếp. Ba lượt
   bay trong tích tắc.
   Luật mới:
     ① nhảy nhiều hơn một ký tự một nhịp (tự điền / dán) thì KHÔNG tự chấm;
        Enter vẫn ăn — đường thoát còn nguyên.
     ② vừa chấm sai thì đường tự chấm nghỉ một nhịp, cú gõ trong quãng đó bị
        HOÃN chứ không bị bỏ — người gõ nhanh không bị kẹt trước một cửa im re. */
import { moTrinhDuyet, DIA_CHI, GOC, require } from '../chung.mjs';
const B = DIA_CHI;
const br = await moTrinhDuyet();
let ok=0,ng=0;
const T=(n,c,note='')=>{ if(c){ok++;console.log('  ✓ '+n);} else {ng++;console.log('  ✗ '+n+(note?'  → '+note:''));} };

/* Người thật gõ: mỗi nhịp thêm ĐÚNG một ký tự */
const goTay = async (p, sel, txt) => {
  await p.locator(sel).focus();
  await p.locator(sel).pressSequentially(txt, { delay: 55 });
};
/* Trình duyệt tự điền: nhét nguyên cụm rồi bắn MỘT sự kiện input */
const tuDien = (p, sel, txt) => p.evaluate(([s,v])=>{
  const el = document.querySelector(s);
  el.focus(); el.value = v;
  el.dispatchEvent(new Event('input', { bubbles:true }));
}, [sel, txt]);
const cho = (p,ms)=>p.waitForTimeout(ms);

/* Một khuôn chung cho mọi cửa mã: mở cửa → đếm lượt → bốn phép thử */
async function thuCua({ ten, mo, sel, saiMa, dem, nghi=1500 }){
  console.log('\n▸ ' + ten);
  const ctx = await br.newContext({ viewport:{width:420,height:900} });
  const p = await ctx.newPage();
  const errs=[]; p.on('pageerror', e=>errs.push(e.message));
  const vao = await mo(p);
  if(!vao){ T(ten+': mở được cửa mã', false, 'không dựng được ô nhập'); await ctx.close(); return; }
  T('mở được ô nhập', await p.locator(sel).count()>0);

  /* ① tự điền từ ô rỗng → KHÔNG được tính lượt nào */
  const d0 = await dem(p);
  await tuDien(p, sel, saiMa);
  await cho(p, nghi);
  const d1 = await dem(p);
  T('tự điền cả cụm: KHÔNG nuốt lượt', d1 === d0, 'trước '+d0+' → sau '+d1);

  /* ② Enter vẫn là đường thoát cho ai muốn gửi cụm vừa dán */
  await p.locator(sel).press('Enter');
  await cho(p, 400);
  const d2 = await dem(p);
  T('bấm Enter sau khi tự điền thì VẪN gửi được', d2 === d1 + 1, 'trước '+d1+' → sau '+d2);

  /* ③ gõ tay đủ ký tự vẫn tự chấm như thường */
  await goTay(p, sel, saiMa);
  await cho(p, nghi + 900);
  const d3 = await dem(p);
  T('gõ tay đủ ký tự: vẫn tự chấm', d3 === d2 + 1, 'trước '+d2+' → sau '+d3);

  /* ④ CHÍNH BỆNH: vừa sai xong, tự điền ập vào → không được nuốt thêm lượt nào */
  await tuDien(p, sel, saiMa);
  await cho(p, 300);
  await tuDien(p, sel, saiMa);
  await cho(p, nghi + 1200);
  const d4 = await dem(p);
  T('sai xong bị tự điền hai phát: KHÔNG mất lượt nào', d4 === d3, 'trước '+d3+' → sau '+d4);

  T('không lỗi JS', errs.length === 0, errs.join(' | '));
  await ctx.close();
}

/* ── ① Cửa mã sổ bản ghi (assets/lichsu.js, dùng chung cả bảy sổ) ── */
await thuCua({
  ten: 'Cửa mã sổ bản ghi — trên bản đồ',
  sel: '#lsIn', saiMa: '1111',
  mo: async p => {
    await p.goto(B+'/?stay=1', { waitUntil:'load' }); await cho(p,1500);
    await p.evaluate(()=>{ const k=document.querySelector('.kao'); for(let i=0;i<3;i++) k.click(); });
    await cho(p,400);
    return await p.locator('#lsIn').count() > 0;
  },
  dem: p => p.evaluate(()=> +sessionStorage.getItem('ls_sai') || 0)
});

/* ── ② Ô PIN xem lại hồ sơ trên bản đồ ── */
await thuCua({
  ten: 'Ô PIN hồ sơ — trên bản đồ',
  sel: '#pinIn', saiMa: '1111',
  mo: async p => {
    await p.goto(B+'/?stay=1', { waitUntil:'load' }); await cho(p,1500);
    await p.evaluate(()=>openPin('file','thu'));
    await cho(p,400);
    return await p.locator('#pinDash span').count() > 0;
  },
  dem: p => p.evaluate(()=>pinFail)
});

/* ── ③ Ô mã Mission — Hồ sơ Phi đoàn ── */
await thuCua({
  ten: 'Ô mã Mission 2 — Hồ sơ Phi đoàn',
  sel: '#msnIn', saiMa: 'XXXXXX',
  mo: async p => {
    await p.goto(B+'/dad/950901-a/', { waitUntil:'load' }); await cho(p,2500);
    for(let k=0;k<5;k++){ await p.click('#msnLine'); await cho(p,430);
      if(await p.locator('#msnCells').count()) break; }
    return await p.locator('#msnIn').count() > 0;
  },
  dem: p => p.evaluate(()=>{ try{ return JSON.parse(localStorage.getItem('msn1')||'{}').dayN|0; }catch(e){ return -1; } })
});

/* ── ④ Cửa mã Zoey's Castle ── */
await thuCua({
  ten: "Cửa mã Zoey's Castle",
  sel: '#inp', saiMa: 'ZZZZZZZZZ',
  mo: async p => {
    await p.goto(B+'/han/961030-a/', { waitUntil:'load' });
    await p.evaluate(()=>localStorage.setItem('mtv1', JSON.stringify({eggWin:true})));
    await p.reload({ waitUntil:'load' }); await cho(p,1200);
    const n = await p.locator('#cells .cell').count();
    if(!n) return false;
    return n === 9;                     /* mã cửa 9 ký tự — khớp chuỗi mồi */
  },
  dem: p => p.evaluate(()=>{ try{ return JSON.parse(localStorage.getItem('hanv1')||'{}').aSai|0; }catch(e){ return -1; } })
});

/* ── ⑤ Cửa mã Secret Chamber ── */
{
  const ctx = await br.newContext({ viewport:{width:420,height:900} });
  const p0 = await ctx.newPage();
  await p0.goto(B+'/han/961030-b/', { waitUntil:'load' }); await cho(p0,900);
  const n = await p0.locator('#cells .cell').count();
  await ctx.close();
  await thuCua({
    ten: 'Cửa mã Secret Chamber',
    sel: '#inp', saiMa: '9'.repeat(n || 6),
    mo: async p => {
      await p.goto(B+'/han/961030-b/', { waitUntil:'load' }); await cho(p,900);
      return await p.locator('#cells .cell').count() > 0;
    },
    dem: p => p.evaluate(()=>{ try{ return JSON.parse(localStorage.getItem('hanv1')||'{}').bSai|0; }catch(e){ return -1; } })
  });
}

/* ── ⑥ CHỐT 2 CHỈ HOÃN, KHÔNG BỎ — gõ tay thật nhanh vẫn phải được tính ── */
{
  console.log('\n▸ Gõ tay thật nhanh sau khi sai — hoãn chứ không bỏ');
  const ctx = await br.newContext({ viewport:{width:420,height:900} });
  const p = await ctx.newPage();
  const errs=[]; p.on('pageerror', e=>errs.push(e.message));
  await p.goto(B+'/?stay=1', { waitUntil:'load' }); await cho(p,1500);
  await p.evaluate(()=>{ const k=document.querySelector('.kao'); for(let i=0;i<3;i++) k.click(); });
  await cho(p,400);
  const dem = ()=> p.evaluate(()=> +sessionStorage.getItem('ls_sai') || 0);
  await goTay(p, '#lsIn', '1111'); await cho(p, 1500);
  const a = await dem();
  await p.locator('#lsIn').focus();
  await p.locator('#lsIn').pressSequentially('1111', { delay: 0 });   /* đập lại ngay, 0ms */
  await cho(p, 2600);
  const b = await dem();
  T('gõ lại ngay tức thì: lượt bị HOÃN chứ không mất', b === a + 1, 'trước '+a+' → sau '+b);
  T('không lỗi JS', errs.length === 0, errs.join(' | '));
  await ctx.close();
}

/* ── ⑦ Ô nhập nào cũng phải chối bộ nhớ mật khẩu của trình duyệt ── */
{
  console.log('\n▸ Thuộc tính chối tự điền trên mọi ô mã');
  const CAN = ['autocomplete="off"', 'data-lpignore', 'data-form-type="other"', 'data-1p-ignore'];
  /* Neo vào ID của ô, không neo vào tên lớp — tên lớp còn nằm trong bảng CSS
     ở trên, cắt trúng đó thì đoạn đọc được là mấy dòng màu sắc, không có
     thuộc tính nào. */
  const FILE = [
    ['/assets/lichsu.js',        'lsIn'],
    ['/index.html',              'pinIn'],
    ['/dad/950901-a/index.html', 'msnIn']
  ];
  for(const [u, id] of FILE){
    const src = await (await fetch(B+u)).text();
    const i = src.indexOf('id="' + id + '"');
    const doan = i < 0 ? '' : src.slice(Math.max(0, i - 260), i + 520);
    const thieu = CAN.filter(x => !doan.includes(x));
    T(u + ' · ô #' + id + ' khai đủ thuộc tính chối tự điền',
      i >= 0 && thieu.length === 0, i < 0 ? 'không thấy ô' : 'thiếu ' + thieu.join(', '));
  }
  const dadA = await (await fetch(B+'/dad/950901-a/index.html')).text();
  T('không còn autocomplete="one-time-code" (iOS tự điền hăng nhất ở đây)',
    !dadA.includes('one-time-code'));
}

console.log('\nTỔNG: '+ok+' đạt / '+ng+' hỏng');
await br.close(); process.exit(ng?1:0);
