import React, { useEffect, useState } from 'react'
import { Play, Plus, MoreHorizontal, Clock } from 'lucide-react';
import { useLocation } from 'react-router-dom'
import Api from '../../../Api'


export default function Album() {
  const [albumData,setAlbumData] = useState(null)
  const url = useLocation()
  const albumId = url?.search.split('=')[1];
  const [songs,setSongs]= useState(null)
  useEffect(()=>{
    const fetching = async () => {
      try{
        const res = await Api(`/api/albums?id=${albumId}`)
        setAlbumData(res.data.data)
        setSongs(res.data.data.songs)
      } catch(error){
        console.log(error)
      }
    }
    fetching()
  },[albumId])
console.log(albumData)
  return (
    <div className="bg-gradient-to-b from-gray-800 to-gray-900 text-white p-8 font-sans">
    <div className="flex items-start space-x-6 mb-8">
      <img src={albumData?.image[2].url} alt="Album cover" className="w-48 h-48 rounded-lg shadow-lg" />
      <div>
        <p className="text-sm mb-2">Single</p>
        <h1 className="text-7xl font-bold mb-4">{albumData?.name}</h1>
        <p className="text-sm">{albumData?.description}</p>
      </div>
    </div>
    
    <div className="flex items-center space-x-4 mb-8">
      <button className="bg-white text-black rounded-full p-3">
        <Play size={24} />
      </button>
      <button className="border border-gray-400 rounded-full p-2">
        <Plus size={20} />
      </button>
      <button className="text-gray-400">
        <MoreHorizontal size={24} />
      </button>
    </div>
    
    <table className="w-full">
      <thead>
        <tr className="border-b border-gray-700 text-gray-400 text-sm">
          <th className="text-left pb-2">#</th>
          <th className="text-left pb-2">Title</th>
          <th className="text-right pb-2"><Clock size={16} /></th>
        </tr>
      </thead>
      <tbody>
        {songs?.map((song,index) => (
          <tr key={index} className="hover:bg-gray-800">
            <td className="py-3">{index+1}</td>
            <td>
              <p className="font-medium">{song.name}</p>
            </td>
            <td className="text-right text-sm text-gray-400">{song.duration}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
  )
}
