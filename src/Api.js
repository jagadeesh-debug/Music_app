import axios from "axios";
const Api = axios.create({
  baseURL: "https://saavn.dev",
});
export default Api;

import { getAuth, onAuthStateChanged } from "firebase/auth";
import {
  addDoc,
  collection,
  doc,
  getDocs,
  deleteDoc,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";
import { app, db } from "./Auth/firebase";
export const fetchFireStore = (setPlaylist) => {
  let auth = getAuth(app);
  onAuthStateChanged(auth, async (user) => {
    if (user?.uid) {
      const docRef = collection(db, "users", user?.uid, "playlists");
      const docSnap = await getDocs(docRef);
      docSnap.forEach((e) => {
        setPlaylist({ id: e.id, data: e.data() });
      });
    }
  });
};

export function pushInDb(playlistId, musicId) {
  const auth = getAuth(app);
  onAuthStateChanged(auth, (user) => {
    const collectionRef = doc(db, "users", user?.uid, "playlists", playlistId);
    updateDoc(collectionRef, {
      songs: arrayUnion(musicId),
    });
  });
}

export function deletePlaylist(playlistId,playlists,setPlaylist,emptyPlaylist) {
  const auth = getAuth(app);
  const user = auth?.currentUser;
  if (user?.uid) {
    const docRef = doc(db, "users", user?.uid, "playlists", playlistId);
    deleteDoc(docRef);
    emptyPlaylist()
  }
  playlists.forEach((e)=>{
    if(e.id!==playlistId){
        setPlaylist(e)
    }
  })
}
