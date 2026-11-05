export const COLORS={Analista:'#4d8cca',Vigilante:'#74a643',Executor:'#d34e2c'};
export const STEPS=[4,6,8,10,12];
export const ATTRS={Fisico:'Físico',Mente:'Mente',Emocao:'Emoção'};
export const PROFILES={
 Analista:['Avaliação','Ação + 2 PD: observe um ser ou ambiente e reserve dois d4. Gaste antes de testes relacionados, juntos ou separados. Máximo de dois dados; pessoais e válidos até o fim da cena.'],
 Vigilante:['Prontidão','No início do conflito, gaste 3 PD para ter um turno de deslocamento e ação antes da primeira rodada. Depois, age normalmente. Vigilantes escolhem a ordem entre si.'],
 Executor:['Ímpeto','Falha com risco real: marque 1 espaço (máx. 3). Antes de rolar: gaste 1 para +d4 no teste; ou 3 para +1 passo em um atributo até o fim da cena, uma vez por atributo. A reserva começa e termina vazia.']};
export const uid=()=>globalThis.crypto?.randomUUID?.()||'id-'+Date.now()+'-'+Math.random().toString(36).slice(2);
export const clone=o=>JSON.parse(JSON.stringify(o));
export const clamp=(n,min,max)=>Math.min(max,Math.max(min,Number(n)||0));
export function block(type,title,x,y,w,h,extra={}){return {id:uid(),type,title,x,y,w,h,font:24,visible:true,locked:false,opacity:1,align:'left',...extra};}
export function layout(doc,preset='ordem'){
 const custom=(doc.blocks||[]).filter(b=>!b.preset);
 let b=[
  block('portrait','Retrato',635,240,500,925),
  block('name','Nome',140,133,960,105,{font:76}),
  block('identity','Perfil e função',1130,162,650,77,{font:31}),
  block('attributes','Atributos',180,302,555,225,{font:36}),
  block('skills','Perícias',180,550,445,770,{font:21}),
  block('resource','Pontos de vida',1150,300,285,170,{resource:'pv',font:31}),
  block('resource','Determinação',1480,300,285,170,{resource:'pd',font:31}),
  block('profile','Habilidade de perfil',1150,540,625,225,{font:25}),
  block('equipment','Equipamento',670,1185,450,150,{font:21})];
 if(doc.profile==='Executor')b.push(block('counter','Ímpeto',1460,492,310,40,{font:18,max:3,value:0}));
 if(doc.profile==='Analista')b.push(block('counter','Preparação',1460,492,310,40,{font:18,max:2,value:0}));
 if(doc.rituals.length)b.push(block('rituals','Rituais',1150,810,625,490,{font:22}));
 else doc.abilities.forEach((a,i)=>b.push(block('ability',a.title,1150,795+i*250,625,225,{ref:a.id,font:24})));
 if(preset==='duas'){
  for(const el of b){
   if(el.type==='portrait')Object.assign(el,{x:730,y:300,w:450,h:720});
   if(el.type==='equipment')Object.assign(el,{x:730,y:1085,w:450,h:215});
   if(el.type==='attributes')Object.assign(el,{x:145,y:300,w:515,h:225});
   if(el.type==='skills')Object.assign(el,{x:150,y:550,w:515,h:770});
   if(['profile','ability','rituals'].includes(el.type))Object.assign(el,{x:1250,w:535});
  }
 }
 b.forEach(item=>item.preset=true);doc.blocks=[...b,...custom];doc.layoutName=preset==='ordem'?'Modelo Ordem II':'Duas colunas';return doc;
}
export function makeCharacter(source,details,spells,summaries){
 const short=source.nome.split(' ')[0],info=details[short];
 const doc={schema:'catastrophe-sheet',version:1,id:uid(),name:source.nome,profile:source.perfil,role:info.role,origin:'Primeira missão',level:'',attrs:clone(source.atributos),skills:clone(source.pericias),pv:source.pv,pd:source.pd,currentPV:source.pv,currentPD:source.pd,portrait:`./assets/${short.toLowerCase()}.webp`,imageFit:'contain',accent:null,background:'#080a0a',showFrame:true,abilities:info.blocks.slice(1).map(([title,body])=>({id:uid(),title,body})),equipment:info.gear,weapon:info.attack[0],attackSkill:short==='Shinya'||short==='Liana'?'Pontaria':'Luta',damage:short==='Norito'?'RB':'RA',weaponNote:info.note,rituals:(spells[short]||[]).map(([title,meta,body])=>({id:uid(),title,meta,body,summary:(summaries[short]||[]).find(s=>s[0]===title)?.[1]||body})),updated:Date.now()};
 return layout(doc);
}
export function blank(){const d={schema:'catastrophe-sheet',version:1,id:uid(),name:'Novo agente',profile:'Analista',role:'EQUIPE DE LIAN ROSSEUL',origin:'Primeira missão',level:'',attrs:{Fisico:8,Mente:10,Emocao:6},skills:{},pv:24,pd:24,currentPV:24,currentPD:24,portrait:'',imageFit:'contain',accent:null,background:'#080a0a',showFrame:true,abilities:[],equipment:'',weapon:'Arma',attackSkill:'Luta',damage:'RA',weaponNote:'',rituals:[],updated:Date.now()};return layout(d);}
export function budget(d){return Object.values(d.skills).reduce((n,v)=>n+Math.max(0,STEPS.indexOf(v)),0);}
export function checks(d){return [
 {ok:budget(d)===12,text:`${budget(d)} de 12 aumentos de perícia`},
 {ok:JSON.stringify(Object.values(d.attrs).sort((a,b)=>a-b))==='[6,8,10]',text:'Atributos: um d6, um d8 e um d10'},
 {ok:d.pv+d.pd===48,text:`${d.pv+d.pd} de 48 pontos em PV + PD`}
 ];}
export function boundsOf(blocks){if(!blocks.length)return null;const x=Math.min(...blocks.map(b=>b.x)),y=Math.min(...blocks.map(b=>b.y));return {x,y,w:Math.max(...blocks.map(b=>b.x+b.w))-x,h:Math.max(...blocks.map(b=>b.y+b.h))-y};}
export function selectionUnits(blocks,ids){const set=new Set(ids),seen=new Set(),units=[];for(const b of blocks){if(!set.has(b.id))continue;const gid=(b.groupIds||[]).at(-1),all=gid?blocks.filter(x=>(x.groupIds||[]).includes(gid)):[];const whole=all.length&&all.every(x=>set.has(x.id));const key=whole?gid:b.id;if(seen.has(key))continue;seen.add(key);const members=whole?all:[b];units.push({id:key,groupId:whole?gid:null,blocks:members,...boundsOf(members),locked:members.some(b=>b.locked)});}return units;}
export function alignToReference(blocks,ids,referenceId,kind){const units=selectionUnits(blocks,ids),ref=units.find(u=>u.blocks.some(b=>b.id===referenceId));if(!ref)return;for(const u of units){if(u===ref||u.locked)continue;let x=u.x,y=u.y;switch(kind){case 'left':x=ref.x;break;case 'hcenter':x=ref.x+(ref.w-u.w)/2;break;case 'right':x=ref.x+ref.w-u.w;break;case 'top':y=ref.y;break;case 'vcenter':y=ref.y+(ref.h-u.h)/2;break;case 'bottom':y=ref.y+ref.h-u.h;break;}u.blocks.forEach(b=>{b.x+=x-u.x;b.y+=y-u.y;});}}
export function distributeBlocks(blocks,ids,axis){const pos=axis==='x'?'x':'y',size=axis==='x'?'w':'h',items=selectionUnits(blocks,ids);if(items.length<3||items.some(b=>b.locked))return;items.sort((a,b)=>a[pos]-b[pos]);const first=items[0],last=items.at(-1),total=items.reduce((n,b)=>n+b[size],0),gap=(last[pos]+last[size]-first[pos]-total)/(items.length-1);let cursor=first[pos]+first[size]+gap;for(let i=1;i<items.length-1;i++){const delta=cursor-items[i][pos];items[i].blocks.forEach(b=>b[pos]+=delta);cursor+=items[i][size]+gap;}}
export function validateImport(raw){
 if(!raw||raw.schema!=='catastrophe-sheet'||raw.version!==1)throw new Error('Este arquivo não é uma ficha compatível com o editor.');
 if(typeof raw.name!=='string'||!Array.isArray(raw.blocks)||raw.blocks.length>150||!Array.isArray(raw.abilities)||!Array.isArray(raw.rituals))throw new Error('A ficha contém dados inválidos.');
 if(!Object.keys(COLORS).includes(raw.profile))throw new Error('Perfil inválido.');
 for(const key of Object.keys(ATTRS))if(!STEPS.includes(raw.attrs?.[key]))throw new Error('Atributos inválidos.');
 if(!raw.skills||Object.values(raw.skills).some(v=>!STEPS.includes(v)))throw new Error('Perícias inválidas.');
 if(![raw.pv,raw.pd].every(v=>Number.isFinite(v)&&v>=0&&v<=200))throw new Error('PV e PD devem estar entre 0 e 200.');
 const types=['portrait','name','identity','attributes','skills','resource','profile','ability','equipment','rituals','text','separator','image','counter','heading','attributeRow','skillRow','resourceValue','resourceTrack'];
 const ids=new Set();for(const b of raw.blocks){if(!types.includes(b.type)||typeof b.id!=='string'||ids.has(b.id))throw new Error('Blocos inválidos ou repetidos.');ids.add(b.id);for(const k of ['x','y','w','h','font'])if(!Number.isFinite(b[k]))throw new Error('Posição ou tamanho inválido.');if(b.w<20||b.h<20||b.w>4000||b.h>4000||b.font<8||b.font>250)throw new Error('Dimensões fora dos limites.');}
 const groups=raw.groups||[];if(!Array.isArray(groups)||groups.length>150||groups.some(g=>!g||typeof g.id!=='string'||typeof g.title!=='string')||new Set(groups.map(g=>g.id)).size!==groups.length)throw new Error('Grupos inválidos.');const groupIds=new Set(groups.map(g=>g.id));for(const b of raw.blocks)if(b.groupIds&&(!Array.isArray(b.groupIds)||b.groupIds.length>20||new Set(b.groupIds).size!==b.groupIds.length||b.groupIds.some(id=>!groupIds.has(id))))throw new Error('O bloco possui um grupo inválido.');
 const validImg=v=>!v||/^data:image\/(png|jpeg|webp);base64,[a-z\d+/=]+$/i.test(v)||/^\.\/assets\/[a-z]+\.webp$/.test(v);
 if(!validImg(raw.portrait)||raw.blocks.some(b=>!validImg(b.image)))throw new Error('A imagem da ficha precisa estar incorporada no arquivo.');
 for(const k of ['accent','background'])if(raw[k]&&!/^#[a-f\d]{6}$/i.test(raw[k]))throw new Error('Cor inválida.');
 return clone(raw);
}
