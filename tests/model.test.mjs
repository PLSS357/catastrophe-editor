import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {makeCharacter,blank,layout,budget,checks,validateImport,block,boundsOf,alignToReference,distributeBlocks} from '../dist/model.mjs';
const src=JSON.parse(readFileSync(new URL('../dist/presets.json',import.meta.url)));
test('Os seis modelos preservam orçamento, atributos e repertórios adaptados',()=>{
 assert.equal(src.characters.length,6);
 for(const c of src.characters){const d=makeCharacter(c,src.details,src.spells,src.summaries);assert.equal(budget(d),12,c.nome);assert.ok(checks(d).every(c=>c.ok),c.nome);assert.deepEqual(d.attrs,c.atributos);assert.equal(d.pv,c.pv);assert.equal(d.pd,c.pd);assert.equal(d.rituals.length,c.rituais.length);assert.equal(new Set(d.blocks.map(b=>b.id)).size,d.blocks.length);validateImport(d);}
});
test('Backup JSON preserva texto com acentos, posição e dados editados',()=>{
 const d=blank();d.name='João — Equipe';d.blocks[0].x=77;d.skills.Ocultismo=10;d.equipment='Rádio e proteção';const restored=validateImport(JSON.parse(JSON.stringify(d)));assert.deepEqual(restored,d);
});
test('Aplicar composição mantém os blocos livres e os poderes do personagem',()=>{
 const d=makeCharacter(src.characters[0],src.details,src.spells,src.summaries);const custom=block('text','Minha técnica',15,40,500,200,{body:'Conteúdo preservado'});d.blocks.push(custom);const powers=JSON.stringify(d.abilities);layout(d,'duas');assert.ok(d.blocks.some(b=>b.id===custom.id&&b.body===custom.body));assert.equal(JSON.stringify(d.abilities),powers);assert.equal(d.blocks.filter(b=>b.type==='profile').length,1);layout(d,'ordem');assert.equal(d.blocks.filter(b=>b.id===custom.id).length,1);
});
test('Importações incompatíveis, coordenadas inválidas e imagens externas são recusadas',()=>{
 assert.throws(()=>validateImport({}));const d=blank();d.portrait='javascript:alert(1)';assert.throws(()=>validateImport(d));d.portrait='https://example.com/foto.png';assert.throws(()=>validateImport(d));d.portrait='';d.blocks[0].w=NaN;assert.throws(()=>validateImport(d));d.blocks[0].w=200;d.blocks.push({...d.blocks[0]});assert.throws(()=>validateImport(d));
});
test('Backups com retrato WebP incorporado são importáveis',()=>{
 const d=blank();d.portrait='data:image/webp;base64,UklGRg==';assert.equal(validateImport(JSON.parse(JSON.stringify(d))).portrait,d.portrait);d.portrait='data:application/octet-stream;base64,UklGRg==';assert.throws(()=>validateImport(d));
});
test('Seis alinhamentos usam as dimensões da referência e mantêm a referência imóvel',()=>{
 for(const kind of ['left','hcenter','right','top','vcenter','bottom']){
  const ref=block('text','Base',300,200,200,100),other=block('text','Outro',600,500,80,40),unselected=block('text','Fora',900,900,50,50),snapshot=JSON.stringify(ref);
  alignToReference([ref,other,unselected],[ref.id,other.id],ref.id,kind);
  assert.equal(JSON.stringify(ref),snapshot,kind);assert.equal(unselected.x,900);assert.equal(unselected.y,900);
  const expected={left:['x',300],hcenter:['x',360],right:['x',420],top:['y',200],vcenter:['y',230],bottom:['y',260]}[kind];assert.equal(other[expected[0]],expected[1],kind);
 }
});
test('Alinhar ignora blocos bloqueados e funciona com referência bloqueada',()=>{
 const ref=block('text','Base',25,30,200,100,{locked:true}),locked=block('text','Travado',200,600,80,40,{locked:true}),movable=block('text','Livre',500,600,80,40);alignToReference([ref,locked,movable],[ref.id,locked.id,movable.id],ref.id,'left');assert.equal(ref.x,25);assert.equal(locked.x,200);assert.equal(movable.x,25);
});
test('Distribuição preserva extremos e cria espaços iguais com larguras diferentes',()=>{
 const a=block('text','A',10,20,30,50),b=block('text','B',80,20,70,50),c=block('text','C',250,20,50,50);distributeBlocks([a,b,c],[a.id,b.id,c.id],'x');assert.equal(a.x,10);assert.equal(c.x,250);assert.equal(b.x-a.x-a.w,c.x-b.x-b.w);
});
test('A caixa de seleção cobre todos os blocos, inclusive posições negativas',()=>{
 assert.deepEqual(boundsOf([{x:-10,y:20,w:100,h:50},{x:200,y:-20,w:50,h:100}]),{x:-10,y:-20,w:260,h:100});assert.equal(boundsOf([]),null);
});
