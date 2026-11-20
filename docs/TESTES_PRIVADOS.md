# Hover Shot — avaliação privada de projetos sem licença explícita

**Decisão de 2026-11-19:** permitir ao proprietário avaliar os projetos **Artillery P2P** e **Scorched Tanks** diretamente no navegador do seu Windows, usando uma cópia local dos repositórios originais e servidores de arquivos que escutam **somente 127.0.0.1**. Isso não os torna produtos republicados em `hovershot.online` e não implica concessão de licença. Não sugerir atalhos externos como substitutos do teste local.

## Origem fixa, sem alterações de código
- `lettfeti/artillery`, commit `91ac021976e0db16678f49c8194e6b9e0f5971f0`: index.html, style.css, game.js, peerjs.min.js. Sem build; modo `Practice (solo)`. Multiplayer depende do serviço PeerJS público.
- `whorn76/scorched-tanks`, commit `6ce2dfa6225bb424ae9fb0ad1fa0dbbbafc93a0c`: index.html, styles.css, `src/main.js`, vendor/peerjs. Sem build para IA/hot-seat; backend websocket/relay opcional para online.

## Estratégia para testar
1. Um comando único PowerShell (sem download manual de .ps1) baixa automaticamente snapshots por **SHA** dos repositórios para `%LOCALAPPDATA%/HoverShot/LaboratoriosPrivados/`, utilizando HTTPS GitHub. Os snapshots são mantidos localmente para reuso.
2. Dois servidores HTTP estáticos mínimos executam em processos de trabalho PowerShell, escutando somente em `127.0.0.1` (ex.: 18761/18762). Não abrir portas externas, não criar contas, não subir SQL nem guardar payloads na Hostinger.
3. Abrir `http://127.0.0.1:18761/` e `http://127.0.0.1:18762/` no browser. Artillery: Practice (solo); Scorched Tanks: IA ou hot-seat.
4. Stop-Job encerra os servidores. No final da sessão PowerShell os jobs não são persistentes. Arquivos locais permanecem e podem ser removidos pelo proprietário se desejar.
5. O JavaScript é de terceiros e pode fazer requisições externas. **Artillery usa PeerJS público**, e o modo online de Scorched pode usar conexões externas. Para avaliação privada preferir solo/IA/hot-seat.
6. Os jogos **não foram instalados no domínio** e ainda não houve prova de execução no PC do proprietário. Esperar a saída real do PowerShell para marcar os testes locais como validados.

## Licenciamento
Acesso público ao código não implica direito automático de redistribuição no domínio do Hover Shot. Esta abordagem é de estudo privado, não de hospedagem pública, e não modifica código original. A política de uso local depende das regras aplicáveis; solicitar licença/autorização antes de qualquer republicação.

## Evidências
- [x] README e árvores de arquivos originais conferidos no GitHub.
- [x] Commits de origem verificados.
- [ ] Comando de testes locais executado pelo usuário e servidores localhost verificados.
- [ ] Jogabilidade no navegador inspecionada (Practice, IA e hot-seat).
- [ ] Autorização para distribuição pública, caso se pretenda hospedar as cópias em `hovershot.online`.
