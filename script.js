/* =============================================================
   A LETTER FOR A FRIEND — script.js

   1. CONFIG            → change names in ONE place
   2. Envelope opening  → wax seal / button click
   3. Scroll reveal     → IntersectionObserver
   4. Falling petals    → one-time flourish after opening
   5. Broken-image safety net for the photo gallery
   ============================================================= */

/* -------------------------------------------------------------
   1) CONFIG — EDIT THESE
   Every element in index.html with data-friend-name / data-your-name
   is filled in automatically. (Leave blank to keep the HTML text.)
   ------------------------------------------------------------- */
const CONFIG = {
  friendName: "Beninggg",
  yourName: "Your Name",
};

// Tells the CSS that JS is running (so .reveal elements can start hidden)
document.documentElement.classList.add("js");

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function applyNames() {
  const fill = (selector, value) => {
    if (!value) return;
    document.querySelectorAll(selector).forEach((el) => (el.textContent = value));
  };
  fill("[data-friend-name]", CONFIG.friendName);
  fill("[data-your-name]", CONFIG.yourName);
}

/* -------------------------------------------------------------
   2) ENVELOPE OPENING
   Timeline: seal breaks + flap opens + letter rises  →  screen
   fades out  →  main content appears  →  petals fall.
   Adjust the timings (milliseconds) below if you want it slower/faster.
   ------------------------------------------------------------- */
const envelopeScreen = document.getElementById("envelope-screen");
const waxSeal = document.getElementById("wax-seal");
const openBtn = document.getElementById("open-btn");
const mainEl = document.getElementById("main");

const TIMING = prefersReducedMotion
  ? { fadeStart: 0, remove: 50 }
  : { fadeStart: 1700, remove: 2700 }; // ms

let opened = false;

function openEnvelope() {
  if (opened) return;
  opened = true;

  // Step 1: break the seal, open the flap, slide the letter up
  envelopeScreen.classList.add("is-opening");

  // Step 2: fade the whole envelope screen away and reveal the letter
  setTimeout(() => {
    mainEl.hidden = false;
    document.body.classList.remove("is-locked");
    window.scrollTo(0, 0);
    envelopeScreen.classList.add("is-leaving");
    initScrollReveal(); // start observing once content is visible
    if (!prefersReducedMotion) launchPetals();
  }, TIMING.fadeStart);

  // Step 3: remove the envelope from the DOM
  setTimeout(() => envelopeScreen.remove(), TIMING.remove);
}

waxSeal.addEventListener("click", openEnvelope);
openBtn.addEventListener("click", openEnvelope);

/* -------------------------------------------------------------
   3) SCROLL REVEAL — IntersectionObserver
   Add class="reveal" to any element to fade it in on scroll.
   Optional stagger: style="--d:.2s"
   ------------------------------------------------------------- */
function initScrollReveal() {
  const items = document.querySelectorAll(".reveal");

  // Fallback for very old browsers
  if (!("IntersectionObserver" in window)) {
    items.forEach((el) => el.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        obs.unobserve(entry.target); // animate once
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -6% 0px" }
  );

  items.forEach((el) => observer.observe(el));
}

/* -------------------------------------------------------------
   4) FALLING PETALS (runs once right after opening)
   ------------------------------------------------------------- */
function launchPetals() {
  const container = document.getElementById("petals");
  if (!container) return;

  const colors = ["#c46a78", "#e2c98f", "#f3e9d8", "#9caf88"];
  const COUNT = 22;

  for (let i = 0; i < COUNT; i++) {
    const petal = document.createElement("span");
    petal.className = "petal";
    petal.style.left = Math.random() * 100 + "%";
    petal.style.setProperty("--s", 9 + Math.random() * 10 + "px");
    petal.style.setProperty("--c", colors[Math.floor(Math.random() * colors.length)]);
    petal.style.setProperty("--t", 6 + Math.random() * 5 + "s");
    petal.style.setProperty("--dl", Math.random() * 2.5 + "s");
    petal.style.setProperty("--x", (Math.random() * 160 - 80) + "px");
    petal.style.setProperty("--rot", 360 + Math.random() * 540 + "deg");
    container.appendChild(petal);
  }

  // Clean up when the animation is done
  setTimeout(() => (container.innerHTML = ""), 12000);
}

/* -------------------------------------------------------------
   5) BROKEN IMAGE SAFETY NET
   If a photo URL fails, the frame shows a soft gradient instead.
   ------------------------------------------------------------- */
function initImageFallbacks() {
  document.querySelectorAll(".polaroid__photo img").forEach((img) => {
    img.addEventListener("error", () => img.parentElement.classList.add("is-broken"));
  });
}

/* ------------------------------------------------------------- */
applyNames();
initImageFallbacks();
