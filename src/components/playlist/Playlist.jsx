import React, { useEffect, useState } from "react";
import { db , app } from "../../Auth/firebase";
import { addDoc,collection,getDocs,doc } from "firebase/firestore";
import { Dialog, DialogContent, DialogTitle } from "../ui/dialog";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { getAuth } from "firebase/auth";
export default function Playlist() {
  const user = getAuth(app)?.currentUser
  const [isDialog, setIsDialog] = useState(false);
  const [input,setInput] = useState(null)
  const [data,setData]=useState([])
  async function handleSubmit (e) {
    e.preventDefault()
    
      const collectionRef = collection(db,"users",user?.uid,"playlists")
      addDoc(collectionRef,{
        name:input,
      })
  }
console.log(data)
  useEffect( ()=>{

  async  function getData () { 
    const docRef = collection(db,"users",user?.uid,"playlists")
    const docSnap = await getDocs(docRef)
    if(docSnap){
      docSnap.forEach((e)=>{
        setData((data)=>[...data,e.data()])
      })
    }
  }
  getData()
  },[])
console.log(data)
  return (
    <>
    <h1 className="text-3xl border-b-2 p-2">Playlist</h1>
      <Dialog open={isDialog} onOpenChange={setIsDialog}>
        <DialogContent>
          <DialogTitle>Name is needed to create Playlist</DialogTitle>
          <form onSubmit={handleSubmit}>
            <Input type="text" placeholder="Enter the name of playlist" onChange={(e)=>(setInput(e.target.value))} />
            <Button type="submit">Submit</Button>
          </form>
        </DialogContent>
      </Dialog>
      <div className="flex flex-col">
        {data.map((list)=>
         <div className="p-2 rounded-lg  w-full hover:bg-secondary">{list.name}</div>
        )}
      </div>
      <div className="flex justify-center ">
      <Button  onClick={()=>{setIsDialog(true)}}>Add playlist</Button>
      </div>
    </>
  );
}
