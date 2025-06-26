"use strict";
// src/main.ts
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// ^^^  Defines a TypeScript interface to describe the structure of API responses you expect:
//      It should be an object with a message field of type string.
// Safe element retrieval helper
function getElement(id) {
    const el = document.getElementById(id);
    if (!el)
        throw new Error(`Element with id "${id}" not found`);
    return el;
}
//Generic utility function to get an element from the DOM(document object model) by id, and cast it to a specific HTML element type (like HTMLDivElement, HTMLButtonElement, etc).
// If the element isn't found, it throws an error instead of returning null.
// T is a generic type, constrained to be a subtype of HTMLElement.
const helloResponseDiv = getElement('helloresponse');
const requestResponseDiv = getElement('requestresponse');
const btn = getElement('requestBtn');
// These lines call the helper above to:
//Get the DOM(document object model) element where the /api/hello response will be displayed.
//Get the element for showing the /api/request response.
//Get the button element the user will click to trigger the request.
// Fetch /api/hello on load
fetch('/api/hello')
    .then(res => res.json())
    .then(data => {
    helloResponseDiv.textContent = data.message;
})
    .catch(() => {
    helloResponseDiv.textContent = 'Failed to load hello message.';
});
// This block makes a GET request to /api/hello when the page loads.
//If successful, it updates helloResponseDiv with the message.
//If it fails, it shows a fallback error message.
// Button click sends request to /api/request
btn.addEventListener('click', () => __awaiter(void 0, void 0, void 0, function* () {
    requestResponseDiv.textContent = 'Loading...';
    try {
        const res = yield fetch('/api/request');
        const data = (yield res.json());
        requestResponseDiv.textContent = data.message;
    }
    catch (err) {
        if (err instanceof Error) {
            requestResponseDiv.textContent = 'Error: ' + err.message;
        }
        else {
            requestResponseDiv.textContent = 'Unknown error';
        }
    }
}));
//Adds an event listener to the button:
//When clicked, it makes a GET request to /api/request
//While waiting, it shows "Loading..."
//On success, it shows the message from the server
//On failure, it shows a proper error message (based on the error object type)
const keyboardResponseDiv = getElement('keyboardresponse');
// Modular function to update the message
// function showKeyPressed(key: string): void {
//   keyboardResponseDiv.textContent = `You pressed the "${key.toUpperCase()}" key!`;
// }
// Global listener for any key
// document.addEventListener('keydown', (event: KeyboardEvent) => {
//   showKeyPressed(event.key);
// });
const leftPaddle = document.getElementById('left-paddle');
const rightPaddle = document.getElementById('right-paddle');
const ball = document.getElementById('ball');
const game = document.getElementById('game');
let leftY = 200;
let rightY = 200;
let paddleSpeed = 5;
let ballX = 390;
let ballY = 240;
const INITIAL_BALL_VX = 4;
const INITIAL_BALL_VY = 3;
let ballVX = INITIAL_BALL_VX;
let ballVY = INITIAL_BALL_VY;
const keys = {};
document.addEventListener('keydown', e => keys[e.key] = true);
document.addEventListener('keyup', e => keys[e.key] = false);
let gameActive = false;
let ballStarted = false;
const startMessage = document.createElement('div');
// Add these variables
let leftScore = 0;
let rightScore = 0;
const leftScoreDisplay = document.createElement('div');
const rightScoreDisplay = document.createElement('div');
// Set up score displays
function setupScoreDisplays() {
    // Left score (Player 1)
    leftScoreDisplay.className = 'text-3xl font-bold text-black';
    leftScoreDisplay.style.position = 'absolute';
    leftScoreDisplay.style.top = '150px';
    leftScoreDisplay.style.left = '25%';
    leftScoreDisplay.textContent = '0';
    // Right score (Player 2)
    rightScoreDisplay.className = 'text-3xl font-bold text-black';
    rightScoreDisplay.style.position = 'absolute';
    rightScoreDisplay.style.top = '150px';
    rightScoreDisplay.style.right = '25%';
    rightScoreDisplay.textContent = '0';
    // Add to document
    document.body.appendChild(leftScoreDisplay);
    document.body.appendChild(rightScoreDisplay);
}
// Setup the start message
function setupStartMessage() {
    startMessage.innerHTML = 'Press SPACE to start<br>Use W and S keys and Up and Down<br>for moving the paddles.';
    startMessage.style.position = 'absolute';
    startMessage.style.top = '30%';
    startMessage.style.left = '50%';
    startMessage.style.transform = 'translate(-50%, -50%)';
    startMessage.style.color = 'white';
    startMessage.style.fontSize = '24px';
    startMessage.style.fontFamily = 'Arial, sans-serif';
    game.appendChild(startMessage);
}
// Reset the ball and show start message
function resetBall() {
    // If the ball has started and went out of bounds, update score
    if (ballStarted) {
        if (ballX < 0) {
            // Right player scored
            rightScore++;
            rightScoreDisplay.textContent = rightScore.toString();
        }
        else if (ballX > game.clientWidth) {
            // Left player scored
            leftScore++;
            leftScoreDisplay.textContent = leftScore.toString();
        }
    }
    // Reset ball position
    ballX = 390;
    ballY = 240;
    ballVX = 0;
    ballVY = 0;
    ball.style.left = `${ballX}px`;
    ball.style.top = `${ballY}px`;
    gameActive = false;
    startMessage.style.display = 'block';
    paddleSpeed = 5; // Reset paddle speed
}
// Start the ball
function startBall() {
    if (!gameActive) {
        gameActive = true;
        startMessage.style.display = 'none';
        // Set initial velocities and directions
        ballVX = INITIAL_BALL_VX * (Math.random() > 0.5 ? 1 : -1);
        ballVY = INITIAL_BALL_VY * (Math.random() > 0.5 ? 1 : -1);
        ballStarted = true;
    }
}
// Update the keydown event handler to detect space
document.addEventListener('keydown', e => {
    keys[e.key] = true;
    // Start the game when space is pressed
    if (e.code === 'Space' && !gameActive) {
        startBall();
        e.preventDefault(); // Prevent page scrolling
    }
});
// Modify your update function to respect game state
function update() {
    // Move paddles (this can always happen)
    if (keys['w'] && leftY > 0)
        leftY -= paddleSpeed;
    if (keys['s'] && leftY < game.clientHeight - 100)
        leftY += paddleSpeed;
    if (keys['ArrowUp'] && rightY > 0)
        rightY -= paddleSpeed;
    if (keys['ArrowDown'] && rightY < game.clientHeight - 100)
        rightY += paddleSpeed;
    leftPaddle.style.top = `${leftY}px`;
    rightPaddle.style.top = `${rightY}px`;
    // Only move the ball if the game is active
    if (gameActive) {
        // Move ball
        ballX += ballVX;
        ballY += ballVY;
        // Ball collision with top/bottom
        if (ballY <= 0 || ballY >= game.clientHeight - 20)
            ballVY *= -1;
        // Ball collision with paddles
        if (ballX <= 10 && ballY + 20 >= leftY && ballY <= leftY + 100 ||
            ballX + 20 >= game.clientWidth - 10 && ballY + 20 >= rightY && ballY <= rightY + 100) {
            ballVX *= -1;
            const speedMultiplier = 1.08;
            ballVX *= speedMultiplier;
            ballVY *= speedMultiplier;
            paddleSpeed *= speedMultiplier;
            // Optional: Cap the maximum speed to prevent the ball from becoming too fast
            const maxSpeed = 15;
            const currentSpeed = Math.sqrt(ballVX * ballVX + ballVY * ballVY);
            if (currentSpeed > maxSpeed) {
                const scaleFactor = maxSpeed / currentSpeed;
                ballVX *= scaleFactor;
                ballVY *= scaleFactor;
            }
        }
        // Reset if out of bounds
        if (ballX < -20 || ballX > game.clientWidth + 20) {
            resetBall();
            paddleSpeed = 5;
        }
        ball.style.left = `${ballX}px`;
        ball.style.top = `${ballY}px`;
    }
    requestAnimationFrame(update);
}
// Initialize the game
setupStartMessage();
resetBall();
setupScoreDisplays();
update();
//This script:
//Uses TypeScript to ensure type safety (e.g., the ApiResponse interface)
//Selects DOM elements safely
//Handles both initial loading (/api/hello) and user interaction (button click → /api/request)
//Ensures clear error messages on both fronts
