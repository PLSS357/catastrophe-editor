import {clone,COLORS} from './model.mjs';
export const STYLE_KEYS=['textStyle','titleStyle','color','textColor','opacity','frameStyle','dieStyle','resourceStyle','mask','softness','fade','imageAdjust'];
export function copyStyle(block){return Object.fromEntries(STYLE_KEYS.filter(k=>block[k]!==undefined).map(k=>[k,clone(block[k])]));}
export function pasteStyle(block,style){for(const key of STYLE_KEYS)if(style[key]!==undefined)block[key]=clone(style[key]);}
export function resetStyle(block){for(const k of STYLE_KEYS)delete block[k];}
export const themes={classic:{titleFont:'Georgia',bodyFont:'Arial',text:'#deddd5',secondary:'#aab89c',separator:'solid',frame:'classic',dice:'polygon'},minimal:{titleFont:'Arial',bodyFont:'Arial',text:'#f1f1eb',secondary:'#b2bfaa',separator:'dashed',frame:'simple',dice:'circle'},mono:{titleFont:'Georgia',bodyFont:'Arial',text:'#eeeeee',secondary:'#aaaaaa',separator:'solid',frame:'simple',dice:'outline'}};
export function applyTheme(doc,theme){doc.theme=clone(theme);}
