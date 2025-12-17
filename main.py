from flask import Flask, render_template, url_for, request, redirect, Response, session
from utils import hash_song, save_snapshot, analyze_song, compare_folders
import os
import json
from models import db, Song, Snapshot

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///todo.db' 
app.secret_key = b'WNIafisu//,..gB8W,.HG0/sagb.w~-hp~wqhogb'
db.init_app(app)

with app.app_context():
  db.create_all()


folder = []
comparedSongs = []

# TODO - PENSAR EM SOLUÇÃO PARA QUANDO NÃO TEM SNAPSHOTS AINDA

@app.route('/')
def index():
  return render_template('home.html', comparedSongs=comparedSongs)


@app.route('/check-folder', methods=["POST"])
def check_folder():

  temp_files = []

  if request.method == 'POST':
    snapshot = request.form['selectsnapshot']
    newFolder = request.files.getlist("selectfolder")
    snapshot_true = request.form.get('savesnapshot')
    
    analyzed_songs = [analyze_song(file) for file in newFolder]
    comparedSongs = compare_folders(snapshot, analyzed_songs)

    temp_files.extend(newFolder)
    #* PARTE QUE SALVA PASTA/CRIA NOVO SNAPSHOT
    if snapshot_true:
      try:
        for file in newFolder:
          temp_files.append(file)
          # file.read() #* RETORNA OS BYTES DO ARQUIVO

        folder.extend(analyzed_songs)
        save_snapshot(folder)

      except Exception as e:
        print('An exception occurred when analyzing the folder', e)

  return render_template('home.html', comparedSongs=comparedSongs)


@app.route('/choose-snapshot', methods=['POST', 'GET'])
def choose_snapshot():

  #* SALVA FOLDER_PATH PARA RETORNAR SÓ SNAPSHOTS DO MESMO FOLDER 
  if request.method == 'POST':
    folder_path = request.get_json()
    session['folder_path'] = folder_path
    return Response(status=204)


  if request.method == 'GET':
    songs = Song.query.all()
    new_list = []

    for song in songs:

      snapshot_from_song = Snapshot.query.get_or_404(song.snapshot_id)

      folder_path = session.get('folder_path')
      if song.pathname == folder_path['folderPath']:
        new_file = {"pathname": song.pathname, "snapshot": {"snapshot": snapshot_from_song.name, "snapshot_id": snapshot_from_song.id}}
      new_list.append(new_file) 
      
    return json.dumps(new_list)
  redirect('/')


if __name__ == '__main__':
  app.run(debug=True)