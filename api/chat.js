export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { message } = req.body;
  if (!message) {
    return res.status(400).json({ error: "No message provided" });
  }

  try {
    const HF_API_KEY = process.env.HF_API_KEY;
    const HF_MODEL = "microsoft/DialoGPT-medium"; // ✅ Recommended chatbot model

    const response = await fetch(
      `https://api-inference.huggingface.co/models/${HF_MODEL}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${HF_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ inputs: message }),
      }
    );

    // If Hugging Face returns error or "loading"
    if (!response.ok) {
      const text = await response.text();
      return res
        .status(response.status)
        .json({ error: `Hugging Face API error: ${text}` });
    }

    const data = await response.json();

    // Handle special case: model is loading
    if (data.error && data.error.includes("loading")) {
      return res.status(503).json({
        error: "⏳ Model is still loading on Hugging Face, try again in a bit.",
      });
    }

    // Normal response: DialoGPT returns array with generated_text
    const aiResponse =
      data[0]?.generated_text || JSON.stringify(data, null, 2);

    return res.status(200).json({ reply: aiResponse });
  } catch (err) {
    console.error("Server Error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
