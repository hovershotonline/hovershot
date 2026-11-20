# Hover Shot — QA remoto de candidatos multiplayer

**Data:** 20/11/2026. **Status:** ferramenta de teste remoto implementada no GitHub; **nenhum servidor WSS de homologacao provisionado ou validado por esta entrega**. O Hillshot continua apenas um candidato, nao um motor selecionado.

## Finalidade e limite

Testar, de dentro do GitHub Actions (rede externa à Hostinger), um candidato **licenciado** que esteja temporariamente instalado em ambiente privado e isolado. Confirmar HTTPS, servidor acessivel, handshake WSS, sala com dois clientes, inicio de partida e tiro replicado; coletar evidencias no Actions **antes** de convidar avaliadores humanos. Isso valida uma rota de internet real a partir de **uma** rede externa, nao duas pessoas em duas redes distintas, e nao prova qualidade da jogabilidade.

## Artefatos implementados

- `.github/workflows/homologacao-remota.yml`: execucao **exclusivamente manual** (`workflow_dispatch`). Nunca faz deploy, nao modifica DNS, Hostinger, MySQL ou servidores de terceiros. Permissao GitHub read-only.
- `scripts/qa-hillshot.cjs`: modo padrao localhost preservado para o CI principal; modo remoto habilitado apenas por variaveis de ambiente. Reaproveita exatamente o mesmo protocolo de sala/tiro e o `ws` do submodulo fixado.
- A fonte do Hillshot segue travada no commit MIT `4014612e9735b4e9c74dab94abcd941f2301630c`. Sem copia adicional de jogo/arte no build estatico.

## Pre-requisitos de infraestrutura (NAO implementados)

1. Confirmar um **host persistente isolado** que aceite WebSocket de entrada com TLS. Nao presumir que Hostinger Cloud gerenciada receba WSS; nao reutilizar VPS de outro projeto sem auditoria de isolamento, CPU e rede.
2. Configurar DNS e certificado para `homologacao.hovershot.online` (ou `homologacao-<sufixo>.hovershot.online`).
3. Servir o candidato licenciado num processo sem privilegios, com limites de CPU, memoria, conexoes e retenção de logs. Seu proxy precisa encaminhar HTTP e Upgrade WebSocket corretamente, remover o prefixo se aplicavel, e responder `GET /health` com texto **exato** `ok`; `GET /` deve entregar a pagina do candidato.
4. Proteger **HTTP e upgrade WSS** com autenticacao no proxy, nao apenas no HTML ou `robots.txt`. Para automacao, verificar `Authorization: Bearer <token>` no proxy antes de encaminhar as duas rotas; nunca permitir endpoint publico desprotegido. Para humanos, estabelecer mecanismo independente de sessao/cookie e expiracao com HTTPS.
5. Registrar o token aleatorio de homologacao como **secret** GitHub `HOVERSHOT_HOMOLOG_QA_TOKEN` (minimo 24 caracteres aleatorios, sem espacos). Nao usar o segredo SSH de deploy, nao inserir o token em URL, arquivo versionado, log ou print. Definir expiracao/rotacao e revogar ao encerrar testes.

## Execucao manual apos infraestrutura comprovada

1. GitHub → **Actions** → **Hover Shot - Homologacao Multiplayer Remota (manual)** → **Run workflow** (branch `main`).
2. `host` = `homologacao.hovershot.online`, sem protocolo, porta ou barra. Apenas nomes `homologacao*.hovershot.online` sao aceitos; o dominio raiz de producao e outros projetos sao recusados.
3. `prefix` vazio se o servidor atende na raiz, ou `/hillshot` quando o proxy remapeia esse prefixo tanto para HTTP quanto WSS.
4. Ler marcadores: `FRONTEND_HTTP=200`, `WEB_SOCKET=2_JOGADORES`, `SALA=CRIADA_E_COMPARTILHADA`, `TIRO=REPLICADO_EM_DOIS_CLIENTES` e `RESULTADO=HILLSHOT_MULTIPLAYER_REMOTE_SMOKE_OK`. Se falhar, nenhum marcador deve ser interpretado como ambiente aprovado.

O script verifica HTTP e WSS com TLS, sem flag `--insecure`, envia Bearer apenas por headers e evita registrar o token. Os dois clientes simulados usam o mesmo runner externo, portanto ainda nao medem duas redes independentes.

## Gate de qualidade para homologacao do proprietario

- [ ] DNS/TLS e processo do candidato isolado configurados com acesso fechado.
- [ ] Teste remoto acima executado com sucesso no GitHub Actions.
- [ ] Dois **navegadores humanos em redes distintas** acessam a sala por login restrito, criam/entram, miram, disparam, recebem dano, alternam turnos e encerram uma partida.
- [ ] Reconexao, troca de aba, timeout, abandono e testes de concorrencia/uso de recursos avaliados.
- [ ] Comparativo visual/mecanico (forca, vento, delay, terreno, tiros distintos) registrado com apreciacao do proprietario.
- [ ] **Somente depois** registrar uma decisao explicita sobre motor/combinar componentes/rejeitar.

## Isolamento e custo

O workflow remoto so existe para diagnostico sob demanda; nao roda a cada push, nao cria arquivos na Hostinger, nao toca outros sites nem faz polling continuo. O backend de homologacao deve ter tempo de vida definido e limpeza segura de logs temporarios. Fontes, scripts e configuracoes **sem secrets** ficam versionados no GitHub.

**Documentos de autoridade:** [PRODUTO_CANONICO.md](PRODUTO_CANONICO.md), [CATALOGO_PERMANENTE.md](CATALOGO_PERMANENTE.md), [HOMOLOGACAO_ONLINE.md](HOMOLOGACAO_ONLINE.md) e [ROADMAP.md](ROADMAP.md).
