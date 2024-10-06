
import { createBrowserRouter, createRoutesFromElements,Route, RouterProvider } from "react-router-dom";
import Home from "./layout/Home/home";
import Artist from "./layout/Home/Artist/artist";
import Search from "./layout/Home/search/Search";

function App() {

 const router = createBrowserRouter([
  {
    path:"/",
    element:<Home/>
  },
  {
    path:"/artist",
    element:<Artist/>
  },{
    path: "/search",
    element: <Search/>
  }
 ])

  return (
    <RouterProvider  router={router}></RouterProvider>
  );
}

export default App;
