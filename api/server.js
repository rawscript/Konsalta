require("dotenv").config();
const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from parent directory
app.use(express.static(path.join(__dirname, "..")));

// Email transporter configuration
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  });
};

// Consultant onboarding handler
const handleConsultantOnboarding = async (req, res) => {
  const {
    fullName,
    email,
    phone,
    country,
    nationality,
    linkedin,
    website,
    currentPosition,
    currentOrg,
    yearsExperience,
    bio,
    expertise,
    otherExpertise,
    skills,
    otherSkills,
    countriesWorked,
    regions,
    languages,
  } = req.body;

  // Validate required fields
  if (!fullName || !email || !phone || !country || !currentPosition || !currentOrg || !yearsExperience || !bio) {
    return res.status(400).json({
      success: false,
      error: "Please fill in all required fields.",
    });
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      success: false,
      error: "Please provide a valid email address.",
    });
  }

  try {
    const transporter = createTransporter();

    // Format expertise and skills
    const expertiseList = expertise && expertise.length > 0 
      ? expertise.join(", ") + (otherExpertise ? `, ${otherExpertise}` : "")
      : otherExpertise || "Not specified";

    const skillsList = skills && skills.length > 0 
      ? skills.join(", ") + (otherSkills ? `, ${otherSkills}` : "")
      : otherSkills || "Not specified";

    const regionsList = regions && regions.length > 0 
      ? regions.join(", ") 
      : "Not specified";

    // Format languages
    const languagesList = [];
    if (languages) {
      if (languages.english) languagesList.push(`English (${languages.english})`);
      if (languages.french) languagesList.push(`French (${languages.french})`);
      if (languages.portuguese) languagesList.push(`Portuguese (${languages.portuguese})`);
      if (languages.arabic) languagesList.push(`Arabic (${languages.arabic})`);
      if (languages.swahili) languagesList.push(`Swahili (${languages.swahili})`);
    }
    const languagesText = languagesList.length > 0 ? languagesList.join(", ") : "Not specified";

    // Email to Konsalta team
    const mailOptions = {
      from: `"Konsalta Consultant Network" <${process.env.SMTP_USER}>`,
      replyTo: email,
      to: `${process.env.REPLY_TO}, ${process.env.SMTP_USER}`,
      subject: `New Consultant Application: ${fullName}`,
      text: `
New Consultant Onboarding Application
======================================

PERSONAL INFORMATION
-------------------
Name: ${fullName}
Email: ${email}
Phone: ${phone}
Country: ${country}
Nationality: ${nationality || "Not provided"}
LinkedIn: ${linkedin || "Not provided"}
Website: ${website || "Not provided"}

PROFESSIONAL BACKGROUND
----------------------
Current Position: ${currentPosition}
Current Organization: ${currentOrg}
Years of Experience: ${yearsExperience}

Professional Bio:
${bio}

EXPERTISE & SKILLS
-----------------
Areas of Expertise: ${expertiseList}
Technical Skills: ${skillsList}

GEOGRAPHIC EXPERIENCE & LANGUAGES
--------------------------------
Countries Worked: ${countriesWorked || "Not specified"}
Regions: ${regionsList}
Languages: ${languagesText}

---
Submitted on ${new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
      `,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 700px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
          <div style="background-color: #ffffff; padding: 30px; border-radius: 8px; border-left: 4px solid #f26522;">
            <h2 style="color: #0b2d53; margin-top: 0;">New Consultant Application</h2>
            
            <h3 style="color: #0b2d53; border-bottom: 2px solid #f26522; padding-bottom: 8px;">Personal Information</h3>
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
              <tr>
                <td style="padding: 8px 0; font-weight: bold; width: 180px;">Name:</td>
                <td style="padding: 8px 0;">${fullName}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold;">Email:</td>
                <td style="padding: 8px 0;"><a href="mailto:${email}" style="color: #2563eb;">${email}</a></td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold;">Phone:</td>
                <td style="padding: 8px 0;">${phone}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold;">Country:</td>
                <td style="padding: 8px 0;">${country}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold;">Nationality:</td>
                <td style="padding: 8px 0;">${nationality || "Not provided"}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold;">LinkedIn:</td>
                <td style="padding: 8px 0;">${linkedin ? `<a href="${linkedin}" style="color: #2563eb;">${linkedin}</a>` : "Not provided"}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold;">Website:</td>
                <td style="padding: 8px 0;">${website ? `<a href="${website}" style="color: #2563eb;">${website}</a>` : "Not provided"}</td>
              </tr>
            </table>
            
            <h3 style="color: #0b2d53; border-bottom: 2px solid #f26522; padding-bottom: 8px;">Professional Background</h3>
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
              <tr>
                <td style="padding: 8px 0; font-weight: bold; width: 180px;">Current Position:</td>
                <td style="padding: 8px 0;">${currentPosition}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold;">Organization:</td>
                <td style="padding: 8px 0;">${currentOrg}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold;">Years of Experience:</td>
                <td style="padding: 8px 0;">${yearsExperience}</td>
              </tr>
            </table>
            
            <h4 style="color: #0b2d53; margin-bottom: 10px;">Professional Bio:</h4>
            <div style="background-color: #f9f9f9; padding: 15px; border-radius: 4px; white-space: pre-wrap; margin-bottom: 20px;">${bio}</div>
            
            <h3 style="color: #0b2d53; border-bottom: 2px solid #f26522; padding-bottom: 8px;">Expertise & Skills</h3>
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
              <tr>
                <td style="padding: 8px 0; font-weight: bold; width: 180px; vertical-align: top;">Areas of Expertise:</td>
                <td style="padding: 8px 0;">${expertiseList}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold; vertical-align: top;">Technical Skills:</td>
                <td style="padding: 8px 0;">${skillsList}</td>
              </tr>
            </table>
            
            <h3 style="color: #0b2d53; border-bottom: 2px solid #f26522; padding-bottom: 8px;">Geographic Experience & Languages</h3>
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
              <tr>
                <td style="padding: 8px 0; font-weight: bold; width: 180px; vertical-align: top;">Countries Worked:</td>
                <td style="padding: 8px 0;">${countriesWorked || "Not specified"}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold; vertical-align: top;">Regions:</td>
                <td style="padding: 8px 0;">${regionsList}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold; vertical-align: top;">Languages:</td>
                <td style="padding: 8px 0;">${languagesText}</td>
              </tr>
            </table>
            
            <p style="margin-top: 20px; font-size: 12px; color: #6b7280;">
              Application submitted on ${new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}.
            </p>
          </div>
        </div>
      `,
    };

    // Send email
    await transporter.sendMail(mailOptions);

    res.json({
      success: true,
      message: "Your application has been submitted successfully!",
    });
  } catch (error) {
    console.error("Consultant onboarding email error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to submit your application. Please try again later or email us directly at engage@konsaltahub.org",
    });
  }
};

// Contact form endpoint
app.post("/api/contact", async (req, res) => {
  const { name, email, company, projectType, message, type } = req.body;

  // Handle consultant onboarding submissions
  if (type === "consultant-onboarding") {
    return handleConsultantOnboarding(req, res);
  }

  // Validate required fields for regular contact form
  if (!name || !email || !projectType || !message) {
    return res.status(400).json({
      success: false,
      error: "Please fill in all required fields.",
    });
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      success: false,
      error: "Please provide a valid email address.",
    });
  }

  try {
    const transporter = createTransporter();

    // Project type labels
    const projectTypes = {
      research: "Research & Evaluation",
      strategy: "Strategy & Advisory",
      "market-intelligence": "Market Intelligence",
      policy: "Policy & Systems",
      other: "Other",
    };

    // Email to Konsalta team (sends to both engage and no-reply mailboxes)
    const mailOptions = {
      from: `"Konsalta Contact Form" <${process.env.SMTP_USER}>`,
      replyTo: email,
      to: `${process.env.REPLY_TO}, ${process.env.SMTP_USER}`,
      subject: `New Enquiry from ${name} - ${projectTypes[projectType] || projectType}`,
      text: `
New Contact Form Submission
===========================

Name: ${name}
Email: ${email}
Company: ${company || "Not provided"}
Project Type: ${projectTypes[projectType] || projectType}

Message:
${message}

---
Sent from the Konsalta website contact form.
      `,
      html: `
        <div style=": Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
          <div style="background-color: #ffffff; padding: 30px; border-radius: 8px; border-left: 4px solid #2563eb;">
            <h2 style="color: #1e3a8a; margin-top: 0;">New Contact Form Submission</h2>
            
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; font-weight: bold; width: 120px;">Name:</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb;">${name}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; font-weight: bold;">Email:</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb;">
                  <a href="mailto:${email}" style="color: #2563eb;">${email}</a>
                </td>
              </tr>
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; font-weight: bold;">Company:</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb;">${company || "Not provided"}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; font-weight: bold;">Project Type:</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb;">${projectTypes[projectType] || projectType}</td>
              </tr>
            </table>
            
            <h3 style="color: #1e3a8a; margin-top: 20px;">Message:</h3>
            <div style="background-color: #f9f9f9; padding: 15px; border-radius: 4px; white-space: pre-wrap;">${message}</div>
            
            <p style="margin-top: 20px; font-size: 12px; color: #6b7280;">
              Sent from the Konsalta website contact form on ${new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}.
            </p>
          </div>
        </div>
      `,
    };

    // Send email
    await transporter.sendMail(mailOptions);

    res.json({
      success: true,
      message:
        "Your enquiry has been sent successfully. We will get back to you soon!",
    });
  } catch (error) {
    console.error("Email sending error:", error);
    res.status(500).json({
      success: false,
      error:
        "Failed to send your message. Please try again later or email us directly at engage@konsaltahub.org",
    });
  }
});

// Serve contact page
app.get("/contactUs.html", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "contactUs.html"));
});

// Serve consultant onboarding page
app.get("/consultant-onboarding.html", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "consultant-onboarding.html"));
});

// Start server
app.listen(PORT, () => {
  console.log(`Konsalta contact server running on port ${PORT}`);
  console.log(
    `Visit http://localhost:${PORT}/contactUs.html to test the contact form`,
  );
});
