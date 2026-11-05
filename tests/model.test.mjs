import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {makeCharacter,blank,layout,budget,checks,validateImport,block} from '../dist/model.mjs';
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
