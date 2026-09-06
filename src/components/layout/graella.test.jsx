import { describe, it, expect, vi } from 'vitest';
import { StrictMode } from 'react';
import { render, act } from '@testing-library/react';

vi.mock('/home/claude/repo/src/components/layout/AppGridShell.css?inline', () => ({ default: '' }));

let amplada = 1400;
Object.defineProperty(HTMLElement.prototype, 'clientWidth', {
  configurable: true,
  get() { return this.classList?.contains('app-grid-page') ? amplada : 0; },
});
global.ResizeObserver = class { observe() {} disconnect() {} };

const AppGridShell = (await import('/home/claude/repo/src/components/layout/AppGridShell.jsx')).default;

const munta = (w) => {
  amplada = w;
  const { container } = render(
    <StrictMode>
      <AppGridShell leftColumn={<i>E</i>} middleColumn={<i>C</i>} rightColumn={<i>D</i>} initialPane="left" />
    </StrictMode>
  );
  return container;
};

describe('AppGridShell', () => {
  it('mesura i decideix la disposició', () => {
    for (const w of [1400, 900, 500]) {
      const c = munta(w);
      const shell = c.querySelector('.app-grid-shell');
      const btns = [...c.querySelectorAll('.app-grid-header-btn')];
      const actiu = btns.find((b) => b.className.includes('active'));
      console.log(`  amplada=${w}px -> data-layout="${shell.getAttribute('data-layout')}" ` +
        `botons=${btns.length} actiu=${actiu ? actiu.textContent : 'cap'}`);
    }
  });

  it('les 3 columnes queden al DOM pero les tancades son inert', () => {
    const c = munta(500);
    const cols = [...c.querySelectorAll('.app-grid-column')];
    console.log(`\n  columnes al DOM (estret): ${cols.length}`);
    for (const col of cols) {
      console.log(`   ${col.id.padEnd(18)} inert=${col.hasAttribute('inert')} ` +
        `aria-hidden=${col.getAttribute('aria-hidden')} hidden=${col.hidden}`);
    }
    expect(cols.length).toBe(3);
    expect(cols.filter((x) => x.hasAttribute('inert')).map((x) => x.id))
      .toEqual(['app-grid-sidebar', 'app-grid-list']);
  });

  it('quan el contenidor mesura 0px (primera pintada) decideix "estret"', () => {
    const c = munta(0);
    const l = c.querySelector('.app-grid-shell').getAttribute('data-layout');
    console.log(`\n  clientWidth=0 -> data-layout="${l}"  (esperat per a un iPad: "ample")`);
    expect(l).toBe('estret');
  });
});
