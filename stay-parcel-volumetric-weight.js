(function(root){
'use strict';
function calculate(divisor,items){
 divisor=Number(divisor);if(!Number.isInteger(divisor)||divisor<4000||divisor>10000)throw Error('換算係数は4000〜10000で入力してください');
 if(!Array.isArray(items)||items.length!==3)throw Error('3種類の荷物条件を入力してください');
 let totalPieces=0,totalActual=0,totalVolume=0,totalComparison=0;
 const rows=items.map((t,i)=>{const count=Number(t.count),length=Number(t.length),width=Number(t.width),height=Number(t.height),weight=Number(t.weight);if(!Number.isInteger(count)||count<0||count>30||![length,width,height].every(x=>Number.isFinite(x)&&x>0&&x<=300)||!Number.isFinite(weight)||weight<0||weight>100)throw Error('荷物'+(i+1)+'の個数・寸法・重量を確認してください');const volume=length*width*height,volumetric=volume/divisor,comparison=Math.max(weight,volumetric);totalPieces+=count;totalActual+=count*weight;totalVolume+=count*volumetric;totalComparison+=count*comparison;return {label:String(t.label||'荷物'+(i+1)).slice(0,40),count,length,width,height,weight,volume,volumetric,comparison};});
 if(totalPieces>70)throw Error('荷物の合計個数は70個以内にしてください');
 return {divisor,rows,totalPieces,totalActual,totalVolume,totalComparison};
}
function csv(result){const q=v=>'"'+String(v??'').replace(/"/g,'""')+'"';const lines=[['荷物名','個数','縦cm','横cm','高さcm','実重量kg/個','容積重量目安kg/個','比較重量目安kg/個']];result.rows.forEach(t=>lines.push([t.label,t.count,t.length,t.width,t.height,t.weight,t.volumetric.toFixed(2),t.comparison.toFixed(2)]));lines.push(['合計',result.totalPieces,'','','',result.totalActual.toFixed(2),result.totalVolume.toFixed(2),result.totalComparison.toFixed(2)]);return '\ufeff'+lines.map(a=>a.map(q).join(',')).join('\r\n')+'\r\n';}
root.stayParcelVolumetric={calculate,csv};
const doc=typeof document!=='undefined'?document:null;if(!doc)return;
const $=id=>doc.getElementById(id);let last=null;
function render(){const status=$('status');try{const divisor=Number($('divisor').value);const items=[1,2,3].map(i=>({label:$('label'+i).value,count:Number($('count'+i).value),length:Number($('length'+i).value),width:Number($('width'+i).value),height:Number($('height'+i).value),weight:Number($('weight'+i).value)}));last=calculate(divisor,items);status.textContent='計算完了';const out=$('results');out.replaceChildren();const h=doc.createElement('h2');h.textContent='比較用の重量目安';out.append(h);const p=doc.createElement('p');p.textContent='荷物'+last.totalPieces+'個 ／ 実重量合計 '+last.totalActual.toFixed(2)+'kg ／ 容積重量合計 '+last.totalVolume.toFixed(2)+'kg ／ 各荷物の大きい方を合計 '+last.totalComparison.toFixed(2)+'kg';out.append(p);const ul=doc.createElement('ul');last.rows.filter(t=>t.count>0).forEach(t=>{const li=doc.createElement('li');li.textContent=t.label+' × '+t.count+'個：実重量'+t.weight.toFixed(2)+'kg/個、容積重量目安'+t.volumetric.toFixed(2)+'kg/個、三辺合計'+(t.length+t.width+t.height).toFixed(1)+'cm';ul.append(li);});out.append(ul);}
catch(e){last=null;status.textContent=e.message;$('results').replaceChildren();}}
$('calc').addEventListener('click',render);
$('csv').addEventListener('click',()=>{if(!last){$('status').textContent='先に計算してください';return;}const b=new Blob([csv(last)],{type:'text/csv;charset=utf-8'}),u=URL.createObjectURL(b),a=doc.createElement('a');a.href=u;a.download='stay-parcel-volumetric-weight.csv';a.click();setTimeout(()=>URL.revokeObjectURL(u),1000);});render();
})(typeof window!=='undefined'?window:globalThis);
