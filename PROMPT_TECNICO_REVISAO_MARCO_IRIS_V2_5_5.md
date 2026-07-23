# Prompt técnico definitivo — Marco Iris Tecnologia v2.5.5

Execute uma revisão integral do Marco Iris Tecnologia após a migração histórica. Trate cada requisito abaixo como obrigatório. Não aprove a versão apenas por encontrar textos ou funções no código: execute testes de dados, DOM, interação e concorrência. Preserve a arquitetura cloud-only, o histórico importado e a separação absoluta entre pacote público e pacote privado.

## 1. Regras inegociáveis

1. O Google Drive continua sendo a fonte oficial.
2. O salvamento local pode existir apenas como apoio técnico/snapshot confirmado; jamais pode ressuscitar estado antigo ou substituir o Drive.
3. Não apagar IDs válidos para “corrigir sequência”. Cada prefixo possui contador independente.
4. Não publicar dados, PDFs, planilhas, fotos, JSON migrado ou credenciais.
5. Alterações de interface não podem retirar o botão de fechar, o botão voltar ou qualquer meio de sair de uma janela.
6. Nenhuma ação de salvar ou gerar PDF pode bloquear a interface até terminar o upload.
7. Toda preferência visual deve pertencer ao perfil ativo.

## 2. Contadores e correções históricas

O estado privado deve carregar exatamente estes próximos códigos:

- OSV: 291 → `OSV-000291`;
- CLI: 143 → `CLI-000143`;
- REC: 296 → `REC-000296`;
- DES: 1 → `DES-000001`;
- SRV: 44 → `SRV-000044`;
- PRD: 34 → `PRD-000034`;
- INS: 10 → `INS-000010`;
- MOV: 52 → `MOV-000052`.

A migração contém somente MOV-000001 a MOV-000015, mas o ambiente operacional já utilizou até MOV-000051. Portanto, MOV deve preservar o watermark 52 e nunca ser recalculado para 16.

Aplicar também:

- remover a OSV de teste 000292 e todos os vínculos dela;
- não remover `REC-000292`, `ITM-000292` ou qualquer ID 292 pertencente a outra entidade;
- manter `OSV-000002` no histórico como Cancelada e valor zero;
- manter o recebimento dela em R$ 0,00 para não alterar a numeração REC;
- corrigir `OSV-000057` para total R$ 4.000,00, status Concluída e pagamento Pago;
- concentrar R$ 4.000,00 em exatamente um item da OSV-000057 e manter os demais itens zerados.

## 3. Salvamento em segundo plano

Implementar fila serial de revisões:

1. Ao salvar, validar internet e configuração do Drive.
2. Atualizar o estado em memória e a interface imediatamente.
3. Capturar um snapshot imutável daquela revisão.
4. Enfileirar a revisão sem aguardar o upload.
5. Permitir fechar a janela e continuar usando o aplicativo.
6. Coalescer revisões quando seguro, sem marcar uma revisão como confirmada usando snapshot diferente.
7. Se uma nova alteração entrar durante o primeiro upload, enviar depois um snapshot que contenha essa segunda alteração.
8. Confirmar `LAST_CONFIRMED_STATE` somente com o snapshot realmente enviado.
9. Se o estado principal for salvo e o bridge do Borion falhar, confirmar o Drive e repetir apenas o bridge.
10. Se o Drive falhar, manter a revisão pendente, mostrar aviso e tentar novamente.
11. Exibir aviso `beforeunload` enquanto houver revisão pendente.

Criar teste de corrida: salvar A, iniciar upload lento, alterar para B durante o upload, salvar B e comprovar que o último snapshot remoto contém B.

## 4. PDF em segundo plano e PDFs históricos

- Gerar PDF sem bloquear modal ou navegação.
- Impedir duas gerações simultâneas da mesma OSV.
- Mostrar status de processamento e permitir continuar usando o app.
- Preservar PDFs anteriores e históricos.
- Considerar histórico qualquer PDF marcado como `legacy`, `legacyImported`, `importedLegacy`, `historicalImported` ou `generatedByCurrentApp === false`.
- Um PDF histórico não depende do fingerprint atual e não deve disparar erro de desatualização.
- O botão Visualizar PDF deve abrir o artefato histórico disponível.

## 5. Visão Geral

Substituir Agenda de hoje, quando agenda estiver desligada, por:

- Valores a receber;
- valor atual das pendências;
- quantidade de clientes, com singular/plural.

Substituir Estoque em alerta por:

- Estoque crítico;
- quantidade crítica;
- quantidade em atenção.

Compactar o bloco Olá, Marco/Data/Hora. Colocar somente o ícone de lápis abaixo do relógio, à direita.

### Módulos

Manter:

- Ordens recentes;
- Clientes a receber;
- Alertas de estoque;
- Faturamento;
- Agenda de hoje somente se o módulo agenda estiver ativo.

Permitir:

- mover para cima/baixo;
- arrastar;
- alterar largura;
- alterar altura;
- selecionar 1, 2, 3 ou 4 colunas;
- salvar por perfil e faixa de tela.

### Faturamento

Disponibilizar período Dia/Mês/Ano, gráfico por período selecionável e dois detalhamentos:

1. composição financeira: Receita de Serviços, Receita de Produtos, Despesas e Impostos;
2. formas de pagamento: Pix, Dinheiro, Débito, Crédito etc.

## 6. Cards operacionais

### Ordens recentes

- Exibir `OSV-000000 · Cliente`.
- Clicar no card abre detalhes da OSV.
- Não repetir “OSV OSV-000000” no título da janela.

### Clientes a receber

- Exibir `OSV-000000 · Cliente`.
- Clicar no card abre a OSV.
- Ações, nesta ordem: Adicionar pagamento, Visualizar PDF, Enviar PDF, Abrir Cliente.
- Uniformizar estética dos botões.
- Ao abrir cliente, não repetir o nome no cabeçalho.

### Alertas de estoque

Exibir:

- nome;
- Produto ou Insumo;
- fornecedor;
- Mínimo X;
- Estoque Y;
- Crítico ou Atenção.

Clicar abre o formulário de edição do cadastro correto.

## 7. Ordenação de tabelas

Replicar a ordenação de Produtos em:

- Ordens de serviço;
- Clientes;
- Financeiro;
- Produtos;
- Serviços;
- Insumos;
- Movimentações;
- Documentos.

Ciclo obrigatório por cabeçalho:

1. descendente;
2. ascendente;
3. padrão/original.

Não transformar a coluna Ações em coluna ordenável.

## 8. Modos de visualização

Linha, colunas e quadrados devem:

- mudar imediatamente no mesmo clique;
- ter chave independente para cada uma das oito seções;
- não compartilhar a mesma preferência entre Produtos, Serviços, Insumos e Movimentações;
- persistir por perfil e reaparecer após novo login.

## 9. Ações das OSVs

Na tabela de OSVs, usar exatamente:

1. Adicionar pagamento;
2. Gerar PDF;
3. Visualizar PDF;
4. Enviar PDF;
5. Abrir cliente;
6. Editar OSV.

## 10. Agenda

- `settings.modules.agenda` deve iniciar `false`.
- Agenda desligada remove menu, KPI e widget sem apagar registros.
- Ativar a agenda restaura todos os elementos relacionados.

## 11. Filtros de data

Padronizar OSVs, Financeiro e Documentos:

- rótulo Data com ícone de calendário;
- seletor de mês e ano;
- campo opcional `Dias 10-31`;
- vazio mostra o mês inteiro;
- `10` mostra somente dia 10;
- `10-31` mostra o intervalo;
- vassourinha limpa mês/ano/dias.

## 12. Movimentações

Adicionar coluna `Estoque Antes → Estoque Depois`, mantendo também a quantidade. Persistir `stockBefore` e `stockAfter` no registro da movimentação e recalcular corretamente após edição.

## 13. Atualizar custo

Aplicar em Produtos e Insumos:

- Cadastro bloqueado;
- Custo atual bloqueado;
- Novo custo editável;
- barra Nova margem bruta;
- Novo preço de venda;
- mover margem recalcula preço;
- digitar preço recalcula margem;
- salvar atualiza custo, preço, margem, data e histórico.

Usar a fórmula de margem bruta já adotada pelo app: `preço = custo / (1 - margem)`.

## 14. Menu lateral e janelas

- No desktop, menu lateral deve ficar fixo durante rolagem longa.
- Ocultar apenas o texto redundante do cabeçalho dos detalhes.
- Manter o botão de fechar visível, clicável e acima do conteúdo.

## 15. Empacotamento

### ZIP público

Pode conter somente aplicação, assets e documentação. Proibir:

- PDFs históricos;
- fotos;
- XLS/XLSX;
- CSV;
- JSON migrado;
- pasta migration;
- dados de clientes.

### ZIP privado

Deve conter o JSON migrado, mídias, manifesto, auditoria, testes e aviso NÃO PUBLICAR.

## 16. Critério de aprovação

Executar e registrar:

- sintaxe de todos os JavaScript;
- integridade dos dados e referências;
- hashes das mídias migradas;
- separação público/privado;
- Chromium headless com DOM e interações;
- corrida de salvamento;
- PDF em segundo plano;
- ZIP testado depois da compactação.

Não declarar homologação externa sem testar a conta Google real, o Drive real, o WhatsApp real e dois dispositivos reais. A saída correta é “aprovado localmente; homologação externa pendente”.
