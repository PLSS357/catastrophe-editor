import test from 'node:test';
import assert from 'node:assert/strict';
import {writePSD} from '../dist/psd.js';
test('PSD includes a readable header, RGB preview, and individually named raster layers',async()=>{
 const image=new Uint8Array([255,0,0,255,0,0,255,255]);
 const blob=writePSD({width:2,height:1,composite:image,layers:[{name:'Fundo',left:0,top:0,width:2,height:1,pixels:image},{name:'Nome',left:0,top:0,width:1,height:1,pixels:image.subarray(0,4)}]});
 const bytes=new Uint8Array(await blob.arrayBuffer()),view=new DataView(bytes.buffer),str=(at,n)=>new TextDecoder().decode(bytes.subarray(at,at+n));
 assert.equal(str(0,4),'8BPS');assert.equal(view.getUint16(4),1);assert.equal(view.getUint16(12),4);
 assert.equal(view.getUint32(14),1);assert.equal(view.getUint32(18),2);assert.equal(view.getUint16(24),3);
 const layerSectionLength=view.getUint32(34),layerCount=view.getInt16(42);
 assert.equal(layerCount,2);assert.ok(layerSectionLength>100);
 assert.equal(view.getUint16(38+layerSectionLength),0);
 assert.equal(str(0,4),'8BPS');assert.ok(str(40,Math.min(500,bytes.length-40)).includes('Nome'));
});

test('PSD stores a Photoshop TySh type-tool record and editable text metadata',async()=>{
 const pixels=new Uint8Array([255,255,255,255]);
 const blob=writePSD({width:1,height:1,composite:pixels,layers:[{name:'Texto editável',left:0,top:0,width:1,height:1,pixels,text:{text:'Olá, Photoshop!',font:'Arial',fontSize:24,color:[255,255,255],matrix:[1,0,0,1,0,24]}}]});
 const bytes=new Uint8Array(await blob.arrayBuffer());
 const raw=new TextDecoder('latin1').decode(bytes);
 assert.ok(raw.includes('TySh'), 'PSD precisa de um bloco TySh para texto nativo');
 assert.ok(raw.includes('TxLr'), 'PSD precisa de um Action Descriptor de texto');
 assert.ok(raw.includes('EngineData'), 'PSD precisa de dados de tipografia');
 assert.ok(raw.includes('FontSet'), 'Dados de tipografia precisam registrar fontes');
 assert.ok(raw.includes('ResourceDict'), 'Dados de recursos de fontes do Photoshop');
});
