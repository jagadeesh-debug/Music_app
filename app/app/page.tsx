"use client"

import goBackendApi from "@/api/gobackend";
import { useEffect } from "react";

const fetchSuggestions = async ()=> {
  const res = await goBackendApi.get("/homesuggestion?query=trend")
  return res.data
}

const Page = () => {
  useEffect(()=>{
    console.log(fetchSuggestions())
  },[])
  return <div>Hello World</div>;
};

const Card = ()=>{
  return <div>Card</div>
}

export default Page;