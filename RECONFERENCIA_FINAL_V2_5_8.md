# Reconferência final — Marco Iris Tecnologia v2.5.8

## Parecer

**Aprovado tecnicamente para publicação**, com a ressalva obrigatória do teste conectado ao Google Drive após subir no ambiente de homologação.

## Problemas encontrados no ZIP recebido

1. A primeira abertura de **Visualizar cliente** podia ocorrer antes da aplicação das classes e controles do editor visual.
2. O auditor independente não era reproduzível: usava uma pasta absoluta antiga e um arquivo JavaScript temporário que não acompanhava o ZIP.

## Correções aplicadas

- decoração de janelas aplicada imediatamente e confirmada no próximo quadro do navegador;
- visualização do cliente abre desde a primeira tentativa com classe correta, **Editar layout** e alças de redimensionamento;
- auditoria independente passou a usar caminhos relativos e o arquivo `tests/auditoria_independente_v258.js` incluído no pacote;
- relatórios e resultados foram regenerados após as correções.

## Resultado automatizado final

- validação estrutural: **2.260/2.260** aprovações em 20 rodadas;
- validação comportamental Chromium: **780/780** aprovações em 20 rodadas;
- auditoria independente desktop/mobile: **57/57** aprovações;
- total: **3.097/3.097** verificações aprovadas;
- JavaScript sem erro de sintaxe;
- JSONs válidos;
- referências locais existentes;
- sem credenciais privadas, banco histórico, PDFs reais ou planilhas de migração no pacote público.

## Teste obrigatório após publicar

Entrar com a conta Google autorizada do Marco, criar ou editar um registro descartável, confirmar a gravação no Drive, recarregar em outro dispositivo e excluir o registro para confirmar que ele não reaparece.
