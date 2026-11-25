/* Insights feed + newsletter signup for the Our Insights page. */
(() => {
  const safeExternalUrl = (raw) => {
    const val = (raw || "").trim();
    if (!val) return "";
    try {
      const url = new URL(val);
      return url.protocol === "https:" && !url.username && !url.password
        ? url.href
        : "";
    } catch {
      return "";
    }
  };

  const safeImageSrc = (raw) => {
    const val = (raw || "").trim();
    if (!val) return "";
    if (!/^[a-z][a-z\d+.-]*:/i.test(val)) {
      if (
        val.startsWith("//") ||
        val.includes("\\") ||
        val.split("/").includes("..")
      ) {
        return "";
      }
      return val;
    }
    return safeExternalUrl(val);
  };

  const formatDate = (isoDate) => {
    if (!isoDate || !/^\d{4}-\d{2}-\d{2}$/.test(isoDate)) return "";
    const parsed = new Date(`${isoDate}T00:00:00Z`);
    if (Number.isNaN(parsed.getTime())) return "";
    return parsed.toLocaleDateString("en-GB", {
      month: "short",
      year: "numeric",
      timeZone: "UTC",
    });
  };

  const trackPostEvent = (postId, event) => {
    if (!postId || !/^[a-z0-9-]{1,64}$/i.test(postId)) return;
    fetch(`/api/insights/posts/${encodeURIComponent(postId)}/track`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ event }),
      keepalive: true,
    }).catch(() => {});
  };

  function createInsightCard(post, index, followUrl) {
    const article = document.createElement("article");
    article.className = `linkedin-post${index === 0 ? " linkedin-post--featured" : ""}`;
    if (post.id) article.dataset.postId = post.id;

    const header = document.createElement("header");
    header.className = "linkedin-post-head";
    const avatar = document.createElement("img");
    avatar.className = "linkedin-avatar";
    avatar.src = "public/Logo-5.png";
    avatar.alt = "";

    const author = document.createElement("div");
    author.className = "linkedin-author-meta";
    const brand = document.createElement("strong");
    brand.textContent = "Konsalta";

    const metaParts = [post.category, formatDate(post.publishedAt)].filter(Boolean);
    const metaLine = document.createElement("span");
    metaLine.textContent = metaParts.length ? metaParts.join(" · ") : "Konsalta Insights";
    author.append(brand, metaLine);

    const postLink = safeExternalUrl(post.linkUrl) || safeExternalUrl(followUrl);
    header.append(avatar, author);

    if (postLink) {
      const more = document.createElement("a");
      more.className = "linkedin-more";
      more.href = postLink;
      more.target = "_blank";
      more.rel = "noopener noreferrer";
      more.setAttribute("aria-label", `Open ${post.title || "post"}`);
      more.textContent = "↗";
      more.addEventListener("click", () => trackPostEvent(post.id, "click"));
      header.append(more);
    }

    const copy = document.createElement("p");
    copy.className = "linkedin-post-copy";
    const title = document.createElement("strong");
    title.textContent = post.title;
    copy.append(title, document.createTextNode(" "), document.createTextNode(post.body));
    article.append(header, copy);

    const imgSrc = safeImageSrc(post.imageUrl);
    if (imgSrc) {
      const media = postLink ? document.createElement("a") : document.createElement("div");
      media.className = "linkedin-post-media";
      if (postLink) {
        media.href = postLink;
        media.target = "_blank";
        media.rel = "noopener noreferrer";
        media.setAttribute("aria-label", `Open ${post.title}`);
        media.addEventListener("click", () => trackPostEvent(post.id, "click"));
      }
      const image = document.createElement("img");
      image.src = imgSrc;
      image.alt = post.imageAlt || post.title || "";
      image.loading = "lazy";
      image.addEventListener("error", () => media.remove(), { once: true });
      media.append(image);
      article.append(media);
    }

    if (postLink) {
      const footer = document.createElement("footer");
      footer.className = "linkedin-post-actions";
      const readLink = document.createElement("a");
      readLink.href = postLink;
      readLink.target = "_blank";
      readLink.rel = "noopener noreferrer";
      readLink.textContent = "Read full insight →";
      readLink.addEventListener("click", () => trackPostEvent(post.id, "click"));
      footer.append(readLink);
      article.append(footer);
    }

    return article;
  }

  async function loadInsightsPosts() {
    const feed = document.querySelector("#insights-posts");
    if (!feed) return;
    try {
      const response = await fetch("/api/insights/content");
      if (!response.ok) throw new Error("Unable to load Insights posts.");
      const content = await response.json();
      const followLink = document.querySelector("#linkedin-follow");
      const safeFollow = safeExternalUrl(content.followUrl);
      if (followLink && safeFollow) followLink.href = safeFollow;
      if (!Array.isArray(content.posts) || !content.posts.length) return;

      const cards = content.posts.map((post, index) =>
        createInsightCard(post, index, safeFollow),
      );
      feed.replaceChildren(...cards);

      if ("IntersectionObserver" in window) {
        const seen = new Set();
        const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (!entry.isIntersecting) return;
              const postId = entry.target.dataset.postId;
              if (postId && !seen.has(postId)) {
                seen.add(postId);
                trackPostEvent(postId, "view");
              }
              observer.unobserve(entry.target);
            });
          },
          { threshold: 0.4 },
        );
        cards.forEach((card) => {
          if (card.dataset.postId) observer.observe(card);
        });
      }
    } catch (error) {
      console.warn("Could not load edited Insights posts; showing defaults.", error);
    }
  }

  loadInsightsPosts();

  const form = document.querySelector(".signup");
  if (!form) return;
  const input = form.querySelector("input");
  const consent = form.querySelector('input[name="consent"]');
  const button = form.querySelector("button");
  const note = form.querySelector(".signup-note");
  const say = (msg, cls) => {
    note.textContent = msg;
    note.className = "signup-note " + (cls || "");
  };

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = input.value.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      say("Please enter a valid email address.", "is-err");
      input.focus();
      return;
    }
    if (!consent.checked) {
      say("Please consent to receive newsletter emails.", "is-err");
      consent.focus();
      return;
    }
    button.disabled = true;
    try {
      const response = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, consent: consent.checked }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Request failed.");
      form.reset();
      say(result.message, "is-ok");
    } catch (error) {
      say(
        error.message || "Something went wrong. Please try again in a moment.",
        "is-err",
      );
    } finally {
      button.disabled = false;
    }
  });
})();
