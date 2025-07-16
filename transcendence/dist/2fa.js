"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// frontend/2fa.ts
const qrcodeContainer = document.getElementById('qrcode');
const codeInput = document.getElementById('codeInput');
const verifyBtn = document.getElementById('verifyBtn');
const resultDiv = document.getElementById('result');
function loadQRCode() {
    return __awaiter(this, void 0, void 0, function* () {
        const res = yield fetch('http://localhost:3000/2fa/setup');
        const data = yield res.json();
        const img = document.createElement('img');
        img.src = data.qrCode;
        img.alt = 'QR Code';
        img.classList.add('mx-auto');
        qrcodeContainer.innerHTML = '';
        qrcodeContainer.appendChild(img);
    });
}
function verifyCode() {
    return __awaiter(this, void 0, void 0, function* () {
        const token = codeInput.value.trim();
        const res = yield fetch('http://localhost:3000/2fa/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token }),
        });
        const data = yield res.json();
        resultDiv.textContent = data.verified ? '✅ Verified' : '❌ Invalid Code';
        resultDiv.className = data.verified ? 'text-green-400' : 'text-red-500';
    });
}
verifyBtn.addEventListener('click', verifyCode);
loadQRCode();
