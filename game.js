// Connect to Phantom Wallet
document.getElementById('connectButton').addEventListener('click', async () => {
    if (window.solana && window.solana.isPhantom) {
        try {
            const response = await window.solana.connect();
            document.getElementById('walletAddress').innerText = `Connected wallet: ${response.publicKey.toString()}`;
            document.getElementById('controls').style.display = 'block';
        } catch (err) {
            console.error('Connection to Phantom wallet failed:', err);
        }
    } else {
        alert('Please install the Phantom wallet extension.');
    }
});

// Deposit Slider
const depositSlider = document.getElementById('depositSlider');
const depositAmount = document.getElementById('depositAmount');
depositSlider.addEventListener('input', () => {
    depositAmount.innerText = `${depositSlider.value} SOL`;
});

// Flappy Bird Game
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const GRAVITY = 0.6;
const FLAP = -12;
const BIRD_WIDTH = 34;
const BIRD_HEIGHT = 24;
const PIPE_WIDTH = 50;
const PIPE_SPACING = 200;
const PIPE_SPEED = 2;
const PROFITABILITY_POINT = 25;

let bird = { x: 50, y: canvas.height / 2, velocity: 0 };
let pipes = [];
let frame = 0;
let score = 0;
let gameOver = false;

document.getElementById('playButton').addEventListener('click', () => {
    if (window.solana && window.solana.isPhantom) {
        // Start the game
        bird = { x: 50, y: canvas.height / 2, velocity: 0 };
        pipes = [];
        frame = 0;
        score = 0;
        gameOver = false;
        requestAnimationFrame(updateGame);
    } else {
        alert('Please connect to Phantom wallet first.');
    }
});

function drawBird() {
    ctx.fillStyle = '#FFD700';
    ctx.fillRect(bird.x, bird.y, BIRD_WIDTH, BIRD_HEIGHT);
}

function drawPipes() {
    ctx.fillStyle = '#008000';
    pipes.forEach(pipe => {
        ctx.fillRect(pipe.x, 0, PIPE_WIDTH, pipe.top);
        ctx.fillRect(pipe.x, canvas.height - pipe.bottom, PIPE_WIDTH, pipe.bottom);
    });
}

function drawScore() {
    ctx.fillStyle = '#000';
    ctx.font = '24px Arial';
    ctx.fillText(`Score: ${score}`, 10, 30);
}

function updateGame() {
    if (gameOver) {
        ctx.fillText('Game Over!', canvas.width / 2 - 50, canvas.height / 2);
        return;
    }
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Update bird position
    bird.velocity += GRAVITY;
    bird.y += bird.velocity;
    
    if (bird.y + BIRD_HEIGHT > canvas.height || bird.y < 0) {
        gameOver = true;
    }

    // Update pipes
    if (frame % 90 === 0) {
        let topHeight = Math.random() * (canvas.height - PIPE_SPACING - 100) + 50;
        pipes.push({ x: canvas.width, top: topHeight, bottom: canvas.height - PIPE_SPACING - topHeight });
    }
    
    pipes.forEach(pipe => {
        pipe.x -= PIPE_SPEED;
        if (pipe.x + PIPE_WIDTH < 0) {
            pipes.shift();
            score++;
        }
        // Check for collision
        if (bird.x + BIRD_WIDTH > pipe.x && bird.x < pipe.x + PIPE_WIDTH &&
            (bird.y < pipe.top || bird.y + BIRD_HEIGHT > canvas.height - pipe.bottom)) {
            gameOver = true;
        }
    });

    // Draw elements
    drawBird();
    drawPipes();
    drawScore();
    
    frame++;
    requestAnimationFrame(updateGame);
}
