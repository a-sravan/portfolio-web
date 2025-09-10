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
  }
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
  const chatGif = document.querySelector('.chat-gif');
  if (!chatToggle) return;

  chatToggle.addEventListener('click', () => {
    chatContainer.classList.toggle('active');
    const isActive = chatContainer.classList.contains('active');
    // Hide GIF when chat opens, show when chat closes
    if (chatGif) {
      chatGif.style.display = isActive ? 'none' : 'block';
    }
    if (isActive) chatInput.focus();
  });
  
  closeChat.addEventListener('click', () => {
    chatContainer.classList.remove('active');
    // Show GIF when chat closes
    if (chatGif) {
      chatGif.style.display = 'block';
    }
  });

  async function sendUserMessage(message) {
    if (!message.trim()) return;

    // Play send sound
    playSound('send');

    // user bubble
    chatMessages.insertAdjacentHTML('beforeend', `
      <div class="message user"><div class="message-content"><p>${escapeHtml(message)}</p></div></div>
    `);
    scrollToBottom();
    chatInput.value = '';

    // Show typing indicator
    const typingIndicator = document.createElement('div');
    typingIndicator.className = 'message bot typing-indicator';
    typingIndicator.innerHTML = `
      <div class="message-content">
        <div class="typing-dots">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    `;
    chatMessages.appendChild(typingIndicator);
    scrollToBottom();

    // ---------- Gemini call ----------
    const API_KEY = 'AIzaSyCmuvMrKoBcPL-rnqg-t-Tfw39MMbpxOYw'; // this is API key
    if (!API_KEY || API_KEY.includes('REPLACE') || API_KEY.includes('YOUR')) {
      // Remove typing indicator and show error
      typingIndicator.remove();
      addBotMessage("API key is missing. Add your Gemini key in chat.js.");
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

      // Remove typing indicator
      typingIndicator.remove();

      // Show server errors clearly
      if (!response.ok) {
        const errText = await response.text().catch(() => '');
        console.error('Gemini API Error:', response.status, errText);
        addBotMessage(`API error ${response.status}. Check console for details (CORS, referrer, quota, or key/domain).`);
        return;
      }

      const data = await response.json();

      // Safety blocks or empty candidates
      const blocked = data?.promptFeedback?.blockReason;
      if (blocked) {
        console.warn('Response blocked:', blocked, data?.promptFeedback);
        addBotMessage("I couldn't answer that one. Try rephrasing!");
        return;
      }

      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (text) {
        // Play receive sound and add message with typing effect
        playSound('receive');
        addBotMessageWithTyping(text);
      } else {
        addBotMessage("No response");
      }
    } catch (err) {
      // Remove typing indicator
      typingIndicator.remove();
      console.error('Fetch failed:', err);
      addBotMessage("Sorry, I'm having trouble connecting to the AI. Please try again later.");
    }
    // ----------------------------------
  }

  // Function to add bot message with typing animation
  function addBotMessageWithTyping(text) {
    const botMessage = document.createElement('div');
    botMessage.className = 'message bot';
    botMessage.innerHTML = `<div class="message-content"><p></p></div>`;
    chatMessages.appendChild(botMessage);

    const messageP = botMessage.querySelector('p');
    let index = 0;
    
    function typeWriter() {
      if (index < text.length) {
        messageP.textContent += text.charAt(index);
        index++;
        scrollToBottom();
        setTimeout(typeWriter, 10);
      }
    }
    
    setTimeout(typeWriter, 300);
  }

  // Function to add bot message without typing effect
  function addBotMessage(text) {
    const botMessage = document.createElement('div');
    botMessage.className = 'message bot';
    botMessage.innerHTML = `<div class="message-content"><p>${text}</p></div>`;
    chatMessages.appendChild(botMessage);
    scrollToBottom();
  }

  // Function to scroll to bottom
  function scrollToBottom() {
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  // Function to play simple sounds
  function playSound(type) {
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      if (type === 'send') {
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(400, audioContext.currentTime + 0.1);
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.1);
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.1);
      } else if (type === 'receive') {
        oscillator.frequency.setValueAtTime(400, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(600, audioContext.currentTime + 0.15);
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.15);
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.15);
      }
    } catch (error) {
      // Silently fail if audio not available
    }
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
      sendUserMessage(q);
    });
  });
});
