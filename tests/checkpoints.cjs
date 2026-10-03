const {chromium}=require('playwright');const assert=require('node:assert/strict');
(async()=>{
 const b=await chromium.launch(),p=await b.newPage({viewport:{width:915,height:412},isMobile:true,hasTouch:true});const errors=[];p.on('pageerror',e=>errors.push(e.message));
 const read=()=>p.evaluate(()=>JSON.parse(render_game_to_text()));
 const hero={x:800,y:465,hp:125,maxHP:125,healthVersion:1,lives:3,dir:1,weapon:'spear',weapons:['staff','spear'],spell:'fire',spells:['fire'],spellRanks:{fire:2},rank:2,xp:40,gold:100};
 function fixture(level,{checkpoint=true,lives=1,bossDead=false,legacyHealth=false}={}){const entry={...hero};const player={...hero,hp:1,lives,weapon:'hammer',weapons:['staff','spear','hammer'],rank:3,gold:999};if(legacyHealth){delete player.healthVersion;player.hp=60;player.maxHP=100;}
  return {version:3,unlocked:15,difficulty:'warrior',checkpoint:checkpoint?{level:Math.floor(level/3)*3,score:1000,difficulty:'warrior',player:entry}:null,save:{combatVersion:2,kind:'battle',level,score:5000,difficulty:'warrior',player,enemies:bossDead?[{id:1,boss:true,bossId:level,type:'brute',hp:0,maxHP:500,dead:.01}]:[],drops:[],chests:[],projectiles:[],hazards:bossDead?[]:[{id:2,x:800,y:465,r:200,kind:'poison',delay:0,life:6,damage:999,tick:0}],wave:4,bossSpawned:true,nextId:100}};
 }
 async function load(f){await p.goto('http://localhost:5173');await p.evaluate(f=>localStorage.setItem('monk-profile-v3',JSON.stringify(f)),f);await p.reload();await p.evaluate(()=>{advanceTime(0);document.getElementById('resume-btn').click();});}
 try{
  await p.goto('http://localhost:5173');await p.evaluate(()=>{advanceTime(0);document.getElementById('start-btn').click();});assert.equal((await read()).player.maxHP,120);
  for(let world=0;world<5;world++){
   await load(fixture(world*3+1));await p.evaluate(()=>advanceTime(2200));assert.equal((await read()).mode,'gameover');assert.equal((await read()).checkpoint.world,world+1);assert.match(await p.locator('#continue-btn').textContent(),/תחילת העולם/);
   if(world===1)await p.screenshot({path:'output/world-checkpoint-loss.png'});
   const saved=await p.evaluate(()=>JSON.parse(localStorage.getItem('monk-profile-v3')));assert.equal(saved.save.level,world*3);assert.equal(saved.save.player.hp,125);assert.equal(saved.save.player.lives,3);assert.equal(saved.checkpoint.player.gold,100);
   if(world%2===0){await p.reload();await p.evaluate(()=>{advanceTime(0);document.getElementById('resume-btn').click();});}else await p.click('#continue-btn');
   const s=await read();assert.equal(s.mode,'playing');assert.equal(s.stage,world*3+1);assert.equal(s.score,1000);assert.equal(s.player.hp,125);assert.equal(s.player.lives,3);assert.deepEqual(s.player.weapons,['staff','spear']);assert.equal(s.player.weapon,'spear');assert.equal(s.player.rank,2);assert.equal(s.player.gold,100);assert.equal(s.player.spellRanks.fire,2);
  }
  await load(fixture(4,{lives:2}));await p.evaluate(()=>advanceTime(2200));let s=await read();assert.equal(s.mode,'playing');assert.equal(s.stage,5);assert.equal(s.player.lives,1);
  for(const level of [2,5,8,11]){await load(fixture(level,{bossDead:true}));await p.evaluate(()=>advanceTime(20));s=await read();assert.equal(s.mode,'stageclear');assert.equal(s.checkpoint.stage,level+2);assert.equal(s.checkpoint.score,s.score);await p.reload();await p.evaluate(()=>{advanceTime(0);document.getElementById('resume-btn').click();});s=await read();assert.equal(s.stage,level+2);assert.equal(s.player.lives,3);assert.equal(s.player.hp,s.player.maxHP);assert.equal(s.player.weapon,'hammer');}
  await load(fixture(7,{checkpoint:false,legacyHealth:true}));s=await read();assert.equal(s.player.maxHP,120);assert.equal(s.player.hp,80);assert.equal(s.checkpoint.world,3);await p.click('#pause-btn');await p.reload();await p.evaluate(()=>{advanceTime(0);document.getElementById('resume-btn').click();});assert.equal((await read()).player.maxHP,120);assert.equal((await read()).player.hp,80);
  assert.deepEqual(errors,[]);console.log(JSON.stringify({passed:true,baseHP:120,worldRetries:5,worldTransitions:4,deathReload:true,gearScoreRollback:true,legacyMigrationOnce:true,errors}));
 }finally{await b.close();}
})().catch(e=>{console.error(e);process.exit(1);});
