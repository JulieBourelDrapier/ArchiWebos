//javascript asyncrome => fetch => Get request
const galleryDiv = document.getElementsByClassName("gallery")[0]

fetch("http://localhost:5678/api/works/")
  .then(res => {
    if(res.ok){
      res.json().then(data => {
        for (let i = 0; i < data.length; i++) {
          const figure = document.createElement('figure')
          const img = document.createElement('img')
          const figcaption = document.createElement('figcaption')

          img.setAttribute('src', data[i].imageUrl)
          img.setAttribute('alt', data[i].title)
          figcaption.innerText = data[i].title
  
          figure.append(img)
          figure.append(figcaption)
  
          galleryDiv.append(figure)
        }
        
      })
    } else {
      console.log("NOT working...")
    }
  })
  .catch(e => {
    console.error(e)
    console.error('Penser à fr npm start')
  })

  