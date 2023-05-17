//javascript asyncrome => fetch => Get request
const galleryDiv = document.getElementsByClassName("gallery")[0]

// récupérer dynamiquement la galerie via fetch
fetch("http://localhost:5678/api/works/")
  .then(res => {
    if(res.ok){
      res.json().then(data => {
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
        
      })
    } else {
      console.error('No data received')
    }
  })
  .catch(e => {
    console.error(e)
    console.error('Penser à fr npm start')
  })

  const filters = document.getElementById('filters')
  // création des boutons filtres + fonction filter 
fetch("http://localhost:5678/api/categories/")
  .then(res => {
    if(res.ok){
      const ulFilters = document.createElement('ul')
      const liAll = document.createElement('li')
      
      liAll.innerText = 'TOUS'

      ulFilters.append(liAll)

      filters.append(ulFilters)

      res.json().then(data => {
        for (let i = 0; i < data.length; i++) {
          const li = document.createElement('li')
          li.innerText = data[i].name
          ulFilters.append(li)
          li.classList.add("filter")//lien vers la partie css pour le style je dois créer le style de ma class filter
        }
      })

    }else {
      console.error('No data received')
    }
  })
  .catch(error => {
    console.error(error)
  })
 // faire le filter en comparant l'id du filtre selectionné avec le categorieId des data
  
      
  //noms des filtres : tous/objets/appartements/Hôtels & restaurants 
  //Au clic sur un élément du menu de catégories, filtrer les travaux selon le filtre sélectionné.