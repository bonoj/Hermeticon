// Low-cost cavern atmosphere: depth-tested smoke below the upper terrain surface.
// Never touches the signed field, aperture geometry, or navigation.
export function createCavernSmoke(T,{radius=9.92}={}){
 const group=new T.Group();group.name='cavern:smoke';
 const layers=[{y:0.08,alpha:.25},{y:-.48,alpha:.34},{y:-1.04,alpha:.42}];
 const geometry=new T.PlaneGeometry(radius*2,radius*2,1,1);
 geometry.rotateX(-Math.PI/2);
 const materials=[];
 for(let i=0;i<layers.length;i++){
  const material=new T.ShaderMaterial({
   transparent:true,depthWrite:false,depthTest:true,side:T.DoubleSide,
   uniforms:{uTime:{value:0},uAlpha:{value:layers[i].alpha},uRadius:{value:radius}},
   vertexShader:`varying vec3 vLocal;void main(){vLocal=position;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}`,
   fragmentShader:`varying vec3 vLocal;uniform float uTime;uniform float uAlpha;uniform float uRadius;
float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.0-2.0*f);return mix(mix(hash(i),hash(i+vec2(1.,0.)),f.x),mix(hash(i+vec2(0.,1.)),hash(i+vec2(1.,1.)),f.x),f.y);}
void main(){
 vec2 p=vLocal.xz;
 float r=length(p);
 if(r>uRadius)discard;
 float n=noise(p*.43+vec2(uTime*.012,-uTime*.009));
 n=.58*n+.42*noise(p*1.12-vec2(uTime*.018,uTime*.007));
 float fade=1.0-smoothstep(uRadius-2.4,uRadius-.18,r);
 float alpha=uAlpha*fade*(.50+.65*n);
 gl_FragColor=vec4(vec3(.015,.036,.049),alpha);
}`
  });
  const mesh=new T.Mesh(geometry,material);
  mesh.position.y=layers[i].y;mesh.renderOrder=2+i;
  group.add(mesh);materials.push(material);
 }
 return {group,update:dt=>{for(const m of materials)m.uniforms.uTime.value+=Math.min(dt,.1)},inspect:()=>({enabled:group.visible,layers:layers.length,highestY:layers[0].y,edgeFade:2.4,depthTest:true,depthWrite:false})};
}
