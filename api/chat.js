const SYS =
  "You are a patient Chinese (Mandarin) tutor for a complete beginner. This is a spoken conversation, so keep replies to 3 short lines at most. Use only simple words. Always write Chinese characters, then pinyin with tone marks, then the English meaning. Gently correct mistakes. End with one easy question in Chinese (with pinyin and English) to keep the chat going.";

module.exports = async function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "POST only" });

  const groqKey = process.env.GROQ_API_KEY;
  const claudeKey = process.env.ANTHROPIC_API_KEY;
  if (!groqKey && !claudeKey) {
    return res.status(500).json({ error: "Set GROQ_API_KEY in Vercel" });
  }

  let msgs = req.body && req.body.messages;
  if (!Array.isArray(msgs))
    return res.status(400).json({ error: "messages must be a list" });
  msgs = msgs.slice(-12).map((m) => ({
    role: m.role === "assistant" ? "assistant" : "user",
    content: String(m.content || "").slice(0, 600),
  }));
  while (msgs.length && msgs[0].role !== "user") msgs.shift();
  if (!msgs.length) return res.status(400).json({ error: "no message" });

  try {
    let r, d, text;
    if (groqKey) {
      r = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          authorization: "Bearer " + groqKey,
        },
        body: JSON.stringify({
          model: process.env.GROQ_MODEL || "llama-3.3-70b-versatile",
          max_tokens: 400,
          temperature: 0.6,
          messages: [{ role: "system", content: SYS }].concat(msgs),
        }),
      });
      d = await r.json();
      if (!r.ok)
        return res
          .status(502)
          .json({ error: (d.error && d.error.message) || "Groq error" });
      text = d.choices && d.choices[0] && d.choices[0].message.content;
    } else {
      r = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-api-key": claudeKey,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: "claude-sonnet-5-5",
          max_tokens: 400,
          system: SYS,
          messages: msgs,
        }),
      });
      d = await r.json();
      if (!r.ok)
        return res
          .status(502)
          .json({ error: (d.error && d.error.message) || "API error" });
      text = (d.content || [])
        .filter((b) => b.type === "text")
        .map((b) => b.text)
        .join("\n");
    }
    if (!text) return res.status(502).json({ error: "Empty reply" });
    return res.status(200).json({ text });
  } catch (e) {
    return res.status(502).json({ error: "Request failed" });
  }
};
