(function(){
  var photo=document.querySelector('.photo'),all=document.getElementById('showall'),pinned=null,hov=null;
  function render(){
    var a=hov||pinned;
    document.querySelectorAll('[data-p]').forEach(function(el){el.classList.toggle('on',el.dataset.p===a)});
    photo.classList.toggle('focus',!!a);
  }
  function pin(p){pinned=(pinned===p)?null:p;render();}
  document.querySelectorAll('.hit').forEach(function(el){
    el.addEventListener('mouseenter',function(){hov=el.dataset.p;render()});
    el.addEventListener('mouseleave',function(){hov=null;render()});
    el.addEventListener('click',function(){pin(el.dataset.p)});
    el.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();pin(el.dataset.p)}});
  });
  photo.addEventListener('click',function(e){if(!e.target.classList.contains('hit')&&pinned){pinned=null;render()}});
  document.querySelectorAll('.mem').forEach(function(el){
    el.addEventListener('click',function(){pin(el.dataset.p);if(pinned)photo.scrollIntoView({behavior:'smooth',block:'center'})});
  });
  all.addEventListener('click',function(){
    var on=all.getAttribute('aria-pressed')!=='true';
    all.setAttribute('aria-pressed',String(on));all.textContent=T(on?'Hide names':'Show all names');
    photo.classList.toggle('all',on);if(on){pinned=null;hov=null;render()}
  });
})();
  /* events tabs + photo viewer */
  var tabs=[].slice.call(document.querySelectorAll('.ev-tab'));
  function selTab(tb){tabs.forEach(function(x){var on=x===tb;x.classList.toggle('on',on);x.setAttribute('aria-selected',on);document.getElementById(x.getAttribute('aria-controls')).hidden=!on;});}
  tabs.forEach(function(tb,i){tb.addEventListener('click',function(){selTab(tb)});
    tb.addEventListener('keydown',function(e){var d=e.key==='ArrowRight'?1:e.key==='ArrowLeft'?-1:0;if(d){var n=tabs[(i+d+tabs.length)%tabs.length];n.focus();selTab(n);}});});
  document.querySelectorAll('.ev-photos').forEach(function(box){
    box.querySelectorAll('.yr-chip').forEach(function(ch){ch.addEventListener('click',function(){
      box.querySelectorAll('.yr-chip').forEach(function(x){var on=x===ch;x.classList.toggle('on',on);x.setAttribute('aria-pressed',on)});
      box.querySelectorAll('.ev-year').forEach(function(y){y.hidden=y.dataset.y!==ch.dataset.y});});});});
  var phDlg=document.getElementById('phDlg'),phImg=document.getElementById('phImg'),phCap=document.getElementById('phCap'),phList=[],phI=0;
  var phVid=document.getElementById('phVid');function showPh(i){phI=(i+phList.length)%phList.length;var b=phList[phI],v=b.querySelector('video');phVid.pause();if(v){phImg.hidden=true;phVid.hidden=false;phVid.src=v.src;phVid.play().catch(function(){});}else{phVid.hidden=true;phVid.removeAttribute('src');phImg.hidden=false;phImg.src=b.querySelector('img').src;phImg.alt=b.dataset.cap;}phCap.textContent=b.dataset.cap;}
  document.querySelectorAll('.ph').forEach(function(b){b.addEventListener('click',function(){
    phList=[].slice.call(b.parentNode.querySelectorAll('.ph'));showPh(phList.indexOf(b));try{phDlg.showModal()}catch(e){phDlg.setAttribute('open','')}});});
  document.getElementById('phPrev').addEventListener('click',function(){showPh(phI-1)});
  document.getElementById('phNext').addEventListener('click',function(){showPh(phI+1)});
  document.getElementById('phClose').addEventListener('click',function(){phDlg.close()});phDlg.addEventListener('close',function(){phVid.pause()});
  phDlg.addEventListener('click',function(e){if(e.target===phDlg)phDlg.close()});
  phDlg.addEventListener('keydown',function(e){if(e.key==='ArrowRight')showPh(phI+1);if(e.key==='ArrowLeft')showPh(phI-1)});
  /* members carousel */
  var mbT=document.getElementById('mbTrack'),mbS=[].slice.call(mbT.querySelectorAll('.mb-slide')),mbD=[].slice.call(document.querySelectorAll('.mb-dot')),mbP=document.getElementById('mbPrev'),mbN=document.getElementById('mbNext'),mbI=0;
  function mbGo(i){i=(i+mbS.length)%mbS.length;mbT.scrollTo({left:i*mbT.clientWidth,behavior:'smooth'});}
  function mbSync(){var i=Math.round(mbT.scrollLeft/mbT.clientWidth);mbI=i;mbD.forEach(function(d,k){d.classList.toggle('on',k===i)});}
  mbT.addEventListener('scroll',function(){mbSync()},{passive:true});
  mbP.addEventListener('click',function(){mbGo(mbI-1)});mbN.addEventListener('click',function(){mbGo(mbI+1)});
  mbD.forEach(function(d){d.addEventListener('click',function(){mbGo(+d.dataset.i)})});
  mbT.addEventListener('keydown',function(e){if(e.key==='ArrowRight'){e.preventDefault();mbGo(mbI+1)}if(e.key==='ArrowLeft'){e.preventDefault();mbGo(mbI-1)}});
  /* mural process */
  document.querySelectorAll('.pv').forEach(function(pv){
    var tabs=[].slice.call(pv.querySelectorAll('.pv-tab')),murals=[].slice.call(pv.querySelectorAll('.pv-mural'));
    murals.forEach(function(m){
      var steps=[].slice.call(m.querySelectorAll('.pv-step')),dots=[].slice.call(m.querySelectorAll('.pv-dot')),n=steps.length,cur=0,timer=null;
      var fill=m.querySelector('.pv-fill'),badge=m.querySelector('.pv-badge'),cap=m.querySelector('.pv-cap'),prev=m.querySelector('.pv-nav.prev'),next=m.querySelector('.pv-nav.next'),play=m.querySelector('.pv-play');
      m.querySelector('.pv-track').style.setProperty('--n',n);
      function go(i){cur=Math.max(0,Math.min(n-1,i));steps.forEach(function(s,k){s.classList.toggle('on',k===cur)});
        dots.forEach(function(d,k){d.classList.toggle('on',k===cur);d.classList.toggle('done',k<cur)});
        fill.style.width=(n>1?cur/(n-1)*100:0)+'%';var fin=cur===n-1;badge.textContent=fin?T('★ Final product'):(LANG==='es'?'Paso ':'Step ')+(cur+1)+(LANG==='es'?' de ':' of ')+n;badge.classList.toggle('fin',fin);
        cap.textContent=steps[cur].dataset.cap;prev.disabled=cur===0;next.disabled=fin;}
      function stop(){clearInterval(timer);timer=null;play.textContent=T('▶ Play the process');}
      prev.addEventListener('click',function(){stop();go(cur-1)});next.addEventListener('click',function(){stop();go(cur+1)});
      dots.forEach(function(d){d.addEventListener('click',function(){stop();go(+d.dataset.i)})});
      play.addEventListener('click',function(){if(timer){stop();return}if(cur===n-1)go(0);play.textContent=T('❚❚ Pause');timer=setInterval(function(){if(cur>=n-1){stop();return}go(cur+1)},1700);});
      m._stop=stop;m._refresh=function(){go(cur);play.textContent=T(timer?'❚❚ Pause':'▶ Play the process')};go(0);
    });
    tabs.forEach(function(tb){tb.addEventListener('click',function(){tabs.forEach(function(x){var on=x===tb;x.classList.toggle('on',on);x.setAttribute('aria-pressed',on)});
      murals.forEach(function(m){if(m._stop)m._stop();m.hidden=m.dataset.m!==tb.dataset.m});});});
  });
  /* theme prompts */
  var dlg=document.getElementById('edDlg'),body=document.getElementById('edBody'),curEd=0;
  function showEd(k){curEd=(k+4)%4;body.innerHTML='';body.appendChild(document.getElementById('ed'+curEd).content.cloneNode(true));if(LANG==='es')_trRoot(body);dlg.scrollTop=0;}
  function openEd(k){showEd(k);if(!dlg.open){try{dlg.showModal()}catch(e){dlg.setAttribute('open','')}}}
  document.querySelectorAll('.chip[data-ed]').forEach(function(c){
    c.addEventListener('click',function(){openEd(+c.dataset.ed)});
    c.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();openEd(+c.dataset.ed)}});
  });
  document.getElementById('edClose').addEventListener('click',function(){dlg.close()});
  document.getElementById('edPrev').addEventListener('click',function(){showEd(curEd-1)});
  document.getElementById('edNext').addEventListener('click',function(){showEd(curEd+1)});
  dlg.addEventListener('click',function(e){if(e.target===dlg)dlg.close()});
  dlg.addEventListener('keydown',function(e){if(e.key==='ArrowRight')showEd(curEd+1);if(e.key==='ArrowLeft')showEd(curEd-1)});
  dlg.addEventListener('close',function(){var c=document.querySelector('.chip[data-ed="'+curEd+'"]');if(c)c.focus({preventScroll:true})});
  /* mascot */
  var bulb=document.getElementById('bulb'),bub=document.getElementById('bubble'),cur=null,tm=null;
  function bw(){return bulb.offsetWidth}
  function bh(){return bulb.offsetHeight}
  function home(){cur=null;document.querySelectorAll('[data-bulb].lit').forEach(function(e){e.classList.remove('lit')});
    var x=window.innerWidth-bw()-16,y=window.innerHeight-bh()-16;bulb.style.transform='translate('+x+'px,'+y+'px)';bulb.classList.remove('talk');bulb.classList.add('r');}
  function place(){if(!cur)return;var r=cur.getBoundingClientRect(),vw=window.innerWidth,vh=window.innerHeight;
    var isCut=cur.classList.contains('cut'),x,y;
    if(isCut){var pr=document.querySelector('.photo').getBoundingClientRect();
      x=Math.min(Math.max(8,r.left+r.width/2-bw()/2),vw-bw()-8);
      y=pr.top-bh()*.9;
      if(y<120)y=pr.bottom<=vh?pr.bottom-bh()*.15:vh-bh()-8;}
    else if(cur.classList.contains('ev-tab')){var tr=cur.parentNode.getBoundingClientRect();if(vw>760){x=tr.right-bw()-10;y=tr.top-bh()+6;}else{x=Math.min(Math.max(8,r.left+r.width/2-bw()/2),vw-bw()-8);y=r.top-bh()+6;}if(y<70)y=Math.min(tr.bottom+4,vh-bh()-8);}
    else{x=Math.min(r.right-bw()*.55,vw-bw()-8);y=r.top-bh()*.55;
      if(y<70)y=Math.min(Math.max(70,r.top+10),vh-bh()-8);}
    x=Math.max(8,x);bulb.classList.toggle('r',x>vw-bw()-180);bulb.style.transform='translate('+x+'px,'+y+'px)';}
  function go(el,txt){clearTimeout(tm);if(cur&&cur!==el)cur.classList.remove('lit');cur=el;if(el.dataset.bulb)el.classList.add('lit');bub.textContent=T(txt||el.dataset.bulb);bulb.classList.add('talk');place();}
  document.querySelectorAll('[data-bulb]').forEach(function(el){
    el.addEventListener('mouseenter',function(){go(el)});
    el.addEventListener('mouseleave',function(){tm=setTimeout(home,700)});
    el.addEventListener('focusin',function(){go(el)});
    el.addEventListener('touchstart',function(){go(el);clearTimeout(tm);tm=setTimeout(home,3500)},{passive:true});
  });
  var tips=['Hi! I\'m the Creatively bulb.','Think outside the box!','Join the Creative Challenge!'],ti=0;
  bulb.addEventListener('click',function(){bulb.classList.remove('hop');void bulb.offsetWidth;bulb.classList.add('hop');
    if(!cur){bub.textContent=T(tips[ti++%tips.length]);bulb.classList.add('talk');clearTimeout(tm);tm=setTimeout(function(){bulb.classList.remove('talk')},2500);}});
  var says={meizi:'She was in charge of the merch for the Fall Festival and Kermes!',
    liang:"He's funny and does the heavy lifting for the club, hehehe",
    yuslly:'The best president! She expanded the Creative Challenge to other schools!',
    ashley:"She's full of ideas and organized our events!",
    melissa:"Amazing secretary, she's always there when we need her!"};
  function cutOf(p){return document.querySelector('.cut[data-p="'+p+'"]')}
  var since={meizi:'Joined us in 2021!',liang:'Joined us in 2023!',yuslly:'Co-founder!',ashley:'Co-founder!',melissa:'Joined us in 2022!'};
  document.querySelectorAll('.hit,.mem').forEach(function(el){
    var p=el.dataset.p,msg=el.classList.contains('hit')?since[p]:says[p];
    el.addEventListener('mouseenter',function(){go(cutOf(p),msg)});
    el.addEventListener('mouseleave',function(){tm=setTimeout(home,900)});
    el.addEventListener('focus',function(){go(cutOf(p),msg)});
    el.addEventListener('click',function(){go(cutOf(p),msg);clearTimeout(tm);tm=setTimeout(home,5000)});
  });
  var tabSay={"open": "We presented to parents!", "fall": "We worked as a team!", "kermes": "We collab with other clubs to create meaningful activities!", "wall": "Paint. Paint. Paint!", "bake": "We made the delicious crepes!", "aware": "We spread awareness on important days!", "meet": "We got to stay active!", "mentor": "We help others!", "funblock": "Arrr! We are pirates searching for our treasure!"};
  document.querySelectorAll('.ev-tab').forEach(function(tb){var k=tb.id.replace('tab-','');if(!tabSay[k])return;
    tb.addEventListener('mouseenter',function(){go(tb,tabSay[k])});
    tb.addEventListener('focus',function(){go(tb,tabSay[k])});
    tb.addEventListener('click',function(){go(tb,tabSay[k]);clearTimeout(tm);tm=setTimeout(home,3500)});});
  window.addEventListener('scroll',function(){if(cur)place()},{passive:true});
  window.addEventListener('resize',function(){cur?place():home()});
  bulb.style.transition='none';home();requestAnimationFrame(function(){requestAnimationFrame(function(){bulb.style.transition='';
    bub.textContent=T(tips[0]);bulb.classList.add('talk');setTimeout(function(){if(!cur)bulb.classList.remove('talk')},3000);});});
(function(){var b=document.getElementById('langBtn');if(b)b.addEventListener('click',function(){setLang(LANG==='es'?'en':'es')});
var s='en';try{s=localStorage.getItem('creatively-lang')||'en'}catch(e){}if(s==='es')setLang('es');})();

(function(){var b=document.getElementById('themeBtn');if(!b)return;var mq=window.matchMedia?matchMedia('(prefers-color-scheme: dark)'):null;
function cur(){var a=document.documentElement.getAttribute('data-theme');return a||(mq&&mq.matches?'dark':'light');}
b.addEventListener('click',function(){var n=cur()==='dark'?'light':'dark';document.documentElement.setAttribute('data-theme',n);try{localStorage.setItem('creatively-theme',n)}catch(e){}
  b.setAttribute('aria-label',n==='dark'?'Switch to light mode':'Switch to dark mode');});})();
