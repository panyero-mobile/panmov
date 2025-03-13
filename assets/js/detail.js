import { api_key, imageBaseURL, fetchDataFromServer } from "./api.js"
import { createMovieCard } from "./movie-card.js"
import { search } from "./search.js"

const movieId = window.localStorage.getItem("movieId")
const pageContent = document.querySelector("[page-content]")

const getCasts = (castList) => {
  const newCastList = []
  for (let i = 0, len = castList.length; i < len && i < 5; i++) {
    const { name } = castList[i]
    newCastList.push(name)
  }
  return newCastList.join(", ")
}

const getDirectors = (crewList) => {
  const directors = crewList.filter(({ job }) => job === "Director")
  const directorList = []
  for (const { name } of directors) directorList.push(name)
  return directorList.join(", ")
}

fetchDataFromServer(
  `https://api.themoviedb.org/3/movie/${movieId}?api_key=${api_key}&append_to_response=casts,videos,images,releases`,
  (movie) => {
    const {
      backdrop_path,
      poster_path,
      title,
      release_date,
      runtime,
      vote_average,
      genres,
      overview,
      casts: { cast, crew },
      videos: { results: videos },
    } = movie

    // Find the official trailer or use the first video
    const trailer =
      videos.find(
        (video) =>
          video.type === "Trailer" &&
          video.site === "YouTube" &&
          (video.name.includes("Official") || video.name.includes("Trailer")),
      ) ||
      videos.find((video) => video.type === "Trailer" && video.site === "YouTube") ||
      null

    document.title = `${title} - Netflix`

    const movieDetail = document.createElement("div")
    movieDetail.classList.add("movie-detail")

    movieDetail.innerHTML = `
      <div class="detail-banner">
        <img src="${imageBaseURL}original${backdrop_path || poster_path}" alt="${title}" class="img-cover">
      </div>
      
      <div class="detail-content">
        <h1 class="detail-title">${title}</h1>
        
        <div class="detail-meta meta-list">
          <span class="meta-item">${release_date?.split("-")[0] ?? "Not Released"}</span>
          <span class="separator"></span>
          <span class="meta-item">${runtime}m</span>
          <span class="separator"></span>
          <span class="meta-item">${vote_average.toFixed(1)} ★</span>
        </div>
        
        <p class="detail-overview">${overview}</p>
        
        <div class="detail-actions">
          <a href="playmovie.html" class="btn stream-now-button">
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
                title="${title} Trailer"
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
          <p><span class="text-muted">Director:</span> ${getDirectors(crew)}</p>
          <p><span class="text-muted">Genres:</span> ${genres.map((g) => g.name).join(", ")}</p>
        </div>
      </div>
      
      <section class="netflix-row">
        <h2 class="section-heading">More Like This</h2>
        <div class="row-container" id="recommendations"></div>
      </section>
    `

    // Set up stream URL for the play button
    const streamNowButton = movieDetail.querySelector(".stream-now-button")
    streamNowButton.addEventListener("click", (event) => {
      event.preventDefault()
      localStorage.setItem("streamURL", `https://vidsrc.xyz/embed/movie/${movieId}`)
      localStorage.setItem("movieId", movieId) // Ensure movieId is set
      sessionStorage.setItem("playMovieIntent", "true")
      window.location.href = "loading.html"
    })

    pageContent.appendChild(movieDetail)

    // Fetch and display recommendations
    fetchDataFromServer(
      `https://api.themoviedb.org/3/movie/${movieId}/recommendations?api_key=${api_key}&page=1`,
      ({ results: movieList }) => {
        const recommendationsContainer = document.getElementById("recommendations")

        for (const movie of movieList) {
          const movieCard = createMovieCard(movie)
          recommendationsContainer.appendChild(movieCard)
        }
      },
    )
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

