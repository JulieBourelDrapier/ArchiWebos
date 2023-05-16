//javascript asyncrome => fetch => Get request
const images = document.getElementById("gallery");

fetch("http://localhost:5678/api/works/")
  .then(res => res.json())
  .then(data => images.src = data[0].url)


  