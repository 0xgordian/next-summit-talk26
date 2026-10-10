(()=>{
const stage=document.getElementById('stage');
const fit=()=>{const s=Math.min(innerWidth/1920,innerHeight/1080);stage.style.transform=`translate(-50%,-50%) scale(${s})`;};
addEventListener('resize',fit);fit();
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
// word split
$$('.split').forEach(el=>{let i=0;const walk=n=>{[...n.childNodes].forEach(c=>{if(c.nodeType===3){const f=document.createDocumentFragment();c.textContent.split(/(\s+)/).forEach(p=>{if(!p)return;if(/^\s+$/.test(p)){f.appendChild(document.createTextNode(' '));return;}const w=document.createElement('span');w.className='w';const x=document.createElement('i');x.textContent=p;x.style.setProperty('--wi',i++);w.appendChild(x);f.appendChild(w);});c.replaceWith(f);}else if(c.nodeType===1&&c.tagName!=='BR')walk(c);});};walk(el);});
$$('[data-d]').forEach(el=>el.style.setProperty('--d',el.dataset.d));
$$('.tw').forEach(el=>el.dataset.text=el.textContent);
let INSTANT=false;
function type(el,text,speed=26,delay=0,done){clearInterval(el._t);clearTimeout(el._to);el.textContent='';
  if(INSTANT){el.textContent=text;done&&done();return;}
  el._to=setTimeout(()=>{let k=0;el.classList.add('typing');el._t=setInterval(()=>{k++;el.textContent=text.slice(0,k);if(k>=text.length){clearInterval(el._t);el.classList.remove('typing');done&&done();}},speed);},delay);}
function setIn(el,on){if(on===el.classList.contains('in'))return;el.classList.toggle('in',on);
  if(el.classList.contains('tw')){on?type(el,el.dataset.text,28,+(el.dataset.d||0)):(clearInterval(el._t),clearTimeout(el._to),el.textContent='');}}
function apply(sl,step){$$('[data-s]',sl).forEach(el=>{const s=+el.dataset.s,u=el.dataset.until;setIn(el,step>=s&&(u===undefined||step<=+u));});
  const c=CTL[sl.id];c&&c.onStep&&c.onStep(sl,step);pips(sl,step);}
const slides=$$('.slide');let cur=-1,step=0;
const hudLabel=$('#hudLabel'),hudNum=$('#hudNumTxt'),lvlTxt=$('#lvlTxt'),segs=$$('.segs i'),pipsEl=$('.pips'),planetEl=$('#planet');
function maxStep(sl){const c=CTL[sl.id];return c&&c.max!==undefined?c.max(sl):+(sl.dataset.steps||0);}
function pips(sl,st){const m=maxStep(sl);pipsEl.innerHTML='';for(let i=1;i<=m;i++){const p=document.createElement('i');if(i<=st)p.className='on';pipsEl.appendChild(p);}}
function setPlanet(mode){planetEl.classList.remove('off','dim');if(mode==='off')planetEl.classList.add('off');if(mode==='dim')planetEl.classList.add('dim');window.planet&&window.planet.set(mode==='off'?0:mode==='dim'?.7:1);}
let lastLvl=0;
function go(i,st=0){if(i<0||i>=slides.length)return;const prev=slides[cur];
  if(prev&&prev!==slides[i]){prev.classList.remove('active');const c=CTL[prev.id];c&&c.onLeave&&c.onLeave(prev);const p=prev;setTimeout(()=>{if(!p.classList.contains('active'))apply(p,-1);},650);}
  cur=i;step=st;const sl=slides[i];sl.classList.add('active');
  const n=+sl.dataset.n;hudNum.textContent=String(n).padStart(2,'0')+' / '+String(slides.length).padStart(2,'0');
  const lvl=+sl.dataset.lvl;lvlTxt.textContent='LVL '+String(lvl).padStart(2,'0')+(lvl>=7?' · MAX':'');
  if(lvl!==lastLvl){lvlTxt.classList.remove('flash');void lvlTxt.offsetWidth;lvlTxt.classList.add('flash');}
  segs.forEach((s,k)=>{s.style.setProperty('--k',k);s.classList.toggle('on',k<lvl);s.classList.toggle('new',k===lvl-1&&lvl>lastLvl);});lastLvl=lvl;
  const lab=sl.dataset.label||'';hudLabel.style.opacity=sl.classList.contains('hasnav')?0:1;type(hudLabel,lab,22,250);
  setPlanet(sl.dataset.planet||'off');
  const c=CTL[sl.id];c&&c.onEnter&&c.onEnter(sl);
  requestAnimationFrame(()=>requestAnimationFrame(()=>apply(sl,step)));
  history.replaceState(null,'','#'+(i+1));}
function next(){const sl=slides[cur],c=CTL[sl.id];if(c&&c.next&&c.next(sl))return;if(step<maxStep(sl)){step++;apply(sl,step);}else go(cur+1);}
function prev(){const sl=slides[cur],c=CTL[sl.id];if(c&&c.prev&&c.prev(sl))return;if(step>0){step--;apply(sl,step);}else if(cur>0){const p=slides[cur-1];go(cur-1,maxStep(p));}}
addEventListener('keydown',e=>{if(['ArrowRight','ArrowDown',' ','PageDown','Enter'].includes(e.key)){e.preventDefault();next();}
  else if(['ArrowLeft','ArrowUp','PageUp','Backspace'].includes(e.key)){e.preventDefault();prev();}
  else if(e.key==='Home')go(0);else if(e.key==='End')go(slides.length-1);
  else if(e.key==='f'||e.key==='F'){document.fullscreenElement?document.exitFullscreen():document.documentElement.requestFullscreen();}
  else if(e.key==='n'||e.key==='N'){const nt=$('#notes');nt.classList.toggle('show');nt.innerHTML='<span class="u-label">SPEAKER NOTES</span>'+($('.notes',slides[cur])||{}).innerHTML;}});
stage.addEventListener('click',e=>{if(e.target.closest('.ix'))return;next();});
let idle;addEventListener('mousemove',()=>{document.body.classList.remove('idle');clearTimeout(idle);idle=setTimeout(()=>document.body.classList.add('idle'),2500);});

/* ---------- controllers ---------- */
const CTL={};
// S1: planet title, then dims
CTL.s1={onStep(sl,st){if(st<0||!sl.classList.contains('active'))return;setPlanet(st===0?'title':'dim');$('.out',sl).classList.toggle('struck',st>=2);}};
$$('#s1 .inh li').forEach(li=>li.addEventListener('click',e=>{e.stopPropagation();li.classList.toggle('done');}));
// S2: levels beam + console
const LOGS=['Signed up, followed the docs, wrote down where I got stuck.','Cloud infra and docs: migration guides, developer resources.','Guides, dev tools, onboarding, AI agent integrations.','Product, DX, integrations, research and growth.','Still working toward it.'];
function s2log(sl,k){$('.pr',sl).textContent='$ cat lvl_0'+(k+1)+'.log';type($('.console .out',sl),LOGS[k],18,120);$$('.card',sl).forEach((c,j)=>c.classList.toggle('sel',j===k));}
CTL.s2={onStep(sl,st){const tr=$('.track',sl),cells=$$('.levels>*',sl);let fill=0;
  if(st>=1&&st<=4){const c=cells[st-1];fill=c.offsetLeft+c.offsetWidth/2;}else if(st>=5)fill=tr.offsetWidth;
  tr.style.setProperty('--fill',fill+'px');tr.classList.toggle('go',st>=1);
  $$('.card',sl).forEach((c,j)=>{c.classList.toggle('cleared',st>=j+2&&j<3);c.classList.toggle('now',j===3&&st>=4);});
  if(st>=1&&st<=5)s2log(sl,st-1);if(st<1){$('.console .out',sl).textContent='';$('.pr',sl).textContent='$';}}};
$$('#s2 .card').forEach((c,j)=>c.addEventListener('click',e=>{e.stopPropagation();if(c.classList.contains('in'))s2log($('#s2'),j);}));
// S3: rows hover
// S9 Monday: unlock tiles in order or by click
const GL='▓▒░#%&@$/\\<>01';
function scramble(el,text){clearInterval(el._t);if(INSTANT){el.textContent=text;el.classList.remove('scr');return;}let f=0;el.classList.remove('scr');el._t=setInterval(()=>{f++;el.textContent=text.split('').map((ch,i)=>ch===' '?' ':(i<f/1.6?ch:GL[Math.random()*GL.length|0])).join('');if(f/1.6>=text.length){clearInterval(el._t);el.textContent=text;}},28);}
function lock(t){t.classList.remove('on');const s=$('.stamp',t);s.classList.remove('in');const n=$('.tname',t);clearInterval(n._t);n.classList.add('scr');n.textContent='? ? ? ? ? ?';}
let toastT;
function unlock(sl,t,toast=true){t.classList.add('on');$('.stamp',t).classList.add('in');scramble($('.tname',t),t.dataset.name);
  if(toast&&!INSTANT){const to=$('.toast',sl);$('.tt',to).textContent='ACHIEVEMENT UNLOCKED · '+t.dataset.name;to.classList.add('show');clearTimeout(toastT);toastT=setTimeout(()=>to.classList.remove('show'),2200);}s9count(sl);}
function s9count(sl){const n=$$('.tile.on',sl).length;$('.cnt',sl).textContent=n+' / 6';$('.counter .xp',sl).textContent=String(n*100).padStart(4,'0')+' XP';}
CTL.s9={max:()=>7,onEnter(sl){},onStep(sl,st){if(st<0){$$('.tile',sl).forEach(lock);s9count(sl);$('.closer',sl).classList.remove('in');}
  if(INSTANT&&st>=7){$$('.tile',sl).forEach(t=>t.classList.contains('on')||unlock(sl,t,false));$('.closer',sl).classList.add('in');}},
  next(sl){const t=$$('.tile:not(.on)',sl)[0];if(t){unlock(sl,t);step=$$('.tile.on',sl).length;pips(sl,step);return true;}
    const cl=$('.closer',sl);if(!cl.classList.contains('in')){cl.classList.add('in');step=7;pips(sl,7);return true;}return false;},
  prev(sl){const cl=$('.closer',sl);if(cl.classList.contains('in')){cl.classList.remove('in');step=6;pips(sl,6);return true;}
    const on=$$('.tile.on',sl);if(on.length){lock(on[on.length-1]);s9count(sl);step=on.length-1;pips(sl,step);return true;}return false;}};
$$('#s9 .tile').forEach(t=>{lock(t);t.addEventListener('click',e=>{e.stopPropagation();const sl=$('#s9');t.classList.contains('on')?(lock(t),s9count(sl)):unlock(sl,t);step=$$('.tile.on',sl).length;pips(sl,step);});});
// S10: loop cycle + countdown
const LOOP=['Find a real problem','Understand who it affects','Build with the right tools','Test it and make it usable','Write down your choices and limits','Share it and ask for feedback','Improve it and build the next one'];
let loopT,clockT;
CTL.s10={onEnter(sl){let k=0;const tx=$('.loop .tx',sl),lb=$('.loop .u-label',sl),dots=$$('.loop .dot',sl);clearInterval(loopT);
    const tick=()=>{lb.textContent='STAGE 0'+(k+1)+' / 07';type(tx,LOOP[k],22);dots.forEach((d,j)=>d.setAttribute('class','dot'+(j===k?' on':'')));k=(k+1)%7;};tick();loopT=setInterval(tick,2600);},
  onLeave(){clearInterval(loopT);clearInterval(clockT);},
  onStep(sl,st){clearInterval(clockT);if(st>=1){const end=Date.now()+48*3600e3;const ck=$('.clock',sl);const f=()=>{const ms=end-Date.now();const h=Math.floor(ms/3600e3),m=Math.floor(ms/6e4)%60,s=Math.floor(ms/1e3)%60;ck.textContent=[h,m,s].map(v=>String(v).padStart(2,'0')).join(':');};f();clockT=setInterval(f,250);}}};
$$('.check li').forEach(li=>li.addEventListener('click',e=>{e.stopPropagation();li.classList.toggle('in');}));
// looping terminal typers for media-slot mockups
function runTyper(el){const lines=JSON.parse(el.dataset.lines);let i=0;el.innerHTML='';const go2=()=>{if(!el.closest('.slide').classList.contains('active')){el._run=false;return;}
  if(i>=lines.length){setTimeout(()=>{el.innerHTML='';i=0;go2();},2600);return;}
  const [cls,txt]=lines[i++];const d=document.createElement('div');d.className=cls;el.appendChild(d);
  if(INSTANT){d.textContent=txt;go2();return;}type(d,txt,cls==='w'?30:12,250,()=>setTimeout(go2,350));};el._run=true;go2();}
const obs=new MutationObserver(()=>{const sl=slides[cur];$$('.typer',sl).forEach(el=>{if(!el._run)runTyper(el);});});
slides.forEach(s=>obs.observe(s,{attributes:true,attributeFilter:['class']}));
/* boot */
window.deck={go,next,prev,get cur(){return cur},get step(){return step},max:i=>maxStep(slides[i]),count:slides.length,
  settle(i){INSTANT=true;stage.classList.add('instant');go(i,maxStep(slides[i]));setTimeout(()=>{INSTANT=false;},50);}};
document.fonts.ready.then(()=>{stage.classList.add('ready');const h=parseInt(location.hash.slice(1))||1;go(h-1);});
})();
