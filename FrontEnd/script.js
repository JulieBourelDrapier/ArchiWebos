console.log("Hello")

fetch("http://localhost:5678/api/works")
  .then(res => res.json())
  .then(data => console.log(data))

  //help from https://www.youtube.com/watch?v=cuEtnrL9-H0 
