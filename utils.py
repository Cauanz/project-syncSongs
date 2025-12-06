import hashlib
import os
from datetime import datetime
import json
from mutagen import File

def hash_song(path):
  hasher = hashlib.sha256()

  for chunk in iter(lambda: path.read(4096), b""):
    hasher.update(chunk)

  return hasher.hexdigest()

def save_snapshot(data):
  os.makedirs('snapshots', exist_ok=True)
  name = datetime.now().isoformat().replace(":", "-")
  path = f"snapshots/{name}.json"

  with open(path, 'w', encoding="utf-8") as f:
    json.dump(data, f, indent=2)

  return path

def analyze_song(path):

  audio = File(path)
    
  info = {
      "filename": path.filename.split('/')[1],
      "pathname": path.filename.split('/')[0],
      "hash": hash_song(path),
      "duration": audio.info.length if audio and audio.info else None,
      "bitrate": audio.info.bitrate if audio and audio.info else None,
      "title": audio.tags.get("TIT2").text[0] if audio and audio.tags and "TIT2" in audio else None,
      "artist": audio.tags.get("TPE1").text[0] if audio and audio.tags and "TPE1" in audio else None,
      "status": "Mapped"
  }

  return info

def compare_folders(snapshot):
  with open(f"snapshots/{snapshot}.json", "w") as s:
    print(s)
    pass
  # TODO - SIMPLES, LÊ SNAPSHOT E RODA UMA FUNÇÃO DE COMPARAÇÃO POR HASH (TALVEZ COMPARAÇÃO COMPOSTA, POR NOME, DURAÇÃO TAMBÉM, NÃO SEI)
# TODO - SE MÚSICA X EXISTIR NO SNAPSHOT ANTERIOR, MUDA STATUS PARA EXISTENTE/NEW ETC...




















