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
    //add eventListener 
    connexionLink.addEventListener("click", logOut)
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

function generateAndCreateGallery(selector, categoryId = null) {
  const galleryDiv = document.getElementsByClassName(selector)[0]
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

function generateAndCreateGalleryModal(selector, categoryId = null) {
  const galleryDiv = document.getElementsByClassName(selector)[0]
  galleryDiv.innerHTML = ""
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
      const figure         = document.createElement('figure')
      const img            = document.createElement('img')
      const iconsContainer = document.createElement('div')
      const figcaption     = document.createElement('figcaption')
      const iconVisible    = document.createElement('i')
      const iconInvisible  = document.createElement('i')
      //configurer
      img.setAttribute('src', data[i].imageUrl)
      img.setAttribute('alt', data[i].title)
      figcaption.innerText = "éditer"
      iconsContainer.classList.add("icons-container")
      iconVisible.classList.add("fa", "fa-trash-can","icons", "icon1",)
      iconInvisible.classList.add("fa-solid", "fa-arrows-up-down-left-right", "icons", "icon2")
    //setting of  display property for icons
      iconVisible.style.display = "inline-block"
      iconInvisible.style.display = "inline-block"
      iconInvisible.style.opacity = "0"
    //addEventListener to make the icon appear and disappear
      figure.addEventListener('mouseenter', () => {
      iconInvisible.style.opacity = "1"
      figure.style.transform = "scale(1.2)"
    })
      figure.addEventListener('mouseleave', () => {
      iconInvisible.style.opacity = "0"
      figure.style.transform = "scale(1)"
    })
    // placer les éléments générés
      figure.append(img)
      figure.append(figcaption)
      figure.append(iconsContainer)
      iconsContainer.append(iconVisible)
      iconsContainer.append(iconInvisible)
    // ajouter les éléments dans le DOM
    galleryDiv.append(figure)
  }
}


// création des boutons filtres + fonction filter 
function filterImgEvent(event)
{
  generateAndCreateGallery("gallery", event.target.getAttribute('filterCategoryId'))
  document.querySelector("#filters .filterParent .filter.selected").classList.remove('selected')
  event.target.classList.add("selected")
}

//appeler la fonction
showHiddenElements()

// récupérer dynamiquement la galerie via fetch
//mettre ces éléments dans une fonction pour plus de clarté
async function fetchWorks() {
  try {
    const res = await fetch("http://localhost:5678/api/works/")
    if(res.ok){
      const data = await res.json()
      return data
    } else {
      console.error('No data received')
    }
  } catch(error) {
    console.error(error)
    console.error('Penser à fr npm start')
  }
}

async function FetchAndCreateGallery() {
  result = await fetchWorks()
  generateAndCreateGallery("gallery")
}

FetchAndCreateGallery()

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

async function createModal (e) {
  const modalAside = document.createElement("aside")
  const modalDiv = document.createElement("div")
  const modalFirstBtn = document.createElement("button")
  const modalTitle = document.createElement("h3")  
  const modalSecondBtn = document.createElement("button")
  const modalDelete = document.createElement("a")
  const modalGallery = document.createElement("div")
  //configurer
  modalAside.id = "modal1"
  modalAside.classList.add("modal")

  modalDiv.classList.add("modal-wrapper", "js-modal-stop")

  modalFirstBtn.classList.add("js-modal-close")
  modalFirstBtn.innerText = "x"

  modalTitle.classList.add("title-modal")
  modalTitle.innerText = "Galerie photo"

  modalGallery.classList.add("modal-gallery")

  modalSecondBtn.id = "js-modal-add-photo"
  modalSecondBtn.innerText = "Ajouter une photo"
  modalSecondBtn.addEventListener("click", addPhoto)

  modalDelete.classList.add("js-delete-gallery")
  modalDelete.innerText = "Supprimer la galerie"
  modalDelete.href=""

  //placer dans le dom
  document.body.append(modalAside)
  modalAside.append(modalDiv)
  modalDiv.append(modalFirstBtn)
  modalDiv.append(modalTitle)
  modalDiv.append(modalGallery)
  modalDiv.append(modalSecondBtn)
  modalDiv.append(modalDelete)

  generateAndCreateGalleryModal("modal-gallery")

  modalFirstBtn.addEventListener("click", closeModal)
}

modalLink.addEventListener("click", createModal)

//delete work
function deleteWork(e) {
  const trashIcon = document.getElementById("icon1")
  trashIcon.addEventListener("click", event => {
    const figureElement = event.target.closest("figure")
    console.log("removed element", figureElement)
    figureElement.remove()
  })
}
//Fermer la modale
function closeModal (e) {
  const modal = document.getElementById("modal1")
  modal.remove()
}

function addPhoto (e) {
  const modal = document.getElementById("modal1")
  
}


