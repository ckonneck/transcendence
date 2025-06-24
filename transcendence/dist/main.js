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
// Safe element retrieval helper
function getElement(id) {
    const el = document.getElementById(id);
    if (!el)
        throw new Error(`Element with id "${id}" not found`);
    return el;
}
const helloResponseDiv = getElement('helloresponse');
const requestResponseDiv = getElement('requestresponse');
const btn = getElement('requestBtn');
// Fetch /api/hello on load
fetch('/api/hello')
    .then(res => res.json())
    .then(data => {
    helloResponseDiv.textContent = data.message;
})
    .catch(() => {
    helloResponseDiv.textContent = 'Failed to load hello message.';
});
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
