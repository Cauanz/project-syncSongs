
// let previousPageBtn = document.querySelector("#back")

// TODO - TERMINAR ISSO DEPOIS
// previousPageBtn.addEventListener('click', (e) => {
//   const form = document.querySelector('#folderForm');
//   const table = document.querySelector("#table");

//   form.style.display = 'flex';
//   table.style.display = "None";
// })

// TODO - FAZER ESSA FUNÇÃO QUE SELECIONA O CARD QUE FOI "CLICADO, CHECKED"
let cards = document.querySelectorAll(".snapCard");
cards.forEach((card) => {
  card.addEventListener("click", (e) => {
    console.log(e.target + " selected");
  });
});


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
      // const snapCard = document.createElement("div");
      const snapCard = document.createElement("input");
      snapCard.type = 'radio'
      snapCard.classList.add("snapCard");
      snapCard.id = `card${i}`
      snapCard.name = "cards"
      snapCard.value = i;
      snapCard.hidden = true;

      const label = document.createElement("label");
      label.htmlFor = `card${i}`;
      label.classList.add("card")
      label.textContent = res[i];

      // const txtLink = document.createElement("a");
      // txtLink.textContent = res[i];
      // snapCard.appendChild(txtLink);
      document.querySelector(".content").appendChild(snapCard);
      document.querySelector(".content").appendChild(label);
    }

    // TODO - NÃO SEI COMO FAZER ISSO NEM OQUE FAZER :(

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


