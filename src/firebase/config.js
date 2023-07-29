// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { v4 } from "uuid";

const firebaseConfig = {
  apiKey: "AIzaSyCSU1J-oDZmObSmxanFDkw-yWzF6EOH5-g",
  authDomain: "formulario-irais.firebaseapp.com",
  projectId: "formulario-irais",
  storageBucket: "formulario-irais.appspot.com",
  messagingSenderId: "1043130314845",
  appId: "1:1043130314845:web:22c0c8342661b9267addb4",
  measurementId: "G-RF1D16KMVE"
};

const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);

export async function uploadFile(file) {
  const fileSize = file.size / (1024 * 1024);

  if (fileSize > 300) {
    return null;
  } else {
    const storageRef = ref(storage, v4());
    await uploadBytes(storageRef, file);
    const url = await getDownloadURL(storageRef);
    return url;
  }
}
