# Relatório de revalidação final 20× — Marco Iris Tecnologia v2.5.8

Data da auditoria: **23/07/2026**

## Parecer

A versão recebida já continha a implementação dos ajustes finais descritos por Marco. A auditoria foi refeita sem confiar apenas nos relatórios anteriores. Não foi identificado defeito funcional reproduzível no escopo solicitado.

O único problema encontrado estava no pacote de certificação: o arquivo `MANIFESTO_SHA256.txt` ficou desatualizado após a reexecução dos testes. O manifesto foi regenerado no pacote final e passou a validar integralmente.

## Checklist consolidado dos pedidos

### Privacidade global

- [x] Um único estado de privacidade em todas as telas.
- [x] Olho normal com valores visíveis e olho riscado com valores ocultos.
- [x] Botões do topo e do menu lateral sincronizados.
- [x] Valores ocultos em Visão Geral, OSVs, Clientes, Financeiro, Catálogo/Estoque, Documentos e modais.
- [x] Campos monetários protegidos sem perder o valor original.
- [x] Valores e tooltips restaurados corretamente ao reexibir.

### Visão Geral e módulo Faturamento

- [x] Botão de edição dos módulos afastado da data.
- [x] Grade densa com preenchimento de espaços vazios.
- [x] Redimensionamento de largura e altura pelo canto inferior direito.
- [x] Encaixes padronizados e prévia durante o arraste.
- [x] Reordenação por arrastar e soltar.
- [x] Rolagem interna em módulo menor que o conteúdo.
- [x] Faturamento ampliado para gráfico e composição financeira.
- [x] Receita de serviços, produtos, despesas e impostos separados.
- [x] Pix, Débito, Dinheiro e Crédito separados, inclusive quando zerados.

### Filtros de período

- [x] Mesmo padrão em OSVs, Financeiro e Documentos.
- [x] Seletor de mês/ano, campos De e Até e vassoura para limpar.
- [x] Apenas De preenchido filtra um único dia.
- [x] De e Até filtram intervalo inclusive em ordem invertida.
- [x] Rótulo/calendário redundante removido.
- [x] Ordem correta dos controles na tela de OSVs.
- [x] Ordem correta dos controles no Financeiro.
- [x] Exportar CSV reduzido a ícone com tooltip.
- [x] Controles com altura e proporção padronizadas.

### Cliques e ações

- [x] Linha de OSV abre Visualizar OSV.
- [x] Linha de cliente abre Visualizar cliente.
- [x] Linha financeira abre Editar lançamento.
- [x] Serviços, produtos, insumos e movimentações abrem suas edições.
- [x] Linha de documento abre o PDF correspondente.
- [x] Botões, links, menus e seletores internos mantêm suas próprias ações.
- [x] Linhas também funcionam por teclado.

### Clientes

- [x] Colunas: ID, Cliente, Contato, Cidade, Data de cadastro, Ordens, Total movimentado e Ações.
- [x] Ordenação crescente, decrescente e neutra nas colunas operacionais.
- [x] Arquivados reduzido a ícone com tooltip.
- [x] Cabeçalho vazio removido da visualização.
- [x] Botão X reposicionado e preservado.
- [x] Editar layout disponível em visualizar e editar cliente.

### Catálogo e Estoque

- [x] Serviços com coluna ID.
- [x] Produtos com ID, Produto, Marca e Fornecedor na ordem correta.
- [x] Insumos com ID, Insumo, Marca e Fornecedor na ordem correta.
- [x] Movimentações com cabeçalho combinado Antes → Depois.
- [x] Sem coluna Marca ou Fornecedor em Movimentações, conforme correção final do pedido.
- [x] Inativos reduzido a ícone compacto e alinhado às abas.

### Visualização de OSV

- [x] Cabeçalho grande removido e X mantido.
- [x] Janela ampliada no desktop sem ultrapassar a tela.
- [x] Layout de uma coluna no celular sem estouro horizontal.
- [x] Anexos técnicos posicionados depois de Movimentações de estoque.
- [x] Botões de ações financeiras e PDFs padronizados.
- [x] Editar layout disponível.

### Editor visual unificado

- [x] Disponível em OSV, cliente, financeiro, serviço, produto, insumo e movimentação.
- [x] Disponível também nas visualizações de OSV e cliente.
- [x] Redimensionamento simultâneo pelo canto.
- [x] Reordenação por arrastar e soltar.
- [x] Encaixe em grade e várias dimensões intermediárias.
- [x] Salvar, Cancelar e Restaurar padrão.
- [x] Preferências separadas por perfil e faixa de tela.
- [x] Layout padrão atual preservado até o usuário editar e salvar.
- [x] Editor complexo antigo da OSV removido do fluxo.

### Menu lateral

- [x] Menu fixo no desktop; conteúdo da direita rola independentemente.
- [x] Abaixo do status Drive/Borion aparecem olho, salvar e bloquear.
- [x] Botões largos antigos removidos.
- [x] Hub Borion e ordem dos menus preservados.

## Execuções realizadas

### Validação estrutural 20×

- 20 rodadas.
- 113 verificações por rodada.
- **2.260/2.260 aprovadas**.
- 0 falha.

### Validação comportamental em Chromium 20×

- 20 rodadas.
- 39 comportamentos por rodada.
- **780/780 aprovados**.
- 0 falha.

### Auditoria independente ampliada

- **57/57 verificações aprovadas**.
- 0 erro inesperado de runtime/console no ambiente de ensaio.
- Desktop e celular conferidos.

### Total do escopo funcional

- **3.097/3.097 verificações aprovadas**.
- 0 falha reproduzível.

## Integridade e publicação

- [x] Sintaxe de todos os JavaScript validada.
- [x] JSONs válidos.
- [x] Todas as referências locais do `index.html` existem.
- [x] ZIP testado sem erro de CRC.
- [x] Manifesto SHA-256 regenerado e conferido.
- [x] Não há banco histórico, PDFs reais, fotos reais, planilhas privadas, `client_secret`, chave privada ou `refresh_token` no ZIP.

## Verificações externas obrigatórias após publicar

Estas duas verificações não podem ser certificadas dentro do ZIP desconectado:

1. Entrar com a conta Google autorizada do Marco, criar um registro de teste, recarregar, editar e excluir, confirmando leitura e gravação na pasta oficial do Drive.
2. Confirmar no Google Cloud que a chave de navegador e o cliente OAuth estão restritos aos domínios e APIs corretos.

A chave de API de navegador fica no front-end por natureza; sua segurança depende das restrições configuradas no Google Cloud.
