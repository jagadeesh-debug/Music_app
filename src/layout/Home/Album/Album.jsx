import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import Api from '../../../Api'
export default function Album() {
  const [data,setData]= useState()
  const url = useLocation()
  useEffect(()=>{
    const albumId = url.search.split('=')[1];
    const fetching = async () => {
      console.log(albumId)
      try{
        const res = await Api(`/api/albums/${albumId}`)
        setData(res.data.data)
        console.log(res)
      } catch(error){
        console.log(error)
      }
    }
    fetching()
  },[url])
console.log(data)
  return (
    <div>
      
    </div>
  )
}
