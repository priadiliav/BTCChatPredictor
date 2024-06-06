import pandas as pd
import matplotlib.pyplot as plt

# Завантаження даних
data = pd.read_csv('./btc_price_1m.csv')

# Перегляд перших кількох рядків
print(data.head())

# Перетворення дати в формат datetime
data['date'] = pd.to_datetime(data['date'])

# Сортування даних за датою
data = data.sort_values('date')

# Візуалізація даних
plt.figure(figsize=(12, 6))
plt.plot(data['date'], data['close'], label='Closing Price')
plt.xlabel('Date')
plt.ylabel('Price')
plt.title('Bitcoin/USDT Price Over Time')
plt.legend()
plt.show()
