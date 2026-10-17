(()=>{'use strict';
const form=document.getElementById('stay-filters');if(!form)return;
const cards=[...document.querySelectorAll('.ss-stay[data-stay-id]')],list=document.getElementById('stay-list'),q=document.getElementById('q'),region=document.getElementById('region'),pref=document.getElementById('pref'),kind=document.getElementById('kind'),detail=document.getElementById('detail'),booking=document.getElementById('booking'),access=document.getElementById('access'),count=document.getElementById('results-count'),empty=document.getElementById('no-results'),more=document.getElementById('load-more'),sort=document.getElementById('ss-sort'),share=document.getElementById('ss-share-filter'),shareStatus=document.getElementById('ss-share-status'),shareUrl=document.getElementById('ss-share-url');
const original=new Map(cards.map((card,i)=>[card,i]));const collator=new Intl.Collator('ja',{sensitivity:'base',numeric:true});
const FAVORITES_KEY='stayselect:favorites:v1',favoriteOnly=document.getElementById('ss-favorites-only'),favoriteCount=document.getElementById('ss-favorites-count'),favoriteExport=document.getElementById('ss-favorites-export'),favoriteStatus=document.getElementById('ss-favorites-status'),favoriteFallback=document.getElementById('ss-favorites-copy');
const validIds=new Set(cards.map(c=>c.dataset.stayId));let favorites=new Set();
const noteOnly=document.getElementById('ss-note-only'),noteQuery=document.getElementById('ss-note-query'),noteStatus=document.getElementById('ss-note-status'),noteReset=document.getElementById('ss-note-reset');
const NOTES_KEY='stayselect:notes:v1';
const businessToggle=document.getElementById('ss-business-toggle'),businessStatus=document.getElementById('ss-business-status');
const businessTotal=cards.filter(c=>c.dataset.kind==='ビジネスホテル').length;
const newOnly=document.getElementById('ss-new-only'),newStatus=document.getElementById('ss-new-status');
const newestIds=new Set(cards.map(c=>c.dataset.stayId).filter(Boolean).sort((a,b)=>Number(b.split('-').pop())-Number(a.split('-').pop())).slice(0,38));
for(const card of cards){if(newestIds.has(card.dataset.stayId)){card.classList.add('ss-new-arrival');const badge=document.createElement('span');badge.className='ss-new-badge';badge.textContent='NEW';badge.setAttribute('aria-label','新着施設');card.querySelector('.ss-stay-top')?.appendChild(badge);}}
function readNotes(){
 try{const obj=JSON.parse(localStorage.getItem(NOTES_KEY)||'{}');if(!obj||typeof obj!=='object'||Array.isArray(obj))return {};
  return Object.fromEntries(Object.entries(obj).filter(([id,v])=>validIds.has(id)&&typeof v==='string'&&v.trim()).slice(0,80));
 }catch(_){return {}}
}
function noteMatches(card,notes){const text=notes[card.dataset.stayId];if(noteOnly?.checked&&!text)return false;
 const needle=noteQuery?.value.trim().toLocaleLowerCase();return !needle||(typeof text==='string'&&text.toLocaleLowerCase().includes(needle));}

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
if(businessToggle)businessToggle.checked=params.get('business')==='1'||kind.value==='ビジネスホテル';
if(newOnly)newOnly.checked=params.get('new')==='1';
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
function regionMatches(card,chosen){if(!chosen)return true;let r=card.dataset.region;if(r==='北陸・甲信越')r='甲信越・北陸';if(r==='中国・四国')r=['香川県','徳島県','愛媛県','高知県'].includes(card.dataset.pref)?'四国':'中国';return r===chosen;}
function run(){if(kind.value==='ビジネスホテル'&&businessToggle)businessToggle.checked=true; if(businessStatus)businessStatus.textContent=businessToggle?.checked?`全${cards.length}施設を検索対象にしています（ビジネスホテル${businessTotal}施設を含む）。`:`ビジネスホテル${businessTotal}施設を除外して検索中。必要ならチェックを入れて全施設を表示できます。`;const text=q.value.trim().toLocaleLowerCase();const notes=readNotes();if(noteStatus)noteStatus.textContent=`${Object.keys(notes).length}施設にメモを保存中。メモ条件は共有URL・CSVのメモ本文に含まれません。`;if(newStatus)newStatus.textContent=newOnly?.checked?'新着38施設を検索対象にしています。解除すると全施設から探せます。':'新着38施設を含めて検索中。';const matched=cards.filter(c=>(!newOnly?.checked||newestIds.has(c.dataset.stayId))&&(businessToggle?.checked||c.dataset.kind!=='ビジネスホテル')&&noteMatches(c,notes)&&(!favoriteOnly?.checked||favorites.has(c.dataset.stayId))&&(!text||(c.dataset.search||'').toLocaleLowerCase().includes(text))&&regionMatches(c,region.value)&&(!pref.value||c.dataset.pref===pref.value)&&(!kind.value||c.dataset.kind===kind.value)&&(!detail.value||c.dataset.detailed===detail.value)&&(!access.value||c.dataset.access===access.value)&&(!booking.value||(booking.value==='matched'&&!!c.dataset.booking)||(booking.value==='affiliate'&&c.dataset.booking==='affiliate')));
 matched.sort(order);window.SSCurrentResults=matched.map(c=>c.dataset.stayId);window.dispatchEvent(new CustomEvent('ss:results',{detail:{ids:window.SSCurrentResults}}));cards.forEach(c=>c.hidden=true);
 // Move matching cards in their selected order; other (hidden) cards remain in the DOM.
 // Using a fragment keeps the original 443 cards, IDs, links and compare buttons intact.
 const fragment=document.createDocumentFragment();matched.forEach(c=>fragment.appendChild(c));list.appendChild(fragment);
 matched.slice(0,limit).forEach(c=>c.hidden=false);
 count.textContent=`${matched.length}施設が見つかりました（${Math.min(matched.length,limit)}施設を表示）`;
 empty.hidden=matched.length!==0;if(!matched.length&&favoriteOnly?.checked)empty.textContent=favorites.size?'保存済みの宿に一致する施設がありません。条件を緩めてください。':'まだ宿を保存していません。☆ あとで見る を押して追加できます。';else if(!matched.length)empty.textContent='条件に合う施設がありません。検索条件を変えてください。';if(!matched.length&&(noteOnly?.checked||noteQuery?.value.trim()))empty.textContent='メモ条件に合う宿がありません。メモ検索を解除するか、宿の詳細ページでメモを保存してください。';more.hidden=matched.length<=limit;
 const u=new URL(location.href);for(const key of Object.keys(controls))u.searchParams.delete(key);u.searchParams.delete('sort');u.searchParams.delete('saved');u.searchParams.delete('business');u.searchParams.delete('new');
 for(const [key,el] of Object.entries(controls)){const value=el.value.trim();if(value)u.searchParams.set(key,value)}
 if(sort&&sort.value!=='default')u.searchParams.set('sort',sort.value);if(favoriteOnly?.checked)u.searchParams.set('saved','1');if(businessToggle?.checked)u.searchParams.set('business','1');if(newOnly?.checked)u.searchParams.set('new','1');
 history.replaceState(null,'',u.pathname+u.search+u.hash);
}
form.addEventListener('input',()=>{limit=24;run()});form.addEventListener('change',()=>{limit=24;run()});form.addEventListener('reset',()=>setTimeout(()=>{if(sort)sort.value='default';if(favoriteOnly)favoriteOnly.checked=false;if(noteOnly)noteOnly.checked=false;if(noteQuery)noteQuery.value='';if(businessToggle)businessToggle.checked=false;if(newOnly)newOnly.checked=false;limit=24;run()},0));
if(sort)sort.addEventListener('change',()=>{limit=24;run()});
if(favoriteOnly)favoriteOnly.addEventListener('change',()=>{limit=24;run()});
if(noteOnly)noteOnly.addEventListener('change',()=>{limit=24;run()});
if(newOnly)newOnly.addEventListener('change',()=>{limit=24;run()});
if(noteQuery)noteQuery.addEventListener('input',()=>{limit=24;run()});
if(noteReset)noteReset.addEventListener('click',()=>{if(noteOnly)noteOnly.checked=false;if(noteQuery)noteQuery.value='';limit=24;run()});
window.addEventListener('storage',e=>{if(e.key===NOTES_KEY)run()});
document.addEventListener('visibilitychange',()=>{if(!document.hidden)run()});

if(favoriteExport)favoriteExport.addEventListener('click',async()=>{if(!favorites.size){favoriteStatus.textContent='先に宿を保存してください。';return;}const lines=cards.filter(c=>favorites.has(c.dataset.stayId)).map(c=>`${c.querySelector('h2')?.textContent?.trim()||'宿'}｜${c.dataset.pref||''}｜${new URL('../stay/?id='+encodeURIComponent(c.dataset.stayId),document.baseURI).href}`);const text=lines.join('\n');try{if(!navigator.clipboard?.writeText)throw Error('clipboard unavailable');await navigator.clipboard.writeText(text);favoriteStatus.textContent=`${lines.length}施設の一覧をコピーしました。`;if(favoriteFallback)favoriteFallback.hidden=true;}catch(_){if(favoriteFallback){favoriteFallback.hidden=false;favoriteFallback.value=text;favoriteFallback.focus();favoriteFallback.select();}favoriteStatus.textContent='一覧を選択しました。コピーしてください。';}});
more.addEventListener('click',()=>{limit+=24;run()});
if(share)share.addEventListener('click',async()=>{
 const url=location.href;
 if((noteOnly?.checked||noteQuery?.value.trim())&&shareStatus)shareStatus.textContent='メモ検索条件はプライベート情報のため共有URLには含めません。';
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
