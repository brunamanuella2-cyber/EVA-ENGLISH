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
}

function proximaFrase() {
  indice++;

  if (indice >= frases.length) {
    indice = 0;
  }

  mostrarFrase();
}

function comecarTreino() {
  document.getElementById("inicio").style.display = "none";
  document.getElementById("treino").style.display = "block";

  mostrarFrase();
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

  fala.rate = 0.85;

  speechSynthesis.cancel();
  speechSynthesis.speak(fala);
}
