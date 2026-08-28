/* ĐỢT 24 · MÀN PHÁO HOA — lần đầu phải xem hết, và dự phòng khi hỏng
   Bệnh: "vào box lần đầu đứng chắc tắt được box rồi mới thấy pháo hoa";
   "users bấm gì cũng không được, phải xem phao-hoa xong rồi mới ok";
   "nếu rớt mạng hoặc users không thao tác gì thì dùng back-up hiển thị lần 2". */
import { moTrinhDuyet, DIA_CHI, GOC } from '../chung.mjs';
import { readFileSync } from 'node:fs';
const B = DIA_CHI;
const br = await moTrinhDuyet();
let ok=0,ng=0;
const T=(n,c,note='')=>{ if(c){ok++;console.log('  ✓ '+n);} else {ng++;console.log('  ✗ '+n+(note?'  → '+note:''));} };
const cho=(p,ms)=>p.waitForTimeout(ms);
const kho = p => p.evaluate(()=>{ try{ return JSON.parse(localStorage.getItem('mtv1')||'{}'); }catch(e){ return {}; } });

/* Chờ hết màn trứng rồi mới soi. HỎI THẲNG TRANG hai con số nhịp thay vì ghi
   cứng 2800ms như bản trước: đợt nào nới nhịp trứng cho dễ đọc là bộ kiểm gãy
   oan, mà lỗi báo ra thì trông như trang hỏng chứ không như bộ kiểm hỏng. */
const choXongTrung = async p => {
  const ms = await p.evaluate(() => {
    try{ return (typeof LAC_MS === 'number' ? LAC_MS : 2000)
              + (typeof NUT_MS === 'number' ? NUT_MS : 1300); }
    catch(e){ return 3300; }
  });
  await cho(p, ms + 1300);        /* cộng nhịp nổ bung rồi mới tới pháo thật */
};

async function mo(m){
  const ctx = await br.newContext({ viewport:{width:420,height:900} });
  const p = await ctx.newPage();
  if(m) await p.addInitScript(v=>localStorage.setItem('mtv1', JSON.stringify(v)), m);
  await p.goto(B+'/phao-hoa/', {waitUntil:'load'});
  return { p, ctx };
}

console.log('\n① LẦN ĐẦU — ba đường ra đều khoá cho tới khi xem đủ một nhịp');
{
  const { p, ctx } = await mo({ eggWin:true });
  await choXongTrung(p);
  const kh = await p.evaluate(()=>document.getElementById('frame').classList.contains('khoa-ra'));
  T('đang khoá ngay sau khi pháo bắt đầu bắn', kh);
  T('hai nút dẫn đi bị mờ và không nhận chạm', await p.evaluate(()=>{
    const s = getComputedStyle(document.getElementById('close'));
    return s.pointerEvents === 'none' && +s.opacity < 0.5;
  }));
  /* bấm loạn xạ như tay còn đang đập từ mười nhịp lúc nãy */
  await p.evaluate(()=>{ ['close','mEgg'].forEach(i=>document.getElementById(i).click()); });
  await p.evaluate(()=>{ const f=document.getElementById('frame');
    for(let i=0;i<2;i++) f.dispatchEvent(new MouseEvent('mousedown',{bubbles:true,clientX:20,clientY:20})); });
  await cho(p, 400);
  T('bấm loạn cũng KHÔNG rời được trang', p.url().includes('/phao-hoa'), p.url());
  T('chưa xem đủ thì chưa ghi cờ', !(await kho(p)).phaoXem);

  await cho(p, 4600);                        /* hết hạn khoá */
  T('xem đủ một nhịp thì mở khoá', !(await p.evaluate(()=>
    document.getElementById('frame').classList.contains('khoa-ra'))));
  T('và ghi cờ đã xem vào ổ nhớ', !!(await kho(p)).phaoXem);
  await ctx.close();
}

console.log('\n② LẦN SAU — vào là đi lại được ngay, không khoá gì');
{
  const { p, ctx } = await mo({ eggWin:true, phaoXem:true });
  await choXongTrung(p);
  T('không khoá đường ra', !(await p.evaluate(()=>
    document.getElementById('frame').classList.contains('khoa-ra'))));
  T('nút Thoát bấm được', await p.evaluate(()=>
    getComputedStyle(document.getElementById('close')).pointerEvents !== 'none'));
  await ctx.close();
}

console.log('\n③ BẢN ĐỒ — dự phòng còn hay hết là xét theo ĐÃ XEM, không xét số lần bay sang');
{
  const src = readFileSync(GOC + '/index.html', 'utf8');
  T('có hàm đọc cờ đã xem', /function daXemPhaoHoa\(\)/.test(src));
  T('cửa quyết định xét cờ đó TRƯỚC', /if\(daXemPhaoHoa\(\) \|\| eggAn >= EGG_AN_TU\)/.test(src));
  T('vẫn giữ trần cứng chống lặp vô tận', /eggAn >= EGG_AN_TU/.test(src));
  T('nạp trước trang pháo hoa trong lúc khung khoá', /napTruocPhaoHoa\(\);/.test(src));
  T('khoá khung rút còn 1800ms', /setTimeout\(goFireworks, 1800\)/.test(src));
}

console.log('\n④ RỚT MẠNG / THOÁT GIỮA CHỪNG → lần sau vẫn được bay sang xem lại');
{
  /* Người chơi đã bay sang một lần (eggAn = 1) nhưng KHÔNG xem được gì */
  const ctx = await br.newContext({ viewport:{width:420,height:900} });
  const p = await ctx.newPage();
  await p.addInitScript(()=>localStorage.setItem('mtv1', JSON.stringify({
    solved:{HAN:'x',DAD:'x',UIH:'x',SGN:'x'}, unlocked:{HAN:1,DAD:1,UIH:1,SGN:1},
    channel:'map', morseSeen:true, pzOn:true, credFound:true, eggWin:true,
    eggAn:1, eggParty:true })));
  await p.goto(B+'/?stay=1', {waitUntil:'load'}); await cho(p, 1600);
  const con = await p.evaluate(()=> daXemPhaoHoa() === false && eggAn < 2);
  T('chưa xem được → dự phòng vẫn còn', con);
  const het = await p.evaluate(()=>{
    const m = JSON.parse(localStorage.getItem('mtv1')||'{}'); m.phaoXem = true;
    localStorage.setItem('mtv1', JSON.stringify(m));
    return daXemPhaoHoa();
  });
  T('xem được rồi → thôi, không bay sang nữa', het);
  await ctx.close();
}

console.log('\nTỔNG: '+ok+' đạt / '+ng+' hỏng');
await br.close(); process.exit(ng?1:0);
