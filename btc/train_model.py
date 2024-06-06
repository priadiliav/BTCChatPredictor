import pandas as pd
import numpy as np
from sklearn.preprocessing import MinMaxScaler
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense, LSTM
import joblib
import matplotlib.pyplot as plt

# Завантаження даних
data = pd.read_csv('./btc_price_1m.csv')

data['date'] = pd.to_datetime(data['date'])
data = data.sort_values('date')

# Масштабування даних
scaler = MinMaxScaler(feature_range=(0, 1))
data['close'] = scaler.fit_transform(data[['close']])

def create_dataset(data, time_step=1):
    X, y = [], []
    for i in range(len(data) - time_step - 1):
        X.append(data[i:(i + time_step), 0])
        y.append(data[i + time_step, 0])
    return np.array(X), np.array(y)

# Підготовка даних
time_step = 60
X, y = create_dataset(data['close'].values.reshape(-1, 1), time_step)

# Розділення даних на навчальні та тестові набори
train_size = int(len(X) * 0.8)
X_train, X_test = X[:train_size], X[train_size:]
y_train, y_test = y[:train_size], y[train_size:]

# Перетворення даних для LSTM
X_train = X_train.reshape(X_train.shape[0], X_train.shape[1], 1)
X_test = X_test.reshape(X_test.shape[0], X_test.shape[1], 1)

# Побудова моделі LSTM
model = Sequential()
model.add(LSTM(50, return_sequences=True, input_shape=(time_step, 1)))
model.add(LSTM(50, return_sequences=False))
model.add(Dense(25))
model.add(Dense(1))

# Компіляція моделі
model.compile(optimizer='adam', loss='mean_squared_error')

# Тренування моделі
model.fit(X_train, y_train, batch_size=1, epochs=50)

# Прогнозування
predictions = model.predict(X_test)
predictions = scaler.inverse_transform(predictions)

y_test_rescaled = scaler.inverse_transform(y_test.reshape(-1, 1))

# Оцінка моделі
loss = model.evaluate(X_test, y_test)
print(f"Test Loss: {loss}")

# Збереження моделі та масштабувальника
model.save('bitcoin_price_1m_v2.h5')
joblib.dump(scaler, 'scaler_v2.pkl')

# Візуалізація результатів
plt.figure(figsize=(14, 5))
plt.plot(y_test_rescaled, label='True Price')
plt.plot(predictions, label='Predicted Price')
plt.xlabel('Time')
plt.ylabel('Bitcoin Price')
plt.legend()
plt.show()