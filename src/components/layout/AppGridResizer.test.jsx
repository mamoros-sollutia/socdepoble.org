import { expect, test } from 'vitest';
import { clampGridSize, gridSizeFromKey } from './AppGridResizer.jsx';

test('limita qualsevol amplària al contracte de la columna', () => {
  expect(clampGridSize(120, 200, 420)).toBe(200);
  expect(clampGridSize(300, 200, 420)).toBe(300);
  expect(clampGridSize(800, 200, 420)).toBe(420);
});

test("les fletxes, Home i End calculen l'amplària esperada", () => {
  expect(gridSizeFromKey('ArrowRight', 270, 200, 420)).toBe(286);
  expect(gridSizeFromKey('ArrowLeft', 270, 200, 420)).toBe(254);
  expect(gridSizeFromKey('Home', 270, 200, 420)).toBe(200);
  expect(gridSizeFromKey('End', 270, 200, 420)).toBe(420);
  expect(gridSizeFromKey('Enter', 270, 200, 420)).toBeNull();
});
