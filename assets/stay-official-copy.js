/* STAY SELECT | Copy verified source URL on each stay card | 2026-10-18 */
(()=>{'use strict';
 const list=document.getElementById('stay-list');if(!list)return;
 let live=document.getElementById('ss-official-copy-status');
 if(!live){live=document.createElement('p');live.id='ss-official-copy-status';live.setAttribute('role','status');live.setAttribute('aria-live','polite');live.className='ss-official-copy-status';list.before(live);}
 const copy=async(value)=>{
  if(navigator.clipboard&&window.isSecureContext){try{await navigator.clipboard.writeText(value);return true;}catch(_){}}
  const t=document.createElement('textarea');t.value=value;t.style.cssText='position:fixed;left:-9999px;top:0;opacity:0';document.body.appendChild(t);t.focus();t.select();let ok=false;try{ok=document.execCommand('copy');}catch(_){}t.remove();return ok;
 };
 for(const card of list.querySelectorAll('.ss-stay[data-stay-id]')){
  const links=card.querySelector('.ss-stay-links');if(!links||links.querySelector('.ss-official-copy'))continue;
  const source=[...links.querySelectorAll('a[href]')].find(a=>a.target==='_blank'&&/公式/.test(a.textContent||'')&&!a.hasAttribute('data-rakuten-link')&&!a.classList.contains('ss-official-search-link'));
  const href=source?.getAttribute('href')||'';if(!/^https:\/\//.test(href))continue;
  const name=card.querySelector('h2')?.textContent?.trim()||'宿';
  const btn=document.createElement('button');btn.type='button';btn.className='ss-official-copy';btn.textContent='公式参照URLをコピー';btn.setAttribute('aria-label',name+'の公式参照URLをコピー');
  btn.addEventListener('click',async()=>{const ok=await copy(href);live.textContent=ok?name+' の公式参照URLをコピーしました。': 'コピーできませんでした。公式参照リンクからURLをご確認ください。';btn.textContent=ok?'コピーしました ✓':'コピーできません';setTimeout(()=>{btn.textContent='公式参照URLをコピー';},1800);});
  links.appendChild(btn);
 }
})();
