(()=>{'use strict';
const container=document.getElementById('ss-live-kind-buttons');
const caption=document.getElementById('ss-live-kind-caption');
const select=document.getElementById('kind');
if(!container||!caption||!select)return;
const cards=new Map([...document.querySelectorAll('.ss-stay[data-stay-id]')].map(c=>[c.dataset.stayId,c]));
const collator=new Intl.Collator('ja');
function render(ids){
 if(!Array.isArray(ids))return;
 const totals=new Map();
 for(const id of ids){const card=cards.get(id);if(!card)continue;const kind=card.dataset.kind||'その他';totals.set(kind,(totals.get(kind)||0)+1)}
 const ordered=[...totals].sort((a,b)=>b[1]-a[1]||collator.compare(a[0],b[0]));
 const chosen=select.value;
 caption.textContent=ids.length?`${ids.length}施設のタイプ別内訳（24件表示上限を超えても全件集計）。タイプを押すと絞り込めます。`:'一致する施設がありません。条件を変更してください。';
 container.replaceChildren();
 if(chosen){const reset=document.createElement('button');reset.type='button';reset.className='ss-live-kind-chip ss-live-kind-clear';reset.textContent=`${chosen}の指定を解除`;reset.addEventListener('click',()=>{select.value='';select.dispatchEvent(new Event('change',{bubbles:true}));});container.appendChild(reset)}
 for(const [name,count] of ordered){const b=document.createElement('button');b.type='button';b.className='ss-live-kind-chip';b.textContent=`${name} ${count}件`;b.setAttribute('aria-label',`${name}の${count}施設に絞り込む`);b.setAttribute('aria-pressed',String(chosen===name));b.addEventListener('click',()=>{select.value=name;select.dispatchEvent(new Event('change',{bubbles:true}));select.focus({preventScroll:true});});container.appendChild(b)}
}
window.addEventListener('ss:results',e=>render(e.detail?.ids));
render(window.SSCurrentResults||[...cards.keys()]);
})();
