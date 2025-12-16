

const state = {
  selectedFolder: null,
  selectedSnapshot: null,
};

let uploadInput = document.querySelector("#selectfolder");
let filesText = document.querySelector(".files");
let uploadBtn = document.querySelector("#submitBtn")
let snapListenerAdded = false;

//* FUNÇÃO QUE É CHAMADA PARA REQUISITAR SNAPSHOTS E CRIAR CARDS/RENDERIZAR ELES
async function getSnapshots() {

  if(!state.selectedFolder) {
    alert("Voce deve selecionar uma pasta primeiro")
    return;
  }

  const folderPath = state.selectedFolder[0].webkitRelativePath.split("/")[0]
  const path = await fetch("/choose-snapshot", {
    method: "POST",
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ folderPath })
  });


  const snaps = await fetch("/choose-snapshot", {
    method: 'GET'
  })
  const res = await snaps.json();

  if(res) {
    document.querySelector(".formsContainer").style.display = "None";

    const cardsContainer = document.createElement("div");
    cardsContainer.classList.add("cardsContainer");
    //* FORMATO DE CADA SNAPSHOT: [{'pathname': 'musicas2', 'snapshot': '2025-12-08T10-53-16.148230.json'}...]

    for (let i = 0; i < res.length; i++) {
      let split = res[i].snapshot.split("T");
      const date = new Date(
        split[0] +
          "T" +
          split[1].replaceAll("-", ":").replace(".json", "")
      );
      const formatted = date.toLocaleString();

      const snapCard = document.createElement("input");
      snapCard.type = "radio";
      snapCard.classList.add("snapCard");
      snapCard.id = `card${i}`;
      snapCard.name = "cards";
      snapCard.value = res[i].snapshot.replace(".json", "");
      snapCard.hidden = true;

      const label = document.createElement("label");
      label.htmlFor = `card${i}`;
      label.classList.add("card");
      label.textContent = formatted;

      cardsContainer.appendChild(snapCard);
      cardsContainer.appendChild(label);
      document.querySelector(".content").appendChild(cardsContainer);
    }

    const btn = document.createElement("input");
    btn.type = "button";
    btn.value = "Selecionar";
    btn.id = "SelectSnapBtn";
    btn.onclick = selectSnap();
    cardsContainer.appendChild(btn);

    // TODO - NÃO SEI COMO FAZER ISSO NEM OQUE FAZER :(
  }

}

// TODO - CONTINUAR FUNCIONALIDADE DE QUANDO SALVAR SNAPSHOT E AS OPÇÕES NA TABELA NAS MÚSICAS DUPLICADAS

//* FUNÇÃO QUE É CHAMADA QUANDO O BOTÃO DE SELECIONAR SNAPSHOT É PRESSIONADO, ADICIONANDO O VALOR/INDEX DO SNAP A VARIAVEL/STATE SELECTEDSNAPSHOT
function selectSnap() {
  const content = document.querySelector(".content");
  state.selectedSnapshot = "";
  
  if (snapListenerAdded) return; // EVITAR CRIAR OUTRO LISTENER NO CONTENT
  
  content.addEventListener("click", (e) => {
    snapListenerAdded = true;

    const cards = document.querySelectorAll(".snapCard");
    const selectBtn = e.target.matches("#SelectSnapBtn");
    const hiddenInput = document.querySelector("#selectsnapshot");
    const cardsContainer = document.querySelector(".cardsContainer");
    
    if (selectBtn){
      cards.forEach((card) => {
        if(card.checked) {
          state.selectedSnapshot = card.value;
          hiddenInput.value = card.value

          if(cardsContainer) cardsContainer.remove();
          document.querySelector(".formsContainer").style.display = "Flex";
        }
      });
      return;
    }
  });
}

uploadInput.addEventListener("change", (e) => {
  files = e.target.files;
  filesText.textContent = files.length + " files found";
  state.selectedFolder = files;
});

function updateUploadBtn() {
  const ready = state.selectedFolder !== null && state.selectedSnapshot !== null;
  uploadBtn.disabled = !ready;
}

document.addEventListener("change", (e) => {
  if (e.target.matches("#selectfolder")) {
    updateUploadBtn();
    document.querySelector("#selectfolderLabel").style.borderColor = "green";
    state.selectedFolder = document.querySelector("#selectfolder").files
  }
})

document.addEventListener("click", (e) => {
  if (e.target.matches("#SelectSnapBtn")) {
    updateUploadBtn();
    document.querySelector("#snapshotInputLabel").style.borderColor = "green";
  }
});


function removeSong(path) {

  console.log(path)
  console.log("Removido!")
}


async function gimmeData() {
  
  const req = await fetch("/gimme")
  .then(res => res.json())
  .then(data => console.log(data))

}
