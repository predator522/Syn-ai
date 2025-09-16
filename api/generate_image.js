import fetch from "node-fetch";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).send("Method Not Allowed");
  }

  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ response: "No prompt provided" });
  }

  try {
    const apiResponse = await fetch("https://openrouter.ai/api/v1/images/generations", {
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

    const data = await apiResponse.json();
    console.log("OpenRouter AI Image Response:", data);

    if (!data.data || !data.data[0] || !data.data[0].url) {
      return res.status(500).json({ response: "Error: Invalid image response" });
    }

    const image_url = data.data[0].url;
    res.status(200).json({ image_url });

  } catch (error) {
    console.error("Server Error:", error);
    res.status(500).json({ response: "Server error" });
  }
}
