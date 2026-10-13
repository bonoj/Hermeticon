// Presentation vocabulary only. No world-specific controls or physics.
export const cameraPatterns=Object.freeze({
  orbit:{drag:'orbit',pinch:'zoom',tap:'select',reset:'frame'},
  flat:{drag:'pan',pinch:'zoom',tap:'select',reset:'frame'},
  none:{}
});
export const buttonGrammar=Object.freeze({
  minTouchPx:44,
  placements:['top-left','top-right','bottom-left','bottom-right','bottom-center'],
  states:['idle','active','disabled'],
  safeArea:true
});
export function defineInterface({camera='orbit',buttons=[],instruments=[]}={}){
  if(!(camera in cameraPatterns))throw Error('Unknown camera pattern: '+camera);
  const ids=new Set();
  for(const button of buttons){if(!button.id||ids.has(button.id))throw Error('Button IDs must be unique');ids.add(button.id)}
  return {camera,buttons:buttons.map(b=>({...b})),instruments:[...instruments]};
}
export function availableButtons(interfaceSpec,capabilities){
  return interfaceSpec.buttons.filter(button=>!button.capability||capabilities.has(button.capability));
}
