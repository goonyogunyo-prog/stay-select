"use strict";
(async()=>{
 const $=id=>document.getElementById(id);
 const root=$('items'),q=$('q'),pref=$('pref'),status=$('status'),counter=$('resultCount');
 let items=[];
 const add=(parent,tag,content,cls)=>{const e=document.createElement(tag);if(cls)e.className=cls;e.textContent=content;parent.appendChild(e);return e;};
 const csvCell=v=>'"'+String(v??'').replace(/"/g,'""')+'"';
 const shown=()=>items.filter(x=>(!pref.value||x.pref===pref.value)&&(!status.value||x.status===status.value)&&(!q.value||[x.name,x.existing,x.reason].join(' ').toLocaleLowerCase().includes(q.value.toLocaleLowerCase())));
 function draw(){const data=shown();root.replaceChildren();counter.textContent=`${data.length}件を表示`;
 for(const x of data.slice(0,300)){
  const card=document.createElement('article');card.className='item';add(card,'span',x.status,x.status.startsWith('別名')?'tag confirmed':'tag');add(card,'h3',x.name);add(card,'p',x.pref);if(x.existing)add(card,'p','既存掲載候補：'+x.existing);add(card,'p',x.reason);
  for(const [label,url] of [['観光団体の掲載',x.tourism_source],['宿運営元の公式',x.operator_source]])if(url){const a=add(card,'a',label);a.href=url;a.target='_blank';a.rel='noopener noreferrer';card.appendChild(document.createTextNode('　'));}
  root.appendChild(card);
 }
 if(data.length>300)add(root,'p','画面表示は先頭300件。CSVには全件を出力します。');
 }
 try{const res=await fetch('data/stay-alias-review-20261101-1148.json',{cache:'no-store'});if(!res.ok)throw Error('HTTP '+res.status);const d=await res.json();items=d.items||[];for(const p of [...new Set(items.map(x=>x.pref))].sort()){const o=document.createElement('option');o.value=o.textContent=p;pref.appendChild(o);}draw();}catch(e){counter.textContent='調査データを読み込めませんでした。';}
 [q,pref,status].forEach(e=>e.addEventListener('input',draw));
 $('export').addEventListener('click',()=>{const rows=[['施設名','県','状態','既存掲載名','保留理由','観光団体URL','運営元URL'],...shown().map(x=>[x.name,x.pref,x.status,x.existing,x.reason,x.tourism_source,x.operator_source])];const text='\uFEFF'+rows.map(r=>r.map(csvCell).join(',')).join('\r\n')+'\r\n';const blob=new Blob([text],{type:'text/csv;charset=utf-8'});const u=URL.createObjectURL(blob);const a=document.createElement('a');a.href=u;a.download='stay-alias-review-20261101.csv';a.click();setTimeout(()=>URL.revokeObjectURL(u),2000);});
})();
