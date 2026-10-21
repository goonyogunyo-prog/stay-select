(()=>{'use strict';
const KEY='stayselect:compare:v1',MAX=4,addSelect=document.getElementById('compare-add'),addBtn=document.getElementById('compare-add-button'),feedback=document.getElementById('compare-feedback'),empty=document.getElementById('compare-empty'),result=document.getElementById('compare-result'),head=document.getElementById('compare-head'),body=document.getElementById('compare-body');
let all=[],chosen=[],rakutenMatches=new Map();
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
const params=new URLSearchParams(location.search),incoming=params.get('ids');
function readStored(){try{const a=JSON.parse(localStorage.getItem(KEY)||'[]');return Array.isArray(a)?a.filter(x=>typeof x==='string'):[]}catch(e){return[]}}
function persist(){try{localStorage.setItem(KEY,JSON.stringify(chosen))}catch(e){}}
function make(tag,text){const n=document.createElement(tag);n.textContent=String(text??'');return n}
function row(label,values,asLink=false){const tr=document.createElement('tr');tr.appendChild(make('th',label));values.forEach((v,i)=>{const td=document.createElement('td');if(asLink){const a=make('a','公式情報を開く ↗');a.href=v;a.target='_blank';a.rel='noopener noreferrer';td.appendChild(a)}else{const txt=(!v||v==='未確認')?'未確認・要問い合わせ':v;td.textContent=txt;if(txt==='未確認・要問い合わせ')td.className='ss-compare-unknown'}tr.appendChild(td)});body.appendChild(tr)}
function render(){const items=chosen.map(id=>all.find(s=>s.id===id)).filter(Boolean);chosen=items.map(x=>x.id);persist();empty.hidden=items.length>0;result.hidden=items.length===0;head.replaceChildren();body.replaceChildren();
if(items.length){const tr=document.createElement('tr');tr.appendChild(make('th','比較項目'));items.forEach(s=>{const th=document.createElement('th');th.appendChild(make('strong',s.name));const detail=make('a','宿の詳細 ↗');detail.href='../stay/?id='+encodeURIComponent(s.id);detail.className='ss-compare-detail';th.appendChild(detail);const b=make('button','候補から外す ×');b.type='button';b.setAttribute('aria-label',s.name+'を比較から外す');b.addEventListener('click',()=>{chosen=chosen.filter(id=>id!==s.id);render()});th.appendChild(b);tr.appendChild(th)});head.appendChild(tr);
[['都道府県','pref'],['宿泊タイプ','kind'],['事前予約制の貸切風呂','private_bath'],['飲み放題・包含条件','drinks'],['選べる浴衣','yukata'],['誕生日ケーキの宿への注文','cake'],['客室装飾・持ち込み','decoration'],['最寄り駅・アクセス','station'],['スーパー・買い出し','supermarket'],['確認済みの補足','detail'],['情報の確認日','verified_at']].forEach(([label,key])=>row(label,items.map(s=>s[key])));row('公式情報・出典',items.map(s=>s.source),true);
 const booking=document.createElement('tr');booking.appendChild(make('th','楽天トラベルの掲載・予約ページ'));
 items.forEach(s=>{const td=document.createElement('td'),v=validMatch(s,rakutenMatches.get(s.id));if(!v){td.textContent='未照合（掲載なしとは限りません）';td.className='ss-compare-unknown'}else{const a=make('a',v.affiliate?'PR｜楽天トラベルでプランを見る ↗':'楽天トラベルでプランを見る（通常リンク） ↗');a.href=v.url;a.target='_blank';a.rel=v.affiliate?'nofollow sponsored noopener noreferrer':'noopener noreferrer';if(v.affiliate)a.className='ss-rakuten-pr';td.appendChild(a)}booking.appendChild(td)});body.appendChild(booking)}
addSelect.replaceChildren();const placeholder=make('option',items.length===MAX?'4施設を選択済みです':'施設を選択してください');placeholder.value='';addSelect.appendChild(placeholder);all.filter(s=>!chosen.includes(s.id)).sort((a,b)=>a.name.localeCompare(b.name,'ja')).forEach(s=>{const o=make('option',s.name+'（'+s.pref+'）');o.value=s.id;addSelect.appendChild(o)});addBtn.disabled=items.length>=MAX;addSelect.disabled=items.length>=MAX;
const u=new URL(location.href);if(chosen.length)u.searchParams.set('ids',chosen.join(','));else u.searchParams.delete('ids');history.replaceState(null,'',u.pathname+u.search+u.hash);
feedback.textContent=items.length?`${items.length}施設を比較中。最大4施設まで追加できます。`:'候補を選んで比較を始めましょう。';window.dispatchEvent(new CustomEvent('stayselect:compare-updated',{detail:{items:items.map(x=>({id:x.id,name:x.name,pref:x.pref}))}}));}
addBtn.addEventListener('click',()=>{const id=addSelect.value;if(!id){feedback.textContent='追加する宿を選んでください。';return}if(chosen.length>=MAX){feedback.textContent='比較は4施設までです。';return}chosen.push(id);render()});
document.getElementById('compare-clear').addEventListener('click',()=>{chosen=[];render()});
document.getElementById('compare-share').addEventListener('click',async()=>{const url=location.href;try{await navigator.clipboard.writeText(url);feedback.textContent='比較URLをコピーしました。'}catch(e){feedback.textContent='アドレスバーのURLをコピーしてください：'+url}});
Promise.all([
 fetch('../data/stays.json',{cache:'no-store'}).then(r=>{if(!r.ok)throw Error('HTTP '+r.status);return r.json()}),
 fetch('../data/rakuten-matches.json',{cache:'no-store'}).then(r=>r.ok?r.json():null).catch(()=>null)
]).then(([data,rakuten])=>{if(!Array.isArray(data.stays))throw Error('Invalid data');all=data.stays;
 rakutenMatches=new Map((rakuten?.matches||[]).map(m=>[m.stay_id,m]));const ids=incoming?incoming.split(','):readStored();const valid=new Set(all.map(s=>s.id));chosen=[...new Set(ids)].filter(id=>valid.has(id)).slice(0,MAX);render()}).catch(e=>{addSelect.replaceChildren(make('option','読み込みに失敗しました'));addBtn.disabled=true;feedback.textContent='施設データを読み込めませんでした。ページを再読み込みしてください。';console.error(e)});
})();