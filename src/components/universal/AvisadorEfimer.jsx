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
  
  if (!sharedContainer) {
    const target = document.getElementById('socdepoble-app') || document.body;
    sharedContainer = document.createElement('div');
    target.appendChild(sharedContainer);
    sharedRoot = createRoot(sharedContainer);
  }
  
  sharedRoot.render(
    <AvisadorEfimer 
      missatge={missatge} 
      durada={durada} 
      onClose={() => {
        setTimeout(() => {
          sharedRoot.render(null);
        }, 300); // Wait for transition if any
      }}
    />
  );
}
