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

/* =========================================================
      Page Transition Loader Logic
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  const loader = document.querySelector(".loader-overlay");

  // On page load: Push the loader OUT past the camera
  if (loader) {
    // A tiny delay ensures the browser starts the animation from the correct scale
    setTimeout(() => {
      loader.classList.add("loader-hidden");
      loader.classList.remove("loader-visible");
    }, 50);
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
        e.preventDefault();

        // On Click: Push the loader IN from outside to cover the screen
        loader.classList.remove("loader-hidden");
        loader.classList.add("loader-visible");

        // Wait for the "Push In" to land before changing the URL
        setTimeout(() => {
          window.location.href = targetUrl;
        }, 600);
      }
    });
  });
});
