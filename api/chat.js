import fetch from "node-fetch";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).send("Method Not Allowed");

  const { message } = req.body;
  if (!message) return res.status(400).json({ response: "No message provided" });

  try {
    const response = await fetch(
      "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.HF_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ inputs: message }),
      }
    );

    const data = await response.json();
    console.log("Hugging Face Response:", JSON.stringify(data, null, 2));

    let answer = "Sorry, I couldn't get a response.";
    if (Array.isArray(data) && data[0].generated_text) {
      answer = data[0].generated_text;
    } else if (data.generated_text) {
      answer = data.generated_text;
    } else if (data.error) {
      answer = `HF API Error: ${data.error}`;
    }

    res.status(200).json({ response: answer });

  } catch (error) {
    console.error("Server Error:", error);
    res.status(500).json({ response: "Server error" });
  }
}
