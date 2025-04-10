const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
document.body.appendChild(canvas);

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let player = { x: 100, y: canvas.height / 2, size: 20, dy: 0 };
let obstacles = [];
let isPlaying = false;
let time = 0;
let score = 0;

// Parámetros ajustables
let params = {
    gravity: 0.5,
    jumpStrength: -10,
    obstacleSpeed: 5,
    obstacleFrequency: 90,
    colorHue: 200,
    colorSaturation: 50,
    colorLightness: 80,
};

// Dibujar el jugador
function drawPlayer() {
    ctx.beginPath();
    ctx.arc(player.x, player.y, player.size, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.fill();
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
        const gap = 150;
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
            alert(`Game Over! Your score: ${score}`);
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
    isPlaying = false;
    document.getElementById('startButton').style.display = 'block';
}

// Animación principal
function animate() {
    if (!isPlaying) return;

    ctx.fillStyle = `rgba(0, 0, 0, 0.2)`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Dibujar y actualizar elementos
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