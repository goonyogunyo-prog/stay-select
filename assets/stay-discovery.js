/* STAY SELECT | 2026-10-17 | quick discovery and live coverage counts */
(()=>{'use strict';
const form=document.getElementById('stay-filters');
const quick=document.getElementById('ss-discovery-quick');
if(!form||!quick)return;
const cards=[...document.querySelectorAll('#stay-list .ss-stay[data-stay-id]')];
const prefs=new Map(),kinds=new Map();let rakutenMatched=0,affiliate=0;
for(const card of cards){
 const pref=card.dataset.pref||'',kind=card.dataset.kind||'';
 if(pref)prefs.set(pref,(prefs.get(pref)||0)+1);
 if(kind)kinds.set(kind,(kinds.get(kind)||0)+1);
 if(card.dataset.booking)rakutenMatched++;
 if(card.dataset.booking==='affiliate')affiliate++;
}
function refreshBookingCounts(){rakutenMatched=0;affiliate=0;for(const card of cards){if(card.dataset.booking)rakutenMatched++;if(card.dataset.booking==='affiliate')affiliate++}}
const countFor=key=>key==='matched'?rakutenMatched:key==='affiliate'?affiliate:key==='saved'?readFavoriteCount():kinds.get(key)||0;
function readFavoriteCount(){const label=document.getElementById('ss-favorites-count');return Number((label?.textContent||'').match(/\d+/)?.[0]||0)}
for(const option of document.querySelectorAll('#pref option[value]')){
 if(!option.value)continue;
 option.textContent=`${option.value}（${prefs.get(option.value)||0}）`;
}
for(const option of document.querySelectorAll('#kind option[value]')){
 if(!option.value)continue;
 option.textContent=`${option.value}（${kinds.get(option.value)||0}）`;
}
const links=[...document.querySelectorAll('#prefectures .ss-prefmap a[href]')];
for(const link of links){
 const value=new URL(link.href,document.baseURI).searchParams.get('pref');
 if(!value)continue;
 const count=prefs.get(value)||0;
 const small=document.createElement('small');small.className='ss-pref-total';small.textContent=`${count}件`;
 link.appendChild(small);link.setAttribute('aria-label',`${value}の掲載施設 ${count}件`);
 if(count===0){link.removeAttribute('href');link.setAttribute('aria-disabled','true');link.classList.add('ss-pref-empty');link.title='現在は掲載準備中';}
}
const coverage=document.getElementById('ss-discovery-coverage');
if(coverage)coverage.textContent=`全国${prefs.size}都道府県に${cards.length}施設掲載中（掲載件数であり、空室数ではありません）`;
const controls=['q','region','pref','kind','detail','booking','access'];
function selectQuick(key){
 for(const id of controls){const el=document.getElementById(id);if(el)el.value='';}
 const favoriteOnly=document.getElementById('ss-favorites-only');if(favoriteOnly)favoriteOnly.checked=false;
 const sort=document.getElementById('ss-sort');if(sort)sort.value='default';
 if(key==='matched'||key==='affiliate')document.getElementById('booking').value=key;
 else if(key==='saved'){if(favoriteOnly)favoriteOnly.checked=true;}
 else if(key!=='all')document.getElementById('kind').value=key;
 form.dispatchEvent(new Event('input',{bubbles:true}));
 const results=document.getElementById('results-count');results?.scrollIntoView({behavior:'smooth',block:'center'});
}
for(const button of quick.querySelectorAll('button[data-ss-quick]')){
 const key=button.dataset.ssQuick;
 const total=button.querySelector('[data-ss-count]');
 if(total)total.textContent=key==='all'?`${cards.length}施設`:`${countFor(key)}施設`;
 button.addEventListener('click',()=>selectQuick(key));
}
// Rakuten matches load asynchronously; recalculate the quick buttons after validated URLs are applied.
document.addEventListener('stayselect:booking-updated',()=>{refreshBookingCounts();for(const key of ['matched','affiliate']){const label=quick.querySelector(`button[data-ss-quick="${key}"] [data-ss-count]`);if(label)label.textContent=`${countFor(key)}施設`;}});
// The existing favorites module updates this label when a saved stay is toggled.
// Observe just the label rather than reading or changing stored personal data.
const favoritesLabel=document.getElementById('ss-favorites-count');
if(favoritesLabel&&typeof MutationObserver!=='undefined')new MutationObserver(()=>{
 const label=quick.querySelector('button[data-ss-quick="saved"] [data-ss-count]');
 if(label)label.textContent=`${readFavoriteCount()}施設`;
}).observe(favoritesLabel,{childList:true,characterData:true,subtree:true});
})();
