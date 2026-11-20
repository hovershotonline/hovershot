# Teste integral do Rembound no Windows — laboratório local

**Pedido explícito:** usuário quer **Rembound**, com a experiência original de GunBound-like (11 mobiles, Aduka, lobby, bots, salas), **não links externos**. O objetivo de curto prazo é validar o projeto como o autor o implementou antes de criar qualquer fork ou alterar a jogabilidade.

## Fonte e licença verificadas
- Fonte: https://github.com/remcostoeten/Gunbound
- Commit pesquisado/fixado: `3e807036f444d006d89050c3f89802ed082d9115` (branch master, 2026-11-19).
- `LICENSE` raiz: MIT, copyright Remco Stoeten (2026); preservar aviso. A licença do repositório não determina necessariamente os direitos sobre imagens/mídias de GunBound original, que precisam ser verificados antes de republicação comercial.
- `README.md`: 11 mobiles (Armor, Knight, Dragon, Snow, Trico, Aduka, Mage, Nak, Turtle, Frog, A.Sate); lobby/amizades/convites, salas, treino contra bot, terreno e vento.

## Dependências reais — não confundir com jogo estático
- Frontend Next.js 15/React 19, executado por Bun >=1.2.
- Servidor de estado SpacetimeDB (módulo *atualmente TypeScript*: `server/spacetimedb/src/index.ts`, `schema.ts`; o README antigo diz Rust, mas não corresponde à implementação inspecionada).
- SpacetimeDB SDK no `package.json`: 2.2.x; fixar CLI 2.2.0 para o teste, quando instalável, em vez de usar último CLI com diferenças de API.
- O código do cliente lê `NEXT_PUBLIC_SPACETIMEDB_URI`, `NEXT_PUBLIC_SPACETIMEDB_MODULE` e `NEXT_PUBLIC_SPACETIMEDB_TARGET`; para teste apontar a `ws://127.0.0.1:18764`, banco local `gunbound`, frontend `http://127.0.0.1:18763/`.
- O README não fornece `docker-compose`; clonar frontend sozinho abriria telas sem backend jogável.
- `server/spacetime.json` está configurado para `maincloud`; usar `spacetime publish --no-config --server http://127.0.0.1:18764 --module-path server/spacetimedb` para garantir publicação local, nunca cloud sem autorização.

## Procedimento recomendado ao proprietário
1. Rodar **um único bloco PowerShell com `clear`**: conferir ferramentas Bun e SpacetimeDB, instalar pela documentação oficial se ausentes; baixar snapshot por commit sem ZIP manual; validar licença e estrutura; instalar dependências em raiz e módulo server; iniciar SpacetimeDB em loopback; publicar módulo local; criar `.env.local` sem segredos apontando ao banco local; iniciar Next em loopback; conferir HTTP e abrir navegador.
2. Os downloads são automáticos (Bun, CLI e dependências se faltarem) e **não** vão para Hostinger. Arquivos do laboratório em `%LOCALAPPDATA%/HoverShot/LaboratoriosPrivados/Rembound-<sha>`, com reuso se commit igual.
3. Restrição de rede: serviços só em `127.0.0.1`. O login/módulo de teste não usa MySQL do `hovershot.online` e não deve abrir portas públicas.
4. Processo completo (Bun e SpacetimeDB) só é marcado funcional após validar registros/login, lobby, mobile Aduka e disparo na interface; HTTP 200 sozinho comprova apenas entrega de HTML.
5. Não copiar para `public_html` até existir infraestrutura de processos adequada, isolamento de domínio, direitos dos assets e QA; não tentar simular Rembound com atalhos aos serviços do autor.

## Situação
- [x] Fonte, MIT, código atual e requisitos de infraestrutura auditados.
- [x] Estratégia de execução local sem alterar o produto em produção definida.
- [ ] PowerShell executado pelo proprietário.
- [ ] Banco local publicado e Next aberto com status OK.
- [ ] QA visual e funcional com Aduka, salas, bot e tiros.
- [ ] Estratégia de deploy próprio a definir (Hostinger Cloud Startup pode não suportar ambos os processos persistentemente no mesmo domínio).

## Diagnóstico confirmado por log do proprietário — 20/11/2026

O ambiente Windows **já tem** Bun 1.4.5, SpacetimeDB 2.2.0, repositório original, dependências, `.env.local` e banco `gunbound` publicado. `127.0.0.1:18763` é ocupado por processo `bun` (PID 1792 no momento da auditoria) e `127.0.0.1:18764` por `spacetimedb-standalone` (PID 18360). Requisições `/` retornam HTTP 500 e não devem ser tratadas como disponibilidade.

**Erro raiz verificado contra fonte do commit `3e807036f444d006d89050c3f89802ed082d9115`**: `src/features/game/hooks/use-input.ts`, linhas 106–109, contém dois inícios `if (event.code === "KeyA") {` consecutivos no `handleKeyUp`; a primeira chave não fecha. O Next relata `Expected '}', got '<eof>'` em linha 147. Patch mínimo versionado em [`patches/rembound/0001-fix-keyup-duplicate.patch`](../patches/rembound/0001-fix-keyup-duplicate.patch): retirar exatamente duas linhas duplicadas, sem alterar controles ou motor. A origem no submódulo permanece intocada; a correção é aplicada apenas na cópia de avaliação do Windows, após conferir texto exato e preservar backup local.

A mensagem `webpack.cache.PackFileCacheStrategy ENOENT` apareceu depois do erro de compilação — tratar como sintoma secundário, não apagar cache ou dados do SpacetimeDB sem evidência. Um aviso do banco sobre `failed to fsync ... os error 5` precisa ser acompanhado caso persista; **não afirmar que o banco é robusto para produção sem teste de durabilidade**. O relatório anterior também identificou ausência de `System32` no `PATH`, que impediu `taskkill.exe` na recuperação. A correção local não exige encerrar processos nem banco.

**Status:** causa exata auditada; patch registrado; execução no Windows e verificação de HTTP 200 ainda **pendentes**. Testar depois renderização e gameplay real, inclusive teclado, Aduka e login.
