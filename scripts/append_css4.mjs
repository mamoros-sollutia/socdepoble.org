import fs from 'fs';

let css = `
/* Noves classes per a DesignSectionContent */
.dsg-pre-wrap {
  white-space: pre-wrap;
}
.dsg-center-600 {
  max-width: 600px;
  margin: 0 auto;
}
.dsg-msg-container {
  display: flex;
  gap: var(--sdp-space-3);
  max-width: 85%;
}
.dsg-msg-self {
  align-self: flex-end;
  flex-direction: row-reverse;
}
.dsg-flex-1 {
  flex: 1;
}
.dsg-btn-round {
  border-radius: 50%;
  width: 40px;
  height: 40px;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}
.dsg-icon-1em {
  width: 1.2em;
  height: 1.2em;
}
.dsg-pl-1 {
  padding-left: 1rem;
}

/* Noves classes per a MultimediaSection */
.mm-flex-center-full {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Noves classes per a MurSection i Articles */
.mur-px-16 {
  padding: 0 16px;
}
.apl-img-mb {
  margin-bottom: var(--sdp-space-6);
  border-radius: var(--sdp-radi-xl);
  overflow: hidden;
}
.apl-img-mt {
  margin-top: var(--sdp-space-6);
  border-radius: var(--sdp-radi-xl);
  overflow: hidden;
}
.apl-title-spacing {
  margin-bottom: var(--sdp-space-4);
  margin-top: var(--sdp-space-8);
}
.apl-list {
  list-style-type: disc;
  padding-left: var(--sdp-space-6);
  margin-bottom: var(--sdp-space-6);
  gap: var(--sdp-space-2);
  display: flex;
  flex-direction: column;
}
.apl-underline {
  text-decoration: underline;
}
`;

fs.appendFileSync('src/css/index.css', css);
console.log('CSS appended');
