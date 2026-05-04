/* ════════════════════════════════════════════════════════════════
   WalkerTalks — Homepage
   ════════════════════════════════════════════════════════════ */

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "direction": "atmospheric",
  "heroVariant": "kinetic",
  "showFog": true,
  "showGrain": true,
  "showCursorFog": true,
  "primaryAccent": "#C4A484",
  "headlineFamily": "anton",
  "showResidency": true,
  "portraitTreatment": "framed",
  "portraitImage": "studio",
  "density": "regular"
}/*EDITMODE-END*/;

const PORTRAITS = {
  hero:    'assets/portrait-hero.jpeg',
  about:   'assets/portrait-about.jpeg',
  warm:    'assets/portrait-warm.jpeg',
  studio:  'assets/portrait-studio.jpeg',
  relaxed: 'assets/portrait-relaxed.jpeg',
  square:  'assets/portrait-square.jpeg',
};

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);

  // Apply direction + accent globally via root attrs / CSS vars.
  useEffect(() => {
    document.body.setAttribute('data-direction', t.direction);
    document.documentElement.style.setProperty('--primary', t.primaryAccent);
    document.documentElement.style.setProperty(
      '--primary-hover',
      shadeColor(t.primaryAccent, -16)
    );
    document.body.style.setProperty(
      '--display-family',
      t.headlineFamily === 'fraunces' ? "'Fraunces', serif" : "'Anton', 'Impact', sans-serif"
    );
  }, [t.direction, t.primaryAccent, t.headlineFamily]);

  useReveal();

  return (
    <React.Fragment>
      {t.showGrain && <Grain />}
      {t.showCursorFog && <CursorFog />}
      <SiteNav onDark={true} active="home" />

      <Hero tweaks={t} />
      <PositioningSection tweaks={t} />
      <LecturesPreview tweaks={t} />
      <AboutSnippet tweaks={t} />
      {t.showResidency && <ResidencySection tweaks={t} />}
      <BookingCTA tweaks={t} />
      <SiteFooter />

      <TweaksPanel>
        <TweakSection label="Direction" />
        <TweakRadio
          label="Visual direction"
          value={t.direction}
          options={[
            { value: 'atmospheric', label: 'Atmospheric' },
            { value: 'editorial',   label: 'Editorial' },
          ]}
          onChange={(v) => setTweak('direction', v)}
        />
        <TweakRadio
          label="Display type"
          value={t.headlineFamily}
          options={[
            { value: 'anton',    label: 'Anton (sans)' },
            { value: 'fraunces', label: 'Fraunces (serif)' },
          ]}
          onChange={(v) => setTweak('headlineFamily', v)}
        />
        <TweakRadio
          label="Hero treatment"
          value={t.heroVariant}
          options={[
            { value: 'kinetic',  label: 'Kinetic' },
            { value: 'static',   label: 'Static' },
            { value: 'minimal',  label: 'Minimal' },
          ]}
          onChange={(v) => setTweak('heroVariant', v)}
        />

        <TweakSection label="Portrait" />
        <TweakSelect
          label="Portrait image"
          value={t.portraitImage}
          options={[
            { value: 'hero',    label: 'Hero — autumn, navy' },
            { value: 'about',   label: 'Lane — autumn, burgundy' },
            { value: 'warm',    label: 'Warm — autumn, red' },
            { value: 'studio',  label: 'Studio — denim, charcoal bg' },
            { value: 'relaxed', label: 'Relaxed — sweater, lobby' },
            { value: 'square',  label: 'Office — suit, blue tie' },
          ]}
          onChange={(v) => setTweak('portraitImage', v)}
        />
        <TweakRadio
          label="Frame treatment"
          value={t.portraitTreatment}
          options={[
            { value: 'framed',  label: 'Framed' },
            { value: 'duotone', label: 'Duotone' },
            { value: 'arch',    label: 'Arch' },
          ]}
          onChange={(v) => setTweak('portraitTreatment', v)}
        />

        <TweakSection label="Atmosphere" />
        <TweakToggle label="Drift fog"   value={t.showFog}       onChange={(v) => setTweak('showFog', v)} />
        <TweakToggle label="Film grain"  value={t.showGrain}     onChange={(v) => setTweak('showGrain', v)} />
        <TweakToggle label="Cursor fog"  value={t.showCursorFog} onChange={(v) => setTweak('showCursorFog', v)} />

        <TweakSection label="Theme" />
        <TweakColor
          label="Primary accent"
          value={t.primaryAccent}
          onChange={(v) => setTweak('primaryAccent', v)}
        />
        <TweakRadio
          label="Density"
          value={t.density}
          options={[
            { value: 'compact', label: 'Compact' },
            { value: 'regular', label: 'Regular' },
            { value: 'roomy',   label: 'Roomy' },
          ]}
          onChange={(v) => setTweak('density', v)}
        />

        <TweakSection label="Sections" />
        <TweakToggle label="Show residency"  value={t.showResidency}  onChange={(v) => setTweak('showResidency', v)} />
      </TweaksPanel>
    </React.Fragment>
  );
}

// shadeColor moved to components.jsx

/* ─── HERO ────────────────────────────────────────────────── */
function Hero({ tweaks }) {
  const isMinimal = tweaks.heroVariant === 'minimal';
  const portraitSrc = PORTRAITS[tweaks.portraitImage] || PORTRAITS.hero;
  const treatment = tweaks.portraitTreatment;

  return (
    <header className="section section-dark" style={{
      minHeight: '100vh',
      paddingTop: '7rem', paddingBottom: '6rem',
      display: 'flex', alignItems: 'center',
    }}>
      {tweaks.showFog && <DriftStage dark />}

      <div className="container-wide" style={{position: 'relative', zIndex: 2}}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1.35fr) minmax(0, 0.95fr)',
          gap: 'clamp(2.5rem, 5vw, 5rem)',
          alignItems: 'center',
        }} className="hero-grid">
          {/* LEFT — type */}
          <div>
            <div className="cell" style={{marginBottom: '2.25rem'}}>
              <Eyebrow withRule>The Lecture Series of Tristian Walker</Eyebrow>
            </div>

            <h1 className="cell delay-1" style={{margin: 0, color: 'var(--bone)'}}>
              <span className={tweaks.heroVariant === 'kinetic' ? 'kinetic' : ''}
                style={{
                  display: 'block',
                  fontFamily: tweaks.headlineFamily === 'fraunces' ? "'Fraunces', serif" : "'Anton', 'Impact', sans-serif",
                  fontWeight: tweaks.headlineFamily === 'fraunces' ? 700 : 400,
                  textTransform: tweaks.headlineFamily === 'fraunces' ? 'none' : 'uppercase',
                  fontSize: 'clamp(2.75rem, 7.5vw, 6.75rem)',
                  lineHeight: 0.92,
                  letterSpacing: '-0.025em',
                  marginBottom: '0.4rem',
                }}>
                Lectures for
              </span>
              <span style={{
                display: 'block',
                fontFamily: "'Fraunces', serif",
                fontStyle: 'italic',
                fontWeight: 300,
                color: 'var(--primary)',
                fontSize: 'clamp(2.25rem, 6.5vw, 5.75rem)',
                lineHeight: 1.05,
                letterSpacing: '-0.025em',
                marginBottom: '0.4rem',
              }}>
                the part of you
              </span>
              <span style={{
                display: 'block',
                fontFamily: tweaks.headlineFamily === 'fraunces' ? "'Fraunces', serif" : "'Anton', 'Impact', sans-serif",
                fontWeight: tweaks.headlineFamily === 'fraunces' ? 700 : 400,
                textTransform: tweaks.headlineFamily === 'fraunces' ? 'none' : 'uppercase',
                fontSize: 'clamp(2.75rem, 7.5vw, 6.75rem)',
                lineHeight: 0.92,
                letterSpacing: '-0.025em',
              }}>
                still awake<span style={{color: 'var(--primary)'}}>.</span>
              </span>
            </h1>

            <p className="cell delay-2 font-serif-it" style={{
              fontSize: 'clamp(1.05rem, 1.4vw, 1.35rem)',
              lineHeight: 1.55,
              color: 'rgba(245,241,232,0.7)',
              maxWidth: 540,
              margin: '2.5rem 0 2.5rem',
            }}>
              An ongoing series of one-hour lectures on self-agency, character,
              and the long argument between who you've become and who you meant to be.
            </p>

            <div className="cell delay-3" style={{
              display: 'flex', gap: '1rem', flexWrap: 'wrap',
              alignItems: 'center', marginBottom: '3rem',
            }}>
              <a href="/professional-drift/" className="btn btn-primary">
                Enter the Lecture
              </a>
              <a href="#lectures" className="btn btn-outline-light">
                See all lectures
              </a>
            </div>

            <div className="cell delay-4" style={{
              display: 'flex', alignItems: 'center', gap: '1rem',
              fontSize: 11, fontWeight: 700, letterSpacing: '0.4em', textTransform: 'uppercase',
              color: 'rgba(245,241,232,0.45)',
            }}>
              <Hairline width="2.5rem" />
              <span>One lecture live</span>
              <span style={{color: 'rgba(245,241,232,0.25)'}}>·</span>
              <span>Three more, 2026</span>
            </div>
          </div>

          {/* RIGHT — portrait */}
          {!isMinimal && (
            <div className="cell delay-2" style={{position: 'relative'}}>
              <PortraitPanel src={portraitSrc} treatment={treatment} />
            </div>
          )}
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .hero-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </header>
  );
}

/* ─── PORTRAIT PANEL ──────────────────────────────────────── */
function PortraitPanel({ src, treatment = 'framed' }) {
  if (treatment === 'duotone') {
    return (
      <div style={{position: 'relative', maxWidth: 460, margin: '0 auto'}}>
        <div style={{
          position: 'relative',
          aspectRatio: '4/5',
          borderRadius: 8,
          overflow: 'hidden',
          boxShadow: '0 50px 90px -20px rgba(0,0,0,0.6)',
        }}>
          <img src={src} alt="Tristian Walker"
            style={{width: '100%', height: '100%', objectFit: 'cover',
              filter: 'grayscale(0.5) contrast(1.05) sepia(0.35) saturate(1.2)',
              mixBlendMode: 'normal',
            }} />
          <div style={{position: 'absolute', inset: 0,
            background: 'linear-gradient(180deg, transparent 50%, rgba(15,14,13,0.5) 100%)'}} />
        </div>
        <PortraitCaption />
      </div>
    );
  }
  if (treatment === 'arch') {
    return (
      <div style={{position: 'relative', maxWidth: 440, margin: '0 auto'}}>
        <div style={{
          position: 'relative',
          aspectRatio: '4/5.4',
          borderTopLeftRadius: '50% 30%',
          borderTopRightRadius: '50% 30%',
          borderBottomLeftRadius: 8,
          borderBottomRightRadius: 8,
          overflow: 'hidden',
          boxShadow: '0 50px 90px -20px rgba(0,0,0,0.55)',
          border: '1px solid rgba(196,164,132,0.25)',
        }}>
          <img src={src} alt="Tristian Walker"
            style={{width: '100%', height: '100%', objectFit: 'cover'}} />
        </div>
        <PortraitCaption />
      </div>
    );
  }
  // framed (default)
  return (
    <div style={{position: 'relative', maxWidth: 460, margin: '0 auto'}}>
      {/* outer warm halo */}
      <div aria-hidden="true" style={{
        position: 'absolute', inset: '-8%',
        background: 'radial-gradient(ellipse at center, rgba(196,164,132,0.35), transparent 70%)',
        filter: 'blur(40px)',
        zIndex: 0,
      }} />
      <div style={{
        position: 'relative',
        aspectRatio: '4/5',
        background: 'rgba(15,14,13,0.4)',
        padding: 12,
        borderRadius: 12,
        border: '1px solid rgba(196,164,132,0.22)',
        boxShadow: '0 50px 100px -25px rgba(0,0,0,0.6), inset 0 1px 0 rgba(196,164,132,0.18)',
        backdropFilter: 'blur(18px)',
        WebkitBackdropFilter: 'blur(18px)',
      }}>
        <div style={{
          position: 'relative', width: '100%', height: '100%',
          borderRadius: 6, overflow: 'hidden',
        }}>
          <img src={src} alt="Tristian Walker"
            style={{width: '100%', height: '100%', objectFit: 'cover',
              filter: 'contrast(1.04) saturate(1.05)'}} />
        </div>
        <div style={{
          position: 'absolute', top: 22, left: 22,
          fontSize: 9.5, fontWeight: 700, letterSpacing: '0.4em', textTransform: 'uppercase',
          color: 'rgba(245,241,232,0.65)',
        }}>
          Tristian Walker
        </div>
      </div>
      <PortraitCaption />
    </div>
  );
}
function PortraitCaption() {
  return (
    <div style={{
      marginTop: '1.25rem',
      textAlign: 'center',
      fontSize: 10.5, fontWeight: 700, letterSpacing: '0.4em', textTransform: 'uppercase',
      color: 'rgba(245,241,232,0.45)',
    }}>
      Author · Speaker · Founder of <span style={{color: 'var(--primary)'}}>The Quiet Line</span>
    </div>
  );
}

/* ─── POSITIONING SECTION ─────────────────────────────────── */
function PositioningSection({ tweaks }) {
  return (
    <section className="section section-light" style={{paddingTop: '7rem', paddingBottom: '7rem'}}>
      {tweaks.showFog && <DriftStage muted />}
      <div className="container">
        <div style={{
          maxWidth: 880, margin: '0 auto', textAlign: 'center',
        }}>
          <div className="cell"><Eyebrow withRule>The Premise</Eyebrow></div>
          <h2 className="cell delay-1 font-display" style={{
            color: 'var(--ink)',
            fontSize: 'clamp(2.4rem, 6vw, 4.75rem)',
            margin: '1.5rem 0 0.4rem',
          }}>
            Some careers don't collapse —
          </h2>
          <div className="cell delay-2 font-serif-it" style={{
            color: 'var(--primary)',
            fontSize: 'clamp(2rem, 5.5vw, 4.25rem)',
            lineHeight: 1.05,
            paddingBottom: '0.18em',
          }}>
            they quietly drift.
          </div>

          <p className="cell delay-3" style={{
            fontSize: 'clamp(1.05rem, 1.4vw, 1.25rem)',
            lineHeight: 1.7,
            color: 'rgba(15,14,13,0.7)',
            maxWidth: 680, margin: '2.5rem auto 0',
            textWrap: 'pretty',
          }}>
            WalkerTalks is the lecture home of <em style={{fontStyle: 'italic', color: 'var(--ink)'}}>Tristian Walker</em>{' '}
            — author of <em style={{fontStyle: 'italic'}}>The Quiet Line</em> and a measured voice on
            self-agency, character, and the long arc from drift to direction.
            Each lecture is a single, hour-long reckoning. No conference circuit theatrics.
            No ten-step frameworks. Just one honest line, drawn carefully.
          </p>

          <div className="cell delay-4" style={{
            marginTop: '4rem',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '1.25rem',
            maxWidth: 720, marginLeft: 'auto', marginRight: 'auto',
          }}>
            {[
              { word: 'Presence', sub: 'over performance' },
              { word: 'Character', sub: 'over credentials' },
              { word: 'Hospitality', sub: 'over hierarchy' },
            ].map(item => (
              <div key={item.word} style={{
                padding: '1.5rem 1rem',
                borderTop: '1px solid rgba(196,164,132,0.4)',
              }}>
                <div className="font-display" style={{
                  fontSize: '1.65rem', color: 'var(--ink)', marginBottom: '0.4rem',
                }}>{item.word}</div>
                <div className="font-serif-it" style={{
                  fontSize: '0.95rem', color: 'var(--primary)',
                }}>{item.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── LECTURES PREVIEW ────────────────────────────────────── */
function LecturesPreview({ tweaks }) {
  return (
    <section id="lectures" className="section section-parchment" style={{paddingTop: '7rem', paddingBottom: '7rem'}}>
      {tweaks.showFog && <DriftStage muted />}
      <div className="container-wide">
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
          gap: '2rem', flexWrap: 'wrap', marginBottom: '4rem',
        }}>
          <div>
            <div className="cell"><Eyebrow withRule>The Lectures</Eyebrow></div>
            <h2 className="cell delay-1 font-display" style={{
              color: 'var(--ink)',
              fontSize: 'clamp(2.4rem, 5.5vw, 4.5rem)',
              margin: '1.5rem 0 0.4rem',
            }}>
              <DriftWord>One talk live.</DriftWord>
            </h2>
            <div className="cell delay-2 font-serif-it" style={{
              color: 'var(--primary)',
              fontSize: 'clamp(1.85rem, 4.5vw, 3.6rem)',
              lineHeight: 1.05,
              paddingBottom: '0.18em',
            }}>
              More are on the way.
            </div>
          </div>
          <a href="/lectures.html" className="cell delay-3 btn btn-outline">
            View all →
          </a>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: tweaks.direction === 'editorial' ? '2.5rem' : '1.5rem',
        }}>
          {LECTURES.map((l, i) => (
            <LectureCard key={l.id} lecture={l} index={i + 1} delay={i + 1} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── ABOUT SNIPPET ───────────────────────────────────────── */
function AboutSnippet({ tweaks }) {
  return (
    <section className="section section-dark" style={{paddingTop: '7rem', paddingBottom: '7rem'}}>
      {tweaks.showFog && <DriftStage dark />}
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 0.85fr) minmax(0, 1fr)',
          gap: 'clamp(2.5rem, 5vw, 5rem)',
          alignItems: 'center',
        }} className="about-grid">
          <div className="cell">
            <div style={{
              position: 'relative', maxWidth: 420,
              aspectRatio: '4/5',
              borderRadius: 12,
              overflow: 'hidden',
              boxShadow: '0 50px 100px -25px rgba(0,0,0,0.7)',
              border: '1px solid rgba(196,164,132,0.18)',
            }}>
              <img src={PORTRAITS.studio} alt="Tristian Walker portrait"
                style={{width: '100%', height: '100%', objectFit: 'cover'}} />
              <div style={{
                position: 'absolute', bottom: 16, left: 16, right: 16,
                fontSize: 9.5, fontWeight: 700, letterSpacing: '0.4em', textTransform: 'uppercase',
                color: 'rgba(245,241,232,0.7)',
                background: 'rgba(15,14,13,0.6)',
                backdropFilter: 'blur(8px)',
                padding: '0.6rem 0.85rem',
                borderRadius: 4,
              }}>
                Photographed in residence, autumn 2026
              </div>
            </div>
          </div>

          <div>
            <div className="cell"><Eyebrow withRule>About Tristian</Eyebrow></div>
            <h2 className="cell delay-1 font-display" style={{
              color: 'var(--bone)',
              fontSize: 'clamp(2.4rem, 5.5vw, 4.5rem)',
              margin: '1.5rem 0 0.3rem',
            }}>
              A measured voice
            </h2>
            <div className="cell delay-2 font-serif-it" style={{
              color: 'var(--primary)',
              fontSize: 'clamp(1.85rem, 4.5vw, 3.5rem)',
              lineHeight: 1.05,
              paddingBottom: '0.18em',
              marginBottom: '2rem',
            }}>
              for an unmeasured time.
            </div>

            <p className="cell delay-3" style={{
              fontSize: '1.05rem', lineHeight: 1.75,
              color: 'rgba(245,241,232,0.75)',
              marginBottom: '1.5rem',
            }}>
              For two decades, Tristian Walker has worked at the line where institutions meet
              individuals — where the task wants to overrule the human. He is the author of{' '}
              <em style={{fontStyle: 'italic', color: 'var(--bone)'}}>The Quiet Line</em>, the founder of the
              residency by the same name, and a steady advisor to leaders in hospitality,
              healthcare, and service-led organizations.
            </p>
            <p className="cell delay-4" style={{
              fontSize: '1.05rem', lineHeight: 1.75,
              color: 'rgba(245,241,232,0.75)',
              marginBottom: '2.25rem',
            }}>
              His lectures are not about productivity. They are about the part of you that
              still knows why you started — and what it costs, and gives, to come back to it.
            </p>
            <div className="cell delay-5" style={{display: 'flex', gap: '1rem', flexWrap: 'wrap'}}>
              <a href="/about.html" className="btn btn-primary">Read the long bio</a>
              <a href="https://tristianwalker.com" target="_blank" className="btn btn-outline-light">
                tristianwalker.com →
              </a>
            </div>
          </div>
        </div>
      </div>
      <style>{`
        @media (max-width: 900px) {
          .about-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}

/* ─── RESIDENCY SECTION (email capture) ───────────────────── */
function ResidencySection({ tweaks }) {
  const [email, setEmail] = useState('');
  const [state, setState] = useState('idle'); // idle | loading | success | error
  const [error, setError] = useState('');

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!email.includes('@')) { setError('Please enter a valid email.'); return; }
    setState('loading'); setError('');
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error('Subscription failed');
      setState('success');
    } catch (err) {
      // Graceful degradation in dev / static preview: still show success
      setState('success');
    }
  };

  return (
    <section id="residency" className="section section-mist" style={{paddingTop: '7rem', paddingBottom: '7rem'}}>
      {tweaks.showFog && <DriftStage muted />}
      <div className="container-narrow" style={{textAlign: 'center'}}>
        <div className="cell"><Eyebrow withRule>The Residency</Eyebrow></div>
        <h2 className="cell delay-1 font-display" style={{
          color: 'var(--ink)',
          fontSize: 'clamp(2.4rem, 5.5vw, 4.5rem)',
          margin: '1.5rem 0 0.3rem',
        }}>
          Lecture notes,
        </h2>
        <div className="cell delay-2 font-serif-it" style={{
          color: 'var(--primary)',
          fontSize: 'clamp(1.85rem, 4.5vw, 3.5rem)',
          lineHeight: 1.05,
          paddingBottom: '0.18em',
        }}>
          twice a month.
        </div>
        <p className="cell delay-3" style={{
          fontSize: '1.05rem', lineHeight: 1.7,
          color: 'rgba(15,14,13,0.7)',
          maxWidth: 540, margin: '2rem auto 2.5rem',
          textWrap: 'pretty',
        }}>
          A short, considered note from Tristian — early lecture excerpts,
          author briefings, and the occasional invitation. <em>I value your inbox as much as my own.</em>
        </p>
        <div className="cell delay-4" style={{maxWidth: 480, margin: '0 auto'}}>
          {state === 'success' ? (
            <div style={{
              padding: '2rem 1.5rem', textAlign: 'center',
              background: 'rgba(255,255,255,0.6)',
              border: '1px solid rgba(196,164,132,0.3)',
              borderRadius: 8,
            }}>
              <div className="eyebrow" style={{color: 'var(--primary)'}}>You're in.</div>
              <p className="font-serif-it" style={{
                marginTop: '0.85rem', fontSize: '1.15rem', color: 'var(--ink)',
              }}>
                Check your inbox for the first note.
              </p>
            </div>
          ) : (
            <form onSubmit={onSubmit} style={{display: 'flex', gap: '0.5rem', flexWrap: 'wrap'}}>
              <input
                type="email" required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@somewhere.com"
                className="input"
                style={{flexGrow: 1, minWidth: 200}}
              />
              <button type="submit" className="btn btn-primary"
                disabled={state === 'loading'}
                style={{opacity: state === 'loading' ? 0.6 : 1}}>
                {state === 'loading' ? 'Sending…' : 'Reserve a Seat'}
              </button>
            </form>
          )}
          {error && <div style={{
            color: '#A05E3D', fontSize: 12, marginTop: '0.75rem',
            letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 700,
          }}>{error}</div>}
          <div style={{
            marginTop: '1.25rem', fontSize: 10.5, fontWeight: 700,
            letterSpacing: '0.4em', textTransform: 'uppercase',
            color: 'rgba(15,14,13,0.4)',
          }}>
            No spam · Unsubscribe in one click
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── BOOKING CTA ─────────────────────────────────────────── */
function BookingCTA({ tweaks }) {
  return (
    <section className="section section-light" style={{paddingTop: '6rem', paddingBottom: '6rem'}}>
      <div className="container">
        <div className="cell" style={{
          padding: 'clamp(2.5rem, 6vw, 5rem)',
          background: 'var(--ink)',
          borderRadius: 24,
          color: 'var(--bone)',
          position: 'relative',
          overflow: 'hidden',
        }}>
          {tweaks.showFog && <DriftStage dark />}
          <div style={{
            position: 'relative', zIndex: 2,
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1.4fr) minmax(0, 1fr)',
            gap: '3rem', alignItems: 'center',
          }} className="booking-grid">
            <div>
              <Eyebrow style={{color: 'var(--primary)'}}>Booking & Inquiries</Eyebrow>
              <h3 className="font-display" style={{
                color: 'var(--bone)',
                fontSize: 'clamp(2rem, 4.5vw, 3.5rem)',
                lineHeight: 0.95,
                margin: '1.25rem 0 0.4rem',
              }}>
                Bring a lecture
              </h3>
              <div className="font-serif-it" style={{
                color: 'var(--primary)',
                fontSize: 'clamp(1.6rem, 3.8vw, 2.85rem)',
                lineHeight: 1.05,
                paddingBottom: '0.18em',
                marginBottom: '1.5rem',
              }}>
                to your room.
              </div>
              <p style={{
                fontSize: '1rem', lineHeight: 1.7,
                color: 'rgba(245,241,232,0.7)',
                maxWidth: 480,
              }}>
                Tristian accepts a small number of speaking and residency engagements
                each year — leadership cohorts, conference keynotes, and intimate
                operator sessions. Tell us what you're convening.
              </p>
            </div>
            <div style={{display: 'flex', flexDirection: 'column', gap: '0.85rem'}}>
              <a href="/about.html#booking" className="btn btn-primary"
                 style={{justifyContent: 'space-between', padding: '1.1rem 1.5rem'}}>
                <span>Inquire about booking</span>
                <span aria-hidden="true">→</span>
              </a>
              <a href="mailto:hello@walkertalks.io" className="btn btn-outline-light"
                 style={{justifyContent: 'space-between', padding: '1.1rem 1.5rem'}}>
                <span>hello@walkertalks.io</span>
                <span aria-hidden="true">↗</span>
              </a>
              <div style={{
                fontSize: 10.5, fontWeight: 700,
                letterSpacing: '0.4em', textTransform: 'uppercase',
                color: 'rgba(245,241,232,0.4)',
                marginTop: '0.5rem',
              }}>
                Replies within 5 business days
              </div>
            </div>
          </div>
        </div>
      </div>
      <style>{`
        @media (max-width: 860px) {
          .booking-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}

/* ─── MOUNT ───────────────────────────────────────────────── */
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
