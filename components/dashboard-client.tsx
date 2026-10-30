"use client";

import { useState } from "react";

export function DashboardClient() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function analyze(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setError(""); setAnswer("");
    try {
      const response = await fetch("/api/health-information", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });
      const payload = await response.json() as { answer?: string; error?: string };
      if (!response.ok) throw new Error(payload.error || "Request failed.");
      setAnswer(payload.answer || "No response was returned.");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not complete the request.");
    } finally { setBusy(false); }
  }

  return (
    <div className="grid-two">
      <section className="panel">
        <h2>Explore a health question</h2>
        <p>Describe a general health-information question. Avoid names, contact details, medical record numbers, or other identifying details.</p>
        <form onSubmit={analyze}>
          <label className="field">Your question<textarea required minLength={10} maxLength={3000} value={question} onChange={e=>setQuestion(e.target.value)} placeholder="What would you like to understand? Avoid including identifying details." /></label>
          {error && <p role="alert" className="error">{error}</p>}
          <button className="btn btn-primary" type="submit" disabled={busy || question.trim().length < 10}>{busy ? "Generating information…" : "Explore information →"}</button>
        </form>
        {answer && <div className="output" aria-live="polite">{answer}</div>}
      </section>
      <aside className="panel">
        <h2>Use this responsibly</h2>
        <p>AI can make mistakes and may omit important context. This tool cannot confirm a condition, rule out illness, or recommend personalized treatment.</p>
        <div className="mock-panel"><span className="mini-tag">Keep in mind</span><p className="small">Use the response to prepare questions for a qualified healthcare professional, not as a substitute for medical assessment.</p></div>
        <div className="mock-panel"><span className="mini-tag">Privacy</span><p className="small">This starter does not save the question or response to a database. Requests are sent to the configured model provider. Do not submit identifiable or highly sensitive health information.</p></div>
        <p className="small">If symptoms may indicate an emergency, contact local emergency services or seek urgent medical care.</p>
      </aside>
    </div>
  );
}
