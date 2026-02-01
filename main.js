// Simple subtitle carousel for homepage hero
function initHeroSubtitleCarousel() {
  const carousel = document.getElementById("subtitle-carousel");
  if (!carousel) return;
  const items = Array.from(carousel.children);
  if (items.length < 2) return;
  let current = 0;
  // Hide all except first
  items.forEach((el, i) => {
    el.style.opacity = i === 0 ? "1" : "0";
    el.style.transition = "opacity 0.7s cubic-bezier(0.16,1,0.3,1)";
    el.style.position = "absolute";
    el.style.left = 0;
    el.style.right = 0;
    el.style.width = "100%";
    el.style.top = 0;
  });
  carousel.style.position = "relative";
  function showNext() {
    items[current].style.opacity = "0";
    current = (current + 1) % items.length;
    items[current].style.opacity = "1";
  }
  setInterval(showNext, 3000);
}
const GSAP_SRC =
  "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js";
const GSAP_SCROLLTRIGGER_SRC =
  "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js";

const SIGNATURE_SRC = "assets/images/rvr_fullsig.svg";
let _signatureCache = null;

async function loadSignatureMarkup() {
  if (_signatureCache) return _signatureCache;
  try {
    const res = await fetch(SIGNATURE_SRC, { cache: "no-cache" });
    const txt = await res.text();
    _signatureCache = txt;
    return txt;
  } catch (err) {
    console.error("Failed to load signature SVG", err);
    return null;
  }
}

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
  // Scroll lock helpers
  let scrollLockHandler = (e) => {
    e.preventDefault();
  };

  hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("active");
    navLinks.classList.toggle("active");
    const isActive = hamburger.classList.contains("active");
    hamburger.setAttribute("aria-expanded", isActive);
    if (isActive) {
      document.body.classList.add("no-scroll");
      document.documentElement.classList.add("no-scroll");
      window.addEventListener("touchmove", scrollLockHandler, {
        passive: false,
      });
      window.addEventListener("wheel", scrollLockHandler, { passive: false });
      window.addEventListener("scroll", scrollLockHandler, { passive: false });
    } else {
      document.body.classList.remove("no-scroll");
      document.documentElement.classList.remove("no-scroll");
      window.removeEventListener("touchmove", scrollLockHandler, {
        passive: false,
      });
      window.removeEventListener("wheel", scrollLockHandler, {
        passive: false,
      });
      window.removeEventListener("scroll", scrollLockHandler, {
        passive: false,
      });
    }
  });

  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      hamburger.classList.remove("active");
      navLinks.classList.remove("active");
      hamburger.setAttribute("aria-expanded", "false");
      document.body.classList.remove("no-scroll");
      document.documentElement.classList.remove("no-scroll");
      window.removeEventListener("touchmove", scrollLockHandler, {
        passive: false,
      });
      window.removeEventListener("wheel", scrollLockHandler, {
        passive: false,
      });
      window.removeEventListener("scroll", scrollLockHandler, {
        passive: false,
      });
    });
  });

  document.addEventListener("click", (event) => {
    if (!hamburger.contains(event.target) && !navLinks.contains(event.target)) {
      hamburger.classList.remove("active");
      navLinks.classList.remove("active");
      hamburger.setAttribute("aria-expanded", "false");
      document.body.classList.remove("no-scroll");
      document.documentElement.classList.remove("no-scroll");
      window.removeEventListener("touchmove", scrollLockHandler, {
        passive: false,
      });
      window.removeEventListener("wheel", scrollLockHandler, {
        passive: false,
      });
      window.removeEventListener("scroll", scrollLockHandler, {
        passive: false,
      });
    }
  });
}

function highlightActiveNavLink() {
  const navLinks = document.querySelectorAll(".nav-links a");
  if (!navLinks.length) return;

  const normalize = (value) => {
    if (!value) return "index";
    return value
      .split(/[?#]/)[0]
      .replace(/index\.html?$/i, "index")
      .replace(/\.html?$/i, "")
      .replace(/\/+/g, "")
      .toLowerCase();
  };

  const current = normalize(window.location.pathname.split("/").pop());

  navLinks.forEach((link) => {
    const target = normalize((link.getAttribute("href") || "").split("#")[0]);
    if (target === current) {
      link.classList.add("active");
    } else {
      link.classList.remove("active");
    }
  });
}

function createBlindsContainer() {
  let container = document.querySelector(".blinds-container");
  let signature = document.querySelector(".blinds-signature");

  if (!container) {
    container = document.createElement("div");
    container.className = "blinds-container";
    document.body.insertBefore(container, document.body.firstChild);
  }

  if (!signature) {
    signature = document.createElement("div");
    signature.className = "blinds-signature";
    document.body.insertBefore(signature, document.body.firstChild);
  }
}

async function ensureBlindsSignatureInjected() {
  createBlindsContainer();
  const signature = document.querySelector(".blinds-signature");
  if (!signature) return;
  if (signature.querySelector("svg")) return;

  const markup = await loadSignatureMarkup();
  if (!markup) return;
  signature.innerHTML = markup;
  // ensure class present for styling
  const svg = signature.querySelector("svg");
  if (svg && !svg.classList.contains("signature-svg")) {
    svg.classList.add("signature-svg");
  }
}

function restartSignatureDraw(signatureEl) {
  const shapes = Array.from(
    signatureEl?.querySelectorAll(
      "path, polyline, polygon, line, circle, ellipse",
    ) || [],
  );
  if (!shapes.length) return;

  shapes.forEach((el) => {
    const length =
      typeof el.getTotalLength === "function" ? el.getTotalLength() : 2400;
    el.style.setProperty("--signature-length", length);
    el.style.strokeDasharray = length;
    el.style.strokeDashoffset = length;
    el.style.animation = "none";
    el.classList.remove("drawing");
  });

  void signatureEl.getBoundingClientRect();

  shapes.forEach((el, idx) => {
    el.style.animationDelay = `${idx * 0.08}s`;
    el.classList.add("drawing");
  });
}

async function playBlindsAnimation(targetUrl) {
  await ensureGsap();
  await ensureBlindsSignatureInjected();

  return new Promise((resolve) => {
    createBlindsContainer();

    const container = document.querySelector(".blinds-container");
    const signature = document.querySelector(".blinds-signature");

    container.innerHTML = "";
    const blindCount = 28; // thin panels for clearer blinds look
    const blindWidth = Math.ceil(window.innerWidth / blindCount) + 1; // slight overlap to hide seams

    container.style.display = "block"; // show overlay immediately to avoid flash
    signature.style.display = "block";
    gsap.set(signature, { opacity: 0 });
    restartSignatureDraw(signature);

    for (let i = 0; i < blindCount; i++) {
      const blind = document.createElement("div");
      blind.className = "blind";
      blind.style.width = blindWidth + "px";
      blind.style.left = i * blindWidth + "px";
      blind.style.height = "100%";
      container.appendChild(blind);
    }

    const blinds = container.querySelectorAll(".blind");
    const timeline = gsap.timeline({
      onComplete: () => {
        // Animation complete, now navigate
        sessionStorage.setItem("blindsOpenNext", "1");
        if (targetUrl) {
          window.location.href = targetUrl;
        }
        resolve();
      },
    });

    // Start blinds rotated away from view for flip effect
    gsap.set(blinds, { rotateY: -110, transformPerspective: 1400 });

    // Close blinds: flip in left-to-right
    timeline.to(
      blinds,
      {
        rotateY: 0,
        duration: 0.9,
        ease: "power2.inOut",
        stagger: {
          amount: 0.5,
          from: "start",
        },
      },
      0,
    );

    // Show signature while closing
    timeline.to(signature, { opacity: 1, duration: 0.6 }, 0.25);

    // Hold closed briefly before navigating (increased to show full draw)
    timeline.to({}, { duration: 0.8 });
  });
}

// Play only the opening animation if flagged (after navigation)
async function playBlindsOpenIfNeeded() {
  // Clear flag if this is a page refresh (not a navigation)
  const isRefresh =
    performance.getEntriesByType("navigation")[0]?.type === "reload";
  if (isRefresh) {
    sessionStorage.removeItem("blindsOpenNext");
    return;
  }

  const shouldOpen = sessionStorage.getItem("blindsOpenNext");
  if (!shouldOpen) return;
  sessionStorage.removeItem("blindsOpenNext");

  await ensureBlindsSignatureInjected();
  createBlindsContainer();
  const container = document.querySelector(".blinds-container");
  const signature = document.querySelector(".blinds-signature");

  container.style.display = "block"; // cover immediately to prevent flash
  signature.style.display = "block";

  await ensureGsap();

  gsap.set(signature, { opacity: 1 });

  container.innerHTML = "";
  const blindCount = 28;
  const blindWidth = Math.ceil(window.innerWidth / blindCount) + 1; // overlap to remove seams

  for (let i = 0; i < blindCount; i++) {
    const blind = document.createElement("div");
    blind.className = "blind";
    blind.style.width = blindWidth + "px";
    blind.style.left = i * blindWidth + "px";
    blind.style.height = "100%";
    container.appendChild(blind);
  }

  const blinds = container.querySelectorAll(".blind");

  // start closed (matching end state from close animation)
  gsap.set(blinds, { rotateY: 0, transformPerspective: 1400 });

  // Pre-set all page elements to hidden (only during page transitions, not on refresh)
  const reveals = document.querySelectorAll(".reveal");
  const fades = document.querySelectorAll(".fade-section");
  gsap.set(reveals, { opacity: 0, y: 70 });
  gsap.set(fades, { opacity: 0 });

  // Brief delay to ensure everything is ready
  await new Promise((resolve) => setTimeout(resolve, 50));

  const timeline = gsap.timeline();

  // Open blinds: flip out to the right to reveal page
  timeline.to(
    blinds,
    {
      rotateY: 110,
      duration: 0.9,
      ease: "power2.inOut",
      stagger: {
        amount: 0.5,
        from: "start",
      },
    },
    0,
  );

  // Fade signature out after opening animation completes
  timeline.to(signature, { opacity: 0, duration: 1.2 }, 0.2);

  // Remove hide-style EARLY (at 0.8s) so page is visible behind blinds
  timeline.call(
    () => {
      const hideStyle = document.getElementById("blinds-hide-style");
      if (hideStyle) hideStyle.remove();
    },
    null,
    0.8,
  );

  // At 1.4s: hide overlay elements
  timeline.call(
    () => {
      container.style.display = "none";
      signature.style.display = "none";
    },
    null,
    1.4,
  );

  // At 1.4s: start LONGER entrance animations
  timeline.call(
    () => {
      reveals.forEach((el, i) => {
        gsap.to(el, {
          opacity: 1,
          y: 0,
          duration: 1.6,
          ease: "power4.out",
          delay: i * 0.12,
        });
      });

      fades.forEach((el, i) => {
        gsap.to(el, {
          opacity: 1,
          duration: 1.4,
          ease: "power3.out",
          delay: 0.3 + i * 0.1,
        });
      });

      // Trigger navbar and hero animations after blinds open
      animateNavbarAndHero();
      animateSectionsOnScroll();
    },
    null,
    1.4,
  );
}

function setupLoaderTransitions() {
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

        // Play blinds animation and navigate when timeline triggers it
        playBlindsAnimation(targetUrl);
      }
    });
  });
}

function animateNavbarAndHero() {
  if (!window.gsap) return;

  // Apply backdrop-filter before animation starts
  const navbar = document.querySelector(".navbar");
  if (navbar) {
    navbar.style.backdropFilter = "blur(12px)";
    navbar.style.webkitBackdropFilter = "blur(12px)";
    navbar.style.background = "rgba(255, 255, 255, 0.14)";
    navbar.style.border = "1px solid rgba(255, 255, 255, 0.22)";
    navbar.style.boxShadow = "0 10px 35px rgba(0, 0, 0, 0.28)";
  }

  gsap.from(".nav-container", {
    y: -60,
    opacity: 0,
    duration: 1.2,
    ease: "power4.out",
  });

  const heroTimeline = gsap.timeline();
  heroTimeline.from(".hero h1", {
    opacity: 0,
    y: 50,
    duration: 1.4,
    ease: "power4.out",
    delay: 0.2,
  });

  const logo = document.querySelector(".nav-logo");
  if (logo) {
    gsap.from(logo, {
      opacity: 0,
      y: -30,
      duration: 1.2,
      ease: "power4.out",
      delay: 0.1,
    });
  }
}

function animateSectionsOnScroll() {
  // Disabled - using new experimental scroll animations instead
  return;
}

function animateFooterSignature() {
  const footerSigs = Array.from(
    document.querySelectorAll(".footer-signature-svg"),
  );
  if (!footerSigs.length || !window.ScrollTrigger) return;

  ScrollTrigger.create({
    trigger: ".footer",
    start: "top bottom",
    once: true,
    onEnter: () => {
      footerSigs.forEach((footerSig) => {
        const shapes = Array.from(
          footerSig.querySelectorAll(
            "path, polyline, polygon, line, circle, ellipse",
          ),
        );
        if (!shapes.length) return;

        shapes.forEach((el) => {
          const length =
            typeof el.getTotalLength === "function"
              ? el.getTotalLength()
              : 2400;
          el.style.setProperty("--signature-length", length);
          el.style.strokeDasharray = length;
          el.style.strokeDashoffset = length;
          el.style.animation = "none";
          el.classList.remove("drawing");
        });
        void footerSig.getBoundingClientRect();
        shapes.forEach((el, idx) => {
          el.style.animationDelay = `${idx * 0.08}s`;
          el.classList.add("drawing");
        });
      });
    },
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

function animateEndorsements() {
  if (!window.gsap || !window.ScrollTrigger) return;

  const cards = document.querySelectorAll(".endorsement-card");
  if (!cards.length) return;

  gsap.set(cards, { opacity: 0, y: 40, rotateX: 6, scale: 0.98 });

  cards.forEach((card, index) => {
    gsap.to(card, {
      opacity: 1,
      y: 0,
      rotateX: 0,
      scale: 1,
      duration: 1.1,
      ease: "power3.out",
      delay: index * 0.05,
      scrollTrigger: {
        trigger: card,
        start: "top 90%",
        toggleActions: "play none none reverse",
      },
    });
  });
}

function initPatentStack() {
  const patentStack = document.querySelector(".patent-stack");
  if (!patentStack) return;

  const cards = Array.from(patentStack.querySelectorAll(".patent-stack-card"));
  if (cards.length === 0) return;

  let currentIndex = 0;
  let isPaused = false;

  // ensure initial ordering
  cards.forEach((card, i) => card.setAttribute("data-index", i));

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

  cards.forEach((card, originalIndex) => {
    card.addEventListener("click", () => {
      const clickedIndex = Number(card.getAttribute("data-index")) || 0;
      // bring clicked card to front
      currentIndex = (currentIndex + clickedIndex) % cards.length;
      cards.forEach((c, i) => {
        const newIndex = (i - currentIndex + cards.length) % cards.length;
        c.setAttribute("data-index", newIndex);
      });
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
    indicatorsContainer.querySelectorAll(".carousel-indicator"),
  );

  function updateCarousel() {
    const offset = -currentIndex * 100;
    track.style.transition = "transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)";
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

  const autoRevealSelectors = [
    ".stack-card",
    ".paper-card",
    ".research-link-card",
    ".carousel-item",
    ".endorsement-card",
  ];

  autoRevealSelectors
    .map((selector) => Array.from(document.querySelectorAll(selector)))
    .flat()
    .forEach((el) => el.classList.add("reveal"));

  animateNavbarAndHero();
  animateSectionsOnScroll();
  animateBooksMarquee();
  await injectFooterSignature();
  animateFooterSignature();
  animateEndorsements();
}

async function injectFooterSignature() {
  const footerSigs = Array.from(
    document.querySelectorAll(".footer-signature-svg"),
  );
  if (!footerSigs.length) return;

  const markup = await loadSignatureMarkup();
  if (!markup) return;

  footerSigs.forEach((el) => {
    el.innerHTML = markup;
    const svg = el.querySelector("svg");
    if (svg && !svg.classList.contains("signature-svg")) {
      svg.classList.add("signature-svg");
    }
  });
}

function initNewsletterNavigation() {
  const numberGridButtons = document.querySelectorAll(".newsletter-number-btn");
  const viewOlderBtn = document.querySelector(".view-older-btn");
  const readMoreButtons = document.querySelectorAll(
    ".read-more-btn, .archive-read-more-btn",
  );
  const modal = document.getElementById("newsletterModal");
  const modalClose = document.querySelector(".modal-close");
  const modalBody = document.getElementById("modalBody");

  if (numberGridButtons.length > 0) {
    numberGridButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const newsletterNum = button.getAttribute("data-newsletter");
        const newsletterItem = document.querySelector(
          `.newsletter-item[data-newsletter="${newsletterNum}"]`,
        );

        if (newsletterItem) {
          numberGridButtons.forEach((btn) => btn.classList.remove("active"));
          button.classList.add("active");

          setTimeout(() => {
            newsletterItem.scrollIntoView({
              behavior: "smooth",
              block: "center",
            });
          }, 50);
        }
      });
    });
  }

  if (viewOlderBtn) {
    viewOlderBtn.addEventListener("click", () => {
      window.location.href = "newsletter-archives.html";
    });
  }

  if (readMoreButtons.length > 0 && modal && modalBody) {
    readMoreButtons.forEach((button) => {
      button.addEventListener("click", (e) => {
        e.preventDefault();
        const newsletterItem = button.closest(
          ".newsletter-item, .archive-newsletter-item",
        );
        if (newsletterItem) {
          const title = newsletterItem.querySelector("h3").textContent;
          const date = newsletterItem.querySelector(
            ".newsletter-date, .archive-newsletter-date",
          ).textContent;
          let content = "<p>newsletter content coming soon.</p>";
          // Use full text if present (for first newsletter)
          const contentDiv = newsletterItem.querySelector(
            ".newsletter-content",
          );
          if (contentDiv && contentDiv.dataset.fulltext) {
            content = contentDiv.dataset.fulltext;
          }
          modalBody.innerHTML = `
            <h3 class="modal-title">${title}</h3>
            <p class="newsletter-date modal-date">${date}</p>
            ${content}
          `;
          modal.classList.add("active");
          modal.style.display = "flex";
          document.body.style.overflow = "hidden";
        }
      });
    });
  }

  if (modalClose && modal) {
    modalClose.addEventListener("click", () => {
      modal.classList.add("closing");
      modal.classList.remove("active");
      setTimeout(() => {
        modal.style.display = "none";
        modal.classList.remove("closing");
        document.body.style.overflow = "";
      }, 300);
    });
  }

  if (modal) {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        modal.classList.add("closing");
        modal.classList.remove("active");
        setTimeout(() => {
          modal.style.display = "none";
          modal.classList.remove("closing");
          document.body.style.overflow = "";
        }, 300);
      }
    });
  }
}

function initBackToTop() {
  const backToTopBtn = document.querySelector(".back-to-top");
  if (!backToTopBtn) return;

  window.addEventListener("scroll", () => {
    if (window.scrollY > 300) {
      backToTopBtn.classList.add("visible");
    } else {
      backToTopBtn.classList.remove("visible");
    }
  });

  backToTopBtn.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });
}

async function playInitialPageLoadTransition() {
  const isFirstLoad =
    !sessionStorage.getItem("blindsOpenNext") &&
    !sessionStorage.getItem("hasVisited");
  if (!isFirstLoad) return;

  // Mark as visited so it only plays once per session
  sessionStorage.setItem("hasVisited", "1");

  // Hide page content initially
  document.body.style.opacity = "0";

  await ensureGsap();

  return new Promise((resolve) => {
    createBlindsContainer();

    const container = document.querySelector(".blinds-container");
    const signature = document.querySelector(".blinds-signature");

    container.innerHTML = "";
    const blindCount = 28;
    const blindWidth = Math.ceil(window.innerWidth / blindCount) + 1;

    container.style.display = "block";
    signature.style.display = "block";
    gsap.set(signature, { opacity: 0 });
    restartSignatureDraw(signature);

    for (let i = 0; i < blindCount; i++) {
      const blind = document.createElement("div");
      blind.className = "blind";
      blind.style.width = blindWidth + "px";
      blind.style.left = i * blindWidth + "px";
      blind.style.height = "100%";
      container.appendChild(blind);
    }

    const blinds = container.querySelectorAll(".blind");
    const timeline = gsap.timeline({
      onComplete: () => {
        container.style.display = "none";
        signature.style.display = "none";
        document.body.style.opacity = "1";
      },
    });

    // Close: flip blinds in
    gsap.set(blinds, { rotateY: -110, transformPerspective: 1400 });
    timeline.to(
      blinds,
      {
        rotateY: 0,
        duration: 0.9,
        ease: "power2.inOut",
        stagger: { amount: 0.5, from: "start" },
      },
      0,
    );

    timeline.to(signature, { opacity: 1, duration: 0.6 }, 0.25);

    // Hold closed
    timeline.to({}, { duration: 0.4 });

    // Open: flip blinds out to reveal page
    timeline.to(
      blinds,
      {
        rotateY: 110,
        duration: 0.9,
        ease: "power2.inOut",
        stagger: { amount: 0.5, from: "start" },
      },
      "-=0.1",
    );

    timeline.to(signature, { opacity: 0, duration: 0.5 }, "-=0.7");

    // Fade in page content as blinds open
    timeline.to(document.body, { opacity: 1, duration: 0.6 }, "-=0.8");

    timeline.add(() => {
      resolve();
    });
  });
}

function initContactVideoBoomerang() {
  const video = document.getElementById("contactVideo");
  if (!video) return;

  let playbackDirection = 1;

  video.addEventListener("timeupdate", () => {
    if (playbackDirection === 1 && video.currentTime >= video.duration - 0.1) {
      playbackDirection = -1;
      video.playbackRate = -1;
    } else if (playbackDirection === -1 && video.currentTime <= 0.1) {
      playbackDirection = 1;
      video.playbackRate = 1;
    }
  });

  video.playbackRate = 1;
}

function initHeroVideoBoomerang() {
  const video = document.getElementById("heroVideo");
  if (!video) return;

  let direction = 1;

  video.addEventListener("timeupdate", () => {
    if (direction === 1 && video.currentTime >= video.duration - 0.1) {
      direction = -1;
      video.playbackRate = -1;
    } else if (direction === -1 && video.currentTime <= 0.1) {
      direction = 1;
      video.playbackRate = 1;
    }
  });

  video.playbackRate = 1;
}

function initPaperCardFlip() {
  const cards = document.querySelectorAll(".paper-card");
  if (!cards.length) return;

  cards.forEach((card) => {
    const titleEl = card.querySelector(".paper-title");
    const abstractEl = card.querySelector(".paper-abstract");
    if (!titleEl || !abstractEl) return;

    // Store the full abstract content
    const fullAbstract = abstractEl.innerHTML;
    // Add the prompt element if not present
    let prompt = abstractEl.querySelector(".paper-abstract-prompt");
    if (!prompt) {
      prompt = document.createElement("span");
      prompt.className = "paper-abstract-prompt";
      prompt.textContent = "Click for paper abstract";
      abstractEl.appendChild(prompt);
    }
    // Wrap the abstract text in a span for easy show/hide
    let abstractText = abstractEl.querySelector(".paper-abstract-text");
    if (!abstractText) {
      abstractText = document.createElement("span");
      abstractText.className = "paper-abstract-text";
      abstractText.innerHTML = fullAbstract;
      abstractEl.insertBefore(abstractText, prompt);
    }
    // Style for layout
    abstractEl.style.position = "absolute";
    abstractEl.style.top = "0";
    abstractEl.style.left = "0";
    abstractEl.style.width = "100%";
    abstractEl.style.height = "100%";
    abstractEl.style.display = "flex";
    abstractEl.style.flexDirection = "column";
    abstractEl.style.alignItems = "center";
    abstractEl.style.justifyContent = "center";
    abstractEl.style.opacity = 0;
    abstractEl.style.transition = "opacity 0.3s cubic-bezier(0.16,1,0.3,1)";
    prompt.style.display = "block";
    prompt.style.marginTop = "12px";
    abstractText.style.display = "block";

    const flipToBack = () => {
      // Hide the abstract text, show the prompt
      abstractText.style.display = "none";
      prompt.style.display = "block";
      gsap.to(card, {
        rotationY: 180,
        duration: 0.6,
        ease: "power2.inOut",
        overwrite: true,
        onStart: () => {
          card.style.backfaceVisibility = "visible";
        },
      });
      gsap.to(titleEl, {
        opacity: 0,
        duration: 0.3,
        ease: "power2.inOut",
        overwrite: true,
      });
      gsap.set(titleEl, { pointerEvents: "none", delay: 0.3 });
      gsap.set(abstractEl, { display: "flex" });
      gsap.to(abstractEl, {
        opacity: 1,
        duration: 0.3,
        delay: 0.2,
        ease: "power2.inOut",
        overwrite: true,
      });
    };

    const flipToFront = () => {
      // Show the abstract text, hide the prompt
      abstractText.style.display = "block";
      prompt.style.display = "none";
      gsap.to(card, {
        rotationY: 0,
        duration: 0.6,
        ease: "power2.inOut",
        overwrite: true,
        onComplete: () => {
          card.style.backfaceVisibility = "visible";
        },
      });
      gsap.to(abstractEl, {
        opacity: 0,
        duration: 0.3,
        ease: "power2.inOut",
        overwrite: true,
        onComplete: () => {
          gsap.set(abstractEl, { display: "none" });
        },
      });
      gsap.to(titleEl, {
        opacity: 1,
        duration: 0.3,
        delay: 0.2,
        ease: "power2.inOut",
        overwrite: true,
      });
      gsap.set(titleEl, { pointerEvents: "auto", delay: 0.5 });
    };

    card.addEventListener("mouseenter", flipToBack);
    card.addEventListener("mouseleave", flipToFront);
  });
}

function initResearchAbstractModal() {
  const modal = document.getElementById("abstractModal");
  const cards = document.querySelectorAll(".paper-card");
  if (!modal || !cards.length) return;

  const titleEl = modal.querySelector(".abstract-modal__title");
  const bodyEl = modal.querySelector(".abstract-modal__body");
  const closeBtn = modal.querySelector(".abstract-modal__close");

  if (!titleEl || !bodyEl || !closeBtn) return;

  const openModal = (title, abstract) => {
    titleEl.textContent = title || "Abstract";
    bodyEl.textContent = abstract || "Abstract unavailable.";
    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
    closeBtn.focus({ preventScroll: true });
  };

  const closeModal = () => {
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
  };

  closeBtn.addEventListener("click", (event) => {
    event.stopPropagation();
    closeModal();
  });

  modal.addEventListener("click", (event) => {
    if (event.target === modal) {
      closeModal();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && modal.classList.contains("open")) {
      closeModal();
    }
  });

  cards.forEach((card) => {
    const abstractEl = card.querySelector(".paper-abstract");
    if (!abstractEl) return;

    const title = card.querySelector(".paper-title")?.textContent?.trim();

    const showAbstract = () => {
      const abstract = abstractEl.textContent.trim();
      openModal(title, abstract);
    };

    card.setAttribute("role", "button");
    card.setAttribute("tabindex", "0");

    card.addEventListener("click", (event) => {
      event.preventDefault();
      showAbstract();
    });

    card.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        showAbstract();
      }
    });
  });
}

function initExperimentalScrollAnimations() {
  console.log("🎬 Experimental Scroll Animations STARTED");

  if (!window.gsap || !window.ScrollTrigger) {
    console.log("❌ GSAP or ScrollTrigger not loaded");
    return;
  }

  console.log("✅ GSAP and ScrollTrigger found, initializing animations...");
  gsap.registerPlugin(ScrollTrigger);

  // ==================== SMOOTH PARALLAX - IMAGES MOVE GRACEFULLY ====================
  // Disabled: Causes text-image overlap on scroll
  // gsap.utils.toArray("img:not(.nav-logo)").forEach((img, idx) => {
  //   gsap.to(img, {
  //     scrollTrigger: {
  //       trigger: img,
  //       start: "top bottom",
  //       end: "bottom top",
  //       scrub: 1,
  //     },
  //     y: 80,
  //     ease: "none",
  //   });
  // });

  // ==================== TEXT BLUR TO CLEAR EFFECT ====================
  gsap.utils.toArray("h2, h3, p, li").forEach((text) => {
    // Skip about-hero-text to prevent movement
    if (text.closest(".about-hero-text")) return;

    // Only apply blur animation if element is below viewport on load
    const rect = text.getBoundingClientRect();
    const isInitiallyVisible = rect.top < window.innerHeight;

    if (!isInitiallyVisible) {
      gsap.fromTo(
        text,
        {
          filter: "blur(10px)",
          opacity: 0.2,
          x: -60,
        },
        {
          scrollTrigger: {
            trigger: text,
            start: "top bottom",
            end: "top 72%",
            scrub: 1.5,
          },
          filter: "blur(0px)",
          opacity: 1,
          x: 0,
          ease: "power2.out",
        },
      );
    }
  });

  // ==================== IMAGE SCALE UP ON SCROLL ====================
  gsap.utils.toArray("section img, .article-card img").forEach((img) => {
    gsap.fromTo(
      img,
      {
        scale: 0.4,
      },
      {
        scrollTrigger: {
          trigger: img,
          start: "top 90%",
          end: "top 50%",
          scrub: 1.5,
        },
        scale: 1,
        ease: "power2.out",
      },
    );
  });

  // ==================== CARD REVEAL - SMOOTH SCALE & FADE ====================
  gsap.utils
    .toArray(".article-card, .endorsement-card, .book-card")
    .forEach((card, idx) => {
      const isArticleCard = card.classList.contains("article-card");
      gsap.fromTo(
        card,
        {
          opacity: 0,
          scale: 0.9,
          y: 60,
          filter: "blur(8px)",
        },
        {
          scrollTrigger: {
            trigger: card,
            start: "top 90%",
            end: "top 50%",
            scrub: 0.8,
          },
          opacity: 1,
          scale: 1,
          y: 0,
          filter: "blur(0px)",
          ease: "power2.out",
        },
      );

      // Subtle lift + rotation on scroll
      gsap.to(card, {
        scrollTrigger: {
          trigger: card,
          start: "top 90%",
          end: "bottom 50%",
          scrub: 0.6,
        },
        y: -40,
        rotationZ: isArticleCard ? 0 : idx % 2 === 0 ? 1 : -1,
        ease: "sine.inOut",
      });
    });

  // ==================== SECTION FADE IN ====================
  gsap.utils
    .toArray("section:not(.hero):not(.exec-ai-section)")
    .forEach((section) => {
      gsap.fromTo(
        section,
        {
          opacity: 0.5,
          y: 40,
        },
        {
          scrollTrigger: {
            trigger: section,
            start: "top 72%",
            end: "top 47%",
            scrub: 1,
          },
          opacity: 1,
          y: 0,
          ease: "power2.out",
        },
      );
    });

  // ==================== SUBTLE IMAGE ZOOM ====================
  gsap.utils.toArray(".book-card img, .fanned-card img").forEach((img) => {
    gsap.to(img, {
      scrollTrigger: {
        trigger: img,
        start: "top 90%",
        end: "top 50%",
        scrub: 1,
      },
      scale: 1.05,
      ease: "sine.inOut",
    });
  });

  // ==================== TEXT STAGGER REVEAL ====================
  // Disabled for article cards due to text layout issues
  // gsap.utils.toArray(".article-card h3").forEach((heading) => {
  //   const words = heading.textContent.split(" ");
  //   heading.innerHTML = words
  //     .map(
  //       (word) =>
  //         `<span style="display:inline-block; overflow:hidden; vertical-align:baseline;"><span style="display:inline-block; vertical-align:baseline;">${word}</span></span>`,
  //     )
  //     .join(" ");

  //   gsap.fromTo(
  //     heading.querySelectorAll("span > span"),
  //     {
  //       y: 30,
  //       opacity: 0,
  //     },
  //     {
  //       scrollTrigger: {
  //         trigger: heading,
  //         start: "top 68%",
  //         end: "top 51%",
  //         scrub: 1,
  //       },
  //       y: 0,
  //       opacity: 1,
  //       stagger: {
  //         each: 0.05,
  //       },
  //       ease: "power2.out",
  //     },
  //   );
  // });

  // ==================== GENTLE PARALLAX MOVEMENT ON SCROLL VELOCITY ====================
  ScrollTrigger.create({
    onUpdate: (self) => {
      const velocity = self.getVelocity();

      // Apply subtle opacity shift based on scroll speed
      if (Math.abs(velocity) > 100) {
        gsap.to("body", {
          opacity: 0.98,
          duration: 0.3,
          overwrite: "auto",
        });
      } else {
        gsap.to("body", {
          opacity: 1,
          duration: 0.5,
          overwrite: "auto",
        });
      }
    },
  });

  // ==================== NAV SUBTLE SCALE & ROUNDED ON SCROLL ====================
  gsap.to(".nav-container", {
    scrollTrigger: {
      trigger: "body",
      start: "top top",
      end: "200px top",
      scrub: 1,
    },
    scale: 0.95,
    ease: "sine.inOut",
  });

  let navbarRounded = false;
  ScrollTrigger.create({
    onUpdate: (self) => {
      const navbar = document.querySelector(".navbar");
      if (!navbar) return;
      const shouldRound = self.progress > 0;
      if (shouldRound === navbarRounded) return;
      navbarRounded = shouldRound;
      if (shouldRound) {
        navbar.classList.add("navbar-rounded");
      } else {
        navbar.classList.remove("navbar-rounded");
      }
    },
  });

  ScrollTrigger.refresh();
  console.log("✅ All smooth animations initialized");
}

document.addEventListener("DOMContentLoaded", () => {
  setupHamburger();
  setupLoaderTransitions();
  highlightActiveNavLink();
  initPatentStack();
  initUpcomingPatentsCarousel();
  initNewsletterNavigation();
  initBackToTop();
  initHeroVideoBoomerang();
  initContactVideoBoomerang();
  initPaperCardFlip();
  initResearchAbstractModal();
  initHeroSubtitleCarousel();
  initGsapAnimations()
    .then(async () => {
      // Initialize scroll animations AFTER GSAP loads
      initExperimentalScrollAnimations();
      playBlindsOpenIfNeeded();
    })
    .catch((error) => console.warn("GSAP failed to initialize", error));
});
