# Marco Iris Tecnologia v2.5.8 — pacote certificado para lançamento

Este ZIP contém somente o aplicativo público. Não contém banco histórico, PDFs reais, fotos reais, planilhas de migração, credenciais secretas ou outro pacote privado.

## Resultado da certificação

- 2.260/2.260 verificações estruturais aprovadas;
- 780/780 verificações comportamentais em Chromium aprovadas;
- 57/57 verificações independentes adicionais aprovadas;
- **3.097/3.097 aprovações no total**;
- integridade e manifesto SHA-256 conferidos.

## Publicação segura

1. Faça uma cópia do repositório ou da pasta atualmente publicada.
2. Extraia este ZIP.
3. Publique o conteúdo da pasta principal mantendo a estrutura de diretórios.
4. Não publique o pacote privado de migração.
5. Abra `atualizar.html` uma vez ou faça uma atualização forçada do PWA.
6. Entre com a conta Google autorizada do Marco.
7. Crie ou edite um registro descartável e salve.
8. Recarregue a página e confirme que a alteração permaneceu.
9. Confira o mesmo registro em outro navegador ou aparelho.
10. Exclua o registro de teste e confirme que ele não retorna.

## Google Cloud

O identificador público OAuth e a chave de navegador do Google Picker podem aparecer no código de um aplicativo web. Antes da liberação, confirme no Google Cloud:

- restrição da chave às APIs necessárias;
- restrição por HTTP referrer aos domínios oficiais;
- origens JavaScript e URLs de redirecionamento corretas no cliente OAuth.

O pacote não contém `client_secret`, chave privada ou `refresh_token`.

## Arquivos de auditoria

- `CERTIFICACAO_FINAL_LANCAMENTO_V2_5_8.md`
- `PROMPT_ORGANIZADO_MARCO_V2_5_8.md`
- `CHECKLIST_HOMOLOGACAO_MARCO_V2_5_8.md`
- `RELATORIO_VALIDACAO_V2_5_8.md`
- `RESULTADO_VALIDACAO_20X_V2_5_8.json`
- `RESULTADO_NAVEGADOR_20X_V2_5_8.json`
- `RESULTADO_AUDITORIA_INDEPENDENTE_V2_5_8.json`
- `tests/validar_20x_v258.js`
- `tests/validar_navegador_20x_v258.py`
- `tests/auditoria_independente_v258.py`
- `MANIFESTO_SHA256.txt`


## Testes reproduzíveis

A partir da raiz do pacote, execute:

```bash
node tests/validar_20x_v258.js
python3 tests/validar_navegador_20x_v258.py
python3 tests/auditoria_independente_v258.py
```

Os dois testes de navegador exigem Chromium instalado em `/usr/bin/chromium`. Os resultados são gravados na própria raiz do pacote.

## Revalidação de 23/07/2026

Consulte `RELATORIO_REVALIDACAO_FINAL_20X_2026-07-23.md` para o checklist consolidado, as 20 repetições e os limites externos de implantação.
