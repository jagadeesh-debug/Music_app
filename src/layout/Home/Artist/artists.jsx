import Api from "../../../Api";
import React, { useEffect, useState } from "react";
import {ScrollArea} from "../../../components/ui/scroll-area"
import { useNavigate , createSearchParams  } from "react-router-dom";
function RandomArtists ({search}){
  const navigate = useNavigate();
    const [artists,setArtists] = useState([])
    useEffect(()=>{
        const artist = async () => {
            try{
          const res = await Api.get(`/api/search/artists?query=${search||"top artists"} `)
          const data = res.data.data.results;
           if(data) setArtists(data)
            } catch{(error)=>{
                console.log(error)
            }}
            
        }
        artist()
    },[])
    function handleClick (Id) { 
      const path = {
        pathname:"/artist",
        search:createSearchParams({Id}).toString()
      }
      navigate(path)
    }
    return (
      <div className=" mt-4 border rounded-xl p-4 ">
        <h2 className="text-2xl font-bold mb-4">Arist</h2>
      <div className="flex space-x-4 px-4 overflow-x-scroll">
        {artists?.map((artist, i) => (
          <div 
            key={i} 
            className="flex-none w-40 group bg-secondary"
            onClick={() => handleClick(artist.id)}
          >
            <div className="flex flex-col items-center aspect-square mb-2 overflow-hidden rounded-lg">
              <img
                src={artist.image[2].url}
                alt={artist.name}
                className="w-32 h-32 object-cover rounded-lg mt-2 transition-transform duration-200 group-hover:scale-105"
              />
            </div>
            <h3 className="text-sm font-medium truncate text-center">
              {artist.name}
            </h3>
          </div>
        ))}
      </div>
    </div>
    )
}
export default RandomArtists