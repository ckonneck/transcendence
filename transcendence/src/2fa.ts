// frontend/2fa.ts
const qrcodeContainer = document.getElementById('qrcode')!;
const codeInput = document.getElementById('codeInput') as HTMLInputElement;
const verifyBtn = document.getElementById('verifyBtn')!;
const resultDiv = document.getElementById('result')!;

async function loadQRCode() {
  const res = await fetch('http://localhost:3000/2fa/setup');
  const data = await res.json();

  const img = document.createElement('img');
  img.src = data.qrCode;
  img.alt = 'QR Code';
  img.classList.add('mx-auto');

  qrcodeContainer.innerHTML = '';
  qrcodeContainer.appendChild(img);
}

async function verifyCode() {
  const token = codeInput.value.trim();

  const res = await fetch('http://localhost:3000/2fa/verify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token }),
  });

  const data = await res.json();
  resultDiv.textContent = data.verified ? '✅ Verified' : '❌ Invalid Code';
  resultDiv.className = data.verified ? 'text-green-400' : 'text-red-500';
}

verifyBtn.addEventListener('click', verifyCode);
loadQRCode();
