import React, { useEffect } from "react";
import { app, db } from "../../Auth/firebase";
import { getAuth } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useLocation } from "react-router-dom";
export default function Plylistinfo() {
  const url = useLocation();
  const playlistId = url?.search.split("=")[1];
  const user = getAuth(app).currentUser;

  useEffect(() => {
    async function getFireStore() {
      const docRef = doc(db, "users", user?.uid, "playlists", playlistId);
      const data = await getDoc(docRef);
      if (data.exists()) {
        console.log(data.data());
      }
    }
    getFireStore();
    console.log("nothing");
  }, [user]);
  return <div></div>;
}
