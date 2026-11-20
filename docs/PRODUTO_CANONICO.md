# Hover Shot — definição canônica do produto

**Decisão expressa do proprietário — 19/11/2026:** construir **um jogo próprio de artilharia por turnos**, cuja autoria/controle técnico, código-fonte, evolução, distribuição e infraestrutura online pertençam ao projeto Hover Shot, permitindo **jogar com amigos pela internet em salas próprias**. Não é um catálogo de jogos, projeto de links externos, emulador de servidor privado do GunBound nem uma conta num serviço de terceiros. **O usuário rejeitou jogar GunBound no navegador como objetivo final**; priorizar um **cliente instalável Windows** sob marca própria, sujeito à escolha técnica posterior. O site `hovershot.online` será portal do projeto, informações/contas/atualizações, **não uma dependência para a partida**.

## Objetivo e critérios de aceitação

1. **Propriedade e autonomia:** fonte original sob GitHub controlado pelo proprietário, regras/ativos próprios, pipeline de build, binário distribuível e capacidade de operar/migrar servidor sem depender de serviço de outro desenvolvedor. Não prometer propriedade exclusiva sobre bibliotecas externas; cumprir licenças e direitos de terceiros.
2. **Multiplayer real:** aplicativo Windows conecta à instância dedicada controlada pelo proprietário; criação/entrada de sala via código ou convite; no MVP, **1v1 real entre computadores distintos pela internet**, sincronismo e reconexão básica; evoluir para até oito jogadores após medir capacidade e qualidade.
3. **Combate inspirado na experiência GunBound clássico:** mira, potência, vento, curvas de projéteis, terreno destrutível, turnos com delay, movimento, shots 1/2/SS e comportamento distinto por mobile. **Aduka e Thor** são referências funcionais obrigatórias de validação, mas não copiar nomes, personagens, assets, músicas ou marca de terceiros sem direitos; criar personagem e apresentação próprios que entreguem mecânica equivalente.
4. **Controle de operações:** servidor dedicado persistente e autoritativo, sem aceitar cliente como autoridade de dano/colisão/turno; minimizar uso de CPU/rede/disco, manter snapshots apenas quando necessários, logs com retenção, evitar armazenamento de quadros de jogo; usar GitHub para código/versionamento, não guardar credenciais e dados de jogadores no GitHub.
5. **Evolução independente:** cliente e servidor com versões compatíveis, atualização controlada, CI com testes, rollback, documentação, telemetria mínima consentida.
6. **Experiência completa:** o usuário instala/abre o aplicativo Hover Shot, escolhe nome, cria sala, compartilha convite, joga contra amigo e encerra partida **sem abrir jogos de terceiros**.

## O que não é objetivo

- Jogar Rembound, GunBros, DragonBound ou outros em navegadores externos como substituto do produto.
- Publicar projetos de terceiros em `/labs/` e declarar o Hover Shot finalizado.
- Reproduzir o servidor oficial do GunBound, utilizar seus gráficos/áudios ou chamar o produto de GunBound sem autorização.
- Adotar motor de combate do Rembound: playtest do usuário rejeitou sua fidelidade de combate.
- Empilhar protótipos sem caminho de entrega para aplicativo desktop + servidor próprio.

## Arquitetura preliminar — hipótese, não implementação

- **Cliente Windows:** avaliar **Godot 4** exportado para Windows (2D nativo, input, câmera, áudio, cenas e empacotamento), construindo identidade e ativos originais. A escolha requer prova de conceito e comparação com alternativas, não está aprovada nem implementada.
- **Servidor de partida:** processo dedicado em VPS separado do hosting compartilhado Hostinger para manter sessão e conexões estáveis; simulação autoritativa por sala com eventos/estado compacto, sanidade anti-cheat e reconciliação para reconexões. Escolher protocolo após experimento de rede (por exemplo ENet/UDP ou WebSocket, não assumir escalabilidade).
- **Domínio:** `hovershot.online` para portal/download/notícias; subdomínio ou IP para transporte de partidas. Não instalar daemons no `public_html` compartilhado nem interferir em outros domínios.
- **Fonte:** manter documentação e código canônico em `hovershotonline/hovershot`; avaliar repositório privado quando houver código proprietário. GitHub Actions gera distribuição Windows e release rastreável; evitar gravações/backups desnecessários na Hostinger.
- **Técnica:** motor separa input, regras/estado, simulação física e apresentação; servidor autoritativo determina turnos, impacto e dano; todo disparo tem ID, versão de física e seed reproduzível.

## Critérios de aceitação do primeiro vertical slice

- [ ] Aplicativo `Hover Shot` Windows abre sem navegador e possui tela inicial compacta.
- [ ] Dois computadores em redes diferentes conectam ao mesmo servidor sob controle do proprietário.
- [ ] Um jogador cria sala, outro entra por código/convite; indicação de ambos na sala.
- [ ] Uma arena 2D, terreno destrutível e **um mobile original inicial** com mira, vento, potência, tiro simples e tiro avançado com efeito tipo Thor (sem copiar arte/som).
- [ ] Mesma simulação autoritativa para ambos: posição, tiros, crateras, HP, turnos, delay, vitória; clientes não podem decidir dano.
- [ ] Desconexão, atraso e retorno são tratados sem quebrar a partida nem duplicar ações.
- [ ] Binário Windows e servidor obtidos de CI versionado, deploy próprio verificável, rollback e documentação.
- [ ] Proprietário e amigo testam partida online de ponta a ponta, com evidência real; marcar esse item somente após teste.

## Fases

**Fase A — base própria:** inventário de fontes atuais, escolha de engine/servidor e teste de licenças; evitar transportar código de projeto sem licença.

**Fase B — partida mínima:** projeto do cliente + servidor próprios, sala online real, 1v1, física/vento/tiros, ambiente único.

**Fase C — fidelidade:** benchmark reproduzível de tiros/vento/delay e comportamento inspirado em Aduka/Thor, qualidade visual e sensação de jogo; ajustes guiados por playtests do proprietário.

**Fase D — beta privado:** autenticação/convites, reconexão, logs e atualizador, testes com amigos, até oito jogadores após validação e dimensionamento.

## Estado factual — 19/11/2026

O repositório contém **laboratórios web de terceiros** (Guntanks, Craterfall) e documentação de outros projetos. Estes são **experimentos históricos e referências**, não o cliente Windows nem o multiplayer proprietário. O Rembound foi executado localmente (Next.js/SpacetimeDB, HTTP 200 e playtest) e rejeitado quanto à fidelidade do combate. **Não há evidência de cliente Hover Shot Windows, servidor próprio nem partida online funcionando.** Não alegar implementação de algo ainda não produzido.

A documentação anterior sobre `/labs/` fica preservada para rastreabilidade, mas **esta definição de produto prevalece** quando houver conflito. Atualizar o Roadmap conforme decisões, implementações e testes verificáveis, sem confundir pesquisa de terceiros com software pronto.
