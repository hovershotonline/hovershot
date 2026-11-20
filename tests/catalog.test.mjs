import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
const read = p => readFileSync(new URL('../' + p, import.meta.url), 'utf8');
const html = read('site/index.html');
const js = read('site/assets/home.js');
const modules = read('.gitmodules');

test('seis projetos originais aparecem na home',()=>{
  const cards=(html.match(/class="lab-card/g)||[]).length;
  assert.equal(cards,6);
  for(const name of ['Rembound','Guntanks','Artillery P2P','Scorched Tanks','Craterfall','OpenBound']) assert.ok(html.includes(name),name);
});
test('somente dois jogos tem botao jogar no dominio, outros quatro claramente bloqueados',()=>{
  assert.equal((html.match(/data-state="ready"/g)||[]).length,2);
  assert.equal((html.match(/data-state="blocked"/g)||[]).length,4);
  assert.match(html, /href="\/labs\/guntanks\/"/);
  assert.match(html, /href="\/labs\/craterfall\/"/);
  assert.ok(!html.includes('class="play external"'));
  assert.ok(!html.includes('target="_blank"'));
  assert.match(html, /Não há versão web/);
});
test('navegacao de jogos aponta somente para arquivos locais',()=>{
  const links=[...html.matchAll(/<a\b[^>]*class="play"[^>]*href="([^"]+)"/g)].map(x=>x[1]);
  assert.deepEqual(links.sort(),['/labs/craterfall/','/labs/guntanks/'].sort());
});
test('rotas locais e assets da home estao presentes',()=>{
  assert.match(html, /href="\/assets\/home.css"/);
  assert.match(html, /src="\/assets\/home.js"/);
});
test('modal registra os seis projetos e links de origem seguros',()=>{
  for(const id of ['rembound','guntanks','artillery','scorched','craterfall','openbound']) assert.ok(js.includes(id+':{'));
  assert.ok(js.includes("a.rel='noopener noreferrer'"));
  assert.ok(js.includes("url:'/labs/guntanks/'"));
  assert.ok(!js.includes("url:'https://gunbound.remcostoeten.nl/'"));
});
test('cinco fontes originais registradas por submodulos',()=>{
  for(const path of ['rembound','guntanks','artillery','scorched-tanks','openbound']) assert.ok(modules.includes('sources/originals/'+path));
});
