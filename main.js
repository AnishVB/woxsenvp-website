document.addEventListener("DOMContentLoaded", () => {
  // Hamburger Menu Toggle
  const hamburger = document.querySelector(".hamburger");
  const navLinks = document.querySelector(".nav-links");

  if (hamburger && navLinks) {
    hamburger.addEventListener("click", () => {
      hamburger.classList.toggle("active");
      navLinks.classList.toggle("active");
      hamburger.setAttribute(
        "aria-expanded",
        hamburger.classList.contains("active")
      );
    });

    // Close menu when a link is clicked
    navLinks.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        hamburger.classList.remove("active");
        navLinks.classList.remove("active");
        hamburger.setAttribute("aria-expanded", "false");
      });
    });

    // Close menu when clicking outside
    document.addEventListener("click", (event) => {
      if (
        !hamburger.contains(event.target) &&
        !navLinks.contains(event.target)
      ) {
        hamburger.classList.remove("active");
        navLinks.classList.remove("active");
        hamburger.setAttribute("aria-expanded", "false");
      }
    });
  }

  // Scroll Reveal Animation
  const reveals = document.querySelectorAll(".reveal");

  function revealOnScroll() {
    reveals.forEach((el) => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight - 150) {
        el.classList.add("visible");
      }
    });
  }

  revealOnScroll();
  window.addEventListener("scroll", revealOnScroll);
});

// Page Transition Loader
document.addEventListener("DOMContentLoaded", () => {
  const loader = document.querySelector(".loader-overlay");

  if (loader) {
    loader.classList.add("loader-hidden");
  }

  const links = document.querySelectorAll("a");

  links.forEach((link) => {
    link.addEventListener("click", (e) => {
      const targetUrl = link.getAttribute("href");

      if (
        targetUrl &&
        !targetUrl.startsWith("#") &&
        !targetUrl.startsWith("http") &&
        !link.getAttribute("target")
      ) {
        e.preventDefault(); // Stop immediate navigation
        loader.classList.remove("loader-hidden");
        loader.classList.add("loader-visible");

        // Wait for animation (500ms) then change page
        setTimeout(() => {
          window.location.href = targetUrl;
        }, 500);
      }
    });
  });
});
