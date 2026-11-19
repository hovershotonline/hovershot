> **Histórico importado em 19/11/2026:** material do MEM-GPT-VIOLI. Para decisões atuais de laboratórios e estados de implementação, consulte `docs/LABORATORIOS.md` e `docs/STATUS_IMPLANTACAO.md`. Declarações antigas de que o repo não existe ou não tem permissão são anteriores à conexão da conta proprietária.

# GitHub Actions — Hover Shot → hovershot.online

**Registro:** 2026-11-19. **Status da configuração real: PENDENTE DE GRAVAÇÃO em `hovershotonline/hovershot` e de vínculo seguro na Hostinger.** Não declarar CI/CD ativo por existir este template no MEM-GPT-VIOLI.

## Destinos oficiais
- Repositório final: https://github.com/hovershotonline/hovershot
- Domínio final: https://hovershot.online
- Cópia original de pesquisa: `MEM-GPT-VIOLI/projects/hover-shot/` (preservar até importação verificada)
- Workflow pronto para transferência: [templates/.github/workflows/hover-shot.yml](templates/.github/workflows/hover-shot.yml)
- Caminho real a criar no destino: `.github/workflows/hover-shot.yml`

## Arquitetura de entrega recomendada

```text
feature/PR -> GitHub Actions: testes + build
          -> merge na main -> Actions: testes + build
                            -> somente se OK: atualização da branch production
                            -> Hostinger acompanha production e publica em hovershot.online
```

**Motivação:** sem servidor adicional, sem chave SSH no GitHub, sem dependência de GitHub Actions para execução das partidas. Actions só atua no momento de liberar uma versão. O cron da aplicação/estado dos jogos continua exclusivamente na Hostinger.

**Atenção:** essa arquitetura depende de usar a integração nativa de Git com a Hostinger, que permite escolher branch. O Cloud Startup pode compartilhar a conexão GitHub entre sites Node.js do **mesmo plano**. **Antes de associar a conta `hovershotonline` ao hPanel**, verificar se outros sites do plano usam uma conta diferente; não desconectar ou substituir a associação que mantém projetos existentes. Se houver incompatibilidade de conta ou site já configurado de outro modo, escolher alternativa segura (deploy SSH de site estático/PHP em diretório isolado, por exemplo) depois do inventário, e não assumir que o workflow já publicará.

## O workflow entrega

1. Em PR para `main`: baixar código, validar lockfile, rodar `npm ci`, lint/typecheck/test quando scripts existirem, rodar build **obrigatório**.
2. Em push na `main`: repetir a validação e, só após sucesso, avançar a branch `production` com `git push` **sem force**, de forma a preservar o histórico.
3. Se ainda não existe `package.json` (documentação apenas), o workflow encerra com sucesso **sem criar produção**.
4. A Hostinger, se conectada à branch `production`, faz o build/deploy a partir do Git e mantém o aplicativo rodando. O workflow **não usa chaves SSH, senhas de banco nem segredos**.
5. Ambiente GitHub `production`: definir proteção/revisores se o proprietário quiser aprovação manual; a presença do nome de ambiente no workflow não cria aprovação obrigatória por si só.

## Ações restantes para ativar (não executadas)
- [ ] Conectar ao ChatGPT a conta GitHub `hovershotonline` com acesso de escrita ao repositório, para poder fazer a importação e criar o workflow.
- [ ] Inicializar o repositório vazio (pelo menos `README.md`), importar os 10 documentos do MEM-GPT-VIOLI (preferir `docs/`) e transferir `templates/.github/workflows/hover-shot.yml` para `.github/workflows/hover-shot.yml` na raiz.
- [ ] Criar/confirmar `main`; verificar Actions habilitado e `GITHUB_TOKEN` com `contents:write` no **job de promoção**. Conferir regras de proteção da branch `production`; não force-push.
- [ ] Implementar aplicação real e `package.json`/`package-lock.json` com `build`, testes apropriados e código da API.
- [ ] Ao primeiro build verde, confirmar que `production` foi criada. Conectar essa branch ao hPanel **após verificar a conta GitHub atualmente associada a outros sites do Cloud Startup**.
- [ ] Conferir raiz de deploy, build e entry point de Node.js, variáveis de ambiente guardadas **somente na Hostinger**, HTTPS e proteção dos demais sites.
- [ ] Ativar auto-deploy da branch `production`, verificar logs Hostinger e smoke test visual no domínio. **Nenhuma ação em produção antes disso.**
- [ ] Estabelecer rollback testado: reverter `main` em commit próprio e promover para `production`; se não der, usar opção de deployment anterior do painel quando existente.

## Particularidades de segurança
- O GitHub **publica código**, não grava partidas ou backups de banco. `GITHUB_TOKEN` não precisa de permissões globais; somente job de promoção solicita escrita.
- Nunca colocar credenciais no repositório público `hovershotonline/hovershot`, nem em histórico de commits/artifacts.
- Apenas commits da `main` validada podem promover; `production` recebe fast-forward e não é editada manualmente.
- `npm test --if-present` não impõe testes até os scripts existirem; estabelecer testes obrigatórios no primeiro módulo de jogo. Build já é obrigatório assim que existir `package.json`.
- Não publicar nem testar carga no Cloud Startup antes de medir recursos usados por outros sites.

## Documentação oficial
- Hostinger — Node.js e conexão GitHub: https://www.hostinger.com/support/how-to-deploy-a-nodejs-website-in-hostinger/
- Hostinger — deploy de repositório PHP/HTML: https://www.hostinger.com/support/1583302-how-to-deploy-a-git-repository-in-hostinger/
- Hostinger — tutorial de deploy: https://www.hostinger.com/tutorials/how-to-deploy-from-github/
