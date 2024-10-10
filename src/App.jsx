
import { createBrowserRouter, createRoutesFromElements,Route, RouterProvider } from "react-router-dom";
import Home from "./layout/Home/home";
import Artist from "./layout/Home/Artist/artist";
import Search from "./layout/Home/search/Search";
import MusicPlayer from "./layout/MusicPlayer";
import Album from "./layout/Home/Album/Album";

function App() {

 const router = createBrowserRouter([
  {
    path:"/",
    element:<Home/>,
    children:[
      {
        path:"/artist",
        element:<Artist/>
      },
      {
        path:"/search",
        element:<Search/>
      },
      {
        path: "/album",
        element : <Album/>
      }
    ]
  },
 ])

  return (
    <RouterProvider  router={router}></RouterProvider>
  );
}

export default App;
