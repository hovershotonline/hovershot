'use strict';
(() => {
  let entries;
  try { entries=JSON.parse(document.getElementById('catalog-data').textContent); }
  catch(err){console.error('Catálogo indisponível',err);return;}
  const byId=new Map(entries.map(item=>[item.id,item]));
  const cards=Array.from(document.querySelectorAll('.version-card'));
  const filters=Array.from(document.querySelectorAll('[data-filter]'));
  const input=document.getElementById('catalog-search');
  const counter=document.getElementById('result-count');
  const empty=document.getElementById('no-results');
  let filter='all';
  const normalize=value=>String(value||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
  function applies(item) {
    if(filter==='hosted')return item.status==='hosted';
    if(filter==='multiplayer')return item.multiplayer;
    if(filter==='references')return item.category==='referencia';
    if(filter==='project')return item.id==='hovershot';
    return true;
  }
  function refresh() {
    const query=normalize(input.value.trim());
    let shown=0;
    for(const card of cards) {
      const item=byId.get(card.dataset.id);
      const haystack=normalize([item.name,item.summary,item.tech,item.statusLabel,...item.tags].join(' '));
      const visible=applies(item)&&(!query||haystack.includes(query));
      card.hidden=!visible;
      if(visible)shown++;
    }
    counter.textContent='Mostrando '+shown+(shown===1?' versão':' versões');
    empty.hidden=shown!==0;
    filters.forEach(button=>{
      const active=button.dataset.filter===filter;
      button.classList.toggle('active',active);
      button.setAttribute('aria-pressed',String(active));
    });
  }
  filters.forEach(button=>button.addEventListener('click',()=>{filter=button.dataset.filter;refresh();}));
  input.addEventListener('input',refresh);
  document.getElementById('clear-filters').addEventListener('click',()=>{filter='all';input.value='';refresh();input.focus();});
  const modal=document.getElementById('details-modal');
  const setText=(id,text)=>{document.getElementById(id).textContent=text;};
  function action(href,label,isLocal) {
    const a=document.createElement('a');
    a.href=href;a.textContent=label+' ↗';
    a.className='modal-link'+(isLocal?' primary':'');
    if(!isLocal){a.target='_blank';a.rel='noopener noreferrer';}
    return a;
  }
  function openDetails(item) {
    setText('modal-title',item.name);
    setText('modal-description',item.summary);
    setText('modal-tech',item.tech);
    setText('modal-license',item.license);
    setText('modal-note',item.note);
    const actions=document.getElementById('modal-actions');
    actions.replaceChildren();
    if(item.localUrl)actions.append(action(item.localUrl,'Jogar aqui',true));
    actions.append(action(item.externalUrl,item.externalLabel,false));
    if(item.repoUrl!==item.externalUrl)actions.append(action(item.repoUrl,'Ver código / fonte',false));
    modal.showModal();
  }
  document.querySelectorAll('[data-details]').forEach(button=>button.addEventListener('click',()=>{
    const item=byId.get(button.dataset.details);
    if(item)openDetails(item);
  }));
  document.getElementById('modal-close').addEventListener('click',()=>modal.close());
  modal.addEventListener('click',event=>{if(event.target===modal)modal.close();});
  document.getElementById('year').textContent=String(new Date().getFullYear());
  refresh();
})();
