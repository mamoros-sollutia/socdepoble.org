import fs from 'fs';

let css = `
/* Noves classes per a OnboardingSection */
.onb-section-intro {
  margin-bottom: 1.5rem;
  text-align: center;
  padding: 1.5rem;
}
.onb-flex-center-mt {
  width: 100%;
  display: flex;
  justify-content: center;
  margin-top: 1.5rem;
}
.onb-section-header {
  text-align: center;
  margin-bottom: 1.5rem;
  opacity: 0.6;
  font-weight: 600;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* Noves classes per a OnboardingSteps */
.onb-center-text {
  text-align: center;
}
.onb-center-text-mt {
  text-align: center;
  margin-top: 1rem;
}
.onb-icon-action {
  width: 2rem;
  height: 2rem;
  flex-shrink: 0;
  cursor: pointer;
}
.onb-block-mt {
  margin-top: 0.5rem;
  display: block;
}

/* Noves classes per a altres */
.onb-btn-group-full {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
  width: 100%;
}
.onb-fork-grid-margin {
  display: grid;
  gap: 1rem;
  margin-top: 1.5rem;
}
.onb-btn-icon-center {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
}

/* Ajustos de perfil */
.ajust-center-text {
  text-align: center;
  margin-top: 2rem;
}
.ajust-flex-col {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.ajust-avatar {
  width: 128px;
  height: 128px;
  object-fit: cover;
  border-radius: 50%;
  border: 2px solid var(--sdp-vora-control);
}
.ajust-btn-group {
  margin-top: 1.5rem;
  display: flex;
  gap: 1rem;
}
.ident-flex-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}
.ident-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
}
.ident-flex-col {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}
.no-padding {
  padding: 0;
}
`;

fs.appendFileSync('src/css/index.css', css);
console.log('CSS appended');
