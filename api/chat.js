import fetch from "node-fetch";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).send("Method Not Allowed");
  }

  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ response: "No message provided" });
  }

  try {
    const apiResponse = await fetch("https://openrouter.ai/api/v1/chat/completions", {
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

    const data = await apiResponse.json();

    // --- LOG THE FULL RESPONSE INSIDE THE TRY BLOCK ---
    console.log("Full OpenRouter AI Response:", JSON.stringify(data, null, 2));
    // ----------------------------------------------------------------

    let answer = "Error: Could not parse AI response";

    if (data.choices && data.choices[0]) {
      if (data.choices[0].message && data.choices[0].message.content) {
        answer = data.choices[0].message.content;
      } else if (data.choices[0].content && data.choices[0].content[0] && data.choices[0].content[0].text) {
        answer = data.choices[0].content[0].text;
      }
    }

    res.status(200).json({ response: answer });

  } catch (error) {
    console.error("Server Error:", error);
    res.status(500).json({ response: "Server error" });
  }
}
