"use strict";
(function(){
function compute(o){
 const nums=['electricStart','electricEnd','yenPerKwh','waterStart','waterEnd','yenPerM3','fixedFee','people'];
 for(const k of nums){if(!Number.isFinite(o[k])||o[k]<0)throw Error(k+' は0以上の数値で入力してください');}
 if(!Number.isInteger(o.people)||o.people<1||o.people>1000)throw Error('人数は1〜1000の整数');
 if(o.electricEnd<o.electricStart||o.waterEnd<o.waterStart)throw Error('終了メーターは開始以上');
 const kwh=o.electricEnd-o.electricStart, water=o.waterEnd-o.waterStart;
 const electric=Math.round(kwh*o.yenPerKwh*100)/100;
 const waterCost=Math.round(water*o.yenPerM3*100)/100;
 const total=Math.round((electric+waterCost+o.fixedFee)*100)/100;
 return {kwh,water,electric,waterCost,total,perPerson:Math.round(total/o.people*100)/100,people:o.people};
}
window.STAY_UTILITY_CALC=compute;
const form=document.getElementById('utilityForm');if(!form)return;
const out=document.getElementById('result'),err=document.getElementById('error');let last=null;
function csvEscape(s){const v=String(s);return /[",\r\n]/.test(v)?'"'+v.replace(/"/g,'""')+'"':v;}
function rowCSV(vals){return vals.map(csvEscape).join(',')+'\r\n';}
form.addEventListener('submit',function(e){e.preventDefault();err.textContent='';out.textContent='';last=null;
 try{const o={};for(const el of form.querySelectorAll('input[data-num]'))o[el.name]=Number(el.value);last=compute(o);
 out.textContent='電気 '+last.kwh.toLocaleString()+' kWh／'+last.electric.toLocaleString()+' 円、 水道 '+last.water.toLocaleString()+' m³／'+last.waterCost.toLocaleString()+' 円、 合計 '+last.total.toLocaleString()+' 円、 1人 '+last.perPerson.toLocaleString()+' 円（'+last.people+'人）';
 }catch(ex){err.textContent=ex.message;}});
document.getElementById('csvBtn').addEventListener('click',function(){if(!last){err.textContent='先に計算してください';return;}
 const csv='﻿'+rowCSV(['電気使用kWh','電気費用円','水道使用m3','水道費用円','固定費円','合計円','人数','1人円'])+rowCSV([last.kwh,last.electric,last.water,last.waterCost,Number(form.elements.fixedFee.value),last.total,last.people,last.perPerson]);
 const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([csv],{type:'text/csv;charset=utf-8'}));a.download='stay-utility-split.csv';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000);
});
})();
