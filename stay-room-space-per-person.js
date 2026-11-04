"use strict";(function(){
function calculate(o){
 const rows=[];
 for(const id of ['A','B']){
  const area=o['area'+id],luggage=o['luggage'+id],people=o['people'+id],price=o['price'+id];
  if(![area,luggage,people,price].every(Number.isFinite))throw Error('すべて数値を入力してください');
  if(area<=0||area>10000||luggage<0||luggage>=area||people<1||people>100||!Number.isSafeInteger(people)||price<0||price>100000000||!Number.isSafeInteger(price))throw Error('面積・荷物面積・人数・料金を指定範囲で入力してください');
  const usable=area-luggage;
  rows.push({id,area,luggage,people,price,usable,perPerson:usable/people,pricePerPerson:price/people,pricePerSqm:price/usable});
 }
 return {rows,moreSpace:rows[0].perPerson===rows[1].perPerson?'同じ':(rows[0].perPerson>rows[1].perPerson?'A':'B')};
}
window.STAY_ROOM_SPACE_CALC=calculate;
const form=document.getElementById('spaceForm');if(!form)return;
const result=document.getElementById('result'),error=document.getElementById('error'),btn=document.getElementById('downloadCsv');let last=null;
const fmt=(n)=>Number(n.toFixed(2)).toLocaleString('ja-JP');
form.addEventListener('submit',e=>{e.preventDefault();error.textContent='';result.textContent='';btn.disabled=true;last=null;try{const o={};for(const el of form.querySelectorAll('input'))o[el.name]=Number(el.value);last=calculate(o);result.textContent=last.rows.map(r=>'候補'+r.id+'：実質利用面積 '+fmt(r.usable)+'㎡／一人あたり '+fmt(r.perPerson)+'㎡／一人あたり料金 '+fmt(r.pricePerPerson)+'円／1㎡あたり '+fmt(r.pricePerSqm)+'円').join('\n')+'\n一人あたりの広さが大きい候補：'+last.moreSpace;btn.disabled=false;}catch(e){error.textContent=e.message;}});
btn.addEventListener('click',()=>{if(!last)return;const lines=['候補,床面積㎡,荷物面積㎡,人数,宿泊料金円,実質利用面積㎡,一人あたり面積㎡,一人あたり料金円,1㎡あたり料金円',...last.rows.map(r=>[r.id,r.area,r.luggage,r.people,r.price,r.usable,r.perPerson.toFixed(2),r.pricePerPerson.toFixed(2),r.pricePerSqm.toFixed(2)].join(','))];const blob=new Blob(['\ufeff'+lines.join('\r\n')+'\r\n'],{type:'text/csv;charset=utf-8'});const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='stay-room-space-compare.csv';a.click();setTimeout(()=>URL.revokeObjectURL(url),500);});
})();