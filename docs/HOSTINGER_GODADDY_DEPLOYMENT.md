# Hostinger and GoDaddy Deployment Guide

This guide explains how to publish the GameOn Solution website/admin after the current local-development stage.

It is written for this setup:

- Domain purchased in GoDaddy
- Hosting in Hostinger
- Public website built with Vite React
- Admin panel built with Vite React
- Backend API needed for create/edit/delete content

## Read This First

The admin and website are two frontends. They need a backend API.

Static Hostinger hosting can serve the built website files, but the local Node API (`scripts/local-api.mjs`) cannot run permanently on normal static/shared file hosting. For production content saving, use one of these:

- Recommended simple production path: host the frontend on Hostinger and host the API on Vercel/Render/Railway or a Hostinger VPS.
- Hostinger VPS path: run the Node API on a VPS with CloudPanel/PM2.
- Temporary static-only path: upload the website/admin to Hostinger, but create/edit/delete will not work unless `VITE_API_URL` points to a live API.

## What You Will Deploy

Public website repo:

```text
C:\Users\USER\Downloads\Gameonsolution.in-main\Gameonsolution.in-main
```

Admin repo:

```text
C:\Users\USER\Downloads\Turf-Admin-Panel-main\Turf-Admin-Panel-main
```

Backend API during local development:

```text
C:\Users\USER\Downloads\Turf-Admin-Panel-main\Turf-Admin-Panel-main\scripts\local-api.mjs
```

## Decide Your Live URLs

Use this clean structure:

```text
https://gameonsolution.in          Public website
https://admin.gameonsolution.in    Admin panel
https://api.gameonsolution.in      Backend API
```

Replace `gameonsolution.in` with your actual GoDaddy domain if different.

## Before You Build

Open the public website `.env`:

```text
C:\Users\USER\Downloads\Gameonsolution.in-main\Gameonsolution.in-main\.env
```

For production, set:

```env
VITE_BLOG_API_URL=https://api.yourdomain.com
VITE_ADMIN_API_URL=https://api.yourdomain.com
```

Open the admin `.env`:

```text
C:\Users\USER\Downloads\Turf-Admin-Panel-main\Turf-Admin-Panel-main\.env
```

For production, set:

```env
VITE_API_URL=https://api.yourdomain.com
```

Example:

```env
VITE_API_URL=https://api.gameonsolution.in
```

Important: do not use `localhost` in a live website. Visitors cannot access your computer's localhost.

## Build Files

### Build Public Website

Open PowerShell:

```powershell
cd C:\Users\USER\Downloads\Gameonsolution.in-main\Gameonsolution.in-main
npm.cmd install
npm.cmd run build
```

You will get:

```text
C:\Users\USER\Downloads\Gameonsolution.in-main\Gameonsolution.in-main\dist
```

Upload the contents inside `dist`, not the `dist` folder itself.

### Build Admin Panel

Open PowerShell:

```powershell
cd C:\Users\USER\Downloads\Turf-Admin-Panel-main\Turf-Admin-Panel-main
npm.cmd install
npm.cmd run build
```

You will get:

```text
C:\Users\USER\Downloads\Turf-Admin-Panel-main\Turf-Admin-Panel-main\dist
```

Upload the contents inside `dist`, not the `dist` folder itself.

## Connect GoDaddy Domain to Hostinger

There are two ways. Use Option A unless you have a reason not to.

### Option A: Change GoDaddy Nameservers to Hostinger

This means DNS will be managed in Hostinger.

1. Log in to Hostinger.
2. Click `Websites`.
3. Find your website.
4. Click `Dashboard`.
5. Open `Hosting plan`.
6. Click `Plan Details`.
7. Find the `Nameservers` card.
8. Copy both nameservers exactly.

Hostinger says nameservers can be found during domain connection or at `hPanel -> Websites -> Dashboard -> Plan Details`, and the exact values can vary by domain, so use the values shown in your panel.

Now go to GoDaddy:

1. Log in to GoDaddy.
2. Open `Domain Portfolio`.
3. Click your domain.
4. Click `DNS`.
5. Click `Nameservers`.
6. Choose `I'll use my own nameservers`.
7. Paste Hostinger nameserver 1.
8. Paste Hostinger nameserver 2.
9. Click `Save`.
10. Click `Continue`.
11. Complete GoDaddy identity verification if asked.

GoDaddy says nameserver changes often take effect within an hour, but can take up to 48 hours globally.

### Option B: Keep GoDaddy DNS and Point A Record to Hostinger

Use this if you want DNS to stay in GoDaddy.

1. Log in to Hostinger.
2. Click `Websites`.
3. Click `Dashboard` for the website.
4. Find the hosting IP address in Hostinger.
5. Copy the IP address.
6. Log in to GoDaddy.
7. Open `Domain Portfolio`.
8. Click your domain.
9. Click `DNS`.
10. Find the `A` record for `@`.
11. Click edit.
12. Paste the Hostinger IP address.
13. Save.
14. Find the `CNAME` record for `www`.
15. Set it to your root domain, for example:

```text
gameonsolution.in
```

16. Save.

Use only one active `A` record for the root domain unless you know exactly why there are multiple.

## Upload Public Website to Hostinger

1. Log in to Hostinger hPanel.
2. Click `Websites`.
3. Find your domain.
4. Click `Dashboard`.
5. Click `File Manager`.
6. Choose `Access files of your domain` if Hostinger asks.
7. Open the `public_html` folder.
8. Select all old website files.
9. Click `Delete`.
10. On your computer, open:

```text
C:\Users\USER\Downloads\Gameonsolution.in-main\Gameonsolution.in-main\dist
```

11. Select everything inside `dist`:

```text
index.html
assets
favicon files
robots.txt
other generated files
```

12. In Hostinger File Manager, click `Upload`.
13. Upload all selected files/folders into `public_html`.
14. Confirm `index.html` is directly inside `public_html`.

Correct:

```text
public_html/index.html
public_html/assets/...
```

Wrong:

```text
public_html/dist/index.html
```

Hostinger says website files must be inside the domain's `public_html` folder.

## Add SPA Rewrite for React Router

React routes like `/blog/some-slug` need a fallback to `index.html`.

In Hostinger File Manager:

1. Open `public_html`.
2. Click `New file`.
3. Name it:

```text
.htaccess
```

4. Open/edit `.htaccess`.
5. Paste:

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

6. Click `Save`.

## Upload Admin Panel to Subdomain

Recommended admin URL:

```text
admin.yourdomain.com
```

### Create Subdomain in Hostinger

1. Log in to Hostinger.
2. Click `Websites`.
3. Click `Dashboard` for your hosting plan.
4. Look for `Domains` or `Subdomains`.
5. Click `Subdomains`.
6. Create:

```text
admin
```

7. Hostinger should create a folder for the subdomain, often similar to:

```text
domains/yourdomain.com/public_html
```

or:

```text
domains/admin.yourdomain.com/public_html
```

Use the folder Hostinger shows for that subdomain.

### Upload Admin Build

1. Open Hostinger `File Manager`.
2. Open the admin subdomain's `public_html`.
3. Delete old files there if this is a redeploy.
4. On your computer, open:

```text
C:\Users\USER\Downloads\Turf-Admin-Panel-main\Turf-Admin-Panel-main\dist
```

5. Upload everything inside `dist` to the admin subdomain `public_html`.
6. Create or edit `.htaccess` in that same folder.
7. Paste:

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

8. Save.

## Deploy the API

You need a live API for the admin to create/edit/delete content.

### Option 1: Hostinger VPS with CloudPanel

Use this when you want everything under Hostinger.

Requirements:

- Hostinger VPS
- CloudPanel installed
- Domain or subdomain pointed to the VPS IP

Hostinger's CloudPanel Node.js guide says to open CloudPanel at:

```text
https://your-vps-ip:8443
```

Then create a Node.js site from `Sites -> Add Site -> Node.js`, choose domain, Node version, and app port.

Recommended API domain:

```text
api.yourdomain.com
```

Steps:

1. Log in to Hostinger.
2. Open `VPS`.
3. Copy your VPS IP address.
4. Go to Hostinger DNS if nameservers are on Hostinger, or GoDaddy DNS if nameservers are still on GoDaddy.
5. Create an `A` record:

```text
Type: A
Name: api
Value: your VPS IP address
TTL: default
```

6. Wait for DNS.
7. Open:

```text
https://your-vps-ip:8443
```

8. Log in to CloudPanel.
9. Click `Sites`.
10. Click `Add Site`.
11. Choose `Node.js`.
12. Domain:

```text
api.yourdomain.com
```

13. Node.js version: choose a current stable version.
14. App port: choose:

```text
4000
```

15. Create the site.

Upload API files:

1. Connect using Hostinger File Manager, SFTP, or SSH.
2. Go to the API site folder shown by CloudPanel.
3. Upload:

```text
scripts/local-api.mjs
package.json
package-lock.json
data/local-api-db.json
```

For a cleaner production API, place `local-api.mjs` as `server.js` in the API folder, or update the start command to point to `scripts/local-api.mjs`.

SSH start commands:

```bash
cd htdocs/api.yourdomain.com
npm install
npm install pm2@latest -g
pm2 start scripts/local-api.mjs --name gameon-api
pm2 save
```

Test:

```text
https://api.yourdomain.com/api/health
```

Expected:

```json
{
  "success": true,
  "service": "local-turf-admin-api"
}
```

### Option 2: Use Vercel/Render/Railway for API

If you do not have Hostinger VPS, deploy the backend to a Node-capable service.

After deployment, copy the API URL and put it in:

Admin `.env`:

```env
VITE_API_URL=https://your-api-host.com
```

Website `.env`:

```env
VITE_BLOG_API_URL=https://your-api-host.com
VITE_ADMIN_API_URL=https://your-api-host.com
```

Then rebuild and reupload both frontends.

## Full Redeploy Checklist

Use this every time after code changes.

1. Confirm API URL.
2. Update admin `.env`.
3. Update website `.env`.
4. Build website:

```powershell
cd C:\Users\USER\Downloads\Gameonsolution.in-main\Gameonsolution.in-main
npm.cmd run build
```

5. Build admin:

```powershell
cd C:\Users\USER\Downloads\Turf-Admin-Panel-main\Turf-Admin-Panel-main
npm.cmd run build
```

6. Upload website `dist` contents to main domain `public_html`.
7. Upload admin `dist` contents to admin subdomain `public_html`.
8. Confirm `.htaccess` exists in both folders.
9. Open:

```text
https://yourdomain.com
https://admin.yourdomain.com
https://api.yourdomain.com/api/health
```

10. Create one test blog in admin.
11. Open website `/blog`.
12. Confirm the new blog appears.
13. Delete the test blog if needed.

## What to Click: Quick Version

### Hostinger Upload Website

```text
Hostinger login
-> Websites
-> Dashboard
-> File Manager
-> Access files of your domain
-> public_html
-> Delete old files
-> Upload
-> Select everything inside local dist folder
-> Confirm index.html is inside public_html
```

### GoDaddy Nameservers

```text
GoDaddy login
-> Domain Portfolio
-> Click domain
-> DNS
-> Nameservers
-> I'll use my own nameservers
-> Paste Hostinger nameserver 1
-> Paste Hostinger nameserver 2
-> Save
-> Continue
```

### Hostinger DNS Record

```text
Hostinger login
-> Domains
-> Domain portfolio
-> Manage
-> DNS / Nameservers
-> DNS records
-> Add record
```

For API subdomain:

```text
Type: A
Name: api
Content/Points to: VPS IP address
TTL: default
Click Add Record
```

## Testing After Deployment

Check website:

```text
https://yourdomain.com
https://yourdomain.com/blog
https://yourdomain.com/testimonials
```

Check admin:

```text
https://admin.yourdomain.com
https://admin.yourdomain.com/blog-admin
https://admin.yourdomain.com/projects-admin
```

Check API:

```text
https://api.yourdomain.com/api/health
https://api.yourdomain.com/api/blogs
https://api.yourdomain.com/api/projects
```

## Troubleshooting

### Main page works but `/blog/...` shows 404

The `.htaccess` rewrite is missing or in the wrong folder.

Fix:

1. Open correct `public_html`.
2. Create `.htaccess`.
3. Paste the React Router rewrite.
4. Save.

### Admin opens but create buttons fail

The API URL is wrong or the API is offline.

Check browser DevTools:

```text
F12 -> Network -> click failed request
```

Look at Request URL. It must be your live API URL, not `localhost`.

### Changes do not appear after upload

Try:

```text
Ctrl + Shift + R
```

Then clear browser cache or test in Incognito.

### Domain still opens old host

DNS propagation may still be happening. Nameserver changes can take up to 48 hours globally.

### Website has no styling

You probably uploaded only `index.html` and not the `assets` folder.

Fix:

1. Reopen local `dist`.
2. Upload everything inside it.
3. Confirm `public_html/assets` exists.

### API saves locally but not live

Local file storage (`data/local-api-db.json`) is not a production database. On a VPS it can work, but you must back it up. For safer production, move to a real database such as Firebase, Supabase, MongoDB, or PostgreSQL.

## Sources

- Hostinger nameservers: https://support.hostinger.com/en/articles/1583247-where-to-find-hostinger-nameservers
- Hostinger File Manager/public_html: https://www.hostinger.com/support/4548688-basic-actions-in-the-file-manager-in-hostinger/
- Hostinger DNS records: https://support.hostinger.com/en/articles/1583249-how-to-manage-dns-records-at-hostinger
- Hostinger A records: https://support.hostinger.com/en/articles/4468886-how-to-add-and-remove-a-records-in-hpanel/
- Hostinger Node.js support note: https://support.hostinger.com/en/articles/1583661-is-node-js-supported-at-hostinger
- Hostinger CloudPanel Node.js: https://support.hostinger.com/en/articles/9553137-how-to-set-up-a-node-js-application-using-hostinger-cloudpanel
- GoDaddy nameservers: https://www.godaddy.com/help/edit-my-domain-nameservers-664

