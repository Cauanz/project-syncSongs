

// TODO - TERMINAR ISSO DEPOIS, BOTÃO DE VOLTAR
// let previousPageBtn = document.querySelector("#back")
// previousPageBtn.addEventListener('click', (e) => {
//   const form = document.querySelector('#folderForm');
//   const table = document.querySelector("#table");

//   form.style.display = 'flex';
//   table.style.display = "None";
// })

let state = {
  selectedFolder: null,
  selectedSnapshot: null,
};

let uploadInput = document.querySelector("#selectfolder");
let filesText = document.querySelector(".files");
let uploadBtn = document.querySelector("#submitBtn").disabled = true;
let snapListenerAdded = false;

//* FUNÇÃO QUE É CHAMADA PARA REQUISITAR SNAPSHOTS E CRIAR CARDS/RENDERIZAR ELES
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
    
    if (selectBtn){
      cards.forEach((card) => {
        if(card.checked) {
          state.selectedSnapshot = card.value;

          const cardsContainer = document.querySelector(".cardsContainer");
          if(cardsContainer) cardsContainer.remove();
          document.querySelector(".formsContainer").style.display = "Flex";

          if (state.selectedFolder && state.selectedSnapshot) {
            uploadBtn.disabled = false;
          }
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



// TODO - EU NÃO COLOQUEI UMA FORMA DE ADICIONAR OS ARQUIVOS/PASTA A VARIAVEL SELECTEDFOLDER. EM CONSEQUENCIA É POR ISSO QUE O BOTÃO NUNCA DESBLOQUEIA
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
    console.log(state.selectedFolder);
    console.log("clicado");
  }
})

document.addEventListener("click", (e) => {
  if (e.target.matches("#SelectSnapBtn")) {
    updateUploadBtn();
    console.log(state.selectedSnapshot);
    console.log("mudados");
  }
});