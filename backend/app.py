
from flask import Flask, request
from flask_sqlalchemy import SQLAlchemy

from schema import MySchema

app = Flask("backend_app")
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///primary.db'
db = SQLAlchemy(app)
schema = MySchema(db)

@app.route('/users', methods=['GET'])
def list_users():
  users = schema.User.query.all()
  return {'data': [user.username for user in users]}

@app.route('/users', methods=['POST'])
def add_user():
  data = request.get_json()
  username = data['username']
  new_user = schema.User(username=username)
  db.session.add(new_user)
  db.session.commit()
  return {'message': f'User {username} added successfully'}

def main():
  with app.app_context():
    db.create_all()

# Run the app
if __name__ == "__main__":
  app.run(debug=True)

main()