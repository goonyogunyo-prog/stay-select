"use strict";
(function(root){
  function valid(row){
    const s=String(row.start||""),e=String(row.end||""),d=String(row.date||"");
    if(!/^\d{4}-\d{2}-\d{2}$/.test(d)||!Number.isFinite(Date.parse(d+"T00:00:00Z"))||new Date(d+"T00:00:00Z").toISOString().slice(0,10)!==d)throw Error("利用日を正しく入力してください");
    if(!/^([01]\d|2[0-3]):[0-5]\d$/.test(s)||!/^([01]\d|2[0-3]):[0-5]\d$/.test(e)||s>=e)throw Error("開始より後の終了時刻を指定してください（同日内）");
    if(!String(row.group||"").trim()||!String(row.kitchen||"").trim())throw Error("グループ名とキッチン名を入力してください");
    return {group:String(row.group).trim().slice(0,60),date:d,start:s,end:e,kitchen:String(row.kitchen).trim().slice(0,60)};
  }
  function conflicts(rows){const out=[];for(let i=0;i<rows.length;i++)for(let j=i+1;j<rows.length;j++)if(rows[i].date===rows[j].date&&rows[i].kitchen===rows[j].kitchen&&rows[i].start<rows[j].end&&rows[j].start<rows[i].end)out.push([i,j]);return out;}
  function csv(rows){const q=x=>'"'+String(x).replace(/"/g,'""')+'"';return '\uFEFF'+[['グループ','利用日','開始','終了','キッチン'],...rows.map(x=>[x.group,x.date,x.start,x.end,x.kitchen])].map(r=>r.map(q).join(',')).join('\r\n')+'\r\n';}
  const api={valid,conflicts,csv};if(typeof module!=="undefined"&&module.exports)module.exports=api;
  if(!root.document)return;
  const doc=root.document,rows=[],by=id=>doc.getElementById(id),esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  function render(){const pairs=conflicts(rows),bad=new Set(pairs.flat());by('status').textContent=rows.length+'件の予定／重複'+pairs.length+'組';by('results').innerHTML=rows.length?'<table><thead><tr><th>グループ</th><th>利用日</th><th>時間</th><th>キッチン</th><th>判定</th><th>操作</th></tr></thead><tbody>'+rows.map((x,i)=>'<tr><td>'+esc(x.group)+'</td><td>'+esc(x.date)+'</td><td>'+esc(x.start)+'〜'+esc(x.end)+'</td><td>'+esc(x.kitchen)+'</td><td class="'+(bad.has(i)?'warning':'ok')+'">'+(bad.has(i)?'重複あり':'重複なし')+'</td><td><button data-del="'+i+'">削除</button></td></tr>').join('')+'</tbody></table>':'<p>まだ予定がありません。</p>';by('results').querySelectorAll('[data-del]').forEach(b=>b.addEventListener('click',()=>{rows.splice(Number(b.dataset.del),1);render();}));}
  by('add').addEventListener('click',()=>{try{rows.push(valid({group:by('group').value,date:by('date').value,start:by('start').value,end:by('end').value,kitchen:by('kitchen').value}));render();}catch(e){by('status').textContent=e.message;}});
  by('clear').addEventListener('click',()=>{rows.length=0;render();});
  by('csv').addEventListener('click',()=>{if(!rows.length){by('status').textContent='CSVに出力する予定がありません';return;}const b=new Blob([csv(rows)],{type:'text/csv;charset=utf-8'}),u=URL.createObjectURL(b),a=doc.createElement('a');a.href=u;a.download='stay-shared-kitchen-slots.csv';a.click();setTimeout(()=>URL.revokeObjectURL(u),1000);});render();
})(typeof window!=="undefined"?window:globalThis);