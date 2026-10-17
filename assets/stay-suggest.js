/* STAY SELECT | 2026-10-17 09:21 | Search suggestions from 405 listed stays only. */
(()=>{'use strict';
const input=document.getElementById('q');
const list=document.getElementById('ss-search-suggestions');
const status=document.getElementById('ss-search-suggest-status');
const form=document.getElementById('stay-filters');
if(!input||!list||!status||!form)return;
const cards=[...document.querySelectorAll('#stay-list .ss-stay[data-stay-id]')];
if(!cards.length)return;
const collator=new Intl.Collator('ja',{sensitivity:'base',numeric:true});
const prefectures=new Map();
const stays=[];
for(const card of cards){
 const pref=card.dataset.pref||'';
 if(pref)prefectures.set(pref,(prefectures.get(pref)||0)+1);
 const name=card.querySelector('h2')?.textContent?.trim();
 if(name)stays.push({label:name,meta:`${pref||'所在地未確認'}・${card.dataset.kind||'宿泊施設'}`,search:name.toLocaleLowerCase()});
}
let options=[],active=-1,ignoreNext=false;
function close(){list.hidden=true;list.replaceChildren();options=[];active=-1;input.setAttribute('aria-expanded','false');input.removeAttribute('aria-activedescendant');status.textContent='';}
function setActive(index){
 active=index;
 for(const [i,node] of [...list.children].entries())node.setAttribute('aria-selected',String(i===active));
 if(active>=0){input.setAttribute('aria-activedescendant',`ss-search-option-${active}`);list.children[active]?.scrollIntoView?.({block:'nearest'});}
 else input.removeAttribute('aria-activedescendant');
}
function choose(index){
 const item=options[index];if(!item)return;
 input.value=item.label;close();ignoreNext=true;
 input.dispatchEvent(new Event('input',{bubbles:true}));
 input.focus();
}
function update(){
 if(ignoreNext){ignoreNext=false;return;}
 const query=input.value.trim().toLocaleLowerCase();
 if([...query].length<2){close();return;}
 const choices=[];
 for(const [name,count] of prefectures){
  if(name.toLocaleLowerCase().includes(query))choices.push({label:name,meta:`都道府県・${count}施設`,type:'pref',prefix:name.toLocaleLowerCase().startsWith(query)});
 }
 for(const stay of stays){
  if(stay.search.includes(query))choices.push({...stay,type:'stay',prefix:stay.search.startsWith(query)});
 }
 choices.sort((a,b)=>Number(b.prefix)-Number(a.prefix)||Number(a.type==='pref')-Number(b.type==='pref')||collator.compare(a.label,b.label));
 options=choices.slice(0,6);active=-1;list.replaceChildren();
 if(!options.length){close();return;}
 options.forEach((item,index)=>{
  const row=document.createElement('div');row.id=`ss-search-option-${index}`;row.className='ss-search-option';row.setAttribute('role','option');row.setAttribute('aria-selected','false');
  const name=document.createElement('strong');name.textContent=item.label;
  const meta=document.createElement('small');meta.textContent=item.meta;
  row.append(name,meta);
  row.addEventListener('mousedown',e=>e.preventDefault());
  row.addEventListener('click',()=>choose(index));
  list.appendChild(row);
 });
 list.hidden=false;input.setAttribute('aria-expanded','true');status.textContent=`${options.length}件の候補。上下キーで選択、Enterで確定できます。`;
}
input.addEventListener('input',update);
input.addEventListener('focus',()=>{if(input.value.trim())update()});
input.addEventListener('keydown',e=>{
 if(e.key==='Escape'){if(!list.hidden){e.preventDefault();close();}return;}
 if(e.key==='Tab'){close();return;}
 if(e.key==='ArrowDown'||e.key==='ArrowUp'){
  if(list.hidden){update();if(list.hidden)return;}
  e.preventDefault();setActive((active+(e.key==='ArrowDown'?1:-1)+options.length)%options.length);
 }
 if(e.key==='Enter'&&!list.hidden&&active>=0){e.preventDefault();choose(active);}
});
input.addEventListener('blur',()=>setTimeout(close,160));
form.addEventListener('reset',()=>setTimeout(close,0));
})();
