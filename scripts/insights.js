/* Newsletter signup for the Our Insights page. */
(() => {
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

  function createPostAction(label, path, href) {
    const link = document.createElement("a");
    link.href = href;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    const icon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    icon.setAttribute("viewBox", "0 0 24 24");
    icon.setAttribute("aria-hidden", "true");
    const shape = document.createElementNS("http://www.w3.org/2000/svg", "path");
    shape.setAttribute("d", path);
    icon.append(shape);
    const text = document.createElement("span");
    text.textContent = label;
    link.append(icon, text);
    return link;
  }

  function createLinkedInPost(post, index, followUrl) {
    const article = document.createElement("article");
    article.className = `linkedin-post${index === 0 ? " linkedin-post--featured" : ""}`;

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
    const publicLabel = document.createElement("span");
    const publicMark = document.createElement("span");
    publicMark.className = "linkedin-public";
    publicMark.setAttribute("aria-hidden", "true");
    const publicIcon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    publicIcon.setAttribute("viewBox", "0 0 24 24");
    publicIcon.setAttribute("aria-hidden", "true");
    const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    circle.setAttribute("cx", "12");
    circle.setAttribute("cy", "12");
    circle.setAttribute("r", "9");
    const meridians = document.createElementNS("http://www.w3.org/2000/svg", "path");
    meridians.setAttribute(
      "d",
      "M3.6 9h16.8M3.6 15h16.8M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18",
    );
    publicIcon.append(circle, meridians);
    publicMark.append(publicIcon);
    publicLabel.append(publicMark, document.createTextNode(" Public"));
    author.append(brand, publicLabel);

    const postLink = post.linkUrl || followUrl;
    const more = document.createElement("a");
    more.className = "linkedin-more";
    more.href = postLink;
    more.target = "_blank";
    more.rel = "noopener noreferrer";
    more.setAttribute("aria-label", "Open Konsalta on LinkedIn");
    more.textContent = "···";
    header.append(avatar, author, more);

    const copy = document.createElement("p");
    copy.className = "linkedin-post-copy";
    const title = document.createElement("strong");
    title.textContent = post.title;
    copy.append(title, document.createTextNode(post.body));
    article.append(header, copy);

    if (post.imageUrl) {
      const media = postLink ? document.createElement("a") : document.createElement("div");
      media.className = "linkedin-post-media";
      if (postLink) {
        media.href = postLink;
        media.target = "_blank";
        media.rel = "noopener noreferrer";
        media.setAttribute("aria-label", `Open ${post.title}`);
      }
      const image = document.createElement("img");
      image.src = post.imageUrl;
      image.alt = post.imageAlt;
      image.loading = "lazy";
      image.addEventListener("error", () => media.remove(), { once: true });
      media.append(image);
      article.append(media);
    }

    if (postLink) {
      const footer = document.createElement("footer");
      footer.className = "linkedin-post-actions";
      footer.append(
        createPostAction(
          "Like",
          "M7 10v11M7 10l4-6a2 2 0 0 1 3 1.7V9h5.2a2 2 0 0 1 2 2.3l-1.1 7.2a2 2 0 0 1-2 1.7H7M7 10H4a1 1 0 0 0-1 1v9a1 1 0 0 0 1 1h3",
          postLink,
        ),
        createPostAction(
          "Comment",
          "M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5Z",
          postLink,
        ),
        createPostAction(
          "Repost",
          "m17 2 4 4-4 4M3 11v-1a4 4 0 0 1 4-4h14M7 22l-4-4 4-4M21 13v1a4 4 0 0 1-4 4H3",
          postLink,
        ),
      );
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
      if (followLink && content.followUrl) followLink.href = content.followUrl;
      if (!Array.isArray(content.posts) || !content.posts.length) return;
      feed.replaceChildren(
        ...content.posts.map((post, index) =>
          createLinkedInPost(post, index, content.followUrl),
        ),
      );
    } catch (error) {
      console.warn("Could not load edited Insights posts; showing defaults.", error);
    }
  }

  loadInsightsPosts();

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
      say(error.message || "Something went wrong. Please try again in a moment.", "is-err");
    } finally {
      button.disabled = false;
    }
  });
})();
