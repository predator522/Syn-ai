async function sendMessage() {
  const inputBox = document.getElementById("user-input");
  const message = inputBox.value;
  inputBox.value = "";

  const chatBox = document.getElementById("chat-box");
  chatBox.innerHTML += `<p><b>You:</b> ${message}</p>`;

  if (message.toLowerCase().startsWith("generate image:")) {
    const prompt = message.replace("generate image:", "").trim();
    const response = await fetch("/api/generate_image", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({ prompt })
    });
    const data = await response.json();
    chatBox.innerHTML += `<p><b>Syn AI:</b> <img src="${data.image_url}" width="300"/></p>`;
  } else {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({ message })
    });
    const data = await response.json();
    chatBox.innerHTML += `<p><b>Syn AI:</b> ${data.response}</p>`;
  }
}
