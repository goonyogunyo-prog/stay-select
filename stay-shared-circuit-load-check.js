(function(root){'use strict';
function calculate(voltage,amps,appliances){
 voltage=Number(voltage);amps=Number(amps);
 if(!Number.isFinite(voltage)||!Number.isFinite(amps)||voltage<1||voltage>400||amps<1||amps>200)throw Error('電圧は1～400V、定格電流は1～200Aの範囲で入力してください。');
 if(!Array.isArray(appliances)||appliances.length<1||appliances.length>8)throw Error('家電は1～8個で入力してください。');
 let total=0;const rows=appliances.map((a,i)=>{const w=Number(a.watts);if(!Number.isFinite(w)||w<0||w>20000)throw Error('家電の消費電力は0～20000Wの範囲で入力してください。');total+=w;return {name:String(a.name||('家電'+(i+1))),watts:w};});
 const capacity=voltage*amps,margin=capacity-total,ratio=total/capacity*100;
 return {voltage,amps,capacity,total,margin,ratio,over:total>capacity,rows};
}
function csvCell(v){let s=String(v);if(/^[=+@\-\t\r]/.test(s))s="'"+s;return '"'+s.replace(/"/g,'""')+'"';}
function csv(result){const lines=[['項目','値'],['電圧V',result.voltage],['仮定回路A',result.amps],['仮定容量W',result.capacity],['同時使用合計W',result.total],['差分W',result.margin],['容量に対する割合%',result.ratio.toFixed(1)],['定格超過',result.over?'はい':'いいえ'],...result.rows.map(r=>[r.name,r.watts])];return '\ufeff'+lines.map(r=>r.map(csvCell).join(',')).join('\r\n')+'\r\n';}
if(typeof module!=='undefined'&&module.exports)module.exports={calculate,csv};
if(typeof document==='undefined')return;
const defs=[['電気ケトル',1200],['電子レンジ',1000],['ドライヤー',1200],['照明など',100]];
const host=document.getElementById('appliances');defs.forEach((d,i)=>{const lab=document.createElement('label');lab.textContent=d[0]+'（W）';const input=document.createElement('input');input.type='number';input.min='0';input.max='20000';input.step='1';input.value=d[1];input.id='watts'+i;lab.appendChild(input);host.appendChild(lab);});
let last=null;document.getElementById('calculate').addEventListener('click',()=>{const error=document.getElementById('error'),res=document.getElementById('results'),btn=document.getElementById('download');error.textContent='';res.textContent='';btn.disabled=true;last=null;try{const r=calculate(document.getElementById('voltage').value,document.getElementById('amps').value,defs.map((d,i)=>({name:d[0],watts:document.getElementById('watts'+i).value})));last=r;const p=document.createElement('p');p.className='result';p.textContent='合計 '+r.total.toLocaleString()+' W / 仮定容量 '+r.capacity.toLocaleString()+' W（'+r.ratio.toFixed(1)+'%）。差分 '+r.margin.toLocaleString()+' W。'+(r.over?'定格を超える試算です。':'定格以下の試算ですが、安全性は保証しません。');res.appendChild(p);btn.disabled=false;}catch(e){error.textContent=e.message;}});
document.getElementById('download').addEventListener('click',()=>{if(!last)return;const url=URL.createObjectURL(new Blob([csv(last)],{type:'text/csv;charset=utf-8'}));const a=document.createElement('a');a.href=url;a.download='stay-circuit-load-estimate.csv';document.body.appendChild(a);a.click();a.remove();URL.revokeObjectURL(url);});
})(typeof globalThis!=='undefined'?globalThis:this);
