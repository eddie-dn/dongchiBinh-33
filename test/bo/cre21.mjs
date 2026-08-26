/* ĐỢT 21 · MỤC "LÀM TRONG BAO LÂU" trong trang Credit
   Con số đếm từ lịch sử commit (xem docs/thoi-gian.mjs). Bộ này canh hai
   chuyện: bảy trang đều có mục đó, và con số phải KHỚP với chính lịch sử —
   sửa mã mà quên đo lại thì lộ ra ngay. */
import { moTrinhDuyet, DIA_CHI, GOC } from '../chung.mjs';
import { execFileSync } from 'node:child_process';
const B = DIA_CHI;
const br = await moTrinhDuyet();
let ok=0,ng=0;
const T=(n,c,note='')=>{ if(c){ok++;console.log('  ✓ '+n);} else {ng++;console.log('  ✗ '+n+(note?'  → '+note:''));} };

const ctx = await br.newContext({ viewport:{width:420,height:900} });
const p = await ctx.newPage();
await p.goto(B+'/?stay=1',{waitUntil:'load'}); await p.waitForTimeout(1600);

console.log('\n① Cả bảy trang Credit đều có mục thời gian');
for(const ma of ['MAP','EGG','DAD-A','DAD-B','HAN-A','HAN-B','FX']){
  const r = await p.evaluate(async m=>{
    LichSu.mo(m);
    await new Promise(r=>setTimeout(r,180));
    const inp = document.getElementById('lsIn');
    inp.focus(); inp.value = '0981';
    inp.dispatchEvent(new Event('input',{bubbles:true}));
    inp.dispatchEvent(new KeyboardEvent('keydown',{key:'Enter',bubbles:true}));
    await new Promise(r=>setTimeout(r,260));
    const cre = document.getElementById('lsCre');
    if(!cre) return { co:false };
    cre.click();
    await new Promise(r=>setTimeout(r,220));
    const kh = [...document.querySelectorAll('.ls-tien')]
      .find(x => /Làm trong bao lâu/.test(x.textContent));
    return { co:true, co_khoi:!!kh, chu: kh ? kh.textContent.replace(/\s+/g,' ').trim() : '' };
  }, ma);
  T(ma.padEnd(6)+' có mục "Làm trong bao lâu"', r.co && r.co_khoi,
    r.co ? r.chu.slice(0,60) : 'không mở được trang Credit');
  T('  '+ma.padEnd(4)+' có con số Day-Hour-Minute', /\d+\s*(ngày|giờ|phút)/.test(r.chu||''),
    (r.chu||'').slice(0,70));
}

console.log('\n② Trang gốc có thêm dòng TỔNG của cả bộ; sáu trang kia thì không');
{
  const doc = async m => p.evaluate(async mm=>{
    LichSu.mo(mm); await new Promise(r=>setTimeout(r,180));
    const inp = document.getElementById('lsIn');
    inp.focus(); inp.value='0981';
    inp.dispatchEvent(new Event('input',{bubbles:true}));
    inp.dispatchEvent(new KeyboardEvent('keydown',{key:'Enter',bubbles:true}));
    await new Promise(r=>setTimeout(r,260));
    document.getElementById('lsCre').click();
    await new Promise(r=>setTimeout(r,220));
    const kh=[...document.querySelectorAll('.ls-tien')].find(x=>/Làm trong bao lâu/.test(x.textContent));
    return kh ? kh.textContent.replace(/\s+/g,' ') : '';
  }, m);
  T('MAP có dòng "Cả bộ"',        /Cả bộ/.test(await doc('MAP')));
  T('DAD-B KHÔNG có dòng "Cả bộ"', !/Cả bộ/.test(await doc('DAD-B')));
}

console.log('\n③ CON SỐ PHẢI KHỚP LỊCH SỬ COMMIT — đo lại tại chỗ');
{
  const ra = execFileSync('node', [GOC + '/docs/thoi-gian.mjs'],
    { encoding:'utf8', cwd: GOC, maxBuffer: 64e6 });
  const bang = {};
  for(const m of ra.matchAll(/^\s*'?([A-Z-]+)'?:\s*'([^']+)'/gm)) bang[m[1]] = m[2];
  const tong = (ra.match(/_TONG:\s*'([^']+)'/) || [])[1];
  const trong = await p.evaluate(()=>{
    /* Đọc thẳng bảng trong mã nguồn đang chạy, không đọc qua giao diện */
    return null;
  });
  const src = await (await fetch(B+'/assets/lichsu.js')).text();
  const kh = src.slice(src.indexOf('var THOI_GIAN = {'));
  const cai = kh.slice(0, kh.indexOf('};'));
  const lech = [];
  for(const [k,v] of Object.entries(bang)){
    if(k === 'EGG') continue;                    /* EGG lấy theo MAP, đã khai vậy */
    if(!cai.includes("'" + v + "'")) lech.push(k + ' đo được "' + v + '"');
  }
  if(tong && !cai.includes("'" + tong + "'")) lech.push('TỔNG đo được "' + tong + '"');
  T('bảng THOI_GIAN khớp với lịch sử commit hiện tại', lech.length === 0,
    lech.join(' , ') + '  → chạy `node docs/thoi-gian.mjs` rồi chép lại');
}

console.log('\n④ Ghi rõ cách đo, để người đọc không hiểu nhầm là khoảng đầu-cuối');
{
  const src = await (await fetch(B+'/assets/lichsu.js')).text();
  const g = src.replace(/\s+/g,' ');
  T('trang Credit nói rõ đây là khoảng đầu–cuối', /lượt ghi đầu tiên tới lượt ghi cuối cùng/.test(g));
  T('nói rõ tính cả mấy ngày ở giữa', /tính cả.{0,10}mấy ngày ở giữa/.test(g));
  T('nói rõ cộng từng trang không ra tổng', /Cộng từng trang lại không/.test(g));
  /* Chuỗi này bị ngắt dòng giữa chừng trong mã nguồn — soi trên bản đã dồn
     khoảng trắng, đừng soi trên bản thô rồi tưởng là thiếu. */
  T('in cả mốc từ → tới', /_TU \+ ' → ' \+ THOI_GIAN\._TOI/.test(g));
}

await ctx.close();
console.log('\nTỔNG: '+ok+' đạt / '+ng+' hỏng');
await br.close(); process.exit(ng?1:0);
