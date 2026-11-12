// PSD RGB 8-bit writer with Photoshop Type Tool (TySh) layers for SVG text.
// Layer pixels are retained as a faithful preview; type settings remain editable.
const enc=new TextEncoder();
const u16=n=>{const b=new Uint8Array(2);new DataView(b.buffer).setUint16(0,n);return b;};
const i16=n=>{const b=new Uint8Array(2);new DataView(b.buffer).setInt16(0,n);return b;};
const f32=n=>{const b=new Uint8Array(4);new DataView(b.buffer).setFloat32(0,n);return b;};
const f64=n=>{const b=new Uint8Array(8);new DataView(b.buffer).setFloat64(0,n);return b;};
const unicode=s=>concat([u32(String(s).length),...Array.from(String(s)).map(ch=>u16(ch.charCodeAt(0)))]);
const u32=n=>{const b=new Uint8Array(4);new DataView(b.buffer).setUint32(0,n);return b;};
const i32=n=>{const b=new Uint8Array(4);new DataView(b.buffer).setInt32(0,n);return b;};
const ascii=s=>enc.encode(s);
function concat(chunks){const size=chunks.reduce((n,b)=>n+b.length,0),out=new Uint8Array(size);let at=0;for(const b of chunks){out.set(b,at);at+=b.length;}return out;}
function planar(data,channel){const out=new Uint8Array(data.length/4);for(let p=0;p<out.length;p++)out[p]=data[p*4+channel];return out;}
// Photoshop Action Descriptor encoding. Text layers require TySh, not only a raster channel.
const id=s=>{const bytes=ascii(s);return concat([u32(bytes.length===4?0:bytes.length),bytes]);};
const value=(kind,data)=>concat([ascii(kind),data]);
const desc=(className,classId,items)=>concat([unicode(className),id(classId),u32(items.length),...items.map(([key,v])=>concat([id(key),v]))]);
const vText=s=>value('TEXT',unicode(s));
const vBool=x=>value('bool',Uint8Array.of(x?1:0));
const vInt=n=>value('long',i32(n));
const vDouble=n=>value('doub',f64(n));
const vRaw=data=>value('tdta',concat([u32(data.length),data]));
const vEnum=(type,name)=>value('enum',concat([id(type),id(name)]));
const vObject=(name,type,items)=>value('Objc',desc(name,type,items));
function engineString(s){ // Adobe text engine strings are UTF-16BE with a BOM.
 const units=[0xfe,0xff];for(let i=0;i<s.length;i++){const code=s.charCodeAt(i);units.push(code>>8,code&255);}return '<'+Array.from(units,x=>x.toString(16).padStart(2,'0')).join('')+'>';
}
function engineData(t){
 const content=engineString(t.text.replace(/\r?\n/g,'\r')+'\r');
 const font=(t.font||'Arial').replace(/[\r\n\\()]/g,'');
 const size=Math.max(1,Number(t.fontSize)||20),n=t.text.length+1;
 const color=t.color||[0,0,0];
 const rgb=`<< /Type 1 /Values [ 1 ${color.map(x=>(Math.max(0,Math.min(255,x))/255).toFixed(6)).join(' ')} ] >>`;
 const fauxBold=t.bold?'true':'false',fauxItalic=t.italic?'true':'false';
 const style=`<< /Font 1 /FontSize ${size} /FauxBold ${fauxBold} /FauxItalic ${fauxItalic} /FillColor ${rgb} /FillFlag true /StrokeFlag false >>`;
 const paragraph=`<< /ParagraphSheet << /DefaultStyleSheet 0 /Properties << /Justification ${t.align==='right'?1:t.align==='center'?2:0} >> >> /Adjustments << /Axis [ 1 0 1 ] /XY [ 0 0 ] >> >>`;
 const resources=`<< /KinsokuSet [] /MojiKumiSet [] /TheNormalStyleSheet 0 /TheNormalParagraphSheet 0 /ParagraphSheetSet [ << /DefaultStyleSheet 0 /Properties << >> >> ] /StyleSheetSet [ << /Name ${engineString('Normal')} /StyleSheetData ${style} >> ] /FontSet [ << /Name ${engineString('AdobeInvisFont')} /Script 0 /FontType 0 /Synthetic 0 >> << /Name ${engineString(font)} /Script 0 /FontType 0 /Synthetic 0 >> ] /SuperscriptSize 0.583 /SuperscriptPosition 0.333 /SubscriptSize 0.583 /SubscriptPosition 0.333 /SmallCapSize 0.7 >>`;
 const result=`<< /EngineDict << /Editor << /Text ${content} >> /ParagraphRun << /DefaultRunData ${paragraph} /RunArray [ ${paragraph} ] /RunLengthArray [ ${n} ] /IsJoinable 1 >> /StyleRun << /DefaultRunData << /StyleSheet << /StyleSheetData << >> >> >> /RunArray [ << /StyleSheet << /StyleSheetData ${style} >> >> ] /RunLengthArray [ ${n} ] /IsJoinable 2 >> /GridInfo << /GridIsOn false /ShowGrid false /GridSize 18 /GridLeading 22 /GridColor ${rgb} /GridLeadingFillColor ${rgb} /AlignLineHeightToGridFlags false >> /AntiAlias 4 /UseFractionalGlyphWidths true >> /ResourceDict ${resources} /DocumentResources ${resources} >>`;
 return ascii(result);
}
function typeSettings(t){
 const text=t.text.replace(/\r?\n/g,'\r'),transform=t.matrix||[1,0,0,1,0,0];
 const textDesc=desc('', 'TxLr', [
  ['Txt ',vText(text)],['textGridding',vEnum('textGridding','None')],
  ['Ornt',vEnum('Ornt','Hrzn')],['AntA',vEnum('Annt','AnSm')],
  ['bounds',vObject('','Rctn',[['Top ',value('UntF',concat([ascii('#Pxl'),f64(0)]))],['Left',value('UntF',concat([ascii('#Pxl'),f64(0)]))],['Btom',value('UntF',concat([ascii('#Pxl'),f64(t.height||40)]))],['Rght',value('UntF',concat([ascii('#Pxl'),f64(t.width||200)]))]])],
  ['TextIndex',vInt(0)],['EngineData',vRaw(engineData(t))]
 ]);
 const warp=desc('','warp', [['warpStyle',vEnum('warpStyle','warpNone')],['warpValue',vDouble(0)],['warpPerspective',vDouble(0)],['warpPerspectiveOther',vDouble(0)],['warpRotate',vEnum('Ornt','Hrzn')]]);
 return concat([u16(1),...transform.map(f64),u16(50),u32(16),textDesc,u16(1),u32(16),warp,...[0,0,t.width||200,t.height||40].map(f32)]);
}
function tagged(key,data){const padding=data.length%2;return concat([ascii('8BIM'),ascii(key),u32(data.length),data,new Uint8Array(padding)]);}
function layerRecord(layer){const {left,top,width,height,pixels,name}=layer;const size=width*height,channels=[[-1,3],[0,0],[1,1],[2,2]];
 const metadata=channels.flatMap(([id])=>[i16(id),u32(2+size)]);
 const label=enc.encode(String(name||'Camada').slice(0,250));const n=Math.min(255,label.length),pascal=concat([Uint8Array.of(n),label.subarray(0,n)]);const padding=(4-pascal.length%4)%4;
 const extras=[tagged('luni',unicode(String(name||'Camada'))),...(layer.text?[tagged('TySh',typeSettings(layer.text))]:[])];
 const extra=concat([u32(0),u32(0),pascal,new Uint8Array(padding),...extras]);
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
function transformedPoint(node,x,y){
 // SVG descendants use nested translations; an additional block translation and rotation.
 const transforms=[];for(let e=node;e&&e.nodeType===1;e=e.parentNode){if(e.getAttribute?.('transform'))transforms.push(e.getAttribute('transform'));}
 const point={x,y};for(const expression of transforms){const matches=[...expression.matchAll(/(translate|rotate|scale|matrix)\(([^)]*)\)/g)].reverse();for(const [,type,args] of matches){const a=args.trim().split(/[\s,]+/).map(Number),ox=point.x,oy=point.y;
 if(type==='translate'){point.x+=a[0]||0;point.y+=a[1]||0;}
 if(type==='scale'){point.x*=a[0];point.y*=a[1]??a[0];}
 if(type==='rotate'){const rad=(a[0]||0)*Math.PI/180,c=Math.cos(rad),si=Math.sin(rad),cx=a[1]||0,cy=a[2]||0;point.x=c*(ox-cx)-si*(oy-cy)+cx;point.y=si*(ox-cx)+c*(oy-cy)+cy;}
 if(type==='matrix'){point.x=a[0]*ox+a[2]*oy+a[4];point.y=a[1]*ox+a[3]*oy+a[5];}
 }}return point;
}
function textAttributes(node){
 const style={};for(let e=node;e&&e.nodeType===1;e=e.parentNode){const attr=e.getAttribute?.('style')||'';for(const part of attr.split(';')){const [k,...v]=part.split(':');if(k&&v.length&&style[k.trim()]===undefined)style[k.trim()]=v.join(':').trim();}}
 const property=(name,css,fallback)=>style[css]||node.getAttribute(name)||fallback;
 let color=property('fill','fill','#deddd5');if(/^#[0-9a-f]{3}$/i.test(color))color='#'+[...color.slice(1)].map(c=>c+c).join('');
 const rgb=/^#[0-9a-f]{6}$/i.test(color)?[1,3,5].map(i=>parseInt(color.slice(i,i+2),16)):[222,221,213];
 return {text:node.textContent||'',font:property('font-family','font-family','Arial'),fontSize:parseFloat(property('font-size','font-size','24')),bold:/bold|[6-9]00/.test(property('font-weight','font-weight','normal')),italic:/italic|oblique/.test(property('font-style','font-style','normal')),color:rgb,align:node.getAttribute('text-anchor')==='middle'?'center':node.getAttribute('text-anchor')==='end'?'right':'left'};
}
function isolateNode(svg,blockId,indices,withoutText=false){
 const parser=new DOMParser(),doc=parser.parseFromString(svg,'image/svg+xml'),root=doc.documentElement;
 const group=[...root.querySelectorAll('.sheet-block')].find(g=>g.getAttribute('data-block')===blockId);
 if(!group)throw Error('Bloco PSD não encontrado.');
 for(const g of [...root.querySelectorAll('.sheet-block')])if(g!==group)g.remove();
 for(const ch of [...root.children])if(ch!==group&&!['defs','style'].includes(ch.tagName.toLowerCase()))ch.remove();
 const nodes=[...group.querySelectorAll('text')];
 const keep=new Set(Array.isArray(indices)?indices:[indices]);nodes.forEach((e,i)=>{if(withoutText||!keep.has(i))e.remove();});
 return new XMLSerializer().serializeToString(root);
}
// Rich text uses one SVG <text> for each character. Merge adjacent glyphs on
// the same baseline and with the same style, avoiding thousands of PSD layers.
function textGroups(nodes){
 const groups=[];let current=null;
 for(let i=0;i<nodes.length;i++){
  const node=nodes[i],t=textAttributes(node);
  if(!t.text)continue;
  const x=Number(node.getAttribute('x'))||0,y=Number(node.getAttribute('y'))||0;
  const signature=JSON.stringify([t.font,t.fontSize,t.bold,t.italic,t.color,t.align]);
  if(current&&current.parent===node.parentNode&&current.y===y&&current.signature===signature&&x>=current.lastX&&x-current.lastX<Math.max(12,t.fontSize*3)){
   current.indices.push(i);current.text+=t.text;current.lastX=x;
  }else{
   current={node,parent:node.parentNode,indices:[i],text:t.text,signature,y,lastX:x};groups.push(current);
  }
 }
 return groups;
}
export async function exportPSD(svg,page,blocks,width,{onProgress}={}){
 const parser=new DOMParser(),parsed=parser.parseFromString(svg,'image/svg+xml');
 const root=parsed.documentElement,view=root.getAttribute('viewBox')?.split(/\s+/).map(Number);
 if(!view||!view[2]||!view[3])throw Error('O SVG não possui dimensões de página.');
 const scale=width/view[2],height=Math.round(view[3]*scale);
 if(width*height>40000000)throw Error('PSD excede 40 milhões de pixels. Reduza a resolução.');
 const composite=await drawSVG(svg,width,height,0,0,scale),layers=[];
 for(const g of [...root.querySelectorAll('.sheet-block')])g.remove();
 layers.push({name:'Fundo e moldura',left:0,top:0,width,height,pixels:await drawSVG(new XMLSerializer().serializeToString(root),width,height,0,0,scale)});
 const source=new DOMParser().parseFromString(svg,'image/svg+xml');
 const displayNames={portrait:'Retrato',image:'Imagem',name:'Nome',heading:'Título',text:'Texto',shape:'Forma',separator:'Separador'};
 const visible=blocks.filter(b=>b.visible);
 for(let i=0;i<visible.length;i++){
  const b=visible[i],group=[...source.querySelectorAll('.sheet-block')].find(g=>g.getAttribute('data-block')===b.id);
  if(!group)continue;
  const theta=(Number(b.rotation)||0)*Math.PI/180,c=Math.abs(Math.cos(theta)),s=Math.abs(Math.sin(theta));
  const bw=b.w*c+b.h*s,bh=b.w*s+b.h*c,x=b.x+(b.w-bw)/2,y=b.y+(b.h-bh)/2,pad=12;
  const left=Math.max(0,Math.floor((x-pad)*scale)),top=Math.max(0,Math.floor((y-pad)*scale));
  const right=Math.min(width,Math.ceil((x+bw+pad)*scale)),bottom=Math.min(height,Math.ceil((y+bh+pad)*scale));
  if(right<=left||bottom<=top)continue;
  const nodes=[...group.querySelectorAll('text')],groups=textGroups(nodes);
  const basePixels=await drawSVG(isolateNode(svg,b.id,-1,true),right-left,bottom-top,left,top,scale);
  layers.push({name:`${i+1}. ${b.title||displayNames[b.type]||b.type||'Elemento'} — elementos`,left,top,width:right-left,height:bottom-top,pixels:basePixels});
  // Preserve each distinct SVG text element as an editable Photoshop Type layer.
  for(let j=0;j<groups.length;j++){
   const part=groups[j],node=part.node,t={...textAttributes(node),text:part.text},px=Number(node.getAttribute('x'))||0,py=Number(node.getAttribute('y'))||0;
   const origin=transformedPoint(node,px,py),fontSize=t.fontSize*scale;
   const estimated=Math.max(fontSize,Array.from(t.text).length*fontSize*.9);
   const layerLeft=left,layerTop=top; // Raster preview keeps exact SVG positioning and effects.
   const pixels=await drawSVG(isolateNode(svg,b.id,part.indices),right-left,bottom-top,left,top,scale);
   // A Type Tool transform's translation is at the text baseline; font size is in PSD pixels.
   const angle=(Number(b.rotation)||0)*Math.PI/180;
   const tx=origin.x*scale,ty=origin.y*scale;
   const text={...t,fontSize,width:estimated,height:fontSize*1.5,matrix:[Math.cos(angle),Math.sin(angle),-Math.sin(angle),Math.cos(angle),tx,ty]};
   layers.push({name:`Texto · ${t.text.slice(0,60)}`,left:layerLeft,top:layerTop,width:right-left,height:bottom-top,pixels,text});
  }
  onProgress?.(i+1,visible.length);
 }
 if(layers.length>32767)throw Error('Excesso de camadas PSD.');
 return writePSD({width,height,layers,composite});
}
