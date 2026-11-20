# Contrato de importação local — Hover Shot

**Nova prioridade do usuário:** jogos que já existem devem rodar no próprio `hovershot.online`. **Link externo ou submódulo Git sozinho não equivale a importação jogável.** As versões originais não devem ser disfarçadas de protótipos próprios.

## Estado real
- Craterfall: fonte MIT integrada, build anterior publicado no site com HTTP 200 (confirmado pelo proprietário).
- Guntanks: **primeira importação de jogo original adicional em execução real no nosso build**. `masag0/Guntanks` commit fixado `072c2312abec19089149c211751ffec7311d69d4`, licença `ISC` no package. `scripts/package-guntanks.mjs` exige o commit exato e copia recursos usados pelo runtime: HTML, CSS, JS bundle, tanques, terreno, quatro áudios e dois ícones. Não carrega `gunbound_icons` nem outros elementos não utilizados; remove source map de depuração.
- Rembound: MIT para código, porém frontend Next.js depende de backend SpacetimeDB (Rust) não instalável como site estático. A subpasta `sources/originals/rembound` é **fonte de referência, não página jogável**. Necessário plano de migração de backend e auditoria dos assets, sem imitar a UI vazia.
- Artillery P2P e Scorched Tanks: **licença de redistribuição ausente** nos repositórios consultados. GitHub público não significa permissão de republicar código e mídia em outro domínio. Fontes registradas por submódulo; requerem autorização do autor ou licença verificável para hospedagem local.
- OpenBound: GPL-3.0 para código C#/MonoGame, requer vários serviços e pacote gráfico que não é distribuído. Não existe versão browser para copiar. Uma conversão de runtime é um projeto novo.

## Regras operacionais
1. Cada projeto efetivamente instalado deve ter um caminho `/labs/<slug>/` com *artefatos locais executáveis*, script de build, política de licença, verificação funcional e saída auditável.
2. Na home, botão **Jogar no Hover Shot** só existe se o build local gerar a versão correspondente; sem redirecionamento mascarado ou iframe de domínio de terceiros.
3. Até confirmar publicação, diferenciar `build concluído` de `site remoto validado`.
4. Fonte original fica congelada por SHA para permitir comparação; sem modificar motor, UI ou balanceamento do Guntanks nesta fase (a única mudança visível é o link de retorno).
5. Diretórios só podem conter recursos de runtime necessários: não enviar PSD, screenshots, source maps nem conteúdo redundante para a Hostinger.
6. Bancos MySQL separados apenas para laboratórios com backend real, nunca para páginas estáticas.
7. Implementar e validar após CI; primeiro deploy precisa de backup e rollback restrito ao domínio Hover Shot.

## Evidência
- GitHub Actions já executou ao menos um build bem-sucedido da pipeline de importação do Guntanks (run `44651072472` em 19/11/2026); home e testes do catálogo passaram por ajustes posteriores e ainda precisam de nova verificação.
- Nenhum comando SSH foi executado para atualizar o servidor nesta etapa. A versão atual do site pode continuar com os links externos anteriores até deploy.
