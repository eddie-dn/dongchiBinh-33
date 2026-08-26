import { moTrinhDuyet, DIA_CHI, GOC, require } from '../chung.mjs';
const b = await moTrinhDuyet();
const ctx=await b.newContext({viewport:{width:420,height:900}}); const p=await ctx.newPage();
let ok=0,ng=0; const T=(n,c,note='')=>{ if(c){ok++;console.log('  ✓ '+n);} else {ng++;console.log('  ✗ '+n+(note?'  → '+note:''));} };
await p.goto('http://127.0.0.1:8099/dad/950901-b/',{waitUntil:'load'}); await p.waitForTimeout(1200);
const r = await p.evaluate(()=>{
  /* Màn chơi đang ẩn trước PRESS START — phần tử trong cây display:none KHÔNG
     chạy animation, nên phải mở nó ra mới soi được. */
  const sc=document.getElementById('scene-game');
  sc.hidden=false; sc.style.display='block';
  const narr=document.querySelector('#scene-game .narr') || (()=>{ const d=document.createElement('div');
    d.className='narr'; document.getElementById('scene-game').appendChild(d); return d; })();
  const q=document.createElement('p'); q.className='line wait';
  for(let i=0;i<3;i++) q.appendChild(document.createElement('i'));
  narr.appendChild(q);
  const it=[...q.children].map(e=>{ const cs=getComputedStyle(e);
    return { name:cs.animationName, dur:cs.animationDuration, delay:cs.animationDelay,
             w:cs.width, h:cs.height, r:cs.borderRadius }; });
  return { it, display:getComputedStyle(q).display };
});
const sau = await p.evaluate(async()=>{
  await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));
  const i=document.querySelector('.line.wait i');
  const a=i.getAnimations();
  await new Promise(r=>setTimeout(r,300));
  const y=getComputedStyle(i).transform;
  return { n:a.length, ct:a[0]?Math.round(a[0].currentTime):-1, tf:y };
});
r.anim = sau.n;
console.log('  sau 2 khung + 300ms:', JSON.stringify(sau));
console.log('  chi tiết:', JSON.stringify(r.it[0]), '| trễ:', r.it.map(x=>x.delay).join(' / '));
T('ba chấm dựng bằng thẻ, xếp ngang', r.display==='flex');
T('chấm VUÔNG, không bo tròn', r.it.every(x=>x.r==='0px'), r.it.map(x=>x.r).join(','));
T('nhảy theo nấc, không có nửa ô', ['0px','-3px'].includes(
    (sau.tf.match(/,\s*(-?[\d.]+)\)$/)||[])[1]!==undefined ? (sau.tf.match(/,\s*(-?[\d.]+)\)$/)[1]+'px') : sau.tf),
  'transform='+sau.tf);
T('có chạy animation owGo', r.it.every(x=>x.name==='owGo'), r.it.map(x=>x.name).join(','));
T('mỗi chấm lệch pha', r.it[0].delay!==r.it[1].delay && r.it[1].delay!==r.it[2].delay, r.it.map(x=>x.delay).join('/'));
T('trình duyệt thật sự chạy animation', r.anim>0, 'số animation='+r.anim);
console.log('\nTỔNG: '+ok+' đạt / '+ng+' hỏng');
await b.close(); process.exit(ng?1:0);
