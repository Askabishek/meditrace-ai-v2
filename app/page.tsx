import Link from "next/link";

export default function Home() {
  return (
    <main className="shell">
      <nav className="nav">
        <Link className="brand" href="/"><span className="brand-mark">M</span>MediTrace AI</Link>
        <div className="nav-actions">
          <Link className="btn btn-secondary" href="/login">Sign in</Link>
          <Link className="btn btn-primary" href="/signup">Get started <span aria-hidden>↗</span></Link>
        </div>
      </nav>
      <section className="container hero">
        <div>
          <span className="eyebrow"><span className="pulse" /> Health information, thoughtfully explored</span>
          <h1>Make sense of health information with more clarity.</h1>
          <p className="lead">Explore health questions in a calm, structured workspace designed to help you organize information, understand uncertainty, and prepare for conversations with qualified healthcare professionals.</p>
          <div className="actions">
            <Link className="btn btn-primary" href="/signup">Create your workspace <span aria-hidden>→</span></Link>
            <Link className="btn btn-secondary" href="/login">I already have an account</Link>
          </div>
          <p className="small" style={{marginTop:18}}>MediTrace AI provides informational support only. It does not diagnose conditions or replace professional medical care.</p>
        </div>
        <div className="hero-card" aria-label="Illustration of an information dashboard">
          <div className="card-top"><strong>Health insight workspace</strong><span className="mini-tag">Private by design</span></div>
          <div className="mock-panel"><span className="small">YOUR QUESTION</span><div className="mock-line mid"/><div className="mock-line short"/></div>
          <div className="mock-panel"><span className="mini-tag">Information summary</span><div className="mock-line"/><div className="mock-line mid"/><div className="mock-line short"/><p className="small">Possible explanations are not confirmed findings.</p></div>
          <div style={{display:"flex",gap:9,marginTop:14,flexWrap:"wrap"}}><span className="mini-tag">Evidence-aware</span><span className="mini-tag">User-controlled</span><span className="mini-tag">Clear limitations</span></div>
        </div>
      </section>
      <section className="container features">
        <article className="feature"><div className="feature-icon">⌕</div><h3>Explore thoughtfully</h3><p>Organize a health question and explore general information without presenting guesses as diagnoses.</p></article>
        <article className="feature"><div className="feature-icon">◈</div><h3>Understand uncertainty</h3><p>Responses are framed as general information, with clear limitations and reminders to consult clinicians.</p></article>
        <article className="feature"><div className="feature-icon">▤</div><h3>Prepare for care</h3><p>Use the information to prepare questions for a qualified healthcare professional.</p></article>
      </section>
      <footer className="footer"><div className="container">MediTrace AI · Informational support, not medical diagnosis.</div></footer>
    </main>
  );
}
