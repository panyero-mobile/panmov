import { api_key, fetchDataFromServer } from "./api.js"
import { createMovieCard } from "./movie-card.js"
import { createTvCard } from "./tv-card.js"
import { search } from "./search.js"

const genreName = window.localStorage.getItem("genreName")
const urlParam = window.localStorage.getItem("urlParam")
const mediaType = window.localStorage.getItem("mediaType") || "movie" // Default to movie if not specified

const pageContent = document.querySelector("[page-content]")

let currentPage = 1
let totalPages = 0

// Update document title based on media type
document.title = `${genreName} - Panyero`

// Determine the endpoint based on media type
const endpoint =
  mediaType === "tv"
    ? `https://api.themoviedb.org/3/discover/tv?api_key=${api_key}&sort_by=popularity.desc&include_adult=false&page=${currentPage}&${urlParam}`
    : `https://api.themoviedb.org/3/discover/movie?api_key=${api_key}&sort_by=popularity.desc&include_adult=false&page=${currentPage}&${urlParam}`

fetchDataFromServer(endpoint, ({ results: itemList, total_pages }) => {
  totalPages = total_pages

  const listElem = document.createElement("section")
  listElem.classList.add("category-page")
  listElem.ariaLabel = `${genreName} ${mediaType === "tv" ? "TV Shows" : "Movies"}`

  listElem.innerHTML = `
      <div class="category-header">
        <h1 class="section-heading">${genreName} ${mediaType === "tv" ? "TV Shows" : "Movies"}</h1>
      </div>
      
      <div class="search-results" grid-list></div>
      
      <button class="btn load-more" load-more>Load More</button>
    `

  // Add items to the grid
  for (const item of itemList) {
    const card = mediaType === "tv" ? createTvCard(item) : createMovieCard(item)
    listElem.querySelector(".search-results").appendChild(card)
  }

  pageContent.appendChild(listElem)

  // Load more button functionality
  document.querySelector("[load-more]").addEventListener("click", function () {
    if (currentPage >= totalPages) {
      this.style.display = "none"
      return
    }

    currentPage++
    this.classList.add("loading")

    fetchDataFromServer(
      mediaType === "tv"
        ? `https://api.themoviedb.org/3/discover/tv?api_key=${api_key}&sort_by=popularity.desc&include_adult=false&page=${currentPage}&${urlParam}`
        : `https://api.themoviedb.org/3/discover/movie?api_key=${api_key}&sort_by=popularity.desc&include_adult=false&page=${currentPage}&${urlParam}`,
      ({ results: itemList }) => {
        this.classList.remove("loading")

        for (const item of itemList) {
          const card = mediaType === "tv" ? createTvCard(item) : createMovieCard(item)
          listElem.querySelector(".search-results").appendChild(card)
        }
      },
    )
  })
})

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

