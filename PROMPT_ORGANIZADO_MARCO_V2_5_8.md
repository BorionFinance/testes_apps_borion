# Prompt técnico organizado — Marco Iris Tecnologia v2.5.8

## Missão

Revisar e concluir os ajustes finais do Marco Iris Tecnologia após a importação histórica, preservando integralmente clientes, OSVs, PDFs, lançamentos, estoque, numerações, vínculos com o Borion e a base oficial do Google Drive.

A instrução mais recente prevalece quando houver repetição ou conflito. Não recriar, renumerar, apagar ou importar novamente a base histórica. Não alterar o formato oficial salvo no Google Drive. Não usar cache local como fonte de verdade.

## Regras obrigatórias

1. Trabalhar sobre a versão recebida, sem reescrever o aplicativo do zero.
2. Preservar os layouts atuais como padrão. A aparência só muda quando o usuário entra em **Editar layout** e salva uma personalização, exceto pelo aumento solicitado do módulo Faturamento.
3. Manter desktop, tablet e celular funcionais.
4. Controles internos de uma linha — botões, links, seletores e menus — devem manter sua ação própria sem disparar o clique da linha inteira.
5. Toda mudança visual deve ser validada nas seis telas principais: Visão Geral, Ordens de Serviço, Clientes, Financeiro, Catálogo e Estoque e Documentos.
6. Não incluir banco histórico, PDFs reais, fotos reais, planilhas de migração, credenciais privadas ou pacotes de dados no ZIP público.

## 1. Privacidade global

Implementar um único estado de privacidade para todo o sistema:

- olho normal quando os valores estiverem visíveis;
- olho riscado quando estiverem ocultos;
- todos os botões de olho do topo e do menu lateral devem permanecer sincronizados;
- ocultar valores monetários e percentuais na Visão Geral, Ordens de Serviço, Clientes, Financeiro, Catálogo e Estoque, Documentos e janelas flutuantes já abertas;
- campos monetários em formulários devem ficar visualmente protegidos;
- a ocultação não pode destruir o conteúdo: ao mostrar novamente, os textos, percentuais, tooltips e tipos dos campos devem voltar exatamente ao valor anterior.

## 2. Visão Geral e Faturamento

- Afastar levemente o botão **Editar módulos** da data.
- Usar grade densa, permitindo que módulos menores ocupem espaços vazios abaixo de módulos maiores.
- Permitir redimensionamento pelo canto inferior direito, alterando largura e altura simultaneamente.
- Usar encaixes padronizados, com várias posições intermediárias, em vez de botões separados `+L`, `-L`, `+A` e `-A`.
- Mostrar a prévia do tamanho durante o arraste e confirmar ao soltar.
- Permitir arrastar para reordenar.
- Gerar rolagem interna quando o conteúdo ultrapassar a altura do módulo.
- Garantir que o módulo **Faturamento** seja migrado para uma largura e altura adequadas mesmo em perfis antigos que já tenham layout salvo.
- Separar Receita de Serviços, Receita de Produtos, Despesas e Impostos.
- Exibir Pix, Débito, Dinheiro e Crédito separadamente, inclusive quando zerados; meios adicionais podem aparecer depois.
- Impostos, taxas e tributos não podem ser somados novamente em Despesas.

## 3. Filtros padronizados

Aplicar o mesmo padrão em Ordens de Serviço, Financeiro e Documentos:

1. seletor de mês e ano;
2. campo **De** para o dia inicial;
3. campo **Até** para o dia final;
4. somente **De** preenchido = filtrar exclusivamente aquele dia;
5. **De** e **Até** preenchidos = filtrar o intervalo, inclusive se digitados em ordem invertida;
6. vassoura para limpar;
7. remover o rótulo/calendário redundante “Data”;
8. padronizar altura e proporção dos controles.

Ordem em Ordens de Serviço:

**Nova OSV → mês/ano → De → Até → limpar → status → arquivadas.**

Ordem em Financeiro:

**Novo lançamento → mês/ano → De → Até → limpar → exportar CSV.**

Exportar CSV deve ser somente o ícone de download, com tooltip. Em Documentos, manter o título “PDFs das OSVs” com o mesmo filtro.

## 4. Botões compactos

- Arquivadas/arquivados: somente ícone de arquivo, com tooltip e contagem no título.
- Inativos: somente ícone de desligado/inativo, com tooltip.
- Exportar CSV: somente ícone de download, com tooltip.
- Todos alinhados e com a mesma altura dos controles da barra.

## 5. Clique na linha inteira

- OSV: abrir **Visualizar OSV**.
- Cliente: abrir **Visualizar cliente**.
- Financeiro: abrir **Editar lançamento**.
- Serviço: abrir **Editar serviço**.
- Produto: abrir **Editar produto**.
- Insumo: abrir **Editar insumo**.
- Movimentação: abrir **Editar movimentação**.
- Documento: abrir o PDF correspondente.

Botões, links, seletores e menus internos continuam executando apenas sua ação própria.

## 6. Clientes

Colunas nesta ordem:

**ID → Cliente → Contato → Cidade → Data de cadastro → Ordens → Total movimentado → Ações.**

As sete colunas operacionais devem ter ordenação crescente, decrescente e neutra. Clientes arquivados devem usar botão compacto por ícone.

Na visualização do cliente, remover o cabeçalho vazio, preservar o X no canto e disponibilizar **Editar layout**. A edição do cliente também deve ter **Editar layout**.

## 7. Catálogo e Estoque

### Serviços

**ID → Serviço → Preço padrão → Execuções → Status → Ações.**

### Produtos

**ID → Produto → Marca → Fornecedor → Custo → Margem → Venda → Estoque → Mínimo → Ações.**

### Insumos

**ID → Insumo → Marca → Fornecedor → Custo → Estoque → Mínimo → Ações.**

### Movimentações

**ID → Data → Item → Tipo → Quantidade → Antes → Depois → OSV → Observação → Ações.**

A orientação final é não adicionar Marca, Fornecedor ou outra coluna extra em Movimentações. Exibir apenas o cabeçalho combinado **Antes → Depois**.

## 8. Visualizar OSV

- Remover o cabeçalho grande; manter o X corretamente posicionado.
- Aumentar a largura no desktop sem ultrapassar a tela.
- Usar uma coluna no celular e impedir estouro horizontal.
- Organizar os cartões em: Equipamento/Diagnóstico, Itens/Serviços, Fotos, Financeiro, PDFs oficiais/histórico, Movimentações de estoque e Anexos técnicos.
- Anexos técnicos ficam depois de Movimentações de estoque.
- Padronizar os botões de ação do Financeiro e dos PDFs.
- Adicionar **Editar layout**.

## 9. Editor visual unificado

Aplicar o mesmo editor visual em:

- nova/editar OSV;
- visualizar OSV;
- novo/editar/visualizar cliente;
- novo/editar lançamento;
- serviço, produto, insumo e movimentação.

Requisitos:

- reordenação por arrastar e soltar;
- redimensionamento simultâneo pelo canto;
- encaixe em grade padronizada;
- várias larguras e alturas intermediárias;
- prévia em tempo real;
- Salvar layout, Cancelar e Restaurar padrão;
- Restaurar padrão deve persistir a remoção da personalização sem fechar a janela abruptamente;
- preferências separadas por perfil e por desktop/tablet/celular;
- conteúdo excedente com rolagem interna;
- o editor complexo antigo da OSV não deve aparecer.

## 10. Menu lateral

- Fixar o menu no desktop; somente o conteúdo da direita deve rolar.
- Abaixo do status Drive/Borion, mostrar três ícones: privacidade, salvar e bloquear.
- Remover os botões largos antigos de backup e bloqueio.
- Preservar o Hub Borion e a ordem dos menus.

## Validação obrigatória

1. Executar verificação de sintaxe em todos os arquivos JavaScript.
2. Confirmar que todas as referências locais do `index.html` existem.
3. Confirmar que o pacote público não contém arquivos privados ou históricos.
4. Validar os filtros de dia único, intervalo e mês/ano.
5. Validar ocultação e restauração da privacidade, inclusive em janela aberta.
6. Validar todas as ações de clique por linha e seus controles internos.
7. Validar tabelas e ordenações.
8. Validar redimensionamento, reordenação, salvar, cancelar e restaurar layout.
9. Validar desktop, tablet e celular.
10. Repetir o checklist completo vinte vezes e gerar relatório objetivo de falhas.
11. Não aprovar produção sem testar uma gravação e uma leitura reais na conta Google do Marco em ambiente de homologação.
