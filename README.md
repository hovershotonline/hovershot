# Hover Shot — catálogo de jogos de artilharia
**Domínio:** https://hovershot.online/ · **Repositório:** https://github.com/hovershotonline/hovershot

**Objetivo atual:** comparar **versões originais** de projetos de artilharia existentes no navegador, antes de desenvolver/modificar o jogo próprio. A home oferece seis projetos distintos:

| Projeto | Experiência | Local de execução |
|---|---|---|
| **Rembound** | [Abrir demo do autor](https://gunbound.remcostoeten.nl/) | Externo, SpacetimeDB; disponibilidade ainda não confirmada |
| **Guntanks** | [Jogar original](https://masag0.github.io/Guntanks/) | GitHub Pages do autor |
| **Artillery P2P** | [Jogar original](https://lettfeti.github.io/artillery/) | GitHub Pages do autor; PeerJS externo |
| **Scorched Tanks** | [Abrir jogo original](https://whorn76.github.io/scorched-tanks/) | GitHub Pages do autor; disponibilidade ainda não confirmada |
| **Craterfall** | [/labs/craterfall/](https://hovershot.online/labs/craterfall/) | Versão MIT construída no Hover Shot |
| **OpenBound** | [Abrir repositório](https://github.com/WickedPeanuts/OpenBound) | Desktop .NET/MonoGame, **não é jogo de navegador** |

Cinco repositórios originais são **referenciados integralmente por submódulos Git congelados em SHA** em `sources/originals/`, com a lista em `.gitmodules`. A referência não redistribui os conteúdos dos autores; ninguém modificou seus jogos nesta fase. O Craterfall (MIT) foi importado em `labs/craterfall/` e já executado no site.

Para desenvolver: Node 22+, `npm install`, `npm test`, `npm run test:catalog` e `npm run build`. O build produz **somente** a home, assets próprios e Craterfall em `dist/`; GitHub Actions atualiza `site-build` após testes. A publicação na Hostinger segue [docs/DEPLOY.md](docs/DEPLOY.md) e não é automática.

**Não criar banco por projeto sem necessidade:** o MySQL já existente `u415074840_hovershot` está pronto para os próximos passos, mas os testes originais desta etapa não exigem novo banco.

## Documentação canônica
- [Acervo de projetos originais e licenças](docs/PROJETOS_ORIGINAIS.md)
- [Arquitetura dos laboratórios](docs/LABORATORIOS.md)
- [Situação real de deploy](docs/STATUS_IMPLANTACAO.md)
- [Roadmap](docs/ROADMAP.md)
- [Plano de publicação SSH](docs/DEPLOY.md)

**Produto de longo prazo:** combate online de 1v1 a 4v4, vários mobiles incluindo Aduka, tiros 1/2/SS, Dual, Thor, vento, terreno destrutível, ações determinísticas e backend econômico na Hostinger. Estes itens **não devem ser confundidos** com o estado das demos originais.
