import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { catalog, renderCatalogHtml } from '../scripts/render-catalog.mjs';

const html=renderCatalogHtml();
const items=catalog.entries;
const js=readFileSync(new URL('../site/assets/home.js',import.meta.url),'utf8');
const modules=readFileSync(new URL('../.gitmodules',import.meta.url),'utf8');

test('13 versoes catalogadas, Hover Shot presente, sem motor selecionado',()=>{
 assert.equal(items.length,13);
 assert.equal(items[0].id,'hovershot');
 assert.equal(items[0].status,'development');
 for(const name of ['Hover Shot','Rembound','Guntanks','Craterfall','Artillery P2P','Scorched Tanks','OpenBound','Hillshot','GunBros','Gusanito','WebWars','OpenArtillery','DragonBound']){
  assert.ok(items.some(x=>x.name===name),name);
 }
 assert.equal(new Set(items.map(x=>x.id)).size,items.length);
 assert.equal((html.match(/class="version-card /g)||[]).length,13);
 assert.ok(html.includes('Nenhuma base será escolhida antes da sua avaliação'));
});
test('links externos SEMPRE presentes, com target _blank e rel seguro',()=>{
 for(const item of items){
  assert.match(item.externalUrl,/^https:\/\//);
  const id='id="versao-'+item.id+'"';
  const at=html.indexOf(id);
  assert.ok(at>=0,'card ausente: '+item.id);
  const next=html.slice(at,html.indexOf('</article>',at));
  assert.ok(next.includes('href="'+item.externalUrl+'"'),'externo ausente: '+item.id);
  assert.ok(next.includes('target="_blank" rel="noopener noreferrer"'),'externo inseguro: '+item.id);
 }
 assert.equal((html.match(/class="btn btn-original"/g)||[]).length,items.length);
});
test('apenas os 2 laboratorios realmente instalados aparecem com botao local',()=>{
 const hosted=items.filter(x=>x.status==='hosted');
 assert.deepEqual(hosted.map(x=>x.id).sort(),['craterfall','guntanks']);
 assert.deepEqual(hosted.map(x=>x.localUrl).sort(),['/labs/craterfall/','/labs/guntanks/']);
 assert.equal((html.match(/class="btn btn-main"/g)||[]).length,2);
 for(const item of items.filter(x=>x.status!=='hosted')) assert.equal(item.localUrl,null,item.id);
});
test('projetos sem licenca ou proprietarios sao apenas referencias externas',()=>{
 for(const id of ['artillery','scorched','gunbros','dragonbound','openartillery']){
  const item=items.find(x=>x.id===id);
  assert.ok(item);
  assert.equal(item.localUrl,null);
 }
});
test('filtros, pesquisa, modal e fonte de dados padronizada presentes',()=>{
 for(const filter of ['all','hosted','multiplayer','references','project'])assert.ok(html.includes('data-filter="'+filter+'"'));
 for(const marker of ['id="catalog-search"','id="details-modal"','id="catalog-data"'])assert.ok(html.includes(marker));
 assert.ok(js.includes('dialog.close()') || js.includes('modal.close()'));
 assert.ok(js.includes("a.rel='noopener noreferrer'"));
 assert.ok(!html.includes('{{CATALOG_'));
 assert.ok(!html.includes('{{COUNT_'));
 assert.match(html,/href="\/assets\/home.css"/);
 assert.match(html,/src="\/assets\/home.js"/);
});
test('fonte original de cada motor importado fixada via submodulos',()=>{
 for(const path of ['rembound','guntanks','artillery','scorched-tanks','openbound'])assert.ok(modules.includes('sources/originals/'+path));
 assert.ok(modules.includes('sources/engines/hillshot'));
});
