> **CI/CD:** código aprovado em `main` pode gerar e publicar o site na Hostinger por GitHub Actions, após cadastro único do segredo SSH. O workflow verifica o build, o fingerprint, o destino e preserva as versões existentes. Veja [DEPLOY_GITHUB_ACTIONS.md](docs/DEPLOY_GITHUB_ACTIONS.md). Até confirmação de execução SSH, não declarar novo deploy online.

> **Homologacao futura:** [QA multiplayer remoto](docs/QA_MULTIPLAYER_REMOTO.md) prepara a checagem manual HTTPS/WSS, salas e disparos em um servidor externo isolado. **Nao existe ainda backend de multiplayer publicado**; nao confundir teste de localhost com jogo online.

# Hover Shot — catálogo permanente de jogos e versões

**Decisão do proprietário, válida até segunda ordem:** `https://hovershot.online/` deve **sempre** manter várias versões e referências disponíveis na home; o Hover Shot em desenvolvimento é **um dos cards**, não substitui o acervo. Todas as versões têm **link externo do original**, mesmo quando uma cópia local já está instalada. O proprietário escolherá qual base usar só após jogar e comparar. Esta regra prevalece sobre recomendações anteriores de site com jogo único.

O catálogo contém **13 versões/itens** a partir da fonte única [`site/catalog.json`](site/catalog.json), incluindo **2 laboratórios comprovadamente hospedados** (Guntanks e Craterfall); as demais são demos/repositórios externos ou candidatos ainda não publicados. Não afirmar que ter card significa ter motor instalado ou multiplayer no domínio.

**Política canônica:** [CATALOGO_PERMANENTE.md](docs/CATALOGO_PERMANENTE.md) · [Requisitos do produto](docs/PRODUTO_CANONICO.md) · [Roadmap](docs/ROADMAP.md).

# Hover Shot — multiplayer no navegador

**Objetivo vigente:** criar um jogo próprio que rode **somente no navegador**, acessível em **https://hovershot.online/**, com salas online para jogar com amigos. Sem instalador Windows e sem redirecionar usuários a jogos de terceiros.

**Candidato importado tecnicamente, NÃO escolhido pelo proprietário como motor do jogo:** [Hillshot](https://github.com/m-esm/hillshot), sob licença MIT, código-fonte de combate e servidor multiplayer WebSocket. Versão original fixada em `4014612e9735b4e9c74dab94abcd941f2301630c`, presente em `sources/engines/hillshot`. Arquivos de arte Kenney declarados CC0. A importação e o teste automatizado não constituem escolha do motor. A aprovação da experiência pelo proprietário está pendente.

[Definição canônica](docs/PRODUTO_CANONICO.md) · [**Homologação online antes da escolha**](docs/HOMOLOGACAO_ONLINE.md) · [Plano de importação](docs/IMPORTACAO_HILLSHOT.md) · [Roadmap](docs/ROADMAP.md)

**Status real:** o código do jogo candidato foi integrado por referência imutável ao GitHub; **não está online sob o Hover Shot**. Os laboratórios Guntanks/Craterfall são comparações históricas. O servidor de partidas não foi implantado. Não confundir CI, importação ou HTTP 200 com multiplayer publicado.

**Infraestrutura:** Hostinger Cloud não aceita conexões WebSocket de entrada nas apps gerenciadas. Para jogar via `hovershot.online`, manter a interface web no domínio e operar o WebSocket num servidor persistente próprio, com TLS e endpoint de domínio controlado, a verificar. Não alterar os outros projetos da Hostinger.
