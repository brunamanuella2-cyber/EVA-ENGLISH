const frases = [
  "I feel more confident every day.",
  "I speak English more naturally now.",
  "I learn new words very quickly.",
  "Every day I understand English better.",
  "I enjoy practicing English daily."
];

let indice = 0;
let toqueInicioX = 0;
let toqueFimX = 0;

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
  const velocidade = document.getElementById("velocidade").value;
  document.getElementById("valorVelocidade").innerText = velocidade + "x";
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

  const velocidade = document.getElementById("velocidade").value;
  fala.rate = velocidade;

  speechSynthesis.cancel();
  speechSynthesis.speak(fala);
}

document.addEventListener("touchstart", function(event) {
  toqueInicioX = event.changedTouches[0].screenX;
});

document.addEventListener("touchend", function(event) {
  toqueFimX = event.changedTouches[0].screenX;

  if (toqueInicioX - toqueFimX > 50) {
    proximaFrase();
  }

  if (toqueFimX - toqueInicioX > 50) {
    fraseAnterior();
  }
});
