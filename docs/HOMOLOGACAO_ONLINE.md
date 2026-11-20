> **QA de rede preparado:** [QA_MULTIPLAYER_REMOTO.md](QA_MULTIPLAYER_REMOTO.md) descreve a execucao manual de HTTPS + WSS e sala/tiro em servidor de teste. Nao prova servidor implantado, nao substitui playtest humano.

# Plano canônico de homologação online — Hover Shot

**Decisão metodológica registrada em 19/11/2026, a partir da crítica explícita do proprietário.**

## Por que o processo anterior não era suficiente

O proprietário quer escolher **qual base será adotada** depois de executar cada candidato **num servidor online real**, sob a experiência **hovershot.online**, com acesso via navegador e participação de amigos externos. O teste local do Rembound (HTTP 200), o smoke CI local do Hillshot (dois clientes WebSocket dentro do runner) e catálogos de demos não dão evidência de experiência real: não capturam latência da internet, TLS, NAT, proxy, WebSocket, concorrência, reconexão, estabilidade, usuários reais e comportamento visual. **Nenhum desses testes autoriza escolher uma engine.**

**Princípio obrigatório:** comparar versões em um ambiente de homologação online funcional e isolado, antes de escolher o motor. O usuário decide a base após jogar; o assistente não promove um candidato a escolhido por ser tecnicamente fácil.

## Topologia esperada (proposta de implementação, ainda não implantada)

- Frontend dos candidatos servido **no domínio Hover Shot**, com rotas temporárias como `https://hovershot.online/testes/hillshot/` e `https://hovershot.online/testes/gusanito/`, não links para sites externos.
- **Uma infraestrutura de homologação compartilhada** com capacidade de hospedar processos por motor (VPS compatível com WebSocket). Cada motor tem processo isolado, usuário de execução sem privilégios, porta interna diferente e rede de teste; não precisamos de uma VPS por motor.
- Conexão `wss://` sob domínio controlado pelo projeto (por exemplo `homologacao.hovershot.online`), com TLS real, proxy, autorização na borda para HTTP e upgrade WebSocket, checagem de origem e tokens limitados. Endereço é exemplo, não recurso DNS existente.
- Para motores que não suportem separação frontend/backend, usar proxy HTTP/WebSocket na mesma origem de teste, mantendo a experiência no domínio controlado e a autenticação efetiva. Não simular servidor.
- Acesso **restrito** ao proprietário e amigos/testadores autorizados, sem indexação e sem divulgação pública; bloqueio servidor/proxy, não só `robots.txt` ou página de senha JavaScript. Limite de sessões/conexões, inspeção de CPU/memória, logs mínimos sem dados privados, expiração/desativação após avaliação.
- Não interferir na home ou `/labs/` existentes, nem no MySQL de produção ou em outros domínios da Hostinger. Para processos e arquivos, definir finalidade, retenção e limpeza. Código e infraestrutura versionados no GitHub, sem backups persistentes de código no servidor.
- O Cloud Startup atual da Hostinger não recebe WebSocket de entrada para apps gerenciadas ([documentação oficial](https://www.hostinger.com/support/hostinger-node-js-limits-for-web-and-cloud-plans/)); portanto **uma cópia estática na Hostinger não equivale ao servidor multiplayer real**. Validar capacidade de VPS/reverse proxy antes da primeira publicação.

## Qualidade do teste de seleção (um roteiro comum para cada motor)

1. **Instalação real:** build e execução do frontend + backend no ambiente homologação, nunca só HTML ou um mock; garantir isolamento e endpoint funcionando.
2. **Acesso remoto:** dois usuários entram no link do Hover Shot a partir de redes diferentes; login/entrada, nome e lobby.
3. **Partida:** criar sala, compartilhar código, entrar, iniciar, mirar, carregar potência, disparar, receber impacto/dano, deformar terreno, alternar turnos, encerrar e reiniciar.
4. **Rede:** perda momentânea de conexão, refresh, saída de um jogador, reconexão, reentrada e limite de salas. Registrar o que falta, sem declarar recurso ausente funcionando.
5. **Comparativo de gameplay:** física, vento, delay, comportamento diferenciado de tiro 1/2/SS e efeito semelhante a Thor/Aduka; não copiar conteúdo protegido. O avaliador dá notas para experiência/sensação e decide.
6. **Operação:** observar latência e recursos, robustez, segurança do WS, facilidade de adaptar mecânicas, direitos de código e assets e custo de manter.
7. **Decisão:** registrar para cada candidato fatos verificados, percepção do usuário, restrições e recomendação. Só então marcar **motor selecionado**.

## Direitos e licenciamento — sem confundir com segurança de acesso

Testar em ambiente com login e acesso restrito **reduz exposição**, mas **não concede licença de copiar, alterar ou disponibilizar código de terceiros**. Um repositório público sem licença geralmente não autoriza automaticamente a implantação de sua cópia em servidor web, mesmo sob senha. Aplicam-se possíveis exceções legais de forma dependente do caso; não prometer que o uso fechado sempre resolve. Para códigos com MIT/GPL e assets com permissão adequada, podemos montar homologação respeitando condições; para motores sem licença clara, buscar permissão expressa de avaliação/hospedagem ou outro fundamento legal antes de reproduzir no servidor. **Isso não impede o teste real com projetos licenciados.** O cuidado é distinto de escolher uma engine.

## Situação verificável

- [x] Requisito de navegador e site próprio estabelecido.
- [x] Deficiência metodológica dos testes locais reconhecida.
- [x] Hillshot MIT importado por submódulo e smoke WebSocket localhost no GitHub Actions aprovado; **não selecionado**.
- [x] Rembound MIT executado localmente, mas gameplay reprovado pelo proprietário.
- [ ] Ambiente real protegido com processos e TLS próprio implantado.
- [ ] Pelo menos dois motores licenciados executados e testados por jogadores externos na homologação.
- [ ] Testes de carga leve, rede, segurança e gameplay documentados separadamente.
- [ ] Escolha explícita do motor pelo proprietário.

**Nunca afirmar que homologação foi publicada, que um motor foi escolhido ou que partidas externas aconteceram enquanto essas etapas não forem comprovadas.**
