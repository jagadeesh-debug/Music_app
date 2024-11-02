import { create } from "zustand";
import Api from "../Api";
export const useFetch = create((set) => ({
  songs: null,
  albums: null,
  artists: null,
  Topresult: null,
  setTopresult: (props) => set({ Topresult: props }),
  fetchSongs: async (search, musicId) => {
    try {
      const res = await Api(`/api/search/songs?query=${search}`);
      if (res.data.data.results[0]) {
        set({
          songs: res.data.data.results,
          Topresult: res?.data?.data?.results[0],
        });
      } else set({ songs: false });
    } catch (error) {}
  },
  fetchAlbums: async (search) => {
    try {
      const res = await Api(`/api/search/albums?query=${search}`);
      if (res.data.data.results[0]) {
        set({ albums: res.data.data.results });
      } else set({ albums: false });
    } catch (error) {}
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
  isPlaying:false,
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
  setIsPlaying:(prop)=> set({isPlaying:prop}),
}));
