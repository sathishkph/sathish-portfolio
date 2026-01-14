    const hamburger = document.getElementById("hamburger");
    const navMenu = document.getElementById("nav-menu");

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

const toggleBtn = document.getElementById("chatbot-toggle");
const chatbot = document.getElementById("chatbot-container");
const closeBtn = document.getElementById("chatbot-close");
const sendBtn = document.getElementById("chatbot-send");
const input = document.getElementById("chatbot-input");
const messages = document.getElementById("chatbot-messages");

toggleBtn.onclick = () => {
  chatbot.style.display = "flex";
};

closeBtn.onclick = () => {
  chatbot.style.display = "none";
};

sendBtn.onclick = sendMessage;
input.addEventListener("keypress", (e) => {
  if (e.key === "Enter") sendMessage();
});

function sendMessage() {
  const text = input.value.trim();
  if (!text) return;

  addMessage(text, "user");
  input.value = "";

  // Temporary AI logic (replace with real API later)
  setTimeout(() => {
    addMessage(getAIResponse(text), "bot");
  }, 600);
}

function addMessage(text, type) {
  const msg = document.createElement("div");
  msg.className = type === "user" ? "user-message" : "bot-message";
  msg.textContent = text;
  messages.appendChild(msg);
  messages.scrollTop = messages.scrollHeight;
}

function getAIResponse(text) {
  text = text.toLowerCase();

  if (text.includes("skill")) {
    return "Sathish is a Full Stack Engineer with expertise in Java, Spring Boot, Cloud, and AI-driven systems.";
  }
  if (text.includes("project")) {
    return "He has worked on enterprise platforms, AI chatbots, transaction systems, and scalable microservices.";
  }
  if (text.includes("contact")) {
    return "You can reach Sathish via LinkedIn or the contact form on this page.";
  }

  return "I can help answer questions about Sathish's skills, projects, and experience 😊";
}


