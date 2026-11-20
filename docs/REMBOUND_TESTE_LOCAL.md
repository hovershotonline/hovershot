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
