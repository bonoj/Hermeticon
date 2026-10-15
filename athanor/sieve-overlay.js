// Sieve is an independent workspace. Its iframe is loaded only on first opening.
(()=>{'use strict';
const toggle=document.getElementById('sieveToggle');
const panel=document.getElementById('sieveOverlay');
const close=document.getElementById('sieveClose');
const frame=document.getElementById('sieveFrame');
if(!toggle||!panel||!close||!frame)return;
function setOpen(open){
 panel.hidden=!open;
 toggle.setAttribute('aria-expanded',String(open));
 if(open){if(!frame.getAttribute('src'))frame.src=frame.dataset.src;close.focus();}
 else toggle.focus();
}
toggle.addEventListener('click',()=>setOpen(panel.hidden));
close.addEventListener('click',()=>setOpen(false));
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!panel.hidden)setOpen(false)});
})();
