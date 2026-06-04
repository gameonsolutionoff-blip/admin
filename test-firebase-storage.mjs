import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadString, getDownloadURL } from "firebase/storage";
import dotenv from "dotenv";
dotenv.config();

const app = initializeApp({
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  appId: process.env.VITE_FIREBASE_APP_ID
});
const storage = getStorage(app);
const storageRef = ref(storage, "test/test.txt");
uploadString(storageRef, "Hello world").then(async (snapshot) => {
  console.log(await getDownloadURL(snapshot.ref));
  process.exit(0);
}).catch(e => {
  console.error(e.code, e.message);
  process.exit(1);
});
