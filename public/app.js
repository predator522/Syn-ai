const API_OPTIONS = {
  offline: {
    endpoint: "",
    key: "",
    model: "offline"
  },
  synai: {
    endpoint: "/api/chat", // talks to backend
    key: "",
    model: "synai/chat-model"
  }
};

async function sendMessage(message) {
  const apiChoice = document.getElementById("apiSelector").value;
  const apiConfig = API_OPTIONS[apiChoice];

  if (apiChoice === "offline") {
    return "⚡ Offline AI not implemented yet.";
  }

  try {
    const response = await fetch(apiConfig.endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message })
    });

    const data = await response.json();
    return data.response || "⚠️ No response from Syn AI";
  } catch (err) {
    console.error(err);
    return "❌ Error contacting Syn AI backend.";
  }
}

async function handleSend() {
  const input = document.getElementById("userInput");
  const chat = document.getElementById("chat");

  const userMessage = input.value.trim();
  if (!userMessage) return;

  chat.innerHTML += `<div class="user">You: ${userMessage}</div>`;
  input.value = "";

  const botReply = await sendMessage(userMessage);
  chat.innerHTML += `<div class="bot">Syn AI: ${botReply}</div>`;
  chat.scrollTop = chat.scrollHeight;
}
