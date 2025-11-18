import { parseAndExecute } from './ai.js';
import { log } from './util.js';

export function initVoice(agent) {
  const btn = document.getElementById('voiceBtn');
  if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
    btn.disabled = true;
    btn.textContent = 'No Voice';
    return;
  }
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  const rec = new SR();
  rec.lang = 'en-US';
  rec.interimResults = false;
  rec.maxAlternatives = 1;

  rec.onresult = (e) => {
    const text = e.results[0][0].transcript;
    log('Voice: ' + text);
    parseAndExecute(agent, text);
  };
  rec.onerror = (e) => log('Voice error ' + e.error);
  btn.addEventListener('click', () => {
    rec.start();
    log('Listening...');
  });
}
