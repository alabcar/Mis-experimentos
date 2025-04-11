const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
document.body.appendChild(canvas);

// Configurar el tamaño inicial del canvas con un ancho mínimo
const minWidth = 600; // Ancho mínimo en píxeles
canvas.width = Math.max(window.innerWidth, minWidth);
canvas.height = window.innerHeight;

let player = { x: 100, y: canvas.height / 2, size: 20, dy: 0 };
let obstacles = [];
let stars = [];
let moon = null; // Luna o planeta
let isPlaying = false;
let time = 0;
let score = 0;

// Almacenar los puntajes
let highScores = [];

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
const funnyPhrases =[
    "Luca saltó tan alto que ahora vive en Marte.",
    "El ping-pong no es deporte, es arte moderno.",
    "Obstáculo 1, Luca 0. Fin.",
    "Luca quiso volar, pero olvidó las alas.",
    "El Wi-Fi no llegó al monte y Luca tampoco.",
    "La luna te miró y dijo: '¿En serio?'",
    "Luca esquivó todo, menos sus deberes.",
    "El balón pidió un autógrafo. Luca se negó.",
    "¿Montaña? Mejor pizza.",
    "El botón 'ganar' está roto, lo siento.",
    "El obstáculo dice: 'Gracias por chocar.'",
    "Luca saltó, y el suelo dijo: 'Hola de nuevo.'",
    "La gravedad ganó esta vez. Inténtalo luego.",
    "Luca persiguió un sueño, pero era lunes.",
    "Tu puntuación: 0, tu esfuerzo: infinito.",
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
    "Cuando su padre lo lleva a caminar, Luca dice: '¡Prefiero Netflix y descansar!'",
    "En el instituto San Vicente es brillante, ¡Luca siempre es el más elegante!",
    "En el Balmes dejó su marca, ¡en San Vicente su talento no se aparca!",
    "Con la pala de ping-pong es un artista, ¡su saque es digno de un especialista!",
    "En voleybol Luca es un titán, ¡su equipo siempre lo quiere en el plan!",
    "Cuando Paco dice: 'Vamos al monte', Luca responde: '¡Mejor un café en el puente!'",
    "Con los abuelos Paco y Chelo, Luca siempre encuentra un buen duelo (de risas).",
    "Julia y Alberto lo ven jugar, ¡y siempre lo animan sin parar!",
    "Luca en la ciudad es un urbanita, ¡en la montaña se pone malita!",
    "En ping-pong y voleybol es un crack, ¡su estilo siempre deja a todos atrás!",
    "Cuando su padre lo lleva a escalar, Luca dice: '¡Prefiero la ciudad para estar!'",
    "En el instituto San Vicente es genial, ¡Luca siempre destaca en lo social!",
    "En el Balmes dejó su legado, ¡en San Vicente sigue siendo admirado!",
    // Nuevas frases añadidas
    "Luca con Esther siempre se ríe, ¡aunque a veces la paciencia se le vacía!",
    "Con su tía María juega sin parar, ¡en voleybol nadie lo puede alcanzar!",
    "Lalita y Nonno lo ven triunfar, ¡en ping-pong siempre lo quieren animar!",
    "Luca en la ciudad es un gran urbanita, ¡con Esther y María siempre dinamita!",
    "Nonno le dice: '¡Eres un campeón!', y Lalita lo anima con gran emoción.",
    "Con Esther y María siempre hay alegría, ¡Luca brilla como estrella todo el día!",
    "Lalita le dice: '¡Qué gran jugador!', y Nonno lo aplaude con todo su amor.",
    "Luca en el voley es un gran titán, ¡con Esther y María siempre en su plan!",
    "Cuando Lalita lo ve jugar, dice: '¡Luca, nadie te puede parar!'",
    "Nonno le grita: '¡Eres el mejor!', mientras Luca juega con gran fervor.",
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


// Dibujar el menú de inicio con "¡Vamos, Luca!", una frase aleatoria y el ranking
function drawMenu() {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Dibujar estrellas de fondo
    drawStars();

    // Estilizar el botón con colores llamativos
    const button = document.getElementById('startButton');
    button.style.backgroundColor = '#00ffcc'; // Fondo cian brillante
    button.style.color = '#000000'; // Texto negro
    button.style.border = '2px solid #ffffff'; // Borde blanco
    button.style.fontSize = '24px'; // Tamaño de fuente más grande
    button.style.padding = '15px 30px'; // Más espacio en el botón
    button.style.borderRadius = '10px'; // Bordes redondeados
    button.style.boxShadow = '0px 0px 15px #00ffcc'; // Efecto de brillo

    // Ajustar la posición del botón
    button.style.position = 'absolute';
    button.style.top = `${canvas.height / 2 - 50}px`; // Centrar verticalmente
    button.style.left = '50%';
    button.style.transform = 'translate(-50%, -50%)';

    // Dibujar el ranking de puntos debajo del botón
    ctx.fillStyle = 'white';
    ctx.font = '20px Arial';
    ctx.textAlign = 'center';
    const rankingStartY = canvas.height / 2 + 80; // Asegurar que el ranking esté separado del botón
    ctx.fillText('Ranking de Puntos:', canvas.width / 2, rankingStartY);

    highScores.slice(0, 5).forEach((score, index) => {
        ctx.fillText(`${index + 1}. ${score} puntos`, canvas.width / 2, rankingStartY + 30 + index * 30);
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
    if (time % 300 === 0) { // Cada 300 frames
        params.obstacleSpeed += 0.6; // Aumentar velocidad de los obstáculos de forma constante
        params.obstacleFrequency = Math.max(40, params.obstacleFrequency - 7); // Reducir frecuencia mínima más rápido
        params.gapSize = Math.max(120, params.gapSize - 12); // Reducir tamaño del agujero de forma progresiva

        // Aumentar la velocidad de la luna de manera gradual y realista
        if (moon) {
            moon.speed += 0.07; // Incremento más notable para que parezca que acelera
        }
    }

    // Aumentar la gravedad ligeramente para hacerlo más desafiante
    if (time % 800 === 0) { // Cada 800 frames
        params.gravity = Math.min(2, params.gravity + 0.1); // Limitar la gravedad máxima
    }

    // Cambiar el color de los obstáculos para dar sensación de progreso
    if (time % 1000 === 0) { // Cada 1000 frames
        params.colorHue = (params.colorHue + 50) % 360; // Cambiar el tono del color
    }
}
// Reiniciar el juego
// Reiniciar el juego
function resetGame() {
    // Guardar el puntaje actual en el ranking
    if (score > 0) {
        highScores.push(score);
        highScores.sort((a, b) => b - a); // Ordenar de mayor a menor
    }

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
// Mostrar puntaje
function drawScore() {
    ctx.fillStyle = 'white'; // Color del texto
    ctx.font = '30px Arial'; // Fuente más grande y clara
    ctx.textAlign = 'center'; // Centrar el texto
    ctx.fillText(`Puntos: ${score}`, canvas.width / 2, 50); // Mostrar en la parte superior central
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
    drawScore();

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
    const minWidth = 600; // Ancho mínimo en píxeles
    canvas.width = Math.max(window.innerWidth, minWidth);
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