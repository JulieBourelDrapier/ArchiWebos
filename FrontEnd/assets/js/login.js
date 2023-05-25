// annonce de la constante hidden pour avoir une portée globale
const hidden = document.getElementsByClassName("hidden")

// vérification de l'authentification pour se connecter et accéder à la homepage
//annonce des variables 
const email = "sophie.bluel@test.tld"
const password = "S0phie"
const connected = email === "sophie.bluel@test.tld" && password === "S0phie"
const unconnected = email !== "sophie.bluel@test.tld" || password !== "S0phie"
const logButton = document.querySelector("#log-btn")

function goToHomepage () {
  if (connected) { 
    location.href = "index.html" 
  } else {
    console.log("Erreur dans l’identifiant ou le mot de passe")
  }
}

// Eventlistener 
logButton.addEventListener("click", goToHomepage)

// fonction qui désactive le display hidden si l'authentification est réussie
