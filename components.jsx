/* ════════════════════════════════════════════════════════════════
   WalkerTalks — Shared Components
   Reveal observer, nav, footer, lecture card, drift fog, etc.
   ════════════════════════════════════════════════════════════ */

const { useState, useEffect, useRef, useCallback } = React;

/* ─── COLOR UTIL ────────────────────────────────────────────── */
function shadeColor(hex, percent) {
  const f = parseInt(hex.slice(1), 16);
  const t = percent < 0 ? 0 : 255;
  const p = Math.abs(percent) / 100;
  const R = f >> 16, G = (f >> 8) & 0x00FF, B = f & 0x0000FF;
  const toHex = (x) => Math.round((t - x) * p + x).toString(16).padStart(2, '0');
  return '#' + toHex(R) + toHex(G) + toHex(B);
}

/* ─── REVEAL OBSERVER HOOK ─────────────────────────────────── */
function useReveal() {
  useEffect(() => {
    const revealVisible = () => {
      document.querySelectorAll('.cell:not(.in)').forEach(el => {
        const r = el.getBoundingClientRect();
        if (r.top < window.innerHeight * 1.1 && r.bottom > -50) {
          el.classList.add('in');
        }
      });
    };

    if (!('IntersectionObserver' in window)) {
      document.querySelectorAll('.cell:not(.in)').forEach(el => el.classList.add('in'));
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.05, rootMargin: '0px 0px -40px 0px' });

    const observe = () => {
      document.querySelectorAll('.cell:not(.in)').forEach(el => {
        if (!el.dataset.revealObserved) {
          el.dataset.revealObserved = '1';
          io.observe(el);
        }
      });
    };
    observe();

    // Safety net: if IO hasn't revealed in-viewport cells within 700ms
    // (some embedded contexts throttle it), reveal them by manual rect check.
    const t1 = setTimeout(observe, 100);
    const t2 = setTimeout(() => { observe(); revealVisible(); }, 700);
    const t3 = setTimeout(revealVisible, 1500);

    // Belt-and-suspenders: in preview/embedded iframes the compositor clock
    // can be paused, leaving CSS transitions stuck at currentTime=0. Force
    // any pending reveal animations to finish after a short delay.
    const t4 = setTimeout(() => {
      document.querySelectorAll('.cell.in').forEach(el => {
        el.getAnimations().forEach(a => { try { a.finish(); } catch(_) {} });
      });
    }, 1800);
    const t5 = setTimeout(() => {
      document.querySelectorAll('.cell.in').forEach(el => {
        el.getAnimations().forEach(a => { try { a.finish(); } catch(_) {} });
      });
    }, 3000);

    // Also reveal on scroll as a backup.
    const onScroll = () => revealVisible();
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      clearTimeout(t1); clearTimeout(t2); clearTimeout(t3);
      clearTimeout(t4); clearTimeout(t5);
      window.removeEventListener('scroll', onScroll);
      io.disconnect();
    };
  }, []);
}

/* ─── SCROLLED-NAV HOOK ────────────────────────────────────── */
function useScrolled(threshold = 40) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > threshold);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [threshold]);
  return scrolled;
}

/* ─── CURSOR FOG ───────────────────────────────────────────── */
function CursorFog() {
  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) return;
    const fog = document.createElement('div');
    fog.className = 'cursor-fog';
    document.body.appendChild(fog);
    let raf = null, tx = 0, ty = 0, cx = 0, cy = 0;
    const onMove = (e) => {
      tx = e.clientX; ty = e.clientY;
      document.body.classList.add('has-cursor');
      if (!raf) raf = requestAnimationFrame(loop);
    };
    const loop = () => {
      cx += (tx - cx) * 0.08;
      cy += (ty - cy) * 0.08;
      fog.style.transform = `translate(${cx}px, ${cy}px) translate(-50%, -50%)`;
      if (Math.abs(tx-cx) > 0.5 || Math.abs(ty-cy) > 0.5) {
        raf = requestAnimationFrame(loop);
      } else { raf = null; }
    };
    window.addEventListener('mousemove', onMove);
    return () => {
      window.removeEventListener('mousemove', onMove);
      if (raf) cancelAnimationFrame(raf);
      fog.remove();
      document.body.classList.remove('has-cursor');
    };
  }, []);
  return null;
}

/* ─── DRIFT FOG STAGE ──────────────────────────────────────── */
function DriftStage({ dark = false, muted = false }) {
  return (
    <div className={`drift-stage ${dark ? 'dark' : ''} ${muted ? 'muted' : ''}`} aria-hidden="true">
      <div className="fog-blob fog-1"></div>
      <div className="fog-blob fog-2"></div>
      <div className="fog-blob fog-3"></div>
    </div>
  );
}

/* ─── GRAIN OVERLAY ────────────────────────────────────────── */
function Grain() { return <div className="grain" aria-hidden="true"></div>; }

/* ─── HAIRLINE ─────────────────────────────────────────────── */
function Hairline({ width = '3rem', style = {} }) {
  return <span className="hairline" style={{ width, ...style }}></span>;
}

/* ─── EYEBROW ──────────────────────────────────────────────── */
function Eyebrow({ children, withRule = false, className = '', style = {} }) {
  return (
    <div className={`eyebrow ${className}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.85rem', ...style }}>
      {withRule && <Hairline />}
      <span>{children}</span>
      {withRule && <Hairline />}
    </div>
  );
}

/* ─── DRIFT WORD (per-letter bob) ──────────────────────────── */
function DriftWord({ children, className = '', style = {} }) {
  const text = String(children);
  return (
    <span className={`drift-word ${className}`} style={style}>
      {text.split('').map((ch, i) => (
        <span key={i} style={{ whiteSpace: 'pre' }}>{ch}</span>
      ))}
    </span>
  );
}

/* ─── NAV ──────────────────────────────────────────────────── */
function SiteNav({ onDark = false, active = '' }) {
  const scrolled = useScrolled(40);
  const [menuOpen, setMenuOpen] = useState(false);
  const cls = [
    'site-nav',
    onDark ? 'on-dark' : '',
    scrolled ? 'scrolled' : '',
  ].filter(Boolean).join(' ');
  const links = [
    { href: '/lectures.html', label: 'Lectures', key: 'lectures' },
    { href: '/about.html', label: 'About', key: 'about' },
    { href: 'https://tristianwalker.com', label: 'Author', key: 'author', external: true },
  ];
  return (
    <React.Fragment>
      <nav className={cls}>
        <a href="/" className="logo">
          Walker<span className="accent">Talks</span><span style={{color: 'var(--primary)'}}>.</span>
        </a>
        <div className="links">
          {links.map(l => (
            <a key={l.key} href={l.href}
               target={l.external ? '_blank' : undefined}
               className={active === l.key ? 'active' : ''}>
              {l.label}
            </a>
          ))}
          <a href="/#residency" className="btn btn-primary" style={{padding: '0.7rem 1.4rem', fontSize: '10.5px'}}>
            Join the Residency
          </a>
        </div>
        <button className="mobile-menu-toggle"
          aria-label="Open menu"
          onClick={() => setMenuOpen(!menuOpen)}
          style={{
            display: 'none', width: 40, height: 40,
            background: 'transparent', border: '1px solid rgba(15,14,13,0.18)',
            borderRadius: 6, color: onDark ? 'var(--bone)' : 'var(--ink)',
            flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 5
          }}
        >
          <span style={{display:'block',width:18,height:1.5,background:'currentColor'}}></span>
          <span style={{display:'block',width:18,height:1.5,background:'currentColor'}}></span>
          <span style={{display:'block',width:18,height:1.5,background:'currentColor'}}></span>
        </button>
      </nav>
      <style>{`
        @media (max-width: 860px) {
          .site-nav .mobile-menu-toggle { display: flex !important; }
        }
      `}</style>
      {menuOpen && (
        <div onClick={() => setMenuOpen(false)} style={{
          position: 'fixed', inset: 0, zIndex: 60,
          background: 'rgba(15,14,13,0.97)', backdropFilter: 'blur(30px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <div style={{display: 'flex', flexDirection: 'column', gap: '1.5rem', textAlign: 'center'}}>
            {links.map(l => (
              <a key={l.key} href={l.href} target={l.external ? '_blank' : undefined}
                 style={{fontFamily: "'Fraunces', serif", fontStyle: 'italic',
                         fontSize: '1.6rem', color: 'var(--bone)'}}>
                {l.label}
              </a>
            ))}
            <a href="/#residency" className="btn btn-primary" style={{marginTop: '0.5rem'}}>
              Join the Residency
            </a>
          </div>
        </div>
      )}
    </React.Fragment>
  );
}

/* ─── FOOTER ───────────────────────────────────────────────── */
function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container-wide">
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '3rem', paddingBottom: '3.5rem',
          borderBottom: '1px solid rgba(196,164,132,0.18)'
        }}>
          <div style={{maxWidth: 320}}>
            <div className="font-serif" style={{
              fontWeight: 700, fontSize: '1.25rem', letterSpacing: '-0.005em', marginBottom: '0.85rem',
            }}>
              Walker<span style={{color:'var(--primary)', fontStyle:'italic', fontWeight: 400}}>Talks</span>
              <span style={{color: 'var(--primary)'}}>.</span>
            </div>
            <p style={{
              fontSize: 13, lineHeight: 1.7,
              color: 'rgba(245,241,232,0.55)', margin: 0
            }}>
              The lecture series of Tristian Walker.
              From drift to direction — one honest reckoning at a time.
            </p>
          </div>
          <div>
            <div className="eyebrow">Lectures</div>
            <ul style={{listStyle: 'none', padding: 0, margin: '1.25rem 0 0', display: 'flex', flexDirection: 'column', gap: '0.65rem'}}>
              <li><a href="/professional-drift/">Professional Drift</a></li>
              <li><a href="/lectures.html">All lectures</a></li>
              <li style={{color: 'rgba(245,241,232,0.35)', fontSize: 13}}>More coming, 2026</li>
            </ul>
          </div>
          <div>
            <div className="eyebrow">Tristian</div>
            <ul style={{listStyle: 'none', padding: 0, margin: '1.25rem 0 0', display: 'flex', flexDirection: 'column', gap: '0.65rem'}}>
              <li><a href="/about.html">About</a></li>
              <li><a href="https://tristianwalker.com" target="_blank" rel="noreferrer">tristianwalker.com</a></li>
              <li><a href="https://quietlinebook.com" target="_blank" rel="noreferrer">The Quiet Line book</a></li>
            </ul>
          </div>
          <div>
            <div className="eyebrow">Inquiries</div>
            <ul style={{listStyle: 'none', padding: 0, margin: '1.25rem 0 0', display: 'flex', flexDirection: 'column', gap: '0.65rem'}}>
              <li><a href="/about.html#booking">Booking</a></li>
              <li><a href="/#residency">Residency</a></li>
              <li><a href="mailto:hello@walkertalks.io">hello@walkertalks.io</a></li>
            </ul>
          </div>
        </div>
        <div style={{
          paddingTop: '2rem',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem',
          fontSize: 11, fontWeight: 700, letterSpacing: '0.3em', textTransform: 'uppercase',
          color: 'rgba(245,241,232,0.4)'
        }}>
          <div>© {new Date().getFullYear()} Tristian Walker · WalkerTalks</div>
          <div style={{fontFamily: "'Fraunces', serif", fontStyle: 'italic', fontWeight: 300, textTransform: 'none', letterSpacing: '-0.01em', fontSize: 14, color: 'rgba(245,241,232,0.6)'}}>
            From drift, <span style={{color: 'var(--primary)'}}>to direction.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ─── LECTURE CARD ─────────────────────────────────────────── */
function LectureCard({ lecture, index, delay = 0 }) {
  const isLive    = lecture.status === 'live';
  const isTba     = lecture.status === 'tba';
  const isUpcoming = lecture.status === 'upcoming';
  const statusLabel = isLive ? 'Available now' : isUpcoming ? 'Coming 2026' : 'In development';
  const ariaProps = lecture.href ? { href: lecture.href } : {};
  const Tag = lecture.href ? 'a' : 'div';

  return (
    <Tag {...ariaProps}
      className={`lecture-card cell delay-${Math.min(delay, 6)} ${isLive ? 'is-live' : ''} ${isTba ? 'is-tba' : ''}`}
      style={{textDecoration: 'none', display: 'flex'}}>
      <div className="lecture-card-num">{String(index).padStart(2, '0')}</div>
      <div className={`lecture-card-status ${isUpcoming ? 'upcoming' : ''} ${isTba ? 'tba' : ''}`}>
        <span className="dot"></span>
        <span>{statusLabel}</span>
      </div>
      <div className="lecture-card-title">{lecture.title}</div>
      <div className="lecture-card-subtitle">{lecture.subtitle}</div>
      <div className="lecture-card-desc">{lecture.description}</div>
      <div className="lecture-card-meta">
        <span>{lecture.duration}</span>
        <span>·</span>
        <span>{lecture.audience}</span>
      </div>
      {lecture.href ? (
        <span className="lecture-card-cta">
          {isLive ? 'Enter the lecture' : 'Read the brief'}
          <span aria-hidden="true">→</span>
        </span>
      ) : (
        <span className="lecture-card-cta" style={{color: 'rgba(245,241,232,0.4)'}}>
          Notify me when ready
        </span>
      )}
    </Tag>
  );
}

/* ─── LECTURES DATA ────────────────────────────────────────── */
const LECTURES = [
  {
    id: 'professional-drift',
    title: 'Professional Drift',
    subtitle: 'The Quiet Line.',
    description:
      "An hour-long reckoning with what happens when the task overrules the human — the drift between presence and process, and the way back to natural authority.",
    duration: '52 min · with Q&A',
    audience: 'Hospitality · Healthcare · Service-led teams',
    status: 'live',
    href: '/professional-drift/',
  },
  {
    id: 'discipline-and-range',
    title: 'Discipline & Range',
    subtitle: 'The art of staying near.',
    description:
      "On the long argument between depth and breadth — and why the people who last build a disciplined range, not a narrow expertise.",
    duration: '60 min',
    audience: 'Operators · Founders · Practitioners',
    status: 'upcoming',
    href: null,
  },
  {
    id: 'natural-authority',
    title: 'Natural Authority',
    subtitle: 'Lead without performing.',
    description:
      "A study of authority that does not need volume — drawn from a decade in rooms where the loudest voice was rarely the one that mattered.",
    duration: 'TBA',
    audience: 'Leadership cohorts',
    status: 'tba',
    href: null,
  },
];

/* Export everything to window so other Babel scripts can use them. */
Object.assign(window, {
  useReveal, useScrolled, shadeColor,
  CursorFog, DriftStage, Grain, Hairline, Eyebrow, DriftWord,
  SiteNav, SiteFooter, LectureCard, LECTURES,
});
