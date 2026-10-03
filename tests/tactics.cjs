const {chromium}=require('playwright');
const assert=require('node:assert/strict');
(async()=>{
 const b=await chromium.launch(),p=await b.newPage({viewport:{width:915,height:412},isMobile:true,hasTouch:true});
 const errors=[];p.on('pageerror',e=>errors.push(e.message));
 const read=()=>p.evaluate(()=>JSON.parse(render_game_to_text()));
 try {
 async function load({dx=100,hp=1,id=0,version=2,lastSkill=null}={}){
  await p.goto('http://localhost:5173');
  const fixture=await p.evaluate(({dx,hp,id,version,lastSkill})=>{const boss=MonkContent.bosses[id];return {version:3,unlocked:15,difficulty:'warrior',save:{combatVersion:version,kind:'battle',level:id,difficulty:'warrior',player:{x:800,y:465,hp:100,maxHP:100,healthVersion:1,lives:3,dir:1,weapon:'staff',weapons:['staff'],chi:80,mana:100},enemies:[{id:1,type:'brute',boss:true,bossId:id,rank:boss.rank,x:800+dx,y:465,hp:Math.round(boss.hp*hp),maxHP:boss.hp,speed:0,damage:boss.damage,cooldown:0,phase:0,lastSkill,wind:0,stun:0,dead:0}],drops:[],chests:[],hazards:[],projectiles:[],wave:4,bossSpawned:true,nextId:10}};},{dx,hp,id,version,lastSkill});
  await p.evaluate(f=>localStorage.setItem('monk-profile-v3',JSON.stringify(f)),fixture);await p.reload();await p.evaluate(()=>{advanceTime(0);document.getElementById('resume-btn').click();});
 }
 await load();await p.evaluate(()=>advanceTime(1));let s=await read();assert.equal(s.enemies[0].skill,'slam');assert.equal(s.enemies[0].combatPhase,1);
 await p.screenshot({path:'output/tactics-near-warning.png'});
 await load({dx:350});await p.evaluate(()=>advanceTime(1));s=await read();assert.equal(s.enemies[0].skill,'charge');assert.deepEqual(s.enemies[0].target,{x:800,y:465});
 await p.evaluate(()=>{dispatchEvent(new KeyboardEvent('keydown',{code:'ArrowDown'}));advanceTime(400);dispatchEvent(new KeyboardEvent('keyup',{code:'ArrowDown'}));});
 assert.deepEqual((await read()).enemies[0].target,{x:800,y:465},'attack target stays locked while player moves');
 await p.click('#pause-btn');await p.reload();await p.evaluate(()=>{advanceTime(0);document.getElementById('resume-btn').click();});assert.deepEqual((await read()).enemies[0].target,{x:800,y:465},'mid-warning save preserves target');
 await load({dx:100,lastSkill:'slam'});await p.evaluate(()=>advanceTime(1));assert.notEqual((await read()).enemies[0].skill,'slam','avoid immediate repetition');
 await load({dx:100});await p.evaluate(()=>{dispatchEvent(new KeyboardEvent('keydown',{code:'KeyA'}));advanceTime(1);dispatchEvent(new KeyboardEvent('keyup',{code:'KeyA'}));advanceTime(160);});assert.equal((await read()).enemies[0].skill,'guard','react to melee pressure');
 for(const [hp,phase] of [[.6,2],[.3,3]]){await load({hp});await p.evaluate(()=>advanceTime(1));assert.equal((await read()).enemies[0].combatPhase,phase);}
 await load({id:14,hp:.3});await p.evaluate(()=>advanceTime(1));await p.screenshot({path:'output/tactics-final-warning.png'});
 await p.evaluate(()=>advanceTime(1600));s=await read();assert(s.enemies[0].recovery>0||s.hazards.length||s.projectiles.length,'ability executes');
 const ranks=[];for(const stage of [0,3,6,9,12]){await p.evaluate(i=>MonkGame.startLevel(i),stage);ranks.push(Math.min(...(await read()).enemies.map(e=>e.rank)));}assert.deepEqual(ranks,[1,2,3,4,5]);
 await load({id:14,hp:.5,version:1});s=await read();const boss=s.enemies[0];assert.equal(boss.rank,5);assert(Math.abs(boss.hp/boss.maxHP-.5)<.002);await p.click('#pause-btn');await p.reload();await p.click('#resume-btn');assert.equal((await read()).enemies[0].hp,boss.hp,'migration only once');
 assert.deepEqual(errors,[]);console.log(JSON.stringify({passed:true,adaptiveRange:true,meleeCounter:true,phases:3,lockedTargets:true,midAttackResume:true,ranks,migration:true,errors}));
 } finally { await b.close(); }
})().catch(e=>{console.error(e);process.exit(1);});
