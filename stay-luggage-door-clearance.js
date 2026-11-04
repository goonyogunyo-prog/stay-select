"use strict";(function(){
function calculate(o){
 const margin=o.margin;
 if(!Number.isFinite(margin)||margin<0||margin>100)throw Error('余裕は0〜100cmで入力してください');
 const rows=[];
 for(const id of ['A','B']){
  const door=o['door'+id],width=o['width'+id],depth=o['depth'+id];
  if(![door,width,depth].every(Number.isFinite)||door<1||door>500||width<1||width>300||depth<1||depth>300)throw Error('開口幅は1〜500cm、荷物寸法は1〜300cmで入力してください');
  const straight=door-width-margin,sideways=door-depth-margin;
  rows.push({id,door,width,depth,margin,straight,sideways,best:Math.max(straight,sideways),orientation:straight>=sideways?'幅を正面':'厚さを正面',fits:Math.max(straight,sideways)>=0});
 }
 return {margin,rows};
}
if(typeof window!=='undefined')window.STAY_LUGGAGE_DOOR_CLEARANCE_CALC=calculate;
const form=typeof document!=='undefined'&&document.getElementById('clearanceForm');if(!form)return;
const out=document.getElementById('result'),err=document.getElementById('error'),download=document.getElementById('downloadCsv');let last=null;
const fmt=x=>Number(x.toFixed(1)).toLocaleString('ja-JP');
form.addEventListener('submit',e=>{e.preventDefault();err.textContent='';out.textContent='';download.disabled=true;last=null;try{
 const o={};for(const el of form.querySelectorAll('input')){if(el.value.trim()==='')throw Error('空欄があります');o[el.name]=Number(el.value)}
 last=calculate(o);out.textContent=last.rows.map(r=>'候補'+r.id+'：正面向きの余裕 '+fmt(r.straight)+'cm／横向きの余裕 '+fmt(r.sideways)+'cm／広い方向 '+r.orientation+'／'+(r.fits?'仮定上は幅に余裕あり':'幅が不足')).join('\n');download.disabled=false;
 }catch(e){err.textContent=e.message}});
download.addEventListener('click',()=>{if(!last)return;const esc=v=>'"'+String(v).replace(/"/g,'""')+'"';const rows=[['候補','有効開口幅cm','荷物幅cm','荷物厚さcm','必要余裕cm','正面向き余裕cm','横向き余裕cm','比較上の結果']];for(const r of last.rows)rows.push([r.id,r.door,r.width,r.depth,r.margin,r.straight,r.sideways,r.fits?'仮定上余裕あり':'幅不足']);const csv='\uFEFF'+rows.map(a=>a.map(esc).join(',')).join('\r\n')+'\r\n';const blob=new Blob([csv],{type:'text/csv;charset=utf-8'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='stay-luggage-door-clearance.csv';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000)});
})();