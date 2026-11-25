/* insights.js — newsletter sign-up for the Our Insights page.
   To store sign-ups, add data-endpoint="https://your-provider/endpoint" to the <form class="signup">.
   It is posted as JSON: { "email": "..." }. Without an endpoint the form only validates and confirms. */
(() => {
  const form = document.querySelector(".signup");
  if (!form) return;
  const input = form.querySelector("input");
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
    button.disabled = true;
    try {
      if (form.dataset.endpoint) {
        const res = await fetch(form.dataset.endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        });
        if (!res.ok) throw new Error("Request failed");
      }
      form.reset();
      say(
        "You’re on the list. We’ll be in touch as soon as the first insights are ready.",
        "is-ok",
      );
    } catch {
      say("Something went wrong. Please try again in a moment.", "is-err");
    } finally {
      button.disabled = false;
    }
  });
})();
