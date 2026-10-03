const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const root = __dirname;
const port = Number(process.env.PORT) || 5173;
const types = {'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json; charset=utf-8','.png':'image/png'};
http.createServer((req,res) => {
  let requested;
  try { requested = decodeURIComponent(new URL(req.url,'http://localhost').pathname); } catch {res.writeHead(400);res.end();return;}
  if(!['/','/index.html','/share.html','/docs/screenshots/title-desktop.png','/docs/screenshots/combat-desktop.png','/docs/screenshots/combat-mobile.png','/docs/screenshots/equipment-desktop.png','/style.css','/premium.css','/expansion.css','/game.js','/content.js','/art.js','/controls.js','/gear.js','/assets/equipment-v1.png','/premium.js','/assets/fighters.png','/assets/monastery.png','/assets/forest.png','/assets/mine.png','/assets/fortress.png','/assets/volcano.png'].includes(requested)){res.writeHead(404);res.end('Not found');return;}
  const file = path.resolve(root,'.' + (requested === '/' ? '/index.html' : requested));
  if(!file.startsWith(root + path.sep)){res.writeHead(403);res.end();return;}
  fs.readFile(file,(error,data)=>{if(error){res.writeHead(404);res.end('Not found');return;}res.writeHead(200,{'Content-Type':types[path.extname(file)]||'application/octet-stream','Cache-Control':'no-cache'});res.end(data);});
}).listen(port,'0.0.0.0',()=>{
  console.log(`The Monk's Path: http://localhost:${port}`);
  for(const group of Object.values(os.networkInterfaces()))for(const address of group||[])if(address.family==='IPv4'&&!address.internal)console.log(`Mobile, same Wi-Fi: http://${address.address}:${port}`);
}).on('error',error=>{console.error(error.message);process.exit(1);});
