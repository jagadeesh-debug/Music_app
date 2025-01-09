import { create } from "zustand";
import Api from "@/api/jiosavan";


export const useFetch = create((set) => ({
  songs: null,
  albums: null,
  artists: null,
  Topresult: null,
  setTopresult: (props) => set({ Topresult: props }),
  fetchSongs: async (search) => {
    try {
      const res = await Api(`/api/search/songs?query=${search}`);
        console.log("Fetch res from zustand jiosavan",res.data.data.results)
      if (res.data.data.results[0]) {
        const topResult = res.data.data.results[0];
        set({
          Topresult: topResult,
          songs: res.data.data.results.slice(0, 5),
        });

        // Fetch suggestions for this song
        const suggestionsRes = await fetch(
          `https://jiosaavan-api-2-harsh-patel.vercel.app/api/songs/${topResult.id}/suggestions?limit=30`
        );
        const suggestionsData = await suggestionsRes.json();

        set((state) => ({
          songs: [...state.songs, ...suggestionsData.data],
        }));
      } else {
        set({ songs: false });
      }
    } catch (error) {
      console.error(error);
    }
  },

  fetchAlbums: async (search) => {
    try {
      const res = await Api(`/api/search/albums?query=${search}`);
      if (res.data.data.results[0]) {
        set({ albums: res.data.data.results });
      } else set({ albums: false });
    } catch (error) {
        console.log(error);
    }
  },
  fetchArtists: async (search) => {
    try {
      const res = await Api(
        `/api/search/artists?query=${search || "top artists"} `
      );
      if (res.data.data.results[0]) {
        set({ artists: res?.data?.data?.results });
      } else set({ artists: false });
    } catch (error) {
      console.log(error);
    }
  },
}));

export const useStore = create((set) => ({
  playlist: [],
  musicId: null,
  isPlaying: false,
  queue: [],
  setPlaylist: (prope) =>
    set((state) => ({
      playlist: [...state.playlist, prope],
    })),
  emptyPlaylist: () => set({ playlist: [] }),
  setMusicId: (id) => set({ musicId: id }),
  isUser: false,
  setIsUser: (prop) => set({ isUser: prop }),
  dialogOpen: false,
  setDialogOpen: (prop) => set({ dialogOpen: prop }),
  setIsPlaying: (prop) => set({ isPlaying: prop }),
  setQueue: (prop) => set({ queue: prop }),
}));
