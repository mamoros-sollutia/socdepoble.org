import React from 'react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, errorInfo) {
    console.error('[PedraSeca] Error capturat pel límit de React:', error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="alert">
          <h2>No s'ha pogut carregar Sóc de Poble</h2>
          <p>Torna a carregar la pàgina. Si continua, avisa l'administrador del lloc.</p>
          <pre>{this.state.error?.toString()}</pre>
        </div>
      );
    }
    return this.props.children;
  }
}
