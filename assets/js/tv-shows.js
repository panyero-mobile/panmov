import { api_key, imageBaseURL, fetchDataFromServer, fetchVidsrcData } from "./api.js"
import { createTvCard } from "./tv-card.js"
import { search } from "./search.js"

const pageContent = document.querySelector("[page-content]")

// TV Show categories
const tvCategories = [
  {
    title: "Popular TV Shows",
    path: "/tv/popular",
  },
  {
    title: "Top Rated TV Shows",
    path: "/tv/top_rated",
  },
  {
    title: "TV Shows Airing Today",
    path: "/tv/airing_today",
  },
  {
    title: "TV Shows On The Air",
    path: "/tv/on_the_air",
  },
]

// Fetch genre list
const genreList = {
  asString(genreIdList) {
    const newGenreList = []

    for (const genreId of genreIdList) {
      this[genreId] && newGenreList.push(this[genreId])
    }

    return newGenreList.join(", ")
  },
}

fetchDataFromServer(`https://api.themoviedb.org/3/genre/tv/list?api_key=${api_key}`, ({ genres }) => {
  for (const { id, name } of genres) {
    genreList[id] = name
  }

  fetchDataFromServer(`https://api.themoviedb.org/3/tv/popular?api_key=${api_key}&page=1`, createHeroBanner)
})

// Create Netflix-style hero banner
const createHeroBanner = ({ results: tvShowList }) => {
  const tvShow = tvShowList[Math.floor(Math.random() * tvShowList.length)]
  const { backdrop_path, name, overview, genre_ids, id } = tvShow

  const heroSection = document.createElement("section")
  heroSection.classList.add("hero-banner")

  heroSection.innerHTML = `
    <img src="${imageBaseURL}original${backdrop_path || "/assets/images/poster-bg-icon.png"}" alt="${name}" class="img-cover">
    
    <div class="hero-content">
      <h1 class="hero-title">${name}</h1>
      <p class="hero-subtitle">${genreList.asString(genre_ids)}</p>
      
      <div class="hero-buttons">
        <a href="./tv-detail.html" class="btn" onclick="getTvShowDetail(${id})">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M8 5v14l11-7z"/>
          </svg>
          <span>Watch Now</span>
        </a>
        
        <button class="btn btn-secondary">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
          </svg>
          <span>More Info</span>
        </button>
      </div>
    </div>
  `

  pageContent.appendChild(heroSection)

  // Create TV show category rows
  for (const category of tvCategories) {
    fetchDataFromServer(
      `https://api.themoviedb.org/3${category.path}?api_key=${api_key}&page=1`,
      createTvShowRow,
      category.title,
    )
  }

  // Try to fetch latest TV shows from vidsrc
  try {
    fetchVidsrcData("https://vidsrc.xyz/tvshows/latest/page-1.json", createLatestTvShowsRow)
  } catch (error) {
    console.error("Error fetching from vidsrc:", error)
  }
}

// Create Netflix-style TV show rows
const createTvShowRow = ({ results: tvShowList }, title) => {
  if (!tvShowList || tvShowList.length === 0) return

  const tvShowRow = document.createElement("section")
  tvShowRow.classList.add("netflix-row")

  tvShowRow.innerHTML = `
    <h2 class="section-heading">${title}</h2>
    <div class="row-container"></div>
  `

  for (const tvShow of tvShowList) {
    const tvCard = createTvCard(tvShow)
    tvShowRow.querySelector(".row-container").appendChild(tvCard)
  }

  pageContent.appendChild(tvShowRow)
}

// Create row for latest TV shows from vidsrc
const createLatestTvShowsRow = (data) => {
  if (!data || !data.results || data.results.length === 0) return

  const tvShowRow = document.createElement("section")
  tvShowRow.classList.add("netflix-row")

  tvShowRow.innerHTML = `
    <h2 class="section-heading">Latest Added TV Shows</h2>
    <div class="row-container"></div>
  `

  for (const tvShow of data.results) {
    // Create a simplified card for vidsrc data
    const card = document.createElement("div")
    card.classList.add("tv-card")

    card.innerHTML = `
      <div class="card-poster">
        <img 
          src="${tvShow.poster || "/assets/images/poster-bg-icon.png"}" 
          alt="${tvShow.title}" 
          class="img-cover" 
          loading="lazy"
          onerror="this.src='/assets/images/poster-bg-icon.png'"
        >
      </div>
      
      <div class="card-content">
        <h3 class="title">${tvShow.title}</h3>
        <div class="meta-list">
          <span class="meta-item">${tvShow.year || "N/A"}</span>
        </div>
      </div>
      
      <a href="#" class="card-btn" title="${tvShow.title}" onclick="playVidsrcTvShow('${tvShow.id}')"></a>
    `

    tvShowRow.querySelector(".row-container").appendChild(card)
  }

  pageContent.appendChild(tvShowRow)
}

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

