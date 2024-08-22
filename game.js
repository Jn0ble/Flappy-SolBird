// Initialize variables
let walletPublicKey = null;
let depositAmount = 0.02;
let gameStarted = false;

// Connect to Phantom Wallet
document.getElementById('connectButton').addEventListener('click', async () => {
    if (window.solana && window.solana.isPhantom) {
        try {
            const response = await window.solana.connect();
            walletPublicKey = response.publicKey.toString();
            document.getElementById('walletAddress').innerText = `Connected wallet: ${walletPublicKey}`;
            document.getElementById('controls').style.display = 'block';
            document.getElementById('pregame').style.display = 'none'; // Hide pre-game screen
            gameStarted = true;
            updateWalletInfo(); // Update wallet balance
        } catch (err) {
            console.error('Connection to Phantom wallet failed:', err);
        }
    } else {
        alert('Please install the Phantom wallet extension.');
    }
});

// Fetch wallet balance
async function updateWalletInfo() {
    if (walletPublicKey) {
        const connection = new solanaWeb3.Connection(solanaWeb3.clusterApiUrl('mainnet-beta'), 'confirmed');
        const publicKey = new solanaWeb3.PublicKey(walletPublicKey);
        try {
            const balance = await connection.getBalance(publicKey);
            const balanceInSOL = balance / solanaWeb3.LAMPORTS_PER_SOL;
            document.getElementById('walletBalance').innerText = `Balance: ${balanceInSOL.toFixed(2)} SOL`;

            // Mock profit/loss; in a real application, this should be fetched from a server or smart contract
            const profitLoss = (Math.random() * 5 - 2.5).toFixed(2);
            document.getElementById('profitLoss').innerText = `P/L: ${profitLoss} SOL`;
        } catch (err) {
            console.error('Failed to fetch wallet balance:', err);
        }
    }
}

// Deposit Slider
const depositSlider = document.getElementById('depositSlider');
const depositAmountElem = document.getElementById('depositAmount');
depositSlider.addEventListener('input', () => {
    depositAmount = parseFloat(depositSlider.value);
    depositAmountElem.innerText = `${depositAmount} SOL`;
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

let bird = { x: 50, y: canvas.height / 2, velocity: 0 };
let pipes = [];
let frame = 0;
let score = 0;
let gameOver = false;

document.getElementById('playButton').addEventListener('click', () => {
    if (walletPublicKey && gameStarted) {
        // Start the game
        bird = { x: 50, y: canvas.height / 2, velocity: 0 };
        pipes = [];
        frame = 0;
        score = 0;
        gameOver = false;
        document.getElementById('gameCanvas').style.display = 'block'; // Show game canvas
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

    // Create new pipes
    if (frame % PIPE_SPACING === 0) {
        const top = Math.random() * (canvas.height - 150) + 50;
        const bottom = canvas.height - top - 150;
        pipes.push({ x: canvas.width, top, bottom });
    }

    // Move pipes
    pipes.forEach(pipe => {
        pipe.x -= PIPE_SPEED;
        if (pipe.x + PIPE_WIDTH < 0) {
            pipes.shift();
            score++;
        }
    });

    // Check for collisions
    pipes.forEach(pipe => {
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

// Flap when space is pressed
window.addEventListener('keydown', (e) => {
    if (e.code === 'Space' && !gameOver) {
        bird.velocity = FLAP;
        document.addEventListener('DOMContentLoaded', () => {
    // Setup connection to Solana
    const { Connection, PublicKey } = window.solanaWeb3;
    const { WalletAdapterNetwork } = window.solanaWalletAdapterBase;
    const { PhantomWalletAdapter, SolletWalletAdapter, SlopeWalletAdapter, SolletExtensionWalletAdapter } = window.solanaWalletAdapterSollet;
    const { WalletProvider } = window.solanaWalletAdapterReact;
    
    const network = WalletAdapterNetwork.Devnet;
    const endpoint = 'https://api.devnet.solana.com';
    const connection = new Connection(endpoint);

    // Define wallet adapters
    const wallets = [
        new PhantomWalletAdapter(),
        new SolletWalletAdapter(),
        new SlopeWalletAdapter(),
        new SolletExtensionWalletAdapter()
    ];

    const walletProvider = new WalletProvider({
        wallets: wallets,
        network: network,
        connection: connection
    });

    // Handle wallet connection button click
    const walletConnectButton = document.getElementById('wallet-connect-btn');
    
    walletConnectButton.addEventListener('click', async () => {
        try {
            await walletProvider.connect();
            console.log('Wallet connected:', walletProvider.wallet);
        } catch (error) {
            console.error('Error connecting wallet:', error);
        }
    });

    // Existing game code
    // Example: Initialize game
    // const game = new FlappyBirdGame();
    // game.start();
});

    }
});

