     
  //send message to whatsapp    
function sendWhatsAppMessage() {
  const message = document.querySelector(".contact-textarea").value.trim();
const name = document.getElementById("contact-name-input").value.trim();
  const email = document.getElementById("contact-email-input").value.trim();

  if (!message) {
    alert("Please enter a message");
    return;
  }

    if (!name) {
    alert("Please enter a name");
    return;
  }

      if (!email) {
    alert("Please enter a email");
    return;
  }

  const phoneNumber = "919944572773";
  const text = encodeURIComponent(message);
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${text}`;

  window.open(whatsappUrl, "_blank");
  showSuccessPopup();
}



//pop up function
function showSuccessPopup() {
  const popup = document.getElementById("success-popup");
  popup.style.display = "block";

  setTimeout(() => {
    popup.style.display = "none";
  }, 3000);
}


  
    
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

  // send message button event listener
  const sendMessageBtn = document.getElementById("send-message-button");

  if (!sendMessageBtn) return;

  sendMessageBtn.addEventListener("click", ()=> { 
  // sendMessageBtn.disabled = true;
  sendWhatsAppMessage();
  // setTimeout(() => (sendMessageBtn.disabled = false), 3000);
  });

});
//chat bot functionality
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

sendBtn.onclick = sendChatBotMessage;
input.addEventListener("keypress", (e) => {
  if (e.key === "Enter") sendChatBotMessage();
});

//send chatbotmessage function
async function sendChatBotMessage() {
  const text = input.value.trim();
  if (!text) return;

  addMessage(text, "user");
  input.value = "";

  const aiReply = await askAI(text);
  addMessage(aiReply, "bot");
}

// Simple AI response logic

async function askAI(text) {
  const response = await fetch("https://llm-chat-app.sathishkph.workers.dev/api/chat", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
        messages: [
          { role: "user", content: text }
        ]
      }),
});

const reader = response.body?.getReader();
const decoder = new TextDecoder();
let finalText = "";
let buffer = "";

 while (true) {
    const { value, done } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });

    const events = buffer.split("\n\n");
    buffer = events.pop(); // keep incomplete chunk

    for (const event of events) {
      if (!event.startsWith("data:")) continue;

      const data = event.replace("data:", "").trim();

      if (data === "[DONE]") {
        return finalText;
      }

      try {
        const json = JSON.parse(data);
        if (json.response) {
          finalText += json.response;
        }
      } catch (e) {
        console.warn("Bad SSE chunk", data);
      }
    }
  }
  console.log("Final AI Response:", finalText);

  return finalText;
}


//add message to chat window
 function addMessage(text, type) {
  const msg = document.createElement("div");
  msg.className = type === "user" ? "user-message" : "bot-message";
  msg.textContent = text;
  messages.appendChild(msg);
  messages.scrollTop = messages.scrollHeight;
}

function getAIResponse(text) {
  text = text.toLowerCase();

  return askAI(text);
}





