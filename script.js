const canvas = document.getElementById("gameBoard");
const ctx = canvas.getContext("2d");

const scoreText = document.getElementById("score");
const message = document.getElementById("message");
const startBtn = document.getElementById("startBtn");

const box = 20;
const total = canvas.width / box;


// variables

let snake;
let food;
let dx;  // for direction
let dy;
let score;
let gameLoop;
let running = false;


//finction for food 

function randomFood(){
    let newFood;

    do{
        newFood = {
            x: Math.floor(Math.random()* total),
            y: Math.floor(Math.random() * total),
        };
    } while(
        snake.some(function(part){
            return part.x === newFood.x && part.y === newFood.y;
        })
    );

    return newFood;
}


function startGame(){
    clearInterval(gameLoop);

    snake = [
        {x : 10, y:10},
        {x : 9, y:10},
        {x : 8, y:10},
    ];

    dx = 1;
    dy = 0;
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
    ctx.fillStyle = "#fb7185";
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
        ctx.fillStyle = index === 0 ? "#4ade80" : "#16a34a";

        ctx.fillRect(
            part.x * box + 1,
            part.y * box + 1,
            box - 2,
            box - 2
        );
    });
}

function updateGame() {
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

    // If not eating, the tail moves away.
    // So moving into the old tail position is allowed.
    const body = eating ? snake : snake.slice(0, -1);

    const hitBody = body.some(function (part) {
        return part.x === head.x && part.y === head.y;
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
            endGame(true);
            return;
        }

        food = randomFood();
    } else {
        snake.pop();
    }

    drawGame();
}

function changeDirection(direction) {
    if (!running) return;

    if (direction === "up" && dy !== 1) {
        dx = 0;
        dy = -1;
    } else if (direction === "down" && dy !== -1) {
        dx = 0;
        dy = 1;
    } else if (direction === "left" && dx !== 1) {
        dx = -1;
        dy = 0;
    } else if (direction === "right" && dx !== -1) {
        dx = 1;
        dy = 0;
    }
}

function endGame(won = false) {
    running = false;
    clearInterval(gameLoop);

    message.textContent = won
        ? "You Win!"
        : "Game Over! Score: " + score;

    startBtn.textContent = "Play Again";
}

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

document.querySelectorAll("[data-dir]").forEach(function (button) {
    button.addEventListener("click", function () {
        changeDirection(button.dataset.dir);
    });
});

startBtn.addEventListener("click", startGame);

// Show the initial board
snake = [
    { x: 10, y: 10 },
    { x: 9, y: 10 },
    { x: 8, y: 10 }
];

food = { x: 15, y: 10 };
drawGame();
