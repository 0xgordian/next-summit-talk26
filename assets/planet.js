// Dithered planet horizon. Our own WebGL shader: sphere + atmosphere + rim light,
// quantised with an 8x8 ordered (Bayer) dither and drawn at 1/4 resolution so each
// dither cell becomes a 4x4 px block on a 1920x1080 stage.
(function(){
  const host=document.getElementById('planet'); if(!host) return;
  const cv=host.querySelector('canvas'); const W=480,H=270; cv.width=W; cv.height=H;
  const gl=cv.getContext('webgl',{antialias:false,premultipliedAlpha:false,preserveDrawingBuffer:true});
  if(!gl){host.classList.add('nogl');return;}
  const vs=`attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}`;
  const fs=`precision highp float;
uniform vec2 uRes;uniform float uT;uniform float uGlow;
float h21(vec2 p){p=fract(p*vec2(123.34,456.21));p+=dot(p,p+45.32);return fract(p.x*p.y);}
float vn(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);
  return mix(mix(h21(i),h21(i+vec2(1,0)),f.x),mix(h21(i+vec2(0,1)),h21(i+vec2(1,1)),f.x),f.y);}
float fbm(vec2 p){float a=.5,s=0.;for(int i=0;i<5;i++){s+=a*vn(p);p=p*2.03+vec2(1.7,9.2);a*=.5;}return s;}
float b2(vec2 a){a=floor(a);return fract(a.x/2.+a.y*a.y*.75);}
float b4(vec2 a){return b2(.5*a)*.25+b2(a);}
float b8(vec2 a){return b4(.5*a)*.25+b2(a);}
void main(){
  vec2 fc=gl_FragCoord.xy;
  vec2 p=(fc-.5*uRes)/uRes.y;
  vec2 c=vec2(.62,-1.52); float R=1.30;
  vec2 q=p-c; float r=length(q); float d=r-R;
  float ang=atan(q.y,q.x);
  float sunA=1.80+.035*sin(uT*.045);
  float da=ang-sunA; float rim=exp(-da*da*5.5);
  float L=0.;
  if(d<0.){
    vec2 s=q/R; float z=sqrt(max(0.,1.-dot(s,s))); vec3 n=vec3(s,z);
    float lon=atan(n.x,n.z)+uT*.012; 
    float land=fbm(vec2(lon*2.6,n.y*5.2)+3.1);
    float cloud=fbm(vec2(lon*4.1-uT*.02,n.y*9.)+11.);
    vec3 ld=normalize(vec3(-.35,.95,.10));
    float lam=clamp(dot(n,ld),0.,1.);
    L=(.015+.20*smoothstep(.48,.70,land)+.16*smoothstep(.55,.8,cloud))*pow(lam,1.6);
    L+=exp(d*26.)*.55*(.18+rim);
    L+=exp(d*90.)*.5*(.1+rim);
  }else{
    L=exp(-d*7.)*.42*(.10+rim)+exp(-d*34.)*.55*(.15+rim);
    float hs=h21(floor(fc)+7.);
    if(hs>.9935){float tw=.55+.45*sin(uT*1.3+hs*80.);L+=.55*tw*smoothstep(0.,.25,d);}
  }
  L+=exp(-abs(d)*240.)*(.25+1.25*rim);
  vec2 sp=c+R*vec2(cos(sunA),sin(sunA));
  float sd=length((p-sp)*vec2(1.,1.6));
  L+=1.1*exp(-sd*34.)+.38*exp(-sd*7.);
  L*=uGlow;
  float lv=6.;
  float Lq=clamp(floor(L*lv+b8(fc))/lv,0.,1.);
  vec3 bg=vec3(.035,.031,.027), ink=vec3(.055,.102,.078), dim=vec3(.224,.439,.345),
       br=vec3(.345,.718,.561), bb=vec3(.357,.910,.675), wh=vec3(.98);
  vec3 col=bg;
  col=mix(col,ink,step(.16,Lq));
  col=mix(col,dim,step(.33,Lq));
  col=mix(col,br,step(.5,Lq));
  col=mix(col,bb,step(.66,Lq));
  col=mix(col,wh,step(.83,Lq));
  gl_FragColor=vec4(col,1.);
}`;
  function sh(t,s){const o=gl.createShader(t);gl.shaderSource(o,s);gl.compileShader(o);if(!gl.getShaderParameter(o,gl.COMPILE_STATUS))console.error(gl.getShaderInfoLog(o));return o;}
  const pr=gl.createProgram();gl.attachShader(pr,sh(gl.VERTEX_SHADER,vs));gl.attachShader(pr,sh(gl.FRAGMENT_SHADER,fs));gl.linkProgram(pr);gl.useProgram(pr);
  const b=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,b);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),gl.STATIC_DRAW);
  const loc=gl.getAttribLocation(pr,'p');gl.enableVertexAttribArray(loc);gl.vertexAttribPointer(loc,2,gl.FLOAT,false,0,0);
  const uRes=gl.getUniformLocation(pr,'uRes'),uT=gl.getUniformLocation(pr,'uT'),uGlow=gl.getUniformLocation(pr,'uGlow');
  gl.viewport(0,0,W,H);gl.uniform2f(uRes,W,H);
  let glow=0,target=1,t0=performance.now();
  window.planet={set(v){target=v;},get visible(){return !host.classList.contains('off');}};
  function frame(now){
    glow+=(target-glow)*.03;
    if(window.planet.visible||glow>0.01){gl.uniform1f(uT,(now-t0)/1000);gl.uniform1f(uGlow,glow);gl.drawArrays(gl.TRIANGLES,0,3);}
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
})();
