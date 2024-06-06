from flask import Flask, request, jsonify
import joblib
import numpy as np
from tensorflow.keras.models import load_model
import pandas as pd
import requests
import spacy
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  

print("Loading model and scaler...")
model = load_model('bitcoin_lstm_model.h5')
scaler = joblib.load('scaler.pkl')

print("Loading data...")
data = pd.read_csv('./btc_price_1m.csv')
data['date'] = pd.to_datetime(data['date'])
data = data.sort_values('date')
nlp = spacy.load("en_core_web_sm")

def prepare_data(data, time_step=60):
    print("Preparing data...")
    data = scaler.transform(data['close'].values.reshape(-1, 1))
    X = []
    for i in range(len(data) - time_step):
        X.append(data[i:(i + time_step), 0])
    return np.array(X).reshape(-1, time_step, 1)

def predict_future(data, model, scaler, steps=60):
    X = prepare_data(data)
    predictions = []
    current_step = X[-1]

    for _ in range(steps):
        prediction = model.predict(current_step.reshape(1, -1, 1))
        predictions.append(prediction[0, 0])
        current_step = np.append(current_step[1:], prediction)
    
    predictions = np.array(predictions).reshape(-1, 1)
    predictions = scaler.inverse_transform(predictions)
    return predictions

def get_real_time_data():
    url = 'https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT'
    response = requests.get(url)
    data = response.json()
    return float(data['price'])

def get_intent(text):
    doc = nlp(text.lower())
    if any(token.lemma_ in ["price", "current", "bitcoin", "btc"] for token in doc):
        return "get_price"
    if any(token.lemma_ in ["prediction", "forecast", "future"] for token in doc):
        return "get_prediction"
    else:
        return "unknown"

@app.route('/predict_price', methods=['POST'])
def predict_price():
    print("Route /predict_price called")
    X = prepare_data(data)
    prediction = model.predict(X[-1].reshape(1, -1, 1))
    predicted_price = scaler.inverse_transform(prediction)[0][0]
    return jsonify({'predicted_price': float(predicted_price)})

@app.route('/predict_future', methods=['POST'])
def predict_future_route():
    print("Route /predict_future called")
    steps = request.json.get('steps', 60)
    predictions = predict_future(data, model, scaler, steps)
    return jsonify({'predicted_prices': predictions.tolist()})

@app.route('/predict_real_time', methods=['POST'])
def predict_real_time():
    print("Route /predict_real_time called")
    current_price = get_real_time_data()
    global data 
    data = data._append({'date': pd.Timestamp.now(), 'close': current_price}, ignore_index=True)
    X = prepare_data(data)
    prediction = model.predict(X[-1].reshape(1, -1, 1))
    predicted_price = scaler.inverse_transform(prediction)[0][0]
    return jsonify({'predicted_price': float(predicted_price)})

@app.route('/chat', methods=['POST'])
def chat():
    user_message = request.json.get('message')
    intent = get_intent(user_message)
    
    if intent == "get_price":
        current_price = get_real_time_data()
        response = f"The current price of Bitcoin is ${current_price:.2f}."
    elif intent == "get_prediction":
        steps = 60 
        predictions = predict_future(data, model, scaler, steps)
        response = f"The predicted price of Bitcoin for the next {steps} minutes is ${predictions[-1][0]:.2f}."
    else:
        response = "Sorry, I didn't understand that. Please ask about the current price of Bitcoin or its future prediction."
    return jsonify({'response': response})

if __name__ == '__main__':
    print("Starting Flask server...")
    app.run(port=5001)
