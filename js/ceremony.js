(function(){
  var d=document.getElementById('phDlg'),im=document.getElementById('phImg'),cp=document.getElementById('phCap'),list=[].slice.call(document.querySelectorAll('.ph')),i=0;
  function show(k){i=(k+list.length)%list.length;var b=list[i];im.src=b.querySelector('img').src;im.alt=b.dataset.cap;cp.textContent=b.dataset.cap;}
  list.forEach(function(b,k){b.addEventListener('click',function(){show(k);try{d.showModal()}catch(e){d.setAttribute('open','')}})});
  document.getElementById('phPrev').onclick=function(){show(i-1)};document.getElementById('phNext').onclick=function(){show(i+1)};
  document.getElementById('phClose').onclick=function(){d.close()};d.addEventListener('click',function(e){if(e.target===d)d.close()});
  d.addEventListener('keydown',function(e){if(e.key==='ArrowRight')show(i+1);if(e.key==='ArrowLeft')show(i-1)});
})();
(function(){var b=document.getElementById('langBtn');if(b)b.addEventListener('click',function(){setLang(LANG==='es'?'en':'es')});
var s='en';try{s=localStorage.getItem('creatively-lang')||'en'}catch(e){}if(s==='es')setLang('es');})();
