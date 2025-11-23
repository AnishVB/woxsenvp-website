// Animate the SVG turbulence to create the ReactBits Liquid Glass effect
document.addEventListener("DOMContentLoaded", () => {
  const turbulence = document.querySelector("#glass-filter feTurbulence");
  let t = 0;

  function animate() {
    t += 0.015;
    const bf = 0.85 + Math.sin(t) * 0.03;
    turbulence.setAttribute("baseFrequency", bf);
    requestAnimationFrame(animate);
  }

  animate();
});
