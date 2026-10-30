# We ended up removing a lot of stuff, that we think are nice, but were rejected

- anyway to build the css, run `npm run build:css`

# Konsalta Contact Form API

Contact form submissions are handled by this API and sent via SMTP to the Konsalta inbox.

**Webmail vs SMTP:** Webmail provides the interface for reading emails. SMTP (mail.konsaltahub.org) handles sending emails - this is what the API uses. Both services run on the same mail server and work independently.

**Single Deployment:** The Express server serves both the static website files (HTML, CSS, JS) AND handles the email API endpoint. Everything deploys together as one Node.js application:

```
server.js handles:
├── GET /* → serves HTML, CSS, JS, images (static files)
└── POST /api/contact → sends email via SMTP
```

## Setup

1. **Install dependencies:**
   ```bash
   cd api
   npm install
   ```

2. **Configure environment variables:**
   The `.env` file contains the cPanel email settings:
   - SMTP Host: mail.konsaltahub.org
   - SMTP Port: 465 (SSL)
   - Username: no-reply@konsaltahub.org
   - Reply-to: engage@konsaltahub.org

3. **Run the server locally:**
   ```bash
   npm start
   ```
   Navigate to http://localhost:3000/contactUs.html

## Production Deployment (Single App)

### Option 1: Deploy to cPanel (Recommended - Same Server as Email)

When email is hosted on cPanel, deploying the Node.js app on the same server works best:

1. **Access cPanel** and go to "Setup Node.js App"

2. **Create a new application:**
   - Node.js version: 18.x or higher
   - Application mode: Production
   - Application root: `/home/youruser/konsalta/api`
   - Application URL: choose a subdomain or path (e.g., `api.konsaltahub.org` or `/api`)
   - Application startup file: `server.js`

3. **Upload files** to the application root directory

4. **Set environment variables** in cPanel's Node.js app settings:
   ```
   SMTP_HOST=mail.konsaltahub.org
   SMTP_PORT=465
   SMTP_SECURE=true
   SMTP_USER=no-reply@konsaltahub.org
   SMTP_PASSWORD=GEqotEi73C!U15
   REPLY_TO=engage@konsaltahub.org
   NODE_ENV=production
   ```

5. **Install dependencies** via cPanel terminal or the "Run NPM Install" button

### Option 2: Deploy to Vercel/Netlify with Serverless Functions

Platforms like Vercel or Netlify require adapting the code to serverless functions:

**Vercel example:**

1. Create `vercel.json` in the root:
   ```json
   {
     "version": 2,
     "functions": {
       "api/**/*.js": {
         "runtime": "@vercel/node"
       }
     }
   }
   ```

2. Set environment variables in the Vercel dashboard

**Note:** Some serverless platforms block SMTP ports. A transactional email service like SendGrid, Mailgun, or AWS SES provides better deliverability on these platforms.

### Option 3: Use a Transactional Email Service

For better deliverability and easier serverless deployment:

1. **SendGrid:**
   - Free tier: 100 emails/day
   - Easy integration
   - Good deliverability

2. **Mailgun:**
   - Free tier: 5,000 emails/month for 3 months
   - Then pay-as-you-go

3. **Resend:**
   - Free tier: 3,000 emails/month
   - Modern API, easy setup

## Testing

1. Start the server locally
2. Navigate to http://localhost:3000/contactUs.html
3. Fill out and submit the form
4. Check the engage@konsaltahub.org inbox for the message

## Security Notes

- The `.env` file contains sensitive credentials - **never commit to version control**
- The `.gitignore` file excludes `.env` from git
- In production, always use environment variables
- Consider adding rate limiting for the contact endpoint to prevent abuse
- Form inputs are validated on both client and server side

## Troubleshooting

**Email not sending?**
- Check SMTP credentials in `.env`
- Verify the email password is correct
- Some hosting providers block outbound SMTP - contact the host for assistance
- Check server logs for detailed error messages

**CORS errors?**
- Ensure the frontend loads from the same origin, or update the CORS settings in `server.js`

## Form Fields

The contact form collects:
- **name** (required): Full name
- **email** (required): Email address
- **company** (optional): Organization name
- **projectType** (required): Type of service needed
- **message** (required): The enquiry message
