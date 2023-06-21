//*************** variables **************
let result;//intervient dans la récupération de la galerie

//************** constantes ***************
const connexionLink = document.querySelector(".connexion-link");
const modalLink = document.getElementById("js-modal");

//************** addEventListener ********
modalLink.addEventListener("click", createModal);

//************* fonctions ****************
function showHiddenElements() { 
  let hiddenElements = document.getElementsByClassName("hidden");
  const token        = localStorage.getItem("token");
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

function filterImgEvent(e) {
  generateAndCreateGallery("gallery", e.target.getAttribute('filterCategoryId'));
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

function generateAndCreateGallery(selector, categoryId = null) {
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
    //générer les élements 
    const figure     = document.createElement('figure');
    const img        = document.createElement('img');
    const figcaption = document.createElement('figcaption');
    //configurer
    img.setAttribute('src', data[i].imageUrl);
    img.setAttribute('alt', data[i].title);
    figcaption.innerText = data[i].title;
    // placer les éléments générés
    figure.append(img);
    figure.append(figcaption);
    // ajouter les éléments dans le DOM
    galleryDiv.append(figure);
  }
}

async function FetchAndCreateGallery() {
  result = await fetchWorks();
  generateAndCreateGallery("gallery");
}

function generateAndCreateGalleryModal(selector, categoryId = null) {
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
    //générer les élements 
    const figure         = document.createElement('figure');
    const img            = document.createElement('img');
    const iconsContainer = document.createElement('div');
    const figcaption     = document.createElement('figcaption');
    const iconVisible    = document.createElement('i');
    const iconInvisible  = document.createElement('i');
    //configurer
    img.setAttribute('src', data[i].imageUrl);
    img.setAttribute('alt', data[i].title);
    figcaption.innerText = "éditer";
    iconsContainer.classList.add("icons-container");
    iconVisible.classList.add("fa", "fa-trash-can","icons", "icon1");
    iconInvisible.classList.add("fa-solid", "fa-arrows-up-down-left-right", "icons", "icon2");
    //setting of  display property for icons
      iconVisible.style.display = "inline-block";
      iconInvisible.style.display = "inline-block";
      iconInvisible.style.opacity = "0";
    //addEventListener to make the icon appear and disappear
      figure.addEventListener('mouseenter', () => {
      iconInvisible.style.opacity = "1";
      figure.style.transform = "scale(1.2)";
    })
      figure.addEventListener('mouseleave', () => {
      iconInvisible.style.opacity = "0";
      figure.style.transform = "scale(1)";
    })
    // placer les éléments générés
      figure.append(img);
      figure.append(figcaption);
      figure.append(iconsContainer);
      iconsContainer.append(iconVisible);
      iconsContainer.append(iconInvisible);
    // ajouter les éléments dans le DOM
      galleryDiv.append(figure);
    
      iconVisible.addEventListener("click", deletePhoto(data[i].id, img));
  }
}

async function createModal (e) {
  const modalAside     = document.createElement("aside");
  const modalDiv       = document.createElement("div");
  const modalFirstBtn  = document.createElement("button");
  const modalTitle     = document.createElement("h3");  
  const modalSecondBtn = document.createElement("button");
  const modalDelete    = document.createElement("a");
  const modalGallery   = document.createElement("div");
  //configurer
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
  modalSecondBtn.addEventListener("click", addPhoto);
  modalDelete.classList.add("js-delete-gallery");
  modalDelete.innerText = "Supprimer la galerie";
  modalDelete.href="";
  //placer dans le dom
  document.body.append(modalAside);
  modalAside.append(modalDiv);
  modalDiv.append(modalFirstBtn, modalTitle, modalGallery, modalSecondBtn, modalDelete);

  generateAndCreateGalleryModal("modal-gallery");
  
  modalFirstBtn.addEventListener("click", closeModal);
}

//function clearModal() {
  //const modalDiv     = document.querySelector(".modal-wrapper")
  //modalDiv.innerText = ""
//}

function closeModal (e) {
  const modal = document.getElementById("modal1");
  modal.remove();
}

function addPhoto (e) {
  const modal = document.getElementById("modal1");
  modal.remove();
}

function deletePhoto(id, img) {
  return async (e) => {
    e.preventDefault();
    e.stopPropagation();
    img.remove();
    console.log("Suppression en cours...");
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
      console.log("Photo supprimé avec succès");
    }
    catch(error) {
      console.error("un pb est survenu au cours de la supp de la photo:", error);
    }
  }
}

function addPhoto (e) {   
}

//************** MAIN  ***************
showHiddenElements();

FetchAndCreateGallery();

//mettre ces éléments dans une fonction pour plus de clarté
fetch("http://localhost:5678/api/categories/")
.then(res => {
  if(res.ok){
    const ulFilters = document.createElement('ul');
    const liAll = document.createElement('li');
    const filters = document.getElementById('filters');
    //configuer 
    liAll.innerText = "Tous";
    liAll.addEventListener("click", filterImgEvent);
    liAll.classList.add("filter", "selected");
    ulFilters.classList.add("filterParent");
    //placer
    ulFilters.append(liAll);
    //ajouter dans le DOM
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

//Modal 2
const linkToSecondModal = document.getElementById("js-modal-add-photo");
if (linkToSecondModal !== null) {
  linkToSecondModal.addEventListener("click", createSecondModal);
}

async function createSecondModal (e) {
//récup les éléments existants 
const modalAside     = document.querySelector("#modal1");
const modalDiv       = document.querySelector(".modal-wrapper.js-modal-stop");
const modalFirstBtn  = document.querySelector(".js-modal-close");
const modalTitle     = document.querySelector(".title-modal");
const modalSecondBtn = document.querySelector("#js-modal-add-photo");

//création des nouveaux éléments 
const controlDiv        = document.createElement("div");
const modal2Arrow       = document.createElement("i");
const landscapeIcon     = document.createElement("i");
const photoSelectionDiv = document.createElement("div");
const modal2Form        = document.createElement("form");
const modal2Input1      = document.createElement("input");
const modal2Input2      = document.createElement("input");
const modal2ValidateBtn = document.createElement("js-modal-validate");

//configurer
  controlDiv.classList.add       ("control-div");
  modalTitle.innerText           = "Ajout photo";
  arrowIcon.classList.add        ("fa-sharp", "fa-solid", "fa-arrow-left", "icon3");
  photoSelectionDiv.classList.add("photo-selection-div");
  landscapeIcon.classList.add    ("fa-sharp", "fa-solid", "fa-image-landscape", "icon4");
  modalSecondBtn.innerText       = "+ ajouter photo";
  modal2P.id                     = "modal2-p";
  modal2Form.id                  = "modal2-form";
  modal2Input1.id                = "modal2-input1";
  modal2Input2.id                = "modal2-input2";
  modal2ValidateBtn.id           = "modal2-validate-btn";
  modal2ValidateBtn.innerText    = "Valider";
  
  // Placer les éléments ds la modale
  modalAside.append(modalDiv);
  modalDiv.append(controlDiv, modalTitle, photoSelectionDiv, modal2Form, modal2ValidateBtn);
  controlDiv.append(modalFirstBtn, modal2Arrow);
  photoSelectionDiv.append(landscapeIcon, modalSecondBtn, modal2P);
  modal2Form.append(modal2Input1, modal2Input2);
}














