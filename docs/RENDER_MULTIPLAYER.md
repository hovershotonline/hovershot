# Hover Shot — servidor WebSocket no Render (decisão de 20/11/2026)

## Finalidade e escopo
O proprietário escolheu a opção B: **Hostinger Cloud Startup hospeda o site e o catálogo; Render hospeda somente o servidor multiplayer WebSocket**. Esta implementação é **um laboratório de infraestrutura** (protocolo lab-v1), não um jogo, não o motor aprovado e não uma cópia de DragonBound. Não possui física, colisões, dano, persistência de partidas, login de usuários, matchmaking público ou integração com o catálogo em produção.

## Arquitetura implementada no GitHub
- Blueprint raiz `render.yaml`, 1 Web Service Node.js Free, região Virginia, rootDir `services/multiplayer`, um único HTTP listener em `0.0.0.0:PORT` aceitando upgrades WebSocket em `/ws`; endpoint `/healthz`.
- Página de teste em `/lab`, CSS e JS na **mesma origem Render**: aceita chave de laboratório digitada pelo usuário e permite conectar, criar ou entrar com código de sala, alternar turnos, transmitir comando com ângulo/potência e verificar ida e volta (ping/pong). Não é publicada no domínio Hover Shot nesta etapa.
- Autenticação de laboratório por segredo mínimo de 20 caracteres, em `LAB_ACCESS_TOKEN` configurado somente no Render (`sync: false` no Blueprint); nunca subir ao GitHub, nem inserir segredo em HTML/URL/localStorage. A página não guarda o segredo após a autenticação. **Chave compartilhada apenas com testadores autorizados**; antes de produção substituir por tickets temporários assinados por backend de autenticação.
- Origem de navegador restrita a Render `*.onrender.com`, Hover Shot e origens explícitas `LAB_ALLOWED_ORIGINS`; conexões sem origem válida rejeitadas antes do upgrade. Uso de WSS pela internet, HTTP WS apenas em localhost de testes.
- Instância única; máximo 48 conexões, 24 salas, 2 jogadores por sala; payload máximo 4096 bytes; até 20 mensagens/10s/conexão; heartbeat de 30s, fechamento de conexões sem resposta; nenhuma compressão WebSocket. O servidor é **autoridade da ordem dos turnos**, mas não calcula física. Sem polling, sem cron e sem banco para o laboratório.
- As salas permanecem **exclusivamente em memória**, são removidas ao sair o último jogador e **somem em reinícios/deploy/hibernação**. Não armazenar mídia, backup ou logs pessoais no Render. Para versão real: persistência controlada, tokens individuais, reconexão e testes de carga.
- Os jogos Guntanks e Craterfall e todos os 13 cards do catálogo **não mudam**. Nenhum trecho proprietário do DragonBound foi importado.

## Criar serviço no Render (ação dependente da conta do proprietário)
1. Conectar sua conta Render ao ChatGPT ou autenticar em [Render Dashboard](https://dashboard.render.com/); autorizar integração GitHub para `hovershotonline/hovershot`.
2. Na dashboard do Render, clicar **New → Blueprint**, selecionar esse repositório, branch `main`, e usar `render.yaml` da raiz.
3. Confirmar plano **Free** e região **Virginia**. Inserir um segredo aleatório de pelo menos **20 caracteres** em `LAB_ACCESS_TOKEN` quando o Render solicitar. **Não enviá-lo por chat nem gravar no GitHub.** Guardá-lo num gerenciador de senhas para os testadores.
4. Criar o Blueprint. O serviço terá um URL real fornecido pelo Render, do tipo `https://<slug-real>.onrender.com`; **não presumir o slug antes de conferir o serviço criado**.
5. Confirmar `GET /healthz` respondendo `status=ok`; então abrir `/lab` em dois navegadores diferentes/redes diferentes, informar segredo e nomes, criar sala, entrar com código e alternar `Enviar disparo de teste`. Confirmar que ambos recebem o mesmo índice de comando e turnos, sem erros. Registrar URL e latências no Roadmap (sem segredos).
6. Após comprovar estabilidade, criar subdomínio `ws.hovershot.online` com DNS + TLS no Render (opcional nesta fase; não alterar DNS antes de conhecer o serviço real). Para a integração final será necessário cliente HTML5 no domínio Hostinger apontando para o WSS. Isso **não está implementado**.

## Limitações da modalidade Free e critérios de avanço
A Render hiberna Free após ~15 minutos sem tráfego (inclusive mensagens WebSocket), podendo demorar aproximadamente um minuto a acordar; o processo e memória não são persistentes. Pode reiniciar a qualquer momento e há limites mensais de uso. Virginia (EUA) é a região disponível escolhida como teste inicial, **não existe região Brasil na lista oficial atual**; medir RTT a partir dos jogadores no Brasil antes de escolher a região/capacidade final.

**Não considerar o multiplayer real implementado** antes de: (a) serviço Render online comprovado, (b) duas pessoas em redes distintas completando o teste WSS, (c) validação de reconexão, autenticação de usuários, persistência e simulação física real com engine escolhida/permitida, (d) revisão de custos e recursos. Sem esse gate, o código permanece laboratório isolado.

## Qualidade e manutenção
O workflow GitHub Actions `.github/workflows/render-multiplayer-ci.yml` faz testes unitários/de integração WS no runner: proteção de segredo/origem, sala cheia, turno fora de ordem, validação de tiro, heartbeat/limites, API e interface web. **CI localhost não valida WSS remoto**. Render pode fazer deploy após checks aprovados; não colocar credenciais da Hostinger em Render. Ambiente Free é exclusivamente para testes, sem quaisquer dados definitivos.

Documentação oficial consultada em 20/11/2026:
- [WebSockets on Render](https://render.com/docs/websocket)
- [Deploy for Free](https://render.com/docs/free)
- [Blueprint YAML Reference](https://render.com/docs/blueprint-spec)
- [Render Regions](https://render.com/docs/regions)
