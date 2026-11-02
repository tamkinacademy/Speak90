/* পরীক্ষার প্রশ্ন বানানোর ইঞ্জিন। একই seed দিলে সবসময় একই প্রশ্ন আসে।
   সাইট আর অ্যাডমিন দুই জায়গাতেই এটা চলে, তাই অ্যাডমিন উত্তর যাচাই করতে পারে। */
(function(){
  function hash(str){let h=2166136261;for(let i=0;i<str.length;i++){h^=str.charCodeAt(i);h=Math.imul(h,16777619)}return h>>>0}
  function rng(seed){let a=hash(String(seed));return function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
  function shuffle(arr,r){const a=arr.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(r()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
  function gen(seed,n){
    n=n||30;const r=rng(seed),Q=window.QBANK||[],V=window.VOCAB||[];
    const gN=Math.min(Math.ceil(n/2),Q.length),vN=n-gN;
    const gq=shuffle(Q,r).slice(0,gN).map(q=>{
      const idx=shuffle([0,1,2,3],r);
      return {k:'g',q:q.q,o:idx.map(i=>q.o[i]),a:idx.indexOf(q.a),e:q.e}
    });
    const words=[];V.forEach(t=>t.w.forEach(w=>{if(!/ = |—/.test(w[0])&&w[1].length<32&&w[0].length<24)words.push(w)}));
    const seen={},pool=words.filter(w=>{if(seen[w[0]])return false;seen[w[0]]=1;return true});
    const vq=shuffle(pool,r).slice(0,vN).map((w,i)=>{
      const rev=i%2===1,opts=[rev?w[0]:w[1]];
      while(opts.length<4){const c=pool[Math.floor(r()*pool.length)],x=rev?c[0]:c[1];if(!opts.includes(x)&&c[0]!==w[0])opts.push(x)}
      const o=shuffle(opts,r);
      return {k:'v',q:rev?('"'+w[1]+'" এর ইংরেজি কোনটি?'):('"'+w[0]+'" এর অর্থ কী?'),o,a:o.indexOf(rev?w[0]:w[1]),e:w[0]+' = '+w[1]}
    });
    return shuffle(gq.concat(vq),r);
  }
  function score(seed,n,ans){const qs=gen(seed,n);let s=0;qs.forEach((q,i)=>{if(ans[i]===q.a)s++});return s}
  window.EXAM={gen,score};
})();
