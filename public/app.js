const chatDiv = document.getElementById("chat");
const input = document.getElementById("userInput");
const apiSelector = document.getElementById("apiSelector");

function appendMessage(sender, text) {
  const msgDiv = document.createElement("div");
  msgDiv.className = sender;
  msgDiv.textContent = text;
  chatDiv.appendChild(msgDiv);
  chatDiv.scrollTop = chatDiv.scrollHeight;
}

async function handleSend() {
  const message = input.value.trim();
  if (!message) return;

  appendMessage("user", `You: ${message}`);
  input.value = "";

  const selectedAI = apiSelector.value;

  if (selectedAI === "offline") {
    appendMessage("bot", "⚡ Offline AI not implemented yet.");
    return;
  }

  // Syn AI / Hugging Face
  appendMessage("bot", "💬 Syn AI is typing...");

  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    });

    const data = await res.json();
    // Remove "typing..." message
    chatDiv.lastChild.remove();

    if (!res.ok) {
      appendMessage("bot", `⚠️ Syn AI Error: ${data.error}`);
    } else {
      appendMessage("bot", `Syn AI: ${data.reply}`);
    }
  } catch (err) {
    chatDiv.lastChild.remove();
    appendMessage("bot", `⚠️ Syn AI Error: ${err.message}`);
  }
}

// Optional: Send on Enter key
input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") handleSend();
});
