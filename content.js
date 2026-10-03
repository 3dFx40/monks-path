/* Five worlds, three chapters each. Every boss has its own combat rotation. */
(() => {
const worlds=[
 {name:'הר המנזר',accent:'#dfbd7f',chapters:['שערי השחר','גשר הפעמונים','החצר האסורה']},
 {name:'יער הלחישות',accent:'#94c7a1',chapters:['שביל הציידים','ביצת הרעל','לב הבמבוק']},
 {name:'מכרות הברזל',accent:'#8fced9',chapters:['מנהרת הקריסטלים','הכבשן העתיק','אולם המכונות']},
 {name:'מצודת האורקים',accent:'#d8a67b',chapters:['חומות המצודה','מחנה המלחמה','כס הפיקוד']},
 {name:'לב האפר',accent:'#ef9760',chapters:['שדה המטאורים','מקדש הלהבות','כתר האפר']}
];
const bosses=[
 ['בורוק · שובר העצמות',340,1.5,'#a79771',['slam'],'פטיש כבד וגלי הדף'],
 ['רוקאר · שומר הגשר',420,1.55,'#b68c68',['charge','slam'],'הסתערות ומכת פטיש'],
 ['אזק · מנפץ הפעמון',490,1.7,'#d0b473',['volley','slam','charge'],'מניפת קליעים וגלי הדף'],
 ['גריש · צייד הצללים',510,1.4,'#83b4a2',['charge','volley'],'תנועה מהירה ומטח חצים'],
 ['מורגה · אדון הרעל',560,1.6,'#a5bb71',['poison','summon'],'שלוליות רעל ותגבורת'],
 ['ניבאל · רוח הכפור',610,1.65,'#b0d9d5',['frost','volley','charge'],'כפור שמאט והסתערות'],
 ['קראג · אגרוף הפלדה',640,1.85,'#a5b6c4',['guard','slam'],'שריון, חסימה ושבירת קרקע'],
 ['דורן · נפח הכבשן',690,1.75,'#d0a17a',['mines','flame'],'מוקשים ולהבות מסתובבות'],
 ['מאגור · לב המכונה',750,1.9,'#98cbd9',['pull','lightning','slam'],'משיכה מגנטית וברקים'],
 ['וראק · שובר החומות',780,1.85,'#c5a47d',['charge','charge','slam'],'רצף הסתערויות'],
 ['רוגאש · שר המלחמה',840,1.75,'#d49d7e',['warcry','summon','charge'],'קריאת מלחמה וצבא אישי'],
 ['תארוק · עין הסערה',920,1.9,'#d6b6ea',['lightning','volley','guard'],'ברקים, מטחים והגנה'],
 ['זול · אוכל הגחלים',950,1.8,'#d99b75',['meteor','charge'],'מטאורים והסתערות'],
 ['אשאר · כהן הלהבה',1030,1.9,'#ecaf70',['flame','summon','meteor'],'טבעת אש, זימונים ומטאורים'],
 ['גול־מאר · מלך האורקים',1250,2.1,'#e8bd86',['royal','guard','meteor','warcry'],'צורות לחימה מתחלפות וכוחות המלכים']
].map(([name,hp,scale,color,rotation,description],i)=>({id:i,name,hp,scale,color,rotation,description,damage:14+Math.floor(i*.9),cooldown:Math.max(.9,2.2-i*.045)}));
for(const b of bosses){b.hp=Math.round(b.hp*1.45);b.damage=Math.round(b.damage*1.4);b.cooldown*=.8;b.weapon=b.rotation[0]==='volley'?'bow':['poison','frost','pull','lightning','flame','summon'].includes(b.rotation[0])?'ember':'hammer';}
const chapters=bosses.map((boss,i)=>({id:i,world:Math.floor(i/3),part:i%3,name:worlds[Math.floor(i/3)].chapters[i%3],boss,length:4400+(i%3)*400+Math.floor(i/3)*120,waves:4}));
const enemies={
 grunt:{name:'לוחם גרזן',hp:48,speed:62,damage:7,scale:1,hue:0,behavior:'melee'},
 scout:{name:'סייר צללים',hp:34,speed:112,damage:6,scale:.86,hue:45,behavior:'quick'},
 brute:{name:'אורק ענק',hp:115,speed:40,damage:15,scale:1.35,hue:330,behavior:'heavy'},
 shield:{name:'נושא מגן',hp:76,speed:51,damage:9,scale:1.12,hue:190,behavior:'shield'},
 archer:{name:'קשת אורקי',hp:42,speed:66,damage:8,scale:.95,hue:90,behavior:'ranged'},
 shaman:{name:'שאמאן',hp:64,speed:47,damage:10,scale:1.04,hue:250,behavior:'mage'},
 berserker:{name:'ברסרקר',hp:90,speed:84,damage:11,scale:1.16,hue:310,behavior:'rage'}
};
const enemyArms={grunt:['axe',88,1.2],scout:['spear',140,.75],brute:['hammer',115,1.7],shield:['axe',90,1.3],archer:['bow',380,1.35],shaman:['ember',380,2.5],berserker:['chain',130,.95]};
for(const [key,e] of Object.entries(enemies)){e.hp=Math.round(e.hp*1.3);e.damage=Math.round(e.damage*1.35);e.speed*=1.12;[e.weapon,e.range,e.cooldown]=enemyArms[key];}
const weapons={
 staff:{name:'מוט המנזר',damage:19,range:112,speed:.29,color:'#d5b47b',description:'מאוזן. המכה השלישית חזקה.'},
 spear:{name:'חנית הירח',damage:25,range:158,speed:.37,color:'#b8d9df',description:'טווח ארוך וחוד פלדה.'},
 chain:{name:'שרשרת הסערה',damage:17,range:172,speed:.23,color:'#c8cbd5',description:'מהירה, פוגעת ברוחב הזירה.'},
 ember:{name:'מוט הגחלת',damage:26,range:125,speed:.33,color:'#f4ac65',description:'מצית אויבים למשך שלוש שניות.'},
 hammer:{name:'פטיש הטיטאן',damage:43,range:100,speed:.55,color:'#b1bbcc',description:'כבד, שובר שריון ומגנים.'}
};
const spells={
 fire:{name:'כדור אש',cost:22,color:'#ffad66',description:'קליע אש חודר ומצית.'},
 frost:{name:'נשימת כפור',cost:30,color:'#a2e8ee',description:'מקפיאה ומאטה אויבים מולך.'},
 lightning:{name:'שרשרת ברקים',cost:35,color:'#d4bdff',description:'ברק שמדלג בין אויבים.'},
 earth:{name:'חותם האבן',cost:28,color:'#d1c29a',description:'מגן שסופג נזק ופוגע סביבך.'}
};
const combos=[
 {keys:['strike','strike','kick'],name:'עקב הדרקון',damage:66,range:125,knock:75},
 {keys:['strike','kick','strike'],name:'מערבולת המוט',damage:48,range:190,area:true,knock:35},
 {keys:['kick','strike','kick'],name:'סופת הלוטוס',damage:55,range:150,area:true,knock:55},
 {keys:['kick','kick','strike'],name:'שובר השריון',damage:74,range:125,breakGuard:true,knock:45},
 {keys:['strike','strike','strike'],name:'שלוש נשימות',damage:39,range:140,knock:40}
];
window.MonkContent={worlds,chapters,bosses,enemies,weapons,spells,combos};
})();
