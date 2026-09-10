export function getFirstImage(val) {
  if (!val) return null;
  if (typeof val === 'string') {
    // Basic extraction if it happens to be an HTML string containing an image
    const match = val.match(/<img[^>]+src="([^">]+)"/);
    if (match) return match[1];
    return val;
  }
  if (Array.isArray(val) && val.length > 0) {
    return getFirstImage(val[0]);
  }
  return null;
}
