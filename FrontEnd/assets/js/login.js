//email: sophie.bluel@test.tld
// vérification de l'authentification pour se connecter et accéder à la homepage
//annonce des variables 
const email = document.getElementById("email")
const logButton = document.getElementById("log-btn")

function authenticateUser(event) {
  event.preventDefault()
  console.log({
    email: document.getElementById("email").value ?? '',
    password: document.getElementById("password").value ?? ''
  })
  //poster dynamiquement les identifiants via fetch
  fetch("http://localhost:5678/api/users/login",
  {
    method: "POST",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: document.getElementById("email").value ?? '',
      password: document.getElementById("password").value ?? ''
    })
  })
    .then(res => {
      if(res.ok){
        res.json().then(data => {
          result = data
          localStorage.setItem("token", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTY1MTg3NDkzOSwiZXhwIjoxNjUxOTYxMzM5fQ.JGN1p8YIfR-M-5eQ-Ypy6Ima5cKA4VbfL2xMr2MgHm4") //(clé+valeur)
          location.href = "/FrontEnd/index.html"
        })
    } else {
      alert("Erreur dans l’identifiant ou le mot de passe")
    }
  })
}

// Eventlistener 
logButton.addEventListener("click", authenticateUser)

// fonction qui désactive le display hidden si l'authentification est réussie
