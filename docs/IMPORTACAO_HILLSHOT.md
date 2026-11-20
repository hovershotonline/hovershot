> **IMPORTANTE:** teste CI localhost **não é homologação online**. A avaliação do proprietário deve usar servidor WebSocket real, HTTPS, dois jogadores em redes diferentes e frontend em domínio Hover Shot. Hillshot continua **candidato não escolhido**. [Plano de homologação](HOMOLOGACAO_ONLINE.md).

> **ESTADO DE DECISÃO (19/11/2026):** Hillshot é um **candidato não aprovado**. Não promover, adaptar ou instalar em produção como jogo Hover Shot sem o proprietário escolher a base. CI confirma apenas funcionamento técnico em localhost.

# Hillshot: base web multiplayer importada para avaliação

**Fonte:** https://github.com/m-esm/hillshot · **SHA fixado:** `4014612e9735b4e9c74dab94abcd941f2301630c` · **Licença:** MIT, aviso do autor mantido no submódulo. Arte de tanques: Kenney CC0. Conferir a licença dos outros assets antes de redistribuir.

## Componentes originais

- `server/server.js`: servidor HTTP/WebSocket; cria sala de quatro caracteres, recebe jogadores, aplica turnos e transmite eventos; pode receber até oito jogadores.
- `server/game.js`: geração de terreno, vento, física dos disparos, dano/HP e cratera.
- `server/bot.js`: bots que simulam disparos.
- `public/`: navegador, sala/convite, Phaser 3, efeitos e controles.
- `package.json`: Node >=18, dependência `ws`, comando `npm start`.

**Importado para Git como CANDIDATO, não base escolhida:** `sources/engines/hillshot` como submódulo. Ainda não executado no domínio. O usuário não selecionou o Hillshot: a importação ocorreu por iniciativa do assistente para avaliação, não como aprovação do proprietário. O original possui seis armas genéricas e não Shot 1/2/SS por mobile.

## Integração e segurança

**Necessário antes de qualquer deploy:** teste automatizado de dois clientes WS locais; auditoria de entradas e limites de payload; proteção de endpoints; estratégia de reconexão; TLS/WSS, controle de origem e domínio; limitação de número de salas/conexões; retenção de telemetria; separação de sessões e versões; URL de websocket configurável, pois o original usa `location.host`; evitar servir diretórios de código-fonte ou logs na web.

A [restrição de WebSockets da Hostinger Cloud](https://www.hostinger.com/support/hostinger-node-js-limits-for-web-and-cloud-plans/) impede executar o backend na hospedagem atual como app Node gerenciada. Opção técnica é servidor persistente próprio e frontend em `https://hovershot.online/play/`, mantendo UX no mesmo domínio. Não modificar home/rotas atuais até provar WSS funcional e ter rollback. Sem servidor próprio online, nenhuma partida está disponível.

## Integração confirmada no GitHub — 19/11/2026

- Submódulo Git `sources/engines/hillshot` fixado em `4014612e9735b4e9c74dab94abcd941f2301630c` e verificado na pipeline.
- `scripts/qa-hillshot.cjs` é executado por job dedicado `hillshot-multiplayer-qa` do `.github/workflows/ci.yml`. Instala dependências Node de produção, verifica a sintaxe do servidor e simula criação/junção/início de sala e tiro replicado a dois clientes WebSocket localhost.
- **Evidência verificada:** job `Engine web - 2 jogadores e tiro (WS localhost)` concluído com **success** no run `44661916212` (SHA `6d4b0b34957eb7d6383b88ad986620ffb5ca688b`). Isso valida **comunicação e evento de tiro**, não valida renderização em dois browsers nem internet.
- **Pendente:** inspeção de segurança de protocolo (limites de payload/salas, reconexão, abuso, origem), adaptação do WebSocket de `location.host` para WSS próprio, construção do frontend sob rota `/play/`, autorização/configuração de backend com TLS, deploy com rollback e teste de gameplay externo. Não declarar `hovershot.online/play/` operacional antes do conjunto completo.
