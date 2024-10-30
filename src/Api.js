import axios from "axios";
import { getAuth } from "firebase/auth";
import { collection, getDocs } from "firebase/firestore";
import { app, db } from "./Auth/firebase";
const Api = axios.create({
  baseURL: "https://saavn.dev",
});

export const fetchFireStore = async (setPlaylist) => {
  let user = getAuth(app)?.currentUser;
  if (user?.uid) {
    // console.log(user?.uid);
    const docRef = collection(db, "users", user?.uid, "playlists");
    const docSnap = await getDocs(docRef);
    docSnap.forEach((e) => {
      setPlaylist({id:e.id,data:e.data()});
    });
  }
};

export default Api;
