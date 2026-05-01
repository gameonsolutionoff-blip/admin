# Turf Admin Panel

Admin panel for managing GameOn Solution website content: blogs, projects, testimonials, news feeds, and contact responses.

This repo is the admin application. The public website is in:

```text
C:\Users\USER\Downloads\Gameonsolution.in-main\Gameonsolution.in-main
```

Both apps are connected through the same API base URL.

## Project Stack

- React 18
- Vite
- TypeScript
- Tailwind CSS
- shadcn/ui-style components
- Axios
- Local Node API for development
- JSON file storage for local development

## Important Folders

```text
src/pages               Admin pages
src/lib/api.ts          API base URL
src/lib/imageUpload.ts  Image/video upload helpers
scripts/local-api.mjs   Local backend API
scripts/dev-all.mjs     Runs API and admin together
data/local-api-db.json  Local database file
dist                    Production build output
```

## Environment

Admin API configuration lives in `.env`:

```env
VITE_API_URL=http://localhost:4000
```

The public website must use the same API when testing locally:

```env
VITE_BLOG_API_URL=http://localhost:4000
VITE_ADMIN_API_URL=http://localhost:4000
```

## Install

From this folder:

```powershell
cd C:\Users\USER\Downloads\Turf-Admin-Panel-main\Turf-Admin-Panel-main
npm.cmd install
```

Use `npm.cmd` in PowerShell. On this Windows machine, plain `npm` may be blocked by PowerShell script policy.

## Run Admin and API Together

Recommended:

```powershell
cd C:\Users\USER\Downloads\Turf-Admin-Panel-main\Turf-Admin-Panel-main
npm.cmd run dev:all
```

This starts:

- Local API on `http://localhost:4000`
- Admin panel on the Vite URL, usually `http://localhost:8080` or `http://localhost:8081`

## Run Separately

Terminal 1:

```powershell
cd C:\Users\USER\Downloads\Turf-Admin-Panel-main\Turf-Admin-Panel-main
npm.cmd run api
```

Terminal 2:

```powershell
cd C:\Users\USER\Downloads\Turf-Admin-Panel-main\Turf-Admin-Panel-main
npm.cmd run dev
```

## Check API

Open in browser:

```text
http://localhost:4000/api/health
```

Expected:

```json
{
  "success": true,
  "service": "local-turf-admin-api"
}
```

If create/save buttons fail, check this endpoint first.

## Admin Routes

```text
/                         Dashboard
/blog-admin               Create blog
/blog-data                View blogs
/blog-edit/:id            Edit blog
/projects-admin           Create project
/projects-data            View projects
/projects-edit/:id        Edit project
/testimonials-admin       Create testimonial
/testimonials-data        View testimonials
/testimonials-edit/:id    Edit testimonial
/news-admin               Create news feed
/news-data                View news
/news-edit/:id            Edit news
/contact-responses        View contact responses
```

## API Routes

Local API:

```text
GET    /api/health

GET    /api/blogs
GET    /api/blogs/:id-or-slug
POST   /api/blogs
PUT    /api/blogs/:id
DELETE /api/blogs/:id

GET    /api/projects
GET    /api/projects/:id
POST   /api/projects
PUT    /api/projects/:id
DELETE /api/projects/:id

GET    /api/testimonials
GET    /api/testimonials/:id
POST   /api/testimonials
PUT    /api/testimonials/:id
DELETE /api/testimonials/:id

GET    /api/news-feeds
GET    /api/news-feeds/:id
POST   /api/news-feeds
PUT    /api/news-feeds/:id
DELETE /api/news-feeds/:id

GET    /api/contacts
POST   /api/contacts
DELETE /api/contacts/:id
```

Website compatibility routes:

```text
GET  /api/v1/testimonials
GET  /api/v1/newsfeed
POST /api/v1/contacts
GET  /api/v1/carousel
```

## Data Storage

Local data is stored here:

```text
data/local-api-db.json
```

Do not delete this file unless you intentionally want to remove local content.

## Build Admin

```powershell
cd C:\Users\USER\Downloads\Turf-Admin-Panel-main\Turf-Admin-Panel-main
npm.cmd run build
```

Build output:

```text
dist
```

## Build Public Website

```powershell
cd C:\Users\USER\Downloads\Gameonsolution.in-main\Gameonsolution.in-main
npm.cmd run build
```

Build output:

```text
dist
```

## Deployment

Use the separate deployment guide:

```text
docs/HOSTINGER_GODADDY_DEPLOYMENT.md
```

## Common Fixes

### Create button says request failed

Start the API:

```powershell
npm.cmd run api
```

Or start everything:

```powershell
npm.cmd run dev:all
```

### Browser shows old version

Stop Vite, restart it, then hard refresh:

```text
Ctrl + Shift + R
```

### Port 8080 is busy

Vite will use another port such as `8081`. Open the URL printed in the terminal.

### PowerShell blocks npm

Use:

```powershell
npm.cmd run dev:all
```

instead of:

```powershell
npm run dev:all
```

