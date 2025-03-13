import { api_key, imageBaseURL, fetchDataFromServer } from "./api.js"
import { createMovieCard } from "./movie-card.js"
import { search } from "./search.js"

const pageContent = document.querySelector("[page-content]")

// Category definitions
const movieCategories = [
  {
    title: "Tagalog HD Movies",
    path: "/discover/movie",
    params: "with_original_language=tl&sort_by=release_date.desc",
    featured: true,
  },
  {
    title: "Action Movies",
    path: "/discover/movie",
    params: "with_genres=28&sort_by=popularity.desc",
  },
  {
    title: "Comedy Movies",
    path: "/discover/movie",
    params: "with_genres=35&sort_by=popularity.desc",
  },
  {
    title: "Horror Movies",
    path: "/discover/movie",
    params: "with_genres=27&sort_by=popularity.desc",
  },
  {
    title: "Romance Movies",
    path: "/discover/movie",
    params: "with_genres=10749&sort_by=popularity.desc",
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

  // Find the featured category (Tagalog HD)
  const featuredCategory = movieCategories.find((category) => category.featured) || movieCategories[0]

  // Fetch movies for the featured category to create hero banner
  fetchDataFromServer(
    `https://api.themoviedb.org/3${featuredCategory.path}?api_key=${api_key}&${featuredCategory.params}&page=1`,
    createHeroBanner,
  )
})

// Create hero banner from the featured category
const createHeroBanner = ({ results: movieList }) => {
  if (!movieList || movieList.length === 0) {
    console.error("No movies found for hero banner")
    return
  }

  const movie = movieList[Math.floor(Math.random() * movieList.length)]
  const { backdrop_path, title, overview, genre_ids, id, release_date } = movie

  const heroSection = document.createElement("section")
  heroSection.classList.add("hero-banner")

  heroSection.innerHTML = `
    <img src="${imageBaseURL}original${backdrop_path || "/assets/images/poster-bg-icon.png"}" alt="${title}" class="img-cover">
    
    <div class="hero-content">
      <h1 class="hero-title">${title}</h1>
      <p class="hero-subtitle">${genreList.asString(genre_ids)} • ${release_date?.split("-")[0] || "N/A"}</p>
      
      <div class="hero-buttons">
        <a href="./detail.html" class="btn" onclick="getMovieDetail(${id})">
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

  // Create category sections
  for (const category of movieCategories) {
    fetchDataFromServer(
      `https://api.themoviedb.org/3${category.path}?api_key=${api_key}&${category.params}&page=1`,
      createCategorySection,
      category.title,
    )
  }
}

// Create category sections with movies
const createCategorySection = ({ results: movieList }, title) => {
  if (!movieList || movieList.length === 0) return

  const categorySection = document.createElement("section")
  categorySection.classList.add("netflix-row")

  categorySection.innerHTML = `
    <h2 class="section-heading">${title}</h2>
    <div class="row-container"></div>
  `

  for (const movie of movieList) {
    const movieCard = createMovieCard(movie)
    categorySection.querySelector(".row-container").appendChild(movieCard)
  }

  pageContent.appendChild(categorySection)
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

// Add view all functionality for Tagalog HD category
document.addEventListener("DOMContentLoaded", () => {
  // This will be added dynamically after the categories are loaded
  setTimeout(() => {
    const tagalogSection = document.querySelector(".netflix-row:first-of-type")
    if (tagalogSection) {
      const viewAllLink = document.createElement("a")
      viewAllLink.href = "#"
      viewAllLink.className = "view-all-link"
      viewAllLink.textContent = "View All"
      viewAllLink.style.marginLeft = "10px"
      viewAllLink.style.fontSize = "14px"
      viewAllLink.style.color = "var(--primary)"

      const heading = tagalogSection.querySelector(".section-heading")
      heading.appendChild(viewAllLink)

      viewAllLink.addEventListener("click", (e) => {
        e.preventDefault()
        window.localStorage.setItem("genreName", "Tagalog HD Movies")
        window.localStorage.setItem("urlParam", "with_original_language=tl&sort_by=release_date.desc")
        window.location.href = "./movie-list.html"
      })
    }
  }, 2000)
})

