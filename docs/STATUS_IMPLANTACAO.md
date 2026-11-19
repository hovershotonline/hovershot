# Hover Shot — evidências verificadas

**Data:** 19/11/2026

**GitHub:** repositório `hovershotonline/hovershot` inicializado e gravado via conta proprietária.

**Lab 01:** 91 arquivos da base Craterfall (MIT) importados do commit `0685b15ffa8fd305ad14d0b004add3dc65ae9a3b`; controles, física, testes e HUD na pasta `labs/craterfall/`. A base original oferece duelo local 2P, não multiplayer online.

**Home:** catálogo responsivo com 3 posições, filtro por estágio, botão de entrar apenas na base importada, modais de detalhes e caminhos estáveis. O link de entrada só será utilizável depois de construir/publicar os arquivos em `dist/`.

**CI:** workflow GitHub Actions já criado. Primeira execução identificou problema no caminho da configuração Vitest; correção feita no `package.json`. Confirmar execução verde antes de declarar build validado.

**Hostinger:** banco `u415074840_hovershot`, usuário `u415074840_hoverapp` e `.env` em `/home/u415074840/domains/hovershot.online/.env` chmod 600; conexão MySQL=OK verificada no log fornecido pelo proprietário. Não armazenar segredos no GitHub.

**Não realizado:** deploy de site no domínio, jogo remoto com 8 jogadores, Aduka, banco isolado para outros labs. Nenhum outro site da hospedagem foi alterado nesta etapa.
