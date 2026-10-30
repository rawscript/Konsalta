# We ended up removing a lot of stuff, that we think are nice, but were rejected


# Konsalta Website

A professional consulting website with integrated contact and consultant onboarding forms.

## Overview

This application serves the Konsalta website and handles form submissions via email. The Express.js server serves static files and processes contact form and consultant onboarding submissions through SMTP.

**Architecture:**
```
server.js handles:
├── Static files (HTML, CSS, JS, images)
├── POST /api/contact → Contact form submissions
└── POST /api/contact → Consultant onboarding submissions
```

## Quick Start

### Prerequisites
- Node.js 18.x or higher
- SMTP email server credentials

### Installation

1. Install root dependencies:
```bash
npm install
```

2. Install API dependencies:
```bash
cd api
npm install
```

3. Configure environment variables:

Create `api/.env` file with the following configuration:
```env
SMTP_HOST=mail.konsaltahub.org
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=no-reply@konsaltahub.org
SMTP_PASSWORD=your_password_here
REPLY_TO=engage@konsaltahub.org
PORT=3000
NODE_ENV=development
```

4. Start the application:
```bash
cd api
npm start
```

The application will be available at `http://localhost:3000`

## Building Styles

To compile SCSS to CSS:
```bash
npm run build:css
```

To watch for changes during development:
```bash
npm run watch:css
```

## Deployment

### Environment Variables Required

Set the following environment variables in production:

| Variable | Description | Example |
|----------|-------------|---------|
| SMTP_HOST | SMTP server hostname | mail.konsaltahub.org |
| SMTP_PORT | SMTP server port | 465 |
| SMTP_SECURE | Use SSL/TLS | true |
| SMTP_USER | SMTP authentication username | no-reply@konsaltahub.org |
| SMTP_PASSWORD | SMTP authentication password | (secure password) |
| REPLY_TO | Reply-to email address | engage@konsaltahub.org |
| PORT | Application port | 3000 |
| NODE_ENV | Environment | production |

### Deployment Options

#### Option 1: cPanel Node.js Application

1. Access cPanel and navigate to "Setup Node.js App"
2. Configure application:
   - Node.js version: 18.x or higher
   - Application mode: Production
   - Application root: Path to `api` directory
   - Application startup file: `server.js`
3. Upload application files to the configured directory
4. Set environment variables in the Node.js app interface
5. Install dependencies using "Run NPM Install" or terminal
6. Start the application

#### Option 2: Standard VPS/Server

1. Upload files to server
2. Set environment variables in `.env` file or system environment
3. Install dependencies: `npm install`
4. Start with process manager (PM2 recommended):
```bash
npm install -g pm2
pm2 start server.js --name konsalta
pm2 save
pm2 startup
```

#### Option 3: Docker

Create `Dockerfile` in the api directory:
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
EXPOSE 3000
CMD ["node", "server.js"]
```

Build and run:
```bash
docker build -t konsalta .
docker run -p 3000:3000 --env-file .env konsalta
```

## Application Structure

```
├── api/
│   ├── .env              # Environment configuration (not in git)
│   ├── server.js         # Express server and email handler
│   ├── package.json      # API dependencies
│   └── README.md         # API documentation
├── styles/               # CSS and SCSS files
│   ├── style.scss        # Main stylesheet source
│   └── *.css             # Compiled and component styles
├── scripts/              # JavaScript files
│   ├── contact.js        # Contact form handler
│   ├── consultant-onboarding.js  # Onboarding form handler
│   └── *.js              # Other page scripts
├── public/               # Images and static assets
├── *.html                # Website pages
├── package.json          # Root dependencies (SCSS build)
└── README.md             # This file
```

## Form Submissions

### Contact Form
**Endpoint:** `POST /api/contact`

Fields:
- name (required)
- email (required)
- company (optional)
- projectType (required)
- message (required)

### Consultant Onboarding
**Endpoint:** `POST /api/contact` with `type: "consultant-onboarding"`

Comprehensive consultant application with personal information, professional background, expertise, skills, and geographic experience.

## Security Considerations

- Environment variables must be configured securely
- `.env` file is excluded from version control
- Server-side validation on all form inputs
- CORS configured for same-origin requests
- SMTP credentials transmitted securely
- Rate limiting recommended for production

## Troubleshooting

### Email Not Sending
- Verify SMTP credentials in environment variables
- Check SMTP server is accessible from deployment server
- Review server logs for detailed error messages
- Confirm SMTP port is not blocked by firewall

### Application Not Starting
- Verify Node.js version (18.x or higher required)
- Check all dependencies are installed
- Confirm environment variables are set
- Review console output for error messages

### Static Files Not Loading
- Verify file paths are correct
- Check server is serving from correct directory
- Confirm all files are uploaded to server
- Review server console for 404 errors

## Support

For deployment assistance or technical issues, refer to the server logs and error messages for detailed information.
