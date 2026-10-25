require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from parent directory
app.use(express.static(path.join(__dirname, '..')));

// Email transporter configuration
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD
    }
  });
};

// Contact form endpoint
app.post('/api/contact', async (req, res) => {
  const { name, email, company, projectType, message } = req.body;

  // Validate required fields
  if (!name || !email || !projectType || !message) {
    return res.status(400).json({
      success: false,
      error: 'Please fill in all required fields.'
    });
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      success: false,
      error: 'Please provide a valid email address.'
    });
  }

  try {
    const transporter = createTransporter();

    // Project type labels
    const projectTypes = {
      'research': 'Research & Evaluation',
      'strategy': 'Strategy & Advisory',
      'market-intelligence': 'Market Intelligence',
      'policy': 'Policy & Systems',
      'other': 'Other'
    };

    // Email to Konsalta team
    const mailOptions = {
      from: `"Konsalta Contact Form" <${process.env.SMTP_USER}>`,
      replyTo: email,
      to: process.env.REPLY_TO,
      subject: `New Enquiry from ${name} - ${projectTypes[projectType] || projectType}`,
      text: `
New Contact Form Submission
===========================

Name: ${name}
Email: ${email}
Company: ${company || 'Not provided'}
Project Type: ${projectTypes[projectType] || projectType}

Message:
${message}

---
Sent from the Konsalta website contact form.
      `,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
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
                <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb;">${company || 'Not provided'}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; font-weight: bold;">Project Type:</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb;">${projectTypes[projectType] || projectType}</td>
              </tr>
            </table>
            
            <h3 style="color: #1e3a8a; margin-top: 20px;">Message:</h3>
            <div style="background-color: #f9f9f9; padding: 15px; border-radius: 4px; white-space: pre-wrap;">${message}</div>
            
            <p style="margin-top: 20px; font-size: 12px; color: #6b7280;">
              Sent from the Konsalta website contact form on ${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}.
            </p>
          </div>
        </div>
      `
    };

    // Send email
    await transporter.sendMail(mailOptions);

    res.json({
      success: true,
      message: 'Your enquiry has been sent successfully. We will get back to you soon!'
    });

  } catch (error) {
    console.error('Email sending error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to send your message. Please try again later or email us directly at engage@konsaltahub.org'
    });
  }
});

// Serve contact page
app.get('/contactUs.html', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'contactUs.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`Konsalta contact server running on port ${PORT}`);
  console.log(`Visit http://localhost:${PORT}/contactUs.html to test the contact form`);
});
