import { spawnSync } from 'node:child_process';
import { cpSync, existsSync, mkdirSync, rmSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const dist=resolve(root,'dist');
rmSync(dist,{recursive:true,force:true});mkdirSync(dist,{recursive:true});
// Somente arquivos da home aprovados entram no bundle: prototipos sem validação ficam fora.
cpSync(resolve(root,'site/index.html'),resolve(dist,'index.html'));
cpSync(resolve(root,'site/assets'),resolve(dist,'assets'),{recursive:true});
const ts=resolve(root,'node_modules/typescript/bin/tsc');const vite=resolve(root,'node_modules/vite/bin/vite.js');
for(const bin of [ts,vite])if(!existsSync(bin)){console.error('Dependências ausentes: npm install.');process.exit(1)}
for(const args of [[ts,'-p',resolve(root,'labs/craterfall/tsconfig.json'),'--noEmit'],[vite,'build',resolve(root,'labs/craterfall'),'--outDir',resolve(dist,'labs/craterfall')]]){
const p=spawnSync(process.execPath,args,{cwd:root,stdio:'inherit',env:{...process.env,BASE_PATH:'/labs/craterfall/'}});if(p.status!==0)process.exit(p.status??1);
}
cpSync(resolve(root,'labs/craterfall/LICENSE'), resolve(dist,'labs/craterfall/LICENSE'));
const imported=spawnSync(process.execPath,[resolve(root,'scripts/package-guntanks.mjs')],{cwd:root,stdio:'inherit'});if(imported.status!==0)process.exit(imported.status??1);
console.log('RESULTADO=HOVERSHOT_DIST_PRONTO');
