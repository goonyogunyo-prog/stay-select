/* STAY SELECT | Filter-aware CSV export | 2026-10-17 */
(()=>{'use strict';
 const btn=document.getElementById('ss-csv-export');
 const status=document.getElementById('ss-csv-status');
 const list=document.getElementById('stay-list');
 if(!btn||!status||!list)return;
function regionMatches(card,chosen){if(!chosen)return true;let r=card.dataset.region;if(r==='北陸・甲信越')r='甲信越・北陸';if(r==='中国・四国')r=['香川県','徳島県','愛媛県','高知県'].includes(card.dataset.pref)?'四国':'中国';return r===chosen;}
 const get=id=>document.getElementById(id);
 const value=id=>get(id)?.value||'';
 const key='stayselect:favorites:v1';
 const escapeCSV=v=>{
  let t=String(v??'').replace(/[\r\n\t]+/g,' ').trim();
  // Prevent formula execution when opened in spreadsheet applications.
  if(/^[=+\-@]/.test(t))t="'"+t;
  return '"'+t.replace(/"/g,'""')+'"';
 };
 const rows=()=>{
  const q=value('q').trim().toLocaleLowerCase();
  const latestMax=Math.max(0,...[...list.querySelectorAll('.ss-stay[data-stay-id]')].map(x=>Number(x.dataset.stayId?.split('-').pop())||0));
  const onlySaved=Boolean(get('ss-favorites-only')?.checked);
  let saved=new Set();
  if(onlySaved){try{const parsed=JSON.parse(localStorage.getItem(key)||'[]');if(Array.isArray(parsed))saved=new Set(parsed.filter(v=>typeof v==='string'))}catch(_){}}
  let notes={};try{const parsed=JSON.parse(localStorage.getItem('stayselect:notes:v1')||'{}');if(parsed&&typeof parsed==='object'&&!Array.isArray(parsed))notes=parsed;}catch(_){}
  const notesOnly=Boolean(get('ss-note-only')?.checked),notesNeedle=(get('ss-note-query')?.value||'').trim().toLocaleLowerCase();
  return [...list.querySelectorAll('.ss-stay[data-stay-id]')].filter(c=>
   (!get('ss-new-only')?.checked||Number(c.dataset.stayId?.split('-').pop())>latestMax-38)&&
   (get('ss-business-toggle')?.checked||c.dataset.kind!=='ビジネスホテル')&&
   (!notesOnly||(typeof notes[c.dataset.stayId]==='string'&&notes[c.dataset.stayId].trim()))&&
   (!notesNeedle||(typeof notes[c.dataset.stayId]==='string'&&notes[c.dataset.stayId].toLocaleLowerCase().includes(notesNeedle)))&&
   (!onlySaved||saved.has(c.dataset.stayId))&&
   (!q||(c.dataset.search||'').toLocaleLowerCase().includes(q))&&
   regionMatches(c,value('region'))&&
   (!value('pref')||c.dataset.pref===value('pref'))&&
   (!value('kind')||c.dataset.kind===value('kind'))&&
   (!value('detail')||c.dataset.detailed===value('detail'))&&
   (!value('access')||c.dataset.access===value('access'))&&
   (!value('booking')||(value('booking')==='matched'&&!!c.dataset.booking)||(value('booking')==='affiliate'&&c.dataset.booking==='affiliate')));
 };
 btn.addEventListener('click',()=>{
  const found=rows();
  if(!found.length){status.textContent='該当施設がありません。検索条件を変更してから保存してください。';return;}
  const header=['施設名','都道府県','エリア','宿タイプ','公式情報URL','施設詳細URL'];
  const lines=[header.map(escapeCSV).join(',')];
  for(const c of found){
   const official=[...c.querySelectorAll('.ss-stay-links a[href]')].find(a=>a.target==='_blank'&&a.textContent.includes('公式'));
   const detail=c.querySelector('.ss-stay-detail[href]');
   const absolute=a=>{try{return a?new URL(a.getAttribute('href'),document.baseURI).href:''}catch(_){return ''}};
   lines.push([c.querySelector('h2')?.textContent||'',c.dataset.pref||'',c.dataset.region||'',c.dataset.kind||'',absolute(official),absolute(detail)].map(escapeCSV).join(','));
  }
  try{
   const blob=new Blob(['\ufeff',lines.join('\r\n')+'\r\n'],{type:'text/csv;charset=utf-8'});
   const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;
   a.download='stay-select-search-'+new Date().toISOString().slice(0,10)+'.csv';a.hidden=true;
   document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),2000);
   status.textContent=`${found.length}施設をCSVに書き出しました。料金・空室は公式サイトでご確認ください。`;
  }catch(_){status.textContent='保存できませんでした。ブラウザのダウンロード設定をご確認ください。';}
 });
})();
