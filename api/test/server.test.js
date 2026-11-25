"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { after, before, test } = require("node:test");
const { createApp } = require("../server");

const servers = [];
const storageDirectories = [];

async function startServer(app) {
  const server = app.listen(0, "127.0.0.1");
  await new Promise((resolve, reject) => {
    server.once("listening", resolve);
    server.once("error", reject);
  });
  servers.push(server);
  return `http://127.0.0.1:${server.address().port}`;
}

function createTestApp(options = {}) {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), "konsalta-api-test-"));
  storageDirectories.push(directory);
  return createApp({
    ...options,
    environment: {
      NEWSLETTER_DB_PATH: path.join(directory, "newsletter.json"),
      ...(options.environment || {}),
    },
  });
}

before(() => {
  assert.ok(createApp);
});

after(async () => {
  await Promise.all(
    servers.map(
      (server) =>
        new Promise((resolve, reject) => {
          server.close((error) => (error ? reject(error) : resolve()));
        }),
    ),
  );
  for (const directory of storageDirectories) {
    fs.rmSync(directory, { recursive: true, force: true });
  }
});

test("serves the website root and does not expose API source files", async () => {
  const baseUrl = await startServer(createTestApp({ environment: {} }));
  const home = await fetch(`${baseUrl}/`);
  assert.equal(home.status, 200);
  assert.match(await home.text(), /Konsalta/);

  const insights = await fetch(`${baseUrl}/insights.html`);
  assert.equal(insights.status, 200);
  const insightsHtml = await insights.text();
  assert.match(insightsHtml, /Our network model\./);
  assert.match(insightsHtml, /The evidence-to-impact cycle\./);

  const source = await fetch(`${baseUrl}/api/server.js`);
  assert.equal(source.status, 404);
  assert.deepEqual(await source.json(), {
    success: false,
    error: "API endpoint not found.",
  });
});

test("protects Insights editing and persists validated public content", async () => {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), "konsalta-insights-test-"));
  storageDirectories.push(directory);
  const environment = {
    NEWSLETTER_DB_PATH: path.join(directory, "newsletter.json"),
    INSIGHTS_CONTENT_PATH: path.join(directory, "insights-content.json"),
    PUBLIC_SITE_URL: "https://konsaltahub.org",
    NEWSLETTER_ADMIN_USER: "newsletter-admin",
    NEWSLETTER_ADMIN_PASSWORD: "test-password-for-newsletter",
  };
  const baseUrl = await startServer(createTestApp({ environment }));
  const initial = await fetch(`${baseUrl}/api/insights/content`);
  assert.equal(initial.status, 200);
  const initialContent = await initial.json();
  assert.equal(initialContent.posts.length, 2);
  assert.equal(initialContent.posts[0].title, "Our network model.");
  const repeatedReads = await Promise.all(
    Array.from({ length: 9 }, () => fetch(`${baseUrl}/api/insights/content`)),
  );
  assert.ok(repeatedReads.every((response) => response.status === 200));

  const unauthorized = await fetch(`${baseUrl}/api/newsletter/admin/insights`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Origin: "https://konsaltahub.org",
    },
    body: JSON.stringify({ followUrl: "", posts: [] }),
  });
  assert.equal(unauthorized.status, 401);

  const authorization = `Basic ${Buffer.from(
    "newsletter-admin:test-password-for-newsletter",
  ).toString("base64")}`;
  const update = await fetch(`${baseUrl}/api/newsletter/admin/insights`, {
    method: "PUT",
    headers: {
      Authorization: authorization,
      "Content-Type": "application/json",
      Origin: "https://konsaltahub.org",
    },
    body: JSON.stringify({
      followUrl: "https://www.linkedin.com/company/example/",
      posts: [
        {
          title: "Updated post",
          body: "A new page update.",
          imageUrl: "/public/images/new-insight.jpg",
          imageAlt: "A new insight",
          linkUrl: "https://example.org/article",
        },
      ],
    }),
  });
  assert.equal(update.status, 200);

  const invalid = await fetch(`${baseUrl}/api/newsletter/admin/insights`, {
    method: "PUT",
    headers: {
      Authorization: authorization,
      "Content-Type": "application/json",
      Origin: "https://konsaltahub.org",
    },
    body: JSON.stringify({
      followUrl: "",
      posts: [
        {
          title: "Unsafe link",
          body: "Reject unsafe protocols.",
          imageUrl: "",
          imageAlt: "",
          linkUrl: "javascript:alert(1)",
        },
      ],
    }),
  });
  assert.equal(invalid.status, 400);

  const restartedUrl = await startServer(createTestApp({ environment }));
  const publicContent = await fetch(`${restartedUrl}/api/insights/content`);
  const content = await publicContent.json();
  assert.equal(content.posts.length, 1);
  assert.equal(content.posts[0].title, "Updated post");
  assert.equal(content.followUrl, "https://www.linkedin.com/company/example/");

  const emptyUpdate = await fetch(`${restartedUrl}/api/newsletter/admin/insights`, {
    method: "PUT",
    headers: {
      Authorization: authorization,
      "Content-Type": "application/json",
      Origin: "https://konsaltahub.org",
    },
    body: JSON.stringify({ followUrl: "", posts: [] }),
  });
  assert.equal(emptyUpdate.status, 200);
  const defaultContent = await fetch(`${restartedUrl}/api/insights/content`);
  const restoredDefaults = await defaultContent.json();
  assert.equal(restoredDefaults.posts.length, 2);
  assert.equal(restoredDefaults.posts[0].title, "Our network model.");
});

test("validates contact submissions and sends them as plain text", async () => {
  const delivered = [];
  const baseUrl = await startServer(
    createTestApp({
      environment: {},
      sendEmail: async (message) => delivered.push(message),
    }),
  );

  const invalid = await fetch(`${baseUrl}/api/contact`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: "Test", email: "not-an-email" }),
  });
  assert.equal(invalid.status, 400);
  assert.equal(delivered.length, 0);

  const response = await fetch(`${baseUrl}/api/contact`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: "A Test Person",
      email: "person@example.com",
      company: "Example Organisation",
      projectType: "research",
      message: "Please contact me about an evaluation project.",
    }),
  });
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { success: true });
  assert.equal(delivered.length, 1);
  assert.equal(delivered[0].replyTo, "person@example.com");
  assert.match(delivered[0].text, /Example Organisation/);
  assert.equal(delivered[0].html, undefined);
});

test("sends consultant details and the actual uploaded CV as an attachment", async () => {
  const delivered = [];
  const baseUrl = await startServer(
    createTestApp({
      environment: {},
      sendEmail: async (message) => delivered.push(message),
    }),
  );
  const form = new FormData();
  const fields = {
    fullName: "Consultant Example",
    email: "consultant@example.com",
    phone: "+263 77 000 0000",
    country: "Zimbabwe",
    currentPosition: "Researcher",
    currentOrg: "Independent",
    yearsExperience: "6-10",
    bio: "Experienced research consultant. ".repeat(9),
    expertise: "Research & Analytics",
    englishLevel: "Fluent",
    qualification: "MSc",
    fieldOfStudy: "Economics",
    consultingExperience: "Yes",
    confirmAccuracy: "on",
    consentStorage: "on",
  };
  for (const [key, value] of Object.entries(fields)) {
    form.append(key, value);
  }
  form.append(
    "cv",
    new Blob(["%PDF-1.7\nTest CV content"], { type: "application/pdf" }),
    "consultant-cv.pdf",
  );

  const response = await fetch(`${baseUrl}/api/consultant-onboarding`, {
    method: "POST",
    body: form,
  });
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { success: true });
  assert.equal(delivered.length, 1);
  assert.equal(delivered[0].replyTo, "consultant@example.com");
  assert.equal(delivered[0].attachments.length, 1);
  assert.equal(delivered[0].attachments[0].filename, "consultant-cv.pdf");
  assert.equal(
    delivered[0].attachments[0].content.toString(),
    "%PDF-1.7\nTest CV content",
  );
});

test("returns an explicit service error when SMTP credentials are missing", async () => {
  const baseUrl = await startServer(createTestApp({ environment: {} }));
  const response = await fetch(`${baseUrl}/api/contact`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: "A Test Person",
      email: "person@example.com",
      projectType: "research",
      message: "Please contact me about an evaluation project.",
    }),
  });
  assert.equal(response.status, 503);
  assert.match((await response.json()).error, /not configured/i);
});

test("requires explicit consent and double opt-in for newsletter subscriptions", async () => {
  const delivered = [];
  const baseUrl = await startServer(
    createTestApp({
      environment: { PUBLIC_SITE_URL: "https://konsaltahub.org" },
      sendEmail: async (message) => delivered.push(message),
    }),
  );

  const invalid = await fetch(`${baseUrl}/api/newsletter/subscribe`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "not-an-email", consent: true }),
  });
  assert.equal(invalid.status, 400);

  const noConsent = await fetch(`${baseUrl}/api/newsletter/subscribe`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "reader@example.com", consent: false }),
  });
  assert.equal(noConsent.status, 400);
  assert.equal(delivered.length, 0);

  const response = await fetch(`${baseUrl}/api/newsletter/subscribe`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "Reader@Example.com", consent: true }),
  });
  assert.equal(response.status, 200);
  assert.match((await response.json()).message, /check your inbox/i);
  assert.equal(delivered.length, 1);
  assert.equal(delivered[0].to, "reader@example.com");
  assert.match(delivered[0].subject, /confirm/i);
  assert.match(delivered[0].text, /https:\/\/konsaltahub\.org\/api\/newsletter\/confirm/);
});

test("protects campaign tools, sends individual emails, and honors unsubscribe links", async () => {
  const delivered = [];
  const sharedDirectory = fs.mkdtempSync(path.join(os.tmpdir(), "konsalta-newsletter-test-"));
  storageDirectories.push(sharedDirectory);
  const databasePath = path.join(sharedDirectory, "newsletter.json");
  const baseUrl = await startServer(
    createTestApp({
      environment: {
        NEWSLETTER_DB_PATH: databasePath,
        PUBLIC_SITE_URL: "https://konsaltahub.org",
        NEWSLETTER_ADMIN_USER: "newsletter-admin",
        NEWSLETTER_ADMIN_PASSWORD: "test-password-for-newsletter",
      },
      sendEmail: async (message) => delivered.push(message),
    }),
  );
  const authorization = `Basic ${Buffer.from("newsletter-admin:test-password-for-newsletter").toString("base64")}`;
  const subscribe = await fetch(`${baseUrl}/api/newsletter/subscribe`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "reader@example.com", consent: true }),
  });
  assert.equal(subscribe.status, 200);
  const confirmationToken = new URL(delivered[0].text.match(/https:\/\/\S+/)[0]).searchParams.get("token");
  const confirmationPage = await fetch(
    `${baseUrl}/api/newsletter/confirm?token=${confirmationToken}`,
  );
  assert.equal(confirmationPage.status, 200);
  assert.match(await confirmationPage.text(), /Confirm subscription/);
  const confirmed = await fetch(`${baseUrl}/api/newsletter/confirm`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ token: confirmationToken }),
  });
  assert.equal(confirmed.status, 200);
  assert.match(await confirmed.text(), /Subscription confirmed/);

  const unauthorized = await fetch(`${baseUrl}/api/newsletter/admin/campaigns`);
  assert.equal(unauthorized.status, 401);
  const protectedPage = await fetch(`${baseUrl}/admin`);
  assert.equal(protectedPage.status, 401);
  const adminPage = await fetch(`${baseUrl}/admin`, {
    headers: { Authorization: authorization },
  });
  assert.equal(adminPage.status, 200);
  const adminHtml = await adminPage.text();
  assert.match(adminHtml, /Konsalta Admin/);
  assert.match(adminHtml, /Newsletter email preview/);

  const create = await fetch(`${baseUrl}/api/newsletter/admin/campaigns`, {
    method: "POST",
    headers: {
      Authorization: authorization,
      "Content-Type": "application/json",
      Origin: "https://konsaltahub.org",
    },
    body: JSON.stringify({
      subject: "New research",
      title: "What the latest evidence tells us",
      body: "A useful summary of the latest evidence.\n\nRead the full analysis.",
      sections: [
        {
          heading: "Evidence in action",
          body: "This section has a photo and text.",
          imageUrl: "https://konsaltahub.org/public/images/insight-feature.jpg",
          imageAlt: "Researchers reviewing a report",
        },
      ],
      ctaLabel: "Read the analysis",
      ctaUrl: "https://konsaltahub.org/insights.html",
    }),
  });

  test("requires HTTPS for newsletter administration in production", async () => {
    const baseUrl = await startServer(
      createTestApp({
        environment: {
          NODE_ENV: "production",
          PUBLIC_SITE_URL: "https://konsaltahub.org",
          NEWSLETTER_ADMIN_USER: "newsletter-admin",
          NEWSLETTER_ADMIN_PASSWORD: "test-password-for-newsletter",
        },
      }),
    );
    const response = await fetch(`${baseUrl}/admin`);
    assert.equal(response.status, 400);
    assert.match(await response.text(), /Use HTTPS/);
  });
  assert.equal(create.status, 201);
  const { campaign } = await create.json();

  const preview = await fetch(`${baseUrl}/api/newsletter/admin/preview`, {
    method: "POST",
    headers: {
      Authorization: authorization,
      "Content-Type": "application/json",
      Origin: "https://konsaltahub.org",
    },
    body: JSON.stringify(campaign),
  });
  assert.equal(preview.status, 200);
  const previewResult = await preview.json();
  assert.match(previewResult.html, /Researchers reviewing a report/);
  assert.match(previewResult.html, /https:\/\/konsaltahub\.org\/public\/images\/insight-feature\.jpg/);
  assert.match(previewResult.html, /Unsubscribe/);

  const unsafeImage = await fetch(`${baseUrl}/api/newsletter/admin/preview`, {
    method: "POST",
    headers: {
      Authorization: authorization,
      "Content-Type": "application/json",
      Origin: "https://konsaltahub.org",
    },
    body: JSON.stringify({
      ...campaign,
      sections: [
        {
          heading: "Unsafe",
          body: "This content is long enough to get to URL validation.",
          imageUrl: "javascript:alert(1)",
          imageAlt: "Unsafe image",
        },
      ],
    }),
  });
  assert.equal(unsafeImage.status, 400);

  const sent = await fetch(
    `${baseUrl}/api/newsletter/admin/campaigns/${campaign.id}/send`,
    {
      method: "POST",
      headers: {
        Authorization: authorization,
        Origin: "https://konsaltahub.org",
      },
    },
  );
  assert.equal(sent.status, 200);
  assert.deepEqual(await sent.json(), {
    success: true,
    status: "sent",
    sent: 1,
    failed: 0,
  });
  assert.equal(delivered.length, 2);
  assert.equal(delivered[1].to, "reader@example.com");
  assert.match(delivered[1].html, /Read the full analysis/);
  assert.match(delivered[1].html, /Researchers reviewing a report/);
  assert.match(delivered[1].headers["List-Unsubscribe"], /newsletter\/unsubscribe/);

  const publicUnsubscribeUrl = new URL(
    delivered[1].headers["List-Unsubscribe"].slice(1, -1),
  );
  const unsubscribeUrl = `${baseUrl}${publicUnsubscribeUrl.pathname}`;
  const unsubscribePage = await fetch(unsubscribeUrl);
  assert.equal(unsubscribePage.status, 200);
  const unsubscribed = await fetch(unsubscribeUrl, { method: "POST" });
  assert.equal(unsubscribed.status, 200);
  assert.match(await unsubscribed.text(), /You are unsubscribed/);

  const restartedBaseUrl = await startServer(
    createTestApp({
      environment: {
        NEWSLETTER_DB_PATH: databasePath,
        PUBLIC_SITE_URL: "https://konsaltahub.org",
        NEWSLETTER_ADMIN_USER: "newsletter-admin",
        NEWSLETTER_ADMIN_PASSWORD: "test-password-for-newsletter",
      },
      sendEmail: async () => {},
    }),
  );
  const persisted = await fetch(
    `${restartedBaseUrl}/api/newsletter/admin/campaigns`,
    { headers: { Authorization: authorization } },
  );
  assert.equal(persisted.status, 200);
  const persistedState = await persisted.json();
  assert.equal(persistedState.subscriberCount, 0);
  assert.equal(persistedState.campaigns[0].status, "sent");
});
