"use strict";
(function(){
function splitCosts(lodging,transport,extra,people){
 const values=[lodging,transport,extra,people];
 if(values.some(x=>!Number.isSafeInteger(x))||values.slice(0,3).some(x=>x<0)||people<1||people>100)throw Error('0円以上の整数金額と1〜100人を入力してください。');
 const total=lodging+transport+extra;
 if(!Number.isSafeInteger(total))throw Error('合計額が大きすぎます。');
 const base=Math.floor(total/people),rem=total%people;
 return {total,shares:Array.from({length:people},(_,i)=>base+(i<rem?1:0))};
}
function yen(n){return n.toLocaleString('ja-JP')+'円'}
function q(id){return document.getElementById(id)}
let latest=null;
function calculate(){
 try{const fields=['lodging','transport','extra','people'].map(k=>q(k).value);if(fields.some(x=>x.trim()===''))throw Error('すべて入力してください。');
 const vals=fields.map(Number);latest=splitCosts(...vals);q('error').textContent='';q('total').textContent='合計 '+yen(latest.total);q('perperson').textContent='一人あたり '+yen(Math.min(...latest.shares))+'〜'+yen(Math.max(...latest.shares));
 const table=document.createElement('table'),head=document.createElement('tr');for(const name of ['参加者','負担額']){let th=document.createElement('th');th.textContent=name;head.appendChild(th)}table.appendChild(head);
 latest.shares.forEach((amount,i)=>{const tr=document.createElement('tr');for(const value of ['参加者'+(i+1),yen(amount)]){let td=document.createElement('td');td.textContent=value;tr.appendChild(td)}table.appendChild(tr)});
 q('result').replaceChildren(table);return latest;
 }catch(e){latest=null;q('error').textContent=e.message;q('total').textContent='';q('perperson').textContent='';q('result').replaceChildren();return null}
}
function csvText(result){return '\uFEFF参加者,負担額（円）\r\n'.replace('\uFEFF','\uFEFF').replace('\r','\r').replace('\n','\n')+result.shares.map((n,i)=>'参加者'+(i+1)+','+n).join('\r\n')+'\r\n'}
function exportCSV(){const v=calculate();if(!v)return;const blob=new Blob([csvText(v)],{type:'text/csv;charset=utf-8'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='stay-group-split.csv';a.click();URL.revokeObjectURL(url)}
async function copyResult(){const v=calculate();if(!v)return;const t='旅行費用合計：'+yen(v.total)+'\n'+v.shares.map((x,i)=>'参加者'+(i+1)+'：'+yen(x)).join('\n');try{await navigator.clipboard.writeText(t);q('error').textContent='コピーしました'}catch(e){q('error').textContent='コピーできませんでした。CSV保存をご利用ください。'}}
if(typeof document!=='undefined'){document.addEventListener('DOMContentLoaded',()=>{q('calc').addEventListener('click',calculate);q('export').addEventListener('click',exportCSV);q('copy').addEventListener('click',copyResult);calculate()})}
if(typeof module!=='undefined')module.exports={splitCosts,csvText};
})();