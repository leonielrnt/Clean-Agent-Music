const API_KEY = "k9R9hrsARTj8PWjrNspDlYZ5H8qUzZZB";
const AGENT_ID = "ag:cd281fc1:20241202:green-groove:1386fd5c";
const API_URL = "https://api.mistral.ai/v1/agents/completions";

const chatBox = document.getElementById("chat-box");
const userInput = document.getElementById("user-input");
const sendButton = document.getElementById("send-button");

const messageHistory = [];

const appendMessage = (message, sender) => {
  const messageElement = document.createElement("div");
  messageElement.className = `message ${sender}`;

  const formattedMessage = message
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") // Gras
    .replace(/\*(.*?)\*/g, "<em>$1</em>") // Italique
    .replace(/\n/g, "<br>"); // Sauts de ligne

  messageElement.innerHTML = formattedMessage;
  chatBox.appendChild(messageElement);
  chatBox.scrollTop = chatBox.scrollHeight;
};

const sendMessage = async () => {
  const message = userInput.value.trim();
  if (!message) return;

  messageHistory.push({ role: "user", content: message });
  appendMessage(message, "user");
  userInput.value = "";

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        agent_id: AGENT_ID,
        messages: messageHistory, 
      }),
    });

    const data = await response.json();
    const botResponse =
      data.choices[0]?.message?.content || "Sorry, I couldn't process that.";

    messageHistory.push({ role: "assistant", content: botResponse });
    appendMessage(botResponse, "bot");
  } catch (error) {
    console.error("Error:", error);
    appendMessage("There was an error communicating with the agent.", "bot");
  }
};

sendButton.addEventListener("click", sendMessage);
userInput.addEventListener("keypress", (event) => {
  if (event.key === "Enter") sendMessage();
});
