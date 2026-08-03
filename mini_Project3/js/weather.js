// =========================================================
// Weather App — vanilla JS, ES6+
// API: OpenWeatherMap Current Weather (https://api.openweathermap.org)
// Docs: https://openweathermap.org/current
// =========================================================

import { OPENWEATHERMAP_API_KEY } from './config.js';

const WEATHER_URL = 'https://api.openweathermap.org/data/2.5/weather';

// OpenWeatherMap groups condition codes by their leading digit:
// https://openweathermap.org/weather-conditions
const ICON_BY_GROUP = {
  2: 'storm', // thunderstorm
  3: 'rain',  // drizzle
  5: 'rain',  // rain
  6: 'snow',  // snow
  7: 'cloud', // fog / mist / haze
  8: 'sun',   // clear (800) / clouds (80x) — refined below
};

const ICONS = {
  sun:   '<svg class="wc-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="12" cy="12" r="4.5"/><path d="M12 2v2.4M12 19.6V22M4.2 4.2l1.7 1.7M18.1 18.1l1.7 1.7M2 12h2.4M19.6 12H22M4.2 19.8l1.7-1.7M18.1 5.9l1.7-1.7"/></svg>',
  cloud: '<svg class="wc-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M6.5 18a4.5 4.5 0 1 1 1-8.9A6 6 0 0 1 19 11.5 3.8 3.8 0 0 1 18 19H6.5z"/></svg>',
  rain:  '<svg class="wc-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M6.5 14a4.5 4.5 0 1 1 1-8.9A6 6 0 0 1 19 7.5 3.8 3.8 0 0 1 18 15H6.5z"/><path d="M8 18l-1 3M13 18l-1 3M18 18l-1 3"/></svg>',
  snow:  '<svg class="wc-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M6.5 14a4.5 4.5 0 1 1 1-8.9A6 6 0 0 1 19 7.5 3.8 3.8 0 0 1 18 15H6.5z"/><path d="M9 19l2-1 2 1 2-1"/></svg>',
  storm: '<svg class="wc-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M6.5 13a4.5 4.5 0 1 1 1-8.9A6 6 0 0 1 19 6.5 3.8 3.8 0 0 1 18 14H6.5z"/><path d="M13 14l-3 5h3l-2 4"/></svg>',
};

function iconFor(code){
  if (code === 800) return 'sun';           // clear sky
  const group = Math.floor(code / 100);
  return ICON_BY_GROUP[group] ?? 'cloud';
}

const form   = document.getElementById('search-form');
const input  = document.getElementById('city-input');
const button = document.getElementById('search-btn');
const slot   = document.getElementById('result-slot');

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const city = input.value.trim();
  if (!city) return;
  await searchWeather(city);
});

async function searchWeather(city){
  setState(`Looking up "${city}"…`);
  toggleLoading(true);

  try{
    if (OPENWEATHERMAP_API_KEY === 'YOUR_OPENWEATHERMAP_API_KEY_HERE'){
      throw new Error('Add your free OpenWeatherMap API key in js/config.js to enable search.');
    }

    const data = await getCurrentWeather(city);
    renderWeather(data);
  }catch(err){
    setState(err.message, true);
  }finally{
    toggleLoading(false);
  }
}

// Fetches current conditions for a city name in one call — OpenWeatherMap
// resolves the city to coordinates internally.
async function getCurrentWeather(city){
  const url = `${WEATHER_URL}?q=${encodeURIComponent(city)}&appid=${OPENWEATHERMAP_API_KEY}&units=metric`;
  const res = await fetch(url);
  const data = await res.json();

  if (!res.ok){
    if (data.cod === '404' || data.cod === 404){
      throw new Error(`No city found matching "${city}". Check the spelling and try again.`);
    }
    if (data.cod === 401){
      throw new Error('Invalid or not-yet-active API key. New OpenWeatherMap keys can take up to 2 hours to activate.');
    }
    throw new Error('Could not fetch weather data. Please try again.');
  }

  return data;
}

function renderWeather(data){
  const { name, sys, main, wind, weather } = data;
  const [ condition ] = weather;

  slot.innerHTML = `
    <div class="weather-card">
      <div class="wc-top">
        <div>
          <p class="wc-place">${name}${sys?.country ? `, ${sys.country}` : ''}</p>
          <p class="wc-condition">${condition.description}</p>
        </div>
        ${ICONS[iconFor(condition.id)]}
      </div>

      <p class="wc-temp">${Math.round(main.temp)}°C</p>
      <p class="wc-feels">Feels like ${Math.round(main.feels_like)}°C</p>

      <div class="wc-grid">
        <div class="wc-stat"><span>Humidity</span><strong>${main.humidity}%</strong></div>
        <div class="wc-stat"><span>Wind</span><strong>${Math.round(wind.speed * 3.6)} km/h</strong></div>
        <div class="wc-stat"><span>Pressure</span><strong>${main.pressure} hPa</strong></div>
      </div>
    </div>
  `;
}

function setState(message, isError = false){
  slot.innerHTML = `<div class="state-panel ${isError ? 'error' : ''}">${message}</div>`;
}

function toggleLoading(isLoading){
  button.disabled = isLoading;
  button.textContent = isLoading ? 'Searching…' : 'Search';
}