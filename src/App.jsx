import RandomArtists from "./layout/Home/artists";
import { createBrowserRouter, createRoutesFromElements,Route, RouterProvider } from "react-router-dom";
import Home from "./layout/Home/home";
import Artist from "./layout/Home/artist";
function App() {

 const router = createBrowserRouter([
  {
    path:"/",
    element:<Home/>
  },
  {
    path:"/artist",
    element:<Artist/>
  }
 ])

  return (
    <RouterProvider  router={router}></RouterProvider>
  );
}

export default App;
