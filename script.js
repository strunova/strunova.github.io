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

// Copies the text, or says why not. The clipboard may be missing (a page not
// served over HTTPS) or refused by the browser.
const copy = async (text) => {
  if (navigator.clipboard === undefined) {
    return false;
  }
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
};

// Selects the text on the page, so it can be copied with Ctrl+C.
const select = (element) => {
  const range = document.createRange();
  range.selectNodeContents(element);
  const selection = window.getSelection();
  selection.removeAllRanges();
  selection.addRange(range);
};

for (const button of document.querySelectorAll("[data-copy]")) {
  // The label is read once: a second click while “Copied” shows must not make
  // “Copied” the label to come back to.
  const label = button.textContent;
  let timer;
  button.addEventListener("click", async () => {
    const target = document.getElementById(button.dataset.copy);
    if (target === null) {
      return;
    }
    const copied = await copy(target.textContent.trim());
    if (!copied) {
      select(target);
    }
    button.dataset.copied = String(copied);
    button.textContent = copied ? "Copied" : "Press Ctrl+C";
    clearTimeout(timer);
    timer = setTimeout(() => {
      button.dataset.copied = "false";
      button.textContent = label;
    }, 1600);
  });
}
