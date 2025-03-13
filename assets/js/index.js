import { sidebar } from "./sidebar.js"
import { api_key, imageBaseURL, fetchDataFromServer } from "./api.js"
import { createMovieCard } from "./movie-card.js"
import { search } from "./search.js"

const pageContent = document.querySelector("[page-content]")
if (!pageContent) {
  console.error("Page content element not found")
} else {
  // Netflix-style categories
  const movieCategories = [
    {
      title: "Popular on Netflix",
      path: "/movie/popular",
    },
    {
      title: "Trending Now",
      path: "/trending/movie/week",
    },
    {
      title: "Top Rated",
      path: "/movie/top_rated",
    },
    {
      title: "Upcoming Movies",
      path: "/movie/upcoming",
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

  fetchDataFromServer(`https://api.themoviedb.org/3/genre/movie/list?api_key=${api_key}`, ({ genres }) => {
    for (const { id, name } of genres) {
      genreList[id] = name
    }

    fetchDataFromServer(`https://api.themoviedb.org/3/movie/popular?api_key=${api_key}&page=1`, createHeroBanner)
  })

  // Create Netflix-style hero banner
  const createHeroBanner = ({ results: movieList }) => {
    if (!movieList || movieList.length === 0) {
      console.error("No movies found for hero banner")
      return
    }

    const movie = movieList[Math.floor(Math.random() * movieList.length)]
    const { backdrop_path, title, overview, genre_ids, id } = movie

    const heroSection = document.createElement("section")
    heroSection.classList.add("hero-banner")

    heroSection.innerHTML = `
      <img src="${imageBaseURL}original${backdrop_path || "/assets/images/poster-bg-icon.png"}" alt="${title}" class="img-cover">
      
      <div class="hero-content">
        <h1 class="hero-title">${title}</h1>
        <p class="hero-subtitle">${genreList.asString(genre_ids)}</p>
        
        <div class="hero-buttons">
          <a href="./detail.html" class="btn" onclick="getMovieDetail(${id})">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z"/>
            </svg>
            <span>Play</span>
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

    // Create movie category rows
    for (const category of movieCategories) {
      fetchDataFromServer(
        `https://api.themoviedb.org/3${category.path}?api_key=${api_key}&page=1`,
        createMovieRow,
        category.title,
      )
    }
  }

  // Create Netflix-style movie rows
  const createMovieRow = ({ results: movieList }, title) => {
    if (!movieList || movieList.length === 0) return

    const movieRow = document.createElement("section")
    movieRow.classList.add("netflix-row")

    movieRow.innerHTML = `
      <h2 class="section-heading">${title}</h2>
      <div class="row-container"></div>
    `

    for (const movie of movieList) {
      const movieCard = createMovieCard(movie)
      movieRow.querySelector(".row-container").appendChild(movieCard)
    }

    pageContent.appendChild(movieRow)
  }

  // Initialize search
  search()

  // Add scroll event to change header background
  window.addEventListener("scroll", () => {
    const header = document.querySelector(".header")
    if (header) {
      if (window.scrollY > 50) {
        header.classList.add("scrolled")
      } else {
        header.classList.remove("scrolled")
      }
    }
  })

  // Initialize sidebar
  sidebar()
}

