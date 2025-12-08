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

def compare_folders(snapshot, folder):

  temp_folder = []
  for song in folder:
    formattedSong = analyze_song(song)
    temp_folder.append(formattedSong)
  


  with open(f"snapshots/{snapshot}.json", "r") as s:
    data = json.load(s)
    for snap_file in data:
      # ! ACHO QUE O LOOP ESTÁ ERRADO, NÓS ITERAMOS SOBRE TODA A NOVA PASTA ANTES DE MUDAR PARA SEGUNDA MÚSICA DO SNAPSHOT
      for new_file in temp_folder:
        
        if snap_file["hash"] == new_file["hash"]:
          new_file['status'] = 'Unchanged'
        else:
          new_file['status'] = 'New'
        # TODO - AINDA NÃO SEI OQUE CLASSIFICARIA UMA MÚSICA COMO "UPDATED"
        s.close()
  return temp_folder

  # TODO - SIMPLES, LÊ SNAPSHOT E RODA UMA FUNÇÃO DE COMPARAÇÃO POR HASH (TALVEZ COMPARAÇÃO COMPOSTA, POR NOME, DURAÇÃO TAMBÉM, NÃO SEI)
# TODO - SE MÚSICA X EXISTIR NO SNAPSHOT ANTERIOR, MUDA STATUS PARA EXISTENTE/NEW ETC...





# * STATUS DOS ARQUIVOS PODE SER MAPPED/NEW/UNCHANGED/UPDATED














