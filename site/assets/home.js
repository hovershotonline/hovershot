import { criteria, sanitizeRecord, normalizeRecords, summarize, makeReport } from './playtest-model.js';
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
  const storageKey='hover-shot:playtests:v1';
  const scoreFields=Array.from(document.querySelectorAll('[data-score-key]'));
  const noteField=document.getElementById('playtest-note');
  const feedback=document.getElementById('playtest-feedback');
  const removeButton=document.getElementById('playtest-remove');
  const results=document.getElementById('playtest-results');
  const emptyResults=document.getElementById('playtest-empty');
  const copyButton=document.getElementById('copy-playtests');
  const copyFeedback=document.getElementById('playtest-copy-feedback');
  let currentId=null;
  let stored={};
  try{
    const raw=localStorage.getItem(storageKey);
    if(raw&&raw.length<=60000)stored=JSON.parse(raw);
  }catch(_){stored={};}
  let records=normalizeRecords(stored,new Set(byId.keys()));
  const formatRating=n=>n?String(n)+'/5':'Não testado';
  function refreshRatingLabels(){
    for(const field of scoreFields){
      const output=document.querySelector('output[for="'+field.id+'"]');
      if(output)output.textContent=formatRating(Number(field.value));
    }
  }
  function loadAssessment(id){
    currentId=id;
    const saved=records[id];
    for(const field of scoreFields)field.value=String(saved?.scores[field.dataset.scoreKey]||0);
    noteField.value=saved?.note||'';
    removeButton.disabled=!saved;
    feedback.textContent='';
    refreshRatingLabels();
  }
  function renderAssessments(){
    const ordered=Object.entries(records).map(([id,record])=>({id,record,stats:summarize(record)}))
      .sort((a,b)=>(b.stats.average??-1)-(a.stats.average??-1));
    results.replaceChildren();
    emptyResults.hidden=ordered.length>0;
    copyButton.disabled=ordered.length===0;
    for(const entry of ordered){
      const button=document.createElement('button');
      button.type='button';
      button.className='playtest-result';
      button.setAttribute('aria-label','Ver avaliação de '+byId.get(entry.id).name);
      const title=document.createElement('strong');
      title.textContent=byId.get(entry.id).name;
      const rating=document.createElement('span');
      rating.textContent=entry.stats.average===null?'Somente observações':entry.stats.average.toFixed(1)+'/5';
      const detail=document.createElement('small');
      detail.textContent=entry.stats.tested+'/4 critérios avaliados · abrir ficha';
      button.append(title,rating,detail);
      button.addEventListener('click',()=>openDetails(byId.get(entry.id)));
      results.append(button);
    }
  }
  function persist(next){
    try{localStorage.setItem(storageKey,JSON.stringify(next));}
    catch(_){feedback.textContent='Não foi possível salvar neste navegador. Verifique o armazenamento local.';return false;}
    records=next;
    renderAssessments();
    return true;
  }
  scoreFields.forEach(field=>field.addEventListener('input',refreshRatingLabels));
  document.getElementById('playtest-form').addEventListener('submit',event=>{
    event.preventDefault();
    if(!currentId)return;
    const scores={};
    for(const field of scoreFields)scores[field.dataset.scoreKey]=Number(field.value);
    const record=sanitizeRecord({scores,note:noteField.value,updatedAt:new Date().toISOString()});
    if(!record){feedback.textContent='Atribua uma nota ou escreva uma observação antes de salvar.';return;}
    const next={...records,[currentId]:record};
    if(!persist(next))return;
    removeButton.disabled=false;
    feedback.textContent='Avaliação salva apenas neste navegador.';
  });
  removeButton.addEventListener('click',()=>{
    if(!currentId||!records[currentId])return;
    if(!window.confirm('Excluir a avaliação deste jogo deste navegador?'))return;
    const next={...records};
    delete next[currentId];
    if(persist(next)){
      loadAssessment(currentId);
      feedback.textContent='Avaliação excluída.';
    }
  });
  copyButton.addEventListener('click',async()=>{
    if(!navigator.clipboard?.writeText){copyFeedback.textContent='Cópia automática não disponível neste navegador.';return;}
    try{
      await navigator.clipboard.writeText(makeReport(records,byId));
      copyFeedback.textContent='Resumo copiado. Você pode colá-lo na conversa para comparar os jogos.';
    }catch(_){copyFeedback.textContent='Não foi possível copiar. Verifique a permissão de transferência.';}
  });
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
    loadAssessment(item.id);
    modal.showModal();
  }
  document.querySelectorAll('[data-details]').forEach(button=>button.addEventListener('click',()=>{
    const item=byId.get(button.dataset.details);
    if(item)openDetails(item);
  }));
  document.getElementById('modal-close').addEventListener('click',()=>modal.close());
  modal.addEventListener('click',event=>{if(event.target===modal)modal.close();});
  renderAssessments();
  document.getElementById('year').textContent=String(new Date().getFullYear());
  refresh();
})();
