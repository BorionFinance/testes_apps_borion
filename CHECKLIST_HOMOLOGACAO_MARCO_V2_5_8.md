# Checklist de homologação — Marco Iris Tecnologia v2.5.8

## Código e pacote

- [x] Todos os JavaScript compilam sem erro de sintaxe.
- [x] Todas as referências locais do `index.html` existem.
- [x] Versões públicas atualizadas para 2.5.8.
- [x] ZIP público sem banco histórico, PDFs reais, planilhas ou outro ZIP privado.
- [x] Manifesto SHA-256 incluído.

## Privacidade

- [x] Olho normal para valores visíveis.
- [x] Olho riscado para valores ocultos.
- [x] Topo e menu lateral sincronizados.
- [x] Visão Geral, OSVs, Clientes, Financeiro, Catálogo e Documentos protegidos.
- [x] Janelas já abertas atualizadas ao alternar.
- [x] Campos monetários protegidos.
- [x] Textos, percentuais, tooltips e campos restaurados sem perda ao mostrar novamente.

## Visão Geral e Faturamento

- [x] Botão Editar módulos afastado da data.
- [x] Grade densa com preenchimento de espaços.
- [x] Redimensionamento pelo canto.
- [x] Largura e altura em passos padronizados.
- [x] Reordenação por arraste.
- [x] Rolagem interna em conteúdo excedente.
- [x] Migração aumenta Faturamento também em perfil antigo.
- [x] Serviços, Produtos, Despesas e Impostos separados.
- [x] Pix, Débito, Dinheiro e Crédito sempre separados.
- [x] Impostos sem duplicidade em Despesas.

## Filtros

- [x] OSV: mês/ano + De + Até + limpar.
- [x] Financeiro: mês/ano + De + Até + limpar.
- [x] Documentos: mês/ano + De + Até + limpar.
- [x] Somente De filtra um dia.
- [x] De/Até filtra intervalo.
- [x] Intervalo invertido é normalizado.
- [x] Status de OSV vem depois do período.
- [x] Arquivadas vem por último e somente como ícone.
- [x] Exportar CSV vem por último e somente como ícone.
- [x] Controles têm altura padronizada.

## Clique por linha

- [x] OSV abre Visualizar OSV.
- [x] Cliente abre Visualizar cliente.
- [x] Financeiro abre Editar lançamento.
- [x] Serviço abre edição.
- [x] Produto abre edição.
- [x] Insumo abre edição.
- [x] Movimentação abre edição.
- [x] Documento abre PDF.
- [x] Controles internos não causam abertura duplicada.
- [x] Linhas podem ser abertas por teclado.

## Clientes

- [x] Colunas na ordem solicitada.
- [x] ID e Data de cadastro presentes.
- [x] Setas e três estados de ordenação nas sete colunas operacionais.
- [x] Arquivados em botão compacto.
- [x] Visualizar cliente sem cabeçalho vazio.
- [x] Visualizar e Editar cliente com Editar layout.
- [x] Primeira abertura de Visualizar cliente já recebe imediatamente o editor visual, sem depender de atraso do navegador.

## Catálogo e Estoque

- [x] Serviços com ID.
- [x] Produtos com ID, Marca e Fornecedor.
- [x] Insumos com ID, Marca e Fornecedor.
- [x] Movimentações com Antes → Depois.
- [x] Movimentações sem Marca/Fornecedor extras.
- [x] Inativos em botão compacto e alinhado.

## Visualização de OSV

- [x] Cabeçalho grande removido.
- [x] X preservado e clicável.
- [x] Janela ampliada no desktop.
- [x] Uma coluna no celular.
- [x] Anexos técnicos depois de Movimentações de estoque.
- [x] Botões de ação padronizados.
- [x] Editar layout disponível.

## Editor visual

- [x] Editor unificado nos formulários operacionais.
- [x] Editor nas visualizações de OSV e cliente.
- [x] Editor complexo antigo removido.
- [x] Arrastar e soltar.
- [x] Redimensionar largura e altura pelo canto.
- [x] Salvar e Cancelar.
- [x] Restaurar padrão persiste e mantém a janela aberta.
- [x] Nova janela reinicia a sessão do editor visual.
- [x] Preferências por perfil e faixa de tela.
- [x] Layout atual preservado na ausência de personalização.

## Menu lateral

- [x] Fixo no desktop.
- [x] Conteúdo da direita rola de forma independente.
- [x] Três ícones: privacidade, salvar e bloquear.
- [x] Os três ícones permanecem disponíveis no celular.
- [x] Botões largos antigos removidos.

## Validação repetida

- [x] Checklist integral executado 20 vezes.
- [x] 113 verificações estruturais por rodada.
- [x] 2.260 afirmações estruturais aprovadas.
- [x] 39 comportamentos em navegador por rodada.
- [x] 780 verificações comportamentais aprovadas.
- [x] Zero falha no conjunto automatizado da versão 2.5.8.
- [x] Integridade final do ZIP verificada.
- [x] Auditor independente executável diretamente da pasta `tests`, sem caminho absoluto externo.

## Homologação conectada ao Google Drive

- [ ] Publicar em repositório/pasta de homologação.
- [ ] Abrir `atualizar.html` ou limpar a versão anterior.
- [ ] Entrar com a conta Google do Marco.
- [ ] Abrir os dados já importados sem refazer a migração.
- [ ] Criar ou editar um registro descartável.
- [ ] Confirmar gravação no Drive.
- [ ] Recarregar em outro dispositivo e confirmar leitura/sincronização.
- [ ] Excluir o registro descartável e confirmar que não retorna.

A etapa conectada não pode ser afirmada sem a conta, autorização e pasta oficial do Marco.
