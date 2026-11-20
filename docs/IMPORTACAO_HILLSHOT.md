# Hillshot: base web multiplayer importada para avaliação

**Fonte:** https://github.com/m-esm/hillshot · **SHA fixado:** `4014612e9735b4e9c74dab94abcd941f2301630c` · **Licença:** MIT, aviso do autor mantido no submódulo. Arte de tanques: Kenney CC0. Conferir a licença dos outros assets antes de redistribuir.

## Componentes originais

- `server/server.js`: servidor HTTP/WebSocket; cria sala de quatro caracteres, recebe jogadores, aplica turnos e transmite eventos; pode receber até oito jogadores.
- `server/game.js`: geração de terreno, vento, física dos disparos, dano/HP e cratera.
- `server/bot.js`: bots que simulam disparos.
- `public/`: navegador, sala/convite, Phaser 3, efeitos e controles.
- `package.json`: Node >=18, dependência `ws`, comando `npm start`.

**Importado para Git:** `sources/engines/hillshot` como submódulo. Ainda não executado no domínio. A decisão de escolher essa base foi por disponibilidade de implementação e licença, não por fidelidade visual a GunBound (o original possui seis armas genéricas e não Shot 1/2/SS por mobile).

## Integração e segurança

**Necessário antes de qualquer deploy:** teste automatizado de dois clientes WS locais; auditoria de entradas e limites de payload; proteção de endpoints; estratégia de reconexão; TLS/WSS, controle de origem e domínio; limitação de número de salas/conexões; retenção de telemetria; separação de sessões e versões; URL de websocket configurável, pois o original usa `location.host`; evitar servir diretórios de código-fonte ou logs na web.

A [restrição de WebSockets da Hostinger Cloud](https://www.hostinger.com/support/hostinger-node-js-limits-for-web-and-cloud-plans/) impede executar o backend na hospedagem atual como app Node gerenciada. Opção técnica é servidor persistente próprio e frontend em `https://hovershot.online/play/`, mantendo UX no mesmo domínio. Não modificar home/rotas atuais até provar WSS funcional e ter rollback. Sem servidor próprio online, nenhuma partida está disponível.
