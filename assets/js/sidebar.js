import { api_key, fetchDataFromServer } from "./api.js"

export function sidebar() {
  const genreList = {}

  fetchDataFromServer(`https://api.themoviedb.org/3/genre/movie/list?api_key=${api_key}`, ({ genres }) => {
    for (const { id, name } of genres) {
      genreList[id] = name
    }

    // Create genre links for the categories page
    createGenreLinks(genreList)
  })
}

function createGenreLinks(genreList) {
  // We'll use the bottom navigation instead of a sidebar
  // This function is kept for compatibility with the existing code

  // Add click event to the Categories nav item
  const categoriesNavItem = document.querySelector(".nav-item:nth-child(2)")
  if (categoriesNavItem) {
    categoriesNavItem.addEventListener("click", (event) => {
      event.preventDefault()

      // Show a modal with genre options
      showGenreModal(genreList)
    })
  }
}

function showGenreModal(genreList) {
  // Create a modal for genres
  const genreModal = document.createElement("div")
  genreModal.classList.add("genre-modal")

  genreModal.innerHTML = `
    <div class="genre-modal-content">
      <div class="genre-modal-header">
        <h2>Categories</h2>
        <button class="genre-modal-close">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
      <div class="genre-list"></div>
    </div>
  `

  // Add styles for the modal
  const style = document.createElement("style")
  style.textContent = `
    .genre-modal {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.9);
      z-index: 1000;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .genre-modal-content {
      width: 90%;
      max-width: 500px;
      max-height: 80vh;
      background-color: #141414;
      border-radius: 8px;
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }
    
    .genre-modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }
    
    .genre-modal-header h2 {
      margin: 0;
      font-size: 1.8rem;
    }
    
    .genre-modal-close {
      background: none;
      border: none;
      color: white;
      cursor: pointer;
    }
    
    .genre-list {
      padding: 16px;
      overflow-y: auto;
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 12px;
    }
    
    .genre-item {
      padding: 12px;
      background-color: rgba(255, 255, 255, 0.1);
      border-radius: 4px;
      text-align: center;
      cursor: pointer;
      transition: background-color 0.2s;
    }
    
    .genre-item:hover {
      background-color: rgba(255, 255, 255, 0.2);
    }
  `

  document.head.appendChild(style)
  document.body.appendChild(genreModal)

  // Add genre items
  const genreListElem = genreModal.querySelector(".genre-list")

  // Add special categories
  const specialCategories = [
    { id: "en", name: "English Movies", param: "with_original_language=en" },
    { id: "18plus", name: "Rated 18+", param: "certification_country=US&certification=R" },
  ]

  // Add special categories first
  for (const { id, name, param } of specialCategories) {
    const genreItem = document.createElement("div")
    genreItem.classList.add("genre-item")
    genreItem.textContent = name
    genreItem.addEventListener("click", () => {
      window.localStorage.setItem("genreName", name)
      window.localStorage.setItem("urlParam", param)
      window.location.href = "./movie-list.html"

      // Close the modal
      document.body.removeChild(genreModal)
      document.head.removeChild(style)
    })

    genreListElem.appendChild(genreItem)
  }

  // Add regular genres
  for (const [genreId, genreName] of Object.entries(genreList)) {
    const genreItem = document.createElement("div")
    genreItem.classList.add("genre-item")
    genreItem.textContent = genreName
    genreItem.addEventListener("click", () => {
      window.localStorage.setItem("genreName", genreName)
      window.localStorage.setItem("urlParam", `with_genres=${genreId}`)
      window.location.href = "./movie-list.html"

      // Close the modal
      document.body.removeChild(genreModal)
      document.head.removeChild(style)
    })

    genreListElem.appendChild(genreItem)
  }

  // Close modal when clicking the close button
  genreModal.querySelector(".genre-modal-close").addEventListener("click", () => {
    document.body.removeChild(genreModal)
    document.head.removeChild(style)
  })

  // Close modal when clicking outside the content
  genreModal.addEventListener("click", (event) => {
    if (event.target === genreModal) {
      document.body.removeChild(genreModal)
      document.head.removeChild(style)
    }
  })
}

