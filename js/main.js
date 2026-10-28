import { startApp } from './app.js';
import { JOURNEY_STOPS } from './content/journey-stops.js';
import { MESSAGES } from './content/messages.js';
import { PEOPLE } from './content/people.js';

const statusMessage = document.querySelector('[data-slot="status-message"]');

try {
  startApp({ messages: MESSAGES, stops: JOURNEY_STOPS, people: PEOPLE });
  statusMessage?.remove();
} catch (error) {
  console.error(error);
  if (statusMessage) {
    statusMessage.textContent = MESSAGES.startupError;
    statusMessage.classList.add('status-message--error');
  }
}
