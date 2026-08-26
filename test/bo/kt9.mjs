import { moTrinhDuyet, DIA_CHI, GOC, require } from '../chung.mjs';
const B = DIA_CHI;
const br = await moTrinhDuyet();
let pass=0, fail=0;
const ok=(t,c,x='')=>{ c?pass++:fail++; console.log((c?'  ✓ ':'  ✗ ')+t+(x?'  → '+x:'')); };

const ST = ()=>JSON.stringify({v:3,m1:true,m2:false,m1at:Date.now(),m2at:Date.now()+5*864e5});
async function moHop(p){
  await p.click('#msnLine'); await p.waitForTimeout(700);
  await p.waitForSelector('#msnIn',{timeout:8000});
}
const hint = p => p.evaluate(()=>{const u=document.querySelector('.msn-card .msn-hints');return u?u.innerText.trim():''});
const khoa = p => p.evaluate(()=>{const i=document.getElementById('msnIn');return i?i.disabled:null});

console.log('\n① Mission 2 — gợi ý ở LẦN KHOÁ THỨ HAI (6 lần sai)');
{
  const ctx=await br.newContext({viewport:{width:390,height:844}});
  const p=await ctx.newPage(); const errs=[]; p.on('pageerror',e=>errs.push(e.message));
  await p.addInitScript(st=>{
    localStorage.setItem('msn1', st);
    localStorage.setItem('nav1', JSON.stringify({v:2,profiles:[],active:-1}));
  }, ST());
  await p.goto(B+'/dad/950901-a/',{waitUntil:'load'}); await p.waitForTimeout(1800);
  await moHop(p);
  ok('mốc gợi ý = TRY_S × 2 = 6', await p.evaluate(()=>{
    /* đọc lại qua hành vi: sai 5 lần chưa có, lần 6 mới có — kiểm ở dưới */
    return true; }));

  for(let i=1;i<=2;i++){ await p.fill('#msnIn',''); await p.fill('#msnIn','WRONG'+i); await p.press('#msnIn','Enter'); await p.waitForTimeout(420); }
  ok('sai 1-2: chưa gợi ý, chưa khoá', (await hint(p))==='' && (await khoa(p))===false);

  await p.fill('#msnIn',''); await p.fill('#msnIn','WRONGX'); await p.press('#msnIn','Enter'); await p.waitForTimeout(500);
  ok('sai lần 3: BỊ KHOÁ nhưng VẪN CHƯA có gợi ý',
     (await hint(p))==='' && (await khoa(p))===true, 'gợi ý="'+await hint(p)+'" khoá='+await khoa(p));
  ok('  chưa bật cờ m2goi', await p.evaluate(()=>!JSON.parse(localStorage.getItem('msn1')).m2goi));
  ok('  bộ đếm phiên = 3', await p.evaluate(()=>sessionStorage.getItem('msnsai')==='3'),
     'msnsai='+await p.evaluate(()=>sessionStorage.getItem('msnsai')));

  /* hết hạn khoá → mở lại hộp, sai tiếp 3 lần nữa */
  await p.evaluate(()=>{ const st=JSON.parse(localStorage.getItem('msn1')); st.lockUntil=0;
    localStorage.setItem('msn1', JSON.stringify(st)); sessionStorage.setItem('msnw','0'); });
  await p.reload({waitUntil:'load'}); await p.waitForTimeout(1800);
  await moHop(p);
  ok('sau khi hết khoá: bộ đếm phiên VẪN giữ 3 (không reset)',
     await p.evaluate(()=>sessionStorage.getItem('msnsai')==='3'),
     'msnsai='+await p.evaluate(()=>sessionStorage.getItem('msnsai')));
  for(let i=4;i<=5;i++){ await p.fill('#msnIn',''); await p.fill('#msnIn','WRONG'+i); await p.press('#msnIn','Enter'); await p.waitForTimeout(420); }
  ok('sai 4-5: vẫn chưa có gợi ý', (await hint(p))==='', '"'+await hint(p)+'"');
  await p.fill('#msnIn',''); await p.fill('#msnIn','WRONGZ'); await p.press('#msnIn','Enter'); await p.waitForTimeout(550);
  ok('sai lần 6 (khoá lần hai): HIỆN gợi ý',
     (await hint(p))==='Trong DOTA2, anh chơi vị trí gì?', '"'+await hint(p)+'"');
  ok('  gợi ý hiện kể cả khi ô nhập vừa bị khoá', (await khoa(p))===true, 'khoá='+await khoa(p));
  ok('  đã bật cờ m2goi (nhớ mãi)', await p.evaluate(()=>JSON.parse(localStorage.getItem('msn1')).m2goi===true));
  ok('không lỗi JS', errs.length===0, errs.join(' '));
  await ctx.close();
}

console.log('\n② Bộ đếm reset khi đóng phiên (chưa tới mốc)');
{
  const ctx=await br.newContext({viewport:{width:390,height:844}});
  const p=await ctx.newPage();
  await p.addInitScript(st=>{
    localStorage.setItem('msn1', st);
    localStorage.setItem('nav1', JSON.stringify({v:2,profiles:[],active:-1}));
  }, ST());
  await p.goto(B+'/dad/950901-a/',{waitUntil:'load'}); await p.waitForTimeout(1800);
  await moHop(p);
  for(let i=1;i<=2;i++){ await p.fill('#msnIn',''); await p.fill('#msnIn','NOPEE'+i); await p.press('#msnIn','Enter'); await p.waitForTimeout(420); }
  ok('phiên 1: sai 2 lần, bộ đếm = 2', await p.evaluate(()=>sessionStorage.getItem('msnsai')==='2'));
  ok('  chưa bật cờ m2goi', await p.evaluate(()=>!JSON.parse(localStorage.getItem('msn1')).m2goi));
  await ctx.close();

  /* PHIÊN MỚI — tiến độ game giữ, bộ đếm sai phải về 0 */
  const c2=await br.newContext({viewport:{width:390,height:844}});
  const p2=await c2.newPage();
  await p2.addInitScript(st=>{
    localStorage.setItem('msn1', st);
    localStorage.setItem('nav1', JSON.stringify({v:2,profiles:[],active:-1}));
  }, ST());
  await p2.goto(B+'/dad/950901-a/',{waitUntil:'load'}); await p2.waitForTimeout(1800);
  ok('phiên 2: bộ đếm đã về rỗng', await p2.evaluate(()=>!sessionStorage.getItem('msnsai')),
     'msnsai='+await p2.evaluate(()=>String(sessionStorage.getItem('msnsai'))));
  await moHop(p2);
  for(let i=1;i<=3;i++){ await p2.fill('#msnIn',''); await p2.fill('#msnIn','AGAIN'+i); await p2.press('#msnIn','Enter'); await p2.waitForTimeout(420); }
  ok('  sai 3 lần ở phiên mới: vẫn CHƯA gợi ý (đếm lại từ đầu)',
     (await hint(p2))==='', '"'+await hint(p2)+'"');
  await c2.close();
}
console.log('\n──────── '+pass+' đạt / '+fail+' hỏng');
await br.close(); process.exit(fail?1:0);
