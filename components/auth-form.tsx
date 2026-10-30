"use client";

import Link from "next/link";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Mode = "login" | "signup";

export function AuthForm({ mode }: { mode: Mode }) {
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true); setMessage(""); setError("");
    try {
      if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: { emailRedirectTo: `${window.location.origin}/auth/callback?next=/dashboard` },
        });
        if (error) throw error;
        if (data.session) window.location.assign("/dashboard");
        else setMessage("Account created. Check your email to confirm your address, then sign in.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
        if (error) throw error;
        window.location.assign("/dashboard");
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Authentication failed.");
    } finally { setBusy(false); }
  }

  async function googleSignIn() {
    setBusy(true); setError(""); setMessage("");
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: `${window.location.origin}/auth/callback?next=/dashboard` },
      });
      if (error) throw error;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Google sign-in failed.");
      setBusy(false);
    }
  }

  return (
    <main className="shell">
      <nav className="nav"><Link className="brand" href="/"><span className="brand-mark">M</span>MediTrace AI</Link><Link href="/" className="small">Back to home</Link></nav>
      <section className="auth-wrap">
        <div className="auth-card">
          <span className="eyebrow">Secure workspace</span>
          <h1>{mode === "login" ? "Welcome back" : "Create your account"}</h1>
          <p className="subtle">{mode === "login" ? "Sign in to continue to your MediTrace workspace." : "Start with an account to access your private workspace."}</p>
          <button className="btn btn-secondary full" onClick={googleSignIn} disabled={busy} type="button"><span aria-hidden>G</span> Continue with Google</button>
          <div className="separator">or use email</div>
          <form onSubmit={submit}>
            <label className="field">Email address<input type="email" autoComplete="email" required value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com" /></label>
            <label className="field">Password<input type="password" autoComplete={mode === "login" ? "current-password" : "new-password"} minLength={8} required value={password} onChange={e=>setPassword(e.target.value)} placeholder="At least 8 characters" /></label>
            {error && <p role="alert" className="error">{error}</p>}
            {message && <p role="status" className="success">{message}</p>}
            <button className="btn btn-primary full" disabled={busy} type="submit">{busy ? "Please wait…" : mode === "login" ? "Sign in" : "Create account"}</button>
          </form>
          <p className="small" style={{marginTop:18}}>{mode === "login" ? <>New to MediTrace AI? <Link href="/signup" style={{color:"var(--teal)",fontWeight:700}}>Create an account</Link></> : <>Already registered? <Link href="/login" style={{color:"var(--teal)",fontWeight:700}}>Sign in</Link></>}</p>
          <p className="small">Never enter emergency details here. If you may be experiencing a medical emergency, contact local emergency services.</p>
        </div>
      </section>
    </main>
  );
}
