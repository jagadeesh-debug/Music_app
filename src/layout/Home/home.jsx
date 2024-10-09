import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import SearchComponent from "./search/Search"
import { Search } from "lucide-react";
import { Input } from "../../components/ui/input";
import MusicPlayer from "../MusicPlayer";
import { Outlet } from "react-router-dom";
import Sidebar from "./search/Sidebar";
import { useRef } from "react";
export default function home() {
  const [searchTxt , setSearchTxt ] = useState("I guess")
  const [songId,setSongId] = useState()
  const inputRef= useRef()
  function handleSubmit(e) {
    e.preventDefault();
    setSearchTxt(inputRef.current.value)
  }
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
  <SearchComponent search={searchTxt} setSongId={setSongId} />
  <MusicPlayer songId={songId} />
</div>

    </>
  )
}
