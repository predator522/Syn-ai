import fetch from "node-fetch";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { prompt } = req.body;

    try {
      const response = await fetch("https://openrouter.ai/api/v1/images/generations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.GREATAI_API_KEY}`
        },
        body: JSON.stringify({
          model: "openai/image-alpha-001",
          prompt: prompt,
          size: "512x512"
        })
      });

      const data = await response.json();
      const image_url = data.data[0].url;
      res.status(200).json({ image_url });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(405).send("Method Not Allowed");
  }
}
