/* STAY SELECT | one-tap same-prefecture discovery | 2026-10-18 */
(()=>{'use strict';
const form=document.getElementById('stay-filters'),pref=document.getElementById('pref'),region=document.getElementById('region'),undo=document.getElementById('ss-pref-jump-undo'),status=document.getElementById('ss-pref-jump-status'),list=document.getElementById('stay-list');
if(!form||!pref||!region||!undo||!status||!list)return;
const cards=[...list.querySelectorAll('.ss-stay[data-stay-id]')];let previous=null;
for(const card of cards){
 const badge=card.querySelector('.ss-stay-top .pref');if(!badge||!card.dataset.pref)continue;
 const btn=document.createElement('button');btn.type='button';btn.className='pref ss-pref-jump';btn.textContent=badge.textContent;
 btn.setAttribute('aria-label',`${card.querySelector('h2')?.textContent?.trim()||'この宿'}と同じ${card.dataset.pref}の宿を探す`);
 btn.title='同じ都道府県の宿を探す';badge.replaceWith(btn);
 btn.addEventListener('click',()=>{
  previous={pref:pref.value,region:region.value};
  pref.value=card.dataset.pref;region.value='';
  pref.dispatchEvent(new Event('change',{bubbles:true}));
  undo.hidden=false;status.textContent=`${card.dataset.pref}で検索中。他の検索条件は維持しています。`;
  form.scrollIntoView({behavior:'smooth',block:'start'});
 });
}
undo.addEventListener('click',()=>{
 if(!previous)return;
 pref.value=previous.pref;region.value=previous.region;
 pref.dispatchEvent(new Event('change',{bubbles:true}));
 status.textContent='都道府県と地域の条件を元に戻しました。';undo.hidden=true;previous=null;
});
form.addEventListener('reset',()=>{previous=null;undo.hidden=true;status.textContent='';});
})();
