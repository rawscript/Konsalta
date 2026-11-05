# Konsalta Website and Form API

The Express application serves the static site and delivers contact enquiries and
consultant applications by SMTP. Run it from the `api` directory:

```powershell
npm install
npm start
```

Open `http://localhost:3000/`. Do not open the HTML files directly with `file://`
or use a separate static server; the forms submit to this same origin.

## Configuration

Copy `.env.example` to `.env` and set `SMTP_PASSWORD` to the current mailbox
password. Keep `.env` private and never commit it. The server defaults to
`mail.konsaltahub.org` on port `465` with TLS, sends from
`no-reply@konsaltahub.org`, and delivers to `engage@konsaltahub.org`.

| Variable | Purpose |
| --- | --- |
| `PORT` | HTTP port; defaults to `3000`. |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE` | SMTP connection settings. |
| `SMTP_USER`, `SMTP_PASSWORD` | SMTP authentication. The password is required and must be set outside source control. |
| `SMTP_FROM` | Optional authenticated sender address; defaults to `SMTP_USER`. |
| `CONTACT_TO` | Destination inbox; defaults to `REPLY_TO`, then `engage@konsaltahub.org`. |
| `REPLY_TO` | Default destination inbox when `CONTACT_TO` is not set. |
| `ALLOWED_ORIGIN` | Optional exact origin allowed for cross-origin API calls. Same-origin deployment needs no CORS setting. |
| `TRUST_PROXY_HOPS` | Number of trusted reverse proxies in front of the app. Set only to the actual count when deployed behind a proxy. |

The SMTP password included in earlier setup notes should be considered exposed.
Rotate it with the mail provider and use only the replacement in the environment.

## Endpoints

- `POST /api/contact` accepts JSON fields `name`, `email`, `company`,
  `projectType`, and `message`.
- `POST /api/consultant-onboarding` accepts the onboarding form as
  `multipart/form-data`, including the required CV and optional writing sample,
  sample report, and references.

Form submissions are validated server-side and limited to eight requests per
client IP per 15 minutes. Consultant documents must be PDF, DOC, or DOCX and no
larger than 5 MB each. Attachments are held in memory only while the email is
sent; they are not saved to disk.

Both endpoints return JSON with `success: true` only after SMTP reports a
successful send. SMTP failures are logged on the server and returned as an
error response; SMTP credentials and submitted form contents are not logged.

## Deployment

Deploy the website files and the `api` directory together. Configure the Node.js
application root as `.../konsalta/api`, set `server.js` as the startup file, add
the SMTP environment variables in the hosting control panel, and install
dependencies there. The server resolves and serves the site from the parent
directory of `api`.

If a hosting proxy is in front of Node, set `TRUST_PROXY_HOPS` to the exact
trusted proxy count so rate limiting sees the client address. Avoid enabling
trust for arbitrary proxy headers.

This application uses direct SMTP and therefore requires the host to allow
outbound connections to the configured SMTP port.
