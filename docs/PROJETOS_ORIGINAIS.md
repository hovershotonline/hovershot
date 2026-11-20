# Hover Shot — acervo das versões originais
**Data da auditoria:** 19/11/2026. **Objetivo:** conhecer e comparar as versões criadas por terceiros *antes de modificar suas mecânicas*.

## Decisão de produto
A home do Hover Shot oferece **seis opções identificáveis**, das quais **cinco foram publicadas como páginas web pelos autores** (Craterfall é servido no próprio Hover Shot). O OpenBound é cliente desktop e **não pode ser executado no navegador sem portar tecnologias e obter assets adicionais**. Não criar falsos botões de jogar.

### Catálogo e origem congelada
| ID | Projeto | Origem/commit | Experiência de teste | Direitos e dependências |
|---|---|---|---|---|
| 01 | Rembound | [remcostoeten/Gunbound](https://github.com/remcostoeten/Gunbound) `3e807036f444d006d89050c3f89802ed082d9115` | [Demo do autor](https://gunbound.remcostoeten.nl/) — **acessibilidade atual não confirmada**, pode exigir servidor ativo | Código declarado MIT, React/Next.js + SpacetimeDB/Rust. Contém 11 mobiles incluindo Aduka, salas, amigos e bots. Não replicar o backend de terceiro nem presumir direitos sobre imagens. |
| 02 | Guntanks | [masag0/Guntanks](https://github.com/masag0/Guntanks) `072c2312abec19089149c211751ffec7311d69d4` | [Jogar no site original](https://masag0.github.io/Guntanks/) — HTML público consultado | JavaScript HTML5, 2/4 jogadores locais, tiros 1/2/SS, delay, vento. `package.json` declara `ISC`, porém não foi identificado arquivo LICENSE separado; antes de redistribuir copiar licença/autorizações de cada asset. |
| 03 | Artillery P2P | [lettfeti/artillery](https://github.com/lettfeti/artillery) `91ac021976e0db16678f49c8194e6b9e0f5971f0` | [Abrir original](https://lettfeti.github.io/artillery/) — HTML consultado e revela opções Host/Join/Practice | P2P WebRTC com PeerJS público, 2–4 pessoas, HTML/CSS/JS sem backend. Sem licença expressa identificada: **não copiar/redistribuir código ou assets até obter autorização**. |
| 04 | Scorched Tanks | [whorn76/scorched-tanks](https://github.com/whorn76/scorched-tanks) `6ce2dfa6225bb424ae9fb0ad1fa0dbbbafc93a0c` | [Abrir demo original](https://whorn76.github.io/scorched-tanks/) — endereço anunciado no README, acesso atual não confirmado | IA/hot-seat/P2P, terreno e armas. Autor diz que imagens/sons/código são originais; **licença de redistribuição não confirmada**, usar somente link externo por enquanto. |
| 05 | Craterfall | [blueRonyHazard/craterfall-the-game](https://github.com/blueRonyHazard/craterfall-the-game) `0685b15ffa8fd305ad14d0b004add3dc65ae9a3b` | [Jogar no Hover Shot](/labs/craterfall/) — hospedado via artefato próprio | Phaser 3, hot-seat 2P, nove armas, licença MIT preservada; já importado integralmente em `labs/craterfall/`. |
| 06 | OpenBound | [WickedPeanuts/OpenBound](https://github.com/WickedPeanuts/OpenBound) `d11e8127d4634e51e8c0519c1349ac9f512bb357` | **Não existe versão web** no repo. Botão na home abre somente o projeto | Cliente MonoGame em C#, vários servidores .NET, GPL-3.0 para código. README afirma que **texture pack não é redistribuído**, necessário para compilar. Não executar como página estática e não copiar texturas de GunBound. |

### O que significa "importar"
- Os **cinco projetos de terceiros** são **submódulos Git apontando para commits exatos** em `sources/originals/`. Isso preserva a referência à **fonte completa como está** sem duplicar gigabytes de código/assets nem comprometer licenças; `git submodule update --init` materializa o checkout no ambiente de desenvolvimento, se autorizado. O projeto de cada autor continua sob sua governança.
- **Não é um deploy desses cinco projetos na Hostinger.** Isso exigiria disponibilidade de build e licenças; Rembound precisa de SpacetimeDB, OpenBound precisa de servidores e texturas, os outros têm páginas web dos autores. Não alterar os códigos de terceiros antes da etapa de avaliação.
- O botão **Jogar original** abre a versão do autor em **nova aba**. Não é um iframe e não afirma que a demo roda na nossa infraestrutura. O hover e o catálogo continuam sob o domínio Hover Shot.
- **Craterfall já está importado**, servido em `/labs/craterfall/`; não duplicar código ou criar banco novo.
- Em `main`, GitHub Actions usa `checkout` sem habilitar submódulos; o build empacota só a home, seus assets e o Craterfall já licenciado. A branch `site-build` não contém os cinco projetos terceiros.
- O motor experimental `site/labs/arena/core.js` permanece apenas como rascunho técnico, **excluído do build público** até decisão baseada nos testes dos projetos originais.

### Condição de conclusão
- [x] Cinco fontes preservadas por submódulos versionados na branch principal.
- [x] Home apresenta seis cartões com links e avisos de limitações.
- [x] Rembound e OpenBound não são anunciados como deploy próprio.
- [ ] Acompanhar execução verde do build/CI do catálogo.
- [ ] Publicar novo `site-build` no domínio com procedimento SSH seguro e rollback.
- [ ] Validar com o usuário quais demos originais efetivamente abrem e quais mecânicas merecem ser reutilizadas.
- [ ] Somente após a comparação, estudar uso local/port técnico, verificando licenças e custo de hospedagem.
