import { create } from "zustand";
// import Api from "@/api/jiosavan";

interface MusicPlayerState {
  isPlaying: boolean;
  setIsPlaying: (isPlaying: boolean) => void;
  queue: songMusicPlayerInterface[];
  addToQueue: (song: songMusicPlayerInterface) => void;
  musicID: string;
  // setMusicID: (id: string) => void;
  // musicName: string;
  // setMusicName: (name: string) => void;
  // musicUrl: string;
  // setMusicUrl: (name: string) => void;
  songData: songMusicPlayerInterface;
  setSongData: (s: songMusicPlayerInterface) => void;
}

export interface songMusicPlayerInterface {
  id: string;
  name: string;
  images: SpotifyImages[];
  downloadurl: string;
  artist: string[]
}

export interface playlist {
  name: string;
  id: string;
  tracks: SpotifyPlaylistTracks[];
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
  // setMusicID: (id) => set({ musicID: id }),
  isPlaying: false,
  setIsPlaying: (isPlaying) => set({ isPlaying }),
  queue: [],
  addToQueue: (song) => set((state) => ({ queue: [...state.queue, song] })),
  // musicName: "",
  // setMusicName: (name) => set({ musicName: name }),
  // musicUrl: "",
  // setMusicUrl: (name) => set({ musicUrl: name }),
  songData: {artist: [],id: "",images: [],name: "",downloadurl: ""},
  setSongData: (s)=>set({songData: s,musicID: s.id})
}));

// interface FetchState {
//     fetchSong: (id: string) => void;
// }

// export const useFetchStore = create<FetchState>()((set) => ({
//    fetchSong: async (id) => {
//     const song = await Api.get("")
//    }
// }))
