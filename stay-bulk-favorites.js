/* STAY SELECT: save up to 24 currently displayed stays, preserving existing favorites. */
(()=>{'use strict';
const button=document.getElementById('ss-bulk-save'),status=document.getElementById('ss-bulk-save-status');
if(!button||!status)return;
const cards=[...document.querySelectorAll('.ss-stay[data-stay-id]')];
function visible(){return cards.filter(c=>!c.hidden).slice(0,24)}
function refresh(){const shown=visible();const pending=shown.filter(c=>c.querySelector('.ss-favorite-pick')?.getAttribute('aria-pressed')!=='true');button.disabled=shown.length===0;
button.textContent=`★ 表示中の宿をまとめて保存（${Math.min(24,shown.length)}施設）`;button.setAttribute('aria-label',`表示中の${shown.length}施設のうち未保存の宿をお気に入りへ追加する`);}
button.addEventListener('click',()=>{const shown=visible();let added=0,already=0;for(const c of shown){const pick=c.querySelector('.ss-favorite-pick');if(!pick)continue;if(pick.getAttribute('aria-pressed')==='true'){already++;continue;}pick.click();added++;}
status.textContent=shown.length?`${added}施設を新しく保存しました（すでに保存済み ${already}施設）。既存のお気に入り・比較候補は維持しています。`:'現在表示中の宿がありません。検索条件を変更してください。';refresh();});
window.addEventListener('ss:results',()=>queueMicrotask(refresh));document.addEventListener('visibilitychange',()=>{if(!document.hidden)refresh()});refresh();
})();
