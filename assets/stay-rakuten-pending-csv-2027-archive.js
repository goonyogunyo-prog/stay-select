/* STAY SELECT | Rakuten unverified property review CSV | 2026-10-18 */
(()=>{'use strict';
 const button=document.getElementById('ss-rakuten-pending-csv');
 const status=document.getElementById('ss-rakuten-pending-status');
 const list=document.getElementById('stay-list');
 if(!button||!status||!list)return;
 const csvCell=v=>{let s=String(v??'').replace(/[\r\n\t]+/g,' ').trim();if(/^[=+\-@]/.test(s))s="'"+s;return '"'+s.replace(/"/g,'""')+'"';};
 button.addEventListener('click',()=>{
  const cards=[...list.querySelectorAll('.ss-stay[data-stay-id]')];
  const ids=new Set(),rows=[['施設ID','施設名','都道府県','宿タイプ','公式確認URL（楽天成果対象外）','楽天個別URL（未照合）','楽天成果URL（未発行）']];
  let affiliates=0;
  for(const card of cards){
   const id=card.getAttribute('data-stay-id');
   if(!id||ids.has(id)){status.textContent='施設IDに欠落・重複があるためCSVを保存しませんでした。';return;}
   ids.add(id);
   if(card.getAttribute('data-booking')==='affiliate'){affiliates++;continue;}
   const source=[...card.querySelectorAll('.ss-stay-links a[href]')].find(a=>a.target==='_blank'&&/公式/.test(a.textContent||'')&&!a.classList.contains('ss-official-search-link'));
   const href=source?.getAttribute('href')||'';
   if(!/^https?:\/\//.test(href)){status.textContent=`公式参照URLが未設定の施設（${id}）があります。保存を中止しました。`;return;}
   rows.push([id,card.querySelector('h2')?.textContent?.trim()||'',card.getAttribute('data-pref')||'',card.getAttribute('data-kind')||'',href,'','']);
  }
  if(cards.length!==2343||affiliates!==33||rows.length!==2311){status.textContent=`件数の不整合（全${cards.length}件／成果${affiliates}件／未照合${rows.length-1}件）のため保存を中止しました。`;return;}
  const content='\uFEFF'+rows.map(row=>row.map(csvCell).join(',')).join('\r\n')+'\r\n';
  try{const url=URL.createObjectURL(new Blob([content],{type:'text/csv;charset=utf-8'}));const a=document.createElement('a');a.href=url;a.download='stay-select-rakuten-unmatched-2310-review.csv';a.hidden=true;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),10000);status.textContent='楽天未照合2310施設の確認用CSVを保存しました。楽天URL欄は未照合のため空欄です。';}
  catch(_){status.textContent='CSVを保存できませんでした。ブラウザ設定をご確認ください。';}
 });
})();
