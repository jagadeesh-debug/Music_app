import React, { useEffect, useState } from "react";
import { Play, Plus, MoreHorizontal, Clock, Pause } from "lucide-react";
import { useLocation } from "react-router-dom";
import Api from "../../Api";
import { useStore } from "../../zustand/store";
import { getImageColors } from "../color/ColorGenrator";
import { ScrollArea } from "../ui/scroll-area";
import Menu from "../Menu";
export default function Album() {
  const [albumData, setAlbumData] = useState(null);
  const url = useLocation();
  const { setMusicId, musicId, isPlaying, setIsPlaying, setQueue } = useStore();
  const albumId = url?.search.split("=")[1];
  const [songs, setSongs] = useState(null);
  const [bgColor, setBgColor] = useState();
  useEffect(() => {
    const fetching = async () => {
      try {
        const res = await Api(`/api/albums?id=${albumId}`);
        setAlbumData(res.data.data);
        setSongs(res.data.data.songs);
        setQueue(res.data.data.songs);
        getImageColors(res.data.data.image[2].url).then(
          ({ averageColor, dominantColor }) => {
            setBgColor({ bg1: averageColor, bg2: dominantColor });
          }
        );
      } catch (error) {
        console.log(error);
      }
    };
    fetching();
  }, [albumId]);
  function handleSongClick(song) {
    if (song.id !== musicId) {
      setMusicId(song.id);
    } else {
      setIsPlaying(true);
    }
  }
  return (
    <ScrollArea className="h-[100dvh]">
      <div
        className="text-white p-4 sm:p-8 font-sans mb-[15dvh]"
        style={{
          background: `linear-gradient(${bgColor?.bg1} 0%, ${bgColor?.bg2} 100%)`,
        }}
      >
        {/* Album Header */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:space-x-6 mb-8">
          <img
            src={albumData?.image[2].url}
            alt="Album cover"
            className="w-32 h-32 sm:w-48 sm:h-48 rounded-lg shadow-lg mb-4 sm:mb-0"
            loading="lazy"
          />
          <div>
            <h1 className="text-2xl sm:text-7xl font-bold mb-2 sm:mb-4">
              {albumData?.name}
            </h1>
            <p className="text-sm">{albumData?.description}</p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center space-x-4 mb-8">
          <button className="bg-white text-black rounded-full p-3">
            <Play size={24} />
          </button>
          <button className="border border-gray-400 rounded-full p-2">
            <Plus size={20} />
          </button>
          <button className="text-gray-400">
            <MoreHorizontal size={24} />
          </button>
        </div>

        {/* Songs List Header */}
        <div className="grid grid-cols-[auto_1fr_auto_auto] gap-4 px-4 mb-2 text-gray-400 text-sm">
          <div>#</div>
          <div>Title</div>
          <div className="text-right mr-12">
            <Clock size={16} />
          </div>
        </div>

        {/* Songs List */}
        <div className="space-y-1">
          {songs?.map((song, index) => (
            <div className={`flex items-center gap-4 pl-3 py-1 sm:py-2 hover:bg-secondary transition-all duration-300 rounded-lg cursor-pointer ${song.id===musicId? "bg-secondary":"bg-background"}`}>
              <div className="text-sm font-medium">{index + 1}.</div>
              <div className="flex-1">
                <p className="font-medium truncate w-24">{song.name}</p>
              </div>
              <div>
                {isPlaying && song.id === musicId ? (
                  <Pause
                    className="w-4 h-4 sm:w-5 sm:h-5 cursor-pointer text-primary"
                    onClick={() => setIsPlaying(false)}
                  />
                ) : (
                  <Play
                    className="w-4 h-4 sm:w-5 sm:h-5 cursor-pointer text-primary"
                    onClick={() => handleSongClick(song)}
                  />
                )}
              </div>
              <div className="text-right text-sm text-gray-400">
                {Math.floor(song.duration / 60)}:
                {(song.duration % 60).toString().padStart(2, "0")}
              </div>
              <div>
                <Menu song={song} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </ScrollArea>
  );
}
