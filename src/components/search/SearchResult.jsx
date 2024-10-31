import React, { useState, useEffect } from "react";
import { Label } from "../ui/label";
import { Card, CardContent } from "../ui/card";
import { PlayCircle, Play, Eye, EllipsisVertical } from "lucide-react";
import { ScrollArea } from "../ui/scroll-area";
import { useNavigate, createSearchParams, useLocation } from "react-router-dom";
import RandomArtists from "../Artist/artists";
import { useFetch, useStore } from "../../zustand/store";
import { pushInDb } from "../../Api";
import {
  Menubar,
  MenubarContent,
  MenubarMenu,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
} from "@/components/ui/menubar";

export default function SearchComponent() {
  const { fetchSongs, songs, fetchAlbums, albums, Topresult, setTopresult } =
    useFetch();
  const { setMusicId, playlist } = useStore();
  const url = useLocation();
  const search = url.search.split("=")[1].replace("+", " ");
  const navigate = useNavigate();
  const [isMenuBar, setIsMenuBar] = useState(false);
  useEffect(() => {
    fetchAlbums(search);
    fetchSongs(search, setMusicId);
  }, [url, search]);
  function handleSongClick(song) {
    setMusicId(song.id);
    setTopresult(song);
  }
  function handleAlbumsClick(Id) {
    const path = {
      pathname: "/album",
      search: createSearchParams({ Id }).toString(),
    };
    navigate(path);
  }
  const formatViews = (views) => {
    if (views == null) return;
    if (views >= 1000000) {
      return `${(views / 1000000).toFixed(1)}M`;
    } else if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}K`;
    }
    return views.toString();
  };
  return (
    <ScrollArea className="h-[90vh] w-[dvw] flex">
      <div className="flex flex-col w-full">
        <div className="max-w-7xl mx-auto sm:p-6 flex-grow">
          <div className="flex flex-col lg:flex-row gap-4  lg:gap-8">
            {songs && (
              <div className="w-[90vw] sm:w-full lg:w-1/3">
                <h2 className="text-xl sm:text-2xl font-bold mb-4">
                  Current Song
                </h2>
                <div className="relative group">
                  <Card>
                    <CardContent className="p-4 sm:p-6">
                      <img
                        src={Topresult?.image[2].url}
                        alt={Topresult?.name}
                        loading="lazy"
                        className="w-full max-w-[200px] sm:max-w-[300px] mx-auto mb-4 rounded shadow-lg"
                      />
                      <div className="space-y-2">
                        <h3 className="text-lg sm:text-xl font-semibold text-center mb-2">
                          {Topresult?.name || "hello"}
                        </h3>

                        {/* Label and View Count Row */}
                        <div className="flex items-center justify-center space-x-4 text-sm text-gray-600">
                          <div className="flex items-center">
                            <span className="bg-gray-200 px-2 py-1 rounded-full text-xs">
                              {Topresult?.label}
                            </span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Eye size={16} />
                            <span>
                              {formatViews(Topresult.playCount)} views
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Play button - static on mobile/tablet, animated on desktop */}
                  <div className="absolute bottom-4 right-4 lg:opacity-0 lg:translate-y-8 lg:scale-75 lg:group-hover:opacity-100 lg:group-hover:translate-y-0 lg:group-hover:scale-100 transition-all duration-300 ease-out">
                    <button
                      onClick={() => {
                        setMusicId(Topresult?.id);
                      }}
                      className="bg-green-500 hover:bg-green-600 text-white p-3 rounded-full shadow-lg transition-colors duration-200"
                    >
                      <Play size={24} />
                    </button>
                  </div>
                </div>
              </div>
            )}
            {songs && (
              <div className="w-[95vw] sm:w-full lg:w-2/3 border rounded-xl p-4">
                <h2 className="text-xl sm:text-2xl font-bold mb-4">Songs</h2>
                <ScrollArea className="h-[40vh] sm:h-[50vh]">
                  <ul className="space-y-2 pr-4">
                    {songs.map((song, index) => (
                      <li
                        key={index}
                        className="flex items-center justify-between p-2 sm:p-3 rounded-lg transition-all hover:bg-secondary hover:scale-[1.03] duration-200 "
                      >
                        <div className="flex items-center space-x-2 sm:space-x-4">
                          <span className="w-4 sm:w-6 text-center text-sm sm:text-base">
                            {index + 1}
                          </span>
                          <img
                            src={
                              song.image
                                ? song.image[2].url
                                : "/api/placeholder/40/40"
                            }
                            alt={song.name}
                            loading="lazy"
                            className="w-8 h-8 sm:w-10 sm:h-10 rounded"
                          />
                          <div>
                            <p className="font-medium text-sm sm:text-base">
                              {song.name}
                            </p>
                            <p className="text-xs sm:text-sm">
                              {song.artists?.primary[0]?.name}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 sm:space-x-4">
                          <span className="text-xs sm:text-sm">
                            {Math.floor(song.duration / 60)}:
                            {(song.duration % 60).toString().padStart(2, "0")}
                          </span>
                          <button className="p-1 sm:p-2 rounded-full">
                            <PlayCircle
                              className="w-4 h-4 sm:w-5 sm:h-5"
                              onClick={() => handleSongClick(song)}
                            />
                          </button>
                          <Menubar>
                            <MenubarMenu>
                              <MenubarTrigger>
                                <EllipsisVertical />
                              </MenubarTrigger>
                              <MenubarContent>
                                <MenubarSub>
                                  <MenubarSubTrigger>
                                    Add to Queue
                                  </MenubarSubTrigger>
                                </MenubarSub>
                                <MenubarSub>
                                  <MenubarSubTrigger>
                                    Add to Playlist
                                  </MenubarSubTrigger>
                                  <MenubarSubContent className="w-52 mr-2">
                                    {playlist.map((list) => (
                                      <div
                                        key={list.id}
                                        className="p-2 rounded-lg  w-full hover:bg-secondary"
                                        onClick={() =>
                                          pushInDb(list.id, song.id)
                                        }
                                      >
                                        {list.data.name}
                                      </div>
                                    ))}
                                  </MenubarSubContent>
                                </MenubarSub>
                              </MenubarContent>
                            </MenubarMenu>
                          </Menubar>
                        </div>
                      </li>
                    ))}
                  </ul>
                </ScrollArea>
              </div>
            )}
          </div>
          {albums && (
            <div className="mt-6 w-[95vw] sm:w-full sm:mt-8 border p-4 rounded-xl">
              <h2 className="text-xl sm:text-2xl font-bold mb-4">Albums</h2>
              <ScrollArea className="w-full">
                <div className="flex gap-4 pb-4 overflow-x-auto">
                  {albums.map((album, index) => (
                    <div
                      onClick={() => handleAlbumsClick(album.id)}
                      key={index}
                      className="bg-secondary rounded-2xl p-3 sm:p-4 flex flex-col items-center flex-shrink-0"
                    >
                      <img
                        src={album.image[2].url}
                        alt={album.name}
                        loading="lazy"
                        className="w-24 h-24 sm:w-32 sm:h-32 object-cover hover:scale-105 transition-all rounded-lg mb-2"
                      />
                      <Label className="text-center w-24 sm:w-32 text-xs sm:text-sm">
                        {album.name}
                      </Label>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          )}
          <RandomArtists search={search} />
        </div>
      </div>
    </ScrollArea>
  );
}
