//javascript asyncrome => fetch => Get request
const images = document.getElementById("gallery");

fetch("http://localhost:5678/api/works/")
  .then(res => {
    console.log(res);
    if(res.ok){
      res.json().then(data => {
        images.src = data[0].url
      })
    } else {
      console.log("NOT working...");

    }
  })


  