import fs from 'fs';
const text = fs.readFileSync('src/sections/disseny/DesignSection.jsx', 'utf8');

const lines = text.split('\n');

const importsAndTop = lines.slice(0, 50).join('\n');
const contentStart = lines.findIndex(l => l.includes('<div className="universal-content sdp-design-system sdp-manual-disseny">'));
const contentEnd = lines.findIndex(l => l.includes('</UniversalPage>')) - 2;

const contentLines = lines.slice(contentStart + 1, contentEnd + 1);

const contentComponent = [
  "import React from 'react';",
  "import { UniversalCard, Accordion, AccordionItem, Dropdown, DropdownItem } from '../../components/universal/UniversalComponents.jsx';",
  "import { EventCard } from '../../components/universal/EventCard.jsx';",
  "import { showToast } from '../../components/universal/AvisadorEfimer.jsx';",
  "import { EVENTS } from '../mur/eventsContent.js';",
  lines.slice(8, 31).join('\n'), // ComponentDoc
  "export function DesignSectionContent() {",
  "  return (",
  "    <>",
  ...contentLines,
  "    </>",
  "  );",
  "}"
].join('\n');

fs.writeFileSync('src/sections/disseny/DesignSectionContent.jsx', contentComponent);

const mainSection = [
  "import React from 'react';",
  "import { UniversalPage } from '../../components/universal/UniversalComponents.jsx';",
  "import { DesignSectionContent } from './DesignSectionContent.jsx';",
  "export default function DesignSection() {",
  "  return (",
  lines.slice(33, contentStart + 1).join('\n'),
  "        <DesignSectionContent />",
  "      </div>",
  "    </UniversalPage>",
  "  );",
  "}"
].join('\n');

fs.writeFileSync('src/sections/disseny/DesignSection.jsx', mainSection);
