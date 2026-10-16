(()=>{'use strict';
const $=id=>document.getElementById(id),form=$('sf-form'),region=$('sf-region'),kind=$('sf-kind'),area=$('sf-results'),status=$('sf-status'),again=$('sf-refresh');
const KEY='stayselect:compare:v1',MAX=4,types={onsen:['温泉旅館'],cottage:['コテージ・一棟貸し','グランピング'],luxury:['高級ホテル','リゾート'],city:['シティホテル','ビジネスホテル']};
let stays=[],rakuten=new Map(),current=[],history=new Set();
const node=(tag,label,klass)=>{const el=document.createElement(tag);if(label!==undefined)el.textContent=label;if(klass)el.className=klass;return el};
function getStored(){try{const x=JSON.parse(localStorage.getItem(KEY)||'[]');return Array.isArray(x)?[...new Set(x.filter(y=>typeof y==='string'))].slice(0,MAX):[]}catch(_){return[]}}
function putStored(x){try{localStorage.setItem(KEY,JSON.stringify(x))}catch(_){}}
function matchRakuten(stay){const m=rakuten.get(stay.id);if(!m||m.name!==stay.name||m.stay_id!==stay.id)return null;const id=String(m.rakuten_hotel_id||'');if(!/^\d+$/.test(id))return null;
 try{let url=new URL(m.rakuten_url);if(url.protocol!=='https:'||url.hostname!=='travel.rakuten.co.jp'||!url.pathname.split('/').includes(id))return null;let aff=false;
 if(m.affiliate_url){const a=new URL(m.affiliate_url),dest=a.searchParams.get('pc');const d=dest?new URL(dest):null;if(a.protocol==='https:'&&a.hostname==='hb.afl.rakuten.co.jp'&&d&&d.protocol==='https:'&&d.hostname==='travel.rakuten.co.jp'&&d.pathname.split('/').includes(id)){url=a;aff=true}}
 return {url:url.href,affiliate:aff}}catch(_){return null}}
function link(text,href,klass){const a=node('a',text,klass);a.href=href;return a}
function updateCompareButtons(){const saved=getStored();area.querySelectorAll('button[data-stay-id]').forEach(b=>{const on=saved.includes(b.dataset.stayId);b.textContent=on?'✓ 比較候補に追加済み':'＋ 比較候補に追加';b.setAttribute('aria-pressed',String(on));b.disabled=!on&&saved.length>=MAX})}
function render(items){area.replaceChildren();items.forEach((s,i)=>{const card=node('article',undefined,'sf-card');const top=node('div',undefined,'sf-card-top'),body=node('div',undefined,'sf-card-body');
 top.append(node('div','STAY / '+String(i+1).padStart(2,'0'),'sf-card-number'),node('h3',s.name,'sf-card-name'),node('div',s.pref+' ・ '+s.kind,'sf-card-meta'));
 body.append(node('p','施設名・所在都道府県の確認済み候補です。宿泊条件・料金・空室は別途確認してください。'));
 const actions=node('div',undefined,'sf-card-actions');actions.append(link('施設情報を確認 ↗','../stay/?id='+encodeURIComponent(s.id)));
 const m=matchRakuten(s);if(m){const booking=link(m.affiliate?'PR｜楽天トラベルのプランを見る ↗':'楽天トラベルのプランを見る ↗',m.url,m.affiliate?'sf-pr':'');booking.target='_blank';booking.rel=m.affiliate?'nofollow sponsored noopener noreferrer':'noopener noreferrer';actions.append(booking)}
 const b=node('button','＋ 比較候補に追加');b.type='button';b.dataset.stayId=s.id;b.addEventListener('click',()=>{let x=getStored();x=x.includes(s.id)?x.filter(id=>id!==s.id):x.length<MAX?[...x,s.id]:x;putStored(x);updateCompareButtons()});actions.append(b);body.append(actions);card.append(top,body);area.append(card)});updateCompareButtons()}
function search(){const r=region.value,k=kind.value;const choices=stays.filter(s=>(!r||s.region===r)&&(!k||(types[k]||[]).includes(s.kind)));
 if(!choices.length){area.replaceChildren(node('div','この条件に合う掲載施設がありません。エリアまたは宿タイプを変更してみてください。','sf-notice'));status.textContent='該当0施設。条件を変更してください。';again.disabled=true;return}
 let remaining=choices.filter(s=>!history.has(s.id));if(!remaining.length){history=new Set();remaining=choices.slice()}
 // Fisher-Yates shuffle: unbiased selection within the eligible, verified-names dataset.
 for(let i=remaining.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[remaining[i],remaining[j]]=[remaining[j],remaining[i]]}
 let shuffled=remaining.slice(0,Math.min(3,choices.length));
 if(shuffled.length<Math.min(3,choices.length)){
  let refill=choices.filter(s=>!shuffled.some(x=>x.id===s.id));
  for(let i=refill.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[refill[i],refill[j]]=[refill[j],refill[i]]}
  shuffled=shuffled.concat(refill.slice(0,3-shuffled.length));history=new Set();
 }
 shuffled.forEach(s=>history.add(s.id));current=shuffled;render(shuffled);status.textContent=choices.length+'施設から'+shuffled.length+'候補を表示。宿泊サービスのおすすめ順位ではありません。';again.disabled=choices.length<=3;}
form.addEventListener('submit',e=>{e.preventDefault();history=new Set();search();});again.addEventListener('click',search);
const q=new URLSearchParams(location.search);if(q.has('region'))region.value=q.get('region');if(q.has('kind'))kind.value=q.get('kind');
Promise.all([fetch('../data/stays.json',{cache:'no-store'}).then(r=>{if(!r.ok)throw Error('stays');return r.json()}),fetch('../data/rakuten-matches.json',{cache:'no-store'}).then(r=>r.ok?r.json():{matches:[]}).catch(()=>({matches:[]}))]).then(([a,b])=>{stays=Array.isArray(a.stays)?a.stays:[];rakuten=new Map((b.matches||[]).map(m=>[m.stay_id,m]));if(stays.length){search()}else{throw Error('データがありません')}}).catch(()=>{status.textContent='施設データを読み込めませんでした。通信状況を確認して再読み込みしてください。';again.disabled=true});
})();