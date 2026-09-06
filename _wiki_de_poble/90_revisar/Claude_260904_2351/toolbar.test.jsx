import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';

vi.mock('/home/claude/repo/src/app/AppDataContext.jsx', () => ({
  useAppData: () => ({
    t: (k, d) => d ?? k,
    language: 'va',
    normalizeSearchText: (v) => String(v ?? '').toLowerCase(),
    notes: [], noteFolders: [],
    updateNote: () => {},
    sendSectionSubmission: async () => ({}),
    externalConfig: {},
  }),
}));
vi.mock('/home/claude/repo/src/components/layout/AppGridShell.css?inline', () => ({ default: '' }));

Object.defineProperty(HTMLElement.prototype, 'clientWidth', {
  configurable: true,
  get() { return this.classList?.contains('app-grid-page') ? 500 : 0; },
});
global.ResizeObserver = class { observe() {} disconnect() {} };

const AppGridShell = (await import('/home/claude/repo/src/components/layout/AppGridShell.jsx')).default;
const NotesToolbar = (await import('/home/claude/repo/src/sections/notes/NotesToolbar.jsx')).default;
const { NotesProvider } = await import('/home/claude/repo/src/sections/notes/NotesContext.jsx');

describe('P0-1 — boto "Tornar a la llista" en mobil', () => {
  it('canvia el panell obert en compte de petar', () => {
    const errors = [];
    const onerror = (e) => { errors.push(e.error?.message || e.message); };
    window.addEventListener('error', onerror);

    const { container } = render(
      <NotesProvider>
        <AppGridShell
          leftColumn={<i />}
          middleColumn={<i />}
          rightColumn={<NotesToolbar editor={null} />}
          leftTitle="CARPETES"
          middleTitle="NOTES"
        />
      </NotesProvider>
    );

    const actiu = () => {
      const b = container.querySelector('.app-grid-header-btn.active');
      return b ? b.textContent : 'cap';
    };
    console.log('\n  panell actiu abans del clic :', actiu());

    act(() => { fireEvent.click(screen.getByLabelText('Tornar a la llista')); });

    console.log('  panell actiu despres del clic:', actiu());
    console.log('  errors llancats             :', errors.length ? errors : 'cap', '\n');

    window.removeEventListener('error', onerror);
    expect(errors).toEqual([]);
    expect(actiu()).toBe('NOTES');
  });
});
