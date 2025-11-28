from flask import Flask, render_template

app = Flask(__name__)

@app.route('/')
def index():
  # TODO - TERMINAR ISSO, ADICIONAR ROTA QUE ANALISA/E SEI LÁ MAIS O QUE A PASTA COM MÚSICAS, GERA LISTA "DIGITALIZADA" ETC...
  return render_template('home.html')





if __name__ == '__main__':
  app.run(debug=True)