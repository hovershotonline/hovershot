import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const file=path=>readFileSync(resolve('dist',path));
const sha=buffer=>createHash('sha256').update(buffer).digest('hex').slice(0,12);

test('HTML publicado referencia hashes do conteúdo atual',()=>{
 const html=file('index.html').toString('utf8');
 const cssHash=sha(file('assets/home.css'));
 const jsHash=sha(file('assets/home.js'));
 assert.ok(html.includes('href="/assets/home.css?v='+cssHash+'"'),'CSS com hash ausente');
 assert.ok(html.includes('src="/assets/home.js?v='+jsHash+'"'),'JS com hash ausente');
 assert.match(html,/id="playtest-summary-title"/);
 assert.match(html,/id="version-grid"/);
 assert.equal((html.match(/class="version-card /g)||[]).length,13);
});

test('import de ESM tem extensão JS compatível e versionamento do módulo',()=>{
 const modelPath='assets/playtest-model.js';
 assert.ok(existsSync(resolve('dist',modelPath)),'modelo JS faltando');
 const modelHash=sha(file(modelPath));
 const js=file('assets/home.js').toString('utf8');
 assert.ok(js.includes("from './playtest-model.js?v="+modelHash+"';"));
 assert.ok(!existsSync(resolve('dist','assets/playtest-model.mjs')),'módulo MIME inválido ainda no build');
 assert.match(js,/localStorage\.setItem/);
});
