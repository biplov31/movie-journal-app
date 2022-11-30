document.querySelector('.search-btn').addEventListener('click', getMovie)
const moviePlot = document.querySelector('.plot')
let movieId = document.querySelector('.movie-id').value
let movieGenre = document.querySelector('.genre')
let movieTitle = document.querySelector('.title')
async function getMovie(){
  const enteredMovie = document.querySelector('.movie-search').value
  const finalName = enteredMovie.split(' ').join('+') 

  // fetching movie from the API
  const url = `https://www.omdbapi.com/?t=${finalName}&apikey=75dd0b86`
  fetch(url)
    .then(res => res.json())
    .then(data => {
      console.log(data)
      movieId = data.imdbID
      document.querySelector('.poster').src = data.Poster
      movieTitle.innerText = data.Title
      movieGenre.innerText = data.Genre
      document.querySelector('.actors').innerText = 'Starring: ' + data.Actors
      moviePlot.classList.remove('hide-content')
      moviePlot.innerText = data.Plot
    })
    // sending the Imdb Id of a movie to our server so we can display the reviews made for that particular movie after grabbing it from the database. We cannot use the GET method here because it doesn't have a body (we could use query parameter though), but POST method has a body through which we can send data to the server
    .then(async function() {
      console.log(movieId)
      try{
        const response = await fetch('reviews/getReview', {
          method: 'post',
          headers: {'Content-Type' : 'application/json'},
          body: JSON.stringify({
            'movieId': movieId
          })
        })
        const reviewsMade = await response.json()
        console.log(reviewsMade)

      // updating new review to the DOM without using the database or reloading the page
      const reviewList = document.querySelector('.review-list')
      reviewList.innerHTML = '' // so the reviews from earlier searches don't stay in the DOM

      if(reviewsMade.length == 0){
        reviewList.innerText = "There are no reviews for this movie yet."
        return
      }
      reviewsMade.forEach((item) => {
        let newReview = document.createElement('li')
        newReview.classList.add('review')
        newReview.innerHTML = 
           `<span class="data-id hidden">${item._id}</span>`
          + `<p class="review-statement">${item.review}</p>`
          + `<span class="score">${item.score}</span>`
          + `<span>${item.likes}</span>`
          // + `<span class="fa fa-thumbs-up"></span>`
          // + `<span class="fa fa-trash"></span>`

          let likeBtn = document.createElement('span')
          likeBtn.classList.add('fa', 'fa-thumbs-up')
          likeBtn.addEventListener('click', likeReview)
          let deleteBtn = document.createElement('span')
          deleteBtn.classList.add('fa', 'fa-trash')
          deleteBtn.addEventListener('click', deleteReview)
          newReview.append(likeBtn, deleteBtn)

        reviewList.appendChild(newReview) 
      })
      } catch(err) {
         console.log(err)}
    })
    .catch(error => console.error(error)) 

}


// bookmarking a movie
let bookmarkStatus = false
let bookmarkBtn = document.querySelector('.fa-bookmark')
bookmarkBtn.addEventListener('click', () => {
  bookmarkBtn.classList.toggle('bookmarked')
  if(bookmarkBtn.classList.contains('bookmarked')){
    bookmarkStatus = true;
  }  
})

// adding movie review
const reviewBtn = document.querySelector('.review-submit-btn');
// submiting data normally from HTML form would reload the page and our API data would disappear. with fetch we are able to submit data without refreshing the page
reviewBtn.addEventListener('click', addReview)
async function addReview(){
  const review = document.querySelector('.movie-review').value
  const score = document.querySelector('#score').value
  if(review != ''){
    try{
      const response = await fetch('reviews/addReview', {
        method: 'post',
        headers: {'Content-Type' : 'application/json'},
        body: JSON.stringify({
          'movieId': movieId,
          'review': review,
          'score': score,
          'genre': movieGenre.innerText, 
          'title': movieTitle.innerText,
          'bookmarked': bookmarkStatus
        })
      })
      const reviewsMade = await response.json()
      console.log(reviewsMade)

      let popUp = document.querySelector('.success-popup')
      popUp.classList.add('show-popup')
      setTimeout(() => {
        popUp.classList.remove('show-popup')
      }, 1200)
      document.querySelector('.review-form').reset();
      document.querySelector('#rangeValue').innerText = 0

    } catch(err) {
        console.log(err)
    }
  }  
}  



// liking and deleting the reviews

// this doesn't work now since we're appending buttons from javascript and not grabbing them from the HTML
// const deleteButton = document.querySelectorAll('.fa-trash')
// const likeButton = document.querySelectorAll('.fa-thumbs-up')

// Array.from(deleteButton).forEach((element) => {
//   element.addEventListener('click', deleteReview)
// })
// Array.from(likeButton).forEach((element) => {
//   element.addEventListener('click', likeReview)
// })

async function deleteReview(){
  // const reviewContainer = this.parentNode.children[0]
  const reviewId = this.parentNode.childNodes[0]
  try{
    const response = await fetch('reviews/deleteReview', {  // we don't need to enter the full url in our fetch because we're in our local server; localhost:3000 + /deleteReview
      method: 'delete', 
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        'reviewToDel': reviewId.innerText
      })
    })
    const data = await response.json()
    console.log(data)
    reviewId.parentElement.remove()  // remove deleted item from the DOM without reloading the page  
  } catch(err) {
    console.log(err)
  }
}

async function likeReview(){
  const reviewId = this.parentElement.children[0].innerText
  console.log(reviewId)
  let likesContainer = (this.parentElement.children[3])
  let totalLikes = Number(likesContainer.innerText)
  try{
    const response = await fetch('reviews/likeReview', {
      method: 'put', 
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        'reviewToLike': reviewId,
        'likeCount': totalLikes
      })
    })
    const data = await response.json()
    console.log(data)
    console.log(`The likes has been updated to ${data.updatedLikes}`)
    likesContainer.innerHTML = `<span>${data.updatedLikes}</span>`  // updating a part of the DOM without requiring a full page refresh
  } catch(err) {
    console.log(err)
  }
}

