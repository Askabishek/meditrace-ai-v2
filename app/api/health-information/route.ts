import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const inputSchema = z.object({
  question: z.string().trim().min(10).max(3000),
});

export async function POST(request: NextRequest) {
  // Keep Supabase authentication protection
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json(
      { error: "Sign in is required." },
      { status: 401 }
    );
  }

  // Validate request
  let raw: unknown;

  try {
    raw = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Request body must be valid JSON." },
      { status: 400 }
    );
  }

  const parsed = inputSchema.safeParse(raw);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Question must be between 10 and 3000 characters." },
      { status: 400 }
    );
  }

  // Groq configuration
  const apiKey = process.env.GROQ_API_KEY;
  const model = process.env.GROQ_MODEL || "openai/gpt-oss-20b";

  if (!apiKey) {
    return NextResponse.json(
      { error: "Groq is not configured. Add GROQ_API_KEY to server environment variables." },
      { status: 503 }
    );
  }

  try {
    const upstream = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model,
          max_completion_tokens: 900,
          messages: [
            {
              role: "system",
              content:
                "You provide general health information for educational purposes only. You are not a doctor or clinician. Never provide a definitive diagnosis, rule out a disease, prescribe medication, or recommend medication dosages. Explain uncertainty clearly. Encourage users to consult a qualified healthcare professional for personal symptoms. If a user describes potentially life-threatening symptoms, advise seeking emergency medical care immediately. Do not invent medical studies, citations, test results, or evidence. Keep answers clear, concise, and non-alarmist.",
            },
            {
              role: "user",
              content: parsed.data.question,
            },
          ],
        }),
        cache: "no-store",
        signal: AbortSignal.timeout(30000),
      }
    );

    if (!upstream.ok) {
      // Log status only; never log the API key or patient prompt.
      console.error("Groq request failed with status:", upstream.status);

      if (upstream.status === 401 || upstream.status === 403) {
        return NextResponse.json(
          { error: "Groq authentication failed. Check your API key and account access." },
          { status: 502 }
        );
      }

      if (upstream.status === 429) {
        return NextResponse.json(
          { error: "Groq rate limit or usage limit reached. Please try again later." },
          { status: 429 }
        );
      }

      return NextResponse.json(
        { error: "Groq could not complete the request. Check model availability and account usage." },
        { status: 502 }
      );
    }

    const result = await upstream.json() as {
      choices?: Array<{
        message?: {
          content?: string | null;
        };
      }>;
    };

    const answer = result.choices?.[0]?.message?.content;

    if (typeof answer !== "string" || !answer.trim()) {
      return NextResponse.json(
        { error: "The AI model returned an empty response." },
        { status: 502 }
      );
    }

    return NextResponse.json({ answer });
  } catch (error) {
    console.error(
      "Groq request error:",
      error instanceof Error ? error.name : "UnknownError"
    );

    return NextResponse.json(
      { error: "The AI request timed out or failed. Please try again." },
      { status: 502 }
    );
  }
}