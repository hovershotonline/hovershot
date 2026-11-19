> **Histórico importado em 19/11/2026:** material do MEM-GPT-VIOLI. Para decisões atuais de laboratórios e estados de implementação, consulte `docs/LABORATORIOS.md` e `docs/STATUS_IMPLANTACAO.md`. Declarações antigas de que o repo não existe ou não tem permissão são anteriores à conexão da conta proprietária.

# Hover Shot — MySQL e arquivo .env na Hostinger

**Atualização:** 2026-11-19. **Estado: BANCO E .env CRIADOS E VALIDADOS POR EXECUÇÃO REAL do proprietário.** A conexão MySQL por PDO passou. Nenhuma credencial ou senha foi inserida no GitHub.

## Identificação
- Produto: Hover Shot.
- Domínio Hostinger: `hovershot.online`.
- Conta SSH: `u415074840`, porta `65002`; nenhum comando deve modificar outros domínios.
- Banco proposto: `u415074840_hovershot`.
- Usuário MySQL dedicado proposto: `u415074840_hoverapp`.
- Host MySQL para Node.js: `127.0.0.1`, porta `3306` (documentação oficial).
- Destino privado: `/home/u415074840/domains/hovershot.online/.env`, **fora de** `public_html`. Não versionar, não colocar em pasta pública.
- Senha gerada no servidor com `random_bytes`, garantido mínimo de uma maiúscula, uma minúscula e um número. Nunca imprimir em terminal ou respostas.

## API verificada em documentação
`POST https://developers.hostinger.com/api/hosting/v1/accounts/u415074840/databases`

Body:
```json
{"name":"hovershot","user":"hoverapp","password":"<gerada somente durante execucao>","website_domain":"hovershot.online"}
```

A API adiciona prefixo de conta automaticamente. Prévia segura via:
- `GET /api/hosting/v1/accounts/u415074840/databases?search=hovershot&per_page=100`
- `GET /api/hosting/v1/accounts/u415074840/databases?domain=hovershot.online&per_page=100`

Token na hospedagem: testar `~/.hostinger_api_token` primeiro e `~/.api_token` em seguida **sem imprimir conteúdo**. Caso o token seja de outro serviço, falhar sem alterar recursos; nunca enviar token via chat. Todas as chamadas usam `Authorization: Bearer`.

## Contrato do .env
```dotenv
APP_NAME=HoverShot
APP_URL=https://hovershot.online
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_NAME=u415074840_hovershot
DB_USER=u415074840_hoverapp
DB_PASSWORD=<SEGREDO_NAO_VERSIONADO>
DB_CHARSET=utf8mb4
```

Não colocar uma senha real neste documento. O projeto Node precisa carregar explicitamente esse arquivo fora de `public_html` ou registrar as mesmas chaves no ambiente do app pelo hPanel. **Criar arquivo não equivale a reiniciar nem publicar Node.js.**

## Guardrails
1. Conferir usuário SSH e `/domains/hovershot.online/public_html` existente, sem symlinks.
2. Não criar diretórios de produção nem usar um diretório de outro site por engano.
3. Se `.env` existir: **não sobrescrever**; checar credenciais esperadas e `SELECT DATABASE()`, reportar resultado.
4. Se banco ou usuário já existir sem `.env`: interromper, não criar duplicata e não rotacionar senhas.
5. Se outro banco estiver atribuído ao domínio: interromper para inventário.
6. Só usar API com token validado por GET; POST com senha gerada em memória.
7. Criar `.env` com modo `0600`, fora da webroot, somente quando POST confirmar sucesso.
8. Validar conectividade local por `PDO` e `SELECT DATABASE()`. Não criar tabelas sintéticas, não alterar outros bancos.
9. Nenhuma exclusão de banco automático no caso de falha parcial; manter o resultado explícito para reconciliação.
10. Não salvar logs com senhas, Bearer tokens, payloads de requisições ou URLs assinadas.

## Incidente real de autenticação e correção — 2026-11-19

**EXECUÇÃO CONFIRMADA pelo proprietário:** SSH e validação do domínio passaram; GET `/api/hosting/v1/accounts/u415074840/databases` retornou **HTTP 401**. Como o script encerrou antes do POST, **nenhum banco nem .env foi criado por essa execução**.

**Diagnóstico:** endpoint/HTTP Bearer confirmados no SDK oficial. O script anterior escolheu automaticamente `~/.hostinger_api_token` ou `~/.api_token`, mas a credencial encontrada foi recusada pela API. Não assumir que `~/.api_token` pertence à Hostinger; **não sobrescrevê-lo**, pois pode pertencer a outro serviço.

**Correção preparada:** gerar/obter token válido em https://hpanel.hostinger.com/profile/api e utilizar prompt protegido `Read-Host -AsSecureString` no PowerShell. Enviar token **apenas por SSH criptografado**, temporariamente no script em memória, sem armazená-lo em arquivo ou GitHub. O comando completo repete preflight, confere existência de banco, executa uma única criação idempotente por prechecks, salva `.env` modo 600 e valida PDO; se token novo falhar, reporta só código HTTP.

**Status:** procedimento corrigido em preparação; próximo comando ainda precisa ser executado pelo proprietário. O resultado da criação deve ser registrado aqui somente após evidência real.

## Token local comprovado — 2026-11-19

**VALIDADO PELO PROPRIETÁRIO (resultado do PowerShell):** o token Hostinger foi gravado criptografado via Windows DPAPI em `%LOCALAPPDATA%\\HoverShot\\Secrets\\hostinger-api-token.dpapi`. `DPAPI=OK`, `HOSTINGER_API=AUTENTICADA`, `RESULTADO=TOKEN_SALVO_E_VALIDADO`. Aviso local para renovar em **17/12/2026**. A data é de lembrete; o prazo real decorre da emissão no painel da Hostinger.

**Decisão de segurança revisada:** a API da Hostinger será consumida **diretamente no PC** lendo o token DPAPI; não transportar o token ao servidor via SSH, não copiar para `~/.api_token`, não incluir na linha de comando/URL/arquivo do projeto. Somente a credencial MySQL gerada localmente atravessa o canal SSH criptografado para criar o `.env` privado.

**Resiliência planejada:** uma credencial MySQL provisória será guardada como DPAPI no PC enquanto houver criação incompleta; se o POST da Hostinger funcionar mas SSH falhar, o comando seguinte poderá terminar o `.env` sem trocar senhas. Após `MYSQL=OK` e confirmação de `.env`, apagar a credencial DPAPI provisória. Não gravar credencial em logs, GitHub ou resposta.

## Falha de validação na primeira tentativa com token local — 2026-11-19

**SAÍDA REAL FORNECIDA PELO PROPRIETÁRIO:** `ESTADO=ENV_AUSENTE`, API autenticada pelo token Windows, preflight GET bem-sucedido, credencial MySQL gerada/protegida via DPAPI, POST create database recusado com **HTTP 422**. Logo a execução **não gravou .env**, e a criação do banco não foi confirmada. Não presumir que o POST criou banco; reconferir GET antes de nova tentativa.

**Hipótese concreta:** senha gerada por código anterior = `Hs9!` + 48 dígitos hexadecimais, portanto **52 caracteres**. A documentação oficial deste endpoint só identifica 422 como erro de validação; uma outra família de bancos da Hostinger documenta senha até 50 caracteres, o que torna o excesso de tamanho hipótese forte, **ainda não causa comprovada**. Preferir nova senha com `Hs9` + 16 bytes aleatórios hexadecimais (**35 caracteres**), após confirmar via GET que nenhum banco/usuário previsto existe. Não reutilizar a senha provisória de 52 caracteres para a nova chamada.

**Procedimento de recuperação:** Windows usa token Hostinger DPAPI; GET read-only dos bancos e usuário; preflight SSH e ausência de `.env`; proteger senha nova via DPAPI; tentar POST somente uma vez; em 422 ler **apenas campos/regras de validação sanitizados** da resposta, sem imprimir token, senha ou payload; se 200, criar `.env` exclusivamente fora de `public_html` via SSH, conferir permissão 600 e testar PDO; remover senha temporária só ao verificar sucesso. Não alterar outros domínios ou bancos existentes.

## Evidência conclusiva: banco e .env prontos — 2026-11-19

**EXECUÇÃO REAL reportada pelo proprietário (log PowerShell + SSH):** `DOMINIO=VALIDADO`, `ENV=AUSENTE`, `BANCO_EXISTENTE=NAO` antes da criação, senha provisória `SENHA_MYSQL_TAMANHO=35`, `BANCO_API=CRIADO`, `BANCO=u415074840_hovershot`, `USUARIO=u415074840_hoverapp`, `ENV=/home/u415074840/domains/hovershot.online/.env`, `PERMISSOES_ENV=600`, `MYSQL=OK`, `RESULTADO=HOVERSHOT_BANCO_ENV_CRIADOS`, `CREDENCIAL_MYSQL_TEMPORARIA=REMOVIDA`, `RESULTADO=HOVER_SHOT_MYSQL_PRONTO`.

**Interpretação:** houve provisionamento real do banco via API Hostinger, criação real de .env privado e teste de conexão MySQL em execução remota. **Ainda não** significa que backend Node, schema de partidas, site, GitHub Actions ou deploy tenham sido ativados. O token de API permanece DPAPI no Windows; o material de pesquisa/roadmap não armazena senha.

## Estado de testes
- [x] Endpoint oficial e modelo de payload conferidos no SDK oficial Hostinger.
- [x] PHP do comando validado com `php -l` e wrapper Bash com `bash -n` **em ambiente local de preparação**.
- [x] Comando original executado pelo usuário: falhou em 401 antes de POST (não alterou banco/.env).
- [x] Token de 30 dias gravado no Windows por DPAPI e autenticado na API (relato validado pela saída enviada em 2026-11-19).
- [x] Primeira execução com token DPAPI local executada: POST devolveu 422, `.env` ausente, senha de 52 caracteres armazenada provisoriamente.
- [x] Recuperação executada com senha aleatória de **35 caracteres** após consulta à API confirmar `BANCO_EXISTENTE=NAO`.
- [x] API confirmou `BANCO_API=CRIADO` (POST bem-sucedido). **Ainda não houve inspeção separada pelo painel após a criação**, mas PDO funcionou.
- [x] `.env` criado em `/home/u415074840/domains/hovershot.online/.env` com permissão 600, fora de `public_html`.
- [x] Conexão MySQL validada no servidor por PDO (`MYSQL=OK`).
- [x] Credencial MySQL temporária DPAPI local removida depois da confirmação de sucesso; token Hostinger DPAPI retido no Windows.
- [ ] Backend Node.js configurado para consumir a credencial de forma segura, quando o app existir.

## Fontes
- SDK oficial Hostinger: https://github.com/hostinger/api-python-sdk/blob/main/docs/HostingDatabasesApi.md
- Modelo do payload: https://github.com/hostinger/api-python-sdk/blob/main/hostinger_api/models/hosting_v1_databases_create_database_request.py
- Criando banco: https://www.hostinger.com/support/1583542-how-to-create-a-new-mysql-database-in-hostinger/
- Node + MySQL: https://www.hostinger.com/support/connecting-a-hostinger-mysql-database-to-a-node-js-application/
