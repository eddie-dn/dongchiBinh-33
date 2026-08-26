import { moTrinhDuyet, DIA_CHI, GOC, require } from '../chung.mjs';
const B = DIA_CHI;
const br = await moTrinhDuyet();
let ok=0,ng=0; /* ĐỢT 18: ô mã nào cũng CHỈ tự chấm khi mỗi nhịp dài thêm đúng một ký tự —
   `fill()` nhét cả cụm một phát, đúng hình dạng cú TỰ ĐIỀN của trình duyệt,
   nên không còn tính là gõ. Chỗ nào cần "gõ như người thật" thì gõ tuần tự. */
const goTay = async (p, sel, txt) => {
  await p.locator(sel).fill('');
  await p.locator(sel).focus();
  await p.locator(sel).pressSequentially(txt, { delay: 55 });
};
const T=(n,c,note='')=>{ if(c){ok++;console.log('  ✓ '+n);} else {ng++;console.log('  ✗ '+n+(note?'  → '+note:''));} };

/* Sổ là NGUỒN SỰ THẬT. Mọi tem và mọi thẻ toạ độ phải khớp nó. */
const ctx0=await br.newContext({viewport:{width:420,height:900}}); const p0=await ctx0.newPage();
await p0.goto(B+'/?stay=1',{waitUntil:'load'}); await p0.waitForTimeout(1500);
const SO = await p0.evaluate(()=>{
  const r={}; for(const k of ['MAP','EGG','DAD-A','DAD-B','HAN-A','HAN-B','FX']) r[k]=LichSu.tem(k);
  return r;
});
console.log('\n① SỔ nói gì');
for(const [k,v] of Object.entries(SO)) console.log('   %s%s · %s', k.padEnd(7), v.ver, v.ngay);

console.log('\n② TEM NGOÀI TRANG khớp sổ — cả chữ HIỆN RA lẫn chuỗi cứng bản lùi');
const TRANG = [
  ['/?stay=1',        'MAP',   '#stamp',  'base'],
  ['/dad/950901-a/',  'DAD-A', '#vstamp', 'tinh'],
  ['/dad/950901-b/',  'DAD-B', '.vstamp', 'tinh'],
  ['/han/961030-a/',  'HAN-A', '#stamp',  'base'],
  ['/han/961030-b/',  'HAN-B', '#stamp',  'base'],
];
for(const [u,ma,sel,kieu] of TRANG){
  const ctx=await br.newContext({viewport:{width:420,height:900}}); const p=await ctx.newPage();
  await p.goto(B+u,{waitUntil:'load'}); await p.waitForTimeout(1800);
  const d=await p.evaluate(s=>{ const n=document.querySelector(s);
    return n?{txt:n.textContent.replace(/\s+/g,' ').trim(), base:n.dataset?n.dataset.base||'':''}:null; }, sel);
  const t=SO[ma];
  T(u+' tem hiện ra có đúng số + ngày của sổ',
    !!d && d.txt.includes(t.ver) && d.txt.includes(t.ngay), d? d.txt : 'không thấy tem');
  if(kieu==='base')
    T('  '+u+' chuỗi cứng (bản lùi) cũng khớp sổ',
      d.base.includes(t.ver) && d.base.includes(t.ngay), d.base);
  await ctx.close();
}

console.log('\n③ MÀN PHÁO HOA — không nạp sổ, tem cứng vẫn phải khớp sổ FX');
{
  const ctx=await br.newContext({viewport:{width:420,height:900}}); const p=await ctx.newPage();
  await p.goto(B+'/phao-hoa/',{waitUntil:'load'}); await p.waitForTimeout(1200);
  const txt=await p.evaluate(()=>document.querySelector('.vstamp')?.textContent.replace(/\s+/g,' ').trim()||'');
  T('/phao-hoa/ tem khớp sổ FX', txt.includes(SO.FX.ver) && txt.includes(SO.FX.ngay), txt);
  await ctx.close();
}

console.log('\n④ THẺ TOẠ ĐỘ trên bản đồ mang đúng số hiệu trang đó đang chạy');
{
  const ctx=await br.newContext({viewport:{width:420,height:900}}); const p=await ctx.newPage();
  await p.addInitScript(()=>{ localStorage.setItem('mtv1', JSON.stringify({
    eggWin:true, eggDone:true, g2Done:true, g2Open:true, winParty:true,
    unlocked:{HAN:1,DAD:1,UIH:1,SGN:1}, solved:{HAN:'ok',DAD:'ok',UIH:'ok',SGN:'ok'} })); });
  await p.goto(B+'/?stay=1',{waitUntil:'load'}); await p.waitForTimeout(1800);
  const the = await p.evaluate(()=>{
    const r={};
    for(const n of NODES) for(const s of n.subs){
      /* Thẻ MỞ đi qua `metaMo`, thẻ CÒN KHOÁ đi qua `metaKhoa` — cả hai đều
         nối số hiệu lấy từ sổ vào, không thẻ nào giữ số cứng trong `meta`. */
      const m = s.pub ? metaMo(s) : metaKhoa(s);
      r[s.id] = m;
    }
    return r;
  });
  const CAP = { 'HAN-961030-A':'HAN-A','HAN-961030-B':'HAN-B','DAD-950901-A':'DAD-A','DAD-950901-B':'DAD-B' };
  for(const [id,ma] of Object.entries(CAP)){
    const m = the[id]||'';
    T('thẻ '+id+' ghi '+SO[ma].ver, m.includes(SO[ma].ver), 'thẻ="'+m+'"');
  }
  await ctx.close();
}
console.log('\n⑤ HAI CỘT NGÀY — bảng in MỐC GHI NHẬN, tem in NGÀY SỬA CUỐI');
{
  const ctx=await br.newContext({viewport:{width:420,height:900}}); const p=await ctx.newPage();
  await p.goto(B+'/?stay=1',{waitUntil:'load'}); await p.waitForTimeout(1500);
  /* `ngay` không bao giờ được đi SAU `sua` — mốc mở màn phải nằm trước hoặc
     trùng ngày sửa cuối. Soi mọi dòng của cả bảy sổ. */
  const xau = await p.evaluate(()=>{
    const bs=[];
    for(const [ma,t] of Object.entries(LichSu.so)){
      (t.doi||[]).forEach((r,i)=>{
        if(r.sua && r.ngay && r.sua < r.ngay) bs.push(ma+'['+i+'] ngay='+r.ngay+' > sua='+r.sua);
      });
    }
    return bs;
  });
  T('không sổ nào có mốc ghi nhận đi sau ngày sửa cuối', xau.length===0, xau.join(', '));

  /* Ít nhất một sổ phải CHỨNG MINH được hai cột thật sự tách nhau, không thì
     luật mới chỉ nằm trên giấy. */
  const tach = await p.evaluate(()=>{
    const r=[];
    for(const ma of ['MAP','DAD-A','DAD-B','HAN-A','HAN-B','FX']){
      const t=LichSu.tem(ma);
      if(t && t.mocIso && t.iso && t.mocIso!==t.iso) r.push(ma+': mốc '+t.moc+' · tem '+t.ngay);
    }
    return r;
  });
  T('có sổ tách rõ hai mốc (' + tach.length + ' sổ)', tach.length>0, tach.join(' | '));

  /* Bảng bản ghi phải in MỐC, không phải ngày của tem. */
  await p.evaluate(()=>LichSu.mo('DAD-A')); await p.waitForTimeout(300);
  await goTay(p, '#lsIn', '0981'); await p.waitForTimeout(1400);
  const d = await p.evaluate(()=>{
    const t=LichSu.tem('DAD-A');
    const dong=[...document.querySelectorAll('.ls-doi')].pop();
    return { bang:(dong?dong.children[1].textContent:'').trim(), moc:t.mocIso, tem:t.iso };
  });
  T('bảng in mốc ghi nhận (' + d.bang + '), khác ngày tem (' + d.tem + ')',
    d.bang===d.moc && d.moc!==d.tem, JSON.stringify(d));
  await ctx.close();
}

console.log('\n⑥ CỘT NGÀY CỦA BẢNG = MỐC BẮT ĐẦU, cho CẢ BẢY SỔ');
/* Bảng bản ghi và tem đọc HAI cột khác nhau: bảng in `ngay` (mốc mở màn, ngày
   của bản .00 đầu tiên), tem in `sua` (ngày sửa cuối). Chỉ có MỘT hàm dựng
   bảng, dùng chung cho cả bảy sổ — nên soi được một lượt là soi hết. */
{
  const ctx=await br.newContext({viewport:{width:420,height:900}}); const p=await ctx.newPage();
  await p.goto(B+'/?stay=1',{waitUntil:'load'}); await p.waitForTimeout(1600);
  for(const ma of ['MAP','EGG','DAD-A','DAD-B','HAN-A','HAN-B','FX']){
    /* `mo()` dựng CỬA MÃ trước, không dựng thẳng bảng — phải qua cửa đã.
       Enter thì lúc nào cũng gửi, khỏi phụ thuộc luật tự chấm. */
    await p.evaluate(m=>LichSu.mo(m), ma);
    await p.waitForTimeout(250);
    await p.locator('#lsIn').fill('0981');
    await p.locator('#lsIn').press('Enter');
    await p.waitForTimeout(350);
    const r = await p.evaluate(m=>{
      const o = [...document.querySelectorAll('.ls-doi')].map(d=>{
        const b = d.querySelectorAll('b');
        return { ver:b[0].textContent.trim(), ngay:b[1].textContent.trim() };
      });
      const so = LichSu.so[m].doi.map(x=>({
        ver:String(x.ver), mong:(!x.ngay||x.ngay==='no info')?'N/A':x.ngay, sua:x.sua||null }));
      return { o, so, tem: LichSu.tem(m) };
    }, ma);
    const lech = r.o.map((d,i)=> (!r.so[i] || d.ngay !== r.so[i].mong) ? (d.ver+': bảng="'+d.ngay+'" sổ="'+(r.so[i]?r.so[i].mong:'—')+'"') : null).filter(Boolean);
    T(ma.padEnd(6)+' bảng in đúng cột MỐC BẮT ĐẦU ('+r.o.length+' dòng)',
      r.o.length === r.so.length && r.o.length > 0 && lech.length===0,
      lech.length ? lech.join(' , ') : ('đọc được '+r.o.length+'/'+r.so.length+' dòng'));
    /* Dòng nào có `sua` khác `ngay` thì bảng TUYỆT ĐỐI không được in `sua` */
    const nham = r.o.map((d,i)=> (r.so[i].sua && d.ngay === r.so[i].sua && r.so[i].sua !== r.so[i].mong)
      ? (d.ver+' in nhầm ngày sửa cuối') : null).filter(Boolean);
    T('  '+ma.padEnd(4)+' không dòng nào in nhầm ngày sửa cuối', nham.length===0, nham.join(' , '));
  }
  /* Và tem thì ngược lại: phải là ngày SỬA CUỐI */
  const dh = await p.evaluate(()=>{
    const bs=[];
    for(const [m,t] of Object.entries(LichSu.so)){
      const r = t.doi[t.doi.length-1], tem = LichSu.tem(m);
      if(r.sua && r.sua !== r.ngay && tem.iso !== r.sua) bs.push(m+' tem='+tem.iso+' sua='+r.sua);
    }
    return bs;
  });
  T('tem thì ngược lại — luôn là NGÀY SỬA CUỐI', dh.length===0, dh.join(' , '));
  await ctx.close();
}

console.log('\nTỔNG: '+ok+' đạt / '+ng+' hỏng');
await br.close(); process.exit(ng?1:0);
