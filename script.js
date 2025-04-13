let moon = document.getElementById("moon");
let text = document.getElementById("text");
let train = document.getElementById("train");

let desert_moon = document.getElementById("desert-moon");
let man = document.getElementById("man");

window.addEventListener("scroll",()=>{
    let value = window.scrollY;
    moon.style.top = value * .1 + "px";
    text.style.top = 80 + value * -0.2 + '%';
    train.style.left = value * 0.3 + "px";

    desert_moon.style.top = value * .2 + "px";
    man.style.left = value * .3 + "px";
});

const typewriterTexts = [
    "a Computer Engineering Student.",
    "a Frontend Developer.",
    "a Music Enthusiast.",
    "passionate about UI/UX.",
    "exploring AI and ML."
  ];
  
  let typewriterIndex = 0;
  let charIndex = 0;
  let currentText = "";
  let isDeleting = false;
  const typewriterElement = document.querySelector(".typewriter-text");
  
  function type() {
    if (typewriterIndex >= typewriterTexts.length) typewriterIndex = 0;
    currentText = typewriterTexts[typewriterIndex];
  
    let displayedText = isDeleting
      ? currentText.substring(0, charIndex--)
      : currentText.substring(0, charIndex++);
  
    typewriterElement.textContent = displayedText;
  
    if (!isDeleting && charIndex === currentText.length) {
      isDeleting = true;
      setTimeout(type, 1000);
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      typewriterIndex++;
      setTimeout(type, 200);
    } else {
      setTimeout(type, isDeleting ? 50 : 100);
    }
  }
  
  document.addEventListener("DOMContentLoaded", () => {
    type();
  });
  

// progress bar

const scrollProgress = document.getElementById("progress");

let calcScrollValue = () => {
    let pos = document.documentElement.scrollTop;
    let calcHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    let scrollValue = Math.round((pos * 100) / calcHeight);

    scrollProgress.style.display = pos > 100 ? "grid" : "none";
    scrollProgress.style.background = `conic-gradient(#194eb9 ${scrollValue}%, #67ccff ${scrollValue}%)`;
};

scrollProgress.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
});

window.onscroll = calcScrollValue;
window.onload = calcScrollValue; 