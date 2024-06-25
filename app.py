from flask import Flask, request, jsonify
from flask_cors import CORS
import random

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})

def load_words(file_path):
    try:
        with open(file_path, 'r') as file:
            words = [line.strip().lower() for line in file if len(line.strip()) == 5]
        return words
    except FileNotFoundError:
        return []

word_list = load_words('wordle-words.txt')
if not word_list:
    raise Exception("Word list is empty. Check the file path and contents.")

@app.route('/new_word', methods=['GET'])
def new_word():
    return jsonify({'word': random.choice(word_list)})

@app.route('/guess', methods=['POST'])
def guess():
    user_guess = request.json.get('guess', '').lower()
    if not user_guess or len(user_guess) != 5 or not user_guess.isalpha():
        return jsonify({'error': 'Invalid guess, please submit a five-letter word.'}), 400

    target_word = request.json.get('target_word')
    feedback = get_feedback(user_guess, target_word)
    return jsonify({'feedback': feedback})

def get_feedback(guess, target):
    feedback = ['Gray'] * 5
    target_list = list(target)
    guess_list = list(guess)
    for i in range(5):
        if guess_list[i] == target_list[i]:
            feedback[i] = 'Green'
            target_list[i] = None
            guess_list[i] = None
    for i in range(5):
        if guess_list[i] and guess_list[i] in target_list:
            target_index = target_list.index(guess_list[i])
            feedback[i] = 'Yellow'
            target_list[target_index] = None
    return feedback

if __name__ == '__main__':
    app.run(debug=True, port=5001)
