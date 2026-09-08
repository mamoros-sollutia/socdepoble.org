// El xat és text pla; l’editor de notes espera HTML.
const escapeHtml = value => String(value ?? '').replace(/[&<>"']/g, char => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
}[char]));

export function noteFromMessages(thread, messages) {
  if (!messages.length) throw new Error('Selecciona almenys un missatge.');
  return {
    title: escapeHtml(`Xat: ${thread.name || thread.title || 'Conversa'}`),
    content: messages.map(message => {
      const author = message.sender === 'me' ? 'Jo' : message.author || message.author_name || 'Usuari';
      const time = message.time_label ? ` · ${message.time_label}` : '';
      const text = escapeHtml(message.text ?? message.content ?? '').replace(/\r?\n/g, '<br>');
      return `<p><strong>${escapeHtml(author + time)}</strong></p><p>${text}</p>`;
    }).join('')
  };
}
