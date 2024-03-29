import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyA1ZbvpZNfwIa9_G0WXxQ3pdYW7cJ3zpUg",
  authDomain: "project25mb.firebaseapp.com",
  databaseURL: "https://project25mb-default-rtdb.firebaseio.com",
  projectId: "project25mb",
  storageBucket: "project25mb.appspot.com",
  messagingSenderId: "298980367194",
  appId: "1:298980367194:web:7eca5539029028a2c6b163",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth();

export { app, auth };
