import { create } from "zustand";
// import Api from "@/api/jiosavan";

interface MusicPlayerState {
  musicID: string;
  setMusicID: (id: string) => void;
  isPlaying: boolean;
  setIsPlaying: (isPlaying: boolean) => void;
  queue: song[];
  addToQueue: (song: song) => void;
  musicName: string
  setMusicName: (name: string) => void;
}

export interface song {
    name: string;
    id: string;
    images: SpotifyImages[];
    source: "jiosavan" | "yt";
    downloadUrl: string
}

export interface playlist {
    name: string;
    id: string;
    tracks: SpotifyPlaylistTracks[]
    images: SpotifyImages[];
}

interface SpotifyPlaylistTracks {
    endpoint: string;
    total: number;
}

export interface SpotifyImages {
    height: number;
    width: number;
    url: string;
}

export const useMusicPlayerStore = create<MusicPlayerState>()((set) => ({
    musicID: "",
    setMusicID: (id) => set({ musicID: id }),
    isPlaying: false,
    setIsPlaying: (isPlaying) => set({ isPlaying }),
    queue: [],
    addToQueue: (song) => set((state) => ({ queue: [...state.queue, song] })),
    musicName: "",
    setMusicName: (name) => set({ musicName: name }),
}));

// interface FetchState {
//     fetchSong: (id: string) => void;
// }
  
// export const useFetchStore = create<FetchState>()((set) => ({
//    fetchSong: async (id) => {
//     const song = await Api.get("")
//    }
// }))
