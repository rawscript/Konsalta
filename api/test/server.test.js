"use strict";

const assert = require("node:assert/strict");
const { after, before, test } = require("node:test");
const { createApp } = require("../server");

const servers = [];

async function startServer(app) {
  const server = app.listen(0, "127.0.0.1");
  await new Promise((resolve, reject) => {
    server.once("listening", resolve);
    server.once("error", reject);
  });
  servers.push(server);
  return `http://127.0.0.1:${server.address().port}`;
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
});

test("serves the website root and does not expose API source files", async () => {
  const baseUrl = await startServer(createApp({ environment: {} }));
  const home = await fetch(`${baseUrl}/`);
  assert.equal(home.status, 200);
  assert.match(await home.text(), /Konsalta/);

  const source = await fetch(`${baseUrl}/api/server.js`);
  assert.equal(source.status, 404);
  assert.deepEqual(await source.json(), {
    success: false,
    error: "API endpoint not found.",
  });
});

test("validates contact submissions and sends them as plain text", async () => {
  const delivered = [];
  const baseUrl = await startServer(
    createApp({
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
    createApp({
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
  const baseUrl = await startServer(createApp({ environment: {} }));
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
