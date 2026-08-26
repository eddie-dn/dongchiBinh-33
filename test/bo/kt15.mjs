import { moTrinhDuyet, DIA_CHI, GOC, require } from '../chung.mjs';
const B = DIA_CHI;
const br = await moTrinhDuyet();
let ok=0,ng=0; const T=(n,c,note='')=>{ if(c){ok++;console.log('  ✓ '+n);} else {ng++;console.log('  ✗ '+n+(note?'  → '+note:''));} };

console.log('\n① MẶT CƯỜI trong Box Tổng tư lệnh — sáng lên như Khối Vận Hành');
{
  const ctx=await br.newContext({viewport:{width:390,height:844}}); const p=await ctx.newPage();
  await p.goto(B+'/?stay=1',{waitUntil:'load'}); await p.waitForTimeout(1600);
  /* Mặt cười nằm trong Box Tổng tư lệnh — mở box ra (5 nhịp vào dòng bản quyền) */
  for(let i=0;i<5;i++){ await p.click('#flagZone',{force:true}); await p.waitForTimeout(90); }
  await p.waitForTimeout(500);
  T('mở được Box Tổng tư lệnh', await p.evaluate(()=>{
    const k=document.querySelector('.kao'); const r=k.getBoundingClientRect();
    return r.width>0 && r.top>=0 && r.bottom<=innerHeight+200; }));
  const d=await p.evaluate(()=>{
    const k=document.querySelector('.kao');
    return { cls:k.className, chu:k.classList.contains('ls-chu'),
             troc:getComputedStyle(k).cursor, mau:getComputedStyle(k).color };
  });
  T('mặt cười mang class .ls-chu', d.chu, d.cls);
  T('KHÔNG đổi con trỏ (giữ chất cửa hậu)', d.troc==='default'||d.troc==='auto', d.troc);
  await p.hover('.kao'); await p.waitForTimeout(280);
  const h=await p.evaluate(()=>{ const cs=getComputedStyle(document.querySelector('.kao'));
    return { mau:cs.color, bong:cs.textShadow, anim:cs.animationName }; });
  T('trỏ vào thì có quầng sáng', h.bong!=='none', 'text-shadow='+h.bong);
  T('trỏ vào thì nháy như Khối Vận Hành', h.anim==='lsNhay', 'animation='+h.anim);
  await p.evaluate(()=>{const k=document.querySelector('.kao'); k.click(); k.click();});
  await p.waitForTimeout(90);
  T('bấm trúng nhịp thì loé một cái', await p.evaluate(()=>document.querySelector('.kao').classList.contains('go')));
  await ctx.close();
}

console.log('\n② ĐỘ DÀI CLIP nổ sập lab — khớp file thật');
{
  const ctx=await br.newContext({viewport:{width:390,height:844}}); const p=await ctx.newPage();
  await p.goto(B+'/dad/950901-b/',{waitUntil:'load'}); await p.waitForTimeout(1000);
  const t=await p.evaluate(()=>({ un:GAME_CONFIG.timing.anim_unlock, wr:GAME_CONFIG.timing.anim_wrong,
                                  out:GAME_CONFIG.timing.slab1_out_at, fade:GAME_CONFIG.timing.slab1_fade_ms }));
  T('anim_unlock = 10050ms (file thật 201×50ms)', t.un===10050, String(t.un));
  T('anim_wrong giữ 2000ms (clip là vòng lặp)', t.wr===2000, String(t.wr));
  const het=(t.out*t.un+t.fade)/t.un*100;
  T('RAZER tắt hẳn trước mốc chớp nổ 12%', het<12, 'tắt ở '+het.toFixed(1)+'% clip');
  await ctx.close();
}

console.log('\n③ TRAO CON TRỎ mỗi khi mở lại ô nhập');
{
  const ctx=await br.newContext({viewport:{width:390,height:844}}); const p=await ctx.newPage();
  await p.clock.install({ time:new Date('2026-09-05T10:00:00+07:00') });
  await p.goto(B+'/dad/950901-b/',{waitUntil:'load'});
  await p.waitForTimeout(1200); await p.clock.runFor(20000);
  await p.waitForSelector('#gPlay:not([hidden])',{timeout:40000});
  await p.click('#gPlay'); await p.waitForTimeout(1200);
  await p.waitForSelector('#startBtn:not([hidden])',{timeout:60000});
  await p.click('#startBtn');
  await p.clock.resume();
  const ai=()=>p.evaluate(()=>document.activeElement?.id||document.activeElement?.tagName||'null');
  /* Ô nhập bật sẵn từ đầu, nên không thể chờ `!disabled` — phải chờ ĐÚNG lúc
     màn dẫn truyện chạy xong và ô nhập được trao con trỏ. */
  const choTro = async ms => { try{ await p.waitForFunction(
    ()=>document.activeElement && document.activeElement.id==='answer', {timeout:ms}); }catch(e){} };
  await choTro(60000);
  T('vào vòng 1: con trỏ TỰ về ô nhập (không phải bấm tay)', (await ai())==='answer', await ai());
  for(const ch of 'RAZER'){ await p.keyboard.type(ch); await p.waitForTimeout(250); }
  await p.waitForFunction(()=>document.getElementById('slab2').classList.contains('vis'),{timeout:150000});
  await p.evaluate(()=>document.activeElement && document.activeElement.blur && document.activeElement.blur());
  await choTro(90000);
  T('giải xong vòng 1 → vào vòng 2: con trỏ TỰ về ô nhập', (await ai())==='answer', await ai());
  await ctx.close();
}
console.log('\nTỔNG: '+ok+' đạt / '+ng+' hỏng');
await br.close(); process.exit(ng?1:0);
