import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';

export function AvisadorEfimer({ missatge, durada = 3000, onClose }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      if (onClose) onClose();
    }, durada);
    return () => clearTimeout(timer);
  }, [durada, onClose]);

  if (!visible) return null;

  return (
    <div 
      className="sdp-avisador-efimer"
      role="alert" 
      aria-live="assertive"
      style={{
        position: 'fixed',
        bottom: 'var(--sdp-space-6)',
        left: '50%',
        transform: 'translateX(-50%)',
        backgroundColor: 'var(--sdp-fons-invers)',
        color: 'var(--sdp-text-invers)',
        padding: 'var(--sdp-space-3) var(--sdp-space-5)',
        borderRadius: 'var(--sdp-radi-pill, 9999px)',
        boxShadow: 'var(--sdp-ombra-2)',
        zIndex: 9999,
        fontWeight: '500',
        transition: 'opacity 0.3s ease',
        pointerEvents: 'none'
      }}
    >
      {missatge}
    </div>
  );
}

let sharedRoot = null;
let sharedContainer = null;

export function showToast(missatge, durada = 3000) {
  if (typeof document === 'undefined') return;
  
  // Neteja qualsevol timer pendent de destrucció
  if (sharedContainer && sharedContainer.__destroyTimer) {
    clearTimeout(sharedContainer.__destroyTimer);
    sharedContainer.__destroyTimer = null;
  }
  
  if (!sharedContainer || !sharedContainer.isConnected) {
    let target = null;
    const sdpElement = document.querySelector('soc-de-poble');
    if (sdpElement && sdpElement.shadowRoot) {
      target = sdpElement.shadowRoot.querySelector('.sdp-root');
    }
    if (!target) {
      target = document.querySelector('.sdp-root') || document.getElementById('socdepoble-app') || document.body;
    }
    
    if (sharedRoot) {
      try { sharedRoot.unmount(); } catch (e) { /* ignore */ }
      sharedRoot = null;
    }
    if (sharedContainer && sharedContainer.parentNode) {
      sharedContainer.parentNode.removeChild(sharedContainer);
    }
    
    sharedContainer = document.createElement('div');
    target.appendChild(sharedContainer);
    sharedRoot = createRoot(sharedContainer);
    
    renderToast();
    return;
  }
  
  renderToast();
  
  function renderToast() {
    if (!sharedRoot) return;
    sharedRoot.render(
      <AvisadorEfimer 
        missatge={missatge} 
        durada={durada} 
        onClose={() => {
          if (sharedContainer) {
            sharedContainer.__destroyTimer = setTimeout(() => {
              if (sharedRoot) {
                try { sharedRoot.render(null); } catch (e) { /* ignore */ }
              }
            }, 300);
          }
        }}
      />
    );
  }
}

export function destroyToastSystem() {
  if (sharedContainer && sharedContainer.__destroyTimer) {
    clearTimeout(sharedContainer.__destroyTimer);
    sharedContainer.__destroyTimer = null;
  }
  if (sharedRoot) {
    try { sharedRoot.unmount(); } catch (e) { /* ignore */ }
    sharedRoot = null;
  }
  if (sharedContainer && sharedContainer.parentNode) {
    sharedContainer.parentNode.removeChild(sharedContainer);
  }
  sharedContainer = null;
}
