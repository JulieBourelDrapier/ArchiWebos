"use strict";

//*********** constantes **************//
const email = document.getElementById("email")
const logBtn = document.getElementById("log-btn")

//*********** addeventlistener ***********//
logBtn.addEventListener("click", authenticateUser)

//*********** functions ***********//
function authenticateUser(event) {
  event.preventDefault()
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
          localStorage.setItem("token", data.token) 
          location.href = "index.html"
        })
    } else {
      alert("Erreur dans l’identifiant ou le mot de passe")
    }
  })
}


