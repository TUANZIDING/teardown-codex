import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {spawnSync} from 'node:child_process';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const temp=await fs.mkdtemp(path.join(os.tmpdir(),'teardown-generator-test-'));
try{
 for(const kind of ['v8','sentinel','all']){
 const dest=path.join(temp,kind+' 中文 space');
 const run=spawnSync(process.execPath,[path.join(root,'scripts/generate-v1.1.mjs'),kind,'--out',dest],{cwd:temp,encoding:'utf8'});assert.equal(run.status,0,run.stderr);
 for(const entry of kind==='all'?['v8','sentinel']:[kind]){
 const html=await fs.readFile(path.join(dest,entry+'.html'),'utf8');assert.ok(html.includes('<canvas')||html.includes('createElement("canvas")')||html.includes('createElement(\'canvas\')'));assert.ok(html.includes('MIT License'));assert.ok(html.length>500000);
 await fs.access(path.join(dest,'source/sims',entry+'-live/main.js'));
 }
 await fs.writeFile(path.join(dest,'user-file.txt'),'keep');
 const again=spawnSync(process.execPath,[path.join(root,'scripts/generate-v1.1.mjs'),kind,'--out',dest],{encoding:'utf8'});assert.notEqual(again.status,0);assert.equal(await fs.readFile(path.join(dest,'user-file.txt'),'utf8'),'keep');
 }
 const invalid=spawnSync(process.execPath,[path.join(root,'scripts/generate-v1.1.mjs'),'unknown','--out',path.join(temp,'invalid')]);assert.equal(invalid.status,2);
 console.log('Generator: all three modes, external cwd, Chinese/spaced paths and no-overwrite checks passed');
}finally{await fs.rm(temp,{recursive:true,force:true});}
