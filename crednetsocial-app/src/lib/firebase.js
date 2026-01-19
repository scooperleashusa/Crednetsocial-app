import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC4pCo6kSM7twxFCZ5waWqIMuImQL3ff5",
    authDomain: "studio-1948189982-a534a.firebaseapp.com",
      projectId: "studio-1948189982-a534a",
        storageBucket: "studio-1948189982-a534a.appspot.com",
          messagingSenderId: "154686243252",
            appId: "1:154686243252:web:ed870e0539f4a3843032e1"
            };

            const app = initializeApp(firebaseConfig);
            export const db = getFirestore(app);