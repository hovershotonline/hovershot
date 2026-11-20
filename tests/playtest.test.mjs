import test from 'node:test';
import assert from 'node:assert/strict';
import {sanitizeRecord,normalizeRecords,summarize,makeReport} from '../site/assets/playtest-model.js';

test('zero significa não testado e não reduz a média',()=>{
 const r=sanitizeRecord({scores:{visual:5,controles:3,fisica:0,online:0},note:'  Teste local  '});
 assert.deepEqual(r.scores,{visual:5,controles:3,fisica:0,online:0});
 assert.equal(r.note,'Teste local');
 assert.deepEqual(summarize(r),{tested:2,average:4});
 assert.equal(sanitizeRecord({scores:{visual:0},note:'   '}),null);
});
test('dados inválidos e IDs ausentes do catálogo são descartados',()=>{
 const r=normalizeRecords({
  valido:{scores:{visual:99,controles:2.5,fisica:5,online:-2},note:'ok'},
  desconhecido:{scores:{visual:5},note:'não usar'},
  vazio:{scores:{visual:0},note:''}
 },new Set(['valido','vazio']));
 assert.deepEqual(Object.keys(r),['valido']);
 assert.equal(r.valido.scores.visual,0);
 assert.equal(r.valido.scores.fisica,5);
 assert.equal(r.valido.scores.online,0);
});
test('resumo é textual, claro sobre subjetividade e multiplayer não validado',()=>{
 const r={guntanks:sanitizeRecord({scores:{visual:4,controles:3,fisica:5,online:0},note:'Teste manual'})};
 const report=makeReport(r,new Map([['guntanks',{name:'Guntanks'}]]));
 assert.match(report,/Guntanks — 4\.0\/5 \(3\/4 critérios avaliados\)/);
 assert.match(report,/Partida online real: não testado/);
 assert.match(report,/Multiplayer não foi validado automaticamente/);
 assert.match(report,/Observações: Teste manual/);
});
