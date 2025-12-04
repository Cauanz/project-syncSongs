

// TODO - TERMINAR ISSO DEPOIS, BOTÃO DE VOLTAR
// let previousPageBtn = document.querySelector("#back")
// previousPageBtn.addEventListener('click', (e) => {
//   const form = document.querySelector('#folderForm');
//   const table = document.querySelector("#table");

//   form.style.display = 'flex';
//   table.style.display = "None";
// })

let selectedFolder = [];
let selectedSnapshot = "";

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
      let split = res[i].split('T')
      const date = new Date(
        split[0] + "T" + split[1].replaceAll("-", ":").replace(".json", "")
      );
      const formatted = date.toLocaleString();

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
      label.textContent = formatted;
      
      cardsContainer.appendChild(snapCard);
      cardsContainer.appendChild(label);
      document.querySelector(".content").appendChild(cardsContainer);
    }

    const btn = document.createElement('input');
    btn.type = 'button';
    btn.value = 'Selecionar'
    btn.id = "SelectSnapBtn";
    cardsContainer.appendChild(btn);
    
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


// * - NÃO CONSEGUI PEGAR O INPUT, ENTÃO ESTOU PEGANDO PELO DOCUMENTO
document.addEventListener('change', (e) => {
  if(e.target.name === 'cards'){

    const selectSnap = document.querySelector("#SelectSnapBtn");
    selectSnap.addEventListener("click", () => {
      //TODO - ADICIONAR VERIFICAÇÕES, ETC...
      selectedSnapshot = e.target.value;

      document.querySelector(".cardsContainer").style.display = "None";
      document.querySelector(".formsContainer").style.display = "Flex";
    })
    
  }
})

// TODO - TERMINAR AGORA, E VER SE ENVIA TUDO, ADICIONAR VERIFICAÇÕES QUE TODOS TEM QUE SER SELECIONADOS ETC...
// * CRIA UM INPUT OCULTO PARA ENVIAR O SNAPSHOT SELECIONADO JUNTO
document.querySelector("#folderForm").addEventListener("submit", function (e) {
  let hidden = document.querySelector("input[name='snapshot']");
  if (!hidden) {
    hidden = document.createElement("input");
    hidden.type = "hidden";
    hidden.name = "snapshot";
    this.appendChild(hidden);
  }
  hidden.value = selectedSnapshot;
});