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

