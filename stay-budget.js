(()=>{'use strict';
const KEY='stayselect:trip-budget:v1', MAX=100000000;
const $=id=>document.getElementById(id), cards=$('sb-cards'),empty=$('sb-empty'),summary=$('sb-summary'),reset=$('sb-reset');
if(!cards||!empty||!summary||!reset)return;
const FIELDS=[['room','宿泊代（税込・全員分）'],['meals','食事代（全員分）'],['transport','交通費（全員分）'],['other','演出・その他']];
let chosen=[],values={};
try{const stored=JSON.parse(localStorage.getItem(KEY)||'{}');if(stored&&typeof stored==='object'&&!Array.isArray(stored))values=stored;}catch(e){}
const yen=n=>new Intl.NumberFormat('ja-JP',{style:'currency',currency:'JPY',maximumFractionDigits:0}).format(n);
function save(){try{localStorage.setItem(KEY,JSON.stringify(values));}catch(e){}}
function readValue(v){if(v===''||v===null||v===undefined)return null;const n=Number(v);return Number.isSafeInteger(n)&&n>=0&&n<=MAX?n:null;}
function calculate(){const completed=[];for(const item of chosen){const card=cards.querySelector('[data-budget-id="'+item.id+'"]');if(!card)continue;const total=FIELDS.reduce((acc,[key])=>{const el=card.querySelector('[data-budget-field="'+key+'"]');const v=readValue(el.value);return acc===null||v===null?null:acc+v;},0);const totalNode=card.querySelector('.sb-total');if(total===null){totalNode.textContent='4項目を入力すると総額を表示します（不要なら0円）';totalNode.classList.add('incomplete');}else{totalNode.textContent='入力した旅行総額：'+yen(total);totalNode.classList.remove('incomplete');completed.push({name:item.name,total});}}
if(chosen.length===0){summary.textContent='';return;}
if(completed.length!==chosen.length){summary.textContent=completed.length+' / '+chosen.length+'施設の総額を計算済み。全施設の4項目を入力すると最安候補を表示します。';return;}
const sorted=completed.sort((a,b)=>a.total-b.total),diff=sorted[sorted.length-1].total-sorted[0].total;
summary.textContent='入力した条件では「'+sorted[0].name+'」が最も低い総額（'+yen(sorted[0].total)+'）。比較対象の最大差額は'+yen(diff)+'です。金額は手入力による試算で、実際の販売価格ではありません。';}
function make(tag,text,klass){const el=document.createElement(tag);if(text!==undefined)el.textContent=text;if(klass)el.className=klass;return el;}
function render(items){chosen=items.slice(0,4).filter(x=>/^stay-\d{3}$/.test(x.id));cards.replaceChildren();empty.hidden=chosen.length>0;reset.disabled=chosen.length===0;
for(const item of chosen){const card=make('article',undefined,'sb-card');card.dataset.budgetId=item.id;const title=make('h3',item.name);const meta=make('p',item.pref+'｜料金は未確認・要問い合わせ','sb-meta');card.append(title,meta);
const grid=make('div',undefined,'sb-fields');for(const [key,label] of FIELDS){const wrap=make('div',undefined,'sb-field'),lab=make('label',label);const input=document.createElement('input');input.type='number';input.min='0';input.max=String(MAX);input.step='1';input.inputMode='numeric';input.placeholder='未入力';input.dataset.budgetField=key;input.id='sb-'+item.id+'-'+key;lab.htmlFor=input.id;const saved=readValue(values[item.id]?.[key]);if(saved!==null)input.value=String(saved);input.addEventListener('input',()=>{const v=readValue(input.value);if(!values[item.id]||typeof values[item.id]!=='object')values[item.id]={};if(v===null)delete values[item.id][key];else values[item.id][key]=v;save();calculate();});wrap.append(lab,input);grid.appendChild(wrap)}
card.appendChild(grid);card.appendChild(make('p','4項目を入力すると総額を表示します（不要なら0円）','sb-total incomplete'));cards.appendChild(card)}calculate();}
window.addEventListener('stayselect:compare-updated',e=>{const items=e.detail?.items;if(Array.isArray(items))render(items);});
reset.addEventListener('click',()=>{for(const item of chosen)delete values[item.id];save();render(chosen);});
// Comparison JS emits the definitive selected-item list after loading stays.json.
})();
