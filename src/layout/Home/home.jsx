import React from 'react'
import RandomArtists from './Artist/artists'
import { useNavigate } from 'react-router-dom'
import search from './search/Search'
export default function home() {
    const navigate = useNavigate()
  return (
    <div>
        <button className='text-4xl' onClick={()=>{navigate('/search')}}  >Search</button>
      <RandomArtists/>
    </div>
  )
}
