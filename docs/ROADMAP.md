> **DEFINIÇÃO DE DEPLOY (20/11/2026):** o GitHub Actions agora possui job `deploy-hostinger`, após `build` + `hillshot-multiplayer-qa` + `preparar-publicacao`. O deploy automático só opera após cadastro do segredo SSH (não acessível ao conector GitHub do ChatGPT). Ação em `main` deve poder publicar o site sem comando PowerShell repetido. [Documentação](DEPLOY_GITHUB_ACTIONS.md).

## Entrega CI/CD — acompanhamento
- [x] Workflow automático e manual configurado na main, com publicação por SSH após QA.
- [x] Script de deploy incremental, validação de fingerprint, staging privado, rollback transitório e limpeza implementados no GitHub.
- [ ] CI validar sintaxe, testes de segurança e publicação do artefato, incluindo execução do job novo.
- [ ] Cadastrar uma única vez `HOVERSHOT_DEPLOY_SSH_PRIVATE_KEY` no GitHub Actions, sem divulgar a chave.
- [ ] Verificar primeiro deploy real por Actions (marcadores de sucesso, HTTP, Guntanks/Craterfall preservados).
- [ ] Manter deploy automático nas futuras alterações validadas, respeitando catálogo permanente.

---

> **DECISÃO DO PROPRIETÁRIO — 20/11/2026, ATÉ SEGUNDA ORDEM:** `hovershot.online` manterá **catálogo permanente de múltiplas versões**; a versão Hover Shot em desenvolvimento será uma opção da lista, mesmo após escolha do motor. Todos os cards têm link externo do original, inclusive quando a cópia está no site. Projetos sem licença ficam como links externos, não como cópias instaladas. Não remover catálogo em prol de uma única versão. Ver [CATALOGO_PERMANENTE.md](CATALOGO_PERMANENTE.md).

## Entrega imediata — home das versões
- [x] Registrar 13 versões em `site/catalog.json` com link externo obrigatório e classificação correta de hospedagem/licença.
- [x] Criar card fixo para Hover Shot em desenvolvimento, sem anunciar motor selecionado.
- [x] Adicionar duas ações independentes nos cards hospedados: `Jogar aqui` e `Abrir original`.
- [x] Criar busca, filtros, ficha técnica em modal e build estático a partir da fonte única.
- [x] CI do catálogo, testes de links e geração de `site-build` validados (Actions run 44672290910, success).
- [ ] **Publicar home incrementada na Hostinger** e verificar HTTP, contagem e links, preservando Guntanks, Craterfall, `.env` e MySQL.
- [ ] Criar e homologar ambientes realmente online para candidatos licenciados à medida que forem autorizados; não é requisito para manter link externo.
- [ ] Manter versões e histórico no site permanentemente até ordem contrária do usuário.

---

> **GATE PRIMÁRIO — homologação online, não localhost (19/11/2026):** o proprietário exigiu **importar candidatos para jogar no navegador sob Hover Shot com um backend online real**, inclusive com amigos em outras redes, ANTES de escolher. Um teste local ou CI não representa operação do servidor. Nenhuma base está selecionada. Implantar homologação **protegida e de acesso restrito**, respeitando as permissões de código/asset; sem licença, proteção por senha não cria autorização. Ver [HOMOLOGACAO_ONLINE.md](HOMOLOGACAO_ONLINE.md).

## Fase vigente — comparação real em servidor

- [x] Registrar plano de homologação com servidor real, WebSocket/TLS, sala e jogos com amigos.
- [ ] Identificar capacidade de servidor persistente para vários candidatos isolados e configurar acesso de testes no domínio.
- [ ] Montar e publicar primeiro candidato **licenciado** de ponta a ponta, sem alterar a produção existente.
- [ ] Testar com dois usuários de redes diferentes, reportando experiência visual e de jogo + indicadores de rede.
- [ ] Repetir para os candidatos permitidos; somente então receber a escolha do proprietário.
- [ ] Para projetos sem licença clara, obter permissão de avaliação/hosting ou esclarecer fundamento legal antes de copiar para servidor de terceiros.

---

> **RETIFICAÇÃO DE DECISÃO (19/11/2026):** O proprietário **não escolheu nenhum motor**. A importação técnica do Hillshot foi feita antecipadamente pelo assistente; o status correto é **candidato em avaliação**, nunca base aprovada. Não executar implantação, refatoração ou customização de Hillshot (ou outra engine) como motor do produto antes de decisão expressa. O objetivo confirmado permanece jogo **somente no navegador, em `hovershot.online`, multiplayer online com amigos**.

## Gate vigente — escolher a experiência e o motor antes da implementação

- [x] Registrar que Hillshot possui licença MIT e smoke WS local aprovado; candidato, não selecionado.
- [x] Registrar playtest Rembound que reprovou sua experiência de combate.
- [ ] Comparar candidatas quanto a jogabilidade real, fidelidade inspirada em GunBound, licenças de código/arte, multiplayer próprio, complexidade de operação e custo.
- [ ] Oferecer opções claras e oportunidades de teste sem confundir teste com aprovação.
- [ ] **Receber escolha explícita do proprietário** para adotar uma base, combinar componentes ou rejeitá-los.
- [ ] Só após aprovação adaptar frontend e backend para partida online própria em `hovershot.online`.

---

> **ESCOPO VIGENTE — 19/11/2026:** Hover Shot será **JOGO ONLINE SOMENTE NO NAVEGADOR, em `hovershot.online`**, não Windows. O usuário rejeitou clientes desktop. Primeiro importar uma base web funcional, depois colocar **frontend no domínio e backend multiplayer sob controle próprio**. O texto histórico abaixo não prevalece em caso de conflito. Ver [PRODUTO_CANONICO.md](PRODUTO_CANONICO.md).

## Entrega prioritária: partida web multiplayer

- [x] Corrigir requisitos: browser only, domínio Hover Shot, partida online com amigos.
- [x] Inspecionar Hillshot com cliente web + WebSocket autoritativo, MIT, assets Kenney CC0.
- [x] Importar código Hillshot via submódulo no GitHub e validar smoke WS de dois clientes na mesma sala + tiro. Job aprovado no Actions 44661916212, SHA 6d4b0b34957eb7d6383b88ad986620ffb5ca688b.
- [ ] **Após escolha do motor:** prover servidor WSS persistente próprio (Cloud Startup não aceita WS inbound), adaptando endpoint para domínio controlado.
- [ ] **Após escolha do motor e QA:** servir jogo em `https://hovershot.online/play/`, testando dois jogadores em redes distintas.
- [ ] Auditar segurança, reconexão, limites, cargas e retenção e comparar experiência de combate GunBound antes do refinamento.

---

> **DECISÃO PRIORITÁRIA DO PROPRIETÁRIO (19/11/2026):** objetivo é **ser dono do jogo Hover Shot e jogar online com amigos**, com **cliente Windows próprio** e servidor sob controle do proprietário, **não jogar GunBound em navegador** nem perseguir clones externos. A documentação obrigatória é [PRODUTO_CANONICO.md](PRODUTO_CANONICO.md). As listas antigas de importar/jogar em `/labs/`, avaliar DragonBound e GunBros são **histórico de pesquisa**, não prioridades ativas.

## Fase vigente — jogo próprio instalável e multiplayer real
- [x] Corrigir e registrar missão do projeto após manifestação explícita do proprietário.
- [ ] Auditar reaproveitamento permitido de código atual e decidir cliente/servidor (Godot 4 candidato, não decisão).
- [ ] Criar estrutura original do cliente Windows, servidor dedicado e protocolo com controle de versões.
- [ ] Implementar sala privada online 1v1 entre computadores distintos, sistema de turnos e sincronização autoritativa.
- [ ] Implementar cenário único com física/vento, terreno destrutível, efeitos de disparos e personagem **original** inspirado no gameplay clássico (Aduka/Thor como referência mecânica, não como asset copiado).
- [ ] Gerar executável Windows via GitHub Actions e operar servidor próprio isolado de outras hospedagens.
- [ ] Fazer playtest com dois usuários reais e documentar falhas/resultado; avançar para 2v2/8 jogadores somente após validação.

---

> **Histórico importado em 19/11/2026:** material do MEM-GPT-VIOLI. Para decisões atuais de laboratórios e estados de implementação, consulte `docs/LABORATORIOS.md` e `docs/STATUS_IMPLANTACAO.md`. Declarações antigas de que o repo não existe ou não tem permissão são anteriores à conexão da conta proprietária.

# Roadmap — Hover Shot

**Atualizado:** 2026-11-19. **Destino de produto:** [hovershotonline/hovershot](https://github.com/hovershotonline/hovershot). **Fonte provisória:** `MEM-GPT-VIOLI/projects/hover-shot/`, preservada até migração verificada. **Domínio Hostinger:** `hovershot.online`. Roadmap documental até existir admin real.

## Fase 1 — investigação teórica (documentação)
- [x] Definir finalidade: combate por turnos, até 8 jogadores, **Aduka obrigatório sem exclusividade**, sem economia/roupas no MVP.
- [x] Definir um evento autoritativo por jogada e estado compacto, sem registro de frames.
- [x] Pesquisar alternativas HTTP nativas e P2P/adaptações; selecionar ordem de teste.
- [x] Inventariar projetos open source, licenças e mecânicas.
- [x] Criar documentação de origem no MEM-GPT-VIOLI e rever documentos anteriores.
- [x] Identificar o repositório de produto `hovershotonline/hovershot` e o domínio `hovershot.online`.
- [x] Preparar workflow GitHub Actions de CI e promoção da branch `main` para `production` com controles de segurança (template e guia no MEM-GPT-VIOLI).
- [ ] Conceder acesso de escrita via integração GitHub do dono `hovershotonline` (na consulta atual, somente leitura).
- [ ] Importar os 10 arquivos para o repositório de produto, preferencialmente em `docs/`, com um README raiz próprio, e verificar SHA e conteúdo remoto. **Não executado ainda**.
- [ ] Criar `.github/workflows/hover-shot.yml` no repositório de produto com o [template](templates/.github/workflows/hover-shot.yml); confirmar execução no painel Actions.
- [ ] Verificar conta GitHub conectada no Cloud Startup antes de ativar integração Hostinger com `production`, para proteger demais projetos.
- [x] Identificar provas objetivas da Fase 2.
- [ ] Confirmar DNS, HTTPS e recursos atuais consumidos no Cloud Startup do domínio definido `hovershot.online`.
- [x] Executar [setup de banco/.env pela API Hostinger](DATABASE_SETUP.md) via SSH: API retornou `BANCO_API=CRIADO`, `.env` privado permissão 600, `MYSQL=OK`, `RESULTADO=HOVER_SHOT_MYSQL_PRONTO` (19/11/2026, saída real enviada pelo proprietário).

## Fase 2 — prova mínima orientada a eventos
- [ ] Começar por **uma versão visual jogável** reaproveitando mapa, HUD, física, efeitos, armas e mobiles existentes; garantir motor determinístico e incluir Aduka com tiros 1/2 sem eliminar outros veículos úteis.
- [ ] Testes de reprodutibilidade com seed/vento/Thor/terreno e hashes de estado.
- [ ] Deploy isolado de página estática + API HTTP e MySQL do próprio plano.
- [ ] Criar/entrar em sala; 1x1, disparar e obter mesmo resultado em ambos os navegadores.
- [ ] Validar `POST action` com idempotência, `GET changes` por versão e reconexão por snapshot.
- [ ] Timeout de turno, tratamento de abandono, ações concorrentes.
- [ ] Evoluir 2x2 e 4x4 (**8 pessoas**), inclusive celular em rede diferente.
- [ ] Medir consultas, CPU, memória, volume por tiro, p95 e carga da conta compartilhada.

## Fase 3 — transportes e UX incrementais
- [ ] Comparar polling adaptativo, ETag e diferenças de estado.
- [ ] Experimentar SSE e long-polling se houver benefício observável.
- [ ] Testar anfitrião no navegador + sinalização HTTP + WebRTC; fallback HTTP e migração de anfitrião quando fizer sentido.
- [ ] Validar layouts mobile/desktop, barra de força, ângulo e animações locais sem network tick.

## Fase 4 — Hover Shot: Aduka obrigatório, catálogo reaproveitado e acabamento
- [ ] Precisar Dual/T2/SS, progressão Thor, vento e danos (regras versionadas) para Aduka, e preservar mobiles/armas adicionais licenciados que já estiverem funcionais.
- [ ] Terreno destrutível, deslocamentos pontuais, efeitos e HUD.
- [ ] Criar/revisar conteúdo visual original e licenças.
- [ ] Robustez: sessão, replay compacto, expiração/limpeza, carga segura, rollback.

## Fase 5 — publicação
- [ ] Validar domínio, DNS, HTTPS, testes HTTP e recuperação.
- [ ] Auditoria de segurança, desempenho e direitos de conteúdo.
- [ ] Publicar no domínio reservado quando provas forem aprovadas.

## Critério de êxito principal
**Um comando de tiro validado gera um único evento, e até 8 navegadores obtêm o mesmo estado final, mesmo após recarregar a página.** O Cloud Startup só processa transições de turno e persistência, enquanto cada navegador reproduz animações.

## Marco atual: experiência original antes de adaptação — 19/11/2026

**Decisão do proprietário substitui a prioridade anterior** de desenvolver uma arena própria imediatamente. Primeiro comparar os projetos de terceiros em seu estado original. Ver [PROJETOS_ORIGINAIS.md](PROJETOS_ORIGINAIS.md).

- [x] Publicação inicial de Craterfall e home confirmada por HTTP 200 no SSH, após correção de permissões.
- [x] Registrar cinco repositórios completos por *submódulos Git* imutáveis por SHA, sem duplicação de fonte/assets no servidor.
- [x] Converter home em catálogo de seis jogos/projetos: Rembound, Guntanks, Artillery P2P, Scorched Tanks, Craterfall, OpenBound.
- [x] Abrir demos externas nos endereços dos autores, sem modificar os jogos; diferenciar desktop não executável.
- [ ] Validar CI de catálogo e branch `site-build` atualizado.
- [ ] Implantar a home atualizada via SSH Deploy seguro, com backup e sem `rsync --delete`.
- [ ] Coletar avaliação do usuário de cada demo e disponibilidade real dos links.
- [ ] Definir quais mecânicas do Rembound (Aduka, 11 mobiles, lobby) podem ser adaptadas ao Hostinger **sem SpacetimeDB**, com licenciamentos e custos documentados.
- [ ] Implementar multiplayer próprio só após escolha da base; não anunciar protótipos como projetos originais.

**Estado verificável:** fonte de referência importada por Gitlinks, jogos terceiros ainda rodam nos sites dos autores e não em `hovershot.online`; nenhuma nova base SQL foi provisionada.

## Correção de escopo: importar código realmente executável (19/11/2026)
- [x] Identificar que submódulos + links externos **não** eram importações jogáveis.
- [x] Empacotar Guntanks original via fonte SHA fixada: HTML, CSS, JS original e assets essenciais em `/labs/guntanks/`.
- [x] Preservar Craterfall, único jogo publicado e validado anteriormente.
- [x] Corrigir home para jogo local, sem links de demos de terceiros fingindo deploy.
- [x] Validar CI e build final com testes da home e do Guntanks: execução 44651506977 com dois jobs aprovados, SHA 22a5163.
- [x] Publicar `/labs/guntanks/` e atualizar home via SSH com backup e verificações HTTP 200 (log real de 20/11/2026, `HOVER_SHOT_GUNTANKS_PUBLICADO`).
- [ ] QA real no navegador: movimentação, ângulo, tiro 1/2/SS, terreno, turnos, áudio, console e telas mobile. HTTP 200 **não** equivale a jogabilidade aprovada.
- [ ] Planejar integração fiel do Rembound mantendo o original, retirando dependência obrigatória de SpacetimeDB antes de anunciar jogabilidade.
- [ ] Verificar licença ou solicitar autorização para redistribuir Artillery e Scorched Tanks; sem direitos não copiar ao nosso domínio.
- [ ] OpenBound: avaliar port browser com assets autorizados; não divulgar como executável antes da prova.

## Prioridade imediata — avaliação integral do Rembound (19/11/2026)

**Pedido atual do proprietário:** quer Rembound real, e não apenas Guntanks ou links para demos. Antes da adaptação do projeto, executar o cliente Next.js e o módulo SpacetimeDB **localmente** para poder explorar os 11 mobiles (incluindo Aduka), lobby, treino, salas e combate.

- [x] Conferir a fonte original `remcostoeten/Gunbound` no commit `3e807036f444d006d89050c3f89802ed082d9115`, licença MIT.
- [x] Auditar dependências do código: Bun + Next.js 15 + SpacetimeDB 2.2. O módulo atualmente é **TypeScript** em `server/spacetimedb/src/` (README com menção a Rust está desatualizado).
- [x] Documentar configuração local de websocket e publicação de módulo isolado; ver [REMBOUND_TESTE_LOCAL.md](REMBOUND_TESTE_LOCAL.md).
- [x] Validar instalação de Bun, SpacetimeDB 2.2, módulo `gunbound` e HTTP 200 após patch no Windows (log do proprietário de 20/11/2026).
- [ ] Executar QA no navegador com autenticação local, treino contra bot, Aduka, lobby e disparos.
- [ ] Somente depois avaliar publicação própria sob Hover Shot, respeitando componentes persistentes e direitos dos assets. `public_html` estático não executa o backend SpacetimeDB.

## Rembound — bug do projeto original identificado (20/11/2026)

- [x] Verificar Bun, SpacetimeDB local e módulo `gunbound` já instalados/publicados por log do usuário.
- [x] Comparar erro Next.js `Expected '}', got '<eof>'` com fonte original, confirmar `if (event.code === "KeyA")` duplicado nas linhas 106–109.
- [x] Versionar patch mínimo de duas linhas em `patches/rembound/0001-fix-keyup-duplicate.patch`.
- [x] Aplicar patch **somente na cópia local** com backup e validar `FRONTEND_HTTP=200`, `REMBOUND_FRONTEND_CORRIGIDO`.
- [ ] Verificar visual, autenticação, lobby, Aduka, tiros, bot, terreno e durabilidade do SpacetimeDB. Aviso de fsync com acesso negado foi visto nos logs do banco.

**Evidência recente (20/11/2026):** Rembound original já abre por HTTP 200 em `127.0.0.1:18763` após patch de duas linhas, usando backend ativo `127.0.0.1:18764`. **QA visual/funcional continua pendente**; não confundir HTTP 200 com partida validada. Ver `REMBOUND_TESTE_LOCAL.md`.

## Gate de fidelidade ao GunBound — feedback do usuário (19/11/2026)

**Teste do proprietário realizado:** Rembound abre e é utilizável, mas a experiência de combate **não foi considerada parecida com GunBound** além de nomes/sprites dos mobiles. Isso substitui qualquer suposição anterior de que "11 mobiles + lobby" significasse fidelidade.

- [x] Validar Rembound real no navegador e colher avaliação qualitativa do usuário.
- [x] Inspecionar a implementação de balística/tiros do commit original: `aduko.secondary=airSplit` (2 projéteis), física com vento/gravitacional próprios e delays aproximados; não confundir com Thor/Aduka do GunBound clássico.
- [x] Classificar motor de combate Rembound como **não aprovado pela experiência do usuário**; manter sistema/lobby como possível referência, não como decisão de adoção.
- [ ] Formular especificação canônica de gameplay GunBound clássico, com registro de diferença observável e critérios de aceitação por mobile/shot, começando por Aduka/Thor.
- [ ] Validar a física de tiro e vento, a curva de potência, danos/terreno e timing/turnos com casos reproduzíveis.
- [ ] Auditar viabilidade/licenças de bases alternativas antes de decidir reescrever motor ou importar outro que seja mais fiel.
- [ ] Somente após protótipo validado em laboratório, integrar a experiência aprovada no Hover Shot; **não** alterar produção automaticamente.

**Distinção de estado:** feedback foi **observado pelo usuário**; divergência no código `aduko` foi **verificada na fonte**; próximo motor/implementação são **propostas**, não funcionalidades prontas. Detalhes em `REMBOUND_TESTE_LOCAL.md`.

## Seleção de nova base de combate — 19/11/2026

Após playtest que reprovou a fidelidade do Rembound, foram pesquisados **DragonBound** (jogável no navegador; servidor 9 Aduka), **GunBound Classic** (cliente Windows comunitário), **GunBros** (fonte de engine própria; `aduka.s2=thorCall`, sandbox de desenvolvimento em `:5173/sandbox`, ainda sem teste funcional), **Season 2 HTML5** (anúncio de autor, demo não verificada), e **GunBound World Champion oficial** (pré-lançamento). Ver [ALTERNATIVAS_GUNBOUND.md](ALTERNATIVAS_GUNBOUND.md).

- [x] Pesquisar alternativas que ofereçam **mecânica Thor do Aduka**, não apenas sprite/nome.
- [x] Auditar código do GunBros versão `49cb4a8`: S2 chama Thor, SS gera três beams; repo sem LICENSE identificado.
- [ ] Playtest DragonBound no navegador e benchmarking qualitativo.
- [ ] Teste GunBros original no sandbox de desenvolvimento Windows isolado (não foi instalado).
- [ ] Decidir motor com critério de fidelidade e licenças antes de qualquer importação pública.
