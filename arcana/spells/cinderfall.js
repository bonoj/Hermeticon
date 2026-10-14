// Cinderfall phase one: BB meteor, delayed turbulent ember wake, terrain contact event.
// No deformation, blast damage, or changes to organism ownership.
export function createCinderfall(T,{surface,targets=()=>[],offset=()=>({x:0,z:0}),parent=null,seed=741,radius=9.72}={}){
 if(typeof surface!=='function')throw Error('Cinderfall requires surface');
 const group=new T.Group();group.name='Cinderfall';parent?.add(group);
 const rand=n=>{const x=Math.sin(n*127.1+seed*73.7)*43758.5453;return x-Math.floor(x)};
 const geo=new T.IcosahedronGeometry(1,1),mat=new T.MeshStandardMaterial({roughness:.66,metalness:.07,vertexColors:false});
 const count=73,mesh=new T.InstancedMesh(geo,mat,count);mesh.frustumCulled=false;mesh.count=0;group.add(mesh);
 const colors=[0xffd49a,0xff5a27,0xdd231a,0x8b1c22,0xffa34a].map(c=>new T.Color(c));
 const dummy=new T.Object3D(),impacts=[];let elapsed=0,serial=0,active=null,visible=0;
 function cast(){
  const choices=targets().filter(p=>Number.isFinite(p.x)&&Number.isFinite(p.z)&&surface(p.x,p.z)!=null);
  if(!choices.length)return false;
  const target=choices[Math.floor(rand(++serial*17)*choices.length)],ground=surface(target.x,target.z);
  // Target fixed on cast; the creature can move away before impact.
  const theta=rand(serial*23)*Math.PI*2,drift=2.2;
  const x=target.x+Math.cos(theta)*drift,z=target.z+Math.sin(theta)*drift;
  active={target:{species:target.species||target.name||'creature',x:target.x,z:target.z},start:{x,y:ground+5.8,z},end:{x:target.x,y:ground+.12,z:target.z},age:0,duration:1.65,phase:'fall',impactAge:0};
  return true;
 }
 function update(dt){
  dt=Math.max(0,Math.min(.1,dt));elapsed+=dt;visible=0;
  if(!active){mesh.count=0;return}
  const a=active;a.age+=dt;
  if(a.phase==='fall'&&a.age>=a.duration){a.phase='burst';a.impactAge=0;
   impacts.push({at:+elapsed.toFixed(2),target:a.target,point:{...a.end},kind:'visual-only'});if(impacts.length>12)impacts.shift();
  }
  if(a.phase==='burst')a.impactAge+=dt;
  const t=Math.min(1,a.age/a.duration),smooth=t*t,p={x:a.start.x+(a.end.x-a.start.x)*smooth,y:a.start.y+(a.end.y-a.start.y)*smooth,z:a.start.z+(a.end.z-a.start.z)*smooth};
  const {x:ox=0,z:oz=0}=offset();
  function place(x,y,z,r,color){const px=x-ox,pz=z-oz;if(px*px+y*y+pz*pz>(radius+.8)**2)return;
   dummy.position.set(px,y,pz);dummy.scale.setScalar(r);dummy.updateMatrix();mesh.setMatrixAt(visible,dummy.matrix);mesh.setColorAt(visible,colors[color]);visible++}
  if(a.phase==='fall'){
   place(p.x,p.y,p.z,.135,0);
   const dx=a.start.x-a.end.x,dy=a.start.y-a.end.y,dz=a.start.z-a.end.z,len=Math.hypot(dx,dy,dz);
   for(let i=0;i<count-1;i++){
    const back=.025+(i/(count-1))*.34,spread=.018+.12*(i/(count-1));
    const swirl=elapsed*3.2+i*2.399;
    const turbulence=Math.sin(i*3.7+elapsed*8)*.012;
    const xx=p.x+dx/len*back*1.25+Math.cos(swirl)*(spread+turbulence);
    const yy=p.y+dy/len*back*1.25+Math.sin(swirl*.7)*spread;
    const zz=p.z+dz/len*back*1.25+Math.sin(swirl)*(spread+turbulence);
    place(xx,yy,zz,(.017+rand(i*7)*.027)*(1-.68*i/(count-1)),1+i%4);
   }
  }else{
   for(let i=0;i<count;i++){const age=a.impactAge,angle=i*2.399,velocity=.6+rand(i*11)*1.4;
    const xx=a.end.x+Math.cos(angle)*velocity*age,zz=a.end.z+Math.sin(angle)*velocity*age;
    const yy=a.end.y+Math.sin(angle*1.3)*velocity*age+.65*age-2.3*age*age;
    place(xx,yy,zz,Math.max(.001,(.024+rand(i*3)*.028)*(1-age/1.3)),1+i%4);
   }
   if(a.impactAge>1.3)active=null;
  }
  mesh.count=visible;mesh.instanceMatrix.needsUpdate=true;if(mesh.instanceColor)mesh.instanceColor.needsUpdate=true;
 }
 return {group,cast,update,inspect:()=>({name:'Cinderfall',active:active?{phase:active.phase,target:active.target,age:+active.age.toFixed(2)}:null,visible,impacts:[...impacts],deformation:false,damage:false}),dispose(){group.removeFromParent();geo.dispose();mat.dispose()}};
}
