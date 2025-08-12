// chat.js

// -------- System prompt (loaded from /prompts/prompt.txt) --------
let SYSTEM_PROMPT = "Portfolio Assistant."; // fallback if file fails to load
let PROMPT_SOURCE = "fallback";   

async function loadSystemPrompt() {
  try {
    // cache-buster helps during dev
    const res = await fetch('prompts/prompt.txt?v=' + Date.now(), { cache: 'no-store' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const txt = await res.text();
    if (txt && txt.trim().length) {
      SYSTEM_PROMPT = txt;
      PROMPT_SOURCE = "file";
    }
  } catch (e) {
    PROMPT_SOURCE = "fallback";
    console.warn('Using fallback system prompt. Could not load prompts/prompt.txt:', e);
  } finally {
    showPromptSourceBadge();
    console.log('[Prompt source]', PROMPT_SOURCE, '— first 80 chars:', SYSTEM_PROMPT.slice(0, 80));
  }
}

function showPromptSourceBadge() {
  const header = document.querySelector('.chat-header');
  if (!header) return;
  let badge = document.getElementById('prompt-source-badge');
  if (!badge) {
    badge = document.createElement('span');
    badge.id = 'prompt-source-badge';
    badge.style.cssText =
      'margin-left:auto;font-size:11px;background:#333;color:#fff;padding:2px 6px;border-radius:12px;opacity:.75;';
    header.appendChild(badge);
  }
  badge.textContent = PROMPT_SOURCE === 'file' ? 'prompt: file' : 'prompt: fallback';
}

// expose a manual reload for quick testing in DevTools
window.reloadPrompt = loadSystemPrompt;

// -----------------------------------------------------------------
document.addEventListener('DOMContentLoaded', async function () {
  await loadSystemPrompt();

  const chatToggle = document.querySelector('.chat-toggle');
  const chatContainer = document.querySelector('.chat-container');
  const closeChat = document.querySelector('.close-chat');
  const chatInput = document.querySelector('.chat-input input');
  const sendMessage = document.querySelector('.send-message');
  const chatMessages = document.querySelector('.chat-messages');
  const quickActions = document.querySelectorAll('.action-btn');
  if (!chatToggle) return;

  chatToggle.addEventListener('click', () => {
    chatContainer.classList.toggle('active');
    if (chatContainer.classList.contains('active')) chatInput.focus();
  });
  closeChat.addEventListener('click', () => chatContainer.classList.remove('active'));

  async function sendUserMessage(message) {
    if (!message.trim()) return;

    // user bubble
    chatMessages.insertAdjacentHTML('beforeend', `
      <div class="message user"><div class="message-content"><p>${escapeHtml(message)}</p></div></div>
    `);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    chatInput.value = '';

    // bot bubble
    const bot = document.createElement('div');
    bot.className = 'message bot';
    bot.innerHTML = `<div class="message-content"><p>…</p></div>`;
    chatMessages.appendChild(bot);
    const botText = bot.querySelector('p');

    // ---------- Gemini call ----------
    const API_KEY = 'AIzaSyCmuvMrKoBcPL-rnqg-t-Tfw39MMbpxOYw'; // this  is API key
    if (!API_KEY || API_KEY.includes('REPLACE') || API_KEY.includes('YOUR')) {
      botText.textContent = "API key is missing. Add your Gemini key in chat.js.";
      return;
    }

    const API_URL =
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`;

    const fullPrompt = `${SYSTEM_PROMPT}\n\nUser: ${message}`;

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: fullPrompt }] }]
        }),
      });

      // Show server errors clearly
      if (!response.ok) {
        const errText = await response.text().catch(() => '');
        console.error('Gemini API Error:', response.status, errText);
        botText.textContent =
          `API error ${response.status}. Check console for details (CORS, referrer, quota, or key/domain).`;
        return;
      }

      const data = await response.json();

      // Safety blocks or empty candidates
      const blocked = data?.promptFeedback?.blockReason;
      if (blocked) {
        console.warn('Response blocked:', blocked, data?.promptFeedback);
        botText.textContent = "I couldn't answer that one. Try rephrasing!";
        return;
      }

      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      botText.textContent = text || "No response";
    } catch (err) {
      console.error('Fetch failed:', err);
      botText.textContent = "Sorry, I'm having trouble connecting to the AI. Please try again later.";
    }
    // ----------------------------------

    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function escapeHtml(unsafe) {
    return unsafe.replace(/&/g, "&amp;")
                 .replace(/</g, "&lt;")
                 .replace(/>/g, "&gt;")
                 .replace(/"/g, "&quot;")
                 .replace(/'/g, "&#039;");
  }

  sendMessage.addEventListener('click', () => sendUserMessage(chatInput.value));
  chatInput.addEventListener('keypress', (e) => e.key === 'Enter' && sendUserMessage(chatInput.value));

  quickActions.forEach(btn => {
    btn.addEventListener('click', () => {
      const q = btn.getAttribute('data-query');
      chatMessages.insertAdjacentHTML('beforeend',
        `<div class="message user"><div class="message-content"><p>${escapeHtml(q)}</p></div></div>`);
      chatMessages.scrollTop = chatMessages.scrollHeight;
      sendUserMessage(q);
    });
  });
});
