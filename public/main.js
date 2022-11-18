document.querySelector('.search-btn').addEventListener('click', getMovie)
const moviePlot = document.querySelector('.plot')
// let movieId = document.querySelector('.movie-id').innerText
let movieId = document.querySelector('.movie-id').value

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
      document.querySelector('.title').innerText = data.Title
      document.querySelector('.genre').innerText = data.Genre
      document.querySelector('.actors').innerText = 'Starring: ' + data.Actors
      moviePlot.classList.remove('hide-content')
      moviePlot.innerText = data.Plot
      console.log(movieId)

      try{
        console.log(movieId)
        const response = fetch(`getReview/${movieId}`, {   
          method: 'get', 
          header: {'Content-Type': 'application/json'},
        }) 
      } catch(err) {
        console.log(err)
      }
    })
    .catch(error => console.error(error)) 

  // sending movie ID to our GET method so we can use it to find and display relevant reviews - Doesn't work because GET request does not have a body, only the url and the header. With Node we can use the url to pass data to the server: query parameter and query string
}


// adding movie review
const reviewBtn = document.querySelector('.review-submit-btn');
// submiting data normally from HTML form would reload the page and our API data would disappear. with fetch we are able to submit data without refreshing the page
reviewBtn.addEventListener('click', addReview)
async function addReview(){
  // event.preventDefault();
  const review = document.querySelector('.movie-review').value
  const score = document.querySelector('#score').value
  if(review != ''){
    try{
      const response = await fetch('addReview', {
        method: 'post',
        headers: {'Content-Type' : 'application/json'},
        body: JSON.stringify({
          'movieId': movieId,
          'review': review,
          'score': score
        })
      })
      const data = await response.json()

      let popUp = document.querySelector('.success-popup')
      popUp.classList.add('show-popup')
      setTimeout(() => {
        popUp.classList.remove('show-popup')
      }, 1200)
      document.querySelector('.review-form').reset();
      document.querySelector('#rangeValue').innerText = 0

      // updating new review to the DOM without using the database
      // const reviewList = document.querySelector('.review-list')
      // let newReview = document.createElement('li')
      // newReview.classList.add('review')
      // newReview.innerHTML = 
      //   `<p class="review-statement">${data.review}</p>`
      //   + `<span class="score">${data.score}</span>`
      //   + `<span>${data.likes}</span>`
      //   + `<span class="fa fa-thumbs-up"></span>`
      //   + `<span class="fa fa-trash"></span>`
      // reviewList.appendChild(newReview) 

    } catch(err) {
        console.log(err)
    }
  }  
}    


// liking and deleting the reviews
const deleteButton = document.querySelectorAll('.fa-trash')
const likeButton = document.querySelectorAll('.fa-thumbs-up')

Array.from(deleteButton).forEach((element) => {
  element.addEventListener('click', deleteReview)
})
Array.from(likeButton).forEach((element) => {
  element.addEventListener('click', likeReview)
})

async function deleteReview(){
  const reviewContainer = this.parentNode.childNodes[1]
  const reviewStatement = this.parentNode.childNodes[1].innerText
  // fetch('deleteReview', {   
  //   method: 'delete', 
  //   header: {'Content-Type': 'application/json'},
  //   body: JSON.stringify({
  //     'reviewToDel': reviewStatement
  //   })
  // })
  // .then(res => {
  //   if(res.ok) return res.json()
  //   location.reload()
  // })
  try{
    const response = await fetch('deleteReview', {  // we don't need to enter the full url in our fetch because we're in our local server; localhost:3000 + /deleteReview
      method: 'delete', 
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        'reviewToDel': reviewStatement
      })
    })
    const data = await response.json()
    console.log(data)
    reviewContainer.parentElement.closest('.review').remove()  // remove deleted item from the DOM without reloading the page
    // location.reload(true)    
  } catch(err) {
    console.log(err)
  }
}

async function likeReview(){
  const reviewStatement = this.parentNode.childNodes[1].innerText
  let likesContainer = (this.parentNode.childNodes[5])
  let totalLikes = Number(likesContainer.innerText)
  try{
    const response = await fetch('addOneLike', {
      method: 'put', 
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        'reviewToLike': reviewStatement,
        'likeCount': totalLikes
      })
    })
    const data = await response.json()
    console.log(data)
    console.log(`The likes has been updated to ${data.updatedLikes}`)
    likesContainer.innerHTML = `<span>${data.updatedLikes}</span>`  // updating a part of the DOM without requiring a full page refresh
    // location.reload(true) 
  } catch(err) {
    console.log(err)
  }
}

// const reviewStatement = this.parentNode.childNodes[1].innerText
// const totalLikes = Number(this.parentNode.childNodes[5].innerText)
//   // console.log(reviewStatement, totalLikes)
// function likeReview(){
//   totalLikes++
//   fetch("addOneLike", {
//     method: 'put', 
//     headers: {'Content-Type': 'application/json'},
//     body: JSON.stringify({
//       'reviewToLike': reviewStatement,
//       'likeCount': totalLikes
//     })
//   })
//   .then(response => response.json())
//   .then(json => {
//     totalLikes = json.likeCount
//   })
// }