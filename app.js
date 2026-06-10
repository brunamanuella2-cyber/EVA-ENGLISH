let frases = JSON.parse(localStorage.getItem("frasesSalvas")) || [
  {
    fase: "fase1",
    verbo: "feel",
    texto: "I feel more confident every day."
  },
  {
    fase: "fase1",
    verbo: "speak",
    texto: "I speak English more naturally now."
  },
  {
    fase: "fase1",
    verbo: "learn",
    texto: "I learn new words very quickly."
  },
  {
    fase: "fase1",
    verbo: "understand",
    texto: "Every day I understand English better."
  },
  {
    fase: "fase1",
    verbo: "enjoy",
    texto: "I enjoy practicing English daily."
  }
];

let indice =
  parseInt(localStorage.getItem("indiceAtual")) || 0;

let movendo = false;
let inicioX = 0;
let atualX = 0;

function textoDaFrase(item) {
  if (typeof item === "string") {
    return item;
  }

  if (item && item.texto) {
    return item.texto;
  }

  return "";
}

function mostrarFrase() {
  document.getElementById("frase").innerText =
    textoDaFrase(frases[indice]);

  document.getElementById("contador").innerText =
    `Frase ${indice + 1} de ${frases.length}`;
  document.getElementById("infoFrase").innerText =
  `${frases[indice].fase} • ${frases[indice].verbo}`;

  localStorage.setItem("indiceAtual", indice);
}

function proximaFrase() {
  indice++;

  if (indice >= frases.length) {
    indice = 0;
  }

  mostrarFrase();
}

function fraseAnterior() {
  indice--;

  if (indice < 0) {
    indice = frases.length - 1;
  }

  mostrarFrase();
}

function comecarTreino() {
  document.getElementById("inicio").style.display = "none";
  document.getElementById("menu").style.display = "none";
  document.getElementById("gerenciador").style.display = "none";
  document.getElementById("treino").style.display = "block";

  mostrarFrase();
}

function atualizarVelocidade() {
  const velocidade =
    document.getElementById("velocidade").value;

  document.getElementById("valorVelocidade").innerText =
    velocidade + "x";
}

function ouvirFrase() {
  const frase =
    textoDaFrase(frases[indice]);

  const fala =
    new SpeechSynthesisUtterance(frase);

  const vozes =
    speechSynthesis.getVoices();

  const vozIngles = vozes.find(voz =>
  voz.lang === "en-US" ||
  voz.lang === "en-GB" ||
  voz.lang.startsWith("en")
);

  if (vozIngles) {
    fala.voice = vozIngles;
    fala.lang = vozIngles.lang;
  } else {
    fala.lang = "en-US";
  }

  const velocidade =
    document.getElementById("velocidade").value;

  fala.rate = velocidade;

  speechSynthesis.cancel();
  speechSynthesis.speak(fala);
}

function reiniciarTreino() {
  indice = 0;

  localStorage.setItem("indiceAtual", indice);

  mostrarFrase();
}

function abrirMenu() {
  document.getElementById("inicio").style.display = "none";
  document.getElementById("treino").style.display = "none";
  document.getElementById("gerenciador").style.display = "none";
  document.getElementById("menu").style.display = "block";
}

function voltarInicio() {
  document.getElementById("menu").style.display = "none";
  document.getElementById("treino").style.display = "none";
  document.getElementById("gerenciador").style.display = "none";
  document.getElementById("inicio").style.display = "block";
}

function abrirGerenciador() {
  document.getElementById("inicio").style.display = "none";
  document.getElementById("menu").style.display = "none";
  document.getElementById("treino").style.display = "none";
  document.getElementById("gerenciador").style.display = "block";
}

function voltarMenu() {
  document.getElementById("inicio").style.display = "none";
  document.getElementById("treino").style.display = "none";
  document.getElementById("gerenciador").style.display = "none";
  document.getElementById("menu").style.display = "block";
}

function voltarMenuDoTreino() {
  document.getElementById("treino").style.display = "none";
  document.getElementById("inicio").style.display = "none";
  document.getElementById("gerenciador").style.display = "none";
  document.getElementById("menu").style.display = "block";
}

function salvarFrases() {
  const texto =
    document.getElementById("entradaFrases").value;

  const novasFrases = texto
    .split("\n")
    .map(linha => {
      const partes = linha.split("|");

      return {
        fase: partes[0]?.trim() || "",
        verbo: partes[1]?.trim() || "",
        texto: partes[2]?.trim() || ""
      };
    })
    .filter(item => item.texto.length > 0);

  if (novasFrases.length === 0) {
    alert("Cole pelo menos uma frase no formato: fase | verbo | frase");
    return;
  }

  frases = novasFrases;
  indice = 0;

  localStorage.setItem("frasesSalvas", JSON.stringify(frases));
  localStorage.setItem("indiceAtual", indice);

  alert(`Salvei ${frases.length} frases.`);

  voltarMenu();
}

const card = document.getElementById("frase");

card.addEventListener("touchstart", (e) => {
  movendo = true;

  inicioX = e.touches[0].clientX;

  card.classList.add("arrastando");
});

card.addEventListener("touchmove", (e) => {
  if (!movendo) return;

  atualX = e.touches[0].clientX - inicioX;

  const subir =
    Math.abs(atualX) * -0.15;

  const girar =
    atualX * 0.04;

  card.style.transform =
    `translate(${atualX}px, ${subir}px) rotate(${girar}deg) scale(0.98)`;

  const opacidade =
    1 - Math.min(Math.abs(atualX) / 300, 0.7);

  card.style.opacity = opacidade;
});

card.addEventListener("touchend", () => {
  movendo = false;

  card.classList.remove("arrastando");

  if (atualX > 120) {
    card.classList.add("saindo-direita");

    setTimeout(() => {
      fraseAnterior();
      resetarCard();
    }, 200);

  } else if (atualX < -120) {
    card.classList.add("saindo-esquerda");

    setTimeout(() => {
      proximaFrase();
      resetarCard();
    }, 200);

  } else {
    resetarCard();
  }
});

function resetarCard() {
  card.style.transform = "";
  card.style.opacity = "";

  card.classList.remove("saindo-direita");
  card.classList.remove("saindo-esquerda");

  atualX = 0;
}
