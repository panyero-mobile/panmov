import { imageBaseURL } from "./api.js"

export function createTvCard(tvShow) {
  const { poster_path, name, vote_average, first_air_date, id } = tvShow

  const card = document.createElement("div")
  card.classList.add("tv-card")

  card.innerHTML = `
    <div class="card-poster">
      <img 
        src="${poster_path ? `${imageBaseURL}w342${poster_path}` : "/assets/images/poster-bg-icon.png"}" 
        alt="${name}" 
        class="img-cover" 
        loading="lazy"
        onerror="this.src='/assets/images/poster-bg-icon.png'"
      >
      <span class="rating-badge">${vote_average.toFixed(1)}</span>
    </div>
    
    <div class="card-content">
      <h3 class="title">${name}</h3>
      <div class="meta-list">
        <span class="meta-item">${first_air_date?.split("-")[0] ?? "Not Released"}</span>
      </div>
    </div>
    
    <a href="./tv-detail.html" class="card-btn" title="${name}" onclick="getTvShowDetail(${id})"></a>
  `

  return card
}

