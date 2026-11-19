> **Histórico importado em 19/11/2026:** material do MEM-GPT-VIOLI. Para decisões atuais de laboratórios e estados de implementação, consulte `docs/LABORATORIOS.md` e `docs/STATUS_IMPLANTACAO.md`. Declarações antigas de que o repo não existe ou não tem permissão são anteriores à conexão da conta proprietária.

# Hover Shot — Aduka: requisitos obrigatórios em um jogo de artilharia com múltiplos mobiles

**Status:** requisitos de produto definidos; regras exatas de tiros ainda a pesquisar/validar em testes. O produto final terá identidade/recursos próprios.

## Contrato principal
O jogo simula **ações discretas**, tal como xadrez com até oito participantes e relógio de jogada. Cada comando autorizado produz um único evento oficial de turno para todos os clientes. Até 8 jogadores podem observar o disparo; **nenhum frame da animação precisa ser armazenado ou transmitido**.

Exemplo didático do proprietário: **Dual + T2, ângulo 90°, força 100; vento da sala 12**. Estado anterior (posições, HP, terreno, Thor, seed, versão do motor) faz parte da entrada implícita do motor; vento é definido pela partida, não escolhido pelo jogador.

## Mecânicas do protótipo
- **Aduka é um requisito obrigatório, não uma exclusividade.** Podemos manter outros mobiles, armas, terrenos e modos que já vierem prontos nos projetos reutilizados, bem como ampliar o catálogo depois.
- Tiro 1: projétil com efeito elétrico/aftershock (ajustar comportamento exato).
- Tiro 2: três projéteis, com efeitos de raio/Thor após impacto; progressão do Thor depende de estado e regras versionadas.
- SS: impacto diferenciado/atravessamento do terreno e Thor, **fase posterior**.
- **Dual + T2:** tratar como uma **única jogada atômica** cujo número e ordem de disparos, consumo do item e efeitos serão especificados após comparação técnica com referência histórica.
- Ângulo, força, vento, impacto/colisão, HP, terreno destrutível, turno, vitória e time limit.
- Movimento simplificado: apenas mudança de posição com colisão validada; passos são visuais no browser.
- 1x1 para prova, depois 2x2 e 4x4; sala aceita até 8 assentos. Regras de ordens de turno/empate serão versionadas.

## Fora do escopo
Roupas de aumento de dano, bônus de equipamentos, contas sofisticadas, cash, rankings complexos, chat complexo, narração/frame data. **Outros mobiles são permitidos e reaproveitados sempre que fizer sentido.** Não reproduzir conteúdo protegido sem direitos em produto publicado.

## Fontes históricas de mecânica (referência, não implementação atestada)
- https://strategywiki.org/wiki/Gunbound/Mobiles
- https://gamefaqs.gamespot.com/pc/582632-gunbound/faqs/28187

## Próximas provas
1. Definir dados de entrada/saída da simulação e seed (arquivo `MODELO_DE_TURNOS.md`).
2. Provar Tiro 1/Tiro 2/Thor com 100 seeds determinísticas.
3. 8 clientes recebem uma versão de estado idêntica por POST/GET HTTP.
4. Detalhar **Dual**, SS, variação de Thor e convenções de precisão por referência e teste.
