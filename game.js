import * as THREE from './vendor/three.module.js';

const $ = id => document.getElementById(id);
const canvas = $('scene');
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x46534c);
scene.fog = new THREE.FogExp2(0x46534c, 0.021);
const camera = new THREE.PerspectiveCamera(72, 1, 0.1, 160);
camera.position.set(0, 1.65, 8);
const renderer = new THREE.WebGLRenderer({canvas, antialias:true, powerPreference:'high-performance'});
renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.7));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.15;

scene.add(new THREE.HemisphereLight(0xb7c9bd, 0x32362b, 1.15));
const moon = new THREE.DirectionalLight(0xdce9dc, 2.3);
moon.position.set(-12, 24, 8); moon.castShadow = true;
moon.shadow.mapSize.set(1024,1024); moon.shadow.camera.left=-35; moon.shadow.camera.right=35; moon.shadow.camera.top=35; moon.shadow.camera.bottom=-35;
scene.add(moon);
const fill = new THREE.DirectionalLight(0xe4ae6e, 0.85); fill.position.set(9,8,-14); scene.add(fill);
const warm = new THREE.PointLight(0xff9a4f, 20, 17, 2); warm.position.set(-5,5,-12); scene.add(warm);
const cool = new THREE.PointLight(0x81a8a0, 12, 18, 2); cool.position.set(7,4,0); scene.add(cool);

const mat = (color, roughness=.82, metalness=0) => new THREE.MeshStandardMaterial({color,roughness,metalness});
const concrete=mat(0x50564e), darkConcrete=mat(0x343a35), rust=mat(0x55493b), steel=mat(0x303936,.5,.65), olive=mat(0x4c5542), sand=mat(0x8c8063), black=mat(0x151a19,.34,.7), gunMetal=mat(0x313a39,.27,.8), rubber=mat(0x181b19), wood=mat(0x604e3a), zombieSkin=mat(0x687263), rotten=mat(0x455448), shirt=mat(0x4b5147), blood=mat(0x542a24);
function box(parent, name, size, position, material, cast=true){const m=new THREE.Mesh(new THREE.BoxGeometry(...size),material);m.name=name;m.position.set(...position);m.castShadow=cast;m.receiveShadow=true;parent.add(m);return m;}

// Concrete yard, perimeter and the silhouettes of an abandoned industrial outpost.
const ground= new THREE.Mesh(new THREE.PlaneGeometry(180,180),mat(0x343b37));ground.rotation.x=-Math.PI/2;ground.position.y=-.04;ground.receiveShadow=true;scene.add(ground);
const road=new THREE.Mesh(new THREE.PlaneGeometry(8,130),mat(0x454b46));road.rotation.x=-Math.PI/2;road.position.set(0,.002,-30);scene.add(road);
for(let i=-5;i<24;i++){const seam=box(scene,'road seam',[.04,.012,.09],[0,.008,-i*5],mat(0x676c64),false);seam.position.x=0;}
// road center broken markings
for(let i=0;i<13;i++)box(scene,'lane dash',[.12,.015,1.5],[0,.014,-i*8-2],mat(0x99937a),false);
// distant blockout silhouettes
for(const [x,z,w,h,d,c] of [[-20,-30,13,16,14,0x535b51],[19,-37,17,20,19,0x434d48],[-31,-58,17,23,19,0x48524d],[31,-62,21,19,15,0x53564d],[-12,-82,22,25,18,0x4a514b],[12,-93,25,30,18,0x464d48]]){
 const b=box(scene,'warehouse',[w,h,d],[x,h/2-0.1,z],mat(c),true);b.castShadow=true;
 for(let yy=3;yy<h-2;yy+=4) box(scene,'window',[w*.82,.12,.08],[x,yy,z+d/2+.05],mat(0x242d29),false);
}
// containers, jersey barriers, pallets, crates, drums, fence posts
for(const [x,z,w,h,d,color] of [[-7,-11,5,3.8,2.4,0x59665b],[8,-18,6,4,2.5,0x714f3d],[-12,-28,6,4,2.5,0x59645b],[13,-36,5,3.8,2.4,0x665342]]){
 const c=box(scene,'shipping container',[w,h,d],[x,h/2,z],mat(color,.7,.25));
 for(let xx=-w/2+.25;xx<w/2;xx+=.45)box(scene,'container rib',[.045,h*.93,.04],[x+xx,h/2,z+d/2+.025],steel,false);
 box(scene,'container top rail',[w,.12,d],[x,h-.04,z],steel,false);
}
for(let i=0;i<8;i++){
 const x=(i%2?1:-1)*(5.7+(i%3)*1.6),z=-5-Math.floor(i/2)*9;
 const b=box(scene,'cargo crate',[1.1+(i%3)*.35,1.05,.95],[x,.53,z],i%2?wood:olive);
 for(let yy=.14;yy<1;yy+=.3)box(scene,'crate slat',[1.12+(i%3)*.35,.035,.98],[x,.53-1.05/2+yy,z],sand,false);
}
for(let i=0;i<9;i++){
 let x=-15+i*3.7;
 const post=box(scene,'fence post',[.12,2.5,.12],[x,1.25,-22],steel);
 for(let y=.8;y<2.6;y+=.55)box(scene,'fence wire',[3.65,.025,.025],[x+1.82,y,-22],steel,false);
}
for(const [x,z] of [[-5,-7],[6,-24],[-14,-42],[11,-48]]){
 const barrel=new THREE.Mesh(new THREE.CylinderGeometry(.42,.42,1.2,12),mat(0x55574d,.55,.3));barrel.position.set(x,.6,z);barrel.castShadow=true;scene.add(barrel);
 box(scene,'barrel band',[.87,.09,.87],[x,.43,z],steel,false);
}
// scattered weeds and debris
for(let i=0;i<90;i++){
 const x=(Math.random()-.5)*70,z=-Math.random()*90;
 if(Math.abs(x)<4)continue;
 const weed=new THREE.Mesh(new THREE.ConeGeometry(.035+Math.random()*.05,.2+Math.random()*.45,3),mat(i%2?0x52604a:0x626246));weed.position.set(x,.12,z);weed.rotation.z=(Math.random()-.5)*.8;scene.add(weed);
}
// overhead lamps in the yard
for(const [x,z] of [[-8,-15],[8,-32],[-8,-52]]){
 box(scene,'lamp pole',[.12,7,.12],[x,3.5,z],steel);
 const bulb=new THREE.PointLight(0xffba70,24,16,2);bulb.position.set(x,6.8,z);scene.add(bulb);
 const shade=new THREE.Mesh(new THREE.CylinderGeometry(.3,.48,.16,8),steel);shade.position.set(x,6.8,z);scene.add(shade);
}

// A detailed, compact first-person AK build. Geometry is attached to camera for reliable touch framing.
const weaponRoot=new THREE.Group();camera.add(weaponRoot);scene.add(camera);
function weaponPart(name,size,pos,material,rot=[0,0,0]){const m=box(weaponRoot,name,size,pos,material);m.rotation.set(...rot);return m;}
function buildWeapon(type){while(weaponRoot.children.length)weaponRoot.remove(weaponRoot.children[0]);
 if(type===0){
  weaponPart('receiver',[.19,.25,.58],[.28,-.35,-.65],gunMetal);
  weaponPart('upper receiver',[.18,.1,.7],[.28,-.225,-.69],steel);
  weaponPart('dust cover',[.2,.07,.45],[.28,-.16,-.73],black);
  weaponPart('handguard',[.16,.16,.48],[.28,-.3,-1.13],olive);
  weaponPart('lower handguard',[.14,.11,.38],[.28,-.43,-1.11],wood);
  weaponPart('stock',[.14,.15,.57],[.28,-.31,-.18],wood,[0,-.05,-.08]);
  weaponPart('butt plate',[.17,.18,.07],[.28,-.31,.1],rubber);
  weaponPart('barrel',[.075,.075,.68],[.28,-.31,-1.68],gunMetal);
  weaponPart('muzzle',[.1,.09,.16],[.28,-.31,-2.05],steel);
  weaponPart('magazine',[.15,.42,.23],[.28,-.64,-.72],black,[.08,0,0]);
  weaponPart('mag plate',[.155,.045,.24],[.28,-.85,-.72],steel);
  weaponPart('pistol grip',[.13,.26,.16],[.28,-.53,-.42],rubber,[.2,0,-.08]);
  weaponPart('sight rail',[.08,.035,.57],[.28,-.095,-.68],black);
  weaponPart('rear sight',[.09,.11,.06],[.28,-.04,-.48],steel);
  weaponPart('front sight',[.055,.14,.05],[.28,-.04,-1.91],steel);
  weaponPart('front post',[.025,.11,.025],[.28,.005,-1.91],black);
  weaponPart('selector',[.04,.13,.06],[.38,-.31,-.48],steel,[0,0,-.4]);
  for(let i=0;i<4;i++)weaponPart('handguard vent',[.02,.025,.08],[.366,-.28,-.97+i*.1],black);
  for(let i=0;i<5;i++)weaponPart('mag groove',[.157,.018,.02],[.28,-.53-i*.055,-.603],steel);
 }else{
  weaponPart('mp5 receiver',[.2,.23,.54],[.28,-.35,-.65],gunMetal);
  weaponPart('upper',[.16,.13,.62],[.28,-.22,-.72],steel);
  weaponPart('foregrip',[.15,.15,.43],[.28,-.33,-1.13],black);
  weaponPart('stock',[.12,.15,.54],[.28,-.31,-.11],steel);
  weaponPart('stock pad',[.15,.17,.07],[.28,-.31,.16],rubber);
  weaponPart('barrel',[.06,.06,.55],[.28,-.31,-1.65],gunMetal);
  weaponPart('suppressor',[.1,.1,.4],[.28,-.31,-2.05],black);
  weaponPart('magazine',[.13,.38,.16],[.28,-.61,-.69],steel,[.04,0,0]);
  weaponPart('pistol grip',[.13,.24,.14],[.28,-.53,-.4],rubber,[.2,0,-.08]);
  weaponPart('top rail',[.08,.04,.55],[.28,-.12,-.7],black);
  weaponPart('optic',[.14,.13,.18],[.28,-.015,-.68],steel);
  weaponPart('optic glass',[.11,.07,.02],[.28,-.01,-.78],mat(0x426e64,.2,.6));
  weaponPart('front post',[.035,.13,.04],[.28,-.04,-1.82],steel);
 }
 // subtle receiver fasteners
 for(const x of [.185,.375])for(const z of [-.83,-.5]){const pin=new THREE.Mesh(new THREE.CylinderGeometry(.018,.018,.012,8),steel);pin.rotation.z=Math.PI/2;pin.position.set(x,-.34,z);weaponRoot.add(pin);}
}
buildWeapon(0);
const muzzleFlash=new THREE.PointLight(0xffc15e,0,3,2);weaponRoot.add(muzzleFlash);muzzleFlash.position.set(.28,-.31,-2.1);

// Procedural infected with layered clothing, rounded anatomy and separate hit zones.
const zombies=[];
function makeZombie(x,z){
  const root=new THREE.Group();root.position.set(x,0,z);scene.add(root);
  const core=new THREE.Group();root.add(core);
  const tops=[shirt,mat(0x535347),mat(0x4a514f),mat(0x665144)], skins=[zombieSkin,mat(0x777663),mat(0x5d695c)];
  const top=tops[Math.floor(Math.random()*tops.length)], skin=skins[Math.floor(Math.random()*skins.length)];
  const capsule=(name,radius,length,pos,material,zone='body',parent=core)=>{const m=new THREE.Mesh(new THREE.CapsuleGeometry(radius,length,4,8),material);m.name=name;m.position.set(...pos);m.castShadow=true;m.receiveShadow=true;m.userData.zone=zone;parent.add(m);return m;};
  const body=capsule('torso',.3,.48,[0,1.15,0],top);
  const vest=new THREE.Mesh(new THREE.BoxGeometry(.49,.53,.27),mat(0x343b34));vest.position.set(0,1.19,.13);vest.castShadow=true;core.add(vest);vest.userData.zone='body';
  for(const side of [-1,1]){const strap=new THREE.Mesh(new THREE.BoxGeometry(.065,.61,.055),mat(0x77745e));strap.position.set(side*.17,1.2,.275);strap.rotation.z=side*-.18;core.add(strap);strap.userData.zone='body';const pouch=new THREE.Mesh(new THREE.BoxGeometry(.14,.17,.1),mat(0x555744));pouch.position.set(side*.19,.99,.3);core.add(pouch);pouch.userData.zone='body';}
  const collar=new THREE.Mesh(new THREE.CylinderGeometry(.13,.17,.14,8),mat(0x4a4b41));collar.position.y=1.5;core.add(collar);collar.userData.zone='body';
  const head=new THREE.Mesh(new THREE.SphereGeometry(.235,16,12),skin);head.scale.set(.9,1.12,.92);head.position.set(0,1.78,-.015);head.castShadow=true;core.add(head);head.userData.zone='head';
  const jaw=new THREE.Mesh(new THREE.CapsuleGeometry(.085,.12,3,7),blood);jaw.scale.set(1,.58,.7);jaw.position.set(0,1.62,.14);core.add(jaw);jaw.userData.zone='head';
  const nose=new THREE.Mesh(new THREE.SphereGeometry(.055,8,6),skin);nose.scale.set(.7,1,.65);nose.position.set(0,1.75,.205);core.add(nose);nose.userData.zone='head';
  const eyeMat=new THREE.MeshBasicMaterial({color:0xd05632});for(const ex of [-.095,.095]){const eye=new THREE.Mesh(new THREE.SphereGeometry(.027,8,6),eyeMat);eye.position.set(ex,1.81,.195);core.add(eye);eye.userData.zone='head';}
  const hair=new THREE.Mesh(new THREE.SphereGeometry(.19,10,6,0,Math.PI*2,0,Math.PI*.42),mat(0x252a25));hair.position.set(0,1.91,-.025);core.add(hair);hair.userData.zone='head';
  const limbs=[];
  for(const side of [-1,1]){
    const arm=new THREE.Group();arm.position.set(side*.36,1.38,0);core.add(arm);
    capsule('upper arm',.105,.28,[0,-.2,0],top,'body',arm);
    const fore=capsule('forearm',.075,.28,[side*.02,-.48,.055],skin,'body',arm);fore.rotation.z=side*-.12;
    const hand=new THREE.Mesh(new THREE.SphereGeometry(.09,8,6),skin);hand.position.set(side*.04,-.7,.08);arm.add(hand);hand.userData.zone='body';limbs.push({mesh:arm,phase:side*Math.PI});
    const leg=new THREE.Group();leg.position.set(side*.16,.73,0);core.add(leg);
    capsule('thigh',.13,.3,[0,-.2,0],darkConcrete,'body',leg);capsule('shin',.085,.27,[0,-.51,.035],skin,'body',leg);
    const boot=new THREE.Mesh(new THREE.BoxGeometry(.22,.14,.34),rubber);boot.position.set(0,-.73,.11);boot.castShadow=true;leg.add(boot);boot.userData.zone='body';
    const knee=new THREE.Mesh(new THREE.BoxGeometry(.2,.12,.08),mat(0x555548));knee.position.set(0,-.39,.12);leg.add(knee);knee.userData.zone='body';limbs.push({mesh:leg,phase:side*Math.PI,leg:true});
  }
  const torn=new THREE.Mesh(new THREE.ConeGeometry(.1,.24,5),blood);torn.position.set(-.2,.98,.17);torn.rotation.z=.4;core.add(torn);
  const hp=2+Math.floor(wave*.25),zombie={root,core,limbs,health:hp,maxHealth:hp,alive:true,attack:Math.random()*.6,groan:2+Math.random()*5,walk:Math.random()*6,body,head};zombies.push(zombie);return zombie;
}
let gameStarted=false,gameOver=false,aiming=false, firing=false, reloading=false, kills=0, wave=0, waveTotal=0, spawned=0, nextSpawn=0, wavePause=0, raidSeconds=0, health=100, stamina=100, hitCooldown=0, shotCooldown=0, recoil=0, fireTimer=0, extractionReady=false, soundOn=false;
let bleeding=false,fractured=false,bandages=2,medkits=2,bleedTick=0,intelRecovered=0,radioUnlocked=false,audioContext=null,ambientNode=null;
const intelItems=[];
const ammoPools=[{mag:30,reserve:120,max:30},{mag:30,reserve:120,max:30}], weaponNames=['AK-103','MP5A3'], weaponTypes=['PS GZH','FMJ'];let weaponIndex=0;
function createIntelSites(){
  for(const [x,z] of [[0,-11],[-10,-31],[10,-50]]){
    const group=new THREE.Group();group.position.set(x,0,z);scene.add(group);
    const beam=new THREE.Mesh(new THREE.CylinderGeometry(.035,.18,2.4,8,1,true),new THREE.MeshBasicMaterial({color:0xd8f36a,transparent:true,opacity:.18,depthWrite:false}));beam.position.y=1.2;group.add(beam);
    const ring=new THREE.Mesh(new THREE.TorusGeometry(.48,.035,6,24),new THREE.MeshBasicMaterial({color:0xd8f36a}));ring.rotation.x=Math.PI/2;ring.position.y=.08;group.add(ring);
    const caseMesh=new THREE.Mesh(new THREE.BoxGeometry(.48,.12,.34),mat(0x42483b));caseMesh.position.y=.1;caseMesh.castShadow=true;group.add(caseMesh);
    const page=new THREE.Mesh(new THREE.BoxGeometry(.25,.025,.17),new THREE.MeshStandardMaterial({color:0xd8d2b7,emissive:0x57533b}));page.position.set(0,.18,0);group.add(page);
    const light=new THREE.PointLight(0xd8f36a,4,5,2);light.position.y=.7;group.add(light);
    intelItems.push({group,x,z,recovered:false});
  }
}
createIntelSites();
const extractionPad=new THREE.Group();extractionPad.position.set(0,.015,7);scene.add(extractionPad);const extractionRing=new THREE.Mesh(new THREE.TorusGeometry(2.4,.09,8,36),new THREE.MeshBasicMaterial({color:0xf0a25d,transparent:true,opacity:.8}));extractionRing.rotation.x=Math.PI/2;extractionPad.add(extractionRing);const extractionCore=new THREE.Mesh(new THREE.CircleGeometry(2.1,36),new THREE.MeshBasicMaterial({color:0x9b5932,transparent:true,opacity:.12,side:THREE.DoubleSide}));extractionCore.rotation.x=-Math.PI/2;extractionCore.position.y=-.01;extractionPad.add(extractionCore);
function initAudio(){if(!audioContext){const Ctx=window.AudioContext||window.webkitAudioContext;if(!Ctx)return;audioContext=new Ctx();const length=audioContext.sampleRate*2,buffer=audioContext.createBuffer(1,length,audioContext.sampleRate),data=buffer.getChannelData(0);for(let i=0;i<length;i++)data[i]=(Math.random()*2-1)*.12;ambientNode=audioContext.createBufferSource();ambientNode.buffer=buffer;ambientNode.loop=true;const filter=audioContext.createBiquadFilter();filter.type='lowpass';filter.frequency.value=320;const gain=audioContext.createGain();gain.gain.value=.035;ambientNode.connect(filter).connect(gain).connect(audioContext.destination);ambientNode.start();ambientNode._gain=gain;}audioContext.resume?.();}
function playSfx(kind){if(!soundOn)return;initAudio();if(!audioContext)return;const now=audioContext.currentTime,osc=audioContext.createOscillator(),gain=audioContext.createGain(),filter=audioContext.createBiquadFilter();filter.type='lowpass';osc.connect(filter).connect(gain).connect(audioContext.destination);const sounds={shot:[105,48,.12,'sawtooth'],hit:[180,70,.09,'triangle'],reload:[430,260,.12,'square'],heal:[610,880,.22,'sine'],pickup:[520,960,.3,'sine'],groan:[88,54,.36,'sawtooth']};const [from,to,duration,type]=sounds[kind]||sounds.hit;osc.type=type;osc.frequency.setValueAtTime(from,now);osc.frequency.exponentialRampToValueAtTime(Math.max(20,to),now+duration);filter.frequency.value=kind==='shot'?700:1400;gain.gain.setValueAtTime(kind==='shot'?.13:.055,now);gain.gain.exponentialRampToValueAtTime(.001,now+duration);osc.start(now);osc.stop(now+duration);}
function setSound(enabled){soundOn=enabled;initAudio();if(ambientNode?._gain)ambientNode._gain.gain.setTargetAtTime(soundOn?.035:0,audioContext.currentTime,.12);$('soundToggle').style.color=soundOn?'var(--lime)':'#dfe4dc';showToast(soundOn?'AUDIO ENABLED':'AUDIO MUTED');}
const keys={};
const raycaster=new THREE.Raycaster();raycaster.far=85;
const clock=new THREE.Clock();
let yaw=0,pitch=0,moveX=0,moveY=0,lastPointer={x:0,y:0};
const player={position:camera.position, speed:4.5};
function isMobile(){return matchMedia('(pointer:coarse)').matches||window.innerWidth<760;}
function resize(){const w=window.innerWidth,h=window.innerHeight;renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix();camera.fov=aiming?48:72;camera.updateProjectionMatrix();}
window.addEventListener('resize',resize);resize();
function updateHUD(){const pool=ammoPools[weaponIndex];$('ammo').textContent=String(pool.mag).padStart(2,'0');$('reserve').textContent=pool.reserve;$('weaponName').textContent=weaponNames[weaponIndex];$('ammoType').textContent=weaponTypes[weaponIndex];$('healthNum').textContent=Math.ceil(health);$('healthBar').style.width=`${health}%`;$('stamina').textContent=Math.round(stamina);$('threatCount').textContent=zombies.filter(z=>z.alive).length;$('waveProgress').style.width=waveTotal?`${Math.min(100,spawned/waveTotal*100)}%`:'0%';$('fireMode').innerHTML=weaponIndex===0?'AUTO <span>▾</span>':'SEMI <span>▾</span>';const bleed=$('bleedStatus');bleed.textContent=bleeding?'YES':'NO';bleed.className=bleeding?'bad':'good';$('injuryStatus').textContent=fractured?'FRACTURE':'STABLE';$('injuryStatus').className=fractured?'bad':'good';$('bandageCount').textContent=bandages;$('medkitCount').textContent=medkits;$('intelCount').textContent=`${intelRecovered}/3`;updateObjectives();}
function updateObjectives(){const set=(id,done)=>{const row=$(id);row.classList.toggle('done',done);row.querySelector('i').textContent=done?'✓':'□';};const cleared=wave>=3&&spawned===waveTotal&&!zombies.some(z=>z.alive);set('intelObjective',intelRecovered>=3);set('clearObjective',cleared);set('extractObjective',gameOver&&extractionReady);$('objectiveHint').textContent=extractionReady?(atExtraction()?'Extraction ready — press E to leave':'All objectives complete — return to insertion'):intelRecovered<3?'Press E near marked intel':cleared?'All waves clear — return to insertion':'Clear all 3 hostile waves';}
function showToast(message){const el=$('toast');el.textContent=message;el.classList.add('show');clearTimeout(showToast.timer);showToast.timer=setTimeout(()=>el.classList.remove('show'),2100);}
function updateWaveUI(){ $('waveLabel').textContent=`WAVE ${String(wave).padStart(2,'0')}`;$('waveSub').textContent=wave===0?'CONTACT IMMINENT':`HOSTILES ${spawned}/${waveTotal}`; }
function beginWave(){wave++;waveTotal=4+wave*2;spawned=0;nextSpawn=.5;updateWaveUI();showToast(`WAVE ${String(wave).padStart(2,'0')} — CONTACT`);}
function spawnEnemy(){const side=Math.random()<.5?-1:1;let x,z;if(Math.random()<.72){x=side*(8+Math.random()*12);z=-8-Math.random()*48;}else{x=(Math.random()-.5)*32;z=-24-Math.random()*38;}makeZombie(x,z);spawned++;updateWaveUI();}
function startGame(){if(gameStarted&&!gameOver)return;gameStarted=true;gameOver=false;health=100;stamina=100;kills=0;wave=0;spawned=0;waveTotal=0;wavePause=0;raidSeconds=0;extractionReady=false;bleeding=false;fractured=false;bleedTick=0;bandages=2;medkits=2;intelRecovered=0;reloading=false;camera.position.set(0,1.65,8);yaw=0;pitch=0;for(const item of intelItems){item.recovered=false;item.group.visible=true;}zombies.splice(0).forEach(z=>scene.remove(z.root));ammoPools[0]={mag:30,reserve:120,max:30};ammoPools[1]={mag:30,reserve:120,max:30};weaponIndex=0;buildWeapon(0);$('startOverlay').style.display='none';$('endOverlay').classList.add('hidden');$('extractText').textContent='HOLD POSITION';$('objective').textContent='RECOVER INTEL / CLEAR AREA';$('controlsHint').style.display=isMobile()?'none':'block';if(soundOn)initAudio();if(!isMobile())canvas.requestPointerLock?.();beginWave();updateHUD();clock.getDelta();}
$('startBtn').addEventListener('click',startGame);$('restartBtn').addEventListener('click',startGame);
canvas.addEventListener('click',()=>{if(gameStarted&&!gameOver&&!isMobile()&&document.pointerLockElement!==canvas)canvas.requestPointerLock?.();});
document.addEventListener('mousemove',e=>{if(document.pointerLockElement===canvas&&gameStarted){yaw-=e.movementX*.0022;pitch-=e.movementY*.0022;pitch=THREE.MathUtils.clamp(pitch,-1.25,1.25);}});
document.addEventListener('keydown',e=>{keys[e.code]=true;if(['Space','ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.code))e.preventDefault();if(!gameStarted)return;if(e.code==='KeyR')reload();if(e.code==='KeyH')useBandage();if(e.code==='KeyV')useMedkit();if(e.code==='Digit1')switchWeapon(0);if(e.code==='Digit2')switchWeapon(1);if(e.code==='KeyQ')switchWeapon(1-weaponIndex);if(e.code==='KeyE')interact();if(e.code==='Space'){aiming=true;resize();}});
document.addEventListener('keyup',e=>{keys[e.code]=false;if(e.code==='Space'){aiming=false;resize();}});
document.addEventListener('mousedown',e=>{if(e.button===0&&gameStarted){firing=true;shoot();}if(e.button===2){aiming=true;resize();}});
document.addEventListener('mouseup',e=>{if(e.button===0)firing=false;if(e.button===2){aiming=false;resize();}});
document.addEventListener('contextmenu',e=>e.preventDefault());
function useBandage(){if(!gameStarted||gameOver)return;if(bandages<=0){showToast('NO BANDAGES LEFT');return;}if(!bleeding){showToast('NO ACTIVE BLEED');return;}bandages--;bleeding=false;playSfx('heal');showToast('BLEEDING STOPPED — BANDAGE APPLIED');updateHUD();}
function useMedkit(){if(!gameStarted||gameOver)return;if(medkits<=0){showToast('NO IFAK LEFT');return;}if(health>=100&&!fractured){showToast('NO TREATMENT NEEDED');return;}medkits--;health=Math.min(100,health+45);fractured=false;playSfx('heal');showToast('IFAK APPLIED — CONDITION STABILIZED');updateHUD();}
function atExtraction(){return Math.hypot(camera.position.x,camera.position.z-7)<3.5;}
function checkExtraction(){const wavesCleared=wave>=3&&spawned===waveTotal&&!zombies.some(z=>z.alive);if(wavesCleared&&intelRecovered>=3&&!extractionReady){extractionReady=true;$('extractText').textContent=atExtraction()?'PRESS E TO EXTRACT':'RETURN TO INSERTION';$('objective').textContent='EXTRACTION AVAILABLE';showToast('OBJECTIVES COMPLETE — RETURN TO INSERTION');}else if(wavesCleared&&intelRecovered<3){$('objective').textContent='RECOVER REMAINING FIELD INTEL';}updateHUD();}
function interact(){if(!gameStarted||gameOver)return;let nearest=null,dist=Infinity;for(const item of intelItems){if(item.recovered)continue;const d=Math.hypot(camera.position.x-item.x,camera.position.z-item.z);if(d<dist){dist=d;nearest=item;}}if(nearest&&dist<2.8){nearest.recovered=true;nearest.group.visible=false;intelRecovered++;playSfx('pickup');showToast(`FIELD INTEL RECOVERED — ${intelRecovered}/3`);checkExtraction();updateHUD();return;}if(extractionReady){if(atExtraction())extract();else showToast('RETURN TO INSERTION POINT');return;}showToast(nearest&&dist<8?'MOVE CLOSER TO THE INTEL CACHE':'NO INTERACTION IN RANGE');}
function switchWeapon(index){if(index===weaponIndex)return;weaponIndex=index;buildWeapon(index);updateHUD();showToast(`LOADOUT: ${weaponNames[index]}`);}
function reload(){if(!gameStarted||reloading)return;const p=ammoPools[weaponIndex];if(p.mag>=p.max||p.reserve<=0){showToast(p.reserve<=0?'NO RESERVE AMMO':'MAGAZINE FULL');return;}reloading=true;firing=false;playSfx('reload');$('reloadIndicator').classList.add('loading');$('reloadToast').classList.add('show');const duration=weaponIndex===0?1650:1350;setTimeout(()=>{if(!gameStarted||gameOver){reloading=false;return;}const take=Math.min(p.max-p.mag,p.reserve);p.mag+=take;p.reserve-=take;reloading=false;$('reloadIndicator').classList.remove('loading');$('reloadToast').classList.remove('show');updateHUD();},duration);}
$('reloadBtn').addEventListener('pointerdown',e=>{e.preventDefault();reload();});$('swapBtn').addEventListener('pointerdown',e=>{e.preventDefault();switchWeapon(1-weaponIndex);});$('bandageBtn').addEventListener('click',useBandage);$('medkitBtn').addEventListener('click',useMedkit);
$('aimBtn').addEventListener('pointerdown',e=>{e.preventDefault();aiming=!aiming;$('aimBtn').classList.toggle('active',aiming);resize();});
$('fireBtn').addEventListener('pointerdown',e=>{e.preventDefault();firing=true;shoot();});for(const ev of ['pointerup','pointercancel','pointerleave'])$('fireBtn').addEventListener(ev,e=>{e.preventDefault();firing=false;});
$('soundToggle').addEventListener('click',()=>setSound(!soundOn));
// Drag anywhere on the right half to look around on touch screens.
let lookTouch=null;
canvas.addEventListener('pointerdown',e=>{if(e.pointerType==='touch'&&gameStarted&&e.clientX>window.innerWidth*.32){lookTouch={id:e.pointerId,x:e.clientX,y:e.clientY};canvas.setPointerCapture(e.pointerId);}});
canvas.addEventListener('pointermove',e=>{if(lookTouch&&e.pointerId===lookTouch.id){const dx=e.clientX-lookTouch.x,dy=e.clientY-lookTouch.y;yaw-=dx*.006;pitch=THREE.MathUtils.clamp(pitch-dy*.005,-1.2,1.2);lookTouch.x=e.clientX;lookTouch.y=e.clientY;}});
canvas.addEventListener('pointerup',e=>{if(lookTouch&&e.pointerId===lookTouch.id)lookTouch=null;});
// Virtual joystick movement.
const stickZone=$('stickZone'),stickKnob=$('stickKnob');let stickId=null,stickOrigin={x:0,y:0};
stickZone.addEventListener('pointerdown',e=>{e.preventDefault();stickId=e.pointerId;stickZone.setPointerCapture(e.pointerId);const r=stickZone.getBoundingClientRect();stickOrigin={x:r.left+r.width/2,y:r.top+r.height/2};moveX=moveY=0;});
stickZone.addEventListener('pointermove',e=>{if(stickId!==e.pointerId)return;const dx=e.clientX-stickOrigin.x,dy=e.clientY-stickOrigin.y,len=Math.hypot(dx,dy),max=44,s=Math.min(1,max/(len||1)),x=dx*s,y=dy*s;stickKnob.style.left=`calc(50% + ${x}px)`;stickKnob.style.top=`calc(50% + ${y}px)`;moveX=x/max;moveY=y/max;});
function resetStick(e){if(stickId!==e.pointerId)return;stickId=null;moveX=moveY=0;stickKnob.style.left='50%';stickKnob.style.top='50%';}
for(const ev of ['pointerup','pointercancel','lostpointercapture'])stickZone.addEventListener(ev,resetStick);

function shoot(){if(!gameStarted||gameOver||reloading||shotCooldown>0)return;const p=ammoPools[weaponIndex];if(p.mag<=0){showToast('MAGAZINE EMPTY — RELOAD');firing=false;return;}p.mag--;shotCooldown=weaponIndex===0?.105:.09;recoil=Math.min(recoil+.085,.28);playSfx('shot');muzzleFlash.intensity=55;setTimeout(()=>muzzleFlash.intensity=0,45);weaponRoot.position.z=.12;setTimeout(()=>weaponRoot.position.z=0,55);updateHUD();
 // Accurate center ray with a small first-shot cone, wider when hip firing.
 const spread=aiming?.0018:.008+recoil*.012;raycaster.setFromCamera(new THREE.Vector2((Math.random()-.5)*spread,(Math.random()-.5)*spread),camera);
 const targets=[];for(const z of zombies)if(z.alive)z.root.traverse(o=>{if(o.isMesh)targets.push(o);});
 const hit=raycaster.intersectObjects(targets,false)[0];
 if(hit){const z=zombies.find(q=>q.alive&&q.root===hit.object.parent?.parent?.parent || q.alive&&q.root===hit.object.parent?.parent || q.alive&&q.root===hit.object.parent);
  const owner=z||zombies.find(q=>q.alive&&q.root.getObjectById(hit.object.id));
  // Every hit mesh is nested under the zombie root, so resolve by walking parents.
  let node=hit.object,found=null;while(node&&!found){found=zombies.find(q=>q.alive&&q.root===node);node=node.parent;}
  const victim=found||owner;
  if(victim){const head=hit.object.userData.zone==='head';victim.health-=head?2:1;$('hitMarker').classList.remove('show');void $('hitMarker').offsetWidth;$('hitMarker').classList.add('show');if(victim.health<=0)killZombie(victim,head);else{victim.core.rotation.x=-.1;setTimeout(()=>{if(victim.alive)victim.core.rotation.x=0;},120);}}
 }
}
function killZombie(z,headshot){z.alive=false;kills++;z.root.rotation.x=-Math.PI/2;z.root.position.y=.12;setTimeout(()=>scene.remove(z.root),4000);const feed=document.createElement('div');feed.className='kill-entry';feed.innerHTML=`<span>${headshot?'HEADSHOT':'TARGET DOWN'}</span> &nbsp;INFECTED`;const box=$('killFeed');box.prepend(feed);setTimeout(()=>feed.remove(),4200);if(soundOn){}updateHUD();}
function damagePlayer(amount,canInjure=true){health=Math.max(0,health-amount);$('damageFlash').classList.remove('show');void $('damageFlash').offsetWidth;$('damageFlash').classList.add('show');playSfx('hit');if(canInjure&&!bleeding&&Math.random()<.24){bleeding=true;bleedTick=0;showToast('WOUNDED — APPLY A BANDAGE');}if(canInjure&&!fractured&&Math.random()<.13){fractured=true;showToast('LIMB FRACTURE — USE IFAK');}updateHUD();if(health<=0)endGame(false);}
function endGame(won){gameOver=true;firing=false;document.exitPointerLock?.();$('endOverlay').classList.remove('hidden');$('endEyebrow').textContent=won?'RAID COMPLETE':'OPERATOR DOWN';$('endTitle').textContent=won?'EXTRACTED':'KIA';$('endCopy').textContent=won?'You survived the outpost. Your squad will remember.':'The perimeter claimed another one. Go again.';$('finalKills').textContent=kills;$('finalTime').textContent=formatTime(raidSeconds);updateHUD();}
function extract(){if(!gameStarted||gameOver)return;if(!extractionReady){showToast('COMPLETE ALL RAID OBJECTIVES FIRST');return;}if(!atExtraction()){showToast('RETURN TO INSERTION POINT');return;}playSfx('pickup');endGame(true);}
function formatTime(seconds){return `${String(Math.floor(seconds/60)).padStart(2,'0')}:${String(Math.floor(seconds%60)).padStart(2,'0')}`;}

function update(dt){
 if(shotCooldown>0)shotCooldown-=dt;
 recoil=Math.max(0,recoil-dt*.42);
 if(gameStarted&&!gameOver){
  raidSeconds+=dt;$('raidTimer').textContent=formatTime(raidSeconds);
  if(bleeding){bleedTick+=dt;if(bleedTick>=1){bleedTick-=1;damagePlayer(2,false);}}
  const forward=(keys.KeyW||keys.ArrowUp?1:0)-(keys.KeyS||keys.ArrowDown?1:0)-moveY;
  const strafe=(keys.KeyD||keys.ArrowRight?1:0)-(keys.KeyA||keys.ArrowLeft?1:0)+moveX;
  const sprint=!fractured&&(keys.ShiftLeft||keys.ShiftRight||Math.hypot(moveX,moveY)>.92)&&stamina>0&&Math.abs(forward)+Math.abs(strafe)>.2;
  const speed=sprint?7.2:fractured?3.7:4.5;
  if(sprint)stamina=Math.max(0,stamina-dt*20);else stamina=Math.min(100,stamina+dt*13);
  const len=Math.hypot(forward,strafe)||1;
  camera.position.x+=(Math.sin(yaw)*forward+Math.cos(yaw)*strafe)/len*speed*dt;
  camera.position.z+=(-Math.cos(yaw)*forward+Math.sin(yaw)*strafe)/len*speed*dt;
  camera.position.x=THREE.MathUtils.clamp(camera.position.x,-32,32);camera.position.z=THREE.MathUtils.clamp(camera.position.z,-102,12);
  camera.rotation.order='YXZ';camera.rotation.set(pitch,yaw,0);
  if(firing){fireTimer+=dt;if(fireTimer>.12){fireTimer=0;shoot();}}else fireTimer=0;
  nextSpawn-=dt;
  if(spawned<waveTotal&&nextSpawn<=0){spawnEnemy();nextSpawn=Math.max(.6,1.42-wave*.12+Math.random()*.65);}
  for(const z of zombies){if(!z.alive)continue;const dx=camera.position.x-z.root.position.x,dz=camera.position.z-z.root.position.z,dist=Math.hypot(dx,dz);z.walk+=dt*7;z.groan-=dt;if(z.groan<=0&&dist<28){playSfx('groan');z.groan=5+Math.random()*6;}
   if(dist>1.45){const pace=wave>2?1.12:1;z.root.position.x+=dx/(dist||1)*pace*dt;z.root.position.z+=dz/(dist||1)*pace*dt;z.root.rotation.y=Math.atan2(dx,dz);z.core.position.y=Math.abs(Math.sin(z.walk))*.035;for(const l of z.limbs)l.mesh.rotation.x=Math.sin(z.walk+l.phase)*(l.leg?.5:.48)+(l.leg?0:-.42);}
   else{z.attack-=dt;if(z.attack<=0){damagePlayer(7+Math.min(wave,4));z.attack=1.05;}}
  }
  const living=zombies.some(z=>z.alive);
  if(spawned===waveTotal&&!living){if(wave<3){if(wavePause===0){wavePause=3.5;showToast('AREA CLEAR — NEXT WAVE INCOMING');}else{wavePause-=dt;if(wavePause<=0){wavePause=0;beginWave();}}}else checkExtraction();}
  if(extractionReady)$('extractText').textContent=atExtraction()?'PRESS E TO EXTRACT':'RETURN TO INSERTION';
  if(reloading){/* visual state is driven by the magazine timer */}
  updateHUD();
 }
 // camera-mounted rifle sway, aim, and subtle idle drift
 const t=performance.now()*.001;
 const targetX=aiming?0.02:.28,targetY=aiming?-.29:-.34;
 weaponRoot.position.x=THREE.MathUtils.lerp(weaponRoot.position.x,targetX,.12);
 weaponRoot.position.y=THREE.MathUtils.lerp(weaponRoot.position.y,targetY+Math.sin(t*1.6)*.006,.08);
 weaponRoot.rotation.x=THREE.MathUtils.lerp(weaponRoot.rotation.x,recoil*.7,.2);
 camera.fov=THREE.MathUtils.lerp(camera.fov,aiming?48:72,.14);camera.updateProjectionMatrix();
 document.querySelector('.crosshair').style.transform=`translate(-50%,-50%) scale(${1+recoil*1.4})`;
 const degrees=((THREE.MathUtils.radToDeg(yaw)%360)+360)%360;$('bearing').innerHTML=`${degrees<45||degrees>315?'N':degrees<135?'E':degrees<225?'S':'W'} &nbsp;${String(Math.round(degrees)).padStart(3,'0')}°`;
}
function animate(){requestAnimationFrame(animate);const dt=Math.min(clock.getDelta(),.05);update(dt);renderer.render(scene,camera);}

// A small extraction interaction affordance doubles as the touch control.
$('extractText').parentElement.parentElement.addEventListener('pointerdown',e=>{e.preventDefault();interact();});
$('extractText').parentElement.parentElement.style.cursor='pointer';
$('extractText').textContent='HOLD POSITION';
updateHUD();
animate();
