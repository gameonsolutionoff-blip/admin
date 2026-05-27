import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import axios from "axios";
import { initializeApp } from "firebase/app";
import { 
  getFirestore, 
  collection, 
  getDocs, 
  doc, 
  setDoc, 
  addDoc, 
  deleteDoc, 
  updateDoc,
  query,
  where
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY || "AIzaSyCT6YIG_7ZWH96Sef2YjIsRaWVooyU03gw",
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN || "gameon-b6644.firebaseapp.com",
  projectId: process.env.VITE_FIREBASE_PROJECT_ID || "gameon-b6644",
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET || "gameon-b6644.firebasestorage.app",
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "773390007721",
  appId: process.env.VITE_FIREBASE_APP_ID || "1:773390007721:web:9372208bb8f9ca0d8958b8"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const port = Number(process.env.PORT || 4000);

const send = (res, status, body) => {
  res.writeHead(status, {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
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
    
    const filename = `${Date.now()}-${Math.round(Math.random() * 100000)}.${ext}`;
    
    try {
      const response = await axios.post("https://gameonsolution.gameonsolution.in/upload.php", {
        secret: "gameon-super-secret-key-123",
        filename: filename,
        base64: dataUrl
      }, {
        headers: { "Content-Type": "application/json" }
      });
      
      const result = response.data;
      if (result.success) {
        return result.url;
      }
      console.error("PHP Upload failed:", result);
    } catch (e) {
      console.error("PHP Upload Error:", e.message);
    }
    return dataUrl;
  };

  const fieldsToCheck = ["image", "imageUrl", "mediaUrl"];
  for (const field of fieldsToCheck) {
    if (body[field] && typeof body[field] === "string" && body[field].startsWith("data:")) {
      body[field] = await saveBase64ToHostinger(body[field]);
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
    body.content = await asyncReplaceAll(body.content, imgRegex, async (match) => {
      const url = await saveBase64ToHostinger(`data:${match[1]};base64,${match[2]}`);
      return `src="${url}"`;
    });
  }
  
  if (body.details && typeof body.details === "string") {
    body.details = await asyncReplaceAll(body.details, imgRegex, async (match) => {
      const url = await saveBase64ToHostinger(`data:${match[1]};base64,${match[2]}`);
      return `src="${url}"`;
    });
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
  [...items].sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));

const getAllDocs = async (collName) => {
  const querySnapshot = await getDocs(collection(db, collName));
  const docs = [];
  querySnapshot.forEach((doc) => docs.push({ id: doc.id, ...doc.data() }));
  return sortNewest(docs);
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

  if ((resource === "newsfeed" || resource === "newsfeeds") && req.method === "GET") {
    const data = await getAllDocs("newsFeeds");
    send(res, 200, data.map(toLegacyNewsFeed));
    return true;
  }

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
    const docRef = await addDoc(collection(db, "contacts"), contact);
    send(res, 200, { id: docRef.id, ...contact });
    return true;
  }

  if (resource === "carousel" && req.method === "GET") {
    const data = await getAllDocs("carousel");
    send(res, 200, data);
    return true;
  }

  return false;
};

const handleCollection = async (req, res, segments, config) => {
  const id = segments[2];

  if (req.method === "GET" && !id) {
    const data = await getAllDocs(config.key);
    send(res, 200, { success: true, [config.key]: data });
    return;
  }

  if (req.method === "GET" && id) {
    const data = await getAllDocs(config.key);
    const item = data.find((entry) => entry.id === id);
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
      send(res, 400, { success: false, message: `Missing (${missing.join(", ")})` });
      return;
    }
    const item = { ...body, createdAt: new Date().toISOString(), updatedAt: null };
    const docRef = await addDoc(collection(db, config.key), item);
    send(res, 200, { success: true, id: docRef.id });
    return;
  }

  if (req.method === "PUT" && id) {
    const body = await readJsonBody(req);
    await updateDoc(doc(db, config.key, id), {
      ...body,
      updatedAt: new Date().toISOString(),
    });
    send(res, 200, { success: true, message: `${config.label} updated` });
    return;
  }

  if (req.method === "DELETE" && id) {
    await deleteDoc(doc(db, config.key, id));
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
    const blog = blogs.find(item => item.id === idOrSlug || item.slug === idOrSlug);
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
    const docRef = await addDoc(collection(db, "blogs"), blog);
    send(res, 200, { success: true, id: docRef.id });
    return;
  }

  if (req.method === "PUT" && idOrSlug) {
    const body = await readJsonBody(req);
    await updateDoc(doc(db, "blogs", idOrSlug), {
      ...body,
      tags: Array.isArray(body.tags) ? body.tags : [],
      updatedAt: new Date().toISOString(),
    });
    send(res, 200, { success: true, message: "Blog updated" });
    return;
  }

  if (req.method === "DELETE" && idOrSlug) {
    await deleteDoc(doc(db, "blogs", idOrSlug));
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
    send(res, 200, { success: true, projects: projects.map(toProjectResponse) });
    return;
  }

  if (req.method === "GET" && id) {
    const projects = await getAllDocs("projects");
    const project = projects.find(item => item.id === id);
    if (!project) {
      send(res, 404, { success: false, message: "Project not found" });
      return;
    }
    send(res, 200, { success: true, project: toProjectResponse(project) });
    return;
  }

  if (req.method === "POST") {
    const body = await readJsonBody(req);
    if (!body.imageUrl || !body.title || !body.location || !body.shortDescription) {
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
    const docRef = await addDoc(collection(db, "projects"), project);
    send(res, 200, { success: true, id: docRef.id });
    return;
  }

  if (req.method === "PUT" && id) {
    const body = await readJsonBody(req);
    await updateDoc(doc(db, "projects", id), {
      ...body,
      mediaUrl: body.imageUrl || undefined,
      updatedAt: new Date().toISOString(),
    });
    send(res, 200, { success: true, message: "Project updated" });
    return;
  }

  if (req.method === "DELETE" && id) {
    await deleteDoc(doc(db, "projects", id));
    send(res, 200, { success: true, message: "Project deleted" });
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
           "Access-Control-Allow-Origin": "*"
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
        key: "testimonials", singleKey: "testimonial", label: "Testimonial",
        required: ["name", "feedback", "mediaUrl", "mediaType"],
      });
      return;
    }
    if (segments[0] === "api" && segments[1] === "news-feeds") {
      await handleCollection(req, res, segments, {
        key: "newsFeeds", singleKey: "newsFeed", label: "News feed",
        required: ["title", "imageUrl", "details"],
      });
      return;
    }
    if (segments[0] === "api" && segments[1] === "contacts") {
      await handleCollection(req, res, segments, {
        key: "contacts", singleKey: "contact", label: "Contact",
        required: ["name", "email", "message"],
      });
      return;
    }
    send(res, 404, { success: false, message: "Route not found" });
  } catch (error) {
    console.error(error);
    send(res, 500, { success: false, message: error.message || "Server error" });
  }
});

server.listen(port, () => {
  console.log(`Firebase API running on http://localhost:${port}`);
});
