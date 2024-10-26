import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./components/home";
import Artist from "./components/Artist/artist";
import SearchComponent from "./components/search/SearchResult";
import Album from "./components/Album/Album";
import Playlist from "./components/playlist/Playlist";
function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Home />,
      children: [
        {
          path: "/artist",
          element: <Artist />,
        },
        {
          path: "/search",
          element: <SearchComponent />,
        },
        {
          path: "/album",
          element: <Album />,
        },
        {
          path: "/playlist",
          element: <Playlist />,
        },
      ],
    },
  ]);

  return <RouterProvider router={router}></RouterProvider>;
}

export default App;
