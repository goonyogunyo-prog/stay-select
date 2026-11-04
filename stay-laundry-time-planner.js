"use strict";
(function(root){
 function calculate(x){const fields=['wash','dry','wait'];for(const f of fields){if(!Number.isFinite(x[f])||x[f]<0||x[f]>1440)throw Error('時間は0〜1440分で入力してください');}return x.wash+x.dry+x.wait;}
 function csvCell(v){let s=String(v);if(/^[\s]*[=+@\-\t\r]/.test(s))s="'"+s;return '"'+s.replace(/"/g,'""')+'"';}
 function makeCsv(rows){return '\ufeff'+[['宿','洗濯(分)','乾燥(分)','待ち(分)','合計(分)'],...rows.map(r=>[r.name,r.wash,r.dry,r.wait,calculate(r)])].map(a=>a.map(csvCell).join(',')).join('\r\n')+'\r\n';}
 if(typeof module!=='undefined'&&module.exports)module.exports={calculate,makeCsv};
 if(!root.document)return;
 const doc=root.document,wrap=doc.getElementById('options');let current=null;
 for(let i=0;i<2;i++){let field=doc.createElement('fieldset');field.innerHTML='<legend>宿 '+(i+1)+'</legend>'+[['name','施設名','宿 '+(i+1)],['wash','洗濯(分)','35'],['dry','乾燥(分)','50'],['wait','順番待ち(分)','10']].map(([key,label,value])=>'<label>'+label+'<input data-i="'+i+'" data-key="'+key+'" value="'+value+'" '+(key==='name'?'maxlength="100"':'type="number" min="0" max="1440" step="1"')+' required></label>').join('');wrap.appendChild(field);}
 doc.getElementById('compare').addEventListener('click',()=>{try{let rows=[0,1].map(i=>{let obj={};for(const el of wrap.querySelectorAll('[data-i="'+i+'"]'))obj[el.dataset.key]=el.dataset.key==='name'?el.value:Number(el.value);if(!obj.name.trim())throw Error('施設名を入力してください');calculate(obj);return obj});current=rows;doc.getElementById('result').textContent=rows.map(r=>r.name+'：'+calculate(r)+'分').join('\n')+'\n※設備・空き状況・所要時間の保証はありません。';doc.getElementById('export').disabled=false;}catch(e){current=null;doc.getElementById('export').disabled=true;doc.getElementById('result').textContent=e.message;}});
 doc.getElementById('export').addEventListener('click',()=>{if(!current)return;let url=URL.createObjectURL(new Blob([makeCsv(current)],{type:'text/csv;charset=utf-8'}));let a=doc.createElement('a');a.href=url;a.download='stay-laundry-comparison.csv';a.click();URL.revokeObjectURL(url);});
})(typeof globalThis!=='undefined'?globalThis:this);