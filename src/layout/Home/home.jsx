import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SearchComponent from "./search/Search"
import { Search } from "lucide-react";
import { Input } from "../../components/ui/input";
import MusicPlayer from "../MusicPlayer";
import { Outlet } from "react-router-dom";
import Sidebar from "./search/Sidebar";
import { useRef } from "react";
import { createSearchParams } from "react-router-dom";
export default function home() {
  const [searchTxt , setSearchTxt ] = useState("permish verma")
  const [songId,setSongId] = useState(12345)
  const inputRef= useRef()
  const navigate = useNavigate()
  function handleSubmit(e) {
    e.preventDefault();
    setSearchTxt(inputRef.current.value)
  }
  useEffect(()=>{
    const path={
      pathname:"/search",
      search: createSearchParams({searchTxt, songId}).toString()
    }
    navigate(path)
  },[])
  return (
    <>
<div>
<Sidebar />
  <form className="sticky top-0 z-10 p-4 shadow-md" onSubmit={handleSubmit}>
    <div className="max-w-3xl mx-auto flex justify-center gap-3 bg-background">
      <Input
        placeholder="Search for music..."
        className="text-lg flex-grow"
        ref={inputRef}
      />
      <button type="submit" className="p-2 rounded-full">
        <Search className="w-6 h-6" />
      </button>
    </div>
  </form>
  <Outlet/>
  {/* <SearchComponent search={searchTxt} setSongId={setSongId} /> */}
  <MusicPlayer  />
</div>

    </>
  )
}
