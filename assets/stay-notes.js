/* STAY SELECT: private per-stay notes, 2026-10-17 */
(()=>{'use strict';
 const id=new URLSearchParams(location.search).get('id')||'';
 if(!/^stay-\d{3}$/.test(id))return;
 const $=x=>document.getElementById(x),content=$('sd-content'),panel=$('sn-panel');
 if(!content||!panel)return;
 const key='stayselect:notes:v1',max=300;
 let initialized=false;
 function read(){try{const o=JSON.parse(localStorage.getItem(key)||'{}');return o&&typeof o==='object'&&!Array.isArray(o)?o:{}}catch(_){return{}}}
 function save(o){try{localStorage.setItem(key,JSON.stringify(o));return true}catch(_){return false}}
 function init(){
  if(initialized||content.hidden||!$('sd-title')?.textContent.trim())return;
  initialized=true;panel.hidden=false;
  const input=$('sn-text'),counter=$('sn-count'),status=$('sn-status');
  const update=()=>{counter.textContent=[...input.value].length+' / '+max+'文字'};
  const current=read()[id];if(typeof current==='string')input.value=[...current].slice(0,max).join('');update();
  input.addEventListener('input',()=>{if([...input.value].length>max)input.value=[...input.value].slice(0,max).join('');update();status.textContent='未保存の変更があります。'});
  $('sn-save').addEventListener('click',()=>{
   const value=[...input.value].slice(0,max).join('');const data=read();
   if(value.trim()){
    const ids=Object.keys(data).filter(x=>/^stay-\d{3}$/.test(x)&&typeof data[x]==='string');
    if(!Object.hasOwn(data,id)&&ids.length>=80){status.textContent='保存可能なメモは80施設までです。不要なメモを削除してください。';return}
    data[id]=value;
   }else delete data[id];
   status.textContent=save(data)?'この宿のメモを保存しました。':'保存できませんでした。ブラウザのストレージ設定をご確認ください。';
  });
  $('sn-clear').addEventListener('click',()=>{
   const data=read();delete data[id];
   if(save(data)){input.value='';update();status.textContent='この宿のメモを削除しました。'}
   else status.textContent='削除できませんでした。ブラウザのストレージ設定をご確認ください。';
  });
  window.addEventListener('storage',e=>{if(e.key!==key)return;const v=read()[id];input.value=typeof v==='string'?[...v].slice(0,max).join(''):'';update();status.textContent='別のタブで更新されたメモを反映しました。'});
 }
 if(!content.hidden)init();
 const obs=new MutationObserver(()=>{init();if(initialized)obs.disconnect()});
 if(!initialized)obs.observe(content,{attributes:true,attributeFilter:['hidden']});
})();
