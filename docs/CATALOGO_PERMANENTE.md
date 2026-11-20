# Hover Shot — contrato permanente de versões no site

**Decisão explícita do proprietário: 20/11/2026. Válida até segunda ordem.**

## Finalidade e regras inegociáveis

O Hover Shot (`https://hovershot.online/`) é **um jogo e um laboratório permanente de versões online no navegador**. A home é uma galeria de jogos de artilharia para estudar experiência, gráficos, controles, menus, tecnologia, física e multiplayer. O usuário deve poder testar os diferentes jogos para decidir o que incorporar ao **Hover Shot próprio**, sem eliminar o catálogo no futuro.

1. **Todas as versões ficam no catálogo**. Versões comparativas permanecem visíveis mesmo depois de começar o desenvolvimento. Não substituir a home por landing de um único motor ou apagar jogos anteriores por conta própria.
2. **Hover Shot, versão em desenvolvimento, é sempre uma das opções**, no primeiro card. Não anunciar uma engine como escolhida sem decisão expressa do proprietário. Quando uma base for aprovada, associá-la a esse item e criar ambiente de teste próprio, preservando as referências originais.
3. **Sempre dois caminhos independentes quando disponíveis**: (a) jogar a cópia instalada em `hovershot.online` e (b) abrir a versão original/autor **em nova aba**. Mesmo os jogos hospedados localmente mantêm o link externo. Para projeto sem demo pública comprovada, o link externo abre a página/repositório original, identificado corretamente como tal.
4. **Sem licença para hospedagem/redistribuição:** manter o card e o link externo do autor, sem copiar código/arte para a hospedagem. Um link não implica licença de uso. Não prometer que demos de terceiros estejam disponíveis se não forem verificadas.
5. **Separar estados**: `hospedado aqui` somente para arquivos realmente implantados; `externo` para demo do autor; `código de referência` para repo sem demonstração; `backend pendente` quando instalação não tiver servidor; `em desenvolvimento` para o nosso jogo. HTTP 200 não equivale a multiplayer validado.
6. **Todo jogo fica isolado**: rota própria, fonte/licença/versão identificadas; submódulo ou fonte versionada no GitHub, sem duplicação desnecessária, sem alterar os demais labs. O backend de cada candidato que depender de WebSocket deve funcionar em infraestrutura real antes de exibir `Jogar aqui`.
7. **Atualização permanente de documentação:** registrar cada inclusão, exclusão autorizada, licenciamento, tecnologia, origem, commit, deploy/rollback e playtest no Roadmap, no status de implantação e no catálogo canônico. Manter ideias, decisões, implementações e evidências verificadas distintas.
8. **Preservação da infraestrutura:** Hostinger apenas sob diretório do projeto; manter os demais domínios, MySQL, `.env` e os arquivos dos jogos existentes intactos. Versionar código e instaladores no GitHub; temporários só no diretório autorizado e apagados após conclusão.

## Fonte única de verdade do catálogo

`site/catalog.json` define os cards e links; `scripts/render-catalog.mjs` gera HTML estático e dados do modal na compilação. Não duplicar manualmente contagem ou cards entre arquivos. `tests/catalog.test.mjs` impede exclusões de links externos e publicação acidental de jogos sem direito declarado.

**Campos:** `id`, `name`, `status` / `statusLabel`, `summary`, `tech`, `license`, `tags`, `localUrl`, `externalUrl`, `externalLabel`, `repoUrl`, `externalIsDemo`, `multiplayer`, `note`. O `externalUrl` é obrigatório mesmo quando existe `localUrl`.

No primeiro catálogo ampliado: **13 opções**, das quais **2 realmente implantadas** em `/labs/guntanks/` e `/labs/craterfall/`. Os demais são referências externas ou candidatos com backend ausente. O jogo próprio Hover Shot é card de desenvolvimento, **não uma terceira partida**.

## Como testar/decidir uma engine

A seleção não depende de smoke CI local ou de um link do autor. Quando permitido, disponibilizar candidato licenciado em homologação com backend real sob o domínio, testar pelo navegador em redes distintas, analisar menus/arte/jogabilidade/conexão/uso de recursos e colher decisão do usuário. A regra de manter toda a galeria e os links externos continua depois da escolha.

## Publicação automatizada do catálogo

**Decisão de infraestrutura:** novas versões estáticas e home devem ser publicadas por GitHub Actions, sem depender de PowerShell recorrente. O job `deploy-hostinger` só roda após build/QA e usa o segredo SSH cadastrado uma vez pelo proprietário. O script não apaga versões ausentes do build; atualiza arquivos novos/alterados e restaura anteriores se falhar. Ver [DEPLOY_GITHUB_ACTIONS.md](DEPLOY_GITHUB_ACTIONS.md). **Ainda não declarar deploy ativo enquanto não houver execução SSH verificada.**

## Publicação incremental do catálogo

Os artefatos vêm da branch `site-build` depois do CI. A atualização do catálogo altera **apenas `index.html`, `assets/home.css`, `assets/home.js` e o marcador do commit de origem**. Preservar `/labs/` e todos os serviços e arquivos alheios. Nenhuma alteração no banco. Usar preflight, atualização com rollback temporário, checar SHA, HTTP e conteúdo; remover temporários ao final. A branch compilada não é sinônimo de deploy na Hostinger.

## Testes e estado
- [x] Decisão permanente do proprietário documentada.
- [x] Catálogo declarado como dado único com 13 opções, fontes e links externos.
- [x] Teste automatizado de links independentes e de apenas dois labs hospedados incluído.
- [x] Home compilada, teste de 13 cards/links e publicação da branch `site-build` verificados no GitHub Actions (run `44672290910`, conclusão `success`, SHA `e17f249bc4df2c9e54823f82113b2aa1e0ce7964`).
- [ ] Publicação da home ampliada em `hovershot.online` verificada por HTTP real e marcador de origem.
- [ ] Avaliação das opções pelo usuário e posterior escolha de motor, sem remover o catálogo.

**Não atualizar esta política por inferência; somente mediante instrução explícita do proprietário.**
