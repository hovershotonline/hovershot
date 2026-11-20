# GitHub Actions — deploy automatico do Hover Shot

**Configuração implementada em 20/11/2026. Estado:** pipeline de publicação por SSH configurado em `.github/workflows/ci.yml`; **o deploy real depende do segredo SSH do repositório e de execução bem-sucedida**, não de um botão no chat.

## Comportamento permanente

O workflow `Hover Shot - CI, Build e Deploy` começa em cada push para `main` ou em `workflow_dispatch`. Em pull requests executa testes, mas não publica. O processo é:

1. `build`: testes de combate e de catálogo, auditoria estática do script de deploy, geração da home e dos jogos instalados; artefato GitHub retenção de 7 dias.
2. `hillshot-multiplayer-qa`: verificação isolada de dois clientes WebSocket em localhost. **Não implica implantação do Hillshot**.
3. `preparar-publicacao`: espera os dois jobs anteriores e publica o build na branch `site-build` com marcador SHA do código de origem.
4. `deploy-hostinger`: só após o passo 3, verifica se há a chave SSH; se ausente, registra `DEPLOY=AGUARDANDO_CREDENCIAL_SSH` e aviso no Actions sem alterar a hospedagem. Quando disponível, usa o script versionado `scripts/deploy-hostinger.sh` para publicar o **mesmo artefato testado**, sem depender do computador do proprietário.

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
- **Pendente de verificação real:** segredo GitHub configurado e prova de deploy SSH para `https://hovershot.online/`, incluindo estado de conexão, HTTP e ausência de efeitos colaterais.
- A publicação manual anterior para Guntanks/Craterfall continua preservada; nenhum commit ou workflow deve apagar o acervo permanente.

**Decisão permanente:** catálogo de versões e link externo de cada jogo mantidos até segunda ordem. Ver [CATALOGO_PERMANENTE.md](CATALOGO_PERMANENTE.md).
