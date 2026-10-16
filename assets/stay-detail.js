(()=>{'use strict';
const $=id=>document.getElementById(id), id=new URLSearchParams(location.search).get('id')||'';
const fields=[['貸切風呂','private_bath'],['飲み放題・プランに含まれる飲料','drinks'],['選べる浴衣','yukata'],['ケーキ手配','cake'],['客室装飾・持ち込み','decoration'],['最寄り駅・アクセス','station'],['スーパー・買い出し','supermarket']];
const compareKey='stayselect:compare:v1';
function node(tag,text){const n=document.createElement(tag);n.textContent=String(text??'');return n}
function safeLink(u){try{const x=new URL(u);return x.protocol==='https:'?x.href:null}catch(e){return null}}
function validMatch(s,m){if(!m||m.stay_id!==s.id||m.name!==s.name||!/^[0-9]+$/.test(String(m.rakuten_hotel_id||'')))return null;try{const u=new URL(m.rakuten_url),segments=u.pathname.split('/').filter(Boolean);if(u.protocol!=='https:'||u.hostname!=='travel.rakuten.co.jp'||!segments.includes(String(m.rakuten_hotel_id)))return null;let affiliate=null;if(m.affiliate_url){const a=new URL(m.affiliate_url),p=a.searchParams.get('pc'),d=p?new URL(p):null;if(a.protocol==='https:'&&a.hostname==='hb.afl.rakuten.co.jp'&&d&&d.protocol==='https:'&&d.hostname==='travel.rakuten.co.jp'&&d.pathname.split('/').filter(Boolean).includes(String(m.rakuten_hotel_id)))affiliate=a.href}return{url:affiliate||u.href,affiliate:!!affiliate}}catch(e){return null}}
function action(label,url,klass,rel){const a=node('a',label);a.className='sd-button '+klass;a.href=url;a.target='_blank';a.rel=rel||'noopener noreferrer';return a}
function addRow(parent,label,value){const wrap=node('div','');wrap.className='sd-row';const dt=node('dt',label),dd=node('dd',value||'未確認・要問い合わせ');if(!value||value==='未確認'){dd.textContent='未確認・要問い合わせ';dd.className='unknown'}wrap.append(dt,dd);parent.appendChild(wrap)}
function getCompare(){try{const a=JSON.parse(localStorage.getItem(compareKey)||'[]');return Array.isArray(a)?[...new Set(a.filter(x=>typeof x==='string'))].slice(0,4):[]}catch(e){return[]}}
function showError(message){$('sd-loading').hidden=true;$('sd-error').hidden=false;$('sd-error').textContent=message}
if(!/^stay-\d{3}$/.test(id)){showError('施設が指定されていません。全国の宿一覧から施設を選んでください。');return}
Promise.all([fetch('../data/stays.json',{cache:'no-store'}).then(r=>{if(!r.ok)throw Error('stays '+r.status);return r.json()}),fetch('../data/rakuten-matches.json',{cache:'no-store'}).then(r=>r.ok?r.json():null).catch(()=>null)]).then(([data,rakuten])=>{
 const stays=data.stays||[],s=stays.find(x=>x.id===id);if(!s){showError('指定した施設が見つかりません。全国の宿一覧から探し直してください。');return}
 $('sd-loading').hidden=true;$('sd-content').hidden=false;
 $('sd-title').textContent=s.name;$('sd-pref').textContent=s.pref;$('sd-kind').textContent=s.kind;
 $('sd-summary').textContent=s.detail||'施設名・所在地を確認した宿泊候補です。サービス詳細は未確認・要問い合わせ。';
 $('sd-verify').textContent=s.verification||'施設名・所在地の確認情報のみ';$('sd-date').textContent='情報確認日：'+(s.verified_at||'未記録');
 document.title=s.name+'｜公式情報・予約前の確認事項｜STAY SELECT';
 const basics=$('sd-basics');addRow(basics,'都道府県',s.pref);addRow(basics,'エリア',s.region);addRow(basics,'宿泊タイプ',s.kind);addRow(basics,'確認した内容',s.verification);addRow(basics,'出典の種類',s.source_kind);addRow(basics,'情報確認日',s.verified_at);
 const cond=$('sd-conditions');fields.forEach(([label,key])=>addRow(cond,label,s[key]));
 const links=$('sd-booking-links'),source=safeLink(s.source);if(source)links.appendChild(action('公式情報・出典を確認 ↗',source,'outline'));
 const match=(rakuten?.matches||[]).find(m=>m.stay_id===s.id),v=validMatch(s,match);
 if(v){links.appendChild(action(v.affiliate?'PR｜楽天トラベルで宿泊プランを見る ↗':'楽天トラベル掲載ページを見る（通常リンク） ↗',v.url,v.affiliate?'rakuten':'normal',v.affiliate?'nofollow sponsored noopener noreferrer':'noopener noreferrer'));$('sd-booking-note').textContent=v.affiliate?'PR：楽天アフィリエイトの広告リンクです。空室・料金・特典は予約ページでご確認ください。':'楽天トラベルで同一施設の掲載を照合済みです。こちらはアフィリエイト成果計測のない通常リンクです。'}
 else $('sd-booking-note').textContent='楽天トラベルの同一施設ページは未照合です。掲載がないという意味ではありません。';
 const cmp=$('sd-compare'),go=$('sd-compare-go'),status=$('sd-compare-status');
 function updateCmp(){const chosen=getCompare(),on=chosen.includes(s.id);cmp.textContent=on?'✓ 比較候補から外す':chosen.length>=4?'4施設選択済み':'＋ 比較候補に追加';cmp.disabled=!on&&chosen.length>=4;status.textContent='現在 '+chosen.length+'/4施設を比較候補に登録';go.href='../compare/?ids='+encodeURIComponent(chosen.join(','))}
 cmp.addEventListener('click',()=>{let a=getCompare();a=a.includes(s.id)?a.filter(x=>x!==s.id):[...a,s.id].slice(0,4);try{localStorage.setItem(compareKey,JSON.stringify(a))}catch(e){}updateCmp()});updateCmp();
 const questions=['希望日の空室と、税・サービス料を含む総額','キャンセル料の発生日と支払い条件','アクセス方法・チェックインの時間','希望する客室タイプ・ベッドの条件'];
 if(/温泉|旅館/.test(s.kind))questions.push('貸切風呂の有無・予約方法・料金');
 if(/コテージ|グランピング|一棟/.test(s.kind))questions.push('買い出し先・調理設備・送迎・BBQの利用条件');
 questions.push('記念日ケーキ・客室装飾の対応可否（必要な場合）');
 const checklist=$('sd-checklist');questions.forEach((t,i)=>{const l=node('label',''),input=document.createElement('input');input.type='checkbox';input.setAttribute('aria-label',t);l.append(input,node('span',t));checklist.appendChild(l)});
 $('sd-print').addEventListener('click',()=>window.print());
 // 問い合わせ文はブラウザ内でのみ生成し、サーバーへ送信しない。
 const form=$('sd-contact-form'),out=$('sd-contact-text'),result=$('sd-contact-result');
 form.addEventListener('submit',e=>{
  e.preventDefault();
  if(!form.reportValidity())return;
  const checked=[...checklist.querySelectorAll('input:checked')].map(x=>x.getAttribute('aria-label')).filter(Boolean);
  const defaultQuestions=['希望日の空室と、税・サービス料を含む総額','キャンセル料の発生日と支払い条件','アクセス方法・チェックインの時間'];
  const asked=checked.length?checked:defaultQuestions;
  const checkin=$('sd-checkin').value;
  const nights=Number($('sd-nights').value),guests=Number($('sd-guests').value);
  if(!Number.isInteger(nights)||nights<1||nights>30||!Number.isInteger(guests)||guests<1||guests>20)return;
  const purpose=$('sd-purpose').value,extra=$('sd-request').value.trim();
  const lines=[s.name+' ご担当者様','', '宿泊を検討しており、下記について確認したくご連絡しました。','',
   '【宿泊希望】','宿泊日：'+(checkin||'未定'),'泊数：'+nights+'泊','人数：'+guests+'名'];
  if(purpose)lines.push('旅行の目的：'+purpose);
  lines.push('','【確認したいこと】',...asked.map((q,i)=>(i+1)+'. '+q));
  if(extra)lines.push('','【その他の希望】',extra);
  lines.push('','可能な範囲でご案内いただけますと幸いです。','よろしくお願いいたします。');
  out.value=lines.join('\n');result.hidden=false;$('sd-copy-status').textContent='文章を作成しました。内容を確認・編集してからコピーしてください。';
 });
 async function copyText(t,el){
  try{if(navigator.clipboard&&window.isSecureContext){await navigator.clipboard.writeText(t);el.textContent='コピーしました。';return}}
  catch(e){}
  // clipboard APIを使えないブラウザでは選択状態を残して手動コピーを案内する。
  if(el===$('sd-copy-status')){out.focus();out.select();}
  el.textContent='自動コピーできませんでした。'+(el===$('sd-copy-status')?'選択された文章を手動でコピーしてください。':'アドレスバーのURLをコピーしてください。');
 }
 $('sd-copy-contact').addEventListener('click',()=>copyText(out.value,$('sd-copy-status')));
 $('sd-share').addEventListener('click',()=>copyText(location.href,$('sd-share-status')));

 const related=stays.filter(x=>x.id!==s.id).map(x=>({s:x,score:(x.pref===s.pref?5:0)+(x.kind===s.kind?3:0)+(x.region===s.region?1:0)})).sort((a,b)=>b.score-a.score).slice(0,3);
 const container=$('sd-related');related.forEach(({s:x})=>{const a=document.createElement('a');a.className='sd-related-card';a.href='?id='+encodeURIComponent(x.id);a.append(node('small',x.pref+' / '+x.kind),node('strong',x.name),node('span','施設情報を見る →'));container.appendChild(a)});
}).catch(e=>{console.error(e);showError('施設データを読み込めませんでした。通信環境を確認して再読み込みしてください。')});
})();
