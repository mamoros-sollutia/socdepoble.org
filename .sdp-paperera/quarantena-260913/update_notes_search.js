const fs = require('fs');
const content = fs.readFileSync('src/sections/notes/NotesSection.jsx', 'utf8');

const targetStr = `
                <div className="notes-column__body" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'hidden' }}>
                  <div style={{ padding: '16px', display: 'flex', gap: '8px', alignItems: 'center', flexShrink: 0 }}>
                    <div style={{ position: 'relative', flex: 1 }}>
                      <Search size={16} style={{  position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)'}} />
                      <input
                        type="search"
                        value={searchQuery}
                        onChange={(event) => setSearchQuery(event.target.value)}
                        placeholder={t('section.notes.searchPlaceholder', 'Cerca al bancal...')}
                        style={{  width: '100%', padding: '8px 12px 8px 36px', borderRadius: '20px', border: '1px solid var(--sdp-vora)', background: 'var(--sdp-fons-superficie)'}}
                      />
                    </div>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <div style={{ position: 'relative' }}>
                        <button 
                          onClick={() => setSettingsOpen(!settingsOpen)}
                          style={{   border: 'none', cursor: 'pointer',  padding: '4px', display: 'flex', position: 'relative', background: 'transparent', color: 'var(--sdp-text-cos)'  }}
                          title="Ajustaments i Timer"
                        >
                          <Settings size={20} />
                          {timerActive && (
                            <span style={{  position: 'absolute', top: 0, right: 0, width: '8px', height: '8px',  borderRadius: '50%', boxShadow: '0 0 0 2px var(--sdp-fons-superficie)', background: 'var(--sdp-accent)'  }} />
                          )}
                        </button>
                        {settingsOpen && (
                          <div style={{  position: 'absolute', top: '100%', right: 0, marginTop: '8px',  border: '1px solid var(--sdp-vora)', borderRadius: '8px', boxShadow: 'var(--sdp-ombra-3)', padding: '8px', minWidth: '180px', zIndex: 50, background: 'var(--sdp-fons-superficie)'  }}>
                            <div style={{ padding: '8px', borderBottom: '1px solid var(--sdp-vora)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                              <span style={{  display: 'flex', alignItems: 'center', gap: '6px'}}><Clock size={14}/> Temps:</span>
                              <span >{formatTime(timerSeconds)}</span>
                            </div>
                            <button 
                              onClick={() => setTimerActive(!timerActive)}
                              style={{  width: '100%', padding: '8px', textAlign: 'left',  border: 'none', cursor: 'pointer',   borderRadius: '4px', background: 'transparent', color: 'inherit'}}
                              className="hover-bg"
                            >
                              {timerActive ? 'Aturar Temporitzador' : 'Iniciar Temporitzador'}
                            </button>
                            {timerSeconds > 0 && !timerActive && (
                              <button 
                                onClick={() => setTimerSeconds(0)}
                                style={{  width: '100%', padding: '8px', textAlign: 'left',  border: 'none', cursor: 'pointer',   borderRadius: '4px', background: 'transparent', color: 'inherit'  }}
                                className="hover-bg"
                              >
                                Reiniciar Temps
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                      <button className="btn btn-sm" style={{ cursor: 'pointer', border: '1px solid var(--sdp-vora)', borderRadius: '20px', padding: '8px 16px', whiteSpace: 'nowrap', background: 'var(--sdp-pedra-200)', color: 'var(--sdp-text-titol)' }}>
                        CREAR NOTA
                      </button>
                    </div>
                  </div>
                </div>

                <div className="notes-column__scroll" style={{ flex: 1, padding: '0 16px 16px 16px', overflowY: 'auto' }}>`;

const replacement = `
                <div className="notes-column__body" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'hidden' }}>
                  <div style={{ padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
                    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                      <button 
                        className="btn-icon" 
                        style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--sdp-text-cos)', padding: '4px', display: 'flex' }}
                        title="Cercar"
                      >
                        <Search size={20} />
                      </button>
                      <div style={{ position: 'relative' }}>
                        <button 
                          onClick={() => setSettingsOpen(!settingsOpen)}
                          style={{ border: 'none', cursor: 'pointer', padding: '4px', display: 'flex', position: 'relative', background: 'transparent', color: 'var(--sdp-text-cos)' }}
                          title="Ajustaments i Timer"
                        >
                          <Settings size={20} />
                          {timerActive && (
                            <span style={{ position: 'absolute', top: 0, right: 0, width: '8px', height: '8px', borderRadius: '50%', boxShadow: '0 0 0 2px var(--sdp-fons-superficie)', background: 'var(--sdp-accent)' }} />
                          )}
                        </button>
                        {settingsOpen && (
                          <div style={{ position: 'absolute', top: '100%', left: 0, marginTop: '8px', border: '1px solid var(--sdp-vora)', borderRadius: '8px', boxShadow: 'var(--sdp-ombra-3)', padding: '8px', minWidth: '180px', zIndex: 50, background: 'var(--sdp-fons-superficie)' }}>
                            <div style={{ padding: '8px', borderBottom: '1px solid var(--sdp-vora)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Clock size={14}/> Temps:</span>
                              <span >{formatTime(timerSeconds)}</span>
                            </div>
                            <button 
                              onClick={() => setTimerActive(!timerActive)}
                              style={{ width: '100%', padding: '8px', textAlign: 'left', border: 'none', cursor: 'pointer', borderRadius: '4px', background: 'transparent', color: 'inherit' }}
                              className="hover-bg"
                            >
                              {timerActive ? 'Aturar Temporitzador' : 'Iniciar Temporitzador'}
                            </button>
                            {timerSeconds > 0 && !timerActive && (
                              <button 
                                onClick={() => setTimerSeconds(0)}
                                style={{ width: '100%', padding: '8px', textAlign: 'left', border: 'none', cursor: 'pointer', borderRadius: '4px', background: 'transparent', color: 'inherit' }}
                                className="hover-bg"
                              >
                                Reiniciar Temps
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                    <button className="btn btn-sm" style={{ cursor: 'pointer', border: '1px solid var(--sdp-vora)', borderRadius: '20px', padding: '8px 16px', whiteSpace: 'nowrap', background: 'var(--sdp-pedra-200)', color: 'var(--sdp-text-titol)' }}>
                      CREAR NOTA
                    </button>
                  </div>

                <div className="notes-column__scroll" style={{ flex: 1, padding: '0 16px 16px 16px', overflowY: 'auto' }}>`;

fs.writeFileSync('src/sections/notes/NotesSection.jsx', content.replace(targetStr, replacement));
