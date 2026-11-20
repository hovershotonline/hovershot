# Hover Shot — finalidade canônica vigente

**Decisão expressa do proprietário (19/11/2026):** o Hover Shot será um jogo de artilharia **100% online no navegador, em `hovershot.online`, multiplayer com amigos**, com código e backend sob controle do proprietário. **Nenhum cliente Windows, aplicativo ou instalador desktop.** Propostas anteriores de Windows/Godot e Hedgewars desktop foram rejeitadas. Este documento substitui os textos conflitantes anteriores.

## Estratégia de reaproveitamento

Priorizar a importação de uma implementação web **já jogável e com multiplayer** para evitar refazer física, turnos, terrenos, lobby e sincronismo. A experiência de combate será evoluída com mecânicas inspiradas no GunBound clássico (vento, potência, delay, tiro 1/2/SS, Thor), preservando ativos e identidade próprios e respeitando direitos de terceiros. Rembound foi testado e rejeitado como motor de combate fiel; ele permanece somente como referência.

**Primeiro candidato importado para auditoria:** [Hillshot](https://github.com/m-esm/hillshot) no SHA `4014612e9735b4e9c74dab94abcd941f2301630c` (MIT, servidor Node.js + ws autoritativo, cliente HTML5/Phaser, salas de até 8 jogadores, bots, física, terreno destrutível). Submódulo Git em `sources/engines/hillshot` preserva a versão integral por SHA sem duplicação. **Importação não equivale a publicação ou aprovação da fidelidade visual.** O Hillshot original possui armas genéricas e ainda não implementa os mobiles do GunBound.

## Resultado esperado

- Jogador abre `https://hovershot.online/` e entra no Hover Shot sem sair do domínio para acessar outros jogos.
- Cria sala de jogo, compartilha código com amigos e inicia partida em navegadores distintos, por internet.
- Combate 2D com mira, força, vento, terreno destrutível, HP, dano e turnos sincronizados, decisões validadas pelo servidor próprio.
- Depois de validar a partida, evoluir móveis com ataques distintos, delay e tiros complexos; até oito jogadores conforme capacidade real.
- Código e instalações versionados no GitHub; logs compactos, sem acúmulo de backups na Hostinger; assets próprios ou licenciados.

## Infraestrutura — restrição verificada

A [Hostinger informa](https://www.hostinger.com/support/hostinger-node-js-limits-for-web-and-cloud-plans/) que hospedagem Web/Cloud **não aceita WebSocket de entrada**, mesmo para Node.js. Logo, copiar o frontend à webroot **não cria multiplayer**. Solução a validar: frontend estático em `hovershot.online/play/`, backend WebSocket persistente sob controle do proprietário em VPS (com TLS, domínio controlado e autenticação), sem alterar outros sites. A implementação original do Hillshot conecta WebSocket em `location.host` e precisará de adaptação do endpoint antes de distribuir frontend e backend em servidores distintos.

## Estado e etapas

- [x] Confirmado objetivo somente navegador e domínio Hover Shot.
- [x] Licença MIT do Hillshot e licença CC0 de sprites Kenney conferidas; código multiplayer inspecionado.
- [ ] CI de integração: materializar o código fixado e testar duas conexões WebSocket criando sala e disparando.
- [ ] Verificar backend persistente, WSS/TLS e isolamento das rotas no domínio.
- [ ] Executar playtest real entre duas pessoas pela internet e validar reconexão/segurança.
- [ ] Adaptar engine, UI e comportamento do jogo conforme testes, preservando atribuições de licenças.

**Estado factual:** não há multiplayer publicado no domínio ainda. Os jogos disponíveis no catálogo atual são laboratórios históricos, não o produto Hover Shot pronto.
