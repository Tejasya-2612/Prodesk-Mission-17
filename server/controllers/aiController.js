export async function suggestDescription(req, res) {
  try {
    const fallback = buildBorrowDescription(req.body.text);

    if (!process.env.GEMINI_API_KEY) {
      return res.json({ result: fallback });
    }

    const { GoogleGenerativeAI } = await import('@google/generative-ai');
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const prompt = [
      'Rewrite the text into a professional borrowing description.',
      'Keep it clear, polite, and under 80 words.',
      `Text: ${req.body.text}`
    ].join('\n');

    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();

    res.json({ result: text || fallback });
  } catch {
    res.json({ result: buildBorrowDescription(req.body.text) });
  }
}

function buildBorrowDescription(text = '') {
  const cleanText = text.trim().replace(/\s+/g, ' ');

  return `I would like to borrow this item for the following purpose: ${cleanText}. I will use it responsibly and return it in good condition as soon as the work is completed.`;
}
