/* STAY SELECT | local JSON backup & merge | 2026-10-17 12:20 JST */
(()=>{'use strict';
const root=document.getElementById('ss-backup');if(!root)return;
const exportButton=document.getElementById('ss-backup-export');
const importFile=document.getElementById('ss-backup-file');
const status=document.getElementById('ss-backup-status');
if(!exportButton||!importFile||!status)return;
const keys={favorites:'stayselect:favorites:v1',compare:'stayselect:compare:v1',recent:'stayselect:recent:v1',presets:'stayselect:search-presets:v1',notes:'stayselect:notes:v1'};
const FORMAT='stay-select-local-backup',VERSION=1,MAX_BYTES=100*1024;
const ids=new Set([...document.querySelectorAll('#stay-list .ss-stay[data-stay-id]')].map(x=>x.dataset.stayId));
const fields=['q','region','pref','kind','detail','access','booking'];
const allowedSort=new Set(['default','name','pref','matched','affiliate','detail','saved']);
const isObject=x=>x!==null&&typeof x==='object'&&!Array.isArray(x);
function announce(message,error=false){status.textContent=message;status.dataset.error=String(error)}
function storageRead(key){const value=localStorage.getItem(key);return value===null?[]:JSON.parse(value)}
function uniqueIds(raw,max){
 if(!Array.isArray(raw))return [];
 const result=[];const seen=new Set();
 for(const id of raw){if(typeof id!=='string'||!ids.has(id)||seen.has(id))continue;seen.add(id);result.push(id);if(result.length===max)break;}
 return result;
}
function presets(raw){
 if(!Array.isArray(raw))return [];
 const result=[],seen=new Set();
 for(const item of raw){
  if(!isObject(item)||typeof item.name!=='string'||!isObject(item.filters))continue;
  const filters={};
  for(const k of fields)filters[k]=typeof item.filters[k]==='string'?item.filters[k].slice(0,120):'';
  const sort=allowedSort.has(item.sort)?item.sort:'default';
  const saved=item.saved===true;
  const signature=JSON.stringify({filters,sort,saved});
  if(seen.has(signature))continue;seen.add(signature);
  result.push({id:typeof item.id==='string'?item.id.slice(0,70):'p'+result.length,name:item.name.trim().slice(0,24)||'保存した検索条件',filters,sort,saved});
  if(result.length===5)break;
 }
 return result;
}
function cleanNotes(raw){
 if(!isObject(raw))return {};
 const result={};
 for(const [id,value] of Object.entries(raw)){
  if(!ids.has(id)||typeof value!=='string')continue;
  const clipped=[...value].slice(0,300).join('');
  if(!clipped.trim())continue;
  result[id]=clipped;
  if(Object.keys(result).length===80)break;
 }
 return result;
}
function normalize(raw){
 if(!isObject(raw))throw Error('JSONの内容が正しくありません。');
 return {favorites:uniqueIds(raw.favorites,ids.size),compare:uniqueIds(raw.compare,4),recent:uniqueIds(raw.recent,8),presets:presets(raw.presets),notes:cleanNotes(raw.notes)};
}
function readCurrent(){return normalize(Object.fromEntries(Object.entries(keys).map(([k,v])=>[k,storageRead(v)])))}
function merge(current,incoming){
 const merged={};
 for(const k of ['favorites','compare','recent']){
  const max=k==='favorites'?ids.size:k==='compare'?4:8;
  merged[k]=uniqueIds([...current[k],...incoming[k]],max);
 }
 merged.presets=presets([...current.presets,...incoming.presets]);
 // Existing notes take priority. Imported notes fill empty slots without erasing local notes.
 merged.notes=cleanNotes({...current.notes,...Object.fromEntries(Object.entries(incoming.notes).filter(([id])=>!Object.hasOwn(current.notes,id)))});
 return merged;
}
function writeAll(next){
 const old=Object.fromEntries(Object.entries(keys).map(([k,v])=>[k,localStorage.getItem(v)]));
 const written=[];
 try{
  for(const [k,v] of Object.entries(keys)){localStorage.setItem(v,JSON.stringify(next[k]));written.push(v)}
 }catch(err){
  for(const key of written){try{if(old[Object.keys(keys).find(k=>keys[k]===key)]===null)localStorage.removeItem(key);else localStorage.setItem(key,old[Object.keys(keys).find(k=>keys[k]===key)])}catch(_){/* storage may be unavailable */}}
  throw Error('保存領域への書き込みに失敗しました。容量・ブラウザ設定を確認してください。');
 }
}
exportButton.addEventListener('click',()=>{
 try{
  const payload={format:FORMAT,version:VERSION,exportedAt:new Date().toISOString(),...readCurrent()};
  const json=JSON.stringify(payload,null,2)+'\n';
  if(new Blob([json]).size>MAX_BYTES)throw Error('保存データが100KBを超えました。');
  const url=URL.createObjectURL(new Blob([json],{type:'application/json;charset=utf-8'}));
  const link=document.createElement('a');link.href=url;link.download='stay-select-backup-'+new Date().toISOString().slice(0,10)+'.json';
  document.body.appendChild(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
  announce('JSONを保存しました。ファイルにはこの端末のお気に入り・比較候補・閲覧履歴・検索条件・宿の検討メモが含まれます。');
 }catch(err){announce('書き出しできませんでした：'+err.message,true)}
});
importFile.addEventListener('change',async()=>{
 const file=importFile.files?.[0];if(!file)return;
 try{
  if(file.size>MAX_BYTES)throw Error('100KBを超えるファイルは読み込めません。');
  const contents=await file.text();
  if(new Blob([contents]).size>MAX_BYTES)throw Error('100KBを超えるファイルは読み込めません。');
  let parsed;try{parsed=JSON.parse(contents)}catch(_){throw Error('JSONとして読み取れません。')}
  if(!isObject(parsed)||parsed.format!==FORMAT||parsed.version!==VERSION||
   !Array.isArray(parsed.favorites)||!Array.isArray(parsed.compare)||!Array.isArray(parsed.recent)||!Array.isArray(parsed.presets)){
   throw Error('STAY SELECTのバックアップ形式ではありません。');
  }
  const incoming=normalize(parsed),current=readCurrent(),merged=merge(current,incoming);
  writeAll(merged);
  const message=`統合しました：お気に入り${merged.favorites.length}件・比較${merged.compare.length}件・履歴${merged.recent.length}件・検索条件${merged.presets.length}件・メモ${Object.keys(merged.notes).length}件。`;
  announce(message);
  try{sessionStorage.setItem('stayselect:backup-message:v1',message)}catch(_){/* optional */}
  // Existing widgets read localStorage at startup. Reload so all UI reflects the import.
  setTimeout(()=>location.reload(),350);
 }catch(err){announce('読み込みできませんでした：'+err.message,true)}
 finally{importFile.value=''}
});
try{const msg=sessionStorage.getItem('stayselect:backup-message:v1');if(msg){announce(msg);sessionStorage.removeItem('stayselect:backup-message:v1')}}catch(_){/* optional */}
})();
