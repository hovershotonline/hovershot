'use strict';
const records={
rembound:{title:'Rembound · experiência próxima de GunBound',description:'Projeto MIT com 11 mobiles, incluindo Aduka, lobby, salas, bots, física de vento e terreno deformável. Funciona com Next.js/React e servidor SpacetimeDB; esta demo pertence ao autor, não está hospedada no Hover Shot.',note:'O endereço foi obtido do repositório oficial, mas o acesso à demo não pôde ser confirmado pela nossa verificação automática. Pode exigir servidor ativo, login ou estar indisponível.',url:'https://gunbound.remcostoeten.nl/',repo:'https://github.com/remcostoeten/Gunbound'},
guntanks:{title:'Guntanks · artilharia clássica',description:'Duelo local de 2 ou 4 pessoas. Possui três tipos de tiros (1/2/SS), delay, vento, força, ângulo e terreno destrutível. Controles com A/D, W/S e Espaço.',note:'Versão original do autor. O site web foi encontrado acessível; não é um jogo hospedado pelo Hover Shot. O repositório não fornece um arquivo LICENSE separado.',url:'https://masag0.github.io/Guntanks/',repo:'https://github.com/masag0/Guntanks'},
artillery:{title:'Artillery P2P · teste multiplayer original',description:'Experiência em HTML/CSS/JS com até quatro jogadores e salas conectadas por WebRTC. Permite criar ou entrar com código, e possui prática solo.',note:'O multiplayer utiliza o broker PeerJS público, que é um serviço de terceiros e pode estar indisponível. Teste no navegador dos autores, sem adaptação.',url:'https://lettfeti.github.io/artillery/',repo:'https://github.com/lettfeti/artillery'},
scorched:{title:'Scorched Tanks · IA, local e online',description:'Jogo inspirado em Scorched Earth. Tem modos local, contra inteligência artificial e online, terrenos, armas, simulação determinística e testes automatizados.',note:'O repositório anuncia uma demo no GitHub Pages, mas o acesso à página não pôde ser confirmado pela nossa verificação automática. O modo online pode depender de serviços externos.',url:'https://whorn76.github.io/scorched-tanks/',repo:'https://github.com/whorn76/scorched-tanks'},
craterfall:{title:'Craterfall · Lab 01 instalado',description:'Jogo Phaser 3 sob licença MIT, instalado no próprio Hover Shot. Permite duelo local de dois jogadores com vento, terreno destrutível e nove armas.',note:'Não contém Aduka ou multiplayer pela internet. É uma referência de motor de física, não uma versão fiel de GunBound.',url:'/labs/craterfall/',repo:'https://github.com/blueRonyHazard/craterfall-the-game'},
openbound:{title:'OpenBound · cliente de desktop',description:'Projeto OpenBound em C# e MonoGame, com aplicativos de jogo, login, lobby e servidor. O repositório é GPL-3.0, mas os pacotes de texturas necessários não são redistribuídos.',note:'Não há versão em navegador neste repositório. Não seria correto apresentar uma cópia de outra aplicação como se OpenBound estivesse funcionando na web.',repo:'https://github.com/WickedPeanuts/OpenBound'}
};
const modal=document.getElementById('details-modal');
document.querySelectorAll('[data-filter]').forEach(btn=>btn.addEventListener('click',()=>{
document.querySelectorAll('[data-filter]').forEach(b=>{const selected=b===btn;b.classList.toggle('active',selected);b.setAttribute('aria-pressed',String(selected));});
document.querySelectorAll('[data-state]').forEach(card=>{card.hidden=btn.dataset.filter!=='all'&&card.dataset.state!==btn.dataset.filter;});
}));
document.querySelectorAll('[data-dialog]').forEach(btn=>btn.addEventListener('click',()=>{
const item=records[btn.dataset.dialog];if(!item)return;
document.getElementById('modal-title').textContent=item.title;
document.getElementById('modal-description').textContent=item.description;
document.getElementById('modal-note').textContent=item.note;
const actions=document.getElementById('modal-actions');actions.replaceChildren();
for(const [url,label] of [[item.url,'Abrir versão original ↗'],[item.repo,'Ver código-fonte ↗']]){
if(!url)continue;const a=document.createElement('a');a.href=url;a.textContent=label;if(url.startsWith('https://')){a.target='_blank';a.rel='noopener noreferrer';}actions.append(a);
}
modal.showModal();
}));
document.getElementById('close').addEventListener('click',()=>modal.close());
modal.addEventListener('click',event=>{if(event.target===modal)modal.close();});
document.getElementById('year').textContent=String(new Date().getFullYear());