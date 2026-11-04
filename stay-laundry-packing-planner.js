(function(root){'use strict';
function calculate(o){
 const d=Number(o.days),p=Number(o.perDay),s=Number(o.spares),i=Number(o.interval),dry=Number(o.dry),c=Number(o.cost);
 const ok=(n,min,max)=>Number.isInteger(n)&&n>=min&&n<=max;
 if(!ok(d,1,90)||!ok(p,1,5)||!ok(s,0,20)||!ok(i,1,90)||!ok(dry,0,7)||!ok(c,0,10000))throw Error('入力値を確認してください（日数1〜90、乾燥0〜7日、費用0〜10000円）。');
 const noLaundry=d*p+s;
 const laundry=Math.min(d,i+dry)*p+s;
 const cycles=Math.floor((d-1)/i);
 const washCost=cycles*c;
 return {days:d,perDay:p,spares:s,interval:i,dry,cost:c,noLaundry,withLaundry:laundry,setsSaved:Math.max(0,noLaundry-laundry),cycles,washCost};
}
function csv(r){const quote=v=>'"'+String(v).replace(/"/g,'""')+'"';const rows=[['項目','プランA（洗濯なし）','プランB（洗濯あり）'],['旅行日数',r.days,r.days],['必要衣類セット数',r.noLaundry,r.withLaundry],['洗濯回数',0,r.cycles],['洗濯費用円',0,r.washCost],['削減できる衣類セット数',0,r.setsSaved],['乾燥待ち日数','',r.dry]];return '\ufeff'+rows.map(a=>a.map(quote).join(',')).join('\r\n')+'\r\n';}
root.stayLaundryPacking={calculate,csv};
const doc=typeof document!=='undefined'?document:null;if(!doc)return;const $=id=>doc.getElementById(id);let last=null;
function render(){try{const vals={days:$('days').value,perDay:$('perDay').value,spares:$('spares').value,interval:$('interval').value,dry:$('dry').value,cost:$('cost').value};if(Object.values(vals).some(v=>v.trim()===''))throw Error('すべての入力欄を埋めてください。');last=calculate(vals);$('status').textContent='計算完了';$('results').replaceChildren();const h=doc.createElement('h2');h.textContent='衣類と洗濯費の比較';$('results').append(h);for(const [k,v] of [['洗濯なし',last.noLaundry+'セット'],['洗濯あり',last.withLaundry+'セット'],['削減できる衣類',last.setsSaved+'セット'],['洗濯回数',last.cycles+'回'],['洗濯費用の目安',last.washCost.toLocaleString('ja-JP')+'円']]){const p=doc.createElement('p');p.textContent=k+'：'+v;$('results').append(p);}}catch(e){last=null;$('status').textContent=e.message;$('results').replaceChildren();}}
$('calc').addEventListener('click',render);$('csv').addEventListener('click',()=>{if(!last)render();if(!last)return;const url=URL.createObjectURL(new Blob([csv(last)],{type:'text/csv;charset=utf-8'}));const a=doc.createElement('a');a.href=url;a.download='stay-laundry-packing-plan.csv';doc.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);});render();
})(typeof globalThis!=='undefined'?globalThis:this);