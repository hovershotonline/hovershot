> **Histórico importado em 19/11/2026:** material do MEM-GPT-VIOLI. Para decisões atuais de laboratórios e estados de implementação, consulte `docs/LABORATORIOS.md` e `docs/STATUS_IMPLANTACAO.md`. Declarações antigas de que o repo não existe ou não tem permissão são anteriores à conexão da conta proprietária.

# Hover Shot — Cloud Startup: recursos a aproveitar e como comprová-los

**Fonte documental consultada em 2026-11-19; recursos da conta real ainda precisam ser medidos.** Esta página foca somente as funcionalidades que permitem executar nosso jogo de 8 participantes por turno.

| Recurso disponível/documentado | Aplicação prática no jogo | Como validar no domínio real |
|---|---|---|
| HTTP/HTTPS para aplicações Node.js | `POST /actions`, `GET /events`, `GET /state`, salas e tokens | Subir `/api/health`, 1x1 e medição p95 |
| PHP e MySQL na hospedagem Cloud | Alternativa de API stateless + persistência de salas/turnos | Testar transações, índices e 8 navegadores |
| Deploy de aplicação Node.js via GitHub | Versionar protótipo, publicar interface e API no domínio reservado | Confirmar fluxo de deploy da conta e rollback |
| Cron finito no painel | Remover salas/eventos expirados, sem processo de monitoramento contínuo | Testar rotina limitada em lotes e idempotência |
| Limite por request documentado para Node | Processar uma jogada rápida em requisição | Medir tempo real por tiro (incluindo Dual/T2) |
| Cache de assets estáticos / HTTPS | Servir sprites, cenários e scripts no navegador com custo reduzido | Medir tamanho do bundle e primeiro carregamento |
| Navegador moderno: Canvas, WebGL, WebRTC DataChannel | Motor visual local e, opcionalmente, comunicação direta entre jogadores | Testes no Chrome/Firefox/Safari e mobile |
| REST HTTP como sinalização de WebRTC | Troca inicial de offer/answer/ICE por API da própria Hostinger | Testar NATs, rede móvel e fallback HTTP |

## Possibilidades experimentais
- **Polling por versão:** `GET /events?after=NN`; começo recomendado em 2–5 segundos, ajustado por medições.
- **ETag/304:** reduzir bytes de respostas vazias.
- **SSE (Server-Sent Events):** notificação de nova versão pela mesma conexão HTTP; testar comportamento do proxy.
- **Long-polling:** mesma API HTTP esperando a próxima alteração por poucos segundos; testar ocupação de recursos.
- **WebRTC P2P opcional:** navegador host coordena simulação, com sinalização na API hospedada. Validar sem transformar outra plataforma em dependência.
- **Servidor HTTP só por evento:** elimina necessidade de loop de rede e gravação de frames; cada turno é transação curta.

## Fontes primárias
1. https://www.hostinger.com/support/hostinger-node-js-limits-for-web-and-cloud-plans/
2. https://www.hostinger.com/support/6976044-parameters-and-limits-of-hosting-plans-in-hostinger/
3. https://www.hostinger.com/support/how-to-deploy-a-nodejs-website-in-hostinger/
4. https://www.hostinger.com/support/how-to-run-cron-jobs-for-node-js-websites-at-hostinger/
5. https://developer.mozilla.org/en-US/docs/Web/API/RTCDataChannel
6. https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API/Connectivity
7. https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events
8. https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Caching
9. https://developer.mozilla.org/en-US/docs/Web/API/Page_Visibility_API

**Interpretação correta:** números de CPU/RAM/processos anunciados em tabelas de planos são compartilhados com outros sites e **não representam capacidade testada de salas**. A partida por turnos oferece uma forma de uso econômico; o número de partidas simultâneas deve sair dos testes, não de uma estimativa comercial.
