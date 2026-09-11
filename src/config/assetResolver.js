const normalizeText = (value) =>
  String(value || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, ' ')
    .trim();

const TOWN_FALLBACK_IMAGES = [
  '/assets/img/hero_panoramic_landscape_1774710654078.png',
  '/assets/img/hero_panoramic_rural_view_1774720664221.png',
  '/assets/img/art_trellat_farmer_1774708525806.png',
  '/assets/img/nano_mercat_llaurador_1774197050578.png',
  '/assets/img/aplec_danses_1774952191348.png',
  '/assets/img/nano_mel_font_roja_1774216345755.png',
  '/assets/img/art_trellat_v2_1774708257858.png',
  '/assets/img/hero_serrella_comic_1774709602282.png',
  '/assets/img/nano_oli_oliva_1774198089084.png'
];

function pickDeterministicImage(seed, options) {
  const list = options.filter(Boolean);
  if (list.length === 0) return TOWN_FALLBACK_IMAGES[0];

  const text = String(seed || '');
  let hash = 0;
  for (let index = 0; index < text.length; index += 1) {
    hash = (hash * 31 + text.charCodeAt(index)) >>> 0;
  }

  return list[hash % list.length];
}

export function resolveAsset(path, basePath = '/', pluginUrl = '', version = '') {
  if (!path) return '';
  if (/^(?:https?:\/\/|data:|blob:)/i.test(path)) return path;
  
  let base = String(basePath || '').replace(/\/$/, '');
  if (base === '/') base = '';
  if (pluginUrl) {
    base = String(pluginUrl).replace(/\/$/, '');
  }

  if (typeof path !== 'string') {
    path = String(path);
  }
  path = path.replace(/^\/+/, '');
  
  const separator = path.includes('?') ? '&' : '?';
  const query = version ? `${separator}v=${version}` : '';
  
  return base ? `${base}/${path}${query}` : `/${path}${query}`;
}

function resolveTownImageUrl(value, context = '', seed = '', basePath = '/', pluginUrl = '', version = '') {
  const raw = String(value || '').trim();
  const text = normalizeText(`${raw} ${context}`);

  if (/^https?:\/\//i.test(raw)) return raw;
  if (
    raw &&
    !raw.startsWith('/assets/uploads/poble/') &&
    !raw.startsWith('/assets/img/') &&
    !raw.startsWith('/assets/images/towns/')
  ) {
    return resolveAsset(raw, basePath, pluginUrl, version);
  }

  if (text.includes('benifallim')) return resolveAsset('/assets/img/hero_panoramic_landscape_1774710654078.png', basePath, pluginUrl, version);
  if (text.includes('sella')) return resolveAsset('/assets/img/nano_mercat_llaurador_1774197050578.png', basePath, pluginUrl, version);
  if (text.includes('orxeta')) return resolveAsset('/assets/img/aplec_danses_1774952191348.png', basePath, pluginUrl, version);
  if (text.includes('relleu')) return resolveAsset('/assets/img/nano_mel_font_roja_1774216345755.png', basePath, pluginUrl, version);
  if (text.includes('alcoleja')) return resolveAsset('/assets/img/art_trellat_v2_1774708257858.png', basePath, pluginUrl, version);
  if (text.includes('xixona')) return resolveAsset('/assets/img/hero_serrella_comic_1774709602282.png', basePath, pluginUrl, version);
  if (text.includes('tibi')) return resolveAsset('/assets/img/nano_oli_oliva_1774198089084.png', basePath, pluginUrl, version);
  if (raw.startsWith('/assets/images/towns/')) return resolveAsset(pickDeterministicImage(seed || text, TOWN_FALLBACK_IMAGES), basePath, pluginUrl, version);

  return resolveAsset(pickDeterministicImage(seed || text, TOWN_FALLBACK_IMAGES), basePath, pluginUrl, version);
}

export { resolveTownImageUrl, TOWN_FALLBACK_IMAGES };

