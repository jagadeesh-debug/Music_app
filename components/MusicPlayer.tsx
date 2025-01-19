"use client";
import { useState, useRef, useEffect } from "react";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume1,
  Volume2,
  VolumeX,
  Shuffle,
} from "lucide-react";
import ReactPlayer from "react-player";
import Api from "@/api/jiosavan";
import { getImageColors } from "@/utils/ColorGenrator";
import {
  Drawer,
  DrawerContent,
  DrawerTrigger,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { SpotifyImages, useMusicPlayerStore } from "@/zustand/golang";
import Image from "next/image";
import { OnProgressProps } from "react-player/base";

export interface song {
  name: string;
  id: string;
  images: SpotifyImages[];
  source: "jiosavan" | "yt";
  downloadUrl: string;
  artist: string[]
}

const vol = (
  localStorage.getItem("volume") === null ? 0.4 : localStorage.getItem("volume")
) as number;

function MusicPlayer() {
  const [volume, setVolume] = useState<number>(vol);
  const [muted, setMuted] = useState(false);
  const [played, setPlayed] = useState(0);
  const [duration, setDuration] = useState(0);
  const [bgColor, setBgColor] = useState<{bg1: string,bg2: string}>();
  const [shuffle, setShuffle] = useState(false);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [song, setSong] = useState<song>();
  const playerRef = useRef<ReactPlayer>(null);
  const { musicID, setMusicID, setIsPlaying, queue, setMusicName } =
    useMusicPlayerStore();

  useEffect(() => {
    async function fetchSong() {
      if (musicID) {
        try {
          const res = await Api(`/api/songs/${musicID}`);
          setSong(res.data.data[0]);
          getImageColors(res.data.data.results[0].image[2].url).then(
            ({ averageColor, dominantColor }) => {
              setBgColor({ bg1: averageColor, bg2: dominantColor });
            }
          );
          setIsPlaying(true);
        } catch (error) {
          console.log(error);
        }
      }
    }
    fetchSong();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [musicID]);

  // useEffect(() => {
  //   setQueue(songs);
  // }, [songs]);

  const handleOnMusicStart = () => {
    setIsPlaying(true);
    setIsMusicPlaying(true);
  };
  const handleOnMusicStop = () => {
    setIsMusicPlaying(false);
    setIsPlaying(false);
  };
  const handlePlayBtnIcon = ()=> {
    setIsMusicPlaying((prev)=> !prev)
    setIsPlaying(!isMusicPlaying)
  }

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    localStorage.setItem("volume", String(Number(e.target.value)));
    setVolume(parseFloat(e.target.value));
    setMuted(false);
  };
  const handleToggleMute = () => {
    return setMuted(!muted);
  };
  const handleProgress = (state: OnProgressProps) => {
    setPlayed(state.played);
    if (duration * state.played == duration) {
      console.log(queue);
      queue.forEach((e, i) => {
        if (i === queue.length - 1) return;
        if (shuffle)
          setMusicName(queue[Math.floor(Math.random() * queue.length)].name);
        if (e.id === musicID) {
          setMusicID(queue[i + 1].id);
        }
      });
    }
  };
  const handleDuration = (duration: number) => setDuration(duration);
  const handleSeekChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setPlayed(parseFloat(e.target.value));
    };
  const handleSeekMouseUp = (
    e: React.MouseEvent<HTMLInputElement> | React.TouchEvent<HTMLInputElement>
  ) => {
    let seekValue;

    // Handle touch events (for mobile)
    if ("changedTouches" in e) {
      const touch = e.changedTouches[0]; // Get the first touch point
      const target = document.elementFromPoint(
        touch.clientX,
        touch.clientY
      ) as HTMLInputElement | null; // Find the element at the touch position
      if (target && target.value) {
        seekValue = parseFloat(target.value); // Get the value from the slider element
      }
    }
    // Handle mouse events (for desktop)
    else {
      seekValue = parseFloat((e.target as HTMLInputElement).value);
    }

    if (seekValue !== undefined) {
      if (playerRef.current) {
        playerRef.current.seekTo(seekValue);
      }
    }
  };

  function handleNext() {
    queue.forEach((e, i) => {
      if (i === queue.length - 1) return;
      if (shuffle)
        setMusicID(queue[Math.floor(Math.random() * queue.length)].id);
      if (e.id === musicID) {
        setMusicID(queue[i + 1].id);
      }
    });
  }

  function handlePrevios() {
    queue.forEach((e, i) => {
      if (i === 0) return;
      if (shuffle)
        setMusicID(queue[Math.floor(Math.random() * queue.length)].id);
      if (e.id === musicID) {
        setMusicID(queue[i - 1].id);
      }
    });
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const VolumeIcon =
    muted || volume === 0 ? VolumeX : volume > 0.5 ? Volume2 : Volume1;
  return (
    <>
      <Drawer>
        <DrawerTrigger asChild>
          <Button
            variant="outline"
            className={` absolute right-6 bottom-6 p-0 [animation-duration:5s] ${
              isMusicPlaying ? "animate-spin" : ""
            } rounded-full`}
          >
            {song?.images[1].url && (
              <Image
                className="rounded-full"
                src={song?.images[1].url}
                // width={song.image[1].width}
                width={64}
                // height={song.image[1].height}
                height={64}
                alt="Song"
                loading="lazy"
              />
            )}
          </Button>
        </DrawerTrigger>
        <DrawerContent className="h-[15dvh]">
          <DrawerTitle hidden></DrawerTitle>
          <div
            className={` h-full fixed bottom-0 left-0 right-0  text-white p-4`}
            style={{
              background: `linear-gradient(${bgColor?.bg1} 0%,${bgColor?.bg2} 100%)`,
            }}
          >
            <div className="max-w-screen-lg mx-auto ">
              <div className="flex items-center justify-between ">
                <div className="flex items-center space-x-4">
                  {song?.images[2].url && (
                    <Image
                      src={song?.images[2].url}
                      alt={song?.name}
                      // width={song.image[2].width}
                      width={48}
                      // height={song.image[2].height}
                      height={48}
                      loading="lazy"
                      className="rounded-md shadow-lg"
                    />
                  )}
                  <div>
                    <h3 className="text-sm font-semibold">{song?.name}</h3>
                    <p className="text-xs text-gray-400">{song?.artist}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() =>
                      shuffle == true ? setShuffle(false) : setShuffle(true)
                    }
                    className={`${shuffle ? "text-secondary" : "text-white"}`}
                  >
                    <Shuffle className="w-5 h-5" />
                  </button>
                  <button
                    className="focus:outline-none"
                    onClick={handlePrevios}
                  >
                    <SkipBack className="w-5 h-5" />
                  </button>
                  <button
                    onClick={handlePlayBtnIcon}
                    className="focus:outline-none bg-white text-black rounded-full p-2"
                  >
                    {isMusicPlaying ? (
                      <Pause className="w-6 h-6" />
                    ) : (
                      <Play className="w-6 h-6" />
                    )}
                  </button>
                  <button className="focus:outline-none" onClick={handleNext}>
                    <SkipForward className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-xs">{formatTime(duration * played)}</span>
                <div className="flex-grow">
                  <input
                    type="range"
                    min={0}
                    max={0.999999}
                    step="any"
                    value={played}
                    onChange={handleSeekChange}
                    onMouseUp={handleSeekMouseUp}
                    onTouchEnd={handleSeekMouseUp}
                    className="w-full h-1 bg-gray-600 rounded-full appearance-none cursor-pointer"
                    style={{
                      background: `linear-gradient(to right, #1db954 0%, #1db954 ${
                        played * 100
                      }%, #4B5563 ${played * 100}%, #4B5563 100%)`,
                    }}
                  />
                </div>
                <span className="text-xs">{formatTime(duration)}</span>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleToggleMute}
                    className="focus:outline-none"
                  >
                    <VolumeIcon />
                  </button>
                  <input
                    type="range"
                    min={0}
                    max={1}
                    step="any"
                    value={volume}
                    onChange={handleVolumeChange}
                    className="w-20 h-1 bg-gray-600 rounded-full appearance-none cursor-pointer"
                    style={{
                      background: `linear-gradient(to right, #1db954 0%, #1db954 ${
                        volume * 100
                      }%, #4B5563 ${volume * 100}%, #4B5563 100%)`,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </DrawerContent>
      </Drawer>
      <ReactPlayer
        ref={playerRef}
        url={song?.downloadUrl}
        // url={"https://delta.123tokyo.xyz/get.php/4/0f/jniYsYN9xe4.mp3?cid=MmEwMTo0Zjg6YzAxMjozMmVlOjoxfE5BfERF&h=24cCxb2MlEou8ZVlwZ9smQ&s=1737198021&n=HIRAKO%20SHINJI%20x%20TURU%20R9%20%28Ultra%20Slowed%20%26%20BassBoosted%29&uT=R&uN=Y29kZWJ1c3RlcnM%3D"}
        playing={isMusicPlaying}
        volume={muted ? 0 : volume}
        onProgress={handleProgress}
        onDuration={handleDuration}
        onStart={handleOnMusicStart}
        onPause={handleOnMusicStop}
        width="0"
        height="0"
      />
    </>
  );
}

export default MusicPlayer;
