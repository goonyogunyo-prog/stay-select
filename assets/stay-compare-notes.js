/* STAY SELECT | private notes in compare table | 2026-10-17 */
(()=>{'use strict';
 const body=document.getElementById('compare-body'),key='stayselect:notes:v1';if(!body)return;
 let selected=[];
 function read(){try{const v=JSON.parse(localStorage.getItem(key)||'{}');return v&&typeof v==='object'&&!Array.isArray(v)?v:{}}catch(_){return{}}}
 function render(){
  body.querySelector('[data-ss-compare-notes]')?.remove();
  if(!selected.length)return;
  const notes=read(),tr=document.createElement('tr');tr.dataset.ssCompareNotes='1';
  const th=document.createElement('th');th.textContent='自分の検討メモ（この端末のみ）';tr.appendChild(th);
  for(const id of selected){const td=document.createElement('td'),note=notes[id];
   if(typeof note==='string'&&note.trim()){td.className='ss-compare-private-note';td.textContent=[...note].slice(0,300).join('');}
   else{td.className='ss-compare-note-empty';td.textContent='メモ未登録';const a=document.createElement('a');a.href='../stay/?id='+encodeURIComponent(id);a.textContent='宿の詳細でメモを書く ↗';td.appendChild(a)}
   tr.appendChild(td);
  }
  body.appendChild(tr);
 }
 window.addEventListener('stayselect:compare-updated',e=>{
  selected=(Array.isArray(e.detail?.items)?e.detail.items:[]).map(x=>x.id).filter(x=>/^stay-\d{3}$/.test(x)).slice(0,4);render();
 });
 window.addEventListener('storage',e=>{if(e.key===key)render()});
 document.addEventListener('visibilitychange',()=>{if(!document.hidden)render()});
})();
