> **REGRA VIGENTE ATÉ SEGUNDA ORDEM (20/11/2026):** manter **várias versões no catálogo de `hovershot.online`**, com Hover Shot próprio como um card e **link externo original SEMPRE em cada opção**, inclusive para jogos instalados. A seleção do motor acontece após comparação, nunca antes. Esta regra é detalhada em [CATALOGO_PERMANENTE.md](CATALOGO_PERMANENTE.md) e supera qualquer plano anterior de interface com um jogo só.

# Hover Shot — finalidade canônica vigente

**Decisão expressa do proprietário (19/11/2026):** o Hover Shot será um jogo de artilharia **100% online no navegador, em `hovershot.online`, multiplayer com amigos**, com código e backend sob controle do proprietário. **Nenhum cliente Windows, aplicativo ou instalador desktop.** Propostas anteriores de Windows/Godot e Hedgewars desktop foram rejeitadas. Este documento substitui os textos conflitantes anteriores.

## Estratégia de reaproveitamento

Priorizar a importação de uma implementação web **já jogável e com multiplayer** para evitar refazer física, turnos, terrenos, lobby e sincronismo. A experiência de combate será evoluída com mecânicas inspiradas no GunBound clássico (vento, potência, delay, tiro 1/2/SS, Thor), preservando ativos e identidade próprios e respeitando direitos de terceiros. Rembound foi testado e rejeitado como motor de combate fiel; ele permanece somente como referência.

**Candidato técnico importado sem aprovação como motor de produto:** [Hillshot](https://github.com/m-esm/hillshot) no SHA `4014612e9735b4e9c74dab94abcd941f2301630c` (MIT, servidor Node.js + ws autoritativo, cliente HTML5/Phaser, salas de até 8 jogadores, bots, física, terreno destrutível). Submódulo Git em `sources/engines/hillshot` preserva a versão integral por SHA sem duplicação. **Importação não equivale a escolha do proprietário, publicação ou aprovação da experiência.** O Hillshot original possui armas genéricas e ainda não implementa os mobiles do GunBound.

## Resultado esperado

- Jogador abre `https://hovershot.online/` e entra no Hover Shot sem sair do domínio para acessar outros jogos.
- Cria sala de jogo, compartilha código com amigos e inicia partida em navegadores distintos, por internet.
- Combate 2D com mira, força, vento, terreno destrutível, HP, dano e turnos sincronizados, decisões validadas pelo servidor próprio.
- Depois de validar a partida, evoluir móveis com ataques distintos, delay e tiros complexos; até oito jogadores conforme capacidade real.
- Código e instalações versionados no GitHub; logs compactos, sem acúmulo de backups na Hostinger; assets próprios ou licenciados.

## Infraestrutura — escolha aprovada (20/11/2026)

**Decisão do proprietário:** opção B. O Cloud Startup continua responsável pelo frontend do Hover Shot, catálogo e jogos atuais; **Render** hospeda um serviço Node.js/WebSocket externo. Esta decisão é de **infraestrutura**, não escolha de motor de combate. Um laboratório de rede independente existe no repositório em services/multiplayer; nenhum clone do DragonBound foi importado. A UI de teste pode ser publicada pelo Render, sem alterar a home atual. Ver [RENDER_MULTIPLAYER.md](RENDER_MULTIPLAYER.md).

**Limite factual:** os testes locais no GitHub Actions (run 44826886870) verificaram dois jogadores, salas, turnos e comando de tiro, sem física nem jogo real. O Render ainda precisa ser vinculado à conta, serviço implantado e homologado entre navegadores em redes distintas. O serviço Free hiberna e perde estado em memória; nunca anunciar multiplayer persistente em produção sem reconexão/persistência e identidade dos jogadores.

## Infraestrutura — restrição verificada

A [Hostinger informa](https://www.hostinger.com/support/hostinger-node-js-limits-for-web-and-cloud-plans/) que hospedagem Web/Cloud **não aceita WebSocket de entrada**, mesmo para Node.js. Logo, copiar o frontend à webroot **não cria multiplayer**. Solução a validar: frontend estático em `hovershot.online/play/`, backend WebSocket persistente sob controle do proprietário em VPS (com TLS, domínio controlado e autenticação), sem alterar outros sites. A implementação original do Hillshot conecta WebSocket em `location.host` e precisará de adaptação do endpoint antes de distribuir frontend e backend em servidores distintos.

## Princípio de decisão — autoridade do proprietário

**Nenhum motor de jogo foi selecionado pelo proprietário.** Importar um projeto open source, executar CI ou comprovar conexões WebSocket é apenas pesquisa, não decisão de produto. Antes de desenvolver um fork do Hillshot ou substituir produção, oferecer comparativo de bases que possam ser usadas legalmente, com teste de jogabilidade isolado, requisitos de rede, custo e fidelidade; apresentar alternativas e aguardar escolha explícita. Não tratar requisitos fixados de navegador, domínio e multiplayer como autorização para selecionar motor.


**CRITÉRIO DE SELEÇÃO DO PROPRIETÁRIO:** cada candidato deve ser testado em **homologação online real** com servidor próprio e usuários externos, sob o domínio Hover Shot, antes da escolha; smoke CI localhost, um frontend em HTTP 200 ou demo externa não bastam. Veja [HOMOLOGACAO_ONLINE.md](HOMOLOGACAO_ONLINE.md). O objetivo não é apenas técnica, mas gameplay e operação do servidor.

## Estado e etapas

- [x] Confirmado objetivo somente navegador e domínio Hover Shot.
- [x] Licença MIT do Hillshot e licença CC0 de sprites Kenney conferidas; código multiplayer inspecionado.
- [x] CI de integração: submódulo fixado e **2 clientes WebSocket simulados no runner**, criação de sala, início e tiro replicado. Job `Engine web - 2 jogadores e tiro (WS localhost)` no run 44661916212 — **success**. Não é teste humano nem deploy.
- [ ] Proprietário escolher a base após ver opções e experimentar gameplay; só então definir integração de backend persistente, WSS/TLS e isolamento.
- [ ] Executar playtest real entre duas pessoas pela internet e validar reconexão/segurança.
- [ ] Adaptar engine, UI e comportamento do jogo conforme testes, preservando atribuições de licenças.

**Estado factual:** não há multiplayer publicado no domínio ainda. Os jogos disponíveis no catálogo atual são laboratórios históricos, não o produto Hover Shot pronto.
