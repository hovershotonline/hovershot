# Hover Shot — multiplayer no navegador

**Objetivo vigente:** criar um jogo próprio que rode **somente no navegador**, acessível em **https://hovershot.online/**, com salas online para jogar com amigos. Sem instalador Windows e sem redirecionar usuários a jogos de terceiros.

**Base inicial escolhida para importação e testes:** [Hillshot](https://github.com/m-esm/hillshot), sob licença MIT, código-fonte de combate e servidor multiplayer WebSocket. Versão original fixada em `4014612e9735b4e9c74dab94abcd941f2301630c`, presente em `sources/engines/hillshot`. Arquivos de arte Kenney declarados CC0. A escolha técnica não aprova a fidelidade do gameplay GunBound: ainda são necessários testes.

[Definição canônica](docs/PRODUTO_CANONICO.md) · [Plano de importação](docs/IMPORTACAO_HILLSHOT.md) · [Roadmap](docs/ROADMAP.md)

**Status real:** o código do jogo candidato foi integrado por referência imutável ao GitHub; **não está online sob o Hover Shot**. Os laboratórios Guntanks/Craterfall são comparações históricas. O servidor de partidas não foi implantado. Não confundir CI, importação ou HTTP 200 com multiplayer publicado.

**Infraestrutura:** Hostinger Cloud não aceita conexões WebSocket de entrada nas apps gerenciadas. Para jogar via `hovershot.online`, manter a interface web no domínio e operar o WebSocket num servidor persistente próprio, com TLS e endpoint de domínio controlado, a verificar. Não alterar os outros projetos da Hostinger.
