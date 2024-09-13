import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

import { getStorage, ref } from "firebase/storage";
import { getFirestore
} from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_PROJECT_ID,
  appId: process.env.REACT_APP_APP_ID,
  measurementId: process.env.REACT_APP_MEASUREMENT_ID,
  persistence: true,
};

const app = initializeApp(firebaseConfig);

// export const  storage =  getStorage(app);
// Initialize Firebase Authentication and get a reference to the service
const storage = getStorage(app);
export const imagesRef = ref(storage, 'images');

export const db = getFirestore(app);

export const auth = getAuth(app);

export default app;