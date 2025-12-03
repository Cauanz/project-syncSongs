
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





async function getSnapshots() {
  const snaps = await fetch("/choose-snapshot", {
    method: 'GET'
  })
  const res = await snaps.json();
  

  if(res) {
    document.querySelector(".formsContainer").style.display = 'None';

    const cardsContainer = document.createElement("div");
    cardsContainer.classList.add("cardsContainer");

    for (let i = 0; i < res.length; i++) {
      const snapCard = document.createElement("div");
      snapCard.classList.add("snapCard");
      const txtLink = document.createElement("a");
      txtLink.textContent = snap;
      snapCard.appendChild(txtLink);
      document.querySelector(".content").appendChild(snapCard);
    }

    // TODO - NÃO SEI COMO FAZER ISSO

    // res.forEach(snap => {
    //   const snapCard = document.createElement('div');
    //   snapCard.classList.add("snapCard");
    //   const txtLink = document.createElement('a');
    //   txtLink.textContent = snap;
    //   txtLink.textContent = snap;
    //   snapCard.appendChild(txtLink);
    //   document.querySelector('.content').appendChild(snapCard);
    // });
  }

}

