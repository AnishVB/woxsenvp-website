// Apply reveal animation to all sections automatically
const revealElements = document.querySelectorAll(
  "section, .about-section, .footer, .navbar, .video-container, .books, .section-inner"
);

revealElements.forEach((el) => el.classList.add("reveal"));

const globalObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  },
  { threshold: 0.2 }
);

revealElements.forEach((el) => globalObserver.observe(el));
