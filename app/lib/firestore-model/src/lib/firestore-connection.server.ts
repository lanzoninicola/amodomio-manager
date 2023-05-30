import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import getFirebaseConfig from "../config/get-firebase-config.server";

let firebaseConfig = getFirebaseConfig();

// Initialize Firebase
const firebaseApp = initializeApp({
  projectId: firebaseConfig.project_id,
});

// Initialize Cloud Firestore and get a reference to the service
const connection = getFirestore(firebaseApp);

export default connection;
