> **MECANISMO ATUALIZADO (20/11/2026):** configurar **deploy automático por GitHub Actions SSH**, diretamente depois de build e QA. A instalação da credencial `HOVERSHOT_DEPLOY_SSH_PRIVATE_KEY` depende do proprietário; sem ela, job gera aviso e não altera servidor. Usar [DEPLOY_GITHUB_ACTIONS.md](DEPLOY_GITHUB_ACTIONS.md) como procedimento vigente. As instruções históricas de deploy PowerShell abaixo são fallback, não procedimento principal. O script preserva arquivos existentes e não acumula backups no host.

> **ATUALIZAÇÃO DE PUBLICAÇÃO (20/11/2026):** A home é um **catálogo permanente**. Para atualizar 13 versões **não substituir nem excluir** `/labs/guntanks/` ou `/labs/craterfall/`. Publicar apenas `index.html`, `assets/home.css`, `assets/home.js` e `.hover-shot-source-commit` da branch compilada `site-build`; validar SHA, URLs, links externos, HTTP, permissões e rollback. Scripts e temporários somente no caminho autorizado da Hostinger, apagar ao final. A branch `site-build` é um build, não uma publicação automática no host. Ver [CATALOGO_PERMANENTE.md](CATALOGO_PERMANENTE.md).

# Publicação segura — Hover Shot

**Verificado em 2026-11-19:** GitHub Actions concluiu com sucesso e gerou a branch pública `site-build` com home e LAB 01 compilados, **11 arquivos, ~1,58 MB**, sem arquivos sourcemap e com `labs/craterfall/LICENSE` (MIT). Workflow `.github/workflows/ci.yml` gera essa branch após testes e build. [Ver Actions](https://github.com/hovershotonline/hovershot/actions).

## Implantação na Hostinger — ainda pendente

**Domínio:** `hovershot.online` — diretório `/home/u415074840/domains/hovershot.online/public_html`. O `.env` está fora da pasta pública, em `/home/u415074840/domains/hovershot.online/.env`.

Não mudar conexão GitHub global do hPanel sem conferir os demais sites no plano compartilhado. Para aplicação estática, a operação ideal é publicar **somente** a branch `site-build` no site isolado, nunca o código-fonte da `main`. Pode ser por integração Git do hPanel compatível com esse domínio ou SSH Deploy pontual, após preflight.

### Pré-condições obrigatórias

1. Confirmar que o domínio e `public_html` existem e não são symlinks; usuário SSH correto.
2. Inventariar arquivos preexistentes no `public_html` **sem ler segredos**. Recusar substituição de instalação que não seja reconhecida como Hover Shot. Se houver landing page/default da Hostinger, avaliar antes de substituir.
3. Confirmar diretório autorizado de temporários e backups `/home/u415074840/domains/_backups_todos_sites/hovershot.online`, sem criar arquivos temporários em outros domínios.
4. Confirmar SHA da branch `site-build` e presença de `index.html`, `assets/home.css`, `labs/craterfall/index.html`, `labs/craterfall/LICENSE`. Conferir que o pacote não possui `.env`, token, `node_modules`, testes ou source.
5. Publicar apenas arquivos estáticos, usar atualização idempotente e rollback via commit anterior na branch do código, nunca arquivos privados.
6. Verificar status HTTP, carregamento de CSS/JS/Phaser e abertura do jogo em navegador desktop/mobile. Somente depois marcar o LAB 01 como **jogável online**.

## Observações operacionais

- **GitHub Actions não é o servidor do jogo.** O runtime de jogo ocorre nos navegadores; partidas online futuras usarão a infraestrutura própria Hostinger.
- A branch `site-build` muda automaticamente ao passar a CI, mas isso **não implica deploy Hostinger**. A sincronização com `public_html` precisa ser configurada separadamente.
- Para manter o armazenamento sob controle, o build de produção não inclui sourcemaps nem arquivos de código TypeScript; a licença MIT é preservada.
- Nenhum banco novo foi criado para o Craterfall local. O banco `u415074840_hovershot` existente permanece reservado ao backend futuro.

## Inventário remoto e estratégia aprovada para primeiro deploy — 2026-11-19

Saída real do SSH recebida do proprietário: `public_html` tem **somente `default.php` (42556 bytes, modo 644)**. Não contém `index.html`, `index.php`, `.htaccess`, `.well-known`, `.git` ou marcador do Hover Shot. `public_html` é modo 755; `.env` existe **fora** da webroot, modo 600. **Nenhuma alteração de arquivo ou banco ocorreu no inventário.** O deploy anterior parou com `INSTALACAO_PRESERVADA_REQUER_INVENTARIO`, antes de copiar arquivos.

O suporte oficial Hostinger descreve `default.php` como a página *Coming soon/You Are All Set to Go!*, geralmente único arquivo inicial: https://www.hostinger.com/support/5811527-the-website-shows-a-you-are-all-set-to-go-message/ . Ainda assim, **o próximo SSH Deploy verificará assinatura Hostinger e o estado exato de um só arquivo**; se não coincidir, parará sem substituição.

**Procedimento seguro:** baixar apenas a branch `site-build` para temporário privado autorizado sob `/home/u415074840/domains/_backups_todos_sites/hovershot.online/`; validar build, paths, licença, ausência de segredos e symlinks; criar backup único `default.php.original` antes de modificar a webroot; transferir apenas artefatos estáticos, sem `rsync --delete`, remover a página padrão depois de copiada; validar conteúdo e HTTP da home e LAB 01; em erro, remover apenas os diretórios/arquivos introduzidos e restaurar o `default.php` a partir do backup. Não alterar outros domínios ou o banco. **Deploy ainda pendente de execução pelo proprietário.**

## Falha HTTP 403 no primeiro deploy e correção proposta (19/11/2026)

O usuário executou o deploy. O build e backup do `default.php` passaram, o `rsync -a` copiou o site, mas `/ ` retornou HTTP 403 tanto pelo DNS público quanto pelo IP da origem. O rollback restaurou `default.php` e retirou os arquivos do Hover Shot. **O site não foi publicado.**

**Causa provável, ainda não verificada in loco**: a operação usou `umask 077` no `git clone`, gerando arquivos `600` e pastas `700`. Depois `rsync -a` preservou esses modos e possivelmente alterou o modo do próprio `public_html` para `700`. O rollback anterior não restaurou explicitamente o modo `755` do diretório `public_html`, portanto o 403 pode persistir após a reversão.

**Recuperação obrigatória:** validar que restou somente o `default.php` original com backup íntegro; corrigir apenas permissões do `public_html` para 755 e do `default.php` para 644; testar HTTP antes de qualquer nova publicação. Se persistir 403, parar para auditar roteamento e logs, sem alterar outros sites. Quando página original estiver legível, publicar `site-build` com `rsync -a --chmod=D755,F644`, verificar modos e URLs diretas (`/index.html`, CSS, JS e LAB01), só remover o `default.php` quando tudo funcionar e verificar a home `/`; rollback em falha, incluindo restaurar a permissão do diretório raiz. Não usar `--delete`.

**Status:** aguardando novo comando do usuário, sem deploy efetivo.

## Publicação incremental do catálogo de projetos originais (19/11/2026)

O deploy anterior **foi bem-sucedido**, segundo a saída do proprietário: HTTP 200 para `/index.html`, CSS, JS, `/labs/craterfall/index.html`, `/` e `/labs/craterfall/`, `RESULTADO=HOVER_SHOT_PUBLICADO_E_VALIDADO`; `public_html` foi corrigido para modo 755, arquivos 644, `.env` fora da webroot permaneceu privado. A instrução histórica "deploy pendente" acima refere-se à etapa *anterior* a essa evidência.

**Nova alteração:** home atualizada para seis projetos e cinco submódulos Git de fontes originais. O código do Craterfall não deve ser reinstalado. Requisitos do próximo deploy:
1. SSH somente para `/home/u415074840/domains/hovershot.online/public_html`; validar conta, diretório 755, `.env` privado 600 e marcador de origem `.hover-shot-source-commit` SHA40.
2. Clonar somente `site-build` em `/home/u415074840/domains/_backups_todos_sites/hovershot.online/.deploy-catalog.*` temporário privado, com lock `flock`. Validar seis nomes no HTML, CSS/JS e ausência de secrets.
3. Guardar cópias privadas **temporárias** dos quatro arquivos existentes: `index.html`, `assets/home.css`, `assets/home.js`, `.hover-shot-source-commit`.
4. Substituir **apenas** esses quatro arquivos por `install -m 644`, sem `rsync --delete` e sem alterar `labs/craterfall/` ou outros domínios.
5. Verificar HTTP público e, se necessário, origem, conteúdo Rembound/Guntanks, CSS, JS e caminho local do Craterfall. Rollback dos quatro arquivos se a origem não servir corretamente, registrando resultado.
6. Se o público mostrar conteúdo antigo mas a origem mostrar o novo, reportar cache/propagação; não apagar jogo nem banco. Limpar temporários após validação. Código/rollback durável continua no GitHub, não acumular backups operacionais.
7. **Não hospedar os cinco jogos externos**: navegação deve encaminhar à demo **original dos autores**, deixando claros links cujo funcionamento não foi verificado em tempo real. OpenBound abre repositório, não um jogo web inexistente.

**Estado:** instrução documentada; publicação incremental depende da execução SSH pelo proprietário e de evidência HTTP real.
