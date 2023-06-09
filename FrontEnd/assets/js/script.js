"use strict";

//************** constantes ***************//
const fileTypes = [
  "image/jpeg",
  "image/jpg",
  "image/png",
];

//************* functions ****************//

/**
 * Affiche les éléments qui possèdent la classe "hidden".
 * Sélectionne l'élément avec la classe "log-btn" et récupère un token à partir du localStorage.
 * Modifie le texte de l'élément "log-btn" en "logout" et masque l'élément avec l'ID "filters".
 * Ajoute un eventListener sur "log-btn" qui déclenche la fonction logout.
 */
function showHiddenElements() { 
  let hiddenElements  = document.getElementsByClassName("hidden");
  const logBtn        = document.querySelector(".log-btn");
  const token         = localStorage.getItem("token");
  if (token) {
    Array.from(hiddenElements).forEach((element) => {
      element.classList.remove("hidden");
      document.querySelector(".log-btn").textContent ="logout";
      document.getElementById("filters").setAttribute("style", "display:none");
    })
    logBtn.addEventListener("click", logOut);
  }
}

/**
 * Déconnecte l'utilisateur en supprimant le token du localStorage et en rechargeant la page.
 * @param {Event} event - L'objet d'événement représentant l'action de l'utilisateur.
 */
function logOut(event) {
  event.preventDefault();
  localStorage.removeItem("token");
  location.reload();
}

/**
 * Filtre et affiche les images en fonction de l'événement donné.
 * @param {Event} e - L'événement déclenchant le filtre.
 */
async function filterImgEvent(e) {
  createGallery("gallery", e.target.getAttribute('filterCategoryId'), await fetchWorks());
  document.querySelector("#filters .filterParent .filter .selected").classList.remove('selected');
  e.target.classList.add("selected");
}

/**
 * Récupère les travaux à partir de l'API.
 * @return {Promise<Object>} Les travaux récupérés.
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
* Crée une galerie en fonction du sélecteur, de la catégorie et du résultat fournis.
* @param {string} selector - Le sélecteur CSS du conteneur de la galerie.
* @param {number|null} [categoryId=null] - L'ID de la catégorie pour filtrer la galerie. Par défaut, null.
* @param {Array|null} [result=null] - Le tableau d'images pour peupler la galerie. Par défaut, null.
*/
function createGallery(selector, categoryId = null, result = null) {
  const galleryDiv = document.getElementsByClassName(selector)[0];
  galleryDiv.innerHTML = "";
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
    
    const figure     = document.createElement('figure');
    const img        = document.createElement('img');
    const figcaption = document.createElement('figcaption');
 
    img.setAttribute('src', data[i].imageUrl);
    img.setAttribute('alt', data[i].title);
    figcaption.innerText = data[i].title;
    
    figure.append(img);
    figure.append(figcaption);

    galleryDiv.append(figure);
  }
}

/**
 * Crée une galerie modale avec les données fournies.
 * @param {Array} data - Les données utilisées pour générer la galerie modale.
 */
function createGalleryModal(data = null) {
  const galleryDiv = document.getElementsByClassName('modal-gallery')[0];
  galleryDiv.innerHTML = "";

  for (let i = 0; i < data.length; i++) {
    
    const figure         = document.createElement('figure');
    const img            = document.createElement('img');
    const iconsContainer = document.createElement('div');
    const figcaption     = document.createElement('figcaption');
    const trashIcon      = document.createElement('i');
    const ZoomIcon       = document.createElement('i');
   
    img.setAttribute('src', data[i].imageUrl);
    img.setAttribute('alt', data[i].title);
    figcaption.innerText = "éditer";
    iconsContainer.classList.add("icons-container");
    trashIcon.classList.add("fa", "fa-trash-can","icons", "icon1");
    ZoomIcon.classList.add("fa-solid", "fa-arrows-up-down-left-right", "icons", "icon2");
    
    trashIcon.style.display = "inline-block";
    ZoomIcon.style.display  = "inline-block";
    ZoomIcon.style.opacity  = "0";

    figure.addEventListener('mouseenter', () => {
    ZoomIcon.style.opacity = "1";
    figure.style.transform = "scale(1.1)";
    })

    figure.addEventListener('mouseleave', () => {
    ZoomIcon.style.opacity = "0";
    figure.style.transform      = "scale(1)";
    })
    
    figure.append(img);
    figure.append(figcaption);
    figure.append(iconsContainer);
    iconsContainer.append(trashIcon);
    iconsContainer.append(ZoomIcon);
    
    galleryDiv.append(figure);
    
    trashIcon.addEventListener("click", deletePhoto(data[i].id, figure));
  }
}

/**
 * Ferme la modale.
 * @param {Event} e - L'événement qui a déclenché la fermeture du modal.
 */
function closeModal (e) {
  const modal = document.querySelector(".modal");
  modal.remove();
  document.removeEventListener("click", closeModal);
}

/**
 * Supprime les éléments de la modal1.
 * @param {Event} e - L'objet événement.
 */
function clearModal1 (e) {
  const modal = document.getElementById("modal1");
  modal.remove();
}

/**
 * Crée des options pour les catégories.
 * @return {Array} Un tableau d'options pour les catégories.
 */

async function createCategoriesOptions() {
  try {
    const res = await fetch("http://localhost:5678/api/categories/");
    if(res.ok){
      const data = await res.json()
      const opts = [new Option ("","")];
      for (let i = 0; i < data.length; i++) {
        opts.push(new Option(data[i].name, data[i].id))
      }
      return opts
    } else {
      console.error("No data received");
    }
  }
  catch(error) {
    console.error(error);
  }
}

/**
 * Crée une seconde modale et l'ajoute au corps du document.
 * @param {Event} e - L'objet d'événement qui a déclenché la création de la deuxième modal.
 * @return {Promise<void>} - Une promesse qui se résout lorsque la deuxième modal est créée et ajoutée.
 */
async function createSecondModal (e) {
  const secondModal = document.createElement("aside");
  const modalDiv    = document.createElement("div");
  const divNav      = document.createElement("div");
  const leftArrow   = document.createElement("i");
  const closeBtn    = document.createElement("button");
  const modalTitle  = document.createElement("h3"); 
 
  const form              = document.createElement("form");
  const applySelectionDiv = document.createElement("div");
  const landscapeIcon     = document.createElement("i");
  const imgLabel          = document.createElement("label");
  const imgInput          = document.createElement("input");
  const suggSpan          = document.createElement("span");
  const titleLabel        = document.createElement("label");
  const titleInput        = document.createElement("input");
  const categoryLabel     = document.createElement("label");
  const categorySelect    = document.createElement("select");
  const borderDiv         = document.createElement("div");
  const submitBtn         = document.createElement("button");
  const previewDiv        = document.createElement("div");
  
  secondModal.id = "modal2";
  secondModal.classList.add("modal");
  modalDiv.classList.add("modal-wrapper", "js-modal-stop");
  divNav.classList.add("div-nav");
  leftArrow.classList.add("fa-sharp", "fa-solid", "fa-arrow-left", "icon3");
  closeBtn.classList.add("js-second-modal-close");
  closeBtn.innerText = "x";
  modalTitle.classList.add("title-modal");
  modalTitle.innerText = "Ajout photo";
  
  form.classList.add("second-modal-form");
  applySelectionDiv.classList.add("apply-selection-div");
  landscapeIcon.classList.add("fa-regular", "fa-image", "icon4");
  imgInput.type = "file";
  imgInput.id = "image-input";
  imgInput.style.opacity = "0";
  imgInput.accept = ".jpg, .jpeg, .png";
  imgLabel.textContent = "+ Ajouter photo";
  imgLabel.htmlFor = "image-input";
  imgLabel.id = "js-second-modal-add-photo";
  suggSpan.id = "suggestions-span";
  suggSpan.innerText = "jpg, png : 4mo max";
  titleLabel.id = "title-label";
  titleLabel.textContent = "Titre";
  titleInput.id = "title-input";
  titleInput.type = "text";
  titleInput.name = "title";
  titleInput.required = true;
  categorySelect.id = "category-select";
  categoryLabel.textContent = "Catégorie";
  borderDiv.id = "border-div"; 
  submitBtn.classList.add("submit-btn");
  submitBtn.id = "validate-btn";
  submitBtn.type = "submit";
  submitBtn.textContent = "Valider";
  previewDiv.classList.add("preview")
  
  document.body.prepend(secondModal);
  secondModal.append(modalDiv);
  modalDiv.append(divNav, modalTitle, applySelectionDiv, form);
  divNav.append(leftArrow, closeBtn);
  applySelectionDiv.append(landscapeIcon, previewDiv, imgInput, imgLabel, suggSpan);
  const opts = await createCategoriesOptions();
  opts.forEach(option => {
    categorySelect.add(option);
  })
  form.append(applySelectionDiv, titleLabel, titleInput, categoryLabel, categorySelect, borderDiv, submitBtn);

  leftArrow.addEventListener("click", () => {
    closeModal()
    createModal()
  });

  modalDiv.addEventListener("click", stopPropagation);
  window.addEventListener('click', clickOutsideModal, {capture: true});
  closeBtn.addEventListener("click", closeModal);
  imgInput.addEventListener("change", updateImageDisplay);
  categorySelect.addEventListener('change', formValidation);
  titleInput.addEventListener('change', formValidation);
  imgInput.addEventListener('change', formValidation);
  
  submitBtn.addEventListener("click", (event) => {
    event.preventDefault();
    if (titleInput.value === "" || categorySelect.value === "" || imgInput.files.length === 0) {
      alert("Tous les champs doivent être remplis");
    }
    else
      submitPhoto();
  });
}

/**
 * Valide le formulaire en vérifiant si le champ titre, la sélection de catégorie et le champ image sont remplis.
 * @param {Event} e - L'objet événement.
 */
function formValidation(e) {
  const titleInput     = document.getElementById("title-input");
  const categorySelect = document.getElementById("category-select");
  const imgInput       = document.getElementById("image-input");
  const submitBtn      = document.getElementById("validate-btn");

  if (titleInput.value === "" || categorySelect.value === "" || imgInput.files.length === 0) {
    submitBtn.classList.remove("validated")
  }
  else {
    submitBtn.classList.add('validated')
  }
}

/**
 * Crée une fenêtre modale avec différents éléments et l'ajoute au corps du document.
 * @param {Event} e - L'événement qui a déclenché la fonction.
 * @return {Promise<void>} Une promesse qui se résout lorsque la fenêtre modale est créée.
 */
async function createModal (e) {
  const modal        = document.createElement("aside");
  const modalDiv     = document.createElement("div");
  const closeBtn     = document.createElement("button");
  const modalTitle   = document.createElement("h3");  
  const addBtn       = document.createElement("button");
  const deleteBtn    = document.createElement("a");
  const modalGallery = document.createElement("div");
 
  modal.id = "modal1";
  modal.classList.add("modal");
  modalDiv.classList.add("modal-wrapper", "js-modal-stop");
  closeBtn.classList.add("js-modal-close");
  closeBtn.innerText = "x";
  modalTitle.classList.add("title-modal");
  modalTitle.innerText = "Galerie photo";
  modalGallery.classList.add("modal-gallery");
  addBtn.id = "js-modal-add-photo";
  addBtn.innerText = "Ajouter une photo";
  addBtn.addEventListener("click", clearModal1);
  deleteBtn.classList.add("js-delete-gallery");
  deleteBtn.innerText = "Supprimer la galerie";
  deleteBtn.href="#";
  
  document.body.prepend(modal);
  modal.append(modalDiv);
  modalDiv.append(closeBtn, modalTitle, modalGallery, addBtn, deleteBtn);

  createGalleryModal(await fetchWorks());
  
  closeBtn.addEventListener("click", closeModal);
  modal.addEventListener("click", stopPropagation);
  window.addEventListener('click', clickOutsideModal, {capture: true});
  addBtn.addEventListener("click", createSecondModal);
}


/**
 * Met à jour l'affichage de l'image en fonction des fichiers sélectionnés.
 * @param {Event} e - L'objet de l'événement.
 */
function updateImageDisplay(e) {
  const preview       = document.querySelector('.preview')
  const input         = document.querySelector('#image-input')
  const landscapeIcon = document.querySelector(".fa-regular.fa-image.icon4")

  while (preview.firstChild) {
    preview.removeChild(preview.firstChild);
  }

  const curFiles = input.files;
  if (curFiles.length === 0) {
    const para = document.createElement("p");
    para.textContent = "No files currently selected for upload";
    landscapeIcon.style.display = 'default'
    preview.appendChild(para);
  } else {
    landscapeIcon.style.display = 'none'
    const list = document.createElement("ol");
    preview.appendChild(list);

    for (const file of curFiles) {
      const listItem = document.createElement("li");
      const para = document.createElement("p");
      if (validFileType(file)) {
        para.textContent = `File name ${file.name}, file size ${returnFileSize(
          file.size
        )}.`;
        const image = document.createElement("img");
        image.src = URL.createObjectURL(file);

        listItem.appendChild(image);
        listItem.appendChild(para);
      } else {
        para.textContent = `File name ${file.name}: Not a valid file type. Update your selection.`;
        listItem.appendChild(para);
      }

      list.appendChild(listItem);
    }
  }
}

function validFileType(file) {
  return fileTypes.includes(file.type);
}


function returnFileSize(number) {
  if (number < 1024) {
    return `${number} bytes`;
  } else if (number >= 1024 && number < 1048576) {
    return `${(number / 1024).toFixed(1)} KB`;
  } else if (number >= 1048576) {
    return `${(number / 1048576).toFixed(1)} MB`;
  }
}

/**
 * Permet de fermer la modale en cliquant en dehors de celle-ci.
 * @param {Event} e - L'objet d'événement de clic.
 */
function clickOutsideModal(e) {
  if (!document.querySelector(".modal-wrapper.js-modal-stop")?.contains(e.target)) {
    closeModal();
    window.removeEventListener('click', clickOutsideModal, {capture: true})
  }
}

function stopPropagation (e) {
  e.stopPropagation();
}

/**
* Permet de supprimer une photo.
* @param {number} id - L'ID de la photo à supprimer.
* @param {HTMLElement} img - L'élément d'image à supprimer du DOM.
* @return {Promise<void>} Une promesse qui se résout lorsque la photo est supprimée.
*/
function deletePhoto(id, img) {
  return async (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const response = await fetch ("http://localhost:5678/api/works/" + id, {
        method: "DELETE",
        headers: {
          accept: '*/*',
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        }
      });
      if (!response.ok) {
        throw new Error("something went wrong");
      }
      img.remove();
      createGallery("gallery", null, await fetchWorks())
      alert("Photo supprimée avec succès"); 
    }
    catch(error) {
      console.error("un pb est survenu au cours de la suppression de la photo:", error);
    }
  }
}

/**
  * Permet d'ajouter une photo à la galerie.
  * @param {Event} e - L'objet d'événement provenant de l'écouteur d'événements.
  * @return {Promise<void>} Une promesse qui se résout lorsque la photo est soumise.
  */
async function submitPhoto (e) { 
  const titleInput = document.getElementById("title-input");
  const categoryInput = document.getElementById("category-select");
  const fileField = document.getElementById("image-input");
  const formData = new FormData();

  formData.append("title", titleInput.value);
  formData.append("category", categoryInput.value);
  formData.append("image", fileField.files[0]);
  fetch("http://localhost:5678/api/works",
  {
    method: "POST",
    headers: {
      accept: '*/*',
      "Authorization": `Bearer ${localStorage.getItem("token")}`
    },
    body: formData
  })
  .then(res => {
    if (res.ok) {
      res.json().then(async data => {
        closeModal();
        createModal();
        createGallery("gallery", null, await fetchWorks())
        alert("Projet correctement ajouté à la galerie");
    })
    } else {
     alert("Une erreur est survenue");
    }
  });
}
 
/**
 * Initialise les filtres en récupérant les catégories depuis l'API et en créant les éléments de filtre.
 * @param {type} paramName - description du paramètre
 * @return {type} description de la valeur de retour
 */
function initFilters() {
  fetch("http://localhost:5678/api/categories/")
  .then(res => {
    if(res.ok){
      const ulFilters = document.createElement('ul');
      const liAll     = document.createElement('li');
      const filters   = document.getElementById('filters');
      
      liAll.innerText = "Tous";
      liAll.addEventListener("click", filterImgEvent);
      liAll.classList.add("filter", "selected");
      ulFilters.classList.add("filterParent");
      
      ulFilters.append(liAll);
      
      filters.append(ulFilters);
  
      res.json().then(data => {
        for (let i = 0; i < data.length; i++) {
          const li = document.createElement('li');
          li.innerText = data[i].name;
          li.setAttribute('filterCategoryId', data[i].id);
          li.addEventListener('click', filterImgEvent);
          ulFilters.append(li);
          li.classList.add("filter");
        }
      })
    }else {
      console.error("No data received");
    }
  })
  .catch(error => {
    console.error(error);
  })
}

/**
 * Initialise l'application.
 * @return {Promise<void>} Une promesse qui se résout lorsque l'initialisation est terminée.
 */
async function init() {
  const modifyBtn = document.getElementById("js-modal");

  modifyBtn.addEventListener("click", createModal);

  createGallery("gallery", null, await fetchWorks())
  showHiddenElements();
  initFilters()
}

init()
