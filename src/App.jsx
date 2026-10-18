import { lazy, Suspense, useEffect, useState } from 'react'
import { guardians } from './guardians.js'
import './App.css'

const HeroScene = lazy(() =>
  import('./Scene3D.jsx').then((module) => ({ default: module.HeroScene })),
)
const GuardianScene = lazy(() =>
  import('./Scene3D.jsx').then((module) => ({ default: module.GuardianScene })),
)

const navLinks = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'Divisions', href: '#divisions' },
  { label: 'Events', href: '#events' },
  { label: 'Team', href: '#team' },
]

const divisions = [
  {
    title: 'Technology & AI',
    accent: '#00E5FF',
    glyph: 'technology',
    description:
      'Building digital tools, AI-driven experiences, and innovations that turn ideas into momentum.',
  },
  {
    title: 'Media & Public Relations',
    accent: '#E62429',
    glyph: 'signal',
    description:
      'Crafting narratives, outreach, and visibility for the initiative and its community.',
  },
  {
    title: 'Creative Studio',
    accent: '#A78BFA',
    glyph: 'creative',
    description:
      'Designing visual storytelling, brand systems, and media that shape the AMU Orbiter identity.',
  },
  {
    title: 'Events & Operations',
    accent: '#7DD3FC',
    glyph: 'orbit',
    description:
      'Turning concept into experience through planning, coordination, and memorable execution.',
  },
  {
    title: 'Research & Strategy',
    accent: '#34D399',
    glyph: 'research',
    description:
      'Mapping opportunities, exploring ideas, and building strategic direction for growth.',
  },
  {
    title: 'Community & Collaboration',
    accent: '#FBBF24',
    glyph: 'community',
    description:
      'Connecting students, ideas, and networks to build a stronger and more ambitious ecosystem.',
  },
]

const missions = [
  {
    title: 'Launch Lab',
    date: '12 Oct 2026',
    location: 'AMU Innovation Hub',
    status: 'Registration Open',
    art: 'prototype',
    description:
      'An ideation sprint where students explore prototypes, pitch concepts, and shape tangible solutions.',
  },
  {
    title: 'Campus Storytelling Week',
    date: '28 Oct 2026',
    location: 'AMU Campus',
    status: 'Upcoming',
    art: 'story',
    description:
      'A multi-day media, content, and outreach showcase centered on student creativity and campus culture.',
  },
  {
    title: 'Innovation Forum',
    date: '15 Nov 2026',
    location: 'TPO Seminar Hall',
    status: 'Completed',
    art: 'forum',
    description:
      'A collaborative forum bringing together students, speakers, and mentors for future-focused discussion.',
  },
]

const stats = [
  { label: 'Members', value: 'TBD' },
  { label: 'Events', value: 'TBD' },
  { label: 'Projects', value: 'TBD' },
  { label: 'Collaborations', value: 'TBD' },
]

const initialForm = {
  name: '',
  email: '',
  department: '',
  year: '',
  skills: '',
  division: 'Technology & AI',
  message: '',
}

function App() {
  const [booting, setBooting] = useState(true)
  const [navOpen, setNavOpen] = useState(false)
  const [formData, setFormData] = useState(initialForm)
  const [errors, setErrors] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [selectedGuardian, setSelectedGuardian] = useState(0)

  useEffect(() => {
    const timer = window.setTimeout(() => setBooting(false), 2100)
    return () => window.clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (!('IntersectionObserver' in window)) return undefined

    const sections = document.querySelectorAll('[data-reveal]')
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.12, rootMargin: '0px 0px -48px 0px' },
    )

    sections.forEach((section) => {
      section.classList.add('reveal-pending')
      observer.observe(section)
    })

    return () => observer.disconnect()
  }, [])

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((current) => ({ ...current, [name]: value }))
    setErrors((current) => ({ ...current, [name]: '' }))
    setSubmitted(false)
  }

  const validate = () => {
    const nextErrors = {}

    if (!formData.name.trim()) nextErrors.name = 'Please enter your full name.'
    if (!formData.email.trim()) {
      nextErrors.email = 'Please enter your university email.'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      nextErrors.email = 'Enter a valid email address.'
    }
    if (!formData.department.trim()) nextErrors.department = 'Please enter your department.'
    if (!formData.year.trim()) nextErrors.year = 'Please mention your year.'
    if (!formData.skills.trim()) nextErrors.skills = 'Share at least one skill or interest.'
    if (!formData.message.trim()) nextErrors.message = 'Tell us why you want to join.'

    return nextErrors
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    const nextErrors = validate()

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors)
      setSubmitted(false)
      return
    }

    setErrors({})
    setSubmitted(true)
  }

  return (
    <div className="page-shell">
      {booting && (
        <div className="boot-screen" aria-live="polite">
          <div className="boot-panel">
            <p className="boot-label">ORBITER SYSTEM STATUS</p>
            <div className="boot-bar">
              <span className="boot-progress" />
            </div>
            <div className="boot-text">
              <span>SYSTEM INITIALIZED</span>
            </div>
            <button type="button" className="skip-button" onClick={() => setBooting(false)}>
              SKIP BOOT
            </button>
          </div>
        </div>
      )}

      <header className="topbar">
        <div className="brand-wrap">
          <div className="brand-mark">
            <span className="brand-core" />
          </div>
          <span>AMU ORBITER</span>
        </div>
        <nav className={`main-nav${navOpen ? ' is-open' : ''}`} aria-label="Main navigation">
          {navLinks.map((link) => (
            <a key={link.label} href={link.href} onClick={() => setNavOpen(false)}>
              {link.label}
            </a>
          ))}
        </nav>
        <button
          type="button"
          className={`menu-toggle${navOpen ? ' is-open' : ''}`}
          aria-label={navOpen ? 'Close navigation' : 'Open navigation'}
          aria-expanded={navOpen}
          onClick={() => setNavOpen((open) => !open)}
        >
          <span />
          <span />
        </button>
        <a href="#join" className="nav-cta">
          JOIN NOW
        </a>
      </header>

      <main>
        <section id="home" className="hero-section">
          <div className="background-grid" />
          <div className="starfield" />
          <div className="hero-copy" data-reveal>
            <p className="eyebrow">TPO-ASSOCIATED STUDENT INITIATIVE // AMU</p>
            <h1>AMU ORBITER</h1>
            <h2>ASSEMBLING THE NEXT GENERATION.</h2>
            <p className="lead">
              A student-driven initiative at Aligarh Muslim University bringing together creativity,
              technology, innovation, media, and ambitious minds.
            </p>
            <div className="cta-row">
              <a href="#join" className="primary-button">
                JOIN THE ORBIT
              </a>
              <a href="#about" className="secondary-button">
                EXPLORE THE INITIATIVE
              </a>
            </div>
            <div className="status-line">
              <span className="signal" />
              SYSTEM INITIALIZED
            </div>
          </div>

          <div className="hero-visual" aria-label="Orbiter emblem illustration">
            <div className="hero-coordinate coordinate-top" aria-hidden="true">
              <span>CORE // 01</span>
              <i />
            </div>
            <div className="ring ring-one" />
            <div className="ring ring-two" />
            <div className="ring ring-three" />
            <Suspense fallback={<div className="scene-fallback" aria-hidden="true" />}>
              <HeroScene />
            </Suspense>
            <div className="energy-line line-one" />
            <div className="energy-line line-two" />
            <div className="energy-line line-three" />
            <div className="orbit-pulse pulse-one" />
            <div className="orbit-pulse pulse-two" />
            <div className="hero-coordinate coordinate-bottom" aria-hidden="true">
              <i />
              <span>AMU • 27.91° N</span>
            </div>
          </div>
        </section>

        <section id="about" className="about-section panel" data-reveal>
          <div className="section-heading">
            <p className="section-tag">ABOUT</p>
            <h3>MORE THAN A CLUB. A UNIVERSE OF POSSIBILITIES.</h3>
          </div>

          <div className="about-grid">
            <div className="about-copy">
              <p>
                AMU Orbiter is a student initiative that brings together students through creativity,
                technology, media, innovation, and collaboration. It creates spaces where ideas move
                from concept to action and where ambitious minds can learn, build, and lead together.
              </p>
              <div className="info-cards">
                <div className="mini-card">
                  <span className="mini-label">Mission</span>
                  <p>Empower students to collaborate across disciplines and grow through innovation.</p>
                </div>
                <div className="mini-card">
                  <span className="mini-label">Vision</span>
                  <p>Build a vibrant ecosystem where creativity meets technology and opportunity.</p>
                </div>
                <div className="mini-card">
                  <span className="mini-label">Leadership</span>
                  <p>Student-led coordination and collaborative decision-making.</p>
                </div>
                <div className="mini-card">
                  <span className="mini-label">Affiliation</span>
                  <p>Associated with the Training and Placement Office, AMU.</p>
                </div>
              </div>
            </div>

            <div className="orbital-diagram" aria-hidden="true">
              <div className="orbit orbit-a" />
              <div className="orbit orbit-b" />
              <div className="orbit orbit-c" />
              <div className="core-node">AMU</div>
              <div className="floating-node node-1">AI</div>
              <div className="floating-node node-2">MEDIA</div>
              <div className="floating-node node-3">IDEAS</div>
            </div>
          </div>
        </section>

        <section id="divisions" className="divisions-section panel" data-reveal>
          <div className="section-heading center">
            <p className="section-tag">OUR DIVISIONS</p>
            <h3>A TEAM BUILT AROUND IDEAS.</h3>
          </div>

          <div className="division-grid">
            {divisions.map((division) => (
              <article key={division.title} className="division-card" style={{ '--accent': division.accent }}>
                <div className="division-icon" aria-hidden="true">
                  <svg viewBox="0 0 32 32" fill="none">
                    {division.glyph === 'technology' && (
                      <>
                        <path d="M16 4v5M16 23v5M4 16h5M23 16h5M7.5 7.5l3.6 3.6m9.8 9.8 3.6 3.6m0-17-3.6 3.6m-9.8 9.8-3.6 3.6" />
                        <circle cx="16" cy="16" r="6.2" />
                        <circle className="icon-dot" cx="16" cy="16" r="1.7" />
                      </>
                    )}
                    {division.glyph === 'signal' && (
                      <>
                        <path d="M5 12.5a16 16 0 0 1 22 0M9 16.5a10 10 0 0 1 14 0M13 20.5a4 4 0 0 1 6 0" />
                        <circle className="icon-dot" cx="16" cy="25" r="1.5" />
                      </>
                    )}
                    {division.glyph === 'creative' && (
                      <>
                        <path d="m16 3 3.2 8.8L28 15l-8.8 3.2L16 27l-3.2-8.8L4 15l8.8-3.2L16 3Z" />
                        <circle cx="16" cy="15" r="2.2" />
                      </>
                    )}
                    {division.glyph === 'orbit' && (
                      <>
                        <circle cx="16" cy="16" r="3" />
                        <ellipse cx="16" cy="16" rx="12" ry="5.5" transform="rotate(-28 16 16)" />
                        <circle className="icon-dot" cx="25" cy="10" r="1.7" />
                      </>
                    )}
                    {division.glyph === 'research' && (
                      <>
                        <circle cx="14" cy="14" r="8" />
                        <path d="m20 20 7 7M14 10v8m-4-4h8" />
                      </>
                    )}
                    {division.glyph === 'community' && (
                      <>
                        <circle cx="16" cy="11" r="4" />
                        <circle cx="7" cy="15" r="2.5" />
                        <circle cx="25" cy="15" r="2.5" />
                        <path d="M8 26c.5-4 3-6 8-6s7.5 2 8 6M2.5 25c.2-2.8 1.7-4.4 4.5-4.8m22.5 4.8c-.2-2.8-1.7-4.4-4.5-4.8" />
                      </>
                    )}
                  </svg>
                </div>
                <h4>{division.title}</h4>
                <p>{division.description}</p>
                <a href="#join" className="division-link">
                  DISCOVER DIVISION <span aria-hidden="true">↗</span>
                </a>
              </article>
            ))}
          </div>
        </section>

        <section className="command-section panel" data-reveal>
          <div className="section-heading">
            <p className="section-tag">COMMAND CENTER</p>
            <h3>INTERACTIVE ORBITER CONTROL</h3>
          </div>

          <div className="command-layout">
            <div className="command-radar" aria-hidden="true">
              <div className="radar-center" />
              <div className="radar-ring ring-1" />
              <div className="radar-ring ring-2" />
              <div className="radar-ring ring-3" />
              <div className="radar-dot dot-1" />
              <div className="radar-dot dot-2" />
              <div className="radar-dot dot-3" />
              <div className="radar-dot dot-4" />
            </div>

            <div className="system-panel">
              <div className="status-header">
                <span>MISSION STATUS</span>
                <span className="online-chip">ONLINE</span>
              </div>
              <ul className="status-list">
                {stats.map((item) => (
                  <li key={item.label}>
                    <span>{item.label}</span>
                    <strong>{item.value}</strong>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section id="events" className="events-section panel" data-reveal>
          <div className="section-heading center">
            <p className="section-tag">MISSIONS</p>
            <h3>UPCOMING MISSIONS</h3>
          </div>

          <div className="mission-grid">
            {missions.map((mission) => (
              <article key={mission.title} className="mission-card">
                <div className={`mission-art mission-art-${mission.art}`} aria-hidden="true">
                  <span className="mission-art-mark" />
                  <span className="mission-art-label">ORBITER // FIELD NOTE</span>
                  <span className="mission-badge">{mission.status}</span>
                </div>
                <div className="mission-content">
                  <h4>{mission.title}</h4>
                  <p>{mission.description}</p>
                  <ul>
                    <li>{mission.date}</li>
                    <li>{mission.location}</li>
                  </ul>
                  <a href="#join">REGISTER NOW</a>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="team" className="team-section panel" data-reveal>
          <div className="section-heading center">
            <p className="section-tag">ORBITER GUARDIANS // ORIGINAL 3D CHARACTERS</p>
            <h3>EVERY GREAT MISSION NEEDS A TEAM.</h3>
            <p className="team-intro">
              Meet our original, fictional guardians—each representing a different force behind the
              Orbiter initiative.
            </p>
          </div>

          <div className="guardian-scene-wrap">
            <Suspense fallback={<div className="scene-fallback" aria-hidden="true" />}>
              <GuardianScene selected={selectedGuardian} />
            </Suspense>
            <div className="guardian-caption" style={{ '--accent': guardians[selectedGuardian].accent }}>
              <span>ACTIVE PROFILE</span>
              <h4>{guardians[selectedGuardian].name}</h4>
              <p>{guardians[selectedGuardian].detail}</p>
            </div>
          </div>
          <div className="guardian-selector" role="group" aria-label="Choose an Orbiter guardian">
            {guardians.map((guardian, index) => (
              <button
                key={guardian.name}
                type="button"
                className={`guardian-option${selectedGuardian === index ? ' is-active' : ''}`}
                style={{ '--accent': guardian.accent }}
                aria-pressed={selectedGuardian === index}
                onClick={() => setSelectedGuardian(index)}
              >
                <span className="guardian-index">0{index + 1}</span>
                <span>
                  <strong>{guardian.name}</strong>
                  <small>{guardian.title}</small>
                </span>
                <span className="guardian-arrow" aria-hidden="true">↗</span>
              </button>
            ))}
          </div>
        </section>

        <section id="join" className="join-section panel" data-reveal>
          <div className="join-content">
            <div className="join-copy">
              <p className="section-tag">RECRUITMENT</p>
              <h3>EARTH NEEDS ITS NEXT GENERATION. SO DOES THE ORBIT.</h3>
              <p>
                Have an idea worth building? A skill worth sharing? A vision worth pursuing? Find your
                place in AMU Orbiter.
              </p>
              <div className="cta-row">
                <a href="#join-form" className="primary-button">
                  BECOME A MEMBER
                </a>
                <a href="#team" className="secondary-button">
                  MEET THE TEAM
                </a>
              </div>
            </div>

            <form id="join-form" className="recruitment-form" noValidate onSubmit={handleSubmit}>
              <div className="field-row">
                <label>
                  <span>Full name</span>
                  <input name="name" value={formData.name} onChange={handleChange} aria-invalid={Boolean(errors.name)} />
                  {errors.name && <small>{errors.name}</small>}
                </label>
                <label>
                  <span>University email</span>
                  <input type="email" name="email" value={formData.email} onChange={handleChange} aria-invalid={Boolean(errors.email)} />
                  {errors.email && <small>{errors.email}</small>}
                </label>
              </div>

              <div className="field-row">
                <label>
                  <span>Department</span>
                  <input name="department" value={formData.department} onChange={handleChange} aria-invalid={Boolean(errors.department)} />
                  {errors.department && <small>{errors.department}</small>}
                </label>
                <label>
                  <span>Year</span>
                  <input name="year" value={formData.year} onChange={handleChange} aria-invalid={Boolean(errors.year)} />
                  {errors.year && <small>{errors.year}</small>}
                </label>
              </div>

              <label>
                <span>Skills and interests</span>
                <input name="skills" value={formData.skills} onChange={handleChange} aria-invalid={Boolean(errors.skills)} />
                {errors.skills && <small>{errors.skills}</small>}
              </label>

              <label>
                <span>Preferred division</span>
                <select name="division" value={formData.division} onChange={handleChange}>
                  {divisions.map((division) => (
                    <option key={division.title} value={division.title}>
                      {division.title}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                <span>Why do you want to join?</span>
                <textarea name="message" rows="4" value={formData.message} onChange={handleChange} aria-invalid={Boolean(errors.message)} />
                {errors.message && <small>{errors.message}</small>}
              </label>

              <button type="submit" className="submit-button">
                SEND APPLICATION
              </button>
              {submitted && <p className="success-state">Application drafted successfully. Connect your form backend to send submissions.</p>}
            </form>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <p>AMU Orbiter • Student initiative for creativity, technology, and collaboration.</p>
      </footer>
    </div>
  )
}

export default App
