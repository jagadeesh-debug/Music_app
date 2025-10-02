import { useEffect } from "react";

export default function useKeyboardShortcuts(actions) {
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (!event.ctrlKey) return;
      switch (event.code) {
        case "ArrowRight": // Next track
          event.preventDefault();
          actions.nextTrack();
          break;
        case "ArrowLeft": // Previous track
          event.preventDefault();
          actions.prevTrack();
          break;
        case "ArrowUp": // Volume up
          event.preventDefault();
          actions.increaseVolume();
          break;
        case "ArrowDown": // Volume down
          event.preventDefault();
          actions.decreaseVolume();
          break;
        default:
          if (event.ctrlKey) {
            switch (event.code) {
              case "Space": // Ctrl + Space → Play/Pause
                event.preventDefault();
                actions.togglePlayPause();
                break;
              case "KeyM": // Ctrl + M → Mute toggle
                event.preventDefault();
actions.toggleMute();
                break;
              case "KeyH": // Ctrl + H → Shuffle toggle
                event.preventDefault();
                actions.toggleShuffle();
                break;
              default:
                break;
            }
          }
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [actions]);
}
