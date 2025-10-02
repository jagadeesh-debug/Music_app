import { useState, useRef, useEffect } from "react";
import { Play, Pause, SkipBack, SkipForward, Volume1, Volume2, VolumeX, Shuffle } from "lucide-react";
import ReactPlayer from "react-player";
import Api from "../../Api";
import { getImageColors } from "../color/ColorGenrator";
import { Drawer, DrawerContent, DrawerTrigger, DrawerTitle } from "../ui/drawer";
import { Button } from "../ui/button";
import { useStore, useFetch } from "../../zustand/store";
import useKeyboardShortcuts from "../../lib/useKeyboardShortcuts";

function MusicPlayer() {
  const [volume, setVolume] = useState(localStorage.getItem("volume") ? parseFloat(localStorage.getItem("volume")) : 0.5);
  const [muted, setMuted] = useState(false);
  const [played, setPlayed] = useState(0);
  const [duration, setDuration] = useState(0);
  const [bgColor, setBgColor] = useState();
  const [shuffle, setShuffle] = useState(false);
  const [musicPlayerDrawer, setMusicPlayerDrawer] = useState(false);
  const playerRef = useRef(null);
  const [song, setSong] = useState();
  const { songs } = useFetch();
  const { musicId, isPlaying, setIsPlaying, setMusicId, setQueue, queue } = useStore();

  // Keyboard shortcuts
  useKeyboardShortcuts({
    togglePlayPause: () => setIsPlaying((prev) => !prev),
    nextTrack: () => handleNext(),
    prevTrack: () => handlePrevious(),
    increaseVolume: () => {
      setMuted(false);
      setVolume((v) => {
        const newVol = Math.min(1, v + 0.1);
        localStorage.setItem("volume", newVol);
        return newVol;
      });
    },
    decreaseVolume: () => {
      setMuted(false);
      setVolume((v) => {
        const newVol = Math.max(0, v - 0.1);
        localStorage.setItem("volume", newVol);
        return newVol;
      });
    },
    toggleMute: () => setMuted((prev) => !prev),
    toggleShuffle: () => setShuffle((prev) => !prev),
  });

  // Fetch song when musicId changes
  useEffect(() => {
    async function fetchSong() {
      if (!musicId) return;
      try {
        const res = await Api(`/api/songs/${musicId}`);
        const songData = res.data?.data?.[0];
        setSong(songData);
        if (songData?.image?.[2]?.url) {
          getImageColors(songData.image[2].url).then(({ averageColor, dominantColor }) => {
            setBgColor({ bg1: averageColor, bg2: dominantColor });
          });
        }
        setIsPlaying(true);
      } catch (error) {
        console.log(error);
      }
    }
    fetchSong();
  }, [musicId]);

  // Set queue when songs change
  useEffect(() => setQueue(songs), [songs]);

  // Handlers
  const handlePlayPause = () => setIsPlaying(!isPlaying);

  const handleVolumeChange = (e) => {
    const val = parseFloat(e.target.value);
    localStorage.setItem("volume", val);
    setVolume(val);
    setMuted(false);
  };


  const handleProgress = (state) => {
    setPlayed(state.played);
    if (duration * state.played >= duration) {
      if (shuffle) {
        const randomSong = queue[Math.floor(Math.random() * queue.length)];
        setMusicId(randomSong.id);
      } else {
        const currentIndex = queue.findIndex((e) => e.id === musicId);
        if (currentIndex < queue.length - 1) setMusicId(queue[currentIndex + 1].id);
      }
    }
  };

  const handleDuration = (duration) => setDuration(duration);

  const handleSeekChange = (e) => setPlayed(parseFloat(e.target.value));

  const handleSeekMouseUp = (e) => {
    let seekValue;
    if (e.type === "touchend") {
      const touch = e.changedTouches[0];
      const target = document.elementFromPoint(touch.clientX, touch.clientY);
      if (target && target.value) seekValue = parseFloat(target.value);
    } else {
      seekValue = parseFloat(e.target.value);
    }
    if (seekValue !== undefined) playerRef.current.seekTo(seekValue);
  };

  const handleNext = () => {
    if (shuffle) {
      const randomSong = queue[Math.floor(Math.random() * queue.length)];
      setMusicId(randomSong.id);
      return;
    }
    const currentIndex = queue.findIndex((e) => e.id === musicId);
    if (currentIndex < queue.length - 1) setMusicId(queue[currentIndex + 1].id);
  };

  const handlePrevious = () => {
    if (shuffle) {
      const randomSong = queue[Math.floor(Math.random() * queue.length)];
      setMusicId(randomSong.id);
      return;
    }
    const currentIndex = queue.findIndex((e) => e.id === musicId);
    if (currentIndex > 0) setMusicId(queue[currentIndex - 1].id);
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const VolumeIcon = muted || volume === 0 ? VolumeX : volume > 0.5 ? Volume2 : Volume1;

  return (
    <>
      <Drawer open={musicPlayerDrawer} onOpenChange={setMusicPlayerDrawer}>
        <DrawerTrigger asChild>
          <Button
            variant="outline"
            className={`absolute right-6 bottom-6 p-0 h-16 w-16 ${isPlaying ? "animate-spin" : ""} rounded-full`}
          >
            <img className="rounded-full" src={song?.image?.[1]?.url} alt="Song" loading="lazy" />
          </Button>
        </DrawerTrigger>
        <DrawerContent className="h-[15dvh]">
          <DrawerTitle hidden />
          <div
            className="h-full fixed bottom-0 left-0 right-0 text-white p-4"
            style={{ background: `linear-gradient(${bgColor?.bg1} 0%, ${bgColor?.bg2} 100%)` }}
          >
            <div className="max-w-screen-lg mx-auto">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <img src={song?.image?.[2]?.url} alt={song?.name} loading="lazy" className="w-12 h-12 rounded-md shadow-lg" />
                  <div>
                    <h3 className="text-sm font-semibold bg-gray-200/20 px-2 rounded-md">{song?.name}</h3>
                    <p className="text-xs text-gray-400">{song?.artist}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <button onClick={() => setShuffle(!shuffle)} className={`${shuffle ? "text-secondary" : "text-white"}`}>
                    <Shuffle className="w-5 h-5" />
                  </button>
                  <button className="focus:outline-none" onClick={handlePrevious}>
                    <SkipBack className="w-5 h-5" />
                  </button>
                  <button onClick={handlePlayPause} className="focus:outline-none bg-white text-black rounded-full p-2">
                    {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
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
                      background: `linear-gradient(to right, #1db954 0%, #1db954 ${played * 100}%, #4B5563 ${played * 100}%, #4B5563 100%)`,
                    }}
                  />
                </div>
                <span className="text-xs">{formatTime(duration)}</span>
                <div className="flex items-center space-x-2">
                  <button onClick={handleToggleMute} className="focus:outline-none">
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
                      background: `linear-gradient(to right, #1db954 0%, #1db954 ${volume * 100}%, #4B5563 ${volume * 100}%, #4B5563 100%)`,
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
        url={song?.downloadUrl?.[4]?.url || ""}
        playing={isPlaying}
        volume={muted ? 0 : volume}
        onProgress={handleProgress}
        onDuration={handleDuration}
        width="0"
        height="0"
      />
    </>
  );
}

export default MusicPlayer;
