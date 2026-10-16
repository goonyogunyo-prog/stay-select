(()=>{'use strict';
const KEY='stayselect:booking-checklist:v1';const form=document.getElementById('bc-form');if(!form)return;
const boxes=[...form.querySelectorAll('input[data-check-id]')],progress=document.getElementById('bc-progress'),label=document.getElementById('bc-progress-label'),status=document.getElementById('bc-status');
const allowed=new Set(boxes.map(x=>x.dataset.checkId));
let saved=[];try{const data=JSON.parse(localStorage.getItem(KEY)||'[]');if(Array.isArray(data))saved=data.filter(x=>typeof x==='string'&&allowed.has(x));}catch(e){}
boxes.forEach(b=>b.checked=saved.includes(b.dataset.checkId));
function update(){const done=boxes.filter(b=>b.checked);progress.value=done.length;label.textContent=done.length+' / '+boxes.length+'項目を確認';try{localStorage.setItem(KEY,JSON.stringify(done.map(b=>b.dataset.checkId)));}catch(e){status.textContent='この端末では保存できません。チェックは画面を開いている間のみ有効です。';}}
form.addEventListener('change',update);update();
document.getElementById('bc-reset').addEventListener('click',()=>{boxes.forEach(b=>b.checked=false);update();status.textContent='チェックをすべて解除しました。';});
document.getElementById('bc-print').addEventListener('click',()=>window.print());
document.getElementById('bc-copy').addEventListener('click',async()=>{const unchecked=boxes.filter(b=>!b.checked);const lines=['【STAY SELECT｜宿泊予約前に未確認の項目】',...unchecked.map(b=>'□ '+b.nextElementSibling.textContent.trim()),'※宿の設備・サービスの提供状況は未確認・要問い合わせ。料金・空室も予約先で確認してください。'];const output=unchecked.length?lines.join('\n'):'【STAY SELECT】18項目すべて確認済み（チェックは自己申告です）。';try{if(!navigator.clipboard?.writeText)throw Error('clipboard unavailable');await navigator.clipboard.writeText(output);status.textContent='未チェック'+unchecked.length+'項目をコピーしました。';}catch(e){const area=document.createElement('textarea');area.value=output;area.readOnly=true;area.setAttribute('aria-label','コピー用チェックリスト');area.style.cssText='width:100%;min-height:160px;margin-top:12px';status.replaceChildren(document.createTextNode('自動コピーできませんでした。下の文章を選択してコピーしてください。'),area);area.focus();area.select();}});
})();
