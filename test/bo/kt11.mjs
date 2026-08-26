import { moTrinhDuyet, DIA_CHI, GOC, require } from '../chung.mjs';
const B = DIA_CHI;
const br = await moTrinhDuyet();
let pass=0, fail=0;
const ok=(t,c,x='')=>{ c?pass++:fail++; console.log((c?'  ✓ ':'  ✗ ')+t+(x?'  → '+x:'')); };

console.log('\n① Khuôn số Vxx.xx trong cả bảy sổ');
{
  const ctx=await br.newContext({viewport:{width:390,height:844}});
  const p=await ctx.newPage(); const errs=[]; p.on('pageerror',e=>errs.push(e.message));
  await p.goto(B+'/',{waitUntil:'load'}); await p.waitForTimeout(1800);
  const r = await p.evaluate(()=>{
    const xau=[], het=[];
    for(const k of Object.keys(LichSu.so)){
      for(const d of LichSu.so[k].doi){
        for(const v of [d.ver, ...(d.chi||[]).map(c=>c.ver)]){
          het.push(v);
          /* mọi cụm Vxx phải có đúng 2 chữ số; phần đuôi cũng vậy */
          for(const m of String(v).matchAll(/V(\d+)(?:\.(\d+))?/g)){
            if(m[1].length!==2 || (m[2]!==undefined && m[2].length!==2)) xau.push(k+': '+v);
          }
        }
      }
    }
    return { xau:[...new Set(xau)], n:het.length };
  });
  ok(`${r.n} số phiên bản đều đúng khuôn Vxx.xx`, r.xau.length===0, r.xau.join(' , '));
  ok('không lỗi JS', errs.length===0, errs.join(' '));
  await ctx.close();
}

console.log('\n② Tem sáu trang — số lấy THẲNG TỪ SỔ, không ghi cứng trong bộ kiểm');
/* Ghi cứng "V19.01" ở đây thì mỗi đợt bump số là bộ kiểm đỏ oan, phải đi sửa
   tay — mà sửa tay thì nó chẳng canh được gì nữa. Sổ là nguồn sự thật, hỏi sổ.
   Việc canh chuỗi cứng bản lùi có khớp sổ không là của tem16.mjs. */
{
  const ctx0=await br.newContext({viewport:{width:390,height:844}});
  const p0=await ctx0.newPage();
  await p0.goto(B+'/?stay=1',{waitUntil:'load'}); await p0.waitForTimeout(1600);
  const SO = await p0.evaluate(()=>{
    const r={}; for(const k of ['MAP','DAD-A','HAN-A','HAN-B','FX']) r[k]=LichSu.tem(k).ver;
    return r;
  });
  await ctx0.close();
  for(const [u,sel,ma] of [
    /* `/` bị đẩy thẳng sang trang hồ sơ (luật dẫn người chơi vào hồ sơ trước),
       muốn xem bản đồ để đối chiếu tem thì phải mở `/?stay=1` — xem docs/BAN-GHI.md */
    ['/?stay=1','#stamp','MAP'],
    ['/dad/950901-a/','#vstamp','DAD-A'],
    ['/han/961030-a/','#stamp','HAN-A'],
    ['/han/961030-b/','#stamp','HAN-B'],
    ['/phao-hoa/','.vstamp','FX'],
  ]){
    const mong = SO[ma];
    const ctx=await br.newContext({viewport:{width:390,height:844}});
    const p=await ctx.newPage();
    await p.goto(B+u,{waitUntil:'load'}); await p.waitForTimeout(1500);
    const t = await p.evaluate(s=>{const n=document.querySelector(s);return n?n.textContent.replace(/\s+/g,' ').trim():'';}, sel);
    const co = t.includes(mong);
    const lech = /V\d(?!\d)/.test(t);
    ok(`${u.padEnd(18)} tem ${mong}`, co && !lech, t.slice(0,44));
    await ctx.close();
  }
}

console.log('\n③ Sổ khu Easter Egg + sổ bản đồ có nội dung mới');
{
  const ctx=await br.newContext({viewport:{width:390,height:844}});
  const p=await ctx.newPage();
  await p.goto(B+'/',{waitUntil:'load'}); await p.waitForTimeout(1600);
  const d = await p.evaluate(()=>{
    const g=k=>LichSu.so[k].doi.flatMap(x=>[x.chinh,...(x.chi||[]).map(c=>c.chinh)]).join(' ');
    return { egg:g('EGG'), map:g('MAP'),
             mapChi:LichSu.so.MAP.doi.find(d=>d.ver==='V17').chi.length };
  });
  ok('EGG có lịch sử riêng của khung Collected', /ảnh mồi/.test(d.egg) && /nhóm hộp ưu tiên/.test(d.egg));
  ok('EGG có nội dung màn pháo hoa', /chạm-để-bắn/.test(d.egg));
  ok('MAP ghi đủ bảy nấc V17', d.mapChi===7, d.mapChi+' nấc');
  ok('MAP ghi đường đi lá cờ → mặt cười', /MẶT CƯỜI/.test(d.map) && /lá cờ/.test(d.map));
  ok('không đả động đo đạc/lưu trữ', !/đo đạc|cập nhật API|theo dõi|lưu trữ/i.test(d.egg+d.map));
  await ctx.close();
}
console.log('\n──────── '+pass+' đạt / '+fail+' hỏng');
await br.close(); process.exit(fail?1:0);
