from flask import Flask, render_template, url_for, request, redirect

app = Flask(__name__)

folder = []

@app.route('/')
def index():
  # TODO - TAMBÉM APRENDER A CARREGAR PASTA E LER ARQUIVOS
  songs = []
  songs = folder
  return render_template('home.html', songs=songs)

@app.route('/check-folder', methods=["GET", "POST"])
def check_folder():

  if request.method == 'POST':
    files = request.form['selectfolder']
    # TODO - CONTINUAR DESCOBRINDO COMO RECEBER A PASTA/ARQUIVOS, SALVAR ELES LOCALMENTE (TALVEZ PRECISE DE UM DB SIMPLES) E DAI FAZER AS COISAS
  
  return redirect('/')




if __name__ == '__main__':
  app.run(debug=True)