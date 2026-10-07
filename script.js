const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

// ---------- Floating learning symbols (maths, science, language) ----------
const symbols = ["π", "Σ", "∫", "A+", "√", "DNA", "H₂O", "E=mc²", "p<0.05", "ABC", "x²", "∞", "Δ", "α", "β", "R", "1 2 3", "?"];
const colors = ["#ff6b6b", "#ffa62b", "#ffc233", "#2ec4a6", "#4dabf7", "#8b5cf6", "#ff8fb1"];
const floaters = document.getElementById("floaters");
if (!reduceMotion) {
  const small = innerWidth < 700;
  const count = small ? 8 : 20;
  for (let i = 0; i < count; i++) {
    const s = document.createElement("span");
    s.textContent = symbols[i % symbols.length];
    s.style.left = Math.random() * (small ? 85 : 100) + "%";
    s.style.fontSize = (small ? 16 : 18) + Math.random() * (small ? 16 : 30) + "px";
    s.style.color = colors[i % colors.length];
    s.style.animationDuration = 18 + Math.random() * 22 + "s";
    s.style.animationDelay = -Math.random() * 30 + "s";
    floaters.appendChild(s);
  }
}

// ---------- Rotating role words ----------
const roles = ["Education Entrepreneur", "Academic Leader", "Curriculum & Learning Consultant", "Research Mentor"];
const roleEl = document.getElementById("role");
let ri = 0;
setInterval(() => {
  ri = (ri + 1) % roles.length;
  roleEl.textContent = roles[ri];
  roleEl.classList.remove("swap");
  void roleEl.offsetWidth;
  roleEl.classList.add("swap");
}, 2600);

// ---------- Progress bar + sticky nav active link ----------
const progress = document.getElementById("progress");
addEventListener("scroll", () => {
  const h = document.documentElement;
  progress.style.width = (h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100 + "%";
}, { passive: true });

const links = [...document.querySelectorAll("#menu a")];
const spy = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (e.isIntersecting) {
      links.forEach((l) => l.classList.toggle("active", l.getAttribute("href") === "#" + e.target.id));
    }
  });
}, { rootMargin: "-45% 0px -50% 0px" });
document.querySelectorAll("main section[id]").forEach((s) => spy.observe(s));

// ---------- Mobile menu ----------
const burger = document.getElementById("burger");
const menu = document.getElementById("menu");
burger.addEventListener("click", () => {
  const open = menu.classList.toggle("open");
  burger.classList.toggle("open", open);
  burger.setAttribute("aria-expanded", open);
});
menu.addEventListener("click", (e) => {
  if (e.target.tagName === "A") {
    menu.classList.remove("open");
    burger.classList.remove("open");
    burger.setAttribute("aria-expanded", false);
  }
});

// ---------- Reveal on scroll + counters ----------
function countUp(el) {
  const target = +el.dataset.count;
  const prefix = el.dataset.prefix || "";
  const suffix = el.dataset.suffix || "";
  const start = performance.now();
  (function step(now) {
    const t = Math.min((now - start) / 1600, 1);
    const val = Math.floor(target * (1 - Math.pow(1 - t, 3)));
    el.textContent = prefix + val.toLocaleString("en-IN") + (t === 1 ? suffix : "");
    if (t < 1) requestAnimationFrame(step);
  })(start);
}
const io = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (!e.isIntersecting) return;
    e.target.classList.add("show");
    e.target.querySelectorAll("[data-count]").forEach(countUp);
    io.unobserve(e.target);
  });
}, { threshold: 0.12 });
document.querySelectorAll(".reveal").forEach((el, i) => {
  el.style.transitionDelay = (i % 4) * 0.08 + "s";
  io.observe(el);
});

// ---------- Expertise tabs ----------
const tabs = [...document.querySelectorAll(".tab")];
const panels = [...document.querySelectorAll(".panel")];
function openTab(tab) {
  document.querySelector(".tabs").classList.remove("nudge");
  tabs.forEach((t) => {
    const on = t === tab;
    t.classList.toggle("active", on);
    t.setAttribute("aria-selected", on);
  });
  panels.forEach((p) => {
    const on = p.id === tab.getAttribute("aria-controls");
    p.hidden = !on;
    p.classList.remove("enter");
    if (on) {
      void p.offsetWidth;
      p.classList.add("enter");
      p.querySelectorAll("[data-count]").forEach(countUp);
    }
  });
}
tabs.forEach((t, i) => {
  t.addEventListener("click", () => openTab(t));
  t.addEventListener("keydown", (e) => {
    const d = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
    if (!d) return;
    const next = tabs[(i + d + tabs.length) % tabs.length];
    next.focus();
    openTab(next);
  });
});

// ---------- Experience filters ----------
const filterBar = document.getElementById("filters");
const items = [...document.querySelectorAll(".tl")];
filterBar.addEventListener("click", (e) => {
  const btn = e.target.closest("button");
  if (!btn) return;
  filterBar.querySelectorAll("button").forEach((b) => b.classList.toggle("active", b === btn));
  const f = btn.dataset.f;
  let n = 0;
  items.forEach((it) => {
    const show = f === "all" || it.dataset.cat === f;
    it.classList.toggle("hide", !show);
    it.classList.remove("pop");
    if (show) {
      it.classList.add("show");
      it.style.transitionDelay = "0s";
      void it.offsetWidth;
      it.style.animationDelay = n++ * 0.08 + "s";
      it.classList.add("pop");
    }
  });
});

// ---------- 3D tilt on cards ----------
if (matchMedia("(hover: hover)").matches && !reduceMotion) {
  document.querySelectorAll(".tilt").forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      card.style.transitionDelay = "0s";
      card.style.transform = `rotateY(${x * 10}deg) rotateX(${-y * 10}deg) translateY(-6px)`;
    });
    card.addEventListener("mouseleave", () => (card.style.transform = ""));
  });
}

// ---------- Click sparkles ----------
addEventListener("click", (e) => {
  if (reduceMotion) return;
  const marks = ["★", "✦", "✎", "♥", "✿"];
  for (let i = 0; i < 8; i++) {
    const s = document.createElement("span");
    s.className = "spark";
    s.textContent = marks[i % marks.length];
    s.style.left = e.clientX + "px";
    s.style.top = e.clientY + "px";
    s.style.color = colors[Math.floor(Math.random() * colors.length)];
    document.body.appendChild(s);
    const a = Math.random() * Math.PI * 2;
    const d = 40 + Math.random() * 50;
    requestAnimationFrame(() => {
      s.style.transform = `translate(${Math.cos(a) * d}px, ${Math.sin(a) * d}px) rotate(${Math.random() * 360}deg)`;
      s.style.opacity = 0;
    });
    setTimeout(() => s.remove(), 850);
  }
});

document.getElementById("year").textContent = new Date().getFullYear();
