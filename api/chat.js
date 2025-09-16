import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { message } = req.body;

    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [{ role: "user", content: message }],
        max_tokens: 500
      });

      const answer = response.choices[0].message.content;
      res.status(200).json({ response: answer });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(405).send("Method Not Allowed");
  }
}
