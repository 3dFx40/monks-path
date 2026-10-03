/* Original transparent equipment atlas. Tight normalized crops preserve material detail. */
(() => {
const image=new Image();image.src='assets/equipment-v1.png';
const boxes={staff:[.172,.008,.048,.488],spear:[.464,.003,.074,.495],hammer:[.718,.016,.221,.481],chain:[.109,.513,.222,.457],ember:[.443,.498,.122,.49],shield:[.719,.514,.221,.46]};
function draw(ctx,key,x,y,width,height){const b=boxes[key];if(!b||!image.naturalWidth)return;const [u,v,w,h]=b,ratio=(w*image.naturalWidth)/(h*image.naturalHeight),dh=Math.min(height,width/ratio),dw=dh*ratio;ctx.save();ctx.imageSmoothingEnabled=true;ctx.imageSmoothingQuality='high';ctx.drawImage(image,u*image.naturalWidth,v*image.naturalHeight,w*image.naturalWidth,h*image.naturalHeight,x-dw/2,y-dh/2,dw,dh);ctx.restore();}
function preview(key){const canvas=document.createElement('canvas');canvas.className='equipment-preview';canvas.width=240;canvas.height=200;canvas.setAttribute('role','img');canvas.setAttribute('aria-label',MonkContent.weapons[key]?.name||'מגן');const render=()=>{const ctx=canvas.getContext('2d');ctx.clearRect(0,0,240,200);draw(ctx,key,120,100,160,188);};if(image.complete)render();else image.addEventListener('load',render,{once:true});return canvas;}
window.MonkGear={draw,preview,ready:()=>!!image.naturalWidth};
})();
