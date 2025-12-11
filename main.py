from flask import Flask, render_template, url_for, request, redirect, Response, session
from utils import hash_song, save_snapshot, analyze_song, compare_folders
import os
import json

app = Flask(__name__)
app.secret_key = b'WNIafisu//,..gB8W,.HG0/sagb.w~-hp~wqhogb'

folder = []
old_snapshot = ""
comparedSongs = []

@app.route('/')
def index():
  return render_template('home.html', comparedSongs=comparedSongs)

@app.route('/check-folder', methods=["POST"])
def check_folder():

  temp_files = []

  if request.method == 'POST':
    snapshot = request.form['selectsnapshot']
    newFolder = request.files.getlist("selectfolder")
    snapshot_true = request.form['savesnapshot']
    
    comparedSongs = compare_folders(snapshot, newFolder)
    
    # * PARTE QUE SALVA ARQUIVO/CRIA NOVO SNAPSHOT
    if snapshot_true:
      try:
        for file in newFolder:
          temp_files.append(file)
          # # file.read() # RETORNA OS BYTES DO ARQUIVO

          formattedSong = analyze_song(file)
          folder.append(formattedSong)
          print(folder)
          # save_snapshot(folder)
          # TODO - PROBLEMA AQUI, ELE ESTÁ CRIANDO SNAPSHOTS PARA QUANTIDADE DE MÚSICAS NA PASTA, MAS NÃO ESTÁ SALVANDO ADEQUADAMENTE (MAS CRIAR VÁRIOS SNAPSHOTS TAMBÉM ESTÁ ERRADO)
      except Exception as e:
        print('An exception occurred when analyzing the folder', e)

  return render_template('home.html', comparedSongs=comparedSongs)



@app.route('/choose-snapshot', methods=['POST', 'GET'])
def choose_snapshot():


  if request.method == 'POST':
    folder_path = request.get_json()
    session['folder_path'] = folder_path
    return Response(status=204)


  if request.method == 'GET':
    files = os.listdir('snapshots')
    new_list = []

    for snapshot in files:
      with open(f"snapshots/{snapshot}", "r") as s:
        file = json.load(s)
        for snap in file:
          folder_path = session.get('folder_path')
          if snap['pathname'] == folder_path['folderPath']:
            new_file = {"pathname": snap['pathname'], "snapshot": snapshot}
      new_list.append(new_file)
      
    return json.dumps(new_list)
  redirect('/')


if __name__ == '__main__':
  app.run(debug=True)