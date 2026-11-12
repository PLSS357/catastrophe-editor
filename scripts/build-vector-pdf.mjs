import {build} from 'esbuild';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import path from 'node:path';
const root=path.resolve(import.meta.dirname,'..');
await mkdir(path.join(root,'dist/vendor'),{recursive:true});
await build({stdin:{contents:"export {jsPDF} from 'jspdf'; import 'svg2pdf.js';",resolveDir:root,sourcefile:'vector-pdf-entry.js'},bundle:true,format:'esm',platform:'browser',minify:true,external:['html2canvas','dompurify','canvg'],outfile:path.join(root,'dist/vendor/vector-pdf.js'),plugins:[{name:'safe-large-data-uri',setup(build){build.onLoad({filter:/svg2pdf\.(?:es|umd)(?:\.min)?\.js$/},async({path})=>{const original=await readFile(path,'utf8'),fixed=original.replaceAll(String.raw`((?:.|\s)*)`,String.raw`([\s\S]*)`);if(fixed===original)throw Error('Verifique a correção da expressão de Data URI na nova versão de svg2pdf.');return {contents:fixed,loader:'js'};});}}]});
