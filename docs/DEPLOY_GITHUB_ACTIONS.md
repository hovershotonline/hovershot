# GitHub Actions — deploy automatico do Hover Shot

**Configuração implementada em 20/11/2026. Estado:** pipeline de publicação por SSH configurado em `.github/workflows/ci.yml`; **o deploy real depende do segredo SSH do repositório e de execução bem-sucedida**, não de um botão no chat.

## Comportamento permanente

O workflow `Hover Shot - CI, Build e Deploy` começa em pushes para `main` que alterem código/configuração (pushes contendo apenas documentação Markdown em `docs/**` ou arquivos `*.md` não disparam recompilação desnecessária) ou em `workflow_dispatch`. Em pull requests executa testes, mas não publica. O processo é:

1. `build`: testes de combate e de catálogo, auditoria estática do script de deploy, geração da home e dos jogos instalados; artefato GitHub retenção de 7 dias.
2. `hillshot-multiplayer-qa`: verificação isolada de dois clientes WebSocket em localhost. **Não implica implantação do Hillshot**.
3. `preparar-publicacao`: espera os dois jobs anteriores e publica o build na branch `site-build` com marcador SHA do código de origem.
4. `deploy-hostinger`: só após o passo 3, verifica se há a chave SSH; se ausente, registra `DEPLOY=AGUARDANDO_CREDENCIAL_SSH`, **falha explicitamente no job de deploy** e não altera a hospedagem (evita status verde enganoso). Quando disponível, usa o script versionado `scripts/deploy-hostinger.sh` para publicar o **mesmo artefato testado**, sem depender do computador do proprietário.

O deploy é idempotente, valida SHA da `main` e da `site-build` para evitar reimplantar versões antigas, compara conteúdo antes de substituir, preserva arquivos não presentes no build (sem `rsync --delete`), mantém jogos anteriores e verifica os URLs públicos. Não implanta projetos externos sem licença apenas por constarem nos cards.

## Credencial necessária: uma configuração inicial

Cadastrar o segredo **`HOVERSHOT_DEPLOY_SSH_PRIVATE_KEY`** no repositório `hovershotonline/hovershot` em **Settings → Secrets and variables → Actions → New repository secret**.

O conteúdo é a **chave privada SSH apropriada para publicar na conta Hostinger**, não a pública `.pub`. Nunca colocar a chave no chat, no repositório, em artefatos, prints ou logs. O ChatGPT conectado ao GitHub não tem permissão de ler/criar segredos do Actions e, portanto, não pode preencher este valor.

Alternativa com GitHub CLI instalado e autenticado na conta com permissão de administração sobre o repositório, em PowerShell, **sem imprimir a chave**:

```powershell
clear
& {
    $ErrorActionPreference = "Stop"
    $key = Join-Path $HOME ".ssh\id_ed25519"
    if (-not (Test-Path -LiteralPath $key -PathType Leaf)) {
        throw "RESULTADO=CHAVE_PRIVADA_AUSENTE"
    }
    $gh = Get-Command gh -ErrorAction Stop
    Get-Content -LiteralPath $key -Raw |
        & $gh.Source secret set HOVERSHOT_DEPLOY_SSH_PRIVATE_KEY --repo hovershotonline/hovershot
    if ($LASTEXITCODE -ne 0) {
        throw "RESULTADO=FALHA_AO_CADASTRAR_SEGREDO"
    }
    Write-Output "RESULTADO=SEGREDO_SSH_CADASTRADO"
}
```

Se a chave existente estiver protegida por senha/passphrase, o runner não conseguirá usá-la em modo não interativo com a configuração atual; usar uma chave de automação adequada e com permissões mínimas. **Risco relevante:** reutilizar uma chave que dá SSH a toda a conta compartilhada pode permitir acesso a outros domínios se o segredo for comprometido. É preferível chave restrita a deploy deste projeto onde a Hostinger permitir, mantendo rotação e proteção do branch main. O fingerprint Ed25519 do Hostinger foi fixado no script: se mudar, o deploy falhará em vez de aceitar um host desconhecido.

## Publicação e segurança

- Destino único: `/home/u415074840/domains/hovershot.online/public_html`.
- Temporários e rollback no diretório já autorizado `/home/u415074840/domains/_backups_todos_sites/hovershot.online/.github-actions.*`, removidos ao final; **não guardar backups permanentes na Hostinger**.
- Autenticação SSH com fingerprint fixado: `SHA256:G2RdezrgBuMPq3bXfwulsyYLgfJ1j4L8qcRGJgEHW/M`.
- Nenhum `rsync --delete`, deploy somente de arquivos estáticos compilados; preserva `labs/guntanks/` e `labs/craterfall/` existentes.
- Se erro após mudanças, restaurar arquivos modificados e retirar arquivos novos introduzidos nessa tentativa. Nenhuma alteração de MySQL, `.env` ou outros domínios.
- As Actions usam `cancel-in-progress: false` para não interromper deploy em andamento; checks de SHA evitam que execução antiga sobrescreva nova.
- Após implementação, conferir `RESULTADO=GITHUB_ACTIONS_DEPLOY_VALIDADO` e `RESULTADO=HOVER_SHOT_DEPLOY_ONLINE`, não apenas status `success` de jobs de build.
- O workflow realiza **somente deploy do site estático**; não instala serviços persistentes WebSocket na Hostinger Cloud (que tem limites para conexões de entrada). Servidores multiplayer exigem fluxo de infraestrutura separado.

## Estado factual vs desejado

- **Implementado no GitHub:** workflow, script, preflight de segurança, staging temporário, restore em falha, testes estáticos.
- **Verificado em produção:** segredo SSH presente (conteúdo não acessível), GitHub Actions run [`44682622785`](https://github.com/hovershotonline/hovershot/actions/runs/44682622785), SHA `22800aa851c4819d52216a3c61981cc54b40ef29`, `build=success`, `hillshot-multiplayer-qa=success`, `preparar-publicacao=success`, `deploy-hostinger=success`. Logs incluíram `RESULTADO=HOVER_SHOT_DEPLOY_ONLINE`, `RESULTADO=GITHUB_ACTIONS_DEPLOY_VALIDADO`, HTTP OK para CSS/JS/Guntanks/Craterfall, `MYSQL=INALTERADO`, `OUTROS_DOMINIOS=INALTERADOS`, `BACKUP_PERMANENTE=NAO`. A verificação foi feita pela própria hospedagem através do script de publicação. O navegador do usuário ainda pode realizar QA visual do catálogo.
- A publicação manual anterior para Guntanks/Craterfall continua preservada; nenhum commit ou workflow deve apagar o acervo permanente.

**Decisão permanente:** catálogo de versões e link externo de cada jogo mantidos até segunda ordem. Ver [CATALOGO_PERMANENTE.md](CATALOGO_PERMANENTE.md).

## Primeiro deploy real verificado — 20/11/2026

A tentativa inicial da versão `76258050...` foi reexecutada depois de o proprietário cadastrar o segredo SSH; passou do gate de credencial e conectou à Hostinger, mas falhou no shell remoto em `done < <(find...)` por falta de `/dev/fd/63` no CageFS. No commit `22800aa...`, o script foi corrigido para usar lista NUL em arquivo temporário privado, e a execução Actions **44682622785 foi concluída com sucesso**. Os arquivos alterados no host foram `assets/home.css`, `assets/home.js`, `index.html` e `.hover-shot-source-commit`; os dois laboratórios existentes responderam HTTP 200. A branch principal continua sendo a fonte canônica, com deploy incremental e rollback temporário. **Regra permanente:** manter todos os jogos e os links externos no catálogo até nova orientação do proprietário.

**Validação final após otimização CI:** GitHub Actions run [`44682920694`](https://github.com/hovershotonline/hovershot/actions/runs/44682920694), SHA `ec7dd581ed910e3a8558aa922c1ddb388e54922c`, `conclusion=success` em todos os quatro jobs. Logs do deploy confirmaram `RESULTADO=HOVER_SHOT_DEPLOY_ONLINE`, `RESULTADO=GITHUB_ACTIONS_DEPLOY_VALIDADO`, `SOURCE_SHA=ec7dd581ed910e3a8558aa922c1ddb388e54922c`, HTTP OK de home, CSS/JS e dos dois laboratórios, e apenas `.hover-shot-source-commit` atualizado (assets inalterados, implantação idempotente). O workflow agora ignora pushes exclusivamente de documentação Markdown.
