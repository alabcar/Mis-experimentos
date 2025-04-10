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
];

// Mostrar frase graciosa al perder
function showRandomPhrase() {
    const randomPhrase = funnyPhrases[Math.floor(Math.random() * funnyPhrases.length)];
    alert(randomPhrase);
}

// Generar estrellas
function generateStars() {
    for (let i = 0; i < 300; i++) { // Más estrellas
        stars.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 2 + 1,
            speed: Math.random() * 0.5 + 0.2,
        });
    }
}

// Dibujar estrellas
function drawStars() {
    stars.forEach((star) => {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();

        // Mover las estrellas
        star.x -= star.speed;
        if (star.x < 0) {
            star.x = canvas.width;
            star.y = Math.random() * canvas.height;
        }
    });
}

// Generar luna o planeta
function generateMoon() {
    moon = {
        x: canvas.width,
        y: Math.random() * (canvas.height / 2),
        size: Math.random() * 50 + 50,
        speed: Math.random() * 0.5 + 0.1,
    };
}

// Dibujar luna o planeta
function drawMoon() {
    if (moon) {
        ctx.fillStyle = 'rgba(255, 223, 0, 0.2)'; // Amarillo tenue
        ctx.beginPath();
        ctx.arc(moon.x, moon.y, moon.size, 0, Math.PI * 2);
        ctx.fill();

        // Mover la luna
        moon.x -= moon.speed;
        if (moon.x + moon.size < 0) {
            generateMoon(); // Generar una nueva luna cuando salga de la pantalla
        }
    }
}

// Dibujar el jugador
function drawPlayer() {
    ctx.beginPath();
    ctx.arc(player.x, player.y, player.size, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(0, 255, 255, 0.8)'; // Color ciberpunk
    ctx.fill();
    ctx.closePath();
}

// Detectar colisiones
function detectCollisions() {
    for (let obstacle of obstacles) {
        if (
            player.x + player.size > obstacle.x &&
            player.x - player.size < obstacle.x + obstacle.width &&
            player.y + player.size > obstacle.y &&
            player.y - player.size < obstacle.y + obstacle.height
        ) {
            isPlaying = false;
            showRandomPhrase(); // Mostrar frase graciosa
            resetGame();
            break;
        }
    }
}

// Reiniciar el juego
function resetGame() {
    player.y = canvas.height / 2;
    player.dy = 0;
    obstacles = [];
    time = 0;
    score = 0;
    document.getElementById('startButton').style.display = 'block';
}

// Animación principal
function animate() {
    if (!isPlaying) return;

    ctx.fillStyle = 'black'; // Fondo negro
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Dibujar y actualizar elementos
    drawStars();
    drawMoon();
    drawPlayer();

    // Incrementar tiempo y puntaje
    time++;
    score++;

    // Mostrar puntaje
    ctx.fillStyle = 'white';
    ctx.font = '20px Arial';
    ctx.fillText(`Score: ${score}`, 10, 30);

    requestAnimationFrame(animate);
}

// Manejar salto del jugador
canvas.addEventListener('click', () => {
    if (isPlaying) {
        player.dy = params.jumpStrength;
    }
});

// Ajustar el tamaño del canvas al cambiar el tamaño de la ventana
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

// Iniciar el juego al hacer clic en el botón
document.getElementById('startButton').addEventListener('click', () => {
    document.getElementById('startButton').style.display = 'none';
    isPlaying = true;
    animate();
});

// Generar estrellas y luna al inicio
generateStars();
generateMoon();