// PSD RGB 8-bit writer. Each layer is an independently editable raster layer.
const enc=new TextEncoder();
const u16=n=>{const b=new Uint8Array(2);new DataView(b.buffer).setUint16(0,n);return b;};
const i16=n=>{const b=new Uint8Array(2);new DataView(b.buffer).setInt16(0,n);return b;};
const u32=n=>{const b=new Uint8Array(4);new DataView(b.buffer).setUint32(0,n);return b;};
const i32=n=>{const b=new Uint8Array(4);new DataView(b.buffer).setInt32(0,n);return b;};
const ascii=s=>enc.encode(s);
function concat(chunks){const size=chunks.reduce((n,b)=>n+b.length,0),out=new Uint8Array(size);let at=0;for(const b of chunks){out.set(b,at);at+=b.length;}return out;}
function planar(data,channel){const out=new Uint8Array(data.length/4);for(let p=0;p<out.length;p++)out[p]=data[p*4+channel];return out;}
function layerRecord(layer){const {left,top,width,height,pixels,name}=layer;const size=width*height,channels=[[-1,3],[0,0],[1,1],[2,2]];
 const metadata=channels.flatMap(([id])=>[i16(id),u32(2+size)]);
 const label=enc.encode(String(name||'Camada').slice(0,250));const n=Math.min(255,label.length),pascal=concat([Uint8Array.of(n),label.subarray(0,n)]);const padding=(4-pascal.length%4)%4;
 const extra=concat([u32(0),u32(0),pascal,new Uint8Array(padding)]);
 const record=concat([i32(top),i32(left),i32(top+height),i32(left+width),u16(4),...metadata,ascii('8BIM'),ascii('norm'),Uint8Array.of(255,0,0,0),u32(extra.length),extra]);
 const streams=channels.map(([,ch])=>concat([u16(0),planar(pixels,ch)]));return {record,streams};
}
export function writePSD({width,height,layers,composite}){
 if(!Number.isInteger(width)||!Number.isInteger(height)||width<1||height<1||width>30000||height>30000)throw Error('Dimensões inválidas para PSD.');
 if(composite.length!==width*height*4)throw Error('Prévia PSD incompatível com as dimensões.');
 const built=layers.filter(l=>l.width&&l.height).map(layerRecord);
 if(built.length>32767)throw Error('Excesso de camadas para PSD.');
 const layerInfo=concat([i16(built.length),...built.map(x=>x.record),...built.flatMap(x=>x.streams)]);
 const layerMask=concat([u32(layerInfo.length),layerInfo,u32(0)]);
 const header=concat([ascii('8BPS'),u16(1),new Uint8Array(6),u16(4),u32(height),u32(width),u16(8),u16(3)]);
 const compositeStreams=[0,1,2,3].map(ch=>planar(composite,ch));
 return new Blob([header,u32(0),u32(0),u32(layerMask.length),layerMask,u16(0),...compositeStreams],{type:'image/vnd.adobe.photoshop'});
}
function blockSVG(page,block,skills,cache){
 const parser=new DOMParser(),doc=parser.parseFromString(page,'image/svg+xml'),root=doc.documentElement;
 if(doc.querySelector('parsererror'))throw Error('SVG inválido ao criar as camadas PSD.');
 root.querySelectorAll('.sheet-block').forEach(g=>{if(g.getAttribute('data-block')!==block.id)g.remove();});
 // Keep defs and embedded fonts, remove the backdrop and decorations before the block.
 for(const child of [...root.children])if(child.tagName.toLowerCase()!=='defs'&&child.tagName.toLowerCase()!=='style'&&!child.classList.contains('sheet-block'))child.remove();
 return new XMLSerializer().serializeToString(root);
}
async function drawSVG(svg,w,h,left=0,top=0,scale=1){
 const blob=new Blob([svg],{type:'image/svg+xml'}),url=URL.createObjectURL(blob);
 try{const img=new Image();img.src=url;await img.decode();const canvas=document.createElement('canvas');canvas.width=w;canvas.height=h;
 const ctx=canvas.getContext('2d',{willReadFrequently:true});ctx.drawImage(img,-left,-top,img.width*scale,img.height*scale);
 return ctx.getImageData(0,0,w,h).data;
 }finally{URL.revokeObjectURL(url);}
}
export async function exportPSD(svg,page,blocks,width,{onProgress}={}){
 const parser=new DOMParser(),parsed=parser.parseFromString(svg,'image/svg+xml');
 const root=parsed.documentElement,view=root.getAttribute('viewBox')?.split(/\s+/).map(Number);
 if(!view||!view[2]||!view[3])throw Error('O SVG não possui dimensões de página.');
 const scale=width/view[2],height=Math.round(view[3]*scale);
 if(width*height>40000000)throw Error('PSD excede 40 milhões de pixels. Reduza a resolução.');
 const composite=await drawSVG(svg,width,height,0,0,scale);
 const layers=[];
 // Background includes border and paper texture, but no blocks.
 for(const g of [...root.querySelectorAll('.sheet-block')])g.remove();
 const backdrop=await drawSVG(new XMLSerializer().serializeToString(root),width,height,0,0,scale);
 layers.push({name:'Fundo e moldura',left:0,top:0,width,height,pixels:backdrop});
 const displayNames={portrait:'Retrato',image:'Imagem',name:'Nome',heading:'Título',text:'Texto',shape:'Forma',separator:'Separador'};
 const visible=blocks.filter(b=>b.visible);
 for(let i=0;i<visible.length;i++){
  const b=visible[i],theta=(Number(b.rotation)||0)*Math.PI/180,c=Math.abs(Math.cos(theta)),s=Math.abs(Math.sin(theta));
  const bw=b.w*c+b.h*s,bh=b.w*s+b.h*c;
  const x=b.x+(b.w-bw)/2,y=b.y+(b.h-bh)/2,pad=12;
  const left=Math.max(0,Math.floor((x-pad)*scale)),top=Math.max(0,Math.floor((y-pad)*scale));
  const right=Math.min(width,Math.ceil((x+bw+pad)*scale)),bottom=Math.min(height,Math.ceil((y+bh+pad)*scale));
  if(right<=left||bottom<=top)continue;
  const pixels=await drawSVG(blockSVG(svg,b),right-left,bottom-top,left,top,scale);
  layers.push({name:`${i+1}. ${b.title||displayNames[b.type]||b.type||'Elemento'}`,left,top,width:right-left,height:bottom-top,pixels});
  onProgress?.(i+1,visible.length);
 }
 // Photoshop lists layers top-first; the SVG document lists blocks in paint order.
 return writePSD({width,height,layers:layers.reverse(),composite});
}
