import http from "node:http";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.resolve(__dirname, "../data");
const dbPath = path.join(dataDir, "local-api-db.json");
const port = Number(process.env.PORT || 4000);

const defaultDb = {
  blogs: [],
  projects: [],
  testimonials: [],
  newsFeeds: [],
  contacts: [],
  carousel: [],
};

const send = (res, status, body) => {
  res.writeHead(status, {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json",
  });
  res.end(JSON.stringify(body));
};

const readJsonBody = (req) =>
  new Promise((resolve, reject) => {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk;
      if (body.length > 100 * 1024 * 1024) {
        req.destroy();
        reject(new Error("Request body is too large."));
      }
    });

    req.on("end", () => {
      if (!body) {
        resolve({});
        return;
      }

      try {
        resolve(JSON.parse(body));
      } catch {
        reject(new Error("Invalid JSON body."));
      }
    });

    req.on("error", reject);
  });

const loadDb = async () => {
  await mkdir(dataDir, { recursive: true });

  try {
    const raw = await readFile(dbPath, "utf8");
    return { ...defaultDb, ...JSON.parse(raw) };
  } catch {
    await saveDb(defaultDb);
    return { ...defaultDb };
  }
};

const saveDb = async (db) => {
  await mkdir(dataDir, { recursive: true });
  await writeFile(dbPath, JSON.stringify(db, null, 2), "utf8");
};

const makeId = () =>
  typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(16).slice(2)}`;

const toProjectResponse = (project) => ({
  ...project,
  mediaUrl: project.imageUrl,
  fileType: project.fileType || "image",
});

const sortNewest = (items) =>
  [...items].sort(
    (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
  );

const toLegacyTestimonial = (item) => ({
  id: item.id,
  authorName: item.authorName || item.name || "",
  content: item.content || item.feedback || "",
  rating: item.rating || 5,
  fileType: item.fileType || item.mediaType || "image",
  mediaUrl: item.mediaUrl || item.imageUrl || "",
  createdAt: item.createdAt || null,
});

const toLegacyNewsFeed = (item) => ({
  id: item.id,
  title: item.title || "",
  date: item.date || item.createdAt || null,
  details: item.details || item.description || "",
  fileType: item.fileType || item.mediaType || "image",
  mediaUrl: item.mediaUrl || item.imageUrl || "",
});

const handleLegacyV1 = async (req, res, segments, db) => {
  const resource = (segments[2] || "").toLowerCase();

  if (resource === "testimonials" && req.method === "GET") {
    send(res, 200, sortNewest(db.testimonials).map(toLegacyTestimonial));
    return true;
  }

  if ((resource === "newsfeed" || resource === "newsfeeds") && req.method === "GET") {
    send(res, 200, sortNewest(db.newsFeeds).map(toLegacyNewsFeed));
    return true;
  }

  if (resource === "contacts" && req.method === "POST") {
    const body = await readJsonBody(req);
    if (!body.name || !body.email || !body.message) {
      send(res, 400, {
        success: false,
        message: "Missing required fields (name, email, message)",
      });
      return true;
    }

    const contact = {
      id: makeId(),
      ...body,
      createdAt: new Date().toISOString(),
      updatedAt: null,
    };
    db.contacts = [...db.contacts, contact];
    await saveDb(db);
    send(res, 200, contact);
    return true;
  }

  if (resource === "carousel" && req.method === "GET") {
    send(res, 200, db.carousel || []);
    return true;
  }

  return false;
};

const handleCollection = async (req, res, segments, db, config) => {
  const id = segments[2];
  const collection = db[config.key] || [];

  if (req.method === "GET" && !id) {
    send(res, 200, { success: true, [config.key]: sortNewest(collection) });
    return;
  }

  if (req.method === "GET" && id) {
    const item = collection.find((entry) => entry.id === id);
    if (!item) {
      send(res, 404, { success: false, message: `${config.label} not found` });
      return;
    }
    send(res, 200, { success: true, [config.singleKey]: item });
    return;
  }

  if (req.method === "POST") {
    const body = await readJsonBody(req);
    const missing = config.required.filter((field) => !body[field]);
    if (missing.length) {
      send(res, 400, {
        success: false,
        message: `Missing required fields (${missing.join(", ")})`,
      });
      return;
    }

    const item = {
      id: makeId(),
      ...body,
      createdAt: new Date().toISOString(),
      updatedAt: null,
    };

    db[config.key] = [...collection, item];
    await saveDb(db);
    send(res, 200, { success: true, id: item.id });
    return;
  }

  if (req.method === "PUT" && id) {
    const index = collection.findIndex((entry) => entry.id === id);
    if (index === -1) {
      send(res, 404, { success: false, message: `${config.label} not found` });
      return;
    }

    const body = await readJsonBody(req);
    db[config.key][index] = {
      ...collection[index],
      ...body,
      updatedAt: new Date().toISOString(),
    };
    await saveDb(db);
    send(res, 200, { success: true, message: `${config.label} updated` });
    return;
  }

  if (req.method === "DELETE" && id) {
    const next = collection.filter((entry) => entry.id !== id);
    if (next.length === collection.length) {
      send(res, 404, { success: false, message: `${config.label} not found` });
      return;
    }

    db[config.key] = next;
    await saveDb(db);
    send(res, 200, { success: true, message: `${config.label} deleted` });
    return;
  }

  send(res, 405, { success: false, message: "Method not allowed" });
};

const handleBlogs = async (req, res, segments, db) => {
  const idOrSlug = segments[2];

  if (req.method === "GET" && !idOrSlug) {
    send(res, 200, {
      success: true,
      blogs: [...db.blogs].sort(
        (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
      ),
    });
    return;
  }

  if (req.method === "GET" && idOrSlug) {
    const blog = db.blogs.find(
      (item) => item.id === idOrSlug || item.slug === idOrSlug
    );
    if (!blog) {
      send(res, 404, { success: false, message: "Blog not found" });
      return;
    }
    send(res, 200, { success: true, blog });
    return;
  }

  if (req.method === "POST") {
    const body = await readJsonBody(req);
    if (!body.slug || !body.title || !body.excerpt || !body.content) {
      send(res, 400, {
        success: false,
        message: "Missing required fields (slug,title,excerpt,content)",
      });
      return;
    }

    if (db.blogs.some((blog) => blog.slug === body.slug)) {
      send(res, 400, { success: false, message: "Slug already exists" });
      return;
    }

    const blog = {
      id: makeId(),
      slug: body.slug,
      title: body.title,
      excerpt: body.excerpt,
      image: body.image || "",
      tags: Array.isArray(body.tags) ? body.tags : [],
      content: body.content,
      createdAt: new Date().toISOString(),
      updatedAt: null,
    };

    db.blogs.push(blog);
    await saveDb(db);
    send(res, 200, { success: true, id: blog.id });
    return;
  }

  if (req.method === "PUT" && idOrSlug) {
    const index = db.blogs.findIndex((item) => item.id === idOrSlug);
    if (index === -1) {
      send(res, 404, { success: false, message: "Blog not found" });
      return;
    }

    const body = await readJsonBody(req);
    db.blogs[index] = {
      ...db.blogs[index],
      ...body,
      tags: Array.isArray(body.tags) ? body.tags : db.blogs[index].tags,
      updatedAt: new Date().toISOString(),
    };
    await saveDb(db);
    send(res, 200, { success: true, message: "Blog updated successfully" });
    return;
  }

  if (req.method === "DELETE" && idOrSlug) {
    const before = db.blogs.length;
    db.blogs = db.blogs.filter((item) => item.id !== idOrSlug);
    if (db.blogs.length === before) {
      send(res, 404, { success: false, message: "Blog not found" });
      return;
    }

    await saveDb(db);
    send(res, 200, { success: true, message: "Blog deleted successfully" });
    return;
  }

  send(res, 405, { success: false, message: "Method not allowed" });
};

const handleProjects = async (req, res, segments, db) => {
  const id = segments[2];

  if (req.method === "GET" && !id) {
    send(res, 200, {
      success: true,
      projects: [...db.projects]
        .map(toProjectResponse)
        .sort(
          (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
        ),
    });
    return;
  }

  if (req.method === "GET" && id) {
    const project = db.projects.find((item) => item.id === id);
    if (!project) {
      send(res, 404, { success: false, message: "Project not found" });
      return;
    }
    send(res, 200, { success: true, project: toProjectResponse(project) });
    return;
  }

  if (req.method === "POST") {
    const body = await readJsonBody(req);
    if (
      !body.imageUrl ||
      !body.title ||
      !body.location ||
      !body.shortDescription
    ) {
      send(res, 400, {
        success: false,
        message:
          "Missing required fields (imageUrl, title, location, shortDescription)",
      });
      return;
    }

    const project = {
      id: makeId(),
      imageUrl: body.imageUrl,
      mediaUrl: body.imageUrl,
      fileType: "image",
      title: body.title,
      location: body.location,
      shortDescription: body.shortDescription,
      createdAt: new Date().toISOString(),
      updatedAt: null,
    };

    db.projects.push(project);
    await saveDb(db);
    send(res, 200, { success: true, id: project.id });
    return;
  }

  if (req.method === "PUT" && id) {
    const index = db.projects.findIndex((item) => item.id === id);
    if (index === -1) {
      send(res, 404, { success: false, message: "Project not found" });
      return;
    }

    const body = await readJsonBody(req);
    db.projects[index] = {
      ...db.projects[index],
      ...body,
      mediaUrl: body.imageUrl || db.projects[index].imageUrl,
      fileType: "image",
      updatedAt: new Date().toISOString(),
    };
    await saveDb(db);
    send(res, 200, { success: true, message: "Project updated successfully" });
    return;
  }

  if (req.method === "DELETE" && id) {
    const before = db.projects.length;
    db.projects = db.projects.filter((item) => item.id !== id);
    if (db.projects.length === before) {
      send(res, 404, { success: false, message: "Project not found" });
      return;
    }

    await saveDb(db);
    send(res, 200, { success: true, message: "Project deleted successfully" });
    return;
  }

  send(res, 405, { success: false, message: "Method not allowed" });
};

const server = http.createServer(async (req, res) => {
  if (req.method === "OPTIONS") {
    send(res, 204, {});
    return;
  }

  try {
    const url = new URL(req.url || "/", `http://${req.headers.host}`);
    const segments = url.pathname.split("/").filter(Boolean);
    const db = await loadDb();

    if (url.pathname === "/api/health") {
      send(res, 200, {
        success: true,
        service: "local-turf-admin-api",
        timestamp: new Date().toISOString(),
      });
      return;
    }

    if (segments[0] === "api" && segments[1] === "v1") {
      const handled = await handleLegacyV1(req, res, segments, db);
      if (handled) return;
    }

    if (segments[0] === "api" && segments[1] === "blogs") {
      await handleBlogs(req, res, segments, db);
      return;
    }

    if (segments[0] === "api" && segments[1] === "projects") {
      await handleProjects(req, res, segments, db);
      return;
    }

    if (segments[0] === "api" && segments[1] === "testimonials") {
      await handleCollection(req, res, segments, db, {
        key: "testimonials",
        singleKey: "testimonial",
        label: "Testimonial",
        required: ["name", "feedback", "mediaUrl", "mediaType"],
      });
      return;
    }

    if (segments[0] === "api" && segments[1] === "news-feeds") {
      await handleCollection(req, res, segments, db, {
        key: "newsFeeds",
        singleKey: "newsFeed",
        label: "News feed",
        required: ["title", "imageUrl", "details"],
      });
      return;
    }

    if (segments[0] === "api" && segments[1] === "contacts") {
      await handleCollection(req, res, segments, db, {
        key: "contacts",
        singleKey: "contact",
        label: "Contact response",
        required: ["name", "email", "message"],
      });
      return;
    }

    send(res, 404, { success: false, message: "Route not found" });
  } catch (error) {
    send(res, 500, {
      success: false,
      message: error instanceof Error ? error.message : "Server error",
    });
  }
});

server.listen(port, () => {
  console.log(`Local API running on http://localhost:${port}`);
});
