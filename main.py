from flask import Flask, render_template, url_for, request, redirect
from utils import hash_song, save_snapshot, analyze_song
import os
import json

app = Flask(__name__)

folder = []
old_snapshot = ""

@app.route('/')
def index():
  songs = []
  seen_hashes = set()

  for song in folder:
    hash = song['hash']

    if hash in seen_hashes:
      song['status'] = 'Duplicated'
      song['options'] = 'Remove'
      songs.append(song)
      continue

    seen_hashes.add(hash)
    songs.append(song)
  # TODO - CONTINUAR ESSE FILTRO (PROVAVELMENTE VAI FICAR MAIOR GANHANDO E ADICIONANDO FUNÇÕES PARA EXCLUIR DUPLICATAS (NO FRONTEND), ETC...)
  return render_template('home.html', songs=songs)

@app.route('/check-folder', methods=["POST"])
def check_folder():

  temp_files = []
# TODO CRIAR UM "ESTADO" UMA VARIAVEL QUE MONITORA QUANDO ESTÁ CARREGANDO PARA ENVIAR E RENDERIZAR O LOADING NO FRONTEND


  if request.method == 'POST':
    files = request.files.getlist('selectfolder')

    try:
      for file in files:
        temp_files.append(file)
        # file.read() # RETORNA OS BYTES DO ARQUIVO

        newSong = analyze_song(file)

        folder.append(newSong)
    except Exception as e:
      print('An exception occurred when analyzing the folder', e)

    save_snapshot(folder)

  return redirect('/')

# TODO - SE MÚSICA X EXISTIR NO SNAPSHOT ANTERIOR, MUDA STATUS PARA EXISTENTE/NEW ETC...


@app.route('/choose-snapshot', methods=['POST', 'GET'])
def choose_snapshot():

  if request.method == 'GET':
    files = os.listdir('snapshots')
    return json.dumps(files)
  redirect('/')


if __name__ == '__main__':
  app.run(debug=True)