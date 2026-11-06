import {readdirSync} from 'node:fs';
import {spawnSync} from 'node:child_process';
for(const file of readdirSync('dist').filter(f=>/\.(mjs|js)$/.test(f))){const r=spawnSync(process.execPath,['--check','dist/'+file],{stdio:'inherit'});if(r.status)process.exit(r.status);}
const r=spawnSync(process.execPath,['--test',...readdirSync('tests').filter(f=>f.endsWith('.test.mjs')).map(f=>'tests/'+f)],{stdio:'inherit'});process.exit(r.status??1);
