import { Component } from 'react';

/**
 * EditorErrorBoundary — talla-focs de la closca d'edició.
 *
 * Una avaria dins del motor no pot tombar la pàgina hoste. `onError` deixa
 * que qui incruste la closca (l'Escriptori de Sollutia, posem per cas) se
 * n'assabente sense que ací dins hi haja cap dependència del seu sistema
 * d'avisos.
 */
export class EditorErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { haFallat: false };
  }

  static getDerivedStateFromError() {
    return { haFallat: true };
  }

  componentDidCatch(error, info) {
    console.error('EditorErrorBoundary:', error, info);
    this.props.onError?.(error, info);
  }

  render() {
    if (!this.state.haFallat) return this.props.children;

    return (
      <div className="sdp-estat sdp-estat--error">
        <div className="sdp-estat__contenidor">
          <h3 className="sdp-estat__titol">L'editor s'ha aturat</h3>
          <p className="sdp-estat__descripcio">
            El motor d'edició ha trobat un error. Torna a carregar la pàgina;
            els canvis desats fins ara continuen al servidor.
          </p>
        </div>
      </div>
    );
  }
}

export default EditorErrorBoundary;
