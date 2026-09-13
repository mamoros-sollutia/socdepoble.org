/**
 * UniversalManager.jsx — ÀLIES DEPRECAT
 *
 * L'antiga graella de 3 columnes s'ha consolidat dins de `UniversalWorkspace`.
 * Aquest fitxer només manté la compatibilitat dels imports existents.
 *
 * @deprecated Usa `UniversalWorkspace` de '../workspace/UniversalWorkspace.jsx'.
 */
import { UniversalWorkspace } from '../workspace/UniversalWorkspace.jsx';

export function UniversalManager({ renderDetail, ...rest }) {
  return <UniversalWorkspace {...rest} renderEditor={renderDetail} />;
}

export default UniversalManager;
