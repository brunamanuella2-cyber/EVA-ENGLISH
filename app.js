const frases = [
  "I feel more confident every day.",
  "I speak English more naturally now.",
  "I learn new words very quickly.",
  "Every day I understand English better.",
  "I enjoy practicing English daily."
];

let indice = 0;

function mostrarFrase() {
  document.getElementById("frase").innerText = frases[indice];

  document.getElementById("contador").innerText =
    `Frase ${indice + 1} de ${frases.length}`;
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
  const frase = frases[indice];

  const fala = new SpeechSynthesisUtterance(frase);

  const vozes = speechSynthesis.getVoices();

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

const card = document.getElementById("frase");

let movendo = false;
let inicioX = 0;
let atualX = 0;

card.addEventListener("touchstart", (e) => {
  movendo = true;

  inicioX = e.touches[0].clientX;

  card.classList.add("arrastando");
});

card.addEventListener("touchmove", (e) => {
  if (!movendo) return;

  atualX = e.touches[0].clientX - inicioX;

  card.style.transform = `translateX(${atualX}px)`;

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
