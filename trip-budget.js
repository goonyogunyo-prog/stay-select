(()=>{'use strict';
const form=document.getElementById('trip-budget-form');if(!form)return;
const ids=['people','nights','rooms','room-night','transport','meals','activity','tax','extra','buffer','limit'];
const fields=Object.fromEntries(ids.map(k=>[k,document.getElementById('tb-'+k)]));
const currency=n=>Math.round(n).toLocaleString('ja-JP')+'円';
const num=k=>{const el=fields[k];if(!el||el.value.trim()==='')return 0;const n=Number(el.value);return Number.isFinite(n)?Math.max(0,n):0;};
const roundYen=n=>Math.round(Math.min(1000000000000,Math.max(0,n)));
const show=(id,value)=>{const el=document.getElementById(id);if(el)el.textContent=currency(value)};
function calculate(){const people=Math.min(50,Math.max(1,Math.round(num('people'))||1));const nights=Math.min(30,Math.max(1,Math.round(num('nights'))||1));const rooms=Math.min(20,Math.max(1,Math.round(num('rooms'))||1));
const costs={stay:roundYen(rooms*nights*num('room-night')),transport:roundYen(people*num('transport')),meals:roundYen(people*(nights+1)*num('meals')),activity:roundYen(people*num('activity')),tax:roundYen(people*nights*num('tax')),extra:roundYen(num('extra'))};
const subtotal=Object.values(costs).reduce((a,b)=>a+b,0);costs.buffer=roundYen(subtotal*Math.min(100,num('buffer'))/100);const total=subtotal+costs.buffer;const per=Math.ceil(total/people);
show('tb-total',total);show('tb-per',per);for(const [k,v] of Object.entries(costs))show('tb-out-'+k,v);
const status=document.getElementById('tb-budget-status');const limit=num('limit');status.classList.remove('over');if(fields.limit.value.trim()===''){status.textContent='1人あたりの予算上限を入力すると比較できます。';}else if(per<=limit){status.textContent='予算内の見積もりです。1人あたり '+currency(limit-per)+' の余裕があります。';}else{status.textContent='予算を超えています。1人あたり '+currency(per-limit)+' の見直しが必要です。';status.classList.add('over');}}
form.addEventListener('input',calculate);form.addEventListener('change',calculate);
const KEY='stayselect:trip-budget:v1',status=document.getElementById('tb-save-status');
document.getElementById('tb-save').addEventListener('click',()=>{try{const data=Object.fromEntries(ids.map(k=>[k,fields[k].value]));localStorage.setItem(KEY,JSON.stringify(data));status.textContent='この端末に入力内容を保存しました。';}catch(e){status.textContent='保存できませんでした。ブラウザの設定を確認してください。';}});
document.getElementById('tb-reset').addEventListener('click',()=>{form.reset();for(const k of ids)if(!['people','nights','rooms','buffer'].includes(k))fields[k].value='';try{localStorage.removeItem(KEY)}catch(e){}status.textContent='入力と保存済みデータをリセットしました。';calculate();});
document.getElementById('tb-print').addEventListener('click',()=>window.print());
try{const saved=JSON.parse(localStorage.getItem(KEY)||'null');if(saved&&typeof saved==='object'&&!Array.isArray(saved)){for(const k of ids)if(Object.prototype.hasOwnProperty.call(saved,k)&&typeof saved[k]==='string')fields[k].value=saved[k];status.textContent='この端末に保存した入力内容を復元しました。';}}catch(e){}
calculate();})();
