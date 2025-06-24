// src/main.ts

interface ApiResponse {
  message: string;
}

// Safe element retrieval helper
function getElement<T extends HTMLElement>(id: string): T {
  const el = document.getElementById(id);
  if (!el) throw new Error(`Element with id "${id}" not found`);
  return el as T;
}

const helloResponseDiv = getElement<HTMLDivElement>('helloresponse');
const requestResponseDiv = getElement<HTMLDivElement>('requestresponse');
const btn = getElement<HTMLButtonElement>('requestBtn');

// Fetch /api/hello on load
fetch('/api/hello')
  .then(res => res.json() as Promise<ApiResponse>)
  .then(data => {
    helloResponseDiv.textContent = data.message;
  })
  .catch(() => {
    helloResponseDiv.textContent = 'Failed to load hello message.';
  });

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
