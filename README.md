# 🌤️ Weather Forecast App

A clean and responsive weather forecast app built with **HTML**, **Tailwind CSS**, and **JavaScript**. It fetches real-time weather data and a 5-day forecast using the **OpenWeatherMap API**. Includes a recent search dropdown feature stored in local storage.

---

## 🚀 Features

- 🔍 Search weather by city name
- 📍 Use current location to fetch weather
- 📅 5-day forecast with:
  - Weather icons
  - Temperature
  - Wind speed
  - Humidity
- 🕓 Displays current weather conditions
- 📌 Dropdown menu for recently searched cities (stored using `localStorage`)
- 📱 Fully responsive layout using Tailwind CSS

---

## 📦 Folder Structure

project-folder/
│
├── index.html # Main HTML file
├── script.js # JavaScript logic for fetching and displaying weather
├── background.jpg # Optional background image
└── README.md # Project documentation

You can get a free API key from 👉 https://openweathermap.org/api


✅ Usage:-
- Enter a city name and click Search, or press Enter.
- Click "Use My Location" to get weather data for your current location.
- Recently searched cities appear in a dropdown when you type in the input box.
- Click a recent city to fetch its weather again.
- Dropdown hides on selection, outside click, or after weather loads.