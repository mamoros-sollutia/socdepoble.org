const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function normalizeSlug(value = '') {
  return String(value)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function validateRegistration({ name, email, password }) {
  const errors = {};
  const cleanName = String(name || '').trim();
  const cleanEmail = String(email || '').trim();

  if (cleanName.length < 2) {
    errors.name = 'Escriu el teu nom complet.';
  } else if (cleanName.length > 120) {
    errors.name = 'El nom no pot superar els 120 caràcters.';
  }

  if (!EMAIL_PATTERN.test(cleanEmail)) {
    errors.email = 'Escriu un correu electrònic vàlid.';
  }

  if (String(password || '').length < 10) {
    errors.password = 'Utilitza almenys 10 caràcters.';
  }

  return errors;
}

export function validateOrganization(organization) {
  const errors = {};
  const name = String(organization?.name || '').trim();
  const slug = String(organization?.slug || '').trim();
  const description = String(organization?.description || '').trim();

  if (name.length < 2 || name.length > 120) {
    errors.name = 'El nom ha de tindre entre 2 i 120 caràcters.';
  }
  if (!SLUG_PATTERN.test(slug)) {
    errors.slug = 'L’identificador només pot contindre lletres, números i guionets.';
  }
  if (description.length > 500) {
    errors.description = 'La descripció no pot superar els 500 caràcters.';
  }

  return errors;
}

export function findSeedOrganization(organizations, blueprint, parentId = undefined) {
  return (organizations || []).find((organization) => (
    organization.kind === blueprint.kind
    && (parentId === undefined || organization.parent_organization_id === parentId)
  )) || null;
}

export function readableBackendError(error) {
  const original = String(error?.message || error || 'S’ha produït un error inesperat.');
  const payload = original.replace(/^Supabase\s+\d+:\s*/i, '');
  try {
    const parsed = JSON.parse(payload);
    return parsed.message || parsed.error_description || original;
  } catch {
    return original;
  }
}
