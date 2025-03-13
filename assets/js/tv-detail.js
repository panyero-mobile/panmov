import { api_key, imageBaseURL, fetchDataFromServer } from "./api.js"
import { createTvCard } from "./tv-card.js"
import { search } from "./search.js"

const tvId = window.localStorage.getItem("tvId")
const pageContent = document.querySelector("[page-content]")

const getCasts = (castList) => {
  if (!castList || castList.length === 0) return "N/A"
  const newCastList = []
  for (let i = 0, len = castList.length; i < len && i < 5; i++) {
    const { name } = castList[i]
    newCastList.push(name)
  }
  return newCastList.join(", ")
}

const getCreators = (createdBy) => {
  if (!createdBy || createdBy.length === 0) return "N/A"
  const creatorList = []
  for (const { name } of createdBy) creatorList.push(name)
  return creatorList.join(", ")
}

fetchDataFromServer(
  `https://api.themoviedb.org/3/tv/${tvId}?api_key=${api_key}&append_to_response=credits,videos,images,external_ids`,
  (tvShow) => {
    const {
      backdrop_path,
      poster_path,
      name,
      first_air_date,
      episode_run_time,
      vote_average,
      genres,
      overview,
      credits,
      videos,
      number_of_seasons,
      created_by,
      external_ids,
    } = tvShow

    // Handle potential undefined values
    const cast = credits?.cast || []
    const crew = credits?.crew || []
    const videoResults = videos?.results || []
    const runTime = episode_run_time && episode_run_time.length > 0 ? episode_run_time[0] : "N/A"
    const genreNames = genres ? genres.map((g) => g.name).join(", ") : "N/A"
    const externalIds = external_ids || {}

    // Find the official trailer or use the first video
    const trailer =
      videoResults.find(
        (video) =>
          video.type === "Trailer" &&
          video.site === "YouTube" &&
          (video.name.includes("Official") || video.name.includes("Trailer")),
      ) ||
      videoResults.find((video) => video.type === "Trailer" && video.site === "YouTube") ||
      null

    document.title = `${name} - Panyero`

    const tvDetail = document.createElement("div")
    tvDetail.classList.add("tv-detail")

    tvDetail.innerHTML = `
      <div class="detail-banner">
        <img src="${imageBaseURL}original${backdrop_path || poster_path || "/assets/images/poster-bg-icon.png"}" alt="${name}" class="img-cover">
      </div>
      
      <div class="detail-content">
        <h1 class="detail-title">${name}</h1>
        
        <div class="detail-meta meta-list">
          <span class="meta-item">${first_air_date?.split("-")[0] ?? "Not Released"}</span>
          <span class="separator"></span>
          <span class="meta-item">${runTime}m</span>
          <span class="separator"></span>
          <span class="meta-item">${vote_average.toFixed(1)} ★</span>
          <span class="separator"></span>
          <span class="meta-item">${number_of_seasons} Season${number_of_seasons !== 1 ? "s" : ""}</span>
        </div>
        
        <p class="detail-overview">${overview || "No overview available."}</p>
        
        <div class="detail-actions">
          <a href="#" class="btn stream-now-button" onclick="playTvShow('${tvId}', '${externalIds.imdb_id || ""}')">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z"/>
            </svg>
            <span>Play</span>
          </a>
          
          <button class="btn-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M13.35 20.13c-.76.69-1.93.69-2.69-.01l-.11-.1C5.3 15.27 1.87 12.16 2 8.28c.06-1.7.93-3.33 2.34-4.29 2.64-1.8 5.9-.96 7.66 1.1 1.76-2.06 5.02-2.91 7.66-1.1 1.41.96 2.28 2.59 2.34 4.29.14 3.88-3.3 6.99-8.55 11.76l-.1.09z"></path>
            </svg>
          </button>
          
          <button class="btn-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"></path>
            </svg>
          </button>
        </div>
        
        ${
          trailer
            ? `
          <div class="trailer-container">
            <h3 class="trailer-title">Watch Trailer</h3>
            <div class="trailer-wrapper">
              <iframe 
                src="https://www.youtube.com/embed/${trailer.key}" 
                title="${name} Trailer"
                frameborder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowfullscreen>
              </iframe>
            </div>
          </div>
        `
            : ""
        }

        <div class="cast-info">
          <p><span class="text-muted">Cast:</span> ${getCasts(cast)}</p>
          <p><span class="text-muted">Created By:</span> ${getCreators(created_by)}</p>
          <p><span class="text-muted">Genres:</span> ${genreNames}</p>
        </div>
      </div>
      
      <section class="seasons-section">
        <h2 class="section-heading">Seasons</h2>
        <div class="seasons-container" id="seasons-container">
          <div class="loading-seasons">Loading seasons...</div>
        </div>
      </section>
      
      <section class="netflix-row">
        <h2 class="section-heading">More Like This</h2>
        <div class="row-container" id="recommendations"></div>
      </section>
    `

    pageContent.appendChild(tvDetail)

    // Fetch and display seasons
    fetchDataFromServer(`https://api.themoviedb.org/3/tv/${tvId}/seasons?api_key=${api_key}`, (data) => {
      const seasons = data.seasons || []
      const seasonsContainer = document.getElementById("seasons-container")
      seasonsContainer.innerHTML = ""

      if (seasons.length === 0) {
        seasonsContainer.innerHTML = "<div class='loading-seasons'>No seasons found.</div>"
        return
      }

      for (const season of seasons) {
        if (season.season_number === 0) continue // Skip specials

        const seasonCard = document.createElement("div")
        seasonCard.classList.add("season-card")

        seasonCard.innerHTML = `
            <div class="season-poster">
              <img 
                src="${season.poster_path ? `${imageBaseURL}w342${season.poster_path}` : poster_path ? `${imageBaseURL}w342${poster_path}` : "/assets/images/poster-bg-icon.png"}" 
                alt="${season.name}" 
                class="img-cover" 
                loading="lazy"
                onerror="this.src='/assets/images/poster-bg-icon.png'"
              >
            </div>
            <div class="season-content">
              <h3 class="season-title">${season.name}</h3>
              <p class="season-info">${season.episode_count} Episodes • ${season.air_date?.split("-")[0] || "TBA"}</p>
              <p class="season-overview">${season.overview || `Season ${season.season_number} of ${name}.`}</p>
              <button class="btn season-expand-btn" onclick="toggleEpisodes(${tvId}, ${season.season_number}, this)">
                <span>View Episodes</span>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z"></path>
                </svg>
              </button>
              <div class="episodes-container" id="season-${season.season_number}-episodes"></div>
            </div>
          `

        seasonsContainer.appendChild(seasonCard)
      }
    })

    // Fetch and display recommendations
    fetchDataFromServer(`https://api.themoviedb.org/3/tv/${tvId}/recommendations?api_key=${api_key}&page=1`, (data) => {
      const tvShowList = data.results || []
      const recommendationsContainer = document.getElementById("recommendations")

      if (tvShowList.length === 0) {
        recommendationsContainer.innerHTML = "<p class='no-results'>No recommendations found.</p>"
        return
      }

      for (const tvShow of tvShowList) {
        const tvCard = createTvCard(tvShow)
        recommendationsContainer.appendChild(tvCard)
      }
    })
  },
)

// Initialize search
search()

// Add scroll event to change header background
window.addEventListener("scroll", () => {
  const header = document.querySelector(".header")
  if (window.scrollY > 50) {
    header.classList.add("scrolled")
  } else {
    header.classList.remove("scrolled")
  }
})

