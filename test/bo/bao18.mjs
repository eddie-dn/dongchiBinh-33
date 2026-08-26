/* ĐỢT 18 · TIÊU ĐỀ VÀ TRẠNG THÁI PHẢI ĐI THEO ĐÚNG TRANG
   Bệnh: mọi tín hiệu của cả sáu trang đều mang tiêu đề "BẢN ĐỒ TÁC CHIẾN" và
   kèm dòng "Đã giải: … (n/4)" — tiến độ RIÊNG của bản đồ, vô nghĩa với năm
   trang còn lại.
   Luật mới: trang tự khai `trang` / `noi` / `tt`; máy chủ lấy tiêu đề theo
   `trang`, không khai thì đoán theo tiền tố tên sự kiện. */
import { moTrinhDuyet, DIA_CHI, GOC, require } from '../chung.mjs';
const B = DIA_CHI;
let ok=0,ng=0;
const T=(n,c,note='')=>{ if(c){ok++;console.log('  ✓ '+n);} else {ng++;console.log('  ✗ '+n+(note?'  → '+note:''));} };

/* ═══ ① MÁY CHỦ · gọi thẳng hàm xử lý, đọc đúng câu sắp bắn đi ═══════════ */
console.log('\n① Máy chủ dựng tiêu đề theo trang');
process.env.NOTIFY_KIND = 'telegram';
process.env.TG_TOKEN = 'thu-nghiem';
process.env.TG_CHAT  = '0';
delete process.env.SHEET_URL;
const handler = require(GOC + '/api/ping.js');

let batDuoc = null;
global.fetch = async (url, opt) => {
  try { batDuoc = JSON.parse(opt.body).text; } catch (e) { batDuoc = null; }
  return { ok:true, json: async()=>({}) };
};
async function ban(body){
  batDuoc = null;
  const res = { status(){ return this; }, json(){ return this; },
                setHeader(){ return this; }, end(){ return this; }, send(){ return this; } };
  await handler({ method:'POST', body, headers:{}, query:{} }, res);
  return batDuoc;
}
/* Mỗi phép thử một `detail` khác nhau — máy chủ chặn trùng trong 8 giây */
let n = 0;
const rieng = () => 'thu-' + (++n);

const CA = [
  ['ban-do',   'BẢN ĐỒ TÁC CHIẾN',           'mo_ho_so'],
  ['dad-a',    'HỒ SƠ PHI ĐOÀN',             'ho_so_mo'],
  ['dad-b',    'EASTER EGG · GATE 2',        'g2_vao_cong'],
  ['han-a',    "ZOEY'S CASTLE",              'han_mo'],
  ['han-b',    "HONGHAN'S SECRET CHAMBER",   'han_b_mo'],
  ['phao-hoa', 'MÀN PHÁO HOA',               'phao_hoa_mo']
];
for(const [ma, ten, ev] of CA){
  const t = await ban({ ev, detail: rieng(), trang: ma, noi:'Hộp thử', tt:'trạng thái thử' });
  T('trang "'+ma+'" ra tiêu đề ' + ten, !!t && t.split('\n')[0].startsWith(ten), t && t.split('\n')[0]);
}

console.log('\n② Chỗ đứng (`noi`) nối sau tiêu đề, trạng thái in nguyên văn');
{
  const t = await ban({ ev:'g2_vao_cong', detail:rieng(), trang:'dad-b', noi:'Khu Open World',
                        tt:'Vòng 2 · sai 3 lần' });
  const d = (t||'').split('\n');
  T('dòng đầu có cả tiêu đề lẫn chỗ đứng',
    d[0] === 'EASTER EGG · GATE 2 · Khu Open World', d[0]);
  T('dòng trạng thái đúng của trang đó', d[2] === 'Vòng 2 · sai 3 lần', d[2]);
  T('KHÔNG kèm tiến độ bốn toạ độ của bản đồ', !(t||'').includes('/4)'));
}

console.log('\n③ Trang chưa khai `trang` thì đoán theo tiền tố tên sự kiện');
const DOAN = [
  ['g2_vao_cong',        'EASTER EGG · GATE 2'],
  ['han_ma_sai',    "ZOEY'S CASTLE"],
  ['han_b_mo',      "HONGHAN'S SECRET CHAMBER"],
  ['phao_hoa_mo',   'MÀN PHÁO HOA'],
  ['sai_pin',       'HỒ SƠ PHI ĐOÀN'],
  ['mo_ho_so',      'BẢN ĐỒ TÁC CHIẾN']
];
for(const [ev, ten] of DOAN){
  const t = await ban({ ev, detail: rieng() });
  T('sự kiện "'+ev+'" đoán ra ' + ten, !!t && t.split('\n')[0] === ten, t && t.split('\n')[0]);
}

console.log('\n④ Không khai `tt`: chỉ BẢN ĐỒ mới có dòng bốn toạ độ mặc định');
{
  const t1 = await ban({ ev:'mo_ho_so', detail:rieng(), trang:'ban-do', solved:['DAD','HAN'] });
  T('bản đồ vẫn in "Đã giải: … (2/4)"', (t1||'').includes('Đã giải: DAD, HAN (2/4)'), t1);
  const t2 = await ban({ ev:'han_mo', detail:rieng(), trang:'han-a', solved:['DAD','HAN'] });
  T('Zoey\'s Castle KHÔNG mượn con số đó', !(t2||'').includes('(2/4)'), t2);
  T('bỏ trống thì không để lại dòng rỗng',
    !(t2||'').split('\n').some(x => x === ''), JSON.stringify(t2));
}

console.log('\n⑤ Sổ lưu cũng ghi lại trang / chỗ đứng / trạng thái');
{
  process.env.SHEET_URL = 'https://vi-du.thu-nghiem/sheet';
  let hang = null;
  const fetchCu = global.fetch;
  global.fetch = async (url, opt) => {
    if(String(url).includes('vi-du.thu-nghiem')){ hang = JSON.parse(opt.body); return { ok:true }; }
    return fetchCu(url, opt);
  };
  await ban({ ev:'g2_vao_cong', detail:rieng(), trang:'dad-b', noi:'Màn chơi · vòng 1', tt:'Vòng 1 · sai 0 lần' });
  T('dòng sổ có cột trang', hang && hang.trang === 'dad-b', JSON.stringify(hang && hang.trang));
  T('dòng sổ có cột chỗ đứng', hang && hang.noi === 'Màn chơi · vòng 1', JSON.stringify(hang && hang.noi));
  T('dòng sổ có cột trạng thái', hang && hang.tt === 'Vòng 1 · sai 0 lần', JSON.stringify(hang && hang.tt));
  /* Trang cũ chưa khai `trang` thì sổ vẫn phải điền cột đó bằng chỗ đoán ra */
  hang = null;
  await ban({ ev:'han_b_mo', detail:rieng() });
  T('chưa khai `trang` thì sổ điền chỗ đoán được', hang && hang.trang === 'han-b', JSON.stringify(hang && hang.trang));
  global.fetch = fetchCu;
  delete process.env.SHEET_URL;
}

/* ═══ ⑥ TRANG · mỗi trang tự khai đúng mã của mình ══════════════════════ */
console.log('\n⑥ Sáu trang tự khai đúng `trang` và có `noi` / `tt` thật');
const br = await moTrinhDuyet();
const BAT = () => {
  window.__ping = [];
  const ghi = (url, body) => { if(String(url).includes('/api/')) window.__ping.push(String(body||'')); };
  navigator.sendBeacon = function(url, blob){
    try{ blob.text().then(t=>ghi(url, t)); }catch(e){ ghi(url, blob); }
    return true;
  };
  const fCu = window.fetch;
  window.fetch = function(url, opt){
    if(String(url).includes('/api/')){ ghi(url, opt && opt.body); return Promise.resolve(new Response('{}')); }
    return fCu.apply(this, arguments);
  };
};
const docPing = async p => {
  await p.waitForTimeout(600);
  const raw = await p.evaluate(()=>window.__ping || []);
  return raw.map(x => { try{ return JSON.parse(x); }catch(e){ return null; } }).filter(Boolean);
};

async function xemTrang({ ten, url, ma, moDau, canNoi }){
  const ctx = await br.newContext({ viewport:{width:420,height:900} });
  const p = await ctx.newPage();
  await p.addInitScript(BAT);
  await p.goto(B+url, { waitUntil:'load' });
  await p.waitForTimeout(1800);
  if(moDau) await moDau(p);
  const gui = await docPing(p);
  const co = gui.filter(x => x.trang === ma);
  T(ten + ' khai trang="' + ma + '"', co.length > 0,
    'thấy ' + JSON.stringify(gui.map(x=>x.trang)));
  if(co.length){
    if(canNoi !== false)
      T(ten + ' có chỗ đứng thật', typeof co[0].noi === 'string' && co[0].noi.length > 0, JSON.stringify(co[0].noi));
    T(ten + ' có trạng thái thật', typeof co[0].tt === 'string' && co[0].tt.length > 0, JSON.stringify(co[0].tt));
  }
  await ctx.close();
}

/* Bản đồ lúc vừa tải chưa mở hộp nào, `noi` rỗng là ĐÚNG — chỗ đứng được thử
   riêng ở mục ⑧ dưới, lúc đã mở đúng một hộp. */
await xemTrang({ ten:'Bản đồ', url:'/?stay=1', ma:'ban-do', canNoi:false });
await xemTrang({ ten:'Hồ sơ Phi đoàn', url:'/dad/950901-a/', ma:'dad-a' });
await xemTrang({ ten:'Easter Egg Gate 2', url:'/dad/950901-b/', ma:'dad-b' });
await xemTrang({ ten:"Zoey's Castle", url:'/han/961030-a/', ma:'han-a' });
await xemTrang({ ten:'Secret Chamber', url:'/han/961030-b/', ma:'han-b' });
await xemTrang({ ten:'Màn pháo hoa', url:'/phao-hoa/', ma:'phao-hoa' });

console.log('\n⑧ Bản đồ: mở hộp nào thì khai đúng hộp đó');
{
  const ctx = await br.newContext({ viewport:{width:420,height:900} });
  const p = await ctx.newPage();
  await p.addInitScript(BAT);
  await p.goto(B+'/?stay=1', { waitUntil:'load' }); await p.waitForTimeout(1600);
  await p.evaluate(()=>{ window.__ping = []; openPin('file','thu'); });
  await p.waitForTimeout(300);
  await p.evaluate(()=>ping('mo_ho_so', 'thu chỗ đứng'));
  const g = (await docPing(p)).filter(x=>x.trang==='ban-do');
  T('đang mở ô mã thì khai "Ô mã"', g.length>0 && /^Ô mã/.test(g[0].noi||''), JSON.stringify(g.map(x=>x.noi)));
  await p.evaluate(()=>{ window.__ping = []; closePin();
    const k=document.querySelector('.kao'); for(let i=0;i<3;i++) k.click(); });
  await p.waitForTimeout(400);
  await p.evaluate(()=>ping('mo_ho_so', 'thu chỗ đứng 2'));
  const g2 = (await docPing(p)).filter(x=>x.trang==='ban-do');
  T('đang mở bản ghi thì khai "Bản ghi"', g2.length>0 && g2[0].noi === 'Bản ghi', JSON.stringify(g2.map(x=>x.noi)));
  await ctx.close();
}

console.log('\n⑦ Trạng thái phải ĐỔI THEO người chơi, không phải chuỗi đặt cứng');
{
  const doc = async (bo)=>{
    const ctx = await br.newContext({ viewport:{width:420,height:900} });
    const p = await ctx.newPage();
    await p.addInitScript(BAT);
    if(bo) await p.addInitScript(bo);
    await p.goto(B+'/dad/950901-a/', { waitUntil:'load' });
    await p.waitForTimeout(1800);
    const g = (await docPing(p)).filter(x=>x.trang==='dad-a');
    await ctx.close();
    return g.length ? g[0].tt : null;
  };
  const chua = await doc(null);
  const roi  = await doc(()=>{ localStorage.setItem('msn1', JSON.stringify({
    m1:true, m2:true, m1at:Date.now()-864e5, m2doneAt:Date.now()-864e5, form:true })); });
  T('người chưa làm gì: Mission còn trống', /M1 —/.test(chua||''), JSON.stringify(chua));
  T('người đã xong M1+M2: trạng thái đổi theo', /M1 ✓/.test(roi||'') && /M2 ✓/.test(roi||''), JSON.stringify(roi));
  T('hai người chơi khác nhau ra hai dòng khác nhau', chua !== roi);
}

console.log('\nTỔNG: '+ok+' đạt / '+ng+' hỏng');
await br.close(); process.exit(ng?1:0);
