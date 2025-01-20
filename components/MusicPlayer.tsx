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
import { getImageColors } from "@/utils/ColorGenrator";
import {
  Drawer,
  DrawerContent,
  DrawerTrigger,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import {
  songMusicPlayerInterface,
  useMusicPlayerStore,
} from "@/zustand/golang";
import Image from "next/image";
import { OnProgressProps } from "react-player/base";

let vol = 0
if (typeof window !== 'undefined') {
  vol = (
    localStorage.getItem("volume") === null ? 0.4 : localStorage.getItem("volume")
  ) as number;
}

function MusicPlayer() {
  const [volume, setVolume] = useState<number>(vol);
  const [muted, setMuted] = useState(false);
  const [played, setPlayed] = useState(0);
  const [duration, setDuration] = useState(0);
  const [bgColor, setBgColor] = useState<{ bg1: string; bg2: string }>();
  const [shuffle, setShuffle] = useState(false);
  const [song, setSong] = useState<songMusicPlayerInterface>();
  const playerRef = useRef<ReactPlayer>(null);
  const { musicID, songData, setSongData, setIsPlaying, isPlaying, queue } =
    useMusicPlayerStore();

  useEffect(() => {
    if (songData.id !== "") {
      console.log(songData)
      setSong(songData);
      getImageColors(songData?.images[2]?.url).then(
        ({ averageColor, dominantColor }) => {
          setBgColor({ bg1: averageColor, bg2: dominantColor });
        }
      );
      setIsPlaying(true);
    }

    return () => {
      setIsPlaying(false);
      setPlayed(0);
      setDuration(0);
      setSong(undefined);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [songData]);

  const handleOnMusicStart = () => {
    console.log("Playing");
    setIsPlaying(true);
  };
  const handleOnMusicStop = () => {
    console.log("Stopped!");
    setIsPlaying(false);
  };
  const handlePlayBtnIcon = () => {
    setIsPlaying(!isPlaying);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    localStorage.setItem("volume", String(Number(e.target.value)));
    setVolume(parseFloat(e.target.value));
    setMuted(false);
  };

  const handleToggleMute = () => {
    return setMuted((prev) => !prev);
  };

  const handleProgress = (state: OnProgressProps) => {
    setPlayed(state.played);
    if (duration * state.played == duration) {
      queue.forEach((e, i) => {
        if (i === queue.length - 1) return;
        if (shuffle)
          setSongData(queue[Math.floor(Math.random() * queue.length)]);
        if (e.id === musicID) {
          setSongData(queue[i + 1]);
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
      if (shuffle) setSongData(queue[Math.floor(Math.random() * queue.length)]);
      if (e.id === musicID) {
        setSongData(queue[i + 1]);
      }
    });
  }

  function handlePrevios() {
    queue.forEach((e, i) => {
      if (i === 0) return;
      if (shuffle) setSongData(queue[Math.floor(Math.random() * queue.length)]);
      if (e.id === musicID) {
        setSongData(queue[i - 1]);
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

  if(song?.id === ""){
    return
  }
  else
  return (
    <>
      <Drawer>
        <DrawerTrigger asChild>
          <Button
            variant="outline"
            className={` absolute right-6 bottom-6 p-0 [animation-duration:5s] ${
              isPlaying ? "animate-spin" : ""
            } rounded-full`}
          >
            {song?.images[1]?.url && (
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
                  {song?.images[2]?.url && (
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
                    <p className="text-xs text-gray-100">{song?.artist?.toLocaleString()}</p>
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
                    {isPlaying ? (
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
      {song !== undefined && (
        <ReactPlayer
          ref={playerRef}
          url={song.downloadurl}
          playing={isPlaying}
          volume={muted ? 0 : volume}
          onProgress={handleProgress}
          onDuration={handleDuration}
          onPlay={handleOnMusicStart}
          onPause={handleOnMusicStop}
          controls
          stopOnUnmount={true}
          width="0"
          height="0"
        />
      )}
    </>
  );
}

export default MusicPlayer;
