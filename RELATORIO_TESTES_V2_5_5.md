# Relatório de reconferência — Marco Iris Tecnologia v2.5.5

## Resultado

A versão v2.5.4 foi reaberta, comparada item por item com a solicitação consolidada e executada novamente em testes estruturais, de dados e de navegador.

A reconferência encontrou falhas reais que não deveriam ter sido aprovadas na entrega anterior:

1. O pacote privado mantinha `nextIds.MOV = 16`, embora o marco operacional informado fosse `MOV-000051` e a próxima movimentação devesse ser `MOV-000052`.
2. Os testes da v2.5.4 continham caminhos absolutos internos em `/mnt/data/work/...`; por isso, não eram reproduzíveis depois de extrair os ZIPs entregues.
3. A regra que retirava o cabeçalho duplicado dos detalhes escondia todo o cabeçalho da janela, inclusive o botão de fechar.
4. A fila de salvamento podia confirmar uma revisão mais nova usando um estado capturado em outro momento durante uma condição de corrida.
5. O módulo Faturamento mostrava a composição financeira, mas não a composição por forma de pagamento.
6. A janela Atualizar custo aplicava o cálculo interligado de margem e preço somente aos produtos, embora a solicitação também citasse os insumos.

Todos esses pontos foram corrigidos na v2.5.5.

## Correções de dados

- Próxima OSV: `OSV-000291`.
- Próximo cliente: `CLI-000143`.
- Próximo recebimento: `REC-000296`.
- Próxima despesa: `DES-000001`.
- Próximo serviço: `SRV-000044`.
- Próximo produto: `PRD-000034`.
- Próximo insumo: `INS-000010`.
- Próxima movimentação: `MOV-000052`, preservando o marco operacional informado e sem retroceder para `MOV-000016`.
- `OSV-000292` de teste removida da coleção de OSVs e de todos os vínculos relacionais.
- `OSV-000002` preservada no histórico, marcada como cancelada e com recebimento em R$ 0,00.
- `OSV-000057` concluída e paga, com total de R$ 4.000,00; exatamente um item concentra os R$ 4.000,00 e os demais permanecem zerados.
- 289 PDFs históricos continuam classificados como importados e presentes somente no pacote privado.

## Correções funcionais

- Salvamento otimista em segundo plano, com snapshots imutáveis por revisão, fila serial, coalescência segura e aviso antes de sair quando ainda houver alteração pendente.
- Geração de PDF em segundo plano, sem manter a janela travada.
- PDFs históricos podem ser visualizados sem serem barrados como “desatualizados”.
- Ordenação em três cliques nas oito tabelas solicitadas: descendente, ascendente e ordem original.
- Visualização em linha, colunas ou quadrados aplicada imediatamente e armazenada separadamente por seção e perfil.
- Agenda desativada por padrão e restaurada integralmente quando ativada.
- Painel compacto, lápis abaixo do relógio, edição dos módulos, largura, altura, ordem e quantidade de colunas.
- Faturamento por dia, mês ou ano, com composição financeira e composição por forma de pagamento.
- Filtros de data padronizados em OSVs, Financeiro e Documentos, incluindo mês/ano, dia único, intervalo e limpeza.
- Estoque Antes → Estoque Depois nas movimentações.
- Módulos Ordens recentes, Clientes a receber e Alertas de estoque ajustados conforme o padrão solicitado e com ações clicáveis.
- Atualizar custo com Cadastro e Custo atual bloqueados; margem e preço de venda interligados em Produtos e Insumos.
- Menu lateral mantido fixo no desktop durante a rolagem.
- Cabeçalhos redundantes ocultados sem retirar o botão de fechar das janelas.

## Testes executados

### Estrutura, dados e separação dos pacotes

- **31/31 aprovados**.
- Validação dos contadores, correções das OSVs, referências relacionais, PDFs, ausência de dados privados no pacote público, versão, assets, sintaxe JavaScript e marcadores de todas as funcionalidades.

### Navegador Chromium headless

- **36/36 aprovados**.
- **0 erros de página**.
- Foram exercitados os contadores, painel, módulos, colunas, redimensionamento, ordenação, modos de visualização, filtros, custo/margem/preço, ações das OSVs, abertura dos cards, agenda, PDFs históricos, PDF em segundo plano e corrida de duas revisões de salvamento.

### Integridade da migração histórica

- **56/56 aprovados**.
- Foram validadas contagens, IDs, vínculos, regras de histórico, 547 arquivos do manifesto, hashes, tamanhos, conflitos e simulação da migração.

### Total

- **123/123 verificações automatizadas aprovadas**.

### Reconferência dos ZIPs finais

Depois da compactação, os dois ZIPs foram testados com `unzip -t`, extraídos em uma pasta nova e as três suítes foram executadas novamente usando somente os arquivos extraídos:

- **31/31** estrutura, dados e separação;
- **36/36** Chromium headless, com **0 erros de página**;
- **56/56** integridade da migração e hashes.

Isso confirma que os testes são portáveis e que os artefatos entregues, não apenas as pastas de trabalho, reproduzem os resultados locais.

## Limites da aprovação

A aprovação acima é local e automatizada. Nenhuma credencial real foi usada. Permanecem obrigatórios, antes da liberação definitiva:

- entrar com a conta Google real do Marco;
- importar o pacote privado na pasta de teste do Drive;
- criar e editar registros em dois dispositivos simultaneamente;
- gerar e abrir um PDF real no Drive;
- testar o envio real pelo WhatsApp;
- confirmar que o bridge do Borion recebeu somente alterações novas e não reimportou o histórico.

O pacote público pode ser publicado. O pacote privado não pode ser enviado ao GitHub, GitHub Pages, Netlify ou qualquer hospedagem pública.
