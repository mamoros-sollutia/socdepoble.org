import { resolveAsset } from '../../config/assetResolver';
import { useNavigate, Link } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import { useAppData } from '../../app/AppDataContext';
import { showToast } from './AvisadorEfimer';
import { useContent, ContentProvider } from './ContentProvider';

export { useContent, ContentProvider };

const PAGE_CHROME_MODES = new Set(['none', 'page', 'context', 'full', 'system']);

function isSafeUrl(url) {
  if (!url) return false;
  try {
    const u = new URL(url, window.location.origin);
    return u.protocol === 'http:' || u.protocol === 'https:';
  } catch {
    return false;
  }
}

function isValidDate(dd, mm, yy) {
  const d = new Date(yy, mm - 1, dd);
  return d.getFullYear() === Number(yy) && 
         d.getMonth() === Number(mm) - 1 && 
         d.getDate() === Number(dd);
}

const DEFAULT_AUTHOR = {
  name: 'Sóc de Poble',
  location: 'La Torre de les Maçanes',
  avatarUrl: '/assets/system/ui/logo-socdepoble-cuadrat-verd.svg'
};




export function ActionControl({
  label,
  title = label,
  className,
  onClick,
  disabled = false,
  children
}) {
  const presentationOnly = !onClick;

  return (
    <button
      type="button"
      className={className}
      aria-label={label}
      title={title}
      onClick={onClick}
      disabled={disabled || presentationOnly}
    >
      {children}
    </button>
  );
}

export function DateTimeControl({ time, date, dateTime, label, onClick }) {
  if (!time && !date) return null;

  const accessibleLabel = label || ['Data i hora', time, date].filter(Boolean).join(': ');
  const content = (
    <>
      {time && <span>{time}</span>}
      {date && <span>{date}</span>}
    </>
  );

  if (onClick) {
    return (
      <button
        type="button"
        className="btn-date-time sp-card-time"
        aria-label={accessibleLabel}
        title={accessibleLabel}
        onClick={onClick}
      >
        {content}
      </button>
    );
  }

  return (
    <time
      className="btn-date-time sp-card-time"
      dateTime={dateTime}
      aria-label={accessibleLabel}
    >
      {content}
    </time>
  );
}

export function GlobeIcon({ className }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      <path d="M2 12h20" />
    </svg>
  );
}

export function IaiaIcon({ className }) {
  return (
    <svg
      className={className}
      viewBox="414 456 241 378"
      width="24"
      height="24"
      aria-hidden="true"
      focusable="false"
      fill="currentColor"
      style={{ willChange: 'transform' }}
    >
      <path
        style={{ fillRule: "nonzero", clipRule: "evenodd", strokeLinejoin: "round", strokeMiterlimit: 2 }}
        d="M654.322021484375,634.7418212890625L639.4090576171875,575.3836669921875C639.4090576171875,575.3836669921875,638.4949951171875,570.5927124023438,633.9271240234375,567.901123046875C629.3841552734375,565.2110595703125,583.4334716796875,537.8279418945312,583.4334716796875,537.8279418945312C581.4577026367188,536.6675415039062,579.3094482421875,535.9998779296875,577.1859741210938,535.7286376953125C576.7413940429688,535.6306762695312,576.297607421875,535.5552978515625,575.85302734375,535.5552978515625L568.7909545898438,535.5552978515625C568.8406982421875,535.4573974609375,568.8896484375,535.3338012695312,568.9884033203125,535.210205078125C574.642822265625,528.740478515625,578.0751342773438,520.2723388671875,578.0751342773438,510.9874267578125C578.0751342773438,498.5180969238281,571.8773803710938,487.4819641113281,562.3958129882812,480.8147888183594C561.679931640625,480.3204650878906,561.26025390625,479.2835998535156,561.3341064453125,478.4200744628906C561.407958984375,477.72833251953125,561.4576416015625,476.9883728027344,561.4576416015625,476.2710266113281C561.4576416015625,465.06158447265625,552.3709106445312,455.99969482421875,541.1614990234375,455.99969482421875C529.9761352539062,455.99969482421875,520.889404296875,465.08721923828125,520.889404296875,476.2710266113281C520.889404296875,476.9883728027344,520.9391479492188,477.72833251953125,521.0130004882812,478.4200744628906C521.1116943359375,479.2835998535156,520.6671142578125,480.3204650878906,519.9512329101562,480.8147888183594C510.46966552734375,487.4819641113281,504.27191162109375,498.5180969238281,504.27191162109375,510.9874267578125C504.27191162109375,520.2723388671875,507.7042236328125,528.740478515625,513.358642578125,535.210205078125C513.4573974609375,535.3338012695312,513.5071411132812,535.4573974609375,513.5809326171875,535.5552978515625L503.82733154296875,535.5552978515625C502.6427917480469,535.5552978515625,501.55621337890625,535.9260864257812,500.59320068359375,536.4444580078125C499.5804748535156,536.8152465820312,498.5684814453125,537.2598266601562,497.6303405761719,537.8279418945312L495.4820556640625,539.1361083984375L462.4942626953125,558.7412719726562C462.4942626953125,558.7412719726562,448.81475830078125,566.74072265625,446.02520751953125,568.5431518554688C442.79034423828125,570.6424560546875,441.926025390625,574.2970581054688,441.926025390625,574.2970581054688L429.8025817871094,622.4698486328125C421.99981689453125,626.0250244140625,418.4198303222656,631.9266357421875,418.4198303222656,631.9266357421875C413.95068359375,638.8651123046875,413.9996643066406,647.1372680664062,413.9996643066406,647.1372680664062L413.9996643066406,824.7174072265625C413.9996643066406,824.7174072265625,414.1978454589844,831.8050537109375,421.75341796875,831.8050537109375C429.2841491699219,831.8050537109375,429.852294921875,825.2855834960938,429.852294921875,825.2855834960938C429.852294921875,825.2855834960938,429.9751281738281,651.4821166992188,430.1484375,649.4083862304688L430.1484375,649.2109375C432.24700927734375,651.6795043945312,435.0863037109375,653.5316772460938,438.44476318359375,654.37109375C439.7777404785156,654.692138671875,441.1114807128906,654.8654174804688,442.4195861816406,654.8654174804688C449.40777587890625,654.8654174804688,455.778076171875,650.2734375,457.8517761230469,643.3349609375C458.46966552734375,645.0379638671875,458.8893737792969,647.8034057617188,459.65496826171875,652.00048828125C460.8153991699219,658.2969970703125,474.8648681640625,660.3721923828125,474.51898193359375,649.358642578125C474.14825439453125,638.322509765625,470.222412109375,633.8284912109375,465.23480224609375,627.1854248046875C464.5928039550781,626.2977905273438,463.7533874511719,625.506591796875,462.81524658203125,624.7666015625C462.74139404296875,624.7169189453125,462.6916809082031,624.6671752929688,462.6419372558594,624.6189575195312L470.4944152832031,593.3838500976562L471.0128479003906,591.334228515625L472.0745544433594,590.6922607421875L491.30902099609375,579.259765625L486.8398742675781,606.7423095703125L480.370849609375,646.4952392578125L465.062255859375,740.4703369140625C465.062255859375,744.0510864257812,467.9512634277344,746.9401245117188,471.5312805175781,746.9401245117188L494.7164611816406,746.9401245117188L494.7164611816406,817.7548828125C494.7164611816406,820.2490234375,495.3336181640625,822.61962890625,496.32147216796875,824.7174072265625C498.9384765625,830.1503295898438,504.4452209472656,833.95263671875,510.8893737792969,833.95263671875C518.1978149414062,833.95263671875,524.2968139648438,829.063720703125,526.2966918945312,822.4221801757812C526.7412719726562,820.9407958984375,527.062255859375,819.385498046875,527.062255859375,817.7548828125L527.062255859375,746.9401245117188L553.3587646484375,746.9401245117188L553.3587646484375,817.7548828125C553.3587646484375,817.9522705078125,553.4085083007812,818.1256103515625,553.4085083007812,818.2989501953125C553.7046508789062,826.9900512695312,560.790771484375,833.95263671875,569.5316772460938,833.95263671875C574.9638671875,833.95263671875,579.7788696289062,831.2369384765625,582.6920166015625,827.1136474609375C584.5690307617188,824.4461669921875,585.70458984375,821.26171875,585.70458984375,817.7548828125L585.70458984375,746.9401245117188L609.0133666992188,746.9401245117188C612.5941162109375,746.9401245117188,615.4823608398438,744.0510864257812,615.4823608398438,740.4703369140625L606.1002197265625,684.298095703125L588.4210205078125,578.4444580078125L610.0502319335938,591.334228515625L622.989013671875,642.6432495117188C624.0996704101562,647.1116333007812,627.0135498046875,650.6682739257812,630.766845703125,652.791748046875C633.13671875,654.1239624023438,635.8283081054688,654.8654174804688,638.6683349609375,654.8654174804688C639.9515991210938,654.8654174804688,641.2853393554688,654.692138671875,642.5941772460938,654.37109375C651.260498046875,652.1979370117188,656.5200805664062,643.4088134765625,654.322021484375,634.7418212890625"
      />
    </svg>
  );
}

export function SearchIcon({ className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

export function ThemeIcon({ className, mode = 'light' }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
    >
      {mode === 'dark' ? (
        <>
          <path d="M12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10Z" />
          <line x1="12" x2="12" y1="1" y2="3" />
          <line x1="12" x2="12" y1="21" y2="23" />
          <line x1="4.22" x2="5.64" y1="4.22" y2="5.64" />
          <line x1="18.36" x2="19.78" y1="18.36" y2="19.78" />
          <line x1="1" x2="3" y1="12" y2="12" />
          <line x1="21" x2="23" y1="12" y2="12" />
          <line x1="4.22" x2="5.64" y1="19.78" y2="18.36" />
          <line x1="18.36" x2="19.78" y1="5.64" y2="4.22" />
        </>
      ) : (
        <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
      )}
    </svg>
  );
}

export function BackIcon({ className }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
    >
      <path d="m12 19-7-7 7-7" />
      <path d="M19 12H5" />
    </svg>
  );
}

export function ForwardIcon({ className }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
    >
      <path d="m12 19 7-7-7-7" />
      <path d="M5 12h14" />
    </svg>
  );
}

export function IndexIcon({ className }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
    </svg>
  );
}

export function TranslateIcon({ className }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
    >
      <path d="m5 8 6 6" />
      <path d="m4 14 6-6 2-3" />
      <path d="M2 5h12" />
      <path d="M7 2h1" />
      <path d="m22 22-5-10-5 10" />
      <path d="M14 18h6" />
    </svg>
  );
}

export function CommentIcon({ className }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
    </svg>
  );
}

export function ShareIcon({ className }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
    >
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <line x1="8.59" x2="15.42" y1="13.51" y2="17.49" />
      <line x1="15.41" x2="8.59" y1="6.51" y2="10.49" />
    </svg>
  );
}

export function PinIcon({ className }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M16 11V7a4 4 0 0 0-8 0v4l-2 4h12l-2-4z" />
      <path d="M12 15v7" />
    </svg>
  );
}

export function TableOfContentsDrawer({ isOpen, onClose }) {
  const [headings, setHeadings] = useState([]);
  const rootRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;

    const rootNode = rootRef.current ? rootRef.current.getRootNode() : document;
    const domHeadings = rootNode.querySelectorAll('.page-title h1, .page-title h2, .content-wrapper h1, .content-wrapper h2, .content-wrapper h3, .content-wrapper h4, .sp-card-body h1, .sp-card-body h2, .sp-card-body h3, .sp-card-body h4');
    
    const parsedHeadings = Array.from(domHeadings).map((el, idx) => {
      // Ignoremos els visualment amagats
      if (el.classList.contains('sr-only') || el.textContent.trim() === '') return null;
      
      // Sense filtre de números per suportar targetes i pantalles sense numeració
      
      if (!el.id) {
        el.id = `toc-heading-${idx}`;
      }
      return {
        id: el.id,
        text: el.innerText || el.textContent,
        level: parseInt(el.tagName.substring(1), 10),
        element: el
      };
    }).filter(Boolean);

    setHeadings(parsedHeadings);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="toc-overlay" onClick={onClose} ref={rootRef}>
      <aside className="toc-drawer" onClick={(e) => e.stopPropagation()}>
        <div className="toc-header">
          <h2>Taula de continguts</h2>
          <button className="toc-close-btn" onClick={onClose} aria-label="Tancar taula">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        <nav className="toc-nav">
          {headings.length === 0 ? (
            <p className="toc-empty">No s'han trobat seccions.</p>
          ) : (
            <ul>
              {headings.map((h, idx) => (
                <li key={idx} className={`toc-item toc-level-${h.level}`}>
                  <button 
                    onClick={() => {
                      h.element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      onClose();
                    }}
                  >
                    {h.text}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </nav>
      </aside>
    </div>
  );
}

export function UniversalPage(props) {
  const contentContext = useContent();
  const config = contentContext?.config || {};

  const title = props.title ?? config.title;
  const subtitle = props.subtitle ?? config.subtitle;
  const lead = props.lead ?? config.lead;
  const labels = props.labels ?? config.labels ?? [];
  const copyright = props.copyright ?? config.copyright;
  const showLogos = props.showLogos ?? config.showLogos ?? false;
  const tone = props.tone ?? config.tone;
  const chrome = props.chrome ?? config.chrome ?? 'page';
  const showTopBars = props.showTopBars ?? config.showTopBars;
  const topBarData = props.topBarData ?? config.topBarData ?? {};
  const heroImage = props.heroImage ?? config.heroImage;
  const heroAlt = props.heroAlt ?? config.heroAlt ?? '';
  const authorName = props.authorName ?? config.authorName ?? DEFAULT_AUTHOR.name;
  const authorLocation = props.authorLocation ?? config.authorLocation ?? DEFAULT_AUTHOR.location;
  const authorAvatar = props.authorAvatar ?? config.authorAvatar ?? DEFAULT_AUTHOR.avatarUrl;
  const authorAvatarAlt = props.authorAvatarAlt ?? config.authorAvatarAlt ?? '';
  const time = props.time ?? config.time;
  const date = props.date ?? config.date;
  const dateTime = props.dateTime ?? config.dateTime;
  const viewerAvatarUrl = props.viewerAvatarUrl ?? config.viewerAvatarUrl ?? DEFAULT_AUTHOR.avatarUrl;
  const viewerAvatarAlt = props.viewerAvatarAlt ?? config.viewerAvatarAlt ?? 'Sóc de Poble';
  const themeMode = props.themeMode ?? config.themeMode ?? 'light';
  const onLanguage = props.onLanguage ?? config.onLanguage;
  const onIaia = props.onIaia ?? config.onIaia;
  const onSearch = props.onSearch ?? config.onSearch;
  const onTheme = props.onTheme ?? config.onTheme;
  const onProfile = props.onProfile ?? config.onProfile ?? (() => navigate('/el-meu-perfil'));
  const onBack = props.onBack ?? config.onBack;
  const onForward = props.onForward ?? config.onForward;
  const onIndex = props.onIndex ?? config.onIndex;
  const onTranslate = props.onTranslate ?? config.onTranslate;
  const onComment = props.onComment ?? config.onComment;
  const onShare = props.onShare ?? config.onShare;
  const onConnect = props.onConnect ?? config.onConnect;
  const onPin = props.onPin ?? config.onPin;
  const onDateTime = props.onDateTime ?? config.onDateTime;
  const connectLabel = props.connectLabel ?? config.connectLabel ?? 'Connectar';
  const price = props.price ?? config.price;
  const children = props.children;

  const [isTocOpen, setIsTocOpen] = useState(false);
  const navigate = useNavigate();
  const appData = useAppData();
  
  const currentThemeMode = themeMode !== 'light' ? themeMode : (appData?.themeMode || 'light');
  
  const handleConnect = onConnect || (() => navigate('/connectar?item_id=' + encodeURIComponent(title || 'page')));
  
  const handleBack = onBack || (() => navigate(-1));
  const handleForward = onForward || (() => navigate(1));
  const handleIndex = onIndex || (() => setIsTocOpen(true));
  const handleTranslate = onTranslate || (() => navigate('/traduccions'));
  const handleTheme = onTheme || appData?.toggleTheme || (() => {});
  const handleComment = onComment || (() => navigate('/xat'));
  const handleShare = onShare || (() => {
    const safeHref = isSafeUrl(window.location.href) ? window.location.href : window.location.origin;
    if (navigator.share) {
      navigator.share({ title: title || document.title, url: safeHref }).catch(console.error);
    } else {
      navigator.clipboard.writeText(safeHref);
      showToast('Enllaç copiat al porta-retalls');
    }
  });
  
  const barAuthorName = topBarData.authorName ?? authorName;
  const barAuthorLocation = topBarData.authorLocation ?? authorLocation;
  const barAuthorAvatar = topBarData.authorAvatar ?? authorAvatar;
  const barTime = topBarData.time ?? time;
  const barDate = topBarData.date ?? date;
  const barDateTime = topBarData.dateTime ?? dateTime;
  const barHeroImage = topBarData.heroImage ?? heroImage;
  const barHeroAlt = topBarData.heroAlt ?? heroAlt;

  const handleDateTime = onDateTime || ((e) => {
    e.preventDefault();
    e.stopPropagation();
    let yyyymmdd;
    if (barDateTime) {
      yyyymmdd = barDateTime.split('T')[0];
    } else if (barDate) {
      const parts = barDate.split('/');
      if (parts.length === 3) {
        let [dd, mm, yy] = parts;
        if (yy.length === 2) yy = '20' + yy;
        if (isValidDate(dd, mm, yy)) {
          yyyymmdd = `${yy}-${mm.padStart(2, '0')}-${dd.padStart(2, '0')}`;
        }
      } else {
        const d = new Date(barDate);
        if (!isNaN(d.getTime())) yyyymmdd = d.toISOString().split('T')[0];
      }
    }
    if (yyyymmdd) {
      navigate(`/mur?date=${encodeURIComponent(yyyymmdd)}`);
    } else {
      navigate('/mur');
    }
  });

  const requestedChrome = showTopBars ? 'full' : chrome;
  const resolvedChrome = PAGE_CHROME_MODES.has(requestedChrome) ? requestedChrome : 'page';
  const showBlackBar = resolvedChrome === 'full';
  const showBlueBar = resolvedChrome === 'full' || resolvedChrome === 'context' || resolvedChrome === 'system';
  const showOrangeBar = resolvedChrome === 'full' || resolvedChrome === 'context';
  const showPageHeader = resolvedChrome !== 'none';
  const hasHeader = Boolean(showPageHeader && (showLogos || title || labels.length || copyright));



  return (
    <>
      {showBlackBar && (
        <header className="bar-black">
          <div
            className="mobile-logo-wrapper"
            id="mobile-sidebar-toggle"
          >
            <img
              alt="Sóc de Poble"
              src={resolveAsset("/assets/system/ui/logo-socdepoble-rect-blanc.svg")}
            />
          </div>
          <div className="right-icons">
            <ActionControl
              className="icon sp-card-action"
              label="Idioma"
              onClick={onLanguage}
            >
              <GlobeIcon />
            </ActionControl>
            <ActionControl
              className="icon sp-card-action"
              label="IAIA MarIA"
              onClick={onIaia}
            >
              <IaiaIcon className="iaia-icon" />
            </ActionControl>
            <ActionControl
              className="icon sp-card-action"
              label="Cercar"
              onClick={onSearch}
            >
              <SearchIcon />
            </ActionControl>
            <ActionControl
              className="icon sp-card-action"
              label="Canviar el tema"
              onClick={handleTheme}
            >
              <ThemeIcon mode={currentThemeMode} />
            </ActionControl>
            <ActionControl
              className="icon sp-card-action"
              label="Perfil"
              onClick={onProfile}
            >
              <img alt={viewerAvatarAlt} src={viewerAvatarUrl} />
            </ActionControl>
          </div>
        </header>
      )}

      {showBlueBar && (
        <>
          <header className="bar-blue">
            <div className="bar-blue-left">
              <IconButton label="Tornar arrere" onClick={handleBack} presentation>
                <BackIcon className="icon" />
              </IconButton>
              <IconButton label="Tornar endavant" onClick={handleForward} presentation>
                <ForwardIcon className="icon" />
              </IconButton>
              <IconButton label="Índex de secció" onClick={handleIndex} presentation>
                <IndexIcon className="icon" />
              </IconButton>
            </div>
            <div className="sp-card-actions">
              <IconButton label="Traduir" onClick={handleTranslate} presentation>
                <TranslateIcon className="icon" />
              </IconButton>
              <IconButton
                label="Comentar (Xat Privat)"
                onClick={handleComment}
                presentation
              >
                <CommentIcon className="icon" />
              </IconButton>
              <IconButton label="Compartir" onClick={handleShare} presentation>
                <ShareIcon className="icon" />
              </IconButton>
            </div>
            <ActionControl
              className="btn-connectar sp-card-connect"
              label={connectLabel}
              onClick={handleConnect}
            >
              {connectLabel}
            </ActionControl>
          </header>

          {topBarData?.heroComponent ? (
            <div className="hero-image">
              {topBarData.heroComponent}
            </div>
          ) : barHeroImage ? (
            <div className="hero-image">
              <img alt={barHeroAlt} src={resolveAsset(barHeroImage)} />
            </div>
          ) : null}

          {showOrangeBar && (
            <section className="bar-orange" aria-label="Autoria i data">
              <div className="sp-card-author">
                <img
                  className="sp-card-avatar"
                  src={resolveAsset(barAuthorAvatar)}
                  alt={authorAvatarAlt}
                  decoding="async"
                  width="48"
                  height="48"
                />
                <div className="sp-card-author-info">
                  <div className="sp-card-author-name">{barAuthorName}</div>
                  <div className="sp-card-author-location">{barAuthorLocation}</div>
                </div>
              </div>
              <div className="bar-actions">
                {topBarData?.showPin !== false && (
                  <ActionControl
                    className="btn-icon-orange"
                    label="Ancorar"
                    onClick={onPin}
                  >
                    <PinIcon className="icon" />
                  </ActionControl>
                )}
                <DateTimeControl
                  time={barTime}
                  date={barDate}
                  dateTime={barDateTime}
                  onClick={handleDateTime}
                />
              </div>
            </section>
          )}
        </>
      )}

      {hasHeader && (
        <header
          className={['page-title', tone && `is-${tone}`].filter(Boolean).join(' ')}
        >
          {(showLogos || chrome === 'system') && (
            <>
              <img
                alt="Logotip Sóc de Poble"
                className="page-title-logo light-only"
                src={resolveAsset("/assets/system/ui/logo-socdepoble-rect-negre.svg")}
              />
              <img
                alt="Logotip Sóc de Poble"
                className="page-title-logo dark-only"
                src={resolveAsset("/assets/system/ui/logo-socdepoble-rect-blanc.svg")}
              />
            </>
          )}
          {title && (
            <h1>
              {title}
              {price && <span className="sp-card-price" style={{ float: 'none', marginLeft: 16, display: 'inline-block', verticalAlign: 'middle', marginBottom: 4 }}>{price}</span>}
            </h1>
          )}
          {labels.length > 0 && (
            <ul className="sp-card-labels page-title-labels" aria-label="Categories">
              {labels.map((label, index) => {
                const text = typeof label === 'string' ? label : label.text;
                const className = typeof label === 'string' ? 'sdp-badge-tag' : label.className || 'sdp-badge-tag';
                const href = typeof label === 'string' ? null : label.href;
                return (
                  <li
                    key={`${text}-${index}`}
                    className={['sp-card-label', className].join(' ')}
                  >
                    {href ? (
                      href.startsWith('http') ? (
                        <a href={href} target="_blank" rel="noopener noreferrer" style={ { color: 'inherit', textDecoration: 'none' }}>{text}</a>
                      ) : (
                        <Link to={href} style={ { color: 'inherit', textDecoration: 'none' }}>{text}</Link>
                      )
                    ) : text}
                  </li>
                );
              })}
            </ul>
          )}
          {copyright && (
            <p className="sp-card-copyright page-title-copyright">{copyright}</p>
          )}
        </header>
      )}

      <article className="content-wrapper">
        {(subtitle || lead) && (
          <div className="page-intro">
            {subtitle && <h2>{subtitle}</h2>}
            {lead && <p className="lead">{lead}</p>}
          </div>
        )}
        {children}
      </article>

      <TableOfContentsDrawer isOpen={isTocOpen} onClose={() => setIsTocOpen(false)} />
    </>
  );
}

export function IconButton({
  label,
  children,
  onClick,
  className = '',
  disabled = false,
  presentation = false
}) {
  if (!onClick && !presentation && !disabled) return null;

  return (
    <ActionControl
      className={['sp-card-action', className].filter(Boolean).join(' ')}
      label={label}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </ActionControl>
  );
}

export function UniversalButton({
  children,
  onClick,
  variant = 'primary',
  size = '',
  type = 'button',
  className = '',
  disabled = false,
  icon = null,
  ariaLabel
}) {
  const sizeClass = size ? `btn-${size}` : '';
  const variantClass = variant ? `btn-${variant}` : '';

  return (
    <button
      className={['btn', variantClass, sizeClass, className].filter(Boolean).join(' ')}
      type={type}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel || (typeof children === 'string' ? children : undefined)}
    >
      {icon && (
        <span className="icon-btn" aria-hidden="true">
          {icon}
        </span>
      )}
      {children}
    </button>
  );
}

function CardHeader({ hasAuthor, authorHref, authorContent, hasMeta, pinVisible, pinLabel, onPin, dateTimeVisible, time, date, dateTime, handleDateTime }) {
  return (
    <header className="sp-card-header">
      {hasAuthor && (
        authorHref ? (
          <Link className="sp-card-author-link" to={authorHref}>
            {authorContent}
          </Link>
        ) : (
          <span className="sp-card-author-block">{authorContent}</span>
        )
      )}
      {hasMeta && (
        <div className="sp-card-meta">
          {pinVisible && (
            <ActionControl
              className="btn-icon-orange"
              label={pinLabel}
              onClick={onPin}
            >
              <PinIcon className="icon" />
            </ActionControl>
          )}
          {dateTimeVisible && (
            <DateTimeControl
              time={time}
              date={date}
              dateTime={dateTime}
              onClick={handleDateTime}
            />
          )}
        </div>
      )}
    </header>
  );
}

function CardBody({ imageUrl, imageAlt, calendarBadge, price, title, titleContent, TitleTag, subtitle, body, labels, copyright }) {
  return (
    <>
      {imageUrl && (
        <div className="sp-card-media-container">
          <img
            className="sp-card-media"
            src={imageUrl}
            alt={imageAlt}
            loading="lazy"
            decoding="async"
          />
        </div>
      )}

      <div
        className={[
          'sp-card-body',
          price && 'has-price',
          calendarBadge && 'has-calendar-badge'
        ].filter(Boolean).join(' ')}
      >
        {calendarBadge && (
          calendarBadge.onClick ? (
            <button
              type="button"
              className="sp-card-calendar-badge"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                calendarBadge.onClick();
              }}
              aria-label={calendarBadge.label || [calendarBadge.dia, calendarBadge.mes, calendarBadge.any].filter(Boolean).join(' ')}
              style={{ position: 'relative', zIndex: 20, cursor: 'pointer', border: '1px solid var(--sdp-accent-subtil)', padding: 0 }}
            >
              <time dateTime={calendarBadge.dateTime} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <span className="sp-card-calendar-badge__dia">{calendarBadge.dia}</span>
                <span className="sp-card-calendar-badge__mes">{calendarBadge.mes}</span>
                {calendarBadge.any && <span className="sp-card-calendar-badge__any">{calendarBadge.any}</span>}
              </time>
            </button>
          ) : (
            <time
              className="sp-card-calendar-badge"
              dateTime={calendarBadge.dateTime}
              aria-label={calendarBadge.label || [calendarBadge.dia, calendarBadge.mes, calendarBadge.any].filter(Boolean).join(' ')}
            >
              <span className="sp-card-calendar-badge__dia">{calendarBadge.dia}</span>
              <span className="sp-card-calendar-badge__mes">{calendarBadge.mes}</span>
              {calendarBadge.any && <span className="sp-card-calendar-badge__any">{calendarBadge.any}</span>}
            </time>
          )
        )}
        {price && <p className="sp-card-price">{price}</p>}

        {title && <TitleTag className="sp-card-title">{titleContent}</TitleTag>}
        {subtitle && <h4 className="sp-card-subtitle">{subtitle}</h4>}
        {body && (
          typeof body === 'string' ? (
            <p className="sp-card-text">{body}</p>
          ) : (
            <div className="sp-card-text">{body}</div>
          )
        )}
        {labels.length > 0 && (
          <ul className="sp-card-labels" aria-label="Categories">
            {labels.map((label, index) => {
              const text = typeof label === 'string' ? label : label.text;
              const className = typeof label === 'string' ? 'sdp-badge-tag' : label.className || 'sdp-badge-tag';
              const href = typeof label === 'string' ? null : label.href;
              return (
                <li
                  key={`${text}-${index}`}
                  className={['sp-card-label', className].join(' ')}
                >
                  {href ? (
                    href.startsWith('http') ? (
                      <a href={href} target="_blank" rel="noopener noreferrer" style={ { color: 'inherit', textDecoration: 'none' }}>{text}</a>
                    ) : (
                      <Link to={href} style={ { color: 'inherit', textDecoration: 'none' }}>{text}</Link>
                    )
                  ) : text}
                </li>
              );
            })}
          </ul>
        )}
        {copyright && <p className="sp-card-copyright">{copyright}</p>}
      </div>
    </>
  );
}

function CardFooter({ hasIconActions, translateVisible, handleTranslate, commentVisible, handleComment, shareVisible, handleShare, connectVisible, connectLabel, handleConnect, connectAriaLabel }) {
  return (
    <footer className="sp-card-footer">
      {hasIconActions && (
        <div className="sp-card-actions">
          {translateVisible && (
            <IconButton label="Traduir" onClick={handleTranslate} presentation>
              <TranslateIcon className="icon" />
            </IconButton>
          )}
          {commentVisible && (
            <IconButton label="Comentar" onClick={handleComment} presentation>
              <CommentIcon className="icon" />
            </IconButton>
          )}
          {shareVisible && (
            <IconButton label="Compartir" onClick={handleShare} presentation>
              <ShareIcon className="icon" />
            </IconButton>
          )}
        </div>
      )}
      {connectVisible && (
        <ActionControl
          className="btn-connectar sp-card-connect"
          label={connectLabel}
          onClick={handleConnect}
          aria-label={connectAriaLabel}
        >
          {connectLabel}
        </ActionControl>
      )}
    </footer>
  );
}

export function UniversalCard({
  title,
  headingLevel = 'h3',
  subtitle,
  body,
  location,
  time,
  date,
  dateTime,
  author,
  authorHref,
  avatarUrl,
  avatarAlt = '',
  imageUrl,
  imageAlt = '',
  price,
  labels = [],
  mainHref,
  onMainClick,
  copyright,
  calendarBadge = null,
  isAvis = false,
  hasFooter,
  showPin,
  showDateTime,
  showTranslate,
  showComment,
  showShare,
  showConnect,
  onPin,
  onDateTime,
  onTranslate,
  onComment,
  onShare,
  onConnect,
  connectLabel = 'Connectar'
}) {
  const navigate = useNavigate();
  const handleConnect = onConnect || (() => navigate('/connectar?item_id=' + encodeURIComponent(title || 'card')));
  const handleTranslate = onTranslate || (() => navigate('/traduccions'));
  const handleComment = onComment || (() => navigate('/xat'));
  const handleShare = onShare || (() => {
    const safeHref = isSafeUrl(mainHref) ? mainHref : null;
    const fullUrl = safeHref ? (window.location.origin + safeHref) : window.location.href;
    
    if (navigator.share) {
      navigator.share({ title: title || document.title, url: fullUrl }).catch(console.error);
    } else {
      navigator.clipboard.writeText(fullUrl);
      showToast('Enllaç copiat al porta-retalls');
    }
  });
  
  const handleDateTime = onDateTime || ((e) => {
    e.preventDefault();
    e.stopPropagation();
    let yyyymmdd;
    if (dateTime) {
      yyyymmdd = dateTime.split('T')[0];
    } else if (date) {
      const parts = date.split('/');
      if (parts.length === 3) {
        let [dd, mm, yy] = parts;
        if (yy.length === 2) yy = '20' + yy;
        if (isValidDate(dd, mm, yy)) {
          yyyymmdd = `${yy}-${mm.padStart(2, '0')}-${dd.padStart(2, '0')}`;
        }
      } else {
        const d = new Date(date);
        if (!isNaN(d.getTime())) yyyymmdd = d.toISOString().split('T')[0];
      }
    }
    if (yyyymmdd) {
      navigate(`/mur?date=${encodeURIComponent(yyyymmdd)}`);
    } else {
      navigate('/mur');
    }
  });

  const hasAuthor = Boolean(author || avatarUrl || location);
  const footerDefaultsVisible = hasFooter === true;
  const pinVisible = showPin ?? Boolean(onPin);
  const dateTimeVisible = showDateTime ?? Boolean(time || date || onDateTime);
  const translateVisible = showTranslate ?? (footerDefaultsVisible || Boolean(onTranslate));
  const commentVisible = showComment ?? (footerDefaultsVisible || Boolean(onComment));
  const shareVisible = showShare ?? (footerDefaultsVisible || Boolean(onShare));
  const connectVisible = showConnect ?? (footerDefaultsVisible || Boolean(onConnect));
  const hasMeta = pinVisible || dateTimeVisible;
  const hasHeader = hasAuthor || hasMeta;
  const hasIconActions = translateVisible || commentVisible || shareVisible;
  const footerVisible = hasFooter === false ? false : hasIconActions || connectVisible;
  const TitleTag = headingLevel || 'h3';

  const authorContent = hasAuthor && (
    <span className="sp-card-author">
      {avatarUrl && (
        <img
          alt={avatarAlt}
          className="sp-card-avatar"
          src={avatarUrl}
          width="48"
          height="48"
        />
      )}
      {(author || location) && (
        <span className="sp-card-author-info">
          {author && <span className="sp-card-author-name">{author}</span>}
          {location && <span className="sp-card-author-location">{location}</span>}
        </span>
      )}
    </span>
  );

  const titleContent = title;
  const pinLabel = title ? `Ancorar ${title}` : 'Ancorar';
  const connectAriaLabel = title ? `${connectLabel} amb ${title}` : connectLabel;

  return (
    <article className={['sp-card', isAvis && 'sp-card--avis'].filter(Boolean).join(' ')}>
      {hasHeader && (
        <CardHeader 
          hasAuthor={hasAuthor}
          authorHref={authorHref}
          authorContent={authorContent}
          hasMeta={hasMeta}
          pinVisible={pinVisible}
          pinLabel={pinLabel}
          onPin={onPin}
          dateTimeVisible={dateTimeVisible}
          time={time}
          date={date}
          dateTime={dateTime}
          handleDateTime={handleDateTime}
        />
      )}

      {mainHref ? (
        <Link className="sp-card-link-overlay" to={mainHref} onClick={onMainClick} aria-label={title || 'Obrir detall'} />
      ) : onMainClick ? (
        <button type="button" className="sp-card-link-overlay" onClick={onMainClick} aria-label={title || 'Obrir detall'} />
      ) : null}

      <CardBody
        imageUrl={imageUrl}
        imageAlt={imageAlt}
        calendarBadge={calendarBadge}
        price={price}
        title={title}
        titleContent={titleContent}
        TitleTag={TitleTag}
        subtitle={subtitle}
        body={body}
        labels={labels}
        copyright={copyright}
      />

      {footerVisible && (
        <CardFooter
          hasIconActions={hasIconActions}
          translateVisible={translateVisible}
          handleTranslate={handleTranslate}
          commentVisible={commentVisible}
          handleComment={handleComment}
          shareVisible={shareVisible}
          handleShare={handleShare}
          connectVisible={connectVisible}
          connectLabel={connectLabel}
          handleConnect={handleConnect}
          connectAriaLabel={connectAriaLabel}
        />
      )}
    </article>
  );
}

export function UniversalIndicatorCard({
  icon,
  title,
  subtitle,
  active,
  onClick,
  iconColor,
  className = ''
}) {
  return (
    <button 
      type="button"
      className={`sdp-indicator-card ${active ? 'active' : ''} ${className}`}
      onClick={onClick}
      aria-pressed={active}
    >
      <span className="sdp-indicator-card-icon" style={iconColor ? { /* */ color: iconColor } : {}}>
        {icon}
      </span>
      <span className="sdp-indicator-card-title">{title}</span>
      {subtitle && <span className="sdp-indicator-card-subtitle">{subtitle}</span>}
    </button>
  );
}
