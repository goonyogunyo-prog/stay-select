(function(root){'use strict';
function calculate(group,cars){
  if(!Number.isInteger(group)||group<=0||group>200)throw Error('旅行全体の人数は1～200人の整数で入力してください。');
  if(!Array.isArray(cars)||cars.length<1||cars.length>4)throw Error('車は1～4台で入力してください。');
  let passengers=0,capacity=0,bagOver=0,seatOver=0,totalCost=0;
  const rows=cars.map((c,i)=>{
    const a=['seats','people','bagCapacity','bags','cost'].map(k=>Number(c[k]));
    if(a.some(x=>!Number.isFinite(x)||x<0)||a.slice(0,4).some(x=>!Number.isInteger(x)))throw Error('台数・人数・荷物個数は0以上の整数、交通費は0以上の数値にしてください。');
    const [seats,people,bagCapacity,bags,cost]=a;
    if(seats<1||seats>50||people>50||bagCapacity>1000||bags>1000||cost>10000000)throw Error('車の定員・荷物個数・交通費が入力範囲外です。');
    passengers+=people;capacity+=seats;totalCost+=cost;
    const seatShort=Math.max(0,people-seats),bagShort=Math.max(0,bags-bagCapacity);
    seatOver+=seatShort;bagOver+=bagShort;
    return {car:i+1,seats,people,seatShort,bagCapacity,bags,bagShort,cost};
  });
  return {rows,group,passengers,unassigned:Math.max(0,group-passengers),overassigned:Math.max(0,passengers-group),seatOver,bagOver,totalCost,perPerson:Math.round(totalCost/group),seatCapacity:capacity,valid:passengers===group&&seatOver===0&&bagOver===0};
}
root.StayGroupCarPlanner={calculate};
if(typeof document==='undefined')return;
const box=document.getElementById('cars');let last=null;
for(let i=1;i<=4;i++){
  const d=document.createElement('div');d.className='car';d.innerHTML='<h2>車'+i+'</h2>'+[
   ['seats','定員',5],['people','乗車人数',i<=2?4:0],['bagCapacity','荷物の積載枠（個）',5],['bags','荷物個数',i<=2?4:0],['cost','ガソリン・高速代など（円）',i<=2?6000:0]
  ].map(([k,label,v])=>'<label>'+label+'<input type="number" min="0" step="'+(k==='cost'?'0.01':'1')+'" data-car="'+i+'" data-key="'+k+'" value="'+v+'"></label>').join('');box.appendChild(d);
}
function gather(){const cars=[];for(let i=1;i<=4;i++){const c={};document.querySelectorAll('[data-car="'+i+'"]').forEach(el=>c[el.dataset.key]=Number(el.value));if(c.people||c.bags||c.cost)cars.push(c)}return cars;}
function render(){const out=document.getElementById('results'),err=document.getElementById('error'),btn=document.getElementById('download');err.textContent='';out.textContent='';btn.disabled=true;last=null;
try{const n=Number(document.getElementById('group').value);last=calculate(n,gather());const x=last;const summary=document.createElement('p');summary.textContent='割当人数 '+x.passengers+'/'+x.group+'人・未割当 '+x.unassigned+'人・重複割当 '+x.overassigned+'人・座席超過 '+x.seatOver+'人・荷物超過 '+x.bagOver+'個・交通費合計 '+x.totalCost.toLocaleString()+'円・1人あたり目安 '+x.perPerson.toLocaleString()+'円。'+(x.valid?' 入力上は配分条件を満たしています。':' 配分の見直しが必要です。');out.appendChild(summary);
const t=document.createElement('table');const heads=['車','定員','乗車','座席超過','荷物枠','荷物','荷物超過','交通費'];const tr=document.createElement('tr');heads.forEach(h=>{const th=document.createElement('th');th.textContent=h;tr.appendChild(th)});t.appendChild(tr);x.rows.forEach(r=>{const tr=document.createElement('tr');[r.car,r.seats,r.people,r.seatShort,r.bagCapacity,r.bags,r.bagShort,r.cost].forEach(v=>{const td=document.createElement('td');td.textContent=String(v);tr.appendChild(td)});t.appendChild(tr)});out.appendChild(t);btn.disabled=false;
}catch(e){err.textContent=e.message;}}
document.getElementById('calculate').addEventListener('click',render);
document.getElementById('download').addEventListener('click',()=>{if(!last)return;const x=last;const lines=[['車','定員','乗車人数','座席超過','荷物枠','荷物数','荷物超過','交通費円'],...x.rows.map(r=>[r.car,r.seats,r.people,r.seatShort,r.bagCapacity,r.bags,r.bagShort,r.cost]),['合計','',x.passengers,x.seatOver,'','',x.bagOver,x.totalCost],['旅行人数',x.group,'未割当',x.unassigned,'重複割当',x.overassigned,'一人目安',x.perPerson]];const text='\ufeff'+lines.map(a=>a.join(',')).join('\r\n');const url=URL.createObjectURL(new Blob([text],{type:'text/csv;charset=utf-8'}));const a=document.createElement('a');a.href=url;a.download='stay-group-car-allocation.csv';a.click();URL.revokeObjectURL(url);});
render();
})(typeof window!=='undefined'?window:globalThis);
