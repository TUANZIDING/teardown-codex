#!/usr/bin/env node
import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {spawnSync} from 'node:child_process';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const args=process.argv.slice(2);
if(args.includes('--help')||!args.length){console.log('Usage: node scripts/generate-v1.1.mjs v8|sentinel|all --out <new-directory>\nOutputs offline HTML, editable sources and license notices. Never overwrites an existing directory.');process.exit(0);}
const [kind,flag,output,...extra]=args;
if(!['v8','sentinel','all'].includes(kind)||flag!=='--out'||!output||extra.length){console.error('Invalid arguments. Use --help.');process.exit(2);}
const dest=path.resolve(output),deps=path.join(root,'upstream/node_modules');
try{await fs.access(path.join(deps,'esbuild'));}catch{console.error('Dependencies missing. Run npm run setup in the skill repository.');process.exit(2);}
// mkdir without recursive makes destination ownership explicit and prevents overwrite.
await fs.mkdir(path.dirname(dest),{recursive:true});
try{await fs.mkdir(dest);}catch(e){if(e.code==='EEXIST'){console.error('Output already exists; choose a new --out directory.');process.exit(2);}throw e;}
const source=path.join(dest,'source');await fs.mkdir(path.join(source,'sims'),{recursive:true});
const entries=kind==='all'?['v8','sentinel']:[kind];
for(const file of ['package.json','package-lock.json','paths.mjs','LICENSE'])await fs.copyFile(path.join(root,'upstream',file),path.join(source,file));
await fs.copyFile(path.join(root,'upstream/sims/build.mjs'),path.join(source,'sims/build.mjs'));
await fs.cp(path.join(root,'upstream/sims/kit'),path.join(source,'sims/kit'),{recursive:true});
if(entries.includes('v8'))for(const dir of ['v8-live','v8-shared'])await fs.cp(path.join(root,'upstream/sims',dir),path.join(source,'sims',dir),{recursive:true});
if(entries.includes('sentinel'))await fs.cp(path.join(root,'templates/sentinel-live'),path.join(source,'sims/sentinel-live'),{recursive:true});
const build=spawnSync(process.execPath,['sims/build.mjs',...entries.map(e=>e+'-live')],{cwd:source,env:{...process.env,TEARDOWN_DEPS:deps,TEARDOWN_OUT:path.join(dest,'.build')},stdio:'inherit'});
if(build.status!==0){console.error('Build failed; sources retained in '+source);process.exit(build.status||1);}
const notices=[];for(const [label,file] of [['teardown / claude-motion',path.join(root,'upstream/LICENSE')],['three.js',path.join(deps,'three/LICENSE')],['Inter',path.join(deps,'@fontsource-variable/inter/LICENSE')],['JetBrains Mono',path.join(deps,'@fontsource/jetbrains-mono/LICENSE')],['Sentinel implementation',path.join(root,'LICENSE')]])notices.push(label+'\n'+await fs.readFile(file,'utf8'));
const legal=notices.join('\n\n');
for(const entry of entries){let html=await fs.readFile(path.join(dest,'.build/dist',entry+'-live.html'),'utf8');
 html=html.replace('<head>',`<head>\n<!--\n${legal.replaceAll('--','—')}\n-->`);
 if(entry==='sentinel')html=html.replace('href="./index.html"','href="./'+(entries.includes('v8')?'v8.html':'sentinel.html')+'"').replace('← V8 LAB',entries.includes('v8')?'← V8 LAB':'SENTINEL LAB');
 await fs.writeFile(path.join(dest,entry+'.html'),html);
}
await fs.writeFile(path.join(dest,'THIRD-PARTY-NOTICES.txt'),legal);
await fs.copyFile(path.join(root,'LICENSE'),path.join(dest,'LICENSE'));
await fs.writeFile(path.join(dest,'README.md'),`# 3D 演示生成结果\n\n${entries.map(e=>`- [${e}](${e}.html)`).join('\n')}\n\nHTML 可离线打开。可编辑源码在 source/。\n\n重新构建：\n\n\x60\x60\x60sh\ncd source\nnpm ci\nnode sims/build.mjs ${entries.map(e=>e+'-live').join(' ')}\n\x60\x60\x60\n\n构建结果在 source/teardown-out/dist；对外分发时保留许可证声明。\nV8 是教学模型；哨兵是程序化同人模型，不含电影原版资产或碰撞物理解算。\n`);
await fs.rm(path.join(dest,'.build'),{recursive:true});
console.log('Generated: '+dest);
