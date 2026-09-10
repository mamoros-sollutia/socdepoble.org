/**
 * Dropdown.jsx
 * Trasllat literal des d'UniversalElements.jsx (260910). Cap canvi de comportament.
 */
import { useState } from 'react';

export function Dropdown({ trigger, children, className = '', right = false, minWidth = '200px' }) {
  const [isOpen, setIsOpen] = useState(false);
  
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setIsOpen(!isOpen);
    } else if (e.key === 'Escape' && isOpen) {
      setIsOpen(false);
    }
  };
  
  return (
    <div className={`sp-dropdown-wrapper ${className}`}>
      <div 
        className="sp-dropdown-trigger"
        role="button"
        tabIndex={0}
        aria-haspopup="true"
        aria-expanded={isOpen}
        onClick={() => setIsOpen(!isOpen)} 
        onKeyDown={handleKeyDown}
        onBlur={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget)) {
            setTimeout(() => setIsOpen(false), 200);
          }
        }}
      >
        {trigger}
      </div>
      {isOpen && (
        <div 
          className={`xat-header-dropdown ${right ? 'xat-header-dropdown--right' : 'xat-header-dropdown--left'}`} 
          style={{ minWidth }} 
        >
          {children}
        </div>
      )}
    </div>
  );
}

export function DropdownItem({ children, onClick, className = '', icon }) {
  return (
    <button 
      type="button" 
      className={`xat-dropdown-item ue-flex-center-8 ue-w-full ${className}`} 
      onClick={onClick} 
    >
      {icon && <span className="ue-flex-center">{icon}</span>}
      {children}
    </button>
  );
}
