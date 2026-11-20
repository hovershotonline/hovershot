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
