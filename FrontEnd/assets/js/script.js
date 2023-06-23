//*************** variables **************
let result;//récupère la galerie

//************** constantes ***************
const connexionLink = document.querySelector(".connexion-link");
const modalLink = document.getElementById("js-modal");
const secondModalLink = document.getElementById("js-modal-add-photo");


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
      iconVisible.style.display   = "inline-block";
      iconInvisible.style.display = "inline-block";
      iconInvisible.style.opacity = "0";
    //addEventListener to make the icon appear and disappear
      figure.addEventListener('mouseenter', () => {
      iconInvisible.style.opacity = "1";
      figure.style.transform      = "scale(1.2)";
    })
      figure.addEventListener('mouseleave', () => {
      iconInvisible.style.opacity = "0";
      figure.style.transform      = "scale(1)";
    })
    // placer les éléments générés
      figure.append(img);
      figure.append(figcaption);
      figure.append(iconsContainer);
      iconsContainer.append(iconVisible);
      iconsContainer.append(iconInvisible);
    // ajouter les éléments dans le DOM
      galleryDiv.append(figure);
    
      iconVisible.addEventListener("click", deletePhoto(data[i].id, figure));
  }
}

function closeModal (e) {
  console.log("close modal")
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
      data = await res.json()
      const opts = []
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
  // e.stopPropagation();
  //récup les éléments existants 
  const secondModalAside     = document.createElement("aside");
  const secondModalDiv       = document.createElement("div");
  const divNav               = document.createElement("div");
  const leftArrow            = document.createElement("i");
  const secondModalFirstBtn  = document.createElement("button");
  const secondModalTitle     = document.createElement("h3"); 

  //ELEMENTS DU FORMULAIRE
  const form                 = document.createElement("form");
  const applySelectionDiv    = document.createElement("div");
  const landscapeIcon        = document.createElement("i");
  const secondModalSecondBtn = document.createElement("button");
  const addImageLabel        = document.createElement("label");
  const addImageInput        = document.createElement("input");
  const suggSpan             = document.createElement("span");
  const titleLabel           = document.createElement("label");
  const titleInput           = document.createElement("input");
  const categoryLabel        = document.createElement("label");
  const categorySelect       = document.createElement("select");
  const submitBtn            = document.createElement("button");

  //configurer
  secondModalAside.id               = "modal2";
  secondModalAside.classList.add    ("modal");
  secondModalDiv.classList.add      ("modal-wrapper", "js-modal-stop");
  divNav.classList.add              ("div-nav");
  leftArrow.classList.add           ("fa-sharp", "fa-solid", "fa-arrow-left", "icon3");
  secondModalFirstBtn.classList.add ("js-second-modal-close");
  secondModalFirstBtn.innerText     = "x";
  secondModalTitle.classList.add    ("title-modal");
  secondModalTitle.innerText        = "Ajout photo";
  
  //CONFIG DES ELEMENTS EN LIEN AVEC LE FORMULAIRE
  form.classList.add                = "second-modal-form";
  applySelectionDiv.classList.add   ("apply-selection-div");
  landscapeIcon.classList.add       ("fa-regular", "fa-image", "icon4");
  secondModalSecondBtn.id           = "js-second-modal-add-photo";
  secondModalSecondBtn.textContent  = "+ Ajouter photo";
  addImageInput.type                = "file";
  addImageInput.id                  = "image-input";
  addImageInput.style.display       = "none";
  addImageLabel.textContent         = "";
  addImageLabel.htmlFor             = "image-input";
  suggSpan.id                       = "suggestions-span";
  suggSpan.innerText                = "jpg, png : 4mo max";
  titleLabel.textContent            = "Titre";
  titleInput.type                   = "text";
  titleInput.name                   = "title";
  titleInput.required               = true;
  categoryLabel.textContent         = "Catégorie";
  submitBtn.classList.add           = "submit-btn";
  submitBtn.id                      = "validate-btn";
  submitBtn.type                    = "submit";
  submitBtn.textContent             = "Valider";

  //placer dans le dom
  document.body.prepend(secondModalAside);
  secondModalAside.append(secondModalDiv);
  secondModalDiv.append(divNav, secondModalTitle, applySelectionDiv, form, submitBtn);
  divNav.append(leftArrow, secondModalFirstBtn);
  applySelectionDiv.append(landscapeIcon, secondModalSecondBtn, addImageInput, addImageLabel, suggSpan);
  const opts = await createCategoriesOptions();
  opts.forEach(option => {
    categorySelect.add(option);
  })
  form.append(applySelectionDiv, titleLabel, titleInput, categoryLabel, categorySelect);


  leftArrow.addEventListener("click", createModal);
  secondModalDiv.addEventListener("click", stopPropagation);
  window.addEventListener('click', clickOutsideModal, {capture: true});
  secondModalFirstBtn.addEventListener("click", closeModal);
  secondModalSecondBtn.addEventListener("click", addPhoto);
  
  //form.addEventListener("submit", createSecondModal);
  submitBtn.addEventListener("click", (event) => {
    event.preventDefault();
    if (titleInput.value === "" || categoryInput.value === "") {
      alert("Veuillez remplir tous les champs");
    }
    else
    form.submit();
  });
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
  modalDelete.href="#";
  //placer dans le dom
  document.body.prepend(modalAside);
  modalAside.append(modalDiv);
  modalDiv.append(modalFirstBtn, modalTitle, modalGallery, modalSecondBtn, modalDelete);

  generateAndCreateGalleryModal("modal-gallery");
  
  modalFirstBtn.addEventListener("click", closeModal);
  modalAside.addEventListener("click", stopPropagation);
  window.addEventListener('click', clickOutsideModal, {capture: true});
  // window.addEventListener('click', clickOutsideModal);
  modalSecondBtn.addEventListener("click", createSecondModal);
}

function clickOutsideModal(e) {
  console.log(e.target)
  if (!document.querySelector(".modal-wrapper.js-modal-stop")?.contains(e.target)) {
    closeModal();
    window.removeEventListener('click', clickOutsideModal, {capture: true})
  }
};

function stopPropagation (e) {
  console.log("stopPropagation");	
  e.stopPropagation();
}

function deletePhoto(id, img) {
  return async (e) => {
    e.preventDefault();
    e.stopPropagation();
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
      img.remove();
      console.log("Photo supprimé avec succès");
    }
    catch(error) {
      console.error("un pb est survenu au cours de la supp de la photo:", error);
    }
  }
}

function submitPhoto (e) { 
  console.log("fonction ajout photo");
  const img = document.getElementsByClassName("img");
  const titleInput = document.getElementById("title");
  const categoryInput = document.getElementById("category");
  fetch("http://localhost:5678/api/post/works"),
  {
    method: "POST",
    headers: {
      accept: '*/*',
      "Authorization": `Bearer ${localStorage.getItem("token")}`
    },
    body: JSON.stringify({
      img: img[0].src,
      title: titleInput.value,
      category: categoryInput.value
    })
  }
  .then(res => {
    if (res.ok) {
      res.json().then(data => {
        console.log(data);
      })
    } else {
     alert("Une erreur est survenue");
    }
  });
}
  
//************** MAIN CODE ***************
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
