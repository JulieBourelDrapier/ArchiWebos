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
 
/**
 * Generates a gallery based on the filterCategoryId of the clicked event target. 
 * @param {Event} event - the click event that triggers the function
 * @return {void} This function does not return anything
 */
function filterImg(e){
  generateGallery("gallery", e.target.getAttribute('filterCategoryId'));
  document.querySelector("#filters .filterParent .filter .selected").classList.remove('selected');
  e.target.classList.add("selected");
}

/**
 * Asynchronously fetches data from a specified endpoint and returns it as JSON.
 * @return {Promise} A promise that resolves to the fetched data.
 */
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

/**
 * Asynchronously creates a modal with various elements. This function configures the modal elements and adds event
 * listeners to them. Finally, it appends the modal to the body of the document
 * and generates the gallery of the modal.
 * @param {Event} e - The event that triggered the function.
 * @return {Promise<void>} - A promise that resolves when the modal is created.
 */
async function createModal (e) {
  const modalAside      = document.createElement("aside");
  const modalContainer  = document.createElement("div");
  const closeBtn        = document.createElement("button");
  const modalTitle      = document.createElement("h3");  
  const addPhotoBtn     = document.createElement("button");
  const deleteGallery   = document.createElement("a");
  const modalGallery    = document.createElement("div");
  //configurer
  configureModalElements(modalAside, modalContainer, closeBtn, modalTitle, addPhotoBtn, deleteGallery, modalGallery);
  //addEventListener 
  addEventListenersToModalElements(closeBtn, addPhotoBtn, modalContainer);
  //mettre les éléments de la modale dans le DOM
  document.body.append(modalAside);
  //générer la galerie de la modale
  generateGalleryModal("modal-gallery");
}

/**
 * Configures the elements of a modal.
 * @param {HTMLElement} modalAside - The modal aside element.
 * @param {HTMLElement} modalContainer - The modal container element.
 * @param {HTMLElement} closeBtn - The close button element.
 * @param {HTMLElement} modalTitle - The modal title element.
 * @param {HTMLElement} addPhotoBtn - The add photo button element.
 * @param {HTMLElement} deleteGallery - The delete gallery element.
 * @param {HTMLElement} modalGallery - The modal gallery element.
 */
function configureModalElements(modalAside, modalContainer, closeBtn, modalTitle, addPhotoBtn, deleteGallery, modalGallery) {
  modalAside.id                 = "modal1";
  modalAside.classList.add      ("modal");
  modalContainer.classList.add  ("modal-wrapper", "js-modal-stop");
  closeBtn.classList.add        ("js-modal-close");
  closeBtn.innerText            = "x";
  modalTitle.classList.add      ("title-modal");
  modalTitle.innerText          = "Galerie photo";
  modalGallery.classList.add    ("modal-gallery");
  addPhotoBtn.id                = "js-modal-add-photo";
  addPhotoBtn.innerText         = "Ajouter une photo";
  deleteGallery.classList.add   ("js-delete-gallery");
  deleteGallery.innerText       = "Supprimer la galerie";
  deleteGallery.href            = "#";
  // Placer dans le DOM
  modalAside.append(modalContainer);
  modalContainer.append(closeBtn, modalTitle, modalGallery, addPhotoBtn, deleteGallery);
  }
  
/**
 * Clears the content of the modal container.

 * @param {none}
 * @return {void}
 */
function clearModal() {
  const modalContainer = document.querySelector(".modal-wrapper.js-modal-stop")
  modalContainer.innerText = ""
  }  

/**
 * Removes the modal from the DOM.
 * @return {undefined} This function does not return any value.
 */
function closeModal() {
    const modalAside = document.querySelector(".modal")
    modalAside.remove()
  }

/**
 * Adds event listeners to modal elements.
 * @param {HTMLElement} closeBtn - The button element that closes the modal.
 * @param {HTMLElement} addPhotoBtn - The button element that opens the modal to add a photo.
 */
function addEventListenersToModalElements(closeBtn, addPhotoBtn) {
    addPhotoBtn.addEventListener("click", createModal2);
    closeBtn.addEventListener("click", closeModal);
  }
 
  /**
   * Asynchronously creates a modal element with new DOM elements and
   * configurations. It also configures event listeners for the new elements.
   * @param {Event} e - The event that triggers the creation of the modal.
   * @return {Promise} A promise that resolves when the modal is fully created.
   */
  async function createModal2 (e) {
    //récup les éléments existants 
    const modalAside     = document.querySelector("#modal1")
    const modalContainer = document.querySelector(".modal-wrapper.js-modal-stop")
    const closeBtn       = document.querySelector(".js-modal-close")
    const modalTitle     = document.querySelector(".title-modal") 
    const addPhotoBtn    = document.querySelector("#js-modal-add-photo")
    
    //création des nouveaux éléments 
    const controlDiv        = document.createElement("div")
    const arrow             = document.createElement("i")
    const landscapeIcon     = document.createElement("i")
    const photoSelectionDiv = document.createElement("div")
    const form              = document.createElement("form")
    const ttlInput          = document.createElement("input")
    const catInput          = document.createElement("input")
    const modal2ValidateBtn = document.createElement("js-modal-validate")
    //configurer
    configureModal2Elements(modalAside, modalContainer, closeBtn, modalTitle, photoSelectionDiv, addPhotoBtn, controlDiv, arrow, landscapeIcon, form, ttlInput, catInput, modal2ValidateBtn)
    //addEventListener 
    addEventListeners.ToModal2Elements(closeBtn, addPhotoBtn, modal2ValidateBtn)
  }

  function configureModal2Elements(modalAside, modalContainer, controlDiv, closeBtn, arrowIcon, modalTitle, modalGallery,  landscapeIcon, addPhotoBtn, modal2P, form, ttlInput, catInput, modal2ValidateBtn) {
    controlDiv.classList.add       ("control-div")
    modalTitle.innerText           = "Ajout photo"
    arrowIcon.classList.add        ("fa-sharp", "fa-solid", "fa-arrow-left", "icon3")
    photoSelectionDiv.classList.add("photo-selection-div")
    landscapeIcon.classList.add    ("fa-sharp", "fa-solid", "fa-image-landscape", "icon4")
    addPhotoBtn.innerText          = "+ ajouter photo"
    modal2P.id                     = "modal2-p"
    form.id                        = "modal2-form"
    ttlInput.id                    = "ttl-input"
    catInput.id                    = "cat-input"
    modal2ValidateBtn.id           = "modal2-validate-btn"
    modal2ValidateBtn.innerText    = "Valider"
  
    // Placer les éléments ds la modale
    modalAside.append(modalContainer);
    modalContainer.append(controlDiv, modalTitle, photoSelectionDiv, form, modal2ValidateBtn);
    controlDiv.append(closeBtn, arrow);
    photoSelectionDiv.append(landscapeIcon, addPhotoBtn, modal2P);
    form.append(ttlInput, catInput);
    }
  
  //delete photo
  function deletePhoto(id, img) {
     return async (e) => {
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
  // Get the element with the given selector and clear its contents
  const galleryDiv = document.querySelector(`.${selector}`)
  galleryDiv.innerHTML = ""
  
  // Filter the data based on the provided categoryId
  const data = categoryId !== null
    ? result.filter(img => Number.parseInt(categoryId) === img.categoryId)
    : result
  
  // Loop through the filtered data to generate HTML elements for each image
  for (const img of data) {
    // Create the necessary HTML elements
    const figure = document.createElement('figure')
    const imgEl = document.createElement('img')
    const iconsContainer = document.createElement('div')
    const figcaption = document.createElement('figcaption')
    const iconVisible = document.createElement('i')
    const iconInvisible = document.createElement('i')
    
    // Configure the image and elements
    imgEl.src = img.imageUrl
    imgEl.alt = img.title
    figcaption.innerText = 'éditer'
    iconsContainer.classList.add('icons-container')
    iconVisible.classList.add('fa', 'fa-trash-can', 'icons', 'icon1')
    iconInvisible.classList.add('fa-solid', 'fa-arrows-up-down-left-right', 'icons', 'icon2')
    iconVisible.style.display = 'inline-block'
    iconInvisible.style.display = 'inline-block'
    iconInvisible.style.opacity = '0'
    
    // Add event listeners to show/hide icons and scale image on hover
    figure.addEventListener('mouseenter', () => {
      iconInvisible.style.opacity = '1'
      figure.style.transform = 'scale(1.2)'
    })
    figure.addEventListener('mouseleave', () => {
      iconInvisible.style.opacity = '0'
      figure.style.transform = 'scale(1)'
    })
    
    // Append the HTML elements to the figure and iconsContainer
    figure.append(imgEl, figcaption, iconsContainer)
    iconsContainer.append(iconVisible, iconInvisible)
    
    // Append the figure to the galleryDiv and add a click event listener to the delete icon
    galleryDiv.append(figure)
    iconVisible.addEventListener('click', () => deletePhoto(img.id, imgEl))
  }
}

// ********** MAIN CODE **********

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
    liAll.addEventListener('click', filterImg)
    liAll.classList.add("filter", "selected") //attribution de la class à l'élément liAll FAIRE LE LIEN EN TRAVAILLANT SUR STYLE.CSS
    ulFilters.classList.add("filterParent")
    //placer dans le DOM
    ulFilters.append(liAll)
    filters.append(ulFilters)

    res.json().then(data => {
      for (let i = 0; i < data.length; i++) {
        const li = document.createElement('li')
        li.innerText = data[i].name
        li.setAttribute('filterCategoryId', data[i].id)
        li.addEventListener('click', filterImg)
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

modalLink.addEventListener("click", createModal)

//Modal 2
  const LinkToModal2 = document.getElementById("js-modal-add-photo")
  if (LinkToModal2 !== null) {
    LinkToModal2.addEventListener("click", createModal2)
  }
  