# Relatório final de revisão e validação — Marco Iris Tecnologia v2.5.8

## Resultado

**Aprovado tecnicamente para publicação.**

A versão foi auditada novamente a partir dos arquivos extraídos do ZIP. Além dos testes oficiais repetidos vinte vezes, foi executada uma auditoria independente com medidas reais no navegador e validação ampliada dos pontos de publicação.

## Correções consolidadas

1. Privacidade completa em módulos, tabelas, campos e janelas abertas, com restauração do conteúdo original.
2. Faturamento com espaço mínimo adequado, inclusive em perfis com layout antigo salvo.
3. Três ações visíveis no topo do celular e três ações equivalentes na lateral.
4. Clique na área inteira das linhas, com acessibilidade por teclado e sem bloquear controles internos.
5. Reinicialização correta do editor visual entre diferentes janelas.
6. Botão **Inativos** alinhado e dimensionado no mesmo padrão das abas.
7. Janela de visualização da OSV ampliada no desktop para comportar as duas colunas sem esmagamento.
8. Botões internos da visualização da OSV padronizados em 34 × 34 px.
9. Aviso de migração financeira desconectada tratado como situação esperada, sem falso erro de console.
10. Primeira abertura de **Visualizar cliente** endurecida para aplicar imediatamente a identificação da janela, o botão **Editar layout** e as alças do editor.
11. Auditoria independente tornada portátil, sem caminho absoluto e sem dependência de arquivo temporário externo ao ZIP.

## Validação estrutural repetida 20x

O script `tests/validar_20x_v258.js` executou:

- 20 rodadas;
- 113 verificações por rodada;
- **2.260 aprovações de 2.260**;
- 0 falha.

Resultado: `RESULTADO_VALIDACAO_20X_V2_5_8.json`.

## Validação comportamental em navegador repetida 20x

O script `tests/validar_navegador_20x_v258.py` executou:

- 20 rodadas;
- 39 comportamentos por rodada;
- **780 aprovações de 780**;
- 0 falha.

Resultado: `RESULTADO_NAVEGADOR_20X_V2_5_8.json`.

## Auditoria independente ampliada

O script `tests/auditoria_independente_v258.py` verificou 57 itens adicionais, incluindo:

- posição fixa real da lateral durante a rolagem;
- sequência e tamanho dos filtros e botões;
- privacidade em todas as páginas e no modal da OSV;
- cliques por mouse e teclado;
- propagação correta dos controles internos;
- colunas solicitadas em todas as tabelas;
- alinhamento do botão Inativos;
- largura real da janela da OSV;
- cabeçalho removido e X corretamente posicionado;
- ordem de Movimentações e Anexos;
- tamanho real dos botões de ação;
- presença de Editar layout nas janelas exigidas;
- redimensionamento real por arraste e persistência;
- rolagem interna de módulos pequenos;
- visualização celular sem estouro horizontal;
- ausência de erros inesperados de runtime/console.

Resultado:

- **57 aprovações de 57**;
- 0 falha.

Arquivo: `RESULTADO_AUDITORIA_INDEPENDENTE_V2_5_8.json`.

## Resultado consolidado

- **3.097 verificações aprovadas de 3.097**;
- 0 falha técnica reproduzível nos testes locais.

## Validação externa obrigatória após publicar

Como o pacote público não contém credenciais privadas, a implantação deve ser encerrada com um teste rápido usando a conta oficial do Marco:

1. autenticar no Google;
2. criar ou editar um registro descartável;
3. salvar;
4. recarregar a página e conferir a persistência;
5. conferir o mesmo registro em outro navegador ou aparelho;
6. excluir o registro de teste e confirmar que ele não retorna;
7. confirmar as restrições da chave e do cliente OAuth no Google Cloud.

O pacote está tecnicamente aprovado para essa publicação conectada.
