from flask import Flask, request, jsonify
from flask_cors import CORS

from models import Schema, FeedbackModel


app = Flask(__name__)
CORS(app, allow_headers='Content-Type')

@app.route('/')
def hello():
    return "Hello World"

@app.route('/list', methods=["GET"])
def list_entries():
    return jsonify(FeedbackModel().list_items()) 

@app.route('/create', methods=["POST"])
def create_entry():
    #print("Hello", request.get_json())
    return jsonify(FeedbackModel().create(request.get_json()))

@app.route('/change', methods=["PUT"])
def update_entry():
    return jsonify(FeedbackModel().update(request.get_json()))

@app.route('/delete/<id>', methods=["DELETE"])
def delete_entry(id):
    return jsonify(FeedbackModel().delete(str(id)))

if __name__ == "__main__":
    Schema()
    app.run(debug=True)