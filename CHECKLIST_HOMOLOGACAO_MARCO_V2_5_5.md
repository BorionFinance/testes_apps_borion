# Checklist de homologação — Marco Iris Tecnologia v2.5.5

## A. Numeração e dados históricos

- [x] Nova OSV gera `OSV-000291` e depois segue a sequência.
- [x] Novo cliente gera `CLI-000143`.
- [x] Novo recebimento gera `REC-000296`.
- [x] Primeira despesa gera `DES-000001`.
- [x] Novo serviço gera `SRV-000044`.
- [x] Novo produto gera `PRD-000034`.
- [x] Novo insumo gera `INS-000010`.
- [x] Nova movimentação gera `MOV-000052`; o contador não retrocede para 16.
- [x] `OSV-000292` de teste não existe nas OSVs, itens, pagamentos, movimentações, anexos ou fila de limpeza.
- [x] IDs válidos de outras entidades, como `REC-000292` e `ITM-000292`, não foram apagados.
- [x] `OSV-000002` continua no histórico, cancelada e com valor zero.
- [x] `OSV-000057` está concluída e paga por R$ 4.000,00.
- [x] Um item da `OSV-000057` tem R$ 4.000,00 e os demais têm R$ 0,00.

## B. Visão Geral

- [x] O cartão Agenda de hoje não aparece com a agenda desativada.
- [x] O cartão Valores a receber mostra valor pendente e quantidade singular/plural de clientes.
- [x] O cartão Estoque crítico separa quantidade crítica e quantidade em atenção.
- [x] O cabeçalho Olá, Marco/Data/Hora está compacto.
- [x] O lápis aparece sem texto, abaixo do relógio, no canto direito.
- [x] Ordens recentes abre a OSV clicando no card.
- [x] A janela da OSV não repete “OSV OSV-000000”.
- [x] Clientes a receber exibe `OSV-000000 · Cliente`.
- [x] O card de cliente a receber abre a OSV.
- [x] Ações do card: Adicionar pagamento, Visualizar PDF, Enviar PDF e Abrir cliente.
- [x] Os botões dos cards seguem a estética do aplicativo.
- [x] A janela do cliente não repete o nome no cabeçalho.
- [x] Alerta de estoque mostra item, tipo, fornecedor, mínimo, estoque e nível.
- [x] Clicar no alerta abre Editar produto ou Editar insumo.

## C. Módulos do painel

- [x] Módulos podem subir/descer.
- [x] Largura pode aumentar/diminuir.
- [x] Altura pode alternar.
- [x] É possível escolher 1, 2, 3 ou 4 colunas.
- [x] A configuração é separada por faixa de tela e perfil.
- [x] O módulo Faturamento existe.
- [x] Faturamento pode filtrar por dia, mês ou ano.
- [x] O gráfico principal seleciona o período.
- [x] A composição financeira mostra Serviços, Produtos, Despesas e Impostos.
- [x] A composição por forma de pagamento mostra Pix, Dinheiro, Cartão etc. conforme os dados.

## D. Ordenação e visualização

- [x] Ordens de serviço possui ordenação nos sete cabeçalhos úteis.
- [x] Clientes possui ordenação nos cinco cabeçalhos úteis.
- [x] Financeiro possui ordenação nos oito cabeçalhos úteis.
- [x] Produtos possui ordenação nos sete cabeçalhos úteis.
- [x] Serviços possui ordenação nos quatro cabeçalhos úteis.
- [x] Insumos possui ordenação nos cinco cabeçalhos úteis.
- [x] Movimentações possui ordenação nos oito cabeçalhos úteis.
- [x] Documentos possui ordenação nos quatro cabeçalhos úteis.
- [x] Primeiro clique: descendente.
- [x] Segundo clique: ascendente.
- [x] Terceiro clique: ordem original.
- [x] Linha/colunas/quadrados muda imediatamente.
- [x] Cada uma das oito seções guarda sua própria visualização.
- [x] A preferência fica no perfil e reaparece após novo login.

## E. Ordens de serviço e PDFs

- [x] Menu Ações está exatamente na ordem: Adicionar pagamento, Gerar PDF, Visualizar PDF, Enviar PDF, Abrir cliente, Editar OSV.
- [x] Gerar PDF entra em segundo plano e libera a tela imediatamente.
- [x] PDFs históricos importados são aceitos como históricos válidos.
- [x] PDF histórico não é bloqueado pela mensagem “PDFs estão desatualizados”.
- [x] Nova versão de PDF não apaga a versão histórica no mesmo clique.

## F. Salvamento

- [x] Salvar fecha/libera a janela sem aguardar toda a comunicação com a nuvem.
- [x] Alterações são enviadas em fila serial.
- [x] Cada revisão usa um snapshot imutável.
- [x] Uma segunda edição durante o primeiro envio não é perdida.
- [x] Se o Drive confirmar e o bridge falhar, o dado principal continua confirmado e o bridge tenta novamente.
- [x] Se o Drive não confirmar, o aplicativo mantém a revisão pendente e tenta novamente.
- [x] Há aviso antes de fechar a página com alterações pendentes.
- [x] Cache/local storage não se torna a fonte oficial dos dados.

## G. Filtros e estoque

- [x] OSVs, Financeiro e Documentos usam o mesmo filtro Data.
- [x] Mês/ano funciona sem exigir dia.
- [x] Um único dia, como `10`, mostra somente o dia 10.
- [x] Intervalo, como `10-31`, filtra o intervalo.
- [x] A vassourinha limpa mês, ano e dias.
- [x] Movimentações mostra Quantidade e Estoque Antes → Estoque Depois.

## H. Atualizar custo

- [x] Cadastro é somente leitura.
- [x] Custo atual é somente leitura.
- [x] Novo custo é editável.
- [x] A margem usa a barra deslizante.
- [x] Alterar a margem recalcula o preço.
- [x] Alterar o preço recalcula a margem.
- [x] Salvar atualiza custo, margem, preço e histórico.
- [x] O mesmo vínculo margem/preço está disponível em Produtos e Insumos.

## I. Interface e pacote

- [x] Menu lateral permanece fixo no desktop durante rolagem longa.
- [x] Remoção do título redundante não remove o botão de fechar.
- [x] Agenda inicia desativada em instalações novas e no perfil importado.
- [x] Ativar a agenda devolve menu, indicadores e módulos relacionados.
- [x] Pacote público não contém PDFs, planilhas, CSV, JSON migrado ou dados de clientes.
- [x] Pacote privado contém dados e mídias e está identificado como NÃO PUBLICAR.
- [x] Testes são portáveis e recebem as pastas por argumento, sem depender de caminho interno fixo.

## J. Homologação real obrigatória

- [ ] Publicar o ZIP público em um endereço de teste.
- [ ] Entrar com a conta Google real do Marco.
- [ ] Selecionar a pasta privada de migração no Drive.
- [ ] Confirmar a próxima OSV, cliente, REC, DES, serviço, produto, insumo e movimentação na conta real.
- [ ] Salvar alterações simultâneas em dois dispositivos.
- [ ] Gerar, abrir e baixar um PDF real.
- [ ] Enviar um PDF real pelo WhatsApp.
- [ ] Confirmar integração com o Borion sem reprocessar dados históricos.
