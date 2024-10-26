import React, { useEffect, useState } from "react";
import { db , app } from "../../Auth/firebase";
import { addDoc,collection } from "firebase/firestore";
import { Dialog, DialogContent, DialogTitle } from "../ui/dialog";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { getAuth } from "firebase/auth";
export default function Playlist() {
  const user = getAuth(app)?.currentUser
  const [isDialog, setIsDialog] = useState(false);
  const [input,setInput] = useState(null)
  async function handleSubmit (e) {
    e.preventDefault()
      const collectionRef = collection(db,"users",user.uid,"playlists",input);
      
  }

  return (
    <>
      <Dialog open={isDialog} onOpenChange={setIsDialog}>
        <DialogContent>
          <DialogTitle>Name is needed to create Playlist</DialogTitle>
          <form onSubmit={handleSubmit}>
            <Input type="text" placeholder="Enter the name of playlist" onChange={(e)=>(setInput(e.target.value))} />
            <Button type="submit">Submit</Button>
          </form>
        </DialogContent>
      </Dialog>
      <Button>Add playlist</Button>
    </>
  );
}
