//programmation asynchrone => fetch => Get request
let result

// récupérer dynamiquement la galerie via fetch
fetch("http://localhost:5678/api/works/")
  .then(res => {
    if(res.ok){
      res.json().then(data => {
        result = data
        generateAndCreateGallery()
        
      })
    } else {
      console.error('No data received')
    }
  })
  .catch(error => {
    console.error(error)
    console.error('Penser à fr npm start')
  })

function generateAndCreateGallery(categoryId = null) {
  const galleryDiv = document.getElementsByClassName("gallery")[0]
  galleryDiv.innerHTML = ''
  let data
  if(categoryId !== null) {
    data = result.filter((img) => {
      return Number.parseInt(categoryId) === img.categoryId
    })
  }
  else {
    data = result
  }
  for (let i = 0; i < data.length; i++) {
    //générer les élements 
    const figure = document.createElement('figure')
    const img = document.createElement('img')
    const figcaption = document.createElement('figcaption')

    //configurer
    img.setAttribute('src', data[i].imageUrl)
    img.setAttribute('alt', data[i].title)
    figcaption.innerText = data[i].title

    // placer les éléments générés
    figure.append(img)
    figure.append(figcaption)

    // ajouter les éléments dans le DOM
    galleryDiv.append(figure)
  }
}

  // création des boutons filtres + fonction filter 
  function filterImgEvent(event)
  {
    generateAndCreateGallery(event.target.getAttribute('filterCategoryId'))
    document.querySelector("#filters .filterParent .filter.selected").classList.remove('selected')
    event.target.classList.add("selected")

  }
 
fetch("http://localhost:5678/api/categories/")
  .then(res => {
    if(res.ok){
      const ulFilters = document.createElement('ul')
      const liAll = document.createElement('li')
      const filters = document.getElementById('filters')
      
      //configuer 
      liAll.innerText = 'Tous'
      liAll.addEventListener('click', filterImgEvent)
      liAll.classList.add("filter", "selected") //attribution de la class à l'élément liAll FAIRE LE LIEN EN TRAVAILLANT SUR STYLE.CSS
      
      ulFilters.classList.add("filterParent")

      //placer
      ulFilters.append(liAll)
      
      //ajouter dans le DOM
      filters.append(ulFilters)

      res.json().then(data => {
        for (let i = 0; i < data.length; i++) {
          const li = document.createElement('li')
          li.innerText = data[i].name
          li.setAttribute('filterCategoryId', data[i].id)
          li.addEventListener('click', filterImgEvent)
          ulFilters.append(li)
          li.classList.add("filter") //attribution de la class à l'élément filter
        }
      })

    }else {
      console.error('No data received')
    }
  })
  .catch(error => {
    console.error(error)
  })

  