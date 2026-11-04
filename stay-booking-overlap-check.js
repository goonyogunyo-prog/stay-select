(function(){'use strict';
function parseDate(s){if(typeof s!=='string'||!/^\d{4}-\d\d-\d\d$/.test(s))return NaN;const n=Date.parse(s+'T00:00:00Z');return Number.isFinite(n)&&new Date(n).toISOString().slice(0,10)===s?n:NaN;}
function analyze(items){const issues=[],valid=[];for(let i=0;i<items.length;i++){
 const x=items[i];if(x.status==='キャンセル済み')continue;const a=parseDate(x.start),b=parseDate(x.end),party=String(x.party||'').trim().toLocaleLowerCase();
 if(!party||!Number.isFinite(a)||!Number.isFinite(b)||b<=a){issues.push({type:'input',indices:[i],message:(i+1)+'行目: 旅行者グループと正しい宿泊日を入力してください。'});continue;}
 valid.push({i,a,b,party,hotel:String(x.hotel||'宿泊候補')});}
 for(let i=0;i<valid.length;i++)for(let j=i+1;j<valid.length;j++){
 const x=valid[i],y=valid[j];if(x.party===y.party&&x.a<y.b&&y.a<x.b){issues.push({type:'overlap',indices:[x.i,y.i],message:(x.i+1)+'行目と'+(y.i+1)+'行目: 同じ旅行者グループの宿泊日が重なっています。'});}}
 return {issues,valid:valid.length,overlaps:issues.filter(x=>x.type==='overlap').length};}
function csvCell(s){let v=String(s??'');if(/^[=+\-@]/.test(v))v="'"+v;return '"'+v.replace(/"/g,'""')+'"';}
function exportCSV(items,result){const rows=[['行','宿泊施設','旅行者グループ','チェックイン日','チェックアウト日','支払状況'],...items.map((x,i)=>[i+1,x.hotel,x.party,x.start,x.end,x.status])];rows.push(['重複警告数',result.overlaps,'','','','']);return '\ufeff'+rows.map(r=>r.map(csvCell).join(',')).join('\r\n')+'\r\n';}
if(typeof window!=='undefined')window.STAYBookingOverlap={analyze,exportCSV};
if(typeof document==='undefined')return;
document.addEventListener('DOMContentLoaded',function(){
 const tbody=document.querySelector('#bookings'),output=document.querySelector('#result');if(!tbody||!output)return;
 const fields=['hotel','party','start','end','status'];
 function addRow(x={}){const tr=document.createElement('tr');for(const key of fields){const td=document.createElement('td');let el;if(key==='status'){el=document.createElement('select');for(const v of ['未決済','支払受付','決済済み','キャンセル申請中','キャンセル済み']){const o=document.createElement('option');o.value=v;o.textContent=v;el.appendChild(o);}el.value=x.status||'未決済';}else{el=document.createElement('input');el.type=key==='start'||key==='end'?'date':'text';el.placeholder=key==='hotel'?'宿名':key==='party'?'例: 旅行A':'';el.value=x[key]||'';}el.dataset.field=key;td.appendChild(el);tr.appendChild(td);}const td=document.createElement('td'),del=document.createElement('button');del.type='button';del.textContent='削除';del.addEventListener('click',()=>tr.remove());td.appendChild(del);tr.appendChild(td);tbody.appendChild(tr);}
 function rows(){return [...tbody.querySelectorAll('tr')].map(tr=>Object.fromEntries(fields.map(k=>[k,tr.querySelector('[data-field="'+k+'"]')?.value||''])));}
 let last=null;
 document.querySelector('#add').addEventListener('click',()=>addRow());
 document.querySelector('#check').addEventListener('click',()=>{last=analyze(rows());output.textContent='有効な予約候補: '+last.valid+'件 / 日程重複: '+last.overlaps+'件\n'+(last.issues.map(x=>'・'+x.message).join('\n')||'入力範囲で重複は見つかりません。');});
 document.querySelector('#csv').addEventListener('click',()=>{const items=rows(),result=analyze(items),b=new Blob([exportCSV(items,result)],{type:'text/csv;charset=utf-8'}),url=URL.createObjectURL(b),a=document.createElement('a');a.href=url;a.download='stay-booking-overlap-review.csv';a.click();URL.revokeObjectURL(url);});
 addRow();addRow();});})();