/**
 * Accordion.jsx
 * Trasllat literal des d'UniversalElements.jsx (260910). Cap canvi de comportament.
 */
import { useState } from 'react';

export function Accordion({ children, className = '' }) {
  return <div className={`accordion ${className}`}>{children}</div>;
}

export function AccordionItem({ title, children, defaultOpen = false, className = '' }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <div className={`accordion-item ${className}`} style={{ borderBottom: '1px solid var(--sdp-vora)' }}>
      <button 
        type="button"
        className={`accordion-header ue-accordion-header-btn ${isOpen ? 'active' : ''}`} 
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <span>{title}</span>
        <svg fill="none" height="20" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 20 20" width="20" style={{ transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </button>
      {isOpen && (
        <div className="ue-accordion-body-pd">
          {children}
        </div>
      )}
    </div>
  );
}
