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
function showKeyPressed(key) {
    keyboardResponseDiv.textContent = `You pressed the "${key.toUpperCase()}" key!`;
}
// Global listener for any key
document.addEventListener('keydown', (event) => {
    showKeyPressed(event.key);
});
const block = getElement('moving-block');
const ball = getElement('white-ball');
const boundary = getElement('boundary');
let x = 0; // block position
let y = 0;
let velocityX = 0;
let velocityY = 0;
let ballX = 100; // ball position (start somewhere)
let ballY = 100;
let ballVelocityX = 0;
let ballVelocityY = 0;
const acceleration = 0.5;
const friction = 0.92;
const maxSpeed = 8;
const ballFriction = 0.85;
const pushForce = 1.5;
const keysPressed = {};
document.addEventListener('keydown', (e) => keysPressed[e.key] = true);
document.addEventListener('keyup', (e) => keysPressed[e.key] = false);
function rectsOverlap(r1, r2) {
    return !(r1.right < r2.left ||
        r1.left > r2.right ||
        r1.bottom < r2.top ||
        r1.top > r2.bottom);
}
function update() {
    const boundaryRect = boundary.getBoundingClientRect();
    const blockRect = block.getBoundingClientRect();
    const ballRect = ball.getBoundingClientRect();
    const maxX = boundaryRect.width - blockRect.width;
    const maxY = boundaryRect.height - blockRect.height;
    const maxBallX = boundaryRect.width - ballRect.width;
    const maxBallY = boundaryRect.height - ballRect.height;
    // Block movement input
    if (keysPressed['ArrowUp'])
        velocityY -= acceleration;
    if (keysPressed['ArrowDown'])
        velocityY += acceleration;
    if (keysPressed['ArrowLeft'])
        velocityX -= acceleration;
    if (keysPressed['ArrowRight'])
        velocityX += acceleration;
    velocityX = Math.max(-maxSpeed, Math.min(maxSpeed, velocityX));
    velocityY = Math.max(-maxSpeed, Math.min(maxSpeed, velocityY));
    velocityX *= friction;
    velocityY *= friction;
    // Update block position
    x += velocityX;
    y += velocityY;
    // Clamp block inside boundary
    if (x < 0) {
        x = 0;
        if (velocityX < 0)
            velocityX *= -0.3;
    }
    else if (x > maxX) {
        x = maxX;
        if (velocityX > 0)
            velocityX *= -0.3;
    }
    if (y < 0) {
        y = 0;
        if (velocityY < 0)
            velocityY *= -0.3;
    }
    else if (y > maxY) {
        y = maxY;
        if (velocityY > 0)
            velocityY *= -0.3;
    }
    // Update block style
    block.style.left = x + 'px';
    block.style.top = y + 'px';
    // Update ball position with velocity
    ballX += ballVelocityX;
    ballY += ballVelocityY;
    // Clamp ball inside boundary
    if (ballX < 0) {
        ballX = 0;
        ballVelocityX *= -0.3;
    }
    else if (ballX > maxBallX) {
        ballX = maxBallX;
        ballVelocityX *= -0.3;
    }
    if (ballY < 0) {
        ballY = 0;
        ballVelocityY *= -0.3;
    }
    else if (ballY > maxBallY) {
        ballY = maxBallY;
        ballVelocityY *= -0.3;
    }
    // Apply friction to ball velocity
    ballVelocityX *= ballFriction;
    ballVelocityY *= ballFriction;
    // Update ball style
    ball.style.left = ballX + 'px';
    ball.style.top = ballY + 'px';
    // Collision detection and pushing ball
    const updatedBlockRect = block.getBoundingClientRect();
    const updatedBallRect = ball.getBoundingClientRect();
    if (rectsOverlap(updatedBlockRect, updatedBallRect)) {
        // Get the centers of both objects
        const blockCenterX = x + blockRect.width / 2;
        const blockCenterY = y + blockRect.height / 2;
        const ballCenterX = ballX + ballRect.width / 2;
        const ballCenterY = ballY + ballRect.height / 2;
        // Vector from block center to ball center
        let dirX = ballCenterX - blockCenterX;
        let dirY = ballCenterY - blockCenterY;
        // If vector is zero (directly on top), give it a small value
        if (dirX === 0 && dirY === 0) {
            dirX = Math.random() - 0.5;
            dirY = Math.random() - 0.5;
        }
        // Normalize the direction vector
        const length = Math.sqrt(dirX * dirX + dirY * dirY);
        const nx = dirX / length;
        const ny = dirY / length;
        // Calculate impulse strength based on block's velocity
        const blockSpeed = Math.sqrt(velocityX * velocityX + velocityY * velocityY);
        const impulse = Math.max(pushForce, blockSpeed * 0.8);
        // Apply impulse to ball velocity
        ballVelocityX += nx * impulse;
        ballVelocityY += ny * impulse;
        // Move the ball slightly out of collision
        ballX += nx * 2;
        ballY += ny * 2;
        // Transfer some of block's velocity to ball
        ballVelocityX += velocityX * 0.4;
        ballVelocityY += velocityY * 0.4;
    }
    requestAnimationFrame(update);
}
function initialize() {
    // Ensure proper DOM structure - ball and block should be inside boundary
    block.style.position = 'absolute';
    ball.style.position = 'absolute';
    boundary.style.position = 'relative';
    // Make sure they're inside the boundary element
    if (block.parentElement !== boundary) {
        boundary.appendChild(block);
    }
    if (ball.parentElement !== boundary) {
        boundary.appendChild(ball);
    }
    // Get sizes after elements are in correct DOM positions
    const boundaryRect = boundary.getBoundingClientRect();
    const blockRect = block.getBoundingClientRect();
    const ballRect = ball.getBoundingClientRect();
    // Position the block in center
    x = (boundaryRect.width - blockRect.width) / 2;
    y = (boundaryRect.height - blockRect.height) / 2;
    // Position ball in different location
    ballX = (boundaryRect.width - ballRect.width) / 3;
    ballY = (boundaryRect.height - ballRect.height) / 3;
    // Make sure velocities start at zero
    velocityX = 0;
    velocityY = 0;
    ballVelocityX = 0;
    ballVelocityY = 0;
    // Apply positions to elements
    block.style.left = x + 'px';
    block.style.top = y + 'px';
    ball.style.left = ballX + 'px';
    ball.style.top = ballY + 'px';
}
// Initialize and start animation
initialize();
update();
//This script:
//Uses TypeScript to ensure type safety (e.g., the ApiResponse interface)
//Selects DOM elements safely
//Handles both initial loading (/api/hello) and user interaction (button click → /api/request)
//Ensures clear error messages on both fronts
