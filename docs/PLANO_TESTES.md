> **Histórico importado em 19/11/2026:** material do MEM-GPT-VIOLI. Para decisões atuais de laboratórios e estados de implementação, consulte `docs/LABORATORIOS.md` e `docs/STATUS_IMPLANTACAO.md`. Declarações antigas de que o repo não existe ou não tem permissão são anteriores à conexão da conta proprietária.

# Hover Shot — plano de experimentos: jogo por turnos com 8 jogadores no Cloud Startup

**Status em 2026-11-19:** testes **AINDA NÃO EXECUTADOS**. Prioridade: provar capacidades reais e adaptações usando somente Hostinger e os navegadores.

## P0 — Preparar ambiente isolado e medir base
- [ ] Identificar domínio reservado e checar se existe conteúdo atual; confirmar DNS/SSL.
- [ ] Conferir a versão efetiva do Cloud Startup e o consumo compartilhado com outros domínios; definir limite seguro de teste.
- [ ] Arquivos de pesquisa/documentação: **manter apenas nesta pasta MEM-GPT-VIOLI**.
- [ ] Criar app de teste isolado e banco próprio; permitir rollback e desativação imediata.
- [ ] Verificar implantação do frontend estático e rotas Node/HTTP; registrar logs sanitizados do teste.

**Saída:** primeira URL com `GET /api/health`, sem impacto em projetos existentes.

## P1 — Provar determinismo local
- [ ] **Abrir versão visual jogável da base escolhida** e experimentar cenários, HUD, tiros, personagens e animações reais antes de adicionar infraestrutura. Motor TypeScript importável com `simulate(state, action) -> {nextState,event}`.
- [ ] Estado tem mapa, HP/posições até 8, vento, Thor, RNG seed, versão do motor e relógio de turno.
- [ ] Teste exemplo `Dual + T2, ângulo 90, força 100, vento do estado 12`: mesma ação e mesmo estado produzem a mesma saída em execução repetida.
- [ ] Rodar pelo menos 100 seeds e conjuntos de ações com as versões congeladas.
- [ ] Verificar tiro 1, tiro 2, terreno, raios Thor para Aduka; SS em prova posterior; **preservar os outros mobiles já existentes e licenciados**, com animação e HUD desktop/mobile.
- [ ] Caminhada: guardar somente `move_final` validado se afetar colisão; nenhum registro de frames.

**Aceite:** todos os testes repetíveis convergem para mesmo `state_hash` e não são usados dados de posição/animação por segundo na rede.

## P2 — Primeira sala REAL no Cloud Startup
- [ ] Criar sala -> entrar com jogador A e B -> iniciar -> comando de tiro -> obter resultado nos 2 navegadores -> trocar turno.
- [ ] API `POST /actions` responde evento da ação e a versão nova. `GET /events?after_version` mostra somente eventos novos.
- [ ] Registrar **1 evento por turno**, atualizar **1 snapshot de sala** e nenhuma linha de frame; medir bytes e queries reais.
- [ ] Aplicar `deadline_at`: após tempo de jogada, próxima chamada valida e avança vez atomicamente; não fazer cron de contagem regressiva.
- [ ] Repetir POST com mesmo `request_id`: resultado exatamente igual sem segundo disparo.
- [ ] Duas tentativas em concorrência sobre `expected_version` idêntica: exatamente uma é aceita.
- [ ] Recarregar ambos, recuperando snapshot correto sem reexecutar visualmente turnos antigos.

**Aceite:** um tiro gera exatamente uma transição, sem duplicidade/perda de turno, e ambos reconstroem estado coerente.

## P3 — Expandir 2->4->8 jogadores e medir custo
- [ ] 2x2 em dispositivos separados, depois 4x4 em **8 sessões** com autenticação/assentos.
- [ ] Comandos em sequência, timeouts, vitória, abandono, ordem de turno, 10 partidas completas.
- [ ] Pelo menos 1 navegador mobile em outra rede; recarregar/hibernar/voltar durante turno alheio.
- [ ] Comparar polling 2, 3, 4, 5 segundos (hipóteses iniciais): tempo p50/p95 de novo evento, GET/s, MySQL requests e consumo CPU/RAM.
- [ ] Registrar tamanho do snapshot e evento por tiro, quantos dados atualizados no banco, largura de banda por partida.
- [ ] Avaliar impacto sobre outros sites e parar antes de qualquer degradação. Aumentar carga só após medições seguras.

**Aceite:** 8 jogadores recebem mesmas versões/hashes; reconexões funcionam; nenhuma regressão dos demais sites.

## P4 — Adaptações nativas para UX
- [ ] Testar cache por ETag/304 e resposta 'sem novidades'.
- [ ] SSE de nova versão por canal unidirecional e POST normal; medir proxy/flush/desempenho e continuidade.
- [ ] Long-poll finito por HTTP; comparar com polling adaptativo.
- [ ] Se Node/Express apresentar maior custo que o necessário, comparar API PHP stateless com a mesma interface HTTP e engine de tiro validada.
- [ ] Escolher pelo **custo e estabilidade medidos**, não pela tecnologia de preferência.

## P5 — Hospedagem da sala no browser (otimização)
- [ ] Testar host navegador simulando tiro localmente e publicando resultado através do HTTP Hostinger, com checagem/reexecução autoritativa quando necessária.
- [ ] Testar WebRTC DataChannel para enviar eventos entre participantes; sinalização oferecida pela API Hostinger.
- [ ] Testar host desktop, host Android, host iPhone, Wi-Fi e redes distintas; registrar sucesso/latência e comportamento ao minimizar/trocar de app.
- [ ] Trocar automaticamente para HTTP durante a mesma partida ao cair P2P/host; estado é sempre recuperado pelo banco.

**Aceite:** experimento P2P só altera a estratégia de transporte, não as regras do combate nem o estado oficial.

## Medições e evidências
Cada execução com: data/hora, URL/domínio, commit, número de navegadores, tipo de rede, payload/hashes sanitizados, resultados reais, p50/p95, CPU/DB, erros e rollback. Nada de tokens de acesso, IPs pessoais completos ou segredos no GitHub.

### Critério de conclusão da fase experimental
**8 navegadores em uma partida 4x4, tiros alternados com tempo limite, sem streaming de frames, com o mesmo resultado de cada jogada e com recuperação após reconexão**, totalmente no Cloud Startup, sem novos serviços pagos.
