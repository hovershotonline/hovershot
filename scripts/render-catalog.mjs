import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root=resolve(import.meta.dirname,'..');
export const catalog=JSON.parse(readFileSync(resolve(root,'site/catalog.json'),'utf8'));
const escapeHtml=value=>String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[char]);
const validUrl=url=>typeof url==='string'&&/^https:\/\/[^\s<>]+$/.test(url);

function validate(){
 if(catalog.schemaVersion!==1||!Array.isArray(catalog.entries))throw Error('Catalogo invalido');
 const ids=new Set();
 for(const item of catalog.entries){
  if(!/^[a-z0-9-]+$/.test(item.id)||ids.has(item.id))throw Error('ID invalido: '+item.id);
  ids.add(item.id);
  if(!item.name||!item.summary||!item.tech||!item.license||!item.statusLabel)throw Error('Campos ausentes: '+item.id);
  if(!validUrl(item.externalUrl)||!validUrl(item.repoUrl))throw Error('Links externos obrigatorios: '+item.id);
  if(item.localUrl&&(!item.localUrl.startsWith('/labs/')||item.status!=='hosted'))throw Error('Local nao homologado: '+item.id);
  if(item.status==='hosted'&&!item.localUrl)throw Error('Hospedado sem rota: '+item.id);
  if(!Array.isArray(item.tags)||item.tags.length<1)throw Error('Tags ausentes: '+item.id);
 }
}

function renderCard(item,index){
 const local=item.localUrl
  ? '<a class="btn btn-main" href="'+escapeHtml(item.localUrl)+'">Jogar aqui <span aria-hidden="true">↗</span></a>'
  : '<span class="local-hint">Não instalado aqui</span>';
 const external='<a class="btn btn-original" href="'+escapeHtml(item.externalUrl)+'" target="_blank" rel="noopener noreferrer">'+escapeHtml(item.externalLabel)+' <span aria-hidden="true">↗</span></a>';
 const tags=item.tags.map(tag=>'<span>'+escapeHtml(tag)+'</span>').join('');
 return '<article class="version-card tone-'+escapeHtml(item.tone)+(item.id==='hovershot'?' is-project':'')+'"'
   +' id="versao-'+escapeHtml(item.id)+'" data-id="'+escapeHtml(item.id)+'" data-category="'+escapeHtml(item.category)+'" data-multiplayer="'+String(item.multiplayer)+'">'
   +'<div class="card-top"><span class="serial">VERSÃO '+String(index+1).padStart(2,'0')+'</span><span class="state '+escapeHtml(item.status)+'">'+escapeHtml(item.statusLabel)+'</span></div>'
   +'<div class="visual"><div class="terrain" aria-hidden="true"></div><span class="glyph" aria-hidden="true">'+escapeHtml(item.icon)+'</span><span class="visual-tag">'+escapeHtml(item.eyebrow)+'</span></div>'
   +'<div class="card-content"><p class="category">'+escapeHtml(item.eyebrow)+'</p><h3>'+escapeHtml(item.name)+'</h3><p class="description">'+escapeHtml(item.summary)+'</p>'
   +'<div class="tags">'+tags+'</div><p class="tech" title="'+escapeHtml(item.tech)+'">'+escapeHtml(item.tech)+'</p>'
   +'<div class="card-actions">'+local+external+'</div>'
   +'<button class="details" type="button" data-details="'+escapeHtml(item.id)+'">Tecnologias, licença e observações <span aria-hidden="true">↗</span></button>'
   +'</div></article>';
}
export function renderCatalogHtml(){
 validate();
 const items=catalog.entries,ready=items.filter(item=>item.status==='hosted').length,mp=items.filter(item=>item.multiplayer).length;
 let html=readFileSync(resolve(root,'site/index.html'),'utf8');
 const replacements={
  '{{COUNT_ALL}}':String(items.length).padStart(2,'0'),
  '{{COUNT_HOSTED}}':String(ready).padStart(2,'0'),
  '{{COUNT_MULTIPLAYER}}':String(mp).padStart(2,'0'),
  '{{CATALOG_CARDS}}':items.map(renderCard).join('\n'),
  '{{CATALOG_JSON}}':JSON.stringify(items).replace(/</g,'\\u003c').replace(/>/g,'\\u003e').replace(/&/g,'\\u0026')
 };
 for(const [key,val] of Object.entries(replacements))html=html.replaceAll(key,val);
 if(/\{\{[A-Z_]+\}\}/.test(html))throw Error('Placeholder nao substituido');
 return html;
}
