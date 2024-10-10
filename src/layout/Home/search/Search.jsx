import React, { useState, useEffect } from "react";
import Api from "../../../Api";
import { Label } from "../../../components/ui/label";
import { Card , CardContent} from "../../../components/ui/card";
import { PlayCircle } from 'lucide-react';
import { ScrollArea } from "../../../components/ui/scroll-area";
import { useNavigate , createSearchParams, useLocation } from "react-router-dom";
import { useMain } from "../../../Context";
export default function searchComponent() {
  const {setValue} = useMain();
  const url = useLocation()
  const search =url.search.split('=')[1].replace("+"," ")
  const [albums, setAlbums] = useState();
  const [globalResult,setGlobalResult] = useState()
  const [songs,setSongs]= useState()
  // const [songId,setSongId] = useState()
  const navigate =  useNavigate()
  useEffect(()=>{
    async  function  fetchingGlobal() {
      try {
        const res = await Api(`/api/search?query=${search}`)
        setGlobalResult(res.data.data)
      } catch (error) {
        console.log(error);
      }
    }
  
    async  function  fetchingSong() {
      try {
        const res = await Api(`/api/search/songs?query=${search}`)
        setSongs(res.data.data.results)
        setValue(res.data.data.results[0].id)
      } catch (error) {
        console.log(error);
      }
    }
  
   async function fetchingAlbum() {
      try {
        const res = await Api(`/api/search/albums?query=${search}`);
        setAlbums(res.data.data.results)
      } catch (error) {
        console.log(error);
      }
    }
    fetchingGlobal()
    fetchingSong()
    fetchingAlbum()
  },[search])
  function handleSongClick(songId){
    setValue(songId)
  }
  function handleAlbumsClick( Id ){ 
      const   path={
          pathname:"/album",
          search: createSearchParams({Id}).toString()
        }
        navigate(path)
  }

  return (
    <ScrollArea className="h-[80vh] flex">
    <div className="flex-1 flex flex-col">
      <div className="max-w-7xl mx-auto p-6 flex-grow">
        <div className="flex flex-col lg:flex-row gap-8">
          {globalResult && (
            <div className="lg:w-1/3">
              <h2 className="text-2xl font-bold mb-4">Top Result</h2>
              <Card>
                <CardContent className="p-6">
                  <img
                    src={globalResult?.topQuery?.results[0].image[2].url}
                    alt={globalResult?.topQuery?.results[0].title}
                    className="w-full max-w-[250px] mx-auto mb-4 rounded shadow-lg"
                  />
                  <h3 className="text-xl font-semibold text-center mb-2">{globalResult?.topQuery?.results[0].title|globalResult?.songs.results[0].title}</h3>
                  <div className="flex justify-center">
                    <button className="mt-2 p-3 rounded-full">
                      <PlayCircle className="w-8 h-8" />
                    </button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
          {songs && (
            <div className="lg:w-2/3 border rounded-xl p-4">
              <h2 className="text-2xl font-bold mb-4">Songs</h2>
              <ScrollArea className="h-[50vh]">
                <ul className="space-y-2 pr-4">
                  {songs.map((song, index) => (
                    <li key={index} className="flex items-center justify-between p-3 rounded-lg transition-colors hover:bg-secondary" onClick={()=>handleSongClick(song.id)}>
                      <div className="flex items-center space-x-4">
                        <span className="w-6 text-center">{index + 1}</span>
                        <img
                          src={song.image ? song.image[2].url : "/api/placeholder/40/40"}
                          alt={song.name}
                          className="w-10 h-10 rounded"
                        />
                        <div>
                          <p className="font-medium">{song.name}</p>
                          <p className="text-sm">{song.artists.primary[0].name}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span>
                          {Math.floor(song.duration/60)}:{(song.duration%60).toString().padStart(2, '0')}
                        </span>
                        <button className="p-2 rounded-full">
                          <PlayCircle className="w-5 h-5" />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              </ScrollArea>
            </div>
          )}
        </div>
        {albums && (
          <div className="mt-8 border p-4 rounded-xl">
            <h2 className="text-2xl font-bold mb-4">Albums</h2>
              <div className="flex gap-4 pb-4 overflow-x-scroll">
                {albums.map((album, index) => (
                  <div onClick={()=>{handleAlbumsClick(album.id)}} key={index} className="bg-secondary rounded-2xl p-4 flex flex-col items-center flex-shrink-0">
                    <img src={album.image[2].url} alt={album.name} className="w-32 h-32 object-cover rounded-lg mb-2" />
                    <Label className="text-center w-32">{album.name}</Label>
                  </div>
                ))}
              </div>
          </div>
        )}
      </div>
    </div>
  </ScrollArea>
  );
}
