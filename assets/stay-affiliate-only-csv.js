/* STAY SELECT | Verified Rakuten affiliate-only management CSV | 2026-10-18 */
(()=>{'use strict';
 const button=document.getElementById('ss-affiliate-only-csv');
 const status=document.getElementById('ss-affiliate-only-status');
 const list=document.getElementById('stay-list');
 if(!button||!status||!list)return;
 const csvCell=(v)=>{let s=String(v??'').replace(/[\r\n\t]+/g,' ').trim();if(/^[=+\-@]/.test(s))s="'"+s;return '"'+s.replace(/"/g,'""')+'"';};
 button.addEventListener('click',()=>{
  const rows=[['リンク先URL','リンクテキスト（任意）','商品画像URL（任意）']];
  const ids=new Set();
  for(const card of list.querySelectorAll('.ss-stay[data-booking="affiliate"][data-stay-id]')){
   const id=card.getAttribute('data-stay-id');
   const a=card.querySelector('a[data-rakuten-link="true"]');
   const href=a?.getAttribute('href')||'';
   if(!id||ids.has(id)||!href.startsWith('https://hb.afl.rakuten.co.jp/')){
    status.textContent='成果リンクに欠落・重複があります。保存を中止しました。';return;
   }
   ids.add(id);
   rows.push([href,card.querySelector('h2')?.textContent?.trim()||'', '']);
  }
  if(rows.length!==34){status.textContent=`成果リンクは${rows.length-1}件です。想定33件と異なるため保存を中止しました。`;return;}
  const text='\uFEFF'+rows.map(row=>row.map(csvCell).join(',')).join('\r\n')+'\r\n';
  try{
   const url=URL.createObjectURL(new Blob([text],{type:'text/csv;charset=utf-8'}));
   const link=document.createElement('a');link.href=url;link.download='stay-select-rakuten-affiliate-33-management.csv';
   link.hidden=true;document.body.appendChild(link);link.click();link.remove();
   setTimeout(()=>URL.revokeObjectURL(url),10000);
   status.textContent='ユーザー発行の楽天成果リンク33件を管理用CSVとして保存しました。';
  }catch(_){status.textContent='ダウンロードに失敗しました。ブラウザの設定をご確認ください。';}
 });
})();
