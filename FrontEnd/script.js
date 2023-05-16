const myImage = document.getElementById('img');

fetch("http://localhost:5678/api/works")
.then(function(response) {
  return response.blob();
})
.then(function(myBlob) {
  const objectURL = URL.createObjectURL(myBlob);
  myImage.src = objectURL;
});
