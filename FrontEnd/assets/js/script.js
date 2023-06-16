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

//création dynamique de la modale refactorisée
const modalLink = document.getElementById("js-modal")
modalLink.addEventListener("click", createModal)

async function createModal (e) {
  const modalAside = document.createElement("aside")
  const modalDiv = document.createElement("div")
  const modalFirstBtn = document.createElement("button")
  const modalTitle = document.createElement("h3")  
  const modalSecondBtn = document.createElement("button")
  const modalDelete = document.createElement("a")
  const modalGallery = document.createElement("div")

  //configurer
  configureModalElements(modalAside, modalDiv, modalFirstBtn, modalTitle, modalSecondBtn, modalDelete, modalGallery)
  
  //addEventListener 
  addEventListenersToModalElements(modalFirstBtn, modalSecondBtn, modalDiv)
  
  //mettre les éléments de la modale dans le DOM
  document.body.append(modalAside);
  
  //générer la galerie de la modale
  generateAndCreateGalleryModal("modal-gallery")
}

function configureModalElements(modalAside, modalDiv, modalFirstBtn, modalTitle, modalSecondBtn, modalDelete, modalGallery) {
  modalAside.id = "modal1";
  modalAside.classList.add("modal");
  modalDiv.classList.add("modal-wrapper", "js-modal-stop");
  modalFirstBtn.classList.add("js-modal-close");
  modalFirstBtn.innerText = "x";
  modalTitle.classList.add("title-modal");
  modalTitle.innerText = "Galerie photo";
  modalGallery.classList.add("modal-gallery");
  modalSecondBtn.id = "js-modal-add-photo";
  modalSecondBtn.innerText = "Ajouter une photo";
  modalDelete.classList.add("js-delete-gallery");
  modalDelete.innerText = "Supprimer la galerie";
  modalDelete.href="";
  
  // Placer les éléments ds la modale
  modalAside.append(modalDiv);
  modalDiv.append(modalFirstBtn);
  modalDiv.append(modalTitle);
  modalDiv.append(modalGallery);
  modalDiv.append(modalSecondBtn);
  modalDiv.append(modalDelete);
  }
  
function clearModal() {
    const modalDiv = document.querySelector(".modal-wrapper");
    modalDiv.innerText = "";
  }
function closeModal() {
    const modalAside = document.querySelector(".modal");
    modalAside.remove();
  }
function addEventListenersToModalElements(modalFirstBtn, modalSecondBtn) {
    modalSecondBtn.addEventListener("click", clearModal);
    modalFirstBtn.addEventListener("click", closeModal);
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
//Modal 2
  const linkToModal2 = document.getElementById("js-modal-add-photo")
  linkToModal2.addEventListener("click", createModal2)
  async function createModal2 (e) {
  //récup des éléments existants 
  const modalAside = document.querySelector("#modal1")
  const modalDiv = document.querySelector(".modal-wrapper")
  const modalFirstBtn = document.querySelector(".js-modal-close")
  const modalTitle = document.querySelector(".title-modal") 
  modalTitle.innerText = "Ajout photo"
  const modalSecondBtn = document.querySelector("#js-modal-add-photo")
  modalSecondBtn.innerText = "+ ajouter photo"
  //création des nouveaux éléments 
  const modal2Arrow = document.createElement("i")
  const modal2Div2 = document.createElement("div")
  const landscapeIcon = document.createElement("i")
  const modal2Form = document.createElement("form")
  const modal2Input1 = document.createElement("input")
  const modal2Input2 = document.createElement("input")
  const modal2ValidateBtn = document.createElement("js-modal-validate")

  //configurer
  configureModal2Elements(modalAside, modalDiv, modalFirstBtn, modalTitle, modalSecondBtn, modal2Arrow, modal2Div2, landscapeIcon, modal2Form, modal2Input1, modal2Input2, modal2ValidateBtn)
  
  //addEventListener 
  addEventListeners.ToModal2Elements(modalFirstBtn, modalSecondBtn, modal2ValidateBtn)
}
function configureModal2Elements(modal2Arrow, modal2Div2, landscapeIcon, modal2P, modal2Form, modal2Input1, modal2Input2, modal2ValidateBtn) {
  modal2Arrow.classList.add("fa-solid", "fa-arrow-left")
  modal2Div2.id="modal2-div2"
  landscapeIcon.id = "modal2-landscape-icon"
  modal2P.id = "modal2-p"
  modal2Form.id = "modal2-form"
  modal2Input1.id = "modal2-input1"
  modal2Input2.id = "modal2-input2"
  modal2ValidateBtn.id = "modal2-validate-btn"
  modal2ValidateBtn.innerText = "valider"
  
  // Placer les éléments ds la modale
  modalDiv.append(modal2Arrow)
  modalDiv.append(modal2Title)
  modalAside.append(modal2Div2)
  modal2Div2.append(landscapeIcon)
  modal2Div2.append(modalFirstBtn)
  modal2Div2.append(modal2P)
  modalDiv.append(modal2Form)
  modalDiv.append(modal2Input1)
  modalDiv.append(modal2Input2)
  modalDiv.append(modal2ValidateBtn)
  }
function closeModal2() {
    const modalAside = document.querySelector("#modal1");
    modalAside.remove();
  }
function addEventListenersToModal2Elements(modal2CloseBtn, modal2AddPhotoBtn) {
    modal2CloseBtn.addEventListener("click", closeModal2);
    modal2AddPhotoBtn.addEventListener("click", addPhoto);
  }
//delete photo
async function deletePhoto(e) {
  console.log("Photo deleted")
  fetch ("http://localhost:5678/api/works/1", {
  method: "DELETE",
  headers: {
    "Content-Type": "application/json"
  }
})
.then(response => {
  if (!response.ok) {
    throw new Error("Network response was not ok")
  }
  console.log("Photo deleted successfully")
})
.catch(error => {
  console.error("There was a problem deleting the photo:", error)
})
}
  const trashIcon = document.querySelector(".icon1")
  trashIcon.addEventListener("click", deletePhoto)

function addPhoto (e) {
   
}

