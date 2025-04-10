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

    "Luca en el Balmes siempre brilló, ¡en San Vicente aún más se lució!",
    "Con la pala de ping-pong es un campeón, ¡en voley también causa sensación!",
    "Luca en la ciudad se siente genial, pero en la montaña se pone fatal.",
    "Su padre Paco lo quiere llevar al monte, pero Luca prefiere un horizonte.",
    "Con los abuelos Paco y Chelo, Luca siempre está en el cielo.",
    "Julia y Alberto lo ven jugar, ¡en ping-pong nadie lo puede parar!",
    "Luca en el voley es un crack total, ¡su saque es siempre fenomenal!",
    "Cuando su padre lo lleva a caminar, Luca dice: '¡Prefiero la ciudad para pasear!'",
    "En el instituto San Vicente es el mejor, ¡en clase y en deportes causa furor!",
    "Luca en el Balmes dejó su huella, ¡en San Vicente sigue siendo una estrella!",
    "Con la pala de ping-pong es imbatible, ¡su estilo es único e increíble!",
    "En voleybol Luca es un as, ¡su equipo siempre lo quiere detrás!",
    "Cuando Paco dice: 'Vamos al monte', Luca responde: '¡Mejor al horizonte!'",
    "Con los abuelos Paco y Chelo, Luca siempre encuentra consuelo.",
    "Julia y Alberto lo ven triunfar, ¡en ping-pong y voley no deja de ganar!",
    "Luca en la ciudad es un rey total, ¡en la montaña no lo pasa tan genial!",
    "En ping-pong y voleybol es un crack, ¡nadie puede seguirle el compás!",
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

// Dibujar el menú de inicio con "LUCA" en pixel art
function drawMenu() {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Dibujar estrellas de fondo
    drawStars();

    // Dibujar "LUCA" en pixel art
    ctx.fillStyle = 'cyan';
    ctx.font = '100px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('LUCA', canvas.width / 2, canvas.height / 2 - 50);

    ctx.fillStyle = 'magenta';
    ctx.font = '30px Arial';
    ctx.fillText('¡Haz clic en el botón para empezar!', canvas.width / 2, canvas.height / 2 + 50);
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

// Dibujar obstáculos
function drawObstacles() {
    obstacles.forEach((obstacle) => {
        ctx.fillStyle = `hsl(${(params.colorHue + time * 5) % 360}, ${params.colorSaturation}%, ${params.colorLightness}%)`;
        ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
    });
}

// Generar obstáculos
function generateObstacles() {
    if (time % params.obstacleFrequency === 0) {
        const height = Math.random() * (canvas.height / 2);
        const gap = params.gapSize; // Usar el tamaño del agujero ajustado
        obstacles.push({
            x: canvas.width,
            y: 0,
            width: 30,
            height: height,
        });
        obstacles.push({
            x: canvas.width,
            y: height + gap,
            width: 30,
            height: canvas.height - height - gap,
        });
    }
}

// Actualizar obstáculos
function updateObstacles() {
    obstacles.forEach((obstacle) => {
        obstacle.x -= params.obstacleSpeed;
    });
    obstacles = obstacles.filter((obstacle) => obstacle.x + obstacle.width > 0);
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

// Incrementar dificultad
function increaseDifficulty() {
    if (time % 500 === 0) { // Cada 500 frames
        params.obstacleSpeed += 0.5; // Aumentar velocidad de los obstáculos
        params.obstacleFrequency = Math.max(60, params.obstacleFrequency - 5); // Reducir frecuencia mínima
        params.gapSize = Math.max(200, params.gapSize - 10); // Reducir tamaño del agujero
    }
}

// Reiniciar el juego
function resetGame() {
    player.y = canvas.height / 2;
    player.dy = 0;
    obstacles = [];
    time = 0;
    score = 0;
    params.obstacleSpeed = 4; // Reiniciar velocidad
    params.obstacleFrequency = 120; // Reiniciar frecuencia
    params.gapSize = 350; // Reiniciar tamaño del agujero
    isPlaying = false;
    document.getElementById('startButton').style.display = 'block';
    drawMenu();
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
    drawObstacles();
    generateObstacles();
    updateObstacles();

    // Aplicar gravedad y movimiento
    player.dy += params.gravity;
    player.y += player.dy;

    // Evitar que el jugador salga de los límites
    if (player.y + player.size > canvas.height) {
        player.y = canvas.height - player.size;
        player.dy = 0;
    }
    if (player.y - player.size < 0) {
        player.y = player.size;
        player.dy = 0;
    }

    // Detectar colisiones
    detectCollisions();

    // Incrementar tiempo, puntaje y dificultad
    time++;
    score++;
    increaseDifficulty();

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
    drawMenu();
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
drawMenu();