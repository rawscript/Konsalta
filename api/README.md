# Konsalta Website and Form API

The Express application serves the static site and delivers contact enquiries,
consultant applications, and newsletter emails by SMTP. Run it from the `api`
directory:

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
| `PUBLIC_SITE_URL` | Public site origin used for newsletter confirmation and unsubscribe links. Use the canonical HTTPS origin. |
| `NEWSLETTER_ADMIN_USER`, `NEWSLETTER_ADMIN_PASSWORD` | Credentials for the password-protected admin page. Use a private username, a unique password of at least 16 characters, and HTTPS. |
| `NEWSLETTER_DB_PATH` | Newsletter data file. Defaults to `api/data/newsletter.json`; keep it on persistent storage and do not expose it through a separate static host. |
| `INSIGHTS_CONTENT_PATH` | Insights page content file. Defaults to `api/data/insights-content.json`; keep it on persistent storage with the newsletter data. |

SMTP credentials must be stored as deployment secrets and never committed to
source control. Rotate credentials that have appeared in source files or shared
setup notes.

## Endpoints

- `POST /api/contact` accepts JSON fields `name`, `email`, `company`,
  `projectType`, and `message`.
- `POST /api/consultant-onboarding` accepts the onboarding form as
  `multipart/form-data`, including the required CV and optional writing sample,
  sample report, and references.
- `POST /api/newsletter/subscribe` stores consent and sends a double-opt-in
  confirmation email. Subscribers are not mailed until they confirm.
- `GET /api/newsletter/confirm?token=...` displays a confirmation action;
  `POST /api/newsletter/confirm` activates the subscription after the user
  presses the confirmation button.
- `GET` and `POST /api/newsletter/unsubscribe/:token` provide a confirmation
  page and one-click unsubscribe endpoint.
- `/admin` is the password-protected site admin page. It includes the campaign
  editor: save and preview drafts, then send them to confirmed subscribers.
  Each person receives an individual email; failed deliveries can be retried
  without resending messages already marked as delivered.
- `GET /api/insights/content` serves the published Insights cards. The admin
  page updates them through the protected
  `PUT /api/newsletter/admin/insights` endpoint.

Form submissions are validated server-side and limited to eight requests per
client IP per 15 minutes. Consultant documents must be PDF, DOC, or DOCX and no
larger than 5 MB each. Attachments are held in memory only while the email is
sent; they are not saved to disk.

Form submissions return `success: true` only after SMTP reports a successful
send. SMTP failures are logged on the server and returned as an error response;
SMTP credentials and submitted form contents are not logged.

The newsletter stores email addresses and consent timestamps in a local JSON
data file, written atomically with restrictive file permissions. The Express
server reserves `/api` and does not expose files stored there as static content.
This is intended for an early, small subscriber list and a single Node.js
process. The file must survive application restarts and deployments; configure
a persistent path if the host's default application directory is ephemeral.
Do not run multiple API instances sharing this file. For a larger audience or
multiple instances, move the store to a shared database.
Direct SMTP is suitable for a small early audience, but check the mailbox
provider's daily and hourly sending limits before sending a campaign. For larger
lists, use a dedicated bulk-mail provider and verify the sender domain's SPF,
DKIM, and DMARC records. Newsletter campaigns are written and sent manually in
the admin editor; delivery is not scheduled or generated automatically.

## VPS setup (Ubuntu)

This example runs the Node app on localhost behind Nginx with HTTPS. Replace
`YOUR_DOMAIN` and repository paths with your actual values. Keep the application
and data directory persistent; do not put `.env` or the newsletter data file in
the public static directory.

### 1. Point DNS at the VPS

Create DNS `A` records for your domain (and `www` only if you intend to use it)
pointing to the VPS IPv4 address. Add an `AAAA` record only if IPv6 is configured
and reachable. Allow DNS time to propagate.

### 2. Install system packages and Node.js

SSH to the VPS as an administrator with `sudo` access:

```sh
sudo apt update
sudo apt install -y ca-certificates curl git nginx certbot python3-certbot-nginx ufw
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt install -y nodejs
node --version
npm --version
```

Use Node.js 18 or newer (Node 22 LTS is recommended). The app needs outbound
network access to your SMTP server.

### 3. Create a service account and deploy the files

Clone the repository to a stable location, then install the API dependencies:

```sh
sudo adduser --system --group --home /var/lib/konsalta konsalta
sudo git clone YOUR_REPOSITORY_URL /opt/konsalta
sudo chown -R konsalta:konsalta /opt/konsalta
sudo -u konsalta npm ci --omit=dev --prefix /opt/konsalta/api
```

If `/opt/konsalta` already exists, update it with your normal deployment
procedure rather than cloning over the existing files. The Express app serves
the site files from the parent directory of `api`.

### 4. Set up persistent data and private configuration

Create a data directory outside the website tree. Copy the example environment
file to a root-managed location; edit the private copy, not the repository
example:

```sh
sudo install -d -o konsalta -g konsalta -m 700 /var/lib/konsalta
sudo install -d -o root -g konsalta -m 750 /etc/konsalta
sudo install -o root -g konsalta -m 640 \
  /opt/konsalta/api/.env.example /etc/konsalta/konsalta.env
sudoedit /etc/konsalta/konsalta.env
```

If the service account setup already created `/var/lib/konsalta`, keep that
directory and set its permissions:

```sh
sudo chown konsalta:konsalta /var/lib/konsalta
sudo chmod 700 /var/lib/konsalta
```

Set these values in `/etc/konsalta/konsalta.env`:

```dotenv
NODE_ENV=production
PORT=3000
PUBLIC_SITE_URL=https://YOUR_DOMAIN
TRUST_PROXY_HOPS=1
NEWSLETTER_DB_PATH=/var/lib/konsalta/newsletter.json
INSIGHTS_CONTENT_PATH=/var/lib/konsalta/insights-content.json
NEWSLETTER_ADMIN_USER=choose-a-private-admin-name
NEWSLETTER_ADMIN_PASSWORD=paste-a-long-random-secret-here
SMTP_HOST=your-mail-host
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=your-sending-mailbox
SMTP_PASSWORD=the-current-mailbox-password
SMTP_FROM=your-verified-sending-address
CONTACT_TO=your-contact-inbox
```

Generate the admin password on the VPS with `openssl rand -base64 36`, then
paste the result into the private environment file. Do not use the example
values or commit real secrets. Obtain SMTP settings from the mailbox/domain
administrator; the repository intentionally contains no working credentials.
The sending address/domain must be permitted by the SMTP provider.

### 5. Run the app with systemd

Create `/etc/systemd/system/konsalta.service`:

```ini
[Unit]
Description=Konsalta website and form API
After=network.target

[Service]
Type=simple
User=konsalta
Group=konsalta
WorkingDirectory=/opt/konsalta/api
EnvironmentFile=/etc/konsalta/konsalta.env
ExecStart=/usr/bin/node /opt/konsalta/api/server.js
Restart=on-failure
RestartSec=5
NoNewPrivileges=true
PrivateTmp=true
ProtectSystem=strict
ReadWritePaths=/var/lib/konsalta

[Install]
WantedBy=multi-user.target
```

Start it and confirm the local health check returns the homepage:

```sh
sudo systemctl daemon-reload
sudo systemctl enable --now konsalta
sudo systemctl status konsalta
curl -I http://127.0.0.1:3000/
```

Inspect errors with `sudo journalctl -u konsalta -n 100 --no-pager`. The service
does not need to listen on a public interface.

### 6. Put Nginx in front and enable HTTPS

Create `/etc/nginx/sites-available/konsalta` with the following HTTP virtual
host. Add `www.YOUR_DOMAIN` only if its DNS record exists:

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name YOUR_DOMAIN;

    client_max_body_size 24m;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_read_timeout 600s;
    }
}
```

Enable the site, check the configuration, and request a certificate:

```sh
sudo ln -s /etc/nginx/sites-available/konsalta /etc/nginx/sites-enabled/konsalta
sudo nginx -t
sudo systemctl reload nginx
sudo certbot --nginx -d YOUR_DOMAIN
```

Certbot updates the Nginx site for HTTPS. Ensure the final TLS server block
continues to proxy to `127.0.0.1:3000`. `TRUST_PROXY_HOPS=1` is correct only when
exactly one trusted Nginx proxy is in front of Node; change it to the real proxy
count if your topology differs. Do not trust arbitrary forwarded headers.

Allow only SSH and web traffic through the VPS firewall:

```sh
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw enable
sudo ufw status
```

Do not open port 3000 to the public internet. Nginx and the Node app should be
kept updated, and TLS renewal should be checked with `sudo certbot renew --dry-run`.

### 7. Test subscription and SMTP delivery

First run the automated tests from the API directory:

```sh
cd /opt/konsalta/api
npm test
```

These tests use a fake email-delivery function and a temporary data file, so
they work without SMTP secrets and do not send real messages. After deployment,
visit `https://YOUR_DOMAIN/insights.html`, subscribe with an address you can
read, click the confirmation link, and verify that the success page appears.
Then check the mailbox provider’s logs if confirmation delivery fails. Do not
send a real campaign until you have verified sender authentication, delivery,
unsubscribe, and your provider’s daily/hourly sending limits.

### 8. Access the site admin page

Open:

```text
https://YOUR_DOMAIN/admin
```

The browser will prompt for HTTP Basic Authentication. Use
`NEWSLETTER_ADMIN_USER` and `NEWSLETTER_ADMIN_PASSWORD` from the private
environment file. This built-in authentication needs no Supabase, hosted
identity service, or additional dependency. The credentials are required to
open the admin page and to call every admin editing, preview, and send endpoint.
Keep the page behind HTTPS;
consider additionally restricting the admin URL by VPN or trusted office IP at
Nginx. Change the private credentials by updating the environment file and
restarting the service.

The admin page has two tools:

- **Insights page posts** lets an editor change the card heading, text, image,
  alt text, post link, follow link, and display order. Add or remove cards
  (maximum 8). Images can use an existing site path such as
  `public/linkedin/post-1.jpeg` or a public HTTPS image URL. To use a new local
  image, upload it to the site's `public/` folder over SFTP and enter its path.
  Updates are saved to `INSIGHTS_CONTENT_PATH` and appear on the public page
  without editing HTML.
- **Newsletter** shows the confirmed subscriber count, lets you create drafts
  with text and up to 8 optional image sections, and previews the email layout
  before sending. Preview is not an inbox-client rendering service: test the
  first send to your own address because email clients may resize layouts or
  hide externally hosted images.

Images must be hosted at public HTTPS URLs. Include descriptive alt text, keep
image file sizes modest, and do not use private VPS paths or temporary links.
Many email clients initially block remote images until the recipient chooses to
display them.

### 9. Back up, update, and restore

Back up `/var/lib/konsalta/newsletter.json` and
`/var/lib/konsalta/insights-content.json` securely and regularly. The newsletter
file contains subscriber addresses, consent records, campaign drafts, and
delivery status; the Insights file contains the published page cards. Restrict
backups just like the original files and store a copy off the VPS.

To deploy an update, back up the data file, update the application files, install
locked dependencies, then restart and inspect the service:

```sh
if sudo test -f /var/lib/konsalta/newsletter.json; then
  sudo cp /var/lib/konsalta/newsletter.json \
    /var/lib/konsalta/newsletter.json.backup
  sudo chown konsalta:konsalta /var/lib/konsalta/newsletter.json.backup
  sudo chmod 600 /var/lib/konsalta/newsletter.json.backup
fi
sudo -u konsalta npm ci --omit=dev --prefix /opt/konsalta/api
sudo systemctl restart konsalta
sudo systemctl status konsalta
```

Restore by stopping the service, copying a known-good backup to
`/var/lib/konsalta/newsletter.json`, setting owner `konsalta:konsalta` and mode
`600`, then starting the service again. Never put backups in the website tree.

This JSON store is for a small list on one Node.js instance. Do not start
multiple app instances with the same data file. For a larger audience, use a
shared database and a dedicated email delivery service with SPF, DKIM, and DMARC
configured. Direct SMTP still requires the VPS provider to allow outbound
connections to the configured SMTP port.
