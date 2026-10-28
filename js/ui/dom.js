export function getRequiredElement(root, selector) {
  const element = root.querySelector(selector);
  if (!element) throw new Error(`Missing element "${selector}" in the page.`);
  return element;
}

export function getSlot(root, slotName) {
  return getRequiredElement(root, `[data-slot="${slotName}"]`);
}

// Fills every [data-text="section.key"] element with the matching entry from the messages object.
export function fillTextSlots(root, messages) {
  root.querySelectorAll('[data-text]').forEach((element) => {
    element.textContent = readMessage(messages, element.dataset.text);
  });
}

function readMessage(messages, path) {
  const text = path.split('.').reduce((section, key) => section?.[key], messages);
  if (typeof text !== 'string') throw new Error(`No message found at "${path}".`);
  return text;
}
