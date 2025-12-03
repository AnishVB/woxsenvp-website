document.addEventListener("DOMContentLoaded", () => {
  const lines = document.querySelectorAll(".stack-line");
  let current = 0;

  function updateLines() {
    lines.forEach((line, i) => {
      line.classList.remove("active");
      if (i === current) {
        line.classList.add("active");
      }
    });

    current = (current + 1) % lines.length;
  }

  updateLines();
  setInterval(updateLines, 2500);
});
