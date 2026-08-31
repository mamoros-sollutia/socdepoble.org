/**
 * sollutiaBridge.js
 * 
 * Pont de comunicació bidireccional amb el dashboard o plataforma de Sollutia.
 * Emmutleix o s'enllaça amb les APIs del pare (com `postMessage` per a iframes).
 */

class SollutiaBridge {
  constructor() {
    this.subscribers = new Set();
    this.isActive = Boolean(window.SOLLUTIA_ENV);
    
    if (this.isActive) {
      window.addEventListener('message', this.handleMessage.bind(this));
      console.log('✅ [SollutiaBridge] Connectat i escoltant.');
    }
  }

  handleMessage(event) {
    // Validar origen si escau: if (event.origin !== 'https://sollutia.com') return;
    
    try {
      const data = event.data;
      if (data && data.type) {
        this.notifySubscribers(data);
      }
    } catch (e) {
      console.error('[SollutiaBridge] Missatge malmès:', e);
    }
  }

  subscribe(callback) {
    this.subscribers.add(callback);
    return () => this.subscribers.delete(callback);
  }

  notifySubscribers(payload) {
    for (const cb of this.subscribers) {
      cb(payload);
    }
  }

  sendToDashboard(type, payload) {
    if (!this.isActive) return;
    
    // Envia missatge cap amunt (parent window)
    window.parent.postMessage({
      source: 'soc-de-poble',
      type,
      payload
    }, '*'); // En prod, canviar '*' pel domini de Sollutia
  }
}

export const sollutiaBridge = new SollutiaBridge();
