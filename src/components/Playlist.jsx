import React, { useState } from "react";
// import { db } from "../Auth/firebase";
import { doc, setDoc } from "firebase/firestore";
import { Dialog, DialogContent, DialogTitle } from "./ui/dialog";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
export default function Playlist() {
  const [isDialog, setIsDialog] = useState(false);
  const [input,setInput] = useState(null)
  async function handleSubmit (e) {
    e.preventDefault()
      await setDoc(doc(db))
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
    </>
  );
}
