
// let previousPageBtn = document.querySelector("#back")

// TODO - TERMINAR ISSO DEPOIS
// previousPageBtn.addEventListener('click', (e) => {
//   const form = document.querySelector('#folderForm');
//   const table = document.querySelector("#table");

//   form.style.display = 'flex';
//   table.style.display = "None";
// })


let uploadInput = document.querySelector("#selectfolder");
let filesText = document.querySelector(".files");

uploadInput.addEventListener("change", (e) => {
  files = e.target.files;
  filesText.textContent = files.length + " files found";
})