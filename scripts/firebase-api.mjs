import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import axios from "axios";
import {
  initializeApp as initializeAdminApp,
  cert,
  getApps,
} from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore as getAdminFirestore } from "firebase-admin/firestore";

const port = Number(process.env.PORT || 4000);

// ---------------------------------------------------------------------------
// Firebase Admin SDK setup. This is the ONLY Firestore access path in this
// file — the Admin SDK runs with full service-account privileges and
// bypasses Firestore security rules entirely, which is correct here since
// this server is the trusted intermediary. Security rules exist to restrict
// direct client access, not this backend.
//
// Requires FIREBASE_SERVICE_ACCOUNT env var containing the full service
// account JSON as a single-line string. No hardcoded fallback — a missing
// credential should fail loudly, not silently fall back to something wrong.
// ---------------------------------------------------------------------------
const serviceAccountRaw = process.env.FIREBASE_SERVICE_ACCOUNT;

if (!serviceAccountRaw) {
  throw new Error(
    "FIREBASE_SERVICE_ACCOUNT environment variable is not set. " +
      "Add it to your .env file (single-line JSON string) before starting the server."
  );
}

const serviceAccount = JSON.parse(serviceAccountRaw);

if (!getApps().length) {
  initializeAdminApp({
    credential: cert(serviceAccount),
  });
}

const adminAuth = getAuth();
const adminDb = getAdminFirestore();

// Verifies the request's Firebase ID token and confirms the caller is a
// registered admin (present in the "admins" Firestore collection).
// Returns the verified, lowercased email on success, or null if unauthorized.
const requireAdmin = async (req) => {
  const authHeader = req.headers["authorization"] || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;
  if (!token) return null;

  try {
    const decoded = await adminAuth.verifyIdToken(token);
    const email = decoded.email?.toLowerCase();
    if (!email) return null;

    const adminDoc = await adminDb.collection("admins").doc(email).get();
    return adminDoc.exists ? email : null;
  } catch (err) {
    console.error("Token verification failed:", err.message);
    return null;
  }
};

const send = (res, status, body) => {
  res.writeHead(status, {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Content-Type": "application/json",
  });
  res.end(JSON.stringify(body));
};

const processBase64Images = async (body, req) => {
  const saveBase64ToHostinger = async (dataUrl) => {
    const matches = dataUrl.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) return dataUrl;

    const mimeType = matches[1];
    let ext = mimeType.split("/")[1] || "bin";
    if (ext === "jpeg") ext = "jpg";

    const filename = `${Date.now()}-${Math.round(
      Math.random() * 100000
    )}.${ext}`;

    try {
      const response = await axios.post(
        "https://gameonsolution.gameonsolution.in/upload.php",
        {
          secret:
            process.env.UPLOAD_PHP_SECRET || "gameon-super-secret-key-123",
          filename: filename,
          base64: dataUrl,
        },
        {
          headers: {
            "Content-Type": "application/json",
            "User-Agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          },
        }
      );

      const result = response.data;
      if (result.success) {
        return { url: result.url };
      }
      return { error: "PHP Upload failed: " + JSON.stringify(result) };
    } catch (e) {
      return {
        error:
          "PHP Upload Error: " +
          (e.response
            ? e.response.status + " " + JSON.stringify(e.response.data)
            : e.message),
      };
    }
  };

  const fieldsToCheck = ["image", "imageUrl", "mediaUrl"];
  for (const field of fieldsToCheck) {
    if (
      body[field] &&
      typeof body[field] === "string" &&
      body[field].startsWith("data:")
    ) {
      const res = await saveBase64ToHostinger(body[field]);
      if (res.url) {
        body[field] = res.url;
      } else if (res.error) {
        body.debugError = res.error; // save the error to the db document
        body[field] = "UPLOAD_FAILED_CHECK_DEBUG_ERROR"; // Clear massive base64 so Firestore doesn't crash!
      }
    }
  }

  const asyncReplaceAll = async (str, regex, asyncReplacer) => {
    const matches = [...str.matchAll(regex)];
    let result = str;
    for (const match of matches) {
      const replacement = await asyncReplacer(match);
      result = result.replace(match[0], replacement);
    }
    return result;
  };

  const imgRegex = /src="data:([A-Za-z-+\/]+);base64,([^"]+)"/g;

  if (body.content && typeof body.content === "string") {
    body.content = await asyncReplaceAll(
      body.content,
      imgRegex,
      async (match) => {
        const url = await saveBase64ToHostinger(
          `data:${match[1]};base64,${match[2]}`
        );
        return `src="${url}"`;
      }
    );
  }

  if (body.details && typeof body.details === "string") {
    body.details = await asyncReplaceAll(
      body.details,
      imgRegex,
      async (match) => {
        const url = await saveBase64ToHostinger(
          `data:${match[1]};base64,${match[2]}`
        );
        return `src="${url}"`;
      }
    );
  }

  return body;
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
    req.on("end", async () => {
      if (!body) return resolve({});
      try {
        let parsed = JSON.parse(body);
        parsed = await processBase64Images(parsed, req);
        resolve(parsed);
      } catch {
        reject(new Error("Invalid JSON body."));
      }
    });
    req.on("error", reject);
  });

const sortNewest = (items) =>
  [...items].sort(
    (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
  );

// All Firestore reads now go through the Admin SDK, bypassing security rules.
const getAllDocs = async (collName) => {
  const snapshot = await adminDb.collection(collName).get();
  const docs = [];
  snapshot.forEach((doc) => docs.push({ id: doc.id, ...doc.data() }));
  return sortNewest(docs);
};

const addDocAdmin = async (collName, data) => {
  const docRef = await adminDb.collection(collName).add(data);
  return docRef.id;
};

const setDocAdmin = async (collName, id, data) => {
  await adminDb.collection(collName).doc(id).set(data);
};

const updateDocAdmin = async (collName, id, data) => {
  await adminDb.collection(collName).doc(id).update(data);
};

const deleteDocAdmin = async (collName, id) => {
  await adminDb.collection(collName).doc(id).delete();
};

// Legacy support mappings
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

const handleLegacyV1 = async (req, res, segments) => {
  const resource = (segments[2] || "").toLowerCase();

  if (resource === "testimonials" && req.method === "GET") {
    const data = await getAllDocs("testimonials");
    send(res, 200, data.map(toLegacyTestimonial));
    return true;
  }

  if (
    (resource === "newsfeed" || resource === "newsfeeds") &&
    req.method === "GET"
  ) {
    const data = await getAllDocs("newsFeeds");
    send(res, 200, data.map(toLegacyNewsFeed));
    return true;
  }

  // Public contact form submission — stays open, no auth required.
  if (resource === "contacts" && req.method === "POST") {
    const body = await readJsonBody(req);
    if (!body.name || !body.email || !body.message) {
      send(res, 400, { success: false, message: "Missing required fields" });
      return true;
    }
    const contact = {
      ...body,
      createdAt: new Date().toISOString(),
      updatedAt: null,
    };
    const id = await addDocAdmin("contacts", contact);
    send(res, 200, { id, ...contact });
    return true;
  }

  if (resource === "carousel" && req.method === "GET") {
    const data = await getAllDocs("carousel");
    send(res, 200, data);
    return true;
  }

  return false;
};

// Generic collection handler used for testimonials, news-feeds, awards, contacts.
// `publicCreate: true` allows POST without admin auth (used only for contacts,
// since the public site's contact form must be able to submit without login).
const handleCollection = async (req, res, segments, config) => {
  const id = segments[2];

  if (req.method === "GET" && config.requireAuthForRead) {
    const adminEmail = await requireAdmin(req);
    if (!adminEmail) {
      send(res, 401, { success: false, message: "Unauthorized" });
      return;
    }
  }

  if (req.method === "GET" && !id) {
    const data = await getAllDocs(config.key);
    send(res, 200, { success: true, [config.key]: data });
    return;
  }

  const isPublicCreate = req.method === "POST" && config.publicCreate;

  if (!isPublicCreate && ["POST", "PUT", "DELETE"].includes(req.method)) {
    const adminEmail = await requireAdmin(req);
    if (!adminEmail) {
      send(res, 401, { success: false, message: "Unauthorized" });
      return;
    }
  }

  if (req.method === "POST") {
    const body = await readJsonBody(req);
    const missing = config.required.filter((field) => !body[field]);
    if (missing.length) {
      send(res, 400, {
        success: false,
        message: `Missing (${missing.join(", ")})`,
      });
      return;
    }
    const item = {
      ...body,
      createdAt: new Date().toISOString(),
      updatedAt: null,
    };
    const newId = await addDocAdmin(config.key, item);
    send(res, 200, { success: true, id: newId });
    return;
  }

  if (req.method === "PUT" && id) {
    const body = await readJsonBody(req);
    await updateDocAdmin(config.key, id, {
      ...body,
      updatedAt: new Date().toISOString(),
    });
    send(res, 200, { success: true, message: `${config.label} updated` });
    return;
  }

  if (req.method === "DELETE" && id) {
    await deleteDocAdmin(config.key, id);
    send(res, 200, { success: true, message: `${config.label} deleted` });
    return;
  }

  send(res, 405, { success: false, message: "Method not allowed" });
};

const handleBlogs = async (req, res, segments) => {
  const idOrSlug = segments[2];

  if (req.method === "GET" && !idOrSlug) {
    const blogs = await getAllDocs("blogs");
    send(res, 200, { success: true, blogs });
    return;
  }

  if (req.method === "GET" && idOrSlug) {
    let blogs = await getAllDocs("blogs");
    const blog = blogs.find(
      (item) => item.id === idOrSlug || item.slug === idOrSlug
    );
    if (!blog) {
      send(res, 404, { success: false, message: "Blog not found" });
      return;
    }
    send(res, 200, { success: true, blog });
    return;
  }

  if (["POST", "PUT", "DELETE"].includes(req.method)) {
    const adminEmail = await requireAdmin(req);
    if (!adminEmail) {
      send(res, 401, { success: false, message: "Unauthorized" });
      return;
    }
  }

  if (req.method === "POST") {
    const body = await readJsonBody(req);
    if (!body.slug || !body.title || !body.excerpt || !body.content) {
      send(res, 400, { success: false, message: "Missing required fields" });
      return;
    }
    const blogs = await getAllDocs("blogs");
    if (blogs.some((blog) => blog.slug === body.slug)) {
      send(res, 400, { success: false, message: "Slug already exists" });
      return;
    }
    const blog = {
      slug: body.slug,
      title: body.title,
      excerpt: body.excerpt,
      image: body.image || "",
      tags: Array.isArray(body.tags) ? body.tags : [],
      content: body.content,
      createdAt: new Date().toISOString(),
      updatedAt: null,
    };
    const newId = await addDocAdmin("blogs", blog);
    send(res, 200, { success: true, id: newId });
    return;
  }

  if (req.method === "PUT" && idOrSlug) {
    const body = await readJsonBody(req);
    await updateDocAdmin("blogs", idOrSlug, {
      ...body,
      tags: Array.isArray(body.tags) ? body.tags : [],
      updatedAt: new Date().toISOString(),
    });
    send(res, 200, { success: true, message: "Blog updated" });
    return;
  }

  if (req.method === "DELETE" && idOrSlug) {
    await deleteDocAdmin("blogs", idOrSlug);
    send(res, 200, { success: true, message: "Blog deleted" });
    return;
  }

  send(res, 405, { success: false, message: "Method not allowed" });
};

const toProjectResponse = (project) => ({
  ...project,
  mediaUrl: project.imageUrl,
  fileType: project.fileType || "image",
});

const handleProjects = async (req, res, segments) => {
  const id = segments[2];

  if (req.method === "GET" && !id) {
    const projects = await getAllDocs("projects");
    send(res, 200, {
      success: true,
      projects: projects.map(toProjectResponse),
    });
    return;
  }

  if (req.method === "GET" && id) {
    const projects = await getAllDocs("projects");
    const project = projects.find((item) => item.id === id);
    if (!project) {
      send(res, 404, { success: false, message: "Project not found" });
      return;
    }
    send(res, 200, { success: true, project: toProjectResponse(project) });
    return;
  }

  if (["POST", "PUT", "DELETE"].includes(req.method)) {
    const adminEmail = await requireAdmin(req);
    if (!adminEmail) {
      send(res, 401, { success: false, message: "Unauthorized" });
      return;
    }
  }

  if (req.method === "POST") {
    const body = await readJsonBody(req);
    if (
      !body.imageUrl ||
      !body.title ||
      !body.location ||
      !body.shortDescription
    ) {
      send(res, 400, { success: false, message: "Missing required fields" });
      return;
    }
    const project = {
      imageUrl: body.imageUrl,
      mediaUrl: body.imageUrl,
      fileType: "image",
      title: body.title,
      location: body.location,
      shortDescription: body.shortDescription,
      createdAt: new Date().toISOString(),
      updatedAt: null,
    };
    if (body.debugError) {
      project.debugError = body.debugError;
    }
    const newId = await addDocAdmin("projects", project);
    send(res, 200, { success: true, id: newId });
    return;
  }

  if (req.method === "PUT" && id) {
    const body = await readJsonBody(req);
    const updatePayload = {
      ...body,
      updatedAt: new Date().toISOString(),
    };
    if (body.imageUrl) {
      updatePayload.mediaUrl = body.imageUrl;
    }
    await updateDocAdmin("projects", id, updatePayload);
    send(res, 200, { success: true, message: "Project updated" });
    return;
  }

  if (req.method === "DELETE" && id) {
    await deleteDocAdmin("projects", id);
    send(res, 200, { success: true, message: "Project deleted" });
    return;
  }

  send(res, 405, { success: false, message: "Method not allowed" });
};

// Manage the "admins" collection. All operations require the caller to
// already be a verified admin — there is no public write path here at all.
const handleAdmins = async (req, res, segments) => {
  const targetEmail = segments[2]
    ? decodeURIComponent(segments[2]).toLowerCase()
    : null;

  const callerEmail = await requireAdmin(req);
  if (!callerEmail) {
    send(res, 401, { success: false, message: "Unauthorized" });
    return;
  }

  if (req.method === "GET") {
    const snapshot = await adminDb.collection("admins").get();
    const admins = snapshot.docs.map((d) => ({ email: d.id, ...d.data() }));
    send(res, 200, { success: true, admins });
    return;
  }

  if (req.method === "POST") {
    const body = await readJsonBody(req);
    const email = (body.email || "").toLowerCase().trim();
    if (!email || !email.includes("@")) {
      send(res, 400, { success: false, message: "Valid email required" });
      return;
    }
    await setDocAdmin("admins", email, {
      addedBy: callerEmail,
      addedAt: new Date().toISOString(),
    });
    send(res, 200, { success: true, message: `${email} added as admin` });
    return;
  }

  if (req.method === "DELETE" && targetEmail) {
    if (targetEmail === callerEmail) {
      send(res, 400, { success: false, message: "You can't remove yourself" });
      return;
    }
    await deleteDocAdmin("admins", targetEmail);
    send(res, 200, { success: true, message: `${targetEmail} removed` });
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

    if (url.pathname.startsWith("/uploads/")) {
      const filePath = path.join(process.cwd(), url.pathname);
      if (fs.existsSync(filePath)) {
        const ext = path.extname(filePath).toLowerCase();
        let contentType = "application/octet-stream";
        if (ext === ".png") contentType = "image/png";
        else if (ext === ".jpg" || ext === ".jpeg") contentType = "image/jpeg";
        else if (ext === ".gif") contentType = "image/gif";
        else if (ext === ".webp") contentType = "image/webp";
        else if (ext === ".mp4") contentType = "video/mp4";

        res.writeHead(200, {
          "Content-Type": contentType,
          "Access-Control-Allow-Origin": "*",
        });
        fs.createReadStream(filePath).pipe(res);
        return;
      }
    }

    if (url.pathname === "/api/health") {
      send(res, 200, { success: true, service: "firebase-admin-api" });
      return;
    }
    if (segments[0] === "api" && segments[1] === "v1") {
      const handled = await handleLegacyV1(req, res, segments);
      if (handled) return;
    }
    if (segments[0] === "api" && segments[1] === "blogs") {
      await handleBlogs(req, res, segments);
      return;
    }
    if (segments[0] === "api" && segments[1] === "projects") {
      await handleProjects(req, res, segments);
      return;
    }
    if (segments[0] === "api" && segments[1] === "testimonials") {
      await handleCollection(req, res, segments, {
        key: "testimonials",
        singleKey: "testimonial",
        label: "Testimonial",
        required: ["name", "feedback", "mediaUrl", "mediaType"],
      });
      return;
    }
    if (segments[0] === "api" && segments[1] === "news-feeds") {
      await handleCollection(req, res, segments, {
        key: "newsFeeds",
        singleKey: "newsFeed",
        label: "News feed",
        required: ["title", "imageUrl", "details"],
      });
      return;
    }
    if (segments[0] === "api" && segments[1] === "contacts") {
      await handleCollection(req, res, segments, {
        key: "contacts",
        singleKey: "contact",
        label: "Contact",
        required: ["name", "email", "message"],
        publicCreate: true,
        requireAuthForRead: true, // ← add this
      });
      return;
    }
    if (segments[0] === "api" && segments[1] === "awards") {
      await handleCollection(req, res, segments, {
        key: "awards",
        singleKey: "award",
        label: "Award",
        required: ["title", "imageUrl", "date"],
      });
      return;
    }
    if (segments[0] === "api" && segments[1] === "admins") {
      await handleAdmins(req, res, segments);
      return;
    }
    send(res, 404, { success: false, message: "Route not found" });
  } catch (error) {
    console.error(error);
    send(res, 500, {
      success: false,
      message: error.message || "Server error",
    });
  }
});

server.listen(port, () => {
  console.log(`Firebase API (Admin SDK) running on http://localhost:${port}`);
});
