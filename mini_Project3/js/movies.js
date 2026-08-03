// =========================================================
// Movie Search App — vanilla JS, ES6+
// API: OMDb (https://www.omdbapi.com) — free key required, see js/config.js
// =========================================================

import { OMDB_API_KEY } from './config.js';

const BASE_URL = 'https://www.omdbapi.com/';
const PLACEHOLDER_POSTER = 'data:image/svg+xml;utf8,' + encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="450"><rect width="100%" height="100%" fill="#1D232C"/><text x="50%" y="50%" fill="#8B93A1" font-family="monospace" font-size="14" text-anchor="middle">No poster</text></svg>`
);

const form    = document.getElementById('search-form');
const input   = document.getElementById('movie-input');
const button  = document.getElementById('search-btn');
const slot    = document.getElementById('result-slot');
const backdrop = document.getElementById('modal-backdrop');
const modal   = document.getElementById('modal');

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const query = input.value.trim();
  if (!query) return;
  await searchMovies(query);
});

backdrop.addEventListener('click', (event) => {
  if (event.target === backdrop) closeModal();
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeModal();
});

async function searchMovies(query){
  setState(`Searching for "${query}"…`);
  toggleLoading(true);

  try{
    if (OMDB_API_KEY === 'YOUR_OMDB_API_KEY_HERE'){
      throw new Error('Add your free OMDb API key in js/config.js to enable search.');
    }

    const url = `${BASE_URL}?apikey=${OMDB_API_KEY}&s=${encodeURIComponent(query)}&type=movie`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('The movie database is unreachable right now. Try again shortly.');

    const data = await res.json();
    if (data.Response === 'False') throw new Error(data.Error || `No results for "${query}".`);

    renderResults(data.Search);
  }catch(err){
    setState(err.message, true);
  }finally{
    toggleLoading(false);
  }
}

function renderResults(movies){
  const cards = movies.map(({ imdbID, Title, Year, Poster }) => `
    <button class="movie-card" data-id="${imdbID}" type="button">
      <img class="movie-poster" src="${Poster !== 'N/A' ? Poster : PLACEHOLDER_POSTER}" alt="${Title} poster" loading="lazy">
      <div class="movie-info">
        <h3>${Title}</h3>
        <p>${Year}</p>
      </div>
    </button>
  `).join('');

  slot.innerHTML = `<div class="results-grid">${cards}</div>`;

  slot.querySelectorAll('.movie-card').forEach(card => {
    card.addEventListener('click', () => openDetail(card.dataset.id));
  });
}

async function openDetail(imdbID){
  try{
    const res = await fetch(`${BASE_URL}?apikey=${OMDB_API_KEY}&i=${imdbID}&plot=full`);
    const movie = await res.json();
    if (movie.Response === 'False') throw new Error(movie.Error);

    const { Title, Year, Runtime, Genre, imdbRating, Poster, Plot, Director } = movie;

    modal.innerHTML = `
      <button class="modal-close" id="modal-close" aria-label="Close">&times;</button>
      <img src="${Poster !== 'N/A' ? Poster : PLACEHOLDER_POSTER}" alt="${Title} poster">
      <div class="modal-body">
        <h2>${Title}</h2>
        <p class="modal-meta">${Year} · ${Runtime} · ${Genre}</p>
        <div class="modal-rating">★ ${imdbRating}/10 on IMDb</div>
        <p class="modal-plot">${Plot}</p>
        <p class="modal-plot" style="margin-top:14px;"><strong>Director:</strong> ${Director}</p>
      </div>
    `;
    document.getElementById('modal-close').addEventListener('click', closeModal);
    backdrop.classList.remove('hidden');
  }catch(err){
    setState(err.message, true);
  }
}

function closeModal(){
  backdrop.classList.add('hidden');
}

function setState(message, isError = false){
  slot.innerHTML = `<div class="state-panel ${isError ? 'error' : ''}">${message}</div>`;
}

function toggleLoading(isLoading){
  button.disabled = isLoading;
  button.textContent = isLoading ? 'Searching…' : 'Search';
}