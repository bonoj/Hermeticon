// Draw Witness: full extracted-mesh inventory and camera-conditioned contour candidates.
// Visibility is not asserted: aperture and occlusion need independent verification.
export function createDrawSurface(group) {
  const start=performance.now(), vertices=[], triangles=[], faces=[], edgeMap=new Map(), weld=new Map();
  let sourceVertices=0, degenerate=0;
  const indexOf=(x,y,z)=>{
    const key=[x,y,z].map(v=>Math.round(v*10000)).join(',');
    let id=weld.get(key);
    if(id===undefined){id=vertices.length/3;weld.set(key,id);vertices.push(x,y,z)}
    return id;
  };
  for(let chunk=0;chunk<group.children.length;chunk++){
    const a=group.children[chunk].geometry.getAttribute('position');
    if(!a)continue;sourceVertices+=a.count;
    for(let i=0;i+2<a.count;i+=3){
      const ids=[];
      for(let j=0;j<3;j++)ids.push(indexOf(a.getX(i+j),a.getY(i+j),a.getZ(i+j)));
      if(new Set(ids).size!==3){degenerate++;continue}
      const [a0,b0,c0]=ids,ax=vertices[3*a0],ay=vertices[3*a0+1],az=vertices[3*a0+2],
        bx=vertices[3*b0],by=vertices[3*b0+1],bz=vertices[3*b0+2],
        cx=vertices[3*c0],cy=vertices[3*c0+1],cz=vertices[3*c0+2];
      const ux=bx-ax,uy=by-ay,uz=bz-az,vx=cx-ax,vy=cy-ay,vz=cz-az;
      const nx=uy*vz-uz*vy,ny=uz*vx-ux*vz,nz=ux*vy-uy*vx,mag=Math.hypot(nx,ny,nz);
      if(mag<1e-8){degenerate++;continue}
      const face=faces.length;
      faces.push({normal:[nx/mag,ny/mag,nz/mag],center:[(ax+bx+cx)/3,(ay+by+cy)/3,(az+bz+cz)/3],chunk});
      triangles.push(...ids);
      for(const [u,v] of [[a0,b0],[b0,c0],[c0,a0]]){
        const key=u<v?u+','+v:v+','+u;
        let edge=edgeMap.get(key);
        if(!edge){edge={a:Math.min(u,v),b:Math.max(u,v),faces:[]};edgeMap.set(key,edge)}
        edge.faces.push(face);
      }
    }
  }
  const edges=[...edgeMap.values()];
  const stats={sourceVertices,uniqueVertices:vertices.length/3,sourceTriangles:sourceVertices/3,triangles:faces.length,
    edges:edges.length,openEdges:edges.filter(e=>e.faces.length===1).length,
    nonmanifoldEdges:edges.filter(e=>e.faces.length>2).length,degenerate,
    inventoryMs:+(performance.now()-start).toFixed(2)};
  const V=new Float32Array(vertices);
  function project(camera,offsetX,offsetZ,aperture,viewportWidth,viewportHeight,THREE){
    const start=performance.now(),cameraPosition=camera.position,projection=new THREE.Vector3(),visible=[];
    const facing=new Int8Array(faces.length);
    for(let i=0;i<faces.length;i++){
      const f=faces[i],p=f.center,n=f.normal;
      const dot=n[0]*(cameraPosition.x-(p[0]-offsetX))+n[1]*(cameraPosition.y-p[1])+n[2]*(cameraPosition.z-(p[2]-offsetZ));
      facing[i]=dot>1e-6?1:dot< -1e-6?-1:0;
    }
    let apertureRejected=0,projected=0,wallCandidates=0;
    for(const edge of edges){
      if(edge.faces.length===2&&facing[edge.faces[0]]===facing[edge.faces[1]])continue;
      const a=edge.a*3,b=edge.b*3;
      const ax=V[a]-offsetX,ay=V[a+1],az=V[a+2]-offsetZ;
      const bx=V[b]-offsetX,by=V[b+1],bz=V[b+2]-offsetZ;
      // Conservative aperture inclusion: include segments intersecting sphere even with endpoints outside.
      const dx=bx-ax,dy=by-ay,dz=bz-az;
      const t=Math.max(0,Math.min(1,-(ax*dx+ay*dy+az*dz)/(dx*dx+dy*dy+dz*dz||1)));
      const px=ax+t*dx,py=ay+t*dy,pz=az+t*dz;
      if(px*px+py*py+pz*pz>aperture*aperture){apertureRejected++;continue}
      projection.set(ax,ay,az).project(camera);
      const sx=(projection.x+1)*viewportWidth/2,sy=(1-projection.y)*viewportHeight/2;
      const z1=projection.z;
      projection.set(bx,by,bz).project(camera);
      const ex=(projection.x+1)*viewportWidth/2,ey=(1-projection.y)*viewportHeight/2;
      if(z1>1&&projection.z>1)continue;
      const wall=edge.faces.some(i=>Math.abs(faces[i].normal[1])<.4);
      if(wall)wallCandidates++;
      projected++;
      visible.push({a:edge.a,b:edge.b,screen:[sx,sy,ex,ey],wall,faces:edge.faces});
    }
    return {segments:visible,stats:{cameraCandidateSegments:projected,boreWallCandidates:wallCandidates,
      apertureRejected,projectionMs:+(performance.now()-start).toFixed(2),
      visibilityAudited:false,apertureCurveAudited:false,edgeCoverageP95Px:null,missedExtrema:null}};
  }
  return {vertices:V,triangles:new Uint32Array(triangles),edges,faces,stats,project};
}
