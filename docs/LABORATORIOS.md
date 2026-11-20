> **STATUS HISTÓRICO:** esta organização de `/labs/` documenta **experimentos de navegador**, não o produto que o proprietário quer construir. A decisão vigente é **Hover Shot como jogo instalável para Windows, com servidor multiplayer próprio**, em [PRODUTO_CANONICO.md](PRODUTO_CANONICO.md). Preservar laboratórios sem tratá-los como produto final.

# Hover Shot — laboratório de versões

**Decisão do proprietário (19/11/2026):** o site `hovershot.online` deve abrir com uma **home que permite escolher entre versões distintas do jogo**. Cada laboratório terá rota própria, ID, estágio de desenvolvimento e regras de isolamento. O proprietário decide em qual experiência entrar, em vez de ficar restrito a um protótipo.

## Organização canônica

- `/`: home de seleção, responsiva, com cards, filtros e detalhes em modal.
- `/labs/craterfall/`: **LAB 01**, base Craterfall importada. Código fonte + licença em `labs/craterfall/`.
- LAB 02: Turnos Online — **planejado, sem backend implementado**.
- LAB 03: Aduka & Mobiles — **planejado, sem código integrado**.
- Outras versões entram pelo mesmo catálogo, cada uma com slug e diretório isolado.

## Isolamento de dados e recursos

**Não criar bancos automaticamente por versão.** O LAB 01 é totalmente local em navegador e não necessita de MySQL. Já existe na Hostinger o banco `u415074840_hovershot` com `.env` privado (conexão PDO validada) para uso futuro do produto; não há vínculo com LAB 01.

Para uma versão com backend, decidir entre **tabelas/esquemas isolados por laboratório** no banco existente e **banco dedicado** conforme independência de migrações, risco de conflito e uso. O proprietário autoriza criar múltiplos bancos, inclusive um por projeto, **se necessário**, após dimensionamento. Cada ambiente persistente terá `lab_id`, versão de engine, controle de migrações, política de retenção e limpeza segura. Jogos não transferem animações quadro a quadro; somente ações discretas e estados determinísticos.

## Primeiro projeto importado — Craterfall

- Código-fonte: https://github.com/blueRonyHazard/craterfall-the-game
- Commit de origem: `0685b15ffa8fd305ad14d0b004add3dc65ae9a3b`
- Licença: MIT, cópia em `labs/craterfall/LICENSE`.
- Importados **91 arquivos** do código, testes, configurações, interface, áudio e recursos textuais; excluídos recursos supérfluos de SO e captura de tela não necessária.
- Motor TypeScript, Phaser 3, Vite; duas pessoas em **duelo local no mesmo dispositivo**, nove armas, terreno destrutível e vento.
- **Não inclui** Aduka nem partidas online; estes requisitos continuam no Roadmap geral, sem falsa alegação de implementação.
- Modificações do Hover Shot: título e link de retorno no `index.html` importado; build com `BASE_PATH=/labs/craterfall/`.

## Compilação e publicação

A raiz contém `site/` e `scripts/build.mjs`. O comando `npm install && npm test && npm run build` produz `dist/index.html` e `dist/labs/craterfall/index.html`. O GitHub Actions executa testes/build e fornece o artefato `hover-shot-dist` por 7 dias. **Ainda não há deploy automático para a Hostinger.** Publicar apenas `dist/`, nunca `.env`, `node_modules`, fontes, testes ou artefatos temporários.

## Estado verificado

- [x] Repositório GitHub de produto acessível com permissões de escrita.
- [x] Laboratório 01 importado com licença e commit de origem fixado.
- [x] Home com três posições, filtros, modal de detalhes e um link para a base importada implementada.
- [x] Banco e `.env` já criados e testados na Hostinger (não usados pelo LAB 01).
- [x] Workflow CI criado no repositório.
- [x] GitHub Actions com testes/build aprovado e branch `site-build` gerada: 11 arquivos, ~1,58 MB, sem sourcemaps, licença MIT preservada.
- [ ] Definir e configurar deploy seguro de `dist/` no domínio, sem interferir com outros sites compartilhados da Hostinger.
- [ ] Confirmar em navegador a home e o Craterfall publicados antes de marcar o laboratório como jogável online.

## Publicação

Consulte [DEPLOY.md](DEPLOY.md). A branch `site-build` está verificada, mas o domínio Hostinger ainda não recebeu esse build nesta operação.

## Priorização atual — 19/11/2026

O proprietário determinou comparar versões originais antes de novas adaptações. Seis opções disponíveis no catálogo da home; ver [PROJETOS_ORIGINAIS.md](PROJETOS_ORIGINAIS.md). As cinco bases adicionais são apontadas como submódulos Git; só Craterfall já está copiado para o build e hospedado no domínio. Os quatro endereços externos abrem jogos mantidos pelos autores; OpenBound é desktop. A antiga lista "LAB 02 planejado / LAB 03 planejado" era um roadmap e não catálogo de jogos prontos; foi removida da home para não confundir.

**Nota técnica:** `site/labs/arena/core.js` é um experimento não integrado e não incluído no build público; não tratá-lo como jogo original ou pronto.
