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
test('cinco opcoes browser e um desktop, sem button play falso',()=>{
  assert.equal((html.match(/data-state="browser"/g)||[]).length,5);
  assert.equal((html.match(/data-state="desktop"/g)||[]).length,1);
  assert.match(html, /OpenBound não roda no navegador/);
});
test('links externos preservam versoes originais e abrem em nova aba com seguranca',()=>{
  for(const host of ['gunbound.remcostoeten.nl','masag0.github.io/Guntanks/','lettfeti.github.io/artillery/','whorn76.github.io/scorched-tanks/']){
    assert.ok(html.includes('https://'+host));
  }
  const links = html.match(/<a\b[^>]*target="_blank"[^>]*>/g) || [];
  assert.equal(links.length,5);
  assert.ok(links.every(x=>x.includes('rel="noopener noreferrer"')));
});
test('rotas locais continuam presentes',()=>{
  assert.match(html, /href="\/labs\/craterfall\/"/);
  assert.match(html, /href="\/assets\/home.css"/);
  assert.match(html, /src="\/assets\/home.js"/);
});
test('modal registra todos os seis projetos e trata links como externos',()=>{
  for(const id of ['rembound','guntanks','artillery','scorched','craterfall','openbound']) assert.ok(js.includes(id+':{'));
  assert.ok(js.includes("a.rel='noopener noreferrer'"));
});
test('cinco fontes originais registradas por submodulos',()=>{
  for(const path of ['rembound','guntanks','artillery','scorched-tanks','openbound']) assert.ok(modules.includes('sources/originals/'+path));
});
