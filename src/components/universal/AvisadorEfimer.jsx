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
        boxShadow: 'var(--sdp-ombra-2, 0 4px 6px rgba(0,0,0,0.1))',
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

export function showToast(missatge, durada = 3000) {
  if (typeof document === 'undefined') return;
  const container = document.createElement('div');
  document.body.appendChild(container);
  
  const root = createRoot(container);
  root.render(
    <AvisadorEfimer 
      missatge={missatge} 
      durada={durada} 
      onClose={() => {
        setTimeout(() => {
          root.unmount();
          if (container.parentNode) {
            container.parentNode.removeChild(container);
          }
        }, 300); // Wait for transition if any
      }}
    />
  );
}
