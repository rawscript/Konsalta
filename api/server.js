"use strict";

const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");
const { DatabaseSync } = require("node:sqlite");
const express = require("express");
const cors = require("cors");
const multer = require("multer");
const nodemailer = require("nodemailer");
const { rateLimit } = require("express-rate-limit");

require("dotenv").config({ path: path.join(__dirname, ".env") });

const SITE_ROOT = path.resolve(__dirname, "..");
const MAX_FILE_SIZE = 5 * 1024 * 1024;
const MAX_EMAIL_LENGTH = 254;
const DEFAULT_INSIGHTS_CONTENT = {
  followUrl: "https://www.linkedin.com/company/konsalta-hub-africa/",
  posts: [
    {
      id: "our-network-model",
      title: "Our network model.",
      body: "Consulting does not have to mean a fixed bench of generalists parachuted into every project. For every engagement, we assemble the right mix of senior expertise, local context and specialist insight.",
      imageUrl: "public/linkedin/post-1.jpeg",
      imageAlt: "Konsalta network model article",
      linkUrl: "https://www.linkedin.com/company/konsalta-hub-africa/",
      category: "Operating Model",
      publishedAt: "2026-04-01",
    },
    {
      id: "evidence-to-impact-cycle",
      title: "The evidence-to-impact cycle.",
      body: "Most organisations do not have an evidence problem — they have an application problem. Evidence creates value when it is translated into decisions, programmes and practical action.",
      imageUrl: "public/linkedin/post-2.jpeg",
      imageAlt: "Konsalta evidence-to-impact article",
      linkUrl: "https://www.linkedin.com/company/konsalta-hub-africa/",
      category: "Methodology",
      publishedAt: "2026-04-15",
    },
  ],
};
const allowedDocuments = new Set([".pdf", ".doc", ".docx"]);
const documentMimeTypes = {
  ".pdf": "application/pdf",
  ".doc": "application/msword",
  ".docx":
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
};

class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

class SmtpConfigurationError extends Error {}

function isEmail(value) {
  return (
    typeof value === "string" &&
    value.length <= MAX_EMAIL_LENGTH &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
  );
}

function getString(body, key, options = {}) {
  const { maxLength = 1000, required = false } = options;
  const raw = body[key];

  if (raw === undefined) {
    if (required) {
      throw new HttpError(400, `${key} is required.`);
    }
    return "";
  }
  if (typeof raw !== "string") {
    throw new HttpError(400, `${key} must have one value.`);
  }

  const value = raw.trim();
  if (value.length > maxLength) {
    throw new HttpError(400, `${key} is too long.`);
  }
  if (required && !value) {
    throw new HttpError(400, `${key} is required.`);
  }
  return value;
}

function getList(body, key, options = {}) {
  const { maxItems = 30, maxLength = 150 } = options;
  const raw = body[key];
  if (raw === undefined) return [];

  const values = Array.isArray(raw) ? raw : [raw];
  if (values.length > maxItems) {
    throw new HttpError(400, `${key} has too many values.`);
  }
  return values.map((value) => {
    if (typeof value !== "string" || value.length > maxLength) {
      throw new HttpError(400, `${key} contains an invalid value.`);
    }
    return value.trim();
  }).filter(Boolean);
}

function validateUrl(value, fieldName) {
  if (!value) return;
  let url;
  try {
    url = new URL(value);
  } catch {
    throw new HttpError(400, `${fieldName} must be a valid URL.`);
  }
  if (url.protocol !== "http:" && url.protocol !== "https:") {
    throw new HttpError(400, `${fieldName} must use HTTP or HTTPS.`);
  }
}

function validateContact(body) {
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    throw new HttpError(400, "A JSON enquiry is required.");
  }

  const enquiry = {
    name: getString(body, "name", { maxLength: 160, required: true }),
    email: getString(body, "email", {
      maxLength: MAX_EMAIL_LENGTH,
      required: true,
    }),
    company: getString(body, "company", { maxLength: 200 }),
    projectType: getString(body, "projectType", {
      maxLength: 80,
      required: true,
    }),
    message: getString(body, "message", {
      maxLength: 5000,
      required: true,
    }),
  };

  if (!isEmail(enquiry.email)) {
    throw new HttpError(400, "Enter a valid email address.");
  }
  if (enquiry.message.length < 10) {
    throw new HttpError(400, "Your message must be at least 10 characters.");
  }
  if (
    !["research", "strategy", "market-intelligence", "policy", "other"].includes(
      enquiry.projectType,
    )
  ) {
    throw new HttpError(400, "Select a valid project type.");
  }
  return enquiry;
}

function validateConsultant(body, files) {
  const application = {
    fullName: getString(body, "fullName", {
      maxLength: 160,
      required: true,
    }),
    email: getString(body, "email", {
      maxLength: MAX_EMAIL_LENGTH,
      required: true,
    }),
    phone: getString(body, "phone", { maxLength: 80, required: true }),
    country: getString(body, "country", { maxLength: 120, required: true }),
    nationality: getString(body, "nationality", { maxLength: 120 }),
    linkedin: getString(body, "linkedin", { maxLength: 2048 }),
    website: getString(body, "website", { maxLength: 2048 }),
    currentPosition: getString(body, "currentPosition", {
      maxLength: 200,
      required: true,
    }),
    currentOrg: getString(body, "currentOrg", {
      maxLength: 200,
      required: true,
    }),
    yearsExperience: getString(body, "yearsExperience", {
      maxLength: 20,
      required: true,
    }),
    bio: getString(body, "bio", { maxLength: 5000, required: true }),
    expertise: getList(body, "expertise"),
    otherExpertise: getString(body, "otherExpertise", { maxLength: 1000 }),
    skills: getList(body, "skills"),
    otherSkills: getString(body, "otherSkills", { maxLength: 1000 }),
    countriesWorked: getString(body, "countriesWorked", { maxLength: 1000 }),
    regions: getList(body, "regions", { maxItems: 10, maxLength: 100 }),
    englishLevel: getString(body, "englishLevel", { maxLength: 30 }),
    frenchLevel: getString(body, "frenchLevel", { maxLength: 30 }),
    portugueseLevel: getString(body, "portugueseLevel", { maxLength: 30 }),
    arabicLevel: getString(body, "arabicLevel", { maxLength: 30 }),
    swahiliLevel: getString(body, "swahiliLevel", { maxLength: 30 }),
    otherLanguage: getString(body, "otherLanguage", { maxLength: 500 }),
    qualification: getString(body, "qualification", {
      maxLength: 200,
      required: true,
    }),
    fieldOfStudy: getString(body, "fieldOfStudy", {
      maxLength: 200,
      required: true,
    }),
    consultingExperience: getString(body, "consultingExperience", {
      maxLength: 10,
      required: true,
    }),
    availability: getString(body, "availability", { maxLength: 80 }),
  };

  if (!isEmail(application.email)) {
    throw new HttpError(400, "Enter a valid email address.");
  }
  validateUrl(application.linkedin, "LinkedIn profile");
  validateUrl(application.website, "Website");
  if (application.bio.length < 250) {
    throw new HttpError(400, "Your professional bio must be at least 250 characters.");
  }
  if (application.expertise.length === 0 && application.skills.length === 0) {
    throw new HttpError(400, "Select at least one area of expertise or skill.");
  }
  if (!["0-5", "6-10", "11-15", "16-20", "20+"].includes(application.yearsExperience)) {
    throw new HttpError(400, "Select a valid experience range.");
  }
  if (!["Yes", "No"].includes(application.consultingExperience)) {
    throw new HttpError(400, "Select a valid consulting experience response.");
  }
  if (!["on", "true", "1"].includes(getString(body, "confirmAccuracy"))) {
    throw new HttpError(400, "Confirm that your information is accurate.");
  }
  if (!["on", "true", "1"].includes(getString(body, "consentStorage"))) {
    throw new HttpError(400, "Consent to the stated information storage purpose.");
  }

  const uploads = files || {};
  const documents = [];
  for (const field of ["cv", "writingSample", "sampleReport", "references"]) {
    const file = uploads[field]?.[0];
    if (field === "cv" && !file) {
      throw new HttpError(400, "Please attach your CV or resume.");
    }
    if (!file) continue;

    const extension = path.extname(file.originalname).toLowerCase();
    const validSignature =
      (extension === ".pdf" && file.buffer.subarray(0, 5).toString() === "%PDF-") ||
      (extension === ".doc" &&
        file.buffer.subarray(0, 8).equals(
          Buffer.from([0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1]),
        )) ||
      (extension === ".docx" &&
        file.buffer.subarray(0, 4).equals(Buffer.from([0x50, 0x4b, 0x03, 0x04])));

    if (!validSignature) {
      throw new HttpError(400, `${field} must be a valid PDF, DOC, or DOCX file.`);
    }
    const normalizedName = path.posix
      .basename(file.originalname.replace(/\\/g, "/"))
      .replace(/[\u0000-\u001f\u007f]/g, "")
      .replace(/[^\p{L}\p{N}._ -]/gu, "_")
      .slice(0, 160);
    documents.push({
      filename: normalizedName || `${field}${extension}`,
      content: file.buffer,
      contentType: documentMimeTypes[extension],
    });
  }

  return { application, documents };
}

function formatContactMessage(enquiry) {
  return [
    "A new website contact enquiry was submitted.",
    "",
    `Name: ${enquiry.name}`,
    `Email: ${enquiry.email}`,
    `Organisation: ${enquiry.company || "Not provided"}`,
    `Project type: ${enquiry.projectType}`,
    "",
    "Message:",
    enquiry.message,
  ].join("\n");
}

function formatConsultantMessage(application, documents) {
  const fields = [
    ["Full name", application.fullName],
    ["Email", application.email],
    ["Phone", application.phone],
    ["Country", application.country],
    ["Nationality", application.nationality],
    ["LinkedIn", application.linkedin],
    ["Website", application.website],
    ["Current position", application.currentPosition],
    ["Current organisation", application.currentOrg],
    ["Years of experience", application.yearsExperience],
    ["Professional bio", application.bio],
    ["Areas of expertise", application.expertise],
    ["Other expertise", application.otherExpertise],
    ["Skills", application.skills],
    ["Other skills", application.otherSkills],
    ["Countries worked", application.countriesWorked],
    ["Regions", application.regions],
    ["English proficiency", application.englishLevel],
    ["French proficiency", application.frenchLevel],
    ["Portuguese proficiency", application.portugueseLevel],
    ["Arabic proficiency", application.arabicLevel],
    ["Swahili proficiency", application.swahiliLevel],
    ["Other languages", application.otherLanguage],
    ["Highest qualification", application.qualification],
    ["Field of study", application.fieldOfStudy],
    ["Previous consulting experience", application.consultingExperience],
    ["Availability", application.availability],
    ["Attached documents", documents.map((document) => document.filename)],
  ];

  return [
    "A consultant network application was submitted.",
    "",
    ...fields.map(([label, value]) => {
      const text = Array.isArray(value) ? value.join(", ") : value;
      return `${label}: ${text || "Not provided"}`;
    }),
  ].join("\n");
}

function createSmtpConfig(environment) {
  const user = environment.SMTP_USER || "no-reply@konsaltahub.org";
  const password = environment.SMTP_PASSWORD;
  if (!password) {
    throw new SmtpConfigurationError(
      "SMTP_PASSWORD is not configured for this application.",
    );
  }

  const port = Number(environment.SMTP_PORT || 465);
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new SmtpConfigurationError("SMTP_PORT must be a valid port number.");
  }

  const secureValue = (environment.SMTP_SECURE || "true").toLowerCase();
  if (!["true", "false"].includes(secureValue)) {
    throw new SmtpConfigurationError("SMTP_SECURE must be true or false.");
  }

  return {
    host: environment.SMTP_HOST || "mail.konsaltahub.org",
    port,
    secure: secureValue === "true",
    user,
    password,
    from: environment.SMTP_FROM || user,
    to:
      environment.CONTACT_TO ||
      environment.REPLY_TO ||
      "engage@konsaltahub.org",
  };
}

function resolveSqlitePath(filename) {
  const resolved = path.resolve(filename);
  const sqlitePath = resolved.endsWith(".json")
    ? resolved.replace(/\.json$/i, ".sqlite")
    : resolved;
  fs.mkdirSync(path.dirname(sqlitePath), { recursive: true, mode: 0o700 });
  return { legacyJsonPath: resolved, sqlitePath };
}

class NewsletterStore {
  constructor(filename) {
    const { legacyJsonPath, sqlitePath } = resolveSqlitePath(filename);
    this.filename = sqlitePath;
    const isNewDb = !fs.existsSync(sqlitePath);
    this.db = new DatabaseSync(sqlitePath);
    this.db.exec(`
      PRAGMA journal_mode = WAL;
      PRAGMA foreign_keys = ON;
      CREATE TABLE IF NOT EXISTS subscribers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT NOT NULL UNIQUE,
        status TEXT NOT NULL,
        consent_at TEXT,
        confirmation_token_hash TEXT,
        confirmation_expires_at TEXT,
        created_at TEXT NOT NULL,
        confirmed_at TEXT,
        unsubscribed_at TEXT
      );
      CREATE TABLE IF NOT EXISTS campaigns (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        subject TEXT NOT NULL,
        title TEXT NOT NULL,
        body TEXT NOT NULL,
        sections_json TEXT NOT NULL,
        cta_label TEXT NOT NULL,
        cta_url TEXT NOT NULL,
        status TEXT NOT NULL,
        created_at TEXT NOT NULL,
        sent_at TEXT
      );
      CREATE TABLE IF NOT EXISTS deliveries (
        campaign_id INTEGER NOT NULL,
        email TEXT NOT NULL,
        status TEXT NOT NULL,
        sent_at TEXT,
        PRIMARY KEY (campaign_id, email)
      );
      CREATE TABLE IF NOT EXISTS unsubscribe_tokens (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        subscriber_id INTEGER NOT NULL,
        token_hash TEXT NOT NULL UNIQUE,
        created_at TEXT NOT NULL,
        revoked_at TEXT
      );
    `);
    try {
      fs.chmodSync(sqlitePath, 0o600);
    } catch {}

    if (isNewDb && legacyJsonPath !== sqlitePath && fs.existsSync(legacyJsonPath)) {
      this.migrateLegacyJson(legacyJsonPath);
    }

    this.db.exec(`
      UPDATE campaigns SET status = 'partial' WHERE status = 'sending';
      UPDATE deliveries SET status = 'failed' WHERE status = 'sending';
    `);
  }

  migrateLegacyJson(legacyJsonPath) {
    const data = JSON.parse(fs.readFileSync(legacyJsonPath, "utf8"));
    for (const key of ["subscribers", "campaigns", "deliveries", "unsubscribeTokens"]) {
      if (!Array.isArray(data[key])) {
        throw new Error(`Newsletter storage is invalid: ${key} must be an array.`);
      }
    }
    this.db.exec("BEGIN");
    try {
      const insertSub = this.db.prepare(
        `INSERT OR IGNORE INTO subscribers
         (id, email, status, consent_at, confirmation_token_hash, confirmation_expires_at, created_at, confirmed_at, unsubscribed_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      );
      for (const s of data.subscribers) {
        insertSub.run(
          s.id,
          s.email,
          s.status,
          s.consentAt || null,
          s.confirmationTokenHash || null,
          s.confirmationExpiresAt || null,
          s.createdAt,
          s.confirmedAt || null,
          s.unsubscribedAt || null,
        );
      }
      const insertCamp = this.db.prepare(
        `INSERT OR IGNORE INTO campaigns
         (id, subject, title, body, sections_json, cta_label, cta_url, status, created_at, sent_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      );
      for (const c of data.campaigns) {
        insertCamp.run(
          c.id,
          c.subject,
          c.title,
          c.body,
          JSON.stringify(c.sections || []),
          c.ctaLabel || "",
          c.ctaUrl || "",
          c.status,
          c.createdAt,
          c.sentAt || null,
        );
      }
      const insertDel = this.db.prepare(
        `INSERT OR IGNORE INTO deliveries (campaign_id, email, status, sent_at) VALUES (?, ?, ?, ?)`,
      );
      for (const d of data.deliveries) {
        insertDel.run(d.campaignId, d.email, d.status, d.sentAt || null);
      }
      const insertTok = this.db.prepare(
        `INSERT OR IGNORE INTO unsubscribe_tokens (subscriber_id, token_hash, created_at, revoked_at) VALUES (?, ?, ?, ?)`,
      );
      for (const t of data.unsubscribeTokens) {
        insertTok.run(t.subscriberId, t.tokenHash, t.createdAt, t.revokedAt || null);
      }
      this.db.exec("COMMIT");
    } catch (error) {
      this.db.exec("ROLLBACK");
      throw error;
    }
  }

  mapSubscriber(row) {
    if (!row) return undefined;
    return {
      id: Number(row.id),
      email: row.email,
      status: row.status,
      consentAt: row.consent_at,
      confirmationTokenHash: row.confirmation_token_hash,
      confirmationExpiresAt: row.confirmation_expires_at,
      createdAt: row.created_at,
      confirmedAt: row.confirmed_at,
      unsubscribedAt: row.unsubscribed_at,
    };
  }

  mapCampaign(row) {
    if (!row) return undefined;
    return {
      id: Number(row.id),
      subject: row.subject,
      title: row.title,
      body: row.body,
      sections: JSON.parse(row.sections_json || "[]"),
      ctaLabel: row.cta_label,
      ctaUrl: row.cta_url,
      status: row.status,
      createdAt: row.created_at,
      sentAt: row.sent_at,
    };
  }

  findSubscriberByEmail(email) {
    return this.mapSubscriber(
      this.db.prepare("SELECT * FROM subscribers WHERE email = ?").get(email),
    );
  }

  findSubscriberByConfirmationHash(tokenHash) {
    return this.mapSubscriber(
      this.db
        .prepare("SELECT * FROM subscribers WHERE confirmation_token_hash = ?")
        .get(tokenHash),
    );
  }

  addPendingSubscriber(email, tokenHash, expiresAt, now) {
    const existing = this.findSubscriberByEmail(email);
    if (existing) {
      this.db
        .prepare(
          `UPDATE subscribers
           SET status = 'pending', consent_at = ?, confirmation_token_hash = ?, confirmation_expires_at = ?, unsubscribed_at = NULL
           WHERE id = ?`,
        )
        .run(now, tokenHash, expiresAt, existing.id);
    } else {
      this.db
        .prepare(
          `INSERT INTO subscribers
           (email, status, consent_at, confirmation_token_hash, confirmation_expires_at, created_at)
           VALUES (?, 'pending', ?, ?, ?, ?)`,
        )
        .run(email, now, tokenHash, expiresAt, now);
    }
  }

  confirmSubscriber(tokenHash, now) {
    const subscriber = this.findSubscriberByConfirmationHash(tokenHash);
    if (!subscriber || subscriber.status !== "pending") return null;
    if (Date.parse(subscriber.confirmationExpiresAt) < Date.now()) return "expired";
    this.db
      .prepare(
        `UPDATE subscribers
         SET status = 'subscribed', confirmed_at = ?, confirmation_token_hash = NULL, confirmation_expires_at = NULL
         WHERE id = ?`,
      )
      .run(now, subscriber.id);
    return this.findSubscriberByEmail(subscriber.email);
  }

  findSubscribedByUnsubscribeHash(tokenHash) {
    const row = this.db
      .prepare(
        `SELECT s.* FROM unsubscribe_tokens t
         JOIN subscribers s ON s.id = t.subscriber_id
         WHERE t.token_hash = ? AND t.revoked_at IS NULL AND s.status = 'subscribed'`,
      )
      .get(tokenHash);
    const subscriber = this.mapSubscriber(row);
    return subscriber ? { subscriber } : null;
  }

  unsubscribe(tokenHash, now) {
    const result = this.findSubscribedByUnsubscribeHash(tokenHash);
    if (!result) return false;
    this.db.exec("BEGIN");
    try {
      this.db
        .prepare("UPDATE subscribers SET status = 'unsubscribed', unsubscribed_at = ? WHERE id = ?")
        .run(now, result.subscriber.id);
      this.db
        .prepare("UPDATE unsubscribe_tokens SET revoked_at = ? WHERE subscriber_id = ?")
        .run(now, result.subscriber.id);
      this.db.exec("COMMIT");
    } catch (error) {
      this.db.exec("ROLLBACK");
      throw error;
    }
    return true;
  }

  addUnsubscribeToken(subscriberId, tokenHash, now) {
    this.db
      .prepare(
        "INSERT INTO unsubscribe_tokens (subscriber_id, token_hash, created_at, revoked_at) VALUES (?, ?, ?, NULL)",
      )
      .run(subscriberId, tokenHash, now);
  }

  listCampaigns() {
    const rows = this.db
      .prepare(
        `SELECT c.*,
          (SELECT COUNT(*) FROM deliveries d WHERE d.campaign_id = c.id AND d.status = 'sent') AS sent_count,
          (SELECT COUNT(*) FROM deliveries d WHERE d.campaign_id = c.id AND d.status = 'failed') AS failed_count
         FROM campaigns c
         ORDER BY c.id DESC
         LIMIT 50`,
      )
      .all();
    return rows.map((row) => ({
      ...this.mapCampaign(row),
      sentCount: Number(row.sent_count || 0),
      failedCount: Number(row.failed_count || 0),
    }));
  }

  countSubscribers() {
    const row = this.db
      .prepare("SELECT COUNT(*) AS count FROM subscribers WHERE status = 'subscribed'")
      .get();
    return Number(row?.count || 0);
  }

  createCampaign(campaign, now) {
    const result = this.db
      .prepare(
        `INSERT INTO campaigns
         (subject, title, body, sections_json, cta_label, cta_url, status, created_at, sent_at)
         VALUES (?, ?, ?, ?, ?, ?, 'draft', ?, NULL)`,
      )
      .run(
        campaign.subject,
        campaign.title,
        campaign.body,
        JSON.stringify(campaign.sections || []),
        campaign.ctaLabel || "",
        campaign.ctaUrl || "",
        now,
      );
    return this.getCampaign(Number(result.lastInsertRowid));
  }

  getCampaign(id) {
    return this.mapCampaign(
      this.db.prepare("SELECT * FROM campaigns WHERE id = ?").get(id),
    );
  }

  updateDraft(id, campaign) {
    const result = this.db
      .prepare(
        `UPDATE campaigns
         SET subject = ?, title = ?, body = ?, sections_json = ?, cta_label = ?, cta_url = ?
         WHERE id = ? AND status = 'draft'`,
      )
      .run(
        campaign.subject,
        campaign.title,
        campaign.body,
        JSON.stringify(campaign.sections || []),
        campaign.ctaLabel || "",
        campaign.ctaUrl || "",
        id,
      );
    return result.changes > 0;
  }

  activeSubscribers() {
    return this.db
      .prepare("SELECT * FROM subscribers WHERE status = 'subscribed'")
      .all()
      .map((row) => this.mapSubscriber(row));
  }

  isSubscribed(id) {
    const row = this.db
      .prepare("SELECT 1 FROM subscribers WHERE id = ? AND status = 'subscribed'")
      .get(id);
    return Boolean(row);
  }

  getDelivery(campaignId, email) {
    const row = this.db
      .prepare("SELECT * FROM deliveries WHERE campaign_id = ? AND email = ?")
      .get(campaignId, email);
    if (!row) return undefined;
    return {
      campaignId: Number(row.campaign_id),
      email: row.email,
      status: row.status,
      sentAt: row.sent_at,
    };
  }

  saveDelivery(campaignId, email, status, sentAt = null) {
    this.db
      .prepare(
        `INSERT INTO deliveries (campaign_id, email, status, sent_at)
         VALUES (?, ?, ?, ?)
         ON CONFLICT(campaign_id, email) DO UPDATE SET status = excluded.status, sent_at = excluded.sent_at`,
      )
      .run(campaignId, email, status, sentAt);
  }

  setCampaignStatus(id, status, sentAt = null) {
    this.db
      .prepare("UPDATE campaigns SET status = ?, sent_at = ? WHERE id = ?")
      .run(status, sentAt, id);
  }

  close() {
    try {
      this.db?.close();
    } catch {}
  }
}

class InsightsContentStore {
  constructor(filename) {
    const { legacyJsonPath, sqlitePath } = resolveSqlitePath(filename);
    this.filename = sqlitePath;
    const isNewDb = !fs.existsSync(sqlitePath);
    this.db = new DatabaseSync(sqlitePath);
    this.db.exec(`
      PRAGMA journal_mode = WAL;
      CREATE TABLE IF NOT EXISTS insights_meta (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL
      );
      CREATE TABLE IF NOT EXISTS insights_posts (
        position INTEGER NOT NULL,
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        body TEXT NOT NULL,
        image_url TEXT NOT NULL,
        image_alt TEXT NOT NULL,
        link_url TEXT NOT NULL,
        category TEXT NOT NULL DEFAULT '',
        published_at TEXT NOT NULL DEFAULT ''
      );
      CREATE TABLE IF NOT EXISTS insights_stats (
        post_id TEXT PRIMARY KEY,
        views INTEGER NOT NULL DEFAULT 0,
        clicks INTEGER NOT NULL DEFAULT 0
      );
    `);
    try {
      fs.chmodSync(sqlitePath, 0o600);
    } catch {}

    if (isNewDb && legacyJsonPath !== sqlitePath && fs.existsSync(legacyJsonPath)) {
      const legacy = validateInsightsContent(
        JSON.parse(fs.readFileSync(legacyJsonPath, "utf8")),
      );
      this.update(legacy);
    }
  }

  get() {
    const metaRow = this.db
      .prepare("SELECT value FROM insights_meta WHERE key = 'followUrl'")
      .get();
    const postRows = this.db
      .prepare("SELECT * FROM insights_posts ORDER BY position ASC")
      .all();
    if (!postRows.length) {
      return JSON.parse(JSON.stringify(DEFAULT_INSIGHTS_CONTENT));
    }
    return {
      followUrl: metaRow ? metaRow.value : "",
      posts: postRows.map((row) => ({
        id: row.id,
        title: row.title,
        body: row.body,
        imageUrl: row.image_url,
        imageAlt: row.image_alt,
        linkUrl: row.link_url,
        category: row.category || "",
        publishedAt: row.published_at || "",
      })),
    };
  }

  getStats() {
    const rows = this.db.prepare("SELECT * FROM insights_stats").all();
    const stats = {};
    for (const row of rows) {
      stats[row.post_id] = {
        views: Number(row.views || 0),
        clicks: Number(row.clicks || 0),
      };
    }
    return stats;
  }

  recordEvent(postId, event) {
    const posts = this.get().posts;
    if (!posts.some((post) => post.id === postId)) {
      return false;
    }
    const viewsInc = event === "view" ? 1 : 0;
    const clicksInc = event === "click" ? 1 : 0;
    this.db
      .prepare(
        `INSERT INTO insights_stats (post_id, views, clicks)
         VALUES (?, ?, ?)
         ON CONFLICT(post_id) DO UPDATE SET
           views = views + excluded.views,
           clicks = clicks + excluded.clicks`,
      )
      .run(postId, viewsInc, clicksInc);
    return true;
  }

  update(content) {
    this.db.exec("BEGIN");
    try {
      this.db
        .prepare(
          `INSERT INTO insights_meta (key, value) VALUES ('followUrl', ?)
           ON CONFLICT(key) DO UPDATE SET value = excluded.value`,
        )
        .run(content.followUrl || "");
      this.db.exec("DELETE FROM insights_posts");
      const insertPost = this.db.prepare(
        `INSERT INTO insights_posts
         (position, id, title, body, image_url, image_alt, link_url, category, published_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      );
      content.posts.forEach((post, index) => {
        insertPost.run(
          index,
          post.id,
          post.title,
          post.body,
          post.imageUrl || "",
          post.imageAlt || "",
          post.linkUrl || "",
          post.category || "",
          post.publishedAt || "",
        );
      });
      this.db.exec("COMMIT");
    } catch (error) {
      this.db.exec("ROLLBACK");
      throw error;
    }
  }

  close() {
    try {
      this.db?.close();
    } catch {}
  }
}

function hashNewsletterToken(token) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

function createNewsletterToken() {
  return crypto.randomBytes(32).toString("base64url");
}

function getPublicSiteUrl(environment) {
  const value = environment.PUBLIC_SITE_URL;
  if (!value) {
    throw new SmtpConfigurationError(
      "PUBLIC_SITE_URL is not configured for newsletter links.",
    );
  }
  let url;
  try {
    url = new URL(value);
  } catch {
    throw new SmtpConfigurationError("PUBLIC_SITE_URL must be a valid URL.");
  }
  if (
    !["http:", "https:"].includes(url.protocol) ||
    (environment.NODE_ENV === "production" && url.protocol !== "https:") ||
    url.username ||
    url.password
  ) {
    throw new SmtpConfigurationError(
      "PUBLIC_SITE_URL must be an HTTP or HTTPS origin.",
    );
  }
  return url.origin;
}

function createNewsletterUrl(siteUrl, pathName, token) {
  const url = new URL(pathName, siteUrl);
  url.searchParams.set("token", token);
  return url.toString();
}

function escapeHtml(value) {
  return value.replace(/[&<>"']/g, (character) => {
    const entities = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };
    return entities[character];
  });
}

function validateNewsletterCampaign(body) {
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    throw new HttpError(400, "A newsletter campaign is required.");
  }

  const campaign = {
    subject: getString(body, "subject", { maxLength: 180, required: true }),
    title: getString(body, "title", { maxLength: 160, required: true }),
    body: getString(body, "body", { maxLength: 20000, required: true }),
    ctaLabel: getString(body, "ctaLabel", { maxLength: 80 }),
    ctaUrl: getString(body, "ctaUrl", { maxLength: 2048 }),
    sections: validateNewsletterSections(body.sections),
  };
  if (/[\r\n]/.test(campaign.subject)) {
    throw new HttpError(400, "The email subject must fit on one line.");
  }
  if (campaign.body.length < 20) {
    throw new HttpError(400, "Newsletter content must be at least 20 characters.");
  }
  if (Boolean(campaign.ctaLabel) !== Boolean(campaign.ctaUrl)) {
    throw new HttpError(400, "Provide both the call-to-action label and URL.");
  }
  validateUrl(campaign.ctaUrl, "Call-to-action URL");
  return campaign;
}

function validateInsightsUrl(value, fieldName, allowRelative = false) {
  if (!value) return;
  if (allowRelative && !/^[a-z][a-z\d+.-]*:/i.test(value)) {
    if (
      value.startsWith("//") ||
      value.includes("\\") ||
      value.split("/").includes("..")
    ) {
      throw new HttpError(400, `${fieldName} must be a safe site path or HTTPS URL.`);
    }
    return;
  }
  let url;
  try {
    url = new URL(value);
  } catch {
    throw new HttpError(400, `${fieldName} must be a valid HTTPS URL.`);
  }
  if (url.protocol !== "https:" || url.username || url.password) {
    throw new HttpError(400, `${fieldName} must use a public HTTPS URL.`);
  }
}

function validateInsightsContent(body) {
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    throw new HttpError(400, "Insights content is required.");
  }
  const followUrl = getString(body, "followUrl", { maxLength: 2048 });
  validateInsightsUrl(followUrl, "Follow link");
  if (!Array.isArray(body.posts) || body.posts.length > 8) {
    throw new HttpError(400, "Insights can contain up to 8 posts.");
  }
  const posts = body.posts.map((post, index) => {
    if (!post || typeof post !== "object" || Array.isArray(post)) {
      throw new HttpError(400, `Post ${index + 1} is invalid.`);
    }
    const rawId = getString(post, "id", { maxLength: 64 });
    const safeId = /^[a-z0-9-]{1,64}$/i.test(rawId)
      ? rawId.toLowerCase()
      : crypto.randomUUID().slice(0, 12);
    const category = getString(post, "category", { maxLength: 40 });
    const publishedAt = getString(post, "publishedAt", { maxLength: 20 });
    if (publishedAt && !/^\d{4}-\d{2}-\d{2}$/.test(publishedAt)) {
      throw new HttpError(400, `Post ${index + 1} date must use YYYY-MM-DD format.`);
    }
    const result = {
      id: safeId,
      title: getString(post, "title", { maxLength: 160, required: true }),
      body: getString(post, "body", { maxLength: 3000, required: true }),
      imageUrl: getString(post, "imageUrl", { maxLength: 2048 }),
      imageAlt: getString(post, "imageAlt", { maxLength: 250 }),
      linkUrl: getString(post, "linkUrl", { maxLength: 2048 }),
      category,
      publishedAt,
    };
    validateInsightsUrl(result.imageUrl, `Post ${index + 1} image`, true);
    validateInsightsUrl(result.linkUrl, `Post ${index + 1} link`);
    if (result.imageUrl && !result.imageAlt) {
      throw new HttpError(400, `Post ${index + 1} image needs descriptive alt text.`);
    }
    return result;
  });
  return { followUrl, posts };
}

function validateNewsletterSections(rawSections) {
  if (rawSections === undefined) return [];
  if (!Array.isArray(rawSections) || rawSections.length > 8) {
    throw new HttpError(400, "A newsletter can contain up to 8 content sections.");
  }
  return rawSections.map((rawSection, index) => {
    if (!rawSection || typeof rawSection !== "object" || Array.isArray(rawSection)) {
      throw new HttpError(400, `Newsletter section ${index + 1} is invalid.`);
    }
    const section = {
      heading: getString(rawSection, "heading", { maxLength: 160, required: true }),
      body: getString(rawSection, "body", { maxLength: 5000, required: true }),
      imageUrl: getString(rawSection, "imageUrl", { maxLength: 2048 }),
      imageAlt: getString(rawSection, "imageAlt", { maxLength: 250 }),
    };
    if (Boolean(section.imageUrl) !== Boolean(section.imageAlt)) {
      throw new HttpError(
        400,
        `Provide both an image URL and alternative text for section ${index + 1}.`,
      );
    }
    if (section.imageUrl) {
      validateUrl(section.imageUrl, `Section ${index + 1} image URL`);
      if (!section.imageUrl.startsWith("https://")) {
        throw new HttpError(400, "Newsletter images must use HTTPS URLs.");
      }
    }
    return section;
  });
}

function newsletterHtml(campaign, unsubscribeUrl) {
  const paragraphs = campaign.body
    .split(/\n{2,}/)
    .map(
      (paragraph) =>
        `<p style="margin:0 0 16px">${escapeHtml(paragraph).replace(/\n/g, "<br>")}</p>`,
    )
    .join("");
  const sections = (campaign.sections || [])
    .map((section) => {
      const image = section.imageUrl
        ? `<img src="${escapeHtml(section.imageUrl)}" alt="${escapeHtml(section.imageAlt)}" width="576" style="display:block;width:100%;max-width:576px;height:auto;border-radius:8px;margin:0 0 16px">`
        : "";
      const heading = `<h2 style="margin:24px 0 10px;color:#0b2d53;font-size:21px">${escapeHtml(section.heading)}</h2>`;
      const content = `<p style="margin:0 0 16px;line-height:1.6">${escapeHtml(section.body).replace(/\n/g, "<br>")}</p>`;
      return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:28px 0"><tr><td>${image}${heading}${content}</td></tr></table>`;
    })
    .join("");
  const callToAction = campaign.ctaUrl
    ? `<p style="margin:28px 0"><a href="${escapeHtml(campaign.ctaUrl)}" style="display:inline-block;padding:12px 20px;background:#f26522;color:#0b2d53;text-decoration:none;border-radius:24px;font-weight:bold">${escapeHtml(campaign.ctaLabel)}</a></p>`
    : "";
  return `<!doctype html><html lang="en"><body style="margin:0;padding:0;background:#f7f6f2;color:#25364a;font-family:Arial,sans-serif"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f7f6f2"><tr><td align="center" style="padding:24px 12px"><table role="presentation" width="640" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:640px;background:#fff;border:1px solid #e2ddd3;border-radius:12px"><tr><td style="padding:32px"><p style="margin:0 0 12px;color:#f26522;font-size:12px;font-weight:bold;letter-spacing:2px;text-transform:uppercase">Konsalta Insights</p><h1 style="margin:0 0 24px;color:#0b2d53;font-size:28px;line-height:1.25">${escapeHtml(campaign.title)}</h1>${paragraphs}${sections}${callToAction}<hr style="border:0;border-top:1px solid #e2ddd3;margin:32px 0 16px"><p style="margin:0;font-size:12px;line-height:1.5;color:#667085">You received this because you subscribed to Konsalta Insights. <a href="${escapeHtml(unsubscribeUrl)}" style="color:#0b2d53">Unsubscribe</a>.</p></td></tr></table></td></tr></table></body></html>`;
}

function newsletterText(campaign, unsubscribeUrl) {
  const callToAction = campaign.ctaUrl
    ? `\n\n${campaign.ctaLabel}: ${campaign.ctaUrl}`
    : "";
  const sections = (campaign.sections || [])
    .map(
      (section) =>
        `\n\n${section.heading}\n${section.body}${section.imageUrl ? `\nImage: ${section.imageUrl} (alt text: ${section.imageAlt})` : ""}`,
    )
    .join("");
  return `${campaign.title}\n\n${campaign.body}${sections}${callToAction}\n\nYou received this because you subscribed to Konsalta Insights. Unsubscribe: ${unsubscribeUrl}`;
}

function newsletterFeedbackPage(title, message, success = false) {
  const accent = success ? "#237a52" : "#f26522";
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escapeHtml(title)} | Konsalta Insights</title><style>body{margin:0;padding:24px;background:#f7f6f2;color:#25364a;font:16px/1.6 Arial,sans-serif}.card{max-width:560px;margin:10vh auto;padding:36px;background:#fff;border:1px solid #e2ddd3;border-radius:16px;box-shadow:0 12px 36px #0b2d5314}.brand{color:#f26522;font-size:12px;font-weight:bold;letter-spacing:2px;text-transform:uppercase}h1{color:#0b2d53;line-height:1.2}.mark{width:42px;height:42px;display:grid;place-items:center;border-radius:50%;background:${accent};color:#fff;font-size:24px;font-weight:bold}</style></head><body><main class="card"><p class="brand">Konsalta Insights</p><div class="mark" aria-hidden="true">${success ? "✓" : "!"}</div><h1>${escapeHtml(title)}</h1><p>${escapeHtml(message)}</p></main></body></html>`;
}

function safeEqual(left, right) {
  const leftHash = crypto.createHash("sha256").update(left).digest();
  const rightHash = crypto.createHash("sha256").update(right).digest();
  return crypto.timingSafeEqual(leftHash, rightHash);
}

function requireNewsletterAdmin(environment) {
  return (request, response, next) => {
    const configuredPassword = environment.NEWSLETTER_ADMIN_PASSWORD;
    const expectedUsername = environment.NEWSLETTER_ADMIN_USER;
    if (
      !configuredPassword ||
      configuredPassword.length < 16 ||
      configuredPassword.startsWith("replace-") ||
      !expectedUsername ||
      expectedUsername === "admin"
    ) {
      response.status(503).send("Newsletter administration is not configured.");
      return;
    }
    if (environment.NODE_ENV === "production" && !request.secure) {
      response.status(400).send("Use HTTPS to access newsletter administration.");
      return;
    }

    const authorization = request.get("authorization") || "";
    const match = authorization.match(/^Basic\s+([A-Za-z0-9+/]+=*)$/i);
    if (!match) {
      response.set("WWW-Authenticate", 'Basic realm="Konsalta newsletter"');
      response.status(401).send("Authentication required.");
      return;
    }

    const credentials = Buffer.from(match[1], "base64").toString("utf8");
    const separator = credentials.indexOf(":");
    const username = separator < 0 ? "" : credentials.slice(0, separator);
    const password = separator < 0 ? "" : credentials.slice(separator + 1);
    if (
      !safeEqual(username, expectedUsername) ||
      !safeEqual(password, configuredPassword)
    ) {
      response.set("WWW-Authenticate", 'Basic realm="Konsalta newsletter"');
      response.status(401).send("Authentication required.");
      return;
    }
    if (request.method !== "GET" && request.method !== "HEAD") {
      let siteOrigin;
      try {
        siteOrigin = getPublicSiteUrl(environment);
      } catch {
        response.status(503).send("Newsletter administration is not configured.");
        return;
      }
      if (request.get("origin") !== siteOrigin) {
        response.status(403).send("This request is not allowed.");
        return;
      }
    }
    response.set({
      "Cache-Control": "no-store, no-cache, must-revalidate, private",
      Pragma: "no-cache",
      "X-Frame-Options": "DENY",
      "X-Content-Type-Options": "nosniff",
      "Referrer-Policy": "no-referrer",
      "Content-Security-Policy": "frame-ancestors 'none'; base-uri 'self'; form-action 'self';",
    });
    next();
  };
}

function createApp(options = {}) {
  const environment = options.environment || process.env;
  const deliverEmail = options.sendEmail;
  const database =
    options.newsletterDatabase ||
    new NewsletterStore(
      environment.NEWSLETTER_DB_PATH ||
        path.join(__dirname, "data", "newsletter.json"),
    );
  const insightsContent =
    options.insightsContentStore ||
    new InsightsContentStore(
      environment.INSIGHTS_CONTENT_PATH ||
        path.join(__dirname, "data", "insights-content.json"),
    );

  const requireAdmin = requireNewsletterAdmin(environment);
  let transporter;
  const app = express();

  app.locals.closeStores = () => {
    database?.close?.();
    insightsContent?.close?.();
  };

  app.disable("x-powered-by");
  if (environment.TRUST_PROXY_HOPS) {
    const proxyHops = Number(environment.TRUST_PROXY_HOPS);
    if (!Number.isSafeInteger(proxyHops) || proxyHops < 0) {
      throw new Error("TRUST_PROXY_HOPS must be a non-negative integer.");
    }
    app.set("trust proxy", proxyHops);
  }

  app.use("/api", (request, response, next) => {
    response.set("Cache-Control", "no-store");
    next();
  });
  if (environment.ALLOWED_ORIGIN) {
    app.use(
      "/api",
      cors({
        origin: environment.ALLOWED_ORIGIN,
        methods: ["POST"],
        allowedHeaders: ["Content-Type"],
      }),
    );
  }
  app.use(
    "/api",
    rateLimit({
      windowMs: 15 * 60 * 1000,
      limit: 8,
      skip: (request) =>
        request.path.startsWith("/newsletter/admin") ||
        request.path === "/insights/content",
      standardHeaders: "draft-8",
      legacyHeaders: false,
      message: {
        success: false,
        error: "Too many submissions. Please try again later.",
      },
    }),
  );
  app.use(
    "/api/newsletter/admin",
    rateLimit({
      windowMs: 15 * 60 * 1000,
      limit: 60,
      standardHeaders: "draft-8",
      legacyHeaders: false,
      message: {
        success: false,
        error: "Too many admin requests. Please try again later.",
      },
    }),
  );
  app.use(
    "/api/insights/content",
    rateLimit({
      windowMs: 15 * 60 * 1000,
      limit: 120,
      standardHeaders: "draft-8",
      legacyHeaders: false,
    }),
  );

  async function sendEmail(message) {
    if (deliverEmail) {
      await deliverEmail(message);
      return;
    }

    const config = createSmtpConfig(environment);
    if (!transporter) {
      transporter = nodemailer.createTransport({
        host: config.host,
        port: config.port,
        secure: config.secure,
        auth: { user: config.user, pass: config.password },
        connectionTimeout: 15000,
        greetingTimeout: 10000,
        socketTimeout: 20000,
        tls: { minVersion: "TLSv1.2" },
      });
    }

    await transporter.sendMail({
      from: config.from,
      to: config.to,
      ...message,
    });
  }

  app.post(
    "/api/newsletter/subscribe",
    express.json({ limit: "4kb" }),
    async (request, response) => {
      try {
        const email = getString(request.body || {}, "email", {
          maxLength: MAX_EMAIL_LENGTH,
          required: true,
        }).toLowerCase();
        if (!isEmail(email)) {
          throw new HttpError(400, "Enter a valid email address.");
        }
        if (request.body?.consent !== true) {
          throw new HttpError(400, "Please consent to receive newsletter emails.");
        }

        const existing = database.findSubscriberByEmail(email);
        if (existing?.status === "subscribed") {
          response.json({
            success: true,
            message:
              "Thanks for your interest! If a confirmation is needed, check your inbox; an active subscription is already all set.",
          });
          return;
        }

        const siteUrl = getPublicSiteUrl(environment);
        const token = createNewsletterToken();
        const confirmationUrl = createNewsletterUrl(
          siteUrl,
          "/api/newsletter/confirm",
          token,
        );
        const now = new Date();
        const expiresAt = new Date(now.getTime() + 48 * 60 * 60 * 1000);
        database.addPendingSubscriber(
          email,
          hashNewsletterToken(token),
          expiresAt.toISOString(),
          now.toISOString(),
        );
        await sendEmail({
          to: email,
          subject: "Confirm your Konsalta Insights subscription",
          text: `Please confirm your subscription to Konsalta Insights using this link: ${confirmationUrl}\n\nThis link expires in 48 hours. If you did not request this, you can ignore this email.`,
          html: `<p>Please confirm your subscription to Konsalta Insights:</p><p><a href="${escapeHtml(confirmationUrl)}">Confirm subscription</a></p><p>This link expires in 48 hours. If you did not request this, you can ignore this email.</p>`,
        });
        response.json({
          success: true,
          message:
            "Thanks for your interest! If a confirmation is needed, check your inbox; an active subscription is already all set.",
        });
      } catch (error) {
        if (error instanceof HttpError) {
          response.status(error.status).json({ success: false, error: error.message });
          return;
        }
        if (error instanceof SmtpConfigurationError) {
          response.status(503).json({
            success: false,
            error: "Newsletter email is not configured. Please try again later.",
          });
          return;
        }
        console.error("Newsletter confirmation email delivery failed.");
        response.status(502).json({
          success: false,
          error: "We could not send a confirmation email. Please try again later.",
        });
      }
    },
  );

  app.get("/api/newsletter/confirm", (request, response) => {
    const token = request.query.token;
    if (typeof token !== "string" || !/^[A-Za-z0-9_-]{40,50}$/.test(token)) {
      response.status(400).send("This confirmation link is invalid.");
      return;
    }

    const subscriber = database.findSubscriberByConfirmationHash(
      hashNewsletterToken(token),
    );
    if (!subscriber || subscriber.status !== "pending") {
      response.status(400).send("This confirmation link is invalid or has already been used.");
      return;
    }
    if (Date.parse(subscriber.confirmationExpiresAt) < Date.now()) {
      response.status(410).send("This confirmation link has expired. Please sign up again.");
      return;
    }
    response.type("html").send(
      `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Confirm subscription | Konsalta Insights</title><style>body{margin:0;padding:24px;background:#f7f6f2;color:#25364a;font:16px/1.6 Arial,sans-serif}.card{max-width:560px;margin:10vh auto;padding:36px;background:#fff;border:1px solid #e2ddd3;border-radius:16px}.brand{color:#f26522;font-size:12px;font-weight:bold;letter-spacing:2px;text-transform:uppercase}h1{color:#0b2d53}button{padding:12px 20px;border:0;border-radius:24px;background:#f26522;color:#0b2d53;font-weight:bold;font-size:16px;cursor:pointer}</style></head><body><main class="card"><p class="brand">Konsalta Insights</p><h1>Confirm your subscription</h1><p>Confirm that you want to receive Konsalta Insights by email.</p><form method="post" action="/api/newsletter/confirm"><input type="hidden" name="token" value="${token}"><button type="submit">Confirm subscription</button></form></main></body></html>`,
    );
  });

  app.post(
    "/api/newsletter/confirm",
    express.urlencoded({ extended: false, limit: "2kb" }),
    (request, response) => {
      const token = request.body?.token;
      if (typeof token !== "string" || !/^[A-Za-z0-9_-]{40,50}$/.test(token)) {
        response.status(400).send("This confirmation link is invalid.");
        return;
      }
      const confirmed = database.confirmSubscriber(
        hashNewsletterToken(token),
        new Date().toISOString(),
      );
      if (!confirmed) {
        response.status(400).send("This confirmation link is invalid or has already been used.");
        return;
      }
      if (confirmed === "expired") {
        response.status(410).send("This confirmation link has expired. Please sign up again.");
        return;
      }
      response.type("html").send(
        newsletterFeedbackPage(
          "Subscription confirmed",
          "You are now subscribed to Konsalta Insights. Thank you for joining us.",
          true,
        ),
      );
    },
  );

  app.get("/api/newsletter/unsubscribe/:token", (request, response) => {
    const token = request.params.token;
    if (!/^[A-Za-z0-9_-]{40,50}$/.test(token)) {
      response.status(400).send("This unsubscribe link is invalid.");
      return;
    }
    if (!database.findSubscribedByUnsubscribeHash(hashNewsletterToken(token))) {
      response.status(404).send("This unsubscribe link is invalid or has expired.");
      return;
    }
    response.type("html").send(
      `<!doctype html><html lang="en"><meta charset="utf-8"><title>Unsubscribe</title><body><main><h1>Unsubscribe from Konsalta Insights</h1><p>Confirm that you no longer want to receive newsletter emails.</p><form method="post" action="/api/newsletter/unsubscribe/${token}"><button type="submit">Unsubscribe</button></form></main></body></html>`,
    );
  });

  app.post(
    "/api/newsletter/unsubscribe/:token",
    express.urlencoded({ extended: false, limit: "2kb" }),
    (request, response) => {
      const token = request.params.token;
      if (!/^[A-Za-z0-9_-]{40,50}$/.test(token)) {
        response.status(400).send("This unsubscribe link is invalid.");
        return;
      }
      if (!database.unsubscribe(hashNewsletterToken(token), new Date().toISOString())) {
        response.status(404).send("This unsubscribe link is invalid or has expired.");
        return;
      }
      response.type("html").send(
        "<!doctype html><html lang=\"en\"><meta charset=\"utf-8\"><title>Unsubscribed</title><body><main><h1>You are unsubscribed</h1><p>You will no longer receive Konsalta Insights emails.</p></main></body></html>",
      );
    },
  );

  app.get("/admin", requireAdmin, (request, response) => {
    response.sendFile(path.join(__dirname, "admin.html"));
  });

  app.get("/api/insights/content", (request, response) => {
    response.json(insightsContent.get());
  });

  app.post(
    "/api/insights/posts/:id/track",
    express.json({ limit: "2kb" }),
    (request, response) => {
      const postId = String(request.params.id || "").trim();
      const event = request.body?.event;
      if (!/^[a-z0-9-]{1,64}$/i.test(postId)) {
        response.status(400).json({ success: false, error: "Invalid post identifier." });
        return;
      }
      if (event !== "view" && event !== "click") {
        response.status(400).json({ success: false, error: "Invalid tracking event." });
        return;
      }
      if (!insightsContent.recordEvent(postId, event)) {
        response.status(404).json({ success: false, error: "Post not found." });
        return;
      }
      response.json({ success: true });
    },
  );

  app.get("/api/newsletter/admin/insights/stats", requireAdmin, (request, response) => {
    response.json({ success: true, stats: insightsContent.getStats() });
  });

  app.put(
    "/api/newsletter/admin/insights",
    requireAdmin,
    express.json({ limit: "48kb" }),
    (request, response) => {
      try {
        const content = validateInsightsContent(request.body);
        insightsContent.update(content);
        response.json({ success: true, content: insightsContent.get() });
      } catch (error) {
        if (error instanceof HttpError) {
          response.status(error.status).json({ success: false, error: error.message });
          return;
        }
        throw error;
      }
    },
  );

  app.get(
    "/api/newsletter/admin/campaigns",
    requireAdmin,
    (request, response) => {
      const campaigns = database.listCampaigns();
      const subscriberCount = database.countSubscribers();
      response.json({ success: true, campaigns, subscriberCount });
    },
  );

  app.post(
    "/api/newsletter/admin/preview",
    requireAdmin,
    express.json({ limit: "96kb" }),
    (request, response) => {
      try {
        const campaign = validateNewsletterCampaign(request.body);
        response.json({
          success: true,
          html: newsletterHtml(campaign, "#unsubscribe-preview"),
        });
      } catch (error) {
        if (error instanceof HttpError) {
          response.status(error.status).json({ success: false, error: error.message });
          return;
        }
        throw error;
      }
    },
  );

  app.post(
    "/api/newsletter/admin/campaigns",
    requireAdmin,
    express.json({ limit: "96kb" }),
    (request, response) => {
      try {
        const campaign = validateNewsletterCampaign(request.body);
        const saved = database.createCampaign(campaign, new Date().toISOString());
        response.status(201).json({
          success: true,
          campaign: saved,
        });
      } catch (error) {
        if (error instanceof HttpError) {
          response.status(error.status).json({ success: false, error: error.message });
          return;
        }
        throw error;
      }
    },
  );

  app.put(
    "/api/newsletter/admin/campaigns/:id",
    requireAdmin,
    express.json({ limit: "96kb" }),
    (request, response) => {
      const id = Number(request.params.id);
      if (!Number.isSafeInteger(id) || id < 1) {
        response.status(400).json({ success: false, error: "Invalid campaign ID." });
        return;
      }
      try {
        const campaign = validateNewsletterCampaign(request.body);
        if (!database.updateDraft(id, campaign)) {
          response.status(404).json({
            success: false,
            error: "Draft not found or it can no longer be edited.",
          });
          return;
        }
        response.json({ success: true, campaign: { id, ...campaign, status: "draft" } });
      } catch (error) {
        if (error instanceof HttpError) {
          response.status(error.status).json({ success: false, error: error.message });
          return;
        }
        throw error;
      }
    },
  );

  app.post(
    "/api/newsletter/admin/campaigns/:id/send",
    requireAdmin,
    async (request, response) => {
      const id = Number(request.params.id);
      if (!Number.isSafeInteger(id) || id < 1) {
        response.status(400).json({ success: false, error: "Invalid campaign ID." });
        return;
      }
      let siteUrl;
      try {
        siteUrl = getPublicSiteUrl(environment);
      } catch {
        response.status(503).json({
          success: false,
          error: "Newsletter links are not configured. Please try again later.",
        });
        return;
      }
      const campaign = database.getCampaign(id);
      if (!campaign || campaign.status === "sent") {
        response.status(404).json({ success: false, error: "Sendable campaign not found." });
        return;
      }
      if (campaign.status === "sending") {
        response.status(409).json({
          success: false,
          error: "This campaign is already being sent.",
        });
        return;
      }
      const subscribers = database.activeSubscribers();
      if (subscribers.length === 0) {
        response.status(409).json({
          success: false,
          error: "There are no confirmed subscribers yet.",
        });
        return;
      }

      database.setCampaignStatus(id, "sending");
      let sent = 0;
      let failed = 0;
      for (const subscriber of subscribers) {
        if (!database.isSubscribed(subscriber.id)) continue;
        if (database.getDelivery(id, subscriber.email)?.status === "sent") {
          sent += 1;
          continue;
        }
        const unsubscribeToken = createNewsletterToken();
        const unsubscribeUrl = new URL(
          `/api/newsletter/unsubscribe/${unsubscribeToken}`,
          siteUrl,
        ).toString();
        database.addUnsubscribeToken(
            subscriber.id,
            hashNewsletterToken(unsubscribeToken),
            new Date().toISOString(),
          );
        database.saveDelivery(id, subscriber.email, "sending");
        try {
          await sendEmail({
            to: subscriber.email,
            subject: campaign.subject,
            html: newsletterHtml(campaign, unsubscribeUrl),
            text: newsletterText(campaign, unsubscribeUrl),
            headers: {
              "List-Unsubscribe": `<${unsubscribeUrl}>`,
              "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
            },
          });
          database.saveDelivery(id, subscriber.email, "sent", new Date().toISOString());
          sent += 1;
        } catch {
          database.saveDelivery(id, subscriber.email, "failed");
          failed += 1;
          console.error("Newsletter email delivery failed.");
        }
      }

      const status = failed > 0 ? "partial" : "sent";
      database.setCampaignStatus(
        id,
        status,
        status === "sent" ? new Date().toISOString() : null,
      );
      response.json({ success: failed === 0, status, sent, failed });
    },
  );

  app.post("/api/contact", express.json({ limit: "16kb" }), async (request, response) => {
    try {
      const enquiry = validateContact(request.body);
      await sendEmail({
        replyTo: enquiry.email,
        subject: "Konsalta website contact enquiry",
        text: formatContactMessage(enquiry),
      });
      response.json({ success: true });
    } catch (error) {
      if (error instanceof HttpError) {
        response.status(error.status).json({ success: false, error: error.message });
        return;
      }
      if (error instanceof SmtpConfigurationError) {
        console.error("Contact email service is not configured:", error.message);
        response.status(503).json({
          success: false,
          error: "The email service is not configured. Please contact Konsalta directly.",
        });
        return;
      }
      console.error("Contact email delivery failed:", error.message);
      response.status(502).json({
        success: false,
        error: "We could not send your enquiry. Please try again later or contact Konsalta directly.",
      });
    }
  });

  const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
      fileSize: MAX_FILE_SIZE,
      files: 4,
      fields: 60,
      fieldSize: 12 * 1024,
      fieldNameSize: 100,
      headerPairs: 100,
    },
    fileFilter(request, file, callback) {
      const extension = path.extname(file.originalname).toLowerCase();
      if (!allowedDocuments.has(extension)) {
        callback(new HttpError(400, "Only PDF, DOC, and DOCX documents are accepted."));
        return;
      }
      callback(null, true);
    },
  });

  app.post(
    "/api/consultant-onboarding",
    upload.fields([
      { name: "cv", maxCount: 1 },
      { name: "writingSample", maxCount: 1 },
      { name: "sampleReport", maxCount: 1 },
      { name: "references", maxCount: 1 },
    ]),
    async (request, response) => {
      try {
        const { application, documents } = validateConsultant(
          request.body || {},
          request.files,
        );
        await sendEmail({
          replyTo: application.email,
          subject: "Konsalta consultant network application",
          text: formatConsultantMessage(application, documents),
          attachments: documents,
        });
        response.json({ success: true });
      } catch (error) {
        if (error instanceof HttpError) {
          response.status(error.status).json({ success: false, error: error.message });
          return;
        }
        if (error instanceof SmtpConfigurationError) {
          console.error("Consultant email service is not configured:", error.message);
          response.status(503).json({
            success: false,
            error: "The email service is not configured. Please contact Konsalta directly.",
          });
          return;
        }
        console.error("Consultant application email delivery failed:", error.message);
        response.status(502).json({
          success: false,
          error: "We could not submit your application. Please try again later or contact Konsalta directly.",
        });
      }
    },
  );

  app.use("/api", (request, response) => {
    response.status(404).json({ success: false, error: "API endpoint not found." });
  });

  app.get("/", (request, response) => {
    response.sendFile(path.join(SITE_ROOT, "index.html"));
  });
  app.use(express.static(SITE_ROOT, { dotfiles: "ignore", index: false }));

  app.use((error, request, response, next) => {
    if (!request.path.startsWith("/api/")) {
      next(error);
      return;
    }
    if (response.headersSent) {
      next(error);
      return;
    }

    if (error instanceof multer.MulterError) {
      const status = error.code === "LIMIT_FILE_SIZE" ? 413 : 400;
      const message =
        error.code === "LIMIT_FILE_SIZE"
          ? "Each document must be no larger than 5 MB."
          : "The uploaded documents or form fields exceed the allowed limits.";
      response.status(status).json({ success: false, error: message });
      return;
    }
    if (error instanceof HttpError) {
      response.status(error.status).json({ success: false, error: error.message });
      return;
    }
    if (error.status === 400 && error.type === "entity.parse.failed") {
      response.status(400).json({ success: false, error: "The request body is not valid JSON." });
      return;
    }
    console.error("API request failed:", error.message);
    response.status(500).json({
      success: false,
      error: "The request could not be processed. Please try again later.",
    });
  });

  return app;
}

const app = createApp();

if (require.main === module) {
  const port = Number(process.env.PORT || 3000);
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error("PORT must be a valid port number.");
  }
  app.listen(port, () => {
    console.log(`Konsalta website and API listening on port ${port}.`);
    if (!process.env.SMTP_PASSWORD) {
      console.warn("SMTP_PASSWORD is not configured; form emails will be unavailable.");
    }
  });
}

module.exports = { app, createApp };
