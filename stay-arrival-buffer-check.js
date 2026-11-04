"use strict";
const $=id=>document.getElementById(id);
const minutes=s=>{if(!/^([01]\d|2[0-3]):[0-5]\d$/.test(s))return NaN;let [h,m]=s.split(':').map(Number);return h*60+m;};
const quote=s=>'"'+String(s).replace(/^[=+@\-\t\r]/,"'" ).replace(/"/g,'""')+'"';
let result=null;
$('calc').addEventListener('click',()=>{
 let a=minutes($('arrival').value),c=minutes($('cutoff').value),d=Number($('delay').value),m=Number($('margin').value);
 if(!Number.isFinite(a)||!Number.isFinite(c)||![d,m].every(x=>Number.isInteger(x)&&x>=0&&x<=1440)){$('result').textContent='入力を確認してください。';result=null;return;}
 let remaining=c-a-d, buffer=remaining-m;
 let verdict=remaining<0?'遅延を考慮すると受付終了後です':buffer<0?'受付終了前ですが希望余裕を下回ります':'希望余裕を確保できる見込みです';
 result=[$('day').value,$('arrival').value,$('cutoff').value,d,m,remaining,buffer,verdict];
 $('result').textContent=`受付終了までの余裕：${remaining}分\n希望余裕との差：${buffer}分\n${verdict}`;
});
$('csv').addEventListener('click',()=>{if(!result){$('result').textContent='先に計算してください。';return;}const header=['宿泊日','予定到着','受付終了','遅延見込み分','希望余裕分','残り余裕分','希望余裕との差分','判定'];const content='\uFEFF'+[header,result].map(row=>row.map(quote).join(',')).join('\r\n');let u=URL.createObjectURL(new Blob([content],{type:'text/csv;charset=utf-8'}));let a=document.createElement('a');a.href=u;a.download='stay-arrival-buffer.csv';a.click();URL.revokeObjectURL(u);});