//javascript asyncrome => fetch => Get request
const galleryDiv = document.getElementsByClassName("gallery")[0]

// récupérer dynamiquement la galerie via fetch
fetch("http://localhost:5678/api/works/")
  .then(res => {
    if(res.ok){
      res.json().then(data => {
        for (let i = 0; i < data.length; i++) {
          const figure = document.createElement('figure')
          const img = document.createElement('img')
          const figcaption = document.createElement('figcaption')

          //configurer
          img.setAttribute('src', data[i].imageUrl)
          img.setAttribute('alt', data[i].title)
          figcaption.innerText = data[i].title
  
          //générer les élements 
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

  // création des boutons filtres + fonction filter 

fetch("http://localhost:5678/api/categories")
  console.log("c'est ok")
  .then((response) => {
    if(response.ok) return response.json()
  })
 // faire le filter en comparant l'id du filtre selectionné avec le categorieId des data
  
      
  //noms des filtres : tous/objets/appartements/Hôtels & restaurants 
  //Au clic sur un élément du menu de catégories, filtrer les travaux selon le filtre sélectionné.