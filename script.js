
const canvas = document.getElementById("gameBoard");
const ctx = canvas.getContext("2d");

const scoreText = document.getElementById("score");
const message = document.getElementById("message");
const startBtn = document.getElementById("startBtn");

const box = 20;
const total = canvas.width / box;

let snake = [];
let food;
let dx = 1;
let dy = 0;
let score = 0;
let gameLoop = null;
let running = false;

let touchStartX = 0;
let touchStartY = 0;

// Prevent multiple direction changes in one game tick.
let nextDirection = "right";
let canChangeDirection = true;

function randomFood() {
    let newFood;

    do {
        newFood = {
            x: Math.floor(Math.random() * total),
            y: Math.floor(Math.random() * total)
        };
    } while (
        snake.some(function (part) {
            return part.x === newFood.x &&
                   part.y === newFood.y;
        })
    );

    return newFood;
}

function startGame() {
    clearInterval(gameLoop);

    snake = [
        { x: 10, y: 10 },
        { x: 9, y: 10 },
        { x: 8, y: 10 }
    ];

    dx = 1;
    dy = 0;
    nextDirection = "right";
    canChangeDirection = true;
    score = 0;
    running = true;

    scoreText.textContent = score;
    message.textContent = "Game is running!";
    startBtn.textContent = "Restart Game";

    food = randomFood();
    drawGame();

    gameLoop = setInterval(updateGame, 120);
}

function drawGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw food
    ctx.fillStyle = "#ac011a";
    ctx.beginPath();
    ctx.arc(
        food.x * box + box / 2,
        food.y * box + box / 2,
        box / 2 - 2,
        0,
        Math.PI * 2
    );
    ctx.fill();

    // Draw snake
    snake.forEach(function (part, index) {
        ctx.fillStyle = index === 0
            ? "#4ade80"
            : "#16a34a";

        ctx.fillRect(
            part.x * box + 1,
            part.y * box + 1,
            box - 2,
            box - 2
        );
    });
}

function updateGame() {
    if (!running) {
        return;
    }

    dx = nextDirection === "left" ? -1 :
         nextDirection === "right" ? 1 : 0;

    dy = nextDirection === "up" ? -1 :
         nextDirection === "down" ? 1 : 0;

    const head = {
        x: snake[0].x + dx,
        y: snake[0].y + dy
    };

    // Wall collision
    if (
        head.x < 0 ||
        head.x >= total ||
        head.y < 0 ||
        head.y >= total
    ) {
        endGame();
        return;
    }

    const eating = head.x === food.x &&
                   head.y === food.y;

    // Tail moves away when the snake is not eating.
    const body = eating ? snake : snake.slice(0, -1);

    const hitBody = body.some(function (part) {
        return part.x === head.x &&
               part.y === head.y;
    });

    if (hitBody) {
        endGame();
        return;
    }

    snake.unshift(head);

    if (eating) {
        score += 10;
        scoreText.textContent = score;

        if (snake.length === total * total) {
            drawGame();
            endGame(true);
            return;
        }

        food = randomFood();
    } else {
        snake.pop();
    }

    canChangeDirection = true;
    drawGame();
}

function changeDirection(direction) {
    if (!running || !canChangeDirection) {
        return;
    }

    // Never allow a 180-degree turn.
    if (
        (direction === "up" && dy === 1) ||
        (direction === "down" && dy === -1) ||
        (direction === "left" && dx === 1) ||
        (direction === "right" && dx === -1)
    ) {
        return;
    }

    nextDirection = direction;
    canChangeDirection = false;
}

function endGame(won = false) {
    running = false;
    clearInterval(gameLoop);
    gameLoop = null;

    message.textContent = won
        ? "You Win! 🏆"
        : "Game Over! Score: " + score;

    startBtn.textContent = "Play Again";
}

// Keyboard controls
document.addEventListener("keydown", function (event) {
    const keys = {
        ArrowUp: "up",
        ArrowDown: "down",
        ArrowLeft: "left",
        ArrowRight: "right"
    };

    if (keys[event.key]) {
        event.preventDefault();
        changeDirection(keys[event.key]);
    }
});

// On-screen direction buttons
document.querySelectorAll("[data-dir]").forEach(function (button) {
    button.addEventListener("click", function () {
        changeDirection(button.dataset.dir);
    });
});

// Mobile swipe controls
canvas.addEventListener("touchstart", function (event) {
    event.preventDefault();

    touchStartX = event.changedTouches[0].clientX;
    touchStartY = event.changedTouches[0].clientY;
}, { passive: false });

canvas.addEventListener("touchend", function (event) {
    event.preventDefault();

    const touchEndX = event.changedTouches[0].clientX;
    const touchEndY = event.changedTouches[0].clientY;

    const differenceX = touchEndX - touchStartX;
    const differenceY = touchEndY - touchStartY;

    if (Math.max(
        Math.abs(differenceX),
        Math.abs(differenceY)
    ) < 20) {
        return;
    }

    if (Math.abs(differenceX) > Math.abs(differenceY)) {
        changeDirection(
            differenceX > 0 ? "right" : "left"
        );
    } else {
        changeDirection(
            differenceY > 0 ? "down" : "up"
        );
    }
}, { passive: false });

startBtn.addEventListener("click", startGame);

// Initial preview before starting
snake = [
    { x: 10, y: 10 },
    { x: 9, y: 10 },
    { x: 8, y: 10 }
];

food = { x: 15, y: 10 };
drawGame();
