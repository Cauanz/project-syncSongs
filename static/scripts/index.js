

// TODO - TERMINAR ISSO DEPOIS, BOTÃO DE VOLTAR
// let previousPageBtn = document.querySelector("#back")
// previousPageBtn.addEventListener('click', (e) => {
//   const form = document.querySelector('#folderForm');
//   const table = document.querySelector("#table");

//   form.style.display = 'flex';
//   table.style.display = "None";
// })

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

    // TODO - MODIFICAR ISSO PARA BATER COM O OBJETO QUE É ENVIADO AGORA
    //* FORMATO DE CADA SNAPSHOT: [{'pathname': 'musicas2', 'snapshot': '2025-12-08T10-53-16.148230.json'}...]
    // TODO - LEMBRAR QUE SÓ EXIBIREMOS OS SNAPSHOTS ONDE A PASTAS/PATHNAME FOR O MESMO QUE A PASTA QUE FOI "UPLOADED"

    for (let i = 0; i < res.length; i++) {

      // if(res)




      let split = res[i].snapshot.split("T");
      const date = new Date(
        split[0] +
          "T" +
          split[1].snapshot.replaceAll("-", ":").replace(".json", "")
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

// TODO - TERMINAR AGORA, E VER SE ENVIA TUDO, ADICIONAR VERIFICAÇÕES QUE TODOS TEM QUE SER SELECIONADOS ETC...
// * CAPTURA O INPUT OCULTO PARA ENVIAR O SNAPSHOT SELECIONADO JUNTO
// document.querySelector("#folderForm").addEventListener("submit", function (e) {
//   let hidden = document.querySelector("#selectsnapshot");
//   hidden.value = selectedSnapshot;
// });




// document.getElementById('folderForm').addEventListener('submit', (e) => {
//   e.preventDefault();
//   console.log(e.target);
//   const formData = new FormData(e.target);

//   try {
//     fetch('/check-folder', {
//       method: 'POST',
//       body: formData
//     })
//     .then(response => response.json())
//     .then(data => {
//       console.log("Success!")
//     })
//   } catch (error) {
//     console.log(error)
//   }
// })


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