# Certificação técnica final de lançamento — Marco Iris Tecnologia v2.5.8

## Situação

**PACOTE CERTIFICADO TECNICAMENTE PARA PUBLICAÇÃO.**

Esta certificação foi emitida após uma nova auditoria integral realizada sobre os arquivos extraídos do ZIP, sem confiar apenas nos relatórios que já acompanhavam o pacote.

## Correções adicionais encontradas na auditoria final

A auditoria ampliada encontrou e corrigiu três defeitos visuais/comportamentais que não haviam sido cobertos suficientemente pelos testes anteriores:

1. O botão compacto **Inativos** estava 8 px abaixo das abas de Catálogo e Estoque.
2. A janela de visualização da OSV ficava limitada a 1120 px no desktop, comprimindo Financeiro, PDFs, Movimentações e Anexos.
3. Alguns botões de ação internos da visualização da OSV chegavam a 44 px de altura em vez do padrão compacto de 34 × 34 px.

Também foi ajustado o tratamento do aviso de migração financeira quando o Google Drive ainda não está conectado. Essa situação esperada passa a ser registrada como aviso, e não como erro inesperado de execução.

## Reconferência final desta entrega

A nova execução sobre o ZIP recebido encontrou dois problemas que impediam uma certificação reproduzível:

1. A primeira abertura de **Visualizar cliente** podia depender do próximo quadro do navegador para receber as classes, o botão **Editar layout** e as alças do editor. A decoração agora é aplicada imediatamente e confirmada novamente no próximo quadro, eliminando a condição de corrida.
2. O auditor independente apontava para uma pasta absoluta antiga e dependia de um JavaScript externo em `/tmp`. O teste foi tornado portátil e passou a usar somente arquivos existentes dentro deste pacote.

Depois dessas correções, os três conjuntos foram executados novamente do zero e aprovados integralmente.

## Resultado consolidado

### Validação estrutural repetida 20 vezes

- 20 rodadas;
- 113 verificações por rodada;
- **2.260 de 2.260 aprovadas**;
- 0 falha.

### Validação comportamental em Chromium repetida 20 vezes

- 20 rodadas;
- 39 comportamentos por rodada;
- **780 de 780 aprovados**;
- 0 falha.

### Auditoria independente ampliada

- **57 de 57 verificações aprovadas**;
- 0 erro inesperado no console;
- desktop e celular validados;
- medidas reais de largura, altura, alinhamento e responsividade conferidas.

### Total auditado

- **3.097 de 3.097 verificações aprovadas**;
- 0 falha técnica reproduzível nos ensaios locais.

## Escopo conferido

A certificação inclui:

- integridade do ZIP e dos arquivos;
- sintaxe dos arquivos JavaScript;
- validade dos arquivos JSON;
- referências locais carregadas pelo `index.html`;
- menu lateral fixo;
- ações de privacidade, salvar e bloquear no topo e na lateral;
- ocultação e restauração de valores em todas as áreas solicitadas;
- filtros padronizados de mês, ano, dia e intervalo;
- ordem, proporção e tooltips dos botões;
- clique na área inteira das linhas e abertura da ação correta;
- tabelas e colunas solicitadas;
- janela ampliada de visualização da OSV;
- cabeçalhos compactos e botões de ação padronizados;
- editor visual de módulos e janelas flutuantes;
- redimensionamento por mouse com encaixes predefinidos;
- rolagem interna em módulos reduzidos;
- comportamento responsivo no celular;
- ausência de estouro horizontal;
- cache/PWA e página de atualização;
- ausência de banco histórico, PDFs reais, fotos, planilhas privadas, `client_secret`, chave privada ou `refresh_token` no pacote público.

## Limite externo da certificação

O pacote não contém e não deve conter as credenciais privadas nem a pasta oficial do Marco. Por isso, dois controles dependem do ambiente real e devem ser confirmados logo após a publicação:

1. Gravar, recarregar e excluir um registro de teste usando a conta Google autorizada do Marco e a pasta oficial do Google Drive.
2. Confirmar no Google Cloud que a chave de navegador e o cliente OAuth estão restritos aos domínios e APIs corretos.

Esses controles externos não indicam defeito encontrado no código. São validações obrigatórias de implantação que não podem ser reproduzidas de forma legítima dentro de um pacote público desconectado.

## Parecer

O ZIP está apto para ser lançado como **Marco Iris Tecnologia v2.5.8**, desde que o teste rápido conectado ao Google Drive seja executado após a publicação e antes de liberar o uso normal.
