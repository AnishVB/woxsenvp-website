document.addEventListener("DOMContentLoaded", () => {
  const lines = document.querySelectorAll(".overlay-line");
  let current = 0;

  function cycle() {
    lines.forEach((l, i) => {
      l.classList.toggle("active", i === current);
    });

    current = (current + 1) % lines.length;
  }

  cycle();
  setInterval(cycle, 2500);
});
