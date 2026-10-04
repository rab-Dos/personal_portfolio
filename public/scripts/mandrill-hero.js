(() => {
  'use strict';
  // Adaptación del proyecto local mandrill-webgl-hero_v9 para el hero del portafolio.
  const hero = document.querySelector('#mandrill-animation');
  const canvas = document.querySelector('#glyphs');
  const vectors = document.querySelector('#vectors');
  const sourceVideo = document.querySelector('#sourceVideo');
  const replay = document.querySelector('#replay');
  const togglePlayback = document.querySelector('#togglePlayback');
  const speedControl = document.querySelector('#speedControl');
  const speedValue = document.querySelector('#speedValue');
  const gl = canvas.getContext('webgl2', {
    alpha: true,
    antialias: false,
    premultipliedAlpha: false,
    powerPreference: 'high-performance'
  });
  if (!gl) {
    hero.classList.add('no-webgl');
    replay.textContent = 'WebGL2 no disponible';
    replay.disabled = true;
    togglePlayback.disabled = true;
    speedControl.disabled = true;
    return;
  }

  const media = document.createElement('video');
  const packedVideoPath = '/jesusarellano/media/mandrill/packed-pingpong-optimized.mp4';
  media.loop = true;
  media.muted = true;
  media.playsInline = true;
  media.preload = 'metadata';
  media.crossOrigin = 'anonymous';
  sourceVideo.loop = true;
  sourceVideo.playbackRate = .65;
  media.playbackRate = .65;

  // En móvil se conserva solo la máscara; el video original se descarga únicamente en escritorio.
  const compactLayout = matchMedia('(max-width: 55.999rem)');
  const sourceVideoPath = '/jesusarellano/media/mandrill/source-pingpong-optimized.mp4';
  hero.dataset.mode = compactLayout.matches ? 'generated' : 'split';
  let resourcesReady = false;
  let resourcesStarted = false;
  let trackingSettled = false;

  // La paleta del shader y de los vectores se adapta al tema activo.
  const systemDark = matchMedia('(prefers-color-scheme: dark)');
  let lightTheme = 0;
  function syncTheme() {
    const explicitTheme = document.documentElement.dataset.theme;
    lightTheme = explicitTheme === 'light' || (!explicitTheme && !systemDark.matches) ? 1 : 0;
  }
  syncTheme();
  new MutationObserver(syncTheme).observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-theme']
  });
  systemDark.addEventListener('change', syncTheme);

  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const coarse = matchMedia('(pointer: coarse)').matches;
  const cores = navigator.hardwareConcurrency || 4;
  const quality = coarse || cores <= 4 ? { cols: 36, fps: 30, points: 32, dpr: 1.25 }
    : cores <= 8 ? { cols: 48, fps: 45, points: 48, dpr: 1.6 }
    : { cols: 58, fps: 60, points: 64, dpr: 2 };
  if (reduced) Object.assign(quality, { fps: 1, points: 24 });

  // Shaders: conservan color, caracteres, máscara y resplandores del proyecto v9.
  const VS = `#version 300 es
  precision highp float;
  layout(location=0) in vec2 aCorner;
  layout(location=1) in vec2 aUV;
  uniform sampler2D uVideo;
  uniform vec2 uGrid;
  uniform vec2 uScale;
  uniform float uTime;
  uniform float uLightTheme;
  uniform int uPointCount;
  uniform vec4 uPoints[64];
  out vec2 vGlyphUV;
  out vec3 vColor;
  out float vAlpha;
  flat out float vGlyph;
  float hash(vec2 p){ return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453123); }
  void main(){
    vec2 uv = aUV;
    vec3 source = texture(uVideo, vec2(uv.x*.5, uv.y)).rgb;
    vec3 aux = texture(uVideo, vec2(.5 + uv.x*.5, uv.y)).rgb;
    float mask = smoothstep(.20,.54,aux.r);
    float edge = aux.g;
    float motion = aux.b;
    vec2 clip = vec2(uv.x*2.-1., 1.-uv.y*2.) * uScale;
    vec2 drift = vec2(0.);
    for(int i=0;i<64;i++){
      if(i>=uPointCount) break;
      vec2 d = uv-uPoints[i].xy;
      float influence = exp(-dot(d,d)*210.);
      drift += vec2(uPoints[i].z,-uPoints[i].w)*influence*2.8;
    }
    float rnd = hash(floor(uv*uGrid));
    float pulse = .88 + .12*sin(uTime*1.7+rnd*6.283);
    float sizeBoost = mix(.76,1.2,edge) * mix(.9,1.13,motion);
    vec2 glyphSize = vec2(2.46/uGrid.x, 3.12/uGrid.y) * uScale * sizeBoost;
    clip += drift;
    clip += (aCorner-.5)*glyphSize;
    gl_Position=vec4(clip,0.,1.);
    vGlyphUV=aCorner;
    float lum=dot(source,vec3(.299,.587,.114));
    float phase=floor(uTime*(1.15+motion*5.5));
    vec2 region=floor(uv*vec2(14.,9.));
    float family=hash(region+phase)*8.;
    vGlyph=mod(floor(lum*11.+family+floor(rnd*2.)),24.);
    vec3 lifted=pow(max(source,vec3(.002)),vec3(.68));
    float liftedLum=dot(lifted,vec3(.299,.587,.114));
    vec3 saturated=mix(vec3(liftedLum),lifted,1.62);
    vec3 base=clamp(saturated*(1.16+edge*.24+motion*.20),0.,1.);
    float chroma=max(source.r,max(source.g,source.b))-min(source.r,min(source.g,source.b));
    float gold=smoothstep(.045,.17,source.r-source.b)*smoothstep(.018,.105,source.g-source.b);
    vec3 mustard=mix(vec3(.96,.72,.015),vec3(.56,.22,.01),uLightTheme)*(.66+liftedLum*.70);
    vec2 face=(uv-vec2(.70,.48))/vec2(.105,.21);
    float muzzle=(1.-smoothstep(.66,1.12,dot(face,face)))*(1.-smoothstep(.09,.24,chroma));
    muzzle*=smoothstep(.055,.32,lum);
    vec3 muzzleBlue=mix(vec3(.025,.42,1.),vec3(.015,.20,.57),uLightTheme)*(.62+liftedLum*.70);
    float pink=smoothstep(.065,.21,source.r-max(source.g,source.b));
    vec3 mexicanPink=mix(vec3(1.,.0,.50),vec3(.58,.0,.25),uLightTheme)*(.70+liftedLum*.60);
    vec3 themedBase=mix(base,base*.44,uLightTheme);
    vColor=mix(themedBase,mustard,clamp(gold*.92,0.,1.));
    vColor=mix(vColor,muzzleBlue,clamp(muzzle*.96,0.,1.));
    vColor=mix(vColor,mexicanPink,clamp(pink,0.,1.));
    vColor=clamp(vColor,0.,1.);
    vAlpha=clamp(mask*mix(.72,1.,sqrt(lum))*pulse*(.92+edge*.32+motion*.22),0.,1.);
  }`;

  const FS = `#version 300 es
  precision highp float;
  uniform sampler2D uAtlas;
  in vec2 vGlyphUV;
  in vec3 vColor;
  in float vAlpha;
  flat in float vGlyph;
  out vec4 outColor;
  void main(){
    float col=mod(vGlyph,8.); float row=floor(vGlyph/8.);
    vec2 uv=(vec2(col,row)+vGlyphUV)/vec2(8.,3.);
    float ink=texture(uAtlas,uv).r;
    vec2 atlasPixel=1./vec2(512.,192.);
    vec2 cellMin=(vec2(col,row)+vec2(.035))/vec2(8.,3.);
    vec2 cellMax=(vec2(col,row)+vec2(.965))/vec2(8.,3.);
    vec2 nearOffset=atlasPixel*3.5;
    vec2 farOffset=atlasPixel*6.5;
    float nearGlow=0.;
    nearGlow+=texture(uAtlas,clamp(uv+vec2( nearOffset.x,0.),cellMin,cellMax)).r;
    nearGlow+=texture(uAtlas,clamp(uv+vec2(-nearOffset.x,0.),cellMin,cellMax)).r;
    nearGlow+=texture(uAtlas,clamp(uv+vec2(0., nearOffset.y),cellMin,cellMax)).r;
    nearGlow+=texture(uAtlas,clamp(uv+vec2(0.,-nearOffset.y),cellMin,cellMax)).r;
    float farGlow=0.;
    farGlow+=texture(uAtlas,clamp(uv+vec2( farOffset.x, farOffset.y),cellMin,cellMax)).r;
    farGlow+=texture(uAtlas,clamp(uv+vec2(-farOffset.x, farOffset.y),cellMin,cellMax)).r;
    farGlow+=texture(uAtlas,clamp(uv+vec2( farOffset.x,-farOffset.y),cellMin,cellMax)).r;
    farGlow+=texture(uAtlas,clamp(uv+vec2(-farOffset.x,-farOffset.y),cellMin,cellMax)).r;
    nearGlow*=.25; farGlow*=.25;
    float colorRange=max(vColor.r,max(vColor.g,vColor.b))-min(vColor.r,min(vColor.g,vColor.b));
    float vivid=smoothstep(.24,.62,colorRange)*smoothstep(.36,.82,max(vColor.r,max(vColor.g,vColor.b)));
    float halo=max(nearGlow*.72,farGlow*.46)*vivid;
    float coverage=max(ink,halo);
    if(coverage<.025 || vAlpha<.025) discard;
    vec3 luminous=min(vec3(1.),vColor*(1.+vivid*.34));
    outColor=vec4(luminous,vAlpha*coverage);
  }`;

  function shader(type, source) {
    const value = gl.createShader(type); gl.shaderSource(value, source); gl.compileShader(value);
    if (!gl.getShaderParameter(value, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(value));
    return value;
  }
  const program = gl.createProgram();
  gl.attachShader(program, shader(gl.VERTEX_SHADER, VS));
  gl.attachShader(program, shader(gl.FRAGMENT_SHADER, FS));
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(program));
  gl.useProgram(program);

  const quad = new Float32Array([0,0, 1,0, 0,1, 0,1, 1,0, 1,1]);
  const quadBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, quadBuffer); gl.bufferData(gl.ARRAY_BUFFER, quad, gl.STATIC_DRAW);
  gl.enableVertexAttribArray(0); gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

  let rows = Math.round(quality.cols * 9 / 16);
  let count = quality.cols * rows;
  const instances = new Float32Array(count * 2);
  for (let y=0, n=0; y<rows; y++) for (let x=0; x<quality.cols; x++,n++) {
    instances[n*2]=(x+.5)/quality.cols; instances[n*2+1]=(y+.5)/rows;
  }
  const instanceBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, instanceBuffer); gl.bufferData(gl.ARRAY_BUFFER, instances, gl.STATIC_DRAW);
  gl.enableVertexAttribArray(1); gl.vertexAttribPointer(1,2,gl.FLOAT,false,0,0); gl.vertexAttribDivisor(1,1);

  // Atlas tipográfico y texturas de la secuencia empacada.
  function makeAtlas(){
    const chars='0123456789ABCDEF+-*/<>[]';
    const c=document.createElement('canvas'); c.width=512; c.height=192;
    const x=c.getContext('2d'); x.fillStyle='#000'; x.fillRect(0,0,c.width,c.height);
    x.fillStyle='#fff'; x.textAlign='center'; x.textBaseline='middle'; x.font='600 48px ui-monospace, monospace';
    for(let i=0;i<24;i++) x.fillText(chars[i],(i%8)*64+32,Math.floor(i/8)*64+33);
    return c;
  }
  function texture(source, unit){
    const value=gl.createTexture(); gl.activeTexture(gl.TEXTURE0+unit); gl.bindTexture(gl.TEXTURE_2D,value);
    gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,true);
    gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,source);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,false);
    return value;
  }
  const atlas=texture(makeAtlas(),1);
  gl.uniform1i(gl.getUniformLocation(program,'uAtlas'),1);
  const videoTexture=gl.createTexture(); gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D,videoTexture);
  gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR); gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE); gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);
  gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,1,1,0,gl.RGBA,gl.UNSIGNED_BYTE,new Uint8Array([0,0,0,255]));
  gl.uniform1i(gl.getUniformLocation(program,'uVideo'),0);
  gl.uniform2f(gl.getUniformLocation(program,'uGrid'),quality.cols,rows);

  let tracking=null, visible=true, resizePending=true;
  let canvasPane={x:0,y:0,w:1,h:1}, sourcePane={x:0,y:0,w:0,h:0};
  const vctx=vectors.getContext('2d');

  function resize(){
    if(!resizePending) return;
    const rect=canvas.getBoundingClientRect(); const vectorRect=vectors.getBoundingClientRect();
    const dpr=Math.min(devicePixelRatio||1,quality.dpr);
    const w=Math.max(1,Math.round(rect.width*dpr)), h=Math.max(1,Math.round(rect.height*dpr));
    const vw=Math.max(1,Math.round(vectorRect.width*dpr)), vh=Math.max(1,Math.round(vectorRect.height*dpr));
    if(canvas.width!==w||canvas.height!==h){ canvas.width=w; canvas.height=h; }
    if(vectors.width!==vw||vectors.height!==vh){ vectors.width=vw; vectors.height=vh; }
    const vectorDpr=vw/Math.max(1,vectorRect.width);
    canvasPane={
      x:(rect.left-vectorRect.left)*vectorDpr,
      y:(rect.top-vectorRect.top)*vectorDpr,
      w:rect.width*vectorDpr,
      h:rect.height*vectorDpr
    };
    if(hero.dataset.mode==='split'){
      const sourceRect=sourceVideo.getBoundingClientRect();
      sourcePane={
        x:(sourceRect.left-vectorRect.left)*vectorDpr,
        y:(sourceRect.top-vectorRect.top)*vectorDpr,
        w:sourceRect.width*vectorDpr,
        h:sourceRect.height*vectorDpr
      };
    } else sourcePane={x:0,y:0,w:0,h:0};
    gl.viewport(0,0,w,h);
    resizePending=false;
  }
  function scale(){
    const ca=canvas.width/canvas.height, va=16/9;
    return ca>va?[1,ca/va]:[va/ca,1];
  }
  function paneFor(element){
    return element===canvas ? canvasPane : sourcePane;
  }
  function videoToPane(p,pane){
    const zoom=Math.max(pane.w/16,pane.h/9);
    const rw=16*zoom, rh=9*zoom;
    return [pane.x+(pane.w-rw)*.5+p[0]*rw,pane.y+(pane.h-rh)*.5+p[1]*rh];
  }
  function mainNodeIndices(points,count){
    if(!points.length) return [];
    const chosen=[points.reduce((best,p,i)=>p[0]>points[best][0]?i:best,0)];
    while(chosen.length<Math.min(count,points.length)){
      let candidate=-1,bestDistance=-1;
      for(let i=0;i<points.length;i++){
        if(chosen.includes(i)) continue;
        const distance=Math.min(...chosen.map(j=>(points[i][0]-points[j][0])**2+(points[i][1]-points[j][1])**2));
        if(distance>bestDistance){ bestDistance=distance; candidate=i; }
      }
      if(candidate<0) break; chosen.push(candidate);
    }
    return chosen;
  }
  function curve(a,b,bend){
    const mx=(a[0]+b[0])*.5, my=(a[1]+b[1])*.5, dx=b[0]-a[0], dy=b[1]-a[1];
    const length=Math.max(1,Math.hypot(dx,dy));
    vctx.quadraticCurveTo(mx-dy/length*bend,my+dx/length*bend,b[0],b[1]);
  }
  function hash01(a,b,c=0){
    const value=Math.sin(a*127.1+b*311.7+c*74.7)*43758.5453;
    return value-Math.floor(value);
  }
  function smoothstep(a,b,x){
    const t=Math.max(0,Math.min(1,(x-a)/(b-a))); return t*t*(3-2*t);
  }
  function animatedCurve(a,b,bend,progress){
    const mx=(a[0]+b[0])*.5, my=(a[1]+b[1])*.5, dx=b[0]-a[0], dy=b[1]-a[1];
    const length=Math.max(1,Math.hypot(dx,dy));
    const control=[mx-dy/length*bend,my+dx/length*bend];
    vctx.beginPath(); vctx.moveTo(a[0],a[1]);
    const steps=Math.max(2,Math.ceil(18*progress));
    for(let s=1;s<=steps;s++){
      const t=progress*s/steps,inv=1-t;
      vctx.lineTo(inv*inv*a[0]+2*inv*t*control[0]+t*t*b[0],inv*inv*a[1]+2*inv*t*control[1]+t*t*b[1]);
    }
    vctx.stroke();
  }
  // Red vectorial: limpia el canvas alfa y redibuja únicamente los nodos visibles.
  function drawVectors(frame,time){
    vctx.clearRect(0,0,vectors.width,vectors.height); if(!frame) return;
    const data=frame.slice(0,quality.points), generatedPane=paneFor(canvas);
    const palette=lightTheme
      ? { line:'132,52,14', node:'154,57,16', bright:'177,66,16' }
      : { line:'218,172,24', node:'244,207,72', bright:'232,188,38' };
    const pts=data.map(p=>videoToPane(p,generatedPane));
    const major=mainNodeIndices(pts,Math.min(8,Math.max(5,Math.round(quality.points/8))));
    vctx.lineWidth=Math.max(1.45,vectors.width/1250);
    for(let i=0;i<pts.length;i++){
      const neighbors=pts.map((p,j)=>({j,d:(p[0]-pts[i][0])**2+(p[1]-pts[i][1])**2})).filter(v=>v.j!==i).sort((a,b)=>a.d-b.d).slice(0,6);
      for(let slot=0;slot<3;slot++){
        const n=neighbors[slot];
        if(!n||n.j<i||n.d>(generatedPane.w*.34)**2) continue;
        const period=1.35+hash01(i,n.j)*.85,age=(time/period+hash01(i,n.j,slot))%1;
        if(age>.46) continue;
        const grow=smoothstep(0,.12,age),fade=1-smoothstep(.28,.46,age);
        const direction=hash01(i,n.j)>.5?1:-1,bend=Math.sqrt(n.d)*(.06+.1*hash01(n.j,i))*direction;
        vctx.strokeStyle=`rgba(${palette.line},${(.16+.56*fade).toFixed(3)})`;
        animatedCurve(pts[i],pts[n.j],bend,grow);
      }
      vctx.fillStyle=`rgba(${palette.node},.88)`;
      vctx.beginPath(); vctx.arc(pts[i][0],pts[i][1],Math.max(1.35,vectors.width/1500),0,Math.PI*2); vctx.fill();
    }
    for(let k=0;k<major.length;k++){
      const aIndex=major[k],bIndex=major[(k+2)%major.length];
      if(aIndex===bIndex) continue;
      const age=(time/(1.7+hash01(k,bIndex)*1.)+hash01(k,bIndex))%1;
      if(age>.42) continue;
      const grow=smoothstep(0,.12,age),fade=1-smoothstep(.26,.42,age);
      const distance=Math.hypot(pts[aIndex][0]-pts[bIndex][0],pts[aIndex][1]-pts[bIndex][1]);
      vctx.lineWidth=Math.max(1.4,vectors.width/1350);
      vctx.strokeStyle=`rgba(${palette.bright},${(.12+.5*fade).toFixed(3)})`;
      animatedCurve(pts[aIndex],pts[bIndex],distance*(.2+.12*k)*(k%2?1:-1),grow);
    }
    vctx.lineWidth=Math.max(1.7,vectors.width/1100);
    for(const i of major){
      const radius=Math.max(10,vectors.width/160)*(1+.08*Math.sin(time*2.1+i));
      vctx.strokeStyle=`rgba(${palette.bright},.96)`;
      vctx.fillStyle=`rgba(${palette.line},.60)`;
      vctx.beginPath(); vctx.arc(pts[i][0],pts[i][1],radius,0,Math.PI*2); vctx.fill(); vctx.stroke();
    }
    if(hero.dataset.mode==='split' && sourcePane.w>0){
      const originalPane=paneFor(sourceVideo), originals=data.map(p=>videoToPane(p,originalPane));
      vctx.lineWidth=Math.max(2.4,vectors.width/900); vctx.strokeStyle=`rgba(${palette.bright},.5)`;
      vctx.save();
      const dash=Math.max(8,vectors.width/360),gap=Math.max(6,vectors.width/520);
      vctx.setLineDash([dash,gap]); vctx.lineDashOffset=-time*Math.max(24,vectors.width/70); vctx.lineCap='round';
      for(const [order,i] of major.slice(0,6).entries()){
        const a=originals[i],b=pts[i],span=b[0]-a[0];
        const period=1.5+hash01(i,order)*.8,age=(time/period+hash01(i,order))%1;
        if(age>.44) continue;
        const grow=smoothstep(0,.11,age),fade=1-smoothstep(.27,.44,age);
        vctx.strokeStyle=`rgba(${palette.bright},${(.2+.62*fade).toFixed(3)})`;
        const end=[a[0]+(b[0]-a[0])*grow,a[1]+(b[1]-a[1])*grow];
        vctx.beginPath(); vctx.moveTo(...a);
        vctx.bezierCurveTo(a[0]+span*.34*grow,a[1],end[0]-span*.34*grow,end[1],end[0],end[1]); vctx.stroke();
        vctx.setLineDash([]);
        vctx.fillStyle=`rgba(${palette.node},.90)`;
        vctx.beginPath(); vctx.arc(a[0],a[1],Math.max(9,vectors.width/180),0,Math.PI*2); vctx.fill();
        vctx.setLineDash([dash,gap]);
      }
      vctx.restore();
    }
  }

  const uScale=gl.getUniformLocation(program,'uScale'), uTime=gl.getUniformLocation(program,'uTime');
  const uLightTheme=gl.getUniformLocation(program,'uLightTheme');
  const uPointCount=gl.getUniformLocation(program,'uPointCount'), uPoints=gl.getUniformLocation(program,'uPoints[0]');
  let lastDraw=-Infinity;
  function render(now){
    if(!reduced) requestAnimationFrame(render);
    if(!visible||media.readyState<2||!media.videoWidth||now-lastDraw<1000/quality.fps) return;
    // El video original, la máscara y los vectores entran juntos, una vez listos.
    if(!hero.hasAttribute('data-visual-ready') &&
      (!trackingSettled || (hero.dataset.mode==='split' && sourceVideo.readyState<2))) return;
    lastDraw=now;
    resize(); const s=scale();
    gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D,videoTexture);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,false); gl.texImage2D(gl.TEXTURE_2D,0,gl.RGB,gl.RGB,gl.UNSIGNED_BYTE,media);
    // El canvas se limpia con alfa cero para conservar el fondo y la rejilla del sitio.
    gl.clearColor(0,0,0,0); gl.clear(gl.COLOR_BUFFER_BIT);
    gl.enable(gl.BLEND); gl.blendFunc(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA);
    gl.uniform2f(uScale,s[0],s[1]); gl.uniform1f(uTime,media.currentTime);
    gl.uniform1f(uLightTheme,lightTheme);
    if(hero.dataset.mode==='split' && sourceVideo.readyState>=2 && Math.abs(sourceVideo.currentTime-media.currentTime)>.045){
      sourceVideo.currentTime=media.currentTime;
    }
    let frame=null;
    if(tracking){ const i=Math.min(tracking.frames-1,Math.floor(media.currentTime*tracking.fps)); frame=tracking.points[i]; }
    const flat=new Float32Array(64*4); const used=Math.min(frame?.length||0,quality.points);
    for(let i=0;i<used;i++) flat.set(frame[i],i*4);
    gl.uniform1i(uPointCount,used); gl.uniform4fv(uPoints,flat);
    gl.drawArraysInstanced(gl.TRIANGLES,0,6,count); drawVectors(frame,media.currentTime);
    if(!hero.hasAttribute('data-visual-ready')) hero.setAttribute('data-visual-ready','');
  }

  let userPaused=reduced;
  function updatePlaybackLabel(){ togglePlayback.textContent=media.paused?'Reproducir':'Pausar'; }
  function setSpeed(value){
    const rate=Math.max(.30,Math.min(1.25,Number(value)||.65));
    media.playbackRate=rate; sourceVideo.playbackRate=rate;
    speedControl.value=rate.toFixed(2); speedValue.value=`${rate.toFixed(2)}×`;
  }
  function playPair(force=false){
    if(force) userPaused=false;
    if(userPaused||document.hidden||!visible||!resourcesStarted) return;
    media.play().catch(()=>{});
    if(sourceVideo.hasAttribute('src')) sourceVideo.play().catch(()=>{});
  }
  function startHeroResources(){
    if(!resourcesReady||document.hidden||!visible) return;
    if(!resourcesStarted){
      resourcesStarted=true;
      media.src=packedVideoPath;
      media.load();
      if(!compactLayout.matches){
        sourceVideo.src=sourceVideoPath;
        sourceVideo.preload='metadata';
        sourceVideo.load();
      }
      fetch('/jesusarellano/media/mandrill/tracking.json').then(r=>{
        if(!r.ok) throw new Error('Tracking unavailable');
        return r.json();
      }).then(v=>{
        tracking=v;
      }).catch(()=>{}).finally(()=>{
        trackingSettled=true;
        if(reduced) requestAnimationFrame(render);
      });
    }
    playPair();
  }
  // Eager section illustrations finish before decorative video downloads begin.
  const scheduleResources=()=>{
    const begin=()=>{ resourcesReady=true; startHeroResources(); };
    if('requestIdleCallback' in window) requestIdleCallback(begin,{timeout:1000});
    else setTimeout(begin,0);
  };
  if(document.readyState==='complete') scheduleResources();
  else window.addEventListener('load',scheduleResources,{once:true});
  function pausePair(){ media.pause(); sourceVideo.pause(); }
  function restart(){ media.currentTime=0; sourceVideo.currentTime=0; userPaused=false; playPair(true); }
  togglePlayback.addEventListener('click',()=>{
    if(media.paused){ userPaused=false; playPair(true); }
    else { userPaused=true; pausePair(); }
    updatePlaybackLabel();
  });
  speedControl.addEventListener('input',()=>setSpeed(speedControl.value));
  replay.addEventListener('click',restart);
  new ResizeObserver(()=>{
    resizePending=true;
    if(reduced) requestAnimationFrame(render);
  }).observe(hero);
  compactLayout.addEventListener('change',({matches})=>{
    hero.dataset.mode=matches?'generated':'split';
    if(matches){
      sourceVideo.pause();
      sourceVideo.removeAttribute('src');
      sourceVideo.load();
    } else if(resourcesStarted) {
      sourceVideo.src=sourceVideoPath;
      sourceVideo.preload='metadata';
      sourceVideo.load();
      if(visible&&!userPaused) playPair();
    }
    resizePending=true;
    if(reduced) requestAnimationFrame(render);
  });
  new IntersectionObserver(([entry])=>{ visible=entry.isIntersecting; if(visible) startHeroResources(); else pausePair(); }).observe(hero);
  document.addEventListener('visibilitychange',()=>{ if(document.hidden) pausePair(); else if(visible) startHeroResources(); });
  media.addEventListener('play',updatePlaybackLabel); media.addEventListener('pause',updatePlaybackLabel);
  media.addEventListener('canplay',()=>{
    if(reduced) requestAnimationFrame(render);
    else playPair();
  },{once:true});
  sourceVideo.addEventListener('canplay',()=>{
    if(reduced) requestAnimationFrame(render);
    else playPair();
  });
  setSpeed(.65); updatePlaybackLabel();
  window.animalHero={
    setMode(mode){
      if(['split','original','generated'].includes(mode)){
        hero.dataset.mode=mode;
        resizePending=true;
        resize();
      }
    },
    play(){ userPaused=false; playPair(true); },
    pause(){ userPaused=true; pausePair(); },
    restart, setSpeed
  };
  if(!reduced) requestAnimationFrame(render);
})();
