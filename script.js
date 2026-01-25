/*************************************
 * GLOBALS
 *************************************/
const toggleBtn = document.getElementById("chatbot-toggle");
const chatbot = document.getElementById("chatbot-container");
const closeBtn = document.getElementById("chatbot-close");
const sendBtn = document.getElementById("chatbot-send");
const input = document.getElementById("chatbot-input");
const messages = document.getElementById("chatbot-messages");
const hamburger = document.getElementById("hamburger");
const navMenu = document.getElementById("nav-menu");

let thinkingBubble = null;
let streamingBubble = null;

/*************************************
 * CHAT WINDOW TOGGLE
 *************************************/
toggleBtn.onclick = () => {
  chatbot.style.display = "flex";
};

closeBtn.onclick = () => {
  chatbot.style.display = "none";
};

sendBtn.onclick = sendChatBotMessage;
input.addEventListener("keypress", (e) => {
  if (e.key === "Enter") sendChatBotMessage();
});

/*************************************
 * SEND MESSAGE
 *************************************/
async function sendChatBotMessage() {
  const text = input.value.trim();
  if (!text) return;

  // Remove old suggestions (important)
  document
    .querySelectorAll(".suggestions-container")
    .forEach(el => el.remove());

  addMessage(text, "user");
  input.value = "";

  showThinkingMessage();
  await askAI(text);
}

/*************************************
 * THINKING INDICATOR
 *************************************/
function showThinkingMessage() {
  thinkingBubble = document.createElement("div");
  thinkingBubble.className = "bot-message thinking";
  thinkingBubble.innerHTML = `
    <span class="dot"></span>
    <span class="dot"></span>
    <span class="dot"></span>
    <span style="margin-left:8px;">Analyzing...</span>
  `;
  messages.appendChild(thinkingBubble);
  messages.scrollTop = messages.scrollHeight;
}

function removeThinking() {
  if (thinkingBubble) {
    thinkingBubble.remove();
    thinkingBubble = null;
  }
}

/*************************************
 * STREAMING AI CALL
 *************************************/
async function askAI(text) {
  const response = await fetch(
    "https://llm-chat-app.sathishkph.workers.dev/api/chat",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: [{ role: "user", content: text }]
      })
    }
  );

  const reader = response.body.getReader();
  const decoder = new TextDecoder();

  let buffer = "";
  let firstToken = true;
  let completed = false;

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });

    const events = buffer.split("\n\n");
    buffer = events.pop();

    for (const event of events) {
      if (!event.startsWith("data:")) continue;

      const data = event.replace("data:", "").trim();

      // 🔥 FINALIZATION
      if (data === "[DONE]") {
        completed = true;

        const { answer, suggestions } =
          extractSuggestions(streamingBubble.textContent);

        streamingBubble.textContent = answer;

        if (suggestions.length) {
          renderSuggestions(suggestions);
        }
        return;
      }

      try {
        const json = JSON.parse(data);
        if (!json.response) continue;

        if (firstToken) {
          removeThinking();

          streamingBubble = document.createElement("div");
          streamingBubble.className = "bot-message";
          streamingBubble.textContent = "";
          messages.appendChild(streamingBubble);

          firstToken = false;
        }

        // 🚨 NEVER write after completion
        if (!completed) {
          streamingBubble.textContent += json.response;
          messages.scrollTop = messages.scrollHeight;
        }

      } catch (e) {
        console.warn("Bad SSE chunk", data);
      }
    }
  }
}

/*************************************
 * ADD USER MESSAGE
 *************************************/
function addMessage(text, type) {
  const msg = document.createElement("div");
  msg.className = type === "user" ? "user-message" : "bot-message";
  msg.textContent = text;
  messages.appendChild(msg);
  messages.scrollTop = messages.scrollHeight;
}

/*************************************
 * EXTRACT SUGGESTED QUESTIONS
 *************************************/
function extractSuggestions(rawText) {
  const match = rawText.match(
    /<SUGGESTED_QUESTIONS>([\s\S]*?)<\/SUGGESTED_QUESTIONS>/
  );

  if (!match) {
    return {
      answer: rawText.trim(),
      suggestions: []
    };
  }

  let suggestions = [];
  try {
    suggestions = JSON.parse(match[1].trim());
  } catch {
    suggestions = [];
  }

  const cleanAnswer = rawText
    .substring(0, match.index)
    .trim();

  return {
    answer: cleanAnswer,
    suggestions
  };
}

/*************************************
 * RENDER SUGGESTION CHIPS
 *************************************/
function renderSuggestions(questions) {
  const container = document.createElement("div");
  container.className = "suggestions-container";

  questions.forEach(q => {
    const btn = document.createElement("button");
    btn.className = "suggestion-chip";
    btn.textContent = q;

    btn.onclick = () => {
      input.value = q;
      sendChatBotMessage();
      container.remove();
    };

    container.appendChild(btn);
  });

  messages.appendChild(container);
  messages.scrollTop = messages.scrollHeight;
}

/*************************************
 * Hamburger and navigation section
 *************************************/

    hamburger.addEventListener("click", () => {
      navMenu.classList.toggle("active");
    });

    // close menu after clicking a link
    document.querySelectorAll(".nav-menu a").forEach((link) => {
      link.addEventListener("click", () => {
        navMenu.classList.remove("active");
      });
    });

    document.addEventListener("DOMContentLoaded", () => {
  const text = "Sathishkumar P H";
  const speed = 150; // typing speed in ms
  let index = 0;

  const typingElement = document.getElementById("typing-name");

  function typeText() {
    if (index < text.length) {
      typingElement.textContent += text.charAt(index);
      index++;
      setTimeout(typeText, speed);
    }
  }

  typeText();
});
