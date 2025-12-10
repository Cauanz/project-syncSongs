from flask import Flask, render_template, url_for, request, redirect, Response
from utils import hash_song, save_snapshot, analyze_song, compare_folders
import os
import json

app = Flask(__name__)

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
    
    comparedSongs = compare_folders(snapshot, newFolder)
    
    # * PARTE QUE SALVA ARQUIVO/CRIA NOVO SNAPSHOT
    try:
      for file in newFolder:
        temp_files.append(file)
        # file.read() # RETORNA OS BYTES DO ARQUIVO

        formattedSong = analyze_song(file)
        folder.append(formattedSong)
        # save_snapshot(folder)
    except Exception as e:
      print('An exception occurred when analyzing the folder', e)

  return render_template('home.html', comparedSongs=comparedSongs)
# TODO - MUDAR PARA ENVIAR A NOVA "PÁGINA" COM A TABELA DE ARQUIVOS COMPARADOS



@app.route('/choose-snapshot', methods=['POST', 'GET'])
def choose_snapshot():


  if request.method == 'POST':
    folder_path = request.get_json()
    return Response(status=204)


  if request.method == 'GET':
    files = os.listdir('snapshots')
    new_list = []

    for snapshot in files:
      with open(f"snapshots/{snapshot}", "r") as s:
        file = json.load(s)
        for snap in file:
          # TODO - TERMINAR ISSO, ELE PEGA O FOLDERPATH PASSADO DA PASTA SELECIONADA NO FRONT, RECEBE AQUI, E ELE SÓ ENVIA OS SNAPSHOTS QUE SÃO DA MESMA PASTA UPLOADED
          # if snap['pathname'] == folder_path['folderPath']:
          new_file = {"pathname": snap['pathname'], "snapshot": snapshot}
      new_list.append(new_file)
      
    return json.dumps(new_list)
  redirect('/')


if __name__ == '__main__':
  app.run(debug=True)