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

  let loaderText = loader.querySelector(".loader-text");
  if (!loaderText) {
    loaderText = document.createElement("span");
    loaderText.className = "loader-text";
    loader.appendChild(loaderText);
  }

  const setLoaderLabel = (label) => {
    const safeLabel = (label || "").trim();
    loaderText.textContent = safeLabel || document.title || "";
  };

  // Set initial label to current page title
  setLoaderLabel(document.title);

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

        const linkText = (link.textContent || "").trim();
        const fileName = (targetUrl.split("/").pop() || "").replace(
          ".html",
          ""
        );
        const fallback = fileName ? fileName.replace(/[-_]/g, " ") : targetUrl;
        const label = linkText || fallback;

        setLoaderLabel(label);
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

function initPatentStack() {
  const patentStack = document.querySelector(".patent-stack");
  if (!patentStack) return;

  const cards = Array.from(patentStack.querySelectorAll(".patent-stack-card"));
  if (cards.length === 0) return;

  let currentIndex = 0;
  let isPaused = false;

  function rotateCards() {
    if (isPaused) return;

    currentIndex = (currentIndex + 1) % cards.length;

    cards.forEach((card, i) => {
      const newIndex = (i - currentIndex + cards.length) % cards.length;
      card.setAttribute("data-index", newIndex);
    });
  }

  const intervalId = setInterval(rotateCards, 4000);

  patentStack.addEventListener("mouseenter", () => {
    isPaused = true;
  });

  patentStack.addEventListener("mouseleave", () => {
    isPaused = false;
  });

  cards.forEach((card) => {
    card.addEventListener("click", (e) => {
      if (card.getAttribute("data-index") === "0") {
        rotateCards();
      }
    });
  });

  window.addEventListener("beforeunload", () => {
    clearInterval(intervalId);
  });
}

function initUpcomingPatentsCarousel() {
  const container = document.querySelector(".carousel-container");
  if (!container) return;

  const track = container.querySelector(".carousel-track");
  const items = Array.from(container.querySelectorAll(".carousel-item"));
  const prevBtn = container.querySelector(".carousel-btn-prev");
  const nextBtn = container.querySelector(".carousel-btn-next");
  const indicatorsContainer = container.querySelector(".carousel-indicators");

  if (!track || items.length === 0) return;

  let currentIndex = 0;
  let autoplayInterval = null;
  const autoplayDelay = 4000;
  const pauseOnHover = true;

  items.forEach((_, index) => {
    const indicator = document.createElement("div");
    indicator.classList.add("carousel-indicator");
    if (index === 0) indicator.classList.add("active");
    indicator.addEventListener("click", () => goToSlide(index));
    indicatorsContainer.appendChild(indicator);
  });

  const indicators = Array.from(
    indicatorsContainer.querySelectorAll(".carousel-indicator")
  );

  function updateCarousel() {
    const offset = -currentIndex * 100;
    track.style.transform = `translateX(${offset}%)`;

    indicators.forEach((indicator, index) => {
      indicator.classList.toggle("active", index === currentIndex);
    });
  }

  function goToSlide(index) {
    const len = items.length;
    currentIndex = ((index % len) + len) % len;
    updateCarousel();
    resetAutoplay();
  }

  function nextSlide() {
    currentIndex = (currentIndex + 1) % items.length;
    updateCarousel();
  }

  function prevSlide() {
    currentIndex = (currentIndex - 1 + items.length) % items.length;
    updateCarousel();
  }

  function startAutoplay() {
    if (autoplayInterval) return;
    autoplayInterval = setInterval(nextSlide, autoplayDelay);
  }

  function stopAutoplay() {
    if (autoplayInterval) {
      clearInterval(autoplayInterval);
      autoplayInterval = null;
    }
  }

  function resetAutoplay() {
    stopAutoplay();
    startAutoplay();
  }

  nextBtn.addEventListener("click", () => {
    prevSlide();
    resetAutoplay();
  });

  nextBtn.addEventListener("click", () => {
    nextSlide();
    resetAutoplay();
  });

  if (pauseOnHover) {
    container.addEventListener("mouseenter", stopAutoplay);
    container.addEventListener("mouseleave", startAutoplay);
  }

  document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") {
      prevSlide();
      resetAutoplay();
    } else if (e.key === "ArrowRight") {
      nextSlide();
      resetAutoplay();
    }
  });

  let touchStartX = 0;
  let touchEndX = 0;

  track.addEventListener("touchstart", (e) => {
    touchStartX = e.changedTouches[0].screenX;
  });

  track.addEventListener("touchend", (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  });

  function handleSwipe() {
    const swipeThreshold = 50;
    if (touchStartX - touchEndX > swipeThreshold) {
      nextSlide();
      resetAutoplay();
    } else if (touchEndX - touchStartX > swipeThreshold) {
      prevSlide();
      resetAutoplay();
    }
  }

  updateCarousel();
  startAutoplay();

  window.addEventListener("beforeunload", stopAutoplay);
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
  initPatentStack();
  initUpcomingPatentsCarousel();
  initGsapAnimations().catch((error) =>
    console.warn("GSAP failed to initialize", error)
  );
});
