import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

interface AIRequestBody {
  prompt: string;
  system?: string;
  taskType?: 'summary' | 'rewrite' | 'metadata' | 'title' | 'general';
  maxTokens?: number;
  temperature?: number;
}

interface ProviderResult {
  text: string;
  provider: string;
}

// ─── Tier 1: Google Gemini ─────────────────────────────────────────────────

async function callGemini(body: AIRequestBody): Promise<ProviderResult> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error('Gemini key not configured');

  const sys = body.system ?? 'You are a helpful AI assistant.';
  const contents = [
    { role: 'user', parts: [{ text: `${sys}\n\n${body.prompt}` }] },
  ];

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents,
        generationConfig: {
          temperature: body.temperature ?? 0.7,
          maxOutputTokens: body.maxTokens ?? 1024,
        },
      }),
      signal: AbortSignal.timeout(15000),
    }
  );

  if (!res.ok) {
    const errText = await res.text().catch(() => '');
    throw new Error(`Gemini ${res.status}: ${errText.slice(0, 200)}`);
  }

  const json = await res.json();
  const text = json.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error('Gemini returned empty response');
  return { text: text.trim(), provider: 'Gemini' };
}

// ─── Tier 2: Groq (Llama 3.3) ──────────────────────────────────────────────

async function callGroq(body: AIRequestBody): Promise<ProviderResult> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) throw new Error('Groq key not configured');

  const sys = body.system ?? 'You are a helpful AI assistant.';
  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: sys },
        { role: 'user', content: body.prompt },
      ],
      temperature: body.temperature ?? 0.7,
      max_tokens: body.maxTokens ?? 1024,
    }),
    signal: AbortSignal.timeout(15000),
  });

  if (!res.ok) {
    const errText = await res.text().catch(() => '');
    throw new Error(`Groq ${res.status}: ${errText.slice(0, 200)}`);
  }

  const json = await res.json();
  const text = json.choices?.[0]?.message?.content;
  if (!text) throw new Error('Groq returned empty response');
  return { text: text.trim(), provider: 'Groq (Llama 3.3)' };
}

// ─── Tier 3: HuggingFace Inference API ─────────────────────────────────────

async function callHuggingFace(body: AIRequestBody): Promise<ProviderResult> {
  const apiKey = process.env.HUGGINGFACE_API_KEY;
  if (!apiKey) throw new Error('HuggingFace key not configured');

  const sys = body.system ?? 'You are a helpful AI assistant.';
  const inputs = `${sys}\n\nUser: ${body.prompt}\n\nAssistant:`;

  const res = await fetch(
    'https://api-inference.huggingface.co/models/meta-llama/Meta-Llama-3-8B-Instruct',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        inputs,
        parameters: {
          temperature: body.temperature ?? 0.7,
          max_new_tokens: body.maxTokens ?? 512,
          return_full_text: false,
        },
      }),
      signal: AbortSignal.timeout(20000),
    }
  );

  if (!res.ok) {
    const errText = await res.text().catch(() => '');
    throw new Error(`HuggingFace ${res.status}: ${errText.slice(0, 200)}`);
  }

  const json = await res.json();
  const text = Array.isArray(json) ? json[0]?.generated_text : json.generated_text;
  if (!text) throw new Error('HuggingFace returned empty response');
  return { text: text.trim(), provider: 'HuggingFace' };
}

// ─── Route Handler ──────────────────────────────────────────────────────────

const PROVIDERS: Array<{ name: string; fn: (b: AIRequestBody) => Promise<ProviderResult> }> = [
  { name: 'Gemini', fn: callGemini },
  { name: 'Groq', fn: callGroq },
  { name: 'HuggingFace', fn: callHuggingFace },
];

export async function OPTIONS() {
  return new Response(null, { status: 200, headers: CORS_HEADERS });
}

export async function POST(req: NextRequest) {
  let body: AIRequestBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: 'Invalid JSON body' },
      { status: 400, headers: CORS_HEADERS }
    );
  }

  if (!body.prompt || body.prompt.trim().length === 0) {
    return NextResponse.json(
      { error: 'Prompt is required' },
      { status: 400, headers: CORS_HEADERS }
    );
  }

  const errors: string[] = [];

  for (const provider of PROVIDERS) {
    try {
      const result = await provider.fn(body);
      return NextResponse.json(
        { ...result, success: true },
        { headers: { ...CORS_HEADERS, 'X-AI-Provider': result.provider } }
      );
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      errors.push(`${provider.name}: ${msg}`);
    }
  }

  return NextResponse.json(
    {
      error: 'All AI providers failed',
      details: errors,
      success: false,
    },
    { status: 503, headers: CORS_HEADERS }
  );
}
