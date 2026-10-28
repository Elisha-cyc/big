const BASE = "You are a friendly, patient Mandarin Chinese tutor in a spoken conversation. Gently correct mistakes by showing the right way to say it. End with one question in Chinese to keep the chat going.";
const LEVELS = {
  beginner: "The student is a complete beginner. Use only very simple, common words and short sentences. Keep replies to 3 short lines at most. Always give the Chinese characters, then pinyin with tone marks, then the English meaning.",
  intermediate: "The student is an intermediate learner who knows basic grammar and a few hundred words. Use everyday vocabulary and simple sentences, adding a few new words each time. Keep replies to 4 short lines. Write Chinese characters with pinyin, and give English only for new or difficult words and for corrections.",
  advanced: "The student is an advanced learner. Speak natural, fluent Mandarin, using idioms and richer grammar where it fits. Write mainly in Chinese characters, add pinyin only for rare words, and use English only to explain corrections or when asked. Keep replies to 5 short lines and ask a more thoughtful question."
};
function sysFor(level) { return BASE + " " + LEVELS[level]; }

const PREFER = ["llama-3.3-70b-versatile", "openai/gpt-oss-120b", "openai/gpt-oss-20b", "llama-3.1-8b-instant"];
let cachedModel = null;

// Ask Groq which models this key can use, then pick the best one from our list.
async function pickModel(key) {
  if (process.env.GROQ_MODEL) return process.env.GROQ_MODEL;
  if (cachedModel) return cachedModel;
  const r = await fetch("https://api.groq.com/openai/v1/models", {
    headers: { authorization: "Bearer " + key }
  });
  const d = await r.json();
  if (!r.ok) throw new Error((d.error && d.error.message) || "Could not list Groq models");
  const ids = (d.data || []).map(m => m.id);
  let pick = PREFER.find(id => ids.includes(id));
  if (!pick) pick = ids.find(id => !/whisper|tts|guard|embed|orpheus|compound|safeguard/i.test(id));
  if (!pick) throw new Error("No chat model is available for this Groq key");
  cachedModel = pick;
  return pick;
}

module.exports = async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "POST only" });

  const groqKey = process.env.GROQ_API_KEY;
  const claudeKey = process.env.ANTHROPIC_API_KEY;
  if (!groqKey && !claudeKey) {
    return res.status(500).json({ error: "Set GROQ_API_KEY in Vercel" });
  }

  const level = req.body && LEVELS[req.body.level] ? req.body.level : "beginner";
  let msgs = req.body && req.body.messages;
  if (!Array.isArray(msgs)) return res.status(400).json({ error: "messages must be a list" });
  msgs = msgs.slice(-12).map(m => ({
    role: m.role === "assistant" ? "assistant" : "user",
    content: String(m.content || "").slice(0, 600)
  }));
  while (msgs.length && msgs[0].role !== "user") msgs.shift();
  if (!msgs.length) return res.status(400).json({ error: "no message" });

  try {
    let r, d, text;
    if (groqKey) {
      const model = await pickModel(groqKey);
      const body = {
        model,
        temperature: 0.6,
        messages: [{ role: "system", content: sysFor(level) }].concat(msgs)
      };
      if (/gpt-oss/i.test(model)) {
        body.reasoning_effort = "low";
        body.max_completion_tokens = 1200;
      } else {
        body.max_tokens = 400;
      }
      r = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: { "content-type": "application/json", authorization: "Bearer " + groqKey },
        body: JSON.stringify(body)
      });
      d = await r.json();
      if (!r.ok) {
        cachedModel = null;
        return res.status(502).json({ error: (d.error && d.error.message) || "Groq error" });
      }
      text = d.choices && d.choices[0] && d.choices[0].message.content;
    } else {
      r = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "content-type": "application/json", "x-api-key": claudeKey, "anthropic-version": "2023-06-01" },
        body: JSON.stringify({ model: "claude-sonnet-5-5", max_tokens: 400, system: sysFor(level), messages: msgs })
      });
      d = await r.json();
      if (!r.ok) return res.status(502).json({ error: (d.error && d.error.message) || "API error" });
      text = (d.content || []).filter(b => b.type === "text").map(b => b.text).join("\n");
    }
    if (!text) return res.status(502).json({ error: "Empty reply" });
    return res.status(200).json({ text });
  } catch (e) {
    return res.status(502).json({ error: e.message || "Request failed" });
  }
};
