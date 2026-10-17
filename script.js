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