import React, { useEffect, useRef, useState } from "react";
import { db, app } from "../../Auth/firebase";
import { addDoc, collection } from "firebase/firestore";
import { Dialog, DialogContent, DialogTitle } from "../ui/dialog";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { getAuth } from "firebase/auth";
import { useStore } from "../../zustand/store";
import { fetchFireStore } from "../../Api";
import {ScrollArea} from "../ui/scroll-area"
export default function Playlist() {
  const user = getAuth(app)?.currentUser;
  const [isDialog, setIsDialog] = useState(false);
  const input = useRef(null);
  const { playlist, setPlaylist,emptyPlaylist } = useStore();
  async function handleSubmit(e) {
    e.preventDefault();
    setIsDialog(false);
    const collectionRef = collection(db, "users", user?.uid, "playlists");
    addDoc(collectionRef, {
      name: input.current.value,
    });
    setPlaylist({id:null,data:{name:input.current.value}})
  }
  useEffect(() => {
    emptyPlaylist()
    fetchFireStore(setPlaylist);
  }, []);
  return (
    <>
      <h1 className="text-3xl border-b-2 p-2">Playlist</h1>
      <Dialog open={isDialog} onOpenChange={setIsDialog}>
        <DialogContent>
          <DialogTitle>Name is needed to create Playlist</DialogTitle>
          <form onSubmit={handleSubmit}>
            <Input
              type="text"
              placeholder="Enter the name of playlist"
              ref={input}
            />
            <Button type="submit">Submit</Button>
          </form>
        </DialogContent>
      </Dialog>
      <ScrollArea className="flex flex-col h-64">
        {playlist.map((list) => (
          <div
            key={list.id}
            className="p-2 rounded-lg  w-full hover:bg-secondary"
          >
            {list.data.name}
          </div>
        ))}
      </ScrollArea>
      <div className="flex justify-center ">
        <Button
          onClick={() => {
            setIsDialog(true);
          }}
        >
          Add playlist
        </Button>
      </div>
    </>
  );
}
