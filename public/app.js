async function handleSend() {
  const input = document.getElementById("userInput");
  const chat = document.getElementById("chat");
  const message = input.value.trim();
  if (!message) return;

  // Show user message
  chat.innerHTML += `<div class="user">You: ${message}</div>`;
  input.value = "";

  const apiChoice = document.getElementById("apiSelector").value;

  if (apiChoice === "offline") {
    chat.innerHTML += `<div class="bot">Syn AI: ⚡ Offline AI not implemented yet.</div>`;
    return;
  }

  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    });

    const data = await res.json();

    if (data.reply) {
      chat.innerHTML += `<div class="bot">Syn AI: ${data.reply}</div>`;
    } else if (data.error) {
      chat.innerHTML += `<div class="bot">Syn AI Error: ${data.error}</div>`;
    } else {
      chat.innerHTML += `<div class="bot">Syn AI: ⚠️ Unexpected response format.</div>`;
    }
  } catch (err) {
    chat.innerHTML += `<div class="bot">Syn AI: ❌ Request failed (${err.message})</div>`;
  }

  chat.scrollTop = chat.scrollHeight; // auto-scroll
}
