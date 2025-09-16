import fetch from "node-fetch";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { message } = req.body;

    try {
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.GREATAI_API_KEY}`
        },
        body: JSON.stringify({
          model: "openai/gpt-3.5-turbo",
          messages: [{ role: "user", content: message }]
        })
      });

      const data = await response.json();
      res.status(200).json({ response: data.choices[0].message.content });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(405).send("Method Not Allowed");
  }
}
