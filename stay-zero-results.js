/* STAY SELECT | 2026-10-17 07:22 | zero-result recovery based on actual 405 cards */
(()=>{'use strict';
const form=document.getElementById('stay-filters');
const panel=document.getElementById('ss-zero-help');
const suggestions=document.getElementById('ss-zero-suggestions');
const clearAll=document.getElementById('ss-zero-reset');
const empty=document.getElementById('no-results');
const cards=[...document.querySelectorAll('#stay-list .ss-stay[data-stay-id]')];
if(!form||!panel||!suggestions||!clearAll||!empty||!cards.length)return;
const names={q:'キーワード',region:'エリア',pref:'都道府県',kind:'宿タイプ',detail:'情報の詳しさ',access:'アクセス',booking:'楽天掲載',saved:'保存済みのみ'};
const keys=['q','region','pref','kind','detail','access','booking'];
const controls=Object.fromEntries(keys.map(id=>[id,document.getElementById(id)]));
const saved=document.getElementById('ss-favorites-only');
function selected(){
 const values={};for(const id of keys)values[id]=controls[id]?.value?.trim()||'';
 values.saved=!!saved?.checked;return values;
}
function cardMatches(card,values){
 if(values.saved&&card.querySelector('.ss-favorite-pick')?.getAttribute('aria-pressed')!=='true')return false;
 if(values.q&&!(card.dataset.search||'').toLocaleLowerCase().includes(values.q.toLocaleLowerCase()))return false;
 for(const id of ['region','pref','kind'])if(values[id]&&card.dataset[id]!==values[id])return false;
 if(values.detail&&card.dataset.detailed!==values.detail)return false;
 if(values.access&&card.dataset.access!==values.access)return false;
 if(values.booking){const b=card.dataset.booking||'';if(values.booking==='matched'?!b:b!==values.booking)return false;}
 return true;
}
function remove(key){if(key==='saved'){if(saved)saved.checked=false;}else if(controls[key])controls[key].value='';form.dispatchEvent(new Event('change',{bubbles:true}));schedule();}
function render(){
 panel.hidden=!(!empty.hidden);
 if(panel.hidden)return;
 const current=selected();const active=Object.keys(current).filter(k=>current[k]);
 const ranked=active.map(key=>{
  const without={...current,[key]:key==='saved'?false:''};
  return {key,count:cards.reduce((n,c)=>n+Number(cardMatches(c,without)),0)};
 }).filter(item=>item.count>0).sort((a,b)=>b.count-a.count).slice(0,4);
 suggestions.replaceChildren();
 for(const item of ranked){
  const button=document.createElement('button');button.type='button';button.className='ss-zero-suggestion';
  button.textContent=`「${names[item.key]}」を外す → ${item.count}施設`;
  button.setAttribute('aria-label',`${names[item.key]}の条件を解除して${item.count}施設を表示`);
  button.addEventListener('click',()=>remove(item.key));suggestions.appendChild(button);
 }
 const message=document.getElementById('ss-zero-hint');
 if(message)message.textContent=ranked.length?'条件を1つ外した場合の掲載施設数です。料金・空室を保証するものではありません。':'1条件だけ外しても一致しません。すべて解除して全国の掲載施設を確認できます。';
}
let pending=false;function schedule(){if(pending)return;pending=true;queueMicrotask(()=>{pending=false;render()})}
form.addEventListener('input',schedule);form.addEventListener('change',schedule);
form.addEventListener('reset',()=>setTimeout(render,30));
saved?.addEventListener('change',schedule);
document.addEventListener('stayselect:booking-updated',schedule);
clearAll.addEventListener('click',()=>{
 for(const id of keys)if(controls[id])controls[id].value='';
 if(saved)saved.checked=false;
 const sort=document.getElementById('ss-sort');if(sort)sort.value='default';
 form.dispatchEvent(new Event('change',{bubbles:true}));schedule();
});
render();
})();
