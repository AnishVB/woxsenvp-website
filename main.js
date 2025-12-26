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

        const fileName = (targetUrl.split("/").pop() || "").replace(
          ".html",
          ""
        );
        const pageNames = {
          "": "Home",
          index: "Home",
          about: "About",
          research: "Research",
          engagements: "Engagements",
          press: "Press",
          executiveedu: "Executive Education",
          newsletter: "Newsletter",
          "newsletter-archives": "Newsletter Archives",
          books: "Books",
          contact: "Contact",
        };
        const label = pageNames[fileName] || fileName.replace(/[-_]/g, " ");

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

function initNewsletterNavigation() {
  const numberGridButtons = document.querySelectorAll(".newsletter-number-btn");
  const viewOlderBtn = document.querySelector(".view-older-btn");
  const readMoreButtons = document.querySelectorAll(
    ".read-more-btn, .archive-read-more-btn"
  );
  const modal = document.getElementById("newsletterModal");
  const modalClose = document.querySelector(".modal-close");
  const modalBody = document.getElementById("modalBody");

  if (numberGridButtons.length > 0) {
    numberGridButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const newsletterNum = button.getAttribute("data-newsletter");
        const newsletterItem = document.querySelector(
          `.newsletter-item[data-newsletter="${newsletterNum}"]`
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
          ".newsletter-item, .archive-newsletter-item"
        );
        if (newsletterItem) {
          const title = newsletterItem.querySelector("h3").textContent;
          const date = newsletterItem.querySelector(
            ".newsletter-date, .archive-newsletter-date"
          ).textContent;
          const image = newsletterItem.querySelector("img").src;

          modalBody.innerHTML = `
            <img src="${image}" alt="${title}" style="width: 100%; max-height: 300px; object-fit: cover; margin-bottom: 30px; border-radius: 8px;" />
            <h2>${title}</h2>
            <p style="color: var(--color-accent); font-weight: 600; margin-bottom: 20px;">${date}</p>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.</p>
            <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
            <h3 style="margin-top: 30px;">Key Points</h3>
            <ul>
              <li>Innovation in cognitive technology</li>
              <li>Research-backed methodologies</li>
              <li>Practical applications for modern challenges</li>
              <li>Future trends in artificial intelligence</li>
            </ul>
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
      modal.classList.remove("active");
      setTimeout(() => {
        modal.style.display = "none";
        document.body.style.overflow = "";
      }, 300);
    });
  }

  if (modal) {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        modal.classList.remove("active");
        setTimeout(() => {
          modal.style.display = "none";
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

document.addEventListener("DOMContentLoaded", () => {
  setupHamburger();
  setupLoaderTransitions();
  highlightActiveNavLink();
  initPatentStack();
  initUpcomingPatentsCarousel();
  initNewsletterNavigation();
  initBackToTop();
  initGsapAnimations().catch((error) =>
    console.warn("GSAP failed to initialize", error)
  );
});
