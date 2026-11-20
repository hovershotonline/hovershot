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
