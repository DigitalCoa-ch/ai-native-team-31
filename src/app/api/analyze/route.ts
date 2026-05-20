import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'ANTHROPIC_API_KEY environment variable is not set on the server.' }, { status: 500 });
  }

  const { trustDoc, portfolioData, riskProfile } = await req.json();

  const userMessage = `INPUT 1 — Trust Document:
${trustDoc}

INPUT 2 — Portfolio Data:
${portfolioData}

INPUT 3 — Client Risk Profile:
${riskProfile}`;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        system: `You are FamilyOffice AI, an autonomous wealth coordination agent. You are given three inputs: a legal trust document, a portfolio, and a client risk profile. Read all three simultaneously. Find every conflict between the client's stated goals, the portfolio's current allocation, and the legal constraints in the trust. Output a structured Wealth Advisor Briefing with four clearly labeled sections: 1) Conflicts Detected 2) Recommended Rebalancing Strategy 3) Legal Constraint Checklist 4) Human Sign-off Required. Be specific. Cite exact clause numbers and percentages.`,
        messages: [{ role: 'user', content: userMessage }],
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      return NextResponse.json({ error: `Anthropic API error ${response.status}: ${errText}` }, { status: response.status });
    }

    const data = await response.json();
    // Extract the text block from the response
    const textBlock = data.content?.find((block: { type: string; text: string }) => block.type === 'text');
    const reply = textBlock?.text ?? 'No response generated.';

    return NextResponse.json({ reply });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: `Request failed: ${message}` }, { status: 500 });
  }
}