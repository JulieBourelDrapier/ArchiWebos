// vérification de l'authentification pour se connecter et accéder à la homepage
//annonce des variables 
const email = document.getElementById("email")
const logButton = document.getElementById("log-btn")

//récupérer dynamiquement les identifiants via fetch
fetch("http://localhost:5678/api/users/login",
{
  method: "POST",
  body: JSON.stringify({
    email: "string",
    password: "string"
  })
})
  .then(res => {
    if(res.ok){
      const email = document.getElementById("email").value 
      const password = ducument.getElementById("password").value 
      res.json().then(data => {
        result = data
        goToHomepage()
      })
  } else {
    alert("Erreur dans l’identifiant ou le mot de passe")
  }
})

function goToHomepage (event) {
  event.preventDefault();
  console.log('la fonction est appelée')
  if (connected) {
    localStorage.setItem("token", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTY1MTg3NDkzOSwiZXhwIjoxNjUxOTYxMzM5fQ.JGN1p8YIfR-M-5eQ-Ypy6Ima5cKA4VbfL2xMr2MgHm4") //(nom+valeur)
    location.href = "/FrontEnd/index.html" 
  } else {
    console.log("Erreur dans l’identifiant ou le mot de passe")
  }
}

// Eventlistener 
logButton.addEventListener("click", goToHomepage)

// fonction qui désactive le display hidden si l'authentification est réussie
