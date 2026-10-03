/* Original transparent equipment atlas. Tight normalized crops preserve material detail. */
(() => {
const image=new Image();image.src='assets/equipment-v1.png';
const boxes={staff:[.172,.008,.048,.488],spear:[.464,.003,.074,.495],hammer:[.718,.016,.221,.481],chain:[.109,.513,.222,.457],ember:[.443,.498,.122,.49],shield:[.719,.514,.221,.46]};
function draw(ctx,key,x,y,width,height){const b=boxes[key];if(!b||!image.naturalWidth)return;const [u,v,w,h]=b,ratio=(w*image.naturalWidth)/(h*image.naturalHeight),dh=Math.min(height,width/ratio),dw=dh*ratio;ctx.save();ctx.imageSmoothingEnabled=true;ctx.imageSmoothingQuality='high';ctx.drawImage(image,u*image.naturalWidth,v*image.naturalHeight,w*image.naturalWidth,h*image.naturalHeight,x-dw/2,y-dh/2,dw,dh);ctx.restore();}
function preview(key){const canvas=document.createElement('canvas');canvas.className='equipment-preview';canvas.width=240;canvas.height=200;canvas.setAttribute('role','img');canvas.setAttribute('aria-label',MonkContent.weapons[key]?.name||'מגן');const render=()=>{const ctx=canvas.getContext('2d');ctx.clearRect(0,0,240,200);draw(ctx,key,120,100,160,188);};if(image.complete)render();else image.addEventListener('load',render,{once:true});return canvas;}
function combat(ctx,key,x,y,{active=false,wind=false,progress=0,reach=110,enemy=false}={}){
 ctx.save();ctx.translate(x,y);const p=Math.max(0,Math.min(1,progress)),swing=Math.sin(p*Math.PI);
 ctx.lineCap='round';ctx.lineJoin='round';
 if(key==='bow'){
  ctx.strokeStyle='#9b7247';ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(14,-38);ctx.quadraticCurveTo(45,0,14,38);ctx.stroke();ctx.strokeStyle='#ddd0ad';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(14,-38);ctx.lineTo(active?-12:5,0);ctx.lineTo(14,38);ctx.stroke();
  if(wind||active){ctx.strokeStyle='#e0c7a2';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(-15,0);ctx.lineTo(48,0);ctx.stroke();ctx.fillStyle='#c2d5dc';ctx.beginPath();ctx.moveTo(48,-4);ctx.lineTo(60,0);ctx.lineTo(48,4);ctx.fill();}
 }else if(key==='chain'){
  const extension=active?Math.max(.45,swing):.3,len=reach*extension;
  ctx.rotate(active?-.8+p*1.6:.5);ctx.strokeStyle='#414b55';ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(0,0);ctx.quadraticCurveTo(len*.5,active?-22:30,len,active?0:45);ctx.stroke();
  ctx.strokeStyle='#d2dbe2';ctx.lineWidth=1.5;for(let i=0;i<=12;i++){const t=i/12;ctx.beginPath();ctx.ellipse(t*len,active?-44*t*(1-t):60*t*(1-t)+45*t*t,4,2.5,t%2?.5:-.5,0,Math.PI*2);ctx.stroke();}
  ctx.fillStyle='#7a8997';ctx.strokeStyle='#d2dbe2';ctx.beginPath();ctx.arc(len,active?0:45,9,0,Math.PI*2);ctx.fill();ctx.stroke();for(let i=0;i<6;i++){const angle=i*Math.PI/3;ctx.beginPath();ctx.moveTo(len+Math.cos(angle)*8,(active?0:45)+Math.sin(angle)*8);ctx.lineTo(len+Math.cos(angle)*14,(active?0:45)+Math.sin(angle)*14);ctx.stroke();}
 }else{
  const thrust=key==='spear',heavy=key==='hammer'||key==='axe';
  const angle=wind?-.65:active?(thrust?Math.PI/2:heavy?-.7+p*2.9:.6+p*1.7):-.16;
  if(thrust&&active)ctx.translate(swing*24,0);ctx.rotate(angle);
  const len=thrust?reach:heavy?Math.min(reach,100):Math.min(reach,145);
  if(key==='axe'){
   const shaft=ctx.createLinearGradient(-3,0,3,0);shaft.addColorStop(0,'#523820');shaft.addColorStop(.5,'#c4a478');shaft.addColorStop(1,'#725031');ctx.fillStyle=shaft;ctx.fillRect(-3,-len,6,len+12);
   const steel=ctx.createLinearGradient(-7,-len,30,-len+22);steel.addColorStop(0,'#445865');steel.addColorStop(.6,'#afc1ca');steel.addColorStop(1,'#edf2e7');ctx.fillStyle=steel;ctx.strokeStyle='#263945';ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(-7,-len+7);ctx.lineTo(16,-len-4);ctx.quadraticCurveTo(39,-len+9,26,-len+33);ctx.lineTo(7,-len+23);ctx.lineTo(-7,-len+23);ctx.closePath();ctx.fill();ctx.stroke();
  }else draw(ctx,key,0,-len*.38,key==='hammer'?65:40,len*1.18);
  if(active&&!thrust){ctx.globalAlpha=.25;ctx.strokeStyle=key==='ember'?'#ffb45c':'#e1edf1';ctx.lineWidth=heavy?8:3;ctx.beginPath();ctx.arc(0,0,len*.8,-Math.PI/2-.4,-Math.PI/2+.4);ctx.stroke();}
  if(key==='ember'){ctx.globalCompositeOperation='screen';ctx.shadowColor='#ff8439';ctx.shadowBlur=17;ctx.fillStyle='#ffbd6bcc';ctx.beginPath();ctx.ellipse(0,-len*.87,5,10+Math.sin(p*14)*3,0,0,Math.PI*2);ctx.fill();}
 }
 ctx.restore();
}
window.MonkGear={draw,combat,preview,ready:()=>!!image.naturalWidth};
})();
