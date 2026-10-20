(()=>{
'use strict';
const $=id=>document.getElementById(id);
const regionPrefs={
'北海道・東北':['北海道','青森県','岩手県','宮城県','秋田県','山形県','福島県'],
'関東':['茨城県','栃木県','群馬県','埼玉県','千葉県','東京都','神奈川県'],
'甲信越・北陸':['新潟県','富山県','石川県','福井県','山梨県','長野県'],
'東海':['岐阜県','静岡県','愛知県','三重県'],
'近畿':['滋賀県','京都府','大阪府','兵庫県','奈良県','和歌山県'],
'中国':['鳥取県','島根県','岡山県','広島県','山口県'],
'四国':['徳島県','香川県','愛媛県','高知県'],
'九州・沖縄':['福岡県','佐賀県','長崎県','熊本県','大分県','宮崎県','鹿児島県','沖縄県']};
const kinds={onsen:['温泉旅館'],cottage:['コテージ・一棟貸し','グランピング'],luxury:['高級ホテル','リゾート'],city:['シティホテル','ビジネスホテル'],anniversary:[],value:[]};
const common=['希望日の空室と、税・サービス料を含めた宿泊総額','キャンセル無料期限と支払方法','到着時刻、最終チェックイン、荷物預かり','公式サイトと予約サイトのプラン条件の違い'];
const specific={
onsen:['貸切風呂は宿泊前に時間指定できるか。料金と利用時間は？','飲み放題はどのプラン・時間帯に含まれるか。','夕食の開始時刻とアレルギー対応は？'],
cottage:['キッチン・調理器具・食器・調味料はどこまであるか。','BBQは可能か。炭・食材・火器の持ち込み規定は？','最寄りスーパーとチェックイン前の買い出し方法は？','駅送迎は事前予約が必要か。最終便は？'],
anniversary:['ケーキを宿へ直接注文できるか。保管・提供時刻は？','客室の飾り付け・持ち込み・撤去は可能か。料金は？','サプライズ演出は事前に相談できるか。','記念日プランの特典とキャンセル規定は？'],
luxury:['ラウンジ利用資格は客室タイプ・会員資格のどちらか。','ラウンジの提供時間・年齢制限・同伴者条件は？','朝食・駐車場・レイトチェックアウトは含まれるか。'],
city:['駅からの実際の徒歩時間と最終チェックイン時刻は？','朝食・駐車場・大浴場の利用条件は？','繁忙期のキャンセル料・宿泊税は？'],
value:['表示料金に税・サービス料・宿泊税は含まれるか。','朝食・駐車場・送迎の追加費用はいくらか。','返金不可プランと無料キャンセルプランの総額差は？']};
let all=[];
function safe(s){return String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function syncPref(){const reg=$('region').value,old=$('pref').value,ps=reg?regionPrefs[reg]:Object.values(regionPrefs).flat();$('pref').replaceChildren();const first=document.createElement('option');first.value='';first.textContent='都道府県を指定しない';$('pref').append(first);ps.forEach(p=>{const o=document.createElement('option');o.value=p;o.textContent=p;$('pref').append(o)});if(ps.includes(old))$('pref').value=old;}
function renderChecks(){const theme=$('theme').value,items=common.concat(specific[theme]||[]);$('checklist').innerHTML=items.map(x=>'<label class="pl-check"><input type="checkbox"><span>'+safe(x)+'</span></label>').join('');$('check-count').textContent='0 / '+items.length+' 項目確認';$('checklist').querySelectorAll('input').forEach(c=>c.addEventListener('change',()=>{$('check-count').textContent=$('checklist').querySelectorAll('input:checked').length+' / '+items.length+' 項目確認'}));}
function render(){const theme=$('theme').value,region=$('region').value,pref=$('pref').value,people=Number($('people').value),nights=Number($('nights').value),budget=Number($('budget').value);$('budget-result').textContent=Number.isFinite(budget)&&budget>0?'宿泊予算の目安：1人1泊 '+Math.floor(budget/people/nights).toLocaleString('ja-JP')+'円（入力予算を割った金額。実際の料金ではありません）':'宿泊予算を入力すると、1人1泊あたりの目安を表示します。';
let items=all.filter(s=>(!region||s.region===region)&&(!pref||s.pref===pref)&&(!kinds[theme].length||kinds[theme].includes(s.kind)));let widened=false;
if(!items.length&&kinds[theme].length){items=all.filter(s=>(!region||s.region===region)&&(!pref||s.pref===pref));widened=true;}
$('results-summary').textContent=items.length+'施設の掲載候補'+(widened?'。選択した宿タイプの掲載がないため、タイプを広げています。':'。')+'料金・空室・サービス適合性による推薦ではありません。';
$('results').innerHTML=items.slice(0,18).map(s=>{const verified=s.detail_verified===true;const url=/^https:\/\/[^"<> ]+$/.test(s.source||'')?s.source:'#';return '<article class="pl-card"><div class="pl-card-top"><span>'+safe(s.pref)+' / '+safe(s.kind)+'</span><span class="pl-badge '+(verified?'verified':'')+'">'+(verified?'一部詳細確認済み':'設備・サービス未確認')+'</span></div><h3>'+safe(s.name)+'</h3><p>'+(verified?'一部条件に公式出典あり。最新条件は要確認。':'施設名・都道府県は公式一覧等に基づく掲載候補。詳細は未確認。')+'</p><div class="pl-card-actions"><a href="'+safe(url)+'" target="_blank" rel="noopener noreferrer">公式出典 ↗</a><label><input type="checkbox" class="pl-compare" value="'+safe(s.id)+'"> 比較候補</label></div></article>'}).join('')||'<p>該当する施設がありません。地域を広げてください。</p>';
$('more').textContent=items.length>18?'18件を表示中 / 全'+items.length+'件。残りは全国一覧で確認できます。':'';
const u=new URL('../stays/',location.href);if(pref)u.searchParams.set('pref',pref);else if(region)u.searchParams.set('region',region);if(kinds[theme].length===1&&!widened)u.searchParams.set('kind',kinds[theme][0]);$('open-directory').href=u.toString();$('compare-picked').href='../compare/';$('compare-picked').textContent='選んだ宿を比較する（0/4）';$('selection-status').textContent='';
$('results').querySelectorAll('.pl-compare').forEach(c=>c.addEventListener('change',()=>{const checked=[...$('results').querySelectorAll('.pl-compare:checked')];if(checked.length>4){c.checked=false;$('selection-status').textContent='比較は4施設までです。';return;}const ids=checked.map(x=>x.value);$('selection-status').textContent='';$('compare-picked').href='../compare/'+(ids.length?'?ids='+encodeURIComponent(ids.join(',')):'');$('compare-picked').textContent='選んだ宿を比較する（'+ids.length+'/4）';}));renderChecks();}
$('region').addEventListener('change',syncPref);$('theme').addEventListener('change',renderChecks);$('planner-form').addEventListener('submit',e=>{e.preventDefault();render();$('results-title').focus();});$('print-checklist').addEventListener('click',()=>window.print());syncPref();renderChecks();
fetch('../data/stays.json',{cache:'no-store'}).then(r=>{if(!r.ok)throw new Error('HTTP '+r.status);return r.json()}).then(data=>{if(!Array.isArray(data.stays))throw new Error('invalid data');all=data.stays;$('data-status').textContent='掲載データ '+all.length+'施設を読み込みました。';const params=new URLSearchParams(location.search);if(params.has('theme')&&Object.prototype.hasOwnProperty.call(kinds,params.get('theme')))$('theme').value=params.get('theme');if(params.has('pref')){const target=params.get('pref');const found=Object.entries(regionPrefs).find(([,ps])=>ps.includes(target));if(found){$('region').value=found[0];syncPref();$('pref').value=target;}}render();}).catch(()=>{$('data-status').textContent='施設データを読み込めませんでした。再読み込みしてください。';$('data-status').classList.add('pl-error');$('results-summary').textContent='施設データの取得に失敗しました。';});
})();
