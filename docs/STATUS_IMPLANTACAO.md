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

## Rembound no Windows: patch aplicado e HTTP 200 — 20/11/2026

**Log de execução fornecido pelo proprietário:** `ERRO_ORIGINAL=CONFIRMADO`, `BACKUP=VALIDADO`, `PATCH=APLICADO`, `LINHAS_DUPLICADAS_REMOVIDAS=2`, `SPACETIMEDB=ATIVO`, `FRONTEND=REUTILIZANDO_PROCESSO_EXISTENTE`, `FRONTEND_HTTP=200`, `RESULTADO=REMBOUND_FRONTEND_CORRIGIDO`. O frontend local é `http://127.0.0.1:18763/`, o SpacetimeDB local está na porta `18764`. `SPACETIMEDB_DADOS=INALTERADOS` e `HOSTINGER=INALTERADA` foram impressos pelo script. **Não foi feito deploy de Rembound em hovershot.online.**

A origem do erro era a duplicação do `if (event.code === "KeyA")` no hook `use-input.ts` do commit original; o patch salvo em `patches/rembound/0001-fix-keyup-duplicate.patch` foi aplicado apenas à cópia local, com backup. **HTTP 200 demonstra entrega da página, não garante** compilação de todos os módulos dinâmicos, conexão no navegador, autenticação funcional nem partida. Próxima validação: acesso real ao lobby, registro com senha exclusiva de teste, seleção do Aduka, prática com bot e disparos/vento/terreno/turnos, conferindo console do navegador e conexão websocket ao SpacetimeDB. Acompanhamento do aviso anterior `failed to fsync ... Acesso negado` também permanece pendente antes de uso persistente. Não alterar banco nem implantar fora de laboratório até aprovação da experiência.

## Resultado do playtest Rembound — 19/11/2026

Proprietário confirmou que experimentou o Rembound, com percepção de que o sistema foi recriado, mas a experiência central do combate difere do GunBound e se parece com ele principalmente pelos nomes/sprites dos mobiles. **Status de produto: motor de combate não aceito como base fiel.** Repositório original e laboratório local continuam preservados. Inspeção de fonte `projectile-behaviors.ts` identificou `aduko` secundário como `airSplit` com dois projéteis, em vez de especificação explícita do efeito Thor clássico; outros parâmetros de física são escolhas próprias do autor. A avaliação não altera os dois jogos já publicados no domínio. Pendências: benchmark real do GunBound clássico e decisão sobre base/motor com testes de fidelidade. Ver `REMBOUND_TESTE_LOCAL.md`.

## Base web para Hover Shot online — 19/11/2026

**Nova decisão explícita:** somente browser, no domínio `hovershot.online`, multiplayer real com amigos; cliente Windows rejeitado. Hillshot (MIT) foi importado como submódulo em `sources/engines/hillshot`, SHA `4014612e9735b4e9c74dab94abcd941f2301630c`. Smoke GitHub Actions no commit `6d4b0b34957eb7d6383b88ad986620ffb5ca688b`, run `44661916212`, job específico **success**: dois WebSockets locais, sala, start, tiro replicado. **Servidor online não implantado.** Hospedagem Hostinger Cloud não suporta WebSocket inbound, assim será necessário backend persistente externo ao plano Cloud com WSS em domínio controlado. Site atual não foi modificado por esta importação. Detalhes em [IMPORTACAO_HILLSHOT.md](IMPORTACAO_HILLSHOT.md).

## Catálogo permanente ampliado — desenvolvimento de 20/11/2026

**Solicitação explícita:** manter várias versões no site indefinidamente, inclusive a versão Hover Shot em desenvolvimento como uma opção. Toda versão tem link externo do original para comparação, mesmo que esteja instalada. Projetos sem licença identificada permanecem acessíveis via link externo, sem cópia no domínio. O proprietário não escolheu motor definitivo. Registro em `docs/CATALOGO_PERMANENTE.md` e `site/catalog.json`.

Implementação de código: galeria com **13 opções**, busca/filtros e modais de tecnologia/licença, HTML gerado estaticamente de catálogo JSON, testes que exigem todos os links e limitam as instalações marcadas a **Guntanks e Craterfall**. Originais externos são abertos em nova aba. **Esta seção registra código versionado; não é prova de deploy Hostinger.** CI/branch `site-build` e publicação devem ter evidências separadas; arquivos públicos do servidor não foram alterados por operação GitHub.

**CI validado — 20/11/2026:** GitHub Actions run `44672290910` finalizou `success` para `e17f249bc4df2c9e54823f82113b2aa1e0ce7964`: testes do catálogo com 13 cards, 13 links externos, apenas dois links locais, build e promoção para `site-build`; job Hillshot de dois clientes WS localhost também passou. **Não houve deploy automático da Hostinger**; a publicação pública ainda depende da sincronização SSH e verificação HTTP.

## Configuração de deploy via GitHub Actions — 20/11/2026

Novo pedido explícito: o assistente deve poder publicar alterações sem pedir PowerShell a cada intervenção. Foi implementado job `deploy-hostinger` com `needs: preparar-publicacao`, condicionamento a push/dispatch em `main`, segredo `HOVERSHOT_DEPLOY_SSH_PRIVATE_KEY`, preflight SSH/fingerprint, staging isolado temporário, atualização incremental de assets estáticos, rollback em falha e prova HTTP, preservando `/labs/`, MySQL e outros domínios. **Credencial SSH ainda não verificada no Actions**; sem ela, o job deve registrar `DEPLOY=AGUARDANDO_CREDENCIAL_SSH` e não executar SSH. Ver `docs/DEPLOY_GITHUB_ACTIONS.md`. Nenhuma implantação real deve ser inferida só da alteração do workflow.

**Evidência do primeiro workflow com deploy (20/11/2026):** run GitHub Actions `44675578673`, commit `740ee792e3b5896390848d773a94b358c8ddb9db`: `build=success`, `hillshot-multiplayer-qa=success`, `preparar-publicacao=success`. Job `deploy-hostinger` concluiu como `success` apenas porque havia um gate de segredo que **ignorou** a etapa `Publicar somente arquivos compilados na Hostinger` (`conclusion=skipped`). **Nenhum SSH ocorreu.** O gate foi posteriormente alterado para **falhar explicitamente se faltar segredo**; assim não há resultado verde enganoso. Credencial ainda pendente de configuração pelo proprietário.

## Primeiro deploy GitHub Actions após instalação da chave — 20/11/2026

O proprietário cadastrou `HOVERSHOT_DEPLOY_SSH_PRIVATE_KEY`. O assistente reexecutou exclusivamente o job de deploy na tentativa 2 do run `44675812163` com resultado **falha** em `Publicar somente arquivos compilados na Hostinger`; a etapa de verificação do segredo passou, confirmando sua presença no runner. Logs apontaram `bash: line 73: /dev/fd/63: No such file or directory`, no `while ... done < <(find...)` do shell remoto, incompatível com o ambiente CageFS da Hostinger. Correção: gerar lista NUL em arquivo sob diretório temporário autorizado e consumir por redirecionamento de arquivo normal, mantendo variáveis/rollback no shell atual; teste de regressão no pipeline. **Não há evidência de nova versão do catálogo online nesta tentativa.** O fix será validado na execução posterior e só então se deve marcar publicação como realizada.
