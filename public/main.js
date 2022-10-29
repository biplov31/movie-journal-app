document.querySelector('.search-btn').addEventListener('click', getMovie)

function getMovie(){
  const movieName = document.querySelector('.movie-search').value
  const finalName = movieName.split(' ').join('+')

  fetch('', {   
    method: 'get', 
    header: {'Content-Type': 'application/json'},
    body: JSON.stringify({
      'movie-name': movieName
    })
  }) 
  .then(res => {
    if(res.ok) return res.json()
  })

  // fetching movie from the API
  const url = `http://www.omdbapi.com/?t=${finalName}&apikey=75dd0b86`

  fetch(url)
    .then(res => res.json())
    .then(data => {
      document.querySelector('.poster').src= data.Poster
      document.querySelector('.title').innerText = data.Title
      document.querySelector('.genre').innerText = data.Genre
      document.querySelector('.actors').innerText = 'Starring: ' + data.Actors
      document.querySelector('.plot').innerText = data.Plot
    })
    .catch(error => console.error(error)) 
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
  const reviewStatement = this.parentNode.childNodes[3].innerText
  // const reviewScore = this.parentNode.childNodes[3].innerText
  fetch('deleteReview', {   // we don't need to enter the full url in our fetch becuase we're in our local server; localhost:3000 + /deleteReview
    method: 'delete', 
    header: {'Content-Type': 'application/json'},
    body: JSON.stringify({
      'reviewToDel': reviewStatement
    })
  })
  .then(res => {
    if(res.ok) return res.json()
    location.reload()
  })
}

async function likeReview(){
  const reviewStatement = this.parentNode.childNodes[4].innerText
  const totaLikes = this.parentNode.childNodes[7].innerText
  try{
    const response = await fetch('likeReview', {
      method: 'put', 
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        'reviewToLike': reviewStatement,
        'likeCount': totaLikes
      })
    })
    const data = await response.json()
    console.log(data)
    location.reload()
    
  } catch(err) {
    console.log(err)
  }
}