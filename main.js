const GSAP_SRC =
  "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js";
const GSAP_SCROLLTRIGGER_SRC =
  "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js";

const loadScriptOnce = (src) =>
  new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) {
      resolve();
      return;
    }

    const script = document.createElement("script");
    script.src = src;
    script.async = true;
    script.onload = resolve;
    script.onerror = () => reject(new Error(`Failed to load ${src}`));
    document.head.appendChild(script);
  });

async function ensureGsap() {
  if (window.gsap && window.ScrollTrigger) return;
  await loadScriptOnce(GSAP_SRC);
  await loadScriptOnce(GSAP_SCROLLTRIGGER_SRC);

  if (window.gsap && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);
  }
}

function setupHamburger() {
  const hamburger = document.querySelector(".hamburger");
  const navLinks = document.querySelector(".nav-links");

  if (!hamburger || !navLinks) return;

  hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("active");
    navLinks.classList.toggle("active");
    hamburger.setAttribute(
      "aria-expanded",
      hamburger.classList.contains("active")
    );
  });

  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      hamburger.classList.remove("active");
      navLinks.classList.remove("active");
      hamburger.setAttribute("aria-expanded", "false");
    });
  });

  document.addEventListener("click", (event) => {
    if (!hamburger.contains(event.target) && !navLinks.contains(event.target)) {
      hamburger.classList.remove("active");
      navLinks.classList.remove("active");
      hamburger.setAttribute("aria-expanded", "false");
    }
  });
}

function highlightActiveNavLink() {
  const navLinks = document.querySelectorAll(".nav-links a");
  if (!navLinks.length) return;

  const current = window.location.pathname.split("/").pop() || "index.html";

  navLinks.forEach((link) => {
    const target = (link.getAttribute("href") || "").split("#")[0];
    if (target === current) {
      link.classList.add("active");
    } else {
      link.classList.remove("active");
    }
  });
}

function setupLoaderTransitions() {
  const loader = document.querySelector(".loader-overlay");
  if (!loader) return;

  setTimeout(() => {
    loader.classList.add("loader-hidden");
    loader.classList.remove("loader-visible");
  }, 50);

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
        loader.classList.remove("loader-hidden");
        loader.classList.add("loader-visible");

        setTimeout(() => {
          window.location.href = targetUrl;
        }, 600);
      }
    });
  });
}

function animateNavbarAndHero() {
  if (!window.gsap) return;

  gsap.from(".nav-container", {
    y: -40,
    opacity: 0,
    duration: 0.8,
    ease: "power3.out",
  });

  const heroTimeline = gsap.timeline();
  heroTimeline.from(".hero h1", {
    opacity: 0,
    y: 30,
    duration: 0.9,
    ease: "power3.out",
    delay: 0.15,
  });

  const logo = document.querySelector(".nav-logo");
  if (logo) {
    gsap.from(logo, {
      opacity: 0,
      y: -20,
      duration: 0.8,
      ease: "power3.out",
      delay: 0.05,
    });
  }
}

function animateSectionsOnScroll() {
  const reveals = document.querySelectorAll(".reveal");
  const fades = document.querySelectorAll(".fade-section");

  if (!window.gsap || !window.ScrollTrigger) {
    reveals.forEach((el) => {
      el.classList.add("visible");
      el.style.opacity = 1;
      el.style.transform = "translateY(0)";
    });
    fades.forEach((el) => {
      el.classList.add("visible");
      el.style.opacity = 1;
    });
    return;
  }

  gsap.set(reveals, { opacity: 0, y: 50 });
  reveals.forEach((el) => {
    gsap.to(el, {
      opacity: 1,
      y: 0,
      duration: 0.9,
      ease: "power3.out",
      scrollTrigger: {
        trigger: el,
        start: "top 80%",
        toggleActions: "play none none reverse",
      },
    });
  });

  gsap.set(fades, { opacity: 0 });
  fades.forEach((el) => {
    gsap.to(el, {
      opacity: 1,
      duration: 0.8,
      ease: "power2.out",
      scrollTrigger: {
        trigger: el,
        start: "top 85%",
        toggleActions: "play none none reverse",
      },
    });
  });
}

function animateBooksMarquee() {
  const track = document.querySelector(".books-track");
  if (!track || !window.gsap) return;

  const distance = track.scrollWidth / 2;
  gsap.to(track, {
    x: -distance,
    duration: 35,
    ease: "none",
    repeat: -1,
  });
}

async function initGsapAnimations() {
  await ensureGsap();
  animateNavbarAndHero();
  animateSectionsOnScroll();
  animateBooksMarquee();
}

document.addEventListener("DOMContentLoaded", () => {
  setupHamburger();
  setupLoaderTransitions();
  highlightActiveNavLink();
  initGsapAnimations().catch((error) =>
    console.warn("GSAP failed to initialize", error)
  );
});
