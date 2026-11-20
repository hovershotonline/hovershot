import {cpSync,existsSync,mkdirSync,readFileSync,writeFileSync} from 'node:fs';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {execFileSync} from 'node:child_process';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const source=resolve(root,'sources/originals/guntanks');
const dest=resolve(root,'dist/labs/guntanks');
const expected='072c2312abec19089149c211751ffec7311d69d4';
function copy(path) { const from=resolve(source,path),to=resolve(dest,path);if(!existsSync(from))throw new Error('Guntanks missing original file: '+path);mkdirSync(dirname(to),{recursive:true});cpSync(from,to); }
if(!existsSync(resolve(source,'index.html'))) throw new Error('Run git submodule update --init sources/originals/guntanks before npm run build.');
const sha=execFileSync('git',['rev-parse','HEAD'],{cwd:source,encoding:'utf8'}).trim();
if(sha!==expected)throw new Error('Guntanks source commit mismatch: '+sha);
for(const file of [
'index.html','styles.css','lib/bundle.js',
'assets/theme.mp3','assets/turn.mp3','assets/win.mp3','assets/wind.mp3',
'assets/terrain-full.png','assets/tank-small-left.png','assets/tank-small-right.png',
'assets/high-sound-icon.png','assets/mute-icon.png'
])copy(file);
const index=resolve(dest,'index.html');
let html=readFileSync(index,'utf8');
html=html.replace('</head>','<meta name="viewport" content="width=device-width,initial-scale=1"><meta name="referrer" content="strict-origin-when-cross-origin"></head>');
html=html.replace('<body>','<body><a class="hover-shot-return" href="/">← Hover Shot · Voltar aos jogos</a>');
html=html.replace('</body>', '<style>.hover-shot-return{position:fixed;left:14px;top:10px;z-index:20000;background:#111b27;color:#fff;border:1px solid #89af70;border-radius:20px;padding:9px 13px;text-decoration:none;font:600 12px system-ui,sans-serif}.hover-shot-return:hover{background:#293c40}body{margin:0}html{overflow-x:auto}</style></body>');
writeFileSync(index,html);
const bundle=resolve(dest,'lib/bundle.js');let runtime=readFileSync(bundle,'utf8');
runtime=runtime.replace(/\n?\/\/# sourceMappingURL=bundle\.js\.map\s*$/,'');
writeFileSync(bundle,runtime);
writeFileSync(resolve(dest,'LICENSE.txt'),
'Guntanks original project by masag0: https://github.com/masag0/Guntanks\nSource commit: '+expected+'\nThe original package.json declares license: ISC.\nThis is the original game JavaScript, CSS, gameplay and required runtime files, apart from a Hover Shot return link.\nGunbound-specific icon assets are deliberately excluded because not used by runtime.\n');
console.log('RESULTADO=GUNTANKS_IMPORTADO_NO_BUILD');
