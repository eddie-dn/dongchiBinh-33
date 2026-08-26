/* ĐỢT 20 · PÍ DANH TỰ LƯU — người chơi không phải nhớ bấm Lưu */
import { moTrinhDuyet, DIA_CHI, GOC, require } from '../chung.mjs';
const B = DIA_CHI;
const br = await moTrinhDuyet();
let ok=0,ng=0;
const T=(n,c,note='')=>{ if(c){ok++;console.log('  ✓ '+n);} else {ng++;console.log('  ✗ '+n+(note?'  → '+note:''));} };

/* Dựng một người chơi có sẵn pí danh, ở đúng chặng muốn thử */
async function mo({ msn = {}, mtv = null, pf = null } = {}){
  const ctx = await br.newContext({ viewport:{width:420,height:900} });
  const p = await ctx.newPage();
  await p.addInitScript(([m, t, hs])=>{
    localStorage.setItem('msn1', JSON.stringify(m));
    if(t) localStorage.setItem('mtv1', JSON.stringify(t));
    localStorage.setItem('nav1', JSON.stringify({ v:2, active:0, mapUnlocked:!!(m&&m.m3),
      profiles:[ hs || { name:'THU', savedAt:0, moc:'—', snap:null } ] }));
  }, [msn, mtv, pf]);
  await p.goto(B+'/dad/950901-a/',{waitUntil:'load'});
  await p.waitForTimeout(2200);
  return { p, ctx };
}
const banLuu = p => p.evaluate(()=>{
  try{ const n = JSON.parse(localStorage.getItem('nav1')||'{}');
    return (n.profiles||[])[n.active|0] || null; }catch(e){ return null; }
});

console.log('\n① MỞ LẠI TRANG BÌA là tiến độ được cất vào pí danh');
{
  const { p, ctx } = await mo({ msn:{ m1:true, m1at:Date.now()-864e5 } });
  const s = await banLuu(p);
  T('có bản lưu ngay khi mở trang', !!(s && s.snap), JSON.stringify(s && s.moc));
  T('bản lưu mang đúng chặng M1', !!(s && s.snap && s.snap.msn1 && s.snap.msn1.m1), JSON.stringify(s && s.moc));
  await ctx.close();
}

console.log('\n② RỜI TRANG / GIẤU TAB cũng cất — không phải nhớ bấm Lưu');
{
  const { p, ctx } = await mo({ msn:{ m1:true, m2:true, m1at:Date.now()-864e5, m2doneAt:Date.now()-864e5 },
    pf:{ name:'THU', savedAt:0, moc:'—', snap:null } });
  /* Tiến thêm một bậc NGAY TRONG PHIÊN, không đụng vào nút Lưu nào cả */
  await p.evaluate(()=>{
    const v = JSON.parse(localStorage.getItem('msn1')||'{}');
    v.m3 = true; localStorage.setItem('msn1', JSON.stringify(v));
  });
  const truoc = await banLuu(p);
  await p.evaluate(()=>document.dispatchEvent(new Event('visibilitychange')));
  await p.waitForTimeout(200);
  /* `visibilitychange` giả không đổi document.hidden, nên thử đường thật: ẩn tab */
  const cdp = await p.context().newCDPSession(p);
  await cdp.send('Emulation.setPageScaleFactor', { pageScaleFactor: 1 }).catch(()=>{});
  await p.evaluate(()=>{ Object.defineProperty(document,'hidden',{value:true,configurable:true});
    document.dispatchEvent(new Event('visibilitychange')); });
  await p.waitForTimeout(300);
  const sau = await banLuu(p);
  T('giấu tab là cất ngay, không cần bấm gì',
    !!(sau && sau.snap && sau.snap.msn1 && sau.snap.msn1.m3),
    'trước="'+(truoc&&truoc.moc)+'" sau="'+(sau&&sau.moc)+'"');
  await ctx.close();
}

console.log('\n③ KHÔNG ĐƯỢC GHI ĐÈ BẢN TỐT BẰNG BẢN LÙI');
{
  /* Bản lưu đang ở M3 ✓; người chơi vừa Reset sạch rồi ghé lại trang */
  const tot = { msn1:{ m1:true, m2:true, m3:true }, mtv1:{ solved:{A:1,B:1,C:1,D:1} } };
  const { p, ctx } = await mo({ msn:{}, pf:{ name:'THU', savedAt:1, moc:'TAC 4/4', snap:tot } });
  const s = await banLuu(p);
  T('ghé lại sau khi Reset: bản lưu tốt VẪN CÒN', !!(s && s.snap && s.snap.msn1 && s.snap.msn1.m3),
    'moc="'+(s&&s.moc)+'"');
  await p.evaluate(()=>{ Object.defineProperty(document,'hidden',{value:true,configurable:true});
    document.dispatchEvent(new Event('visibilitychange')); });
  await p.waitForTimeout(300);
  const s2 = await banLuu(p);
  T('giấu tab cũng không xoá mất bản tốt', !!(s2 && s2.snap && s2.snap.msn1 && s2.snap.msn1.m3),
    'moc="'+(s2&&s2.moc)+'"');
  await ctx.close();
}

console.log('\n④ CHƠI ẨN DANH thì không có gì để cất, và không được nổ lỗi');
{
  const ctx = await br.newContext({ viewport:{width:420,height:900} });
  const p = await ctx.newPage();
  const errs=[]; p.on('pageerror', e=>errs.push(e.message));
  await p.addInitScript(()=>{ localStorage.setItem('nav1', JSON.stringify({v:2,active:-1,profiles:[]})); });
  await p.goto(B+'/dad/950901-a/',{waitUntil:'load'}); await p.waitForTimeout(2000);
  await p.evaluate(()=>{ Object.defineProperty(document,'hidden',{value:true,configurable:true});
    document.dispatchEvent(new Event('visibilitychange')); });
  await p.waitForTimeout(300);
  T('ẩn danh: rời trang không nổ lỗi nào', errs.length === 0, errs.join(' | '));
  await ctx.close();
}

console.log('\n⑥ BẢN LƯU ÔM ĐỦ CẢ BA CHẶNG — không bỏ quên Zoey\'s Castle');
{
  /* Bệnh đã sửa: bản chụp chỉ ôm msn1 + mtv1, bỏ quên hanv1. Giải xong bộ câu
     hỏi Zoey's Castle rồi đổi pí danh là mất trắng phần đó. */
  const { p, ctx } = await mo({
    msn:{ m1:true, m2:true, m3:true },
    mtv:{ solved:{A:1,B:1,C:1,D:1}, eggDone:true },
    pf:{ name:'THU', savedAt:0, moc:'—', snap:null } });
  await p.evaluate(()=>localStorage.setItem('hanv1', JSON.stringify({
    dung:{q1:true,q2:true}, done:false, bOpen:false, aOpen:true })));
  await p.evaluate(()=>{ Object.defineProperty(document,'hidden',{value:true,configurable:true});
    document.dispatchEvent(new Event('visibilitychange')); });
  await p.waitForTimeout(300);
  const s = await banLuu(p);
  T('bản chụp có msn1',  !!(s && s.snap && s.snap.msn1),  JSON.stringify(Object.keys((s&&s.snap)||{})));
  T('bản chụp có mtv1',  !!(s && s.snap && s.snap.mtv1));
  T('bản chụp có hanv1 — chặng Zoey\'s Castle', !!(s && s.snap && s.snap.hanv1),
    JSON.stringify(Object.keys((s&&s.snap)||{})));
  T('KHÔNG bao giờ chụp nav1 (bản lưu ôm chính nó là hỏng)',
    !!(s && s.snap && !s.snap.nav1), JSON.stringify(Object.keys((s&&s.snap)||{})));
  await ctx.close();
}

console.log('\n⑦ MỐC hiện đúng chặng xa nhất, không dừng ở Mission');
{
  const thu = async (msn, mtv, han)=>{
    const { p, ctx } = await mo({ msn, mtv, pf:{ name:'THU', savedAt:0, moc:'—', snap:null } });
    if(han) await p.evaluate(h=>localStorage.setItem('hanv1', JSON.stringify(h)), han);
    await p.evaluate(()=>{ Object.defineProperty(document,'hidden',{value:true,configurable:true});
      document.dispatchEvent(new Event('visibilitychange')); });
    await p.waitForTimeout(300);
    const s = await banLuu(p); await ctx.close();
    return s && s.moc;
  };
  const xong3 = { m1:true, m2:true, m3:true };
  T('mới xong M1 → "M1"',        (await thu({m1:true}, null, null)) === 'M1');
  T('xong M3, chưa giải toạ độ → "M3 ✓"', (await thu(xong3, null, null)) === 'M3 ✓');
  T('giải 4 toạ độ + Easter Egg → "EGG ✦"',
    (await thu(xong3, {solved:{A:1,B:1,C:1,D:1}, eggDone:true}, null)) === 'EGG ✦');
  T('đúng 2/3 câu Zoey\'s Castle → "HAN 2/3"',
    (await thu(xong3, {solved:{A:1,B:1,C:1,D:1}, eggDone:true}, {dung:{q1:1,q2:1}})) === 'HAN 2/3');
  T('xong Zoey\'s Castle + mở wishlist → "HAN ✦✦"',
    (await thu(xong3, {solved:{A:1,B:1,C:1,D:1}, eggDone:true}, {done:true, bOpen:true})) === 'HAN ✦✦');
}

console.log('\n⑤ ĐỦ NĂM CHỖ TỰ LƯU trong mã nguồn');
{
  const src = await (await fetch(B+'/dad/950901-a/index.html')).text();
  T('xong Mission 1 → cất', /profSave\('M1'\)/.test(src));
  T('xong Mission 2 → cất', /profSave\('M2'\)/.test(src));
  T('xong Mission 3 → cất', /profSave\('M3 ✓'\)/.test(src));
  T('mở lại trang bìa → cất', /if\(profCur\(\)\) profSave\(mocNow\(\)\)/.test(src));
  T('rời trang / giấu tab → cất', /addEventListener\('pagehide', luuRoiTrang\)/.test(src)
    && /if\(document\.hidden\)\{ luuRoiTrang\(\)/.test(src));
  T('lệnh "Lưu tiến trình" vẫn còn (đường ghi đè có chủ ý)', /act === 'save'/.test(src));
  T('ba khoá chặng khai ở MỘT chỗ', /KHOA_CHANG = \['msn1', 'mtv1', 'hanv1'\]/.test(src));
}

console.log('\nTỔNG: '+ok+' đạt / '+ng+' hỏng');
await br.close(); process.exit(ng?1:0);
