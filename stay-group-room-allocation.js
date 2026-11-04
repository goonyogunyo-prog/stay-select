"use strict";(function(){
function calculate(o){
 const keys=['party','capA','useA','costA','capB','useB','costB','capC','useC','costC'];
 for(const k of keys){if(!Number.isSafeInteger(o[k])||o[k]<0)throw Error(k+' は0以上の整数で入力してください');}
 if(o.party<1||o.party>200)throw Error('旅行者数は1〜200人で入力してください');
 const rooms=['A','B','C'].map(id=>({id,capacity:o['cap'+id],people:o['use'+id],cost:o['cost'+id]}));
 for(const r of rooms){if(r.capacity>100||r.people>100||r.cost>100000000)throw Error('部屋の値が範囲外です');if(r.people>0&&r.capacity===0)throw Error('使用する部屋の定員は1以上にしてください');if(r.people===0&&r.cost>0)throw Error('未使用の部屋は料金を0にしてください');}
 const assigned=rooms.reduce((s,r)=>s+r.people,0),cost=rooms.reduce((s,r)=>s+r.cost,0),over=rooms.filter(r=>r.people>r.capacity);
 const gap=o.party-assigned,spare=rooms.reduce((s,r)=>s+Math.max(0,r.capacity-r.people),0);
 return {rooms,party:o.party,assigned,gap,spare,cost,perPerson:Math.round(cost/o.party*100)/100,overCapacity:over.map(r=>r.id),valid:gap===0&&over.length===0};
}
window.STAY_ROOM_ALLOCATION_CALC=calculate;
const form=document.getElementById('roomForm');if(!form)return;
const out=document.getElementById('result'),err=document.getElementById('error'),btn=document.getElementById('saveCsv');let last=null;
function esc(v){const s=String(v);return /[",\r\n]/.test(s)?'"'+s.replace(/"/g,'""')+'"':s;}
form.addEventListener('submit',function(e){e.preventDefault();err.textContent='';out.textContent='';last=null;btn.disabled=true;try{const o={};for(const el of form.querySelectorAll('input'))o[el.name]=Number(el.value);last=calculate(o);const x=last;out.textContent=(x.valid?'定員内で人数一致':'要調整')+'｜割当 '+x.assigned+'/'+x.party+'人｜未割当 '+Math.max(0,x.gap)+'人｜割当超過 '+Math.max(0,-x.gap)+'人｜定員超過部屋 '+(x.overCapacity.join('、')||'なし')+'｜空き定員 '+x.spare+'人｜合計 '+x.cost.toLocaleString()+'円｜一人あたり '+x.perPerson.toLocaleString()+'円';btn.disabled=false;}catch(ex){err.textContent=ex.message;}});
btn.addEventListener('click',function(){if(!last)return;const x=last;const rows=[['部屋','定員','割当人数','料金（円）'],...x.rooms.map(r=>[r.id,r.capacity,r.people,r.cost]),['全体',x.party,x.assigned,x.cost],['一人あたり','','',x.perPerson],['判定','','',x.valid?'OK':'要調整']];const csv='\uFEFF'+rows.map(row=>row.map(esc).join(',')).join('\r\n')+'\r\n';const u=URL.createObjectURL(new Blob([csv],{type:'text/csv;charset=utf-8'}));const a=document.createElement('a');a.href=u;a.download='stay-room-allocation.csv';a.click();setTimeout(()=>URL.revokeObjectURL(u),1000);});
})();