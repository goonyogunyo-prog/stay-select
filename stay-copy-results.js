/* STAY SELECT: copy current matching search results as shareable text (max 24). */
(()=>{'use strict';
const btn=document.getElementById('ss-copy-results-button'),status=document.getElementById('ss-copy-results-status'),fallback=document.getElementById('ss-copy-results-fallback'),area=document.getElementById('ss-copy-results-textarea');
if(!btn||!status||!fallback||!area)return;
const cards=new Map([...document.querySelectorAll('#stay-list .ss-stay[data-stay-id]')].map(c=>[c.dataset.stayId,c]));
let ids=[];
function update(result){
 ids=[...new Set((Array.isArray(result)?result:[]).filter(id=>typeof id==='string'&&cards.has(id)))];
 btn.disabled=!ids.length;btn.textContent=`📋 検索結果をコピー（${Math.min(ids.length,24)}件）`;
 if(!ids.length){status.textContent='該当する宿がありません。条件を変更してください。';fallback.hidden=true;}
 else status.textContent=`一致する${ids.length}施設から先頭${Math.min(ids.length,24)}施設をコピーできます。`;
}
function buildText(){
 const lines=['STAY SELECT｜宿の候補 '+Math.min(ids.length,24)+'件','料金・空室・サービスはリンク先の公式情報で確認してください。',''];
 ids.slice(0,24).forEach((id,i)=>{
  const c=cards.get(id),name=c.querySelector('h2')?.textContent?.trim()||'宿泊施設';
  const detail=new URL('../stay/?id='+encodeURIComponent(id),document.baseURI).href;
  lines.push(`${i+1}. ${name}｜${c.dataset.pref||''}｜${c.dataset.kind||''}`);lines.push(detail);
 });
 if(ids.length>24)lines.push(`ほか${ids.length-24}件（全件はサイトの検索結果から確認）`);
 return lines.join('\n');
}
btn.addEventListener('click',async()=>{
 if(!ids.length)return;const value=buildText();
 try{if(!navigator.clipboard?.writeText)throw Error('Clipboard API unavailable');await Promise.race([navigator.clipboard.writeText(value),new Promise((_,reject)=>setTimeout(()=>reject(Error('clipboard timeout')),1500))]);fallback.hidden=true;status.textContent=`${Math.min(ids.length,24)}施設をコピーしました。LINE・メモに貼り付けられます。`}
 catch(_){area.value=value;fallback.hidden=false;area.focus();area.select();status.textContent='コピー用テキストを選択しました。長押しなどでコピーしてください。'}
});
window.addEventListener('ss:results',e=>update(e.detail?.ids));
update(window.SSCurrentResults||[]);
})();
