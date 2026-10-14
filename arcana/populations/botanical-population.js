// Shared deterministic geometric botany. All roots live in geological coordinates.
// Rendering offsets affect only group transforms; idle time persists through panning.
export function createBotanicalPopulation(T,{kind,surface,center,offset=()=>({x:0,z:0}),parent=null,seed=741,count=12,radius=9.72}){
 const group=new T.Group();group.name=kind;if(parent)parent.add(group);
 const rnd=n=>{const v=Math.sin(n*127.1+seed*311.7)*43758.5453;return v-Math.floor(v)};
 const mats={};const material=(color,glow=false)=>mats[color]??(mats[color]=new T.MeshStandardMaterial({color,roughness:.76,metalness:.04,emissive:glow?color:0,emissiveIntensity:glow?.16:0,flatShading:true,side:T.DoubleSide}));
 const geos=[];
 function geo(g){geos.push(g);return g}
 const sphere=geo(new T.IcosahedronGeometry(1,1)),facet=geo(new T.IcosahedronGeometry(1,0)),stemGeo=geo(new T.CylinderGeometry(.045,.065,1,6)),cone=geo(new T.ConeGeometry(1,1,5)),cupGeo=geo(new T.CylinderGeometry(.65,.34,.52,7,1,true));
 function mesh(parent,g,c,pos,scale,glow=false){const m=new T.Mesh(g,material(c,glow));m.position.set(...pos);m.scale.set(...scale);parent.add(m);return m}
 function branch(parent,a,b,width,color){const d=new T.Vector3(...b).sub(new T.Vector3(...a));const m=mesh(parent,stemGeo,color,[(a[0]+b[0])/2,(a[1]+b[1])/2,(a[2]+b[2])/2],[width,d.length(),width]);m.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),d.normalize());return m}
 const plants=[];
 for(let i=0;i<count;i++){
  const angle=rnd(i*7+1)*Math.PI*2,rad=Math.sqrt(rnd(i*7+2))*(kind==='amethyst-parasols'?1.55:1.25);
  const x=center.x+Math.cos(angle)*rad,z=center.z+Math.sin(angle)*rad;
  const y=surface(x,z);if(y==null||Math.hypot(x,z)<.72)continue;
  const root=new T.Group(),body=new T.Group();root.add(body);group.add(root);
  const size=.72+rnd(i*7+3)*.65,phase=rnd(i*7+4)*Math.PI*2;
  if(kind==='amethyst-parasols'){
   const h=(1.2+rnd(i*7+5)*1.2)*size;
   branch(body,[0,0,0],[0,h,0],.8,0xb3b39e);
   for(let j=0;j<2+(i%2);j++){const yy=h*(.54+j*.23),rr=(.48+j*.16)*size;
    const crown=new T.Group();crown.position.y=yy;body.add(crown);
    for(let k=0;k<8;k++){const a=k*Math.PI/4;const p=mesh(crown,cone,k%2?0xa28db9:0xc1a1d2,[Math.cos(a)*rr*.53,0,Math.sin(a)*rr*.53],[rr*.38,.10,rr*.62]);p.rotation.y=a;p.rotation.z=Math.PI/2}
   }
  }else if(kind==='amber-gourds'){
   const n=1+(i%3===0?2:0);
   for(let j=0;j<n;j++){const s=size*(j===0?.62:.27),px=j===0?0:Math.cos(j*2.5)*.55,pz=j===0?0:Math.sin(j*2.5)*.45;
    mesh(body,sphere,j%2?0xd88b39:0xe6a34b,[px,s*.86,pz],[s,s*.9,s]);
    for(let k=0;k<6;k++){const a=k*Math.PI/3;const leaf=mesh(body,cone,0x788b6b,[px+Math.cos(a)*s*.8,.12,pz+Math.sin(a)*s*.8],[s*.28,s*.6,s*.28]);leaf.rotation.z=Math.PI/2;leaf.rotation.y=a}
   }
  }else if(kind==='crown-lanterns'){
   const h=(1.4+rnd(i*7+5)*1.0)*size;
   branch(body,[0,0,0],[0,h,0],.7,0x40534c);
   for(let j=0;j<3;j++){const a=j*2.399+phase,yy=h*(.45+j*.23),xx=Math.cos(a)*(.32+j*.08),zz=Math.sin(a)*(.32+j*.08);
    branch(body,[0,yy-.25,0],[xx,yy+.1,zz],.45,0x40534c);
    const fruit=mesh(body,sphere,0xffc46b,[xx,yy+.24,zz],[.19,.31,.19],true);
    for(let k=0;k<5;k++){const t=k*Math.PI*2/5;mesh(body,cone,0xe6b95e,[xx+Math.cos(t)*.12,yy+.57,zz+Math.sin(t)*.12],[.085,.23,.085])}
    fruit.userData.pulse=true;
   }
  }else if(kind==='chalice-succulents'){
   for(let j=0;j<3;j++){const px=Math.cos(j*2.4)*.28,pz=Math.sin(j*2.4)*.28,yy=.22+j*.04;
    mesh(body,cupGeo,0x839d75,[px,yy,pz],[.44*size,.55*size,.44*size]);
    for(let k=0;k<7;k++){const a=k*Math.PI*2/7;const petal=mesh(body,cone,0x9bae7f,[px+Math.cos(a)*.3*size,yy+.18,pz+Math.sin(a)*.3*size],[.16*size,.36*size,.16*size]);petal.rotation.z=.3}
    for(let k=0;k<4;k++)mesh(body,facet,0xc3c7a0,[px+Math.cos(k*2.4)*.16,yy+.17,pz+Math.sin(k*2.4)*.16],[.075,.075,.075]);
   }
  }else if(kind==='ruby-pendants'){
   const h=(1.05+rnd(i*7+5)*.75)*size;
   branch(body,[0,0,0],[0,h,0],.65,0x493e49);
   for(let j=0;j<3;j++){const a=j*2.3+phase,yy=h*(.48+j*.18),xx=Math.cos(a)*(.3+j*.08),zz=Math.sin(a)*(.3+j*.08);
    branch(body,[0,yy,0],[xx,yy-.22,zz],.45,0x493e49);
    mesh(body,sphere,j===0?0xcf456b:0xa9365e,[xx,yy-.44,zz],[.19+j*.035,.31+j*.04,.19+j*.035]);
    mesh(body,cone,0x52695b,[xx,yy-.16,zz],[.20,.18,.20]);
   }
  }
  root.userData={x,z,y,phase,size};plants.push({root,body,x,z,y,phase,size});
 }
 let time=0,visible=0;
 function update(dt){
  time+=dt;const {x:ox=0,z:oz=0}=offset();visible=0;
  for(const p of plants){
   const xx=p.x-ox,zz=p.z-oz;
   p.root.position.set(xx,p.y,zz);
   const inside=xx*xx+zz*zz+(p.y+1.8*p.size)**2<(radius-.3)**2;
   p.root.visible=inside;if(!inside)continue;visible++;
   const wave=Math.sin(time*(.65+.13*p.size)+p.phase);
   p.body.rotation.z=wave*(kind==='amber-gourds'?.012:.045);
   p.body.rotation.x=Math.cos(time*.73+p.phase)*.025;
   if(kind==='amber-gourds')p.body.scale.setScalar(1+wave*.012);
   else if(kind==='chalice-succulents')p.body.scale.set(1+wave*.025,1,1+wave*.025);
   else p.body.scale.setScalar(1+wave*.008);
  }
 }
 function dispose(){group.removeFromParent();for(const g of geos)g.dispose();for(const m of Object.values(mats))m.dispose()}
 return {group,update,inspect:()=>({name:kind,roots:plants.length,visible,elapsed:+time.toFixed(2)}),dispose};
}
