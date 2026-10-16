(()=>{'use strict';const form=document.querySelector('[data-guide-filter]');if(!form)return;const cards=[...document.querySelectorAll('.g-card')],search=form.querySelector('[name="search"]'),pref=form.querySelector('[name="pref"]'),count=document.getElementById('guide-count'),empty=document.getElementById('guide-empty');function run(){const q=search.value.trim().toLocaleLowerCase('ja');let n=0;cards.forEach(c=>{const hit=(!q||c.dataset.search.includes(q))&&(!pref.value||c.dataset.pref===pref.value);c.hidden=!hit;if(hit)n++});count.textContent=`${n}件の宿泊候補を表示中（全${cards.length}件）`;empty.hidden=n!==0;}form.addEventListener('input',run);form.addEventListener('change',run);form.addEventListener('reset',()=>setTimeout(run,0));run()})();

;(()=>{'use strict';
function validate(id,name,m){if(!m||m.stay_id!==id||m.name!==name||!/^[0-9]+$/.test(String(m.rakuten_hotel_id||'')))return null;
try{const u=new URL(m.rakuten_url),h=String(m.rakuten_hotel_id);if(u.protocol!=='https:'||u.hostname!=='travel.rakuten.co.jp'||!u.pathname.split('/').includes(h))return null;
let aff=null;if(m.affiliate_url){const a=new URL(m.affiliate_url),p=a.searchParams.get('pc'),dest=p?new URL(p):null;if(a.protocol==='https:'&&a.hostname==='hb.afl.rakuten.co.jp'&&dest&&dest.protocol==='https:'&&dest.hostname==='travel.rakuten.co.jp'&&dest.pathname.split('/').includes(h))aff=a.href}
return {href:aff||u.href,affiliate:!!aff};}catch(e){return null}}
const cards=[...document.querySelectorAll('.g-card[data-stay-id]')];if(!cards.length)return;
fetch('../data/rakuten-matches.json',{cache:'no-store'}).then(r=>{if(!r.ok)throw Error('HTTP '+r.status);return r.json()}).then(data=>{const map=new Map((data.matches||[]).map(m=>[m.stay_id,m]));cards.forEach(c=>{
const id=c.dataset.stayId,name=c.querySelector('h3')?.textContent?.trim(),m=map.get(id),v=validate(id,name,m);if(!v)return;
const area=c.querySelector('.g-actions');if(!area)return;let a=area.querySelector('[data-rakuten-link]')||area.querySelector('a[href^="https://hb.afl.rakuten.co.jp/"]')||area.querySelector('a[href^="https://travel.rakuten.co.jp/"]');
if(!a){a=document.createElement('a');area.appendChild(a)}a.dataset.rakutenLink='true';a.href=v.href;a.target='_blank';a.rel=v.affiliate?'nofollow sponsored noopener noreferrer':'noopener noreferrer';a.className=v.affiliate?'g-detail-link ss-rakuten-pr':'muted';a.textContent=v.affiliate?'PR｜楽天トラベルでプランを見る ↗':'楽天トラベル掲載ページ（通常リンク） ↗';
});}).catch(e=>console.warn('楽天リンクの読み込みに失敗',e));
})();