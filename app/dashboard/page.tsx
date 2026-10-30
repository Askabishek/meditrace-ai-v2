import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { DashboardClient } from "@/components/dashboard-client";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) redirect("/login");

  return (
    <main className="shell">
      <nav className="nav">
        <Link className="brand" href="/dashboard"><span className="brand-mark">M</span>MediTrace AI</Link>
        <div className="nav-actions"><span className="small">{user.email}</span><form action="/auth/signout" method="post"><button className="btn btn-secondary" type="submit">Sign out</button></form></div>
      </nav>
      <section className="container dashboard">
        <div className="dashboard-head"><div><span className="eyebrow">Your private workspace</span><h1>Good to see you.</h1><p className="subtle">Explore a health question with careful language and clear limitations.</p></div></div>
        <DashboardClient />
      </section>
      <footer className="footer"><div className="container">MediTrace AI provides general information, not diagnosis or treatment.</div></footer>
    </main>
  );
}
