import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';

// backendPort: updateProfile respon amb el nom nou, com faria Supabase
const updateProfile = vi.fn(async (patch) => ({ full_name: patch.full_name }));
vi.mock('/home/claude/repo/src/data/backendPort.js', () => ({
  getCurrentUser: () => ({ id: 'u1', user_metadata: { name: 'Nom Vell' } }),
  listMyOrganizations: async () => [],
  getProfile: async () => ({ full_name: 'Nom Vell', avatar_url: null }),
  updateProfile,
  updateOrganization: async () => ({}),
  updateUserPassword: async () => ({}),
  logout: async () => {},
}));
vi.mock('/home/claude/repo/src/utils/imageUtils.js', () => ({ compressImage: async () => 'data:,' }));

const { PerfilProvider, usePerfil } = await import('/home/claude/repo/src/sections/profile/PerfilContext.jsx');
const DetallAjust = (await import('/home/claude/repo/src/sections/profile/DetallAjust.jsx')).default;

function TriaNom() {
  const { triaAjust, identitat } = usePerfil();
  return <button onClick={() => triaAjust('nom')}>tria-nom {identitat?.nom}</button>;
}

describe('DetallAjust: cicle de vida del camp', () => {
  it('després de Guardar, el camp es buida i el missatge d’èxit desapareix', async () => {
    render(
      <PerfilProvider config={{}}>
        <TriaNom />
        <DetallAjust />
      </PerfilProvider>
    );

    await act(async () => { await Promise.resolve(); });
    await act(async () => { fireEvent.click(screen.getByText(/tria-nom/)); });

    const camp = document.getElementById('ajust-nom');
    console.log('\n[1] valor inicial del camp:', JSON.stringify(camp.value));

    await act(async () => { fireEvent.change(camp, { target: { value: 'Javi Nou' } }); });
    console.log('[2] després d’escriure:', JSON.stringify(document.getElementById('ajust-nom').value));

    await act(async () => { fireEvent.click(screen.getByText('Guardar')); });
    await act(async () => { await Promise.resolve(); await Promise.resolve(); });

    const desprès = document.getElementById('ajust-nom').value;
    const teMissatge = !!document.querySelector('.sdp-text-exit');
    const nomBarra = screen.getByText(/tria-nom/).textContent;
    console.log('[3] valor del camp DESPRÉS de guardar:', JSON.stringify(desprès));
    console.log('[4] missatge "Desat correctament" visible?:', teMissatge);
    console.log('[5] nom que mostra la llista d’identitats:', JSON.stringify(nomBarra));
    console.log('[6] updateProfile cridat amb:', JSON.stringify(updateProfile.mock.calls[0]?.[0]), '\n');

    expect(updateProfile).toHaveBeenCalledWith({ full_name: 'Javi Nou' }, {});
  });
});
