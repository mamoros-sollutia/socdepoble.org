import fs from 'fs';
const text = fs.readFileSync('src/components/universal/UniversalElements.jsx', 'utf8');

const lines = text.split('\n');

const imports = lines.slice(0, 9).join('\n');
const utils = lines.slice(9, 45).join('\n'); // PAGE_CHROME_MODES up to DEFAULT_AUTHOR
const tableOfContents = lines.slice(322, 391).join('\n');
const universalPage = lines.slice(391, 725).join('\n'); // until export function IconButton

// The rest goes to UniversalElements
const elements = [
  imports,
  "import { UniversalPage } from './UniversalPage';",
  lines.slice(45, 322).join('\n'), // ActionControl up to before TableOfContentsDrawer
  lines.slice(725).join('\n') // IconButton and below
].join('\n\n');

fs.writeFileSync('src/components/universal/UniversalElements.jsx', elements);

const page = [
  "import { resolveAsset } from '../../config/assetResolver';",
  "import { useNavigate, Link } from 'react-router-dom';",
  "import { useEffect, useState, useRef } from 'react';",
  "import { useUIState, useUIActions } from '../../app/contexts/UIContext';",
  "import { showToast } from './AvisadorEfimer';",
  "import { useContent, ContentProvider } from './ContentProvider';",
  "import {",
  "  BackIcon, ForwardIcon, IndexIcon, TranslateIcon,",
  "  CommentIcon, ShareIcon, PinIcon, ThemeIcon,",
  "  SearchIcon, IaiaIcon, GlobeIcon, IconButton",
  "} from './UniversalElements';",
  utils,
  tableOfContents,
  universalPage
].join('\n\n');

fs.writeFileSync('src/components/universal/UniversalPage.jsx', page);

const index = [
  "export * from './UniversalElements';",
  "export * from './UniversalPage';"
].join('\n');

fs.writeFileSync('src/components/universal/UniversalComponents.jsx', index);
