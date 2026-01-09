from flask import Flask

app = Flask(__name__)

@app.route('/hello', methods=['GET'])
def hello_world():
  return {'data': 'Hello, world!'}

if __name__ == '__main__':
  app.run(debug=True)