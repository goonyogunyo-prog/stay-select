/* STAY SELECT: choose one stay from all matching results without repeats until cycle completion. */
(()=>{'use strict';
const button=document.getElementById('ss-one-pick-button'),status=document.getElementById('ss-one-pick-status'),output=document.getElementById('ss-one-pick-result');
if(!button||!status||!output)return;
const cards=new Map([...document.querySelectorAll('#stay-list .ss-stay[data-stay-id]')].map(c=>[c.dataset.stayId,c]));
let pool=[],remaining=[],lastSignature='',lastId='';
function randomIndex(n){if(n<=1)return 0;try{if(crypto?.getRandomValues){const a=new Uint32Array(1);const max=Math.floor(0x100000000/n)*n;do{crypto.getRandomValues(a)}while(a[0]>=max);return a[0]%n;}}catch(_){}return Math.floor(Math.random()*n)}
function shuffle(a){for(let i=a.length-1;i>0;i--){const j=randomIndex(i+1);[a[i],a[j]]=[a[j],a[i]]}return a}
function reset(ids){const safe=[...new Set((Array.isArray(ids)?ids:[]).filter(id=>typeof id==='string'&&cards.has(id)))];const signature=safe.slice().sort().join('|');
if(signature!==lastSignature){pool=safe;remaining=shuffle([...pool]);lastSignature=signature;lastId='';output.hidden=true;output.replaceChildren();}
button.disabled=pool.length===0;
if(!pool.length){status.textContent='検索結果が0件です。条件を変更すると提案できます。';output.hidden=true;}
else if(!lastId){status.textContent=`検索結果${pool.length}施設から1施設を提案します。表示中24件以外も対象です。`;}
}
function el(tag,txt,cls){const e=document.createElement(tag);if(cls)e.className=cls;if(txt!==undefined)e.textContent=txt;return e}
function draw(){if(!pool.length)return;
if(!remaining.length){remaining=shuffle([...pool]);if(remaining.length>1&&remaining[remaining.length-1]===lastId){[remaining[0],remaining[remaining.length-1]]=[remaining[remaining.length-1],remaining[0]];}}
const id=remaining.pop(),card=cards.get(id);if(!card)return;lastId=id;
const title=card.querySelector('h2')?.textContent?.trim()||'宿泊施設',pref=card.dataset.pref||'',kind=card.dataset.kind||'';
const name=el('h3',title),meta=el('p',[pref,kind].filter(Boolean).join(' ｜ '),'ss-one-pick-meta');
const actions=el('div',undefined,'ss-one-pick-actions');
const link=el('a','宿の詳細を見る ↗');link.href=new URL('../stay/?id='+encodeURIComponent(id),document.baseURI).href;actions.append(link);
const save=el('button','☆ お気に入りに保存');save.type='button';
function refreshSave(){const picked=card.querySelector('.ss-favorite-pick')?.getAttribute('aria-pressed')==='true';save.textContent=picked?'★ 保存済み':'☆ お気に入りに保存';save.disabled=picked}
refreshSave();save.addEventListener('click',()=>{const b=card.querySelector('.ss-favorite-pick');if(b&&b.getAttribute('aria-pressed')!=='true')b.click();refreshSave()});actions.append(save);
const compare=el('button','比較候補に追加');compare.type='button';
compare.addEventListener('click',()=>{const b=card.querySelector('.ss-compare-pick');if(!b){status.textContent='比較機能を利用できません。';return;}if(b.getAttribute('aria-pressed')==='true'){status.textContent='この宿は比較候補に登録済みです。';return;}b.click();status.textContent=b.getAttribute('aria-pressed')==='true'?'比較候補に追加しました。':'比較候補は最大4施設です。比較ページで候補を整理してください。';});actions.append(compare);
output.replaceChildren(name,meta,actions);output.hidden=false;
status.textContent=`${pool.length}施設中から提案しました。残り${remaining.length}施設は重複なしで選べます。料金・空室は公式で確認してください。`;
}
button.addEventListener('click',draw);
window.addEventListener('ss:results',e=>reset(e.detail?.ids));
reset(window.SSCurrentResults||[]);
})();
