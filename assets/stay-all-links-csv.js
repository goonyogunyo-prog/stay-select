/* STAY SELECT | all property URLs, three-column CSV export | 2026-10-18 */
(()=>{'use strict';
 const btn=document.getElementById('ss-all-links-csv'),status=document.getElementById('ss-all-links-csv-status'),list=document.getElementById('stay-list');
 if(!btn||!status||!list)return;
 const cards=[...list.querySelectorAll('.ss-stay[data-stay-id]')];
 const csvCell=value=>{let s=String(value??'').replace(/[\r\n\t]+/g,' ').trim();if(/^[=+\-@]/.test(s))s="'"+s;return '"'+s.replace(/"/g,'""')+'"';};
 const absolute=a=>{try{const u=new URL(a.getAttribute('href'),document.baseURI);return /^https?:$/.test(u.protocol)?u.href:'';}catch(_){return '';}};
 btn.addEventListener('click',()=>{
  const rows=[['リンク先URL','リンクテキスト（任意）','商品画像URL（任意）']];let affiliate=0,official=0,missing=0;
  for(const card of cards){
   const anchors=[...card.querySelectorAll('.ss-stay-links a[href]')];
   const pr=anchors.find(a=>a.getAttribute('data-rakuten-link')==='true'&&a.href.startsWith('https://hb.afl.rakuten.co.jp/'));
   const source=anchors.find(a=>a.target==='_blank'&&/公式/.test(a.textContent||'')&&!a.classList.contains('ss-official-search-link'));
   const url=absolute(pr||source);
   if(pr)affiliate++;else if(source)official++;if(!url)missing++;
   rows.push([url,card.querySelector('h2')?.textContent?.trim()||'', '']);
  }
  if(missing){status.textContent=`URL未設定の施設が${missing}件あるため、CSVは保存しませんでした。`;return;}
  const text='\ufeff'+rows.map(row=>row.map(csvCell).join(',')).join('\r\n')+'\r\n';
  try{const u=URL.createObjectURL(new Blob([text],{type:'text/csv;charset=utf-8'}));const a=document.createElement('a');a.href=u;a.download=`stay-select-all-${cards.length}-links.csv`;a.hidden=true;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(u),10000);status.textContent=`${cards.length}件を書き出しました。楽天成果URL ${affiliate}件、公式確認URL ${official}件（楽天成果対象外）。`;}
  catch(_){status.textContent='ダウンロードできませんでした。ブラウザの設定をご確認ください。';}
 });
})();
