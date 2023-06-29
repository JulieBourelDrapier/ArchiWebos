"use strict";

//************** constantes ***************//
const fileTypes = [
  "image/jpeg",
  "image/jpg",
  "image/png",
];

//************* functions ****************//
function showHiddenElements() { 
  const connexionLink = document.querySelector(".connexion-link");
  let hiddenElements  = document.getElementsByClassName("hidden");
  const token         = localStorage.getItem("token");
  if (token) {
    Array.from(hiddenElements).forEach((element) => {
      element.classList.remove("hidden");
      document.querySelector(".connexion-link").textContent ="logout";
      document.getElementById("filters").setAttribute("style", "display:none");
    })
    connexionLink.addEventListener("click", logOut);
  }
}

function logOut(event) {
  event.preventDefault();
  localStorage.removeItem("token");
  location.reload();
}

async function filterImgEvent(e) {
  createGallery("gallery", e.target.getAttribute('filterCategoryId'), await fetchWorks());
  document.querySelector("#filters .filterParent .filter.selected").classList.remove('selected');
  e.target.classList.add("selected");
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

function createGalleryModal(data = null) {
  const galleryDiv = document.getElementsByClassName('modal-gallery')[0];
  galleryDiv.innerHTML = "";

  for (let i = 0; i < data.length; i++) {
    
    const figure         = document.createElement('figure');
    const img            = document.createElement('img');
    const iconsContainer = document.createElement('div');
    const figcaption     = document.createElement('figcaption');
    const iconVisible    = document.createElement('i');
    const iconInvisible  = document.createElement('i');
   
    img.setAttribute('src', data[i].imageUrl);
    img.setAttribute('alt', data[i].title);
    figcaption.innerText = "éditer";
    iconsContainer.classList.add("icons-container");
    iconVisible.classList.add("fa", "fa-trash-can","icons", "icon1");
    iconInvisible.classList.add("fa-solid", "fa-arrows-up-down-left-right", "icons", "icon2");
    
    iconVisible.style.display   = "inline-block";
    iconInvisible.style.display = "inline-block";
    iconInvisible.style.opacity = "0";

    figure.addEventListener('mouseenter', () => {
    iconInvisible.style.opacity = "1";
    figure.style.transform      = "scale(1.2)";
    })

    figure.addEventListener('mouseleave', () => {
    iconInvisible.style.opacity = "0";
    figure.style.transform      = "scale(1)";
    })
    
    figure.append(img);
    figure.append(figcaption);
    figure.append(iconsContainer);
    iconsContainer.append(iconVisible);
    iconsContainer.append(iconInvisible);
    
    galleryDiv.append(figure);
    
    iconVisible.addEventListener("click", deletePhoto(data[i].id, figure));
  }
}

function closeModal (e) {
  const modal = document.querySelector(".modal");
  modal.remove();
  document.removeEventListener("click", closeModal);
}

function addPhoto (e) {
  const modal = document.getElementById("modal1");
  modal.remove();
}

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

async function createSecondModal (e) {
  const secondModal    = document.createElement("aside");
  const secondModalDiv = document.createElement("div");
  const divNav         = document.createElement("div");
  const leftArrow      = document.createElement("i");
  const closeBtn       = document.createElement("button");
  const modalTitle     = document.createElement("h3"); 
 
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
  secondModalDiv.classList.add("modal-wrapper", "js-modal-stop");
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
  secondModal.append(secondModalDiv);
  secondModalDiv.append(divNav, modalTitle, applySelectionDiv, form);
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

  secondModalDiv.addEventListener("click", stopPropagation);
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

async function createModal (e) {
  const modal          = document.createElement("aside");
  const modalDiv       = document.createElement("div");
  const closeBtn       = document.createElement("button");
  const modalTitle     = document.createElement("h3");  
  const addBtn = document.createElement("button");
  const modalDelete    = document.createElement("a");
  const modalGallery   = document.createElement("div");
 
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
  addBtn.addEventListener("click", addPhoto);
  modalDelete.classList.add("js-delete-gallery");
  modalDelete.innerText = "Supprimer la galerie";
  modalDelete.href="#";
  
  document.body.prepend(modal);
  modal.append(modalDiv);
  modalDiv.append(closeBtn, modalTitle, modalGallery, addBtn, modalDelete);

  createGalleryModal(await fetchWorks());
  
  closeBtn.addEventListener("click", closeModal);
  modal.addEventListener("click", stopPropagation);
  window.addEventListener('click', clickOutsideModal, {capture: true});
  addBtn.addEventListener("click", createSecondModal);
}

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

function clickOutsideModal(e) {
  if (!document.querySelector(".modal-wrapper.js-modal-stop")?.contains(e.target)) {
    closeModal();
    window.removeEventListener('click', clickOutsideModal, {capture: true})
  }
}

function stopPropagation (e) {
  e.stopPropagation();
}

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
        throw new Error("qqch n'a pas marché");
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

async function init() {
  const modalLink = document.getElementById("js-modal");

  modalLink.addEventListener("click", createModal);

  createGallery("gallery", null, await fetchWorks())
  showHiddenElements();
  initFilters()
}

//************** main ***************//

init()
