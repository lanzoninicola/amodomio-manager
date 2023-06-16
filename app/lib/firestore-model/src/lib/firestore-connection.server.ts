import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import getFirebaseConfig from "../config/get-firebase-config.server";

let firebaseConfig = getFirebaseConfig();

// Optional name of the app to initialize
const projectName = firebaseConfig.project_id;

// Initialize Firebase
const firebaseApp = initializeApp(
  {
    projectId: firebaseConfig.project_id,
  },
  projectName
);

// Initialize Cloud Firestore and get a reference to the service
const connection = getFirestore(firebaseApp);

export default connection;
