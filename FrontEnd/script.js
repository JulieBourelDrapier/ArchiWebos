//javascript asyncrome => fetch => Get request
const images = document.getElementById("gallery")

fetch("http://localhost:5678/api/works/")
  .then(res => res.json())
  .then(data => imgages.src = data[0].url)


  