"use client"
import goBackendApi from "@/api/gobackend";
import { song } from "@/app/app/page";
import { songMusicPlayerInterface, useMusicPlayerStore } from "@/zustand/golang";
import Image from "next/image";

interface resData {
  downloadurl: string;
  image: string;
  name: string;
  yturl: string;
  ytid: string
}

export const SongCard = ({ data }: { data: song }) => {
    const { musicID, setSongData } =
      useMusicPlayerStore();
    let songData: songMusicPlayerInterface

    // const handleClick = () => {
    //   console.log(songData)
    //   setSongData(songData);
    // }

    const handleHover = () => {
      if (data.source === "jiosavan" && data.downloadurl !== ""){
        songData = songToSongMusicPlayerInterface(data)
        setSongData(songData)
      }
      else {
        goBackendApi("/fchytsong?name=" + data.name + data.artist[0]).then((res) => {
          const responseData:resData = res.data
          console.log(decodeURL(data.downloadurl))
          songData = songToSongMusicPlayerInterface({
            id: data.id,
            name: data.name,
            artist: data.artist,
            images: data.images,
            source: "yt",
            downloadurl: decodeURL(responseData.downloadurl)
          })
          setSongData(songData)
        }).catch((e)=>console.log(e))
      }
    };
    return (
      <div
        className={` ${
          data.id === musicID ? "bg-secondary" : "bg-background"
        } flex flex-col items-center justify-between p-2 sm:p-3 rounded-lg transition-all hover:bg-secondary hover:scale-[1.03] duration-200 w-64 hover:cursor-pointer`}
        onClick={handleHover}
        // onMouseEnter={handleHover}
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
  
  const songToSongMusicPlayerInterface = (song: song)=> {
    const songMusicPlayerObj: songMusicPlayerInterface = {
      id: song.id,
      name: song.name,
      artist: song.artist,
      images: song.images,
      downloadurl: song.downloadurl
    }
    return songMusicPlayerObj
  }
  function decodeURL(encodedURL: string) {
    try {
      // Replace Unicode escape sequences with their actual characters
      const decodedURL = encodedURL.replace(/\\u([0-9A-Fa-f]{4})/g, (match, group) => {
        return String.fromCharCode(parseInt(group, 16));
      });
      return decodedURL;
    } catch (error) {
      console.error("Error decoding the escaped URL:", error);
      return encodedURL; // Return the original URL if decoding fails
    }
  }