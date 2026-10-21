(()=>{'use strict';const $=q=>document.querySelector(q);let stays=[],byName=new Map(),records=[],missing=[],visible=[],limit=50;const norm=s=>String(s??'').normalize('NFKC').toLocaleLowerCase().replace(/[\p{Z}\p{P}\p{S}]/gu,'');const clean=s=>String(s??'').replace(/^楽天トラベルで『(.+?)』を検索（掲載未確認）$/,'$1');const safe=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));const search=u=>/^https:\/\/(?:kw\.travel\.rakuten\.co\.jp\/keyword\/Search\.do\?|www\.google\.com\/search\?)/i.test(u);const direct=u=>/^https:\/\/travel\.rakuten\.co\.jp\/HOTEL\/\d+(?:\/|$)/i.test(u);const aff=u=>/^https:\/\/hb\.afl\.rakuten\.co\.jp\//i.test(u);function parse(t){t=t.replace(/^\uFEFF/,'');let out=[],row=[],v='',quoted=false;for(let i=0;i<t.length;i++){let c=t[i];if(quoted){if(c==='"'&&t[i+1]==='"'){v+='"';i++}else if(c==='"'){quoted=false}else v+=c}else if(c==='"'){quoted=true}else if(c===','){row.push(v);v=''}else if(c==='\n'||c==='\r'){if(c==='\r'&&t[i+1]==='\n')i++;row.push(v);if(row.some(x=>x!==''))out.push(row);row=[];v=''}else v+=c}if(quoted)throw Error('CSVの引用符が閉じていません');if(v!==''||row.length){row.push(v);out.push(row)}return out}function csvCell(v){v=String(v??'');if(/^[=+@\-\t\r]/.test(v))v="'"+v;return '"'+v.replace(/"/g,'""')+'"'}function download(name,headers,rows){const t='\uFEFF'+[headers,...rows].map(r=>r.map(csvCell).join(',')).join('\r\n');const url=URL.createObjectURL(new Blob([t],{type:'text/csv;charset=utf-8'}));const a=document.createElement('a');a.href=url;a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1200)}function report(rows){const seen=new Map();records=[];const hdr=rows[0]||[];const iURL=hdr.indexOf('リンク先URL'),iName=hdr.indexOf('リンクテキスト'),iImg=hdr.indexOf('商品画像URL');if(iURL<0||iName<0||iImg<0)throw Error('3列ヘッダー「リンク先URL／リンクテキスト／商品画像URL」が必要です');for(let j=1;j<rows.length;j++){const row=rows[j],url=(row[iURL]||'').trim(),label=(row[iName]||'').trim(),image=(row[iImg]||'').trim(),name=clean(label),key=norm(name),match=byName.get(key),issues=[];if(!match)issues.push('施設名がSTAY SELECTに見つからない');if(seen.has(key))issues.push('施設名がCSV内で重複（先行行 '+seen.get(key)+'）');else seen.set(key,j+1);if(row.length!==hdr.length)issues.push('列数が一致しない');let type='other';if(search(url))type='search';else if(direct(url))type='direct';else if(aff(url))type='affiliate';else issues.push('楽天検索・個別施設URL・既知成果URL以外の形式');if(type==='search')issues.push('楽天個別ページ未確認（検索URLのみ）');if(type==='direct')issues.push('URL形式のみ検査済み（同一施設か未確認）');if(type==='affiliate')issues.push('成果URLの発行・対象施設・計測は未検証');if(image&&!/^https:\/\//i.test(image))issues.push('商品画像URL形式を確認');records.push({line:j+1,id:match?.id||'',name:match?.name||name,pref:match?.pref||'',url,type,issues})}missing=stays.filter(s=>!seen.has(norm(s.name))).map(s=>({line:'',id:s.id,name:s.name,pref:s.pref,url:'',type:'missing',issues:['CSVに未収録']}));const cnt=t=>records.filter(r=>r.type===t).length;$('#stats').innerHTML=[['登録施設',stays.length],['CSVデータ行',records.length],['個別URL形式',cnt('direct')],['検索URL',cnt('search')],['成果URL形式',cnt('affiliate')],['未収録施設',missing.length],['重複行',records.filter(r=>r.issues.some(x=>x.includes('重複'))).length]].map(([k,v])=>'<div><small>'+safe(k)+'</small><strong>'+v.toLocaleString()+'</strong></div>').join('');$('#status').textContent=records.length.toLocaleString()+'行を検査。URL形式は確認できますが、宿の同一性や楽天アフィリエイト成果は検証していません。';for(const k of ['issues','missing','all'])$('#'+k).disabled=false;limit=50;draw()}function selected(){const f=$('#filter').value;let a=f==='missing'?missing:f==='all'?[...records,...missing]:f==='issues'?[...records.filter(r=>r.issues.length),...missing]:records.filter(r=>r.type===f);const q=norm($('#q').value);if(q)a=a.filter(r=>norm(r.name+' '+r.pref+' '+r.id).includes(q));return a}function draw(){visible=selected();$('#count').textContent=visible.length.toLocaleString()+'件中 '+Math.min(visible.length,limit).toLocaleString()+'件を表示';$('#results').innerHTML=visible.slice(0,limit).map(r=>'<article class="row"><strong>'+safe(r.name)+' <small>'+safe(r.pref)+' · '+safe(r.id)+'</small></strong><span class="flag '+(r.issues.length?'':'ok')+'">'+safe(r.type)+'</span><small>行 '+safe(r.line||'—')+' · '+safe(r.url||'CSV未収録')+'</small><small>'+safe(r.issues.join('／')||'形式上の指摘なし')+'</small></article>').join('');$('#more').hidden=visible.length<=limit}function exportRows(which){const rows=which==='missing'?missing:which==='issues'?[...records.filter(r=>r.issues.length),...missing]:[...records,...missing];download('STAY_SELECT_RAKUTEN_CSV_AUDIT_'+which+'.csv',['CSV行','施設ID','宿名','都道府県','リンク先URL','分類','確認事項'],rows.map(r=>[r.line,r.id,r.name,r.pref,r.url,r.type,r.issues.join(' / ')]))}async function readCsv(text){try{report(parse(text))}catch(e){$('#status').textContent='検査できません: '+e.message}}async function init() {
  try {
    const r = await fetch('data/stays.json', {cache: 'no-store'});
    if (!r.ok) throw Error('施設データのHTTP ' + r.status);
    const data = await r.json();
    stays = data.stays || [];
    byName = new Map(stays.map(s => [norm(s.name), s]));
    $('#status').textContent = stays.length.toLocaleString() + '施設を読み込みました。CSVを選択してください。';
  } catch (e) {
    $('#status').textContent = '施設データを取得できません: ' + e.message;
  }
  $('#sample').addEventListener('click', async () => {
    try {
      const r = await fetch('data/stay-rakuten-bulk-3483-search-3col.csv', {cache: 'no-store'});
      if (!r.ok) throw Error('CSVのHTTP ' + r.status);
      await readCsv(await r.text());
    } catch (e) {
      $('#status').textContent = 'CSVを取得できません: ' + e.message;
    }
  });
  $('#file').addEventListener('change', async e => {
    const f = e.target.files?.[0];
    if (f) await readCsv(await f.text());
  });
  $('#filter').addEventListener('change', () => {limit = 50; draw()});
  $('#q').addEventListener('input', () => {limit = 50; draw()});
  $('#more').addEventListener('click', () => {limit += 50; draw()});
  for (const k of ['issues', 'missing', 'all']) {
    $('#' + k).addEventListener('click', () => exportRows(k));
  }
}
document.addEventListener('DOMContentLoaded', init);
})();
