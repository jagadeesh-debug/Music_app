import { useEffect } from "react";

export default function useKeyboardShortcuts(actions) {
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (!event.ctrlKey) return; // Only respond if Ctrl is pressed

      switch (event.code) {
        case "Space": // Ctrl + Space → Play/Pause
          event.preventDefault();
          actions.togglePlayPause();
          break;

        case "KeyN": // Ctrl + N → Next track
          event.preventDefault();
          actions.nextTrack();
          break;

        case "KeyP": // Ctrl + P → Previous track
          event.preventDefault();
          actions.prevTrack();
          break;

        case "KeyU": // Ctrl + U → Volume up
          event.preventDefault();
          actions.increaseVolume();
          break;

        case "KeyD": // Ctrl + D → Volume down
          event.preventDefault();
          actions.decreaseVolume();
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
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [actions]);
}
