# Hover Shot — alternativas reais após playtest do Rembound

Data: **19/11/2026 (America/Sao_Paulo)**. Estado: **investigação de fontes, não instalação**.

## Descoberta e objetivo

O proprietário testou o Rembound local e constatou que a arquitetura social foi recriada, mas a experiência do combate não é suficientemente próxima do GunBound. Não confundir sprites/nomes com gameplay reproduzido. Próxima fase: testar um **referencial clássico** e um **motor de código inspecionável** contra critérios de aceitação objetivos, antes de desenvolver mais mecânicas no Hover Shot.

## Comparativo de opções

| Alternativa | Como experimentar | Evidência verificada | Limite |
| --- | --- | --- | --- |
| [DragonBound](https://dragonbound.net/) | Navegador no site do operador, sem instalação | Site ativo e guia oficial do próprio jogo descreve salas, controles, Shot 1/2/SS e servidor **9 Aduka**. Fonte: https://dragonbound.net/guide/servers | Não temos código/licença para hospedar ou derivar. É referência prática de experiência, não código-base. |
| [GunBound Classic — Thor's Hammer](https://gunboundclassic.net/) | Cliente Windows oferecido pelo operador | Site atualizado em 2026, servidor comunitário, referência de jogabilidade clássica | Servidor não oficial, depende de download de executável de terceiro; riscos de compatibilidade/segurança e direitos sobre cliente/assets. Não instalar automaticamente. |
| [GunBros](https://github.com/skelzer/gunbros-public) | Laboratório local via Node >=22 e pnpm, comando `pnpm dev`; modo sandbox em `http://localhost:5173/sandbox?a=aduka&b=turtle&map=temple&sky=thor` | Código da versão `49cb4a876688361c37dcc9e1613efc1b12f15dd2` em `packages/shared/src/data/mobiles/aduka.ts` tem `s2.behaviour='thorCall'` (beam) e SS com 3 chamadas Thor, `sky.thor` com níveis, 18 mobiles, S1/S2/SS, vento, delay. `README.md` documenta sandbox sem servidor online. | **Não foi executado neste ambiente.** Não há LICENSE raiz no repositório inspecionado; não publicar em Hover Shot sem autorização. O próprio autor diz ser jogo autoral inspirado nos clássicos, não reprodução calibrada/legítima de assets do GunBound. |
| [GunBound Season 2 para browser (anúncio de 28/10/2026)](https://forum.ragezone.com/threads/development-gunbound-s2-rebuilt-for-browsers-not-dragonbound.1276576/) | Fórum de desenvolvimento; pedir demo ao autor | Autor afirma 20 mobiles, tiros S1/S2/SS, física da versão 672 e Thor | São alegações do autor, **sem verificação independente de jogabilidade ou disponibilidade de demo**. |
| [GunBound World Champion oficial da Bratty! Studios](https://gunbound.gg/) | Aguardar lançamento/beta | Site oficial afirma licenciamento Softnyx, Windows/macOS, servidor **ainda não aberto** | Não indicar como opção de jogar agora. FAQ informa que data oficial de lançamento será divulgada nos canais oficiais. |

## Observações técnicas

Rembound `aduko.secondary` em `src/features/game/engine/projectile-behaviors.ts` é `airSplit` de 2 projéteis, enquanto GunBros `aduka.s2` dispara sinalizador que chama a coluna Thor (`thorCall`); isso é uma diferença verificada **entre as duas implementações**, não afirmação de equivalência de dano, física ou sensação com GunBound original.

A auditoria em `skelzer/gunbros-public` confirmou `packageManager=pnpm@11.11.0`, `node>=22`, frontend Vite+Canvas, backend Node+ws; `README` orienta `pnpm install` + `pnpm dev`. A versão local do proprietário Windows antes não tinha `node.exe` no PATH, então um instalador de GunBros deve provisionar Node e pnpm de forma idempotente, sem interferir em Rembound/Bun/SpacetimeDB. Nunca publicar o código no domínio sem licença.

**Risco de direitos:** Bratty! Studios, operador licenciado do novo GunBound, declara que está emitindo notificações de cessação contra servidores privados não autorizados: https://www.bratty.gg/. Estudar mecânicas e construir software original não é a mesma coisa que republicar clientes, marcas e assets protegidos. Antes de uma plataforma pública, exigir revisão de direitos.

## Próxima execução proposta

1. **Benchmark imediato**: jogar DragonBound, especialmente servidor Aduka, e registrar exatamente o que agrada/desagrada em vento, mira/potência, Thor, delay, tiros e dinâmica de partida. Não alegar que a experiência é idêntica.
2. **Segundo experimento local:** executar o sandbox do GunBros em Windows com código original e dependências isoladas, verificar visual e tiros, comparar com DragonBound.
3. Se ambos insuficientes, avaliar OpenBound desktop (GPL3, dependências/assets faltantes) ou buscar demonstração validada do projeto HTML5 672.
4. Escolher base técnica apenas mediante playtest e teste de reprodução de mecânicas, usando critérios e medições próprios, sem copiar mídia ou marcas do GunBound. Rembound continua como referência de lobby, não motor de combate aceito.

## Evidências pendentes
- [ ] Playtest DragonBound pelo usuário.
- [ ] GunBros compilado, executado e avaliado localmente (sandbox).
- [ ] Checklist comparativo documentado por mobile/shot, começando por Aduka.
- [ ] Licença clara para qualquer código/arte que for publicado no Hover Shot.
