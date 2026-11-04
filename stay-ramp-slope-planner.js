"use strict";(function(){
function calculate(o){
 const ratio=o.ratio;if(!Number.isFinite(ratio)||ratio<1||ratio>100)throw Error('想定勾配は1〜100の数値で入力してください');
 const rows=[];
 for(const id of ['A','B']){
  const rise=o['rise'+id],run=o['run'+id];
  if(!Number.isFinite(rise)||!Number.isFinite(run)||rise<=0||rise>300||run<1||run>10000)throw Error('高さは0.1〜300cm、距離は1〜10000cmで入力してください');
  const required=rise*ratio;const actualRatio=run/rise;const angle=Math.atan(rise/run)*180/Math.PI;
  rows.push({id,rise,run,required,actualRatio,angle,remaining:run-required,fits:run>=required});
 }
 return {ratio,rows};
}
window.STAY_RAMP_SLOPE_CALC=calculate;
const form=document.getElementById('rampForm');if(!form)return;
const out=document.getElementById('result'),err=document.getElementById('error'),download=document.getElementById('downloadCsv');let last=null;
const fmt=x=>Number(x.toFixed(2)).toLocaleString('ja-JP');
form.addEventListener('submit',e=>{e.preventDefault();err.textContent='';out.textContent='';download.disabled=true;last=null;try{
 const o={};for(const el of form.querySelectorAll('input'))o[el.name]=Number(el.value);
 last=calculate(o);out.textContent=last.rows.map(r=>'候補'+r.id+'：必要水平距離 '+fmt(r.required)+'cm／設置可能距離 '+fmt(r.run)+'cm／差 '+fmt(r.remaining)+'cm／実際の勾配 1:'+fmt(r.actualRatio)+'（'+fmt(r.angle)+'°）／仮定上 '+(r.fits?'距離を確保':'距離不足')).join('\n');download.disabled=false;
 }catch(e){err.textContent=e.message;}});
download.addEventListener('click',()=>{if(!last)return;const esc=v=>'"'+String(v).replace(/"/g,'""')+'"';const rows=[['候補','段差cm','設置可能距離cm','仮定勾配1対','必要距離cm','差cm','実際勾配1対','角度度','仮定上距離充足'],...last.rows.map(r=>[r.id,r.rise,r.run,last.ratio,r.required,r.remaining,r.actualRatio,r.angle,r.fits?'はい':'いいえ'])];const csv='\ufeff'+rows.map(r=>r.map(esc).join(',')).join('\r\n');const url=URL.createObjectURL(new Blob([csv],{type:'text/csv;charset=utf-8'}));const a=document.createElement('a');a.href=url;a.download='stay-ramp-slope-plan.csv';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);});
})();