"use strict";

const path = require("node:path");
const express = require("express");
const cors = require("cors");
const multer = require("multer");
const nodemailer = require("nodemailer");
const { rateLimit } = require("express-rate-limit");

require("dotenv").config({ path: path.join(__dirname, ".env") });

const SITE_ROOT = path.resolve(__dirname, "..");
const MAX_FILE_SIZE = 5 * 1024 * 1024;
const MAX_EMAIL_LENGTH = 254;
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

function createApp(options = {}) {
  const environment = options.environment || process.env;
  const deliverEmail = options.sendEmail;
  let transporter;
  const app = express();

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
      standardHeaders: "draft-8",
      legacyHeaders: false,
      message: {
        success: false,
        error: "Too many submissions. Please try again later.",
      },
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
