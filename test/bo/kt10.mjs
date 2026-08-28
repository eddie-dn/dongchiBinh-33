import { moTrinhDuyet, DIA_CHI, GOC, require } from '../chung.mjs';
const B = DIA_CHI;
const br = await moTrinhDuyet();
let pass=0, fail=0;
const ok=(t,c,x='')=>{ c?pass++:fail++; console.log((c?'  ✓ ':'  ✗ ')+t+(x?'  → '+x:'')); };
const go=async(p,s,n)=>{for(let i=0;i<n;i++){await p.click(s,{force:true});await p.waitForTimeout(85);}};

console.log('\n① Nội dung các sổ');
{
  const ctx=await br.newContext({viewport:{width:390,height:844}});
  const p=await ctx.newPage(); const errs=[]; p.on('pageerror',e=>errs.push(e.message));
  await p.goto(B+'/',{waitUntil:'load'}); await p.waitForTimeout(1800);
  const so = await p.evaluate(()=>{
    const r={};
    for(const k of Object.keys(LichSu.so)){
      const t=LichSu.so[k];
      r[k]={ ten:t.ten, dong:t.doi.length, chay:t.doi[t.doi.length-1].ver,
             moi:t.doi.map(d=>d.chinh).join(' ') + ' ' +
                 t.doi.flatMap(d=>(d.chi||[]).map(c=>c.chinh)).join(' ') };
    }
    return r;
  });
  const cam=/đo đạc|cập nhật API|nạp trước|theo dõi|thống kê|lưu trữ|bắn về/i;
  for(const [k,v] of Object.entries(so)){
    ok(`${k.padEnd(6)} "${v.ten}" · ${v.dong} dòng · đang chạy ${v.chay}`, true);
    if(cam.test(v.moi)) ok(`   ${k} KHÔNG đả động đo đạc/lưu trữ`, false, v.moi.match(cam)[0]);
  }
  ok('KHÔNG sổ nào đả động đo đạc / theo dõi / lưu trữ',
     !Object.values(so).some(v=>cam.test(v.moi)));
  /* ⚠ ĐỪNG GHIM SỐ HIỆU CỤ THỂ Ở ĐÂY. Bản trước ghim `=== 'V04'`, tới lúc mở
     dòng lớn V05 là đỏ — mà sản phẩm chẳng sai gì, chỉ là bộ kiểm chép một con
     số sẽ đổi. Cùng cái bệnh `nguon27` đang chặn ở phía tài liệu.
     Chỉ kiểm ĐÚNG KHUÔN: chữ V rồi hai chữ số. */
  ok('DAD-A tên "Hồ sơ Phi đoàn", số hiệu đúng khuôn Vxx',
     so['DAD-A'].ten==='Hồ sơ Phi đoàn' && /^V\d{2}$/.test(so['DAD-A'].chay),
     so['DAD-A'].ten+' / '+so['DAD-A'].chay);
  ok('EGG tên "Easter Egg · Gate 1"', so.EGG.ten==='Easter Egg · Gate 1', so.EGG.ten);
  ok('EGG có nội dung pháo hoa chi tiết', /chạm-để-bắn/.test(so.EGG.moi) && /quả trứng/i.test(so.EGG.moi));
  ok('FX có mốc thật thay cho no info', !/no info/i.test(so.FX.moi), so.FX.moi.slice(0,60));
  ok('không lỗi JS', errs.length===0, errs.join(' '));
  await ctx.close();
}

console.log('\n② Cổng Hồ sơ Phi đoàn — chỉ mở sau khi thắng Mission 3');
{
  /* CHƯA thắng M3 */
  const ctx=await br.newContext({viewport:{width:390,height:844}});
  const p=await ctx.newPage();
  await p.addInitScript(()=>{
    localStorage.setItem('msn1', JSON.stringify({v:3,m1:true,m2:false,m1at:Date.now(),m2at:Date.now()+5*864e5}));
    localStorage.setItem('nav1', JSON.stringify({v:2,profiles:[],active:-1}));
  });
  await p.goto(B+'/dad/950901-a/',{waitUntil:'load'}); await p.waitForTimeout(1800);
  await p.click('#msnLine'); await p.waitForTimeout(700);
  const chua = await p.evaluate(()=>{
    const l=document.getElementById('msnLab');
    return { co:!!l && l.hasAttribute('data-ls'), lab:l?l.textContent:'' };
  });
  ok('chưa thắng M3: tiêu đề hộp KHÔNG mang cửa vào', !chua.co, 'hộp="'+chua.lab+'"');
  await go(p,'#msnLab',3); await p.waitForTimeout(350);
  ok('  bấm 3 nhịp cũng không ra cửa mã', await p.evaluate(()=>!document.querySelector('.ls-nen.on')));
  await ctx.close();

  /* ĐÃ thắng M3 */
  const c2=await br.newContext({viewport:{width:390,height:844}});
  const p2=await c2.newPage();
  await p2.addInitScript(()=>{
    localStorage.setItem('msn1', JSON.stringify({v:3,m1:true,m2:true,m3:true,m2doneAt:Date.now()}));
    localStorage.setItem('nav1', JSON.stringify({v:2,profiles:[{pid:'test'}],active:0,mapUnlocked:true}));
  });
  await p2.goto(B+'/dad/950901-a/',{waitUntil:'load'}); await p2.waitForTimeout(1800);
  await p2.evaluate(()=>document.querySelector('.msn-seg[data-m="3"]').click()); await p2.waitForTimeout(500);
  const roi = await p2.evaluate(()=>{
    const l=document.getElementById('msnLab');
    return { co:l.getAttribute('data-ls')==='DAD-A', lab:l.textContent };
  });
  ok('đã thắng M3: tiêu đề hộp MANG cửa vào', roi.co, 'hộp="'+roi.lab+'"');
  await go(p2,'#msnLab',3); await p2.waitForTimeout(350);
  await p2.fill('#lsIn','0981'); await p2.press('#lsIn','Enter'); await p2.waitForTimeout(500);
  ok('  vào đúng sổ Hồ sơ Phi đoàn', await p2.evaluate(()=>
    (document.querySelector('.ls-tit')||{}).textContent==='Hồ sơ Phi đoàn'));
  /* Hỏi sổ chứ đừng ghi cứng số ở đây: bump một nấc là bộ kiểm đỏ oan, mà sửa
     tay thì nó chẳng canh được gì nữa. Việc canh chuỗi cứng bản lùi có khớp sổ
     không là của tem16.mjs. */
  ok('  tem trang khớp sổ DAD-A', await p2.evaluate(()=>{
    const v = LichSu.tem('DAD-A').ver;
    return (document.getElementById('vstamp')||{}).textContent.indexOf(v)===0;
  }), await p2.evaluate(()=>(document.getElementById('vstamp')||{}).textContent.split('Last')[0]));
  await c2.close();
}
console.log('\n──────── '+pass+' đạt / '+fail+' hỏng');
await br.close(); process.exit(fail?1:0);
