import { create } from "zustand";
import Api from "../Api";
export const useFetch = create((set)=>({
    songs:null,
    albums:null,
    artists:null,
    fetchSongs: async (search) =>{
        try{
            const res = await Api(`/api/search/songs?query=${search}`)
            set({songs:res.data.data.results})
        } catch(error){}
    },
    fetchAlbums: async(search) =>{
        try{
            const res = await Api(`/api/search/albums?query=${search}`)
            set({albums:res.data.data.results})
        }catch(error){}
    },
    fetchArtists: async (search) =>{
        const res = await Api(`/api/search/artists?query=${search||"top artists"} `)
            set({artists:res.data.data.results})
    } 
}))

export const useStore = create((set)=>({
    musicId:null,
    setMusicId: (id)=> set({musicId:id}),
    isUser:false,
    setIsUser: (prop)=> set({isUser:prop})
}))
