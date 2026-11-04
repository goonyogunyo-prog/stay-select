"use strict";
(function(global){
  function finiteNonnegative(v,label){const n=Number(v);if(v===""||!Number.isFinite(n)||n<0)throw new Error(label+"は0以上の数値を入力してください。");return n;}
  function evaluate(raw){
    const p=Number(raw.chance);if(raw.chance===""||!Number.isFinite(p)||p<0||p>100)throw new Error("確率は0〜100%で入力してください。");
    function plan(prefix){const lodging=finiteNonnegative(raw[prefix+"L"],prefix+"宿泊費"),lodgingRefund=finiteNonnegative(raw[prefix+"R"],prefix+"宿泊返金"),travel=finiteNonnegative(raw[prefix+"T"],prefix+"交通等費用"),travelRefund=finiteNonnegative(raw[prefix+"TR"],prefix+"交通等返金");if(lodgingRefund>lodging||travelRefund>travel)throw new Error("返金額は各支払額を超えられません。");const go=lodging+travel,cancel=go-lodgingRefund-travelRefund;return {go,cancel,expected:go*(1-p/100)+cancel*(p/100),refund:lodgingRefund+travelRefund};}
    const a=plan("a"),b=plan("b");const base=a.go-b.go,slope=(a.cancel-a.go)-(b.cancel-b.go);const breakEven=slope===0?null:-base/slope*100;return {p,a,b,better:a.expected<b.expected?"A":a.expected>b.expected?"B":"同額",difference:Math.abs(a.expected-b.expected),breakEven:breakEven!==null&&breakEven>=0&&breakEven<=100?breakEven:null};
  }
  function csvEscape(v){return '"'+String(v).replace(/"/g,'""')+'"';}
  function makeCSV(r){const rows=[["項目","プランA","プランB"],["旅行した場合",r.a.go,r.b.go],["キャンセル時損失",r.a.cancel,r.b.cancel],["仮定したキャンセル確率(%)",r.p,r.p],["期待費用",r.a.expected.toFixed(2),r.b.expected.toFixed(2)],["期待費用が低い案",r.better,""]];return '\ufeff'+rows.map(row=>row.map(csvEscape).join(',')).join('\r\n')+'\r\n';}
  const api={evaluate,makeCSV};if(typeof module!=="undefined"&&module.exports)module.exports=api;
  if(typeof document==="undefined")return;
  const ids=["chance","aL","aR","aT","aTR","bL","bR","bT","bTR"];
  const read=()=>Object.fromEntries(ids.map(id=>[id,document.getElementById(id).value]));
  let latest=null;
  const yen=n=>new Intl.NumberFormat("ja-JP",{style:"currency",currency:"JPY",maximumFractionDigits:0}).format(n);
  function calculate(){const el=document.getElementById("result");try{const r=evaluate(read());latest=r;el.textContent="";const p=document.createElement("p");p.textContent="仮定したキャンセル確率: "+r.p+"%｜期待費用が低い案: "+r.better+"（差額 "+yen(r.difference)+"）";el.append(p);const t=document.createElement("table");const rows=[["項目","プランA","プランB"],["旅行した場合",yen(r.a.go),yen(r.b.go)],["キャンセル時損失",yen(r.a.cancel),yen(r.b.cancel)],["仮定に基づく期待費用",yen(r.a.expected),yen(r.b.expected)]];rows.forEach((row,i)=>{const tr=document.createElement("tr");row.forEach(v=>{const td=document.createElement(i===0?"th":"td");td.textContent=v;tr.append(td)});t.append(tr)});el.append(t);const note=document.createElement("p");note.textContent=r.breakEven===null?"この入力条件では0〜100%の範囲に損益分岐点はありません。":"2案の期待費用が同じになる確率の目安: "+r.breakEven.toFixed(1)+"%";el.append(note);}catch(e){latest=null;el.textContent="入力エラー: "+e.message;}}
  document.getElementById("calc").addEventListener("click",calculate);
  document.getElementById("csv").addEventListener("click",()=>{if(!latest)calculate();if(!latest)return;const b=new Blob([makeCSV(latest)],{type:"text/csv;charset=utf-8"});const url=URL.createObjectURL(b);const a=document.createElement("a");a.href=url;a.download="stay-refund-risk-scenarios.csv";a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);});
  calculate();
})(typeof globalThis!=="undefined"?globalThis:this);
