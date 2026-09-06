import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';

const createOrganization = vi.fn(async (d) => ({ id: 'org9', name: d.name, kind: 'group', role: 'owner' }));
vi.mock('/home/claude/repo/src/data/backendPort.js', () => ({
  getCurrentUser: () => ({ id: 'u1', user_metadata: { name: 'Javi' } }),
  listMyOrganizations: async () => [],
  getProfile: async () => ({ full_name: 'Javi', avatar_url: null }),
  updateProfile: async () => ({}), updateOrganization: async () => ({}),
  updateUserPassword: async () => ({}), logout: async () => {}, createOrganization,
}));
vi.mock('/home/claude/repo/src/components/layout/AppGridShell.css?inline', () => ({ default: '' }));
Object.defineProperty(HTMLElement.prototype, 'clientWidth', {
  configurable: true, get() { return this.classList?.contains('app-grid-page') ? 1400 : 0; },
});
global.ResizeObserver = class { observe() {} disconnect() {} };

const { PerfilProvider } = await import('/home/claude/repo/src/sections/profile/PerfilContext.jsx');
const AppGridShell = (await import('/home/claude/repo/src/components/layout/AppGridShell.jsx')).default;
const SelectorIdentitat = (await import('/home/claude/repo/src/sections/profile/SelectorIdentitat.jsx')).default;

describe('AppGridColumn: el boto "+"', () => {
  it('es pinta a la capcalera i executa una accio real', async () => {
    render(
      <PerfilProvider config={{}}>
        <AppGridShell leftColumn={<SelectorIdentitat />} middleColumn={<i />} rightColumn={<i />} />
      </PerfilProvider>
    );
    await act(async () => { await Promise.resolve(); });

    const mes = screen.getByLabelText('Crear una empresa o un grup');
    const cap = document.querySelector('.app-grid-col-header');
    console.log('\n  ordre dins de la capcalera:',
      [...cap.querySelectorAll('*')].filter(e => e.tagName === 'SPAN' || e.tagName === 'BUTTON')
        .map(e => e.tagName === 'BUTTON' ? `[${e.getAttribute('aria-label') || 'plec'}]` : e.textContent).join(' '));
    console.log('  "+" desactivat?:', mes.disabled);

    await act(async () => { fireEvent.click(mes); });
    console.log('  createOrganization cridat:', createOrganization.mock.calls.length, 'volta(es)');
    console.log('  identitats visibles ara  :',
      [...document.querySelectorAll('.perfil-identitat-nom')].map(e => e.textContent), '\n');

    expect(createOrganization).toHaveBeenCalledTimes(1);
  });

  it('un "+" sense accio ix desactivat, no mut', async () => {
    const AppGridColumn = (await import('/home/claude/repo/src/components/layout/AppGridColumn.jsx')).default;
    const Icona = (p) => <span {...p} />;
    render(<AppGridColumn titol="X" accions={[{ id: 'a', icona: Icona, etiqueta: 'Sense accio' }]} />);
    const b = screen.getByLabelText('Sense accio');
    console.log('  boto sense onAcciona -> disabled =', b.disabled, '\n');
    expect(b.disabled).toBe(true);
  });
});
