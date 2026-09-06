import { describe, expect, it } from 'vitest';
import {
  findSeedOrganization,
  normalizeSlug,
  readableBackendError,
  validateOrganization,
  validateRegistration
} from '../../src/sections/onboarding/onboardingModel.js';

describe('onboardingModel', () => {
  it('normalitza identificadors valencians sense deixar caràcters insegurs', () => {
    expect(normalizeSlug('  Sóc de Poble! ')).toBe('soc-de-poble');
    expect(normalizeSlug('El Rentonar / Grup')).toBe('el-rentonar-grup');
  });

  it('rebutja registres incomplets i contrasenyes curtes', () => {
    expect(validateRegistration({ name: 'A', email: 'correu', password: 'curta' })).toEqual({
      name: 'Escriu el teu nom complet.',
      email: 'Escriu un correu electrònic vàlid.',
      password: 'Utilitza almenys 10 caràcters.'
    });
  });

  it('accepta el blueprint de les dues organitzacions', () => {
    expect(validateOrganization({ name: 'Sóc de Poble', slug: 'soc-de-poble', description: '' })).toEqual({});
    expect(validateOrganization({ name: 'Rentonar', slug: 'rentonar', description: '' })).toEqual({});
  });

  it('troba el grup només davall de la seua empresa', () => {
    const rows = [{ id: 'group-id', kind: 'group', slug: 'rentonar', parent_organization_id: 'company-id' }];
    expect(findSeedOrganization(rows, { kind: 'group', slug: 'rentonar' }, 'company-id')?.id).toBe('group-id');
    expect(findSeedOrganization(rows, { kind: 'group', slug: 'rentonar' }, 'other-id')).toBeNull();
  });

  it('extrau el missatge segur del cos d’error de Supabase', () => {
    const error = new Error('Supabase 400: {"message":"Identificador ocupat"}');
    expect(readableBackendError(error)).toBe('Identificador ocupat');
  });
});
