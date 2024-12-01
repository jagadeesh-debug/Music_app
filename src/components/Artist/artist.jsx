import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Api from "../../Api";
import { Card, CardContent } from "../ui/card";
import { getImageColors } from "../color/ColorGenrator";
import { ScrollArea } from "../ui/scroll-area";
import { useStore } from "../../zustand/store";
import { Play, Pause } from "lucide-react";
import Menu from "../Menu";

function Artist() {
  const [data, setData] = useState();
  const [bgColor, setBgColor] = useState();
  let url = useLocation();
  const { setMusicId, musicId, isPlaying, setIsPlaying, setQueue } = useStore();
  const artistId = url.search.split("=")[1];
  useEffect(() => {
    const fetching = async () => {
      try {
        const res = await Api(`/api/artists/${artistId}`);
        setData(res.data.data);
        setQueue(res.data.data.topSongs);
        getImageColors(res.data.data.image[2].url).then(
          ({ averageColor, dominantColor }) => {
            setBgColor({ bg1: averageColor, bg2: dominantColor });
          },
        );
      } catch (error) {
        console.error("Error fetching artist data:", error);
      }
    };
    fetching();
  }, [artistId]);
  function handleSongClick(song) {
    if (song.id !== musicId) {
      setMusicId(song.id);
    } else {
      setIsPlaying(true);
    }
  }

  if (!data) {
    return <h1 className=" text-3xl self-center">...Loading</h1>;
  }
  return (
    <ScrollArea className="h-[100dvh]">
      <div className="container mx-auto p-4 space-y-6 mb-[15dvh]">
        <Card
          className="overflow-hidden bg-gradient-to-b "
          style={{
            background: `linear-gradient(${bgColor?.bg1} 0%,${bgColor?.bg2} 100%)`,
          }}
        >
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-6">
              <img
                src={data.image[2].url}
                alt={data.name}
                loading="lazy"
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
              <li
                key={index}
                className={` ${song.id === musicId ? "bg-secondary" : "bg-background"} rounded-lg hover:bg-secondary hover:scale-105  transition-all duration-300`}
              >
                <div className="flex items-center justify-between py-2 sm:p-3 sm:py-0">
                  <div className="flex items-center space-x-4">
                    <p className="text-sm">{index + 1}.</p>
                    <img
                      className="w-12 h-12 rounded-md"
                      loading="lazy"
                      src={song.image[1].url}
                      alt={song.name}
                    />
                    <span className="font-medium truncate w-24">
                      {song.name}
                    </span>
                  </div>
                  <div className="flex gap-4">
                    <span className="text-sm text-gray-500">
                      {Math.floor(song.duration / 60)}:
                      {(song.duration % 60).toString().padStart(2, "0")}
                    </span>
                    <div>
                      {isPlaying && song.id === musicId ? (
                        <Pause
                          className="w-4 h-4 sm:w-5 sm:h-5 cursor-pointer"
                          onClick={() => setIsPlaying(false)}
                        />
                      ) : (
                        <Play
                          className="w-4 h-4 sm:w-5 sm:h-5 cursor-pointer"
                          onClick={() => handleSongClick(song)}
                        />
                      )}
                    </div>
                    <Menu song={song} />
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </ScrollArea>
  );
}

export default Artist;
