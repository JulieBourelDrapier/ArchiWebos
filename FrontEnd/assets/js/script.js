// ********** CONSTANTS **********
const connexionLink = document.querySelector(".connexion-link")
const modalLink = document.getElementById("js-modal")

// ********** VARIABLES **********
let result // récupération de la galerie

// ********** FUNCTIONS **********

/**
 * Removes the token stored in localStorage and reloads the page.
 * @param {Event} event - The event triggered when logging out.
 */
function logOut(e) {
  e.preventDefault();
  localStorage.removeItem("token");
  location.reload();
}

/**
 * Asynchronously fetches works and generates a gallery with the results.
 * @return {Promise<void>} A Promise that resolves when the gallery is created.
 */
async function FetchGallery() {
  result = await fetchWorks()
  generateGallery("gallery")
}

/**
 * Shows hidden elements if user is authenticated and perform additional actions.
 */
function showHiddenElements() { 
  let hiddenElements = document.getElementsByClassName("hidden")
  const token        = localStorage.getItem("token")
  if (token) {
      Array.from(hiddenElements).forEach((element) => {
      element.classList.remove("hidden")
      document.querySelector(".connexion-link").textContent ="logout"
      document.getElementById("filters").setAttribute("style", "display:none")
    })
    connexionLink.addEventListener("click", logOut)
  }
}

/**
 * Generates and creates a gallery based on the given selector and optional categoryId.
 * @param {string} selector - The CSS selector of the div to create the gallery in.
 * @param {number} [categoryId=null] - The optional category ID to filter images by.
 */
function generateGallery(selector, categoryId = null) {
  const galleryDiv = document.getElementsByClassName(selector)[0];
  galleryDiv.innerHTML = '';
  let data;
  if(categoryId !== null) {
    data = result.filter((img) => {
      return Number.parseInt(categoryId) === img.categoryId;
    })
  }
  else {
    data = result;
  }
  for (let i = 0; i < data.length; i++) {
    //générer les élements 
    const figure     = document.createElement('figure');
    const img        = document.createElement('img');
    const figcaption = document.createElement('figcaption');
    //les configurer
    img.setAttribute('src', data[i].imageUrl);
    img.setAttribute('alt', data[i].title);
    figcaption.innerText = data[i].title;
    // les placer dans le DOM
    figure.append(img);
    figure.append(figcaption);
    galleryDiv.append(figure);
  }
}
 
function filterImgEvent(event){
  generateGallery("gallery", event.target.getAttribute('filterCategoryId'));
  document.querySelector("#filters .filterParent .filter .selected").classList.remove('selected');
  event.target.classList.add("selected");
}


async function fetchWorks() {
  try {
    const res = await fetch("http://localhost:5678/api/works/");
    if(res.ok){
      const data = await res.json();
      return data;
    } else {
      console.error('No data received');
    }
  } catch(error) {
    console.error(error);
    console.error('Penser à fr npm start');
  }
}


async function createModal (e) {
  const modalAside      = document.createElement("aside")
  const modalDiv        = document.createElement("div")
  const modalFirstBtn   = document.createElement("button")
  const modalTitle      = document.createElement("h3")  
  const modalSecondBtn  = document.createElement("button")
  const modalDelete     = document.createElement("a")
  const modalGallery    = document.createElement("div")

  //configurer
  configureModalElements(modalAside, modalDiv, modalFirstBtn, modalTitle, modalSecondBtn, modalDelete, modalGallery)
  
  //addEventListener 
  addEventListenersToModalElements(modalFirstBtn, modalSecondBtn, modalDiv)
  
  //mettre les éléments de la modale dans le DOM
  document.body.append(modalAside);
  
  //générer la galerie de la modale
  generateGalleryModal("modal-gallery")
}

function configureModalElements(modalAside, modalDiv, modalFirstBtn, modalTitle, modalSecondBtn, modalDelete, modalGallery) {
  modalAside.id               = "modal1"
  modalAside.classList.add    ("modal")
  modalDiv.classList.add      ("modal-wrapper", "js-modal-stop")
  modalFirstBtn.classList.add ("js-modal-close")
  modalFirstBtn.innerText     = "x"
  modalTitle.classList.add    ("title-modal")
  modalTitle.innerText        = "Galerie photo"
  modalGallery.classList.add  ("modal-gallery")
  modalSecondBtn.id           = "js-modal-add-photo"
  modalSecondBtn.innerText    = "Ajouter une photo"
  modalDelete.classList.add   ("js-delete-gallery")
  modalDelete.innerText       = "Supprimer la galerie"
  modalDelete.href            = "#"
  
  // Placer les éléments ds la modale
  modalAside.append(modalDiv);
  modalDiv.append(modalFirstBtn, modalTitle, modalGallery, modalSecondBtn, modalDelete);
  }
  
function clearModal() {
  const modalContainer = document.querySelector(".modal-wrapper.js-modal-stop")
  modalContainer.innerText = ""
  }
function closeModal() {
    const modalAside = document.querySelector(".modal")
    modalAside.remove()
  }
function addEventListenersToModalElements(closeBtn, modalSecondBtn) {
    modalSecondBtn.addEventListener("click", createModal2);
    closeBtn.addEventListener("click", closeModal);
  }
 
  async function createModal2 (e) {
    //récup les éléments existants 
    const modalAside     = document.querySelector("#modal1")
    const modalDiv       = document.querySelector(".modal-wrapper.js-modal-stop")
    const modalFirstBtn  = document.querySelector(".js-modal-close")
    const modalTitle     = document.querySelector(".title-modal") 
    const modalSecondBtn = document.querySelector("#js-modal-add-photo")
    
    //création des nouveaux éléments 
    const controlDiv        = document.createElement("div")
    const modal2Arrow       = document.createElement("i")
    const landscapeIcon     = document.createElement("i")
    const photoSelectionDiv = document.createElement("div")
    const modal2Form        = document.createElement("form")
    const modal2Input1      = document.createElement("input")
    const modal2Input2      = document.createElement("input")
    const modal2ValidateBtn = document.createElement("js-modal-validate")
  
    //configurer
    configureModal2Elements(modalAside, modalDiv, modalFirstBtn, modalTitle, photoSelectionDiv, modalSecondBtn, controlDiv, modal2Arrow, landscapeIcon, modal2Form, modal2Input1, modal2Input2, modal2ValidateBtn)
    
    //addEventListener 
    addEventListeners.ToModal2Elements(closeBtn, modalSecondBtn, modal2ValidateBtn)
  }
  function configureModal2Elements(modalAside, modalDiv, controlDiv, modalFirstBtn, arrowIcon, modalTitle, modalGallery,  landscapeIcon, modalSecondBtn, modal2P, modal2Form, modal2Input1, modal2Input2, modal2ValidateBtn) {
    controlDiv.classList.add       ("control-div")
    modalTitle.innerText           = "Ajout photo"
    arrowIcon.classList.add        ("fa-sharp", "fa-solid", "fa-arrow-left", "icon3")
    photoSelectionDiv.classList.add("photo-selection-div")
    landscapeIcon.classList.add    ("fa-sharp", "fa-solid", "fa-image-landscape", "icon4")
    modalSecondBtn.innerText       = "+ ajouter photo"
    modal2P.id                     = "modal2-p"
    modal2Form.id                  = "modal2-form"
    modal2Input1.id                = "modal2-input1"
    modal2Input2.id                = "modal2-input2"
    modal2ValidateBtn.id           = "modal2-validate-btn"
    modal2ValidateBtn.innerText    = "Valider"
  
    // Placer les éléments ds la modale
    modalAside.append(modalDiv)
    modalDiv.append(controlDiv, modalTitle, photoSelectionDiv, modal2Form, modal2ValidateBtn)
    controlDiv.append(modalFirstBtn, modal2Arrow)
    photoSelectionDiv.append(landscapeIcon, modalSecondBtn, modal2P)
    modal2Form.append(modal2Input1, modal2Input2)
    }
  
  function closeModal2() {
      const modalAside = document.querySelector(".modal")
      modalAside.remove()
    }
  function addEventListenersToModal2Elements(modalFirstBtn) {
      modalFirstBtn.addEventListener("click", closeModal2)
  }
      //modalSecondBtn.addEventListener("click", addPhoto);
      //modal2ValidateBtn.addEventListener("click", NOTDefinedYET);
    
  //delete photo
  function deletePhoto(id, img) {
     return async (e) => {
      e.preventDefault();
      e.stopPropagation()
      img.remove()
      console.log("Suppression en cours...")
      try {
        const response = await fetch ("http://localhost:5678/api/works/" + id, {
          method: "DELETE",
          headers: {
            accept: '*/*',
            "Authorization": `Bearer ${localStorage.getItem("token")}`
          }
        });
        if (!response.ok) {
          throw new Error("qqch n'a pas marché")
        }
        console.log("Photo supprimé avec succès")
  
      }
      catch(error) {
        console.error("un pb est survenu au cours de la supp de la photo:", error)
      }
    }
  }
  
  
  function addPhoto (e) {  
  }
  
  function generateGalleryModal(selector, categoryId = null) {
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
        iconVisible.style.display   = "inline-block"
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

      iconVisible.addEventListener("click", deletePhoto(data[i].id, img))
      }
}

// ********** MAIN CODE **********

//appeler la fonction
showHiddenElements()

FetchGallery()

//mettre ces éléments dans une fonction pour plus de clarté
fetch("http://localhost:5678/api/categories/")
.then(res => {
  if(res.ok){
    const ulFilters = document.createElement('ul')
    const liAll     = document.createElement('li')
    const filters   = document.getElementById('filters')
    
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

modalLink.addEventListener("click", createModal)


  
//Modal 2
  const LinkToModal2 = document.getElementById("js-modal-add-photo")
  if (LinkToModal2 !== null) {
    LinkToModal2.addEventListener("click", createModal2)
  }
  