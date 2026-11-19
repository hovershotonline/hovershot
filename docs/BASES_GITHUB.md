> **Histórico importado em 19/11/2026:** material do MEM-GPT-VIOLI. Para decisões atuais de laboratórios e estados de implementação, consulte `docs/LABORATORIOS.md` e `docs/STATUS_IMPLANTACAO.md`. Declarações antigas de que o repo não existe ou não tem permissão são anteriores à conexão da conta proprietária.

# Hover Shot — repositórios que podem acelerar o protótipo

**Estado:** verificação de README e metadados públicos (2026-11-19), não auditoria integral de código nem licença de cada asset.

| Repositório | Aplicação | Licenciamento e alerta |
|---|---|---|
| https://github.com/blueRonyHazard/craterfall-the-game | **Base recomendada.** Phaser 3 + TypeScript + Vite, motor determinístico separado de renderização, terreno, 9 armas, testes Vitest. Hotseat 2 jogadores, sem multiplayer pronto. | Licença MIT declarada no repositório, arte e sons autorais segundo README; auditar dependências. |
| https://github.com/lettfeti/artillery | **Prova arquitetural real:** artilharia 2–4 jogadores no navegador, host autoritativo via PeerJS/WebRTC, código de sala, mobile touch. | Licença NÃO identificada nos metadados: usar para estudo/referência, NÃO copiar código/arte sem autorização. Usa broker PeerJS público externo: substituir por sinalização REST própria. |
| https://github.com/whorn76/scorched-tanks | Artilharia HTML Canvas, 2–6 tanques, WebRTC + fallback por relay local descrito no README; excelente referência de falhas NAT. | Licença não identificada nos metadados: referência, não copiar sem autorização. Relay descrito pode depender de túnel de terceiros — não usar como backend obrigatório. |
| https://github.com/remcostoeten/Gunbound | Referência de UX de sala, combate inspirado em GunBound, diversos mobiles, perfil, lobby. | MIT para código; usa SpacetimeDB incompatível como daemon dentro do Cloud Startup e elementos inspirados em IP alheio. NÃO importar backend como está. |
| https://github.com/lospolosadwords-dev/squeak-and-destroy | IA, crateras, arma explosiva, renderização Canvas sem dependências pesadas. | Código MIT; **assets possuem restrições específicas**, inclusive arte CC BY-NC / sem direito de redistribuição. Consultar ATTRIBUTIONS.md e docs/ASSET_LICENSING.md. |
| https://github.com/xjxxjx1017/Destructible-Terrain-With-Phaser | Biblioteca de destruição de terreno Phaser/TypeScript, quadtree. | MIT; projeto antigo, compatibilidade atual precisa de testes. |
| https://github.com/phaserjs/phaser | Renderização 2D Canvas/WebGL para navegador. | MIT. |
| https://github.com/apmlabs/webwars | Referência de simulação determinística e port de Hedgewars via WASM. | Dependências/licença GPL devem ser examinadas; gateway relatado usa WebSockets e não funciona sem mudança de arquitetura. |

## Ordem de inspeção quando começar código
1. Craterfall: `src/game/systems/MatchEngine.ts`, física, `Terrain.ts`, aleatoriedade, teste Vitest, UI de combate.
2. Lettfeti artillery: interface host/join/room, DataChannel, eventos de host, touch; **apenas aprender padrões**, não copiar código enquanto não houver licença clara.
3. Scorched Tanks: documentação de NAT, WebRTC/relay e alternância de transporte; novamente, não presumir permissão de cópia.
4. Rembound: layouts, fluxo da lobby e modos, omitindo SpacetimeDB/XP/contas.
5. Phaser/quadtree: somente se o craterfall não satisfizer terreno destrutível.
6. Squeak: consultar licenciamento por arquivo; evitar importar assets restritos.

## Regras de aproveitamento
- Não clonar projetos inteiros para o nosso site, nem incorporar SpacetimeDB como requisito.
- Importar apenas componentes efetivamente úteis e licenciados; manter avisos de licença e atribuições.
- Evitar mover código com CSS/assets que pertençam a terceiros ou dependam de serviço externo.
- Medir peso do bundle, draw calls, uso de canvas, overhead para celulares.
- A arquitetura de transporte é **nossa**, com API HTTP normal + MySQL.

## Referências consultadas
- https://github.com/blueRonyHazard/craterfall-the-game
- https://github.com/lettfeti/artillery
- https://github.com/whorn76/scorched-tanks
- https://github.com/remcostoeten/Gunbound
- https://github.com/lospolosadwords-dev/squeak-and-destroy
- https://github.com/lospolosadwords-dev/squeak-and-destroy/blob/main/docs/ASSET_LICENSING.md
- https://github.com/lospolosadwords-dev/squeak-and-destroy/blob/main/ATTRIBUTIONS.md
- https://github.com/xjxxjx1017/Destructible-Terrain-With-Phaser
