import {boundsOf} from './model.mjs';
import {pageHeight} from './layout-engine.js';
import {sheetSVG} from './sheet.mjs';
import {escapeXML as esc} from './text-editor.js';
let serial=0;
export function namespaceSVG(markup,prefix){return markup.replace(/\bid="([^"]+)"/g,(_,id)=>`id="${prefix}${id}"`).replace(/url\(#([^)]+)\)/g,(_,id)=>`url(#${prefix}${id})`).replace(/(href=")#([^"]+)"/g,(_,attr,id)=>`${attr}#${prefix}${id}"`).replace(/\bdata-block="[^"]*"/g,'');}
export function sheetThumbnail(doc,skills,cache,{blocks=null,label='Prévia da composição',className='composition-thumbnail'}={}){let copy=doc,box={x:0,y:0,w:1920,h:pageHeight(doc)};if(blocks){if(!blocks.length)return '';box=boundsOf(blocks);const pad=Math.max(8,Math.min(box.w,box.h)*.08);box={x:box.x-pad,y:box.y-pad,w:box.w+pad*2,h:box.h+pad*2};copy={...doc,blocks:blocks.map(b=>({...b,visible:true,opacity:1})),showFrame:false,noTexture:true};}const prefix='thumb'+(++serial)+'-',svg=namespaceSVG(sheetSVG(copy,skills,cache),prefix);return `<svg class="${esc(className)}" viewBox="${box.x} ${box.y} ${box.w} ${box.h}" role="img" aria-label="${esc(label)}" preserveAspectRatio="xMidYMid meet">${svg}</svg>`;}
