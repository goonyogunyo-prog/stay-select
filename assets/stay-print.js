/* STAY SELECT | comparison print / save as PDF | 2026-10-17 */
(()=>{'use strict';
const button=document.getElementById('ss-compare-print');
const feedback=document.getElementById('compare-feedback');
const results=document.getElementById('compare-result');
if(!button||!results)return;
button.addEventListener('click',()=>{
 if(results.hidden){if(feedback)feedback.textContent='比較候補を1施設以上追加してから印刷してください。';return;}
 if(feedback)feedback.textContent='印刷画面で「PDFに保存」を選ぶと比較表を保存できます。料金・設備は必ず公式情報で確認してください。';
 try{window.print()}catch(_){if(feedback)feedback.textContent='印刷画面を開けませんでした。ブラウザの印刷メニューをご利用ください。';}
});
})();
