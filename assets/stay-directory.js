(()=>{'use strict';const form=document.getElementById('stay-filters');if(!form)return;const cards=[...document.querySelectorAll('.ss-stay')],q=document.getElementById('q'),region=document.getElementById('region'),pref=document.getElementById('pref'),kind=document.getElementById('kind'),detail=document.getElementById('detail'),booking=document.getElementById('booking'),access=document.getElementById('access'),count=document.getElementById('results-count'),empty=document.getElementById('no-results'),more=document.getElementById('load-more');let limit=24;const params=new URLSearchParams(location.search);if(params.get('region'))region.value=params.get('region');if(params.get('pref'))pref.value=params.get('pref');if(params.get('kind'))kind.value=params.get('kind');if(params.get('q'))q.value=params.get('q');if(params.get('detail'))detail.value=params.get('detail');if(params.get('booking'))booking.value=params.get('booking');if(params.get('access'))access.value=params.get('access');function run(){const text=q.value.trim().toLocaleLowerCase(),matched=cards.filter(c=>(!text||(c.dataset.search||'').toLocaleLowerCase().includes(text))&&(!region.value||c.dataset.region===region.value)&&(!pref.value||c.dataset.pref===pref.value)&&(!kind.value||c.dataset.kind===kind.value)&&(!detail.value||c.dataset.detailed===detail.value)&&(!access.value||c.dataset.access===access.value)&&(!booking.value||(booking.value==='matched'&&!!c.dataset.booking)||(booking.value==='affiliate'&&c.dataset.booking==='affiliate')));cards.forEach(c=>c.hidden=true);matched.slice(0,limit).forEach(c=>c.hidden=false);count.textContent=`${matched.length}施設が見つかりました（${Math.min(matched.length,limit)}施設を表示）`;empty.hidden=matched.length!==0;more.hidden=matched.length<=limit;const u=new URL(location.href);['region','pref','kind','q','detail','booking','access'].forEach(k=>u.searchParams.delete(k));if(region.value)u.searchParams.set('region',region.value);if(pref.value)u.searchParams.set('pref',pref.value);if(kind.value)u.searchParams.set('kind',kind.value);if(q.value.trim())u.searchParams.set('q',q.value.trim());if(detail.value)u.searchParams.set('detail',detail.value);if(booking.value)u.searchParams.set('booking',booking.value);if(access.value)u.searchParams.set('access',access.value);history.replaceState(null,'',u.pathname+(u.search||'')+u.hash)}form.addEventListener('input',()=>{limit=24;run()});form.addEventListener('change',()=>{limit=24;run()});form.addEventListener('reset',()=>setTimeout(()=>{limit=24;run()},0));more.addEventListener('click',()=>{limit+=24;run()});run()})();

;(()=>{'use strict';
const MAX=4,KEY='stayselect:compare:v1',cards=[...document.querySelectorAll('.ss-stay[data-stay-id]')];
if(!cards.length)return;
let selected=[];try{const raw=JSON.parse(localStorage.getItem(KEY)||'[]');if(Array.isArray(raw))selected=[...new Set(raw.filter(x=>typeof x==='string'))].slice(0,MAX)}catch(e){}
const valid=new Set(cards.map(c=>c.dataset.stayId));selected=selected.filter(x=>valid.has(x));
const tray=document.createElement('aside');tray.className='ss-compare-tray';tray.setAttribute('aria-label','比較候補');tray.hidden=true;
tray.innerHTML='<div class="ss-compare-tray-inner"><div><strong id="ss-compare-label">比較候補</strong><span id="ss-compare-names"></span></div><div class="ss-compare-actions"><button type="button" id="ss-compare-clear">すべて外す</button><a id="ss-compare-open" class="ss-button" href="../compare/">比較する ↗</a></div></div>';
document.body.appendChild(tray);
const label=tray.querySelector('#ss-compare-label'),names=tray.querySelector('#ss-compare-names'),open=tray.querySelector('#ss-compare-open');
function save(){try{localStorage.setItem(KEY,JSON.stringify(selected))}catch(e){}}
function refresh(){tray.hidden=selected.length===0;label.textContent=`比較候補 ${selected.length}/${MAX}施設`;
names.textContent=selected.map(id=>{const c=cards.find(x=>x.dataset.stayId===id);return c?c.querySelector('h2').textContent:''}).filter(Boolean).join(' / ');
open.href='../compare/?ids='+encodeURIComponent(selected.join(','));
cards.forEach(c=>{const btn=c.querySelector('.ss-compare-pick');if(!btn)return;const on=selected.includes(c.dataset.stayId);btn.textContent=on?'✓ 比較候補から外す':'＋ 比較候補に追加';btn.setAttribute('aria-pressed',String(on));btn.disabled=!on&&selected.length>=MAX;btn.title=btn.disabled?'比較できるのは4施設まで':''});}
cards.forEach(c=>{const area=c.querySelector('.ss-stay-links');if(!area)return;const btn=document.createElement('button');btn.type='button';btn.className='ss-compare-pick';btn.setAttribute('aria-label',c.querySelector('h2').textContent+'を比較候補に追加');area.appendChild(btn);btn.addEventListener('click',()=>{const id=c.dataset.stayId;if(selected.includes(id))selected=selected.filter(x=>x!==id);else if(selected.length<MAX)selected.push(id);save();refresh()})});
tray.querySelector('#ss-compare-clear').addEventListener('click',()=>{selected=[];save();refresh()});refresh();
})();

;(()=>{'use strict';
function validMatch(s,m){
 if(!s||!m||m.stay_id!==s.id||m.name!==s.name||!/^[0-9]+$/.test(String(m.rakuten_hotel_id||'')))return null;
 try{
  const u=new URL(m.rakuten_url);
  if(u.protocol!=='https:'||!['travel.rakuten.co.jp','hotel.travel.rakuten.co.jp'].includes(u.hostname)||!u.pathname.includes('/'+m.rakuten_hotel_id))return null;
  let affiliate=null;
  if(m.affiliate_url){
   const a=new URL(m.affiliate_url),p=a.searchParams.get('pc'),dest=p?new URL(p):null;
   if(a.protocol==='https:'&&a.hostname==='hb.afl.rakuten.co.jp'&&dest&&dest.hostname==='travel.rakuten.co.jp'&&dest.pathname.includes('/'+m.rakuten_hotel_id+'/'))affiliate=a.href;
  }
  return {url:affiliate||u.href,affiliate:!!affiliate};
 }catch(e){return null}
}
const cards=[...document.querySelectorAll('.ss-stay[data-stay-id]')];if(!cards.length)return;
fetch('../data/rakuten-matches.json',{cache:'no-store'}).then(r=>{if(!r.ok)throw Error('HTTP '+r.status);return r.json()}).then(data=>{
 const byId=new Map((data.matches||[]).map(m=>[m.stay_id,m]));
 for(const card of cards){const id=card.dataset.stayId,m=byId.get(id);if(!m)continue;
  const name=card.querySelector('h2')?.textContent?.trim(),v=validMatch({id,name},m);if(!v)continue;
  const area=card.querySelector('.ss-stay-links');if(!area)continue;
  const existing=area.querySelector('[data-rakuten-link]');const a=existing||document.createElement('a');a.href=v.url;a.target='_blank';a.rel=v.affiliate?'nofollow sponsored noopener noreferrer':'noopener noreferrer';
  a.className=v.affiliate?'ss-rakuten-link ss-rakuten-pr':'ss-rakuten-link';a.dataset.rakutenLink='true';
  a.textContent=v.affiliate?'PR｜楽天トラベルでプランを見る ↗':'楽天トラベルでプランを見る（通常リンク） ↗';
  a.setAttribute('aria-label',name+'：楽天トラベルで宿泊プランを見る'+(v.affiliate?'（PR広告）':'（通常リンク）'));
  if(!existing)area.appendChild(a);
 }
}).catch(e=>{console.warn('楽天トラベルの紐づけデータを読み込めませんでした',e)});
})();
