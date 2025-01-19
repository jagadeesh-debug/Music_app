"use client";

import goBackendApi from "@/api/gobackend";
import { playlist, song, useMusicPlayerStore } from "@/zustand/golang";
import Image from "next/image";
import { useEffect, useState } from "react";

interface respSuggestion {
  tracks: song[];
  playlist: playlist[];
}

const fetchSuggestions = async () => {
  const res = await goBackendApi.get("/homesuggestion?query=trendsong");
  const data: respSuggestion = res.data;
  return data;
};

const Page = () => {
  const [songs, setSongs] = useState<song[]>([]);
  // const [playlists, setPlaylists] = useState<playlist[]>([])

  useEffect(() => {
    (async () => {
      const data = await fetchSuggestions();
      setSongs(data.tracks);
      // setPlaylists(data.Playlist)
      // console.log(playlists)
    })();
  }, []);

  return (
    <div>
      <h1>Songs</h1>
      <div className="flex flex-wrap">
        {/* <ScrollArea className="min-h-64"> */}
        {songs?.map((song) => (
          <SongCard key={song.id} data={song} />
        ))}
        {/* </ScrollArea> */}
      </div>
    </div>
  );
};

const SongCard = ({ data }: { data: song }) => {
  const { musicID,setMusicName } = useMusicPlayerStore();
const handleClick = () => { 
  setMusicName(data.name)
}
  return (
    <div
      className={` ${
        data.id === musicID ? "bg-secondary" : "bg-background"
      } flex flex-col items-center justify-between p-2 sm:p-3 rounded-lg transition-all hover:bg-secondary hover:scale-[1.03] duration-200 w-64 hover:cursor-pointer`}
    onClick={handleClick}
    >
        <Image
          src={data.images[2].url}
          alt={data.name}
          width={data.images[2].width}
          height={data.images[2].height}
          className="rounded-lg"
        />
        <p>{data.name}</p>
    </div>
  );
};

export default Page;
