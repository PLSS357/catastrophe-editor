import {uid,clone,block,PROFILES,selectionUnits} from './model.mjs';

export const outerGroup=b=>(b.groupIds||[]).at(-1);
export function membersOf(doc,id){return doc.blocks.filter(b=>(b.groupIds||[]).includes(id));}
export function selectionFor(doc,id,drill=false){const b=doc.blocks.find(b=>b.id===id);if(!b)return [];const group=outerGroup(b);return group&&!drill?membersOf(doc,group).map(b=>b.id):[id];}
export function groupSelection(doc,ids){
 const set=new Set(ids);for(const id of ids)selectionFor(doc,id).forEach(id=>set.add(id));
 const blocks=doc.blocks.filter(b=>set.has(b.id));if(selectionUnits(doc.blocks,[...set]).length<2)return [...set];
 if(blocks.some(b=>(b.groupIds||[]).length>=20))throw Error('Este conjunto já atingiu o limite de grupos aninhados.');
 const group={id:uid(),title:'Grupo '+((doc.groups||[]).length+1)};doc.groups=[...(doc.groups||[]),group];blocks.forEach(b=>b.groupIds=[...(b.groupIds||[]),group.id]);return blocks.map(b=>b.id);
}
export function canSplit(b){if(!b)return false;if(['attributes','skills'].includes(b.type))return true;if(b.part==='content')return false;return ['profile','ability','text','equipment','rituals','resource','counter'].includes(b.type);}
export function canUngroup(doc,ids){return doc.blocks.some(b=>ids.includes(b.id)&&(outerGroup(b)||canSplit(b)));}
function cleanGroups(doc){const used=new Set(doc.blocks.flatMap(b=>b.groupIds||[]));doc.groups=(doc.groups||[]).filter(g=>used.has(g.id));}
function headingOf(original,title,w,x=original.x,y=original.y,font=29,extra={}){return block('heading',title,x,y,w,41,{font,color:original.color,opacity:original.opacity,locked:original.locked,headingText:title,...extra});}
export function splitBlock(doc,id,{getSkillRows=()=>[]}={}){
 const original=doc.blocks.find(b=>b.id===id);if(!canSplit(original))return [id];
 const body=clone(original);body.preset=false;body.part='content';let parts;
 if(original.type==='attributes'){
  if(original.part==='content'){
   const step=(original.h-35)/3;if(step<20)return [id];parts=Object.keys(doc.attrs).map((attr,i)=>block('attributeRow',attr==='Fisico'?'Físico':attr==='Mente'?'Mente':'Emoção',original.x,original.y+i*step,original.w,step,{font:Math.min(original.font,step*.7),attr,color:original.color,opacity:original.opacity,locked:original.locked}));
  }else{const crop=Math.max(0,original.w-300);body.x+=crop;body.w-=crop;parts=[body,headingOf(original,'ATRIBUTOS',original.w*.43,original.x,original.y+42)];}
 }else if(original.type==='skills'){
  if(original.part==='content'){
   const rows=getSkillRows(original),step=(original.h-11)/Math.max(1,rows.length);if(!rows.length||step<20)return [id];parts=rows.map(([skillKey,skillLabel,skillAttr],i)=>block('skillRow',skillLabel,original.x,original.y+i*step,original.w,step,{font:Math.min(original.font,step*.77),skillKey,skillLabel,skillAttr,color:original.color,opacity:original.opacity,locked:original.locked}));
  }else{if(original.h<80)return [id];body.y+=54;body.h-=54;parts=[body,headingOf(original,'PERÍCIAS',210)];}
 }else if(['profile','ability','text','equipment'].includes(original.type)){
  if(original.h<80||original.w<50)return [id];const title=original.type==='profile'?(original.customTitle||PROFILES[doc.profile][0]):original.type==='ability'?(doc.abilities.find(a=>a.id===original.ref)?.title||original.title):original.title;
  body.x+=5;body.y+=48;body.w-=12;body.h-=53;parts=[body,headingOf(original,title,original.w,original.x,original.y,original.font+4,{titleOf:body.id,headingText:undefined})];
 }else if(original.type==='rituals'){
  if(original.h<85)return [id];body.y+=56;body.h-=56;parts=[body,headingOf(original,'RITUAIS',original.w,original.x,original.y,original.font+6)];
 }else if(original.type==='resource'){
  if(original.h<85||original.w<140)return [id];body.type='resourceTrack';body.y+=58;body.h-=58;
  const number=block('resourceValue',original.resource==='pd'?'Valor PD':'Valor PV',original.x+107,original.y,original.w-107,41,{resource:original.resource,font:original.font,color:original.color,opacity:original.opacity,locked:original.locked});
  parts=[body,number,headingOf(original,original.resource==='pd'?'PD':'PV',90,original.x,original.y,original.font+8)];
 }else if(original.type==='counter'){
  const size=Math.min(24,original.h-5),count=Math.max(1,Math.min(30,original.max||3)),width=count*(size+7),left=original.w-width;
  if(left<30)return [id];body.x+=left;body.w=width;parts=[body,headingOf(original,original.title,left-5,original.x,original.y,original.font,{headingStyle:'plain',h:original.h})];
 }
 if(!parts?.length)return [id];for(const part of parts){if(original.textStyle&&!part.textStyle)part.textStyle=clone(original.textStyle);if(original.titleStyle&&!part.titleStyle)part.titleStyle=clone(original.titleStyle);if(original.rotation){const angle=original.rotation*Math.PI/180,cx=original.x+original.w/2,cy=original.y+original.h/2,x=part.x+part.w/2-cx,y=part.y+part.h/2-cy;part.x=cx+x*Math.cos(angle)-y*Math.sin(angle)-part.w/2;part.y=cy+x*Math.sin(angle)+y*Math.cos(angle)-part.h/2;part.rotation=original.rotation;}}const index=doc.blocks.indexOf(original);doc.blocks.splice(index,1,...parts);return parts.map(b=>b.id);
}
export function ungroupSelection(doc,ids,options){
 const groups=new Set(doc.blocks.filter(b=>ids.includes(b.id)).map(outerGroup).filter(Boolean));
 if(groups.size){const affected=new Set(ids);for(const b of doc.blocks)if(groups.has(outerGroup(b))){b.groupIds=b.groupIds.slice(0,-1);affected.add(b.id);}cleanGroups(doc);return [...affected];}
 return ids.flatMap(id=>splitBlock(doc,id,options));
}
export function duplicateSelection(doc,ids){
 const selected=doc.blocks.filter(b=>ids.includes(b.id));if(doc.blocks.length+selected.length>500)throw Error('Limite de 500 elementos por ficha.');const idMap=new Map(selected.map(b=>[b.id,uid()])),groupMap=new Map(),abilityMap=new Map();
 for(const b of selected)for(const id of b.groupIds||[])if(!groupMap.has(id))groupMap.set(id,uid());
 for(const [old,id] of groupMap){const group=(doc.groups||[]).find(g=>g.id===old);doc.groups=[...(doc.groups||[]),{id,title:(group?.title||'Grupo')+' — cópia'}];}
 const copies=selected.map(original=>{const b=clone(original);b.id=idMap.get(original.id);b.preset=false;b.x+=25;b.y+=25;if(b.groupIds)b.groupIds=b.groupIds.map(id=>groupMap.get(id));if(b.titleOf&&idMap.has(b.titleOf))b.titleOf=idMap.get(b.titleOf);if(b.type==='ability'){if(!abilityMap.has(b.ref)){const a=clone(doc.abilities.find(a=>a.id===b.ref));if(a){a.id=uid();a.title+=' — cópia';doc.abilities.push(a);abilityMap.set(b.ref,a.id);}}b.ref=abilityMap.get(b.ref)||b.ref;}return b;});
 doc.blocks.push(...copies);return copies.map(b=>b.id);
}
