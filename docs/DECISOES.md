> **Histórico importado em 19/11/2026:** material do MEM-GPT-VIOLI. Para decisões atuais de laboratórios e estados de implementação, consulte `docs/LABORATORIOS.md` e `docs/STATUS_IMPLANTACAO.md`. Declarações antigas de que o repo não existe ou não tem permissão são anteriores à conexão da conta proprietária.

# Decisões do projeto Hover Shot

**Revisão:** 2026-11-19. O registro abaixo substitui premissas anteriores sobre repositório novo e sincronização contínua.

## DECIDIDO PELO PROPRIETÁRIO
0. **Nome oficial do projeto: Hover Shot**, definido em 2026-11-19. Nome anterior 'Aduka Browser' era provisório; Aduka permanece requisito obrigatório, não exclusividade. A fonte documental atual está em `MEM-GPT-VIOLI/projects/hover-shot/`; o destino de importação escolhido é `hovershotonline/hovershot`.
1. O projeto é **xadrez de artilharia**: ações **por turno**, para até **8 jogadores**, com tempo de jogada.
2. **Uma única ação precisa gerar um resultado igual** para todos; não gravar quadro/posição/animação a cada segundo.
3. Exemplo didático: `Dual + T2, ângulo 90°, força 100, vento 12`. Vento é valor do **estado da partida**; o jogador escolhe item/tipo/ângulo/força (e movimento final, quando pertinente).
4. **Aduka é obrigatório, não exclusivo.** O jogo pode conter outros mobiles, armas e modos, especialmente os já funcionais nas bases open source selecionadas. Não remover recursos prontos apenas para restringir o escopo. Caminhada pode ser simplificada. Sem roupas ou itens que ampliem dano por equipamento nem economia no MVP.
5. **Cloud Startup apenas**, sem VPS nem serviço adicional contratado.
6. Avaliar jogador como host em desktop/celular, mas priorizar meios de execução que já funcionem com HTTP.
7. **DECISÃO MAIS RECENTE:** o repositório de produto é [hovershotonline/hovershot](https://github.com/hovershotonline/hovershot), já existente. **Importar integralmente a documentação desta pasta do MEM-GPT-VIOLI para esse repositório**; preservar a fonte durante a migração. A antiga decisão de não usar repositório separado está substituída.
8. A comunicação ao proprietário deve focar **possibilidades e o que testar**; limitações são assunto de mitigação na documentação técnica.
9. Código, nomes e assets finais deverão ser originais ou licenciados; protótipo de mecânica usa Aduka como referência sem reivindicar direitos da marca.
10. Fase atual = pesquisa, não alteração de produção.
11. **Domínio na Hostinger:** `hovershot.online`. Repositório existente é **público e vazio** no momento da verificação (2026-11-19); a conta GitHub conectada tem leitura, mas não escrita. **Importação ainda não realizada**. Dar acesso de escrita no conector antes da migração; revalidar arquivos e permissões no instante da importação.

## DOCUMENTADO EM FONTES / SEM PROVA NA CONTA
- Hostinger oferece endpoints HTTP em aplicações Node.js e hospedagem PHP/MySQL (ver `EVIDENCIAS_HOSTINGER.md`).
- Navegadores modernos oferecem Canvas/Phaser e WebRTC DataChannel; sucesso P2P entre redes depende de testes.
- O Craterfall declara engine determinística e licença MIT, que é base promissora para combate local. O número e qualidade dos mobiles adicionais devem ser inventariados antes de decidir quais preservar.
- A pasta do MEM-GPT-VIOLI já existe e foi atualizada via GitHub, não é necessária a criação de repositório.

## ARQUITETURA PROPOSTA (PRECISA DE TESTES)
- API Node ou PHP + MySQL, transação curta por jogada, `state_version`, estado compacto da sala, eventos de tiro e recuperação por snapshot.
- Cliente desenha todas as animações; servidor valida a simulação resultante por ação.
- Polling por versão como primeira experiência; posteriormente testar SSE, long-poll e WebRTC opcional para aumentar responsividade.
- Até 8 jogadores e salas por código; testar primeiro 1x1, depois 2x2, depois 4x4. O catálogo inicial pode combinar mobiles já prontos, com Aduka incluído ou implementado quando faltar.
- Tempo de turno implementado com `deadline_at` no servidor e transição de timeout na próxima requisição válida, sem processo de jogo contínuo.
- Vento, Thor, terreno e posições partem sempre do snapshot oficial; comando do jogador sozinho não determina impacto.

## A VERIFICAR NA FASE 2
- APIs/sessões/carga reais no Cloud Startup e domínio escolhido.
- Coerência de estado em 8 sessões independentes; chamadas simultâneas; reconexão de celular.
- Precisão e regras desejadas para Dual/T2/SS/Thor.
- Se WebRTC traz valor real suficiente frente a HTTP por turnos.
- Prazo/retorno/retensão de sala e turnos expirados; aplicar retenção sem afetar partidas ativas.

## Evidência
Toda validação futura exige data, branch/commit, ambiente, ações executadas, métricas e resultado. Não apresentar hipótese como funcionalidade entregue.
