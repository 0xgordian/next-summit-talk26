(()=>{
const stage=document.getElementById('stage');
const fit=()=>{const s=Math.min(innerWidth/1920,innerHeight/1080);stage.style.transform=`translate(-50%,-50%) scale(${s})`;};
addEventListener('resize',fit);fit();
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const REDUCED=matchMedia('(prefers-reduced-motion: reduce)').matches;
let STILL=/[?&]still/.test(location.search)||REDUCED;
let INSTANT=STILL;
if(STILL)stage.classList.add('still');
if(/[?&]still/.test(location.search))stage.classList.add('instant');

/* ---------- text helpers ---------- */
$$('.split').forEach(el=>{let i=0;const walk=n=>{[...n.childNodes].forEach(c=>{if(c.nodeType===3){const f=document.createDocumentFragment();c.textContent.split(/(\s+)/).forEach(p=>{if(!p)return;if(/^\s+$/.test(p)){f.appendChild(document.createTextNode(' '));return;}const w=document.createElement('span');w.className='w';const x=document.createElement('i');x.textContent=p;x.style.setProperty('--wi',i++);w.appendChild(x);f.appendChild(w);});c.replaceWith(f);}else if(c.nodeType===1&&c.tagName!=='BR'&&!c.classList.contains('swap'))walk(c);else if(c.nodeType===1&&c.classList.contains('swap')){const w=document.createElement('span');w.className='w';const x=document.createElement('i');x.style.setProperty('--wi',i++);c.replaceWith(w);w.appendChild(x);x.appendChild(c);}});};walk(el);});
$$('[data-d]').forEach(el=>el.style.setProperty('--d',el.dataset.d));
$$('.tw').forEach(el=>el.dataset.text=el.textContent);
function type(el,text,speed=26,delay=0,done){clearInterval(el._t);clearTimeout(el._to);el.textContent='';el.classList.remove('typing');
  if(INSTANT){el.textContent=text;done&&done();return;}
  el._to=setTimeout(()=>{let k=0;el.classList.add('typing');el._t=setInterval(()=>{k++;el.textContent=text.slice(0,k);if(k>=text.length){clearInterval(el._t);el.classList.remove('typing');done&&done();}},speed);},delay);}
function setIn(el,on){if(on===el.classList.contains('in'))return;el.classList.toggle('in',on);
  if(el.classList.contains('tw')){on?type(el,el.dataset.text,28,+(el.dataset.d||0)):(clearInterval(el._t),clearTimeout(el._to),el.textContent='');}}

/* ---------- demos ---------- */
const T=(el,fn,ms)=>{(el._tm=el._tm||[]).push(setTimeout(fn,ms));};
const clearT=el=>{(el._tm||[]).forEach(clearTimeout);el._tm=[];(el._iv||[]).forEach(clearInterval);el._iv=[];};
const IV=(el,fn,ms)=>{(el._iv=el._iv||[]).push(setInterval(fn,ms));};
function stream(el,host,text,done){const toks=text.match(/\S+\s*/g);let k=0;host.textContent='';host.classList.add('typing');
  const step=()=>{if(k>=toks.length){host.classList.remove('typing');done&&done();return;}host.textContent+=toks[k++];T(el,step,40+Math.random()*70);};step();}
function typeInto(el,host,text,cps,done){let k=0;host.textContent='';const step=()=>{k++;host.textContent=text.slice(0,k);if(k<text.length)T(el,step,1000/cps);else done&&done();};step();}
const ANS="Most people quit at three points: too many fields before they see any value, an OTP code that never arrives, and errors that don't say what went wrong.";
const LOOP=['Find a real problem','Know who it affects','Build it with the right tools','Test it so it is usable','Write down your choices','Share it and ask for feedback','Improve it, start the next one'];
const DEMOS={
 cover:{run(el){const w=$$('.wd',el);const hot=i=>w.forEach((x,j)=>x.classList.toggle('hot',j===i));hot(-1);T(el,()=>hot(0),1300);T(el,()=>hot(1),1900);T(el,()=>hot(2),2500);},
        finish(el){$$('.wd',el).forEach((x,j)=>x.classList.toggle('hot',j===2));},reset(el){$$('.wd',el).forEach(x=>x.classList.remove('hot'));}},
 chat:{run(el){this.reset(el);const b=$('.bub',el),w=$('.work',el),a=$('.ans',el),c=$('.chkl',el);
   T(el,()=>b.classList.add('on'),300);T(el,()=>w.classList.add('on'),1000);
   T(el,()=>{w.classList.add('done');$('.lbl',w).textContent='Read 4 sources';stream(el,a,ANS,()=>T(el,()=>c.classList.add('on'),300));},2600);},
   finish(el){$('.bub',el).classList.add('on');const w=$('.work',el);w.classList.add('on','done');$('.lbl',w).textContent='Read 4 sources';$('.ans',el).textContent=ANS;$('.chkl',el).classList.add('on');},
   reset(el){$$('.on',el).forEach(x=>x.classList.remove('on'));const w=$('.work',el);w.classList.remove('done');$('.lbl',w).textContent='Researching · 4 sources';$('.ans',el).textContent='';}},
 diff:{run(el){this.reset(el);const d=$('.del',el),a=$$('.add',el),r=$('.rvbox',el),f=$('.foot2',el);
   T(el,()=>d.classList.add('gone'),900);
   T(el,()=>{a[0].classList.add('on');typeInto(el,$('.tt',a[0]),$('.tt',a[0]).dataset.t,42,()=>{a[1].classList.add('on');typeInto(el,$('.tt',a[1]),$('.tt',a[1]).dataset.t,42,()=>{T(el,()=>f.classList.add('on'),300);T(el,()=>r.classList.add('on'),900);});});},1400);},
   finish(el){$('.del',el).classList.add('gone');$$('.add',el).forEach(a=>{a.classList.add('on');$('.tt',a).textContent=$('.tt',a).dataset.t;});$('.rvbox',el).classList.add('on');$('.foot2',el).classList.add('on');},
   reset(el){$('.del',el).classList.remove('gone');$$('.add',el).forEach(a=>{a.classList.remove('on');$('.tt',a).textContent='';});$('.rvbox',el).classList.remove('on');$('.foot2',el).classList.remove('on');}},
 build:{run(el){this.reset(el);const l1=$('.l1',el),l2=$('.l2',el);T(el,()=>$('.bub',l1).classList.add('on'),300);T(el,()=>$('.work',l1).classList.add('on'),1000);
   T(el,()=>{l1.classList.add('off');l2.classList.remove('off');$$('.r',l2).forEach((r,i)=>T(el,()=>r.classList.add('on'),300+i*220));},2800);},
   finish(el){$('.l1',el).classList.add('off');$('.l2',el).classList.remove('off');$$('.r',el).forEach(r=>r.classList.add('on'));},
   reset(el){const l1=$('.l1',el);l1.classList.remove('off');$('.l2',el).classList.add('off');$$('.on',el).forEach(x=>x.classList.remove('on'));}},
 deploy:{run(el){this.reset(el);const st=$$('.st',el),ln=$$('.ln2',el);
   st.forEach((s,i)=>{T(el,()=>s.classList.add('on'),400+i*1100);T(el,()=>{s.classList.remove('on');s.classList.add('ok');ln[i]&&ln[i].classList.add('on');},1200+i*1100);});
   T(el,()=>$('.share',el).classList.add('on'),3700);T(el,()=>{const c=$('.cp',el);c.textContent='COPIED';c.classList.add('ok');},4700);},
   finish(el){$$('.st',el).forEach(s=>{s.classList.remove('on');s.classList.add('ok');});$$('.ln2',el).forEach(l=>l.classList.add('on'));$('.share',el).classList.add('on');const c=$('.cp',el);c.textContent='COPIED';c.classList.add('ok');},
   reset(el){$$('.st',el).forEach(s=>s.classList.remove('on','ok'));$$('.ln2',el).forEach(l=>l.classList.remove('on'));$('.share',el).classList.remove('on');const c=$('.cp',el);c.textContent='COPY LINK';c.classList.remove('ok');}},
 strip:{run(el){const d=$$('div',el);let k=0;const f=()=>{d.forEach((x,j)=>{x.classList.toggle('on',j===k);x.classList.toggle('past',j<k);});if(k<d.length-1){k++;T(el,f,950);}};T(el,f,900);},
   finish(el){const d=$$('div',el);d.forEach((x,j)=>{x.classList.toggle('on',j===d.length-1);x.classList.toggle('past',j<d.length-1);});},reset(el){$$('div',el).forEach(x=>x.classList.remove('on','past'));}},
 state:{run(el){const l=$('.sl',el);el.classList.remove('wait');l.textContent='AI · THINKING';T(el,()=>l.textContent='AI · WORKING',1100);T(el,()=>{el.classList.add('wait');l.textContent='AI · WAITING FOR YOU';},2300);},
   finish(el){el.classList.add('wait');$('.sl',el).textContent='AI · WAITING FOR YOU';},reset(el){el.classList.remove('wait');$('.sl',el).textContent='AI · WORKING';}},
 post:{run(el){const sl=el.closest('.slide');let k=0;const f=()=>{hlPart(sl,k);k++;if(k<=5)T(el,f,1500);};T(el,f,1200);},finish(el){hlPart(el.closest('.slide'),-1);},reset(el){hlPart(el.closest('.slide'),-1);}},
 swap:{run(el){const ws=el.dataset.words.split('|');const sp=$('.sw',el);let k=0;sp.textContent=ws[0];
   const f=()=>{k++;if(k>=ws.length)return;sp.classList.add('up');T(el,()=>{sp.classList.remove('up');sp.classList.add('dn');sp.textContent=ws[k];void sp.offsetWidth;sp.classList.remove('dn');if(k<ws.length-1)T(el,f,750);},420);};T(el,f,1500);},
   finish(el){const ws=el.dataset.words.split('|');$('.sw',el).textContent=ws[ws.length-1];},reset(el){this.finish(el);}},
 loop:{run(el){let k=0;const tx=$('.tx',el),lb=$('.u-label',el),dots=$$('.dot',el),arc=$('.arc',el);
   const f=()=>{lb.textContent='STAGE 0'+(k+1)+' / 07';type(tx,LOOP[k],24);dots.forEach((d,j)=>d.classList.toggle('on',j<=k));arc.style.strokeDashoffset=1131*(1-(k+1)/7);k=(k+1)%7;};f();IV(el,f,2800);},
   finish(el){$('.u-label',el).textContent='STAGE 07 / 07';$('.tx',el).textContent=LOOP[6];$$('.dot',el).forEach(d=>d.classList.add('on'));$('.arc',el).style.strokeDashoffset=0;},
   reset(el){$$('.dot',el).forEach(d=>d.classList.remove('on'));$('.arc',el).style.strokeDashoffset=1131;$('.tx',el).textContent='';}},
 flip:{build(el){if(el._b)return;el._b=1;el.innerHTML='';'00:00:00'.split('').forEach(ch=>{const s=document.createElement('span');if(ch===':'){s.className='cl';s.textContent=':';}else{s.className='dg';s.innerHTML='<span></span>';}el.appendChild(s);});},
   set(el,str,anim){const dg=$$('.dg',el);str.replace(/:/g,'').split('').forEach((c,i)=>{const d=dg[i];const cur=d.dataset.v;if(cur===c)return;d.dataset.v=c;
     if(!anim||INSTANT){d.innerHTML=`<span>${c}</span>`;return;}const o=d.lastElementChild;if(o){o.className='old';setTimeout(()=>o.remove(),450);}const n=document.createElement('span');n.className='nx';n.textContent=c;d.appendChild(n);});},
   fmt(ms){const h=Math.floor(ms/3600e3),m=Math.floor(ms/6e4)%60,s=Math.floor(ms/1e3)%60;return [h,m,s].map(v=>String(v).padStart(2,'0')).join(':');},
   run(el){this.build(el);this.set(el,'48:00:00',false);const end=Date.now()+48*3600e3+900;IV(el,()=>this.set(el,this.fmt(end-Date.now()),true),250);},
   finish(el){this.build(el);this.set(el,'48:00:00',false);},reset(el){this.build(el);this.set(el,'48:00:00',false);}},
};
function hlPart(sl,k){$$('[data-p]',sl).forEach(x=>x.classList.toggle('hl',+x.dataset.p===k));}
function demoVisible(el){const h=el.closest('[data-s]');return !h||h.classList.contains('in');}
function syncDemos(sl,force){$$('[data-demo]',sl).forEach(el=>{const D=DEMOS[el.dataset.demo];if(!D)return;const vis=!force&&demoVisible(el)&&sl.classList.contains('active')||force==='finish';
  if(vis&&!el._on){el._on=true;clearT(el);(INSTANT||STILL)?D.finish(el):setTimeout(()=>{if(el._on)D.run(el);},+(el.closest('[data-s]')?.dataset.d||0)*0);}
  else if(!vis&&el._on){el._on=false;clearT(el);D.reset(el);}});}
$$('[data-replay]').forEach(b=>b.addEventListener('click',e=>{e.stopPropagation();const el=$('[data-demo]',b.closest('.win'));if(!el)return;const D=DEMOS[el.dataset.demo];clearT(el);D.reset(el);STILL?D.finish(el):D.run(el);}));

/* ---------- deck core ---------- */
const slides=$$('.slide');let cur=-1,step=0,hideOpt=false,busy=false,overview=false;
const hudLabel=$('#hudLabel'),hudNum=$('#hudNumTxt'),lvlTxt=$('#lvlTxt'),segs=$$('.segs i'),pipsEl=$('.pips'),planetEl=$('#planet'),wipe=$('#wipe');
const CTL={};
function maxStep(sl){const c=CTL[sl.id];return c&&c.max!==undefined?c.max(sl):+(sl.dataset.steps||0);}
function apply(sl,st){$$('[data-s]',sl).forEach(el=>{const s=+el.dataset.s,u=el.dataset.until;setIn(el,st>=s&&(u===undefined||st<=+u));});
  const c=CTL[sl.id];c&&c.onStep&&c.onStep(sl,st);if(sl===slides[cur])pips(sl,st);syncDemos(sl);}
function pips(sl,st){const m=maxStep(sl);pipsEl.innerHTML='';for(let i=1;i<=m;i++){const p=document.createElement('i');if(i<=st)p.className='on';pipsEl.appendChild(p);}}
function setPlanet(mode){planetEl.classList.remove('off','dim');if(mode==='off')planetEl.classList.add('off');if(mode==='dim')planetEl.classList.add('dim');window.planet&&window.planet.set(mode==='off'?0:mode==='dim'?.7:1);}
const isLight=sl=>sl.classList.contains('light');
let lastLvl=0;
function hud(sl){const n=slides.indexOf(sl)+1;hudNum.textContent=String(n).padStart(2,'0')+' / '+String(slides.length).padStart(2,'0');
  const lvl=+sl.dataset.lvl;lvlTxt.textContent='LVL '+String(lvl).padStart(2,'0')+(lvl>=7?' · MAX':'');
  if(lvl!==lastLvl&&!STILL){lvlTxt.classList.remove('flash');void lvlTxt.offsetWidth;lvlTxt.classList.add('flash');}
  segs.forEach((s,k)=>{s.style.setProperty('--k',k);s.classList.toggle('on',k<lvl);s.classList.toggle('new',k===lvl-1&&lvl>lastLvl);});lastLvl=lvl;
  const hasNav=!!$('.secnav',sl);hudLabel.style.opacity=hasNav?0:1;type(hudLabel,hasNav?'':(sl.dataset.label||''),22,250);
  stage.classList.toggle('is-light',isLight(sl));stage.style.background=isLight(sl)?'var(--l-bg)':'var(--d-bg)';}
function show(i,st){const prev=slides[cur],sl=slides[i];
  if(prev&&prev!==sl){prev.classList.remove('active');const c=CTL[prev.id];c&&c.onLeave&&c.onLeave(prev);const p=prev;setTimeout(()=>{if(!p.classList.contains('active')){apply(p,-1);syncDemos(p,true);}},650);}
  cur=i;step=st;sl.classList.add('active');hud(sl);setPlanet(sl.dataset.planet||'off');
  const c=CTL[sl.id];c&&c.onEnter&&c.onEnter(sl);
  const run=()=>apply(sl,step);INSTANT?run():requestAnimationFrame(()=>requestAnimationFrame(run));
  history.replaceState(null,'',location.pathname+location.search+'#'+(i+1));}
function go(i,st=0){if(i<0||i>=slides.length||busy)return;const prev=slides[cur],sl=slides[i];
  if(prev&&prev!==sl&&isLight(prev)!==isLight(sl)&&!STILL&&!overview){busy=true;wipe.style.setProperty('--wipe',isLight(sl)?'#F7F6F2':'#090807');wipe.className='';void wipe.offsetWidth;wipe.className='in';
    setTimeout(()=>{prev.classList.add('cut');sl.classList.add('cut');show(i,st);requestAnimationFrame(()=>{wipe.className='out';setTimeout(()=>{prev.classList.remove('cut');sl.classList.remove('cut');wipe.className='';busy=false;},540);});},490);return;}
  show(i,st);}
const skipIdx=(i,dir)=>{while(i>=0&&i<slides.length&&hideOpt&&slides[i].dataset.optional)i+=dir;return i;};
function next(){if(busy)return;const sl=slides[cur],c=CTL[sl.id];if(c&&c.next&&c.next(sl))return;if(step<maxStep(sl)){step++;apply(sl,step);}else{const j=skipIdx(cur+1,1);if(j<slides.length)go(j);}}
function prev(){if(busy)return;const sl=slides[cur],c=CTL[sl.id];if(c&&c.prev&&c.prev(sl))return;if(step>0){step--;apply(sl,step);}else{const j=skipIdx(cur-1,-1);if(j>=0)go(j,maxStep(slides[j]));}}
function skip(){const j=skipIdx(cur+1,1);if(j<slides.length)go(j);}
function toggleOverview(){overview=!overview;stage.classList.toggle('overview',overview);
  if(overview){INSTANT=true;stage.classList.add('instant');const sc=.18,gw=24,cols=5,W=1920*sc,Hh=1080*sc,ox=(1920-(cols*W+(cols-1)*gw))/2,oy=(1080-(3*Hh+2*gw))/2;
    slides.forEach((s,i)=>{s.style.transform=`translate(${ox+(i%cols)*(W+gw)}px,${oy+Math.floor(i/cols)*(Hh+gw)}px) scale(${sc})`;apply(s,maxStep(s));syncDemos(s,'finish');});}
  else{slides.forEach(s=>{s.style.transform='';if(s!==slides[cur]){apply(s,-1);syncDemos(s,true);}});INSTANT=STILL;if(!/[?&]still/.test(location.search))stage.classList.remove('instant');apply(slides[cur],step);}}
slides.forEach((s,i)=>s.addEventListener('click',e=>{if(!overview)return;e.stopPropagation();toggleOverview();go(i);}));
addEventListener('keydown',e=>{const k=e.key;
  if(overview&&k!=='o'&&k!=='O'&&k!=='Escape')return;
  if(['ArrowRight','ArrowDown',' ','PageDown','Enter'].includes(k)){e.preventDefault();next();}
  else if(['ArrowLeft','ArrowUp','PageUp','Backspace'].includes(k)){e.preventDefault();prev();}
  else if(k==='Home')go(0);else if(k==='End')go(slides.length-1);
  else if(k==='f'||k==='F'){document.fullscreenElement?document.exitFullscreen():document.documentElement.requestFullscreen();}
  else if(k==='o'||k==='O'||(k==='Escape'&&overview))toggleOverview();
  else if(k==='S'&&e.shiftKey){hideOpt=!hideOpt;$('#optTag').classList.toggle('show',hideOpt);}
  else if(k==='s'){if(slides[cur].dataset.optional)skip();}
  else if(k==='n'||k==='N'){const nt=$('#notes');nt.classList.toggle('show');nt.innerHTML='<span class="u-label">SPEAKER NOTES · '+String(cur+1).padStart(2,'0')+'</span>'+(($('.notes',slides[cur])||{}).innerHTML||'');}});
stage.addEventListener('click',e=>{if(overview||e.target.closest('.ix'))return;next();});
$$('[data-skip]').forEach(b=>b.addEventListener('click',e=>{e.stopPropagation();skip();}));
let idle;addEventListener('mousemove',()=>{document.body.classList.remove('idle');clearTimeout(idle);idle=setTimeout(()=>document.body.classList.add('idle'),2500);});

/* ---------- slide controllers ---------- */
CTL.s1={onStep(sl,st){if(st<0||!sl.classList.contains('active'))return;setPlanet(st===0?'title':'dim');$('.out',sl).classList.toggle('struck',st>=2);}};
$$('#s1 .inh li, #s9 .check li').forEach(li=>li.addEventListener('click',e=>{e.stopPropagation();li.classList.toggle('done');}));
const LOGS=['small apps · demos · product teardowns · notes on where I got stuck','docs · guides · developer resources','dev tools · onboarding · AI agent integrations','product engineering · SDKs · apps · integrations · research · growth','still working toward it'];
function s3log(sl,k){$('.pr',sl).textContent='$ cat lvl_0'+(k+1)+'.log';type($('.console .out',sl),LOGS[k],16,120);$$('.card',sl).forEach((c,j)=>c.classList.toggle('sel',j===k));}
CTL.s3={onStep(sl,st){const tr=$('.track',sl),cells=$$('.levels>*',sl);let fill=0;
  if(st>=1&&st<=4){const c=cells[st-1];fill=c.offsetLeft+c.offsetWidth/2;}else if(st>=5)fill=tr.offsetWidth;
  tr.style.setProperty('--fill',fill+'px');tr.classList.toggle('go',st>=1);
  $$('.card',sl).forEach((c,j)=>{c.classList.toggle('cleared',st>=j+2&&j<3);c.classList.toggle('now',j===3&&st>=4);});
  if(st>=1&&st<=5)s3log(sl,st-1);else if(st>5)s3log(sl,4);if(st<1){$('.console .out',sl).textContent='';$('.pr',sl).textContent='$';$$('.card',sl).forEach(c=>c.classList.remove('sel'));}}};
$$('#s3 .card').forEach((c,j)=>c.addEventListener('click',e=>{e.stopPropagation();if(c.classList.contains('in'))s3log($('#s3'),j);}));
CTL.s8={onStep(sl,st){$$('.log li',sl).forEach((li,i)=>{li.classList.toggle('ok',i<st-1||(st>=4&&i<=3));li.classList.toggle('cur',i===st-1&&st<4);});
  $('.log .bar',sl).style.setProperty('--p',Math.max(0,Math.min(1,st/4)));$$('[data-shot]',sl).forEach((s,i)=>s.classList.toggle('off',i!==Math.max(0,Math.min(3,st-1))));}};
$$('#s10 .tpl li').forEach(li=>{li.addEventListener('mouseenter',()=>hlPart($('#s10'),+li.dataset.p));li.addEventListener('mouseleave',()=>hlPart($('#s10'),-1));});
$$('#s11 .wrong li').forEach(li=>li.addEventListener('click',e=>{e.stopPropagation();li.classList.toggle('done');}));
// S12 Monday
const GL='▓▒░#%&@$/\\<>01';
function scramble(el,text){clearInterval(el._t);el.classList.remove('scr');if(INSTANT){el.textContent=text;return;}let f=0;el._t=setInterval(()=>{f++;el.textContent=text.split('').map((ch,i)=>ch===' '?' ':(i<f/1.6?ch:GL[Math.random()*GL.length|0])).join('');if(f/1.6>=text.length){clearInterval(el._t);el.textContent=text;}},28);}
function lock(t){t.classList.remove('on');$('.stamp',t).classList.remove('in');const n=$('.tname',t);clearInterval(n._t);n.classList.add('scr');n.textContent='? ? ? ? ? ?';}
let toastT;
function unlock(sl,t,toast=true){t.classList.add('on');$('.stamp',t).classList.add('in');scramble($('.tname',t),t.dataset.name);
  if(toast&&!INSTANT){const to=$('.toast',sl);$('.tt',to).textContent='ACHIEVEMENT UNLOCKED · '+t.dataset.name;to.classList.add('show');clearTimeout(toastT);toastT=setTimeout(()=>to.classList.remove('show'),2200);}count12(sl);}
function count12(sl){const n=$$('.tile.on',sl).length;$('.cnt',sl).textContent=n+' / 6';$('.cxp',sl).textContent=String(n*100).padStart(4,'0')+' XP';}
CTL.s12={max:()=>7,onStep(sl,st){if(st<0){$$('.tile',sl).forEach(lock);count12(sl);$('.closer',sl).classList.remove('in');return;}
  const on=$$('.tile.on',sl).length;if(st>on){$$('.tile:not(.on)',sl).slice(0,Math.min(6,st)-on).forEach(t=>unlock(sl,t,false));}if(st>=7)$('.closer',sl).classList.add('in');},
  next(sl){const t=$$('.tile:not(.on)',sl)[0];if(t){unlock(sl,t);step=$$('.tile.on',sl).length;pips(sl,step);return true;}
    const cl=$('.closer',sl);if(!cl.classList.contains('in')){cl.classList.add('in');step=7;pips(sl,7);return true;}return false;},
  prev(sl){const cl=$('.closer',sl);if(cl.classList.contains('in')){cl.classList.remove('in');step=6;pips(sl,6);return true;}
    const on=$$('.tile.on',sl);if(on.length){lock(on[on.length-1]);count12(sl);step=on.length-1;pips(sl,step);return true;}return false;}};
$$('#s12 .tile').forEach(t=>{lock(t);t.addEventListener('click',e=>{e.stopPropagation();const sl=$('#s12');t.classList.contains('on')?(lock(t),count12(sl)):unlock(sl,t);step=$$('.tile.on',sl).length;pips(sl,step);});});

/* ---------- boot ---------- */
window.deck={go,next,prev,skip,toggleOverview,get cur(){return cur},get step(){return step},max:i=>maxStep(slides[i]),count:slides.length,
  settle(i){go(i,maxStep(slides[i]));}, get busy(){return busy}};
document.fonts.ready.then(()=>{stage.classList.add('ready');const h=parseInt(location.hash.slice(1))||1;const fin=/max/.test(location.hash);go(h-1,fin&&slides[h-1]?(+slides[h-1].dataset.steps||0):0);});
})();
