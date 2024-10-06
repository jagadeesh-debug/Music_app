import Api from "../../Api";
import React, { useEffect, useState } from "react";
import {ScrollArea} from "../../components/ui/scroll-area"
import { useNavigate , createSearchParams  } from "react-router-dom";;
function RandomArtists (){
  const navigate = useNavigate();
    const [artists,setArtists] = useState([])
    useEffect(()=>{
        const artist = async () => {
            try{
          const res = await Api.get('/api/search/artists?query= Top artists ')
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
        <ScrollArea className="h-[250px] w-full rounded-md border p-6">
        <div className="flex flex-wrap  p-4 gap-4 ">
          {artists?.map((artist, i) => (
            <div key={i} className="flex items-center space-x-4 p-2 w-[340px]  rounded-full hover:cursor-pointer hover:bg-secondary" onClick={()=>{handleClick(artist.id)}} >
              <img
                src={artist.image[2].url}
                alt={artist.name}
                className="w-16 h-16 rounded-full object-cover"
              />
              <div className="flex flex-col">
                <h3 className="text-sm font-medium leading-none">{artist.name}</h3>
                <p className="text-sm text-muted-foreground">Artist</p>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    )
}
export default RandomArtists