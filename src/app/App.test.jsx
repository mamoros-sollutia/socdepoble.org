import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import PedraSecaEmbed from '../PedraSecaEmbed';

describe('App Component', () => {
  it('renders without crashing', () => {
    const config = { routerType: 'memory' };
    const { container } = render(<PedraSecaEmbed config={config} />);
    expect(container).toBeTruthy();
  });
});
