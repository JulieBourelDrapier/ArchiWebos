const myImage = document.getElementById('img');

fetch("http://localhost:5678/images/abajour-tahina1651286843956.png")
.then(function(response) {
  return response.blob();
})
.then(function(myBlob) {
  const objectURL = URL.createObjectURL(myBlob);
  myImage.src = objectURL;
});
