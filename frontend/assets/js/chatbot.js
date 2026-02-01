// frontend/assets/js/chatbot.js
document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.createElement('div');
  toggle.id = 'chatbot-toggle';
  toggle.textContent = '💬';
  toggle.setAttribute('role','button');
  toggle.setAttribute('aria-label','Open chat');
  toggle.setAttribute('tabindex','0');
  const win = document.createElement('div');
  win.id = 'chatbot-window';
  win.innerHTML = `
    <div id="chatbot-header" role="heading" aria-level="2">Ndawonga Assistant</div>
    <div id="chatbot-messages" aria-live="polite" aria-label="Chat messages"></div>
    <form id="chatbot-input" aria-label="Send a message"><input id="chatbot-text" placeholder="Ask about tenders, projects..." autocomplete="off" aria-label="Your message" /><button aria-label="Send message">➤</button></form>
  `;
  document.body.appendChild(toggle);
  document.body.appendChild(win);

  toggle.addEventListener('click', () => win.classList.toggle('open'));
  toggle.addEventListener('keydown', (e)=>{ if(e.key==='Enter' || e.key===' '){ e.preventDefault(); win.classList.toggle('open'); }});
  const messages = win.querySelector('#chatbot-messages');
  const form = win.querySelector('#chatbot-input');
  const input = win.querySelector('#chatbot-text');

  function addMessage(text, who='bot') {
    const el = document.createElement('div');
    el.className = 'chat-msg ' + (who === 'user' ? 'user' : 'bot');
    el.textContent = text;
    messages.appendChild(el);
    messages.scrollTop = messages.scrollHeight;
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const msg = input.value.trim();
    if (!msg) return;
    addMessage(msg, 'user');
    input.value = '';
    addMessage('...', 'bot');
    try {
      const res = await fetch('/api/chat', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ message: msg })});
      let data = {};
      try { data = await res.json(); } catch(_) { data = { reply: 'No response' }; }
      // remove the "..." last bot message
      const bots = messages.querySelectorAll('.chat-msg.bot');
      if (bots.length) bots[bots.length-1].remove();
      addMessage(data.reply || 'No response from server', 'bot');
    } catch (err) {
      addMessage('Error contacting server', 'bot');
    }
  });
});
