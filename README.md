# MediTrace AI v2 starter

A fresh Next.js + Supabase Auth starter with email/password, Google OAuth, a protected dashboard, and a server-side NVIDIA-compatible chat-completions route.

This is a starter, not a validated medical product. The AI route is for health-information exploration only and must not be used for diagnosis or treatment decisions.

## Requirements
- Node.js 20.9+
- npm
- Supabase project
- Google OAuth credentials (for Google sign-in)
- NVIDIA API key and a model ID available to your NVIDIA account

## 1. Install
```bash
npm install
cp .env.example .env.local
npm run dev
```
On Windows PowerShell, copy the file with:
```powershell
Copy-Item .env.example .env.local
```

## 2. Configure `.env.local`
Fill in:
- `NEXT_PUBLIC_SUPABASE_URL`: Supabase Project URL
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`: Supabase publishable key (never use a service-role key in the browser)
- `NVIDIA_API_KEY`: server-only NVIDIA API key
- `NVIDIA_MODEL`: exact model ID shown in your NVIDIA model catalog
- `NVIDIA_BASE_URL`: default is `https://integrate.api.nvidia.com/v1`

Never commit `.env.local`.

## 3. Configure Supabase email/password
In Supabase Dashboard:
1. Authentication → Sign In / Providers → enable Email.
2. Set Site URL to `http://localhost:3000` during local development.
3. Under URL Configuration, add `http://localhost:3000/**` to Redirect URLs.
4. For email confirmation, make sure the confirmation email redirect points to your app's `/auth/callback` route. For local testing, you may temporarily disable email confirmation, but enable it before public release.

## 4. Configure Google OAuth
1. In Google Cloud Console, configure the OAuth consent screen.
2. Create OAuth Client ID → Web application.
3. In Google Authorized redirect URIs, add the Supabase callback URL shown in Supabase Auth → Providers → Google. It typically looks like `https://<project-ref>.supabase.co/auth/v1/callback`.
4. Put the Google Client ID and Client Secret into Supabase Auth → Providers → Google.
5. In Supabase URL Configuration, add:
   - `http://localhost:3000/auth/callback`
   - Your deployed app callback, e.g. `https://your-app.vercel.app/auth/callback`
6. Enable Google provider and save.

The Google provider's redirect URI is the Supabase callback, while the app's allowed redirect URL is your Next.js callback. These are different URLs.

## 5. Database and RLS
The starter includes `supabase/schema.sql`. Run it in Supabase SQL Editor. It creates a private `analyses` table with RLS policies so users can only select/insert/delete their own rows. This starter does not automatically save AI results; add explicit save behavior only after reviewing privacy requirements.

## 6. NVIDIA inference
Choose a model in https://build.nvidia.com/ that is available to your account and copy its exact API model ID into `NVIDIA_MODEL`. Keep `NVIDIA_API_KEY` server-side only. The route uses an OpenAI-compatible `/chat/completions` request; provider model availability, rate limits and free access can change.

## 7. Run checks
```bash
npm run typecheck
npm run lint
npm run build
```
Then manually test:
- Sign up with email/password.
- Confirm email if enabled.
- Sign in and sign out.
- Google OAuth round-trip.
- Visit `/dashboard` while signed out (should redirect to `/login`).
- Call the AI feature while signed out (should return 401).
- Call the AI feature while signed in with a configured NVIDIA key/model.
- Try long input and empty input.
- Confirm no secret key appears in browser DevTools or source maps.

## Important security notes
- Never expose a Supabase service-role/secret key or NVIDIA API key in a `NEXT_PUBLIC_` variable.
- Do not enter real patient-identifying information during development.
- Supabase Free plan is suitable for prototyping, but has limits and no HIPAA coverage; do not use this starter for regulated clinical data without a proper security/compliance review.
- AI outputs may be incorrect. The app must not present model responses as diagnoses or treatment instructions.
