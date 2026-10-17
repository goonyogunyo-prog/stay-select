/* STAY SELECT: latest 38 stays grouped by verified operator */
(()=>{'use strict';
const root=document.getElementById('ss-new-groups-buttons');
const caption=document.getElementById('ss-new-groups-caption');
const q=document.getElementById('q'),newOnly=document.getElementById('ss-new-only');
if(!root||!caption||!q||!newOnly)return;
const all=[...document.querySelectorAll('.ss-stay[data-stay-id]')];
const recent=all.filter(c=>Number(c.dataset.stayId?.split('-').pop())>Math.max(0,all.length-38));
const counts=new Map();for(const c of recent){const op=c.dataset.operator;if(op)counts.set(op,(counts.get(op)||0)+1)}
if(!counts.size){caption.textContent='新着施設の運営グループ情報はありません。';return;}
const groups=[...counts].sort((a,b)=>b[1]-a[1]||a[0].localeCompare(b[0],'ja'));
function setGroup(group){
 if(group){q.value=group;newOnly.checked=true;}else{q.value='';newOnly.checked=false;}
 q.dispatchEvent(new Event('input',{bubbles:true}));render();
}
const buttons=[];
for(const [name,count] of groups){const b=document.createElement('button');b.type='button';b.className='ss-new-group-chip';b.textContent=`${name}（${count}施設）`;b.setAttribute('aria-label',`${name}の新着${count}施設に絞り込む`);b.addEventListener('click',()=>setGroup(name));root.appendChild(b);buttons.push([name,b]);}
const reset=document.createElement('button');reset.type='button';reset.className='ss-new-group-chip ss-new-group-reset';reset.textContent='新着グループの絞り込みを解除';reset.addEventListener('click',()=>setGroup(''));root.appendChild(reset);
function render(){const active=newOnly.checked&&counts.has(q.value)?q.value:'';
 for(const [name,b] of buttons)b.setAttribute('aria-pressed',String(name===active));
 reset.hidden=!active;
 caption.textContent=active?`${active}の新着${counts.get(active)}施設を検索中。他の条件も組み合わせられます。`:`今回追加した38施設を${counts.size}運営グループに分類。グループを押すと新着施設だけに絞り込めます。`;
}
q.addEventListener('input',render);newOnly.addEventListener('change',render);document.getElementById('stay-filters')?.addEventListener('reset',()=>setTimeout(render,0));render();
})();
