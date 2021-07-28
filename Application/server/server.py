from nltk.stem.porter import PorterStemmer
from nltk.corpus import stopwords
from flask import Flask, redirect, request, url_for, render_template, make_response, jsonify
from flask_cors import CORS, cross_origin
import pandas as pd
import numpy as np
import pickle
import re
import nltk
import keras
nltk.download('stopwords')


def preprocess(message):
    new_review = message
    new_review = re.sub('[^a-zA-Z]', ' ', new_review)
    new_review = new_review.lower()
    new_review = new_review.split()
    ps = PorterStemmer()
    all_stopwords = stopwords.words('english')
    all_stopwords.remove('not')
    new_review = [ps.stem(word)
                  for word in new_review if not word in set(all_stopwords)]
    new_review = ' '.join(new_review)
    new_corpus = [new_review]
    return new_corpus


app = Flask(__name__)
app.config['SECRET_KEY'] = 'the quick brown fox jumps over the lazy dog'
app.config['CORS_HEADERS'] = 'Content-Type'
CORS(app, support_credentials=True)


@app.route('/predict', methods=["POST"])
@cross_origin(supports_credentials=True)
def predict_page():
    message = request.get_json()
    print(message)

    # Preprocess user inputs
    corpus = preprocess(message)
    print(corpus)

    # Model prediction
    # Load the model
    filename = 'Application/models/annModel'
    model = keras.models.load_model(filename)
    filename = 'Application/models/score.pkl'
    score = pickle.load(open(filename, 'rb'))
    # Load the count vectorizer
    filename = 'Application/models/cntvect.pkl'
    cntvect = pickle.load(open(filename, 'rb'))
    X = cntvect.transform(corpus).toarray()
    y_pred = model.predict(X)
    pred = y_pred.item()
    print(pred)
    y_pred = (y_pred > 0.5)

    # Response
    resp = {}
    if(y_pred[0] == 1):
        resp['result'] = 'The review is Positive.'
        resp['color'] = 'green'
    else:
        resp['result'] = 'The review is Negative.'
        resp['color'] = 'red'
    resp['accuracy'] = score
    resp['pred'] = pred
    print(resp)
    response = make_response(jsonify(resp), 200)
    response.headers['Content-Type'] = 'application/json'
    #response.headers.add('Access-Control-Allow-Origin', '*')
    print(response)
    return response


if __name__ == '__main__':
    app.run()
