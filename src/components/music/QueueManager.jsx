import React from "react";
import { useStore } from "../../zustand/store";

export default function QueueManager() {
  const { queue, setQueue, setMusicId } = useStore();

  // Remove song from queue
  const removeFromQueue = (index) => {
    setQueue(queue.filter((_, i) => i !== index));
  };

  // Move song in queue (drag and drop)
  const moveSong = (from, to) => {
    const updated = [...queue];
    const [moved] = updated.splice(from, 1);
    updated.splice(to, 0, moved);
    setQueue(updated);
  };

  // Add song to queue (for demo, just a placeholder)
  // Now handled globally via zustand: useStore().addSongToQueue

  // Drag and drop handlers
  const onDragStart = (e, idx) => {
    e.dataTransfer.setData("from", idx);
  };
  const onDrop = (e, idx) => {
    const from = parseInt(e.dataTransfer.getData("from"), 10);
    moveSong(from, idx);
  };

  return (
    <div className="queue-manager">
      <h3>Listening Queue</h3>
      <ul>
        {queue.map((song, idx) => (
          <li
            key={song.id || idx}
            draggable
            onDragStart={e => onDragStart(e, idx)}
            onDragOver={e => e.preventDefault()}
            onDrop={e => onDrop(e, idx)}
            style={{ display: "flex", alignItems: "center", gap: 8 }}
          >
            <span style={{ flex: 1 }}>{song.title || song.name}</span>
            <button onClick={() => setMusicId(song.id)}>Play</button>
            <button onClick={() => removeFromQueue(idx)}>Remove</button>
          </li>
        ))}
      </ul>
  {/* Example add button removed; use 'Add to Queue' in song list */}
    </div>
  );
}
