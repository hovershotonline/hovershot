> **Histórico importado em 19/11/2026:** material do MEM-GPT-VIOLI. Para decisões atuais de laboratórios e estados de implementação, consulte `docs/LABORATORIOS.md` e `docs/STATUS_IMPLANTACAO.md`. Declarações antigas de que o repo não existe ou não tem permissão são anteriores à conexão da conta proprietária.

# Hover Shot — matriz prática: soluções possíveis e experimentos para Cloud Startup

**Revisão:** 2026-11-19. **Só opções acionáveis** para um jogo de artilharia com **Aduka obrigatório, mas catálogo aberto a outros mobiles**, até 8 participantes por turnos, sem despesa adicional. A viabilidade da execução real ainda exige experimentos no plano.

**A = implementação direta com recursos existentes**, **B = adaptação técnica a testar**, **C = alternativa condicional com prova específica**.

| ID | Solução que podemos construir | Tipo | Teste necessário | Prioridade |
|---|---|---|---|---|
| H01 | HTML5/Phaser + API **PHP** + MySQL, um comando por jogada | A | Sala 8 pessoas, lock e resultado consistente | 1 (alternativa) |
| H02 | HTML5/Phaser + API **Node.js HTTP** + MySQL, um comando por jogada | A | Implantação isolada no domínio e consumo real | **1 (principal)** |
| H03 | Polling `GET /events?after=version` de 2–5 s adaptável | A | p95 de percepção do turno vs requests/sala | **1** |
| H04 | Eventos delta e snapshot do estado por turno | A | Reconexão em celulares e 100/100 replays idênticos | **1** |
| H05 | `ETag`/304 quando versão não mudou, payload compacto | A | Testar cache intermediário, bytes e queries | 2 |
| H06 | Timeouts por `deadline_at` e transição oportunista | A | Expiração concorrente em 8 navegadores | **1** |
| H07 | Dois disparos de Dual/T2 como **uma ação atômica** | B | Comparar efeito Thor/dano e custo CPU/DB | **1** |
| H08 | Cliente anfitrião simula o tiro, Cloud Startup é caixa postal HTTPS | B | Desconexão do host, integridade, atraso adicional | 3 |
| H09 | WebRTC DataChannel para enviar eventos de tiro host->demais | B | LAN e redes diferentes; medir latência/sucesso | 3 |
| H10 | Sinalização ICE/SDP via endpoints HTTP na Hostinger | B | 8 navegadores, descoberta de candidatos, renovação | 3 |
| H11 | STUN público **opcional**, sem contrato adicional | B | Melhorias em redes distintas, privacidade e dependência | 3 |
| H12 | P2P + relay HTTP de eventos/ações automático | B | Mudança de transporte sem perder versão de turno | 3 |
| H13 | SSE unidirecional de eventos + POST do tiro | B | Comportamento de proxy/flush, 8 espectadores, carga | 2 |
| H14 | Long-poll HTTP por sala com limite de duração | B | Tempos e consumo de worker/processos | 2 |
| H15 | Socket.IO restrito ao transporte HTTP polling | C | Demonstração isolada e comparação com fetch direto | 4 |
| H16 | Motor compartilhado determinístico (TS puro) no browser e Node | A/B | Consistência inteiros/fixed-point e hash entre runtimes | **1** |
| H17 | Motor inteiramente no navegador, servidor valida transição em chamada | B | Prevenção de cliente adulterar resultado/dano | 3 |
| H18 | Hotseat local com dois a oito jogadores | A | Provar regras/motor antes de rede | **1** |
| H19 | Simulador de partidas/bots locais como teste de regressão | A | Repetir milhares de ações sem divergência | 2 |
| H20 | WASM para um motor compartilhado | C | Benchmark de custo/complexidade vs TS | 4 |
| H21 | Transferência de host baseada em snapshots no banco | B | Matar aba host no meio da partida e continuar HTTP | 3 |

## Descoberta central

O número de **jogadores por sala** não implica 8 simulações concorrentes contínuas: há **uma única vez oficial** e a partida só avança quando ocorre uma transição válida (ação, timeout, saída). A sincronização pode ocorrer pela **versão inteira da sala**. Os 8 navegadores produzem o visual localmente.

**Exemplo:** comando recebido com `expected_version = 20` (Dual, T2, ângulo 90, força 100), estado oficial inclui vento 12, seed, HP/posições, terreno e Thor -> motor calcula impacto -> sala versão 21 -> um evento. O valor 'vento 12' é propriedade do estado, não entrada editável do jogador.

## Ordem de decisão
1. **Abrir e aproveitar uma base visual existente com os mobiles que já tiver**, então provar H16 + H18 (física determinística) e H02 + H03 + H04 + H06 + H07 (jogo online autoritativo), adicionando Aduka como requisito.
2. Medir com 2 e 8 clientes; experimentar H05, H13 e H14 quando houver ganho mensurável.
3. Avaliar H01 contra H02 caso PHP no mesmo plano ofereça melhor custo operacional.
4. Só depois H08–H12 (host no browser) e H20. O anfitrião é **possibilidade de otimização**, não necessidade.

## Métricas dos experimentos
Latência p50/p95 de propagação do evento; número de requests/min por sala; consultas e bytes por tiro; CPU/RAM; divergência de hashes; sucesso de reconexão; testes de corrida; disponibilidade em redes móveis. Dados e percentuais ainda NÃO medidos no Cloud Startup.

## Fontes e documentação
Ver [MODELO_DE_TURNOS.md](MODELO_DE_TURNOS.md), [ARQUITETURA_RECOMENDADA.md](ARQUITETURA_RECOMENDADA.md), [PLANO_TESTES.md](PLANO_TESTES.md), [EVIDENCIAS_HOSTINGER.md](EVIDENCIAS_HOSTINGER.md) e [BASES_GITHUB.md](BASES_GITHUB.md).
