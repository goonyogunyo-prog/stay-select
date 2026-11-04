(function(root){'use strict';
function money(v){var n=Number(v);if(!Number.isFinite(n)||n<0)throw Error('金額は0以上の数値で入力してください');return Math.round(n);}
function integer(v,min,max,label){var n=Number(v);if(!Number.isInteger(n)||n<min||n>max)throw Error(label+'は'+min+'〜'+max+'の整数で入力してください');return n;}
function calculate(x){var persons=integer(x.persons,1,100,'人数'), days=integer(x.days,1,30,'日数');
var ferry=money(x.ferry),flight=money(x.flight),ferryTransfers=money(x.ferryTransfers),flightTransfers=money(x.flightTransfers),ferryExtra=money(x.ferryExtra),flightExtra=money(x.flightExtra),ferryBuffer=money(x.ferryBuffer),flightBuffer=money(x.flightBuffer);
var f=(ferry+ferryTransfers)*persons+ferryExtra*days+ferryBuffer;
var a=(flight+flightTransfers)*persons+flightExtra*days+flightBuffer;
return {persons:persons,days:days,ferryTotal:f,flightTotal:a,difference:Math.abs(f-a),cheaper:f===a?'同額':f<a?'船':'飛行機',ferryPerPerson:Math.ceil(f/persons),flightPerPerson:Math.ceil(a/persons)};}
function escapeCSV(s){return '"'+String(s).replace(/"/g,'""')+'"';}
function makeCSV(r){return '\ufeff'+[['比較項目','結果'],['人数',r.persons],['日数',r.days],['船の総額',r.ferryTotal],['飛行機の総額',r.flightTotal],['差額',r.difference],['低い試算額',r.cheaper],['船の1人あたり(切上げ)',r.ferryPerPerson],['飛行機の1人あたり(切上げ)',r.flightPerPerson]].map(row=>row.map(escapeCSV).join(',')).join('\r\n')+'\r\n';}
if(typeof module!=='undefined'&&module.exports)module.exports={calculate:calculate,makeCSV:makeCSV};
if(typeof document==='undefined')return;
var form=document.getElementById('compareForm'),out=document.getElementById('output'),save=document.getElementById('save');var last=null;
form.addEventListener('submit',function(e){e.preventDefault();try{var values={};for(var i=0;i<form.elements.length;i++){var el=form.elements[i];if(el.name)values[el.name]=el.value;}last=calculate(values);out.textContent='船 '+last.ferryTotal.toLocaleString('ja-JP')+'円 ／ 飛行機 '+last.flightTotal.toLocaleString('ja-JP')+'円 ／ 差額 '+last.difference.toLocaleString('ja-JP')+'円（低い試算額：'+last.cheaper+'）';save.disabled=false;}catch(err){last=null;save.disabled=true;out.textContent=err.message;}});
save.addEventListener('click',function(){if(!last)return;var blob=new Blob([makeCSV(last)],{type:'text/csv;charset=utf-8'});var u=URL.createObjectURL(blob);var a=document.createElement('a');a.href=u;a.download='stay-ferry-flight-comparison.csv';a.click();setTimeout(function(){URL.revokeObjectURL(u);},500);});
})(typeof globalThis!=='undefined'?globalThis:this);