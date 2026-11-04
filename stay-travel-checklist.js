"use strict";
const groups={basic:["財布・身分証","スマートフォン","充電器","着替え","常備薬","予約内容の控え","雨具"],onsen:["タオル","スキンケア用品","替えの下着","ヘアケア用品"],camp:["食材・飲料","調理用品の確認","防寒具","ゴミ袋"]};
const kind=document.getElementById("kind"),items=document.getElementById("items"),count=document.getElementById("count"),message=document.getElementById("message");
function choices(){return [...groups.basic,...(groups[kind.value]||[])];}
function render(){items.replaceChildren();for(const [i,name] of choices().entries()){const label=document.createElement("label"),cb=document.createElement("input");cb.type="checkbox";cb.dataset.index=String(i);cb.addEventListener("change",update);label.append(cb,document.createTextNode(name));items.append(label);}update();}
function update(){const boxes=[...items.querySelectorAll("input")];count.textContent=`準備済み ${boxes.filter(x=>x.checked).length} / ${boxes.length} 件`;}
kind.addEventListener("change",()=>{render();message.textContent="";});
document.getElementById("reset").addEventListener("click",()=>{for(const x of items.querySelectorAll("input"))x.checked=false;update();message.textContent="リセットしました";});
document.getElementById("copy").addEventListener("click",async()=>{const missing=[...items.querySelectorAll("input")].filter(x=>!x.checked).map(x=>choices()[Number(x.dataset.index)]);try{await navigator.clipboard.writeText(missing.length?missing.join("\n"):"すべて準備済み");message.textContent="コピーしました";}catch(e){message.textContent="コピーできません。ブラウザの権限を確認してください。";}});
render();