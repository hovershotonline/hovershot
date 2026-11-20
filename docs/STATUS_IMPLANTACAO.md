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
