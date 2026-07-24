# Relatório de validação — Marco Iris v2.5.9

Data da validação: 23/07/2026.

## Resultado

- Validação específica das solicitações de layout: **220/220 verificações aprovadas**, em 20 ciclos consecutivos.
- Validação ampla de navegação e regressão: **780/780 verificações aprovadas**, em 20 ciclos consecutivos.
- Total automatizado: **1.000/1.000 verificações aprovadas**.
- Sintaxe de todos os arquivos JavaScript da pasta `js/`: aprovada com `node --check`.
- Referências de CSS/JS/imagens do `index.html`: verificadas, sem arquivos ausentes.
- Responsividade móvel incluída na validação ampla: três ações do topo visíveis e ausência de estouro horizontal.

## Pontos conferidos

1. Olho, salvar e cadeado alinhados na lateral.
2. Menu lateral independente da rolagem do conteúdo.
3. Dashboard sem compactação automática e com coordenadas `x/y` persistentes.
4. Mover um módulo não altera a posição dos demais.
5. Editor de layout ampliado e sem sobreposição entre campos.
6. Remoção do micro-scroll vertical na barra do catálogo.
7. Abertura de OSV, cliente, financeiro, serviços, produtos, insumos, movimentações e documentos.
8. Filtros, privacidade, ações compactas, redimensionamento e modo móvel.

Os resultados detalhados estão em `RESULTADO_VALIDACAO_LAYOUT_V2_5_9.json` e `RESULTADO_NAVEGADOR_20X_V2_5_9.json`.
