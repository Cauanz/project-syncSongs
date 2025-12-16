import hashlib
import os
from datetime import datetime
import json
from mutagen import File
from models import Snapshot, Song, db

def hash_song(path):
  hasher = hashlib.sha256()

  for chunk in iter(lambda: path.read(4096), b""):
    hasher.update(chunk)

  return hasher.hexdigest()

def save_snapshot(data):
  # os.makedirs('snapshots', exist_ok=True)
  name = datetime.now().isoformat().replace(":", "-")
  # path = f"snapshots/{name}.json"

  snapshot = Snapshot(name=name)
  db.session.add(snapshot)
  db.session.commit()

  for song in data:
    print(song)
    new_song = Song(
      filename=song['filename'],
      pathname=song['pathname'],
      hash=song['hash'],
      duration=song['duration'],
      bitrate=song['bitrate'],
      title=song['title'],
      artist=song['artist'],
      snapshot_id=snapshot.id
    )

    db.session.add(new_song)
    db.session.commit()

  # with open(path, 'w', encoding="utf-8") as f:
  #   json.dump(data, f, indent=2)
  songs = Song.query.all()
  return songs

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

  songs = Song.query.filter_by(snapshot_id=snapshot).all()
  comparedSongs = []
  seen_hashes = set()
  snapshot_hashes = {song.hash for song in songs}


  for new_file in folder:
    hash = new_file['hash']

    if hash in snapshot_hashes:
      new_file['status'] = 'Duplicated'
    elif hash in seen_hashes:
      new_file['status'] = 'Duplicated'
    else:
      new_file['status'] = 'New'

    # TODO - AINDA NÃO SEI OQUE CLASSIFICARIA UMA MÚSICA COMO "UPDATED"
    seen_hashes.add(hash)
    comparedSongs.append(new_file)  

  return comparedSongs


# def compare_folders(snapshot, folder):

#   with open(f"snapshots/{snapshot}.json", "r") as s:
#     data = json.load(s)
#     comparedSongs = []
#     seen_hashes = set()
#     snapshot_hashes = {song['hash'] for song in data}


#     for new_file in folder:
#       hash = new_file['hash']

#       if hash in snapshot_hashes:
#         new_file['status'] = 'Duplicated'
#       elif hash in seen_hashes:
#         new_file['status'] = 'Duplicated'
#       else:
#         new_file['status'] = 'New'

#       seen_hashes.add(hash)
#       comparedSongs.append(new_file)

#     s.close()
#   return comparedSongs

  # TODO - SIMPLES, LÊ SNAPSHOT E RODA UMA FUNÇÃO DE COMPARAÇÃO POR HASH (TALVEZ COMPARAÇÃO COMPOSTA, POR NOME, DURAÇÃO TAMBÉM, NÃO SEI)
# TODO - SE MÚSICA X EXISTIR NO SNAPSHOT ANTERIOR, MUDA STATUS PARA EXISTENTE/NEW ETC...

# * STATUS DOS ARQUIVOS PODE SER MAPPED/NEW/UNCHANGED/UPDATED













# ! OBSOLETO, MAS SALVAR EM JSON PODE SER UTIL PARA OPERAÇÕES MENORES
# def save_snapshot(data):
#   os.makedirs('snapshots', exist_ok=True)
#   name = datetime.now().isoformat().replace(":", "-")
#   path = f"snapshots/{name}.json"

#   with open(path, 'w', encoding="utf-8") as f:
#     json.dump(data, f, indent=2)

#   return path