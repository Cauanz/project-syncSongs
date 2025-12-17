# SyncSongs

SyncSongs é uma pequena aplicação Flask que analisa pastas de músicas, extrai metadados (hash, duração, bitrate, título, artista) e compara os arquivos com snapshots anteriores armazenados em um banco SQLite. Serve para identificar músicas novas ou duplicadas entre pastas e snapshots.

## Objetivo
- Ser um projeto de estudo para manipulação de arquivos e persistência.

## Requisitos
- Python 3.8+
- pip

Dependências principais:
- Flask
- Flask-SQLAlchemy
- mutagen

Instalar dependências:
```bash
python -m venv .venv
source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install Flask Flask-SQLAlchemy mutagen
```

## Como executar
1. Ative o ambiente virtual.
2. Execute:
```bash
python main.py
```
3. Abra o navegador em `http://127.0.0.1:5000/`.
4. No formulário:
  - Selecione uma pasta local.
  - Escolha um snapshot existente (botão "Selecionar snapshot").
  - Opcional: marque "Salvar snapshot" para persistir o estado atual.
  - Envie para ver a tabela de comparação (New / Duplicated).

## Observações técnicas
- O banco SQLite é `todo.db` (criado automaticamente).
- Snapshots e músicas são persistidos nas tabelas `snapshots` e `songs`.
- A comparação atual baseia-se apenas no hash do arquivo.
- O upload usa o input `file` com `webkitdirectory` — compatível em certos navegadores (Chrome/Edge).

## Estrutura do projeto (resumo)
- main.py — app Flask, rotas principais
- utils.py — análise, hash, salvar snapshot, comparar
- models.py — modelos SQLAlchemy
- templates/ — templates Jinja (home.html, base.html)
- static/ — JS e CSS
- todo.db — banco de dados (gerado em runtime)

## Contribuição e melhorias
Este projeto é educativo; sinta-se à vontade para experimentar localmente (fork/cópia).
