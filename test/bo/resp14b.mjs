import { moTrinhDuyet, DIA_CHI, GOC, require } from '../chung.mjs';
const B = DIA_CHI;
const br = await moTrinhDuyet();
let ok=0,ng=0; const T=(n,c,note='')=>{ if(c){ok++;} else {ng++;console.log('  ✗ '+n+(note?'  → '+note:''));} };
const VP=[['SE',320,568],['14',390,844],['tab',768,1024],['PC',1280,800]];

const soi = (sel,ent)=>({sel,ent});
async function cua(p, hopSel, cellSel){
  return p.evaluate(([hs,cs])=>{
    const hop=document.querySelector(hs);
    if(!hop) return {thieu:true};
    const rh=hop.getBoundingClientRect();
    const ds=[...document.querySelectorAll(cs)].map(x=>x.getBoundingClientRect());
    if(!ds.length) return {thieu:true};
    const hang=new Set(ds.map(r=>Math.round(r.top))).size;
    /* Hàng ô phải nằm trọn trong hộp VÀ căn giữa — đây là chỗ đời trước lệch
       khi còn nhét thêm một ô ↵ vào hàng. */
    const tr=Math.min(...ds.map(r=>r.left)), ph=Math.max(...ds.map(r=>r.right));
    return { trongMan: rh.left>=-1 && rh.right<=innerWidth+1,
             oTrong: ds.every(r=>r.left>=rh.left-1 && r.right<=rh.right+1),
             oCanGiua: Math.abs((tr+ph)/2 - (rh.left+rh.right)/2) < 3,
             hangO: hang };
  },[hopSel,cellSel]);
}

for(const [vn,w,h] of VP){
  // ── Zoey's Castle: cửa mã (hàng ô có thể xuống hai dòng) ──
  { const ctx=await br.newContext({viewport:{width:w,height:h}}); const p=await ctx.newPage();
    await p.goto(B+'/han/961030-a/',{waitUntil:'load'});
    await p.evaluate(()=>localStorage.setItem('mtv1',JSON.stringify({eggWin:true})));
    await p.reload({waitUntil:'load'}); await p.waitForTimeout(900);
    const d=await cua(p,'.card','#cells .cell');
    T('Zoey cửa mã/'+vn, !d.thieu&&d.trongMan&&d.oTrong&&d.oCanGiua, JSON.stringify(d));
    await ctx.close(); }
  // ── Secret Chamber ──
  { const ctx=await br.newContext({viewport:{width:w,height:h}}); const p=await ctx.newPage();
    await p.goto(B+'/han/961030-b/',{waitUntil:'load'}); await p.waitForTimeout(900);
    const d=await cua(p,'.card','#cells .cell');
    T('Chamber cửa mã/'+vn, !d.thieu&&d.trongMan&&d.oTrong&&d.oCanGiua, JSON.stringify(d));
    await ctx.close(); }
  // ── Mission 2 ──
  { const ctx=await br.newContext({viewport:{width:w,height:h}}); const p=await ctx.newPage();
    await p.goto(B+'/dad/950901-a/',{waitUntil:'load'}); await p.waitForTimeout(2500);
    for(let k=0;k<4;k++){ await p.click('#msnLine'); await p.waitForTimeout(430);
      if(await p.locator('#msnCells').count()) break; }
    const d=await cua(p,'.msn-card','.msn-cell');
    T('Mission 2 cửa mã/'+vn, !d.thieu&&d.trongMan&&d.oTrong&&d.oCanGiua, JSON.stringify(d));
    await ctx.close(); }
  // ── ô PIN bản đồ ──
  { const ctx=await br.newContext({viewport:{width:w,height:h}}); const p=await ctx.newPage();
    await p.goto(B+'/?stay=1',{waitUntil:'load'}); await p.waitForTimeout(1500);
    await p.evaluate(()=>openPin('map')); await p.waitForTimeout(300);
    const d=await cua(p,'.cxp','#pinDash span');
    T('PIN bản đồ/'+vn, !d.thieu&&d.trongMan&&d.oTrong&&d.oCanGiua, JSON.stringify(d));
    await ctx.close(); }
}
console.log('TỔNG: '+ok+' đạt / '+ng+' hỏng');
await br.close(); process.exit(ng?1:0);
