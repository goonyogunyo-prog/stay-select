/* STAY SELECT: map SEARCH links, not verified geocoded coordinates. */
(()=>{'use strict';
const cards=[...document.querySelectorAll('#stay-list .ss-stay[data-stay-id]')];
let added=0;
for(const card of cards){
 const box=card.querySelector('.ss-stay-links'),name=card.querySelector('.ss-stay-top h2')?.textContent?.trim(),pref=card.dataset.pref?.trim();
 if(!box||!name||!pref||box.querySelector('.ss-map-search-link'))continue;
 const a=document.createElement('a');
 a.className='ss-map-search-link';
 a.href='https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(name+' '+pref);
 a.target='_blank';a.rel='noopener noreferrer';
 a.textContent='地図で場所を探す ↗';
 a.setAttribute('aria-label',name+'（'+pref+'）をGoogleマップで検索する（位置は未検証）');
 a.title='検索結果の名称と住所を確認してください（位置は未検証）';
 box.appendChild(a);added++;
}
const note=document.getElementById('ss-map-note');
if(note)note.setAttribute('data-map-links',String(added));
})();
