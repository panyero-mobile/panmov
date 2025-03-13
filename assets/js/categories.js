document.addEventListener('DOMContentLoaded', function() {
      async function fetchFromTMDB(endpoint) {
        const apiKey = '7a5cf3c679b58ed507187030e928245a';
        const baseUrl = 'https://api.themoviedb.org/3';

        try {
          const response = await fetch(`${baseUrl}${endpoint}?api_key=${apiKey}`);
          if (!response.ok) {
            throw new Error(`TMDB API error: ${response.status}`);
          }
          return await response.json();
        } catch (error) {
          console.error('Error fetching from TMDB:', error);
          return null;
        }
      }

      function getGenreImage(genreId) {
        const genreImages = {
          28: 'https://images.unsplash.com/photo-1508614999368-9260051292e5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG0',
          12: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG0',
          16: 'https://images.unsplash.com/photo-1518022525094-218670c9b745?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG0',
          35: 'https://images.unsplash.com/photo-1527224857830-43a7acc85260?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG0',
          80: 'https://images.unsplash.com/photo-1453873531674-2151bcd01707?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG0',
          99: 'https://images.unsplash.com/photo-1468421870903-4df1664ac249?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG0',
          18: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG0',
          10751: 'https://images.unsplash.com/photo-1478071735433-5d8f9a54c5c5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG0',
          14: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG0',
          36: 'https://images.unsplash.com/photo-1461360370896-922624d12aa1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG0',
          27: 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG0',
          10402: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?ixlib=rb-4.0.3&ixid=M3wxMjA7fDB8MHxwaG0',
          9648: 'https://images.unsplash.com/photo-1519692933481-e162a57d6721?ixlib=rb-4.0.3&ixid=M3wxMjA7fDB8MHxwaG0',
          10749: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?ixlib=rb-4.0.3&ixid=M3wxMjA7fDB8MHxwaG0',
          878: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG0',
          10770: 'https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG0',
          53: 'https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG0',
          10752: 'https://images.unsplash.com/photo-1547483238-2cbf881a559f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG0',
          37: 'https://images.unsplash.com/photo-1551907234-fb773fb08a2a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG0',
          10759: 'https://images.unsplash.com/photo-1533928298208-27ff66555d8d?ixlib=rb-4.0.3&ixid=M3wxMjA7fDB8MHxwaG0',
          10762: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?ixlib=rb-4.0.3&ixid=M3wxMjA7fDB8MHxwaG0',
          10763: 'https://images.unsplash.com/photo-1495020689067-958852a7765e?ixlib=rb-4.0.3&ixid=M3wxMjA7fDB8MHxwaG0',
          10764: 'https://images.unsplash.com/photo-1494059980473-813e73ee784b?ixlib=rb-4.0.3&ixid=M3wxMjA7fDB8MHxwaG0',
          10765: 'https://images.unsplash.com/photo-1506901437675-cde80ff9c746?ixlib=rb-4.0.3&ixid=M3wxMjA7fDB8MHxwaG0',
          10766: 'https://images.unsplash.com/photo-1516321497487-e288fb19713f?ixlib=rb-4.0.3&ixid=M3wxMjA7fDB8MHxwaG0',
          10767: 'https://images.unsplash.com/photo-1560169897-fc0cdbdfa4d5?ixlib=rb-4.0.3&ixid=M3wxMjA7fDB8MHxwaG0',
          10768: 'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?ixlib=rb-4.0.3&ixid=M3wxMjA7fDB8MHxwaG0',
        };

        return genreImages[genreId] || 'https://images.unsplash.com/photo-1485846234645-a62644f84728?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG0';
      }

      function loadTagalogHDMovies() {
        const tagalogHDContainer = document.getElementById('tagalog-hd-movies');

        const tagalogHDCard = document.createElement('div');
        tagalogHDCard.className = 'category-card';
        tagalogHDCard.onclick = function() {
          getMovieList('with_original_language=tl&sort_by=release_date.desc', 'TagalogHD');
        };

        tagalogHDCard.innerHTML = `
          <div class="category-image">
            <img src="https://images.unsplash.com/photo-1602611500096-76c2a9b87ebb?ixlib=rb-4.0.3&ixid=M3wxMjA7fDB8MHxwaG0" alt="TagalogHD" class="img-cover">
          </div>
          <div class="category-title">TagalogHD Movies</div>
        `;

        tagalogHDContainer.innerHTML = '';
        tagalogHDContainer.appendChild(tagalogHDCard);
      }

      async function loadMovieGenres() {
        const movieGenresContainer = document.getElementById('movie-genres-grid');

        try {
          const data = await fetchFromTMDB('/genre/movie/list');

          if (!data || !data.genres || data.genres.length === 0) {
            throw new Error('No movie genres found');
          }

          let genresHTML = '';

          data.genres.forEach(genre => {
            genresHTML += `
              <div class="category-card" onclick="getMovieList('with_genres=${genre.id}', '${genre.name}')">
                <div class="category-image">
                  <img src="${getGenreImage(genre.id)}" alt="${genre.name}" class="img-cover">
                </div>
                <div class="category-title">${genre.name}</div>
              </div>
            `;
          });

          if (genresHTML) {
            movieGenresContainer.innerHTML = genresHTML;
          } else {
            throw new Error('No movie genres to display');
          }
        } catch (error) {
          console.error('Error loading movie genres:', error);
          movieGenresContainer.innerHTML = '<div class="error-message">Failed to load movie genres. Please try again later.</div>';
        }
      }

      async function loadTvGenres() {
        const tvGenresContainer = document.getElementById('tv-genres-grid');

        try {
          const data = await fetchFromTMDB('/genre/tv/list');

          if (!data || !data.genres || data.genres.length === 0) {
            throw new Error('No TV genres found');
          }

          let genresHTML = '';

          data.genres.forEach(genre => {
            genresHTML += `
              <div class="category-card" onclick="getTvShowList('with_genres=${genre.id}', '${genre.name}')">
                <div class="category-image">
                  <img src="${getGenreImage(genre.id)}" alt="${genre.name}" class="img-cover">
                </div>
                <div class="category-title">${genre.name}</div>
              </div>
            `;
          });

          if (genresHTML) {
            tvGenresContainer.innerHTML = genresHTML;
          } else {
            throw new Error('No TV genres to display');
          }
        } catch (error) {
          console.error('Error loading TV genres:', error);
          tvGenresContainer.innerHTML = '<div class="error-message">Failed to load TV genres. Please try again later.</div>';
        }
      }

      function loadSpecialCollections() {
        const specialCollectionsContainer = document.getElementById('special-collections-grid');

        const specialCollections = [
          { id: 'en', name: 'English Movies', param: 'with_original_language=en', image: 'https://images.unsplash.com/photo-1500462918059-b1a0cb512f1d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG0', image: 'https://images.unsplash.com/photo-1500462918059-b1a0cb512f1d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG0' },
          { id: '18plus', name: 'Rated 18+', param: 'certification_country=US&certification=R', image: 'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG0' },
          { id: 'top_rated', name: 'Top Rated', param: 'sort_by=vote_average.desc&vote_count.gte=1000', image: 'https://images.unsplash.com/photo-1594908900066-3f47337549d8?ixlib=rb-4.0.3&ixid=M3wxMjA7fDB8MHxwaG0', image: 'https://images.unsplash.com/photo-1594908900066-3f47337549d8?ixlib=rb-4.0.3&ixid=M3wxMjA7fDB8MHxwaG0' },
          { id: 'new', name: 'New Releases', param: 'sort_by=release_date.desc', image: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?ixlib=rb-4.0.3&ixid=M3wxMjA7fDB8MHxwaG0' },
          { id: 'popular', name: 'Popular Now', param: 'sort_by=popularity.desc', image: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?ixlib=rb-4.0.3&ixid=M3wxMjA7fDB8MHxwaG0' }
        ];

        let collectionsHTML = '';

        specialCollections.forEach(collection => {
          collectionsHTML += `
            <div class="category-card" onclick="getMovieList('${collection.param}', '${collection.name}')">
              <div class="category-image">
                <img src="${collection.image}" alt="${collection.name}" class="img-cover">
              </div>
              <div class="category-title">${collection.name}</div>
            </div>
          `;
        });

        specialCollectionsContainer.innerHTML = collectionsHTML;
      }

      window.getTvShowList = function(urlParam, genreName) {
        window.localStorage.setItem("genreName", genreName);
        window.localStorage.setItem("urlParam", urlParam);
        window.localStorage.setItem("mediaType", "tv");
        window.location.href = "./movie-list.html";
      };

      window.getMovieList = function(urlParam, genreName) {
        window.localStorage.setItem("genreName", genreName);
        window.localStorage.setItem("urlParam", urlParam);
        window.localStorage.setItem("mediaType", "movie");
        window.location.href = "./movie-list.html";
      };

      document.querySelectorAll('.category-nav-item').forEach(item => {
        item.addEventListener('click', function(e) {
          e.preventDefault();

          document.querySelectorAll('.category-nav-item').forEach(navItem => {
            navItem.classList.remove('active');
          });

          this.classList.add('active');

          const targetId = this.getAttribute('href').substring(1);
          const targetSection = document.getElementById(targetId);

          if (targetSection) {
            window.scrollTo({
              top: targetSection.offsetTop - 70,
              behavior: 'smooth'
            });
          }
        });
      });

      window.addEventListener('scroll', function() {
        const sections = document.querySelectorAll('.section-title');
        const navItems = document.querySelectorAll('.category-nav-item');

        let currentSection = '';

        sections.forEach(section => {
          const sectionTop = section.offsetTop - 100;
          const sectionHeight = section.offsetHeight;

          if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
            currentSection = section.getAttribute('id');
          }
        });

        navItems.forEach(item => {
          item.classList.remove('active');
          if (item.getAttribute('href') === `#${currentSection}`) {
            item.classList.add('active');
          }
        });
      });

      loadTagalogHDMovies();
      loadMovieGenres();
      loadTvGenres();
      loadSpecialCollections();

      document.querySelector('.category-nav-item').classList.add('active');
    });
</script>
