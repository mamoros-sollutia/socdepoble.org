import { describe, expect, it } from 'vitest';
import { extractPlainText, prepareContentForRender } from './contentAdapter.js';

describe('contentAdapter', () => {
  it('extrau text real, descodifica entitats i elimina contingut prohibit', () => {
    const html = '<h2>L\'horta &amp; el mas</h2><script>furt()</script><p>Terra&nbsp;viva</p>';

    expect(extractPlainText(html, Infinity)).toBe("L'horta & el mas Terra viva");
  });

  it('trunca per paraules només quan hi ha un límit finit', () => {
    expect(extractPlainText('<p>u dos tres quatre</p>', 10)).toBe('u dos...');
    expect(extractPlainText('<p>u dos tres quatre</p>', Infinity)).toBe('u dos tres quatre');
  });

  it('saneja l’HTML abans de renderitzar-lo', () => {
    expect(prepareContentForRender('<p>bé</p><iframe src="https://example.com"></iframe>')).toBe('<p>bé</p>');
  });
});
