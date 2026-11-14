// Small touches for the STRUNOVA website: sections rise into view as the page
// scrolls, and the checksum and the install command can be copied. The page
// works fully without this script.

const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
document.documentElement.classList.add("js");

const reveal = (element) => {
  element.classList.add("is-visible");
};

const items = [...document.querySelectorAll(".reveal")];
if (reduced || !("IntersectionObserver" in window)) {
  items.forEach(reveal);
} else {
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          reveal(entry.target);
          observer.unobserve(entry.target);
        }
      }
    },
    { threshold: 0.12 },
  );
  for (const item of items) {
    // What is already on screen shows at once; the rest rises when reached.
    const box = item.getBoundingClientRect();
    if (box.top < window.innerHeight) {
      reveal(item);
    } else {
      observer.observe(item);
    }
  }
}

for (const button of document.querySelectorAll("[data-copy]")) {
  button.addEventListener("click", () => {
    const target = document.getElementById(button.dataset.copy);
    if (target === null || navigator.clipboard === undefined) {
      return;
    }
    navigator.clipboard.writeText(target.textContent.trim()).then(() => {
      const label = button.textContent;
      button.dataset.copied = "true";
      button.textContent = "Copied";
      setTimeout(() => {
        button.dataset.copied = "false";
        button.textContent = label;
      }, 1600);
    });
  });
}
