(()=>{'use strict';
const box=document.getElementById('ss-live-cross-buttons'),caption=document.getElementById('ss-live-cross-caption'),pref=document.getElementById('pref'),kind=document.getElementById('kind');
if(!box||!caption||!pref||!kind)return;
const cards=new Map([...document.querySelectorAll('.ss-stay[data-stay-id]')].map(c=>[c.dataset.stayId,c]));
const collator=new Intl.Collator('ja');
function update(ids){
 if(!Array.isArray(ids))return;
 const counts=new Map();
 for(const id of ids){const c=cards.get(id);if(!c)continue;const p=c.dataset.pref,k=c.dataset.kind;if(!p||!k)continue;const key=p+'\u0000'+k;counts.set(key,(counts.get(key)||0)+1)}
 const sorted=[...counts].map(([key,n])=>{const [p,k]=key.split('\u0000');return {p,k,n}}).sort((a,b)=>b.n-a.n||collator.compare(a.p,b.p)||collator.compare(a.k,b.k));
 caption.textContent=ids.length?`${ids.length}施設から${sorted.length}組の地域×タイプを集計。上位12組を表示。24件の表示上限に関係なく全件を集計します。`:'条件に一致する施設がありません。検索条件を変更してください。';
 box.replaceChildren();
 if(pref.value||kind.value){const reset=document.createElement('button');reset.type='button';reset.className='ss-live-cross-chip ss-live-cross-reset';reset.textContent='都道府県とタイプの指定を解除';reset.addEventListener('click',()=>{pref.value='';kind.value='';pref.dispatchEvent(new Event('change',{bubbles:true}));});box.appendChild(reset)}
 for(const row of sorted.slice(0,12)){
  const button=document.createElement('button');button.type='button';button.className='ss-live-cross-chip';button.textContent=`${row.p} × ${row.k}　${row.n}件`;
  button.setAttribute('aria-label',`${row.p}の${row.k}、${row.n}施設に絞り込む`);
  button.setAttribute('aria-pressed',String(pref.value===row.p&&kind.value===row.k));
  button.addEventListener('click',()=>{pref.value=row.p;kind.value=row.k;pref.dispatchEvent(new Event('change',{bubbles:true}));pref.focus({preventScroll:true})});box.appendChild(button)
 }
 if(sorted.length>12){const small=document.createElement('span');small.className='ss-live-cross-more';small.textContent=`ほか${sorted.length-12}組（通常の絞り込みメニューでも選択可能）`;box.appendChild(small)}
}
window.addEventListener('ss:results',e=>update(e.detail?.ids));update(window.SSCurrentResults||[...cards.keys()]);
})();
