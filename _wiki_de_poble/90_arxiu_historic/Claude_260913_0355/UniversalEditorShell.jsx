import { useCallback, useEffect, useRef } from 'react';
import { PageFrame } from './PageFrame';
import { EditorErrorBoundary } from './editor/EditorErrorBoundary.jsx';
import { EditableField } from './editor/EditableField.jsx';
import { useEditorShell } from './editor/useEditorShell.js';

export { EditableField, useEditorShell };

const CAMPS = [
  { camp: 'title', ranura: 'title', classe: 'editor-title-input', marcador: 'Títol…', etiqueta: 'Títol' },
  { camp: 'subtitle', ranura: 'subtitle', classe: 'editor-subtitle-input', marcador: 'Subtítol opcional…', etiqueta: 'Subtítol' },
  { camp: 'lead', ranura: 'lead', classe: 'editor-lead-input', marcador: 'Entradeta opcional…', etiqueta: 'Entradeta' }
];

/**
 * UniversalEditorShell — closca d'edició incrustable.
 *
 * CONTRACTE AMB L'HOSTE
 *   id            identificador de la fitxa que s'edita. OBLIGATORI: és
 *                 el que fa que, en canviar de fitxa, els temporitzadors
 *                 pendents es buiden contra la fitxa CORRECTA.
 *   onLocalChange (camp, valor)  → estat local, cada tecla
 *   onSaveField   (camp, valor)  → persistència, amb retard
 *   onNotify      (missatge, mena) → avisos. La closca no coneix cap
 *                 sistema d'avisos: si l'hoste no en passa cap, calla.
 *
 * PROTOCOL DE DESAT (tres xarxes, cap solapada)
 *   1 · retard de `debounceMs` per camp
 *   2 · `blur` → desa immediat
 *   3 · `pagehide` i desmuntatge → buidatge de tot el que estiga pendent
 *
 * El desmuntatge NO deixa mai temporitzadors vius: abans, tancar una nota
 * dins dels 800 ms deixava una crida a la xarxa orfe apuntant a una fitxa
 * que ja no hi era.
 */
export function UniversalEditorShell({
  id,
  titleHtml,
  subtitleHtml,
  leadHtml,
  onSaveField,
  onLocalChange,
  onNotify,
  heroImage,
  logoImage,
  topBar,
  children,
  isPublished = false,
  formattedTime,
  formattedDate,
  dateTime,
  showStatusToggle = true,
  previewTitle,
  previewHelp,
  autoHeight = false,
  className = ''
}) {
  const temporitzadors = useRef(new Map());
  const pendents = useRef(new Map());

  /* Les crides de l'hoste solen ser fletxes en línia: canvien d'identitat
     cada pintada. Guardades en una referència, els efectes de baix depenen
     només d'`id` i no es desmunten a cada tecla. */
  const saveRef = useRef(onSaveField);
  saveRef.current = onSaveField;

  const buida = useCallback((idFitxa) => {
    for (const [clau, temporitzador] of temporitzadors.current) {
      if (!clau.startsWith(`${idFitxa}::`)) continue;
      clearTimeout(temporitzador);
      temporitzadors.current.delete(clau);
      const pendent = pendents.current.get(clau);
      pendents.current.delete(clau);
      if (pendent) saveRef.current?.(pendent.camp, pendent.valor);
    }
  }, []);

  const handleFieldChange = useCallback((camp, valor) => {
    onLocalChange?.(camp, valor);
    if (!id) return;

    const clau = `${id}::${camp}`;
    pendents.current.set(clau, { camp, valor });
    clearTimeout(temporitzadors.current.get(clau));
    temporitzadors.current.set(clau, setTimeout(() => {
      temporitzadors.current.delete(clau);
      pendents.current.delete(clau);
      saveRef.current?.(camp, valor);
    }, 800));
  }, [id, onLocalChange]);

  const handleFieldBlur = useCallback((camp, valor) => {
    if (!id) return;
    const clau = `${id}::${camp}`;
    clearTimeout(temporitzadors.current.get(clau));
    temporitzadors.current.delete(clau);
    pendents.current.delete(clau);
    saveRef.current?.(camp, valor);
  }, [id]);

  useEffect(() => {
    if (!id) return undefined;
    const buidaAra = () => buida(id);
    window.addEventListener('pagehide', buidaAra);
    return () => {
      window.removeEventListener('pagehide', buidaAra);
      buidaAra();
    };
  }, [id, buida]);

  const { topBarData } = useEditorShell({
    onSaveField,
    heroImage,
    logoImage,
    isPublished,
    formattedTime,
    formattedDate,
    dateTime,
    showStatusToggle,
    previewTitle,
    previewHelp,
    onNotify
  });

  const valors = { title: titleHtml, subtitle: subtitleHtml, lead: leadHtml };
  const ranures = {};
  for (const { camp, ranura, classe, marcador, etiqueta } of CAMPS) {
    ranures[ranura] = (
      <EditableField
        key={`${id ?? 'sense-id'}-${camp}`}
        className={classe}
        html={valors[camp]}
        placeholder={marcador}
        label={etiqueta}
        multiline={camp === 'lead'}
        onChange={(val) => handleFieldChange(camp, val)}
        onBlur={(val) => handleFieldBlur(camp, val)}
      />
    );
  }

  const classes = ['editor-shell--main', autoHeight && 'editor-shell--auto', className]
    .filter(Boolean).join(' ');

  return (
    <EditorErrorBoundary onError={(err) => onNotify?.(err?.message || 'Error a l\'editor', 'error')}>
      <section className={classes}>
        {topBar}
        <div className="editor-scroll-area">
          <PageFrame
            chrome="context"
            variant="embed"
            title={ranures.title}
            subtitle={ranures.subtitle}
            lead={ranures.lead}
            topBarData={topBarData}
          >
            {children}
          </PageFrame>
        </div>
      </section>
    </EditorErrorBoundary>
  );
}

export default UniversalEditorShell;
