/* STAY SELECT | 2026-10-17 | Prefecture coverage based only on live DOM cards. */
(()=>{'use strict';
const panel=document.getElementById('prefectures');
const list=document.getElementById('stay-list');
if(!panel||!list)return;
const anchors=[...panel.querySelectorAll('.ss-prefmap a[href]')];
const cards=[...list.querySelectorAll('.ss-stay[data-stay-id]')];
const counts=new Map();
for(const c of cards){const pref=c.dataset.pref;if(pref)counts.set(pref,(counts.get(pref)||0)+1)}
const items=[];
for(const a of anchors){const url=new URL(a.getAttribute('href'),document.baseURI);
 const pref=url.searchParams.get('pref');if(!pref)continue;
 const count=counts.get(pref)||0;
 // Avoid duplicate labels when script is re-executed.
 let badge=a.querySelector('.ss-pref-total');
 if(!badge){badge=document.createElement('small');badge.className='ss-pref-total';a.appendChild(badge)}
 badge.textContent=`${count}件`;
 a.dataset.level=count===0?'0':count<3?'1':count<7?'2':count<15?'3':'4';
 a.setAttribute('aria-label',`${pref}：掲載${count}施設`);
 a.title=`${pref}：${count}施設掲載`;
 items.push({pref,count,url:a.getAttribute('href')});
}
const top=document.getElementById('ss-pref-top');
if(top){top.replaceChildren();
 const headline=document.createElement('strong');headline.textContent='掲載数の多い都道府県';top.appendChild(headline);
 const row=document.createElement('div');row.className='ss-pref-top-links';
 items.filter(x=>x.count>0).sort((a,b)=>b.count-a.count||a.pref.localeCompare(b.pref,'ja')).slice(0,5).forEach(x=>{
  const link=document.createElement('a');link.href=x.url;link.textContent=`${x.pref} ${x.count}施設`;
  link.setAttribute('aria-label',`${x.pref}の${x.count}施設を見る`);row.appendChild(link);
 });top.appendChild(row);
}
})();
