import { imageBaseURL } from "./api.js"

export function createMovieCard(movie) {
  const { poster_path, title, vote_average, release_date, id } = movie

  const card = document.createElement("div")
  card.classList.add("movie-card")

  card.innerHTML = `
  <div class="card-poster">
    <img 
      src="${poster_path ? `${imageBaseURL}w342${poster_path}` : "/assets/images/poster-bg-icon.png"}" 
      alt="${title}" 
      class="img-cover" 
      loading="lazy"
      onerror="this.src='/assets/images/poster-bg-icon.png'"
    >
    <span class="rating-badge">${vote_average.toFixed(1)}</span>
  </div>
  
  <div class="card-content">
    <h3 class="title">${title}</h3>
    <div class="meta-list">
      <span class="meta-item">${release_date?.split("-")[0] ?? "Not Released"}</span>
    </div>
  </div>
  
  <a href="./detail.html" class="card-btn" title="${title}" onclick="getMovieDetail(${id})"></a>
`

  return card
}

