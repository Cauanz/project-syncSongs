from flask import Flask, render_template, url_for, request, redirect
from utils import hash_song

app = Flask(__name__)

folder = []

@app.route('/')
def index():
  songs = []
  seen_hashes = set()

  for song in folder:
    hash = song['hash']

    if hash in seen_hashes:
      song['status'] = 'Duplicated'
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
        newFile = {}
        newFile['pathname'] = file.filename.split('/')[0]
        newFile['filename'] = file.filename.split('/')[1]
        newFile['hash'] = hash_song(file)
        newFile['status'] = 'Mapped'

        folder.append(newFile)
    except:
      print('An exception occurred')

    
  return redirect('/')
# TODO - CONTINUAR DESCOBRINDO COMO RECEBER A PASTA/ARQUIVOS, SALVAR ELES LOCALMENTE (TALVEZ PRECISE DE UM DB SIMPLES) E DAI FAZER AS COISAS




if __name__ == '__main__':
  app.run(debug=True)