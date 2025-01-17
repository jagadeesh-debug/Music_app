"use client"

import goBackendApi from "@/api/gobackend";
import { playlist, song } from "@/zustand/golang";
import { useEffect, useState } from "react";

interface respSuggestion {
  Tracks: song[]
  Playlist: playlist[]
}

const fetchSuggestions = async ()=> {
  const res = await goBackendApi.get("/homesuggestion?query=trendsong2025")
  const data: respSuggestion = res.data
  return data
}

const Page = () => {
  const [songs, setSongs] = useState<song[]>([])
  const [playlists, setPlaylists] = useState<playlist[]>([])

  useEffect(()=>{
    (async() =>{
      const data = await fetchSuggestions()
      setSongs(data.Tracks)
      setPlaylists(data.Playlist)
      // console.log(playlists)
    })()
  },[])

  return <div>
    <h1>Songs</h1>
    <div>
      {songs?.map((song: song)=> <SongCard key={song.Id} data={song}/>)}
    </div>
    </div>
};

const SongCard = ({data}: {data: song})=>{
  console.log(data.Images)
  return <div>Card</div>
}

export default Page;