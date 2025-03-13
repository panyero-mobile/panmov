import { api_key, fetchDataFromServer } from "./api.js"
import { createMovieCard } from "./movie-card.js"
import { createTvCard } from "./tv-card.js"

export function search() {
  const searchField = document.querySelector("[search-field]")
  const searchModal = document.querySelector("[search-modal]")
  const searchTogglers = document.querySelectorAll("[search-toggler]")

  // Toggle search modal
  if (searchTogglers.length > 0) {
    for (const toggler of searchTogglers) {
      toggler.addEventListener("click", () => {
        searchModal.classList.toggle("active")
        if (searchModal.classList.contains("active")) {
          searchField.focus()
        }
      })
    }
  }

  if (!searchField) return

  let searchTimeout

  searchField.addEventListener("input", () => {
    if (!searchField.value.trim()) {
      searchModal.querySelector(".search-results").innerHTML = ""
      return
    }

    clearTimeout(searchTimeout)

    searchTimeout = setTimeout(() => {
      // Determine if we're on the TV shows page or movies page
      const isOnTvPage = window.location.pathname.includes("tv-")
      const searchType = isOnTvPage ? "tv" : "movie"

      fetchDataFromServer(
        `https://api.themoviedb.org/3/search/${searchType}?api_key=${api_key}&query=${searchField.value}&page=1&include_adult=false`,
        ({ results: resultsList }) => {
          searchModal.querySelector(".search-results").innerHTML = ""

          if (resultsList && resultsList.length) {
            for (const item of resultsList) {
              const card = isOnTvPage ? createTvCard(item) : createMovieCard(item)
              searchModal.querySelector(".search-results").appendChild(card)
            }
          } else {
            searchModal.querySelector(".search-results").innerHTML = `
              <p class="no-results">No results found for "${searchField.value}"</p>
            `
          }
        },
      )
    }, 500)
  })
}

