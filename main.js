const GSAP_SRC =
  "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js";
const GSAP_SCROLLTRIGGER_SRC =
  "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js";

const SIGNATURE_SVG = `
  <svg
    class="signature-svg"
    viewBox="0 0 800 600"
    aria-hidden="true"
    focusable="false"
    role="presentation"
  >
    <path
      d="m236.59998,332.26586c1.79605,-4.95814 6.02359,-13.81201 14.36843,-26.44339c12.68995,-19.20844 25.76795,-39.40547 37.71713,-64.45578c13.27155,-27.82249 24.30241,-50.82365 32.32897,-67.76117c6.13387,-12.94364 7.87906,-21.34908 12.57238,-23.13797c1.65935,-0.63248 1.89389,0.14912 3.59211,8.26356c3.6581,17.47907 14.7127,39.59645 21.55264,69.41389c7.56587,32.98207 16.39809,67.20251 25.14475,97.51002c7.05179,24.4347 11.52027,40.63323 8.98027,42.97052c-1.26998,1.16862 -3.66797,-1.61312 -10.77632,-13.2217c-9.0775,-14.82438 -18.28853,-30.92672 -34.12502,-46.27594c-14.89089,-14.43273 -26.2339,-24.04533 -35.92107,-29.74882c-3.38289,-1.99175 -0.04067,1.81043 7.18421,3.30542c8.93499,1.84881 13.53311,1.13911 16.16448,-1.65271c3.7213,-3.94827 1.79605,-6.61085 1.79605,-8.26356c0,-1.65271 0.40001,-2.10889 7.18421,3.30542c3.83772,3.06277 7.73107,5.83528 14.36843,3.30542c4.69332,-1.78889 10.35236,-4.17783 14.36843,-11.56899c1.60646,-2.95645 1.79605,-3.30542 3.59211,-3.30542c1.79605,0 3.72881,2.67295 5.38816,3.30542c2.34663,0.89445 3.59211,1.65271 5.38816,1.65271c0,0 3.41759,-2.02325 7.18421,-3.30542c6.94535,-2.3642 14.36843,-3.30542 21.55264,-3.30542c1.79605,0 5.38816,0 7.18421,0c0,0 2.32213,-1.16865 3.59211,0c1.26998,1.16865 1.79605,1.65271 3.59211,0c7.18421,-6.61085 10.40624,-15.01891 14.36843,-23.13797c3.29043,-6.74251 7.18421,-9.91627 10.77632,-3.30542c3.59211,6.61085 11.29462,14.65672 14.36843,21.48526c2.17348,4.82851 3.59211,4.95814 3.59211,3.30542c0,-1.65271 0,-3.30542 0,-4.95814c0,0 3.59211,-3.30542 7.18421,-6.61085c0,0 -0.55222,-1.96012 1.79605,-4.95814c2.97033,-3.79221 6.63172,-7.28998 12.57238,-14.87441c2.34828,-2.99801 5.69697,-7.5374 7.18421,-6.61085c8.00912,4.98966 9.02719,21.46988 17.96054,44.62323c10.83327,28.07755 21.53324,60.63458 25.14475,92.55188c3.16206,27.94505 4.86071,56.97444 -5.38816,62.80306c-6.11129,3.47555 -19.17225,-8.44191 -30.53291,-31.40153c-12.47613,-25.2139 -15.26552,-51.17784 -16.16448,-69.41391c-0.6511,-13.20813 1.79605,-21.48526 1.79605,-24.79068l1.79605,0l1.79605,3.30542l0,1.65271"
    />
  </svg>
`;

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

  if (signature && !signature.querySelector(".signature-svg")) {
    signature.innerHTML = SIGNATURE_SVG;
  }
}

function restartSignatureDraw(signatureEl) {
  const path = signatureEl?.querySelector("path");
  if (!path) return;

  const length = path.getTotalLength();
  path.style.setProperty("--signature-length", length);
  path.style.strokeDasharray = length;
  path.style.strokeDashoffset = length;
  path.style.animation = "none";
  path.classList.remove("drawing");
  void path.getBoundingClientRect();
  path.classList.add("drawing");
}

async function playBlindsAnimation(targetUrl) {
  await ensureGsap();

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
      0
    );

    // Show signature while closing
    timeline.to(signature, { opacity: 1, duration: 0.6 }, 0.25);

    // Hold closed briefly before navigating (increased to show full draw)
    timeline.to({}, { duration: 0.8 });
  });
}

// Play only the opening animation if flagged (after navigation)
async function playBlindsOpenIfNeeded() {
  const shouldOpen = sessionStorage.getItem("blindsOpenNext");
  if (!shouldOpen) return;
  sessionStorage.removeItem("blindsOpenNext");

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

  // Pre-set all page elements to hidden
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
    0
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
    0.8
  );

  // At 1.4s: hide overlay elements
  timeline.call(
    () => {
      container.style.display = "none";
      signature.style.display = "none";
    },
    null,
    1.4
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
    1.4
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

  gsap.set(reveals, { opacity: 0, y: 80 });
  reveals.forEach((el) => {
    gsap.to(el, {
      opacity: 1,
      y: 0,
      duration: 1.2,
      ease: "power4.out",
      scrollTrigger: {
        trigger: el,
        start: "top 82%",
        toggleActions: "play none none reverse",
      },
    });
  });

  gsap.set(fades, { opacity: 0 });
  fades.forEach((el) => {
    gsap.to(el, {
      opacity: 1,
      duration: 1.0,
      ease: "power3.out",
      scrollTrigger: {
        trigger: el,
        start: "top 85%",
        toggleActions: "play none none reverse",
      },
    });
  });
}

function animateFooterSignature() {
  const footerSig = document.querySelector(".footer-signature-svg");
  if (!footerSig || !window.ScrollTrigger) return;

  const path = footerSig.querySelector("path");
  if (!path) return;

  const trigger = ScrollTrigger.create({
    trigger: ".footer",
    onEnter: () => {
      const length = path.getTotalLength();
      path.style.setProperty("--signature-length", length);
      path.style.strokeDasharray = length;
      path.style.strokeDashoffset = length;
      path.style.animation = "none";
      path.classList.remove("drawing");
      void path.getBoundingClientRect();
      path.classList.add("drawing");
    },
    once: true,
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
        start: "top 82%",
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
  animateFooterSignature();
  animateEndorsements();
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
            <p>newsletter 1 content</p>
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
      0
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
      "-=0.1"
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

    const flipToBack = () => {
      // Flip to show "Click for paper abstract"
      gsap.to(card, {
        rotationY: 180,
        duration: 0.6,
        ease: "power2.inOut",
        overwrite: true,
      });

      gsap.to(titleEl, {
        opacity: 0,
        duration: 0.3,
        ease: "power2.inOut",
        overwrite: true,
      });
      gsap.set(titleEl, { pointerEvents: "none", delay: 0.3 });

      // Show flip text
      gsap.set(abstractEl, { display: "block" });
      gsap.to(abstractEl, {
        opacity: 1,
        duration: 0.3,
        delay: 0.2,
        ease: "power2.inOut",
        overwrite: true,
      });
    };

    const flipToFront = () => {
      // Flip back to show title
      gsap.to(card, {
        rotationY: 0,
        duration: 0.6,
        ease: "power2.inOut",
        overwrite: true,
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
  initGsapAnimations()
    .then(async () => {
      await playInitialPageLoadTransition();
      playBlindsOpenIfNeeded();
    })
    .catch((error) => console.warn("GSAP failed to initialize", error));
});
