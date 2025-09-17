import fetch from "node-fetch";

const MODELS = [
  "mistralai/Mistral-7B-Instruct-v0.2",
  "tiiuae/falcon-7b-instruct",
  "facebook/opt-1.3b"
];

async function queryHF(model, message) {
  const response = await fetch(`https://api-inference.huggingface.co/models/${model}`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.HF_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ inputs: message })
  });

  // Sometimes HF returns plain text (e.g., "Not Found"), handle that
  const text = await response.text();
  try {
    return JSON.parse(text);
  } catch {
    return { error: text };
  }
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).send("Method Not Allowed");

  const { message } = req.body;
  if (!message) return res.status(400).json({ response: "No message provided" });

  let answer = "Sorry, I couldn't get a response.";

  for (const model of MODELS) {
    try {
      console.log(`🔎 Trying model: ${model}`);
      const data = await queryHF(model, message);
      console.log("HF Response:", JSON.stringify(data, null, 2));

      if (Array.isArray(data) && data[0]?.generated_text) {
        answer = data[0].generated_text;
        break;
      } else if (data.generated_text) {
        answer = data.generated_text;
        break;
      } else if (data.error) {
        console.warn(`⚠️ Model ${model} error:`, data.error);
      }
    } catch (err) {
      console.error(`❌ Failed with model ${model}:`, err.message);
    }
  }

  res.status(200).json({ response: answer });
}
