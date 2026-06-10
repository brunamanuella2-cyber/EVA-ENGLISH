let frases = JSON.parse(localStorage.getItem("frasesSalvas")) || [
  { fase: "fase1", verbo: "be", texto: "I am becoming more confident every day." },
  { fase: "fase1", verbo: "get", texto: "I got home earlier today." },
  { fase: "fase1", verbo: "think", texto: "We will think about it tomorrow." },

  { fase: "fase2", verbo: "get", texto: "I’m getting over my fear of speaking English." },
  { fase: "fase2", verbo: "be", texto: "She is being more patient with herself lately." },
  { fase: "fase2", verbo: "think", texto: "What do you think about trying a different approach?" },

  { fase: "fase3", verbo: "be", texto: "The more present I am, the easier it becomes to think in English." },
  { fase: "fase3", verbo: "get", texto: "I’ve gotten much better at expressing complex ideas." },
  { fase: "fase3", verbo: "think", texto: "I often think about how language shapes the way we see the world." },

  { fase: "fase4", verbo: "expression", texto: "No worries, everything will work out fine." }
];
const verbosBase = [
  "be", "have", "do", "say", "go", "get", "make", "know", "think", "take",
  "see", "come", "want", "look", "use", "find", "give", "tell", "work", "call",
  "try", "ask", "need", "feel", "become", "leave", "put", "mean", "keep", "let",
  "begin", "seem", "help", "talk", "turn", "start", "show", "hear", "play", "run",
  "move", "like", "live", "believe", "hold", "bring", "happen", "write", "provide", "sit",
  "stand", "lose", "pay", "meet", "include", "continue", "set", "learn", "change", "lead",
  "understand", "watch", "follow", "stop", "create", "speak", "read", "allow", "add", "spend",
  "grow", "open", "walk", "win", "offer", "remember", "love", "consider", "appear", "buy",
  "wait", "serve", "die", "send", "expect", "build", "stay", "fall", "cut", "reach",
  "kill", "remain", "suggest", "raise", "pass", "sell", "require", "report", "decide", "pull"
];
let frasesTreino = [...frases];
let indice = parseInt(localStorage.getItem("indiceAtual")) || 0;

let movendo = false;
let inicioX = 0;
let atualX = 0;

function textoDaFrase(item) {
  if (typeof item === "string") return item;
  if (item && item.texto) return item.texto;
  return "";
}

function mostrarFrase() {
  if (!frasesTreino.length) return;

  document.getElementById("frase").innerText =
    textoDaFrase(frasesTreino[indice]);

  document.getElementById("contador").innerText =
    `Frase ${indice + 1} de ${frasesTreino.length}`;

  document.getElementById("infoFrase").innerText =
    `${frasesTreino[indice].fase || ""} • ${frasesTreino[indice].verbo || ""}`;

  localStorage.setItem("indiceAtual", indice);
}

function proximaFrase() {
  indice++;
  if (indice >= frasesTreino.length) indice = 0;
  mostrarFrase();
}

function fraseAnterior() {
  indice--;
  if (indice < 0) indice = frasesTreino.length - 1;
  mostrarFrase();
}

function comecarTreino() {
  frasesTreino = [...frases];

  document.getElementById("inicio").style.display = "none";
  document.getElementById("menu").style.display = "none";
  document.getElementById("fases").style.display = "none";
  document.getElementById("verbos").style.display = "none";
  document.getElementById("gerenciador").style.display = "none";
  document.getElementById("treino").style.display = "block";

  if (indice >= frasesTreino.length) indice = 0;

  mostrarFrase();
}

function ouvirFrase() {
  const frase = textoDaFrase(frasesTreino[indice]);
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

  fala.rate = document.getElementById("velocidade").value;

  speechSynthesis.cancel();
  speechSynthesis.speak(fala);
}

function atualizarVelocidade() {
  const velocidade = document.getElementById("velocidade").value;
  document.getElementById("valorVelocidade").innerText = velocidade + "x";
}

function reiniciarTreino() {
  indice = 0;
  localStorage.setItem("indiceAtual", indice);
  mostrarFrase();
}

function abrirMenu() {
  document.getElementById("inicio").style.display = "none";
  document.getElementById("treino").style.display = "none";
  document.getElementById("fases").style.display = "none";
  document.getElementById("verbos").style.display = "none";
  document.getElementById("gerenciador").style.display = "none";
  document.getElementById("menu").style.display = "block";
}

function voltarInicio() {
  document.getElementById("menu").style.display = "none";
  document.getElementById("inicio").style.display = "block";
}

function voltarMenuDoTreino() {
  document.getElementById("treino").style.display = "none";
  document.getElementById("menu").style.display = "block";
}

function abrirFases() {
  document.getElementById("menu").style.display = "none";
  document.getElementById("fases").style.display = "block";
}

function voltarMenuDasFases() {
  document.getElementById("fases").style.display = "none";
  document.getElementById("menu").style.display = "block";
}

function abrirVerbos() {
  document.getElementById("menu").style.display = "none";
  document.getElementById("verbos").style.display = "block";

  atualizarListaVerbos();
}

function voltarMenuDosVerbos() {
  document.getElementById("verbos").style.display = "none";
  document.getElementById("menu").style.display = "block";
}

function abrirGerenciador() {
  document.getElementById("menu").style.display = "none";
  document.getElementById("gerenciador").style.display = "block";
}

function voltarMenu() {
  document.getElementById("gerenciador").style.display = "none";
  document.getElementById("menu").style.display = "block";
}

function salvarFrases() {
  const texto = document.getElementById("entradaFrases").value;

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
    alert("Cole frases no formato: fase | verbo | frase");
    return;
  }

  frases = novasFrases;
  frasesTreino = [...frases];
  indice = 0;

  localStorage.setItem("frasesSalvas", JSON.stringify(frases));
  localStorage.setItem("indiceAtual", indice);

  alert(`Salvei ${frases.length} frases.`);
  voltarMenu();
}

function treinarFase(faseEscolhida) {
  frasesTreino = frases.filter(item => {
    const faseItem = (item.fase || "")
      .toLowerCase()
      .replace(/\s/g, "");

    return faseItem === faseEscolhida;
  });

  if (frasesTreino.length === 0) {
    alert("Ainda não existem frases nessa fase.");
    return;
  }

  indice = 0;

  document.getElementById("fases").style.display = "none";
  document.getElementById("treino").style.display = "block";

  mostrarFrase();
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

  const subir = Math.abs(atualX) * -0.15;
  const girar = atualX * 0.04;

  card.style.transform =
    `translate(${atualX}px, ${subir}px) rotate(${girar}deg) scale(0.98)`;

  card.style.opacity =
    1 - Math.min(Math.abs(atualX) / 300, 0.7);
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
function atualizarListaVerbos() {

  const lista =
    document.getElementById("listaVerbos");

  lista.innerHTML = "";

  const verbosUnicos =
    [...new Set(frases.map(item => item.verbo))]
      .sort();

  verbosUnicos.forEach(verbo => {

    const botao =
      document.createElement("button");

    botao.innerText =
      verbo.toUpperCase();

    botao.onclick = () =>
      treinarVerbo(verbo);

    lista.appendChild(botao);

  });

}
