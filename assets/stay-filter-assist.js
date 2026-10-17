/* STAY SELECT | 2026-10-17 06:20 | active filter chips and visible-result export */
(()=>{'use strict';
const form=document.getElementById('stay-filters');
const panel=document.getElementById('ss-active-filter-panel');
const chips=document.getElementById('ss-active-filter-chips');
const clear=document.getElementById('ss-clear-active-filters');
const exportButton=document.getElementById('ss-export-visible');
const status=document.getElementById('ss-export-visible-status');
const fallback=document.getElementById('ss-export-visible-fallback');
const list=document.getElementById('stay-list');
if(!form||!panel||!chips||!clear||!exportButton||!status||!list)return;
const keys=['q','region','pref','kind','detail','access','booking'];
const names={q:'検索',region:'エリア',pref:'都道府県',kind:'宿タイプ',detail:'情報の詳しさ',access:'アクセス',booking:'楽天掲載'};
const sort=document.getElementById('ss-sort'),saved=document.getElementById('ss-favorites-only');
function label(el){if(!el)return '';if(el.tagName==='SELECT')return el.selectedOptions[0]?.textContent?.replace(/（\d+）$/,'')||el.value;return el.value.trim()}
function trigger(){form.dispatchEvent(new Event('change',{bubbles:true}));schedule()}
function active(){const a=[];
 for(const id of keys){const el=document.getElementById(id);if(el?.value.trim())a.push({id,label:`${names[id]}：${label(el)}`})}
 if(saved?.checked)a.push({id:'saved',label:'★ 保存した宿のみ'});
 if(sort&&sort.value!=='default')a.push({id:'sort',label:`並び替え：${label(sort)}`});
 return a;
}
function reset(id){if(id==='saved'&&saved)saved.checked=false;
 else if(id==='sort'&&sort)sort.value='default';
 else {const el=document.getElementById(id);if(el)el.value=''}
 trigger();
}
function render(){const a=active();chips.replaceChildren();panel.dataset.hasFilters=String(a.length>0);
 for(const item of a){const button=document.createElement('button');button.type='button';button.className='ss-active-filter-chip';button.textContent=`${item.label} ×`;button.setAttribute('aria-label',`${item.label} の条件を解除`);button.addEventListener('click',()=>reset(item.id));chips.appendChild(button)}
 clear.hidden=!a.length;
 const visible=[...list.querySelectorAll('.ss-stay[data-stay-id]:not([hidden])')];
 exportButton.textContent=`表示中の${visible.length}施設をコピー`;
 exportButton.disabled=!visible.length;
}
let scheduled=false;function schedule(){if(scheduled)return;scheduled=true;queueMicrotask(()=>{scheduled=false;render()})}
form.addEventListener('input',schedule);form.addEventListener('change',schedule);
form.addEventListener('reset',()=>setTimeout(render,0));
sort?.addEventListener('change',schedule);saved?.addEventListener('change',schedule);
document.getElementById('load-more')?.addEventListener('click',schedule);
document.addEventListener('stayselect:booking-updated',schedule);
clear.addEventListener('click',()=>{for(const id of keys){const el=document.getElementById(id);if(el)el.value=''}if(saved)saved.checked=false;if(sort)sort.value='default';trigger()});
exportButton.addEventListener('click',async()=>{
 const visible=[...list.querySelectorAll('.ss-stay[data-stay-id]:not([hidden])')];
 if(!visible.length){status.textContent='表示中の施設がありません。';return}
 const text=visible.map((card,i)=>{
  const name=card.querySelector('h2')?.textContent?.trim()||'宿泊施設';
  const pref=card.dataset.pref||'所在地未確認';
  const url=new URL('../stay/?id='+encodeURIComponent(card.dataset.stayId),document.baseURI).href;
  return `${i+1}. ${name}（${pref}）\n${url}`;
 }).join('\n\n');
 try{if(!navigator.clipboard?.writeText)throw Error('Clipboard API unavailable');await navigator.clipboard.writeText(text);status.textContent=`表示中の${visible.length}施設をコピーしました。`;if(fallback)fallback.hidden=true}
 catch(_){if(fallback){fallback.hidden=false;fallback.value=text;fallback.focus();fallback.select()}status.textContent='施設一覧を選択しました。手動でコピーしてください。'}
});
render();
})();
