# Hover Shot — evidências verificadas

**Data:** 19/11/2026

**GitHub:** repositório `hovershotonline/hovershot` inicializado e gravado via conta proprietária.

**Lab 01:** 91 arquivos da base Craterfall (MIT) importados do commit `0685b15ffa8fd305ad14d0b004add3dc65ae9a3b`; controles, física, testes e HUD na pasta `labs/craterfall/`. A base original oferece duelo local 2P, não multiplayer online.

**Home:** catálogo responsivo com 3 posições, filtro por estágio, botão de entrar apenas na base importada, modais de detalhes e caminhos estáveis. O link de entrada só será utilizável depois de construir/publicar os arquivos em `dist/`.

**CI:** workflow GitHub Actions criado; primeira falha Vitest diagnosticada e corrigida. **Testes e build aprovados**, branch `site-build` gerada com ~1,58 MB e licença MIT; artefato conferido no GitHub.

**Hostinger:** banco `u415074840_hovershot`, usuário `u415074840_hoverapp` e `.env` em `/home/u415074840/domains/hovershot.online/.env` chmod 600; conexão MySQL=OK verificada no log fornecido pelo proprietário. Não armazenar segredos no GitHub.

**Não realizado:** deploy de site no domínio, jogo remoto com 8 jogadores, Aduka, banco isolado para outros labs. Nenhum outro site da hospedagem foi alterado nesta etapa.

## Verificação adicional

Run GitHub Actions **44640749276**: `success`. Branch `site-build` verificada, com `index.html`, `labs/craterfall/index.html`, `labs/craterfall/LICENSE`, sem sourcemaps ou `.env`. O deploy na Hostinger **ainda não foi executado**.

## Inventário SSH de pré-deploy — 2026-11-19

O proprietário executou auditoria somente leitura: `PUBLIC_HTML=VALIDADO`, modo `755`; `default.php=ARQUIVO`, **42556 bytes**, modo `644`; `index.html`, `index.php`, `.htaccess`, `.well-known`, `.git` e `.hover-shot-source-commit` ausentes. `ENV_PRIVADO=EXISTE`, modo `600`, `ENV_NA_WEBROOT=NAO`. `RESULTADO=INVENTARIO_CONCLUIDO`. O primeiro deploy **não rodou**, pois se recusou a sobrescrever conteúdo existente. A documentação oficial Hostinger descreve esse `default.php` como página inicial; próximo passo é backup+implantação segura com rollback.

## Catálogo das versões originais — 19/11/2026

**Pedido do proprietário:** testar e conhecer os projetos originais como estão, antes de desenvolver novos protótipos. A home anterior só continha Craterfall e dois cartões fictícios de roadmap; insuficiente.

**Commit de implementação:** registros de cinco submódulos em `sources/originals/` apontando a commits da origem, sem transferir seus arquivos à hospedagem. Home atualizada com seis opções, incluindo quatro links diretos para jogos externos (Rembound, Guntanks, Artillery P2P, Scorched Tanks), um jogo local (Craterfall) e um projeto desktop não jogável em browser (OpenBound). `scripts/build.mjs` preparado para publicar somente a home aprovada e Craterfall, sem o experimento customizado de Arena. Testes do catálogo adicionados ao GitHub Actions.

**Evidência real do deploy anterior:** log do proprietário confirmou `HTTP_INDEX=200`, `HTTP_CSS=200`, `HTTP_JS=200`, `HTTP_LAB01=200`, `HTTP_HOME=200`, `HTTP_JOGO=200`, `RESULTADO=HOVER_SHOT_PUBLICADO_E_VALIDADO` na Hostinger, com `public_html` 755 e `.env` privado preservado. O catálogo de seis opções, por sua vez, **ainda não foi publicado no domínio nesta operação**. Ver [PROJETOS_ORIGINAIS.md](PROJETOS_ORIGINAIS.md).

**Observação de disponibilidade:** as páginas do Guntanks e Artillery P2P foram consultadas no navegador de pesquisa; o acesso em tempo real às demos Rembound e Scorched Tanks não pôde ser confirmado por esse meio. Não prometer que estão online a todo momento.

## Correção de objetivo após reclamação do proprietário — 2026-11-19

**Erro da versão anterior:** home continha links externos dos autores, em vez de cópias executáveis no próprio domínio. O proprietário rejeitou esse comportamento. `main` foi alterada para permitir botão jogar somente em `/labs/guntanks/` e `/labs/craterfall/`; as outras bases permanecem no catálogo, mas sem botão falso de jogo. **Guntanks original foi empacotado a partir do submódulo versionado**, com HTML, CSS, JS bundle e nove assets de runtime. Foi identificado build Guntanks bem-sucedido no Actions (run 44651072472); publicar no servidor ainda pendente. Artillery e Scorched sem licença explícita, OpenBound desktop, Rembound com backend SpacetimeDB. Ver `IMPORTACAO_LOCAL.md`.

## Deploy efetivo do Guntanks original — 2026-11-20 (horário de Brasília)

**EVIDÊNCIA DE EXECUÇÃO REAL:** log PowerShell/SSH enviado pelo proprietário (`Texto colado(20261120-011654).txt`). Confirmados `BUILD_SOURCE_SHA=22a5163521f0da3d933a89429dffffdcf6466c62`, `GUNTANKS_ORIGINAL=INCLUIDO`, `BACKUP_HOME=VALIDADO`, `GUNTANKS=INSTALADO`, `HOME=ATUALIZADA` e `CRATERFALL=INALTERADO`.

As verificações HTTP no domínio `hovershot.online` retornaram **200** para home, `/labs/guntanks/index.html`, JavaScript do Guntanks, CSS do Guntanks e `/labs/craterfall/index.html`, cada qual com marcador de conteúdo identificado (`VALIDACAO_*=PUBLICO_OK`). Final do SSH: `RESULTADO=HOVER_SHOT_GUNTANKS_PUBLICADO` e `SSH_EXECUCAO=CONCLUIDA`. O script registrou `ENV_PRIVADO=INALTERADO`, `BANCO_MYSQL=INALTERADO`, `OUTROS_DOMINIOS=INALTERADOS`.

**Estado:** dois laboratórios com arquivos reais instalados no mesmo domínio. **Ainda falta QA visual e funcional** em navegador de usuário (renderização de imagens/terreno, movimento, tiros 1/2/SS, áudio, troca de turnos e reinício), pois o log HTTP 200 não executa JavaScript. Não afirmar que jogabilidade está validada. Não confundir os demais quatro projetos apenas referenciados por submódulos com jogos hospedados.
