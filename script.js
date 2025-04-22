let moon = document.getElementById("moon");
let text = document.getElementById("text");
let train = document.getElementById("train");

let desert_moon = document.getElementById("desert-moon");
let man = document.getElementById("man");

// Background Music
const bgMusic = document.getElementById('bg-music');
const musicToggle = document.getElementById('music-toggle');
const icon = musicToggle.querySelector('i');

let isPlaying = false;

musicToggle.addEventListener('click', () => {
  if (!isPlaying) {
    bgMusic.play();
    icon.classList.remove('fa-play');
    icon.classList.add('fa-pause');
  } else {
    bgMusic.pause();
    icon.classList.remove('fa-pause');
    icon.classList.add('fa-play');
  }
  isPlaying = !isPlaying;
});

// Background Music Ends


document.addEventListener("DOMContentLoaded", () => {
  const profile = document.querySelector('.profile-pic');
  const train = document.getElementById("train");
  
  // Define scroll thresholds
  const scaleStart = 0;      // scroll position where scaling starts
  const scaleEnd = 500;      // scroll position where scaling ends
  const minScale = 0.5;      // minimum scale value
  
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    let scaleFactor, translateX = 0, translateY = 0;
    
    if (scrollY < scaleEnd) {
      // Calculate the scale factor (from 1 down to minScale)
      scaleFactor = 1 - (1 - minScale) * (scrollY / scaleEnd);
      
      // You could define a translation offset for early scroll (if needed)
      // For example, move slightly upward as you scroll:
      translateY = 0; // or some function of scrollY
      // Keep the position fixed in the starting corner:
      profile.style.position = 'fixed';
      
      // Apply transform using scale and translation
      profile.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scaleFactor})`;
      
    } else {
      // Once beyond scaleEnd, attach the image to the train's position.
      // Get train's current position on screen.
      const trainRect = train.getBoundingClientRect();
      
      // Change the profile's position to absolute so that it scrolls with the document.
      profile.style.position = 'absolute';
      
      // Define an offset relative to the train (adjust these values as needed)
      translateX = trainRect.left + 50; // e.g., 50px to the right of train's left
      translateY = scrollY + trainRect.top + 10; // e.g., 10px below the train's top
      
      // Keep the scale at the minimum
      scaleFactor = minScale;
      
      // Update transform with new position and fixed scale
      profile.style.transform = `translate(0, 0) scale(${scaleFactor})`;
      
      // Directly set the top and left properties
      profile.style.top = `${translateY}px`;
      profile.style.left = `${translateX}px`;
    }
  });
});


window.addEventListener("scroll",()=>{
    let value = window.scrollY;
    moon.style.top = value * .1 + "px";
    text.style.top = 80 + value * -0.2 + '%';
    train.style.left = value * 0.3 + "px";
    // john.style.left = value * 0.3 + "px";
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

  // after AOS.init()
AOS.init({ once: true, duration: 600 });

document.addEventListener('aos:in:skills-bars', () => {
  document.querySelectorAll('.bar-fill').forEach(bar => {
    const target = bar.getAttribute('data-fill');
    // trigger CSS transition
    setTimeout(() => { bar.style.width = target; }, 100);
  });
});


  document.addEventListener('DOMContentLoaded', () => {
    const events = document.querySelectorAll('.vtl-event');
    const obs = new IntersectionObserver((entries, observer) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          observer.unobserve(e.target);
        }
      });
    }, { threshold: 0.2 });
    events.forEach(ev => obs.observe(ev));
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

form.addEventListener('submit', e => {
  e.preventDefault();
  submitBtn.textContent = 'Sending…';
  submitBtn.disabled = true;
  // simulate AJAX
  setTimeout(() => {
    submitBtn.textContent = 'Sent ✔️';
    form.reset();
  }, 1500);
});


window.onscroll = calcScrollValue;
window.onload = calcScrollValue; 

