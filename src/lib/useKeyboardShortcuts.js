import { useEffect } from "react";

export default function useKeyboardShortcuts(actions) {
  useEffect(() => {
    const handleKeyDown = (event) => {
      switch (event.code) {
        case "Space": // Play/Pause
          event.preventDefault();
          actions.togglePlayPause();
          break;
        case "ArrowRight": // Next track
          actions.nextTrack();
          break;
        case "ArrowLeft": // Previous track
          actions.prevTrack();
          break;
        case "ArrowUp": // Volume up
          actions.increaseVolume();
          break;
        case "ArrowDown": // Volume down
          actions.decreaseVolume();
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [actions]);
}
