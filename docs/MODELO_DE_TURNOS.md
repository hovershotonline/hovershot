> **Histórico importado em 19/11/2026:** material do MEM-GPT-VIOLI. Para decisões atuais de laboratórios e estados de implementação, consulte `docs/LABORATORIOS.md` e `docs/STATUS_IMPLANTACAO.md`. Declarações antigas de que o repo não existe ou não tem permissão são anteriores à conexão da conta proprietária.

# Hover Shot — modelo canônico: jogo de artilharia por turnos (até 8 jogadores; Aduka obrigatório)

**Data da decisão:** 2026-11-19. **Status:** REQUISITOS DEFINIDOS pelo proprietário + ARQUITETURA PROPOSTA; sem teste no Cloud Startup.

## Princípio

Tratar a partida como xadrez multiplayer: a rede precisa trocar **ações discretas**, não imagens ou estados de animação por segundo. Cada cliente exibe o mundo localmente. A API só mantém um registro confiável do estado e da sequência de ações. O objetivo não é clonar o cliente de GunBound, mas construir **combate de artilharia com Aduka obrigatório e outros mobiles permitidos**, testável inicialmente com identidade temporária e depois com conteúdo autoral.

### Requisitos decididos
- Até **8 jogadores humanos por sala**, suportando progressivamente 1x1, 2x2, 3x3 e 4x4, com ordens de turno configuráveis.
- Tempo limite por jogador/turno (valor inicial **a ser definido**, não assumir regra oficial).
- Comando ilustrativo do proprietário: **Dual, T2, ângulo 90, força 100, vento 12**. 'Vento 12' é leitura do **estado oficial**; o jogador NÃO tem permissão de alterá-lo. O funcionamento exato de item Dual será configurável conforme regras validadas; não o declarar implementado.
- O motor produz resultado único de tiro: trajetória/categoria de impacto, danos, transformação de terreno, comportamento de Thor, alterações de jogadores e próximo turno.
- Caminhada, mira e carregamento da força **são animações locais**; se uma caminhada alterar a posição efetiva, guardar apenas a **posição final validada / comando de deslocamento**, nunca os frames.
- Sem roupas, amplificadores por equipamento, economia e rankings complexos na primeira versão. **A coleção de mobiles pode aproveitar os veículos já existentes e licenciados na base escolhida**; Aduka é requisito mínimo, não exclusividade.
- Sem mensalidade ou serviço extra; tudo hospedado no Cloud Startup, com jogadores em computadores/celulares, podendo avaliar P2P depois.
- GitHub: usar **somente esta pasta no MEM-GPT-VIOLI** para pesquisa/documentação. Não criar novo repositório.

## Estado suficiente para reproduzir uma ação

Um comando só é determinístico **junto ao estado inicial da jogada e versão exata do motor**:

```text
state_n = {
  room_id, engine_version, rules_version, current_turn, current_player,
  deadline_at, seed/rng_position, wind, gravity, thor_phase_or_power,
  players: [{id, team, mobile_id, position, health, status}, ... até 8],
  terrain: compressed_heightmap_or_changes,
  phase_and_winner
}
action_n = {
  idempotency_key, player_id, expected_version,
  move_to_optional, item_optional, mobile_id, shot_type, angle, power
}
(state_n+1, public_event_n) = simulate_and_validate(state_n, action_n)
```

O vento, terreno, Thor, posições e relógio **já existem no estado do servidor**; o cliente envia apenas escolhas autorizadas. `mobile_id` precisa estar fixado/validado na seleção antes da partida e define armas, colisões e regras de dano conforme o catálogo disponível. Se item Dual consumir estado específico, o motor calcula e registra o efeito **da jogada completa** de forma atômica.

### Exemplo do fluxo de tiro
1. A sala está no estado versão 12; jogador 5 é o dono da vez; vento atual 12; o relógio de turno marca prazo absoluto do servidor.
2. O jogador escolhe Dual + T2, ângulo 90, força 100 e executa um único POST contendo o idempotency key e `expected_version:12`.
3. O servidor confere membro, ordem, prazo, força, item permitido, versão, trava a sala e roda a simulação de uma ação.
4. Uma transação grava **um evento de turno** com entrada e resultado resumidos, a nova versão 13 e o estado resultante (snapshot compacto).
5. Todos consultam `GET /events?after=12` e veem o mesmo evento; a UI desenha localmente projéteis, raios e dano; `GET /state` recupera uma sessão atrasada ou reconectada.

**Persistência:** não gravar movimento visual, trajetória por frame, FPS, áudio, partículas, mousemove, teclas pressionadas, barras de força intermediárias. Para danos/terreno, guardar **delta/snapshot** necessário à recuperação; se uma área do mapa muda, isso faz parte do estado autoritativo e não pode ser reconstruído apenas pelo último comando sem estado anterior.

## Modelo econômico de banco

**Proposta de 3 tabelas principais:**
- `rooms`: identificador/código, current_version, status, current_player, deadline_at, current_state_compact, engine_version, updated_at, expires_at. Uma linha por sala.
- `room_members`: room_id, player_id, token_hash, team, last_seen_at, seat; índice único sala+assento e limite de 8.
- `turn_events`: room_id, version, turn_id, player_id, request_id, input_compact, result_compact ou hash, timestamp. **Uma linha por jogada**, com eventos extraordinários somente quando alteram regras/estado (início, timeout, vitória, abandono).

Evitar logs permanentes de ping. Se guardar `current_state_compact` por turno, não é necessário reconstruir estado reproduzindo centenas de eventos para reconectar. Para histórico/replay futuro, os eventos armazenados podem ser compactados e removidos após retenção definida.

## Sincronização: simples primeiro
- Poll GET com `after_version`, retornando vazio enquanto nada mudou; intervalo ajustável conforme testes (ex.: 2–5 s em partida ativa, maior em segundo plano, sem requisições após o encerramento).
- POST de jogada retorna imediatamente a nova versão e o evento do tiro ao autor.
- Todos usam o mesmo hash de estado; se uma versão é perdida, ressincronizam com snapshot.
- Timeout sem game-loop permanente: `deadline_at` é data do servidor; a primeira leitura/escrita depois de expirado faz uma transição atômica de timeout/skip e grava **um evento**. O relógio visual do cliente é apenas indicação; não confere autoridade.
- Em duas requisições simultâneas, validação com lock/controle otimista: **somente uma transição de versão é aceita**; `request_id` repetido responde o mesmo resultado sem duplicar disparos.

## Divisão de responsabilidade (prática)
- **Navegador:** Canvas/Phaser, entrada teclado/touch, barra de força, mira, efeitos de tiros/Thor, animações interpoladas, contador visual, modal de sala.
- **Cloud Startup:** endpoints HTTP, autenticação da sala, validação da vez, cálculo determinístico por ação (opção A) e persistência MySQL de estado + evento.
- **Possível adaptação B:** host navegador processa turno e publica resultado via HTTP; nuvem valida ou reexecuta para manter integridade. É interessante como experimento, mas **não é pré-requisito** para rodar 8 jogadores.

## Indicadores verificáveis
- Mesma sequência de ações sobre mesma seed/rules_version -> **100% mesmo estado e hash**.
- Nunca aceitar dois disparos para a mesma versão.
- Ingressar/recarregar página em qualquer um dos 8 assentos -> mesmo snapshot.
- 8 navegadores em redes distintas conseguem acompanhar turnos sem trocar frames.
- Medir p95 do tempo até o próximo jogador perceber o evento; meta inicial de UX a estabelecer por teste, sem afirmar desempenho não medido.
- 1 tiro = **uma transação curta**, no máximo uma linha de evento e atualização da sala (fora da inicialização/transições extras). O tamanho do snapshot deve ser medido; não salvar estados grandes indiscriminadamente.

## Escopo e rigor
Não são “8 pessoas fazendo coisas em realtime”; são 8 participantes observando e submetendo ações quando chega sua vez. A característica essencial é **identidade de resultado** e consistência do turno, com animação puramente visual.
