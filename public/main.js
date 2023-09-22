// let loginLink = document.querySelector('.login-link')
// let loginModal = document.querySelector('.login-modal')
// let wholePage = document.querySelector('.container')
// function showLoginModal() {
//   loginModal.classList.remove('hide-content')
//   wholePage.classList.add('is-blurred')
// }
// let closeLogin = document.querySelector('.close-login')
// closeLogin.addEventListener('click', () => {
//   loginModal.classList.add('hide-content')
//   wholePage.classList.remove('is-blurred')
// })

let hamburger = document.querySelector('.hamburger')
let navMenu = document.querySelector('.nav-menu')
hamburger.addEventListener('click', () => {
  navMenu.style.display = navMenu.style.display == 'flex' ? 'none' : 'flex'
})

let movieSearchField = document.querySelector('.movie-search-field')
let movieContainer = document.querySelector('.movie-info')
let moviePlot = document.querySelector('.plot')
let movieId = document.querySelector('.movie-id').innerText
let movieGenre = document.querySelector('.genre')
let movieTitle = document.querySelector('.title')
let moviePoster = document.querySelector('.poster')
let bookmarkStatus = false;
let isMoviePresent = false;

// auto-complete search suggestions
const searchResults = document.querySelector('.result-list')
movieSearchField.addEventListener('input', async function(){
  const query = movieSearchField.value.trim()
  if(query.length > 0){
    searchResults.classList.remove('hide-content')
  } else {
    searchResults.classList.add('hide-content')
    return
  }

  try{
    searchResults.innerHTML = ''
    const response = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=2732cfcce0a17dae7c833ce86f4238e7&query=${query}`)
    const data = await response.json()
    const movies = data.results
    if(!movies) return
    displayMovieList(movies)

  } catch (error) {
    console.error(error)
  }
})

function displayMovieList(movies){
  movies.forEach(movie => {
    let resultListItem = document.createElement('div')
    resultListItem.dataset.id = movie.id
    resultListItem.classList.add('result-list-item')
    if(movie.poster_path){
      movieThumb = `https://image.tmdb.org/t/p/w92/${movie.poster_path}`
    } else {
      movieThumb = '/icons/no-image.png'
    }
    resultListItem.innerHTML = `
    <img src="${movieThumb}" alt="">
    <div class="result-item-info">
      <h4>${movie.title}</h4>
      <span>${movie.release_date.split('-')[0]}</span>
    </div>`
    searchResults.appendChild(resultListItem)      
  })

  // users can load movies by clicking on the results from auto-complete suggestions
  let searchedMovies = searchResults.querySelectorAll('.result-list-item')
  searchedMovies.forEach(movie => {
    movie.addEventListener('click', async() => {
      searchResults.classList.add('hide-content')
      getMovie(movie.dataset.id)
    })
  })
}

// searching movies from the search button
let searchBtn = document.querySelector('.search-btn')
searchBtn.addEventListener('click',function() {
  searchResults.classList.add('hide-content')
  const enteredMovie = movieSearchField.value
  const finalName = enteredMovie.split(' ').join('%20') 
  // urlTitle = `https://www.omdbapi.com/?t=${finalName}&apikey=75dd0b86`
  urlTitle = `https://api.themoviedb.org/3/search/movie?api_key=2732cfcce0a17dae7c833ce86f4238e7&query=${finalName}&append_to_response=genres`
  fetchMovies(urlTitle)  
})
movieSearchField.addEventListener('keypress', (event) => {
  if(event.key == "Enter"){
    event.preventDefault()
    searchBtn.click()
  }
})

async function fetchMovies(url) {
  const movies = await fetch(url)
  const moviesData = await movies.json()
  if(moviesData.total_results === 0){
    movieTitle.innerText = "Movie not found!"
    return
  }
  getMovie(moviesData.results[0].id)
}

// fetch details for a particular movie based on an id
async function getMovie(tmdbId){ 
  try {      
    const movie = await fetch(`https://api.themoviedb.org/3/movie/${tmdbId}?api_key=2732cfcce0a17dae7c833ce86f4238e7&append_to_response=credits,images&include_image_language=null,en`)
    const data = await movie.json()
    bookmarkBtn.classList.remove('hide-content')
    movieId = data.imdb_id
    if (!data.poster_path) {
      moviePoster.src = '/icons/no-image.png'
    } else {
      moviePoster.src = `https://image.tmdb.org/t/p/w500${data.poster_path}`
      let intervalId
      let additionalImages
      movieContainer.addEventListener('mouseover', changePosters) 

      movieContainer.addEventListener('mouseout', () => {
        clearInterval(intervalId)
        additionalImages = null
        moviePoster.src = `https://image.tmdb.org/t/p/w500${data.poster_path}`
        // movieContainer.removeEventListener('mouseover', changePosters) // if we don't remove the eventlistener data from previous fetches persist in our setInterval
      })
      function changePosters() {
        additionalImages = data.images.posters
        if (additionalImages.length > 0) {
          intervalId = setInterval(() => {
            moviePoster.src = `https://image.tmdb.org/t/p/w500${additionalImages[Math.floor(Math.random() * additionalImages.length)].file_path}`
          }, 1500)
        }
      }
    } 
    
    movieTitle.innerText = data.original_title
    
    let genreNames = data.genres.map(genre => genre['name'])
    movieGenre.innerText = genreNames.join(', ')

    document.querySelector('.actors').innerText = 'Starring: ' + data.credits.cast.slice(0, 4).map(actor => actor.original_name).join(', ')
    moviePlot.classList.remove('hide-content')
    moviePlot.innerText = data.overview

    checkPreviousBookmark(movieId)
    getPreviousReviews(movieId)
    isMoviePresent = true;
  } catch (error) {
    console.error(error)
  }
}
  
// sending the Imdb Id of a movie to our server so we can display the reviews made for that particular movie after grabbing it from the database. We cannot use the GET method here because it doesn't have a body (we could use query parameter though), but POST method has a body through which we can send data to the server
async function getPreviousReviews(movieId) {
  try{
    const response = await fetch('reviews/getReview', {
      method: 'post',
      headers: {'Content-Type' : 'application/json'},
      body: JSON.stringify({
        'movieId': movieId
      })
    })
    const data = await response.json()
    let reviewsMade = data.reviews
    let activeUser = data.userId
    displayReviews(reviewsMade, activeUser)
  } catch(error){console.error(error)}
}  

// updating new review to the DOM without using the database or reloading the page
async function displayReviews(reviews, user){
  const reviewcollection = document.querySelector('.review-collection')
  reviewcollection.classList.remove('hide-content')
  const reviewList = document.querySelector('.review-list')
  reviewList.innerHTML = '' // so the reviews from earlier searches don't stay in the DOM
  if(reviews.length == 0){  
    reviewList.innerText = "There are no reviews for this movie yet."
    return
  }
  reviews.forEach((item) => {
    if(item.review !== undefined){
      let newReview = document.createElement('li')
      newReview.classList.add('review')
      newReview.innerHTML = 
        `<span class="data-id hide-content">${item._id}</span>`
        + `<p class="review-statement">${item.review}</p>`
        + `<span class="score">${item.score}</span>`
        + `<span>${item.likes}</span>`

        let likeBtn = document.createElement('span')
        if(user && item.likedBy.includes(user)){  // in our database, reviews have an attribute called 'likedBy' which is an array that stored id of the users who have liked that particular review. if the array has the id of the currentUser, it means the logged in user has liked that particular review and hence the like button must be active 
          likeBtn.classList.add('fa', 'fa-thumbs-up', 'liked')
        } else {
          likeBtn.classList.add('fa', 'fa-thumbs-up')
        } 
        likeBtn.addEventListener('click', likeReview)
        newReview.appendChild(likeBtn)

        if(user == item.user){  // if the active user matches the 'user' attribute of a review object i.e. the active user is the auther of a review, only then they will have access to the delete button
          let deleteBtn = document.createElement('span')
          deleteBtn.classList.add('fa', 'fa-trash')
          deleteBtn.addEventListener('click', deleteReview)
          newReview.append(deleteBtn)
        }

      reviewList.appendChild(newReview) 
    }  
  })     
}

// if the movie has already been bookmarked before the bookmark button should be active
async function checkPreviousBookmark(movieID) {
  try{
    const response = await fetch('watchList/checkBookmark', {
      method: 'post',
      headers: {'Content-Type' : 'application/json'},
      body: JSON.stringify({
        'movieId': movieID
      })
    })
    const movieInfo = await response.json()
    // console.log(movieInfo)
    if(movieInfo.some(ele => ele.bookmarked == true)){  
      bookmarkBtn.classList.add('bookmarked')
      bookmarkStatus = true
    } else {
      bookmarkBtn.classList.remove('bookmarked')
      bookmarkStatus = false
    }
  }catch(err){console.log(err)}  
}

// bookmarking a movie
let bookmarkBtn = document.querySelector('.fa-bookmark')
bookmarkBtn.addEventListener('click', async () => {
  bookmarkBtn.classList.toggle('bookmarked')
  if(bookmarkBtn.classList.contains('bookmarked')){
    bookmarkStatus = true;
    const response = await fetch('watchList/addBookmark', {
      method: 'post',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        'poster': moviePoster.src,
        'movieId': movieId,
        'movieTitle': movieTitle.innerText, 
        'movieGenre': movieGenre.innerText,
        'moviePlot': moviePlot.innerText,
        'bookmarked': bookmarkStatus
      })
    })
    const bookmarkedMovie = await response.json()
  } else {
    const response = await fetch('watchList/removeBookmark', {
      method: 'delete',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        'movieToDel': movieId
      })
    })  
    const unbookmarkedMovie = await response.json()
  }
})

// adding movie review
const reviewBtn = document.querySelector('.review-submit-btn');
// submiting data normally from HTML form would reload the page and our API data would disappear. with fetch we are able to submit data without refreshing the page
reviewBtn.addEventListener('click', addReview)
async function addReview(){
  const review = document.querySelector('.movie-review-field').value
  const score = document.querySelector('#score').value
  if(isMoviePresent && (review || score)){    
    try{
      const response = await fetch('reviews/addReview', {
        method: 'post',
        headers: {'Content-Type' : 'application/json'},
        body: JSON.stringify({
          'title': movieTitle.innerText,
          'poster': moviePoster.src,
          'movieId': movieId,
          'genre': movieGenre.innerText, 
          'plot': moviePlot.innerText,
          'review': review,
          'score': score,
          
        })
      })
      if(!response.ok){
        return window.location.href = '/login'
      } 
      const reviewsMade = await response.json()

      let popUp = document.querySelector('.success-popup')
      popUp.classList.add('show-popup')
      setTimeout(() => {
        popUp.classList.remove('show-popup')
      }, 1200)
      document.querySelector('.review-form').reset();
      document.querySelector('#rangeValue').innerText = 0

    } catch(err) {
      console.error(err)
    }
  }  
}  


// liking and deleting the reviews

async function deleteReview(){
  const reviewId = this.parentNode.childNodes[0]
  try{
    const response = await fetch('reviews/deleteReview', {  // we don't need to enter the full url in our fetch because we're in our local server; localhost:3000 + /deleteReview
      method: 'delete', 
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        'reviewToDel': reviewId.innerText
      })
    })
    if(response.status == 401){
      window.location.href = '/login'
    } else if(response.status == 400){
      const data = await response.json()
      console.log(data)      
    } else {
      reviewId.parentElement.remove()  // remove deleted item from the DOM without reloading the page  
    }  
  } catch(err) {
    console.log(err)
  }
}
// continuously pressing the like button changes the like count non-linearly/randomly
async function likeReview(){
  let likeBtn = this.parentElement.children[4]
  likeBtn.classList.toggle('liked')
  const reviewId = this.parentElement.children[0].innerText
  let likesContainer = (this.parentElement.children[3])
  let totalLikes = Number(likesContainer.innerText)
  let action
  likeBtn.classList.contains('liked') ? action = 'like' : action = 'unlike'
  try{
    const response = await fetch('reviews/likeReview', {
      method: 'put', 
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        'actionToPerform': action,
        'reviewToLike': reviewId,
        'likeCount': totalLikes
      })
    })
    if(!response.ok){
      window.location.href = '/login'
      // showLoginModal()
    } else {
      const data = await response.json()
      likesContainer.innerHTML = `<span>${data.updatedLikes}</span>`  // updating a part of the DOM without requiring a full page refresh
    }  
  } catch(err) {
    console.log(err)
  }
}

async function getTopGenre(){
  const response = await fetch('reviews/getTopGenre', {
    method: 'get', 
    headers: {'Content-Type': 'application/json'}
  })
  if(!response.ok){
    getRecommendations('undefined', response.status)
    return
  }
  let topGenres = await response.json()
  let genres = {'action':28, 'adventure':12, 'animation':16, 'comedy':35, 'crime':80, 'drama':18, 'fantasy':14, 'horror':27, 'mystery':9648, 'romance':10749, 'sci-fi':878, 'thriller':53, 'war':10752}
  // let genreIds = topGenres.map(genre => {
  //   let requiredGenre = Object.keys(genres).find(key => key === genre.toLowerCase())
  //   return genres[requiredGenre]
  // })
  topGenres = topGenres.map(genre => genre.toLowerCase())
  let genreIds = topGenres.map(genre => genres[genre])
  // let requiredGenre = Object.keys(genres).find(key => key === topGenres.toLowerCase())
  // let topGenreId = genres[requiredGenre]
  getRecommendations(genreIds)
}

getTopGenre()

async function getRecommendations(genreIds, status){
  let response
  let page = Math.floor((Math.random() * 500) + 1);
  if(genreIds === 'undefined' || status == 401){
    response = await fetch('https://api.themoviedb.org/3/trending/movie/week?api_key=2732cfcce0a17dae7c833ce86f4238e7')
  } else {
    response = await fetch(`https://api.themoviedb.org/3/discover/movie?api_key=2732cfcce0a17dae7c833ce86f4238e7&original_language=en&sort_by=popularity.desc&adult=false&page=${page}&with_genres=${genreIds.join('|')}`)
  }  
  const data = await response.json()
  movies = data.results
  let recommendedMovies = document.querySelector('.recommended-movies')

  let i = 0
  let r = Math.floor((Math.random() * 15));
  while(i<4 && r<20){
    let movieCard = document.createElement('div')
    movieCard.dataset.id = movies[r].id
    movieCard.classList.add('movie-card')
    if(movies[r].poster_path == null){
      movieCard.innerHTML = `<img loading="lazy" class="movie-img src="/icons/no-image.png">`
      + `<div class="movie-name">${movies[r].title}</div>`
    } else {
      movieCard.innerHTML = `<img loading="lazy" class="movie-img" src="https://image.tmdb.org/t/p/w342/${movies[r].poster_path}" alt="">`
      + `<div class="movie-name">${movies[r].title}</div>`
    }
    movieCard.addEventListener('click', () => {
      getMovie(movieCard.dataset.id) 
      movieContainer.scrollIntoView({ behavior: "smooth" })
    })
    recommendedMovies.appendChild(movieCard)
    i++
    r++
  }
}
