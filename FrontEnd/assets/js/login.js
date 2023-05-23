// annonce de la variable hidden pour avoir une portée globale
let hidden 

// vérification de l'authentification pour se connecter et accéder à la homepage
function checkAuthentification() {
  let userId = "sophie.bluel@test.tld"
  let confirmPassword = "S0phie"
  let confirmId = document.querySelector("#email")
  let password = document.querySelector("#password")

  if (password == confirmPassword && confirmId == userId) {
    document.querySelector("form").action = "index.html"
    console.log("password")
  }
  else {
    alert("Erreur dans l’identifiant ou le mot de passe")
  }
}

// fonction qui désactive le display hidden
function showHiddenElements () {
  let hidden = document.getElementsByClassName("hidden")

  if
}