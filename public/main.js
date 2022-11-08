document.querySelector('.search-btn').addEventListener('click', getMovie)
const moviePlot = document.querySelector('.plot')

async function getMovie(){
  const enteredMovie = document.querySelector('.movie-search').value
  const finalName = enteredMovie.split(' ').join('+') 

  // fetching movie from the API
  const url = `https://www.omdbapi.com/?t=${finalName}&apikey=75dd0b86`
  let movieId = document.querySelector('#movieID').value

  fetch(url)
    .then(res => res.json())
    .then(data => {
      console.log(data)
      document.querySelector('#movieID').value = data.imdbID
      document.querySelector('.poster').src = data.Poster
      document.querySelector('.title').innerText = data.Title
      document.querySelector('.genre').innerText = data.Genre
      document.querySelector('.actors').innerText = 'Starring: ' + data.Actors
      moviePlot.classList.remove('hide-content')
      moviePlot.innerText = data.Plot
    })
    .catch(error => console.error(error)) 

  // sending movie ID to our GET method so we can use it to find and display relevant reviews  
  try{
    console.log(data.imdbID)
    const response = await fetch(`getReview/${data.imdbID}`, {   
      method: 'get', 
      header: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        'movieId': data.imdbID
      })
    }) 
  } catch(err) {
    console.log(err)
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
  const reviewStatement = this.parentNode.childNodes[1].innerText
 
  // fetch('deleteReview', {   // we don't need to enter the full url in our fetch because we're in our local server; localhost:3000 + /deleteReview
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
    const response = await fetch('deleteReview', {
      method: 'delete', 
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        'reviewToDel': reviewStatement
      })
    })
    const data = await response.json()
    console.log(data)
    location.reload(true)
    
  } catch(err) {
    console.log(err)
  }
}

async function likeReview(){
  const reviewStatement = this.parentNode.childNodes[1].innerText
  let totalLikes = Number(this.parentNode.childNodes[5].innerText)
  console.log(reviewStatement, totalLikes)
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
    location.reload(true)
     
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