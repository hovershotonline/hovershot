// Dados de avaliação locais: nenhuma nota é enviada ao servidor.
export const criteria=Object.freeze([
  {key:'visual',label:'Visual e interface'},
  {key:'controles',label:'Controles e mira'},
  {key:'fisica',label:'Tiros e física'},
  {key:'online',label:'Partida online real'}
]);
const keys=criteria.map(item=>item.key);
export function sanitizeRecord(value){
  if(!value||typeof value!=='object'||Array.isArray(value))return null;
  const scores={};
  for(const key of keys){
    const raw=value.scores&&value.scores[key];
    scores[key]=Number.isInteger(raw)&&raw>=1&&raw<=5?raw:0;
  }
  const note=typeof value.note==='string'?value.note.trim().slice(0,600):'';
  if(!note&&!Object.values(scores).some(Boolean))return null;
  const updatedAt=typeof value.updatedAt==='string'&&Number.isFinite(Date.parse(value.updatedAt))?value.updatedAt:null;
  return {scores,note,updatedAt};
}
export function normalizeRecords(value,validIds){
  const normalized=Object.create(null);
  if(!value||typeof value!=='object'||Array.isArray(value))return normalized;
  for(const [id,record] of Object.entries(value)){
    if(!validIds.has(id))continue;
    const clean=sanitizeRecord(record);
    if(clean)normalized[id]=clean;
  }
  return normalized;
}
export function summarize(record){
  const clean=sanitizeRecord(record);
  if(!clean)return {tested:0,average:null};
  const rated=Object.values(clean.scores).filter(n=>n>0);
  return {tested:rated.length,average:rated.length?Math.round((rated.reduce((a,b)=>a+b,0)/rated.length)*10)/10:null};
}
export function makeReport(records,items){
  const lines=['HOVER SHOT — MINHAS AVALIAÇÕES','Notas subjetivas; 0 = não testado. Multiplayer não foi validado automaticamente.',''];
  const selected=Object.entries(normalizeRecords(records,new Set(items.keys())));
  selected.sort((a,b)=>(summarize(b[1]).average??-1)-(summarize(a[1]).average??-1));
  for(const [id,record] of selected){
    const label=items.get(id).name;
    const total=summarize(record);
    lines.push(label+' — '+(total.average===null?'sem nota':total.average.toFixed(1)+'/5')+' ('+total.tested+'/4 critérios avaliados)');
    for(const c of criteria)lines.push('  '+c.label+': '+(record.scores[c.key]||'não testado'));
    if(record.note)lines.push('  Observações: '+record.note);
    lines.push('');
  }
  return lines.join('\n').trim();
}
