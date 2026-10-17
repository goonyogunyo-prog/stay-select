(()=>{'use strict';
const form=document.getElementById('stay-filters');if(!form)return;
const cards=[...document.querySelectorAll('.ss-stay[data-stay-id]')],list=document.getElementById('stay-list'),q=document.getElementById('q'),region=document.getElementById('region'),pref=document.getElementById('pref'),kind=document.getElementById('kind'),detail=document.getElementById('detail'),booking=document.getElementById('booking'),access=document.getElementById('access'),count=document.getElementById('results-count'),empty=document.getElementById('no-results'),more=document.getElementById('load-more'),sort=document.getElementById('ss-sort'),share=document.getElementById('ss-share-filter'),shareStatus=document.getElementById('ss-share-status'),shareUrl=document.getElementById('ss-share-url');
const original=new Map(cards.map((card,i)=>[card,i]));const collator=new Intl.Collator('ja',{sensitivity:'base',numeric:true});
const FAVORITES_KEY='stayselect:favorites:v1',favoriteOnly=document.getElementById('ss-favorites-only'),favoriteCount=document.getElementById('ss-favorites-count'),favoriteExport=document.getElementById('ss-favorites-export'),favoriteStatus=document.getElementById('ss-favorites-status'),favoriteFallback=document.getElementById('ss-favorites-copy');
const validIds=new Set(cards.map(c=>c.dataset.stayId));let favorites=new Set();
try{const saved=JSON.parse(localStorage.getItem(FAVORITES_KEY)||'[]');if(Array.isArray(saved))favorites=new Set(saved.filter(id=>typeof id==='string'&&validIds.has(id)))}catch(_){/* storage unavailable: keep favorites for this page */}
function persistFavorites(){try{localStorage.setItem(FAVORITES_KEY,JSON.stringify([...favorites]))}catch(_){if(favoriteStatus)favoriteStatus.textContent='端末に保存できませんでした。このページを開いている間だけ保持します。'}}
function renderFavorites(){if(favoriteCount)favoriteCount.textContent=`保存済み ${favorites.size}施設`;
 cards.forEach(card=>{const button=card.querySelector('.ss-favorite-pick');if(!button)return;const active=favorites.has(card.dataset.stayId);button.textContent=active?'★ 保存済み':'☆ あとで見る';button.setAttribute('aria-pressed',String(active));button.setAttribute('aria-label',`${card.querySelector('h2')?.textContent||'宿'}を${active?'保存から外す':'お気に入りに保存する'}`);});}
cards.forEach(card=>{const area=card.querySelector('.ss-stay-links');if(!area)return;const button=document.createElement('button');button.type='button';button.className='ss-favorite-pick';area.appendChild(button);button.addEventListener('click',()=>{const id=card.dataset.stayId;if(favorites.has(id))favorites.delete(id);else favorites.add(id);persistFavorites();renderFavorites();run();});});
if(favoriteOnly)favoriteOnly.checked=new URLSearchParams(location.search).get('saved')==='1';

const params=new URLSearchParams(location.search);const controls={region,pref,kind,q,detail,booking,access};
for(const [key,el] of Object.entries(controls)){if(params.has(key))el.value=params.get(key)}
const allowedSorts=new Set(['default','name','pref','matched','affiliate','detail','saved']);
if(sort&&allowedSorts.has(params.get('sort')))sort.value=params.get('sort');
let limit=24;
function order(a,b){const mode=sort?.value||'default';
 if(mode==='name'){const c=collator.compare(a.querySelector('h2')?.textContent||'',b.querySelector('h2')?.textContent||'');if(c)return c}
 if(mode==='pref'){const c=collator.compare(a.dataset.pref||'',b.dataset.pref||'');if(c)return c}
 if(mode==='matched'||mode==='affiliate'){
  const score=x=>mode==='affiliate'?Number(x.dataset.booking==='affiliate'):Number(x.dataset.booking==='matched'||x.dataset.booking==='affiliate');
  const c=score(b)-score(a);if(c)return c;
 }
 if(mode==='detail'){const c=Number(b.dataset.detailed==='1')-Number(a.dataset.detailed==='1');if(c)return c}
 if(mode==='saved'){const c=Number(favorites.has(b.dataset.stayId))-Number(favorites.has(a.dataset.stayId));if(c)return c}
 return original.get(a)-original.get(b);
}
function run(){const text=q.value.trim().toLocaleLowerCase();const matched=cards.filter(c=>(!favoriteOnly?.checked||favorites.has(c.dataset.stayId))&&(!text||(c.dataset.search||'').toLocaleLowerCase().includes(text))&&(!region.value||c.dataset.region===region.value)&&(!pref.value||c.dataset.pref===pref.value)&&(!kind.value||c.dataset.kind===kind.value)&&(!detail.value||c.dataset.detailed===detail.value)&&(!access.value||c.dataset.access===access.value)&&(!booking.value||(booking.value==='matched'&&!!c.dataset.booking)||(booking.value==='affiliate'&&c.dataset.booking==='affiliate')));
 matched.sort(order);cards.forEach(c=>c.hidden=true);
 // Move matching cards in their selected order; other (hidden) cards remain in the DOM.
 // Using a fragment keeps the original 215 cards, IDs, links and compare buttons intact.
 const fragment=document.createDocumentFragment();matched.forEach(c=>fragment.appendChild(c));list.appendChild(fragment);
 matched.slice(0,limit).forEach(c=>c.hidden=false);
 count.textContent=`${matched.length}施設が見つかりました（${Math.min(matched.length,limit)}施設を表示）`;
 empty.hidden=matched.length!==0;if(!matched.length&&favoriteOnly?.checked)empty.textContent=favorites.size?'保存済みの宿に一致する施設がありません。条件を緩めてください。':'まだ宿を保存していません。☆ あとで見る を押して追加できます。';else if(!matched.length)empty.textContent='条件に合う施設がありません。検索条件を変えてください。';more.hidden=matched.length<=limit;
 const u=new URL(location.href);for(const key of Object.keys(controls))u.searchParams.delete(key);u.searchParams.delete('sort');u.searchParams.delete('saved');
 for(const [key,el] of Object.entries(controls)){const value=el.value.trim();if(value)u.searchParams.set(key,value)}
 if(sort&&sort.value!=='default')u.searchParams.set('sort',sort.value);if(favoriteOnly?.checked)u.searchParams.set('saved','1');
 history.replaceState(null,'',u.pathname+u.search+u.hash);
}
form.addEventListener('input',()=>{limit=24;run()});form.addEventListener('change',()=>{limit=24;run()});form.addEventListener('reset',()=>setTimeout(()=>{if(sort)sort.value='default';if(favoriteOnly)favoriteOnly.checked=false;limit=24;run()},0));
if(sort)sort.addEventListener('change',()=>{limit=24;run()});
if(favoriteOnly)favoriteOnly.addEventListener('change',()=>{limit=24;run()});
if(favoriteExport)favoriteExport.addEventListener('click',async()=>{if(!favorites.size){favoriteStatus.textContent='先に宿を保存してください。';return;}const lines=cards.filter(c=>favorites.has(c.dataset.stayId)).map(c=>`${c.querySelector('h2')?.textContent?.trim()||'宿'}｜${c.dataset.pref||''}｜${new URL('../stay/?id='+encodeURIComponent(c.dataset.stayId),document.baseURI).href}`);const text=lines.join('\n');try{if(!navigator.clipboard?.writeText)throw Error('clipboard unavailable');await navigator.clipboard.writeText(text);favoriteStatus.textContent=`${lines.length}施設の一覧をコピーしました。`;if(favoriteFallback)favoriteFallback.hidden=true;}catch(_){if(favoriteFallback){favoriteFallback.hidden=false;favoriteFallback.value=text;favoriteFallback.focus();favoriteFallback.select();}favoriteStatus.textContent='一覧を選択しました。コピーしてください。';}});
more.addEventListener('click',()=>{limit+=24;run()});
if(share)share.addEventListener('click',async()=>{
 const url=location.href;
 try{if(!navigator.clipboard?.writeText)throw Error('Clipboard API unavailable');await navigator.clipboard.writeText(url);shareStatus.textContent='検索条件のURLをコピーしました。';shareUrl.hidden=true}
 catch(_){shareUrl.hidden=false;shareUrl.value=url;shareUrl.focus();shareUrl.select();shareStatus.textContent='URLを選択しました。コピーして共有してください。'}
});
renderFavorites();run();})();

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
   if(a.protocol==='https:'&&a.hostname==='hb.afl.rakuten.co.jp'&&dest&&dest.hostname==='travel.rakuten.co.jp'&&dest.pathname.split('/').filter(Boolean).includes(String(m.rakuten_hotel_id)))affiliate=m.affiliate_url;
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
  card.dataset.booking=v.affiliate?'affiliate':'matched';
  if(!existing)area.appendChild(a);
 }
  const form=document.getElementById('stay-filters'); if(form)form.dispatchEvent(new Event('change',{bubbles:true}));
  document.dispatchEvent(new CustomEvent('stayselect:booking-updated')); 
}).catch(e=>{console.warn('楽天トラベルの紐づけデータを読み込めませんでした',e)});
})();
