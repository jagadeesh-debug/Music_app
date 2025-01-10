import { Suspense, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MusicPlayer from "./music/MusicPlayer";
import { Outlet } from "react-router-dom";
import Sidebar from "./search/Sidebar";

import { getAuth, onAuthStateChanged } from "firebase/auth";
import { app } from "../Auth/firebase";
import { useStore } from "../zustand/store";
import InputBar from "./search/InputBar";
import { fetchFireStore } from "../Api";

export default function Home() {
  const navigate = useNavigate();
  const { setIsUser, setPlaylist } = useStore();
  useEffect(() => {
    const auth = getAuth(app);
    const pathName = `/search?searchtxt=${
      localStorage.getItem("search") || "khatta+flow"
    }`;
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsUser(true);
      }
    });
    fetchFireStore(setPlaylist);

    navigate(pathName);
  }, []);
  return (
    <>
      <div className="flex justify-evenly">
        <Sidebar />
        <InputBar />
      </div>
      <Suspense fallback={<div>...Loading</div>}>
        <Outlet />
      </Suspense>
      <MusicPlayer />
    </>
  );
}

// path: "/",
// element: <Home />,
// children: [
//   {
//     path: "/artist",
//     element: <Artist />,
//   },
//   {
//     path: "/search",
//     element: <SearchComponent />,
//   },
//   {
//     path: "/album",
//     element: <Album />,
//   },
//   {
//     path: "/playlist",
//     element: <Plylistinfo />,
//   },