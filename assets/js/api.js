const api_key = "7a5cf3c679b58ed507187030e928245a"
const imageBaseURL = "https://image.tmdb.org/t/p/"

/**
 * fetch data from a server using the `url` and passes
 * the result in JSON data to a `callback` function,
 * along with an optional parameter if has `optionalParam`.
 */

const fetchDataFromServer = (url, callback, optionalParam) => {
  fetch(url)
    .then((response) => response.json())
    .then((data) => callback(data, optionalParam))
}

/**
 * Fetch data from vidsrc.xyz API
 */
const fetchVidsrcData = (endpoint, callback) => {
  fetch(endpoint)
    .then((response) => response.json())
    .then((data) => callback(data))
    .catch((error) => {
      console.error("Error fetching from vidsrc:", error)
      callback({ results: [] })
    })
}

/**
 * Get movie stream URL
 */
const getMovieStreamURL = (movieId) => {
  return `https://vidsrc.xyz/embed/movie/${movieId}`
}

/**
 * Get TV show stream URL
 */
const getTvShowStreamURL = (tvId) => {
  return `https://vidsrc.xyz/embed/tv/${tvId}`
}

/**
 * Get episode stream URL
 */
const getEpisodeStreamURL = (tvId, seasonNumber, episodeNumber) => {
  return `https://vidsrc.xyz/embed/tv/${tvId}/${seasonNumber}-${episodeNumber}`
}

export {
  imageBaseURL,
  api_key,
  fetchDataFromServer,
  fetchVidsrcData,
  getMovieStreamURL,
  getTvShowStreamURL,
  getEpisodeStreamURL,
}

