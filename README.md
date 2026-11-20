# Hover Shot — jogos de artilharia instalados no próprio domínio

**Domínio:** https://hovershot.online/ · **GitHub:** https://github.com/hovershotonline/hovershot

O proprietário determinou que **jogar** significa abrir arquivos reais do projeto no domínio `hovershot.online` — **não** atalhos para o jogo dos autores. A home identifica claramente o que está hospedado e o que ainda não pode ser executado localmente.

| Projeto | Rota local | Estado técnico |
|---|---|---|
| **Guntanks** | `/labs/guntanks/` | Importado e compilado com gameplay, bundle e assets originais necessários, fonte `masag0/Guntanks` no commit `072c2312abec19089149c211751ffec7311d69d4`. Publicação remota a validar. |
| **Craterfall** | `/labs/craterfall/` | Importado integralmente sob MIT; site anterior confirmado com HTTP 200 pelo proprietário. |
| Rembound | — | Fonte preservada em submódulo, licença MIT. Precisa de Next.js + SpacetimeDB; **não jogável apenas com arquivos estáticos**. |
| Artillery P2P | — | Fonte preservada por submódulo, **licença de redistribuição não identificada**. Não copiar para webroot sem autorização. |
| Scorched Tanks | — | Fonte preservada por submódulo, **licença de redistribuição não identificada**. Não copiar para webroot sem autorização. |
| OpenBound | — | Projeto em C#/MonoGame com servidores separados e pacote gráfico ausente; **não é um cliente web**. |

## Guntanks instalado do código do autor
- `sources/originals/guntanks`: submódulo **congelado em commit** que permite materializar a fonte integral do autor.
- `scripts/package-guntanks.mjs`: importa `index.html`, `styles.css`, bundle JavaScript já compilado e os **nove recursos de runtime** utilizados pelo jogo.
- Artefatos publicados em `dist/labs/guntanks/`, sem source maps; apenas link de retorno ao Hover Shot foi acrescentado ao HTML.
- Removidos do pacote arquivos não necessários: imagens explicitamente nomeadas `gunbound_icons`, screenshots, arquivos PSD, fontes originais redundantes, `bundle.js.map` e dependências Node de build antigas.
- O `package.json` original declara licença `ISC`; **não há LICENSE separado** no repositório; antes de reutilizar assets para um produto derivado, confirmar autoria/licenciamento de cada recurso. Nesta fase são itens de runtime do jogo de referência, não elementos oficiais de GunBound.

## Build e publicação
Requer Node.js 22+, `git submodule update --init --depth 1 sources/originals/guntanks`, `npm install`, `npm run test:catalog`, `npm test`, `npm run build`. O GitHub Actions materializa somente esse submódulo durante o build. O build é estático: `dist/index.html`, `dist/labs/guntanks/index.html`, `dist/labs/craterfall/index.html`. `site-build` contém o pacote para a Hostinger; publicar via SSH com preflight, modo 755/644, backup e rollback.

O banco MySQL da Hostinger não é utilizado por esses jogos locais. Não copiar `.env` nem chaves à webroot. Não alterar outros domínios da hospedagem.

Documentação canônica: [LABORATORIOS.md](docs/LABORATORIOS.md), [PROJETOS_ORIGINAIS.md](docs/PROJETOS_ORIGINAIS.md), [STATUS_IMPLANTACAO.md](docs/STATUS_IMPLANTACAO.md), [DEPLOY.md](docs/DEPLOY.md), [ROADMAP.md](docs/ROADMAP.md).
