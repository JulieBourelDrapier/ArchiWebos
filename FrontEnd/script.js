const gallery 

fetch("http://localhost:5678/api/works/")
  .then(res => {
    if (res.ok) {
      console.log("It is working")
    } else {
      console.log("It is NOT working")
    }
  })
  .then(data => console.log(data))


  