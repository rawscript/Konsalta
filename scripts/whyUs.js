if (typeof gsap !== "undefined") {
  if (typeof ScrollTrigger !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
  }

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (reduceMotion) {
    gsap.set(".headline .word > span", { y: 0 });
    gsap.set("#inlineImg, #ideaPill", { scale: 1 });
  } else {
    const heroTimeline = gsap.timeline({
      defaults: { ease: "power4.out" },
    });

    heroTimeline
      .to(".headline .word > span", {
        y: 0,
        duration: 0.9,
        stagger: 0.1,
      })
      .to(
        "#inlineImg, #ideaPill",
        {
          scale: 1,
          duration: 0.65,
          stagger: 0.12,
          ease: "back.out(1.5)",
        },
        0.25,
      );
  }
}
// ============================================================
// CONTINUOUS: inline img + idea pill + spheres bob
// ============================================================
gsap.to("#inlineImg", {
  y: "+=6",
  rotation: 2,
  duration: 2.8,
  delay: 1.8,
  ease: "sine.inOut",
  yoyo: true,
  repeat: -1
});
gsap.to("#ideaPill", {
  y: "+=5",
  rotation: -1.5,
  duration: 3.2,
  delay: 2.0,
  ease: "sine.inOut",
  yoyo: true,
  repeat: -1
});
document.querySelectorAll(".sphere").forEach((sp, i) => {
  gsap.to(sp, {
    y: `+=${5 + (i % 3) * 3}`,
    x: `+=${(i % 2 === 0 ? 1 : -1) * 4}`,
    rotation: `+=${i % 2 === 0 ? 3 : -3}`,
    duration: 3.5 + (i % 3) * 0.5,
    delay: 2 + i * 0.1,
    ease: "sine.inOut",
    yoyo: true,
    repeat: -1
  });
});

// ====================
// INLINE BADGE HOVER
// ============================================================
document.getElementById("inlineImg").addEventListener("mouseenter", (e) => {
  gsap.to(e.target, {
    scale: 1.08,
    rotation: 4,
    duration: 0.4,
    ease: "back.out(1.6)"
  });
});
document.getElementById("inlineImg").addEventListener("mouseleave", (e) => {
  gsap.to(e.target, {
    scale: 1,
    rotation: 0,
    duration: 0.6,
    ease: "elastic.out(1, 0.6)"
  });
});
document.getElementById("ideaPill").addEventListener("mouseenter", (e) => {
  gsap.to(e.currentTarget, {
    scale: 1.06,
    rotation: -3,
    duration: 0.4,
    ease: "back.out(1.6)"
  });
  gsap.to(e.currentTarget.querySelector(".leaf"), {
    rotation: 360,
    duration: 0.8,
    ease: "power2.inOut"
  });
});
document.getElementById("ideaPill").addEventListener("mouseleave", (e) => {
  gsap.to(e.currentTarget, {
    scale: 1,
    rotation: 0,
    duration: 0.6,
    ease: "elastic.out(1, 0.6)"
  });
});

const thumbs = document.querySelectorAll(".thumb-panel");
const mainDisplay = document.getElementById("mainDisplay");
const displayNum = document.getElementById("displayNum");
const displayCategory = document.getElementById("displayCategory");
const displayTitle = document.getElementById("displayTitle");
const displayDesc = document.getElementById("displayDesc");
const displayContent = document.getElementById("displayContent");

function updateMainPanel(panel) {
  const img = panel.getAttribute("data-img");
  const num = panel.getAttribute("data-num");
  const category = panel.getAttribute("data-category");
  const title = panel.getAttribute("data-title");
  const desc = panel.getAttribute("data-desc");

  displayContent.classList.add("fade-out");

  setTimeout(() => {
    mainDisplay.style.backgroundImage = `url('${img}')`;
    displayNum.textContent = num;
    displayCategory.textContent = category;
    displayTitle.textContent = title;
    displayDesc.textContent = desc;
    displayContent.classList.remove("fade-out");
  }, 200);
}

thumbs.forEach((thumb) => {
  thumb.addEventListener("mouseenter", () => updateMainPanel(thumb));
  thumb.addEventListener("focus", () => updateMainPanel(thumb));
});
