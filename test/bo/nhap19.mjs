/* ĐỢT 19 · Ô NHẬP: NHANH HƠN, VÀ KHÔNG NUỐT LƯỢT OAN
   ① tự điền / dán không tự chấm — nhưng Enter vẫn gửi
   ② dán/tự điền vào rồi SỬA MỘT KÝ TỰ cũng không tự chấm (bệnh "nhấp 1 ký tự
      2 lần → hiện lại đáp án sai → mất 2 lượt")
   ③ xoá một cái là rụng đúng một ô — ô nhập không còn chứa ký tự vô hình
   ④ gõ sai xong gõ lại phải NHANH bằng lần đầu (đã bỏ hẳn nhịp nghỉ 900ms) */
import { moTrinhDuyet, DIA_CHI, GOC, require } from '../chung.mjs';
const B = DIA_CHI;
const br = await moTrinhDuyet();
let ok=0,ng=0;
const T=(n,c,note='')=>{ if(c){ok++;console.log('  ✓ '+n);} else {ng++;console.log('  ✗ '+n+(note?'  → '+note:''));} };
const cho=(p,ms)=>p.waitForTimeout(ms);
const goTay = async (p, sel, txt) => {
  await p.locator(sel).focus();
  await p.locator(sel).pressSequentially(txt, { delay: 45 });
};
const tuDien = (p, sel, txt) => p.evaluate(([s,v])=>{
  const el=document.querySelector(s); el.focus(); el.value=v;
  el.dispatchEvent(new Event('input',{bubbles:true}));            /* trình quản lý mật khẩu */
}, [sel, txt]);
const tuDienChrome = (p, sel, txt) => p.evaluate(([s,v])=>{
  const el=document.querySelector(s); el.focus(); el.value=v;
  el.dispatchEvent(new InputEvent('input',{bubbles:true, inputType:'insertReplacementText', data:v}));
}, [sel, txt]);

async function thuCua({ ten, mo, sel, saiMa, dem, oSel }){
  console.log('\n▸ ' + ten);
  const ctx = await br.newContext({ viewport:{width:420,height:900} });
  const p = await ctx.newPage();
  const errs=[]; p.on('pageerror', e=>errs.push(e.message));
  if(!(await mo(p))){ T(ten+': mở được cửa mã', false); await ctx.close(); return; }

  const d0 = await dem(p);
  await tuDien(p, sel, saiMa);      await cho(p, 1500);
  await tuDienChrome(p, sel, saiMa); await cho(p, 1500);
  T('tự điền (2 kiểu): không nuốt lượt', (await dem(p)) === d0, 'trước '+d0+' → sau '+(await dem(p)));

  /* ② CHÍNH BỆNH MỚI: ô đang đầy do tự điền → xoá 1 ký tự rồi gõ lại 1 ký tự */
  const d1 = await dem(p);
  await p.locator(sel).focus();
  await p.keyboard.press('Backspace'); await cho(p, 120);
  await p.keyboard.press(saiMa[saiMa.length-1]); await cho(p, 1600);
  T('sửa 1 ký tự trong ô ĐÃ ĐẦY sẵn: KHÔNG tự chấm', (await dem(p)) === d1,
    'trước '+d1+' → sau '+(await dem(p)));
  await p.keyboard.press('Backspace'); await cho(p, 120);
  await p.keyboard.press(saiMa[saiMa.length-1]); await cho(p, 1600);
  T('làm lần hai cũng vậy (bệnh cũ mất 2 lượt)', (await dem(p)) === d1, 'sau '+(await dem(p)));

  /* Enter vẫn là đường thoát */
  await p.locator(sel).press('Enter'); await cho(p, 400);
  const d2 = await dem(p);
  T('Enter vẫn gửi được cụm vừa tự điền', d2 === d1 + 1, 'trước '+d1+' → sau '+d2);

  /* ③ xoá: một cái rụng đúng một ô, kể cả sau khi gõ dấu cách / chữ có dấu */
  await goTay(p, sel, saiMa.slice(0, 3));
  await p.keyboard.type('   ');                      /* dấu cách: phải bị nuốt hẳn */
  await cho(p, 200);
  const truocXoa = await p.evaluate(s=>document.querySelector(s).value.length, sel);
  const oTruoc = await p.locator(oSel + '.fill, ' + oSel + '.on').count().catch(()=>0);
  await p.keyboard.press('Backspace'); await cho(p, 200);
  const sauXoa = await p.evaluate(s=>document.querySelector(s).value.length, sel);
  T('ô nhập không chứa ký tự vô hình (dấu cách bị nuốt ngay)', truocXoa === 3, 'dài '+truocXoa);
  T('xoá một cái rụng đúng một ký tự', sauXoa === 2, truocXoa+' → '+sauXoa);

  /* ④ gõ tay vẫn tự chấm, và gõ SAI XONG GÕ LẠI phải nhanh bằng lần đầu */
  await p.evaluate(s=>{ const el=document.querySelector(s); el.value=''; el.dispatchEvent(new Event('input',{bubbles:true})); }, sel);
  await cho(p, 200);
  const d3 = await dem(p);
  let t0 = Date.now();
  await goTay(p, sel, saiMa);
  await p.waitForFunction(([f,n])=>window.__dem ? window.__dem() > n : true, [null, d3], { timeout: 4000 }).catch(()=>{});
  await cho(p, 1200);
  const lan1 = Date.now() - t0;
  const d4 = await dem(p);
  T('gõ tay đủ ký tự: vẫn tự chấm', d4 === d3 + 1, 'trước '+d3+' → sau '+d4);
  t0 = Date.now();
  await goTay(p, sel, saiMa);
  await cho(p, 1200);
  const lan2 = Date.now() - t0;
  const d5 = await dem(p);
  T('sai xong gõ lại: vẫn tính lượt', d5 === d4 + 1, 'trước '+d4+' → sau '+d5);
  T('sai xong gõ lại KHÔNG chậm hơn lần đầu (hết nhịp nghỉ 900ms)',
    lan2 <= lan1 + 250, 'lần đầu '+lan1+'ms · lần sau '+lan2+'ms');

  T('không lỗi JS', errs.length === 0, errs.join(' | '));
  await ctx.close();
}

await thuCua({
  ten: 'Cửa mã sổ bản ghi', sel:'#lsIn', saiMa:'1111', oSel:'.ls-o i',
  mo: async p => {
    await p.goto(B+'/?stay=1',{waitUntil:'load'}); await cho(p,1500);
    await p.evaluate(()=>{ const k=document.querySelector('.kao'); for(let i=0;i<3;i++) k.click(); });
    await cho(p,400); return await p.locator('#lsIn').count()>0;
  },
  dem: p => p.evaluate(()=> +sessionStorage.getItem('ls_sai') || 0)
});

await thuCua({
  ten: 'Ô PIN hồ sơ — bản đồ', sel:'#pinIn', saiMa:'1111', oSel:'#pinDash span',
  mo: async p => {
    await p.goto(B+'/?stay=1',{waitUntil:'load'}); await cho(p,1500);
    await p.evaluate(()=>openPin('file','thu')); await cho(p,400);
    return await p.locator('#pinDash span').count()>0;
  },
  dem: p => p.evaluate(()=>pinFail)
});

await thuCua({
  ten: 'Ô mã Mission 2 — Hồ sơ Phi đoàn', sel:'#msnIn', saiMa:'XXXXXX', oSel:'.msn-cell',
  mo: async p => {
    await p.goto(B+'/dad/950901-a/',{waitUntil:'load'}); await cho(p,2500);
    for(let k=0;k<5;k++){ await p.click('#msnLine'); await cho(p,430);
      if(await p.locator('#msnCells').count()) break; }
    return await p.locator('#msnIn').count()>0;
  },
  dem: p => p.evaluate(()=>{ try{ return JSON.parse(localStorage.getItem('msn1')||'{}').dayN|0; }catch(e){ return -1; } })
});

await thuCua({
  ten: "Cửa mã Zoey's Castle", sel:'#inp', saiMa:'ZZZZZZZZZ', oSel:'#cells .cell',
  mo: async p => {
    await p.goto(B+'/han/961030-a/',{waitUntil:'load'});
    await p.evaluate(()=>localStorage.setItem('mtv1', JSON.stringify({eggWin:true})));
    await p.reload({waitUntil:'load'}); await cho(p,1200);
    return (await p.locator('#cells .cell').count()) === 9;
  },
  dem: p => p.evaluate(()=>{ try{ return JSON.parse(localStorage.getItem('hanv1')||'{}').aSai|0; }catch(e){ return -1; } })
});

{
  const ctx=await br.newContext({viewport:{width:420,height:900}}); const p0=await ctx.newPage();
  await p0.goto(B+'/han/961030-b/',{waitUntil:'load'}); await cho(p0,900);
  const n = await p0.locator('#cells .cell').count(); await ctx.close();
  await thuCua({
    ten:'Cửa mã Secret Chamber', sel:'#inp', saiMa:'9'.repeat(n||6), oSel:'#cells .cell',
    mo: async p => { await p.goto(B+'/han/961030-b/',{waitUntil:'load'}); await cho(p,900);
      return await p.locator('#cells .cell').count()>0; },
    dem: p => p.evaluate(()=>{ try{ return JSON.parse(localStorage.getItem('hanv1')||'{}').bSai|0; }catch(e){ return -1; } })
  });
}

console.log('\nTỔNG: '+ok+' đạt / '+ng+' hỏng');
await br.close(); process.exit(ng?1:0);
