# Hover Shot — laboratório de artilharia por turnos

**Site:** [hovershot.online](https://hovershot.online) · **Repositório de desenvolvimento:** [hovershotonline/hovershot](https://github.com/hovershotonline/hovershot).

Este projeto terá **vários laboratórios acessíveis pela home**, com diferentes motores, regras ou modelos de rede. A prioridade é comparar experiências visualmente e escolher a versão que será evoluída em um jogo multiplayer por turnos de até 8 pessoas. **Aduka é requisito do produto, mas não é o único mobile.**

| Laboratório | Rota prevista | Estado | Banco |
|---|---|---|---|
| 01 · Craterfall | `/labs/craterfall/` | Fonte importada, build/deploy em validação | Não usa banco (duelo local) |
| 02 · Turnos Online | A definir | Planejado | Isolamento a decidir na implementação |
| 03 · Aduka & Mobiles | A definir | Planejado | Isolamento a decidir na implementação |

## Construção

Node.js 22 ou mais recente. Na raiz do repositório: `npm install`, `npm test`, `npm run build`. O bundle de publicação será gerado em `dist/`, incluindo `dist/index.html` e `dist/labs/craterfall/index.html`. GitHub Actions valida e armazena o artefato; o deploy Hostinger será configurado separadamente.

## Licença e crédito

O LAB 01 reutiliza a base [Craterfall](https://github.com/blueRonyHazard/craterfall-the-game), commit `0685b15ffa8fd305ad14d0b004add3dc65ae9a3b`, sob **MIT**, com aviso preservado em [labs/craterfall/LICENSE](labs/craterfall/LICENSE). Tem terreno destrutível, vento e nove armas; é **duelo local 2P**, sem multiplayer ou Aduka nesta etapa.

## Documentação

- [Arquitetura e catálogo de laboratórios](docs/LABORATORIOS.md)
- [Estado de implementação confirmado](docs/STATUS_IMPLANTACAO.md)
- [Roadmap e decisões de pesquisa](docs/ROADMAP.md)
- [Configuração do MySQL da Hostinger](docs/DATABASE_SETUP.md)

**Status:** código e home versionados; não afirmar site publicado até verificar a Hostinger.

## Publicação

✅ CI e build aprovados no GitHub Actions. A branch [site-build](https://github.com/hovershotonline/hovershot/tree/site-build) contém os **arquivos estáticos prontos** (~1,58 MB) e a licença do Craterfall. **Ainda falta o deploy para a Hostinger.** Ver [procedimento de publicação](docs/DEPLOY.md).
