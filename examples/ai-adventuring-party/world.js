import * as T from 'https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js';
export function createPartyWorld(){
 const group=new T.Group(), clock={time:0}, participants=[], sparks=[];
 const mat=(c,roughness=.8)=>new T.MeshStandardMaterial({color:c,roughness,metalness:.12});
 const rock=mat(0x3b4a51),ground=mat(0x334f42),water=mat(0x245b68,.27),wood=mat(0x75543a),brass=mat(0xc59a55,.3);
 function mesh(geometry,material,x,y,z,parent=group){const o=new T.Mesh(geometry,material);o.position.set(x,y,z);parent.add(o);return o}
 // A small circular world: land, water, mill, bridge, standing stones.
 const disk=mesh(new T.CylinderGeometry(9.4,9.2,1.1,64),rock,0,-.72,0);
 mesh(new T.CylinderGeometry(9.2,9.2,.12,64),ground,0,-.1,0);
 const river=mesh(new T.PlaneGeometry(5.0,18.1),water,1.9,-.024,0);river.rotation.x=-Math.PI/2;
 for(let i=0;i<8;i++){const x=-7+i*1.8;const stone=mesh(new T.DodecahedronGeometry(.48+i%3*.13,0),rock,x,.35,-4.8+Math.sin(i*2)*.7);stone.rotation.set(.3*i,.8*i,0)}
 // Mill and wheel.
 const mill=mesh(new T.CylinderGeometry(1.5,1.65,2.2,8),wood,4.6,1.04,-1.9);
 const roof=mesh(new T.ConeGeometry(2.05,1.35,8),mat(0x514448),4.6,2.75,-1.9);roof.rotation.y=Math.PI/8;
 const wheel=new T.Group();wheel.position.set(3.02,.8,-1.9);group.add(wheel);
 const rim=mesh(new T.TorusGeometry(1.15,.1,8,24),brass,0,0,0,wheel);rim.rotation.y=Math.PI/2;
 for(let i=0;i<8;i++){const a=i*Math.PI/4;const spoke=mesh(new T.BoxGeometry(.09,2.2,.13),wood,0,0,0,wheel);spoke.rotation.x=a;spoke.rotation.y=Math.PI/2}
 for(let i=0;i<9;i++){const plank=mesh(new T.BoxGeometry(3.4,.12,.35),wood,.1,.14,-3+i*.75);plank.rotation.y=.02}
 const fire=mesh(new T.IcosahedronGeometry(.22,0),new T.MeshBasicMaterial({color:0xffaa49}),-2.5,.33,1.5);
 const colors=[0x8dc9a1,0xa7a9ee,0xe2b66c,0xd98b81];
 const names=['Thistle','Vael','Brunna','Mord'];
 for(let i=0;i<4;i++){
  const agent=new T.Group();group.add(agent);
  const a=i*Math.PI/2+.4;agent.position.set(-2.4+Math.cos(a)*1.25,0,1.5+Math.sin(a)*1.25);
  mesh(new T.CylinderGeometry(.27,.34,.85,7),mat(colors[i]),0,.62,0,agent);
  mesh(new T.SphereGeometry(.27,10,8),mat(0xe8c9a4),0,1.24,0,agent);
  const hat=mesh(new T.ConeGeometry(.38,.44,8),mat(i===1?0x52518b:0x413d36),0,1.63,0,agent);
  if(i===2){hat.scale.set(1.1,.45,1.1);hat.position.y=1.48}
  const glow=mesh(new T.SphereGeometry(.09,8,6),new T.MeshBasicMaterial({color:colors[i]}),0,1.96,0,agent);
  participants.push({agent,name:names[i],home:agent.position.clone(),glow});
 }
 const atmosphere=mesh(new T.SphereGeometry(10.05,48,24),new T.MeshPhysicalMaterial({color:0x87bdce,transparent:true,opacity:.065,roughness:.08,metalness:.1,side:T.BackSide,depthWrite:false}),0,0,0);
 // Physical scene is intentionally self-contained. No Genesis imports or mutations.
 const log=document.getElementById('log');let beat=0;
 const beats=[
 [['Thistle','I check the floorboards. Quietly. And I am absolutely not touching the suspicious lever.'],['Vael','The water is flowing uphill near the wheel. That is not a natural phenomenon.'],['Brunna','Before we investigate, is anyone injured?'],['Mord','I would like to hit the mill. Not all of it. Just enough.']],
 [['Thistle','I found muddy footprints beneath the mill. They go in. None come out.'],['Vael','I cast a cautious light beneath the boards.'],['Brunna','I hold the bridge and watch the current.'],['Mord','I have decided not to hit the mill. Yet.']],
 [['Thistle','There is a trapdoor. Someone has carved an eye into the latch.'],['Vael','That symbol predates the mill by centuries.'],['Brunna','We should ask who built this place before opening it.'],['Mord','I open the trapdoor. Very politely.']]
 ];
 function say(who,line,dm=false){const div=document.createElement('div');div.className='line'+(dm?' dm':'');const b=document.createElement('b');b.textContent=who+': ';div.append(b,document.createTextNode(line));log.append(div);log.scrollTop=log.scrollHeight}
 say('Narrator','A flooded mill stands on a small island. Four adventurers await your story.');
 function react(){const set=beats[beat%beats.length];for(const [who,line] of set)say(who,line);beat++;document.getElementById('turn').textContent='ACT I · BEAT '+(beat+1)}
 document.getElementById('advance').onclick=react;
 document.getElementById('reset').onclick=()=>{beat=0;log.textContent='';say('Narrator','The drowned mill awaits. What happens first?')};
 document.getElementById('dmForm').addEventListener('submit',e=>{e.preventDefault();const input=document.getElementById('dmInput');const v=input.value.trim();if(!v)return;say('Dungeon Master',v,true);input.value='';react()});
 function update(dt,t){clock.time=t;wheel.rotation.x=t*.42;fire.scale.setScalar(1+Math.sin(t*7)*.15);participants.forEach((p,i)=>{p.agent.position.y=Math.sin(t*2+i)*.035;p.agent.rotation.y=Math.sin(t*.5+i)*.14;p.glow.scale.setScalar(1+Math.sin(t*3+i)*.15)});river.material.opacity=.95}
 let view=null;function attachView(v){view=v}
 function tap(x,y){if(!view)return;const {camera}=view;const ray=new T.Raycaster();ray.setFromCamera(new T.Vector2(x/window.innerWidth*2-1,1-y/window.innerHeight*2),camera);const hit=ray.intersectObject(disk);if(hit.length){const p=hit[0].point;const a=participants[beat%4];a.home.set(p.x,0,p.z);a.agent.position.x=p.x;a.agent.position.z=p.z;say('Narrator',a.name+' approaches the place you indicated.');}}
 function inspect(){return {example:'ai-adventuring-party',mode:'authored scripted demo, no live model API',characters:names,beat,world:'drowned mill',groupChildren:group.children.length}}
 return {group,update,attachView,tap,castMeteor:react,inspect,observationTargets:()=>({terrain:disk})};
}