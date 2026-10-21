/* STAY SELECT | Google site-search research URLs for Rakuten verification | 2026-10-18 */
(()=>{'use strict';
 const btn=document.getElementById('ss-rakuten-research-csv'),status=document.getElementById('ss-rakuten-research-status'),list=document.getElementById('stay-list');
 if(!btn||!status||!list)return;
 const csv=v=>{let s=String(v??'').replace(/[\r\n\t]+/g,' ').trim();if(/^[=+\-@]/.test(s))s="'"+s;return '"'+s.replace(/"/g,'""')+'"';};
 btn.addEventListener('click',()=>{
  const cards=[...list.querySelectorAll('.ss-stay[data-stay-id]')];
  const ids=new Set(),rows=[['施設ID','施設名','都道府県','楽天個別ページを探すGoogle検索URL（未照合）','楽天個別URL（照合後に記入）','楽天成果URL（ユーザー発行後に記入）']];
  let affiliates=0;
  for(const card of cards){
   const id=card.getAttribute('data-stay-id'),name=card.querySelector('h2')?.textContent?.trim()||'',pref=card.getAttribute('data-pref')||'';
   if(!id||!name||!pref||ids.has(id)){status.textContent='施設ID・宿名・都道府県に欠落または重複があります。保存を中止しました。';return;}
   ids.add(id);
   if(card.getAttribute('data-booking')==='affiliate'){affiliates++;continue;}
   const query='site:travel.rakuten.co.jp/HOTEL/ "'+name+'" '+pref;
   const search='https://www.google.com/search?q='+encodeURIComponent(query);
   rows.push([id,name,pref,search,'','']);
  }
  if(cards.length!==2419||affiliates!==33||rows.length!==2387){status.textContent='施設数が想定と異なるため保存を中止しました。';return;}
  const data='\uFEFF'+rows.map(r=>r.map(csv).join(',')).join('\r\n')+'\r\n';
  try{const url=URL.createObjectURL(new Blob([data],{type:'text/csv;charset=utf-8'}));const a=document.createElement('a');a.href=url;a.download='stay-select-rakuten-2386-research-searches.csv';a.hidden=true;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),10000);status.textContent='2386施設分の検索リンクを保存しました。検索結果は未照合で、楽天予約URLではありません。';}
  catch(_){status.textContent='保存できませんでした。ブラウザ設定をご確認ください。';}
 });
})();
