const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
document.body.appendChild(canvas);

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let mouse = { x: canvas.width / 2, y: canvas.height / 2 };
let time = 0;
let isPlaying = false;

// Parámetros ajustables
let params = {
    depth: 3,
    sizeFactor: 0.6,
    colorHue: 200,
    colorSaturation: 50,
    colorLightness: 80,
    playerSize: 20,
};

// Figuras musicales en la cuadrícula
let shapes = [];

// Configurar el contexto de audio
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
let rhythmInterval;

// Generar figuras iniciales
function generateShapes() {
    const cols = Math.max(6, Math.floor(canvas.width / 100)); // Ajustar columnas según el ancho
    const rows = Math.max(6, Math.floor(canvas.height / 100)); // Ajustar filas según el alto
    const cellWidth = canvas.width / cols;
    const cellHeight = canvas.height / rows;

    shapes = [];
    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            const x = i * cellWidth + cellWidth / 2;
            const y = j * cellHeight + cellHeight / 2;
            shapes.push({
                x,
                y,
                size: Math.min(cellWidth, cellHeight) * params.sizeFactor,
                depth: params.depth,
                active: false,
                frequency: 200 + (i + j) * 50,
                angle: Math.random() * Math.PI * 2,
                speed: Math.random() * 0.02 + 0.01,
            });
        }
    }
}

// Dibujar un triángulo dinámico
function drawDynamicTriangle(shape) {
    const { x, y, size, angle, active } = shape;

    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle + time * shape.speed);

    ctx.beginPath();
    for (let i = 0; i < 3; i++) { // Triángulo con 3 lados
        const theta = (Math.PI * 2 / 3) * i;
        const px = Math.cos(theta) * size;
        const py = Math.sin(theta) * size;
        ctx.lineTo(px, py);
    }
    ctx.closePath();

    ctx.fillStyle = active
        ? `hsl(${(params.colorHue + time * 10) % 360}, ${params.colorSaturation}%, ${params.colorLightness}%)`
        : `hsl(${(params.colorHue + time * 5) % 360}, ${params.colorSaturation}%, ${params.colorLightness}%)`;
    ctx.fill();

    ctx.restore();
}

// Dibujar todas las figuras
function drawShapes() {
    shapes.forEach((shape) => {
        const dx = mouse.x - shape.x;
        const dy = mouse.y - shape.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // Activar figura si el jugador pasa cerca
        if (distance < params.playerSize + shape.size / 2) {
            if (!shape.active) {
                playSound(shape.frequency); // Reproducir sonido
                shape.active = true; // Activar figura
            }
        } else {
            shape.active = false; // Desactivar figura
        }

        drawDynamicTriangle(shape);
    });
}

// Reproducir un sonido
function playSound(frequency) {
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(frequency, audioCtx.currentTime);
    gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);

    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    oscillator.start();
    oscillator.stop(audioCtx.currentTime + 0.2);
}

// Reproducir ritmo de fondo
function playRhythm() {
    rhythmInterval = setInterval(() => {
        const kick = audioCtx.createOscillator();
        const gain = audioCtx.createGain();

        kick.type = 'square';
        kick.frequency.setValueAtTime(100, audioCtx.currentTime);
        gain.gain.setValueAtTime(0.2, audioCtx.currentTime);

        kick.connect(gain);
        gain.connect(audioCtx.destination);

        kick.start();
        kick.stop(audioCtx.currentTime + 0.1);
    }, 500);
}

// Dibujar el jugador
function drawPlayer() {
    ctx.beginPath();
    ctx.arc(mouse.x, mouse.y, params.playerSize, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.fill();
}

// Animación principal
function animate() {
    if (!isPlaying) return;

    ctx.fillStyle = `rgba(0, 0, 0, 0.2)`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    drawShapes();
    drawPlayer();

    time += 1;
    requestAnimationFrame(animate);
}

// Eventos para manejar el movimiento en móviles y escritorio
canvas.addEventListener('mousemove', (event) => {
    mouse.x = event.clientX;
    mouse.y = event.clientY;
});

canvas.addEventListener('touchmove', (event) => {
    const touch = event.touches[0];
    mouse.x = touch.clientX;
    mouse.y = touch.clientY;
});

// Ajustar el tamaño del canvas al cambiar el tamaño de la ventana
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    generateShapes();
});

// Iniciar el juego al hacer clic en el botón
document.getElementById('startButton').addEventListener('click', () => {
    document.getElementById('startButton').style.display = 'none';
    isPlaying = true;
    playRhythm();
    generateShapes();
    animate();
});