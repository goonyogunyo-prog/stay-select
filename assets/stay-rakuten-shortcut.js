/* STAY SELECT | verified Rakuten affiliate filter shortcut | 2026-10-18 */
(()=>{'use strict';
const show=document.getElementById('ss-rakuten-show'),clear=document.getElementById('ss-rakuten-clear'),status=document.getElementById('ss-rakuten-status');
const booking=document.getElementById('booking'),business=document.getElementById('ss-business-toggle');
if(!show||!clear||!status||!booking||!business)return;
let before=null;
const cards=[...document.querySelectorAll('#stay-list .ss-stay[data-stay-id]')];
const eligible=cards.filter(c=>c.dataset.booking==='affiliate'&&c.querySelector('a[data-rakuten-link="true"][rel~="sponsored"]'));
const n=eligible.length;
show.textContent=`PRリンク付き${n}施設を表示`;
if(n!==33){status.textContent=`リンク整合性を確認できたのは${n}件です。33件揃うまで一括表示を停止します。`;show.disabled=true;return;}
function notify(el){el.dispatchEvent(new Event('change',{bubbles:true}));}
show.addEventListener('click',()=>{
 if(!before)before={booking:booking.value,business:business.checked};
 booking.value='affiliate';business.checked=true;
 notify(business);notify(booking);
 status.textContent='成果リンク付き33施設に絞り込みました。最初は24件表示、残りは「さらに表示する」から確認できます。ビジネスホテル22施設も含みます。他の検索条件が残る場合は件数が減ります。';
 show.setAttribute('aria-pressed','true');
});
clear.addEventListener('click',()=>{
 if(!before){status.textContent='このボタンで変更した条件はありません。';return;}
 booking.value=before.booking;business.checked=before.business;
 notify(business);notify(booking);
 before=null;show.setAttribute('aria-pressed','false');
 status.textContent='楽天リンクの絞り込みとビジネスホテル表示を元の状態に戻しました。';
});
})();
