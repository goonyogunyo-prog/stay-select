/* STAY SELECT | official individual hotel website discovery (search links, not verified destinations) | 2026-10-18 */
(()=>{'use strict';
const list=document.getElementById('stay-list'),status=document.getElementById('ss-official-search-status');
if(!list)return;
let added=0;
for(const card of list.querySelectorAll('.ss-stay[data-stay-id]')){
 const title=card.querySelector('h2')?.textContent?.trim();const links=card.querySelector('.ss-stay-links');
 if(!title||!links||links.querySelector('.ss-official-search-link'))continue;
 const a=document.createElement('a');a.className='ss-official-search-link';
 a.href='https://www.google.com/search?q='+encodeURIComponent('"'+title+'" 公式サイト');
 a.target='_blank';a.rel='noopener noreferrer';
 a.textContent='Googleで宿の公式サイトを探す ↗';
 a.setAttribute('aria-label',title+'の公式サイトをGoogleで検索する（検索結果は未照合）');
 a.title='Google検索結果です。公式ページと確認されたリンクではありません。';
 links.appendChild(a);added++;
}
if(status)status.textContent=added+'施設で公式サイトの個別検索が使えます（検索結果の真偽は未確認）。';
})();
