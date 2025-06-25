// src/main.ts

interface ApiResponse {
  message: string;
}
// ^^^  Defines a TypeScript interface to describe the structure of API responses you expect:
//      It should be an object with a message field of type string.

// Safe element retrieval helper
function getElement<T extends HTMLElement>(id: string): T {
  const el = document.getElementById(id);
  if (!el) throw new Error(`Element with id "${id}" not found`);
  return el as T;
}
//Generic utility function to get an element from the DOM(document object model) by id, and cast it to a specific HTML element type (like HTMLDivElement, HTMLButtonElement, etc).
// If the element isn't found, it throws an error instead of returning null.
// T is a generic type, constrained to be a subtype of HTMLElement.




const helloResponseDiv = getElement<HTMLDivElement>('helloresponse');
const requestResponseDiv = getElement<HTMLDivElement>('requestresponse');
const btn = getElement<HTMLButtonElement>('requestBtn');
// These lines call the helper above to:
//Get the DOM(document object model) element where the /api/hello response will be displayed.
//Get the element for showing the /api/request response.
//Get the button element the user will click to trigger the request.


// Fetch /api/hello on load
fetch('/api/hello')
  .then(res => res.json() as Promise<ApiResponse>)
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
btn.addEventListener('click', async () => {
  requestResponseDiv.textContent = 'Loading...';
  try {
    const res = await fetch('/api/request');
    const data = (await res.json()) as ApiResponse;
    requestResponseDiv.textContent = data.message;
  } catch (err) {
    if (err instanceof Error) {
      requestResponseDiv.textContent = 'Error: ' + err.message;
    } else {
      requestResponseDiv.textContent = 'Unknown error';
    }
  }
});
//Adds an event listener to the button:
//When clicked, it makes a GET request to /api/request
//While waiting, it shows "Loading..."
//On success, it shows the message from the server
//On failure, it shows a proper error message (based on the error object type)



const keyboardResponseDiv = getElement<HTMLDivElement>('keyboardresponse');

// Modular function to update the message
function showKeyPressed(key: string): void {
  keyboardResponseDiv.textContent = `You pressed the "${key.toUpperCase()}" key!`;
}

// Global listener for any key
document.addEventListener('keydown', (event: KeyboardEvent) => {
  showKeyPressed(event.key);
});

const leftPaddle = document.getElementById('left-paddle') as HTMLDivElement;
const rightPaddle = document.getElementById('right-paddle') as HTMLDivElement;
const ball = document.getElementById('ball') as HTMLDivElement;
const game = document.getElementById('game') as HTMLDivElement;

let leftY = 200;
let rightY = 200;
const paddleSpeed = 5;

let ballX = 390;
let ballY = 240;
let ballVX = 4;
let ballVY = 3;

const keys: Record<string, boolean> = {};

document.addEventListener('keydown', e => keys[e.key] = true);
document.addEventListener('keyup', e => keys[e.key] = false);

function update() {
  // Move paddles
  if (keys['w'] && leftY > 0) leftY -= paddleSpeed;
  if (keys['s'] && leftY < game.clientHeight - 100) leftY += paddleSpeed;
  if (keys['ArrowUp'] && rightY > 0) rightY -= paddleSpeed;
  if (keys['ArrowDown'] && rightY < game.clientHeight - 100) rightY += paddleSpeed;

  leftPaddle.style.top = `${leftY}px`;
  rightPaddle.style.top = `${rightY}px`;

  // Move ball
  ballX += ballVX;
  ballY += ballVY;

  // Ball collision with top/bottom
  if (ballY <= 0 || ballY >= game.clientHeight - 20) ballVY *= -1;

  // Ball collision with paddles
  if (
    ballX <= 10 && ballY + 20 >= leftY && ballY <= leftY + 100 ||
    ballX + 20 >= game.clientWidth - 10 && ballY + 20 >= rightY && ballY <= rightY + 100
  ) {
    ballVX *= -1;
  }

  // Reset if out of bounds (optional)
  if (ballX < -20 || ballX > game.clientWidth + 20) {
    ballX = 390;
    ballY = 240;
    ballVX *= -1;
    ballVY *= -1;
  }

  ball.style.left = `${ballX}px`;
  ball.style.top = `${ballY}px`;

  requestAnimationFrame(update);
}

update();


//This script:
//Uses TypeScript to ensure type safety (e.g., the ApiResponse interface)
//Selects DOM elements safely
//Handles both initial loading (/api/hello) and user interaction (button click → /api/request)
//Ensures clear error messages on both fronts