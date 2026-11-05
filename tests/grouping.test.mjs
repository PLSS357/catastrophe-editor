import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {blank,block,clone,makeCharacter,validateImport,selectionUnits,alignToReference} from '../dist/model.mjs';
import {groupSelection,ungroupSelection,selectionFor,outerGroup,splitBlock,duplicateSelection} from '../dist/grouping.mjs';
globalThis.document={createElement:()=>({getContext:()=>({font:'',measureText:s=>({width:String(s).length*11})})})};
const {sheetSVG,visibleSkills}=await import('../dist/sheet.mjs');
const src=JSON.parse(readFileSync(new URL('../dist/presets.json',import.meta.url)));
const make=()=>makeCharacter(src.characters[0],src.details,src.spells,src.summaries);
const getRows=(doc,b)=>visibleSkills(b,doc,src.skills);
const sortedTexts=s=>[...s.matchAll(/<text\b[^>]*>(.*?)<\/text>/g)].map(m=>m[1]).sort();

test('Agrupamento é persistente e selecionar uma parte seleciona todo o grupo',()=>{
 const d=make(),blocks=d.blocks.slice(0,2),before=clone(blocks);groupSelection(d,blocks.map(b=>b.id));const gid=outerGroup(blocks[0]);assert.ok(gid);assert.deepEqual(selectionFor(d,blocks[0].id),blocks.map(b=>b.id));assert.equal(selectionFor(d,blocks[0].id,true).length,1);assert.deepEqual(blocks.map(b=>[b.x,b.y,b.w,b.h]),before.map(b=>[b.x,b.y,b.w,b.h]));const imported=validateImport(JSON.parse(JSON.stringify(d)));assert.equal(imported.groups[0].id,gid);
});
test('Grupos aninhados se desfazem um nível por vez',()=>{
 const d=make(),[a,b,c]=d.blocks;groupSelection(d,[a.id,b.id]);const inner=outerGroup(a);groupSelection(d,[a.id,c.id]);assert.equal(a.groupIds.length,2);assert.equal(selectionFor(d,c.id).length,3);ungroupSelection(d,[c.id]);assert.equal(outerGroup(a),inner);assert.equal(outerGroup(c),undefined);assert.equal(d.groups.length,1);ungroupSelection(d,[a.id]);assert.equal(outerGroup(a),undefined);assert.equal(d.groups.length,0);
});
test('Desagrupar Atributos separa título, depois os três atributos, sem alterar os valores',()=>{
 const d=make(),original=clone(d.blocks.find(b=>b.type==='attributes')),before=sortedTexts(sheetSVG(d,src.skills));const ids=splitBlock(d,original.id);assert.equal(ids.length,2);const title=d.blocks.find(b=>b.type==='heading'),body=d.blocks.find(b=>b.id===original.id);assert.equal(title.y,original.y+42);assert.equal(body.x+body.w,original.x+original.w);assert.equal(body.h,original.h);assert.deepEqual(sortedTexts(sheetSVG(d,src.skills)),before);const rows=splitBlock(d,body.id);assert.equal(rows.length,3);assert.deepEqual(d.blocks.filter(b=>b.type==='attributeRow').map(b=>b.attr),['Fisico','Mente','Emocao']);assert.deepEqual(sortedTexts(sheetSVG(d,src.skills)),before);validateImport(d);
});
test('Desagrupar Perícias mantém a lista viva e permite separar cada linha',()=>{
 const d=make(),b=d.blocks.find(b=>b.type==='skills'),original=clone(b),before=sortedTexts(sheetSVG(d,src.skills));splitBlock(d,b.id);assert.equal(b.id,d.blocks.find(x=>x.id===b.id).id);const body=d.blocks.find(x=>x.id===b.id);assert.equal(body.y,original.y+54);assert.deepEqual(sortedTexts(sheetSVG(d,src.skills)),before);const rows=getRows(d,body);const ids=splitBlock(d,body.id,{getSkillRows:b=>getRows(d,b)});assert.equal(ids.length,rows.length);assert.deepEqual(sortedTexts(sheetSVG(d,src.skills)),before);d.skills.Luta=12;assert.ok(sheetSVG(d,src.skills).includes('12'));validateImport(d);
});
test('Títulos de habilidades, recursos e preparação se separam sem perder o conteúdo',()=>{
 for(const type of ['profile','ability','equipment','resource','counter']){const d=make(),b=d.blocks.find(b=>b.type===type),before=sortedTexts(sheetSVG(d,src.skills));assert.ok(splitBlock(d,b.id).length>1,type);assert.deepEqual(sortedTexts(sheetSVG(d,src.skills)),before,type);validateImport(d);}
});
test('Títulos dos rituais podem ser separados da lista sem mudar as descrições',()=>{
 const d=makeCharacter(src.characters.find(c=>c.nome==='Neveah Skylar'),src.details,src.spells,src.summaries),b=d.blocks.find(b=>b.type==='rituals'),before=sortedTexts(sheetSVG(d,src.skills));splitBlock(d,b.id);assert.deepEqual(sortedTexts(sheetSVG(d,src.skills)),before);validateImport(d);
});
test('Alinhar um grupo a outro elemento mantém as distâncias internas',()=>{
 const d=blank();const a=block('text','A',10,30,100,40),b=block('text','B',150,80,100,50),ref=block('text','Ref',600,300,200,100);d.blocks=[a,b,ref];groupSelection(d,[a.id,b.id]);assert.equal(selectionUnits(d.blocks,[a.id,b.id,ref.id]).length,2);alignToReference(d.blocks,[a.id,b.id,ref.id],ref.id,'left');assert.equal(a.x,600);assert.equal(b.x-a.x,140);assert.equal(b.y-a.y,50);assert.equal(ref.x,600);
});
test('Duplicar um grupo não mantém vínculos com o grupo ou títulos originais',()=>{
 const d=make(),attr=d.blocks.find(b=>b.type==='attributes'),ids=splitBlock(d,attr.id);groupSelection(d,ids);const gid=outerGroup(d.blocks.find(b=>b.id===ids[0]));const copies=duplicateSelection(d,ids);assert.equal(copies.length,2);assert.notEqual(outerGroup(d.blocks.find(b=>b.id===copies[0])),gid);assert.deepEqual(selectionFor(d,copies[0]),copies);validateImport(d);
 const ability=d.blocks.find(b=>b.type==='ability'),parts=splitBlock(d,ability.id);groupSelection(d,parts);const abCopies=duplicateSelection(d,parts);const newHeading=d.blocks.find(b=>abCopies.includes(b.id)&&b.type==='heading');assert.ok(abCopies.includes(newHeading.titleOf));validateImport(d);
});
test('Os dois marcadores de preparação são brancos e continuam interativos',()=>{
 const d=make(),counter=d.blocks.find(b=>b.type==='counter');counter.value=1;const svg=sheetSVG(d,src.skills,{}, {play:true});assert.equal((svg.match(/fill="#f5f3eb"/g)||[]).length,2);assert.equal((svg.match(/data-counter=/g)||[]).length,2);assert.ok(svg.includes('stroke="#11170e"'));
});
test('Importações com grupos inexistentes são recusadas',()=>{const d=make();d.blocks[0].groupIds=['ausente'];assert.throws(()=>validateImport(d));});
