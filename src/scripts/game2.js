const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
document.body.appendChild(canvas);

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let player = { x: 100, y: canvas.height / 2, size: 20, dy: 0 };
let obstacles = [];
let stars = [];
let moon = null; // Luna o planeta
let isPlaying = false;
let time = 0;
let score = 0;

// Parámetros ajustables
let params = {
    gravity: 0.5,
    jumpStrength: -10,
    obstacleSpeed: 4,
    obstacleFrequency: 120,
    colorHue: 200,
    colorSaturation: 70,
    colorLightness: 50,
    gapSize: 350, // Más espacio entre obstáculos
};

// Precargar sonidos
const backgroundMusic = new Audio('path/to/background-music.mp3'); // Reemplaza con la ruta de tu archivo de música
backgroundMusic.loop = true;

const impactSound = new Audio('path/to/impact-sound.mp3'); // Reemplaza con la ruta de tu archivo de sonido
impactSound.volume = 0.5; // Ajustar volumen

// Frases graciosas con rimas sobre Luca
const funnyPhrases = [
    "Luca saltó y se cayó, ¡qué mala suerte le tocó!",
    "Luca corrió y se tropezó, ¡el suelo lo atrapó!",
    "Luca brincó con gran destreza, pero falló con torpeza.",
    "Luca voló como un campeón, pero chocó con un montón.",
    "Luca gritó: '¡Voy a ganar!', pero el obstáculo lo hizo parar.",
    "Luca soñó con ser el mejor, pero el suelo le dio un dolor.",
    "Luca saltó con gran energía, pero falló con mucha alegría.",
    "Luca corrió como un atleta, pero chocó con una meta.",
    "Luca brincó con valentía, pero perdió con simpatía.",
    "Luca voló como un avión, pero cayó sin precaución.",
    "Luca gritó: '¡Soy invencible!', pero el obstáculo fue terrible.",
    "Luca soñó con la victoria, pero el suelo cambió su historia.",
    "Luca saltó con gran destreza, pero falló con torpeza.",
    "Luca corrió con gran pasión, pero chocó con un tablón.",
    "Luca brincó con valentía, pero perdió con simpatía.",
    "Luca voló como un campeón, pero chocó con un montón.",
    "Luca gritó: '¡Voy a ganar!', pero el obstáculo lo hizo parar.",
    "Luca soñó con ser el mejor, pero el suelo le dio un dolor.",
    "Luca saltó con gran energía, pero falló con mucha alegría.",
    "Luca corrió como un atleta, pero chocó con una meta.",
    "Luca brincó con valentía, pero perdió con simpatía.",
    "Luca voló como un avión, pero cayó sin precaución.",
    "Luca gritó: '¡Soy invencible!', pero el obstáculo fue terrible.",
    "Luca soñó con la victoria, pero el suelo cambió su historia.",
    "Luca saltó con gran destreza, pero falló con torpeza.",
    "Luca corrió con gran pasión, pero chocó con un tablón.",
    "Luca brincó con valentía, pero perdió con simpatía.",
    "Luca voló como un campeón, pero chocó con un montón.",
    "Luca gritó: '¡Voy a ganar!', pero el obstáculo lo hizo parar.",
    "Luca soñó con ser el mejor, pero el suelo le dio un dolor.",
    "Luca saltó con gran energía, pero falló con mucha alegría.",
    "Luca corrió como un atleta, pero chocó con una meta.",
    "Luca brincó con valentía, pero perdió con simpatía.",
    "Luca voló como un avión, pero cayó sin precaución.",
    "Luca gritó: '¡Soy invencible!', pero el obstáculo fue terrible.",
    "Luca soñó con la victoria, pero el suelo cambió su historia.",
    "Luca saltó con gran destreza, pero falló con torpeza.",
    "Luca corrió con gran pasión, pero chocó con un tablón.",
    "Luca brincó con valentía, pero perdió con simpatía.",
    "Luca voló como un campeón, pero chocó con un montón.",
    "Luca gritó: '¡Voy a ganar!', pero el obstáculo lo hizo parar.",
    "Luca soñó con ser el mejor, pero el suelo le dio un dolor.",
    "Luca saltó con gran energía, pero falló con mucha alegría.",
    "Luca corrió como un atleta, pero chocó con una meta.",
    "Luca brincó con valentía, pero perdió con simpatía.",
    "Luca voló como un avión, pero cayó sin precaución.",
    "Luca gritó: '¡Soy invencible!', pero el obstáculo fue terrible.",
    "Luca soñó con la victoria, pero el suelo cambió su historia.",
];

// Mostrar frase graciosa al perder
function showRandomPhrase() {
    const randomPhrase = funnyPhrases[Math.floor(Math.random() * funnyPhrases.length)];
    alert(randomPhrase);
}

// El resto del código es igual al juego original
// Generar estrellas, luna, obstáculos, y manejar la lógica del juego
// ...