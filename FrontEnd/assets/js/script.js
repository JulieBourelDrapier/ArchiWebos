let result //intervient dans la récupération de la galerie

//déclarer la fonction
function showHiddenElements() { 
  let hiddenElements = document.getElementsByClassName("hidden")
  const token        = localStorage.getItem("token")
  if (token) {
    //1ère action = rendre visible les éléments cachés 
    Array.from(hiddenElements).forEach((element) => {
      element.classList.remove("hidden")
    //2e action = login devient logout
      document.querySelector(".connexion-link").textContent ="logout" 
    //3e action hide filters 
      document.getElementById("filters").setAttribute("style", "display:none")
    })
  }
}

//annonce variable
const connexionLink = document.querySelector(".connexion-link")
//puis fonction pour se déconnecter
function logOut(event) {
  event.preventDefault() //prevent default
  localStorage.removeItem("token")//unset localstorage 
  location.reload()//location.href = "/FrontEnd/assets/login.js"
}
//add eventListener 
connexionLink.addEventListener("click", logOut)



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
    const figure     = document.createElement('figure')
    const img        = document.createElement('img')
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

//appeler la fonction
showHiddenElements()

// récupérer dynamiquement la galerie via fetch
//mettre ces éléments dans une fonction pour plus de clarté
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

  //mettre ces éléments dans une fonction pour plus de clarté
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
		
//création dynamique de la modale
const modalLink = document.getElementById("js-modal")
const body = document.body;

function createModal(e) {
  const modalAside = document.createElement("aside")
  const modalDiv = document.createElement("div")
  const modalFirstBtn = document.createElement("button")
  const modalTitle = document.createElement("h2")  
  const modalSecondBtn = document.createElement("button")
  const modalDelete = document.createElement("a")

  //configurer
  modalAside.setAttribute("id", "modal1")
  modalAside.classList.add("modal")

  modalDiv.classList.add("modal-wrapper", "js-modal-stop")

  modalFirstBtn.classList.add("js-modal-close")
  modalFirstBtn.innerText = "x"
  modalFirstBtn.href=""

  modalTitle.classList.add("title-modal")
  modalTitle.innerText = "Galerie photo"//ne marche pas

  modalSecondBtn.classList.add("js-modal-add-photo")
  modalSecondBtn.innerText = "Ajouter une photo"
  modalSecondBtn.href=""//ne marche pas

  modalDelete.classList.add("js-delete-gallery")
  modalDelete.innerText = "Supprimer la galerie"
  modalDelete.href=""

  //placer dans le dom
  body.append(modalAside)
  modalAside.append(modalDiv)
  modalDiv.append(modalFirstBtn)
  modalDiv.append(modalTitle)
  modalDiv.append(modalSecondBtn)
  modalDiv.append(modalDelete)
  console.log("createModal")

  modalFirstBtn.addEventListener("click", closeModal)
}

modalLink.addEventListener("click", createModal)



// en lien avec la modale

const closeModal = function (e) { //fonction qui prend en paramètre l'evenmnt
  if (modal === null) return //en cas de modale non existente ça n'ira pas plus loin
  e.preventDefault()
  window.setTimeout(function () {
    modal.style.display = "none"//permet de remasquer la modale
    modal = null
  }, 500)
  modal.setAttribute("aria-hidden" , "true")//passe à true pour masquer l'elmnt
  modal.removeAttribute("aria-modal")
  modal.removeEventListener("click", closeModal)
  modal.querySelector(".js-modal-close").removeEventListener("click", closeModal)
  modal.querySelector(".js-modal-stop").removeEventListener("click", stopPropagation)
}



const stopPropagation = function (e) {
  e.stopPropagation()
}

const focusInModal = function (e) {
  e.preventDefault()
  let index = focusables.findIndex(f => f === modal.querySelector(":focus"))
  index++
  if (index >= focusables.length){
  index = 0
}
  focusables[index].focus()
}


window.addEventListener("keydown", function (e){
  if (e.key === "Escape" || e.key === "Esc") {
    closeModal(e)
  }
  if (e.key === "Tab" && modal !== null) {
    focusInModal(e)
  } 
})
