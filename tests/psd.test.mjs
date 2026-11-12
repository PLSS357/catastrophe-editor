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
