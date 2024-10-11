import React, { useEffect, useState }  from "react";
import { useLocation } from "react-router-dom";
import Api from "../../../Api";
import { Card, CardContent } from '../../../components/ui/card';
import { getImageColors } from "../../color/ColorGenrator";
import { ScrollArea } from "../../../components/ui/scroll-area";
function artist () {
    const [data,setData]= useState()
    const [bgColor,setBgColor] = useState()
    let url = useLocation()
    const artistId = url.search.split('=')[1];
    useEffect(() => {
        const fetching = async () => {
            try {
                const res = await Api(`/api/artists/${artistId}`);
                setData(res.data.data);
                getImageColors(res.data.data.image[2].url)
                .then(({ averageColor, dominantColor })=>{setBgColor({bg1:averageColor,bg2:dominantColor})})
            } catch (error) {
                console.error("Error fetching artist data:", error);
            }
        };
        fetching();
    }, [artistId]);
    
    if(!data){
        return (
            <h1 className=" text-3xl self-center">...Loading</h1>
        )
    }
    return (
        <ScrollArea className="h-[100dvh]">
    <div className="container mx-auto p-4 space-y-6">
      <Card className="overflow-hidden bg-gradient-to-b " style={{background: `linear-gradient(${bgColor?.bg1} 0%,${bgColor?.bg2} 100%)` }}>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-6">
            <img 
              src={data.image[2].url} 
              alt={data.name} 
              className="w-full md:w-48 h-auto rounded-xl object-cover"
            />
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-4">{data.name}</h1>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4 border-t">
        <h2 className="text-2xl font-semibold">Top Songs</h2>
        <ul className="space-y-2">
          {data.topSongs.map((song, index) => (
            <li key={index} className=" rounded-lg hover:bg-secondary transition-colors duration-300">
              <div className="flex items-center justify-between p-3">
                <div className="flex items-center space-x-4">
                  <p className="text-sm">{index+1}.</p>
                  <img className="w-12 h-12 rounded-md" src={song.image[1].url} alt={song.name} />
                  <span className="font-medium">{song.name}</span>
                </div>
                <span className="text-sm text-gray-500">
                  {Math.floor(song.duration/60)}:{(song.duration%60).toString().padStart(2, '0')}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
        
        </ScrollArea>
    )
}

export default artist