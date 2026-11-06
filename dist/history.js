const copy=x=>structuredClone(x);
export class History {
 constructor(limit=60,bytes=24000000){this.limit=limit;this.bytes=bytes;this.undo=[];this.redo=[];this.key=null;this.time=0;}
 clear(){this.undo=[];this.redo=[];this.key=null;}
 boundary(){this.key=null;}
 record(state,key=null){const now=Date.now();if(!key||key!==this.key||now-this.time>1000){this.undo.push(copy(state));this.trim();}this.key=key;this.time=now;this.redo=[];}
 trim(){let size=0;this.undo=this.undo.reverse().filter((s,i)=>{size+=JSON.stringify(s).length*2;return i<this.limit&&(size<this.bytes||i===0);}).reverse();}
 restore(direction,current){const from=this[direction],to=this[direction==='undo'?'redo':'undo'];if(!from.length)return null;to.push(copy(current));this.boundary();return copy(from.pop());}
}
