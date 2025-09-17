import fetch from "node-fetch";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).send("Method Not Allowed");

  const { prompt } = req.body;
  if (!prompt) return res.status(400).json({ response: "No prompt provided" });

  try {
    const response = await fetch("https://api-inference.huggingface.co/models/stable-diffusion-v1-5", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.HF_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ inputs: prompt })
    });

    const arrayBuffer = await response.arrayBuffer();
    const base64Image = Buffer.from(arrayBuffer).toString("base64");
    const imageUrl = `data:image/png;base64,${base64Image}`;

    res.status(200).json({ image_url: imageUrl });

  } catch (error) {
    console.error("Server Error:", error);
    res.status(500).json({ response: "Server error" });
  }
}
