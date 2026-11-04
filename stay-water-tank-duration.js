(function(){
'use strict';
function calculate(tank,people,liters,reserve){
  const a=[tank,people,liters,reserve].map(Number);
  if(a.some(x=>!Number.isFinite(x))) throw new Error('すべて有限の数値を入力してください。');
  if(a[0]<=0||!Number.isInteger(a[1])||a[1]<=0||a[2]<=0||a[3]<0||a[3]>=a[0]) throw new Error('容量・人数・使用量は正、予備量は0以上かつ容量未満にしてください。');
  const usable=a[0]-a[3],daily=a[1]*a[2],days=usable/daily;
  return {tank:a[0],people:a[1],litersPerPersonDay:a[2],reserve:a[3],usable,daily,days};
}
function toCSV(x){
  const headers=['タンク容量L','人数','一人一日使用量L','予備量L','利用可能量L','全員一日使用量L','試算日数'];
  const vals=[x.tank,x.people,x.litersPerPersonDay,x.reserve,x.usable,x.daily,x.days.toFixed(2)];
  return '\ufeff'+headers.join(',')+'\r\n'+vals.join(',')+'\r\n';
}
if(typeof window!=='undefined')window.StayWaterTankDuration={calculate,toCSV};
if(typeof document==='undefined')return;
document.addEventListener('DOMContentLoaded',()=>{
 const $=id=>document.getElementById(id);let last=null;
 $('calculate').addEventListener('click',()=>{
   try{const x=calculate($('tank').value,$('people').value,$('liters').value,$('reserve').value);last=x;
    $('errors').textContent='';$('result').textContent='使用可能 '+x.usable.toFixed(1)+' L ／ 1日 '+x.daily.toFixed(1)+' L ／ 約 '+x.days.toFixed(2)+' 日';$('download').disabled=false;
   }catch(e){last=null;$('errors').textContent=e.message;$('result').textContent='';$('download').disabled=true;}
 });
 $('download').addEventListener('click',()=>{if(!last)return;const blob=new Blob([toCSV(last)],{type:'text/csv;charset=utf-8'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='stay-water-tank-duration.csv';a.click();URL.revokeObjectURL(url);});
});
})();
