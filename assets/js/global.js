// Add event on multiple elements
const addEventOnElements = (elements, eventType, callback) => {
  if (!elements || elements.length === 0) return
  for (const elem of elements) elem.addEventListener(eventType, callback)
}

// Toggle search box in mobile device || small screen
const searchTogglers = document.querySelectorAll("[search-toggler]")
if (searchTogglers.length > 0) {
  addEventOnElements(searchTogglers, "click", () => {
    const searchModal = document.querySelector("[search-modal]")
    if (searchModal) {
      searchModal.classList.toggle("active")
      const searchField = document.querySelector("[search-field]")
      if (searchField && searchModal.classList.contains("active")) {
        searchField.focus()
      }
    }
  })
}

// store movieID in `LocalStorage` when you click any card
window.getMovieDetail = (movieId) => {
  window.localStorage.setItem("movieId", String(movieId))
}

// store tvID in `LocalStorage` when you click any card
window.getTvShowDetail = (tvId) => {
  window.localStorage.setItem("tvId", String(tvId))
}

window.getMovieList = (urlParam, genreName) => {
  window.localStorage.setItem("urlParam", urlParam)
  window.localStorage.setItem("genreName", genreName)
  window.localStorage.setItem("mediaType", "movie")
}

// Function to play a YouTube trailer in a modal
window.playTrailer = (videoKey, title) => {
  // Create modal container
  const trailerModal = document.createElement("div")
  trailerModal.classList.add("trailer-modal")

  // Add modal content
  trailerModal.innerHTML = `
    <div class="trailer-modal-content">
      <button class="trailer-close-btn">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
      <iframe 
        src="https://www.youtube.com/embed/${videoKey}?autoplay=1" 
        title="${title} Trailer"
        frameborder="0" 
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
        allowfullscreen>
      </iframe>
    </div>
  `

  // Add modal to body
  document.body.appendChild(trailerModal)

  // Prevent body scrolling
  document.body.style.overflow = "hidden"

  // Add close functionality
  const closeBtn = trailerModal.querySelector(".trailer-close-btn")
  closeBtn.addEventListener("click", () => {
    document.body.removeChild(trailerModal)
    document.body.style.overflow = ""
  })

  // Close when clicking outside the iframe
  trailerModal.addEventListener("click", (e) => {
    if (e.target === trailerModal) {
      document.body.removeChild(trailerModal)
      document.body.style.overflow = ""
    }
  })
}

// Function to play a TV show
window.playTvShow = (tvId, imdbId) => {
  // Use IMDB ID if available, otherwise use TMDB ID
  const id = imdbId && imdbId.trim() !== "" ? imdbId : tvId
  const streamURL = `https://vidsrc.xyz/embed/tv/${id}`

  // Store stream URL and redirect to loading screen
  localStorage.setItem("streamURL", streamURL)
  sessionStorage.setItem("playMovieIntent", "true")
  window.location.href = "loading.html"
}

// Function to play a specific episode
window.playEpisode = (tvId, seasonNumber, episodeNumber, episodeTitle, showTitle, imdbId) => {
  // Use IMDB ID if available, otherwise use TMDB ID
  const id = imdbId && imdbId.trim() !== "" ? imdbId : tvId
  const streamURL = `https://vidsrc.xyz/embed/tv/${id}/${seasonNumber}-${episodeNumber}`

  // Store episode info
  localStorage.setItem("streamURL", streamURL)
  localStorage.setItem("episodeTitle", episodeTitle)
  localStorage.setItem("seasonNumber", seasonNumber)
  localStorage.setItem("episodeNumber", episodeNumber)
  localStorage.setItem("showTitle", showTitle)

  // Redirect to loading screen
  sessionStorage.setItem("playMovieIntent", "true")
  window.location.href = "loading.html"
}

// Function to toggle episodes display
window.toggleEpisodes = (tvId, seasonNumber, button) => {
  const episodesContainer = document.getElementById(`season-${seasonNumber}-episodes`)
  if (!episodesContainer) return

  const isExpanded = episodesContainer.classList.contains("expanded")

  if (isExpanded) {
    // Collapse
    episodesContainer.classList.remove("expanded")
    episodesContainer.style.maxHeight = "0"
    button.querySelector("span").textContent = "View Episodes"
    button.querySelector("svg").style.transform = "rotate(0deg)"
  } else {
    // Expand and load episodes if not already loaded
    episodesContainer.classList.add("expanded")

    if (episodesContainer.children.length === 0) {
      // Show loading
      episodesContainer.innerHTML = '<div class="episodes-loading">Loading episodes...</div>'
      episodesContainer.style.maxHeight = "50px"

      // Fetch episodes
      fetch(`https://api.themoviedb.org/3/tv/${tvId}/season/${seasonNumber}?api_key=7a5cf3c679b58ed507187030e928245a`)
        .then((response) => response.json())
        .then((data) => {
          // Get show title and IMDB ID for the episode player
          const showTitle = document.querySelector(".detail-title")?.textContent || "TV Show"

          // Get external IDs for the TV show
          fetch(`https://api.themoviedb.org/3/tv/${tvId}/external_ids?api_key=7a5cf3c679b58ed507187030e928245a`)
            .then((response) => response.json())
            .then((externalData) => {
              const imdbId = externalData.imdb_id || ""

              // Create episodes list
              let episodesHTML = ""

              if (data.episodes && data.episodes.length > 0) {
                data.episodes.forEach((episode) => {
                  const stillPath = episode.still_path
                    ? `https://image.tmdb.org/t/p/w300${episode.still_path}`
                    : "/assets/images/video-bg-icon.png"

                  const episodeName = episode.name || `Episode ${episode.episode_number}`
                  const episodeOverview = episode.overview || "No description available."

                  episodesHTML += `
                    <div class="episode-item">
                      <div class="episode-thumbnail">
                        <img src="${stillPath}" alt="Episode ${episode.episode_number}" loading="lazy">
                        <button class="episode-play-btn" onclick="playEpisode('${tvId}', ${seasonNumber}, ${episode.episode_number}, '${episodeName.replace(/'/g, "\\'")}', '${showTitle.replace(/'/g, "\\'")}', '${imdbId}')">
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M8 5v14l11-7z"/>
                          </svg>
                        </button>
                      </div>
                      <div class="episode-info">
                        <div class="episode-header">
                          <span class="episode-number">E${episode.episode_number}</span>
                          <span class="episode-runtime">${episode.runtime || "?"}m</span>
                        </div>
                        <h4 class="episode-title">${episodeName}</h4>
                        <p class="episode-overview">${episodeOverview}</p>
                      </div>
                    </div>
                  `
                })
              } else {
                episodesHTML = '<div class="episodes-error">No episodes found for this season.</div>'
              }

              episodesContainer.innerHTML = episodesHTML
              episodesContainer.style.maxHeight = `${episodesContainer.scrollHeight}px`
            })
            .catch((error) => {
              console.error("Error fetching external IDs:", error)
              episodesContainer.innerHTML = '<div class="episodes-error">Failed to load episodes.</div>'
            })
        })
        .catch((error) => {
          console.error("Error fetching episodes:", error)
          episodesContainer.innerHTML = '<div class="episodes-error">Failed to load episodes.</div>'
        })
    } else {
      // Just expand
      episodesContainer.style.maxHeight = `${episodesContainer.scrollHeight}px`
    }

    button.querySelector("span").textContent = "Hide Episodes"
    button.querySelector("svg").style.transform = "rotate(180deg)"
  }
}

// Function to play a TV show from vidsrc directly
window.playVidsrcTvShow = (vidsrcId) => {
  if (!vidsrcId) return

  const streamURL = `https://vidsrc.xyz/embed/tv/${vidsrcId}`

  // Store stream URL and redirect to loading screen
  localStorage.setItem("streamURL", streamURL)
  sessionStorage.setItem("playMovieIntent", "true")
  window.location.href = "loading.html"
}

// Set active navigation item based on current page
document.addEventListener("DOMContentLoaded", () => {
  const currentPath = window.location.pathname
  const navItems = document.querySelectorAll(".bottom-nav .nav-item")

  // Remove active class from all items
  navItems.forEach((item) => {
    item.classList.remove("active")
  })

  // Set active class based on current page
  if (
    currentPath.includes("index.html") ||
    currentPath === "/" ||
    currentPath.includes("detail.html") ||
    currentPath.includes("movie-list.html")
  ) {
    document.querySelector(".bottom-nav .nav-item:nth-child(1)").classList.add("active")
  } else if (currentPath.includes("tv-shows.html") || currentPath.includes("tv-detail.html")) {
    document.querySelector(".bottom-nav .nav-item:nth-child(2)").classList.add("active")
  } else if (currentPath.includes("music.html")) {
    document.querySelector(".bottom-nav .nav-item:nth-child(3)").classList.add("active")
  } else if (currentPath.includes("categories.html")) {
    document.querySelector(".bottom-nav .nav-item:nth-child(4)").classList.add("active")
  }
})

