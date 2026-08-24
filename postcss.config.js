import prefixer from 'postcss-prefix-selector';

export default {
  plugins: [
    prefixer({
      prefix: '.sdp-root',
      transform(prefix, selector, prefixedSelector, filePath, rule) {
        if (selector === ':root') {
          return prefix; // Transform :root to .sdp-root
        }
        if (selector.startsWith(':root[')) {
          return selector.replace(':root', prefix); // Transform :root[data-theme="dark"] to .sdp-root[data-theme="dark"]
        }
        if (selector === 'body' || selector === 'html') {
          return prefix; // Transform body/html to .sdp-root
        }
        if (selector.startsWith(':host')) {
          return selector; // Do not prefix :host in Shadow DOM
        }
        if (selector.startsWith(prefix)) {
          return selector;
        }
        return prefixedSelector;
      },
    }),
  ],
};
